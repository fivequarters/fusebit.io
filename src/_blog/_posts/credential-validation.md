---
post_title: 'Credential Validation: What It Is and Why It Matters'
post_author: Juan Reyes
post_author_avatar: juan.png
date: '2022-07-18'
post_image: credential-validation.png
post_excerpt:  Learn the benefits of credential validation, where it is commonly used, and how to implement it with other authentication mechanisms.
post_slug: credential-validation
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'token-validation',
    'nodejs-websocket-client',
    'google-form-webhooks-nodejs',
  ]
---

In the security domain, credentials are an essential tool for user authentication. However, since they're inputs intentionally provided by the user, they're also the easiest to fabricate and exploit. 

As the web evolved and the need for more flexible and powerful tools and services grew, engineers were forced to continuously improve and strengthen the mechanisms that provide protection from bad actors. This impetus was the driving force behind many of the advances we benefit from today in the world of fintech, e-commerce, and even your favorite streaming service. 

Nevertheless, almost all security mechanisms in use today employ some form of user credential validation. And today, we'll explore what credential validation is and why it is so important. To do this, we'll guide you through the process of creating a simple [Node.js app](https://fusebit.io/blog/nodejs-oauth-libraries/) that provides an authentication mechanism that implements credential validation. Additionally, you'll learn the benefits of credential validation, where credential validation is commonly used, and how to implement credential validation with other authentication mechanisms. 

If you're not a Node.js developer, don't worry. The concepts are easy to grasp and can be applied to any technology stack and language. 

## What Is Credential Validation?

Credential validation is the act of validating the presence and authenticity of credentials provided by a requesting user. This validation typically occurs once per session and allows the application or service to protect its resources from bad actors. 

> Credential validation is the act of **validating** the presence and authenticity of credentials provided by a requesting user.

Typically, a credential validation mechanism on the web involves a check for credentials provided, either as parameters or as headers in a request. Once confirmed, the application can then query its database or any other storage mechanism where valid credentials are kept. This stage would involve either a direct comparison (user to user and password to password) or require an additional middle step where credentials are encrypted for an indirect comparison. 

Once you've finished this step, the application has all it needs to determine if the request is legitimate or not. 

## Benefits of Credential Validation

One of the most apparent benefits that robust credential validation mechanisms offer is the multiple layers of security and resilience. Credential validation not only serves as a user gateway, but it can also enhance the user management pipeline by providing a mechanism to handle user credentials securely. In addition, since the means to validate credentials are already part of the service, the application can leverage them to ensure that user profile updates are consistent and stored correctly. Finally, developers can use credential validation to enhance authorization mechanisms. 

For APIs and other stateless services that need to confirm a user's privileges regularly, this is particularly important. However, this is not always the case as many modern token-based authorization mechanisms have authorization scopes embedded in them, which is more efficient. 

## Where Is Credential Validation Used?

As mentioned previously, credential validation mechanisms are an integral part of pretty much all services living on the web. The same applies to local applications, embedded applications, and even operating systems. Every time you provide a form of credential (password, token, fingerprint), it's processed by credential validation. 

> Every time you provide a **form of credential** (password, token, fingerprint), it’s processed by credential validation.

However, that's not to say that all authentication is the same. Authentication mechanisms like [certificate-based authentication and token-based authentication](https://www.anujvarma.com/token-based-vs-certificates-based-authentication/) don't validate the user but a proxy on behalf of the user. This means that instead of validating the consumer of the service, they validate the avenue used to consume it. 

The certificate-based authentication mechanism, in particular, validates that the device itself is valid and authenticated. This is common for services people access at a particular location, like intranet servers and location-based applications. 

## Examples of Credential Validation

Let's create a basic credential validation mechanism in a simple Node.js API application. This application will implement basic authentication and token authorization. Once you log in, you can request a secret message. 

Start by creating a JavaScript file. Call it "index.js" and place it in a folder named "MySecretService" in your drive. 

Now initialize npm by running the following command: 

```
$ npm init
```

This command will trigger a short setup wizard that will take you through creating a "package.json" file containing the settings for your Node.js project. 

Next, add the following code to the "index.js" file: 

```js
const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

app.listen(8000)
```

This code is a simple Node.js server that accepts requests to port 8000. 

### Dependencies

Go back to the terminal and input the following commands to install the following dependencies: 

```
$ npm install express
$ npm install body-parser
$ npm install cookie-parser
$ npm install jsonwebtoken
```

These packages will help you handle the server and token validation. 

Now create a second JavaScript file and call it "handlers.js." 

Add the following code to this file: 

```js
const jwt = require("jsonwebtoken")

const jwtKey = "SECRET"
const jwtExpirySeconds = 600

const users = {
  user1: "iamsecret1",
  user2: "iamsecret2",
}
```

Notice that there's a variable holding a key called "jwtKey." The node server will use this secret key to build and encrypt tokens. That means that you should keep this key in a safe place. For this example, however, that's not necessary. Additionally, since this example will contain no data storage, the account credentials are on a static variable. 

### Authentication Mechanism

To handle token-based authentication, you need to add three endpoints: "login," "secret," and "refresh." 

Add the following code to the "handlers.js" file: 

```js
const login = (req, res) => {
  const { username, password } = req.body
  
  if (!username || !password || users[username] !== password) {
    return res.status(401).end()
  }

  const token = jwt.sign({ username }, jwtKey, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds,
  })

  console.log("token:", token)

  res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })

  res.end()
}

const secret = (req, res) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).end()
  }

  var payload = null;

  try {
    payload = jwt.verify(token, jwtKey)
  } catch (e) {

    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).end()
    }

    return res.status(400).end()
  }

  res.send(`Welcome ${payload.username}!`)
}

const refresh = (req, res) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).end()
  }

  var payload = null;

  try {
    payload = jwt.verify(token, jwtKey)
  } catch (e) {

    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).end()
    }

    return res.status(400).end()
  }

  const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
  
  if (payload.exp - nowUnixSeconds > 30) {
    return res.status(400).end()
  }

  const newToken = jwt.sign({ username: payload.username }, jwtKey, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds,
  })

  res.cookie("token", newToken, { maxAge: jwtExpirySeconds * 1000 })

  res.end()
}

module.exports = {
  login,
  secret,
  refresh,
}
```

The "login" endpoint is where the initial stage of the credential validation will take place. 

It takes a basic login request and checks that the credentials provided are valid. Then it builds a new JWT token with the username and the secret key. Finally, the application saves the token on the cookies, so it stays on the session. 

The "secret" endpoint will contain the secret message and will check for the token on the session cookies. This is the second stage of the credential validation mechanism and serves as both an authentication and authorization control for the API. 

Finally, the "refresh" endpoint will provide a mechanism to keep the session active by refreshing the session token. 

### Finalizing and Testing the Server

The last thing you need to do before the server is ready for requests is expose the endpoints within the "index.js" file. 

```js
const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

const { login, secret, refresh } = require("./handlers")

app.post("/login", login)
app.get("/secret", secret)
app.post("/refresh", refresh)

app.listen(8000)
```

Run the code with the following command: 

```
$ node ./index.js
```

Great work! 

To test the API, you'll need a tool like [Postman](https://www.postman.com/) to send requests on your behalf to the server. 

First, create a POST request to the URL (http://localhost:8000/login) and add the following payload: 

```
{"username":"user1","password":"password1"}
```

These are the credentials that the API will validate. 

Now send the request and see on the terminal that the application generates a new token. To see the secret message, send a GET request to the URL ([http://localhost:8000/secret](http://localhost:8000/secret)). 

Finally, to keep the token and credentials valid within the session, you can call the refresh endpoint with a POST to the URL ([http://localhost:8000/refresh](http://localhost:8000/refresh)). 

That's it. 

## Conclusion

Making validations on services with high demand can be costly and demanding on limited resources. Additionally, given the widespread and pervasive threat of exploitation by attackers, having the perfect balance of security and flexibility can be complex. 

That's why having a solid authentication and authorization mechanism with a robust credential validation component can be the difference between reliable security and regret. 

_This post was written by Juan Reyes. [Juan](https://www.ajourneyforwisdom.com/) is an engineer by profession and a dreamer by heart who crossed the seas to reach Japan following the promise of opportunity and challenge. While trying to find himself and build a meaningful life in the east, Juan borrows wisdom from his experiences as an entrepreneur, artist, hustler, father figure, husband, and friend to start writing about passion, meaning, self-development, leadership, relationships, and mental health. His many years of struggle and self-discovery have inspired him and drive to embark on a journey for wisdom._
