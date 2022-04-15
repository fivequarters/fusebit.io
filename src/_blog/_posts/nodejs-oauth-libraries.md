---
post_title: Which Node.js OAuth Library Does Your App Need? 
post_author: Shehzad Akbar
post_author_avatar: shehzad.png
date: '2022-04-14'
post_image: blog-nodejs-oauth-libraries-hero.png
post_excerpt : Finding a Node.js OAuth Library for your app gets confusing really quickly. Read this post to learn about the more popular options and what they each do.
post_slug: nodejs-oauth-libraries
tags: ['post', 'nodejs', 'authentication']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-nodejs-oauth-libraries-hero.png
posts_related: ['everyauth','oauth-refresh-token-best-practices','node-js-18-release'] 
---

OAuth is an open-standard security framework that lets you authorize different applications to speak to one another and gain access to protected resources. Work on this first started in 2006 as part of Twitter’s efforts to develop its OpenID implementation. Since then, it has evolved with the internet and is almost the de-facto online standard used for authentication and authorization.

When considering different OAuth libraries to use in your Node.js app, you want to have a good understanding of exactly what you are building first. 

* Are you building a backend service only? Or is there also a front-end component to it as well?
* Is it a Single Page App (SPA), or will it be a more traditional web app with a backend server and a frontend client? 
* Will there be support for native apps on mobile devices, or will it be web browsers only?
* Are you only authenticating users in your app? Or do you also require integrations with other third-party applications like Hubspot, QuickBooks Online, or Google Calendar? 

If you already know what you need, trying to find a library gets confusing very quickly as they all refer to themselves as OAuth libraries but each have very different use cases altogether. It’s usually not very clear exactly what they do unless you look deep into their codebase or documentation.

In this post, I take a look into the landscape of the different options available and outline the key use cases of some of the more popular Node.js OAuth libraries (based on npm weekly downloads and GitHub stars) to help you make this choice more easily. 

## [Passport-OAuth](https://www.npmjs.com/package/passport-oauth)

