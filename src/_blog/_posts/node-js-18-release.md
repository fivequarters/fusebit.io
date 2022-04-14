---
post_title: Node.js 18 Release - Top New Features
post_author: Shehzad Akbar
post_author_avatar: shehzad.png
date: '2022-04-14'
post_image: blog-njs18-hero.png
post_excerpt : node-18 is finally here, and fusebit has been following what’s included for months now. Read our summaries of the big features in this latest Node release.
post_slug: node-18-release
tags: ['post', 'nodejs']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-njs18-hero.png
posts_related: ['run-every-nodejs-version-in-lambda','run-nodejs-from-google-sheets',’undici-mocking’]
---

Node.js 18 is finally here! 

We’ve been following this release for a few months now and have also written summaries of the big key features coming out. Here’s a quick recap of our explorations of the major changes coming in this latest release:
- [fetch() API](https://fusebit.io/blog/node-fetch/) - fetch() is a promise-based client that supports many high-level HTTP features, while also focusing on the most common scenario: sending simplified HTTP requests. To those coming from the browser world, it is similar to XMLHttpRequest, but standardized and with an expanded and more flexible feature set. 
- [Test Runner](https://fusebit.io/blog/node-testing-comes-to-core/) (experimental) - A built-in testing module to Node core, behind an experimental flag for now. It will come in the form of a new `node:test` module that exposes an API for creating, and executing JavaScript tests. 
- [Direct Network Imports](https://fusebit.io/blog/nodejs-https-imports/) (experimental) - There will now be support for direct network imports, behind an experimental flag for now. This enables you to use HTTPS URLs to directly import modules over HTTPS into your project at run-time instead of relying on a package manager to install at build-time. 

In other notable upgrades, you can also look forward to: 
- [Webstreams API](https://github.com/nodejs/node/pull/42225), [Blob](https://github.com/nodejs/node/pull/41270) and [BroadcastChannel](https://github.com/nodejs/node/pull/41271) have graduated out of experimental and are now available globally by default.
- `headersTimeout` and `requestTimeout` [logic has been added](https://github.com/nodejs/node/pull/41263) to automatically close any open connections no longer needed.
- The V8 engine is being [updated to version 10.1](https://github.com/nodejs/node/pull/41610). This new version includes the `findLast` and `findLastIndex` array methods, improvements to the `Intl.Locale` API, The `Intl.supportedValuesOf` function and performance upgrades to the class fields and private class methods (the initialization of them is now as fast as ordinary property stores).

Notable misses: 

- The addition of a [Command-line Argument Parsing API](https://github.com/nodejs/node/pull/42675) almost made it in to this release, but should be rolled out in the next minor release within the next few weeks.

For more details and a full commit list of what made it in, you can head over directly into the [release PR](https://github.com/nodejs/node/pull/42262) for Node.js 18! **A huge shoutout**to [Beth Griggs](https://twitter.com/bethgriggs_) and the entire Node.js Release Working Group for making the entire process extremely organized and easy to follow.

## Want More Node.js Updates?

Fusebit is an integration platform built for developers like yourself and it’s also powered entirely by Node.js. As a result, we dedicate time to making sure we are active in the community and take deeper looks into any upcoming features. We also stay on top of other Node.js initiatives such as [next-10](https://github.com/nodejs/next-10) to get a sense of where the platform is headed.

If you like reading about Node.js and are interested in learning more about where it is headed, follow us on [twitter](https://twitter.com/fusebitio).
