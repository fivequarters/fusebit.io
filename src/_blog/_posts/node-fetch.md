---
post_title: 'fetch() In Node.js Core: What Is It and Why You Should Care'
post_author: Yavor Georgiev
post_author_avatar: yavor.png
date: '2022-02-02'
post_image: blog-node-fetch.jpg
post_excerpt: 'Node 17.5 will introduce support for the fetch() HTTP client, a new way to send requests to HTTP APIs.'
post_slug: node-fetch
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/twitter-node-fetch.png
---

Node.js v17.5 [introduces](https://github.com/nodejs/node/pull/41749) support for `fetch()` – a popular cross-platform HTTP client API that works in browsers and Web/Service Workers – as an experimental core feature.

`fetch()` support has been a long-requested addition by many, who want to write cross-platform HTTP request code and are familiar with the `fetch()` API shape and call patterns. So much so that the [`node-fetch` module](https://www.npmjs.com/package/node-fetch) exists solely to backfill this functionality in Node.js. The good news is that going forward, an additional module will not be needed, as Node.js core will now support the API.

This post explores the `fetch()` API and why this is an important addition you should consider using (one of the reasons rhymes with schmer-formance).

## What is fetch()?

The `fetch()` API provides a [WHATWG standardized](https://fetch.spec.whatwg.org/) interface for fetching resources, usually over HTTP. It’s a promise-based client that supports many high-level HTTP features, while also focusing on the most common scenario: sending simplified HTTP requests. To those coming from the browser world, it is similar to `XMLHttpRequest`, but standardized and with an expanded and more flexible feature set. One of the things that have held developers back is the relatively [recent addition](https://caniuse.com/?search=Fetch) of this API to some browsers (looking at you, Android). That’s why the addition of `fetch()` to Node.js is an exciting step toward a more standard HTTP stack across devices and platforms.

At its core, the API comprises of four interfaces

- [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) - the entry point used to initiate requests
- [`Headers` class](https://developer.mozilla.org/en-US/docs/Web/API/Headers) - deal with HTTP request/response headers instance
- [`Request` class](https://developer.mozilla.org/en-US/docs/Web/API/Request) - represents an outbound request instance
- [`Response` class](https://developer.mozilla.org/en-US/docs/Web/API/Response) - represents an incoming response instance

Putting these together, here is a trivial example:

```javascript
const res = await fetch('https://dog.ceo/api/breeds/list/all');
const json = await res.json();
console.log(json);
```

The good part about `fetch()` being standardized is that most [existing resources](https://betterprogramming.pub/deep-insights-into-javascripts-fetch-api-e8e8203c0965) that pertain to the browser version will also work the same in the Node.js implementation, and there are a lot of great resources out there!

## Why should you care?

There are two main reasons you may want to consider trying out `fetch()` in Node.js:

- There is a lively ongoing conversation in the community about **how to evolve Node’s HTTP stack** in a way that’s familiar to client developers, but also works with the server programming model, how to move past the limitations of the current HTTP model that’s part of the core, and how to support HTTP/2-3 without over-burdening the user. This experimental core feature is the first step in that conversation, and it gives you an opportunity to try it out and [get involved in the conversation](https://github.com/nodejs/TSC).
- The `fetch()` implementation is based on [Undici](https://undici.nodejs.org), a new fast, reliable, and spec-compliant HTTP/1.1 client that is now bundled in Node.js core. Because Undici does away with some dated HTTP primitives and builds directly on top of sockets, it can frequently deliver [**substantial improvements in latency and throughput**](https://undici.nodejs.org/#/?id=benchmarks) over the existing implementation.

## How do you get it?

You will be able to run `node --experimental-fetch` and then use the `fetch()` global without needing any additional modules when the feature ships. We will update this post and share via [@fusebito](https://twitter.com/fusebitio) when Node.js 17.5 ships or a nightly build is available, so follow us for updates.
