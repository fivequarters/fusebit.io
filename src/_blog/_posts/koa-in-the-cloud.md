---
post_title: Koa in the Cloud
post_author: Liz Parody
post_author_avatar: liz.png
date: '2021-10-27'
post_image: blog-koa-main.jpg
post_excerpt: In this post you can learn how to run Koa on AWS Lambda and the differences with Express.
post_slug: koa-in-the-cloud
tags: ['post','serverless']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-koa-social-card.png
---

# Express or Koa? 

Most developers using Node.js are using frameworks to improve productivity, scalability, and speed of application development, facilitate quick prototyping, and automate processes with the help of libraries, templates, and reusable components.

Two of the most popular frameworks are Express and Koa. 

[Express](https://expressjs.com/) is a widely used and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It is quick and easy to create a robust API with many HTTP utility methods and middleware available.

[Koa](https://koajs.com/) is a new web framework designed by the team behind Express, which aims to be a smaller, more expressive, and a more robust foundation for web applications and APIs. By leveraging async functions, Koa allows you to ditch callbacks and significantly improve the experience of error handling. Koa does not bundle any middleware within its core, and it provides an elegant suite of methods that make writing servers fast and enjoyable for developers.

Even though Express has been called the de facto standard server framework for Node.js and it's the most popular one with [18 million weekly downloads](https://www.npmjs.com/package/express), Koa is rapidly growing in popularity with [1.2 million weekly downloads](https://www.npmjs.com/package/koa) because it's lightweight, has great user experience and [superior performance](https://www.fastify.io/benchmarks/) (37K req/sec vs. 10K req/sec of Express).
![Benchmark Koa and Express](blog-performance-koa-express.png "Benchmark Koa and Express")

## Why Use Serverless? 
Serverless is a cloud execution model that enables a more straightforward, cost-effective way to build and operate cloud-native applications. The application owner does not purchase, rent, manage, or provision the servers in this cloud architecture. Instead, the cloud provider manages the infrastructure side of things for the applications.

Despite the name, serverless apps do not run without servers 😂. It means that businesses don't need to manage the server-side of the equation and operational concerns, and instead focus on development.

The most significant advantage of this architecture is that the provisioning of servers is done dynamically to meet the real-time computing demand. That is, you pay only for what you use. The same could be said about running monolithic applications on VMs behind an Auto Scaling Group, which was available for years before serverless. The key change in serverless is also the change in the scope of the unit of deployment, from a monolithic app to a single function. 
# Running Express on AWS Lambda

The following code is a basic example of an Express application:

```
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/info', (req, res) => {
  res.send({ application: 'sample-app', version: '1.0' });
});
app.post('/api/v1/getback', (req, res) => {
  res.send({ ...req.body });
});

app.listen(3000, () => console.log(`Listening on port: 3000`));
```

The example above exposes two API's:
GET /api/info returns information about the current API
POST /api/v1/getback returns the request body whatever we sent

To convert this express app to make it ready to run on Lambda environment, you can install [serverless-http](https://www.npmjs.com/package/serverless-http) and add two lines of code:


`const serverless = require('serverless-http');` to import the module that allows you to 'wrap' your API for serverless use
`module.exports.handler = serverless(app);` to export the module and make it  ready to deploy on the Lambda environment

Now your example app will look like this:
```
const serverless = require('serverless-http');
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/info', (req, res) => {
  res.send({ application: 'sample-app', version: '1' });
});

app.post('/api/v1/getback', (req, res) => {
  res.send({ ...req.body });
});
//app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);
```
Finally, to deploy the application on AWS Lambda, you can install the [serverless framework](https://www.npmjs.com/package/serverless) that allows you to do the heavy-lifting of deploying a serverless app, instead of manually using an API Gateway and AWS Lambda, because it can be a tedious job.

# Running Koa on AWS Lambda

Here is how the same express code looks like in Koa:

```
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router
  .get('/api/info', (ctx) => {
    ctx.body = { application: 'sample-app', version: '1' };
  })
  .get('/api/v1/getback', (ctx) => {
    const requestBody = ctx.request;
    ctx.body = requestBody;
  });

app.use(router.routes())
   .use(router.allowedMethods());

app.listen(3000, () => console.log(`Listening on port: 3000`));
```

Notice that the request object is part of the Context object in `ctx.request`, also notice that Koa doesn't include a router, so you need to install [Koa Router package](https://www.npmjs.com/package/koa-router). 

One of the main differences between Express.js and Koa.js is the [`Koa Context`](https://koajs.com/#context) which encapsulates node's request and response objects into a single object which provides many helpful methods for writing web applications and APIs.

In other words, instead of using request `req` and response `res` you can use context `ctx` which contains both objects.

A context is created per request and is referenced in middleware as the receiver, or the `ctx` identifier, as shown in the following snippet:


```
app.use(async ctx => {
  ctx; // is the Context
  ctx.request; // is a Koa Request
  ctx.response; // is a Koa Response
});
```

Many of the context's accessors and methods delegate to their `ctx.request` or `ctx.response` equivalents for convenience, and are otherwise identical. For example `ctx.type` and `ctx.length` delegate to the response object, and `ctx.path` and `ctx.method` delegate to the request.

Now, to convert this example to make it ready to run in the Lambda environment, we can use the same package, [serverless framework](https://www.npmjs.com/package/serverless-http) that also supports Koa, allowing us to achieve the same result for lambda functions:


```
const Koa = require('koa');
const Router = require('koa-router');
const serverless = require('serverless-http');

const app = new Koa();
const router = new Router();

router
  .get('/api/info', (ctx) => {
    ctx.body = { application: 'sample-app', version: '1' };
  })
  .get('/api/v1/getback', (ctx) => {
    const requestBody = ctx.request
    ctx.body = requestBody;
  });

app.use(router.routes())
   .use(router.allowedMethods());

module.exports.handler = serverless(app);
```

Now your Koa app will be ready to run in a serverless environment. 

## Before you go…
If you want to build awesome integrations for your application without the hassle, visit [fusebit.io](https://fusebit.io/). Fusebit is written using Node.js and Koa, and our code-first integration platform and SaaS connectors remove the headaches of dealing with different APIs and eliminate the operational burden when running at scale.
