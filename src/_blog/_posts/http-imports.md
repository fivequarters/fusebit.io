---
post_title: Node.js Adds Support for Direct Registry-less HTTPS Imports
post_author: Shehzad Akbar
post_author_avatar: shehzad.png
date: '2022-02-23'
post_image: blog-http-imports-main.jpg
post_excerpt: Node is planning to introduce support for HTTPS imports in Node 18 - a feature that enables you to use urls to directly import modules over HTTPS into your project.
post_slug: nodejs-https-imports
tags: ['post', 'Developer Tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-http-imports-main.jpg
---

Node is planning to introduce support for [HTTPS imports](https://github.com/nodejs/node/pull/36328) in Node 18 - a feature that enables you to use URLs to directly import modules over HTTPS into your project.

Note: This is currently available in experimental mode and things can change drastically, you can follow the conversation [along here](https://github.com/nodejs/node/discussions/36430).

In this post, I’ll go through the details of the new feature (as it currently stands) and walk you through an example that you can use to get set up yourself as well.

## What is HTTPS Imports?

Importing modules into your project traditionally requires using a package manager where you host your modules in a registry, and then before deploying your application, go through an installation process to import those modules into your code. 

With HTTPS Imports, you are now able to import modules directly into your code through the use of direct URLs like so:

```javascript
import fusebitValueProp from "https://msakbar.github.io/fusebitValueProp.js"
```


## How does it work? 

We looked through the code in the PR and ran through it to get a better sense of how it’s currently set up. Here are a few things we noticed:


* There is no impact to how `package.json` works with your existing import setup, this is an additive functionality that sits on top as an extra way you can import external modules.
* Imported modules must conform to [ESM standards](https://nodejs.org/api/esm.html) and return `application/javascript` as the MIME type. Additionally, you must add `“type”:”module”` to your `package.json` file, or else it will fail to load.
* Modules, when loaded, are stored in memory but not on disk. This means that every time you restart your node application, it will download the files again. 
* HTTP is limited to loopback addresses only meaning you can only use it for localhost, otherwise you must use HTTPS links.
* `Authorization`, `Cookie`, and `Proxy-Authorization` headers are not sent to the server and, CORS policies/headers are not sent or enforced either. 


## Why should you care?

Aside from the obvious ability to fire up a Node.js app without having to pre-install anything, the changes planned with HTTPS Imports are aimed at improving developer quality of life in a few ways:

* **Ability To Use The Same Module In Node And The Browser:** Right now, If you have a web application and want to run it in Node, you have to migrate all the non-node modules to packages and then write up an import map so that they can work with Node.
  * With HTTPS Imports, you can keep the same modules and use them in any environment without having to re-package them for Node.
* **Respond Quicker To Vulnerabilities in Real Time:** Right now, if there’s a vulnerability in any of the modules within your application, you have to patch a fix, re-install and re-deploy your application across all servers.
  * With HTTPS Imports, you can update the source file with the fix and your servers will be able to download the latest version immediately for use in your application.
* **Dramatically Reduce Your Application Footprint:** Right now, the process to add a module to your codebase requires going through a manual installation process (using npm install) which imports the whole folder, including unnecessary files, into your application within the node_modules folder.
  * With HTTPS Imports, you can specify the exact files you need and have them synced to a local cache upon usage, keeping your application footprint small.


## Things to consider…

Using package managers and centralized entities like NPM to import modules provides a certain level of stability and security for your codebase. By allowing direct imports from remote servers, you bypass some of the implicit checks built into these centralized ecosystems and open up some vulnerabilities that need to be considered. 

For instance, the server you’re pulling from might be unavailable due to an outage or jeopardized by a malicious attack, leaving your application exposed. There are some mitigations you can put in place to guard against this:
- You can leverage node’s [policies feature](https://nodejs.org/dist/latest/docs/api/policy.html#policies) to enforce  integrity checks on downloaded files. Note that this means that you would also lose the ability to automatically update a file from the server as the new file would have a new hash.
- Additionally, you can also consider implementing caching strategies and fallback mechanisms, however, this requires manual consideration and configuration for each source that you’re importing from. 

A good principle to follow would be to try and stick to reliable sources that you can trust so you can leverage the benefits of direct imports, and if you are unsure about the source - then implement stricter safeguards to prevent any issues with your application.

Another thing to consider is that you may be tempted to try and use popular CDNs that host JavaScript ESM-compatible modules such as [https://esm.run](https://esm.run) or [https://unpkg.com](https://unpkg.com). After all, part of the promise of this feature is that the same modules can now work client-and server-side. However, as of Node 17.6, the current implenentation fails when accessing CDN-hosted modules, due to [an issue](https://github.com/nodejs/node/issues/42098) that is actively being worked on.

## How do I use it?

You can run `node --experimental-network-imports` and then use import without needing any additional modules when the feature ships. This feature is currently available behind a flag in [Node 17.6](https://nodejs.org/dist/v17.6.0) and later versions.

Here’s a quick guide, with a sample URL, to get you going:

```javascript
import fusebitValueProp from "https://msakbar.github.io/fusebitValueProp.js" ;

console.log(fusebitValueProp());  
```

* Edit your `package.json` file to include: `”type”:”module”`
* Run node with the flag enabled: `node --experimental-network-imports fusebit-network-imports.js` 

Now you can change the URL in your code, or the file without having to re-install your node app. You can simply restart your app and it will import the module again! 

We will update this post as the feature leaves the experimental stage, and also share via [@fusebito](https://twitter.com/fusebitio), so follow us for updates.


## Everynode on AWS? 

Hey! Did you know that Fusebit has a nifty tool that allows you to run any version of Node.js on AWS Lambda? [Read more about this here](https://fusebit.io/blog/run-every-nodejs-version-in-lambda/)! And follow us on [twitter](https://twitter.com/fusebitio)
