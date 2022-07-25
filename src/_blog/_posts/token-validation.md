---
post_title: 'Token Validation: What It Is and How to Set It Up'
post_author: Juan Reyes
post_author_avatar: juan.png
date: '2022-07-12'
post_image: token-validation-main.png
post_excerpt: Access tokens & token validation are popular and tested mechanisms for securing communication between your user and your service. Learn more!
post_slug: token-validation
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'nodejs-websocket-client',
    'send-email-gmail-api',
    'oauth-refresh-token-best-practices',
  ]
---

In an increasingly dangerous world where hacks and breaches are becoming more and more common, developers must have a solid grasp of the security features available. For most application services that expose data to the web, it's common to have an authentication mechanism guarding the resources. However, despite the abundance of robust and sophisticated security mechanisms, many are misconfigured, incomplete, or sometimes even absent. 

In this article, we'll discuss one of the most popular and tested mechanisms for securing communication between your user and your service: access tokens and token validation. 

First, we'll explain what access tokens are and what token validation is. Then we'll explain when token validation is the best course of action and when it's not. Next, we'll walk you through the process of setting up a simple token validation mechanism on a NodeJS application. Finally, we'll explore the JSON Web Token (JWT) standard for a more secure authentication mechanism and teach you how to implement it. 

## What Are Access Tokens?

Access tokens are keys that serve as the basis for certifying the authenticity of a user or their privileges within an application. In simpler terms, an access token is a string of data, usually encrypted in some fashion, that contains information about the user's identity. This information, although encrypted, should not include sensitive credentials. 

> An access token is a **string of data**, usually encrypted in some fashion, that contains information about the **user’s identity**.

The purpose of an access token is not to authenticate the user on request necessarily but to serve as proof of a previous authentication. That's why access tokens have an expiration period attached to them and are required to be refreshed by reauthenticating the user or any other mechanism. Furthermore, access tokens are the preferred mechanism to secure the communication between a user and an API that provides data based on user roles or privileges. 

Since you can associate tokens with user data, it's convenient to use this mechanism to reduce the cost of database transactions that an API needs to handle a request. 

A straightforward example of an access token would be a single UUID, or universal unique identifier, that you can link to a user registry in the database and that has an expiration date associated with it. 

## What Is Token Validation?

Token validation is the mechanism by which an API validates the authenticity and longevity of access tokens. The mechanism to validate a token varies between applications, but for the most part, it comprises decoding the payload, parsing the properties, and performing further queries to validate credentials. This validation, in a standard API service, would occur before any request reaches an endpoint. Additionally, this request would incur some filtering mechanism to prevent access to sensitive resources and unnecessary overhead. 

Once the server receives a token and appropriately filters the request, the API can certify what kind of privileges the request has to the endpoint. To do this, some APIs use the scope information contained within the token. Furthermore, the server then returns the token to the user on each response to maintain access to the API. The server can change this token on each response, depending on the security needs of the service. 

## When Do You Need Token Validation?

You should implement token validation whenever you expose sensitive data to the user. Beyond just ensuring that the user is authenticated, implementing proper security mechanisms like JWT and token validation in general is mandatory to prevent bad actors from exploiting your users. Moreover, having a robust and reliable validation layer can prevent exploitations of your service's availability and stability. 

> You must carefully consider building a mechanism to ensure that only  **the right people** have access to it.

If you have an API that returns information to clients and that information has the potential to be sensitive, you must carefully consider building a mechanism to ensure that only the right people have access to it. Conversely, if your API or an endpoint in it only returns publicly available information and holds no potential value for exploitation, adding a token authentication mechanism is not recommended. This is because it would put more strain on your server for no real purpose. Additionally, adding extra steps for your users to access your services could harm your business. 

## What Is JWT?

