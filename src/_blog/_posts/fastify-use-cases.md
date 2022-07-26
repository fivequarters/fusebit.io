---
post_title: 3 Common Use Cases for Fastify
post_author: Kasper Siig 
post_author_avatar: kasper.png
date: '2022-07-26'
post_image: use-cases-fastify.png
post_excerpt: In this guide, you will cover 3 use cases in which Fastify shines with code examples. 
post_slug: fastify-common-use-cases
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'nodejs-websocket-client',
    'unified-apis',
    'nodejs-websocket-client',
  ]
---

When you want to develop something using Node.js, it’s rare that you end up _just_ using Node.js. Typically you’ll use a framework to enhance the experience and more efficiently accomplish your task. When implementing functionality around responding to HTTP requests, many developers choose to use either [Express](https://expressjs.com/) or [Fastify](https://www.fastify.io/).

Though both options are great tools for implementing something like an API, some developers have found Fastify [to be faster](https://facsiaginsa.com/nodejs/comparing-fastify-vs-express) and therefore the better choice.

In this article, you’ll be introduced to three common use cases for Fastify, along with simple examples of how these use cases can be implemented.

## Why Do You Need Fastify?

Calling Fastify a framework is misconstruing the truth a bit. In reality, Fastify is “just” a library; however, because it’s a library that defines most of how your application is built and architected, you can fairly refer to it as a framework. This is similar to how React [isn’t actually a framework](https://kruschecompany.com/react-framework-library/#:~:text=React%20is%20an%20open%20source,fact%20a%20JS%20'library'.).

Fastify uses regular JavaScript to implement its functionality. This means that you can implement the same functionality for yourself without using special tools. So, why do you want to use a library? Probably the biggest reason for many is that it enhances the developer experience considerably. Rather than writing multiple lines of code to be able to receive a GET request, you can call a simple function.

There are other reasons as well. A library like Fastify doesn’t just focus on implementing the functionality you need. It implements that functionality in the most optimized way possible, allowing you to handle as many requests as possible per second. You also get access to functionality that you might not otherwise think about implementing. For example, you can find plug-ins to help you serve static content or parse a request more effectively.

Ultimately, Fastify can help you become more productive and make your applications work more effectively, directly enhancing the performance of your application.

## Fastify Use Cases

There are many ways to use Fastify, and really the only limit is your imagination. However, some use cases are more popular than others. While each specific use case will require different implementations, setting up a Fastify application will also require the same [boilerplate code](https://stackoverflow.com/questions/3992199/what-is-boilerplate-code).

First, you need to download Fastify by running `npm install fastify`. Then, initialize Fastify:

```js
const fastify = require('fastify')({
  logger: false
})
```

With this done, you need to make Fastify listen on a specific port:

```js
fastify.listen({port: 3000}, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
```

This piece of code tells Fastify that it needs to open up on port 3000. If any errors occur, Fastify will log it to the console and then close the process down.

With these two pieces of code, you effectively have a Fastify application. It can’t receive any requests since there are no routes set up, but the core functionality is configured.

Now that Fastify is initialized, you can move on to some concrete examples. To follow along with these examples, check the code in [this repository](https://github.com/KSiig/fastify-use-cases).

### Building REST APIs

One of the most common use cases for a framework like Fastify is building a REST API. A REST API typically implements a create, read, update, delete (CRUD) pattern, which is easy to do with Fastify. The complexity involved will mainly depend on what you want the application to do.

To demonstrate, you’re going to build a simple application that handles a list of persons in memory. First, you need to define the list of persons:

```js
let persons = [{
  id: 0,
  firstName: 'John',
  lastName: 'Doe',
  city: 'Austin'
  },
  {
    id: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    city: 'Chicago'
  }]
```

Following the CRUD pattern, you’ll create a route that can CREATE a new person. To do so, start by defining the route to handle the POST request:

```js
fastify.post('/person', (req, res) => {})
```

Getting Fastify ready to handle a POST request is as simple as the above example. You call `.post()` on the Fastify instance, define a route (`'/person'`), and define the function that needs to be executed once the given route and request type is being handled.

Next, modify the function to handle the creation of a new person in the `persons` array:

```js
fastify.post('/person', (req, res) => {
  persons.push(req.body)
  res.send(persons)
})
```

In this use case, a POST request is sent to `/person` in which the body defines the new person. Test this out by starting the application (with `node index.js`) and running:

```bash
curl -X 'POST' localhost:3000/person -H 'Content-Type: application/json' -d '{"id":2, "firstName":"Jerry", "lastName":"John", "city":"New York"}'
```

You’ve already seen all you need to know in order to implement the READ, UPDATE, and DELETE functionalities:

```js
// Get a person given an ID
fastify.get('/person', (req, res) => {
  res.send(persons.find(x => x.id == req.query.id))
})

// Update a person given an ID
fastify.put('/person', (req, res) => {
  const index = persons.findIndex(x => x.id == req.query.id)
  for (const key of Object.keys(req.body)) {
    persons[index][key] = req.body[key];
  }
  res.send(persons.find(x => x.id == req.query.id))
})

// Delete a person given an ID
fastify.delete('/person', (req, res) => {
  persons = persons.filter(x => x.id != req.query.id)
  res.send(persons)
})
```

You can test out each full functionality using the following `curl` commands:

```bash
# Get a person with ID 0
$ curl localhost:3000/person?id=0

# Update person with ID 0
$ curl -X PUT ‘localhost:3000/person?id=0’ -H 'Content-Type: application/json'  -d '{"city":"Boston"}'

# Delete person with ID 0
$ curl -X DELETE ‘localhost:3000/person\id=0’
```

In terms of Fastify, this is all you need to implement a REST API. From here, you can add more advanced functionalities, like connecting to databases or connecting to third-party resources. However, you would do this through Node.js.

### Serving Static Content

Another common use case for Fastify is to create a simple application that serves static content. Storing all your static content like images and videos in a separate service may seem odd if you’ve never done so before, but it offers clear benefits. First of all, your application is solely focused on managing access to and serving static content, meaning you have a more cohesive service. Second, you can more easily implement functionality like caching.

Creating a service in Fastify that can serve static content is fairly straightforward and makes use of a plug-in. First, you need to install two packages in your project:

```bash
$ yarn add path @fastify/static
```

The `path` package helps you in creating the correct path needed to find your static files, while the `static` package helps parse and serve the files.

To set up the `static` package, paste the following into your application:

```js
const path = require('path');

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
})
```

This tells Fastify to use the `static` plug-in, which is configured to look for files in the `public` directory of your project. Create a directory in your root folder called `public`. In this folder, create a file called `hello.txt` with a welcome message of your choice. Now you can add a route to your application where you want the content to be served:

```js
fastify.get('/hello', (req, res) => {
  res.sendFile('hello.txt');
})
```

If you execute `curl localhost:3000/hello`, you’ll see that the contents of the `hello.txt` file are returned. You can [read more about the `static` plug-in](https://github.com/fastify/fastify-static) to see how it can be used.

### Creating Serverless Functions

Serverless functions have become incredibly popular because they allow developers to create simple, efficient applications that only serve one purpose. This can include functions that run on a timer and update data in a database, such as an HTTP endpoint that performs specific calculations and returns results. A major benefit of serverless functions is that they close once the execution is done, which can save costs for an organization.

Creating a serverless function is simple. Here is some sample code showing a GET request that adds two numbers together and returns it:

```js
fastify.get('/add', async (req, res) => {
  let a = req.query.a;
  let b = req.query.b;

  res.send(+a + +b);
})
```

You can test this function by running `curl localhost:3000/add?a=1&b=2`, which should return `3`. This is a very simple function, but it showcases just how easily you can create a simple application that performs some quick logic and returns it using Fastify.

One important thing to remember is that different platforms may require slight modifications to your code. For example, to run your serverless function on Google Cloud, you need to add the following:

```js
fastify.addContentTypeParser('application/json', {}, (req, body, done) => {
  done(null, body.body);
});
```

You can read more about modifications needed for different platforms in the [Fastify documentation](https://www.fastify.io/docs/latest/Guides/Serverless/).

## Conclusion

Whether you’re looking to implement the above examples or yet another use case, Fastify can be a great way to develop your application. Fastify needs less than ten lines of code to get started, and it’s tough to find another framework that’s easier to work with when it comes to creating HTTP applications.

If you like Fastify’s approach of using a simple library to add powerful functionality to your application, you may want to check out [Fusebit](https://fusebit.io/). Fusebit is a code-first SaaS platform that can help you implement multiple third-party integrations such as Slack or Asana. The cloud-native tool is focused on developers’ needs and gives you the freedom to focus on your product.

Follow [@fusebitio](https://twitter.com/fusebitio) on Twitter for more developer content.
