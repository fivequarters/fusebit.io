---
post_title: Integrating With the GitHub API Using EveryAuth
post_author: Rubén Restrepo
post_author_avatar: bencho.png
date: '2022-04-22'
post_image: github-everyauth-example.png
post_excerpt: Learn how to interact with GitHub API from an Express application using EveryAuth
post_slug: integrate-github-api-everyauth
tags: ['post', 'authentication']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/github-everyauth-example.png
posts_related: ['everyauth','integrate-google-calendar-node-everyauth', 'nodejs-oauth-libraries']
---

Recently Fusebit announced [EveryAuth](https://fusebit.io/blog/everyauth/) project that allows you to integrate with multiple services via OAuth easily. Learn how to use EveryAuth with GitHub API using a GitHub OAuth Application.

You have an existing Express.js application that needs to integrate with GitHub API to display the following information:
- User profile information
- Public repositories

The application will display the authorizing user’s GitHub profile that looks like the following:

![Using GitHub API with EveryAuth with-shadow](blog-using-github-with-everyauth-demo.png 'GitHub example with EveryAuth')

## Configuring EveryAuth

This blog post assumes you already have EveryAuth configured in your development environment. In case you don’t, follow the [configuration steps](https://github.com/fusebit/everyauth-express#getting-started) from the EveryAuth GitHub Repository.

A basic Express application will look like the following:

```javascript
const express = require('express');

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

Let’s add support to EveryAuth and configure the GitHub service so we can interact with their API.

## Install dependencies

For interacting with GitHub API from Node.js we will use the official GitHub SDK [Octokit](https://www.npmjs.com/package/octokit)

```shell
npm i octokit
```

Install the [@fusebit/everyauth-express](https://www.npmjs.com/package/@fusebit/everyauth-express) package

```shell
npm i @fusebit/everyauth-express
```

Install the [uuid](https://www.npmjs.com/package/uuid) package. Used to generate a unique identifier for the userId.

```shell
npm i uuid
```
Install the [cookie-session](https://www.npmjs.com/package/cookie-session) package to allow your application to establish a session (an HTTP-Only cookie) to store the authorizing user id.

```shell
npm i cookie-session
```

## Add Routes

There are two critical routes we need to add to our application:
- Authorize route
- Finished route

Let’s understand the role of each route:

### Authorize route

EveryAuth middleware enables your application to perform an authorization flow for a particular service. We will be using [githuboauth](https://github.com/fusebit/everyauth-express/blob/main/docs/githuboauth.md) service to use a GitHub OAuth Application. A GitHub App is also supported. For the example of this blog, either service will work since both applications can act as the authorizing user. Understand when to use [GitHub OAuth Apps vs. GitHub Apps](https://fusebit.io/blog/github-oauth-apps-vs-github-apps).

You don’t need to configure your own GitHub OAuth App; EveryAuth provides out-of-the-box shared OAuth Clients so that you can get up and running quickly.

EveryAuth simplifies a lot the authorization flow:

```javascript
app.use(
  '/authorize/:userId',
  (req, res, next) => {
    if (!req.params.userId) {
      return res.redirect('/');
    }
    return next();
  },
  everyauth.authorize('githuboauth', {
    // The endpoint of your app where control will be returned afterwards
    finishedUrl: '/finished',
    // The user ID of the authenticated user the credentials will be associated with
    mapToUserId: (req) => req.params.userId,
  })
);
```

You can define any name you want for the authorization route. In our previous example, it’s called `authorize`, but it’s up to you, and your application needs to use a different name/path. 

### Finished route

After the authorization flow finishes, control is returned to your application by redirecting the user to the configured `finishedUrl` in the `authorize` route.
The redirection includes query parameters that your application can use to know the [operation status](https://github.com/fusebit/everyauth-express#parameters---2).
You can use any path for the route. Just ensure it matches what you have configured in the `finishedUrl` property.
In this route, you can now interact with the GitHub API by leveraging the EveryAuth service to get a fresh access token.
 
We will get the authorizing GitHub user information and public repositories using the REST API.

```javascript
// Get userId from the authorization redirect or via session if already authorized.
const handleSession = (req, res, next) => {
  if (req.query.userId) {
    req.session.userId = req.query.userId;
  }
  if (!req.session.userId) {
    return res.redirect('/');
  }
  return next();
};

app.get('/finished', handleSession, async (req, res) => {
  const userCredentials = await everyauth.getIdentity('githuboauth', req.session.userId);
  const client = new Octokit({ auth: userCredentials?.accessToken });
  const { data } = await client.rest.users.getAuthenticated();
  const { data: repos } = await client.request('GET /user/repos', {});
  ... render the data
});
```

Now, we need to display the data. We will use a simple template engine called [pug](https://www.npmjs.com/package/pug), which allows us to quickly render an HTML page with the data returned from GitHub.

Install the dependency and set it as the default view engine:

```shell
npm i pug
```

```javascript
app.set('view engine', 'pug');
```

Define the pug template by creating a `views` folder and the name of the view. In our case, it’s called `index.pug`. Add the following code:

```pug
html
head
    title=title
    style
    include ./style.css
body
    .container
    .profile
        .top
        img.pic(src=avatar_url alt='GitHub Avatar')
        h2=name 
        a(href=html_url) #{login}
        p=bio
        p.followers
        i(class="fa-solid fa-users")
        span #{followers} followers
        span(class="separator") -
        span #{following} following
        section
        span
            i(class="fa-solid fa-building")
        span #{company}
        section
        span
            i(class="fa fa-location-dot")
        span #{location}
        section
        span
            i(class="fa-brands fa-twitter")
        span 
            a(href=`https://www.twitter.com/${twitter_username}`) #{twitter_username}
        section
        span
            i(class="fa-solid fa-floppy-disk")
        span Using #{used_storage} % #{plan.name} plan storage
    .public-repos
        h2 Your public repositories (#{public_repos.length})
        ul
        each val in public_repos 
            li
            a(href=val.html_url title=val.description target="_blank") #{val.full_name}
            span=val.description
            unless !val.language
                span.lang=val.language

```

Render the data:

```javascript
res.render('index', {
  title: `GitHub Profile for ${data.login}`,
  ...data,
  used_storage: Math.round((data.disk_usage * 100) / data.plan.space, 2),
  public_repos: repos,
})
```

Run your application (assuming your code is defined in index.js file)

```shell
node .
```

Navigate to `http://localhost:3000`

Check out the complete code in [GitHub](https://github.com/fusebit/everyauth-express/tree/main/examples/github-oauth)

## To Wrap up
Congratulations! 👏 You’ve learned that interacting with GitHub API via a GitHub OAuth App is easy with EveryAuth!

Let us know what you think, don’t hesitate to reach out if you have any questions or comments. You can also reach out to me directly through our community [Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg) and on [Twitter](https://twitter.com/degrammer).

[Fusebit](https://fusebit.io) is a code-first integration platform that helps developers integrate their applications with external systems and APIs. To learn more, take [Fusebit for a spin](https://manage.fusebit.io/signup?utm_source=fusebit.io&utm_medium=referral&utm_campaign=blog&utm_content=using-github-with-everyauth) or look at our [getting started guide](https://developer.fusebit.io/docs/getting-started)!
