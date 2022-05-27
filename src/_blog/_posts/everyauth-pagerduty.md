---
post_title: Connect Your Express Application With PagerDuty Using EveryAuth
post_author: Matthew Zhao
post_author_avatar: matthew.png
date: '2022-05-26'
post_image: everyauth-pagerduty.png
post_excerpt: EveryAuth is the easiest way to integrate with the PagerDuty API so you can manage services and incidents your user's behalf.
post_slug: everyauth-pagerduty
tags: ['post', 'authentication', 'integrations']
post_date_in_url: false
post_og_image: 'hero'
posts_related: ['everyauth', 'everyauth-hubspot', 'integrate-github-api-everyauth']
---

EveryAuth is the easiest way to integrate with the PagerDuty API so you can manage services and incidents your user's behalf. In this article, we will go through building an EveryAuth app that fetches data from PagerDuty.

![Screenshot demo with-shadow](https://github.com/fusebit/everyauth-express/blob/main/examples/pagerduty/pd-demo.png?raw=true "Screenshot demo")

## Let's Get Started!

To start, let's set up the local environment. First, install the EveryAuth CLI. Run:

```bash
npm install -g @fusebit/everyauth-cli
```

Next, initialize the CLI to create all the cloud resources necessary for EveryAuth to work. Run:

```bash
everyauth init -e <your email>
```

This will create a EveryAuth account.

## Let's Start Building!

Now, we can start building the application! First, let's set up the local environment by installing all the dependencies:

```bash
npm install express everyauth-express @pagerduty/pdjs cookie-session uuid pug
```

Next, let's create a basic scaffold of the application.
This scaffold utilizes a couple of things. We will be using pug to generate HTML views and cookie-session to manage user sessions to store session ids. And of course, everyauth and pdjs to handle integrations with PagerDuty:

```javascript
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cookieSession = require("cookie-session");
const { api } = require("@pagerduty/pdjs");

const everyauth = require("@fusebit/everyauth-express");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "pug");

app.use(
  cookieSession({
    name: "sess",
    secret: process.env.COOKIE_SECRET || "supersecuresecret",
  })
);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
```

Next, we need to make express use of everyauth-express to authorize tenants through PagerDuty. Add this to your code:

```javascript
app.use(
  "/authorize/:userId",
  (req, res, next) => {
    if (!req.params.userId) {
      return res.redirect("/");
    }
    return next();
  },
  everyauth.authorize("pagerduty", {
    finishedUrl: "/finished",
    mapToUserId: (req) => req.params.userId,
  })
);
```

This enables the EveryAuth PagerDuty authorization flow from within the Express application. We also need to add a route to redirect customers to authorize if they are not authorized automatically. Add this to your code:

```javascript
app.get("/", (req, res) => {
  if (!req.session.userId) {
    return res.redirect(`/authorize/${uuidv4()}`);
  }

  res.redirect("/finished");
});
```

All this does is when a customer goes to `/` if someone does not have a userId set - i.e., not authorized, it will redirect the client to authorize through EveryAuth with a generated UUID as the userId. Otherwise, they are redirected to what would be equivalent to the application's dashboard.

Now that we have the code to drive customers through the authorization flow, we need to have a dashboard to redirect to after going through authorization. Add this code:

```javascript
pp.get("/finished", validateSession, async (req, res) => {
  // Handle if any error occurs during the authorization flow.
  const { error } = req.query;

  if (error) {
    return res.render("index", {
      error,
    });
  }

  // Get PagerDuty service credentials.
  const creds = await everyauth.getIdentity("pagerduty", req.session.userId);
  const sdk = api({ token: creds.accessToken, tokenType: "bearer" });

  // List service directory
  const services = (await sdk.get("/services")).resource;

  // Get authorizing user PagerDuty profile information.
  const me = (await sdk.get("/users/me")).data.user;

  // Display the data
  res.render("index", {
    title: "Welcome to EveryAuth PagerDuty Demo App!",
    name: me.name,
    avatar_url: me.avatar_url,
    services,
  });
});

/**
 * Create a new incident for a specific service
 */
app.post("/incident", validateSession, async (req, res) => {
  // Handle if any error occurs during the authorization flow.
  const { error, service } = req.query;

  if (error) {
    return res.render("index", {
      error,
    });
  }

  if (!service) {
    return res.render("index", {
      error: "Missing a service to trigger the incident",
    });
  }

  // Get PagerDuty service credentials.
  const creds = await everyauth.getIdentity("pagerduty", req.session.userId);
  const sdk = api({ token: creds.accessToken, tokenType: "bearer" });

  // Get authorizing user PagerDuty profile information.
  const me = (await sdk.get("/users/me")).data.user;

  const incident = await sdk.post("/incidents", {
    data: {
      incident: {
        type: "incident",
        title: "The server is on fire.",
        service: {
          id: req.query.service,
          type: "service_reference",
        },
      },
    },
  });

  // Display the created incident
  res.render("incident", {
    title: "Incident created",
    name: me.name,
    avatar_url: me.avatar_url,
    incident: incident.data.incident,
  });
});
```

This route will use authenticated credentials of the user to fetch their profile and services that are available to them to manage.

We also need a view for the dashboard, create a folder named view and a file named `index.pug`, and add the following content:

```pug
doctype html

html
  head
    title='PagerDuty demo'
    style
      include ./style.css
    script(src='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/js/all.min.js' defer integrity="sha512-6PM0qYu5KExuNcKt5bURAoT6KCThUmHRewN3zUFNaoI6Di7XJPTMoT6K0nsagZKk2OB4L7E3q1uQKHNHd4stIQ==" crossorigin="anonymous")
  body
    .header
      .logo
        img.logo(src='https://pd-static-assets.pagerduty.com/logos/main.svg')
      unless error
        .profile
          img.pic(src=avatar_url alt='PD Avatar')
          p=name

    .container
        unless !error
          .error
            h1='Oops got an error'
            p=error
        unless error
          h2 Service Directory (#{services.length})
          .services
            each svc, index in services
              div(class=`service-container status-${svc.status}`)
                .service
                  .status
                    if svc.status === 'active'
                      i(class="fa-solid fa-check active")
                    if svc.status === 'critical'
                      i(class="fa-solid fa-fire critical")
                    if svc.status === 'warning'
                      i(class="fa-solid fa-warning warning")
                    span=svc.status
                  .details
                    a(href=svc.self) #{svc.name}
                    p!=svc.description
                .footer
                  form(action=`/incident?service=${svc.id}` method="post")
                    button.send-button(action='submit')
                      i(class="fa-solid fa-bounce fa-fire")
                      span='This service is on fire!'

```

Lets also add a view for creating incidents!

```pug
  doctype html

html
  head
    title='PagerDuty incident created'
    style
      include ./style.css
    script(src='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/js/all.min.js' defer integrity="sha512-6PM0qYu5KExuNcKt5bURAoT6KCThUmHRewN3zUFNaoI6Di7XJPTMoT6K0nsagZKk2OB4L7E3q1uQKHNHd4stIQ==" crossorigin="anonymous")
  body
    .header
      .logo
        img.logo(src='https://pd-static-assets.pagerduty.com/logos/main.svg')
      unless error
        .profile
          img.pic(src=avatar_url alt='PD Avatar')
          p=name

    .container
        unless !error
          .error
            h1='Oops got an error'
            p=error
        unless error
          .incident
            h1.success='Incident created'
            p=`Incident number:${incident.incident_number}`
            h1=incident.title
            p=`Created at ${incident.created_at}`
            p=`Status: ${incident.status}`
            p=`Urgency: ${incident.urgency}`
            a(href=incident.html_url) #{incident.summary}
            p='Service'
            a(href=incident.service.html_url) #{incident.service.summary}
```

Finally, a little (minified) CSS magic is in order, add this in `views/style.css`:

```css
*{margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"}h2{margin:10px}.header{display:flex;flex-direction:row;height:80px;align-items:center;justify-content:center;background-color:#e3ecf6;position:fixed;width:100%;top:0;z-index:1;box-shadow:#8a8686 0 -1px 18px 10px}.logo{height:40px;padding:10px;margin-bottom:10px}.container{margin-top:80px;padding:10px}.logo-container{display:flex;flex-direction:row;align-items:center;justify-content:center;align-content:center;flex-wrap:wrap}.profile{display:flex;flex-direction:row;align-items:center;justify-content:space-around;flex-wrap:nowrap;color:#2d2d2d}.profile .pic{height:40px;height:40px;width:40px;border-radius:50%;margin:auto auto 10px auto;display:block;box-shadow:0 3px 0 1px rgb(37 39 40 / 10%);margin:10px;border:solid 1px #e2d7d0;padding:5px}.error{background-color:#e888a9;padding:10px;color:#fff;border-left:solid 10px #e91e63}.services{display:flex;flex-direction:column}.service{background-color:#f3f3f3;padding:10px;display:flex;flex-direction:row}svg.active{color:#009688}svg.critical{color:#e91e63}svg.warning{color:#d8932d}.status-critical{border-left:solid 5px #e91e63!important}.status-active{border-left:solid 5px #009688!important}.status-warning{border-left:solid 5px #d8932d!important}.footer button{background:#1155e6;border-radius:5px;box-shadow:0 2px 1px 0 #e5e5e5;padding:14px;font-size:16px;color:#fff;border:0;cursor:pointer}.footer button svg{padding-right:5px;color:#ffeb3b}.footer{background-color:#e3e3e3;padding:10px;border-radius:0 0 10px 10px}.status{background-color:#fff;box-shadow:5px 4px 5px 2px #a29b9b;border-radius:10px;padding:10px;text-align:center;width:100px;margin-right:10px;margin-bottom:auto}.status svg{padding-right:5px}.service-container{border:solid 1px;margin:10px;padding:10px;background-color:#fff}.details{padding:10px}.details a{font-size:18px}.incident{width:400px;margin:0 auto;background-color:#f3f3f3;padding:10px}.success{background-color:#139085;padding:10px;color:#fff}
```

With all these pieces in place, let's boot up the webserver!

Run:

```bash
node index.js
```

It should output:

```
Example app listening on port 3000
```

And you can head to `http://localhost:3000/`, and it should redirect you to EveryAuth to authenticate with PagerDuty.

## Conclusion

Congratulations! In less than 200 lines of code and 5 minutes, you are able to set up a brand new Express app that natively integrates with PagerDuty, without ever dealing with the complexity that is OAuth.

Come check out other SaaS systems that EveryAuth can authenticate with. For example, [slack](https://fusebit.io/blog/everyauth-slack-messages/), [github](https://fusebit.io/blog/integrate-github-api-everyauth/), and [linear](https://fusebit.io/blog/using-linear-with-everyauth/). Also follow us on Twitter at [@fusebitio](https://twitter.com/fusebitio) for more helpful developer content.
