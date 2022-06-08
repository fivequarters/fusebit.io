---
post_title: Connect Your Express Application to the Linear API Using EveryAuth
post_author: Rubén Restrepo
post_author_avatar: bencho.png
date: '2022-04-29'
post_image: linear-everyauth-example.png
post_excerpt: Learn how to use the Linear API by creating an Express application that displays a custom form to create new issues
post_slug: using-linear-with-everyauth
tags: ['post', 'authentication']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/linear-everyauth-example.png
posts_related: ['everyauth','integrate-github-api-everyauth', 'integrate-linear-api-everyauth']
---

Recently Fusebit announced [EveryAuth](https://fusebit.io/blog/everyauth/?utm_source=fusebit.io&utm_medium=referral&utm_campaign=none) project that allows you to integrate with multiple services via OAuth easily. Learn how to use EveryAuth with Linear API using the [@linear/sdk](https://www.npmjs.com/package/@linear/sdk) package.

You have an existing Express.js application that needs to integrate with Linear API to display the following information:
- Linear’s user profile information
- Last 10 updated `Open` assigned issues
- A custom form for new linear issue creation

The application will look like this once you authorize the application to interact with your Linear account:

![Using Linear API with EveryAuth with-shadow](blog-using-linear-with-everyauth.png 'Linear example with EveryAuth')
## Configuring EveryAuth

This blog post assumes you already have EveryAuth configured in your development environment. In case you don’t, follow the [configuration steps](https://github.com/fusebit/everyauth-express#getting-started) from the EveryAuth GitHub Repository.

A basic Express application will look like the following:

```javascript
const express = require('express');

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

Let’s add support to EveryAuth and configure the Linear service so we can interact with their API.

## Install dependencies

For interacting with Linear API from Node.js we will use the official [@linear/sdk](https://www.npmjs.com/package/@linear/sdk)

```shell
npm i @linear/sdk
```

Install the [@fusebit/everyauth-express](https://www.npmjs.com/package/@fusebit/everyauth-express) package

```shell
npm i @fusebit/everyauth-express
```

Install the [uuid](https://www.npmjs.com/package/uuid) package. Used to generate a unique identifier for the userId.

```shell
npm i uuid
```
Install the [cookie-session](https://www.npmjs.com/package/cookie-session) package to allow your application to establish a session (an HTTP-Only cookie) to store the authorizing user id.

```shell
npm i cookie-session
```

## Add Routes

There are two critical routes we need to add to our application:

- Authorize route
- Finished route

Let’s understand the role of each route:

### Authorize route

EveryAuth middleware enables your application to perform an authorization flow for a particular service.
EveryAuth provides an out-of-the-box shared Linear OAuth Client so that you can get up and running quickly.

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
  everyauth.authorize('linear’, {
    // The endpoint of your app where control will be returned afterwards
    finishedUrl: '/finished',
    // The user ID of the authenticated user the credentials will be associated with
    mapToUserId: (req) => req.params.userId,
  })
);
```

You can define any name you want for the authorization route. In our previous example, it’s called `authorize`, but it’s up to you, and your application needs to use a different name/path. 

### Finished route

After the authorization flow finishes, control is returned to your application by redirecting the user to the configured `finishedUrl` in the `authorize` route.
The redirection includes query parameters that your application can use to know the [operation status](https://github.com/fusebit/everyauth-express#authorizeserviceid-options).
You can use any path for the route. Just ensure it matches what you have configured in the `finishedUrl` property.
In this route, you can now interact with the Linear API by leveraging the EveryAuth service to get a fresh access token.

### Show User Profile and Last Ten Issues
 
We will get the information of the user who authenticated  with Linear n and also the last 10 `Open` issues assigned to them, using the REST API.

```javascript
app.get('/finished', handleSession, async (req, res) => {
  const userCredentials = await everyauth.getIdentity('linear', req.session.userId);
  const linearClient = new LinearClient({ accessToken: userCredentials?.accessToken });

  // Get the current authorizing linear user.
  const me = await linearClient.viewer;

  // Get the authorizing user teams used to select the team you want to use when
  // creating a new Linear issue.
  const teams = await me.teams();

  // Get the latest updated 10 'Open' assigned issues
  const myIssues = await me.assignedIssues({
    first: 10,
    orderBy: 'updatedAt',
    filter: {
      state: {
        name: {
          neq: 'Done',
        },
        and: {
          name: {
            neq: 'Canceled',
          },
        },
      },
    },
  });

 res.render('index', {
    title: `Linear demo for ${me.displayName}`,
    ...me,
    issues: myIssues.nodes,
    teams: teams.nodes,
  });
```

### Display the data

Now, we need to display the data. We will use a simple template engine called [pug](https://www.npmjs.com/package/pug), which allows us to quickly render an HTML page with the data returned from Linear.

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
  .container
    .profile
      .top
        img.pic(src=avatarUrl alt='Linear Avatar')
        h2=name 
        a(href=url) View profile
        p=bio
        span=`Created ${createdIssueCount} issues.`
        form(action="/create-issue" method="post")
          fieldset
            legend(align='left')='Create a new issue'
            .item
              label(for='team')='Select a team'
              select(id='teamId' name='teamId')
                each val in teams
                  option(value=val.id select)=val.name
            .item 
              label(for='title')='Title'
              input(type="text" id='title' name='title')
            .item 
              label(for='description')='Description'
              textarea(name="description" id='description' cols="30" rows="10")
          .send-area
            button.send-button(action='submit')
              i(class="fa-solid fa-bounce fa-comment")
              span='Create issue'
    .issues
      h2 Your last updated open issues (#{issues.length})
      ul
        each val in issues 
          li.issue
            span.identifier=val.identifier
            span.priority=val.priorityLabel
            a(href=val.url title=val.title target="_blank") #{val.title}
            p.issue-description=val.description
```

## Handle issue creation form
To handle the issue creation form, let’s define a new route that receives the POST request that comes with the following information:

Team
Title
Description

```javascript
app.post('/create-issue', handleSession, async (req, res) => {
  const userCredentials = await everyauth.getIdentity('linear', req.session.userId);

  // You don't need to worry about ensuring you have a valid access token, EveryAuth will handle
  // that for you by ensuring a fresh access token is always returned.
  const linearClient = new LinearClient({ accessToken: userCredentials?.accessToken });
  const { teamId, title, description } = req.body;
  const me = await linearClient.viewer;

  const { _issue } = await linearClient.issueCreate({ teamId, title, description, assigneeId: me.id });
  const linearIssue = await linearClient.issue(_issue.id);

  res.render('issue-created', {
    ...linearIssue,
  });
});

```

The `issue-created` view contains the following template:

```pug
html
  head
    title='Issue created'
    style
      include ./style.css
  body
    .success.centered
     p
        i.fa-solid.fa-check
        span='The issue has been created'
    .issue-created-container
        h1=title
        p=description
        p
            i.fa-solid.fa-code-fork
            span=branchName
        .footer
            a.button(href='/')
                i.fa-solid.fa-arrow-left-long.fa-bounce
                span='Go back'
            a.button(href=url target='_blank')
                i.fa-solid.fa-arrow-right-from-bracket.fa-bounce
                span='See created issue'
```

It will look similar to the following image:

![Using Linear API with EveryAuth with-shadow](blog-using-linear-with-everyauth-issue-created.png 'Linear example with EveryAuth')

Run your application (assuming your code is defined in index.js file)

```shell
node .
```

Navigate to `http://localhost:3000`

Check out the complete code in [GitHub](https://github.com/fusebit/everyauth-express/tree/main/examples/linear)

## To Wrap up
Congratulations! 🎊 You’ve learned that integrating your app  with the Linear API is easy with EveryAuth!
Learn more about [Linear API](https://developers.linear.app/docs/sdk/getting-started) and get some inspiring ideas to extend your application with this awesome API. 

Let us know what you think, don’t hesitate to reach out if you have any questions or comments. You can also reach out to me directly through our community [Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg) and on [Twitter](https://twitter.com/degrammer).

[Fusebit](https://fusebit.io) is a code-first integration platform that helps developers integrate their applications with external systems and APIs. To learn more, take [Fusebit for a spin](https://manage.fusebit.io/signup?utm_source=fusebit.io&utm_medium=referral&utm_campaign=blog&utm_content=using-linear-with-everyauth) or look at our [getting started guide](https://developer.fusebit.io/docs/getting-started)!
