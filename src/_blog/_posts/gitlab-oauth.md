---
post_title: 'GitLab OAuth: 4 Easy Steps to Implement It in Your Node.js App'
post_author: Mercy Kibet
post_author_avatar: mercy.png
date: '2022-06-19'
post_image: gitlab-oauth.png
post_excerpt: This blog post will give you an overview of GitLab OAuth and how to implement it in your Node.js web application. 
post_slug: gitlab-oauth
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related: 
  [
    'everyauth',
    'secure-your-http-apis',
    'github-oauth-apps-vs-github-apps',
  ]
---

If you’re just getting started with GitLab, it’s a good idea to familiarize yourself with the basics before diving deep into app configuration. This blog post will give you an overview of GitLab OAuth and how to implement it in your Node.js web application.

The main reason you might choose to use GitLab is that it has a pretty good open-source ecosystem. It also has a lot of documentation, which is great for beginners. I’ve used some other CI/CD platforms that didn’t have the same documentation level as GitLab. So, I appreciate how they’ve made it easy to start with their service and continue using it as you scale. GitLab supports many programming languages, including Java, Ruby, Python, .NET Core, PHP, .NET Framework, and Go. They also have detailed documentation for each language’s implementation of OAuth2. However, this post will focus solely on the Node.js implementation.

> OAuth is a way for someone to **permit you to act on their behalf** by letting you **access their resources**

## What is OAuth?

In brief, OAuth is an authentication method in which you do not have to supply any personally identifying information (ID, email address, password) but still can access the end user’s private data or resources. OAuth is a way for someone to permit you to act on their behalf by letting you access their resources. This post should clear up any of your OAuth-related doubts.

It's considered the superior authentication solution because it allows developers to focus on creating great products instead of managing authentication systems.

## What Kind of Apps Use OAuth?

OAuth is mainly used in two kinds of apps: social networks and business/enterprise applications. In social networks, the end user fully controls the application and privacy. In enterprise apps, the end user has limited control but may have different permission levels.

## What Could Go Wrong, and Why Should You Implement OAuth?

Your app may work without OAuth, but it will be easier to use if you have it. OAuth is much more secure than making requests directly. If your app makes requests without OAuth, anyone can pretend to be your app and send data or steal user data.

## How to Implement GitLab OAuth

Next, I’ll describe the most common type of OAuth implementation. There is a central service that hosts your app and gets OAuth requests. This can be GitLab or any other solution. We’ll use GitLab as an example server and client. In this implementation, the server gets client requests and handles them using its API. You will use this API to give users the ability to log in. Making API calls in Node.js is straightforward, so we’ll use Express as the API framework. It has a router object that maps the requests from origin to destination(s).

We’ll use passport-GitLab as our OAuth strategy for GitLab. Passport-GitLab uses “public” as its default strategy, which means that it does not require any information from you other than your application’s client ID and client secret (you get those when you register your app on GitLab).

Register a new app on GitLab. Add the callback URL (also known as a redirect URL) to your app and put an authorized access token as the value of oauth_token under the default scope of repo and repo: status or whatever scope you want to give access to.

### 1. Initialize your application

Initialize your Node.js application and install all the necessary dependencies. We use express, express-session, passport, and passport-gitlab2, and you install them using this command.

npm install express express-session passport passport-gitlab2

### 2. Configure your app with GitLab credentials

Next, register your app on GitLab, where you’ll get the application ID and a secret. In addition, you get to specify the scope and the redirect URL. The redirect URL is useful as it points to the user’s destination upon successful login. For our application, we do that in auth.js. Make sure you don’t share the credentials with the public.

```js
const passport = require("passport");
const GitLabStrategy = require("passport-gitlab2");

passport.use(
  new GitLabStrategy(
    {
      clientID: GITLAB_APP_ID,
      clientSecret: GITLAB_APP_SECRET,
      callbackURL: "http://localhost:3000/gitlab/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);
passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (user, cb) {
  cb(null, user);
});
```

