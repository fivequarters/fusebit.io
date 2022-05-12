---
post_title: GitHub's Search API, An Introduction With Examples
post_author: Siddhant Varma
post_author_avatar: siddhant.png
date: '2022-05-12'
post_image: github-search-api-main.png
post_excerpt: Learn how to construct search queries to use Github Search API to search users, repositories, commits and code messages.
post_slug: github-search-api
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/github-search-api-main.png
posts_related:
  [
    'github-pulls-api-manage-prs',
    'github-api-list-repositories',
    'integrate-github-api-everyauth',
  ]
---

[GitHub](http://github.com/)is probably the most loved software used by developers all over the world. Besides code collaboration, it brings in tons of useful features, such as issue tracking and code management. And if you've loved what it offers, you'll absolutely love using its raw APIs to build great things. 

Being the extensive tool it is, GitHub provides a developer-friendly way to access all of its features via its APIs. One such popular API is the search, which allows developers to search code, users, repositories, issues, labels, pull requests, and much more. 

So in this tutorial, I'll walk you through how you can use the GitHub search API to construct queries and search various things on GitHub. 

> One such popular API is **the search**, which allows developers to search code, user,s repositories, issues, labels, pull request, and **much more*.

## Working With GitHub APIs

Let's do a quick refresher so you understand how to use GitHub APIs in general. First, make sure you have a GitHub account and have generated a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for authentication. 

We'll use a VS Code extension called [Thunder Client](https://www.thunderclient.com/) to test APIs and see their responses. Thunder Client is a tool like [Postman](https://www.postman.com/) that allows you to send HTTP or cURL requests from your editor. It's really simple to use, doesn't appear as overwhelming as Postman, and comes in handy when you're using your editor. 

To install this extension, first head over to your VS Code. Then, search "Thunder Client" in the Extensions tab. 

![github search api vs code](github-search-api-vsc.png "github search api vs code")

After that, choose the extension and click Install. Since I have already installed the extension, it shows Uninstall for me. But if it's the first time you're opening the extension and don't have the extension yet, it will show Install for you instead. 

![github search api thunder client](github-search-api-thunder-client.png "github search api thunder client")

Once that's done, you should see an icon on the left panel of your VS Code. You can click on it to immediately launch Thunder Client. 

Let's now make a sample request to one of GitHub's APIs to see if everything is in place. Click on "New Request" in the Thunder Client window. 

![github searcha api new request](github-search-api-new-req.png "github searcha api new request")

Add the following URL in the request input: 

[https://api.github.com/users/fuzzysid](https://api.github.com/users/fuzzysid)

Under the Query section, select the Auth tab. Inside this, select the Basic tab. Enter your GitHub username in the Username field. Then add your personal access token in the Password field. Next click Send. You should get back some response that looks like this: 

![github search api auth](github-search-api-auth.png "github search api auth")

Great! We're all set to test and query GitHub Search APIs directly from our editor. 

## Search API: An Overview

The easier way to get started with the Search API is to see what all we can search on GitHub. For this, head over to your browser and open [api.github.com](https://api.github.com/). Once you do that, you should see a list of all the APIs GitHub offers: 

![github search api overview](github-search-api-overview.png "github search api overview")

As you can see, we can use the search API to search: 

1. Code using code_search_url
2. Commit using commit_search_url
3. Issues using issue_search_url
4. Labels using label_search_url
5. Repository using repository_search_url
6. Topic using topic_search_url
7. User using user_search_url

Notice how each of the URLs follows a similar pattern. There is a common base URL for all the APIs as https://api.github.com/search. Then, there is a search query in each request denoted by **?q=**. Finally, there is another query parameter object for pagination and sorting. 

In a nutshell, all you need to understand to use Search APIs is how to construct your search queries. So let's see how we can do that with a couple of examples. 

![github search api look looking](github-search-api-look.png "github search api look looking")

## Constructing Search Queries and Search Users

Search queries can't take in as many keywords and qualifiers as you like. You can look at all the available lists of keywords and qualifiers [here](https://docs.github.com/en/search-github/searching-on-github), but let's start with a simple use case. 

We want to search for all the users who have the name "siddhant" in their names. 

Here's what the search query would look like: 

`q=siddhant in:name`

We use the **in** qualifier to search for a term against the **name** keyword. Let's give this a go. 

![github search api queries](github-search-api-queries-1.png "github search api queries") 

Notice how we see a list of users with the name "siddhant" in their names. However, there's a small problem with this query. It's giving us both the users as well as organizations in its result. Let's limit the result only to users. 

We can do that by adding **type:user** as another query parameter in the API. So our query now becomes: 

`q=siddhant in:name type:user`

And it yields the following response: 

********** AQUI ![github search api queries](github-search-api-q.png "github search api queries")
 
Notice how we got back 1,365 results this time instead of the original 1,366 results. Let's now update our search query further. Let's say that, among these users, we want to find the most popular users. Maybe the top 40 to 50 users who have more than 30 repositories and 10 followers. 

We can do that by updating our query as follows: 

`q=siddhant in:name type:user repos:%3E30+followers:%3E10`

And that will give us back our list of popular users: 

![github search api queries](github-search-api-queries-3.png "github search api queries") 

Awesome! I hope you're getting the hang of constructing queries. Now let's try to search for something else. 

## Search Code

Let's now see how can search for code on GitHub. Let's say we want to search for some files in a particular repository. How can we do that? What will our search query look like? First, we'll need to update our endpoint from **/users** to **/code.** 

In this case, let's say we want to look up or search for all the JavaScript files in [ReactJS official documentation repository](https://github.com/reactjs/reactjs.org). Here's how we can construct a search query for that: 

`q=language:js+repo:reactjs/reactjs.org`

We specify the repository alongside the organization using the **repo** keyword. To search for JavaScript files, we specify the **language** keyword to be of value **js**. 

![github search api queries](github-search-api-queries-4.png "github search api queries") 

We can now search for something more specific in the code, say a keyword for a class or a function. Let's say we want to search for the **versions** keyword. We can simply add that keyword to our query: 

`q=versions+in:file+language:js+repo:reactjs/reactjs.org`

Once we do that, we should now get a list of all those files that have the word **"versions"** inside them: 

![github search api queries](github-search-api-queries-5.png "github search api queries") 

## Search Commits

Similar to how we searched code and users, we can also search for commits belonging to a particular repository. This time, the endpoint will be **/commits** instead. The basic query parameter for searching commits is as follows: 

`q=repo:&lt;REPOSITORY_NAME/ORGANIZATION>+&lt;COMMIT>`

We need to first specify the repository name and the organization we want to search the commits from. Then we specify the search query parameter for the commit itself. 

Let's search for all the commits in the React documentation repository pertaining to upgrades. So our query now becomes: 

`q=repo:reactjs/reactjs.org+upgrade`

Let's hit this endpoint and see what we get back: 

![github search api queries](github-search-api-queries-6.png "github search api queries") 


Notice how all the commit messages in the returned list of commits contain the keyword "upgrade." Hence we have searched through all the upgrade-related commits in the React documentation repository. 

## Search Repositories and Sorting

Now we'll learn how to query or search through repositories on GitHub via the search API. Let's say we want to search for all the popular React libraries written in JavaScript. First, we need to search for all the React and JavaScript-based repositories. The search query for this part looks like this: 

`q=react+language:js`

Then, to reel in the popularity factor, we can sort the result by the number of stars the repository contains. For this, we'll specify the **sort** parameter as **stars** and the **order** parameter as **desc**. So now the complete search query becomes: 

`q=react+language:js&sort=stars&order=desc`

Great! Now let's test this. If you hit the above endpoint, you'll get back a list of all the React and JavaScript-based repositories sorted in descending order by the number of stars. 

![github search api queries](github-search-api-queries-7.png "github search api queries") 

Surprisingly, the [official React repository](https://github.com/facebook/react) comes second in this list after [freeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp)! Can you think why is that so? Looks like our popularity criteria need more fine-tuning! 

## Explore Further

In this tutorial, we have seen how to construct search queries and use GitHub's search API to search users, commits, code, and repositories. However, as I pointed out earlier, there's more you can search through GitHub. The [official docs](https://docs.github.com/en/rest/reference/search) are the best place to start. You can further learn how to search for pull requests, topics, and labels. 

> If you're looking for integrations, check out **Fusebit**. It allows you to **easily create integrations** with your favorite platforms, such as GitHub, Slack, and much more!

Or how about you build a small app that parses the data result by these search APIs for something useful? This app could manifest into an internal tool you can use at work to automate a Github search workflow. It could also turn out to be something interesting that you can use for your own personal or open source projects you contribute to on GitHub. Maybe the client of this app is a powerful integration tool you might need badly! But if you're looking for integrations, check out [Fusebit](https://fusebit.io/integrations/). It allows you to easily create integrations for your customers with your favorite platforms, such as GitHub, Slack, and much more! 

Want more developer articles like this? Follow [@fusebitio](https://twitter.com/fusebitio) on Twitter to be alerted when Fusebit publishes their latest developer content.

_This post was written by Siddhant Varma. [Siddhant](https://www.linkedin.com/in/siddhantvarma99/) is a full-stack JavaScript developer with expertise in frontend engineering. He’s worked with scaling multiple startups in India and has experience building products in the Ed-Tech and healthcare industries. Siddhant has a passion for teaching and a knack for writing. He's also taught programming to many graduates, helping them become better future developers._
