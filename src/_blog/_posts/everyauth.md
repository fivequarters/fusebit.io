---
post_title: Introducing EveryAuth
post_author: Tomasz Janczuk
post_author_avatar: tomek.png
date: '2022-04-11'
post_image: google-sheets-slack.png
post_excerpt: EveyAuth is the easiest way to call third party APIs from your app without learning OAuth.
post_slug: everyauth
tags: ['post', 'developer tools', 'integrations']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/google-sheets-slack.png
posts_related:
  [
    'bots-hooks-extensions',
    'run-every-nodejs-version-in-lambda',
    'api-metering-analytics-express',
  ]
---

The [fusebit/everyauth](https://github.com/fusebit/everyauth) project is the easiest way to call third party APIs from your app without learning OAuth.

The day has come to add integrations to your app. You want to connect to third-party services like Salesforce, Slack, or HubSpot on behalf of your users. The first problem you need to solve is having your users authorize your app to access external APIs. Then you need to store your users' credentials for later use. The [fusebit/everyauth](https://github.com/fusebit/everyauth) project makes authorization and credential management in your Node.js app easy so that you can focus on the integration logic.

```javascript
import everyauth from '@fusebit/everyauth-express';
import { WebClient } from '@slack/web-api';

// Rapidly add support for users to authorize access to Slack APIs
router.use(
  '/slack',
  everyauth.authorize('slack', {
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

## More than OAuth

There is more to calling external APIs from your app than OAuth, just like there is more to electricity than an electric outlet.

#### OAuth, Normalized

The OAuth protocol is designed to allow users of your app to authorize it to call external APIs on their behalf. The protocol has enough flexibility for specific implementations to differ. As a developer, you need to understand the specifics of the individual services you are connecting to. EveryAuth reduces the OAuth learning curve by normalizing the protocol of various services and gets you to call actual APIs faster.

#### Secure, Multi-Tenant OAuth Credentials Storage

After obtaining the authorization to connect to an external system on behalf of your user, your app will usually make the actual API call only later. The OAuth protocol calls this situation _offline access_. It addresses this scenario by supporting _refresh tokens_ - long-lived credentials that must be exchanged for short-lived _access tokens_ closer to calling the target API. Your app must durably store the refresh tokens and associate them with a specific user or tenant. EveryAuth provides a secure, multi-tenant credentials storage with a flexible indexing capability so that you don't need to change the database schema of your app to store your users' credentials.

#### Credentials Lifecycle Management

To call an OAuth-protected third-party API, your app needs to exchange the refresh token for an access token. Although this part of the protocol is fairly standard, differences in implementations between services still exist. In addition to understanding them, your app also needs to keep track of when access tokens expire so that they are refreshed in a timely manner. EveryAuth abstracts all this logic away from your app, providing you with an access token guaranteed to be current just in time to call the target API.

#### Pre-Created OAuth Applications

Your app must be pre-registered with the target platform like Salesforce, Slack, or Google before you can ask your users for authorization to connect to it on their behalf. The registration process can be as simple as Slack or as gnarly as Google. During the registration process, you usually specify the set of permissions your app will require. EveryAuth comes with a number of shared, pre-registered OAuth applications to major services with basic permissions so that you can skip this part of the process and get right down to calling the APIs. You can later reconfigure EveryAuth to use your own OAuth application with the exact permissions you need.

#### Express Middleware

To enable your users to authorize your web app to a third-party service using OAuth requires you to add OAuth-specific endpoints to your app. EveryAuth makes is as simple as a few lines of code with the Express middleware for Node.js.

## How Does EveryAuth Work?

The [fusebit/everyauth](https://github.com/fusebit/everyauth) project consists of Express middleware, a CLI, and a cloud service that acts as an OAuth broker between your application and the external APIs you are calling.

![EveyAuth](everyauth.png 'EveryAuth')

To ask a user of your app for authorization to a specific third-party API, you direct the user's browser to an endpoint of your app implemented using EveryAuth Express middleware (_/slack_ in the example above). The middleware will then take the browser through a series of redirects to obtain the user's authorization to the target service like Salesforce, HubSpot, or Slack. When the process is done, control is returned to your application with a final redirect.

When the time comes to call an external API, your app communicates again with EveryAuth through the _getIdenity_ to obtain the access token. EveryAuth ensures the access token is always fresh and will use the refresh token to obtain a new access token if necessary.

## How Do I Get Started?

Check out the step-by-step instructions on Github at [fusebit/everyauth](https://github.com/fusebit/everyauth) to get started.

EveryAuth is part of [Fusebit](https://fusebit.io)'s code-first integration platform that helps developers add integrations to their apps. We live and breathe integrations. Follow us on Twitter [@fusebitio](https://twitter.com/fusebitio) for great developer content, and check out other OSS projects at [github.com/fusebit](https://github.com/fusebit).
