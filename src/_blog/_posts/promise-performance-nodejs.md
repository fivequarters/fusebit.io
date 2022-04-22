---
post_title: What’s Taking So Long? Task-Based Promise Performance Analysis in Node.js
post_author: Benn Bollay
post_author_avatar: benn.png
date: '2022-04-22'
post_image: main-blog-promise-performance.png
post_excerpt: If we want to understand the architectural performance of our system, we need to first measure the steps taken to process a request.
post_slug: promise-performance-node
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-promise-performance-social.jpg
---

I started my career off in high-performance embedded C, spending hours looking at [oprofile](https://oprofile.sourceforge.io/news/) reports, assembly, and trying to micro-optimize page loading strategies to wring the last cycle of performance out of an algorithm. It was a great time to be an engineer: computers were slow, algorithms simple, and you could reasonably understand the underlying hardware’s optimization strategies (if there were any!).

Now, _*cough cough*_-years later, I’m looking at my Express backend in Node.js, trying to figure out why it takes _so long_ to satisfy a browser request. Sure, I could use the various profiling tools - ones built largely to the same stochastic sampling thesis as oprofile - to take samples of where CPU time is spent but, frankly, who is doing CPU-intensive work in JavaScript? That’s crazy talk!

Most of our time in modern web application backend code is spent doing “broker” work. Broker processes take a message or event from one source - say, an HTTP POST request from a browser - perform some basic manipulation, and then send it on to another location, like a database. Or another web client. Or the blockchain, if you’re into that kinda Web3 thing.

What does performance improvement mean in the contexts of an environment where, not only is the performance not constrained by the CPU, but when there might be dozens of other systems involved? The answer is often not algorithmic but architectural. Where do you add caching? What calls can be delayed or performed asynchronously so that the client is not blocked on the response? What’s the minimum amount of data necessary to complete the request?

Answering this question in a broker-style backend requires understanding how long different asynchronous operations take, which in turn means understanding how long various JavaScript Promises take, in order to best identify the [hot spots to focus our efforts around](https://en.wikipedia.org/wiki/Amdahl's_law).

If we want to understand the architectural performance of our system, we need to first measure the steps taken to process a request.

## A Simple Example

I always like to start off with some real code, so let’s put together a simple example to help frame the conversation:

```typescript
async function work1() {
  return new Promise((resolve) => setTimeout(resolve, 100));
}

async function work2() {
  return new Promise((resolve) => setTimeout(resolve, 500));
}

async function work3() {
  return new Promise((resolve) => setTimeout(resolve, 30));
}

async function example() {
  await work1();
  await work2();
  await work3();
};
```

This simple example waits for the completion of three different pieces of work. Each piece of work takes a variable amount of time - maybe one is a database call, another is a lookup to a cache, etc - but it’s challenging to look at the code alone and understand what the expensive pieces of work would be.

## A Simplistic Solution

We could approach this with brute force, and instrument it like so:

```typescript
async function example() {
  console.time(‘example’);
  await work1();
  console.timeLog(‘example’);
  await work2();
  console.timeLog(‘example’);
  await work3();
  console.timeLog(‘example’);
};
```

This would produce fairly simplistic output:

```
example: 101.161ms
example: 615.143ms
example: 647.265ms
```

A bit of math and we could figure out where the expensive operations are, but can you imagine trying to instrument a large, complicated, and mature product with dozens (or hundreds) or branching paths? Much less try to collate the output across all of the simultaneous executions?

**Surely there’s a better way.**

## async_hooks To The Rescue

NodeJS added, way back in v8.17, the ability to add callbacks that fire when an async operation transitions through various lifecycle stages. While [async_hooks](https://nodejs.org/docs/latest/api/async_hooks.html) are still marked `Experimental`, we’re able to make use of them to measure Promise duration. This was remarkably obnoxious and, even with a sensible implementation, still has some gaps which we’ll talk about later.  But for now, let’s take a look at the [Promise Perf](https://github.com/bennbollay/promise-perf) package, and see what this let’s us do

## Promise Perf Implementation

The [Promise Perf](https://github.com/bennbollay/promise-perf) library is a zero-dependency library (unless you want to use the utility code to log annotated files, in which case the [source-map](https://www.npmjs.com/package/source-map) library can be used) to measure the duration of async operations within a chain. Using the [five](https://nodejs.org/docs/latest/api/async_hooks.html#hook-callbacks) different hooks, a record is captured for each Promise creation and, when the Promise is resolved, the record is annotated with the duration of time.

You can see the meat of the implementation in the [PerfAsyncHooks.ts](https://github.com/bennbollay/promise-perf/blob/main/src/PerfAsyncHooks.ts) file. Most of this file is fairly straightforward.

This file is then paired with one of two different implementations, either using the `PromisePerf` base class contained in [PromisePerf.ts](https://github.com/bennbollay/promise-perf/blob/main/src/PromisePerf.ts), or the `ExpressPerf` middleware contained in [ExpressPerf.ts](https://github.com/bennbollay/promise-perf/blob/main/src/ExpressPerf.ts).  The only complexity that comes from each of these surrounds when the Promise chain is tracked, and when it isn’t.

In order to solve this, another NodeJS feature called [AsyncLocalStorage](https://nodejs.org/docs/latest/api/async_context.html#class-asynclocalstorage) is used.  Added in v12.17.0, `AsyncLocalStorage` leverages `async_hooks` to provide storage that’s uniquely accessible for a given Promise chain.  This allows us to control when the events are tracked, and when they should be ignored.

## Example with Promise Perf

Let’s take the previous code, and a few lines to it:

```javascript
const { IHookRecords, PromisePerf, annotateSource, fileToString } = require('promise_perf');

// … the previous lines of code

async function start() {
  let records;

  // Trace the function and catch the responding records
  await PromisePerf.trace(example, (rec) => (records = rec));

  console.log(
    fileToString(
      Object.values(
        await annotateSource(records, { pathFilter: (path) => path.endsWith('annotated.js') })
      )[0]
    )
  );
}
```

The new `start()` function fires the previous `example()` function inside of a `PromisePerf.trace` call, with an additional callback to save the records created. Then, we use the `annotateSource` utility function to generate an annotated log of the function and it’s costs: 

```
   0 |async function work1() {
 202 |  return new Promise((resolve) => setTimeout(resolve, 100));
     |}
     |
   0 |async function work2() {
1002 |  return new Promise((resolve) => setTimeout(resolve, 500));
     |}
     |
   0 |async function work3() {
  62 |  return new Promise((resolve) => setTimeout(resolve, 30));
     |}
     |
 636 |async function example() {
 101 |  await work1();
 502 |  await work2();
  31 |  await work3();
     |}
```

Neat!  Now we’re able to see exactly which sections are using a lot of time!

You can use the `PromisePerf` class around any `async` function.

## What About Our Express app?

Solving the same problem for Express middleware requires a bit more finesse since it becomes necessary to ensure that the Promise cost tracking stops when the current middleware exits. You can see the apparently-standard way of hooking `res.end` in the [ExpressPerf.ts](https://github.com/bennbollay/promise-perf/blob/main/src/ExpressPerf.ts) file.  While the [test code lives in test/mock/router.js](https://github.com/bennbollay/promise-perf/blob/main/test/mock/router.js), the middleware is added very simply with the addition of these lines:

```javascript
app.use(
  ExpressPerf.middleware(
    (req: express.Request) => true,
    (req: express.Request, res: express.Response, rec: IHookRecords) => (records = rec)
  )
);
```

This produces output that looks like the following:

```
     |const express = require('express');
     |const superagent = require('superagent');
     |
     |const router = express.Router();
     |
1288 |const work = async () => {
 315 |  await superagent.get('https://www.google.com');
     |
 332 |  await superagent.get('https://www.amazon.com');
     |
 650 |  await superagent.get('https://www.apple.com');
     |};
     |
     |router.get('/', async (req, res) => {
 200 |  await new Promise((resolve) =>
 100 |    setTimeout(async () => {
     |      resolve(0);
     |    }, 100)
     |  );
1288 |  await work();
 101 |  await new Promise((resolve) =>
 101 |    setTimeout(async () => {
     |      resolve(0);
     |    }, 100)
     |  );
     |  res.send('All done');
     |});
     |
     |exports.router = router;
```

You can see that the different pieces of work were tracked inside of the `async` handler function.  Pretty nice!

## Weaknesses of The Approach

Let’s take a quick look at one specific weakness.  The first sample code produced output that looked like this:

```
1002 |  return new Promise((resolve) => setTimeout(resolve, 500));
```

Why is that doubled up?  The answer becomes clearer when we look at the Express example:

```
 101 |  await new Promise((resolve) =>
 101 |    setTimeout(async () => {
     |      resolve(0);
     |    }, 100)
```

We are actually tracking two different Promises, here.  The first is the one created by `new Promise`, and the second is the _implied_ promise created by `async ()`.  This is a bit problematic for us in the broad sense because the NodeJS V8 JavaScript engine decides to [optimize away `Promise` objects](https://v8.dev/blog/fast-async) in a fashion that’s moderately unpredictable to a developer.  As such, it’s definitely possible that the results of a capture may require some interpretation, as direct returns from an `async ()` may be rolled up into parent Promises, leaving the function apparently zero cost.

## Next steps

I would love to better integrate the output with VS Code or some other performance rendering library, and lord knows more testing - especially with the Express app - is definitely called for.  But in the meantime, hopefully this will be useful for you!

Want more developer articles like this? Follow [@fusebitio](https://twitter.com/fusebitio) for more entertaining (and useful) developer content.
