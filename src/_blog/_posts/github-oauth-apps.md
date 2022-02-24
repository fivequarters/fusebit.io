---
post_title: GitHub OAuth Apps vs GitHub Apps
post_author: Rubén Restrepo
post_author_avatar: bencho.png
date: '2022-02-24'
post_image: github-apps-main.jpg
post_excerpt: GitHub Apps are the way to integrate with GitHub. It supports OAuth Apps and GitHub Apps. Understanding what app you should create is critical for your integration capabilities.
post_slug: github-oauth-apps-vs-github-apps
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/github-apps-main.jpg
---

GitHub Apps are the way to integrate with GitHub. GitHub supports two different types of integrations: GitHub OAuth Apps and GitHub Apps. Understanding what app you should create is critical for your integration capabilities.

## GitHub OAuth App

### Why use a GitHub OAuth App?

- If you are building an internal application that needs to modify workflow files that allows your team to improve automations using GitHub actions.
- You’re building an application that allows users to connect their GitHub account to display GitHub usage stats like the number of commits per day in specific repositories.
- You’re building an application focused on developers that can log in to it using their GitHub account. (You can use a service like [Auth0](https://marketplace.auth0.com/integrations/github-social-connection) to enable this).
- You’re building a Slack bot that allows you to comment on a GitHub issue from Slack, and you want the comment author to be the user-linked GitHub account.

### What's a GitHub OAuth App

A GitHub OAuth App is an application that **acts on behalf of the authorizing user**.
It only has access to the user's resources. Removing a user from a repository will remove the application access.

The GitHub OAuth permissions are authorized or denied from the OAuth consent screen.
Permissions are known as scopes. A scope is a mechanism in the OAuth 2.0 protocol to limit an application's access to a user's account.
View the [complete list of available scopes](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes).

GitHub OAuth Apps implements the [authorization code grant type](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1) from the OAuth 2.0 protocol. In this redirection-based flow, the client (your application) and the user interact with GitHub to access authorization via a consent screen. Once authorized, your GitHub OAuth App can request additional permissions to the user if needed.

Your application shouldn't assume the user authorizes all the requested permissions. When expected authorization is not allowed, your application should handle that case properly, e.g., show a warning message in your application explaining that access to read repository contents needs to be allowed to interact with a specific feature within your application.

If you want to understand GitHub OAuth App’s authorization flow you can read about it on [GitHub's developer docs](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow).

## GitHub Apps

### Why use a GitHub App?

- A GitHub App is the officially recommended way to integrate with GitHub.
- It offers better granular permissions to access resources.
- GitHub Apps can be installed directly on organizations and user accounts and granted access to specific repositories.
- Manage permissions from the GitHub App settings
- Webhooks are centralized receive events for all repositories and organizations the app can access.
- You can still act as the authorizing user since OAuth is supported.

### What's a GitHub App

A GitHub App allows you to interact with GitHub API using GitHub App own identity. Installation of a GitHub App can be on both organizations and individual accounts.

Permissions are configured at the application settings level. On installation, a user can decide if the application is available for specific repositories the user has access to, or an entire GitHub organization.

With a GitHub App you can interact with the GitHub API in 3 different ways:
- On user behalf (known as a user to server requests) - similar to a GitHub OAuth App
- Authenticated as the application
- Authenticated as an installation

### Who can install a GitHub App?

Organization owners or users with admin permissions over a repository can install a GitHub app. For non-organization owners, you can still grant access to them via **GitHub App manager permissions**.

Configuration of GitHub Apps permissions is at the application settings level. Adding new permissions requires explicit user approval before using from the GitHub App.

Read more about [configuring GitHub App permissions](https://docs.github.com/en/developers/apps/managing-github-apps/editing-a-github-apps-permissions).

### GitHub App acts on behalf of a user

#### Features:

- Act on behalf of the authorizing user limited to the user's accessible resources.
- Use private endpoints (available only to the authenticated user), like getting/updating current authenticated user information. Read more about it on [GitHub's REST API Docs](https://docs.github.com/en/rest/reference/users).

The GitHub App, in order to act on behalf of a user, uses an OAuth flow (similar to a GitHub OAuth App flow). The user authorizes the application to request their identity and act on behalf of it.

#### Available endpoints

If you want to know what requests a GitHub App can perform acting on behalf of a user, you can read more about it on [GitHub](https://docs.github.com/en/developers/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps#user-to-server-requests).

### GitHub Apps authenticated as GitHub App

Use an access token representing the GitHub Application. The most critical use case would be to request an access token for an installation allowing to perform actions in the GitHub API for that installation.

#### Features
The primary purpose of using the GitHub API authenticated as a GitHub App is management.
It’s more about the relationship between your GitHub App and user installations.
The specific Application level endpoints allows you to:

- Retrieve high-level management information about your GitHub App.
- Get information about application installations.
- Request access tokens for an installation of the app.
- Get information about the total number of installations of your application.
- Uninstall the GitHub App programmatically.

#### Available endpoints

If you want to know what requests a GitHub App can perform, you can read more about it on [GitHub's docs](https://docs.github.com/en/rest/reference/apps).

### GitHub Apps authenticated as GitHub App Installation

The most common model for a GitHub App is to act as a GitHub App Installation, you will interact with the GitHub API authenticated as a GitHub Installation.

​​Have you seen those comments added automatically by a GitHub Bot user from some popular integrations like this one from Vercel?

![GitHub apps vercel](blog-github-oauth-vercel.png 'GitHub apps vercel')

#### Available endpoints

If you want to know what requests a GitHub App authenticated as an installation can perform, you can read more about it on [GitHub]( https://docs.github.com/en/rest/overview/endpoints-available-for-github-apps).

### Real-world examples

There are many uses cases for a GitHub App. Check some ideas and real-world examples of popular GitHub Apps you can use today.

- You want to develop an application that sends daily usage stats from your organization's repositories in your inbox; it could be via email, Slack, Discord, or your preferred communication platform. It can be installed in your own GitHub organization, shared publicly, or even distributed in the GitHub Marketplace.
- You want to develop an application that allows creating GitHub issues from a third-party project management application like Asana, Linear, Jira.
- You want to develop a Slack bot that dispatches a GitHub action from Slack. This action could be like deploying a specific version of an application to the staging environment.
- A web application that allows administering your company internal users permissions integrated with your GitHub Org, and you can remove, add and update GitHub users associated with the specific GitHub Organization.
- A Slack bot that notifies users in a channel when a secret is committed accidentally in your GitHub organization repositories.
- You want to develop an online web application that allows users to design their static website and deploy its contents to GitHub pages.

### Snyk
Add [automated security checks to your repositories](https://docs.snyk.io/features/integrations/git-repository-scm-integrations/github-integration).

![GitHub apps fail with-shadow](blog-github-oauth-fail.png 'GitHub apps fail')

### Slack
Connect your [GitHub with Slack](https://slack.github.com/)

![GitHub apps slack with-shadow](blog-github-oauth-slack.png 'GitHub apps slack')

### CircleCI
Automatically runs your build and test processes whenever you commit code, and then displays the build status in your GitHub branch [Read more](https://circleci.com/integrations/github/)

![GitHub apps checks with-shadow](blog-github-oauth-checks.png 'GitHub apps checks')

There are some critical differences between an OAuth App and a GitHub App.

- While the permissions of a GitHub App are granted via the application settings by an organization owner, repository admin, or user with **GitHub App manager permissions**, permissions for a GitHub OAuth App are defined by the scopes requested during the OAuth authorization flow.
- Permissions are more granular with a GitHub App than a GitHub OAuth App. For example, if your application needs to interact with pull requests and issues, the requested permissions are broader for a GitHub OAuth app since the application requires the `repo` scope, granting access to all aspects of the repository, rather than a GitHub App’s granular permissions for only pull request or issues.

You can read more about it on [GitHub](https://docs.github.com/en/developers/apps/getting-started-with-apps/differences-between-github-apps-and-oauth-apps).

## Conclusion

GitHub [officially recommends](https://docs.github.com/en/developers/apps/getting-started-with-apps/migrating-oauth-apps-to-github-apps) using GitHub App for your new integration.

However, some endpoints are unsupported for a GitHub App. For a specific endpoint, read the endpoint notes section that says **Works with GitHub Apps** to check.

If you want to deep dive about more differences between a GitHub OAuth App and GitHub App, [read the following docs from GitHub](https://docs.github.com/en/developers/apps/getting-started-with-apps/differences-between-github-apps-and-oauth-apps).
