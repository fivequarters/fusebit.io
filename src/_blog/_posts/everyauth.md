---
post_title: 'Introducing Everyauth: The Easiest Way to Call 3rd Party APIs From Your App'
post_author: Tomasz Janczuk
post_author_avatar: tomek.png
date: '2022-04-11'
post_image: blog-bots-hooks-extensions-main.jpg
post_excerpt: EveryAuth handles OAuth flow to external services and manages your users’ credentials so that you can focus on your integration logic rather than busywork.
post_slug: everyauth
tags: ['post', 'authentication', 'integrations']
post_date_in_url: false
post_og_image: blog-bots-hooks-extensions-main.jpg
posts_related: ['', '', '']
---

The [fusebit/everyauth](https://github.com/fusebit/everyauth) project is the easiest way to call third-party APIs from your app without learning OAuth.

The day has come to add integrations to your app. You want to connect to third-party services like Salesforce, Slack, or HubSpot on behalf of your users. The first problem you need to solve is having your users authorize your app to access external APIs. The solution usually requires you to do the following:

- Register an OAuth client for a specific service.
- Take your users through the OAuth authorization flow.
- Update your database and logic to store and refresh your users' credentials for later use.

The [fusebit/everyauth](https://github.com/fusebit/everyauth) project makes this authorization and credential management work disappear so that you can focus on the integration logic.

```javascript
import everyauth from '@fusebit/everyauth-express';
import { WebClient } from '@slack/web-api';

// Rapidly add support for users to authorize access to Slack APIs
router.use(
  '/slack',
  everyauth.authorize('slack', {
    finishedUrl: “/slack/finished”,
    mapToUserId: async (req) => req.user.id,
  })
);

// Easily use these credentials with the native Slack SDK
router.get('/slack/finished', async (req, res) => {
  const userCredentials = await everyauth.getIdentity('slack', req.user.id);

  const slack = new WebClient(userCredentials.accessToken);
  await slack.chat.postMessage({
    text: 'Hello world from EveryAuth!',
    channel: '#general',
  });

  res.send('Success with EveryAuth');
});
```

If you are ready to jump in, head over to the [fusebit/everyauth](https://github.com/fusebit/everyauth) project on GitHub for detailed instructions. Or read on to learn more about EveryAuth.

## More than OAuth

There is more to calling external APIs from your app than OAuth, just like there is more to electricity than an electric outlet.

### OAuth, Normalized

The OAuth protocol is designed to allow users of your app to authorize it to call external APIs on their behalf. The protocol has enough flexibility for specific implementations to differ. As a developer, you need to understand the specifics of the individual services you are connecting to. EveryAuth reduces the OAuth learning curve by normalizing the protocol of various services and getting you to access data from them faster.

### Secure, Multi-Tenant OAuth Credentials Storage

After obtaining the authorization to connect to an external web service on behalf of your end-user, your app will usually make the actual API call only later. The OAuth protocol calls this situation _offline access_. It addresses this scenario by supporting _refresh tokens_ - long-lived credentials that must be exchanged for short-lived _access tokens_ closer to calling the target API. Your app must store the refresh tokens and associate them with a specific user or tenant. EveryAuth provides a secure, multi-tenant credentials storage with a flexible indexing capability so that you don't need to change the database schema of your app to store your users' credentials.

### Credentials Lifecycle Management

To call an OAuth-protected third-party API, your app needs to exchange the refresh token for an access token. Although this part of the protocol is fairly standard, differences in implementations between services still exist. In addition to understanding them, your app also needs to keep track of when access tokens expire so that they are refreshed in a timely manner. EveryAuth abstracts all this logic away from your app, providing you with an access token guaranteed to be current just in time to call the target API of the resource server.

### Pre-Created OAuth Applications

Your app must be pre-registered with the target platform like Salesforce, Slack, or Google before asking your users for authorization to connect to it on their behalf. The registration process can be as simple as Slack or as gnarly as Google. During the registration process, you usually specify the set of permissions your app will require and are assigned a client ID and client secret that identifies your app. EveryAuth comes with a number of shared, pre-registered OAuth applications to popular services with basic permissions so that you can skip this part of the process and get right down to calling the APIs. You can later reconfigure EveryAuth to use your own OAuth client ID and secret with the exact permissions you need.

### Express Middleware

To enable your users to authorize your web app to a third-party service using OAuth requires you to add OAuth-specific endpoints to your app. EveryAuth makes it as simple as a few lines of code with the Express middleware for Node.js.

## How Does EveryAuth Work?

The [fusebit/everyauth](https://github.com/fusebit/everyauth) project consists of Express middleware, a CLI, and a cloud service that acts as an OAuth broker between your application and the external webservers you are calling.

![EveryAuth](everyauth.png 'EveryAuth')

To ask a user of your app for authorization to a specific third-party API, you direct the user's browser to an endpoint of your app implemented using EveryAuth Express middleware (_/slack_ in the example above). The middleware will then take the browser through a series of redirects to obtain the user's authorization to the target service like Salesforce, HubSpot, or Slack. Control is returned to your application with a final redirect when the process is done..

When the time comes to call an external API, your app communicates again with EveryAuth through the _getIdenity_ call to obtain the access token. EveryAuth ensures the access token is always fresh and will use the refresh token to get a new access token if necessary.

## How Do I Get Started?

Check out the step-by-step instructions on Github at [fusebit/everyauth](https://github.com/fusebit/everyauth) to get started.

EveryAuth is part of [Fusebit](https://fusebit.io)'s code-first integration platform that helps developers add integrations to their apps. We live and breathe integrations. Follow us on Twitter [@fusebitio](https://twitter.com/fusebitio) for great developer content, and check out other OSS projects at [github.com/fusebit](https://github.com/fusebit).
