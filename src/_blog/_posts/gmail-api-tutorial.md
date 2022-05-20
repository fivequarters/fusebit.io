---
post_title: How to Use the Gmail API in Node.js - A Step-by-Step Tutorial
post_author: Siddhant Varma
post_author_avatar: siddhant.png
date: '2022-05-19'
post_image: gmail-api-node-tutorial.png
post_excerpt: Follow this guide to setting up and using Gmail API in Node.js to read, drafts, and send emails.
post_slug: gmail-api-node-tutorial
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related: ['everyauth-scalable-asana-gcal', 'everyauth-hubspot', 'integrate-github-api-everyauth']
---

Ever wonder if there is a more interesting way of using Gmail without even opening your Gmail account? It's possible via the Gmail APIs, which offer tons of useful features. Some of the popular ones include creating an email draft, updating an email draft, sending emails, managing email threads, and searching messages.

So in this post, I'll walk you through step-by-step how to start using the Gmail API in Node.js.

## Gmail API Setup in Node.JS

In order to use any Google API, there are some prerequisite steps we need to perform. Let's go through these.

### Create a New Google Console Project

Make sure you have a Google account and are currently logged in. To use any Google API, we first need to create a project in the Google console. Head over to [the Google Cloud Platform](https://console.cloud.google.com/). If you already created a Google Cloud project earlier, this is what your screen should look like:

![Gmail API in Node.js tutorial](gmail-api-node-1.png "Gmail API in Node.js")

We will now create a new Google Cloud project:

![Gmail API in Node.js tutorial](gmail-api-node-2.png "Gmail API in Node.js")

Enter the name you wish to use for the project:

![Gmail API in Node.js tutorial](gmail-api-node-3.png "Gmail API in Node.js")

And now in a few seconds, you'll have your own new Google Cloud console project created for you. Great!

### Add OAuth Consent Screen

Next, we'll add a new OAuth consent screen with some configurations. Inside your project's dashboard, head over to the **APIs & Services** screen.

![Gmail API in Node.js tutorial](gmail-api-node-4.png "Gmail API in Node.js")

Then, select **OAuth consent screen**.

![Gmail API in Node.js tutorial](gmail-api-node-5.png "Gmail API in Node.js")

After that, choose **External** in the consent screen.

![Gmail API in Node.js tutorial](gmail-api-node-6.png "Gmail API in Node.js")

You'll then be prompted to enter some app information. Add that information:

![Gmail API in Node.js tutorial](gmail-api-node-7.png "Gmail API in Node.js")

Next, add some developer contact information:

![Gmail API in Node.js tutorial](gmail-api-node-8.png "Gmail API in Node.js")

We'll use the default scopes available. So on the next screen, select **Save and Continue** as it is.

![Gmail API in Node.js tutorial](gmail-api-node-9.png "Gmail API in Node.js")

Then, we'll add our own email or an email you'd use to test the app:

![Gmail API in Node.js tutorial](gmail-api-node-10.png "Gmail API in Node.js")

Finally, you can review the app details in the summary. Click **Save and Continue**. At this point, your OAuth consent screen has been completely set up. Awesome!

### Create OAuth Client ID

Now we'll go over to the **Credentials** tab to create an OAuth client ID.

![Gmail API in Node.js tutorial](gmail-api-node-11.png "Gmail API in Node.js")

That should open up the **Credentials** tab for you:

![Gmail API in Node.js tutorial](gmail-api-node-12.png "Gmail API in Node.js")

As you can see, we currently do not have any OAuth 2.0 Client ID. So we'll go ahead and create one by clicking on **Create Credentials**:

![Gmail API in Node.js tutorial](gmail-api-node-13.png "Gmail API in Node.js")

And consequently, select **OAuth client ID** in the dropdown:

![Gmail API in Node.js tutorial](gmail-api-node-14.png "Gmail API in Node.js")

Then, choose **Web application** as the application type and let the application name be **Web client 1**:

![Gmail API in Node.js tutorial](gmail-api-node-15.png "Gmail API in Node.js")

After that, scroll down to add a redirect URI. Enter [https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground) inside here:

![Gmail API in Node.js tutorial](gmail-api-node-16.png "Gmail API in Node.js")

Make sure the URI doesn't contain a slash (/) at the end. After that, click on **Create** to create an OAuth client. That should create an OAuth client for your project and should also generate some useful **client-id** and **client-secret** keys for your project.

### Generate Access and Refresh Tokens

Now we need to generate an access token that we will use to authenticate our Gmail API requests. Without it, we won't be able to make legitimate requests to the Gmail API.

To do that, as a first step, we'll visit the redirect URI we added previously. Head over to [https://developers.google.com/oauthplayground/](https://developers.google.com/oauthplayground/):

![Gmail API in Node.js tutorial](gmail-api-node-17.png "Gmail API in Node.js")

We want to use Gmail API, so we'll put in our scope to authorize the Gmail API. Put the **https://mail.google.com** scope inside it:

![Gmail API in Node.js tutorial](gmail-api-node-18.png "Gmail API in Node.js")

After that, select the gear icon on the right and leave everything as it is. Tick the **Use your own OAuth credentials** checkbox and enter your OAuth 2 client-id and client-secret. Then click **Close**.

![Gmail API in Node.js tutorial](gmail-api-node-19.png "Gmail API in Node.js")

After that, next to the scope, click on **Authorize APIs**:

![Gmail API in Node.js tutorial](gmail-api-node-20.png "Gmail API in Node.js")

Once you do that, Google will ask you to sign in via your test account:

![Gmail API in Node.js tutorial](gmail-api-node-21.png "Gmail API in Node.js")

Then it might prompt you that the app is still unverified, but we'll skip the verification since it takes up to two or three days:

![Gmail API in Node.js tutorial](gmail-api-node-22.png "Gmail API in Node.js")

After you click **Continue**, you'll see your Google Cloud app asking for some permissions. We need to select **Continue** here as well. This will allow us to do any mail operations from our test account via the Gmail API.

![Gmail API in Node.js tutorial](gmail-api-node-23.png "Gmail API in Node.js")

Finally, you should be redirected back to the playground:

![Gmail API in Node.js tutorial](gmail-api-node-24.png "Gmail API in Node.js")

Notice how we get back some authorization code now. We will use it to generate refresh tokens and access tokens. Click on **Exchange authorization code for tokens** and you will get back some refresh tokens and access tokens.

![Gmail API in Node.js tutorial](gmail-api-node-25.png "Gmail API in Node.js")

And that's it! You're all set up to start using the Gmail API in a Node.js application. Awesome. Let's now create a new Node.js app where we can interact with this Gmail API.

## Set Up and Create an npm Project

To get started, we'll first create a brand-new npm project. Inside a directory of your choice, run:

`mkdir gmail-api-nodejs-app && cd gmail-api-nodejs-app && npm init -y`

This creates a new npm project inside the **gmail-api-nodejs-app directory**. Great. Now we need to install some packages.

First, to create our Node.js server and handle routing, we'll install **express**.

`npm i express`

Then, we'll install **axios** and **dotenv**. Axios will help us make HTTP requests to Gmail API from within our Node.js app, while dotenv will allow us to safely store our API credentials in environment variables.

`npm i axios dotenv`

Then, we will install **googleapis** and **nodemailer**. The former lets us communicate to Google APIs easily, and the latter will be used to simplify sending emails from our app.

`npm i googleapis nodemailer`

Great! Let's go ahead and create our server.

## Add Environment Variables

Create a `.env` file inside the root directory to store our environment variables.

We generated `client_id`, `client_secret`, `redirect_uri`, and `refresh_token` earlier. It's now time to grab them and put them inside a `.env` file as shown below:

```js
PORT=8000

CLIENT_ID=&lt;your-client-id>

CLIENT_SECRET=&lt;your-client-secret>

REDIRECT_URI=&lt;your-redirect-uri>

REFRESH_TOKEN=&lt;your-refresh-token>
```

We have also defined the port number on which we'll run our Node.js server here.

## Create Node.js Server

Next, we'll create our `app.js` file inside the root directory. This is where we'll create an express server, kickstart it, and register other routes.

Add the following code inside it:

```js
const express = require("express");

require("dotenv").config();

const app = express();

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});

app.get("/", async (req, res) => {
  // const result=await sendMail();
  res.send("Welcome to Gmail API with NodeJS");
});
```

We're creating an express app and listening on the port we declared earlier in our `.env` file. Let's start the app by running:

node app.js

And if you now visit `http://localhost:8000`, you should see a message on the page:

![Gmail API in Node.js tutorial](gmail-api-node-26.png "Gmail API in Node.js")

## Generate Request Configurations Helper Function

All the APIs we build in Node.js will eventually interact with a Gmail API to fetch some information. We installed axios earlier to help us make those HTTP requests from our Node app.

Each of these requests will have some configurations, like the request method, URL, and headers. We'll create a common **utils.js** file inside the root directory with the following helper function:

```js
const generateConfig = (url, accessToken) => {
  return {
    method: "get",
    url: url,
    headers: {
      Authorization: `Bearer ${accessToken} `,
      "Content-type": "application/json",
    },
  };
};

module.exports = { generateConfig };
```

## Adding Auth and Nodemailer Constants

Similar to the helper function, we'll also create a constant that defines an **auth** and a **mailOptions** object. We'll use these when we send an email. We also import the dotenv package inside this file to be able to use our environment variables.

Inside **/constants.js**, add the following code:

```js
require("dotenv").config();

const auth = {
  type: "OAuth2",
  user: "sid.cd.varma@gmail.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailoptions = {
  from: "Siddhant &lt;sid.cd.varma@gmail.com>",
  to: "sid.cd.varma@gmail.com",
  subject: "Gmail API NodeJS",
};

module.exports = {
  auth,
  mailoptions,
};
```

## Creating API Routes

It's time to create our API routes or endpoints now. Inside **/routes.js**, add the following code:

```js
const express = require('express');
const controllers=require('./controllers');
const router = express.Router();

router.get('/mail/user/:email',controllers.getUser)
router.get('/mail/send',controllers.sendMail);
router.get('/mail/drafts/:email', controllers.getDrafts);
router.get('/mail/read/:messageId', controllers.readMail);

module.exports = router;
```

Let's quickly go over what each route represents:

* **/mail/user/:email:** Fetches information about a Gmail user
* **/main/send:** Sends an email via Nodemailer
* **/mail/drafts/:email:** Gets all the drafts for a user
* **/mail/read/:messageId:** Gets an email from its message ID

Notice that each of these routes is attached to a controller present in the** /controllers.js** file. But this file doesn't exist yet, so let's go ahead and create it.

## Creating Controllers Boilerplate

Inside **/controllers.js**, add the following code:

```js
const axios = require("axios");
const { generateConfig } = require("./utils");
const nodemailer = require("nodemailer");
const CONSTANTS = require("./constants");
const { google } = require("googleapis");

require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendMail(req, res) {
  try {
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function getUser(req, res) {
  try {
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function getDrafts(req, res) {
  try {
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function readMail(req, res) {
  try {
  } catch (error) {
    res.send(error);
  }
}

module.exports = {
  getUser,
  sendMail,
  getDrafts,
  searchMail,
  readMail,
};
```

We have created some async functions for each of our routes. Let's fill each of these as we try them out.

## Get a Gmail User

Here's what our **getUser** function looks like:

```js
async function getUser(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}
```

We hit the user URL of the Gmail endpoint and pass it to the user's email. We'll get this email from the route parameter of our own endpoint. In order to use this endpoint, we'll first register our routes back in app.js:

```js
const routes=require("./routes");

...

app.use('/api',routes);

...
```

Great! Now let's try to get our test user's information back via the API:

![Gmail API in Node.js tutorial](gmail-api-node-27.png "Gmail API in Node.js")

It gets back the email address and total emails and threads for our test user. We can also verify that back in our Gmail account:

![Gmail API in Node.js tutorial](gmail-api-node-28.png "Gmail API in Node.js")

Awesome!

## Get Gmail Drafts

We can now complete our **getDrafts** function as shown below:

```js
async function getDrafts(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    return error;
  }
}
```

To test this out, we'll hit the endpoint **http://localhost:8000/api/mail/drafts/sid.cd.varma@gmail.com**. Make sure to put in your own test user email there:

![Gmail API in Node.js tutorial](gmail-api-node-29.png "Gmail API in Node.js")

It gives us back a bunch of draft IDs and corresponding message information. Each **message** object has an **id**, which is the ID of the actual message, and a **threadId**.

Threads are like conversations where messages are grouped together. For example, you may have replied to an email, and a conversation could have been created from there. That entire conversation is a thread, and each individual email reply is a message.

We can actually grab a message ID and get more information about that individual email or message. So let's do that next.

## Read Emails

Here's what our completed **readMail** function looks like:

```js
async function readMail(req, res) {
  try {
    const url = `https://gmail.googleapis.com//gmail/v1/users/sid.cd.varma@gmail.com/messages/${req.params.messageId}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);

    let data = await response.data;

    res.json(data);
  } catch (error) {
    res.send(error);
  }
}
```

And now we'll visit **http://localhost:8000/api/mail/read/17f63b4513fb51c0** with the message ID passed in the route:

![Gmail API in Node.js tutorial](gmail-api-node-30.png "Gmail API in Node.js")

And we get some email information about the draft message. Nice!

## Send Emails

Finally, we'll use the Gmail API and Nodemailer to send an email message. Here's the finished **sendMail** function:

```js
async function sendMail(req, res) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        ...CONSTANTS.auth,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      ...CONSTANTS.mailoptions,
      text: "The Gmail API with NodeJS works",
    };

    const result = await transport.sendMail(mailOptions);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}
