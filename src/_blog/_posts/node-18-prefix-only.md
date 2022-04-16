---
post_title: Node.js 18 Introduces Prefix-Only Core Modules
post_authors: [{ name: 'Colin Ihrig', avatar: 'ColinIhrig.png' }]
date: '2022-04-16'
post_image: node-18-prefix-only-main.jpg
post_excerpt: Node.js 18 is introducing a new type of core module that can't be imported like all of the other core modules. These new modules are called prefix-only core modules, and you need to understand how they work.
post_slug: node-18-prefix-only-modules
tags: ['post', 'node.js']
post_date_in_url: false
post_og_image: 'hero'
posts_related: ['node-js-release','nodejs-https-imports','everyauth']
---

Fusebit recently shared a Node.js announcement about the [new test runner module coming to Node.js 18.0.0](https://fusebit.io/blog/node-testing-comes-to-core/), which is [scheduled for release on April 19, 2022](https://github.com/nodejs/node/pull/42262). While the test runner module is a notable change to Node.js, it brings a potentially more significant change along with it: prefix-only core modules. This post explains what prefix-only core modules are and what you need to know about them. 

Before diving into the details of this change, let's look at an example:

```js
import test from 'node:test';
import assert from 'node:assert';

test('synchronous passing test', (t) => {
  // This test passes because it does not throw an exception.
  assert.strictEqual(1, 1);
});
```

This example illustrates how the new test runner is used. However, for the purposes of this article, we're going to focus on just the first two lines of the code snippet. The first line imports the new test runner module, while the second line imports the Node.js core [`assert`](https://nodejs.org/api/assert.html) module.

Note the `'node:'` prefix used in the `'node:test'` and `'node:assert'` module identifiers. If you haven't seen this notation before, it may look strange at first. You're probably more familiar with the following syntax, which does not utilize the prefix:

```js
import assert from 'assert';
// Or in CommonJS:
const assert = require('assert');
```

As it turns out, all core modules can be imported using the `'node:'` prefix. But, why would you want to use this more verbose naming convention? The biggest reason is to make it explicit that a module comes from Node.js core. Because userland modules cannot be loaded via the `'node:'` prefix, it becomes immediately obvious to tools and people reading the code that the module is from Node.js core.

## Introducing Prefix-Only Core Modules

Until now, all core modules functioned the same regardless of whether the `'node:'` prefix was used or not. In other words, there was no difference between importing `'fs'` and `'node:fs'`. However, with the introduction of the test runner module this is no longer the case.

`'node:test'` is the first core module that can only be imported using the `'node:'` prefix. In order to use Node's new test runner, you must import `'node:test'`. If the `'node:'` prefix is not included, Node.js will attempt to load a module named `test` from userland instead.

For backwards compatibility purposes, the behavior of all other core modules remains unchanged. In other words, the `import` statements from the original code sample can be rewritten like this:

```js
import test from 'node:test';  // Uses the node: prefix. Loads from core.
import assert from 'assert';  // Does not use the node: prefix. Loads from core.
```

However, the following imports will not load the same code:

```js
import test from 'test';  // Does not use the node: prefix. Tries to load from userland.
import assert from 'assert';  // Does not use the node: prefix. Loads from core.
```
## The Upside

As previously mentioned, the explicit distinction between Node core modules and userland modules is the biggest benefit of prefix-only modules. For the Node.js core project, this change also makes it significantly easier to introduce new modules. Because core modules take precedence over userland modules during module loading, introducing a new core module has historically been treated as a breaking change and sometimes involved reaching out to npm module authors to negotiate the use of a module name. Prefix-only core modules provide a clear delineation between core and userland, reducing much of the friction involved in adding a new core module.

Using `'node:'` as a namespacing mechanism also allows new core modules to be introduced with more appealing names. For example, the new test runner was able to claim the name `'test'` instead of something longer like `'test_runner'` because there was no chance of a naming conflict.

## Potential Pitfalls

Although the Node.js project has discussed prefix-only modules for a while, adopting them has been a somewhat contentious process because they come with potentially significant drawbacks. The first drawback is the introduction of inconsistency in the module system. While, `'fs'`, `'http'`, and all of the other existing core modules exhibit one behavior, `'node:test'` and likely all future core modules exhibit a subtly different behavior. This difference in behavior is likely to confuse even experienced Node.js users.

The biggest drawback of prefix-only core modules is that they open Node.js users up to a new variation of a [typosquatting](https://en.wikipedia.org/wiki/Typosquatting) attack. Typosquatting attacks against npm involve publishing malicious code under a module whose name is a common misspelling of a popular npm package. A theoretical example would be targeting `'express'` users by publishing a malicious, intentionally misspelled, `'expres'` package. It is worth noting that npm has some built-in typosquatting protections, and automatically blocks modules like this from being published.

In March of 2022, [JFrog reported a large-scale attack targeting the `@azure` scope on npm](https://jfrog.com/blog/large-scale-npm-attack-targets-azure-developers-with-malicious-packages/). Over 200 packages were published whose names matched packages under the `@azure` scope, minus the actual scope. While the number of core modules is relatively small, it is easy to imagine a malicious user attempting a similar attack against the `'node:'` prefix in the future. There is already evidence that Node.js users sometimes attempt to install core modules even though they are compiled into the `node` binary. For example, the [`'fs'`](https://www.npmjs.com/package/fs) module on npm contains no functionality, but is downloaded over a million times weekly.

## Conclusion

After a lot of discussion, and even [voting twice](https://github.com/nodejs/TSC/pull/1206), the Node.js project has decided to ship prefix-only core modules beginning in Node.js v18. At the time of writing, the new test runner is the only core module that is prefix-only. Because the test runner is still considered an experimental feature, anything about it, including the module name, is theoretically still subject to change. However, it looks like prefix-only core modules are likely here to stay. Moving forward, it will be important for Node.js users to understand the implications of prefix-only modules in order to protect themselves from attacks such as typosquatting. 

If you have any questions, please feel free to reach out to me on Twitter [@cjihrig](https://twitter.com/cjihrig) and follow [@fusebit.io](https://twitter.com/fusebitio) for the latest in Node.js, JavaScript, and API integrations.
