---
post_title: Integrate With the Slack API and Send Messages Using EveryAuth
post_author: Lizz Parody
post_author_avatar: lizz.png
date: '2022-04-30'
post_image: everyauth-slack.jpg
post_excerpt: Let's build a web form that allows people to send you a Slack direct message ... without using Slack!
post_slug: everyauth-slack-messages
tags: ['post', 'authentication', 'integrations']
post_date_in_url: false
post_og_image: 'hero'
posts_related: ['everyauth', 'everyauth-hubspot', 'integrate-github-api-everyauth']
---

Fusebit recently announced the [EveryAuth](https://fusebit.io/blog/everyauth/) project that allows you to easily authenticate your users to access APIs like Salesforce, GitHub, and Slack. In this article, you will learn how to use EveryAuth to build a web form that allows people to send you a direct message to your Slack using an Express.js application.

In the end, the result will be similar to the following:

![Slack API EveryAuth](blog-everyauth-slack.png 'Slack API EveryAuth')

Let's get started!

## Configuring EveryAuth

This blog post assumes you already have EveryAuth configured in your development environment. In case you don’t, follow the [configuration steps](https://github.com/fusebit/everyauth-express#getting-started) from the EveryAuth Slack Repository.

A basic Express application will look like the following:

```javascript
const express = require('express');

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

Let’s add support to EveryAuth and configure the Slack service so we can interact with their API.

## Install Dependencies

For interacting with the Slack API from Node.js, we will use the official [Slack SDK](https://www.npmjs.com/package/@slack/web-api) and install the Slack web API.

```shell
npm install @slack/web-api
```

Install the [@fusebit/everyauth-express](https://www.npmjs.com/package/@fusebit/everyauth-express) package

```shell
npm i @fusebit/everyauth-express
```

Install the [cookie-session](https://www.npmjs.com/package/cookie-session) package to allow your application to establish a session (an HTTP-Only cookie) to store the authorizing user id.

```shell
npm i cookie-session
```

## Add Routes

There are three main routes we need to add to our application:

* Authorize route
* Finished route
* Message route

Let’s understand the role of each route:

### Authorize Route

EveryAuth middleware enables your application to perform an authorization flow for a particular service or user. You don’t need to configure your own Slack App; EveryAuth provides out-of-the-box shared OAuth Clients so that you can get up and running quickly.

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
  everyauth.authorize('slack', {
    // The endpoint of your app where control will be returned afterwards
    finishedUrl: '/finished',
    // The user ID of the authenticated user the credentials will be associated with
    mapToUserId: (req) => req.params.userId,
  })
);
```

You can define any name you want for the authorization route.

### Finalize Route

After the authorization flow finishes, control is returned to your application by redirecting the user to the configured `finishedUrl` in the `authorize` route.
The redirection includes query parameters that your application can use to know the [user id](https://github.com/fusebit/everyauth-express#parameters---2).
You can use any path for the route. Just ensure it matches what you have configured in the `finishedUrl` property.
In this route, you can now interact with the Slack API by leveraging the EveryAuth service to get a fresh access token.
 
We will get the authorizing Slack user information using the REST API and render the text box.

```javascript
app.get('/finished', handleSession, async (req, res) => {
 const userCredentials = await everyauth.getIdentity('slack', req.session.userId);
 // Call Slack API
 const slackClient = new WebClient(userCredentials.accessToken);
 const userResponse = await slackClient.users.info({ user: userCredentials.native.authed_user.id });
 res.render('index', { title: 'user profile', user: userResponse.user });
});

```

Now, we need to display the data. We will use a simple template engine called [pug](https://www.npmjs.com/package/pug), which allows us to quickly render an HTML page.

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
    .profile
      .pic-container
        img.pic(src=user.profile.image_1024 alt='Slack Avatar')
      span.hi-icon
        i(class="fa-solid fa-shake fa-hand-peace")
      h2=user.real_name
      p=user.profile.title
      p.send-me='You can send me a message from here, I will get it directly in my Slack!'
      .form-container
        unless !messageSent
          p.success
            i(class="fa-solid fa-bounce fa-wand-magic-sparkles")
            span='Thanks!, I got your message:'
          unless !message
            p.message-text
              span=message
          a.button(href='/') Go back
        unless messageSent
          form(action="/message" method="post")
            textarea(name="message", cols="30", rows="10")
            .send-area
              button.send-button(action='submit')
                i(class="fa-solid fa-bounce fa-comment")
                span='Send me a message'
```

### Message Route

This route will send a direct message to the Slack you have authorized.

In order to send a direct message, we use the `user id` instead of a channel name, EveryAuth exposes a property called `native` that includes the response returned after authorizing your application in Slack. The Slack access token response includes a property that allow us to get the authorizing user id via `authed_user`

```javascript
app.post('/message', handleSession, async (req, res) => {
  const userCredentials = await everyauth.getIdentity('slack', req.session.userId);
  // Call Slack API
  const slackClient = new WebClient(userCredentials.accessToken);
  const userResponse = await slackClient.users.info({ user: userCredentials.native.authed_user.id });
  const message = req.body.message;

  if (message) {
    await slackClient.chat.postMessage({
      text: message,
      channel: userCredentials.native.authed_user.id,
    });
  }

  res.render('index', {
    title: 'user profile',
    user: userResponse.user,
    messageSent: !!message,
    message: req.body.message || 'Please write a message',
  });
});
```
### Run the Application

Run your application (assuming your code is defined in index.js file)

```shell
node .
```

Navigate to `http://localhost:3000`

Check out the complete code in [GitHub](https://github.com/fusebit/everyauth-express/tree/main/examples/slack)

## To Wrap Up

Congratulations! You’ve learned that interacting with Slack API is easy with EveryAuth!

Let us know what you think, don’t hesitate to reach out if you have any questions or comments. You can also reach out to me directly through our community [Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg) and on [Twitter](https://twitter.com/LizzParody).

[Fusebit](https://fusebit.io) is a code-first integration platform that helps developers integrate their applications with external systems and APIs. We used monkey patching ourselves to make our integrations better! To learn more, take [Fusebit for a spin](https://manage.fusebit.io/signup?utm_source=fusebit.io&utm_medium=referral&utm_campaign=blog&utm_content=everyauth-slack) or look at our [getting started guide](https://developer.fusebit.io/docs/getting-started)!