Passport is a widely used library and is a general-purpose authentication middleware for Node.js backends. It has roughly one and a half million weekly downloads on [npm](https://www.npmjs.com/package/passport) and over twenty thousand stars on [GitHub](https://github.com/jaredhanson/passport).

> If you’re building a backend service and want to protect your routes with an authentication layer, then this is the library for you. 

Passport’s approach is simple: you provide it a request to authenticate, and it provides hooks for controlling what occurs when authentication succeeds or fails. Because different providers have different flows and mechanisms for authentication, your backend will need to handle each situation appropriately. 

To deal with this, Passport leverages an extensible set of plugins known as strategies that you can import into your app. Strategies can range from verifying username and password credentials, delegated authentication using OAuth (for example, via Facebook or Twitter), or federated authentication using OpenID. 

There are over **500 strategies** to choose from, and you can look through [this comprehensive list](https://www.passportjs.org/packages/) to find which ones you need. In there, you will be able to find dedicated packages for [OAuth](https://www.npmjs.com/package/passport-oauth), but there are also community-provided packages that are provider-specific such as [Microsoft](https://www.npmjs.com/package/passport-microsoft) or [Github](https://www.npmjs.com/package/passport-github) as well.

## [OAuth2-server](https://github.com/oauthjs/node-oauth2-server)

[OAuth2-Server](https://github.com/oauthjs/node-oauth2-server) is a framework-agnostic module for implementing an OAuth 2.0 server with Node.js. It averages about sixty thousand weekly downloads on [npm](https://github.com/oauthjs/node-oauth2-server) and has over three and a half thousand stars on [GitHub](https://github.com/oauthjs/node-oauth2-server).

> If you’re looking to build your own OAuth Authentication server that will be used to generate, sign and manage authorization codes, access tokens and refresh tokens for other apps, then this is the library for you.

Although the module itself is framework-agnostic there are several officially supported wrappers available for popular HTTP server frameworks such as [Express](https://www.npmjs.com/package/express-oauth-server) and [Koa](https://www.npmjs.com/package/koa-oauth-server). It comes with built-in support for all the OAuth 2.0 flows including `authorization_code`, `client_credentials`, `refresh_token` and `password grant`, as well as `extension grants`, with `scopes`.

Additionally, because it’s designed specifically for Node.js, it can be used with promises, Node-style callbacks, ES6 generators, and async/await (using Babel). As a bonus, it also plugs in easily to any existing storage solution (MySQL, MongoDB, etc.) that you are using.

One thing to mention, however, is that the library itself isn’t maintained very actively, so there may be bugs and issues that go unresolved for some time.

## [Simple-OAuth2](https://www.npmjs.com/package/simple-oauth2)

Simple-OAuth2 is a simple Node.js client library specifically for the OAuth 2.0 protocol. It also has about ninety thousand weekly downloads on [npm](https://www.npmjs.com/package/simple-oauth2) and about one and a half thousand stars on [GitHub](https://github.com/lelylan/simple-oauth2).

> If you are building a web app that requires performing common OAuth tasks without worrying about the implementation details, then this is the library for you.

The idea is that with minimal configuration, you can create a client instance, containing the configuration credentials for an OAuth server, of any supported Grant Type. Once a Grant Type has been accepted, your app will automatically obtain a new access token from that server and also refresh, or revoke, it as needed. 

Supported Grant Types include: 
* Authorization Code Grant, used by confidential and public clients to exchange an authorization code for an access token. 
* Resource Owner Password Credentials grant type is a way to exchange a user's credentials (username and password) for an access token. 
* Client Credentials grant type is used by clients to obtain an access token outside of the context of a user. This is typically used by clients to access resources about themselves rather than to access a user's resources.

## [Grant](https://www.npmjs.com/package/grant) 

Grant provides support for over 200 different OAuth providers, without having to import extra plugins or separate modules into your codebase.It has about ninety thousand weekly downloads on [npm](https://www.npmjs.com/package/grant) and about three and a half thousand stars on [GitHub](https://github.com/simov/grant).

> If you’re building a backend service and want to protect your routes with an authentication layer that works with a number of different providers, then this is the library for you

Grant is able to support so many providers without the need for any glue code by passing provider-specific configurations as JSON objects. By leveraging this simple but powerful configuration data structure, it opens up the doors for all kinds of interesting use cases such as:
* Static configuration per environment
* Nested static sub configurations per provider
* Dynamic configuration per authorization attempt

This makes Grant a completely transparent OAuth proxy for any grant type that can be configured over HTTP via GET and POST requests. This means it doesn’t only work with javascript or Node.js infrastructures, you can communicate with any programming language such as Golang, Rust, etc. as well

## [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) (Honorable Mention)

With almost ten million weekly downloads on [npm](https://www.npmjs.com/package/jsonwebtoken) and over fifteen thousand stars on [GitHub](https://github.com/auth0/node-jsonwebtoken), it is an extremely popular library. But jsonwebtoken is hyperfocused on JSON Web Tokens, or JWTs, only. JWTs are an open industry standard for sharing encrypted access tokens between two parties and are a core part of the OAuth framework as well.

> If you are looking for a very specific library that will sign, create, validate and decode JWTs but do nothing else, then this is the library for you. 

Just remember that it doesn’t directly solve for OAuth in your app as it is a much lower level library that will likely sit deep in an authorization server as a utility tool - but given that it shows up in search results as a library for OAuth and it’s extremely popular, I felt it was important to briefly touch upon it in this article.

## Final Thoughts

When considering what OAuth library to use for your Node.js application, it’s essential to have a good understanding of exactly what you are building first so you know what library will work best for your needs. 

Searching for OAuth libraries gets really confusing as they all use the same keyword but provide vastly different functionalities. I hope my article was able to help you get a better understanding of what option works best for you!

If you have any questions, you can reach out to me directly through our [community Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg), on [Twitter](https://twitter.com/shehzadakbar) and at [shehzad@fusebit.io](mailto:shehzad@fusebit.io). If you want more Node.js developer posts, follow [@fusebitio](https://twitter.com/fusebitio) on Twitter.
