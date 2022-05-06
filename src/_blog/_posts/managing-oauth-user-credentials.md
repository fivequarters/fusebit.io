---
post_title: Managing OAuth User Credentials in Your Node.js App
post_author: Shehzad Akbar
post_author_avatar: shehzad.png
date: '2022-05-06'
post_image: 
post_excerpt: (max 180 characteres)
post_slug: 
tags: ['post']
post_date_in_url: false
post_og_image: 
posts_related: ['slug-1','slug-2','slug-3']
---
Before OAuth existed, if you wanted to authorize an app to access resources in other services, users would have to share their username and password with your app directly, you would then access these third-party applications by impersonating the user's identity with their credentials. However, this fast became a security issue and we needed a way to facilitate API Access delegation without sharing user passwords. 

To solve this, software engineers from Twitter, Google and others collaborated on a standard protocol known as “Open Authorization”, or OAuth.

Since then, OAuth 2.0 has become the de-facto standard for authentication and authorization in web apps. The OAuth 2.0 **[Authorization Code Flow](https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.1)** allows a user to authorize a web app to gain access using a secure code and access token, instead of impersonating a user, to authenticate itself when calling another web service. 

In this post, I'll dive into how you can specifically manage this flow in your Node.js / Express app. You can follow along below and implement the full DIY approach, or - you can save all your time and use [EveryAuth](https://github.com/fusebit/everyauth-express), for free, and get your integration up and running in less than 100 lines of code.

## How the Flow Works

For the purposes of this example, let’s assume your accounting app - _Budgetly_, needs to provide an integration with Salesforce so users can automatically have their invoices imported into Budgetly. These are the steps, which i’ll go through in detail in the following sections, you will need to follow and implement in your app to have this working:

