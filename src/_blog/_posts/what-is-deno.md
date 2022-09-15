---
post_title: What Is Deno and Why You Should Try It 
post_author: James Walker
post_author_avatar: james_walker.png
date: '2022-09-15'
post_image: deno.png
post_excerpt: Learn the basics of what the Deno runtime environment is all about, and highlight the key features, benefits, and detractions.
post_slug: what-is-deno
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'is-EdgeDB-the-future',
    'webworkers',
    'credential-management',
  ]
---

[Deno](https://deno.land) is a modern JavaScript runtime that's been developed as an alternative to the established [Node.js](https://nodejs.org/en). Ryan Dahl, the creator of Node.js, is behind Deno as well. The project is intended to address some of Node's limitations that have become apparent over the thirteen years since its introduction.

Deno is more closely aligned with contemporary code standards. It has built-in support for [TypeScript](https://www.typescriptlang.org) and [WebAssembly](https://webassembly.org), offers decentralized package management, and places a strong emphasis on security. Deno runs code in a sandbox that lacks filesystem and network access unless you explicitly enable it.

In this article, you'll learn about the perspective that Deno's taking, the unique features it includes, and its advantages and drawbacks compared to Node.js. You'll then be able to make an informed decision about which runtime to use for your next project.

## Deno's History

The 2009 introduction of Node.js is generally credited with transforming JavaScript from a browser scripting tool into a general purpose programming language. JavaScript is now widely used for server-side code as well as desktop applications created in higher-level frameworks like [Electron](https://www.electronjs.org).

Although Node.js has become [one of the most popular and successful](https://stackoverflow.blog/2021/10/25/node-js-makes-fullstack-programming-easy-with-server-side-javascript) programming environments, the runtime isn't a perfect solution. Many of its design choices are now starting to show their age. Modern JavaScript has moved on since 2009, supplemented by broader changes in the software development industry. Security, supply chain weaknesses, and developer experience are now prominent concerns for many teams.

Dahl announced Deno in 2018 as a Node.js rethink that addresses the [regrets and challenges](https://www.infoq.com/news/2018/12/deno-v8-typescript/) that the community has experienced. These couldn't now be accommodated inside the original project because their scope would cause massive breaking changes. Hence, Deno was launched as an alternative solution that's completely free of Node's baggage.

## Installing Deno

Deno is distributed as a single executable that bundles all its own dependencies. It's available for Windows, macOS, and Linux via a direct download or most popular package managers.

The installation script is the simplest route to get Deno running on Mac and Linux systems:

```
$ curl -fsSL https://deno.land/install.sh | sh
```

This will install Deno to the `.deno` folder inside your home directory. Add this location to your `PATH` so you can use the `deno` command without specifying the full path to your binary. Edit your `~/.bashrc` (or equivalent for your shell) and add the following lines at the bottom:

```
export DENO_INSTALL="$HOME/.deno"
export PATH="$PATH:$DENO_INSTALL/bin"
```

Open a new shell window and try the `deno` command:

```
$ deno
Deno 1.24.2
exit using ctrl+d or close()
>
```

You'll be dropped into an interactive REPL where you can run JavaScript code:

```
> console.log("Hello World");
Hello World
undefined
```

Exit the REPL by pressing Ctrl+D or calling `close()`:

```
> close()
```

You can run an existing JavaScript file with the `deno run` command:

```
$ echo "console.log('Hello World');" > hello.js
$ deno run hello.js
Hello World
```

## Deno Features

The Deno runtime has several unique features that make it a good candidate for JavaScript development. All of the capabilities you'll learn about below are built into Deno's executable, so they don't need to be enabled individually.

### It’s Secure by Default

Arguably the most significant feature is Deno's approach to security. This is also one of the biggest departures from Node.js. Deno uses a secure-by-default model that blocks off potentially problematic operations until they're explicitly enabled at runtime.

Processes launched by Deno are executed with restricted permissions. They're unable to access the host's filesystem, network interfaces, or environment. This helps guard against hostile code that you run from untrusted sources.

Here's a simple piece of code that makes a network request:

```javascript
fetch("https://example.com");
```

Copy the sample and save it to a file called `fetch.js` in your working directory. Running this code with Deno will show the following prompt:

```
$ deno run fetch.js
⚠️  ️Deno requests net access to "example.com". Run again with --allow-net to bypass this prompt.
   Allow? [y/n (y = yes allow, n = no deny)]
```

You're warned that the program is attempting to access the network and you must explicitly allow access to continue. Since interactive prompts aren't viable for production workloads, you can use the `--allow-net` flag to opt in when you start the process instead:

```
$ deno run fetch.js --allow-net
```

Similar prompts and flags protect other permissions such as file reads and writes, the creation of subprocesses, and access to dynamic libraries. These can be extremely specific in some cases, such as `--allow-read=/app/content` to permit reading—but not writing—the contents of a single directory tree.

This security model is advantageous for companies running sensitive applications. Omitting the `--allow-net` flag when you know your code doesn't make network calls reduces your attack surface. You can confidently deploy without the risk of compromised dependencies performing nefarious actions.

### It’s Based on Web Standards

Deno is designed to align with the web platform APIs used by JavaScript code running in a browser. There's [standards-compliant support](https://deno.land/manual/runtime/web_platform_apis) for many of the most popular modern web APIs, including [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [Web Storage](https://deno.land/manual/runtime/web_storage_api.md), [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Worker), and [Broadcast Channel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel). Deno even has an [event listener](https://deno.land/manual/runtime/web_platform_apis#customevent-eventtarget-and-eventlistener) system that's akin to the established browser DOM APIs.

The similarity of these implementations with their web-based originals makes it easier to write code that targets both Deno backend systems and client-side browser applications. You can take existing JavaScript code for the web and run it in Deno; conversely, it shouldn't take too much refactoring to make a Deno application work in a browser. This can help to reduce development time.

### It Has Decentralized Package Management with Deno Modules

Deno takes a decentralized approach to package management and module imports. It can import external code [directly from URLs](https://deno.land/manual/linking_to_external_code). You can load dependencies from wherever they're hosted, whether it's the vendor's website, a source repository, or an external package system. Deno's own [standard library](https://doc.deno.land/https://deno.land/std@0.151.0) is referenced with the same URL-based method.

Deno uses the standards-based [`import`/`export` module syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) introduced with JavaScript ES6. To reference code from a remote package, you can use a statement similar to this:

```javascript
import {sum} from "https://example.com/packages/sum/sum.js";

// 4
console.log(sum(2, 2));
```

The way in which Deno handles modules is one of its biggest departures from Node.js. Most Node code uses CommonJS module syntax similar to the following:

```javascript
const fs = require("fs");
```

Node does now support ES6 imports, but their use isn't consistent in the community. ES6's syntax arrived long after Node.js and CommonJS were established, so a full migration could be years in the making, if it ever happens. Node.js dependencies are almost always installed using the [npm package manager](https://www.npmjs.com), either from the central public registry or a private server, which also stands in stark contrast to Deno's expectation that modules are referenced directly via their URLs.

### It Includes TypeScript and Built-In Developer Tools

Nowadays it's common for applications to be written in [TypeScript](https://www.typescriptlang.org), a strongly typed JavaScript superset with development led by Microsoft. TypeScript is transpiled back to JavaScript before it's executed.

Node.js doesn't understand TypeScript, so you need to perform the transpilation using a separate tool before you run your code. Meanwhile, Deno integrates TypeScript into the runtime so you can run `.ts` files directly. Just point the `deno run` command at your source:

```
$ deno run typescript.ts
```

This results in a more fluid development experience for projects based on TypeScript. Built-in transpilation also lowers the learning curve for newcomers who could be unfamiliar with the TypeScript CLI.

Deno also comes with a comprehensive [suite of developer tools](https://deno.land/manual/tools) including a linter, documentation generator, code formatter, and dependency inspector. Together, these reduce the boilerplate you need to start a new project. You can begin writing code and then use `deno` subcommands to immediately review it, without setting up any third-party utilities.

### It Works with Node.js Code

Adopting Deno doesn't mean you have to refactor all your Node.js code. Deno has a [compatibility layer](https://deno.land/std@0.112.0/node) that can help you transition. It provides implementations of the most common Node.js standard library modules.

The `deno run` command accepts an optional [`--compat` flag](https://deno.land/manual@v1.17.0/npm_nodejs/compatibility_mode) that will execute your code in Node.js compatibility mode. The flag instructs Deno to provide an environment that's configured with familiar Node.js globals such as `process` and `Buffer`.

Compatibility mode isn't perfect, but it can run many unmodified Node.js programs. You can use it as a starting point in your migration to lessen the initial refactoring workload.

## Deno vs. Node.js: Which Should You Use?

Node.js is the most established JavaScript runtime outside of web browsers. Its ubiquity means you can tap into a world-class community of experienced developers. The Node.js package ecosystem, built around [npm](https://www.npmjs.com), is expansive and easy to manage. This means Node is often the best choice when familiarity and compatibility are your primary concerns.

Node hasn't gotten everything right, though. Deno makes improvements in several key areas, particularly around security and standards compliance. Deno's nature as a single binary means it's more portable than Node, while the open-ended module system might prove to be the future normal for dependency imports.

Deno can be the better choice for new applications that don't need to interface with much existing code. It's a production-ready technology supported by an expansive standard library and a complete set of built-in developer tools. With Deno, you can develop your application's functionality more efficiently using technologies such as TypeScript, while reusing a greater proportion of your work across different platforms.

What's holding Deno back? At the moment, it's because of the same reasons that Node.js continues to dominate. Deno's community may be active, but it remains relatively small. There are comparatively few packages designed for Deno, and the Node.js compatibility layer won't work in every situation. This could leave you at a disadvantage if you want to use a particular library or if you need some support.

## Conclusion

Deno is a modern alternative to Node.js that attempts to address many of the older project's shortcomings. Deno has a tight security model, integrated TypeScript support, and interoperability with Node code. Activity around the project is growing, with major companies including [Amazon, IBM, and Microsoft](https://github.com/denoland/deno/wiki#companies-interested-in-deno) publicly stating their interest. Deno is also taking the step of offering its own [web framework](https://fresh.deno.dev) to counter the Node.js offerings.   

Deno is a compelling choice for new applications, but Node.js remains a worthy contender. You might want to stick with Node.js because you can continue consuming npm packages in the familiar way or because there's so much community support available. You don't need to migrate existing applications unless you've recognized a particular need. Both Deno and Node.js have bright futures ahead, with each being independently maintained.

Whether you choose Node.js or Deno, keep in mind that neither has built-in options for integrating with third-party APIs. While you can manually integrate by making network calls and using official SDKs, this becomes tedious when you need to support several different services. [Fusebit](https://fusebit.io) is an API integration platform that can connect popular APIs such as GitHub, Salesforce, Slack, and Jira to your code. Fusebit handles the boilerplate for you, freeing up engineering teams to focus on the unique aspects of your integration. [Request a demo](https://fusebit.io/#demo) to learn more.

Fusebit will also run Deno, soon! Did you know? Deno is adding native support for npm modules—this is huge news and gets us very excited!

To celebrate this, we’re working on adding Deno support directly to Fusebit—this means your favorite integrations platform will include out-of-box compatibility with TypeScript, faster runtimes, and direct import of modules!

If this excites you, and you are considering Deno to power your application, join the waiting list to get early access to our beta release.
