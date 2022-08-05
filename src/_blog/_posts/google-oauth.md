---
post_title: 'Google OAuth: Everything You Need to Start Using It'
post_author: Mercy Kibet
post_author_avatar: mercy.png
date: '2022-08-04'
post_image: google-oauth-main.png
post_excerpt: Learn to create a Node.js app that can complete the authentication process using Google OAuth, and everything you need to know to use it.
post_slug: google-oauth
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'oauth-state-parameters-nodejs',
    'gitlab-oauth',
    'slack-oauth',
  ]
---

Implementing authentication in an app is a common task that most developers will encounter at some point in their careers. This post will talk about creating a Node.js app that can complete the authentication process using Google OAuth, as well as everything you need to know to use it. We’ll use Google’s API to log in users with their Google accounts, although many other third-party providers are available with similar APIs. 

However, before we start, let’s talk about authentication and authorization on the web, and why it’s important for any application you’re building. 

## What Is Authorization?

Authorization is the process of limiting access to an application based on the user’s role. Based on their privileges, you grant different access levels to these roles in the application. 

For instance, a CEO can see all records, an employee can only see their personal information, and a shop assistant can only view their records. The most common setup for this is to create a system where each user logs into your app and is prompted via email each time they return. This method works fine, but it forces you to have a complicated system that must be updated whenever someone wants to log in from a new computer or a different email address. 

Let's look at how a typical authorization flow works in practice. The user clicks on a link or receives an authentication prompt, asking the user for permission to build an app that can access the service provided by Google (for example). The app requesting permission produces a unique string of characters (typically referred to as **OAuth_Redirect_URL**) and then presents the string to the service provider for approval of the request. This is when the user can review what the app will be able to access and decide whether or not to allow it to proceed. Once approved, Google redirects to the **OAuth_Redirect_URL** string and passes along an access token tied specifically to the requesting application (in our Node.js web app). 

