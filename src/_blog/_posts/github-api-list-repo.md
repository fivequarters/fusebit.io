---
post_title: How to Use the GitHub API to List Repositories
post_author: Carlos Schults
post_author_avatar: carlos.png
date: '2022-05-07'
post_image: github-api-list-repos.png
post_excerpt: GitHub offers developers a powerful API. In this post, learn how to use GitHub API to list repositories in several different ways.
post_slug: github-api-list-repositories
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/github-api-list-repos.png
posts_related:
  [
    'github-pulls-api-manage-prs',
    'integrate-github-api-everyauth',
    'google-search-console-github',
  ]
---

As a software engineer, you probably use GitHub quite often, be it as part of your day job, while working on your solo projects, or when contributing to open source. Generally speaking, GitHub's UI is clean, intuitive, and nice to use. However, if you need to integrate GitHub with the applications you write, using GitHub manually just won't cut it. That's where GitHub's REST API comes in handy. 

This post is a hands-on guide to the [GitHub API](https://fusebit.io/blog/make-git-your-api/). More specifically, you'll learn how to use the API to list repositories. We'll walk you through several scenarios, providing code samples and request examples in each one. By the end of the post, you'll feel comfortable when it comes to fetching repositories from GitHub. 

## Requirements

There are a few boxes you have to check if you want to follow along with the tutorial. First of all, I assume you're comfortable with the concept of RESTful APIs and have some experience working with APIs in general. I also expect you to be familiar with the workings of GitHub, but I **do not** assume prior experience with the GitHub API. 

Where the post asks for coding samples, I'll use C#, but just because that happens to be my favorite language. You don't need to be familiar with C# to be able to follow along. 

Finally, I assume three further things: 
* You're comfortable working with the command line.
* cURL is installed on your system.
* You know the basics of how to use it.
With all of that out of the way, let's get started. 

## How To List All Public Repositories Belonging to a User?

Let's start with the most basic scenario: listing all repositories belonging to a given user. First, let's retrieve a single user hitting the appropriately named user's endpoint: 

curl https://api.github.com/users/schacon 

The request above retrieves information about Scott Chacon, a co-founder of GitHub. Here's the response body (edited for brevity's sake): 

```json
{
  "login": "schacon",
  "id": 70,
  "node_id": "MDQ6VXNlcjcw",
  "avatar_url": "https://avatars.githubusercontent.com/u/70?v=4",
  "gravatar_id": "",
  "repos_url": "https://api.github.com/users/schacon/repos",
  "created_at": "2008-01-27T17:19:28Z",
  "updated_at": "2022-04-21T13:16:25Z"
}
```

