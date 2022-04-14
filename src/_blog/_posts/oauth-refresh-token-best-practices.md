---
post_title: OAuth 2.0 Refresh Token Best Practices
post_author: Rubén Restrepo
post_author_avatar: bencho.png
date: '2022-04-13'
post_image: oauth-refresh-token-best-practices.jpeg
post_excerpt: Learn the best practices you should consider for managing OAuth 2.0 refresh tokens and access to your app.
post_slug: oauth-refresh-token-best-practices
tags: ['post', 'authentication']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/oauth-refresh-token-best-practices.jpeg
posts_related: ['everyauth','api-metering-analytics-express', 'api-metering-and-analytics-for-early-stage-startups']
---

In OAuth 2.0, you control access to your application's protected resources by using access tokens. Access tokens are the credentials representing the authorization given to an application. They contain the granted permissions in the form of scopes with a specific duration.

In most cases, an access token should be short-lived, so your application reduces the time window risk of providing access to restricted resources when an access token is compromised.

In the scenario of an expiring access token, your application has two alternatives:

1. Ask the users of your application to re-authenticate each time an access token expires.
2. The authorization server automatically issues a new access token once it expires.

Depending on your application’s needs - both options are valid. For example, you may ask your application users to re-authenticate each time a token expires for sensitive applications when the risk of damage is high if an access token is compromised. Using such an approach comes with a significant downside as this means you can't use it for applications that need offline access to protected resources; the end-user needs to be involved each time.

In this blog post, we will focus on alternative number two: **The authorization server automatically issues a new access token once it expires**.

This approach guarantees a seamless user experience. You're not asking the user to re-authenticate each time the access token expires, but how do you provide authorization without doing so? As you may already guess from this blog post title, using a **refresh token**. 

A refresh token is used in the following scenarios:

- **Traditional Web Application** executed in the server, where you can safely retrieve and use a client secret to request and store a refresh token. The OAuth flow for this kind of application is named the **Authorization code flow**.
- **Native Applications** like mobile and desktop apps using the Authorization code flow.
- **Single Page Applications** can also use refresh tokens under specific scenarios. (See Single Page Application section).

