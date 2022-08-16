---
post_title: 'Reddit OAuth: Let Users Sign into Your App With Reddit Login'
post_author: Pius Aboyi
post_author_avatar: pius.png
date: '2022-08-16'
post_image: reddit-oauth.png
post_excerpt:  Reddit OAuth makes it possible for your application to make HTTP requests to Reddit's API endpoint. Read on to teach users how to sign in with OAuth.
post_slug: reddit-oauth
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'using-reddit-with-everyauth',
    'oauth-state-parameters-nodejs',
    'google-oauth',
  ]
---

Reddit OAuth (Open Authorization) allows users to authenticate your application using their Reddit account. Your application can do this by requesting access to Reddit on behalf of a user without actually revealing their login credentials. 

In addition, Reddit OAuth makes it possible for your application to make HTTP requests to Reddit's API endpoint to get information regarding a particular user. Your application may also perform several tasks such as creating a post on Reddit, getting a user’s notification, and more.  

In this post, you’ll learn how to let users sign in using OAuth and their Reddit profile. 

## Implementing Sign-In with Reddit OAuth

Let's walk through an example of adding sign-in with Reddit to an application. For this example, we'll build a simple sign-in page using React and Next.js. 

### Goals

* Registering your application.
* Authorization
* Retrieving a token
* Refreshing a token
* Getting data from the Reddit API

### Step 1: Create a Reddit Application

