---
post_title: Using OAuth Providers With Microsoft Teams
post_author: Eric Goebelbecker
post_author_avatar: eric.png
date: '2022-08-19'
post_image: microsoft-teams-oauth.png
post_excerpt: Microsoft Teams support OAuth via Azure Active Directory for users, and via third-party for apps integration. Here's how and why!
post_slug: oauth-providers-microsoft-teams
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'secure-your-http-apis',
    'everyauth',
    'everyauth-salesforce',
  ]
---

Microsoft's Teams is a powerful enterprise messaging and collaboration tool. It's useful for staying in touch with colleagues and conducting meetings. But it's also positioned as a workplace hub where users work with documents and third-party applications like Jira, Trello, HubSpot, and Salesforce. How do these applications interact? Are their connections secure? 

Let's talk about how OAuth makes connecting Microsoft Teams to external applications safe and secure, and how you can use it for your application and your Teams instances. 

## What is OAuth?

Open Authorization (OAuth) is an [open standard](https://oauth.net/2/) for authenticating users. It's a common mechanism for identifying users that want to use websites and cloud applications. It works by passing the authentication from one application to the other without revealing the user's credentials. The current version of the standard is OAuth 2.0, which addresses several shortcomings in the previous standard. 

### How Does OAuth Work?

How does OAuth delegate authenticating a user from one service to another? 

When a user requests access to a service managed by OAuth, the service checks with the OAuth provider: 

1. User requests access to a service.
2. Service contacts OAuth provider to authenticate user.
3. OAuth confirms the legitimacy of the request with the user.
4. OAuth responds to the request from the service with a unique token.

It's important to note that the unique token issued to the client authenticates the user for only the specific application or website. It's not useful for authenticating with other services. 

Let's go over an example. 

Pat works at Acme Corp, which has a Single Sign-on (SSO) system that acts as an OAuth provider. Pat needs to book travel to a catapult sales convention, so they need to access the company's travel website. 

1. Pat goes to the travel website and clicks the login button.
2. The travel website requests authentication for Pat from the SSO service.
3. The SSO service asks Pat, via a popup, if they are trying to access the travel site. Depending on the situation, it may ask for a password or a two-factor authentication (2FA) token.
4. Pat indicates they are trying to access the site and responds to any prompts.
5. The SSO sends a unique token to the travel site, confirming Pat's identity and access rights.

Depending on the service, the OAuth provider may supply additional information with the token, such as a name or email address. But regardless of the situation, it never relays the user's password (or keys) and two-factor tokens to the service, and the token is always unique and associated with the requestor. 

> It’s important to note that the **unique token** issued to the client authenticates the user for only the **specific application** or website.

### Who Uses OAuth?

The list of websites that use OAuth is too long to list. If you see buttons like these on a login page, the website uses OAuth:   

![Microsoft Teams OAuth](microsoft-teams-1.png "Microsoft Teams OAuth")

If you click any of these buttons, the process we outlined above will begin. 

Microsoft, Amazon, Facebook, Apple, Google, Twitter, GitHub, and many other Internet service providers act as OAuth providers. 

### Why Should You Use OAuth?

From a user's perspective, there are several reasons to use OAuth. You can login to applications and websites without creating a new password or, worse, sharing an existing one. This doesn't just make logging into sites more convenient: it makes you more secure, too. You have fewer passwords to protect and fewer places where hackers can compromise your credentials. 

Application developers benefit from OAuth, because the provider does the work of authenticating users for them. This frees them from writing the code that does the work and from having to store authentication information. Even if an attacker compromises their systems, the only authentication information they'll find is unique tokens that are tied to the specific application. 

Finally, IT administrators benefit from OAuth, too. They only need to support a single authentication system, and all their applications benefit from upgrades to that system, like improved 2FA support, strong password requirements, and hardened systems. It also makes it easy to set up an SSO system like the one in the example above, which simplifies adding and removing employee access. 

## Does Microsoft Support OAuth?

Microsoft's [Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/) (Azure AD) is their user directory service for enterprises and small businesses. Businesses that use Microsoft Teams, or any other Microsoft cloud application, use Azure AD to create and manage user accounts, even if they don't integrate AD into the rest of their IT infrastructure. 

Azure AD can also act as an OAuth 2.0 provider for many cloud applications, so it's [easy for IT administrators to allow their users to use their AD credentials to use these apps](https://docs.microsoft.com/en-us/azure/active-directory/saas-apps/tutorial-list). But, users can only access Microsoft applications like Teams with Microsoft credentials. 

## Microsoft Teams and OAuth

Microsoft Teams supports OAuth in several ways: it can act as an SSO provider for third-party applications, or as a client application for an external OAuth provider. 

Teams' SSO provider allows applications to authenticate with a user's identity, providing them with access to applications in your Active Directory domain. So, the user doesn't need to login again: they only have to provide consent for the application and Teams retrieves the account details from Azure Active Directory. The user only has to provide consent once; the process authenticates the application on all devices. 

You can use third-party OAuth providers to authenticate users, too. This registers the Teams user with the third-party system while giving them access to Teams. You can use any compliant provider, including Google, Facebook, GitHub, or even a different Azure AD instance. 

> Microsoft Teams **supports** OAuth in several ways: it can act as a SSO provider for **third-party applications**, or as a client application for an external **OAuth** provider.

### Teams and Third-Party OAuth

Teams users often want to use third-party applications inside the messaging application. For example, Atlassian offers apps that make it easy to [access Jira and Trello](https://www.atlassian.com/blog/halp/ms-teams-atlassian-apps) without leaving Teams. But these applications require third-party authentication or the user will need to login every time they access the application. 

Teams supports third-party OAuth for [Tabs apps](https://docs.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/auth-tab-aad), [Bots](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/authentication/add-authentication?tabs=dotnet%2Cdotnet-sample), and [Message extensions](https://docs.microsoft.com/en-us/microsoftteams/platform/messaging-extensions/how-to/add-authentication). In all three cases, the client applications can authenticate with OAuth providers and keep their tokens so users only need to authenticate when they need the first token, or when an existing one expires. 

### Teams as an SSO Provider

With SSO, app users use their Teams credentials to access applications with their Microsoft or 365 account. So, you can seamlessly add a new application to Teams if it's authenticated by your Azure Active Directory. And it means a smooth experience for your users since they only need login once and the application is available on their devices. 

This system works because Teams authenticates the user and stores the AD token when they login. When the user wants to access another AD application, the user only needs to give their consent once, and the process is complete. The user is authenticated for the application on Teams, not just the Teams GUI. So, they can access the application inside Teams on all their devices. Microsoft has sample code and examples for SSO for [Tabs apps](https://docs.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/tab-sso-overview), [Bots](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/authentication/auth-aad-sso-bots), and [Message extensions](https://docs.microsoft.com/en-us/microsoftteams/platform/messaging-extensions/how-to/enable-sso-auth-me). 

![Microsoft Teams OAuth](microsoft-teams-2.jpg "Microsoft Teams OAuth")

## OAuth Makes Teams Secure and Easier to Use

In this post, we covered what OAuth is and how it works. We discussed how it makes authentication both easier and more secure for end users. and we also saw where developers and administrators can benefit from it, too. We also saw how Microsoft supports OAuth and SSO via Azure Active Directory. 

Finally, we covered how you can employ OAuth inside Microsoft Teams for access to AD applications and for third-party applications that connect to Teams. 

_This post was written by Eric Goebelbecker. [Eric](http://ericgoebelbecker.com/) has worked in the financial markets in New York City for 25 years, developing infrastructure for market data and financial information exchange (FIX) protocol networks. He loves to talk about what makes teams effective (or not so effective!)._
