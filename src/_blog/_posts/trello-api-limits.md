---
post_title: Trello API Limits, 5 Best Practices to Avoid Rate Limiting
post_author: Pius Aboyi
post_author_avatar: pius.png
date: '2022-06-22'
post_image: trello-api-limits.png
post_excerpt: Third-party APIs like the Trello API can make life easier for developer. We'll discuss best practices to avoid rate limits in the Trello API.
post_slug: trello-api-limits
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'trello-api-examples',
    'webhook-rate-limits-and-throttling',
    'discord-rate-limiting',
  ]
---

Third-party APIs like the[ Trello](https://trello.com/en) API can make life easier for developers and their organizations in many ways. For instance, teams that use Trello can make use of the API to automate repetitive tasks like adding new members to boards. It's even possible for developers to use such APIs to add new features to their own applications.

However, usually, public API services like the Trello API have request limits. The purpose of API rate limiting is to prevent users from overloading and crashing the service. Because of this, when you're using an API from a third party like Trello, it's important to have knowledge of its limits and how to safely work within the limits. In this post, we'll be sharing best practices for avoiding rate limits in the Trello API.

> It **prevents** users or an application from **exceeding a specific maximum number of requests or resources** it is allowed to access

## What Is Rate Limiting?

_Rate limiting_ is a popular term in APIs. It prevents users or an application from exceeding a specific maximum number of requests or resources it is allowed to access. API rate limiting errors return the HTTP status code **429**.

For example, rate limiting may prevent a client from sending more than **X** requests under a specific time interval, where **X** can be a number like 100 or 200. Another example is limiting the amount of data a client may request in a single call. There are other types of rate limiting, and in the next section, we'll take a closer look at them.

### Trello API Limit Types

* **API key limit:** This limits how many calls an API key can make in a specific time interval.
* **Token limit:** This type of limit determines the maximum request a user token can send within a specific time interval.
* **Response size limit:** This prevents the API from returning too much data in a single request.
* **Special route limit:** To prevent abuse of endpoints that return user data, this type of limit restricts the maximum number of requests you can send to such routes.

## Trello API Limits: How Much Can You Use the Trello API?

Before we look at the best practices for avoiding rate limiting in the Trello API, let's take a look at what limits exist. The Trello API has limits on API keys, user tokens, and different resource types. The following list shows the number of requests and resources allowed for each category as at the time of writing this post.

* **API key:** 300 requests in 10 seconds
* **Token:** 100 requests in 10 seconds
* **Special route (e.g., /1/members/):** 100 requests in 900 seconds

## 5 Best Practices to Avoid Rate Limiting

Now that we have some understanding of the Trello API's limits, let's look at some best practices for working around the limits.

> A middleware generally is a tool or piece of code that **performs functions that cut across multiple parts of a system**

### 1. Use Middleware to Reduce Calls

One way for avoiding rate limits is to use middleware. A middleware generally is a tool or piece of code that performs functions that cut across multiple parts of a system. A common example of middleware is a feature for logging in an application. It's common practice to log information like details about crashes across an entire app. As a result, it makes sense to use middleware for that.

In order to reduce direct calls to the Trello API, you can implement a middleware that runs for every HTTP request your applications make. Inside the middleware, we can use techniques like caching and delays to prevent rate limiting errors. There are different middleware tools for doing this, and the one you pick usually depends on what's best for the framework or programming language you use.

### 2. Implement Rate Limiting Reduction Techniques

Using rate limiting techniques prevents your application from reaching or exceeding the maximum number of requests per time interval. The following are some rate limiting techniques.

**Throttling:** This method involves reducing the maximum number of requests your application can send to the Trello API. You should set the maximum to a number that's below the API limit specification. For example, you should throttle your code so that it sends a maximum of around 290 requests in 10 seconds for a single API key.

**Delaying:** You can reduce rate limiting errors by setting your own minimum time interval between concurrent requests. This can be done in code using a delay function.

> A good way to eliminate Trello API rate limiting is by **not making calls to the API at all**

### 3. Use Webhooks

A good way to eliminate Trello API rate limiting is by not making calls to the API at all. Instead, opt to use webhooks.

This is how webhooks work: First, you provide a callback URL. Then the Trello service sends a **POST** request to that callback URL every time the model you're watching changes. This **POST** request contains details about the change (action) and the new value (data) of the model.

Some examples of Trello models are a board, member, and card. And the webhook will send requests to your callback URL when an event (change) occurs on each model. In order to create a webhook for a model, you'll need to specify the ID for the model. The following code sample shows the configuration of a Trello webhook:

```js
$.post("https://api.trello.com/1/tokens/{APIToken}/webhooks/?key={APIKey}", {
  description: "Awesome board webhook 1",
  callbackURL: "https://www.example.com/callbacks/trello1",
  idModel: "123456abcdef",
});
```

The **idModel** property represents the model ID we mentioned earlier. It could be the ID for a member, board, or card.

Once Trello sends data to your callback URL, you can then parse it and use it in your application without calling the endpoint that usually returns similar data. This way, you never hit the API limit and only need to process data when the value changes from the initial value at your last call.

### 4. Use Nested Resources

Resources in Trello are nested by nature. For example, a card is inside a list that is inside a board. As a result, the Trello API offers an option for fetching nested resources in a single request to reduce API calls.

To demonstrate how this works, let's take a look at an example for the endpoint to get a single board. We'll be using the following endpoint:

`https://api.trello.com/1/boards/{idBoard}?key={APIKey}&token={APIToken}`

Making a **GET** request to the above URL from your application returns data for a specific board (**idBoard**).

But what if we also want to get all the cards on this board. An obvious approach for doing that would be to send another request to get the cards for the board using the board ID as a parameter. Using nested resources, we can get data for both the board and all the cards with just one request. To do that, add the **cards** nested resources parameter to the endpoint URL like so:

`https://api.trello.com/1/boards/{idBoard}?key={APIKey}&token={APIToken}&cards=all`

The above version of the endpoint will include an extra **cards** field in the response. The **cards** field contains a list of cards belonging to the board. As a result, this eliminates the need to make more calls to the API, which can lead to rate limiting errors.

Response without **cards** parameter:

```js
{
   "id": "61f79b4e1b587c73c9120312",
   "name": "Space Main",
   "desc": "",
}
```

Response with **cards** parameter set to **all**:

```js
{
	"id": "61f79b4e1b5332c73c9120312",
	"name": "Space Main",
	"desc": "",
	"cards": [
    {
			"id": "61f79b8926b2wewefe40251d",
			"desc": "Hello card is a task about...",
		},
		{
			"id": "62838a5acba50a186ff69f8d",
			"desc": "Fix bug",
		}
	]
}
```

### 5. Use Rate Limiting Information From Header

For a successful request to the Trello API, the response header contains information about rate limits. Included in this data is the number of requests left before you hit the **429** error. Using this information, you can better architect your application to avoid rate limiting errors. The following screenshot shows rate limiting information in the header of the last example.

![trello API limits](trello-api-limits-example.png "trello API limits")

As mentioned, the Trello API will return a **429** error response code when you reach the API limit. Along with this response is a **'Retry-After'** header. This header usually specifies how much time your application should wait before it can access resources again.

Using the **'Retry-After'** header, you can implement better code for fetching data after an error.

## Working Around/Handling Rate Limit Errors

Because the Trello API returns an error with status code **429**, it's easy to identify rate limit errors. Also, after detecting a rate limit error, you can perform a fallback action in your application. In this section, we'll discuss some good practices you can perform when a rate limit error occurs.

**1. Displaying a helpful message or prompt:** Once you're sure the error that occurs on your application is **429**, you can display a prompt to the user. This prompt can contain a message that tells the user an error occurred because they've exceeded the maximum usage and should retry at a later time.

**2. Loading data from cache:** Another way to handle a rate limit error is to fall back to a cached version of the data you requested. This is very helpful for endpoints that return data that doesn't change frequently.

**3. Delaying and retrying:** Using data like** 'Retry-After'** from the header, you may delay your application for the** 'Retry-After'** value and then send another request. If the delay time is short, your user won't even notice any issues.

## Summing Up

In this article, we described what rate limiting is and the Trello API rate limit. Also, we listed five best practices for avoiding rate limiting errors.

The practices we mentioned include the use of middleware, implementation of throttling and delays in our code, and use of webhooks and nested resources.

Applying the best practices we discussed can eliminate most rate limiting errors.

Finally, if you want to learn more about third party API integrations, you can visit Fusebit’s [integration blog](https://fusebit.io/blog/tags/integrations/).

_This post was written by Pius Aboyi. [Pius](https://www.linkedin.com/in/aboyipius/?originalSubdomain=ng) is a mobile and web developer with over 4 years of experience building for the Android platform. He writes code in Java, Kotlin, and PHP. He loves writing about tech and creating how-to tutorials for developers._