As you can see, one of the properties of the JSON response is "repos_urls," whose value is **[https://api.github.com/users/schacon/repos.](https://api.github.com/users/schacon/repos)** Let's hit that endpoint now: 

`curl https://api.github.com/users/schacon/repos`

That works, but the response is too long to include here. Here's an excerpt as captured using my browser: 

![github list repositories with-shadow](github-list-repos.png 'github list repos')

So, to list all public repos from a user, send a GET request to `https://api.github.com/users/<USER-NAME>/repos`, replacing <USER-NAME> with the actual user from whom you want to retrieve the repositories. 

## How To List All Public Repositories Belonging to an Organization?

Listing the repositories belonging to an organization is just as easy. Here's the template for the endpoint you should hit: 

`https://api.github.com/orgs/<ORGANIZATION-NAME/repos`

For instance, to list repositories belonging to the Node.js organization, you'd do this: 
`curl https://api.github.com/orgs/nodejs/repos`

## How Do You List Repositories for the Authenticated User?

The scenarios I covered up until now are limited to fetching private repositories. And that makes perfect sense: It'd be quite a security breach if you could access Scott Chacon's—or anyone else's—private repositories. But if you want to list all of your repositories, there's an endpoint for that: **[https://api.github.com/user/repos](https://api.github.com/user/repos)**. 

Pay close attention: Now it's "user," without the "s" at the end. Let's hit it and see what happens: 
`curl https://api.github.com/user/repos`

This is the response:
```json 
{
    "message": "Requires authentication",
    "documentation_url": "https://docs.github.com/rest/reference/repos#list-repositories-for-the-authenticated-user"
}
```
As you can see, it didn't work. The message says quite clearly that we need authentication. If you want, use cURL again, but this time with the --head option, so you can see the response headers. The first thing you'll notice is the 404 Unauthorized status code. To get authenticated, you'll first need an authentication token. For that, you can [follow the directions here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). Give your token privileges over private repositories, like in the following image:

![github list repos authenticated user](github-list-repos-oauth.png 'github list repos authenticated user')

For security reasons, it's recommended you set an expiration date for your token. After it's generated, copy its value and store it somewhere safe. 

Now you're ready to repeat your request, this time including the token. Use the following template, replacing **username** with your user name and **token** with the value of the personal access token you just generated: 
`curl -u username:token https://api.github.com/user/repos`
You can enhance the results by using parameters. For instance, let's use visibility to get only private repositories (the possible values are **public, private**, and **all**): 
`curl -u username:token https://api.github.com/user/repos?visibility=private`
You're not restricted to fetching only repositories that belong to you. You can also retrieve repos in which you're a collaborator or a member of the organization. For that, you'd use the **affiliation** parameter: 
`curl -u username:token https://api.github.com/user/repos?affiliation=collaborator`
The possible values for this parameter are **owner, collaborator,** and **organization_member.**
## A More Advanced Scenario
Up until now, you've seen how to retrieve repositories belonging to other users and to organizations. You've also seen how to get the repos you own or have access to. But what if you don't know to whom the repo belongs? What if you only remember a few details about the repository, such as its main language or some word from its title? 

Well, you could retrieve all repositories and then search through the results. You could, for instance, use the /repositories endpoint—which retrieves all public repositories—and then perform your own search. Good luck doing that, though. The results to this endpoint are obviously paginated—there are many millions of repositories on GitHub. That means you need to keep requesting the next page and then the next, but you'll soon reach the rate limits of the API: 60 requests per hour for unauthenticated requests, and 5,000 per hour for authenticated requests. 

That's where GitHub's very powerful search API comes in handy. 


> GitHub’s **very powerful** search API comes in handy retrieving repositories

## List Repositories Using GitHub's Search API

The search API allows you to search for all kinds of GitHub artifacts using a versatile search syntax that allows for ordering, filtering, paging, and more. 

Let's see an example: 
`curl https://api.github.com/search/repositories?q=octokit+language:csharp`
The request above searches for repositories that contain "octokit" somewhere in their information and whose language is C#. Here's what the response could look like: 
```json
{
"total_count": 73,
"incomplete_results": false,
"items": []
}
```
As you can see, this time the payload is different, which makes sense, because this is a search result and not only a listing of entities like before. Here, before the actual items—which have been omitted for brevity—the JSON contains some metadata about the search itself, displaying the total number of results and whether it includes incomplete results. 

Let's see another example: 
`curl https://api.github.com/search/repositories?q=node+in:name+language:javascript&sort=stars&order=desc`
The request above performs a search that looks for repositories with the word "node" in their names and whose language is JavaScript. The results are to be sorted by the number of stars in descending order. 

Unsurprisingly, the first result is Node itself: 

![github list repos search api with-shadow](github-list-repos-search-api.png 'github list repos search api')

GitHub's search API is quite powerful, and covering it in-depth would be out of the scope of this single post. 

## Listing Repositories Using a Wrapper Library

Understanding the underlying endpoints is recommended when working with the GitHub API.Most of the time, when developing an integration, you'll be using a wrapper library written for your favorite programming language. 

> Most of the time when developing an integration you’ll be using a wrapper library written for your favorite programming language

I'll provide a quick example using C# and .NET 6. Let's start by creating a new project: 
```
dotnet new console -o gh-api-demo
cd gh-api-demo
```
Then I include the package for [Octokit.Net](https://docs.github.com/en/rest/overview/libraries), which is the official client library for the GitHub API written in C#: 
`dotnet add package Octokit`
The next step is then to write the code itself. The complete code is as follows: 
```
// #1
using Octokit;

// #2
Console.WriteLine("Enter the name of the user for which you want to list their repositories:");
var username = Console.ReadLine();

// #3
var github = new GitHubClient(new ProductHeaderValue("MyAmazingApp"));
var user = await github.User.Get(username);
var repos = await github.Repository.GetAllForUser(user.Login);

// #4
foreach (var repo in repos.OrderByDescending(x => x.StargazersCount))
{
    Console.WriteLine(Environment.NewLine);
    Console.WriteLine("Name: {0}", repo.Name);
    Console.WriteLine("URL: {0}", repo.HtmlUrl);
    Console.WriteLine("Stars: {0}", repo.StargazersCount);
}
```

I left numbered comments on the code so I could explain each part: 
1. Here I import the Octokit library that I installed earlier.
2. Then I display a message asking for a username to be provided. I read and assign the username to a variable.
3. Here, three things happen: 
 * I start a new GitHub client.
 * Using the client, I retrieve the user for the entered username.
 * Finally, I retrieve all (public) repositories for the user.
4. Then I just loop through the repositories (ordered from the most to the least starred), displaying their name, URL for the GitHub page, and the number of stars.
## Conclusion
GitHub is a big part of the daily working lives of many software engineers. So it's not a surprise that many engineers need to [integrate their apps with GitHub](https://fusebit.io/integrations/?i=githubapp). Thankfully, GitHub provides one of the nicest RESTful APIs out there. It's easy to get started with, follows good standards, and is, generally speaking, well documented. 

In this post, I've walked you through several ways to use the GitHub API to list repositories. By no means do I exhaust the topic, though. If you want to learn more, we encourage you to look at GitHub CLI and how it can be a nice alternative to cURL when making authenticated requests to the API. Additionally, explore the search API: It's powerful and flexible, but learning about the search syntax and options can take some time. 

If you enjoy this article, follow [@fusebitio](https://twitter.com/fusebitio) on Twitter for the latest developer content on Node.js, JavaScript, and APIs.

Thanks for reading!   

*This post was written by Carlos Schults. [Carlos](https://carlosschults.net) is a consultant and software engineer with experience in desktop, web, and mobile development. Though his primary language is C#, he has experience with a number of languages and platforms. His main interests include automated testing, version control, and code quality.*
