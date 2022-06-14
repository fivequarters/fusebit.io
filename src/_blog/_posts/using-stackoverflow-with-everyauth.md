---
post_title: Easily Authorize The Stack Overflow API with EveryAuth
post_author: Rubén Restrepo
post_author_avatar: bencho.png
date: '2022-05-06'
post_image: stackoverflow-everyauth-example.png
post_excerpt: Learn how to interact with Stack Overflow API from an Express application to display user and global top 10 questions and answers using EveryAuth.
post_slug: using-stackoverflow-with-everyauth
tags: ['post', 'authentication', 'google:hidden']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/stackoverflow-everyauth-example.png
posts_related: ['everyauth','integrate-github-api-everyauth', 'integrate-linear-api-everyauth']
---

Recently Fusebit announced [EveryAuth](https://fusebit.io/blog/everyauth/?utm_source=fusebit.io&utm_medium=referral&utm_campaign=none) project that allows you to integrate with multiple services via OAuth easily. 

This article shows an example of EveryAuth using an Express.js application that integrates with the Stack Overflow API using the [superagent](https://www.npmjs.com/package/superagent) package to display the following information:

- Stack Overflow's authorized user profile information: picture, name, location, reputation, and badge counts.
- Stack Overflow's authorizing user top 10 questions and answers.
- Stack Overflow's top 10 questions and answers.

Once you run and authorize the application, you should be able to see something like the following image:

**Authorizing user top 10 Questions and Answers:**

![Using Stack Overflow API with EveryAuth with-shadow](blog-everyauth-so-1.png 'StackOverflow example with EveryAuth')

**Top 10 StackOverflow Questions and Answers:**

![Using Stack Overflow API with EveryAuth with-shadow](blog-everyauth-so-2.png 'StackOverflow example with EveryAuth')

Both views will include the user profile information at the top of the page. If you noticed, we even have badges and reputation data!

## Configuring EveryAuth

This blog post assumes you already have EveryAuth configured in your development environment. In case you don’t, follow the [configuration steps](https://github.com/fusebit/everyauth-express#getting-started) from the EveryAuth GitHub Repository.

A basic Express application will look like the following:

```javascript
const express = require('express');

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
```

Let’s add support to EveryAuth and configure the Stack Overflow service so we can interact with their API.

Install the following dependencies:

```shell
npm i @fusebit/everyauth-express uuid cookie-session
```

Let’s review the why we need them:

- [@fusebit/everyauth-express](https://www.npmjs.com/package/@fusebit/everyauth-express) package for enabling EveryAuth within our Express application.
- [uuid](https://www.npmjs.com/package/uuid) package. Used to generate a unique identifier for the userId.
- [cookie-session](https://www.npmjs.com/package/cookie-session) package to allow your application to establish a session (an HTTP-Only cookie) to store the authorizing user id.

Stack Overflow does not provide an official Node.js SDK. In this example, we will build our wrapper using the [superagent](https://www.npmjs.com/package/superagent) library.

## Add Routes

There are two critical routes we need to add to our application:

- Authorize route
- Finished route

Let’s understand the role of each route:

### Authorize Route

EveryAuth middleware enables your application to perform an authorization flow for a particular service.
EveryAuth provides an out-of-the-box shared Stack Overflow OAuth Client so that you can get up and running quickly.

EveryAuth simplifies a lot the authorization flow:

```javascript
app.use(
  '/authorize/:userId',
  everyauth.authorize('stackoverflow', {
    // The endpoint of your app where control will be returned afterwards
    finishedUrl: '/finished',
    // The user ID of the authenticated user the credentials will be associated with
    mapToUserId: (req) => req.params.userId,
  })
);
```

You can define any name you want for the authorization route. In our previous example, it’s called `authorize`, but it’s up to you, and your application needs to use a different name/path. 

### Finished Route

After the authorization flow finishes, control is returned to your application by redirecting the user to the configured `finishedUrl` in the `authorize` route.
The redirection includes query parameters that your application can use to know the [operation status](https://github.com/fusebit/everyauth-express#parameters---2).
You can use any path for the route. Just ensure it matches what you have configured in the `finishedUrl` property.
In this route, you can now interact with the Stack Overflow API by leveraging the EveryAuth service to get a fresh access token. We will use it to display the authorizing Stack Overflow user top 10 questions and answers using the REST API.

### Get user top 10 StackOverflow Questions and Answers

```javascript
/**
 * Display Top 10 Stack Overflow Questions and Answers of all time for the authorizing user
 */
app.get('/finished', validateSession, async (req, res) => {
  // Get Stack Overflow service credentials.
  const userCredentials = await everyauth.getIdentity('stackoverflow', req.session.userId);
  const { client_key, access_token } = userCredentials.native;

  // Configure a Stack Overflow API request with the authorizing access token and client key.
  // These values are provided in the token response from the Stack Overflow API.
  const stackOverflowRequest = stackOverflowApi({ access_token, client_key });

  // Get the current authorizing user profile information
  const userInfo = await stackOverflowRequest('me');
  const user = userInfo.items[0];

  // Get top 10 user answers, it uses a custom filter to get the answer body.
  // This custom filter was created at https://api.stackexchange.com/docs/answers
  const answers = await stackOverflowRequest(`users/${user.user_id}/answers`, {
    pagesize: 10,
    order: 'desc',
    sort: 'votes',
    filter: '!*MZqiH2sG_JWt3xD',
  });

  // Get top 10 user questions, it uses a custom filter to get the question body.
  // Read more about this API at https://api.stackexchange.com/docs/questions
  const questions = await stackOverflowRequest(`users/${user.user_id}/questions`, {
    pagesize: 10,
    order: 'desc',
    sort: 'votes',
  });

  res.render('index', {
    user,
    questions: questions.items,
    answers: answers.items,
    page: '/stack-overflow-top',
    pageTitle: 'View Top Global data',
  });
});
```

The user profile returns some interesting data, for our example we'll be using:
- profile_image
- display_name
- reputation
- badge_counts[bronze, silver, gold]
- location

For the questions endpoint we use the following data:
- title
- view_count
- score
- link
- owner.profile_image
- owner.display_name
- tags
- body

For the answers endpoint we use the following data:
- title
- score
- link
- owner.profile_image
- owner.display_name
- body

You may wonder what’s going on with those weird values for the filter property 🤪, no worries, they mean something, it represents filter values that we are requesting to the API that are not part of the default response (like the body property), they’re configured in the `try it` section of each documented endpoint in Stack Overflow, it will look like this:

![Using Stack Overflow API with EveryAuth with-shadow](blog-everyauth-so-3.png 'Stack Overflow example with EveryAuth')

Then, you select the fields you want to return from the specific request generating a filter you already saw in our previous example.

![Using Stack Overflow API with EveryAuth with-shadow](blog-everyauth-so-4.png 'Stack Overflow example with EveryAuth')

### Get the Top 10 Questions and Answers from Stack Overflow.

Let’s define another route, called `stack-overflow-top`,  in our express application that will show the top 10 questions and answers from Stack Overflow

```javascript
/**
 * Display Top 10 Stack Overflow Questions and Answers
 */
app.get('/stack-overflow-top', validateSession, async (req, res) => {
  // Get StackOverflow service credentials.
  const userCredentials = await everyauth.getIdentity('stackoverflow', req.session.userId);
  const { client_key, access_token } = userCredentials.native;

  // Configure a StackOverflow API request with the authorizing access token and client key.
  // These values are provided in the token response from the StackOverflow API.
  const stackOverflowRequest = stackOverflowApi({ access_token, client_key });

  // Get the current authorizing user profile information
  const userInfo = await stackOverflowRequest('me');
  const user = userInfo.items[0];

  // Get global top 10 questions from StackOverflow. It uses a custom filter to get the question body.
  // This custom filter was created at https://api.stackexchange.com/docs/questions
  const questions = await stackOverflowRequest('questions', {
    pagesize: 10,
    order: 'desc',
    sort: 'votes',
    filter: '!nKzQUR3Ecy',
  });

  // Get top 10 user answers, it uses a custom filter to get the answer body.
  // This custom filter was created at https://api.stackexchange.com/docs/answers
  const answers = await stackOverflowRequest('answers', {
    pagesize: 10,
    order: 'desc',
    sort: 'votes',
    filter: '!*MZqiH2sG_JWt3xD',
  });

  res.render('index', {
    user,
    questions: questions.items,
    answers: answers.items,
    page: '/',
    pageTitle: 'View your data',
  });
});
```
As you may notice, the endpoints are similar to user-specific endpoints. This API is public, meaning it accepts unauthenticated requests to get the data. We think it was nice to include it in our demo application 😎.

Both previous examples, are using a function called `stackOverflowRequest`, there is no official Node.js SDK for Stack Overflow, but we can define a function that does the job for us, let’s see it:

```javascript
/**
 * Stack Overflow REST API wrapper used to perform authorized GET requests.
 */
const stackOverflowApi = ({ access_token, client_key }) => {
  return async (path, extraParams = {}) => {
    const url = new URL(`https://api.stackexchange.com/2.3/${path}`);
    url.searchParams.append('key', client_key);
    url.searchParams.append('access_token', access_token);
    url.searchParams.append('site', 'stackoverflow');
    Object.keys(extraParams).forEach((key) => url.searchParams.append(key, extraParams[key]));
    const response = await superagent.get(url.toString());
    return JSON.parse(response.text);
  };
};
```

**Note:** This wrapper only supports GET requests to Stack Overflow API, but it can be easily modified to support other methods.

Now, let’s see the magic that happens behind the `send.render` function!
We need to display the data. We will use a simple template engine called [pug](https://www.npmjs.com/package/pug), which allows us to quickly render an HTML page with the data returned from Stack Overflow.

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
  title='Stack Overflow Top Questions and Answers'
  style
    include ./style.css
body
  .header
    .logo
      img.logo(src='https://stackoverflow.design/assets/img/logos/so/logo-stackoverflow.svg')
    .profile
      img.pic(src=user.profile_image alt='Stack Overflow profile image')
      section
        a(href=user.link)=user.display_name
      section
        span #{user.reputation}
        unless !user.badge_counts.bronze
          span.shield.bronze
              i(class='fa-solid fa-shield')
          span #{user.badge_counts.bronze}
        unless !user.badge_counts.silver
          span.shield.silver
              i(class='fa-solid fa-shield')
          span #{user.badge_counts.silver}
        unless !user.badge_counts.gold
          span.shield.gold
              i(class='fa-solid fa-shield')
          span #{user.badge_counts.gold}
        span
            i(class='fa fa-location-dot fa-bounce')
        span #{user.location}
      .action 
        a(href=page)=pageTitle
  .container
    .top-questions
      h1=`Top 10 Questions`
      unless questions.length
        .empty 
          i(class='fa-solid fa-face-frown fa-bounce')
          span='No questions found'
      each question in questions
          .question-item 
            h2!=question.title
            .stats 
              section
                span
                    i(class='fa-solid fa-eye')
                span=question.view_count
              section
                span
                    i(class='fa-solid fa-star')
                span=question.score
              section
                span
                    i(class='fa-solid fa-link')
                a(href=question.link target='_blank')='View question'
            .author
              img(src=question.owner.profile_image)
              span=`Question by ${question.owner.display_name}`
            .tags
              each tag in question.tags 
                div.tag=tag
            .answer-body!=question.body
    .top-answers
      h1=`Top 10 Answers`
      each answer in answers
          .question-item 
            h2!=answer.title
            .stats 
              section
                span
                    i(class='fa-solid fa-star')
                span=answer.score
              section
                span
                    i(class='fa-solid fa-link')
                a(href=answer.link target='_blank')='View Question'
            .author
              img(src=answer.owner.profile_image)
              span=`Answer by ${answer.owner.display_name}`
            .answer-body!=answer.body
```

Run your application (assuming your code is defined in index.js file)

```shell
node .
```

Navigate to `http://localhost:3000`

Check out the complete code in [GitHub](https://github.com/fusebit/everyauth-express/tree/main/examples/stackoverflow)

## To Wrap up
Congratulations! You’ve learned that interacting with Stack Overflow API is easy with EveryAuth!

Let us know what you think, don’t hesitate to reach out if you have any questions or comments. You can also reach out to me directly through our community [Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg) and on [Twitter](https://twitter.com/degrammer).

[Fusebit](https://fusebit.io) is a low-code integration platform that helps developers integrate their applications with external systems and APIs. We used monkey patching ourselves to make our integrations better! To learn more, take [Fusebit for a spin](https://manage.fusebit.io/signup?utm_source=fusebit.io&utm_medium=referral&utm_campaign=blog&utm_content=using-stackoverflow-with-everyauth) or look at our [getting started guide](https://developer.fusebit.io/docs/getting-started)!
