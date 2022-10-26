---
post_title: 5 Deno Runtime Projects You Should Try
post_author: Lochemem Bruno Michael 
post_author_avatar: lochemem.png
date: '2022-10-26'
post_image: deno-projects.png
post_excerpt: Highlights a number of projects out there using Deno that developers should watch and try.
post_slug: deno-projects-you-should-try
tags: ['post', 'deno']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'build-your-first-deno-app',
    'deno-third-party-module-system',
    'changes-comming-to-deno',
  ]
---

[Deno](https://deno.land) is a new JavaScript runtime that was created because of insufficiencies found in [Node.js](https://nodejs.org/en/). Since its debut in 2020, Deno has expanded to include several runtime projects that take advantage of its robustness as both a secure runtime and package manager.

If you're not familiar with Deno's runtime packages, they're very similar to the packages found in Node.js and help you build robust Deno applications.

In this article, you'll learn about five Deno runtime projects and look specifically at their performance, deployment and hosting, testing capabilities, and database connectors.

## Why Deno?

As previously stated, Deno is a JavaScript runtime with relevant security enhancements compared to its predecessor (Node.js). Deno can't access your file system, network, or environment variables without your permission.

Its philosophy is centered around increasing developer productivity, and it ships with a built-in package manager, which means you don't have to install one to manage project dependencies. Deno also allows you to install and use packages from several sources with minimal effort; all you need is a URL that retrieves the `lodash` identity function from the skypack CDN:

```js
import identity from  'https://cdn.skypack.dev/lodash/identity'

const  x  =  identity(12)
```

In addition, Deno provides a test runner for evaluating tests, a task runner for executing tasks in a console (as you would with npm scripts), and a benchmarker for checking the performance of your code. To learn more about what's available with Deno, check out this list of [built-in utilities](https://deno.land/manual@v1.26.1/tools).

Deno also offers built-in TypeScript support, a feature that lets programmers write type-adherent code without the hassle of configuring any extra transpilers.

## Runtime Projects in Deno

As previously mentioned, runtime projects make it possible to build applications in Deno. In the following sections, you'll look at five runtime projects that make it possible for you to build, test, and deploy applications in Deno.

### DenoDB

The first notable Deno project in this roundup is [DenoDB](https://deno.land/x/denodb@v1.0.40), an object-relational mapper (ORM). With DenoDB, you can interact with [MariaDB](https://mariadb.org), [MySQL](https://www.mysql.com), [PostgreSQL](https://www.postgresql.org), [SQLite](https://www.sqlite.org/index.html), and [MongoDB](https://www.mongodb.com), leaving you with lots of database options to integrate into your application.

DenoDB, similar to any other ORM, is model-oriented. It conditions you to define your database entities (tables and queries) as models that are objects with which you can perform create, read, update, and delete (CRUD) operations. Following is an example of a model created with DenoDB:

```typescript
class Person extends Model {
  static table = 'persons';
  static timestamps = true;

  static fields = {
	id: { primaryKey: true, autoIncrement: true },
	name: DataTypes.STRING,
	country: DataTypes.STRING,
  };
}
```

The fields are automatically mapped to column names in the table, allowing you to leverage convenient TypeScript code to execute database queries:

```typescript
// Saving data
const person = new Person();
person.name = "John Doe";
person.country = "England";
await person.save();

// Selecting a column
await Person.select('country').all();

// Selecting based on condition and deleting
await Person.where('country', 'Japan').delete();
```

However, DenoDB improves on this model idea by allowing you to program event listeners into your models.

Model events are triggers for arbitrarily defined actions that Deno can listen for in order to execute custom code during and after the creation, deletion, or modification of database records. For example, if your goal is to send an email to your user, notifying them when they make changes to their account, DenoDB lets you specify the update (your email function) in an event listener:

```typescript
User.on('updated', (model: User) => {
  notifyUser(model);
});
```

For more information about DenoDB, check out [their official documentation](https://eveningkid.com/denodb-docs/).

### Fresh

[Fresh](https://fresh.deno.dev) is a full-stack framework for writing server-side rendered web applications in TypeScript on top of Deno. It requires developers to use [Preact](https://preactjs.com) and [JSX](https://reactjs.org/docs/introducing-jsx.html) to implement its [islands architecture](https://patterns.dev/posts/islands-architecture), which lightens the JavaScript rendering load of the browser in a process known as [partial hydration](https://dev.to/ajcwebdev/what-is-partial-hydration-and-why-is-everyone-talking-about-it-3k56). Less JavaScript means lower page load times and, ultimately, more performant web pages.

Fresh implements [file-system routing](https://fresh.deno.dev/docs/concepts/routing), where each route is defined as a file in the `routes` directory. Routes that render HTML are defined as a JavaScript or TypeScript module that exports a JSX component:

```tsx
// routes/profile.tsx

export default function ProfilePage() {
  return (
    <main>
      <h1>My Profile</h1>
      <p>This is your profile page.</p>
    </main>
  );
}
```

Fresh sends mostly static HTML to the browser with little to no JavaScript. The framework only ships morsels of JavaScript in placeholders for dynamic components in static markup; and the small amounts of JavaScript that Fresh sends are easy to hydrate (*ie* render with appropriate dynamic event handlers) if the need arises. It's typical of the browser to handle the dynamic JavaScript components defined in Fresh's Preact separately from the markup they are subsumed in. As such, components written in Fresh are rendered in accordance with islandesque isolation.

Such components are stored in a special `islands` directory. Following is an example of an island component taken from the docs:

```typescript
// islands/Countdown.tsx

import { useEffect, useState } from "preact/hooks";

const timeFmt = new Intl.RelativeTimeFormat("en-US");

// The target date is passed as a string instead of as a `Date`, because the
// props to island components need to be JSON (de)serializable.
export default function Countdown(props: { target: string }) {
  const target = new Date(props.target);
  const [now, setNow] = useState(new Date());

  // Set up an interval to update the `now` date every second with the current
  // date as long as the component is mounted.
  useEffect(() => {
    const timer = setInterval(() => {
      setNow((now) => {
        if (now > target) {
          clearInterval(timer);
        }
        return new Date();
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [props.target]);

  // If the target date has passed, we stop counting down.
  if (now > target) {
    return <span>🎉</span>;
  }

  // Otherwise, we format the remaining time using `Intl.RelativeTimeFormat` and
  // render it.
  const secondsLeft = Math.floor((target.getTime() - now.getTime()) / 1000);
  return <span>{timeFmt.format(secondsLeft, "seconds")}</span>;
}
```

These can be used just like any other component, and Fresh will take care of mounting it client-side with the correct props.

Applications written in TypeScript with Fresh can be deployed to the edge with [Deno Deploy](https://deno.com), which you'll learn about next.

### Deno Deploy

If you want to deploy Deno applications, [Deno Deploy](https://deno.com/deploy) is a project worth considering. The brainchild of the Deno core development team, Deno Deploy is a fast, modern deployment tool for Deno applications that leverages a managed distributed server architecture. With Deno Deploy, you can make your JSX, TypeScript, JavaScript, and WebAssembly projects publicly accessible to the rest of the internet via mirrors in multiple global locations.

Deno Deploy offers a seamless deployment experience, and in under a second, you can publish your application with a single URL (and minimal configuration boilerplate). Out of the box, it supports HTTP/2, WebSockets, WebAssembly, TypeScript, JSX, and the `fetch` API.

Deploying on Deno Deploy is simple due to its [Git integration](https://deno.com/deploy/docs/deployments#git-integration). Simply push a commit to a connected GitHub repository, and a new deployment will be created.

For more information on Deno Deploy, check out the [docs](https://deno.com/deploy/docs).

### SuperDeno

Testing HTTP is a vital part of web app development to ensure that the app works correctly without errors, but it can be a daunting job due to the complex nature of HTTP request-response architecture. [SuperDeno](https://github.com/cmorten/superdeno) provides a [testing API](https://github.com/cmorten/superdeno) that can ease the job of HTTP testing.

SuperDeno is an HTTP testing assertion library that runs on top of and alongside [superagent](https://visionmedia.github.io/superagent/), a JavaScript AJAX HTTP client that's compatible with Node.js. If you've heard of [SuperTest](https://github.com/visionmedia/supertest), an HTTP assertions library for Node.js, SuperDeno has many similarities, including the API structure and the fact that they're both based on a superagent:

```javascript
// SuperDeno test structure
superdeno(app)
  .get("/user")
  .expect("Content-Type", /json/)
  .expect("Content-Length", "15")
  .expect(200)
  .end((err, res) => {
	if (err) throw err;
  });

// SuperTest test structure
request(app)
  .get('/user')
  .expect('Content-Type', /json/)
  .expect('Content-Length', '15')
  .expect(200)
  .end(function(err, res) {
	if (err) throw err;
  });
```

SuperDeno provides a fluent assertions API for testing HTTP requests and is interoperable with several testing frameworks, including those built into Deno and [Opine](https://deno.land/x/opine@2.3.3).

```typescript
// Using SuperDeno with Deno's built-in testing framework
Deno.test("GET /user responds with json", async () => {
  await superdeno(app)
	.get("/user")
	.set("Accept", "application/json")
	.expect("Content-Type", /json/)
	.expect(200);
});
```

One of the more useful properties of SuperDeno is its ability to bind an inactive server socket port to a temporary one, which allows you to test one or several endpoints on demand. This feature can be especially useful if you're testing a server you intend to roll out since SuperDeno doesn't require any significant configuration boilerplate and doesn't track any of the ephemeral ports it assigns to your server. For more information on testing servers in Deno, check out [SuperDeno's official docs](https://deno.land/x/superdeno).

### Command and Conquer

The last project on this list is [Command and Conquer](https://github.com/cacjs/cac#with-deno) (CAC), a tool for building a command line flavor of JavaScript applications. It offers an API for parsing command line arguments passable to an executable JavaScript file as well as functions where you can format console output:

```typescript
import { cac } from 'https://unpkg.com/cac/mod.ts'

const cli = cac('my-program')
cli
  .command('start', 'Start the server')
  .option('--watch', 'Watch files for changes')
  .action((options) => {
	console.log(options.watch)
  });
cli.parse();
```

CAC offers convenience features that you'd typically expect from a CLI app, including displaying [help messages](https://github.com/cacjs/cac#display-help-message-and-version), [command-specific options](https://github.com/cacjs/cac#display-help-message-and-version), and [variadic arguments](https://github.com/cacjs/cac#variadic-arguments).

CAC is especially useful for parsing arguments expressed in [dot notation](https://github.com/cacjs/cac#dot-nested-options) and is worth considering if your aim is to offer users aesthetically pleasant console interfaces.

Check out the [CAC docs](https://github.com/cacjs/cac) to get started with building console applications in Deno.

## Conclusion

In this article, you learned about five different Deno tools you can integrate into your workflow to build and test web applications with ease.

With Fresh and DenoDB, you can write performant full-stack applications capable of retrieving and modifying data persisted in a database. Super Deno lets you write performant tests for HTTP requests defined within your project, and Deno Deploy provides a convenient means of publishing your applications to the web. Finally, CAC eases the process of writing applications destined for the console.

To communicate with remote servers in Deno, consider using [Fusebit](https://fusebit.io), an API integration platform that saves you time when integrating popular APIs, like Salesforce and GitHub. It handles all the boilerplate needed to integrate with APIs in a fast and secure manner.
