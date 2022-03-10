---
post_title: Building an Emergency Circuit Breaker with AWS WAF
post_author: Matthew Zhao
post_author_avatar: matthew.png
date: '2022-03-09'
post_image: blog-aws-waf-main.png
post_excerpt:  This blog will explore an easier way to deal with may requests by creating a big red button using AWS WAF (web application firewall)
post_slug: emergency-circuit-breaker-aws-waf
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-aws-waf-main.png
---

A rogue tenant who is sending a significant amount of requests to the system will ruin everyone else's experience in your multi-tenant SaaS. It can be excruciating to try and recover your system while all your other customers cannot access their resources, and you destroy your [SLA](https://sre.google/sre-book/service-level-objectives/). This blog will explore an easier way to deal with this by creating a big red button using AWS WAF (web application firewall).
 
## Architecture
 
In this article, we can assume that the multi-tenant SaaS is running a traditional 3 tier architecture.
 
At the presentation layer: We can assume it is a ReactJS application running in S3 and served with CloudFront.
 
At the application layer, we can assume it's an autoscaled fleet of ECS tasks running a NodeJS Express API in Fargate mode. This fleet will be fronted with an AWS Application Load Balancer.
 
At the database layer, we can assume it's a Amazon DynamoDB table.
 
![Emergency Circuit Breaker with AWS](circuit-breaker-aws.png "Emergency Circuit Breaker with AWS")
 
## Let’s plan a solution!
 
### What is a WAF?
 