For this article, we’ll take advantage of Google’s [OAuth 2.0](https://fusebit.io/blog/oauth-refresh-token-best-practices/), which lets you offload this task for your end users and lets them log in only once with their Google account. 

## What Is Google OAuth?

OAuth is an open protocol that lets users log in with their Google account and gives our app access to the user’s information without letting our application know the user’s password. Because of this, we don’t have to worry about sending password information to or from our server, which means we can keep that data secure. Every OAuth module has: 

* **The client** - This is the individual attempting to log in.
* **The consumer -** This is the application the individual wants to access (for instance, your app).
* **The service provider** - This is the individual’s external program for identification (Google, in our case).

Our main tasks in this post will be to: 

1. Use Google’s OAuth 2.0 to get a token you can use to show your users their profile information and allow them to sign in/out of your app.
2. Use Google’s API to access the user’s profile information.

The API we’ll use is **Google OAuth 2.0 Playground**. It’s public, but it has rate limits on the requests you can make. This “free” API will work wonderfully for testing your application and understanding how OAuth works, but it isn’t meant for production-level code. 

## How Do Users Log In to an App?

Most web applications use some form of authentication to secure the login page. Examples would be username/password, email/password, Facebook Connect, or OpenID Connect. These systems all have their pros and cons. They work by requiring users to input some form of security code for their account after they log in. The drawback is that you must send users security codes everywhere in your codebase. You ensure the user can access the page where the code is sent from without logging into your app. 

Google’s OAuth 2.0 accomplishes the same thing without requiring your users to give you their security code for your app. Google’s **Login with Google** option allows users to log in to websites using their Google account, and it gives those sites access to their personal information on behalf of the user. Furthermore, it’s as secure as your app login system but doesn't require changes to your server-side code. 

> Google’s OAuth 2.0 accomplishes the same thing without requiring your users to give your their security code for your app.

## How Do We Set up Google OAuth?

To start, we’ll need to complete some prerequisites. You should have: 

1. A server running Node.js with a database (this can be a simple SQLite database).
2. Views for the sign-in and sign-out pages.
3. A Google account for testing your app.

First, let’s create a new folder called **auth** to start organizing our code. In this folder, we’ll create three files: 

* **package.json** - Node.js use this to store information about our project.
* **index.js** - This is used to start the server. Here, we’ll initialize the server with our database and create a route for handling pages.
* **auth.js** - This file will store the user’s credentials for Google. Do not share this information!

### Step 1: Initializing Our Application’s Environment

First, we’ll need to create a service account keypair from the Google Cloud Platform. You might have to provide details about yourself to get the service account, but generally, it'll be a new account with an API key. 

After that, initialize a new app on your terminal and fill in the relevant information about the app. 

```
npm init
```

### Step 2: Install Our App Dependencies

Now that our app is ready, let’s quickly install dependencies pertinent to **Google-OAuth** integration. 

```
npm install express express-session passport passport-google-oauth2 nodemon
```

After that, set up **nodemon** to run and watch the server for changes. 

```js
"scripts": {
    "start":"nodemon index.js"
},
```

### Step 3: Hooking Up the Server to Google

Now that we’ve got our application up and running, it’s time to connect it with Google. To do this,[add your credentials](https://fusebit.io/blog/manage-oauth-user-creds/) for signing in to your Google account to **auth.js**. Here is an example of what an **auth.js** file for testing with **localhost** may look like: 

```js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
```

You can visit the Google developer console [here](https://support.google.com/cloud/answer/6158849#service-web-app&zippy=%2Cweb-applications%2Cnative-applications) to obtain the Google credentials. 

### Step 4: Set Up Relevant Endpoints

Now that we’re all set up, we generate endpoints to ensure that we’re using Google’s OAuth 2.0. We’ll be using the **Express** framework for our server, allowing us to define new routes and easily create responses to those routes. First, we’ll create a base URL that gives us a link to sign in using Google. 

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
  res.send('<a href="/google">Log in with Google</a>');
});
```

The second endpoint leverages Google authentication with the help of **passport**. 

```js
app.get("/google",passport.authenticate("google", { scope: ["email", "profile"] }));
```

Finally, we’ll need to handle the callback, success, and failure URLs. The URLs handle a successful login, failure login, and logout. Additionally, to keep track of a user’s login status, we use **isLoggedIn** middleware. 

```js
const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};
app.get( "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  })
);
app.get("/failure", (req, res) => {res.send("Something went wrong. Please try again")});
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

When you click **Log In with Google**, the endpoints above will route you to the relevant page, depending on the success or failure of authentication. If successful, you'll be directed to the success route, or you'll be redirected to the failure route if unsuccessful. 

## Should You Use Google OAuth?

This is a question that most developers ask themselves, but the question you should be asking yourself instead is: Why am I _not_ using Google OAuth? Imagine how daunting handling your authentication can get—Google OAuth is faster and more secure than username- and password-based logins. Once a user signs in with their Google account, they do not have to enter a username and password each time. 

![Google OAuth with-shadow](google-oauth.png "Google OAuth")

This is great for users who are looking for an easy login process that is also secure. The ease of use puts even more power into your users’ hands by eliminating the need to remember multiple usernames and passwords. As you can see in the picture above, users can log in to their Google Apps with a single click. 

With Google OAuth-enabled apps, users can quickly sign into their accounts and use existing services like Gmail and Calendar without ever having to type in a different username or password again. 

For instance, imagine you want to develop an application that helps travelers plan their trips, and you want to let them create trip entries for places to go and things to see. You do not want users creating trip entries that are unusable because of conflicts or incorrect dates, so you'll use Google OAuth in your app to access their Google Calendar. Using Google OAuth with your app automatically checks the user’s calendar (as well as other services) for travel-related content. If travel information is in the user’s calendar, they can select a date from their calendar when adding or editing a new trip entry. 

## Conclusion

Security and authorization can be complicated, but some things can make it easier without sacrificing security. In this article, we’ve gone over what authorization is, what Google OAuth is, the benefits of Google OAuth, and how to implement it in Node.js. You should now have the tools and knowledge to decide your authorization needs. 

_This post was written by Mercy Kibet. [Mercy](https://hashnode.com/@eiMJay) is a full-stack developer with a knack for learning and writing about new and intriguing tech stacks._
