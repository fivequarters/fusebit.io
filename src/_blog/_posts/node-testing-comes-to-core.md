---
post_title: 'A Built-in Test Runner is coming to Node Core, What is it? and why should you care?'
post_author: Shehzad Akbar
Post_author_avatar: shehzad.png
date: '2022-03-22'
post_image: blog-node-testing.png
post_excerpt: Node.js is adding a built-in testing module to Node core. It will come in the form of a new node test module that exposes an API for creating, and executing JavaScript tests. 
post_slug: node-testing-comes-to-core
tags: ['node.js']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-node-testing.png 
posts_related: ['nodejs-https-imports','node-fetch','monkey-patching-http-request']
---

Node.js is adding a built-in testing module to Node core. It will come in the form of a new `node:test` module that exposes an API for creating, and executing JavaScript tests. As the tests execute, the results will be output using standard [TAP](https://testanything.org/) format.

This is early in the development stage and things can change drastically, [follow the conversation](https://github.com/nodejs/node/pull/42325) along in Github. It's also available in [nightly builds](https://nodejs.org/download/nightly/v18.0.0-nightly20220324094b2ae9ba/) released after the 24th of March, 2022.

In this post, I’ll go through the details of this new feature and I’ll also make sure to send out an update when the feature is officially released. Follow us on [Twitter](https://twitter.com/fusebitio) to be notified when!

## Why a Built-in Test Runner? 

Testing is a critical part of all non-trivial software development practices, and with Javascript being a dynamic language, it becomes even more important to make sure all your _units_ are covered. 

Currently, Node.js doesn’t have a test runner out-of-box that supports unit testing and, as a result, third-party testing frameworks, such as [Mocha](https://mochajs.org/) or [Jest](https://jestjs.io/), have gained popularity over time. However, the use of external libraries adds complexity to your environment configurations and CI/CD workflows, as well as adding maintenance overhead.

Additionally, figuring out which tool to choose can be really troublesome. While some frameworks are great at getting you set up quickly and running tests with minimal effort, they may not necessarily have features like support for async testing or auto-mocking. Other tools may have these capabilities, but might not be as straightforward to set up or lack robust community support to help troubleshoot issues. 

You get the idea…

By adding a built-in test runner as a part of Node.js core, the intention is to enable a **limited** subset of the functionality provided by all/most test frameworks in a lightweight manner. This way, users can get started really quickly right from the beginning, and then add functionality on top as needed.

## How Does It Work?

A new module called `node:test`will be shipped as a core Node module. While the current iteration only supports executing individual test files, the plan is to eventaully allow you to use a `--test` flag to automatically execute all tests defined in a configuration. 

```javascript
const test = require('node:test');

test('synchronous passing test', (t) => {
  // This test passes because it does not throw an exception.
  assert.strictEqual(1, 1);

});
```

There are a few salient design considerations in the current approach:



* Node will execute all files containing test modules when started with the `--test` flag. The test files will run in isolation.
* Tests within a file can be synchronous or asynchronous. 
    * Synchronous tests will be considered passing if they do not throw an exception. 
    * Asynchronous tests will return a Promise, and will be considered passing if the returned Promise does not reject.
* The test context's test() method allows subtests to be created, each subtest will perform exactly like the top-level test function.
* Individual tests can be skipped by passing the skip option to the test or calling the test context's skip() method.

The actual method is fairly minimalistic, `test([name][, options][, fn])`, and returns a Promise once the test completes.  

For instance, you would skip a test like so: 


```javascript
test('skip option with message', { skip: 'this is skipped' }, (t) => {
  // This code is never executed.
});
```

Or, you can pass in separate subtests like so:

```javascript
test('top level test', async (t) => {
  await t.test('subtest 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('subtest 2', (t) => {
    assert.strictEqual(2, 2);
  });

});
```

It’s fairly straightforward to understand, but here’s a quick outline of the different parameters.



* `name` - the name output to the report
* `options` - any configurations needed for the test itself. It currently supports three properties:
    * `concurrency {number}` - define how many tests to run in parallel
    * `skip {boolean|string}` - skip if True, and print string to the output report (if it exists)
    * `todo {boolean|string}` - if True, mark test as todo and print string to the output report (if it exists)
* fn - the actual test function itself, which will take a `TestContext` object as an argument. The TestContext object passed to the fn argument can be used to perform actions such as skipping the test, adding additional TAP diagnostic information, or creating subtests.

## When Can I Use It?

[Colin](https://twitter.com/cjihrig), the architect behind this initiative, has indicated that it will be available behind an experimental flag when Node 18 is pushed out, which is currently scheduled for April 19th. 

It's also available in [nightly builds](https://nodejs.org/download/nightly/v18.0.0-nightly20220324094b2ae9ba/) released after the 24th of March, 2022.

We’ll send out a note on our [Twitter](https://twitter.com/fusebitio) when Node 18 is released so be sure to follow us!

## Conclusion

If you have any questions, you can reach out to me directly through our [community Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg), on [Twitter](https://twitter.com/shehzadakbar) and at [shehzad@fusebit.io](mailto:shehzad@fusebit.io).