---
layout: post.pug
post_title: Fusebit Raises Seed Round
post_author: Benn Bollay
date: "2010-01-01"
post_image: https://fusebit.io/twitter-blog-funding-announcement.png
post_excerpt: Four Rivers, a San Francisco-based firm specializing in investments in the developer tools space, led the $3.3 million round...
tags: ['post']
---

As part of Fusebit's journey towards helping SaaS companies build powerful custom integrations, we caught up with Scott Willeke, Director of Product at Smartsheet, to learn from an industry leader about his company's approach to this space. Scott was the force behind Smartsheet's Connectors product line of premium-priced integrations for Jira and Salesforce, which drove >$1M in ARR in their first year on the market, and >$2M in the second year.z

## What does Smartsheet do?

At the highest level, Smartsheet is a cloud-based platform that allows organizations of all sizes to plan, capture, manage, automate, and report on work across the business, empowering you to move faster, drive innovation, and achieve more.

At the highest level, Smartsheet is a cloud-based platform that allows organizations of all sizes to plan, capture, manage, automate, and report on work across the business, empowering you to move faster, drive innovation, and achieve more.

The capabilities align your people with your technology so your entire business can move faster, drive innovation, and achieve more.

> “What we have to recognize is that apps have become very deep and specialized (and that's a good thing), and it’s really important for us to leverage that specialization to help customers manage their work in Smartsheet.”

### What is the business value of integrations in your platform?

Last year, the typical information worker had 13 apps that they use on a regular basis. For any product to think that they are going to be the only app that an information worker uses is unrealistic. We know our customers have to work with those apps and are not in Smartsheet 100% of the time, so we add value for them by making sure that it is as seamless as possible to do so. That could mean surfacing notifications in their preferred app when something's going on in Smartsheet that they care about, or pushing work they have to manage from another application into Smartsheet.

The active rate limit monitoring determined the request will result in a 429, or…

+ A previous request with the same rate-limit-key resulted in a 429 and the retry-after value has not yet elapsed
+ If there is no other source making requests with the same rate-limit-key, the Active Informedsolution will result in zero 429s. However, even if there are other sources making requests, it won’t result in any more 429s than the Passive Informed solution. Ok, so now it seems like we have a winner–we should use an Active Informed solution, right?

Again, not so fast.

#### Auth0 Rules

**DISCLAIMER:** I worked at Auth0 between 2014-19 and focused on the serverless extensibility story from inception.

Auth0 offers a world-class identity and access management platform. Similar to Twilio, it always has had a strong developer focus - for the first two years the company’s tagline read “Identity made simple for developers”. Identity is a complex space, with most applications requiring a lot of customization and integration. In order to remove friction from the customization process, Auth0 decided to offer an embedded scripting solution almost from day one. The mechanism was called Auth0 Rules:

![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

##### Over time

The technology underlying the Auth0 Rules got more sophisticated and led to the development of Auth0 Hooks and the Auth0 Extensions, which are different ways of exposing customization and integration capabilities within the Auth0 platform. 

###### The underlying reasons for their existence remained the same, however:

1. Customers enjoyed greatly reduced barriers to entry and time to market. They were able to make the Auth0 platform do exactly what their use case required in a fraction of the time that alternative mechanisms, like webhooks, would have taken.
2. Customers enjoyed greatly reduced barriers to entry and time to market. They were able to make the Auth0 platform do exactly what their use case required in a fraction of the time that alternative mechanisms, like webhooks, would have taken.
3. Auth0 sales engineers were able to shorten the sales cycles and close more deals. Thanks to the quick time to market for customizations, the timeline of proof-of-concept delivery was substantially reduced.
4. The Auth0 platform itself enjoyed dramatically increased retention rates.

```go
func getCookie(name string, r interface{}) (*http.Cookie, error) {
	rd := r.(*http.Request)
	cookie, err := rd.Cookie(name)
	if err != nil {
		return nil, err
	}
	return cookie, nil
}

func setCookie(cookie *http.Cookie, w interface{}) error {
	// Get write interface registered using `Acquire` method in handlers.
	wr := w.(http.ResponseWriter)
	http.SetCookie(wr, cookie)
	return nil
}
```

Visionary companies like Twilio, Segment, Github, or Auth0 that invested in serverless extensibility within their platforms are better equipped to serve their customers than their competition. What are your options if you don’t want to be left behind?

| | Passive | Active |
| ----------- | ----------- | ----------- |
| Naive   | Retries any single 429s but continues to send all other requests without any throttling	 | Monitors outgoing requests and throttles when a rate limit is reached; retries any single 429s but doesn’t throttle other requests because of the 429
| Informed | Retries any 429s and will throttle all other requests that share the same rate-limit-key | Monitors outgoing requests and throttles when a rate limit is reached; throttles any requests with the same rate-limit-key if a 429 is received

In summary, the crucial mechanism to implement in a solution to mitigate rate limiting on the server is the throttling of additional requests that share the same rate-limit-key as a request that resulted in a 429 response. While it’s also possible that implementing a token bucket (or similar) mechanism to actively monitor the assumed rate limit on the server will further minimize the number of 429s that the system receives in the first place, it may not be worth the investment in infrastructure costs.