According to the [JWT](https://jwt.io/introduction) website, "JSON Web Token (JWT) is an open standard ([RFC 7519](https://tools.ietf.org/html/rfc7519)) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because the server digitally signed it. JWTs can be signed using a secret (with the **HMAC** algorithm) or a public/private key pair using **RSA** or **ECDSA**." 

This means that a JWT is a secure token standard used to validate and enhance transactions between services and clients. This token contains JSON information that can be mapped into an object containing data to maintain authorization mechanisms between entities and reduce the need for expensive database transactions. 

Alright, now that we've explored the theory, it's time to get into coding a practical example of token validation. For this, we'll use Node.js, Express, and npm to build a barebones server that accepts login attempts, generates JWT tokens, and filters requests for authentication. Let's get to it. 

## Setting Up Token Validation

First, create a new JavaScript file and call it "index.js." You can put this file inside a folder called "JWTTokenTest" or anything you want. 

Now add the following code to this file: 

```js
const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

app.listen(8000)
```

This code is your barebones Node.js server. It contains all the code necessary to start a new server and receive requests. 

Before doing that, you need to create your "package.json" and install the node dependencies used in this code. To do that, all you have to do is go to the terminal, move to the folder where your "index.js" file is, and run the following command: 

```
$ npm init
```

This will trigger a short setup wizard that will take you through creating the "package.json" file, which contains the settings for your Node.js project. You can just press Enter on all the prompts if you don't know what they do. 

By the way, if you don't yet have npm or Node installed, you can find it [here](https://nodejs.org/en/). 

Once you complete this, you'll find the "package.json" file in the folder with all the necessary settings. Great. 

### Node Setup

Now go back to the terminal and input the following commands to install the dependencies specified in the code you added to the "index.js" file: 

```
$ npm install express

$ npm install body-parser

$ npm install cookie-parser
```

Then go ahead and run your code. In your browser, you can go to https://localhost:8000 and check your work. 

Except there's nothing to see. Your barebones server still needs a few more things. 

Now, create a second file —you can call it "handlers.js" if you want— and add the following code: 

```js
const jwt = require("jsonwebtoken")

const jwtKey = "SECRET"
const jwtExpirySeconds = 300

const users = {
  user1: "password1",
  user2: "password2",
}
```

Notice that there's a variable holding a key called "jwtKey." This secret key will be used to build and encrypt tokens and should be protected at all costs. For the purposes of this example, however, you can just keep it as is. 

Additionally, there's a variable indicating the expiration period of tokens in seconds. You can use this later for configuration purposes. You can set this to satisfy your needs. Also, there's a dictionary defining two basic user accounts. Again, we'll use this to test the access token later. 

Now you need to install the new dependency we added to the project. In this case, it's called "jsonwebtoken," and it's a simple but robust package library that manages JWT token authentication mechanisms with very few lines of code. 

To install the dependency, just run the following command in the terminal: 

```
$ npm install jsonwebtoken
```

Excellent. 

### Building Authentication

Next, you need to add the methods that will handle the different requests necessary for authentication and authorization. In this case, they will be "signIn," "welcome," and "refresh." 

Here's the code for the three methods. You can add them to the "handlers.js" file. 

```js
const signIn = (req, res) => {
  // Get credentials from JSON body
  const { username, password } = req.body
  
  if (!username || !password || users[username] !== password) {
    // return 401 error is username or password doesn't exist, or if password does
    // not match the password in our records
    return res.status(401).end()
  }

  // Create a new token with the username in the payload
  // and which expires 300 seconds after issue
  const token = jwt.sign({ username }, jwtKey, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds,
  })

  console.log("token:", token)

  // set the cookie as the token string, with a similar max age as the token
  // here, the max age is in milliseconds, so we multiply by 1000
  res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
  res.end()
}

const welcome = (req, res) => {
  // We can obtain the session token from the requests cookies, which come with every request
  const token = req.cookies.token

  // if the cookie is not set, return an unauthorized error
  if (!token) {
    return res.status(401).end()
  }

  var payload
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, jwtKey)
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return res.status(401).end()
    }
    // otherwise, return a bad request error
    return res.status(400).end()
  }

  // Finally, return the welcome message to the user, along with their
  // username given in the token
  res.send(`Welcome ${payload.username}!`)
}

const refresh = (req, res) => {
  // (BEGIN) The code uptil this point is the same as the first part of the `welcome` route
  const token = req.cookies.token

  if (!token) {
    return res.status(401).end()
  }

  var payload

  try {
    payload = jwt.verify(token, jwtKey)
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).end()
    }
    return res.status(400).end()
  }
  // (END) The code uptil this point is the same as the first part of the `welcome` route

  // We ensure that a new token is not issued until enough time has elapsed
  // In this case, a new token will only be issued if the old token is within
  // 30 seconds of expiry. Otherwise, return a bad request status
  const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
  
  if (payload.exp - nowUnixSeconds > 30) {
    return res.status(400).end()
  }

  // Now, create a new token for the current user, with a renewed expiration time
  const newToken = jwt.sign({ username: payload.username }, jwtKey, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds,
  })

  // Set the new token as the users `token` cookie
  res.cookie("token", newToken, { maxAge: jwtExpirySeconds * 1000 })
  res.end()
}

module.exports = {
  signIn,
  welcome,
  refresh,
}
```

The "signIn" method takes a basic login request and checks the credentials provided. If they match, it builds a new JWT token with the username and the secret key. This method also requires that you specify the signing algorithm and expiration time. Finally, the token is logged and saved in the cookies so the client can fetch it. 

The "welcome" method, when called, searches for this cookie and confirms that the token is valid by using the secret key to decode it. If this is the case, it returns a simple greeting message. 

Finally, the ["refresh" method](https://fusebit.io/blog/oauth-refresh-token-best-practices/) fetches the token from the cookies in a similar fashion. However, it does something different with the validated token. Once it confirms that enough time has passed with the current token where it's about to expire, it generates a new one and stores it in the cookies for the client to fetch. 

Simple enough, right? 

### Running the Code

Now you only need to add a few more lines of code to have your server up and running. 

Modify the "index.js" to the following: 

```js
const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

const { signIn, welcome, refresh } = require("./handlers")

app.post("/signin", signIn)
app.get("/welcome", welcome)
app.post("/refresh", refresh)

app.listen(8000)
```

Great. All the ingredients are in place. 

Here you're exposing three endpoints—"signIn," "welcome," and "refresh"—on the server so a client can reach them. 

Now simply go to the terminal and run your code with the following command: 

```
$ node ./index.js
```

Excellent. 

## Testing Token Validation

To test your work, you'll need a tool like [Postman](https://www.postman.com) to send requests on your behalf to the server. 

First, create a POST request to the following URL: 

```
http://localhost:8000/signin
```

Add the following payload to the body of your request: 

```js
{"username":"user1","password":"password1"}
```

These are the credentials to authenticate yourself to the server. 

Send the request and see how the server logs a new token generated. You can confirm that the request succeeded by seeing the "200" status code and the cookie saved with the token in the headers. 

To confirm that the token works, send a GET request to the URL below. Don't forget to use the same window and to clean the body. 

```
http://localhost:8000/welcome
```

You will see the welcome message. 

Excellent. 

Now, if you wait long enough, the token will eventually expire, and you will no longer have access to the welcome endpoint. To keep the token and your credentials valid, you must call the last endpoint with a POST to the following URL: 

```
http://localhost:8000/refresh
```

Great job. 

The example in this article was inspired by [this](https://www.sohamkamani.com/nodejs/jwt-authentication/) article on how to build a simple Node.js token authentication mechanism. 

## Moving Forward

If you're a developer, it's your responsibility to do your best to safeguard the data in your projects. After all, you have a duty to your users beyond your commitment to your employer or client, especially given the extensive amount of criminal activity happening on the web and the willingness of people to surrender their data for convenience. 

_This post was written by Juan Reyes. [Juan](https://www.ajourneyforwisdom.com/) is an engineer by profession and a dreamer by heart who crossed the seas to reach Japan following the promise of opportunity and challenge. While trying to find himself and build a meaningful life in the east, Juan borrows wisdom from his experiences as an entrepreneur, artist, hustler, father figure, husband, and friend to start writing about passion, meaning, self-development, leadership, relationships, and mental health. His many years of struggle and self-discovery have inspired him and drive to embark on a journey for wisdom._
