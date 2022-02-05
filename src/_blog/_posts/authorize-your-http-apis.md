---
post_title: Simple Authorization Model for HTTP APIs
post_author: Tomasz Janczuk
post_author_avatar: tomek.png
date: '2022-02-04'
post_image: blog-authorize-your-http-apis-main.jpg
post_excerpt: Simple yet flexible authorization model for your HTTP APIs, based on lessons learned at Fusebit.
post_slug: authorize-your-http-apis
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-authorize-your-http-apis-social.png
---

Deciding how to *authorize* access to HTTP APIs is a critical step in securing your application. The question must be addressed early in the design cycle of your app, right after you decide how to [*authenticate*](https://fusebit.io/blog/secure-your-http-apis/) users. Authorization design requires modeling your resources, actions that can be performed on those resources, and the granularity of access control checks. 

This post will present a simple, convention-based authorization model for REST APIs that removes the guesswork from some of the design decisions and results in a flexible and future-proof design. It is based on the model we’ve been successfully using to authorize access to [Fusebit](https://fusebit.io) APIs, and it has been a flexible approach as our platform continiously evolves.

## Authorization Challenges 

Authorization design is a step that should not be taken lightly.

The authorization model must be designed early in the lifecycle of your application when the final shape of the app is often still vague. At the same time, versioning of the authorization model is more challenging than versioning of other aspects of the app. The authorization model is part of the public surface area of your app and affects many operational processes (like administration). As the authorization model decision is taken in ambiguous circumstances and is hard to change later, you should not skimp on this part of the application design. Mistakes and omissions are going to be expensive for you to fix. Future changes will be disruptive for your users. 

Many HTTP APIs require developers to constantly refer to the API documentation to understand the permissions required for a particular call. That’s because the authorization model is often loosely coupled with the structure of the HTTP APIs. For example, applications that rely on OAuth often use *scopes* to describe the permissions required from the caller. Scopes typically govern broad classes of operations and APIs available in the system. For a developer looking at the API itself, it is not immediately clear what scopes are required to call it:

![Slack API Methods](blog-authorize.png "Slack API Methods")

It is going to be frustrating for the developers using your API if they have to consult your documentation each time they need to make a call. 

## Introducing A Convention-based Authorization Model

What if the authorization model was tightly coupled with the shape of the HTTP API?

A well-designed API surface is a complete representation of the *resources* the system exposes and the *operations* the caller can perform on those resources. A REST-based design uses the URL hierarchy of the APIs to represent resources, and the HTTP verbs to represent operations. Consider the following, simple API for a hypothetical system for veterinary clinics: 

```javascript
app.get(‘/clinic/:clinicId/cat/:catId’, getCat);
app.put(‘/clinic/:clinicId/cat/:catId, putCat);
```

The GET API above gets (the operation) the status of a specific cat from a specific clinic (the resource). The PUT API updates (the operation) the status of the same cat (the resource). 

An authorization model that is tightly coupled with the shape of the HTTP API has the following model: 

![HTTP API Model](blog-authorize-2.png "HTTP API Model")

The *identity* represents a recognized principal in your app - a user or an application that can be granted certain permissions in your system. When your app receives an HTTP API call, the identity of the caller is typically established in the process of *authentication*. You can read more about the approaches to the authentication process in the previous article [How to Secure Your HTTP APIs](https://fusebit.io/blog/secure-your-http-apis/).

Each identity your system recognizes can be granted multiple *permissions*. Each permission is represented by a tuple of (*resource*, *operation*). This is where the simplicity of this authorization design comes in:
 
1. A valid permission *resource* is any valid URL from the URL space of your HTTP APIs.
2. A valid permission *operation* for a given resource is any HTTP verb your app supports for that URL. 

This authorization model removes the guesswork from finding out what permissions the caller needs in order to make a specific HTTP request. They simply need the (*http-url*, *http-verb*) permission to be in the set of permissions that was granted to them. While very simple, this model lacks flexibility: 

* Resources are exactly as granular as the URL space of your API surface, while it is sometimes useful to think about permission scopes at a higher level of resource granularity.
* Operations being mapped to HTTP verbs may sometimes be too coarse to describe more nuanced authorization situations, e.g. which of the attributes of a cat can be modified in an HTTP PATCH call.

Let’s fix it by adding two more rules to the authorization model above: 

3. A permission resource that grants access to a specific URL of your app can be a *prefix* of that URL. 
4. A permission operation that grants access to perform a specific operation on a URL can have a suffix that *scopes down* the effect of this permission. 

Let’s explore the flexibility of this model. Consider the following examples: 

![HTTP API Call Examples](blog-authorize-3.png "HTTP API Call Examples")

Note that the access check logic relies on the prefix match on the permission resource and operation. This model works well in situations where resources in your application are organized in a strict hierarchy, and that hierarchy is also a convenient way to manage permissions in your app. In the example above, a specific cat is a resource that is subordinate to a specific veterinary clinic.

Let’s assume the HTTP APIs are to be consumed by both cat owners and clinic staff. Cat owners should only be able to access information about their specific cat. Clinic staff should be able to access info about all cats this clinic serves. The authorization model above has sufficient flexibility to capture those permissions in a concise way. 

## Conclusion

The authorization model presented above is based on a few simple rules that remove the guesswork from understanding the permissions required to call a specific API. Developers using your API will love it. The model works well for a range of applications that can organize their resources in a strict hierarchy and design the URL space of their APIs to represent it cleanly. This includes a substantial share of applications but is by no means universal. If your app fits this pattern, you can greatly simplify the authorization model for your users and make it future-proof for yourself.

Follow [@fusebitio](https://twitter.com/fusebitio) on Twitter for more developer-focused content including auth, APIs, and integrations.
