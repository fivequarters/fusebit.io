---
post_title: Node 18 Release - Top New Features
post_author: Shehzad Akbar
post_author_avatar: shehzad.png
date: '2022-04-19'
post_image: blog-njs18-hero.png
post_excerpt : node-18 is finally here, and fusebit has been following what’s included for months now. Read our summaries of the big features in this latest Node release.
post_slug: node-18-release
tags: ['post', 'node.js']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-njs18-hero.png
posts_related: ['node-18-prefix-only-modules','run-every-nodejs-version-in-lambda',’undici-mocking’]
---

Node.js 18 is here and we are super excited to see it released on April 19th, 2022! Read through for a recap of the new features available in this latest release. 

## Node.js 18 Features Overview

We've been following this release for a few months now and documenting our analysis of some of the big new features. Here's a quick recap of those articles:

- [fetch() API](https://fusebit.io/blog/node-fetch/) - fetch() is a promise-based client that supports many high-level HTTP features, while also focusing on the most common scenario: sending simplified HTTP requests. To those coming from the browser world, it is similar to XMLHttpRequest, but standardized and with an expanded and more flexible feature set. 
- [Test Runner](https://fusebit.io/blog/node-testing-comes-to-core/) (experimental) - A built-in testing module to Node core, behind an experimental flag for now. It will come in the form of a new `node:test` module that exposes an API for creating, and executing JavaScript tests. 
- [Prefix-only core Modules](https://fusebit.io/blog/node-18-prefix-only-modules/) - A new way to 'import' modules that levrages a 'node:' prefix which makes it immediately obvious that the modules are from Node.js core. Test runner is the first feature to use this in action! 
- [Direct Network Imports](https://fusebit.io/blog/nodejs-https-imports/) (experimental) - There will now be support for direct network imports, behind an experimental flag for now. This enables you to use HTTPS URLs to directly import modules over HTTPS into your project at run-time instead of relying on a package manager to install at build-time. 

### Other Notable Changes

- [Webstreams API](https://github.com/nodejs/node/pull/42225), [Blob](https://github.com/nodejs/node/pull/41270) and [BroadcastChannel](https://github.com/nodejs/node/pull/41271) have graduated out of experimental and are now available globally by default.
- `headersTimeout` and `requestTimeout` [logic has been added](https://github.com/nodejs/node/pull/41263) to automatically close any open connections no longer needed.
- The V8 engine is being [updated to version 10.1](https://github.com/nodejs/node/pull/41610). This new version includes the `findLast` and `findLastIndex` array methods, improvements to the `Intl.Locale` API, The `Intl.supportedValuesOf` function and performance upgrades to the class fields and private class methods.

### Notable misses 

- The addition of a [Command-line Argument Parsing API](https://github.com/nodejs/node/pull/42675) almost made it in to this release, but should be rolled out in the next minor release within the next few weeks.

For more details and a full commit list of what made it in, you can head over directly into the [release PR](https://github.com/nodejs/node/pull/42262) for Node.js 18! **A huge shoutout** to [Beth Griggs](https://twitter.com/bethgriggs_) and the entire Node.js Release Working Group for making the entire process extremely organized and easy to follow.

## Want More Node.js Updates?

Fusebit is an integration platform built for developers like yourself and it’s also powered entirely by Node.js. As a result, we dedicate time to making sure we are active in the community and take deeper looks into any upcoming features. We also stay on top of other Node.js initiatives such as [next-10](https://github.com/nodejs/next-10) to get a sense of where the platform is headed.

If you like reading about Node.js and are interested in learning more about where it is headed, follow us on [twitter](https://twitter.com/fusebitio).
