---
post_title: Integrating With the HubSpot API Using EveryAuth
post_author: Tomasz Janczuk
post_author_avatar: tomek.png
date: '2022-04-29'
post_image: everyauth-hubspot-main.png
post_excerpt: How to add HubSpot integration to your Node.js app using EveryAuth
post_slug: everyauth-hubspot
tags: ['post', 'authentication', 'integrations']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/everyauth-hubspot-main.png
posts_related:
  ['everyauth', 'everyauth-salesforce', 'integrate-github-api-everyauth']
---

The EveryAuth project is the easiest way to call HubSpot APIs from your Node.js app without learning OAuth. In this post, we will build a 100-line Express application using EveryAuth that:

- Gets authorization from a user of your app to call HubSpot APIs on their behalf.
- Creates a new contact in your customer's HubSpot instance when certain event happens.

Follow the tutorial below to learn how to build such application from scratch. You can also find the complete source code of the sample application [on GitHub](https://github.com/fusebit/everyauth-express/tree/main/examples/hubspot). Or, you can read more about [EveryAuth](https://fusebit.io/blog/everyauth/) and all other services the project supports.

## A Day In Your Life

You are working on a newsletter platform. It allows your customers like Contoso (fictitious example used in this post) to manage the publication of their newsletters. Your platform also allows people interested in Contoso’s newsletters to sign up for them by dropping in their e-mail addresses.

![Newsletter signup](everyauth-hubspot-5.png 'Create HubSpot contact when people sign up to a newsletter')

Contoso, like many of your customers, has been asking you to add a HubSpot integration. Whenever one of their readers signs up for the newsletter, they want a new contact to be created in their HubSpot instance.

You take stock of the work ahead of you to make your customers happy:

- You will need to register an OAuth client representing your app in HubSpot.
- You will need to add management features to your app that allow your customers like Contoso to authorize/unauthorize/reauthorize access to HubSpot APIs through your app.
- You will need to store your customers’ access and refresh tokens and make sure they are fresh when your app needs to talk to the HubSpot API.
- To do that, you will need to make changes to your database, maybe coordinating with another team in your organization.
- Since you know that HubSpot is just the tip of an iceberg of your integration requirements (what about Salesforce? what about Zoho?), you will spend some extra time making sure your design is future-proof to embrace extra platforms in the future.

Then you come across [EveryAuth](https://github.com/fusebit/everyauth-express). You suddenly realize that you can use EveryAuth instead of building all that custom infrastructure yourself. And then you can spend more time playing with your dog, going for that long overdue workout, or chilling out with a favorite book, all while your boss and your customers are happy.

## What Will EveryAuth Help You With?

In a nutshell, EveryAuth accelerates your integration solution by:

- Providing a shared HubSpot application so that you don’t need to register your own with HubSpot to get started (you still can if you want to later).
- Taking care of all OAuth handshakes and exchanges so that you don’t need to learn about implementation details and differences between services.
- Handling the secure storage of your customers’ credentials on the [Fusebit](https://fusebit.io) platform and renewing them when necessary so that you can write less boilerplate code.
- Providing a flexible credential indexing feature that allows you to avoid _any_ changes in your database - you can use identifiers specific to your app as indexing keys when referencing credentials stored in EveryAuth.
- Providing a convenient Express middleware that helps you authorize your customers with just a few lines of code in your Node.js app.
- Providing a CLI management tool that helps you manage all of your customers’ credentials and service configuration.

After you integrate EveryAuth with your app, you can still use any SDK you want to communicate with the target platform for ultimate flexibility. If you don’t know which one to pick, [EveryAuth comes with a recommendation for each platform it supports](https://github.com/fusebit/everyauth-express#supported-services), including HubSpot.

## Integrate Your App With HubSpot

So let’s cut to the chase and build that 100-line sample app. You can review and run the finished solution [on GitHub](https://github.com/fusebit/everyauth-express/tree/main/examples/hubspot).

### Set Up EveryAuth

First, you need to set up EveryAuth on your machine. This will create a free account with [Fusebit](https://fusebit.io) and store API keys to it on your box. This is necessary to provide a secure location to store your users’ credentials after they authorize your app. [You can read the detailed instructions](https://github.com/fusebit/everyauth-express#getting-started), but this is the gist of it:

```bash
npm install -g @fusebit/everyauth-cli
everyauth init
```

### Scaffold An Empty Express App

Next, create an empty Express application. We will use the [@hubspot/api-client](https://www.npmjs.com/package/@hubspot/api-client) module to communicate with HubSpot APIs:

```bash
npm install express
npm install @fusebit/everyauth-express
npm install @hubspot/api-client
```

Then create `index.js` with the following boilerplate app:

```javascript
const express = require('express');
const { Client } = require('@hubspot/api-client');
const everyauth = require('@fusebit/everyauth-express');

const app = express();
const port = 3000;
const serviceId = 'hubspot';
const userId = 'usr-123'; // normally determined through authorization
const tenantId = 'contoso'; // organization/project userId is part of

app.get('/', (req, res) => {
  res.redirect('/integrations');
});

app.get('/integrations', (req, res) => {
  res.send('Hello');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

This is a barebones Express application in Node.js. When you run it with `node index.js` and navigate to http://localhost:3000 in your browser, you should be redirected to http://localhost:3000/integrations and see the _Hello_ string in the browser. We will be adding functionality to this app next, but before we do, let’s cover some basic EveryAuth concepts.

### Some Basic EveryAuth Concepts

Notice the _serviceId_, _userId_, and _tenantId_ constants at the top of the app. They are related to EveryAuth concepts:

- **Service**, uniquely described by the _serviceId_ string, is simply a target platform EveryAuth supports which you can ask your users for authorization to. The `hubspot` string denotes HubSpot.
- **User**, uniquely described by the _userId_ string, represents a unique identifier of a user (a human) interacting with your app through the web browser. The _userId_ is typically established in the authentication process which is specific to your app. In this example we ignore the authentication layer and instead hardcode a specific value of _userId_. In production, this value would be determined as part of an authorization middleware on individual application routes.
- **Tenant**, uniquely described by the _tenantId_ string, represents an organization, project, or company of which the authenticated _user_ is part. In this sample, a tenant may be the company named Contoso, which is the customer of your newsletter platform, and the user may be John Doe, an employee of Contoso managing their subscription with you. The _tenantId_ is typically established alongside the _userId_ based on the authentication context of your app. Think John Doe is logging in to your platform to manage Contoso’s subscription with you.

In some apps the concept of a tenant does not exist, or rather the concept of the tenant is the same as the user. In this example, however, we will pretend they are distinct to add some color to what EveryAuth can do.

And now, some more code.

## HubSpot Connection Management Screen

When John Doe, the employee of Contoso, your customer, logs into your app, they can navigate to a screen that allows them to manage the HubSpot connection. Modify the `/integrations` route in your app to implement that screen as follows:

```javascript
// The management page that shows connected services
app.get(`/integrations`, async (req, res) => {
  // Check if the user's organization has already authorized access to HubSpot
  const credentials = await everyauth.getIdentity(serviceId, { tenantId });
  if (credentials) {
    // Present options to reconnect or disconnect, and test
    res.send(`
            <h2>HubSpot</h2>
            <p>Service connected</p>
            <form action="/integrations/hubspot/connect">
                <input type="submit" value="Reconnect" />
            </form>
            <form action="/integrations/hubspot/disconnect">
                <input type="submit" value="Disconnect" />
            </form>
            <form action="/newsletter/signup">
                <input type="submit" value="Test newsletter signup" />
            </form>
        `);
  } else {
    // Present option to connect
    res.send(`
            <h2>HubSpot</h2>
            <p>Service not connected</p>
            <form action="/integrations/hubspot/connect">
                <input type="submit" value="Connect" />
            </form>
        `);
  }
});
```

Let’s unpack it. The screen has two possible states, depending on whether Contoso already authorized access to their HubSpot instance or not. If HubSpot access has not yet been authorized, which is the initial state, John Doe will be presented with an option to _Connect_ to HubSpot:

![Connect to HubSpot](everyauth-hubspot-1.png 'Connect to HubSpot')

If access to SFDC has already been authorized, John will see an option to _Disconnect_, to _Reconnect_, or to _Test_ the connection by submitting a fake newsletter signup with the intention to create a Contact record in HubSpot:

![Reconnect to HubSpot](everyauth-hubspot-4.png 'Reconnect to HubSpot')

The determination of whether HubSpot access had been authorized is made with the call to:

```javascript
const credentials = await everyauth.getIdentity(serviceId, { tenantId });
```

This method will return an _identity_ (an object with credentials required to access HubSpot APIs) if one exists for the _hubspot_ service (_serviceId_ value) and is indexed with the _contoso_ tenant identifier (_tenantId_ value). Or it will return _undefined_ if no matching identity is found. A sample HubSpot identity can look like this:

```javascript
{
  "accessToken": "CJ...", // Current access token to HubSpot APIs
  "native": {
    "timestamp": 1649810496650, // Time the credential was established
    "expires_at": 1649812296650, // Time the access token expires
    "access_token": "CJ..." // Current access token to HubSpot APIs
  },
}
```

## Adding HubSpot Authorization Flow

Notice the `/integration` view in the previous section sends the user to `/integrations/hubspot/connect` endpoint of your app to connect or re-connect to HubSpot. This endpoint is responsible for asking John Doe to authorize your app to call HubSpot API on John’s behalf. And this is where EveryAuth will do some heavy lifting for you, so you don’t have to worry about OAuth. Let’s implement this endpoint:

```javascript
// Endpoint that initiates authorization process to HubSpot
app.use(
  '/integrations/hubspot/connect',
  everyauth.authorize(serviceId, {
    finishedUrl: '/integrations/hubspot/connected',
    mapToTenantId: (req) => tenantId, // associate identity with a tenant
    mapToUserId: (req) => userId, // associate identity with a user
  })
);
```

The EveryAuth middleware used in this route will handle the OAuth flow for you, taking John through a series of redirects including HubSpot, and ultimately securely storing the established identity (credentials to access HubSpot) for later use in your app (we will come to this in a moment).

![Authorize to HubSpot](everyauth-hubspot-2.png 'Authorize to HubSpot')

The key configuration parameters to the middleware are the _mapToUserId_ and _mapToTenantId_ (both are optional). These callbacks are meant to establish the _userId_ and _tenantId_ that the newly created identity will be associated. You can conveniently look it up later using wither _userId_ or _teanntId_ with a call to `everyauth.getIdentity`. As discussed before, both the _userId_ and _tenantId_ would typically be established as part of your authentication process for this endpoint, but in this example are simply hardcoded.

Next, notice the _finishedUrl_ parameter - this is the endpoint on your app that control will return to after the authorization transaction has completed. It’s implementation can be rather simple:

```javascript
// Endpoint redirected to when HubSpot authorization process has completed
app.get('/integrations/hubspot/connected', (req, res) => {
  if (req.query.error) {
    res.send(
      `<p>There was an error authorizing access to HubSpot: ${req.query.error}<p>`
    );
  } else {
    res.redirect('/integrations');
  }
});
```

If the authorization transaction ended with an error (e.g. John clicked “Cancel” when asked by HubSpot to authorize access), a simple error message will be returned to John. Otherwise, he will be redirected back to the `/integrations` page. If you remember, that page shows a different view depending on whether HubSpot access had already been granted, and in this case, it had.

![Connected to HubSpot](everyauth-hubspot-4.png 'Connected to HubSpot')

## Disconnecting HubSpot

The `/integration` view in the previous section sends the user to `/integrations/hubspot/disconnect` endpoint of your app to remove an existing connection to HubSpot. For example, this could happen when Contoso is migrating from HubSpot to another CRM, and your app must support it.

“Disconnecting” a tenant from a service is as simple as removing that tenant’s identity from EveryAuth. The implementation of the disconnection endpoint is very simple:

```javascript
// Endpoint used to disconnect from a service
app.get('/integrations/hubspot/disconnect', async (req, res) => {
  await everyauth.deleteIdentities(serviceId, { tenantId });
  res.redirect('/integrations');
});
```

The call to `everyauth.deleteIdentities` removes all identities from the _hubspot_ service that match the _contoso_ tenant. Then, John is redirected back to the `/integrations` page which should show the HubSpot service as disconnected.

![Disconnected from HubSpot](everyauth-hubspot-1.png 'Disconnected from HubSpot')

## Let’s Create Some HubSpot Contacts!

Now that we have handled the entire lifecycle of a HubSpot connection of your app, let’s finally get to calling HubSpot APIs!

The endpoint responsible for collecting newsletter signups could look like this:

```javascript
// Test page that contains a newsletter signup form and postback logic
app.get('/newsletter/signup', async (req, res) => {
  if (req.query.email) {
    // Process form submission
    const credentials = await everyauth.getIdentity(serviceId, { tenantId });
    if (credentials) {
      // HubSpot is connected, create a Contact record
      const hubspotClient = new Client({
        accessToken: credentials.accessToken,
      });
      const contact = await hubspotClient.crm.contacts.basicApi.create({
        properties: {
          email: req.query.email,
        },
      });
      res.send(
        `Thank you for signing up to the newsletter!<br>HubSpot ID: ${contact.id}`
      );
    } else {
      res.send(
        `Thank you for signing up to the newsletter!<br>HubSpot Contact not created (HubSpot not connected).`
      );
    }
  } else {
    // Send signup form
    res.send(`
        <h2>Newsletter signup</h2>
        <form>
            <input type="email" placeholder="Email" name="email"/>
            <input type="submit" value="Subscribe" />
        </form>
    `);
  }
});
```

Let’s unpack it. There are two code paths in this route, depending on whether the request specifies `email` in the URL query parameters.

- If the `email` query param is absent, an HTML form is served that asks the user to enter their email address.
- If the `email` query param is present, it is assumed to be a postback from that very form.

Let’s have a look at the postback logic, which is where EveryAuth is used to retrieve credentials to HubSpot and create a Contact entry.

First, a credentials lookup is performed to see if _contoso_ tenant has an established connection to HubSpot:

```javascript
const credentials = await everyauth.getIdentity(serviceId, { tenantId });
```

If they did, the `@hubspot/api-client` module is used to create a HubSpot connection:

```javascript
const hubspotClient = new Client({
  accessToken: credentials.accessToken,
});
```

Lastly, a HubSpot API call is made to create a new Contact in HubSpot using the submitted e-mail address:

```javascript
const contact = await hubspotClient.crm.contacts.basicApi.create({
  properties: {
    email: req.query.email,
  },
});
```

After that, an appropriate confirmation message is displayed in HTML.

## Bring Your Own HubSpot App

There may come a moment when the shared HubSpot app that EveryAuth provides is no longer sufficient. For example, you may need additional permissions for calling a specific HubSpot API, or you want to use your own custom branding on the OAuth consent screen your users will see. EveryAuth has you covered.

EveryAuth allows you to replace the configuration of the HubSpot app with your own. You can do it using the `everyauth` CLI as follows:

```bash
everyauth service set hubspot \
  --scope "{your-scopes}" \
  --clientId "{your-client-id}" \
  --clientSecret "{your-client-secret}
```

You can read more about the HubSpot-specific options [in the documentation](https://github.com/fusebit/everyauth-express/blob/main/docs/hubspot.md).

## Conclusion

Using [EveryAuth](https://github.com/fusebit/everyauth-express), we have created a 100-line Express app that:

- Authorizes users of your app to HubSpot and manages the lifecycle of their connections afterward.
- Stores their credentials and refreshes when necessary.
- Allows your app to call HubSpot APIs on their behalf.

All that without you having to learn about OAuth, touch your application’s database, or register an application in HubSpot.

Check out [our developer blog](https://fusebit.io/blog/) and follow us on Twitter [@fusebitio](https://twitter.com/fusebitio) for other great developer content.
