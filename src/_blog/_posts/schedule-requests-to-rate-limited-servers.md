---
layout: post.pug
post_title: Scheduling Requests
post_author: Randall Tombaugh
post_author_avatar: https://fusebit.io/randall.png
date: '2019-06-27'
post_image: https://fusebit.io/blog-scheduling-requests-main.jpg
post_excerpt: Many businesses get ahead of the competition by focusing on the core of their...
post_slug: schedule-requests-to-rate-limited-servers
tags: ['post']
---

Any modern 3rd party HTTP API that sees significant traffic will have some form of rate limiting implemented. The server might rate limit on the number of concurrent connections or on a certain number of requests over a period of time. This ensures that no one user of the API is monopolizing the usage of that API. The server might also implement load shedding, in which it will simply refuse additional connections or requests if the server is overloaded.

Either way, if you have a system that makes requests to 3rd Party HTTP APIs in any meaningful way, you’ll need a solution for dealing with the rate limiting on the server. This solution will be crucial in minimizing the number of requests that your system sends out that result in the server returning a response with an HTTP status code of `429 - Too Many Requests.`

Before looking into the possible solutions for mitigating server-side rate limiting, let’s set some context.

### Who’s Getting Rate Limited?

On the server-side, load shedding is indiscriminate, that is, it doesn’t matter who is making the request, the server can’t handle it so it will refuse it.

Rate limiting, on the other hand, is always per something: client Id, API key, IP address, etc. For the purposes of this discussion, let’s refer to this something as the `rate-limit-key`. This means, one request to a server with a given `rate-limit-key` (an API Key of 5149de9 for example) might result in a 429 response from the server because the rate limit quota for that `rate-limit-key` has been exhausted, but another request sent at the same time with a different `rate-limit-key` (an API Key of a345c98 maybe) will be successful.

Consider a CRM application that offers an integration with Google Sheets. If an end-user of the CRM application configures the integration, when a new sales lead is generated in the CRM application, the application will call out to Google to add the sales lead data into the particular Google Sheet that the end-user specified. The CRM application is making an HTTP call to Google on behalf of the end-user, therefore the request will have a `rate-limit-key` associated with the end-user and and Google will perform rate limiting on that specific end-user and not the CRM application itself.

More generally, any SaaS application that offers integrations with 3rd parties will likely be making requests to that 3rd party on behalf of their end-users. As a result of this, the SaaS application will be making requests with different `rate-limit-keys`, so this matter of a `rate-limit-key` is an important one. If events on the SaaS platform for Customer A result in a burst of HTTP calls to the 3rd party, some of those requests on Customer A’s behalf might result in 429s. At the same time a small trickle of HTTP calls to the same 3rd party, but on behalf of Customer B, Customer C, and Customer C, will all be successful.

Any solution we propose should be able to robustly handle the fact that _Customer A_ hit their rate limit quota. It should ensure that all of the HTTP calls to the 3rd party are ultimately successful for _Customer A_. And furthermore, the solution should guarantee that Customers B, C and D will not be negatively impacted by the fact that _Customer A_ was rate limited.

### Retrying HTTP 429 Responses

