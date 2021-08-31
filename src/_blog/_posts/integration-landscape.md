---
post_title: Did You Make the Right Call with Building Your Integration Story?
post_author: Yavor Georgiev
post_author_avatar: https://fusebit.io/yavor.png
date: '2019-08-19'
post_image: https://fusebit.io/blog-integration-landscape-main.png
post_excerpt: In the not-too-distant past, the only way for a SaaS company to provide integrations with other tools and services...
post_slug: integration-landscape
tags: ['post', 'popular']
post_date_in_url: true
---

In the not-too-distant past, the only way for a SaaS company to provide integrations with other tools and services was to dedicate a portion of their development team to building out the relevant know-how and infrastructure. Technical challenges aside, this work is frequently a distraction from building the core feature set of the SaaS product, and likely does not leverage the team's unique domain skills. Fortunately, the landscape has shifted over the last few years and SaaS developers now have a slew of options, in addition to building integrations in-house. Similar to how Stripe provides a managed service to handle payments, an *integration platform* enables the customer or SaaS provider to easily set up the necessary integrations. Just as Stripe lets developers avoid having to learn the details of payments processing, integration platforms abstract away the underlying (frequently tedious) authentication and data exchange protocols. [This article](https://blog.hubspot.com/marketing/ipaas-guide) provides a great primer on the space.

In the [2019 version of its enterprise integration platform report](https://www.gartner.com/en/documents/3907109/magic-quadrant-for-enterprise-integration-platform-as-a-), Gartner references 17 major players, while also defining the space fairly narrowly.

> If you consider niche players, as well as the roughly 1-2 new solutions that come out every month, you are faced with a choice between dozens of providers, not to mention the option to build in-house based on open-source projects. Making the right choice that balances upfront cost, long-term operational pain, and flexibility can be a daunting task.

From the perspective of a SaaS provider, whether you are considering an integration story, or you have already invested in one, here are some of the factors you should consider.

### Business Risk

Frequently integrations are the technical implementation of a strategy of building an ecosystem around your product or forging a new key partnership. As a decision maker, you can rarely be certain at the onset of these efforts, whether they will ultimately work out. At the same time, staffing an integration team and developing the required skillsets can be a multi-month project, frequently wrought with false starts and technical risk. In cases like these, where the payoff on your integration investment is uncertain, it's generally unwise to burn through expensive internal development resources. An integration platform player can be a great choice here, given the quick implementation timeframe and low cost compared to staffing up a team. This approach allows you to quickly test the potential of partnerships or ecosystem effects, with a relatively quick time to market, without unnecessarily straining your engineering budget.

### Differentiation

Another important consideration here is your product's strategic differentiation. Integrations are frequently a table-stakes feature that your customers expect, so your product can seamlessly fit into their existing workflows and tool chains. At the same time, integrations are rarely your team's core competency where you want to acquire deep expertise.

> Factoring in economies of scale, it is almost impossible for your in-house integration team to produce a superior solution to what integration platform players offer out of the box, on a dollar-for-dollar basis.

These dynamics usually favor a buy not build outcome. Unless integration is your bread-and-butter, and you have the budget and determination to build and evolve your integrations engineering team over a 3-5 year timeframe, you are likely better off leveraging an integration platform, at least in the short term.

### User Experience

Most integration platform players exist as stand-alone tools and a user needs to create a separate account in order to set up an integration between two SaaS products. If your integration is for internal use, and your team is the customer (for example flowing marketing data from Typeform to Mailchimp), this may be acceptable. However if your customer is the end user of the integration (flowing data from your SaaS to Mailchmp), that can become problematic. The added friction of dealing with a third-party solution may discourage your customers from creating the integration in the first place, which reduces the stickiness of your own solution. In addition, introducing another company to the business relationship with your customer may present a challenge when closing sales and contention over your customer's spend. In the [words of Benoit Lheureux, VP at Gartner](https://searchcloudcomputing.techtarget.com/feature/Why-SaaS-application-integration-requires-new-strategies-tools):

> “Redirecting your customers to a third-party for integration solutions when integration is a requirement in every IT project of substance is falling short of meeting your customer requirements… SaaS providers should have bitten the bullet and given their customers integration capabilities, rather than forcing customers to buy them from a third party.”

Fortunately, this doesn't mean that you need to abandon integration platforms altogether; many vendors provide **embedded white-label solutions** that become a seamless part of your own SaaS product, don't require a separate account, and are basically indistinguishable from your own code to your customers.

### Integration Complexity and Versatility

Every SaaS product is unique, and frequently the specifics of the use-case determine the complexity of integrations. In some simple cases (send a Slack notification or email when something happens in the SaaS), the integrations can be fairly straightforward, but as the data exchange gets more complex, so do the integrations. Examples include mapping and transforming data between systems, getting data from multiple sources, communicating with custom or legacy APIs, customer-specific customizations, etc.

> While integration platforms are generally quite powerful, frequently there is a "functional cliff" where the out-of-the box functionality might not support more advanced use cases.

This can be particularly painful if the integration platform was chosen without careful prior analysis, and the functionality gap is discovered only after implementation is already mostly complete, leaving you with an incomplete solution. Certain integration use cases may not even easily lend themselves to implementation using an integration platform, or may have performance and throughput requirements that make the integration platform cost-prohibitive. It's cases like these that might justify the development of in-house expertise and careful selection of underlying technology stack, or the investment in a special-purpose integration platform that supports your unique requirements. For example, some platforms are purely no-code solutions where customization is limited to the few built-in options that the developer anticipated, with no ability to support custom requirements. Other integration platforms support low-code and code-based extensibility that lets users fill in the last mile of integration, which the platform may not support ouf the box.

[Fusebit](https://fusebit.io/) is a highly-customizable embedded integration platform, focused on supporting custom integration requirements. We talk to SaaS customers every day, experience the breadth of integration needs, and help steer companies toward the right solution, even if it is not our own product. If you are struggling with the integration story you've already chosen, or you're about to make a decision, we are always happy to help.