In order to use the Reddit API, you’ll need to create an application from the developer portal. You can create one by going to [https://www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps), then clicking the "Are you a developer? Create an app ..." button. 

![Reddit OAuth with-shadow](reddit-oauth-1.png "Reddit OAuth")

> In order to use the **Reddit API**, you’ll need to create an application from the developer portal.

You will be asked to provide the following information about your new app: 

* Name
* Application type
* Description
* About URL
* Redirect URL

![Reddit OAuth](reddit-oauth-2.png "Reddit OAuth")

The most important fields include the following: 

* **Name:** This identifies your application. It should not include the word “Reddit.”
* **Application type:** This is the type of application (web app, installable app, or scripts).
* **Redirect Uri:** This is the URL that Reddit will point a user to after successful authorization.

Once you're done filling out the form, click the “Create app” button to complete the process. 

![Reddit OAuth](reddit-oauth-3.png "Reddit OAuth")

Next, the Reddit developer page will provide a secret key and client ID. You'll need these along with some other details to authorize your application later. So, write these values down, and preferably store them as environmental variables in your application.

### Step 2: Create Next.js Project

As mentioned earlier, we'll use the [Next.js](https://nextjs.org/) JavaScript framework to build an example app. So, let's set up a new Next.js project. 

First, open the terminal or command prompt and change your working directory to where you want to save the project. Then run the following command to create a new project: 

```
npx create-next-app@latest
```

After running the above command, you'll see a prompt to specify a project name. Enter "reddit-oauth" and hit Enter to finish creating the project. 

You'll have to wait for your project dependencies to install. This may take some time, depending on your internet speed. Once everything is set up, open the new project directory in your preferred code editor. 

### Step 3: Create Pages for Example Application

Now let's create the pages for the example application. It will only have two pages, the main page and a profile page. 

For the main page, from the project folder, navigate to  **pages/index.js**, then open **index.js** in your code editor and update the content to the following: 

```js
  const DURATION = "permanent";
  const SCOPE = "identity edit flair history read vote wikiread wikiedit";
  const REDIRECT_URI = "http://127.0.0.1:3000/profile";
  const RANDOM_STRING = "randomestringhere";
  const RESPONSE_TYPE = "code";
  const CLIENT_ID = "";
  const CLIENT_SECRET = "";

  const URL = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&state=${RANDOM_STRING}&redirect_uri=${REDIRECT_URI}&duration=${DURATION}&scope=${SCOPE}`;
  return (
    <div className="sign-in">
      <div>
        <h1>Welcome to Reddit OAuth demo</h1>
        <p>Sign in to continue!</p>
      </div>
      <a
        style={{
          margin: "20px",
          background: "red",
          color: "#FFFFFF",
          borderRadius: "3px",
          padding: "8px",
        }}
        href={URL}
      >
        Sign in with Reddit
      </a>
    </div>
  );
```

In the above code, replace the value for **CLIENT_ID** and **CLIENT_SECRET** with the client ID and secret from your Reddit app. 

Now, for the profile page, create a new file inside the** pages** sub-directory and save it as **profile.js**. Add the following code to the new file: 

```js
export default function Profile({ user }) {
  return (
    <div className="profile">
      <h3>Welcome user!</h3>
    </div>
  );
}
```

To test your work so far, run the following command in terminal: 

```
npm run dev
```

Once your project builds successfully, visit **127.0.0.1:3000** in a web browser to see the output. You should see the following page: 

![Reddit OAuth](reddit-oauth-4.png "Reddit OAuth")

### Step 4: Authorization

In order to authorize a user, you need to send them to the Reddit Authorization URL, which looks like this: 

**[https://www.reddit.com/api/v1/authorize?client_id=CLIENT_ID&response_type=TYPE&state=RANDOM_STRING&redirect_uri=URI&duration=DURATION&scope=SCOPE_STRING](https://www.reddit.com/api/v1/authorize?client_id=CLIENT_ID&response_type=TYPE&state=RANDOM_STRING&redirect_uri=URI&duration=DURATION&scope=SCOPE_STRING)** 

Let me explain the functions of each query parameter in the URL: 

* **client_id** is the string that was generated when you created the Reddit application.
* **response_type** has to be a value of “code”.
* **state **is any random string you provide that will be returned to you after a successful authorization. 
* **redirect_url **has to be the same as the redirect URL you provided when registering the application.
* **duration **is how long you want to have access to a user’s account, either ‘temporary’ or ‘permanent’.
* **scope **this is a space-separated list of scopes string that represents areas of the API you would like to have access to.

The code from **index.js** file from the last step already includes Reddit's authorization URL. Also, in index.js, at the top, you'll find constants that define the values for the URL query parameters. Modify the constants with the correct values for your Reddit application. 

The authorization URL basically links to a page from which a user can grant your application access to their Reddit profile. The following screenshot show this page after the user clicks on the "Sign in with Reddit" button: 

![Reddit OAuth with-shadow](reddit-oauth-5.png "Reddit OAuth")

### Step 5: How to Get a Reddit OAuth Token

From the last step, if a user clicks on Allow, Reddit will redirect them to your redirect_url. In addition, a code parameter is appended to the redirect_url. You'll use this value later in your code to retrieve an OAuth token. 

You can use the code query to make an HTTP POST request to the endpoint below in order to get an access token. 

```
https://www.reddit.com/api/v1/access_token
```

The following are parameters that you need to provide in the body of the request: 

* **grant_type**: indicates if you're retrieving an access token or refreshing one
* **code: **the **code **query you received when being redirected
* **redirect_url: **the redirect URL you used when creating the application

> You can use the **code query** to make an **HTTP POST request** to the endpoint below in order to get an **access token**.

Now, let's write some code to get the OAuth token. 

In **pages/profile.js**, add the following methods: 

* **getToken: **a function that gets an access token
* **getServerSideProps: **a function peculiar to Next.js that executes code on the server

To do that, open profile.js in your code editor and add the following code at the end of the file: 

#### 1. getToken() Function

```js
const REDIRECT_URI = "http://localhost:3000/profile";
const RANDOM_STRING = "randomestringhere";
const CLIENT_ID = "";
const CLIENT_SECRET = "";

const getToken = async (body) => {
  const data = await axios.post(
    "https://www.reddit.com/api/v1/access_token",
    querystring.stringify(body),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
        "content-type": "application/x-www-form-urlencoded",
      },
    }
  );
  return data.data;
};
```

In the code above, we've included the constants (CLIENT_ID, CLIENT_SECRET, REDIRECT_URI) with Reddit application credentials. Make sure to set their values to the correct values from your Reddit application. 

The getToken function does the following: 

1. Accepts a (body) parameter that will include the code parameter from the redirect URL
2. Makes an HTTP POST request with the code parameter in the body to get an access token
3. Has a request body of an **x-www-form-urlencoded** form data
4. Has a header content-type of **x-www-form-urlencoded**
5. Has authorization in the headers as a type of Basic Auth
6. Converts the client ID and the client secret into a **base64** string before usage
7. Returns a token from Reddit after the request

Before we continue, you might have noticed that the above code uses the [Axio](https://www.npmjs.com/package/axios) library for HTTP requests. You must install the library by running the following command: 

```
npm i axios
```

#### 2. getServerSideProps Function

Next, lets implement the getServerSideProps function. To do that, simply add the following code to the bottom of the profile.js file: 

```js
export const getServerSideProps = async ({ query, req, res }) => {
  const refresh_token = getCookie('refresh_token', { req, res });
  const access_token = getCookie('access_token', { req, res });


  if (refresh_token) {
    if (access_token) {
      return { props: { authenticated: true } }
    } else {
      // refresh token code here
    }
  } else if (query.code && query.state === RANDOM_STRING) {
    try {
      const token = await getToken(query.code)
      setCookie('refresh_token', token.refresh_token, { req, res, maxAge: 60 * 60 });
      setCookie('access_token', token.access_token, { req, res, maxAge: 60 * 60 * 24 });
      return { props: { authenticated: true } }
    } catch (e) {
      console.log(e)
      return { props: { authenticated: false } }
    }
  }
}
```

And here is how the **getServerSideProps **function works: 

* First, the function tries to get the refresh token and the access token from the client making the request (browser).
* It has a conditional statement that checks if there is a refresh token, then proceeds to check if there is also an access token.
* When there is no refresh token, the "else if" block is called, which checks for the queries in the URL.
* It then executes the **getToken **function, which returns the token from Reddit.
* Finally, it stores the refresh token and access token in the browser cookies.

The **getServerSideProps** function depends on the cookies-next library, so run the following command to install it: 

```
npm i cookies-next
```

The **getToken** response can contain the following data: 

* An access token
* A refresh token
* A token type (**Bearer)**
* Token expiry time
* A scope string

![Reddit OAuth](reddit-oauth-6.png "Reddit OAuth")

#### Refreshing a token

To refresh a token, you need to make an HTTP request to the same endpoint that returns the access token, but the body of the request will differ. 

The body of the request will contain the following: 

* **grant_type : **a string of ‘**refresh_token’ **
* **refresh_token : **the actual refresh token stored in the cookies

We've implemented the getToken function such that it can also refresh a token. You can do this by setting the above fields in the **body** parameter of the getToken function. To do that, search for the following line within getServerSideProps function: 

```
// refresh token code here
```

Then add the following code just below that line: 

```js
const token = await getToken({
        refresh_token: refresh_token,
        grant_type: "refresh_token",
      });
