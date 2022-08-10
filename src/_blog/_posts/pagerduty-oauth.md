---
post_title: How to Connect to PagerDuty OAuth in Your Node.js Web App
post_author: Ukpai Ugochi
post_author_avatar: ukpai.png
date: '2022-08-10'
post_image: pagerduty-oauth-main.png
post_excerpt: In this post, we'll connect PagerDuty to a Node.js application. In order to implement this without exposing user data, we'll use OAuth.
post_slug: pagerduty-oauth-nodejs-app
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'everyauth-pagerduty',
    'pagerduty-discord-integration',
    'blue-green-deployments-AWS',
  ]
---

People handling users' personal data need to be careful so that attackers don't get a hold of it. 

In the software industry, we're constantly dealing with users' data. For instance, for every solution you provide, you'll need users' data for configuration to suit their needs.

However, protecting this data is critical. For this reason, firms must be mindful of who gets access to [personal health information (PHI)](https://www.hhs.gov/answers/hipaa/what-is-phi/index.html) and [personally identifiable information (PII)](https://www.techtarget.com/searchsecurity/definition/personally-identifiable-information-PII). 

In this post, we'll connect PagerDuty to a Node.js application. In order to implement this successfully without exposing user data, we'll use OAuth. Connecting PagerDuty will enable users to share their resources without exposing their original credentials. 

> For every **solution** you provide, you’ll need users’ data for configuration to **suit their needs**.

## Data Protection and Privacy—Why It's Important

Sometimes people use the terms data protection and data privacy interchangeably. However, they're different. For instance, data privacy focuses on who should get access to information. On the other hand, data protection involves the provision of tools and procedures to restrict people from accessing data. 

To understand this better, think of [role-based access control (RBAC)](https://en.wikipedia.org/wiki/Role-based_access_control) as a means of data privacy. This means that not everyone in the firm can get access to information in the firm's system. For instance, although janitors or software engineers are part of a medical firm, they shouldn't get access to patients' records. 

Although medical personnel has access to medical records, data protection enables safeguarding this data from attacks, computer malfunctions, etc. 

Data protection and privacy are important, as they stop criminals or the general public from exploiting users' data. Whether it's financial, medical, or other personal data your firm is handling, they need to protect user data. Regulation agencies like [GDPR](https://gdpr.eu/what-is-gdpr/) and [HIPAA](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html) will fine firms if they don't protect users' data. 

## PagerDuty—What Is It?

Automation in the software industry is important. This is because it'll enable faster production and release circle. [PagerDuty](https://www.pagerduty.com) is a cloud computing company that provides incident response for software companies. It does this by enabling automation so that the necessary organizations receive critical security updates immediately. 

Some of the solutions PagerDuty provides are integration with health care, with financial services, and so on. It also allows integration with other infrastructures so that developers can share resources across different platforms. 

However, these solutions constantly deal with users' personal data. Therefore, when implementing these integrations, we need to be careful. 

## PagerDuty API

Computer programs can't communicate directly with each other. 

In order to communicate, they need a third-party interface. This is exactly what an application programming interface (API) provides. An API is a software interface that allows computer programs to communicate with each other. Think about visiting a restaurant for a meal. You can't waltz into the kitchen to order a meal. However, you can drop your order with the waiter. Next, the waiter sends your request to the kitchen and returns with your meal. This is how an API works. It's the middleman between your application and the application you're trying to communicate with. 

With PagerDuty's [REST API](https://simple.wikipedia.org/wiki/Representational_state_transfer), developers connect their applications and communicate with PagerDuty. Also, we can go the extra step to ensure this resource sharing is secure. To do this, we'd implement OAuth. 

## Node.js and PagerDuty Integration

In this section, we'll be exploring Node.js and PagerDuty integration. First, you can either generate access tokens manually (PagerDuty UI) or automate the process by implementing an OAuth flow in your application. While the manual process is tasking, it's not as secure as OAuth implementation. 

For instance, with OAuth, you'll have to give access to the user who wants to view your resources. However, with manual access tokens, the user can get access to the resources once they provide access tokens. For this tutorial, we'll be implementing the Node.js and PagerDuty integration using OAuth automation. 

### Prerequisites and Application Setup

To follow through with this integration, you need the following prerequisites: 

* [a PagerDuty account](https://developer.pagerduty.com/sign-up/)
* Node.js in your working environment (Download and install it here if you don't have it.)
* knowledge of [authentication](https://fusebit.io/blog/linkedin-oauth/) and authorization

### Register Your Application on PagerDuty

After the creation of your PagerDuty developer account, you can create an application on PagerDuty. 

This application will enable you to send and receive information from PagerDuty. If you're logged into your PagerDuty customer account, navigate to developer mode. 

Click on the **Integrations** tab of the navigation tab and scroll down to **Developer Mode**. 

![PagerDuty OAuth Node.js with-shadow](pagerduty-oauth-1.png "PagerDuty OAuth Node.js")

Next, navigate to the **My Apps** page in **Developer Mode** and select **Create New App**. 

On this new page, you'll need to enter the application name, a brief description, and a category. You can change all of this information later. Now, select whether or not you intend to publish your app for all PagerDuty users. 

You also can change this information later. Click **Save** to finish creating your application. 

![PagerDuty OAuth Node.js with-shadow](pagerduty-oauth-2.png "PagerDuty OAuth Node.js")

Creating App[/caption]   After you create the application, it'll appear on your **My Apps **page. You can select the application to edit any of the details. 

### OAuth Flow

The OAuth workflow for this application involves the resource owner, client, and authorization server. 

* Resource owner—the person who owns and grants access to the protected resource
* Client—the application that needs access to the protected resources
* Authorization server—is responsible for [validating access tokens](https://fusebit.io/blog/token-validation/) before letting clients communicate with the resource owner

The client requests resource access through an authorization server. The resource owner must give access via the authorization server before the client can get access to the resources. 

### Writing Codes

We'll be using the example on the official [PagerDuty GitHub page](https://github.com/PagerDuty-Samples/pagerduty-oauth-sample-node). First, we'll create a folder for your application by running the command below in your computer terminal: 

```
mkdir PagerDuty
```

Next, we'll initialize our project by running **npm init**. This will ask a bunch of questions concerning your application, so fill it in accordingly. 

After that, a **package.json** file will be created at the root of your application. In your **PagerDuty** folder, create a **config.json** file. This file will hold the configurations for our application. 

In the application you just created on PagerDuty, navigate to the **App Functionality** section. Here, you'll get the **Client ID** and **Client Secret** of your application. Now, add that information to your **config.json** file like this: 

```js
{
"PD_CLIENT_ID": "<YOUR_CLIENT_ID_HERE>",
"PD_CLIENT_SECRET": "<YOUR_CLIENT_SECRET_HERE>",
"REDIRECT_URI": "http://localhost:5000/callback"
}
```

Next, create an **index.js** file and add the code below to it. This file will be the base of your application, as it contains the logic for requesting resources from the resource owner. Notice how we're utilizing **node-pagerduty**, a JavaScript wrapper for the PagerDuty APIs. 

We're also reading data from the config file we created earlier. Now, we'll use the **base0AuthUrl** for authorization and request the access token. 

When we get this token, we'll make a call to the PagerDuty API. Now, run **npm install** to install all dependencies. Then, run **node index.js** in your terminal to start your application. 

Finally, navigate to **http://localhost:500** in your web browser, where you'll see a link to Connect to PagerDuty. 

Click that to initiate the OAuth flow. If authorization is successful, you'll be greeted with a welcome message. 

```js
const express = require('express');
const qs = require('qs');
const request = require('request');
const pdClient = require('node-pagerduty');

const config = require('./config.json');
const app = express();
const port = process.env.PORT || 5000;
const stateParm = "yourState";

// baseOAuthUrl -- endpoint for initiating an OAuth flow
const baseOAuthUrl = "https://app.pagerduty.com/oauth";

// parameters to send to the `oauth/authorize` endpoint to initiate flow
const authParams = {
    response_type: 'code',
    client_id: config.PD_CLIENT_ID,
    redirect_uri: config.REDIRECT_URI,
    state: stateParm // optional
};
const authUrl = `${baseOAuthUrl}/authorize?${qs.stringify(authParams)}`;

app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
});

app.get('/',  (req, res) => {
    res.send(`<h1>PagerDuty OAuth2 Sample</h1><a href="/auth">Connect to PagerDuty</a>`);
});

app.get('/auth', (req, res) => {
    res.redirect(authUrl);
});

app.get('/callback', (req, res) => {
    // first check if the request contains any errors and display them to the browser
    if (req.query.error) {
        res.send(`<h1>PagerDuty OAuth2 Sample</h1><div style="color:red;">Error: ${req.query.error}</div><div style="color:red;">${req.query.error_description}</div>`);
        return;
    }
    // printing state that was passed in during the initial auth request
    console.log(`state: ${req.query.state}`);

    const tokenParams = {
        grant_type: `authorization_code`,
        client_id: config.PD_CLIENT_ID,
        client_secret: config.PD_CLIENT_SECRET,
        code: req.query.code,
        redirect_uri: config.REDIRECT_URI
    };
    
    // retrieve code and request access token
    request.post(`${baseOAuthUrl}/token`, {
        json: tokenParams     
    }, (error, tres, body) => {
        if (error) {
            console.error(error);
            return;
        }

        // Use the access token to make a call to the PagerDuty API
        const pd = new pdClient(body.access_token, body.token_type);
        pd.users.getCurrentUser({})
            .then(uRes => {
                res.send(`<h1>PagerDuty OAuth2 Sample</h1><div><img src='${JSON.parse(uRes.body).user.avatar_url}' /> <h2>Hello, ${JSON.parse(uRes.body).user.name}!</h2></div>`);
            })
            .catch(err => {
                console.log(err);
            });
    });
});
```

## Conclusion

The need to tread carefully when dealing with users' personal data can't be overemphasized. 

This can be difficult, especially if your firm is a resource provider that needs to provide resources to a vast number of people. 

While this involves a lot of integrations and code writing, tools like [FuseBit](https://fusebit.io) can make integrations like this easier. For instance, with FuseBit, developers can easily and securely implement integrations without writing zillions of codes. 

Try it today. 

_This post was written by Ukpai Ugochi. [Ukpai](https://twitter.com/hannydevelop) is a full stack JavaScript developer (MEVN), and she contributes to FOSS in her free time. She loves to share knowledge about her transition from marine engineering to software development to encourage people who love software development and don't know where to begin._