The HTTP specification defines a `Retry-After` response header that can indicate when a client should try again. Some 3rd parties APIs do provide this response header with a 429 response, but many do not. The expectation is that the client will properly implement a backoff retry policy with reasonable delay times. However, even if a 3rd party API does provide a `Retry-After` value, it may not be using a very sophisticated algorithm to determine that `Retry-After` value. If the server is rate-limiting using a [token bucket algorithm](https://en.wikipedia.org/wiki/Token_bucket) it might very well simply return the amount of time before the next token will be available in the bucket. This makes a certain amount sense; the reason the server returned a 429 response is because it doesn’t want to allocate resources to handle the request, so it also wouldn’t want to allocate resources to determine a more accurate `Retry-After` value.

Either way, whether the server includes a `Retry-After` response header, or the client is expected to assume a reasonable retry delay, we will assume that there is some delay value, which we will refer to as the retry-after value. The important thing to keep in mind about this retry-after value is that it will always be just a best guess; it is never a guarantee that the server will accept the request at that given time.

With all this in mind, let’s consider some possible solutions to scheduling requests against a rate-limited server.

### Some Possible Solutions

One aspect to consider is how much work the solution does to avoid receiving 429s from the server in the first place. We’ll call this the Active/Passive consideration.

**Passive Rate Limiting -** The solution simply handles 429s properly, that is, it waits the amount of time given by the retry-after value before sending a particular request a second time.

**Active Rate Limiting -** The solution handles 429s properly, but also uses a mechanism to actively monitor the rate at which it is sending requests for each `rate-limit-key` and throttles the sending of requests once that rate is reached.

There is second aspect to consider and that is what the solution does when it gets a 429 response. We’ll call this the Naive/Informed consideration.

**Naive Rate Limiting -** A single 429 is handled (retried) in isolation and does not impact any other requests

**Informed Rate Limiting -** A 429 response will throttle other requests that share the request’s `rate-limit-key` because these requests are likely going to result in 429s as well

A rate limiting solution might be either Active or Passive and either Naive or Informed, therefore we have four possible solutions for mitigating server-side rate limiting:

| | Passive | Active |
| ----------- | ----------- | ----------- |
| Naive   | Retries any single 429s but continues to send all other requests without any throttling	 | Monitors outgoing requests and throttles when a rate limit is reached; retries any single 429s but doesn’t throttle other requests because of the 429
| Informed | Retries any 429s and will throttle all other requests that share the same rate-limit-key | Monitors outgoing requests and throttles when a rate limit is reached; throttles any requests with the same rate-limit-key if a 429 is received

Let’s look at each of these solutions in turn.

### A Passive Naive Solution

First, let’s start with the *Passive Naive* solution, which is not really a solution at all. It only works well if the problem isn’t really a problem to begin with, that is, if the requests almost never hit any rate limits. If the system receives a 429 with only 0.0001% of requests, then a simple retry mechanism in code that doesn’t rely on any additional infrastructure is reasonable.

However, if there is a real need to mitigate rate limiting on the server, a *Passive Naive* solution does not adequately solve it.

Consider the case in which a large volume of requests, say 10 thousand, all with the same *rate-limit-key* are generated in a single burst. Let’s also assume that the server rate limits at 10 requests a second. As the requests are sent in quick succession, the 11th request will result in a 429 and will need to be retried after the retry-after delay. But because it is a Naive approach, the remaining 9,989 requests will still be sent and all of these requests will also result in 429s and will need to be retried. If the retry-after value is the same for all of these requests, all 9,990 requests will be sent again in a second burst. The first 10 of these retried requests will succeed, but the remaining 9,980 will result in 429s, and again will need to be retried. This process will continue such that the final request will only succeed after having been retried nearly 1000 times. And overall, about 4,995,000 requests will have been sent that resulted in 429s.

> "5 million is alot of 429 responses given that there were only 10 thousand requests to start with"

Just on the face of it, this is clearly a waste of system resources. But it is possibly much worse than that. If the burst of requests is large enough, it could easily negatively impact other customers. This is because there may be other requests in the system that have other *rate-limit-keys* that might not need to be throttled and could be successfully sent. However all the resources of the system are tied up retrying the requests of the 10K burst that continue to result in 429s.

Now, the above scenario assumed the retried requests were all retried after the same retry-after delay value. This resulted in additional bursts of retried requests. One might argue that varying the retry-after delay value would be helpful; perhaps if a random delay were added to each retry-value this was avoid those retry bursts. This would alleviate the bursts, but it still doesn’t address the heart of the problem: requests are getting sent to the server that will certainly result in a 429 because the immediately preceding request just resulted in a 429.

This is not a hypothetical argument, but a real learning from Segment’s engineering team, who has built their entire business on queuing and sending requests to 3rd parties. See the section Architecture 2: queues per destination from their [blog post](https://segment.com/blog/introducing-centrifuge/) on how their queue architecture evolved over time.

### A Passive Informed Solution

A *Passive Informed* solution is a big improvement over the Passive Naive solution. If we consider the 10K request burst scenario, that 11th request that results in the first 429 will essentially block the other 9989 requests from being sent. This means other requests in the system that don’t share the same `rate-limit-key` are not blocked. This alleviates the biggest problem with the Passive Naive solution. After the retry-after delay has elapsed, the 11th request is retried and will succeed, unblocking the other 9989 requests which are sent up until the 21 request results in a 429, and so forth. Overall, the system will send nearly 100 requests that result in 429s. This is, of course, much better than the 5 million 429s that we’d see with a *Passive Naivesolution*.

### An Active Naive Solution

Now, let’s consider an Active Naive solution. With the 10K request burst scenario, the first 10 requests would be sent to the server, but the 11th request would be delayed, because the system is actively monitoring the rate at which it is sending requests and it knows it has reached the rate limit. Other requests with different *rate-limit-keys* would then be sent until the delay for the 11th request of the burst had elapsed. The 11th through 20th requests in the burst would then be sent and the 21st request would again be throttled. This process would continue until all of the requests in the 10k burst had been sent and not a single request will have resulted in a 429 from the server. So clearly the Active Naive solution is the winner, right?

Not so fast.

The above discussion of the Active Naive solution rests on a false assumption: that the rate limit monitoring of the system is accurate. That will not be the case if the server is receiving requests from others sources that are using the same *rate-limit-key*. If we reconsider the 10K burst scenario again, but with the server receiving 50% of the request limit quota from another source, then the 6th request of the 10K request burst will result in a 429. Because the solution is Naive, it will still send the 7th through 10th requests until the active monitoring informs the system to delay. But now 5 requests resulted in a 429 and ended up in the retry queue. This is actually a similar situation to the one we considered with the Passing Naive solution, and the system will end up retrying a number of requests many times. So while at first glance it might appear that Active Naive solution is better than the Passive Informed solution, it turns out it may not be, because theActive Naive solution’s efficiency will vary greatly depending on how much of the server’s rate limit quota is being consumed by other sources.


### An Active Informed Solution

By this point it should be clear that the *Active Informed* solution will be the most efficient of the four, assuming it is properly implemented to throttle a given request if either:

The active rate limit monitoring determined the request will result in a 429, or…

+ A previous request with the same `rate-limit-key` resulted in a 429 and the retry-after value has not yet elapsed
+ If there is no other source making requests with the same `rate-limit-key`, the Active Informedsolution will result in zero 429s. However, even if there are other sources making requests, it won’t result in any more 429s than the Passive Informed solution. Ok, so now it seems like we have a winner–we should use an Active Informed solution, right?

Again, not so fast.

### Other Considerations

One thing we haven’t yet considered is the engineering costs of implementing these various solutions. The problem with any Active solution is that you need infrastructure to monitor the outgoing rate of requests. Whether this is done with a token bucket solution or some other algorithm, you will need to track state for every `rate-limit-key` in the system. If you have a large number of `rate-limit-keys`, then the amount of state you are tracking could grow quite large. The same Segment blog post as mentioned above indicates that Segment has as many as 88 thousand different `rate-limit-keys` in their system at any given time.

The advantage of the Passive Informed solution is that you only have to track state for those requests with `rate-limit-keys` that have resulted in a 429. And since hitting a rate limit and receiving a 429 is still an infrequent event, you are tracking a lot less state. (If hitting a rate limit is not an infrequent event, then you should work with the 3rd party to increase the rate quota, because no system can mitigate a constant stream of X rps when the server rate limit quota is only a fraction of that amount.) Even better still, you only need to do a “pretty good” job of tracking the `rate-limit-key` of requests that resulted in a 429. If the system is made up of 10 machines all sending out requests, and one machine gets a 429, it should track that `rate-limit-key` so as to not send more requests that will result in 429s. However, it doesn’t necessarily need to tell the other 9 machines to pause sending requests with that same `rate-limit-key`. The other machines will discover it soon enough when they get a 429 themselves. At worst, the system gets a 429 an extra nine times, but this isn’t an exponential increase in 429s across the system. And of course the state could be shared across the 10 machines if the degradation in efficiency was deemed too substantial.

### Closing Thoughts

In summary, the crucial mechanism to implement in a solution to mitigate rate limiting on the server is the throttling of additional requests that share the same `rate-limit-key` as a request that resulted in a 429 response. While it’s also possible that implementing a token bucket (or similar) mechanism to actively monitor the assumed rate limit on the server will further minimize the number of 429s that the system receives in the first place, it may not be worth the investment in infrastructure costs.




