---
post_title: Supporting Web Workers API in Node.js vs Just Using Deno 
post_author: Shehzad Akbar
post_author_avatar: shehzad.png
date: '2022-07-07'
post_image: blog-webworkers.png
post_excerpt: Does adding Web Workers API support to Node.js make sense given it already has Worker Threads? Or is it really only required now because it’s also “available in Deno"?
post_slug: webworkers
tags: ['post', 'developer tools', 'node.js', 'deno']
post_date_in_url: false
post_og_image: ‘hero’
posts_related: ['node-18-release','promise-performance-node','web-frameworks-plugins-architecture-overview']
---

Deno’s secure, fast & lightweight approach coupled with features like native TypeScript support and [near-perfect compatibility with Web API](https://deno.land/manual/runtime/web_platform_apis) make it a really attractive option for web developers. So it’s no surprise that the Node.js community is looking over their shoulder as Deno grows in popularity. 

Here at Fusebit, we’re big fans of Node.js and have been following its product roadmap closely. In recent releases, Node.js has added support to Core for [Web Streams](https://www.jasnell.me/posts/webstreams), [Fetch](https://fusebit.io/blog/node-fetch/), a [Built-in Test Runner](https://fusebit.io/blog/node-testing-comes-to-core/), and [Direct Imports](https://fusebit.io/blog/nodejs-https-imports/), these are all features that are available out of box in Deno.

So we weren’t really surprised to see another ‘already in Deno’ feature request come up. This time, it’s a request to add [support for Web Workers](https://github.com/nodejs/node/issues/43583) - an API that allows browsers to run cpu-intensive operations on background threads. 

Node.js already provides support for this in the form of [Worker Threads](https://nodejs.org/api/worker_threads.html), but because it’s a different implementation than the browser API, developers have to put in workarounds to make it compatible.

The question is: would adding Web Workers support really add a ton of value for Node.js developers? Or is it required now as table stakes because it’s “available in Deno"?

Let’s understand the context of Node.js’s Worker Threads architecture and how it differs from Web Workers before we answer that question.

##  Why Are Worker Threads Implemented Differently Than the Web Workers API?

[Anna Henningsen](https://twitter.com/addaleax), the architect behind Worker Threads, started development on this in 2018 with the primary goal of adding multi-threading support to Node.js within the [context of the needs](https://github.com/nodejs/worker/issues/1) of it's developers, not necessarily to be compatible with Web Worker API in the browser.

At the time, some of the use cases talked about included:

* Improving concurrency for items such as parsing & generating large JSON / CSVs
* Better management of computationally intensive operations such as Compilation, Linting, Large Dataset Analysis, Multi-Process Data Sharing etc.
* Keeping the main thread responsive to prevent incoming requests from being blocked

At it’s core, Worker Threads functionality was designed to solve for server-side use cases, which is precisely what Node.js is designed for. 

Of course, browsers also have similar use cases, but the applications are different. For instance, the Web Workers API is instrumental in the following situations:

* Improve response time and performance for browser-based games (powered by HTML5)
* Power high-quality image rendering i.e. 3D Graphics Ray Tracing, or HTML5 Canvas drawing
* Large I/O operations (Polling websites, Large Component Rendering)

Additionally, consider that Web Workers isn’t a JavaScript feature, it’s a browser feature that can be accessed through JavaScript code -  that means it’s more expansive and general-purpose by design. 

So, it’s clear that while ‘multi-threading’ is a common need, the actual use-cases are different. Why then is there a conversation around adding full Web Workers support to Node.js now? 

> “Deno supports Web Workers, so Node.js should too!” - Internet

## The Case for Web Workers in Node.js

Aside from server-side applications, there is a growing population of developers building client-side applications powered by Node.js. This could be for a variety of different reasons:

* They’ve already built the app in Node.js and want to offer it online
* There’s reliance on a specific npm module as a dependency
* The app is powered by specific Node.js APIs like streams, events, etc.

However, there’s a lot of overhead to support these apps in the browser, especially if they leverage multi-threading to really power the experience. 

You’d have to use a polyfill library (e.g. [threads](https://threads.js.org/), [web-worker](https://github.com/developit/web-worker), etc.) or write your own implementation - i.e. more code, more bloat, and more points of failure. Not to mention having to ramp up on two different APIs and dealing with the different constraints & limitations of each.

Having direct compatibility with the Web Workers API would vastly improve the experience of building apps that sit in the browser, it would mean having to manage less code and dependencies. 

It would also mean that the Node.js platform, along with the recent additions (Fetch, Web Streams, etc.) would move closer towards greater compatibility with the Web API in general. Coupled with it’s formidable army of NPM packages, massive community, and existing enterprise grade Node.js applications, it would almost certainly unlock an entirely new wave of innovations that would give Deno a run for it’s money.

So, should Web Workers be added to Node or should developers just switch over to Deno and make their lives easier? The answer is more nuanced and really depends on how embedded you already are in Node.js.

## Conclusion

Worker Threads is a powerful feature that is purpose-built for Node.js needs (i.e. large server-side operations) - and [does a really good job](https://github.com/nodejs/worker/issues/6) of it as well. An implentation of the Web Workers API, similar to Deno’s approach, would allow developers to spend less time porting their apps to be compatible with browsers and more time focusing on their core app development instead.

What are your thoughts on this? If this is something that resonates with you, and you feel strongly about adding Web Workers support to Node.js Core (or not), [head on over to the Github issue](https://github.com/nodejs/node/issues/43583) and add your thoughts to the discussion! 

If you have any questions, you can reach out to me directly through our [community Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg), on [Twitter](https://twitter.com/shehzadakbar) and at [shehzad@fusebit.io](mailto:shehzad@fusebit.io). If you want more Node.js developer posts, follow [@fusebitio](https://twitter.com/fusebitio) on Twitter.