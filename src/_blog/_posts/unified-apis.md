---
post_title: Unified APIs for Messaging, Accounting, CRM, and Beyond
post_author: Tomasz Janczuk
post_author_avatar: tomek.png
date: '2022-07-07'
post_image: unified-api-main.png
post_excerpt: Using unified APIs for classes of systems can accelerate your integration strategy, but watch out for these common pain points.
post_slug: unified-apis
tags: ['post', 'integrations']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'bots-hooks-extensions',
    'interview-with-scott-willeke-smartsheet-director-product',
    'interview-with-eugenio-pace-auth0-ceo',
  ]
---

There are many choices involved in selecting the right integration strategy for your application. One of them is deciding whether to directly integrate with target systems like Slack, Discord, or Microsoft Teams, or whether to use an intermediary.

Integration intermediaries (brokers) often offer _unified APIs_ - a single API and data model to communicate with a class of systems. Using a unified API enables you to quickly add integrations to many of the platforms your customers rely on. However, this often happens at the cost of flexibility which may prevent you from implementing the specific integration logic your customers need.

In this post, I talk about a win-win strategy that allows you to reap the benefits of using a unified API without the loss of fidelity with the individual target APIs you need.

## How do Unified APIs Work?

Unified APIs create domain-specific abstractions over classes of systems. For example, a unified API for messaging may provide a single mechanism to send a message to Slack, Discord, or Microsoft Teams. A unified API for accounting can support creating a new invoice in Xero or QuickBooks with a single call. A unified API for CRM may provide a simple way of creating new contacts or leads in HubSpot, Salesforce, or Pipedrive.

![How Do Unified APIs work?](unified-api-1.png 'How Do Unified APIs work?')

Unified APIs achieve this by generalizing the data model of a specific domain. The data model is then exposed over a single set of APIs your application can interact with. The unified API implementation takes care of mapping the generalized data model back and forth between the specific data models of individual target platforms. For example, a unified representation of an invoice will be mapped to a Xero or QuickBooks invoice, and a unified representation of a message to a Slack or Discord markup for sending messages.

When using unified APIs, your application never communicates directly with the specific target system like HubSpot, Salesforce, or Pipedrive. The communication always goes through the intermediary that performs the data and protocol mapping.

## What Are the Benefits of Using Unified APIs?

The primary benefit of using unified APIs is time to market for adding new integrations. If you offer CRM integrations, it is inevitable your customers or sales team will ask you to support a range of systems in this category, for example HubSpot, Pipedrive, or Salesforce.

With unified APIs, adding support for one automatically enables many. Your engineering team can learn just a single API and data model to add integrations to an entire class of systems in your app in a similar time it would take them to directly support a single target system. Instead of slowly grinding through your backlog of Slack, Discord, and Microsoft Teams integrations, you can support all your customer messaging needs by using a unified API for messaging.

Another benefit of unified APIs is the reduction of maintenance costs of your integrations. Since you rely on a broker when communicating with specific target systems, it is the broker's responsibility to keep track of any changes to the data model or protocol of individual target systems like HubSpot, Salesforce, or Pipedrive, and react to them as necessary. Ideally, the broker can make the needed adjustments without requiring any changes to your code and without maintenance downtime.

## What Are the Challenges of Using Unified APIs?

Given the benefits of using unified APIs, why isn't everybody using them? The primary reason is the loss of fidelity with target system APIs which may prevent you from offering the exact integrations your customers need.

Unified APIs often take the least-common-denominator approach to provide a common abstraction over a class of systems. While you may be able to send messages to Slack, Discord, Microsoft Teams, WhatsApp, Twitter, or Telegram that have normal, bold, and cursive text in them, you may not be able to attach customized tiles, action cards, or attachments that are only specific to one of the systems the API aspires to abstract.

![What Are the Challenges of Using Unified APIs?](unified-api-2.png 'What Are the Challenges of Using Unified APIs?')

The lack of fidelity with target APIs is usually more pronounced and painful when implementing B2B integrations, as these systems tend to offer rich configuration capabilities. If your customer is using Salesforce or HubSpot, they are very likely to have created custom fields or otherwise customized their instances in ways that draw outside the lines of the unified API abstractions.

When faced with those situations, you are at the mercy of the unified API provider, their roadmap, timelines, and willingness to support your scenario. More often than not, given a sufficiently valuable prospect, you will find yourself writing a one-off, custom solution outside of the unified API just to close the deal. Each of those exceptions will have you question the wisdom of choosing the unified API integration approach in the first place.

## Unified APIs Done Right - Buy then Build

There is a way to get most of the benefits of using a unified API without exposing yourself to the risk of not being able to efficiently satisfy some of your customers’ integration requirements. You want a solution that supports a breadth of target systems out of the box while giving you the option to enhance or modify the implementation if needed. In other words, the right strategy is _Buy then Build_.

Having control over the shape of the data model and the mapping to the target systems enables you to make the unified API work for you. It is a _universal API_ that you can _make your own_. The end results presents a universal view of a specific domain, like accounting or messaging, or CRM, but one that makes sense in the context of your own application as the only user of that API. This leaves you in control of the shape of the API and enables you to efficiently support changing requirements, possibly to close new, exciting sales leads.

![Unified APIs Done Right - Buy then Build](unified-api-3.png 'Unified APIs Done Right - Buy then Build')

But once you make changes to the implementation of the unified API you bought, what is the benefit compared to just integrating your app with the target systems directly? The unified API is an important concept in your app that allows you to achieve separation of concerns on multiple levels leading to improved efficiency at scale.

From the engineering standpoint, you can largely decouple the core engineering workload from the integration workload. In most situations, your integration team can add support to a new customer relationship platform like HubSpot to an existing unified API for CRM that includes Salesforce and Pipedrive without any involvement of the core engineering team. From the organizational standpoint, managing core and integration workloads separately is made easy. Given the well-defined technical interface, you can offshore the work on the unified API while keeping the core engineering of your app in-house.

Starting from an existing unified API and modifying its implementation accelerates your time to market compared to building dedicated, native integrations from scratch. There are many iPaaS solutions that support embedded integration scenarios and contain the right developer tools and features to support fine-tuning a unified API implementation in-house. From handling authentication and authorization to target systems, seamless scalability, security, and reliability, to out-of-the-box connectors - these can all speed up your time to market when building your own unified API.

When evaluating available options, don't forget the one reason you decided to build a unified API yourself - to remain flexible and able to respond to your customers' changing requirements. Look for a platform that provides an adequate level of flexibility for developers.

## About Fusebit

At [Fusebit](https://fusebit.io), we live and breathe integrations. Our developer-friendly integration platform embraces code-first philosophy to support ultimate flexibility in addressing complex integration scenarios. The platform solves the generic integration challenges and supports creating unified APIs uniquely optimized for your own application and customer needs.