WAFs are software that analyze traffic to decide if they should be let through based on certain criterias, usually at the HTTP layer. This [article](https://www.cloudflare.com/learning/ddos/glossary/web-application-firewall-waf/]) by Cloudflare explains it well.
 
### How does it work?
 
AWS' implementations of WAF are attached to data ingress infrastructure to analyze their traffic, like ALB, CloudFront, or AWS API gateway. After attachment, you can configure rules on the WAF and it will match all traffic to decide if the specific request should be blocked. Generally, you can write rules that regex-match within the request and it's body, or you can match based on origin via matching the origin IP.
 
### Why are we adding it?
 
To filter out specific tenants from your SaaS, you need to have filtering infrastructure that can process all requests with minimal Latency. In our specific usecase, we also prefer our infrastructure to require as little self managed infrastructure as possible. Which is exactly what AWS WAF shines at.
 
## Adding a WAF
![Emergency Circuit Breaker with AWS WAF](circuit-breaker-aws-waf.png "Emergency Circuit Breaker with AWS WAF")
 
### Adding a WAF via NodeJS using the AWS SDK
 
To add a WAF, you must deploy a new WAF element via AWS, and create an IP set. Here’s what it would look like in the AWS SDK:
 
```typescript
declare const lbArn: string;
const ipset = await wafSdk
 .createIPSet({
   Name: "blocked-ips",
   IPAddressVersion: "IPV4",
   Scope: "REGIONAL",
   Addresses: [],
 })
 .promise();
 
const waf = await wafSdk
 .createWebACL({
   Name: "saas-waf",
   Scope: "REGIONAL",
   DefaultAction: { Allow: {} },
   VisibilityConfig: {
     CloudWatchMetricsEnabled: true,
     SampledRequestsEnabled: true,
     MetricName: "saas-waf-metrics",
   },
   Rules: [
     {
       Name: "DisableIPRule",
       Priority: 0,
       Statement: {
         IPSetReferenceStatement: {
           ARN: ipset.ARN as string,
         },
       },
       Action: {
         Block: {},
       },
       VisibilityConfig: {
         CloudWatchMetricsEnabled: true,
         SampledRequestsEnabled: true,
         MetricName: `saas-rule-metrics`,
       },
     },
   ],
 })
 .promise();
```
 
### Or using AWS CDK...
 
```typescript
export default class ApplicationLayerStack extends cdk.Stack {
 constructor(scope: cdk.Contruct, id: string, props?: cdk.Props) {
   declare const lbArn: string;
   const cfnIPSet = new wafv2.CfnIPSet(this, "blocked-ips", {
     addresses: [],
     ipAddressVersion: "IPV4",
     scope: "REGIONAL",
   });
 
   const waf = new wafv2.CfnWebACL(this, "MyCfnWebACL", {
     defaultAction: {
       allow: {},
     },
     scope: "REGIONAL",
     visibilityConfig: {
       cloudWatchMetricsEnabled: false,
       metricName: "saas-waf-metrics",
       sampledRequestsEnabled: false,
     },
     rules: [
       {
         name: "block-ips",
         priority: 123,
         statement: {
           ipSetReferenceStatement: {
             arn: cfnIPSet.arn,
           },
         },
       },
     ],
   });
 }
}
```
 
## Scenarios
 
There are two scenarios that we can block with AWS WAF:
 
- Tenant-based blocking: We can block customers by their tenant ID within requests. At Fusebit, we use the `/account/acc-1234/subscription/sub-5678` schema within the URL to separate customer tenants. For example, an integration would live under `https://api.us-west-1.on.fusebit.io/account/acc-55555555/subscription/sub-44444444/integration/multi-tenant-int/`.  This allows us to block a tenant by excluding endpoints that contain a specific account or subscription ID.
 
- IP/Subnet-based blocking: We can also block customers by their request origin’s IP/subnet range.
 
## Blocking Based on Tenant ID
 
AWS WAF implements an inline regex capability. We can use this capability to block tenants. Regex filters will block a request if parts of the request match the regex. Therefore, we can be effective with tenant blocking by simply doing a fuzzy match on their account id. Let's say our account id is `acc-5555555`. The regex would then look like `^.*/account/acc-55555555.*$`. Then we can add a new rule with the following code:
 
```typescript
const regex = `^.*/account/acc-55555555.*$`;
const wafSdk = new AWS.WAFV2();
 
const rules = waf.WAF.Rules as WAFV2.Rules;
rules.push({
 Name: uuidv4(),
 // Priority is randomized because you can only have 1 priority per rule and with automation, it’s easier to just choose a random priority
 Priority: Math.floor(Math.random() * 999),
 Statement: {
   RegexMatchStatement: {
     RegexString: regex,
     FieldToMatch: { UriPath: {} },
     TextTransformations: [{ Priority: 0, Type: "NONE" }],
   },
 },
 Action: { Block: {} },
 VisibilityConfig: {
   CloudWatchMetricsEnabled: false,
   SampledRequestsEnabled: false,
   MetricName: uuidv4(),
 },
});
 
await wafSdk
 .updateWebACL({
   Name: waf.Name,
   LockToken: waf.LockToken,
   DefaultAction: waf.DefaultAction,
   Rules: rules,
   Scope: "REGIONAL",
   Id: waf.Id,
   VisibilityConfig: waf.VisibilityConfig,
 })
 .promise();
```
 
### Downside
 
A significant downside of this design is each rule attached to a WAF costs $1 a month, which can add up to quite a lot. If you plan to use regex filters for more than an emergency circuit breaker, you might want to consider using [regex rulesets](https://docs.aws.amazon.com/waf/latest/developerguide/waf-regex-pattern-set-creating.html).
 
The reason we chose to use inline filters is because it is cheaper to use at lower volumes. Three WCUs (web ACL capacity units) compared to 25 WCUs is used with inline regex. It is also easier to implement as you can simply add new regex filters by adding another rule, instead of maintaining regex rulesets.
 
## Blocking Based on IP Range
 
Another option to block malicious customers is to use IP-based blocks. It is generally helpful if an endpoint is spamming your systems through more than one tenant. To stop a IP range, use the following code:
 
```typescript
const ip = "1.1.1.1";
const wafSdk = new AWS.WAFV2();
 
await wafSdk
 .updateIPSet({
   Scope: "REGIONAL",
   Name: ipset.IPSet?.Name,
   Id: ipset.IPSet?.Id,
   Addresses: [...ipset.IPSet?.Addresses, ip],
   LockToken: ipset.LockToken,
 })
 .promise();
```
 
### Downside
 
Many malicious actors own more than one IP and can quickly obtain new ones. To track malicious actors sending bad requests across the system from many IPs, you must set up a [SIEM](https://www.ibm.com/topics/siem) system to connect to the WAF.
 
## Before you go...

At Fusebit, we implement all this for you, check [us](https://fusebit.io) out! and follow us on Twitter[https://twitter.com/fusebitio]!
