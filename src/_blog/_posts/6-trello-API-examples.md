---
post_title: 6 Trello API Examples, Useful Code Recipes
post_author: Pius Aboyi
post_author_avatar: pius.png
date: '2022-06-21'
post_image: trello-api-examples.jpg
post_excerpt: In this post, you'll learn how to use the Trello API by walking through some 6 trello api examples. Let's get started.
post_slug: trello-api-examples
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'remix-react-framework',
    'github-api-nodejs',
    'new-express-5-features/',
  ]
---

Trello is a web-based collaboration tool that helps teams manage and organize tasks into boards. Each Trello card represents a task. Trello enables you to track projects, assign tasks to team members, and know which team member is currently working on a task.

Trello offers an API that developers can use to interact with the platform from their own apps. In this post, you'll learn how to use the Trello API  by walking through some examples.

> The Trello API makes it possible for you to **automate some mundane and time consuming tasks**

## **Trello API**

The Trello API (application programming interface) is a service that offers multiple endpoints for interacting with the Trello application. In other words, the Trello API allows you to make HTTP requests, in order to perform any actions on your Trello dashboard that you can do manually.

The Trello API makes it possible for you to automate some mundane and time consuming tasks. For example, with just a couple of Trello API requests, you can easily invite hundreds of members to a board and assign a task to each of those members.

## **Getting Started**

