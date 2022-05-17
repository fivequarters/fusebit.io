---
post_title: New Express 5 Features to Try
post_author: Zara Cooper
post_author_avatar: liz.png
date: '2022-05-17'
post_image: new-express-features.png
post_excerpt: Express.js 5 is currently in Beta! In this guide, you will cover the new Express.js 5 features and why Node.js developers should try them out.
post_slug: new-express-features
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related: ['using-linear-with-everyauth', 'using-reddit-with-everyauth', 'web-frameworks-plugins-architecture-overview']
---

Express is one of the [most popular Node.js web frameworks](https://insights.stackoverflow.com/survey/2021#web-frameworks), thanks to its minimalism and the flexibility it gives developers when building Node.js apps. With it, you can easily build fast server-side web apps and powerful APIs. Because Express is a lightweight layer on top of Node.js, it doesn’t hinder developers from fully leveraging Node.js features.

Express offers superior routing and numerous valuable HTTP helpers and middleware modules. Its robust view and templating system support several template engines, and its [generator tool](https://expressjs.com/en/starter/generator.html) allows you to quickly and easily generate and scaffold apps.

Express 5, currently in beta, promises exciting improvements and bug fixes that give you more fine-grained control over Express objects and fix some significant Express 4 issues. This means Express 5 will help you build better apps with improved performance. In this article, you’ll learn about some of the new Express 5 features and fixes that you can take advantage of when it officially releases.

## Why Is Express 5 Important?

Express 5 will introduce new features and improvements that vastly enhance apps built with it. New path parameter modifiers will provide greater control over how parameters can be defined in paths. Instead of defining multiple routes with different paths but the same callback function logic, you can condense these into one route using these parameter modifiers. This cuts down on repetition, making your application code DRY.

Express 5 will enforce [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) for matching group expressions in route paths. This facilitates better text matching in paths using patterns.

Express 5 will also improve handling of rejected promises. Instead of having to explicitly define error handling for promises that are rejected or that throw errors, you can just forward them to error handling middleware to process them.

Finally, Express 5 will introduce fixes for bugs associated with view rendering when using synchronous view engines. This contributes to better overall performance for apps that render views using these kinds of engines.

## Use Cases for Express

Express is most commonly used for building server-side apps and REST APIs. Express apps process client requests with specific route paths and HTTP request methods, and execute route handler callbacks that are configured for the routes.

Using Express, you can serve static files like JavaScript files, CSS files, images, documents, and other types of assets by using the built-in [`express.static`](https://expressjs.com/en/5x/api.html#express.static) middleware function. Static files can be served across multiple directories and can have custom virtual path prefixes.

You can also build views with static templates. Express works with template engines that substitute values in templates and render them to HTML files. These files are then sent to the client as a response. Express supports template engines like [Pug](https://github.com/pugjs/pug), [EJS](https://github.com/mde/ejs), and [Handlebars](https://github.com/pillarjs/hbs).

Express can be used to incorporate middleware in request and response processing cycles. Middleware functions can access, modify, or end requests and responses. They can also be used to invoke other middleware functions for further processing.

## Express 5 Features and Improvements

You can install Express 5 beta using this command:

```shell

npm install express@5.0.0-beta.1 --save

```

Below are a few new features to try out, along with changes to keep in mind.

### Syntax Changes for Route Path Matching

Route paths are strings, string patterns, or regular expressions that define endpoints and are primarily used in the [`app`](https://expressjs.com/en/5x/api.html#app) and [`router`](https://expressjs.com/en/5x/api.html#router) objects. In Express 5, changes have been made to how regular expression route paths are processed.

First, new parameter modifiers have been added. These include the `?`, `*`, and `+` characters, which should be added as suffixes to route parameters. You can use `?` to specify optional parameters, `*` to match zero or more parameters, and `+` for one or more parameters.

This route path, for example, will match `/hello/1/world`, `/hello/1/2/world`, and so on, but not `/hello/world`:

```js

app.get('/hello/:ids+/world', (req, res) => {

    res.send('Hello World!');

});

```

This route path will match `/hello/world`, `/hello/1/world`, `/hello/1/2/world`, and so on:

```js

app.get('/hello/:ids*/world', (req, res) => {

    res.send('Hello World!');

});

```

This route path will match `/hello/world`, `/hello/1/world`, and so on, but not `/hello/1/2/world`:

```js

app.get('/hello/:id?/world', (req, res) => {

    res.send('Hello World!');

});

```

Another change is that all matching group expressions have to be [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp). For example, while it’s fine to use just `(*)` in a path string pattern in Express 4, this will not work in Express 5. `(.*)` should be used instead since it’s valid RegExp.

In Express 4, named matching groups were made available by both name and position. In Express 5, they are only available by name.

In the example below, making a request to `hello/1` would return `{"0":"1","id":"1"}` as a response in Express 4:

```js

app.get('/hello/:id(*)', (req, res) => {

    res.send(req.params);

});

```

Making a request to `hello/1` would return `{"id":"1"}` as a response in Express 5:

```js

app.get('/hello/:id(.*)', (req, res) => {

    res.send(req.params);

});

```

In Express 4, regular expressions could be used outside of matching groups. With Express 5, all regular expressions can only be used in matching groups.

For example, this would match `/hello` in Express 4 but would not work in Express 5:

```js

app.get('/\\D{5}', (req, res) => {

    res.send('Hello world!');

});

```

The regular expression needs to be added to a matching group for it to match the `/hello` path in Express 5:

```js

app.get('/(\\D{5})', (req, res) => {

    res.send('Hello world!');

});

```

Lastly, `*` can no longer be used as a special path segment character in Express 5.

In Express 4, this route would match `/hello/there/world`. This will not work in Express 5:

```js

app.get('/hello/*/world', (req, res) => {

    res.send('Hello world!');

});

```

### Rejected Promise Handling

When a promise is rejected or has an error thrown, it can be passed to error handling middleware in Express 5. If the promise is returned within a middleware or a handler, it is handled as an error and sent as a response without causing the app to crash. This is especially helpful in async handlers and middleware. In Express 4, if the rejection or error is [not explicitly handled or passed to error handling middleware](https://expressjs.com/en/guide/error-handling.html), the app will crash.

In Express 4, making a request to either of the routes below will result in the app crashing. In Express 5, the app does not crash, and instead, `500` responses are returned. The response body will either be the error or the rejected value:

```js

const express = require('express');

const app = express();

app.get('/reject', () => {

    return Promise.reject('rejected');

});

app.get('/throw', async() => {

    return await Promise.resolve().then(() => {

        throw new Error('error');

    });

});

app.listen(3000);

```

### Return of app.router

[`app.router`](https://expressjs.com/en/5x/api.html#app.router) is a reference to an Express app’s built-in router instance. It was in Express 3, removed in Express 4, and is making a return in Express 5. Similar to how you add routes and middleware to `app`, you can do the same to `app.router`.

Here’s an example:

```js

const express = require('express');

const app = express();

const router = app.router;

router.get('/hi', (req, res) => {

  res.send('Hi!');

});

app.listen(3000);

```

### Return of the Port to req.host

[`req.host`](https://expressjs.com/en/5x/api.html#req.host) returns the host from the `Host` HTTP header. The port number was removed from the host in Express 4, but `req.host` in Express 5 preserves the port.

If the app is running on `http://localhost:3000`, this code snippet will log `localhost:3000` on Express 5, but `localhost` on Express 4:

```js

const express = require('express');

const app = express();

app.get('/', (req, res) => {

    console.log(`host: ${req.host}`);

});

```

### Changes to Query Parsing

In Express 5, the default query parser has been changed from extended to simple. Express 4 uses the extended query parser based on [qs](https://github.com/ljharb/qs), which can parse nested query parameters. Express 5 uses the simple query parser by default, which is based on the [`querystring` Node.js module](https://nodejs.org/api/querystring.html) that cannot parse nested parameters.

Check this using the following code snippet:

```js

const express = require('express');

const app = express();

console.log(app.get("query parser"));

```

Note that you are not limited to using the simple or extended query parser. You can also use a custom parsing function. You can change the default query parser using [`app.set`](http://expressjs.com/en/5x/api.html#app.set):

```js

const express = require('express');

const app = express();

app.set("query parser", "extended");

```

### Enforced Asynchronous Behavior by res.render

The [`res.render`](http://expressjs.com/en/5x/api.html#res.render)’s `callback` parameter in Express 5 is now always asynchronous. The `callback` function is responsible for sending the rendered HTML to the client and processing any rendering errors. This change is enforced even for synchronous view engines. This improvement was made because synchronous view engines sometimes caused bugs related to this callback.

## Conclusion

Express 5, while still in its beta stage, introduces some exciting changes that include the addition of route parameter modifier characters and improved RegExp parsing in route paths. It also automatically takes care of rejected promise handling in middleware and handlers. Important properties and values that were missing in Express 4, like `app.router` and the port in `req.host`, have been brought back in Express 5. Bugs related to synchronous view rendering have also been fixed.

If you try Express 5 for your next project, you could also use Fusebit to build it. [Fusebit](https://fusebit.io/) is a code-first SaaS integration platform for developers to add third-party integrations to their products or projects. It prioritizes developer experience at all levels, and its flexible, cloud-native architecture facilitates seamless deployment and operation of your projects at scale.

For more developer content like this, [follow Fusebit on Twitter](https://twitter.com/fusebitio).