```

### Step 6: Getting Data from Reddit API

All authenticated request to Reddit API makes use of the following URL: [https://oauth.reddit.com](https://www.reddit.com/r/oauth/). 

To get the current authenticated user profile data, make a GET request to the following endpoint: 

```
https://oauth.reddit.com/api/v1/me
```

Let's create a function that makes a request to the above endpoint. Add the following code to the bottom of profile.js: 

```js
const getUser = async (access_token) => {
  const data = await axios.get("https://oauth.reddit.com//api/v1/me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      content_type: "application/json",
    },
  });

  return data.data;
};
```

Now you need to call this function in three places in profile.js. 

* First, where there is a refresh token and an access token
* Second, where there is no access token but there is a refresh token
* Last, when there is no access token or a refresh token but there is a code value in the URL queries

In addition to the above changes, you also need to modify the UI (HTML) component of the profile page to display the username and profile photo. 

The following code shows the complete version of profile.js with the above changes. Also, all the necessary imports for the code have been added to the top of the file. 

```js
import React from "react";
import axios, { Axios } from "axios";
import querystring from "querystring";

import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";

export default function Profile({ user }) {
  return user ? (
    <>
      <div className="profile">
        <h3>Welcome {user.name}</h3>
        <img src={user.snoovatar_img} />
      </div>
    </>
  ) : (
    <p>Please login</p>
  );
}

const REDIRECT_URI = "http://localhost:3000/profile";
const RANDOM_STRING = "randomestringhere";
const CLIENT_ID = "";
const CLIENT_SECRET = "";

const getToken = async (body) => {
  const data = await axios.post(
    "https://www.reddit.com/api/v1/access_token",
    querystring.stringify(body),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
        "content-type": "application/x-www-form-urlencoded",
      },
    }
  );
  return data.data;
};

export const getServerSideProps = async ({ query, req, res }) => {
  const refresh_token = getCookie("refresh_token", { req, res });
  const access_token = getCookie("access_token", { req, res });

  if (refresh_token) {
    if (access_token) {
      const user = await getUser(access_token);
      return { props: { user } };
    } else {
      const token = await getToken({
        refresh_token: refresh_token,
        grant_type: "refresh_token",
      });
      setCookie("refresh_token", token.refresh_token, {
        req,
        res,
        maxAge: 60 * 60,
      });
      setCookie("access_token", token.access_token, {
        req,
        res,
        maxAge: 60 * 60 * 24,
      });
      const user = await getUser(token.access_token);
      return { props: { user } };
    }
  } else if (query.code && query.state === RANDOM_STRING) {
    try {
      const token = await getToken({
        code: query.code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      });
      setCookie("refresh_token", token.refresh_token, {
        req,
        res,
        maxAge: 60 * 60,
      });
      setCookie("access_token", token.access_token, {
        req,
        res,
        maxAge: 60 * 60 * 24,
      });
      const user = await getUser(token.access_token);
      return { props: { user } };
    } catch (e) {
      console.log(e);
      return { props: { user: null } };
    }
  } else {
    return { props: { user: null } };
  }
};

const getUser = async (access_token) => {
  const data = await axios.get("https://oauth.reddit.com/api/v1/me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      content_type: "application/json",
    },
  });

  return data.data;
};
```

If you open the browser, you should see your username and other Reddit info up on the profile page. 

![Reddit OAuth](reddit-oauth-7.jpg "Reddit OAuth")

Also, you can find the complete code for the example on [this Github repo](https://github.com/buildbro/reddit-oauth-example/). 

## Summing Up

In this post, you learned how to add a sign-in with [Reddit](https://fusebit.io/integrations/reddit/) to a Next.Js application. The general process is similar to implementing your code based on your preferred programming language and framework. 

OAuth sign in makes it easier for users to authenticate without having to create new passwords. Using Reddit OAuth also gives developers access to data from a user's profile on Reddit. 

_This post was written by Pius Aboyi. [Pius](https://www.linkedin.com/in/aboyipius/?originalSubdomain=ng) is a mobile and web developer with over 4 years of experience building for the Android platform. He writes code in Java, Kotlin, and PHP. He loves writing about tech and creating how-to tutorials for developers._
