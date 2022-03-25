---
post_title: Running Multi-Tenant Grafana, Tempo, and Loki on AWS at Scale
post_author: Matthew Zhao
post_author_avatar: matthew.png
date: '2022-03-25'
post_image: blog-grafana-tempo-loki-aws.png
post_excerpt: This blog will detail how we run the infrastructure for the Grafana Loki Tempo (GLT) stack at Fusebit.
post_slug: grafana-tempo-loki-aws-at-scale
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-grafana-tempo-loki-aws.png
---

At Fusebit. we utilize [Grafana](https://grafana.com/oss/grafana/), [Loki](https://grafana.com/oss/loki/), and [Tempo](https://grafana.com/oss/tempo/) (referred to as the GLT stack) to run customer-facing analytics. As we expect thousands of customers to use it daily, we need to operate the GLT stack as a highly available multi-tenant platform. On the client-side, we [detailed the implementation of our ReactJS app](https://fusebit.io/blog/grafana-in-react/), but an implementation without infrastructure is useless. This blog will detail how we run the infrastructure for the GLT stack.

## Requirements

There are a couple of non-negotiable requirements when designing the infrastructure.

- **Scale** - We want the ability to scale further than the monolithic “one instance” design that is simplest to deploy.
- **Uptime** - As this is a customer-facing product, we require uptime to be near perfect.
- **Simplicity** - Fusebit has a minimal operations team. Thus we want to have as little operational overhead as possible. The traditional deployment option for GLT at scale is to utilize Kubernetes, which is a technology we want to avoid for now to reduce complexity.
- **Ease of deployment** - as mentioned above, we have a minimal operations team. Thus, we want to reduce the pain during version rollouts.

## Architecture

There are five key elements necessary: compute for running the GLT stack, shared storage for storing traces and logs, service discovery to be able to share in-memory state, traffic management of the application and request forwarding, and, finally, health monitoring to understand the health of the system.
![GLT Architecture](architecture-grafana-loki-tempo.png "GLT architecture")

### Compute

For the compute layer, we settled on using fleets of EC2 instances running `docker-compose` to run the GLT stack, similar to how we showed it in the [blue green blog](https://fusebit.io/blog/blue-green-deployments-AWS/).

### Storage

The storage requirements of GLT are relatively simple. Loki and Tempo rely on block storage, so the obvious choice is S3. Grafana requires a SQL database. Because we already have RDS lying around for a separate system, we just used [AWS RDS Serverless v1 for Postgres](https://aws.amazon.com/rds/aurora/serverless/).

Utilizing EC2 IAM-based credentials with Tempo and Loki is slightly painful. The configuration for Tempo looks like this.

Tempo:

```yaml
storage:
  trace:
    backend: s3
    s3:
      bucket: test-fb-tempo-storage
      endpoint: s3.us-west-2.amazonaws.com
      forcepathstyle: true
    block:
      bloom_filter_false_positive: .05
      index_downsample_bytes: 1000
      encoding: zstd
    wal:
      path: /tmp/tempo/wal
      encoding: snappy
    local:
      path: /tmp/tempo/blocks
    pool:
      max_workers: 100
      queue_depth: 10000
```

And for Loki:

```yaml
storage_config:
  boltdb_shipper:
    active_index_directory: /loki/boltdb-shipper-active
    cache_location: /loki/boltdb-shipper-cache
    cache_ttl: 24h
    shared_store: s3
  aws:
    s3: s3://test-fb-loki-storage
    s3forcepathstyle: true
    region: us-west-2
```

Credentials are provided automatically through the IAM Role the EC2 instance is executing within.

### Discovery

The system discovery layer is slightly more complex.

Each node running the GLT stack needs to know the IP address of each other. Usually when deploying GLT in kubernetes (their recommended official way of deployment), you would use something called [headless services](https://kubernetes.io/docs/concepts/services-networking/service/#headless-services), in which IP address of each registered node will be simultaneously returned during a DNS query as a multi-value answer.

Sadly, AWS does not support native service discovery like Kubernetes with EC2 instances, at least not easily.

For reasons that will be discussed below, we ended up choosing [AWS CloudMap](https://aws.amazon.com/cloud-map/), which is backed by an AWS Route53 Private Zone that is able to return multi-value answers for discovery DNS queries. We also utilize a special tag on each instance registered within CloudMap to determine the fleet of instances it's residing in, named `STACK_ID`.

To register instances with CloudMap, there are a couple options:

| Solution                                              | Upside                                                                                                         | Downside                                                                                                                                     |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Lambda-based polling against EC2 ListInstance API     | It's able to fetch the latest instances from the EC2 API, making the data near real-time                       | Additional infrastructure is required with Lambda and EventBridge                                                                            |
| Registration during the creation of autoscaling group | It's simple as you can directly register within the cli tooling                                                | Won't work during self healthing and autoscale events                                                                                        |
| Registration during instance boot-up                  | It does not require additional infrastructure, and it will behave properly during instance self healing events | CloudMap data can become stale while autoscaling events occur, and it will require additional permission to be attached to the EC2 instances |

Looking at the options, registration during instance boot-up would be the best option for now. We achieve this by injecting a script into user-data that calls the registerInstance API call during user-data execution.

The script looks something like this:

```javascript
const fs = require("fs");
const AWS = require("aws-sdk");

(async () => {
  const serviceId = process.env.SERVICE_ID;
  const stackId = process.env.STACK_ID;
  const discoverySdk = new AWS.ServiceDiscovery({ region: process.env.REGION });
  const instances = await discoverySdk
    .listInstances({ ServiceId: serviceId })
    .promise();
  for (const instance of instances.Instances) {
    if (instance.Attributes.STACK !== stackId) {
      continue;
    }
    await discoverySdk
      .deregisterInstance({ ServiceId: serviceId, InstanceId: instance.Id })
      .promise();
  }
  const ip = process.env.SYSTEM_IP_ADDR;
  const instanceId = process.env.SYSTEM_INSTANCE_ID;
  await discoverySdk
    .registerInstance({
      ServiceId: serviceId,
      InstanceId: instanceId,
      Attributes: { AWS_INSTANCE_IPV4: ip, STACK: stackId },
    })
    .promise();
})();
```

With this script, you need to populate a couple of variables.

- `SERVICE_ID`: This is the service id of the CloudMap instance, populate this either via manual discovery or set it within the user-data script.
- `STACK_ID`: that is an optional attribute that we use to define the id of the fleet this instance is within, populate it via manual discovery or within the user-data script.
- `SYSTEM_IP_ADDR`: the private IP address of the instance, present within the instance metadata. Within IMDSv1, run this:

```bash
curl http://169.254.169.254/latest/meta-data/local-ipv4
```

- `SYSTEM_INSTANCE_ID`: the instance's id, present within the instance metadata. Within IMDSv1, run this:

```bash
curl http://169.254.169.254/latest/meta-data/instance-id
```

**Note:** Injecting script in user-data would not work well if you plan to recycle instances. If that is a requirement, consider using systemd to register instances on bootup.

To make Loki and Tempo utilize the DNS based discovery setup, we can utilize [the service discovery DNS format](https://cortexmetrics.io/docs/configuration/arguments/#dns-service-discovery) to make Loki and Tempo query DNS to find all join_members via a multi value DNS query. A sample configuration looks like this for Tempo:

```yaml
memberlist:
 abort_if_cluster_join_fails: false
 bind_port: 7946
 join_members:
   - placeholder.fusebit.internal:7946
```

And for Loki:

```yaml
memberlist:
 abort_if_cluster_join_fails: false
 bind_port: 7946
 join_members:
   - placeholder.fusebit.internal:7946
```

The most simple form of traffic management is to utilize CloudMap directly, however, we need to be able to health check backing instances to be able to self heal when necessary. CloudMap in theory supports health-checks. Unfortunately, those require underlying Route53 checks that are not available to non-public facing instances. Therefore, we need to involve a load balancer to do HTTP or TCP based health-checks, in our case, NLB.

One of the complexities with using NLB was with how NLB interacts with Security Groups.

With ALBs, you can attach security groups to the load balancers directly, allowing the [principle of least privilege](https://www.cisa.gov/uscert/bsi/articles/knowledge/principles/least-privilege) to make sure only specific infrastructure can access the ingress endpoints. With NLB, you can't attach security groups against it, nor can you determine the traffic source via a different security group. Because the system is being autoscaled, it also isn't practical to manually whitelist IPs. Therefore we had to allow all traffic from `10.0.0.0/16` (the entire CIDR range of the VPC) to access the EC2 instances running the GLT stack. This poses a security risk if you execute foriegn code within the same VPC. The easiest way to mitigate this has only 2 real options:

  1. Move the execution of foriegn code to another VPC.
  2. Make it so the security group the system that the foriegn code executes within does not have access to anything within the VPC.

**Note:** AWS ALB, on paper, supports the use of gRPC based communication. However, looking at the AWS ALB gRPC support closer, it is limited to HTTP/2 with TLS as the transport layer, which Tempo does not support for gRPC transport.

### Health

Tempo and Loki do not implement a health endpoint, making it difficult to determine the entire system's health and ensure that when Loki and Tempo fail, the failure gets propagated upward toward AWS to trigger self-healing actions. Therefore, we built a small service that pulls health status from downstream systems:

```typescript
import express from "express";
import morgan from "morgan";
import superagent from "superagent";

// Grafana health is built for a containerized environment,
// Therefore, localhost does not point to the machine's IP.
const grafanaEndpoint = process.env.GRAFANA_ENDPOINT || "http://grafana:3000";
const lokiEndpoint = process.env.LOKI_ENDPOINT || "http://loki:3100";
const tempoEndpoint = process.env.TEMPO_ENDPOINT || "http://tempo:3200";

const app = express();
app.use(morgan("combined"));

const getServiceHealth = async (
  endpoint: string,
  acceptableCode: number[],
  serviceName: string
) => {
  try {
    await superagent
      .get(endpoint)
      .ok((res) => acceptableCode.includes(res.statusCode));
  } catch (_) {
    throw Error(`Health check for service ${serviceName} failed.`);
  }
};

app.get("/healthz", async (_, res) => {
  try {
    await Promise.all([
      getServiceHealth(`${grafanaEndpoint}/api/health`, [200], "grafana"),
      // Loki does not implement a health endpoint, this is just a simple check to see if it is responding at all.
      getServiceHealth(`${lokiEndpoint}/`, [404], "loki"),
      // Tempo does not implement a health endpoint, this is just a simple check to see if it is responding at all.
      getServiceHealth(`${tempoEndpoint}/`, [404], "tempo"),
    ]);
    return res.status(200).send("Healthy!");
  } catch (e) {
    console.log(e);
    return res.status(500).send("Unhealthy :(");
  }
});
```

We container this application and added it to the `docker-compose` file. Because this is within `docker-compose`, the endpoint of each service is not `localhost`, but the container's name within the `docker-compose` definition, which is then resolved via internal internalization DNS within docker.

In this health check routine, we attempt to access the tempo endpoint and expect a healthy response of `404`; If you consider this insufficient, you can also expose the low-level `docker.sock` to do low-level status checking against it.

## Before you go...

Come check out how we are using Grafana in the [Fusebit integration platform](https://manage.fusebit.io/signup?utm_source=aws.amazon.com&utm_medium=referral&utm_campaign=grafana-infra-at-scale), and read tutorial [how to embed Grafana into React](https://fusebit.io/blog/grafana-in-react/?utm_source=github.com&utm_medium=referral&utm_campaign=none). If you find this developer content helpful, follow [@fusebitio](https://twitter.com/fusebitio) on Twitter to be notified of our latest articles.