If you would like to make your developer life easier and skip learning OAuth token management, check out [EveryAuth](https://github.com/fusebit/everyauth-express), which is the easiest way for your app to access APIs like Slack, Salesforce, or Github.

## How To Refresh Tokens Entering Into Action

Access tokens with a limited lifespan will eventually expire, removing access to the protected resources needed by your application users.
If your application's users need access beyond the lifespan of an access token, they can retrieve a new one using a refresh token. That's their single purpose; you can't use a refresh token to access protected resources. That's the access token's responsibility.
Unlike access tokens, refresh tokens have a longer lifespan.

Certain services that support the [OAuth 2.0 protocol](https://datatracker.ietf.org/doc/html/rfc6749), like Google, restrict the number of refresh tokens issued per application user and per user across all clients. Refresh tokens expire after six months of not being used.
Another example is LinkedIn API, where by default, access tokens are valid for 60 days, and programmatic refresh tokens are valid for a year.

Support of OAuth refresh tokens is available in the following authorization grant types:

- [Client credentials](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4). The client specifies a Client ID and Client Secret to authenticate themselves (the client is also the resource owner) and requests an access token.
- [Authorization code](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1). The authorization server issues an access token in exchange for an authorization code. This flow is optimized for confidential clients since it requires a Client Secret.
- [Resource Owner Password Credentials Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.3). Use this flow with caution. This flow should only be used when other authorization grant types are unsuitable for your use case.

As a good security practice, [Implicit grant type](https://datatracker.ietf.org/doc/html/rfc6749#section-4.2) is not longer recommended, see our Single Page Application section for more details.

Let’s review how refresh token works in the context of your application by following this diagram:

![OAuth 2.0 Refresh Token Best Practices with-shadow](blog-oauth-refresh-token-best-practices-1.png 'Refresh token flow')

1. The client requests an access token by authenticating with the authorization server and presenting an [authorization grant](https://datatracker.ietf.org/doc/html/rfc6749#section-1.3) (a credential representing the resource owner's authorization).
2. The authorization server validates the authorization grant and authenticates the authorized client. If valid, it issues an access token and a refresh token. The client needs to store this refresh token safely.
3. The client can now request protected data to the resource server using the issued access token.
4. The resource server validates the access token. Once valid, it returns the requested data.
5. In this scenario, the application requests data from a protected resource, but this time, the access token has now expired.
6. After validating the access token, the resource server found that the token has expired, doesn’t serve the request, and returns an error with an invalid token response message.
7. After getting the invalid token response, the application issues a new access token request using the stored refresh token.
8. The authorization server uses the refresh token and issues a new access token with the stored refresh token.

There is a repetition of steps from 5 to 8 each time an access token is invalid.

Sample of an OAuth response that includes a refresh token:

```json
{
  "access_token": "HEuoFdfRhOwGA0QNn",
  "refresh_token": "hgTam-tuT8CvFej9-XxGyqeER_7j",
  "token_type": "bearer",
  "expires_in": 86400
}
```

The `"expires_in"` value is the number of seconds the access token will be valid.

Some services that supports refresh token expiration will return the expiration for the access token and the refresh token.

```json
{
  "access_token": "HEuoFdfRhOwGA0QNn",
  "refresh_token": "hgTam-tuT8CvFej9-XxGyqeER_7j",
  "token_type": "bearer",
  "expires_in": 86400,
  "refresh_token_expires_in": 525600
}
```

Now that we understand the primary role of a refresh token, let's review some recommended best practices.

## Refresh Token Best Practices

### Storage

Storing of Refresh Tokens should be in long-term safe storage:

- **Long-term** Use durable storage like a database. It could be a relational or non-relational database. Just keep in consideration that your refresh token storage should survive server restarts. Considering in-memory storage doesn't work due to its volatile nature.
 
- **Safe** Use encryption-at-rest all the time. It guarantees that your refresh tokens are still safe if your storage is compromised since they're encrypted. Using encryption-at-rest can impact the performance of your application since the process of encryption and decryption requires processing.

### Consistency

A refresh token is used to get a new non-expired access token with the same credentials. Your application shouldn’t request additional scopes not issued in the original expired access token. The Authorization Server already knows the original scopes granted to the access token.

If the Authorization Server returns a new refresh token as part of the new token request, store the new refresh token; otherwise, assume the current refresh token used remains valid.

### Security

Refresh tokens must be kept confidential in transit using [TLS](https://datatracker.ietf.org/doc/html/rfc6749#section-1.6) and shared only among the Authorization Server and the Client to whom the refresh tokens were issued.

### Refresh Token Rotation

Refresh token rotation is a security measure offered to mitigate risks associated with leaked refresh tokens, single page applications (SPA) are especially vulnerable to this (Read more about it in our Single Page Application section).
An attacker can access a refresh token by using a [replay attack](https://auth0.com/docs/secure/security-guidance/prevent-threats#replay-attacks).
The rotation mechanism implies that a refresh token can be used only once, giving the authorization server the ability to detect refresh tokens reuse.

The authorization server can detect a breach from a compromised refresh token by identifying an invalid refresh token usage, either by the legitimate client or the attacker.
When a new refresh token is issued, the authorization server retains the previous one. With this technique, the authorization server can detect a breach from a compromised refresh token by identifying an invalidated refresh token usage, either by the legitimate client or the attacker. (Reuse detection).

When the authorization server detects a refresh token reuse, it immediately revokes the refresh token and denies access to subsequent requests to the attacker and the legitimate user. There is no way to detect if the refresh token is coming from a trusted source, so the legitimate user must authenticate again.
Take into consideration this is not a bulletproof mechanism but increases the security of your application significantly.

Let’s understand how refresh token rotation works in the context of an OAuth flow:

![OAuth 2.0 Refresh Token Best Practices with-shadow](blog-oauth-refresh-token-best-practices-2.png 'Refresh token flow')

1. The client requests an access token by authenticating with the authorization server and presenting an [authorization grant](https://datatracker.ietf.org/doc/html/rfc6749#section-1.3) (a credential representing the resource owner's authorization).
2. The authorization server validates the authorization grant and authenticates the authorized client. If valid, it issues an access token and refresh token. The client needs to store the refresh token safely.
3. A malicious attacker gets access to the refresh and access token and uses it to request protected data to the resource server.
4. The malicious attacker can get protected data from the resource server.
5. A legitimate request from the OAuth client to the resource server sends an expired access token.  
6. The resource server validates the access token and denies the request by sending an invalid token response.
7. The legitimate OAuth client issues a new access token request with the stored refresh token in step 2.
8. The malicious attacker issues a new access token request with the leaked refresh token in step 2.
9. The authorization server detects that the previously leaked refresh token is being used, triggering an alert of refresh token reuse.
10. The authorization server denies the request to the attacker.
11. The authorization server denies the request to the legitimate user.

### Single Page Application

Single Page Applications, or SPA for short, are popular. They're mostly the defacto standard for building modern web applications today. They're inherently insecure due to the underlying nature of being public clients (as opposite of confidential clients) running on the client-side.
Today, the recommended approach is to use the [authorization code](https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.1) flow alongside [PKCE](https://oauth.net/2/pkce/). This flow now enables a SPA to obtain refresh tokens.

A malicious attacker can use a compromised refresh token to issue a new access token to request protected data to the resource server.
The authorization server can contain this risk by detecting refresh token reuse using refresh token rotation.
If your application uses refresh token rotation, it can now store it in local storage or browser memory. [You can use a service like Auth0 that supports token rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation).

### Refresh Token Revocation

There are several reasons a user needs to remove authorization access to their account from your application:

- A user log-outs from your application.
- A user wants to stop using your application.
- Due to security risks, the application will no longer be supported or disabled temporarily 😵.

Popular authorization and authentication service providers like [Auth0](https://auth0.com/docs/secure/tokens/refresh-tokens/revoke-refresh-tokens) support refresh token removal via `token/revoke` endpoint.

## To Wrap up

You’ve learned the best practices of refresh token management. It’s possible to offer your application users a seamless and secure experience. By following these basic principles, you will sleep better 😴, confident you’re handling your refresh tokens properly.

If OAuth is still a lot to wrap your head around, check our our project called [EveryAuth](https://github.com/fusebit/everyauth-express). EveryAuth is the easiest way for your app to access APIs like Slack, Salesforce, or Github. Check out [EveryAuth on GitHub](https://github.com/fusebit/everyauth-express) and use for free to quickly add API authentication to your apps.

Let us know what you think, don’t hesitate to reach out if you have any questions or comments. You can also reach out to me directly through our community [Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg) and on Twitter [@degrammer](https://twitter.com/degrammer).

[Fusebit](https://fusebit.io) is a code-first integration platform that helps developers integrate their applications with external systems and APIs. We used monkey patching ourselves to make our integrations better! To learn more, take [Fusebit for a spin](https://manage.fusebit.io/signuputm_source=fusebit.io&amp;utm_medium=referral&amp;utm_campaign=blog&amp;utm_content=oauth-refresh-token-best-practices) or look at our [getting started developer guide](https://developer.fusebit.io/docs/getting-started)!
