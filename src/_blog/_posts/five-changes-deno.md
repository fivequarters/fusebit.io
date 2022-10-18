---
post_title: 5 Changes Coming Soon to Deno
post_author: Jude Ero
post_author_avatar: jude.png
date: '2022-10-18'
post_image: changes-comming-to-deno.png
post_excerpt: Read this blog post and learn the highlight 5 key improvements to Deno in releases in 2022.
post_slug: changes-comming-to-deno
tags: ['post', 'deno']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'what-is-deno',
    'webworkers',
    'is-EdgeDB-the-future',
  ]
---

[Deno](https://deno.land) is a secure and modern runtime for JavaScript and TypeScript built on the JavaScript [V8 Chrome Engine](https://en.wikipedia.org/wiki/V8_(JavaScript_engine). It's often compared with [Node.js](https://nodejs.org/en/) because they have common origins and address the same problem. However, Deno exists because of problems identified in Node.js.

Upon release in 2009, Node.js received an enthusiastic reception from the JavaScript community and rapidly gained popularity. However, the initial release of Node.js lacked built-in support for [JavaScript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). It also lacked support for static typing, which increases the difficulty associated with creating complex applications.

In addition, Node.js has a complicated system of file resolution and requires the user to host large modules on the client side. Moreover, the centralized open source package manager for Node.js, [npm](https://www.npmjs.com), has increasingly been recognized as a source of security vulnerabilities.

Deno attempts to solve these problems by supporting Promises out of the box and having [top-level await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await). It also has a TypeScript compiler and provides support for static typing. It fetches external libraries via URL imports instead of using a centralized repository, and by design, security is placed ahead of all considerations. Deno has a team of developers who actively work on the codebase and constantly push out new releases to improve the product.

In this article, you'll learn more about Deno and five key improvements that Deno is currently working on. The overarching goal of these proposals is to improve the technology and make it easier for developers to write securer code. All the improvements discussed here are planned for release in version 2.0 of Deno, except for npm specifiers, which is a feature already implemented in the most recent Deno release (version 1.25).

## What Is Deno

As previously stated, Deno is an alternative server-side runtime designed as an improvement and alternative to Node.js. It's a versatile tool that can be used to build a wide variety of applications, including HTTP servers, web frameworks, chat applications and command line tools, plug-ins, and extensions.

Deno differs from Node.js in its security model, method of file resolution, use of a TypeScript compiler, presence of a formatter, and availability of a standard library. Its maintainers have consistently expressed the desire to place security and ease of use ahead of other considerations when designing and implementing functionality.

## Benefits of Deno

Deno has a few major benefits over Node.js, including the following:

### Ease of Use

Deno ships as a single executable file. This means that it does away with complicated tooling associated with Node.js. For instance, Deno binaries are easily distributed and support cross-compilation on major platforms (including Windows, Mac, and Linux). In addition, Deno fetches external modules via [URL imports](https://deno.land/manual@v1.25.2/linking_to_external_code). Any URL can contain a package, and anyone can host an HTTP server that references a library.

With Deno, there's no need to download package managers like npm, no dependence on a centralized repository, and no requirement to host large node modules.

### Security

Deno is advertised as secure by default. Explicit permission must be granted to a user to run scripts, read or write to files, and access environmental variables or network services. This design means that malicious scripts cannot easily gain access to the file system or directories and execute commands.

### Support for TypeScript

Deno natively supports TypeScript. This, in turn, allows the use of static typing, the generation of more optimized code, and the creation of robust applications. Deno can be used with confidence to build mission-critical software.

### Built-In Standard Library

Deno has an extensive [standard library](https://deno.land/std@0.153.0?doc) with modules maintained by the core team. There are tools and utilities for file manipulation, cryptography, date/datetime, and media objects.

The modules of the standard library are self-contained, requiring no external dependencies. This provides a work-around for the problem of dependency injection users can experience with Node.js.

### Top-Level Await

Deno supports top-level await. This permits the use of the `await` syntax in the global scope (*ie* outside async functions). Modules assume the behavior of async functions, delaying execution of child modules until they have finished loading and Promises are resolved. Sibling modules continue uninterrupted, simplifying the writing of asynchronous code.

## 5 Changes Coming Soon to Deno

Following, you'll learn about five changes Deno is working on to improve its product in 2022.

### Resolve Executable Specifiers in Allowlists and Queries

The proposed feature to [resolve executable specifiers in allowlists and queries](https://github.com/denoland/deno/pull/14130) extends the behavior of `--allow-run`, one of the [permission commands](https://deno.land/manual@v1.25.2/getting_started/permissions) required to execute scripts in Deno.

When `--allow-run` is called on a file, Deno checks the file against an [allowlist](https://deno.land/manual@v1.6.3/getting_started/permissions#permissions-allow-list) created by the user to log permission data. Currently, only the name of the file(s) that have permission to be run is stored on the allowlist. This new proposal calls for the *path* to the file(s) to be stored on the allowlist as well.

To understand why this is important, consider the following scenario where a user executes a script named `myFile.ts` with the command `deno run`. You can check the allowlist using the [`PermissionDescriptor`](https://doc.deno.land/deno/stable/~/Deno.Permissions#Methods), an API that defines permission and can be queried, requested, or revoked.

On startup, if `--allow-run` is specified and `myFile.ts` is found in the `$PATH` environment variable, only `RunPermissionDescriptor :: Name("myFile.ts")` is added to the allowlist but not `RunPermissionDescriptor :: Path(which("myFile.ts"))`.

Similarly, at runtime, if run permissions for `myFile.ts` are queried and `myFile.ts` is present in `$PATH`, only `RunPermissionDescriptor :: Name("myFile.ts")` will qualify in the allowlist.

This means that Deno checks that the file passed matches one with the same name on the allowlist. However, it does not add the path to that file on the list, and it does not check for it.

[Techniques exist](https://github.com/denoland/deno/issues/14122) for an attacker to add a new directory containing its own version of `myFile.ts` to `$PATH`, which would be accepted because the name is valid. In addition, directories in `$PATH` already have run permission, and the attacker can execute malicious commands.

With the proposed feature, on startup, Deno will add `RunPermissionDescriptor :: Path(which("myFile.ts"))` to the allowlist as well, and at runtime, Deno will check for the full path of the executable. This will prevent unauthorized files from being loaded and executed.

### Skip Type Checking by Default in Deno CLI

As you may know, Deno provides full support for TypeScript. At runtime, when a user invokes the commands `deno run`, `deno test`, `deno cache`, or `deno bundle`, TypeScript type checking is automatically initiated, and the compiler will issue error declarations. If the errors are variable-type data declarations, it will halt compilation until the errors are rectified.

There are good arguments for disabling the default TypeScript compiler on the CLI. For instance, TypeScript compilation is expensive and causes bottlenecks when it comes to runtime speed. [Benchmark tests](https://deno.land/benchmarks#type-checking) indicate that it takes one to two seconds for the compiler to type check as opposed to one hundred milliseconds to transpile directly in TypeScript.

However, you may not always need type checking. Some users may want to run simple scripts (*ie* outside of production) and may seek to avoid the overhead imposed by type checking, especially when positive diagnostics can lead to termination of the program.

In addition, modern integrated development environments (IDEs) implement TypeScript type checking for scripts, so it's available to those who want it.

On the Deno CLI, it's already possible to switch type checking off with the flag `--no-check`. In future versions of Deno (2.0 onward), [type checking on the CLI will not be the default](https://github.com/denoland/deno/issues/11340). Instead, users will be required to opt in by using the `--check` flag.

### Detached Processes in Deno

A process is a running instance of a command. In Deno processes are  referred to as a [workers](https://deno.land/manual@v1.25.3/runtime/workers). Child processes are processes launched from other processes.

The implementation of many features in Deno borrows heavily from [POSIX standards](https://subscription.packtpub.com/book/web-development/9781800205666/2/ch02lvl1sec05/architecture-and-technologies-that-support-deno). On UNIX operating systems, each process has a separate process ID (PID). The parent process is the leader of the process group and a session, and it will share its process group ID (PGID) and session ID (SID) with its children. Deno child processes inherit the `stidn`, `stout`, and `stderr` of the parent.

Starting a subprocess in Deno is straightforward:

```js
#subprocess_example.ts

const cmd = ["echo", "hello"];
const sub_process = Deno.run({ cmd });
await sub_process.status();

# Run the above from the terminal
$ deno run –allow-run ./subprocess_example.
```

Child processes will normally be terminated when the parent process is stopped unless they are *detached*. A detached process will uncouple from its parent, allowing it to execute independently. It then becomes the new leader of a process group and session.

[Detached processes](https://github.com/denoland/deno/issues/5501) are convenient when you need to ensure that a program will not be stopped if the parent process exits; for instance, when running batch scripts or cron jobs, or hosting an API.

Deno currently has no way of creating a detached process. Instead, a user must spawn a new process if they want it to be independent. However, [a proposal is under consideration](https://github.com/denoland/deno/issues/5501) that could add detached processes in version 2.0.

### Add --allow-import=<allow_list> for Checking Dynamic Imports/Workers

Deno operates in a sandbox by default and requires the user to ask for permission to read or write to files and access network objects or environment variables.

For example, if you want to read a file that has dynamic imports, executing this script requires multiple permissions for all files involved:

 ```js
 // mainFile.ts
 
 console.log("Hello from the main typescript file");
 const a = await import("./fileToImportFrom.ts"); 
 console.log(a);
 
 
 // fileToImportFrom.ts
 
 import "./subdir/firstFile.ts";
 import "./subdir/secondFile.ts";
 import { join } from "https://deno.land/std@0.75.0/path/mod.ts";
 
 export ...
 
 $ deno run --allow-read=fileToImportFrom.ts, subdir/ --allow-net=deno.land main.ts
 ```

When working with large scripts that contain a lot of imports, the list of specified files and required permissions can become unwieldy. A user may want to run a script quickly without incurring all that overhead.

In [future versions of Deno](https://github.com/denoland/deno/issues/8266), you'll be able to run the same code with a simplified invocation:

```
 $ deno run --allow-import=fileToImportFrom.ts main.ts
```

This is more succinct and removes the need to specify subdirectories in addition to read, write, and net permissions.

### Support npm Specifiers

The standard method for including external code in Deno applications is through URL imports. Most third-party code is currently obtained through the Deno standard library. However, Deno does provide support to pull code from the Node.js package manager. Moreover, since version 1.25 was released, the functionality to permit the use of npm specifiers has also been added.

Integration with npm is important since it remains the largest software repository in the world, with many valuable code libraries.

To use npm specifiers, you need to call `npm`, along with the package name and an optional version and subpath:

```
npm:<package-name>[@<version-requirement>][/<sub-path>]
```

Scripts that use this feature must be run by passing the `--unstable` flag (which indicates a feature in development that may still have unresolved issues and bugs), in addition to any other requisite permissions. npm specifiers work on Deno scripts and the command line interface.

Following is an example that uses [Moment.js](https://momentjs.com), a JavaScript library for manipulating date and time objects. Here, it's imported into a script by passing its name and version number to get and parse the current date, time, and locale:

 ```js
 // timeFile.ts
 
 import moment from "npm:moment @2.29.4";
 
 const todaysDate = new Date();
 const formattedDate = moment(todaysDate).format("LLL");
 console.log(todays_Date);
 
 console.log(`The formatted date is ${formattedDate}`);
 console.log(`The locale is "${moment.locale()}
 
 $ deno run --unstable --allow-read --allow-env timeFile.ts
 
 *2022-09-02T22:38:02.475Z*
 *The formatted date is September 2, 2022 11:38 PM*
 *The locale is "en"*
 ```

Notice how efficiently and elegantly Deno handles this. There's no need to install npm beforehand, and no large node modules are generated.

You can learn more about npm specifiers and other recently added features in the latest [Deno release](https://Deno.com/blog/v1.25).

## Conclusion

[Deno](https://deno.land) is a new and exciting runtime for JavaScript and TypeScript that is secure, performant, easy to use, and a great alternative to Node.js.

In this article, you learned about some of the new changes to Deno, including npm specifiers, a proposal to disable type checking on the CLI, and the ability to create detached processes. To find out about more planned features, you can visit the [GitHub project page](https://github.com/denoland/deno/labels/feat).

If you're a professional developer or hobbyist programmer, check out [Fusebit](https://fusebit.io/). Fusebit is the leading multi-tenant application platform for app builders. It saves you time when integrating popular APIs, like [Salesforce](https://www.salesforce.com/) and GitHub, by handling all the boilerplate needed in a fast and secure manner.
