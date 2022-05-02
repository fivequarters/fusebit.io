---

post_title: A Scalable Integrations Story With Asana, Google Calendar, and EveryAuth
post_author: Shehzad Akbar
post_author_avatar: shehzad.png
date: '2022-04-29'
post_image: blog-everyauth-asana-gcal-hero.png
post_excerpt: Previously, I walked through how to get set up with Google Calendar within minutes using EveryAuth. Learn today how to scale this to multiple services, starting with Asana.
post_slug: everyauth-scalable-asana-gcal
tags: ['post','authentication', 'node.js']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-everyauth-asana-gcal-hero.png
posts_related: ['everyauth','integrate-github-api-everyauth','integrate-google-calendar-node-everyauth'] 

---

Fusebit recently announced a new product called [Every Auth](https://fusebit.io/blog/everyauth/?utm_source=fusebit.io&utm_medium=referral&utm_campaign=none), the easiest way for your app to access APIs like Slack, Salesforce, or Github. In an earlier [blog post](https://fusebit.io/blog/integrate-google-calendar-node-everyauth/) I walked through how to get set up with Google Calendar within minutes. In this article, I’m going to show you how easy it is to add in a second (or third, fourth, fifth…) integration, Asana, to your app.

![App Screen with-shadow](blog-everyauth-asana-gcal-appscreen.png "App Screen")

Let’s get started.

## Use Case

Say you have a (fictional) product called ‘Work Less Live More’, or simply WLLM, that helps users optimize their work/life balance based on their scheduled meetings and work tasks. 

Your customers have been really happy with how it takes their tasks and schedules them into their calendars for them, but have been asking for integrations to their task tracking tools, like Linear, Jira or Asana. 

You’ve already built out the first integration into Google Calendar yourself (without EveryAuth), and want to add Asana to that to make your customer happy. 

Here’s what you need to do:

* Register an OAuth client representing your ‘WLLM’ app in Asana
* Make changes to your infrastructure to manage the auth flow for Asana, in addition to the Google flow - which has different endpoints, refresh processes and communication requirements
* Securely store your customers’ access and refresh tokens and make sure they are fresh when you app needs to talk to the Asana API
* Future-proof the design of your infrastructure because you know that there are more integration requests coming and will add value to your product as well and will need to account for that now

Then you come across [EveryAuth](https://github.com/fusebit/everyauth-express). 😱

You suddenly realize that you can use EveryAuth to handle all those pieces above for you. You will then be able to spend more time playing CoD, be better rested for that early morning bike ride or crank out that side project you’ve been putting off for months, all while still making your boss and your customers happy. 

You can do this all within 30 minutes by downloading the full code from the [EveryAuth Github Repo](https://github.com/fusebit/everyauth-express/tree/main/examples/asana-googlecalendar)** **and following along below. In this example repo, I use Mustache templating along with Bootstrap for the front-end to keep it simple, but you can switch it out for your framework of choice (React, Angular, Next.js etc.)

## What exactly does EveryAuth do?

EveryAuth takes care of the above pieces by:

* Providing a shared Asana application so that you don’t need to [register your own](https://developers.asana.com/docs/oauth) with to get started (you still can if you want to later).  
* Taking care of all OAuth handshakes and exchanges for you behind the scenes based on the service so you don’t need to learn about implementation details and differences between Google and Asana.  
* Handling the secure storage of your customers’ credentials on the [Fusebit]([https://fusebit.io](https://fusebit.io)) platform and automatically renewing them for you, so you don’t have to write all that boilerplate code in your app.  
* Providing a flexible credential indexing feature that allows you to avoid making changes to your database structure - you can use identifiers specific to your app as indexing keys when referencing credentials stored in EveryAuth.  
* Providing a CLI management tool that helps you manage all of your customers’ credentials and service configuration.  

After you integrate EveryAuth with your app, you can still use any SDK you want to communicate with the target platform for ultimate flexibility. 

## Google EveryAuth Blog Post Refresher

If you followed my earlier [blog post](https://fusebit.io/blog/integrate-google-calendar-node-everyauth) with Google, you will already be setup. 

![App Flow with-shadow](blog-everyauth-gcal-appflow.gif "App Flow")

Here’s a quick refresher of the things you will already have done:

Installed the EveryAuth Management CLI, along with the EveryAuth-Express middleware, and initialized the Google service with the right scopes:

```shell
npm install -g @fusebit/everyauth-cli
npm i @fusebit/everyauth-express
everyauth init
everyauth service set google --scope https://www.googleapis.com/auth/calendar
```

Added a route to automatically redirect your users to the Google OAuth flow and have them land on your calendar page once they successfully authenticate:

``` javascript
// Sign In Button redirects to Google OAuth Flow
app.use(
  '/google/authorize/:userId',
  everyauth.authorize('google', {
    // EveryAuth will automatically redirect to this route after authenticate
    finishedUrl: '/google/calendarlist',
    // The user ID of the authenticated user the credentials will be associated with
    mapToUserId: (req) => req.params.userId,
  })

);
```

Retrieved your users, always fresh, access credentials and authenticated a new Google client:

```javascript
  // Retrieve access token using userId
  const userCredentials = await everyauth.getIdentity("google", userId);

  // Call Google API
  const myAuth = new google.auth.OAuth2();
  myAuth.setCredentials({ access_token: userCredentials.accessToken });
  google.options({ auth: myAuth });
```

Used that authenticated client to securely access the Google API on behalf of your user:

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

Finally, you will have added authentication middleware, `handleSession`, to ensure that your routes are protected to ensure the person has already signed-in and previously authenticated your app with Google. 

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

This is the main piece we will be upgrading next in order to integrate Asana into the ‘WLLM’ app.

## Adding Asana 

Adding Asana into your app, using EveryAuth, is exactly the same process as adding Google (like above). 

> This is actually one of the biggest value propositions of EveryAuth, it **doesn’t matter** **what service you’re integrating with**, your software development **experience will always be the same**.

![Asana Tasks with-shadow](blog-everyauth-asana-gcal-tasks.png "Asana Tasks")

That being said, here’s a few things app-side that you’ll want to figure out:

* How do we add Asana integration into our app?
* How do we enable users to authenticate with both services in the same flow?
* How do we ensure that users have authenticated with both Google and Asana?

### Install Asana

In our example, we’re using the officially supported [Asana Node SDK](https://www.npmjs.com/package/asana), so let’s add that to our app:

```shell
npm i asana
```

```javascript
const asana = require("asana");
```

Asana doesn’t have a complicated OAuth scopes hierarchy, so you do not have to make any changes to the shared connector to get started. For production, you may want to consider [configuring your own service](https://github.com/fusebit/everyauth-express/blob/main/docs/asana.md#configure-asana-service) in the future to leverage your own branding and labeling on the OAuth flow. 

### Add Asana into your App

Next, you want to ensure that Asana gets called as part of the authentication flow, so when your users click on ‘Sign In’, they sign in to **both** services back to back. 

However, because you know that your users will continue to request more integrations down the line, let’s make sure that your approach is** easily scalable** and leverages EveryAuth’s **one size fits all **approach nicely.

First, create an object with the list of services that you want to add:

```javascript
const SERVICES = ['asana', 'google'];
```

Next, we will update our Sign-in Flow to, on start, initialize the routes with every service in this object:

```javascript
// Initialize auth route for every service
SERVICES.forEach((service) => {
  app.use(
    `/${service}/authorize/:userId`,
    everyauth.authorize(service, {
      finishedUrl: `/tasks`,
      mapToUserId: (req) => req.params.userId,
    })
  );
});
```

That’s it, now you can redirect your users to `/google/authorize/:userId` OR ‘/asana/authorize/:userId’ programmatically and it will kick off the authentication flow for them. You can also easily add any service into the mix without having to do any extra coding. 

> Out of box, EveryAuth comes with a [number of supported services]([https://github.com/fusebit/everyauth-express#supported-services](https://github.com/fusebit/everyauth-express#supported-services)), including Google and Asana. If there’s one missing, ping us and let us know - we can easily add it in for you!

## Call the Asana API

This part is **identical **to the way we worked with Google. We use EveryAuth to retrieve the latest, always fresh, access token and use that to instantiate a new Asana client.

```javascript
  // Retrieve an always fresh access token using userId
  const asanaCredentials = await everyauth.getIdentity("asana", req.session.asanaUserId);

  // Instantiate Asana Client
  const asanaClient = asana.Client.create().useAccessToken(
    asanaCredentials.accessToken
  );
```

### Get list of Tasks

![Asana Tasks with-shadow](blog-everyauth-asana-gcal-taskslist.png "Asana Tasks")

```javascript
// Retrieve authenticated user profile & workspaces
  const me = await asanaClient.users.me();
  const workspace = me.workspaces[0].gid;
  const assignee = me.gid;

// Retrieve their assigned tasks
  const tasks = await asanaClient.tasks.getTasks({ workspace, assignee });

// Retrieve task details for each task
  const taskGIDs = tasks.data.map((tasks) => ({
    taskGID: tasks.gid,
  }));
  const taskDetails = [];

  for (const gid of taskGIDs) {

    const task = await asanaClient.tasks.getTask(gid.taskGID);
    taskDetails.push({
      taskName: task.name,
      taskNotes: task.notes,
      taskDueDate: task.due_on,
    });
  }
return taskDetails;
```

### Add new Asana Task to Google Calendar

The value of having multiple integrations in one app is the ability to talk to each other. So, in this example below, you will see how we’re displaying a list of Asana tasks, but when a user clicks on any one of them - it will add that task to their Google Calendar, seamlessly.

```html
       <form
  method="POST"
  action="/tasks/calendar/"
>
       {{#TaskListData.taskDetails}}
       <button type="submit" class="list-group-item list-group-item-action" name="quickadd" value="{{ taskName }} on {{taskDueDate}}">
           <div class="row">
             <div class="col-8 text-start">
               {{ taskName }}
             </div>
             <div class="col-4 text-end">
               <span class="badge bg-primary rounded-pill">{{
                  taskDueDate
                }}</span>
             </div>
           </div>
         </button>
         {{/TaskListData.taskDetails}}
         </form>
```

```javascript
// Add a new event to a calendar by ID
app.post('/tasks/calendar/', setSession, ensureSession, async (req, res) => {

  // Retrieve access token using userId from session
  const userCredentials = await everyauth.getIdentity('google', req.session.googleUserId);

  // Retrieve QuickAddText or use a Default Fallback
  const quickAddText = req.body.quickadd || 'New Event Added by Fusebit for Tomorrow at Noon';

  // Call Google API
  const myAuth = new google.auth.OAuth2();
  myAuth.setCredentials({ access_token: userCredentials.accessToken });
  google.options({ auth: myAuth });

  // Quick Add a New Event
  const calendar = google.calendar({ version: 'v3' });
  const addQuickEvent = await calendar.events.quickAdd({
    auth: myAuth,
    calendarId: 'primary',
    text: quickAddText,
  });

  res.redirect(`/tasks`);
});
```

## Persisted Login

Of course, you also want your users to only have to sign in once, and not every time they return to your app.

Now, with a single service (Google), it was simple to check if it was authenticated or not before giving them access to a route - we did this with the use of a middleware function called ‘handleSession’ (see above) and the `cookie-session` library . 

We want to upgrade this to handle an X # of services, without having to specifically define each service. We can do this by leveraging the `serviceID` returned from EveryAuth and setting sessions with a unique identifier tied to it. 

Of course, there are many different ways to solve this problem and the approaches will vary based on how your app has been architected. For this tutorial, I’ll be following a more straightforward approach creating three different functions to handle this:

* `isAllSessionsComplete`: Check if the user is fully authenticated across all services
* `ensureSession`: Find which service the user has not authenticated with yet, and redirect them to the auth flow for it
* `setSession`: Retrieve the serviceID and set a unique session to the service

![Auth Middleware Flow with-shadow](blog-everyauth-asana-gcal-middleware.png "Auth Middleware Flow")

### isAllSessionsComplete

```javascript
// Check if all sessions are completed
const isAllSessionsComplete = (req, res, next) => {

  let isSessionComplete = true;
  SERVICES.forEach((service) => {
    // If any one service is missing, set it to False
    if (!req.session[`${service}UserId`]) {
      isSessionComplete = false;
    }
  });
  res.locals.fullyAuthenticated = isSessionComplete;
  return next();
}
```

### ensureSession

```javascript
// Check is all sessions are complete
const ensureSession = (req, res, next) => {
  SERVICES.forEach((service) => {
    // For the missing service, redirect to authorization flow for that service
    if (!req.session[`${service}UserId`]) {
      return res.redirect(`/${service}/authorize/${req.query.userId}`);
    }
  });
  return next();
};
```

### setSession

```javascript
// Set Session UserId for service
const setSession = (req, res, next) => {
  // If it returns a userID, retreive Service Name
  if (req.query.userId) {

    // Service Name will only be returned after an auth has been completed
    const serviceName = req.query.serviceId;
    if (!serviceName) {
      return res.redirect(`/`);
    }
    req.session[`${serviceName}UserId`] = req.query.userId;
  }
  return next();
};
```

Finally, you need to upgrade your routes to include this middleware. 

First, your ‘/’ route will check if the user has fully authenticated and redirect them to the appropriate page. We are using `[res.locals](https://expressjs.com/en/api.html#res.locals)` to set the `fullyAuthenticated` value in `isAllSessionsComplete` and retrieving it here.

```javascript
app.get("/", isAllSessionsComplete, (req, res) => {
  if (res.locals.fullyAuthenticated) {
    return res.redirect(`/tasks`);
  }
  return res.render("index", { userId: uuidv4() });
});
```

Next, for all your other routes, we want to make sure that the user has authenticated with all the services before they can enter.

```javascript
​​app.get("/tasks", setSession, ensureSession, async (req, res) => { 
…your code 
}

app.post('/tasks/calendar/', setSession, ensureSession, async (req, res) => {
… your code
}
```

Done! Now you can rest assured knowing that users can sync their Asana Tasks to their Google Calendar safely, securely and conveniently from right within WLLM.

## Conclusion

Congratulations! You have now learned how easy it is to integrate multiple different services into your app with EveryAuth! 

Make sure to check out the complete code in [GitHub](https://github.com/fusebit/everyauth-express/tree/main/examples/googlecalendar) and play around with it!

If you have any questions, you can reach out to me directly through our [community Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg), on [Twitter](https://twitter.com/shehzadakbar) and at [shehzad@fusebit.io](mailto:shehzad@fusebit.io).