```

We first create a **transport** object via Nodemailer and pass in the service and the auth object we created earlier. This auth object verifies the request. Next, we pass in the **mailOptions**, which is again populated from the **mailOptions** constants we created earlier. It contains information about who is sending an email to whom, the subject, and the content of the email as **text.**

Finally, we call the **sendMail** function on the transport and pass in the **mailOptions** to it. Let's try it out now:

![Gmail API in Node.js tutorial](gmail-api-node-31.png "Gmail API in Node.js")

Looks like it worked, right? But let's also verify it in the inbox.

![Gmail API in Node.js tutorial](gmail-api-node-32.png "Gmail API in Node.js")

There is new mail for us! Let's open it:

![Gmail API in Node.js tutorial](gmail-api-node-33.png "Gmail API in Node.js")

It actually worked! Let's verify it further by looking at the sender information:

![Gmail API in Node.js tutorial](gmail-api-node-34.png "Gmail API in Node.js")

Oh yes, that's our Gmail API Node.js app's email. Sweet! We can now send emails easily via our Node.js API. You can also send full HTML inside the **text** field of the **mailOptions** object.

I hope you had fun exploring the Gmail API in Node.js. There are loads of other endpoints that we haven't explored, but I'll let you take it up from here! You can refer to the[ entire documentation](https://developers.google.com/gmail/api/reference/rest) for all those available endpoints. You can also see the[ source code for the entire tutorial](https://github.com/FuzzySid/Gmail-API-NodeJs).

## Wrapping Up

Otherwise, if you're looking to build some cool Gmail integration for your app or a personal project, you can check out[ Fusebit's](https://fusebit.io/) Gmail integration. They also offer some other awesome[ integrations](https://fusebit.io/integrations/) with your favorite apps like Discord, GitHub, Asana, and much more. Until next time!

_This post was written by Siddhant Varma. [Siddhant](https://www.linkedin.com/in/siddhantvarma99/) is a full stack JavaScript developer with expertise in frontend engineering. He’s worked with scaling multiple startups in India and has experience building products in the Ed-Tech and healthcare industries. Siddhant has a passion for teaching and a knack for writing. He's also taught programming to many graduates, helping them become better future developers._

