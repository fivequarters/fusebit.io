---
post_title: Connect Your Express Application With PagerDuty Using EveryAuth
post_author: Matthew Zhao
post_author_avatar: matthew.png
date: '2022-05-04'
post_image:
post_excerpt: EveryAuth is the easiest way to integrate with the PagerDuty API so you can manage services and incidents on the user's behalf. In this article, we will go through building an EveryAuth app that fetches data from PagerDuty.
post_slug:
tags: ['everyauth', ‘authentication’’]
post_date_in_url: false
post_og_image: ‘site’ or a custom url or ‘hero’
---

EveryAuth is the easiest way to integrate with the PagerDuty API so you can manage services and incidents on the user's behalf. In this article, we will go through building an EveryAuth app that fetches data from PagerDuty.

## Let's Get Started!

To start, let's set up the local environment. First, install the EveryAuth CLI. Run:

```bash
npm install -g @fusebit/everyauth-cli
```

Next, initialize the CLI to create all the cloud resources necessary for EveryAuth to work. Run:

```bash
everyauth init -e <your email>
```

This will create you a Fusebit account that powers EveryAuth.

## Let's Start Building!

Now, we can start building the application! First, let's set up the local environment by installing all the dependencies:

```bash
npm install express everyauth-express @pagerduty/pdjs cookie-session uuid pug
```

Next, let's create a basic scaffold of the application:

```javascript
const express = require('express');
const everyauth = require('@fusebit/everyauth-express');
const { v4: uuidv4 } = require('uuid');
const cookieSession = require('cookie-session');
const { api } = require('@pagerduty/pdjs');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');

app.use(
  cookieSession({
    name: 'sess',
    secret: process.env.COOKIE_SECRET || 'supersecuresecret',
  })
);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
```

This scaffold utilizes a couple of things. We will be using pug to generate HTML views and cookie-session to manage user sessions to store session ids. And of course, everyauth and pdjs to handle integrations with PagerDuty.

Next, we need to make express use of everyauth-express to authorize tenants through PagerDuty. Add this to your code:

```javascript
app.use(
  '/authorize/:userId',
  (req, res, next) => {
    if (!req.params.userId) {
      return res.redirect('/');
    }
    return next();
  },
  everyauth.authorize('pagerduty', {
    finishedUrl: '/finished',
    mapToUserId: (req) => req.params.userId,
  })
);
```

This enables the EveryAuth PagerDuty authorization flow from within the Express application. We also need to add a route to redirect customers to authorize if they are not authorized automatically. Add this to your code:

```javascript
app.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.redirect(`/authorize/${uuidv4()}`);
  }

  res.redirect('/finished');
});
```

All this does is when a customer goes to `/` if someone does not have a userId set - i.e., not authorized, it will redirect the client to authorize through EveryAuth with a generated UUID as the userId. Otherwise, they are redirected to what would be equivalent to the application's dashboard.

Now that we have the code to drive customers through the authorization flow, we need to have a dashboard to redirect to after going through authorization. Add this code:

```javascript
app.get('/finished', handleSession, async (req, res) => {
  const creds = await everyauth.getIdentity('pagerduty', req.session.userId);
  const sdk = api({ token: creds.accessToken, tokenType: 'bearer' });
  const services = await (await sdk.get('/services')).resource;
  const me = await (await sdk.get('/users/me')).data.user;
  res.render('index', {
    title: 'Welcome to EveryAuth PagerDuty Demo App!',
    name: me.name,
    avatar_url: me.avatar_url,
    svcs: services,
  });
});
```

This route will use authenticated credentials of the user to fetch their profile and services that are available to them to manage.

We also need a view for the dashboard, create a folder named view and a file named `index.pug`, and add the following content:

```pug
doctype HTML

html
  head
    title title
  body
    .container
      .profile
        h2 Welcome #{name}
            img.pic(src=avatar_url alt='PD Avatar')
            h2 Your services (#{svcs.length})
              table()
                thead
                  tr
                    th() #
                    th() Name
                    th() Status
                    each svc, index in svcs
                      tbody
                        tr
                        th() #{index + 1}
                          td
                            a(href=svc.self) #{svc.name}
                            td #{svc.status}
```

With all these pieces in place, let's boot up the webserver! Run:

```bash
node index.js
```

it should print:

```
Example app listening on port 3000
```

And you can head to `http://localhost:3000/`, and it should redirect you to EveryAuth to authenticate with PagerDuty.

<Insert pagerduty hosted link>

# Before You Go...

Come check out other SaaS systems that EveryAuth can authenticate with. For example, [slack](https://fusebit.io/blog/everyauth-slack-messages/), [github](https://fusebit.io/blog/integrate-github-api-everyauth/), and [linear](https://fusebit.io/blog/using-linear-with-everyauth/). Also follow us on Twitter at [@fusebitio](https://twitter.com/fusebitio)
