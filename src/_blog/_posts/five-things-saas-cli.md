---
post_title: Five Things not to do When Building your SaaS CLI
post_author: Benn Bollay
post_author_avatar: benn.png
date: '2022-03-11'
post_image: blog-building-saas-cli.jpg
post_excerpt: If you decide to make a command line tool for your SaaS, great! Here’s a list of things _not_ to do!
post_slug: building-saas-cli
tags: ['post', 'Developer Tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-building-saas-cli.jpg
---

## Introduction

Congratulations! Your infrastructure SaaS application has become sufficiently popular that people are now trying to use it _for real_ instead of the little toy projects they’d been doing before. After several requests, you realize that everyone has to create these Frankensteinian horrors of shell scripts, curl, and god-knows-what to perform some pretty basic tasks in automation, and it’s really slowing down interest and adoption.

You decide to make a command line tool for your SaaS.  Great!  Here’s a list of things _not_ to do!
## 1. Implement your own CLI tooling (or doc system)

Don’t implement your own CLI commands from scratch.  Anything to do with the terminal, parsing the command line, dealing with ncurses and terminal compatibility issues, and then trying to make all of that work cross-platform… no way!

Here’s a set of great libraries in the JavaScript ecosystem that you can use.  Any one of them will probably be good enough - take a look through each of their READMEs and see what makes the most sense for you from a design perspective:

  * [Commander.js](https://github.com/tj/commander.js)
  * [Shargs](https://github.com/Yord/shargs)
  * [Yargs](https://github.com/yargs/yargs)
  * [Caporal.js](https://github.com/mattallty/Caporal.js)
  * [Ink](https://github.com/vadimdemedes/ink)
  * [OCLIf](https://oCLIf.io/)

*Bonus*: all of these support `help` or other kind of doc system. You can also add `man` pages, especially with examples, for the more complicated tools!
## 2. Neglect your testing environment

You’ve decided to lean hard on React and have chosen [Ink](https://github.com/vadimdemedes/ink) to build your command line interface. Now, don’t just create it and throw it over the wall - add test cases and test coverage as well!

Let’s look at a variety of approaches you can use.

### a. The simple approach

The simplest approach is to use a bunch of shell scripts surrounding your CLI and the [expect or autoexpect](https://likegeeks.com/expect-command/) tools to issue a command and then `expect` a specific response in the output.  Simple, straightforward, and very fast to do some quick-and-dirty validation tests.

Generally, though, expect-based tests tend not to scale well, are moderately fragile, and require substantial shell-code experience to get right.

### b. Slightly-more-mature

As a slight step up from `expect`, you can use [jest](https://jestjs.io/) (or some other JavaScript test tool) and [spawn](https://nodejs.org/api/child_process.html) to invoke the CLI and then validate the response contains the expected parameters.  This is only slightly better than the shellscript approach, in that you get to write JavaScript or TypeScript code, and it intersects coherently with your existing test infrastructure.

Still not generally recommended, except in very limited end-to-end test scenarios.

### c. Tactically coherent

As a more sophisticated approach to leveraging [jest](https://jestjs.io/), you can directly `require`/`import` the code from your CLI into your test cases.  This lets you get around to testing your parsing library - you don’t need to write ink tests , for example! - and call functions directly in the implementation of each of the commands.

A fine approach, especially if your CLI is largely composed of many small commands with few options or parameters.

### d. Fully integrated

Each of the different libraries mentioned above supports some kind of `Command` object that is used to specify the parameters, help text, etc. of the command in question.  In addition to deep-importing the implementation, you can also import the command objects themselves.  This allows you to perform a more integrated testing - supplying actual parameters and the like - that will more closely mirror user parameters.
## 3. Ignore semver/release notes

It’s easy to look at a CLI and think that the version largely doesn’t matter because humans can quickly solve for small changes.  However, it’s safe to say that the version of a CLI matters just as much as any other library!  The most common user of a CLI in this modern era is not a human, surprisingly, but instead other tools.  Automation like CI/CD infrastructure, testing tooling, deployment artifacts, and others all expect a consistent set of rules and versions.

Violating semver guidance on a command-line tool is a fast way to bring down your customer's deployment infrastructure.  As such, any changes to parameters or command line options should be treated as a minor change, if not a major, to communicate clearly to your customers that there is additional tooling work that should be done to support that version.

## 4. Inconsistent verbs, parameters, or configuration components

Instead of using different verbs based on what “feels good” for your CLI, use very consistent subcommand verbs across the product, even if it’s a little awkward at times. If you use `get` and `set` to retrieve user profiles, for example, then also use `get` and `set` for your integration functions, even if `pull` and `push` might feel better suited, given the underlying mechanics of the operations involved.

It’s better to be weird and consistent than perfectly logical but a guessing game for your users.

Learning a CLI is a discovery process, primarily rooted in the human brain.  The more you can do to make it easy for users to extrapolate behaviors in novel sections, the faster they’ll adopt it. And, as we all know, adoption is good!

## 5. Build your CLI to reflect your API, instead of your user/automation tasks

Sure, you could build your CLI to be a one-for-one match with your API - there are definitely some that are simply cleaner wrappers around `curl` or `superagent` calls - but remember that you’re solving for tasks, not just hitting endpoints.

Think of the CLI as a butler or assistant - what tasks are your users going to have to do that are common?  What tasks will the CI/CD tools have to do on every build?

Write those out and plan your set of features accordingly.  Don’t expose HTTP calls directly, and don’t expect the user to pass JSON on the command line either (looking at you, AWS CLI!).  You have a filesystem and all of the support of the user - make use of those elements to make the hard things trivial, and the impossible things merely difficult.

*Pro-tip*: Sometimes, it’s really nice to be able to specify resources - specifications, code, etc. - via a URL to an HTTP endpoint rather than requiring them to be on the filesystem!  Don’t feel like you have to engineer-in-advance of the feature, but keep an eye out for little things like that to simplify your customer's experience. 
## (Bonus!) 6. Forget about authorization mechanisms and integrations

It’s hard to remember that your customer still needs to authenticate the CLI, just like they authenticate the browser when using your dashboard!  There are a couple of models to be aware of:

  1. Authenticating as an end user
  1. Authenticating as _different_ end users
  1. Authenticating as a service (like CI/CD)

While your user model may not support these things, it’s worthwhile to have a “profile” concept in your CLI that allows users to specify multiple sets of APK keys, credentials and identities when interacting with your application. This will enable developers to have test environments,  separate CI/CD credentials from user credentials, and so forth.

Here at Fusebit, we support two different types of authentication: OAuth, and Private Key (PKI).  For OAuth, we use the [Auth0 device authorization flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-device-authorization-flow) and some fancy printing to render a QR code in the CLI itself.  It works really well and lets users share their account between the CLI and the GUI trivially!

We also support PKI so that CI/CD and other automated, headless deployments can leverage the CLI without worrying about refresh tokens or other setup aspects.  We’ve found that using PKI to mint JWTs with permissions also extended our capabilities with the API in a bunch of other interesting directions - custom URLs with carefully minted JWTs allow us to “assume” different identities in our GUI from the command line, for example!

Let us know if you’d like to hear more about that :)

## To wrap up…

Hopefully, you’ll find the above code and implementation details helpful!  Don’t hesitate to reach out if you have any questions, and we’ll be happy to help push through.  You can find me on the [Fusebit Discord](https://discord.gg/SN4rhhCH), our [community Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg), and at [benn@fusebit.io](mailto:benn@fusebit.io).