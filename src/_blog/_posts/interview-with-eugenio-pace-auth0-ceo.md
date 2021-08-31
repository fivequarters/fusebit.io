---
layout: post.pug
post_title: The Role of Integrations in Building a Unicorn
post_author: Tomasz Janczuk
post_author_avatar: https://fusebit.io/tomek.png
date: '2019-08-26'
post_image: https://fusebit.io/blog-interview-with-auth0-main.png
post_excerpt: We interviewed Eugenio Pace, Auth0 CEO, about his company's approach to integrations. Get a glimpse into what makes a recent unicorn tick, what worked well, and what is yet to work better.
post_slug: interview-with-eugenio-pace-auth0-ceo
tags: ['post']
---

We spoke with Eugenio Pace, the co-founder and CEO of [Auth0](https://auth0.com/), to get the scoop on his company's approach to integrations. Eugenio started Auth0 with Matias Woloski in 2013 to make identity management simple for developers. The phenomenal growth of the company led to Auth0 reaching unicorn status in 2019. We asked Eugenio what role integrations have played during this journey.

### What does Auth0 do?

Auth0 is a tech company that provides an authentication and authorization service for application builders: software developers and architects, product owners, security engineers. For anyone building an application that needs to identify legitimate users and decide what those users can do.

We are a global company with 500 employees in five locations around the world, helping more than 7,000 customers.

### What is the business value of integrations in your platform?

We seldom work with greenfield or "built from scratch" systems. Our customers almost always work with projects in which pre-existing systems are present, so we needed an easy way to embrace this reality.

> Integrations with external systems are essential to our value proposition. Almost 90% of our customer base uses some of our extensibility features.

We've decided to offer outstanding capabilities to make integrating Auth0 platform with external systems easy. Our scripting extensibility features allow any developer to quickly close the gap between our service and any other API they need to exchange data with. We call it the last mile connections.

### What purpose do integrations serve in your product?

Most of the time, our customers integrate with legacy systems or exchange data with specialized APIs. Some examples are logging or entitlements services, event notifications, or 3rd party MFA providers.

### What is your approach to implementing integrations?

It is multifaceted.

Some very common, recurrent integration patterns are baked into the product and just need to be activated and configured. A good example of this is exporting logs to services like Splunk, SumoLogic, or Loggly. Another one is integration with source control services like Github, Bitbucket, or Visual Studio. We offer a gallery of pre-packaged integrations that our customers can activate and configure — no code required in this case.

![Auth0 Extensions](https://fusebit.io/blog-interview-auth0-extensions.png 'Auth0 Extensions')

For inbound integrations, we offer APIs that other systems can call into.

In the more advanced cases, we offer the ability to write Node.js code that extends our core logic with custom behavior. A great example is a script that executes after a login transaction in which our customers can inject additional behavior (e.g. a multi-factor authentication challenge, a query for user entitlements, or user profile transformation logic).

![Auth0 Rules](https://fusebit.io/blog-interview-auth0-rules.png 'Auth0 Rules')

### Historically, was there a breakthrough improvement in your integration story that had the most impact?

It was allowing customers to write their code and run it in a sandbox on our servers. As opposed to just exposing webhooks, this approach removed the need for hosting, deployment, management, etc. We have the equivalent of an "Excel Macro" that runs on our servers in a secure, scalable way.

> Enabling our server to be extended through code allowed our field organization - sales engineers, support, etc. - to deliver on customer requirements without being tied to the product roadmap.

Over time, as we learn more about what our customer and field teams are building, we add common patterns and solutions to the core product.

### What challenges remain in your integration story today?

One ongoing challenge is deciding what gets "in the box" and what remains as an "exercise for the reader." Another is perception. When a customer asks for a specific integration that is not in the gallery, and we deliver it using our code extensibility features, it is sometimes perceived as "not supported."

### Any words of wisdom for a SaaS vendor implementing their integration story today?

As we did at [Auth0](https://auth0.com/), I believe that...

> ...successful SaaS companies need to embrace integrations because no app exists in isolation.

A code-based integration, while more complex to implement, is the most powerful because of the flexibility only code can offer. In the early days of a company, it is usually better to cast a wide net and remain open to anything customers might want to do, even if it is completely outside of what you originally designed the product for. In later stages, you can specialize, normalize, and package as something becomes recurrent and proven. But especially in the beginning, I would suggest remaining as open as possible.
