---
post_title: Integrate your Express Application with Reddit using EveryAuth
post_author: Rubén Restrepo
post_author_avatar: bencho.png
date: '2022-05-12'
post_image: reddit-everyauth-example.png
post_excerpt: Learn how to interact with the Reddit API in an easy and secure way using Express and EveryAuth.
post_slug: using-reddit-with-everyauth
tags: ['post', 'authentication']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/reddit-everyauth-example.png
posts_related: ['everyauth', 'integrate-github-api-everyauth', 'using-stackoverflow-with-everyauth']
---

Recently Fusebit announced [EveryAuth](https://fusebit.io/blog/everyauth/?utm_source=fusebit.io&utm_medium=referral&utm_campaign=none) project that allows you to integrate with multiple services via OAuth easily. Learn how to use EveryAuth with the Reddit API using the [snoowrap](https://www.npmjs.com/package/snoowrap) package.

You have an existing Express.js application that needs to integrate with the Reddit API to display the following information:

- Reddit user profile: Prefixed user name, snoovatar, karma and banner image.
- Get the top 30 upvote comments sorted descending by upvotes.

The application will display the authorizing user’s Reddit profile that looks like the following:

![Using Reddit API with EveryAuth with-shadow](reddit-demo.png 'Reddit example with EveryAuth')

## Configuring EveryAuth

This blog post assumes you already have EveryAuth configured in your development environment. In case you don’t, follow the [configuration steps](https://github.com/fusebit/everyauth-express#getting-started) from the EveryAuth GitHub Repository.

A basic Express application will look like the following:

```javascript
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
```

Let’s add support to EveryAuth and configure the Reddit service so we can interact with their API.

## Install dependencies

Install the following dependencies:

```shell
npm i @fusebit/everyauth-express snoowrap uuid cookie-session pug
```

Let’s review the why we need them:

- [@fusebit/everyauth-express](https://www.npmjs.com/package/@fusebit/everyauth-express) package for enabling EveryAuth within our Express application.
- [snoowrap](https://www.npmjs.com/package/snoowrap) A fully-featured JavaScript wrapper for the reddit API.
- [uuid](https://www.npmjs.com/package/uuid) package. Used to generate a unique identifier for the userId.
- [cookie-session](https://www.npmjs.com/package/cookie-session) package to allow your application to establish a session (an HTTP-Only cookie) to store the authorizing user id.
- [pug](https://www.npmjs.com/package/pug) A high-performance template engine is used to render the content.

## Add Routes

There are two critical routes we need to add to our application:

- Authorize route
- Finished route

Let’s understand the role of each route:

### Authorize route

The EveryAuth middleware enables your application to perform an authorization flow for a particular service.
It provides an out-of-the-box shared Reddit OAuth Client to get up to speed quickly. EveryAuth makes your life easier by simplifying a lot of the authorization flow.

```javascript
app.use(
  '/authorize/:userId',
  everyauth.authorize('reddit', {
    // The endpoint of your app where control will be returned afterwards
    finishedUrl: '/finished',
    // The user ID of the authenticated user the credentials will be associated with
    mapToUserId: (req) => req.params.userId,
  })
);
```

You can define any name you want for the authorization route. In our previous example, it’s called `authorize`, but it’s up to you, and your application needs to use a different name/path.

The authorization screen displayed by Reddit will look like this:

![Using Reddit API with EveryAuth with-shadow](reddit-everyauth-example-authorize.png 'Reddit example with EveryAuth')

### Finished route

After the authorization flow finishes, control is returned to your application by redirecting the user to the configured `finishedUrl` in the `authorize` route.
The redirection includes query parameters that your application can use to know the [operation status](https://github.com/fusebit/everyauth-express#parameters---2).
You can use any path for the route. Just ensure it matches what you have configured in the `finishedUrl` property.
In this route, you can now interact with the Reddit API by leveraging the EveryAuth service to get a fresh access token.

We will get the authorizing Reddit user information and top upvoted comments using the [REST API](https://www.reddit.com/dev/api/).

The profile attributes are returned from the [api/v1/me](https://www.reddit.com/dev/api/#GET_api_v1_me) endpoint. Your client should be authorized with the `identity` scope.

The relevant profile fields for our demo are:

- subreddit.display_name.banner_img
- subreddit.display_name.display_name_prefixed
- total_karma
- snoovatar_img

The top comments are coming from the [user/username/comments](https://www.reddit.com/dev/api/#GET_user_{username}_{where}). Your client should be authorized with the `history` scope.

The relevant comments fields for our demo are:

- link_title
- ups
- subreddit.display_name
- link_permalink
- body

```javascript
app.get('/finished', validateSession, async (req, res) => {
  // Get Reddit service credentials.
  const userCredentials = await everyauth.getIdentity('reddit', req.session.userId);

  // Initialize the reddit client with the credentials access token.
  const redditClient = new snoowrap({
    userAgent: 'EveryAuth',
    accessToken: userCredentials.accessToken,
  });

  // Get top 30 user comments sorted by upvotes.
  const topComments = await redditClient.getMe().getComments({ sort: 'top', limit: 30 });

  // Get authorizing user reddit profile.
  const me = await redditClient.getMe();

  // Organize the user profile information to display
  const {
    subreddit: {
      display_name: { banner_img, icon_img, display_name_prefixed },
    },
    name,
    total_karma,
    snoovatar_img,
  } = me;

  // Render the user profile and top comments in views/index.pug
  res.render('index', {
    banner_img,
    icon_img,
    name,
    display_name_prefixed,
    total_karma,
    snoovatar_img,
    topComments,
  });
});
```

Now, let’s see the magic behind the `send.render` function!
We will be using a `pug` template to quickly render an HTML page with the data returned from Reddit.
Since we already installed pug alongside other dependencies for our project, ensure is configured as the default view engine:

```javascript
app.set('view engine', 'pug');
```

Define the pug template by creating a `views` folder and the name of the view. In our case, it’s called `index.pug`. Add the following code:

```pug
html
  head
    title='Reddit Top upvoted comments'
    style
      include ./style.css
  body
    .header
      .logo-container
        img.logo(src='https://www.redditinc.com/assets/images/site/reddit-logo.png')
        h1='Top Upvoted comments'
      .profile_card
          .banner(style=`background-image:url(${banner_img})`)
          .user
            img.avatar(src=snoovatar_img alt='Reddit profile image')
            p=display_name_prefixed
            span.karma #{total_karma}
    .container
      .top-comments
        unless topComments.length
          .empty
            i(class='fa-solid fa-face-frown fa-bounce')
            span='No comments found'
        each comment,index in topComments
            .comment-item
              .comment-title
                .position=(index + 1)
                h2!=comment.link_title
              .stats
                section
                  span
                      i(class='fa-solid fa-star')
                  span=comment.ups
                  span
                      i(class='fa-solid fa-comments')
                  span=comment.subreddit.display_name
                  a(href=comment.link_permalink target='_blank')='View comment'
              .comment-body!=comment.body
```

Run your application (assuming your code is defined in index.js file)

```shell
node .
```

Navigate to `http://localhost:3000`

Check out the complete code in [GitHub](https://github.com/fusebit/everyauth-express/tree/main/examples/reddit)

## To Wrap up

Congratulations! 🎉 You’ve learned that interacting with Reddit API is easy with EveryAuth!

Let us know what you think, don’t hesitate to reach out if you have any questions or comments. You can also reach out to me directly through our community [Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg) and on [Twitter](https://twitter.com/degrammer).

[Fusebit](https://fusebit.io) is a code-first integration platform that helps developers integrate their applications with external systems and APIs. To learn more, take [Fusebit for a spin](https://manage.fusebit.io/signup?utm_source=fusebit.io&utm_medium=referral&utm_campaign=blog&utm_content=using-reddit-with-everyauth) or look at our [getting started guide](https://developer.fusebit.io/docs/getting-started)!
