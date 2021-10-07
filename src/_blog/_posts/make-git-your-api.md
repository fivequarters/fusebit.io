---
post_title: Make Git Your API
post_author: Tomasz Janczuk
post_author_avatar: tomek.png
date: '2021-10-06'
post_image: blog-make-git-your-api-main.png
post_excerpt: When designing HTTP APIs for your application, it sometimes makes sense to embrace git as a part of the protocol.
post_slug: make-git-your-api
tags: ['notag']
post_date_in_url: false
---

When designing HTTP APIs for your application, it sometimes makes sense to embrace git as a part of the protocol. This post describes your options and introduces [fusebit/cloud-git](https://github.com/fusebit/cloud-git), a pure JavaScript git server implementation for Node.js that lets you easily add git endpoints to your Express app. 

## Consider using git as part of your APIs

If your application operates on data that your users naturally manage using a source control system like git, adding first-class git support to your APIs may be a good idea.

A few examples of applications that could benefit from git-enabled APIs are:
* A hosting platform that accepts source code as input.
* A blogging platform that accepts markup files. 
* A workflow management system that accepts workflow definition and configuration. 

The benefit of providing a git-enabled API surface in your app is to embrace your users’ existing source control processes and tools. Doing so reduces the friction of using your system by simplifying the operational burden for your users. 

Examples of well-executed git-enabled applications include Heroku and GitHub Pages. All it takes for users of these platforms to deploy new applications or content is to run `git push`, which is the operation they already use to manage the source code or markup.

## Two ways of supporting git in your application

There are two ways of supporting git in your application: you can integrate with a third-party git provider like GitHub or support git protocol as part of your own API surface. 
Integration with a third-party git provider (GitHub)

The typical design for integrating with a third-party git provider like GitHub assumes your users use it as their primary source control system. You then ask your users to authorize your application to access their GitHub repository, and register a webhook so that your application is notified when they deploy new code: 

![Diagram: Integration with a third-party git provider](blog-make-git-your-api-5-way.png "Integration with a third-party git provider")

Pros:
* Embrace an existing git platform that your users’ processes are based on.
* Less complexity and maintenance around the source of truth for you.

Cons: 
* Although GitHub is the key cloud player, your users may be using another git platform, or an in-house system (for a variety of reasons, including data residency, privacy, or compliance; requirements you are likely to encounter if your app is B2B). 
* You depend on a third party for some (or all) of your app’s functionality. 
* Implementation and operational complexity of maintaining GitHub credentials and healthy integrations for the many users of your app. 

## Support git protocol as part of your own API surface

In this approach, you are providing a git server implementation as part of your own API surface.  While your users may still use GitHub or another git provider in their daily operations, your system is the source of truth for the purpose of your service:

![Diagram: Support git protocol as part of your own API surface](blog-make-git-your-api-2-way.png "Support git protocol as part of your own API surface")

Pros:
* Your system is the source of truth and does not depend on any third-party for your SLA.
* Control and flexibility in supporting your user’s privacy and data residency requirements.
* You still embrace your users’ existing processes around any third-party (GitHub) or in-house git platform, given that the git system is distributed. 
* No complexity related to managing an integration with an external service. 

Cons:
* Creates one extra step in the process for your users.
* You are now on the hook for the SLA for the new git HTTP APIs you added.

## How to support git as part of your APIs?

If you choose to add first-class git support to your own APIs, the [fusebit/cloud-git](https://github.com/fusebit/cloud-git) project may come in handy. It provides a lightweight, pure JavaScript implementation of the git protocol that enables you to add git endpoints to your Node.js application. 

The cloud-git project was envisioned with cloud-first applications in mind. If you are working on an app to be distributed in the SaaS format, you are likely hosted in one of the major cloud providers. The cloud-git project does the heavy lifting by implementing the smart git protocol for you while giving you the flexibility to choose your cloud-native storage solution for the data. It may be AWS S3, Azure Blob Storage, Google Cloud Storage, or any other storage solution you are using in your application.

The documentation at [fusebit/cloud-git](https://github.com/fusebit/cloud-git) provides all you need, but here is the overview of using cloud-git to expose a git repository as an endpoint in your Express application: 

In your server.js:

```javascript
const Express = require("express");
const { MemoryGitRepository } = require("@fusebit/cloud-git");

const app = Express();
app.use("/git", new MemoryGitRepository().createExpress(Express));

require("http").createServer(app).listen(3000);
```

Your users can then call your git APIs using standard git clients aligned with their daily workflow, for example: 

```bash
mkdir test
cd test
git init
echo "Hello, world" > hello
git add .
git commit -am "first checkin"
git remote add origin http://yourapplication.com/git
git push origin master
```

The cloud-git project addresses other requirements common in building multi-tenant cloud-first applications, including authentication and support for multi-tenancy (multiple repositories). Check out the [fusebit/cloud-git](https://github.com/fusebit/cloud-git) repo for details. 

## Integration with third party git provider (e.g. GitHub)

If you choose to integrate with a third party git provider like GitHub instead of adding git support to your APIs directly using a project like fusebit/git-cloud, [Fusebit](httsp://fusebit.io) may help. Fusebit provides a developer-friendly integration platform. We are a company created by developers for developers.  We'd like to [hear from you](https://twitter.com/fusebitio) if you need to add integrations to your app, including GitHub. Or get a friendly click. 
