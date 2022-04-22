---
post_title: Integrate Google Calendar To Your Node.js Express App Quickly Using EveryAuth
post_author: Shehzad Akbar
post_author_avatar: shehzad.png
date: '2022-04-22'
post_image: blog-everyauth-gcal-hero.png
post_excerpt: Add a Google Calendar integration to your Node.js Express app without having to worry about the headache of OAuth flows & access token management. 
post_slug: everyauth-google-calendar
tags: ['post','node.js','authentication']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-everyauth-gcal-hero.png
posts_related: ['everyauth','TBD','TBD'] 
---

Fusebit recently announced a new product called [EveryAuth](https://fusebit.io/blog/everyauth/?utm_source=fusebit.io&utm_medium=referral&utm_campaign=none), the easiest way for your app to access APIs like Slack, Salesforce, or Github. Suppose you're working on a Node.js Express app and want to add a Google Calendar integration to it without having to worry about the headache of OAuth flows & access token management. In that case,this article is for you.

Learn how to use EveryAuth, in your Node.js Express app, with the Google Calendar API to: 

* Facilitate user sign in using Google & authorize your app
* Display upcoming calendar events for the signed in user
* Add new events to a calendar using simple text e.g., “Schedule Dinner tomorrow night at 8 PM”
* Securely persist login credentials, so users don’t have to sign in again

![App Flow with-shadow](blog-everyauth-gcal-appflow.gif "App Flow")

You can do this all within 30 minutes by downloading the full code from our [GitHub repo](https://github.com/fusebit/everyauth-express/tree/main/examples/googlecalendar)** **and following along below. In this example repo, I use Mustache templating along with Bootstrap for the front-end to keep it simple, but you can switch it out for your framework of choice (React, Angular, Next.js etc.)

## Getting Setup

First, install the EveryAuth CLI:

```shell
npm install -g @fusebit/everyauth-cli
```

Then, In the root directory of your Express application, run:

```shell
everyauth init
```

EveryAuth comes pre-built with OAuth clients to get you started quickly, however, because we are accessing the Google Calendar API, we want to ensure that we request the [appropriate scopes](https://developers.google.com/calendar/api/guides/auth) from the user explicitly.

```shell
everyauth service set google --scope https://www.googleapis.com/auth/calendar
```

Next, let’s install the following dependencies:

* [express ](https://www.npmjs.com/package/express)- Server framework for Node.js 
* [everyauth-express](https://www.npmjs.com/package/@fusebit/everyauth-express) - EveryAuth express middleware  
* [googleapis](https://www.npmjs.com/package/googleapis) - Official Google Node.js Client for interacting with Google APIs
* [uuid](https://www.npmjs.com/package/uuid) - Generate a Universally Unique Identifier
* [cookie-session](https://www.npmjs.com/package/cookie-session) - Simple cookie-based session middleware
* [mustache-express](https://www.npmjs.com/package/mustache-express) - Use Mustache templating with Express

```shell
npm i express
npm i @fusebit/everyauth-express
npm i googleapis
npm i uuid
npm i cookie-session
npm i mustache-express
```

Create a new `index.js` file, which includes all the dependencies and sets up your express app. You can use the provided file from the repo above (recommended) or scaffold a new one using `npx express-generator’ to start from scratch.

## Sign-In Flow

The first screen that users will see is the Sign In page, this is where they will use their Google Account and authorize your app to access their calendar. 

EveryAuth handles authentication and authorization for you, all you need to do is point your users to it and the installation flow kicks off automatically.  Let's add this first route to your express app, the landing page. 

![Sign In Landing Page with-shadow](blog-everyauth-gcal-signin.png "Sign In Landing Page")

> If you haven’t already, you **need** to configure EveryAuth in your development environment first. You can follow the [getting started](https://github.com/fusebit/everyauth-express#getting-started) guide from the EveryAuth GitHub Repository. Remember to set the appropriate scopes using `everyauth service set google --scope https://www.googleapis.com/auth/calendar`

When a user visits, generate a new UUID  as an identifier and pass it along to the `index` template. This is also really useful because it enables multiple users to sign-in through your app. You may choose to replace this with an identifier that is unique to your app.

```javascript

// Main Landing Page with Google Sign-In
app.get("/", (req, res) => {
  return res.render("index", { userId: uuidv4() });
});

```

When a user clicks on ‘Sign In’ they are redirected to ‘/google/authorize/:userId’ and this is where EveryAuth kicks in. It will automatically redirect them to Google to perform the authorization flow, and then return them back to `/google/calendarlist`, or whatever route you define.

```javascript

// Sign In Button redirects to Google OAuth Flow
app.use(
  "/google/authorize/:userId",
  everyauth.authorize("google", {
    // EveryAuth will automatically redirect to this route after authenticate
    finishedUrl: "/google/calendarlist",
    // The user ID of the authenticated user the credentials will be associated with
    mapToUserId: (req) => req.params.userId,
  })
);
```

Done! 

Your user has authenticated themselves with Google and your app now has the authorization to make calls and retrieve data on their behalf. 

## Call the Google Calendar API

EveryAuth uses the concept of an _identity _to associate the user to your app and store their access credentials securely. Behind the scenes, it makes sure to automatically refresh access tokens on time so that whenever your app talks to the Google Calendar API, it’s always using the most current token.

So, first, you are going to retrieve this token by calling `everyauth.getIdentity(“google”, userId)`. Then you can use the access token from that identity to instantiate the Google client and make the API calls you want.

```javascript
  // Retrieve access token using userId
  const userCredentials = await everyauth.getIdentity("google", userId);

  // Call Google API
  const myAuth = new google.auth.OAuth2();
  myAuth.setCredentials({ access_token: userCredentials.accessToken });
  google.options({ auth: myAuth });
```

### Get list of Calendars

![List of Calendars with-shadow](blog-everyauth-gcal-calendarlist.png "List of Events")

To get a list of calendars under the user's account, make a call using `calendar.calendarList.list` and include the `auth` client as part of the request. This will be required for all calls you make to the Google Calendar API.

```javascript
  // Get list of calendars
  const calendar = google.calendar({ version: "v3" });
  const calendarList = await calendar.calendarList.list({
    auth: myAuth,
    calendarId: "primary",
  });
 return calendarList;
```

### Get List of Events

![List of Events with-shadow](blog-everyauth-gcal-eventslist.png "List of Events")

You can also, very similarly, retrieve a list of all the events for a calendar, (either primary or specified by calendarId). In this example below, i’ve also specified a `timeMin` so that it doesn’t show historical events:

```javascript
  // Get list of events
  const calendar = google.calendar({ version: "v3" });
  const calendarEvents = await calendar.events.list({
    auth: myAuth,
    calendarId: ‘primary’,
    timeMin: today,
  });
  return calendarEvents;
```


### Add a new Event

![Add New Event with-shadow](blog-everyauth-gcal-quickadd.png "Add New Event")

Google Calendar has a really nifty feature called [Quick Add](https://developers.google.com/calendar/api/v3/reference/events/quickAdd) that allows you to add new events using a simple text string. For instance, if you type in “Check-In Call at 11 AM on Monday Next Week”, it will automatically create a new event on Monday, next week at 11 AM.


```javascript
  // Quick Add a New Event
  const calendar = google.calendar({ version: "v3" });
  const addQuickEvent = await calendar.events.quickAdd({
    auth: myAuth,
    calendarId: myCalendarId,
    text: quickAddText,
  });
 return addQuickEvent;
```

## Persisted Login

So far, in the examples above, we assume that the user is logging in every time, but that’s a poor experience. We can make that better, very easily.

When EveryAuth redirects a user from the sign-in page to the `finishedURL` it also includes the ‘userId’ as part of the query parameter. We will use this functionality and leverage a well-known cookie-session library and express middleware to make sure that if they have already authenticated before - it automatically takes them to their calendar. 

First, add cookieSession to your app:

```javascript
const cookieSession = require("cookie-session");
app.use(cookieSession({ name: "session", secret: "secret" }))
```

Now, we will create a middleware function called `handleSession`, this will check if there’s an existing userId (either in the request query or the session) and redirect the user accordingly:

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
```

Next, add this middleware to all your routes so they are automatically protected:

```javascript
app.get('/google/calendarlist', handleSession, async (req, res) => {...}
app.get('/google/calendar/events/:calendarId', handleSession, async (req, res) => {...}
app.post('/google/calendar/events/:calendarId', handleSession, async (req, res) => {...}
```

Finally, on your landing page route, add the inverse flow. If a userId exists, redirect them to the first page, otherwise go to the index and follow the login process.

```javascript
// Main Landing Page with Google Sign-In
app.get("/", (req, res) => {
  // Check if user has visited before
  if (req.session.userId) {
    return res.redirect(`/google/calendarlist`);
  }

  return res.render("index", { userId: uuidv4() });
});
```

Done! Now you can rest assured knowing that users can access their google calendars safely, securely and conveniently from right within your app.

## Conclusion

Congratulations! You have now learned how easy it is to integrate Google Calendar into your app with EveryAuth! 

Make sure to check out the complete code in [GitHub](https://github.com/fusebit/everyauth-express/tree/main/examples/googlecalendar) and play around with it!

If you have any questions, you can reach out to me directly through our [community Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg), on [Twitter](https://twitter.com/shehzadakbar) and at [shehzad@fusebit.io](mailto:shehzad@fusebit.io).