* **Register a Verified App:** First, you will need to register as a ‘[verified app](https://help.salesforce.com/s/articleView?id=sf.connected_app_create.htm&type=5)’ with Salesforce, you will receive a Client ID & Client Secret that is unique to this app.
* **Retrieve an Authorization Code:** Next, you will add this ‘verified app’ to Budgetly so users have a way to authorize Budgetly with their credentials. Once authenticated successfully, you will receive an authorization code.
* **Retrieve Access Token:** Then, you will use this authorization code to retrieve an ‘access token’ and a `refresh token`. The former will be used by Budgetly to access the Salesforce APIs to retrieve those invoices on their behalf while the other token will be used to get more tokens (see next point). \
* **Retrieve Fresh Access Token:** For security reasons, `access tokens` are short-lived and expire very quickly (15 minutes for Salesforce). To make sure that this token is always fresh - Budgetly will have to go back to Salesforce and ask for an updated `access token` before it expires by using the longer-lasting `refresh token` as part of its request.

## Retrieve an Authorization Code

Let’s assume that you were able to successfully register an app with Salesforce, and you now want to allow users to authorize Budgetly. Let’s see what you need to do in order to get an Authorization code.

First, you will need to set up the Authentication URL which consists of three things:

* Authorization Endpoint URL (from Salesforce)
* Client ID & Redirect URI (Configured with your ‘Verified App’)
* Requested OAuth Scopes 

```javascript
// Salesforce Authorization Endpoint
const salesforce_auth_token_endpoint = '[https://login.salesforce.com/services/oauth2/authorize](https://login.salesforce.com/services/oauth2/authorize)';

// Retrieve securely stored Client ID & Redirect URI
const query_params = {
    client_id: process.env.CLIENT_APP_ID,
    redirect_uri: process.env.REDIRECT_URI,
};

// Define OAuth Scopes you want
const scopes = ['api','refresh_token','offline_access'];

// Start URL Construction
const url = new URL(salesforce_auth_token_endpoint)
url.searchParams.append('client_id', query_params.client_id)
url.searchParams.append('redirect_uri', query_params.redirect_uri)

// Define Response Type as Code
url.searchParams.append('response_type', 'code')

// Add Scopes, space separated
url.searchParams.append(‘scope’,scopes.join(‘ ‘))

// Final Auth URL with ID, Redirect URI, Scopes
const final_auth_url = url.toString()
```

Your final redirect URL will look something like this: 

`https://login.salesforce.com/services/oauth2/authorize?client_id=3MVG9IHf89I1t8hrvswazsWedXWY0i1qK20PSFaInvUgLFB6vrcb9bbWFTSIHpO8G2jxBLJA6uZGyPFC5Aejq&redirect_uri=https://app.budgetly.io/dashboard&response_type=code&scope=api%20refresh_token%20offline_access`

Users will be taken to an OAuth Consent Screen, and once they have successfully authenticated, you will receive an authorization code in the callback from Salesforce.

## Retrieve an Access Token

Now that you have the authorization code - it expires in 15 minutes. Within this time, you will retrieve an `access token`, and a `refresh token`, which will be used by Budgetly to access the Salesforce APIs.

For this, you will make a request to the `token` endpoint, you will need:

* Salesforce Token Endpoint (from Salesforce)
* OAuth Client ID, Client Secret & Redirect URI (Configured with your ‘Verified App’)
* Authorization Code (Retrieved from Auth Callback)

```javascript

// Salesforce Token Endpoint
const salesforce_access_token_endpoint = '[https://login.salesforce.com/services/oauth2/token](https://login.salesforce.com/services/oauth2/token)'

// Retrieve Authorization Code from previous URL
const code = authorization_code

// Retrieve securely stored Client ID, Secret & Redirect URI

const query_params = {
    client_id: process.env.CLIENT_APP_ID,
    client_secret: process.env.CLIENT_APP_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
};

// Start URL Construction
const url = new URL(salesforce_access_token_endpoint)
url.searchParams.append('client_id', query_params.client_id)
url.searchParams.append('client_secret', query_params.client_secret)
url.searchParams.append('redirect_uri', query_params.redirect_uri)

// Add the Authorization Code
url.searchParams.append('code', authorization_code)

// Specify Grant Type to be authorization code
url.searchParams.append('grant_type', ‘authorization_code’)

// Final Token URL with ID, Secret and Code
const final_token_url = url.toString()
```

Once you POST to the final_token_url, you can expect to get back something like this:

```javascript
{
"access_token": "00DB0000000TfcR!AQQAQFhoK8vTMg_rKA.esrJ2bCs.OOIjJgl.9Cx6O7KqjZmHMLOyVb.U61BU9tm4xRusf7d3fD1P9oefzqS6i9sJMPWj48IK",
"signature": "d/SxeYBxH0GSVko0HMgcUxuZy0PA2cDDz1u7g7JtDHw=",
"refresh_token": "abnDDt5xcv6&4ffASafawfa4G/grshfsd67FJgndft4w5q",
"scope": "api refresh_token offline_access",
"id_token": "eyJraWQiOiIyMjAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiSVBRNkJOTjlvUnUyazdaYnYwbkZrUSIsInN1YiI6Imh0dHBzOi8vbG9...",
"instance_url": "https://mycompany.my.salesforce.com",
"id": "https://login.salesforce.com/id/00DB0000000TfcRMAS/005B0000005Bk90IAC",
"token_type": "Bearer",
"issued_at": "1558553873237"
}
```

## Retrieve an Invoice

Now that you have the `access token`, you must include it in every authenticated request Budgetly makes to the API. 

The actual act of retrieving an invoice from Salesforce is straightforward, in this example below, I'm using a well-known JavaScript SDK called [jsforce](https://jsforce.github.io/) to call a fictional Salesforce table called ‘Invoices’.

```javascript
// Instantiate a new client with the tokens
const conn = new jsforce.Connection({ 
	instanceUrl: users_sf_instance_url
    accessToken : salesforce_access_token
});

// Use SOQL to retrieve Salesforce Invoices
conn.query("SELECT Id, Name, Amount, FROM Invoices", function(err, result) {
  console.log("total : " + result.totalSize);
});
```

## Retrieve a Fresh Access Token 

Finally, if the access token expires, you will need to retrieve a new one. To do this, you will have to check, on every request, if the token is valid. If it has expired, then you will need to refresh the token, and update the access token with the new value.

The process to do this, however, is exactly the same as getting a brand new token, except your `grant_type` is set to `refresh_token` and you will include the refresh token as part of the request.

```javascript
// Salesforce Token Endpoint
const salesforce_access_token_endpoint = '[https://login.salesforce.com/services/oauth2/token](https://login.salesforce.com/services/oauth2/token)'

// Retrieve Refresh Token
const salesforce_refresh_token = refresh_token

// Retrieve securely stored Client ID, Secret & Redirect URI
const query_params = {
    client_id: process.env.CLIENT_APP_ID,
    client_secret: process.env.CLIENT_APP_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
};

// Start URL Construction
const url = new URL(salesforce_access_token_endpoint)
url.searchParams.append('client_id', query_params.client_id)
url.searchParams.append('client_secret', query_params.client_secret)
url.searchParams.append('redirect_uri', query_params.redirect_uri)

// Add Refresh Token
url.searchParams.append(‘refresh_token’, salesforce_refresh_token)

// Specify Grant Type to be refresh token
url.searchParams.append('grant_type', ‘refresh_token’)

// Final Token URL with ID, Secret and Code
const final_token_url = url.toString()
```

You will receive an updated access token which you can then use to make authenticated calls to the Salesforce API. If you’re worried about the storage and security of your access/refresh tokens, here’s a good article on [best practices](https://fusebit.io/blog/oauth-refresh-token-best-practices/). Read through it to get a sense of the essential things to consider and how to implement them.

## Next Steps

Congratulations! You should now have a good understanding of the big pieces required to implement and manage the OAuth 2.0 Authorization Code Flow in your Node.js Express app. In this example we used Salesforce but the principles apply the same for any service that implements the OAuth 2.0 Client Credentials Grant Flow. 

If you’ve gotten this far, then you may also want to consider looking at the [EveryAuth Example App for Salesforce](https://fusebit.io/blog/everyauth-salesforce/) - we have created a 100-line Express app that: 

* Authorizes your app users to Salesforce and manages the lifecycle of the connection afterward.  
* Stores their credentials and refreshes when necessary.  
* Allows you to call Salesforce APIs on their behalf.   

All that without you having to learn about OAuth, touch your application’s database, or register an application in Salesforce. If you have any questions, you can reach out to me directly through our [community Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg), on [Twitter](https://twitter.com/shehzadakbar) and at shehzad@fusebit.io.