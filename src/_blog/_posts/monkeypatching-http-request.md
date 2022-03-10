---
post_title: Monkey Patching http.request for Fun and Profit
post_author: Benn Bollay
post_author_avatar: benn.png
date: '2022-03-10'
post_image: blog-monkeypatching-http-request.png
post_excerpt: Let’s explore how we can monkey patch the Node.js `http` library (and, by extrapolation, `https` as well) to annotate every request made from the environment.
post_slug: moneky-patching-http-request
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-monkeypatching-http-request.png
---

[Monkey patching](https://en.wikipedia.org/wiki/Monkey_patch) is a time-honored tradition in the system instrumentation space. Many a time a developer will need to add an annotation or capture an event for a system that doesn’t natively support it or provide any hooks, and will have to result to trickery to achieve their goals.

Happily, in today’s modern world of high level interpreted languages like Python and JavaScript, monkey patching is so much easier!

Let’s explore how we can monkey patch the Node.js [http](https://nodejs.org/api/http.html) library (and, by extrapolation, [https](https://nodejs.org/api/https.html) as well) to annotate every request made from the environment.

Here at Fusebit, we use this to add [OpenTelemetry](https://opentelemetry.io/) tracing information to outbound requests, allowing us to correlate events extending across multiple parts of our infrastructure for each customer integration.
## Naive approach

Let’s try the simplest approach.  First, let’s establish a simple testcase:

```javascript
const assert = require(‘assert’);
const http = require('http');

// Let’s create a server that’s emulating our teapot
const server = http.createServer((req, res) => {
  res.writeHead(418);
  res.end();
});
server.listen();

http
  .request({ method: 'GET', hostname: 'example.com' }, (res) => {
    assert(res.statusCode == 418);
  })
  .end();
```

Obviously this will fail because the `http.request` is asking for `example.com` instead of the local [HTTP-serving tea pot](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418).  So we’re just going to have to change it on the fly!

*Note*: while in these examples we are changing the `hostname`, it’s left as an exercise to the reader to modify the `header` field, or any other, as they prefer.

```javascript
const simplePatch = () => {
  const oldRequest = http.request;
  http.request = (options, callback) => {
    options.hostname = 'localhost';
    options.port = httpPort;

    return oldRequest(options, callback);
  };
};

(async () => {
  simplePatch();

  let statusCode = await makeRequest();

  assert(statusCode == 418);
})();
```

Here we see the simplest form of a monkey patch: a simple module modification where we wrap the call to the `http.request` method, saving the “stock” version in `oldRequest`, and changing the hostname and port in the new one.  Then we call `oldRequest` at the end, but with the new parameters.

*Note*: It’s important to always add your monkey patching before there’s any chance that the code that sends a request runs!  Or, as some libraries do, has a chance to grab a reference to the “old” `.request` or `.get` methods.

Now our test will work, because the request will hit the local server!

However, our work is not remotely done.

## What about http.get?

An optimistic interpretation of `http.get`, which is a shorthand call for `http.request({method: ‘GET’})`, is that it would directly call `http.request`.  And you’d be right!  Unfortunately, now we’re running into a JavaScript module scope issue.

When we modified the `http` object, we were only modifying our local copy of it, created during the `require()` step at the top of the test file.  Once imported it is cached, so other modules in our executable will also make use of the patched version, but `http.get` directly calls the local method.  You can see the code [here](https://github.com/nodejs/node/blob/1e8b296c58b77d3b7b46d45c7ef3e44981c5c3e7/lib/http.js#L107); it calls the `request()` method directly.

That means that the monkey patch we did for the `http.request` value won’t work!  So now we need to add another test case and monkey patch for `http.get`:

```javascript
test('example http.get', () => {
  http.get('http://example.com' , (res) => {
    expect(res.statusCode).toBe(418);
  })
  .end();
});
```

… but wait, that has a completely different call signature?  Sure, we can apply the same procedure that we did for `http.request`, but how many of these are we going to have to implement?

## Different call signatures

It turns out that the http library offers four different call signatures:
  1. http.request({...}, cb)
  1. http.request(“url”, cb)
  1. http.request(“url”, { method: ‘GET’ }, cb);
  1. http.request(“url”, { }, cb);

That means that we need to normalize these down to something a little more generic so we can consistently apply our updating logic to each one.

### Respecting the HTTP "options"

You’ll also note that on several of the calls, there’s no `options` parameter - the values are implied via the string URL that is supplied.  But on the ones that do have an `options` parameter, we have to make sure that when we do make changes, we don’t accidentally modify the object that’s supplied.  The caller is not expecting the object to be changed, after all, and to violate that convention would be rude (and possibly introduce bugs!).

So for the HTTP `options` object, we follow one simple rule: don’t modify the original.  That means we need to make a safe copy (which can be hard, depending on what the caller supplies!), preserving the parameters and only creating anew the ones that we need for our specific monkey patch.

## What about results and errors?

A big part of adding tracing and instrumentation to `http` is capturing the results of operations.  It’s not just enough to wedge a new hostname or port on the request object, but we also have to capture the outcome of the operation.  What was the status code? Did the request succeed?  Did it fail due to DNS or network issues, or for a protocol reason?

Here’s an example of how to capture all of the various conditions:

```javascript
const wrapRequest = (oldFunction) => (...args) => {
  let span = createSpan(args);

  return oldFunction
    .apply(null, args)
    // Capture the “normal” response code.
    .on('response', (res) => {
      enrichSpan(span, res);
    })
    // Capture protocol errors
    .once('error', (error) => {
      // Clear the span out after closing it, so it doesn’t get closed twice on
      // stacked errors.
      span = closeSpan(span, error);
    })
    // Capture network errors
    .once('close', (res) => {
      // Clear the span out after closing it, so it doesn’t get closed twice on
      // stacked errors.
      span = closeSpan(span);
    });
};
```

## When do you run this code?

Run your monkey patches as early as possible, so that there’s no potential race conditions between events that you want to capture and your patch.  But keep in mind that this is a _global_ operation.  It will impact every usage of that module in the system, baring shenanigans with the module cache.

You’re not just racing your code that makes the calls, but you’re racing any other imports that may grab references to the `.request` or `.get` methods themselves.  Any reference to those old methods won’t be patched by your code.

## The whole bit, all together now

In the spirit of showing you how it all works, here’s the code we use as part of tracing integrations through our system, here at Fusebit.

```javascript
const Http = require('http');
const Https = require('https');

const cloneHttpOptionsObjects = ['headers'];

const cloneHttpOptions = (options) => {
  const result = {};

  // Make a simple copy of all of the entries
  Object.keys(options).forEach((opt) => (result[opt] = options[opt]));

  // Duplicate the existing entries that are objects that we know about and touch, to
  // avoid contamination back to the caller.
  cloneHttpOptionsObjects.forEach(
    (opt) => (result[opt] = result[opt]
      ? JSON.parse(JSON.stringify(result[opt]))
      : result[opt])
  );

  return result;
};

// Convert an error into a standard object.
const errorToObj = (error) => ({
  code: 500,
  status: 500,
  statusCode: 500,
  message: error.message,
  properties: {
    errorMessage: error.message,
    errorType: error.name,
    stackTrace: error.stack.split('\n'),
  },
});

// Monkey patch both http and https, modifying both the `get` and `request` methods
// in each to add instrumentation and tracking to each outbound request.
[
  [Http, 'http:'],
  [Https, 'https:'],
].forEach((entry) => {
  const [h, hstr] = entry;

  // Return a standardized options object that always looks the same.
  const normalizeOptions = (args) => {
    let options;

    if (typeof args[0] === 'object') {
      options = cloneHttpOptions(args[0]);
    } else if (typeof args[0] === 'string') {
      if (typeof args[1] === 'object') {
        options = cloneHttpOptions(args[1]);
      } else {
        options = {};
      }
      const url = new URL(args[0]);
      options.hostname = url.hostname;
      options.port = url.port;
      options.path = url.pathname;
    } else {
      return {};
    }
    options.protocol = options.protocol || hstr;
    options.method = (options.method || 'get').toUpperCase();

    return options;
  };

  // Create a new OpenTelemetry span to track this action.
  const createSpan = (args) => {
    const options = normalizeOptions(args);
    const { protocol, host, hostname, port, path, method } = options;
    return {
      startTime: Date.now(),
      url: `${protocol || hstr}//${host || hostname}${port ? `:${port}` : ''}${path}`,
      method,
    };
  };

  // Figure out which of the various supported calling conventions are at play, clone
  // (or create) the options object, and return a new args array.
  const addTraceToArgs = (args) => {
    let options;

    // There's three different call signatures to deal with here for http.get and
    // http.request:
    if (typeof args[0] === 'object') {
      //   1. http.get({ ...options... }, (response) => {});
      options = args[0];
    } else if (typeof args[1] === 'object') {
      //   2. http.get('http://fusebit.io', { ...options... }, (response) => {});
      options = args[1];
    } else {
      //   3. http.get('http://fusebit.io', (response) => {});
      options = {};
      args = [args[0], options, ...args.slice(1)];
    }

    // Add the traceIdHeader and the traceId itself
    options.headers = options.headers || {};
    if (traceId) {
      options.headers[traceIdHeader] = traceId;
    }

    return args;
  };

  // Add the result of the operation to the OpenTelemetry span
  const enrichSpan = (span, res) => {
    if (!res) {
      return;
    }
    span.statusCode = res.statusCode;
  };

  // Note that the span has been closed, add a normalized error object if any, and
  // return undefined to prevent closeSpan from being called again.
  const closeSpan = (span, error) => {
    if (!span) {
      return undefined;
    }
    span.endTime = Date.now();
    span.error = error && errorToObj(error);
    spans.push(span);
    return undefined;
  };

  // Perform the actual wrap operation, adding instrumentation and tracing, and then
  // calling the previous function to perform the actual work.
  const wrapRequest = (oldFunction) => (...args) => {
    args = addTraceToArgs(args);
    let span = createSpan(args);

    return oldFunction
      .apply(null, args)
      .on('response', (res) => {
        enrichSpan(span, res);
      })
      .once('error', (error) => {
        span = closeSpan(span, error);
      })
      .once('close', (res) => {
        span = closeSpan(span);
      });
  };

  // Wrap both 'request' and 'get', which is a specialization of 'request'.
  h.request = wrapRequest(h.request);
  h.get = wrapRequest(h.get);
});
```

## To wrap up…

Hopefully, you’ll find the above code and implementation details helpful!  Don’t hesitate to reach out if you have any questions, and we’ll be happy to help push through.  You can find me on the [Fusebit Discord](https://discord.gg/SN4rhhCH), our [community Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg), and at [benn@fusebit.io](mailto:benn@fusebit.io).

[Fusebit](https://fusebit.io) is a code-first integration platform that helps developers integrate their applications with external systems and APIs. We used monkey patching ourselves to make our integrations better! To learn more, take [Fusebit for a spin](https://manage.fusebit.io/signup) or look at our [getting started guide](​​https://developer.fusebit.io/docs/getting-started)!
