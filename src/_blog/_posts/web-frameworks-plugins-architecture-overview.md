---
post_title: Plugin Architecture Overview Between Express, Fastify and NestJS
post_author: Rubén Restrepo
post_author_avatar: bencho.png
date: '2022-04-07'
post_image: blog-web-frameworks-plugins-architecture.png
post_excerpt: Learn how the most popular Node.js web frameworks approach extensibility and modularity throughout different plugin patterns.
post_slug: web-frameworks-plugins-architecture-overview
tags: ['post', 'developer tools', 'node.js']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-web-frameworks-plugins-architecture.png
posts_related: ['node-testing-comes-to-core', 'generate-web-assembly-with-typescript', 'crypto-price-tracking-bot']
---

A plugin enables a system to extend its core capabilities by providing a common foundation for developing them; it allows you to build modular, customizable, extensible, and easily maintainable applications.

## Use cases

- Allow third-party developers to extend the core functionality of an application.
- Offer new features that can be opted-in from an application.
- Make your application flexible to be adapted to different use cases.
- Applications or Frameworks offering a plugin system can be a core differentiator and influence its success.
- An application designed to keep its core as small as possible and offer extended functionalities via plugins. [One interesting example of this model is Fastify](​​https://www.fastify.io/docs/latest/Guides/Write-Plugin/)

In this blog post we’re going to review different architectural approaches to plug-ins of some popular Node.js tools such as Fastify, NestJS and ExpressJS.

## How a Plugin works

There are some non-negotiable principles for a plugin system:
- **Keep it simple**: Authoring a plugin should be simple, don’t complicate your plugin system with many configuration files. Favor convention over configuration.
- **Keep it independent**: A plugin should work independently of other plugins, and follow a [low-coupling approach](https://en.wikipedia.org/wiki/Loose_coupling). All the functionality should be encapsulated and prevent side effects to the core system. (e.g., removing a plugin shouldn’t affect the core system or other plugins).

Plugin architectures usually include a plugin manager that has an essential role in managing the plugin's lifecycle; this involves things like plugin registration, validation, and loading.

If you are working with Node.js, You’ve probably already worked with some popular web frameworks, and there is a high chance that you had to install or interact with a plugin from their ecosystem.
 
## Popular Node.js web frameworks plugin architecture overview

Let’s review how the most popular web frameworks of Node.js handle the plugin architecture:
[Fastify](https://www.fastify.io/), [NestJS](https://nestjs.com/) and [ExpressJS](https://expressjs.com/)

### Fastify

A high-performance web framework, being one of the fastest frameworks for Node.js.
The core is a minimalist web framework by design; you will be using their plugin system all the time. 
Everything is a plugin, consisting of a single exported function specified in the register method (part of the Fastify core).

```javascript
module.exports = function (fastify, options, done) {}
``` 
Fastify's approach to building a plugin allows you to extend the functionalities of the Framework by accessing the core system from within the plugin. Let's see it:

- **fastify**: An encapsulated Fastify instance, it’s encapsulated since there are no side effects to the ancestors of the plugin. You can think about it as a sandboxed version of the Fastify instance if you change it.
- **options**: Configuration data for your plugin. For example, if you’re building a plugin that connects to a database, you can use the options to feed your plugin’s configuration.
- **done**: A Callback function telling the Fastify plugin manager that the plugin was loaded and executed successfully.

In Fastify, you add a plugin to the core system using a `register` function

```javascript

const fastify = require('fastify')()
const fp = require('fastify-plugin')

const dbPlugin = require(db-plugin')

function myPlugin (fastify, opts, done) {
  dbClient.connect(opts.url, (err, conn) => {
    done()
  })
}

fastify.register(fp(dbPlugin), { url: 'https://example.com' })
```

Fastify's straightforward approach to plugins works giving a great developer experience, and it's a big part of the framework's success.

### NestJS

NestJS is another popular Node.js web framework that aims to provide scalable server-side applications with an extensible application architecture that allows you to write modular code.

This framework relies heavily on a concept called [Dependency Injection](https://martinfowler.com/articles/injection.html) or DI. A software design pattern that manages your object dependencies differently. It uses a technique called Inversion of Control (IoC). Instead of explicitly knowing how to construct a service, it relies on a service injector that handles all the details about creating the service, known as the DI container; your application only knows how to interact with it via a well-defined interface.

The main advantage of using this pattern is that you can define abstractions that allow you to change a specific service's implementation details without breaking the contract with the consuming client.

NestJS relies on [ES2016 decorators](https://github.com/tc39/proposal-decorators) to specify a service injected with the NestJS IoC Container. These services are known as  [providers](https://docs.nestjs.com/fundamentals/custom-providers). In the end, they’re just functions called during a class definition.

Let’s see an example:

```typescript

import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  findAll(): Cat[] {
    return this.cats;
  }
}
```

Only one specific provider instance is injected, following a singleton pattern. NestJS ensures a single instance is created by caching it. These mechanisms rely on a sophisticated dependency graph for resolving and injecting dependencies.

Providers are used from Controllers, responsible for handling incoming requests and returning responses to the client.

```typescript
@Controller('cats')
export class CatsController {
  // CatsService provider is injected from the constructor.
  constructor(private catsService: CatsService) {}
}
```

A provider is injected to the controller via constructor injection, providers and controllers are added to the IoC Container via @Module:

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

![Web frameworks plugins architecture overview with-shadow](blog-web-frameworks-plugins-architecture-1.jpg 'Web frameworks NestJS plugins architecture overview')

NestJS leverages TypeScript [reflection](https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators)
to [get metadata](https://github.com/nestjs/nest/blob/master/packages/core/scanner.ts#L104) information used by the injector decorator.

If you are curious about this topic, TypeScript uses the [reflect-metadata](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata) npm package to accomplish this.

Using DI has its ups and downs, but we can’t wait to see how we will write Node.js programs using this pattern once decorators are standardized and fully available. 

### Express

Express is one of the most popular web frameworks for Node.js, the way you extend the framework functionality is by using [Middlewares](https://expressjs.com/en/guide/writing-middleware.html)
The concept is similar to Fastify, functions that have access to the request and response objects with a next function to indicate that the middleware has finished processing successfully (identical to the `done` callback from Fastify). The next function runs in the context of an Express router.
A middleware can be added globally or to specific routes. Let’s see an example:

```javascript
const express = require('express')
const app = express()

const loggerPlugin = function (req, res, next) {
  console.log('Logger plugin')
  next()
}

app.use(loggerPlugin)

app.get('/', (req, res) => {
  res.send('Hello World!')
})
```

All requests will log: `Logger plugin`.

A key difference from Fastify is that you don’t have an `options` object to specify configuration values, but you can emulate a similar behavior by creating a configurable middleware:

```javascript
// middleware.js
module.exports = function (options) {
  return function (req, res, next) {
    // Specify any configuration data in the options object
    console.log('Configured url', options.url);
    next()
  }
}
```
Use the middleware with options:

```javascript
const mw = require('./middleware')
app.use(mw({ url: 'http://localhost'}))
```
## To Wrap up

You’ve learned how popular web frameworks define a standard interface for registering plugins and extending their functionality by using third-party plugins or building your own.

Don’t hesitate to reach out if you have any questions or comments. You can also reach out to me directly through our community [Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg) and on [Twitter](https://twitter.com/degrammer).

[Fusebit](https://fusebit.io) is a code-first integration platform that helps developers integrate their applications with external systems and APIs. We used monkey patching ourselves to make our integrations better! To learn more, take [Fusebit for a spin](https://manage.fusebit.io/signup?utm_source=fusebit.io&utm_medium=referral&utm_campaign=blog&utm_content=web-frameworks-plugins-architecture-overview) or look at our [getting started guide](https://developer.fusebit.io/docs/getting-started)!
