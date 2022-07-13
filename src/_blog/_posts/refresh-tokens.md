---
post_title: What Are Refresh Tokens and How Can They Boost Your Security?
post_author: Deborah Ruck
post_author_avatar: deborah.png
date: '2022-07-12'
post_image: refresh-tokens-security.png 
post_excerpt: In this guide, you will give a more in-depth explanation of what refresh tokens are, how they can improve software security, and the best practices for creating and handling them.
post_slug: refresh-tokens-security
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'oauth-refresh-token-best-practices',
    'unified-apis',
    'promise-performance-node',
  ]
---

# A Guide to Refresh Token Best Practices

Refresh tokens provide a way to bypass the temporary nature of access tokens. Normally, a user with an access token can only access protected resources or perform specific actions for a set period of time, which reduces the risk of the token being compromised. A refresh token allows the user to get a new access token without needing to log in again.

Though these tokens can be extremely helpful, they should be used properly. This guide will give an in-depth explanation of refresh tokens and discuss some best practices for creating and handling them.

## Why Use Refresh Tokens?

Access tokens carry information that allows APIs to verify a user’s identity. They are commonly used by identity frameworks and protocols, such as [OAuth 2.0](https://oauth.net/2/), an industry-standard protocol for authorization, to enable secure access to resources and applications.

These tokens have deliberately short life spans (usually minutes) because anyone with a token can access the resources that the token allows. The longer an access token is valid, the more likely it is to become compromised. A short life span helps protect your organization’s resources. However, each time an access token expires, you need to collect user credentials again. Refresh tokens have longer expiration times than access tokens and allow you to use shorter lifetimes for access tokens without having to request user credentials multiple times.

When an authentication server issues an access token to a user, it also issues a valid refresh token. The refresh token is used to authenticate the user after the initial access token has expired. This happens behind the scenes without user interaction, facilitating an improved user experience without compromising security. Refresh tokens do not give the user any additional access beyond what was originally allowed.

![How refresh tokens work](https://i.imgur.com/tGLL4R9.png)

## When to Use Refresh Tokens

There are several benefits to using refresh tokens. The following are some common use cases.

### Obtaining Access Tokens

Many applications use token-based authentication to give users access to information and resources once their credentials are validated. Since such tokens are typically valid for only a short period, malicious actors have less time to gain access to confidential resources.

A refresh token simplifies the process of getting a new access token. The authentication server issues an access token when a user attempts to access a resource for the first time or after a previous access token has expired. When a current access token expires, a valid refresh token is used to automatically request a new access token from the authorization server.

### Avoiding Constant Reauthentication

Refresh tokens help improve the user experience (UX) around authentication. Since access tokens are typically only valid for a few minutes, an expired token can cause a user session to terminate without warning. Once that token expires, the user needs to reauthenticate to receive a new token and a new session. Both abrupt termination and constant reauthentication can lead to poor UX.

Refresh tokens allow you to increase session duration while avoiding unnecessary reauthentication. You can provide an uninterrupted UX by issuing an additional access token as soon as the previous one expires.

### Allowing Users to Stay Authenticated

Refresh tokens allow you to control the length of user sessions within native, web-based, or single-page applications. Users can stay logged in for longer periods of time without repeating the authentication process. This creates a better UX while allowing you to maintain an extra security layer using short-lived access tokens.

Reauthentication can occur seamlessly behind the scenes using API calls and without user participation.

### Balancing Usability with Security

Refresh tokens allow you to balance your users’ access needs with your organization’s security practices. Access tokens help users get the resources they need to complete their tasks, but such tokens can also expose your organization to data compromise or other malicious actions if a hacker is able to steal them.

Pairing a short-lived access token with a long-lived refresh token allows you to expire the access token before a malicious user can access and use it, but still have a way to reauthenticate the user without asking for credentials. This ensures that the window of vulnerability to malicious users is as short as possible, while allowing users to navigate your website or application without being constantly interrupted by reauthorization requests.

## Refresh Token Best Practices

Refresh tokens enable you to balance application security, usability, and privacy. To optimize their usage, though, you need to know how best to use them. The following are some best practices for working with refresh tokens.

### Rotate Refresh Tokens

Refresh token rotation (RTR) enables greater security by reducing the lifetime of refresh tokens, making it less likely that a hacker will gain access to a valid token. This technique is especially useful for browser-based applications and single-page applications (SPAs). Using persistent refresh tokens with browser-based applications increases the risk that the refresh token will be compromised, and long-lived refresh tokens aren’t recommended for SPAs since it’s difficult to ensure that they are only accessed by the desired application.

RTR allows these types of applications to rotate refresh tokens securely after each use. Every time the application uses a new refresh token to receive an additional access token, the authentication server invalidates the old refresh token and returns a new refresh token. This essentially makes each refresh token a one-time use token. Instead of repeatedly using the same long-lived refresh token to issue access tokens, refresh tokens are exchanged and invalidated with each request. If the refresh token becomes compromised, it is less likely to be valid, preventing an unauthorized user from gaining access to secure resources.

### Detect Refresh Token Reuse

Because refresh tokens are [bearer tokens](https://oauth.net/2/bearer-tokens/), meaning they give unlimited access to whoever holds the token, it’s impossible for the authorization server to distinguish legitimate users from malicious users when receiving a new access token request. That’s why you should use refresh token reuse detection alongside a refresh token rotation strategy to revoke access when the current valid refresh token may have become compromised.

When an application renews an access token, the authentication server validates the incoming refresh token, issues a new set of access and refresh tokens, and invalidates the previous refresh token. With refresh token reuse detection, if a user requests an access token using a previously used and invalidated refresh token, the authentication server is alerted. The server immediately invalidates the entire token family, including all access tokens issued to the authenticated user and the most recently issued refresh token, preventing unauthorized user access.

### Store Refresh Tokens Securely

Refresh tokens are powerful, as anyone with a valid refresh token can access protected resources. You need to have a strategic plan for storing them securely for future use until they expire.

Refresh tokens can be stored differently depending on the type of application you are developing. For native applications or applications that need to perform API calls, you can store your refresh tokens in durable long-term storage, such as a relational or non-relational database. For browser-based or single-page apps where users are limited to an interactive session, tokens can be stored in local storage or browser memory.

However, there are some security concerns with using local storage, such as the potential for [cross-site scripting](https://www.techtarget.com/searchsecurity/definition/cross-site-scripting) (XSS) attacks. You can use refresh token rotation to shorten token expiration time in order to reduce the impact of XSS and other attacks on tokens in local storage.

Storing tokens in persistent server-side storage provides a higher level of security and allows you to [encrypt data at rest](https://www.kaspersky.com/resource-center/definitions/encryption) to ensure that refresh tokens remain safe even if the storage mechanism is compromised.

### Set Reasonable Expiration Times

Depending on your security requirements, refresh token expiration can range from hours to years. In most cases, when deciding on token life span, you’ll need to balance security with UX. When a token’s life span is too short, it can frequently interrupt the user’s experience. A token life span that runs too long can increase the opportunity for malicious actors to acquire the token.

Once a refresh token is issued, it can remain valid indefinitely, unless you set it to expire. Expiration conditions can be determined by the last time the token was used to retrieve an additional access token or by when it was issued.

## Conclusion

Refresh tokens can help you simplify your authentication process for users while keeping your valued resources safe from attackers. As long as you follow best practices for using refresh tokens, they can be vastly helpful to your organization.

To further improve your workflow, you can use an integration platform with OAuth2 support. 
[Fusebit](https://fusebit.io/) allows developers and engineering teams to add third-party integrations to their projects for increased productivity and an optimized developer experience. Fusebit offers prebuilt connectors for most popular software-as-a-service (SaaS) tools, such as Google, Discord, GitHub, and Salesforce. Fusebit’s [EveryAuth tool](https://fusebit.io/blog/everyauth/) handles API authorization and credentialing for you so that you can focus on app development.

Follow [@fusebitio](https://twitter.com/fusebitio) on Twitter for more developer content.