### 3. Create relevant endpoints to mock the behavior of your app

Here, create the base URL. This is the entry point to your app. The base URL has a link that asks and redirects the user to log in with their GitLab account.

```js
const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./auth");
const app = express();
app.use(session({ secret: "secret" }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send('<a href="/gitlab">Log in with GitLab</a>');
});
```

Upon login, the remaining endpoints direct the user to the intended destination. There’s a success route that the user can access upon successful login. Alternatively, if the user enters the wrong credentials, they are sent along the failure route. Finally, when the user signs out, they are directed to the logout route. In addition, I have implemented a middleware that keeps track of the user’s login status and passes it to the success route.

```js
const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

app.get("/gitlab", passport.authenticate("gitlab", { scope: ["read_user"] }));
app.get("/gitlab/callback",
  passport.authenticate("gitlab", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  })
);

app.get("/failure", (req, res) => {
  res.send("Something went wrong. Please try again");
});

app.get("/success", isLoggedIn, (req, res) => {
  res.send(`
  ${req.user.displayName}
  You are able to access protected territory!`);
});

app.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("You are now logged out!");
});
```

### 4. Run your app

I have used nodemon to keep track of any changes in the app. It restarts whenever it detects any changes.

```js
"scripts": {
    "start":"nodemon index.js",
}
```

## How Does Gitlab Authenticate?

GitLab offers two ways to authenticate users: LDAP/Active Directory and username/password. To authenticate using the username and password format, GitLab adds a string of random characters to the user’s password before storing it in the database. This means that if you were involved in a breach of your infrastructure, you could be sure the password was not recorded. Most other enterprise-grade repositories use LDAP, so it generally provides a higher level of security than traditional username/password authentication. It’s preferable when you need to offer different privileges or access levels.

You’ll need to identify the more secure option. When choosing between an LDAP or username/password authentication, determine if your requirements are better served by one or the other. Generally, if you’re trying to manage users and their access levels as a group (such as in a single department of an organization), use LDAP.

> The new and safer OAuth 2.0 protocol is based on a **client-side identity and an access token**

## Should You Use GitLab OAuth or OAuth2?

This is a question that’s come up more and more often. There are pros and cons for both OAuth 1.0 and OAuth 2.0, but for most people, I’d suggest starting with OAuth 2.0.

The old and good enough protocol, OAuth 1.0, is based on a server’s credentials, meaning that all access to resources is granted as a user if not an identity. The client device sends an authorization request (“oauth_requested”) to the API, after which an API server will respond with “access_token” and the resource URL it needs to access. Further, the device uses the access_token to access resources.

The new and safer OAuth 2.0 protocol is based on a client-side identity and an access token. This means the device requests an access token from the API server (“oauth_request”), which it sends directly to the third-party service. As soon as the server receives this request, it will generate a server-side identity (“user_id”) and an access token from it. This is then sent back to the device to grant access to its resources. As soon as the device receives the resource URL and client ID, it can request access for itself by sending a “request_token” request to its API provider.

For example, suppose you’re working with a web application. In that case, OAuth 2.0 gives you some really interesting functionality, such as the ability to make multiple requests using one token. If you want developers to implement authentication without having to understand all the nitty-gritty quickly, OAuth 2.0 is your friend. Notably,[ Fusebit](http://www.fusebit.io) provides the same service by making your work less cumbersome.

## Conclusion

This post showed you how to set up OAuth 2.0 with Gitlab and Node.js. The tokens are also described in similar terms as an API key. They’re unique, they can be revoked, and they can be used in place of an existing password. Their purpose is to reinforce the authorization layer of a platform. The user logs into the system using the token instead of their credentials without exposing user passwords. If you want to learn more about such integrations, check out[ Fusebit.](http://www.fusebit.io)

_This post was written by Mercy Kibet. [Mercy](https://hashnode.com/@eiMJay) is a full-stack developer with a knack for learning and writing about new and intriguing tech stacks._
