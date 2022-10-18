---
post_title: How Deno's Third-Party Module System Can Keep Your App Secure
post_author: Arek Nawo
post_author_avatar: arek.png
date: '2022-10-18'
post_image: deno-third-party-module.png
post_excerpt: Read this blog post and learn how the module system works and how it can benefit app developers with safe practices.
post_slug: deno-third-party-module-system
tags: ['post', 'deno']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'is-EdgeDB-the-future',
    'what-is-deno',
    'webworkers',
  ]
---

[Deno](https://deno.land/) is a modern [Rust](https://www.rust-lang.org/)- and [V8](https://v8.dev/)-based runtime for JavaScript, TypeScript, and WebAssembly. It was originally announced in 2018 as a project of Ryan Dahl—previously the creator of Node.js—and then [released as v1.0 in 2020](https://deno.com/blog/v1).

The runtime is meant to fix issues found in its [Node.js](https://nodejs.org/) predecessor, especially improving app security with the “secure by default” approach and custom permissions system.

In this article, you'll learn how Deno can keep your app safe and secure using its permissions and third-party module systems.

## What Is Deno?

On the surface, Deno might seem like a simple Node.js alternative, but in reality, it offers a unique architecture and multiple improvements over its older counterpart.

### TypeScript

One of the biggest differences with Deno is its built-in support for TypeScript. As more developers come to use and appreciate the strongly typed JavaScript, the additional setup that TypeScript requires for compilers, bundlers, and other elements is increasingly a pain point. Deno's out-of-the-box support for TypeScript not only fixes that problem but also makes the entire experience more friendly and fine-tuned for TypeScript users.

### Security

Compared to Node.js, Deno focuses much more on ensuring the safety and security of your code. In line with its “secure by default” approach, Deno introduces a [permissions system](https://deno.land/manual/getting_started/permissions) that allows access to sensitive APIs like filesystem or networking only when you provide specific flags/permissions. Thanks to that, you can be sure that whatever third-party code you're using will only have access to the parts of the system that are most required.

### Ease of Use

The best way to summarize other features of Deno is “convenience.” Apart from the built-in TypeScript support, Deno has other advantages—both small and big—that, when taken together, make using the runtime more enjoyable by providing a familiar, developer-friendly experience.

#### Web APIs

One example of its ease of use is its adoption of [web platform APIs](https://deno.land/manual/runtime/web_platform_apis). Instead of creating custom APIs that developers might have to learn from the ground up, Deno implements standardized Web APIs that web developers are familiar with from their experience in the browser environment. There are some deviations from the specification, and not all Web APIs are available (some because they don't make much sense on the backend). Still, this generally allows developers to get going with Deno much more quickly.

#### Single Executable

Another advantage of Deno that's especially nice when setting up is that the entire runtime and more fit within a [single executable](https://deno.land/manual/getting_started/installation). In one package, you get not only the runtime but also a complete suite of [built-in tooling](https://deno.land/manual/tools) for everything from code formatting, documenting, and linting to bundling and benchmarking.

## Deno's Third-Party Module System

While a list of Deno's differentiating factors is impressive, the biggest improvement it offers is its [third-party module system](https://deno.land/manual/linking_to_external_code).

Instead of using a package manager and a storing folder like `node_modules`, Deno allows you to import code directly from URLs—an approach very similar to ESM imports in modern browsers:

```javascript
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

assertEquals("hello", "hello");
assertEquals("world", "world");

console.log("Asserted! ✓");
```

When you execute the program, Deno automatically downloads, compiles, and caches all your dependencies in a location specified by `DENO_DIR` or, by default, in the system's cache directory.

To verify the integrity of dependencies between development and production environments, you can create a lock file using the `--lock` flag. On top of that, you can also use the built-in `deno vendor` command to download all remote dependencies into the local `vendor` folder.

### Benefits of Deno's Third-Party Module System

Compared to Node.js, Deno's third-party module system has quite a few advantages.

#### Convenience

While importing modules with URLs might not feel good right away, it's certainly more convenient than the traditional approach found in Node.js. For starters, there's no package manager, `package.json` file, or `node_modules` folder to worry about. You don't have to worry about yet another piece of software like npm, Yarn, or pnpm; the enormous size of your `node_modules`; or maintaining a package file. Want to add a module? Just copy over the URL, and you're ready to go.

#### Flexibility

As your Deno project grows, you might find tracking all the different dependency URLs more difficult. How can you ensure you didn't import the same module from two separate locations or with different versions?

The beauty of this approach is that you have the flexibility and complete control to manage your dependencies in the way you like. For example, the method recommended by Deno is to create a single `deps.ts` file and make it re-export all your dependencies. This solution has the advantage of being optional and lets you arrange your dependencies in any way you want (for example, splitting them by categories). The `deps.ts` file can then serve as a flexible alternative to Node.js's `package.json` file.

#### Security

Deno's “secure by default” approach and permissions also apply to external modules. On top of that, you can also use the previously mentioned lock file to control the integrity of your dependencies and the `deno vendor` command if you want to be assured your dependencies won't change.

Deno's third-party module system offers other security advantages that originate from its architecture. For example, you can version-lock a dependency just by using the correct URL.

```javascript
// Import without version-lock
import { Application } from "https://deno.land/x/oak/mod.ts";

// Import with version-lock
import * as oak from "https://deno.land/x/oak@v11.1.0/mod.ts";
```

The source of the third-party modules you use is also decentralized by default, meaning you don't have to worry about your app going down just because of a single company or individual.

With that said, if you want to stick to a single registry, Deno has something for you too.

### Deno's Third-Party Module Registry

Deno's official module registry—[deno.land/x](https://deno.land/x)—is your go-to place for all things Deno. When using third-party modules from this registry, you can be sure they were created with Deno in mind, and you don't have to worry about sudden code changes or API rate limits.

There are several other advantages worth noting.

#### Immutable Code

On Deno's registry, module versions are persistent and immutable. This means that if you link to a particular module version, you can be sure that it won't be edited or deleted. If you forgot about a version and defaulted to the latest, Deno will remind you to use a version tag with a warning.

#### Easy Publishing

In case you want to publish your own module to the registry, all you need to do is [register a webhook in your repo](https://deno.land/add_module). After that, Deno will automatically fetch and save the code on every new release tag.

#### First-Party Registry

Apart from mentioned advantages, there are a few more that stem from [deno.land/x](https://deno.land/x) being the first-party service. The best example is integrated documentation from the `deno doc` generator. You can see it for every module in the package while browsing its source code. More such features, integrating Deno's tooling with the registry, are [planned for the future](https://deno.com/blog/registry2#future-plans).

## Conclusion

As you can see, Deno's third-party module system is not only unique but also secure, flexible, and convenient. With its architecture, Deno aims to create an environment that provides a complete experience in a single package, with easy access to all third-party modules available online and no `node_modules` folder or `package.json` file to worry about. If this sounds interesting to you, consider giving Deno a try.

Deno is one of many tools available to improve your developer experience. Another is [Fusebit](https://fusebit.io/), an API integration platform designed to save you development time. It enables you to more smoothly integrate popular APIs like Salesforce and GitHub into your application by handling all the necessary boilerplate both quickly and securely. Check out the [documentation](https://developer.fusebit.io/docs) to learn more.