To start using the Trello API, first, you need to have an account on Trello. Go to[ https://trello.com](https://trello.com) to create one. Alternatively, you can sign in to an existing account if you already have one.

Next, you need an API key; the API key is a random 32 character alphanumeric string. To generate an API key, go to[ https://trello.com/app-key](https://trello.com/app-key), accept the terms, and click the **Show API Key** button. This API key is for development purposes only, if other users are required to authorize your Trello, they have to use OAuth instead of an API key.

![Trello API Examples with-shadow](trello-examples-1.png "Trello API Examples")

In addition to your API key, you need a token to start making API calls. You can request a token by clicking the **Token** link from the same page where you generated the API key.

The token is what actually grants you access to boards in your workspaces. Hence, in order to secure user data, you need to keep the token private. One way you can keep the token private is to set the token as an environment variable for your production application.

When generating a token for your account, Trello will prompt you with a screen like this:

![Trello API Examples with-shadow](trello-examples-2.png "Trello API Examples")

Go ahead and click on **Allow**, and a token will appear. Copy it and keep it safe.

## **Making HTTP Requests With Trello API**

Before you start making requests, you need to have a board on Trello. You can create one from the user workspace by clicking on **Create Board**.

For the sake of this article, we created a new **Trello API** board. Also, we’ll use **Postman** to make all HTTP requests to the Trello API endpoints. Postman is a tool that allows developers to design, build, and test APIs. It’s available as a Chrome extension and also as a standalone application for Windows, Mac, and Linux.

In order to follow along better, if you don't already have Postman, you can download it from[ https://www.postman.com/](https://www.postman.com/).

The following screenshot shows the user interface for Postman:

![Trello API Examples](trello-examples-3.png "Trello API Examples")

You can specify your current request type using the dropdown menu, shown in a green rectangle in the screenshot. For example, you can select the **POST**, **GET**, **PUT** or **DELETE** request type from that button. The section with the orange rectangle is where you actually provide your API endpoint (URL). Finally, the blue and red sections in the screenshot show the **request** and **response body**, respectively.

## Examples

In this section, we'll describe some examples to explain how to work with **Boards**, **Lists** and **Cards** using the **Trello Rest API** and Postman.

To help you follow along better, let's define some of the Trello terms we'll use often in our examples.

**Board:** The Board is where everything happens; it’s where you can add, update, and remove lists and cards (tasks).

**Card (Task):** This is by far one of the most important things on a board. Each card represents the most basic unit of information on Trello.

**List:** A list is a collection of cards (tasks). In the Trello Web Application interface, lists are arranged horizontally on a board. In Trello, lists serve to organize cards together vertically. For example, you can have a list of cards with the name **Unassigned** and organize all the new cards (or tasks) in the list before assigning team members to the cards.

> In this example, we’ll make an **HTTP request to get all the boards a specific user belongs to**

### Example 1: Get All Boards

In this example, we'll make an HTTP request to get all the boards a specific user belongs to. In order to do this, make a request to the following endpoint:

`https://api.trello.com/1/members/me/boards?key={APIKey}&token={APIToken}`

The "/me"/ parameter in the above endpoint will only return boards for the current user. In order to get boards for another user, you can replace "me" with a member ID. However, you may need to have the necessary permissions first.

Now, to test this endpoint in Postman, paste the above URL in the input field that says **Enter request URL**. Make sure you replace **{APIKey}** with the API key you generated earlier. Also, replace **{APIToken}** with your current user token. Next, set the request type as **GET**, then hit the **Send** button.

If the request is successful, you’ll receive a response. The response, which contains the list of boards you have on Trello, is in JSON format. The following screenshot shows the response data.

![Trello API Examples](trello-examples-4.png "Trello API Examples")

### **Example 2: Get A Single Board**

The endpoint from our last example returned a list of boards, but how can we get a single board?

In this example, we'll address exactly that. Requesting a single board is easy. Once we have the ID of the specific board we want, we can make a request using that ID to get more information about that board.

From the response in Example 1, we can clearly see that each board has an ID property. You can pick any ID from there to fetch a single board.

We'll use the following endpoint for this example:

`https://api.trello.com/1/boards/{idBoard}?key={APIKey}&token={APIToken}`

Just like in the last example, replace the text in braces with your valid data. Also, replace **{idBoard}** with the actual ID of a board. Also, note that the request type for this endpoint is **GET**.

Next, in Postman, go ahead and put in the API endpoint, then click send. Our response will be a single board with various properties. Here's a screenshot showing the response to that request:

![Trello API Examples](trello-examples-5.png "Trello API Examples")

### **Example 3: Create A Board**

To create a board, we'll make a **POST** request to the following endpoint:

https://api.trello.com/1/boards?key={APIKey}&token={APIToken}

Unlike the last two examples, this endpoint requires that we provide the body of the request with a JSON object. These data include properties like name, desc (description), idOrganization, and so on, that describe the new board you intend to create.

For simplicity's sake, we’ll only provide the board name and description.

Now in Postman, change the request type to **POST** and change the API endpoint to point to the endpoint provided earlier in this step. Remember to replace the parameter in braces with valid data. Next, in the body of the request, create a JSON object with the name and the description of your board, for example:

{“name” : “Super Hero HQ”, “desc” : “Daily tasks for CodeMan and his Tech Hero pals”}

You can use any name and description you like. Once the JSON object is ready, click on the **Send** button to send the request. Below is a picture showing a sample of a request.

![Trello API Examples](trello-examples-6.png "Trello API Examples")

The API response contains the properties of the new board we created. Some of the properties include **id**, name, and desc. As you can see, some of these properties were actually provided by Trello. For example, the **id** property is auto-generated by Trello.

### **Example 4: Invite Member To A Board**

To invite a member to a board via email address, you make a **PUT** request to this endpoint:

`https://api.trello.com/1/boards/{id}/members`

You replace **{id}** with the ID of a board.

The request body will contain a JSON object with properties like email, fullName, and type. So let’s go ahead and invite a new member using their email address.

Open Postman and make sure the request method is set as **PUT** and again, you replace the terms in curly braces with their actual values. Also, in the body provide your JSON object with the email address, and type the full name of the new member you’re inviting. The value for **type** can be admin, normal, observer, or another option. For example, here's the request body for this example:

{“email” : “memeberEmail@mail.com”, “fullName” : “John Doe”, “type” : “normal”}

After providing the information, click **Send** to make the request. If the request is successful, you’ll receive a response with a list of members assigned to that board, including the new member you invited.

### **Example 5: Create A List**

To add a list to a board we make a **POST** request to the following endpoint:

https://api.trello.com/1/boards/{id}/lists?key={APIKey}&token={APIToken}

Make sure to replace **{id}** with the actual ID of a board, and replace the other parameter in braces with valid data.

The request body for this example contains a JSON object with properties like title name, list name, pos for the list position (the position can be any positive number or a value like top or bottom (where top is the default).

Here's a screenshot showing this request in Postman:

![Trello API Examples](trello-examples-7.png "Trello API Examples")

In the picture above, you can see the body of the request, and the response we get back from Trello if our request is successful.

### **Example 6: Add Card To A List**

To add a card to a list, we make a **POST** request to this endpoint:

https://api.trello.com/1/cards/?idList={listId}&key={APIKey}&token={APIToken}

Replace **{listId}** with the actual ID of the list you’re adding the card to, and replace **{APIKey}** and **{APIToken}** with their actual values as well.

![Trello API Examples](trello-examples-8.png "Trello API Examples")

In the picture above, you can see the body of the request with a name and description. Currently, the card has no members assigned to it, so go ahead and add a member to the card.

## **Conclusion**

This article taught you the basics of what you can do with the Trello API, but there are so many other endpoints we didn’t cover. But I believe we have covered enough to understand how to use the Trello API even when the API endpoints differ.

If you want to read more and know more about the available endpoints and parameters, go to[ https://developer.atlassian.com/cloud/trello/rest/](https://developer.atlassian.com/cloud/trello/rest/) to browse them. Also, you can go through [Fusebit’s solution](https://fusebit.io/?utm_source=www.google.com&utm_medium=referral&utm_campaign=none) that covers all your integration requirements.

_This post was written by Pius Aboyi. [Pius](https://www.linkedin.com/in/aboyipius/?originalSubdomain=ng) is a mobile and web developer with over 4 years of experience building for the Android platform. He writes code in Java, Kotlin, and PHP. He loves writing about tech and creating how-to tutorials for developers._
