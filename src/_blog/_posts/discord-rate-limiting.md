---
post_title: 'Discord API Rate Limiting: A Troubleshooting Guide'
post_author: Nabendu Biswas
post_author_avatar: nabendu.png
date: '2022-05-06'
post_image: discord-rate-limiting.png
post_excerpt: This article provides you with the tools needed to fix any Discord API rate limiting issues that you encounter.
post_slug: discord-rate-limiting
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/discord-rate-limiting.png
posts_related:
  [
    'webhook-rate-limits-and-throttling',
    'linear-discord-slash-commands',
    'discord-slash-commands',
  ]
---

Most freely available APIs and commercial APIs have a rate limit. The rate limit's there so that hackers or bots don't abuse it, because if they send too many requests quickly, it could break the API endpoint. It can also be applied to user types, e.g., paying users usually have higher limits than free users. But sometimes, this becomes an issue for a genuine person who's developing a product [using these APIs](https://fusebit.io/blog/webhook-rate-limits-and-throttling/). 

In this post, we'll look into dealing with Discord API rate limiting from a developer's perspective. We will explore in detail two methods to solve the rate limit issue. The first method is synchronization with Redis, and the second method uses a  global request proxy. 

## What Are Rate Limits?
Discord has different rate limits for routes and discord bots. On top of that, Discord also has a global limit of fifty requests per second. The rate limits are always given on the response headers, which can be found in the developer tools section of your browser. Generally, developers hit this rate limit when their community grows and their Discord bots need to process more requests. 

The response header will look like this: 

```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1470222023
X-RateLimit-Reset-After: 1
X-RateLimit-Bucket: pass1234
```

Now let's understand what these terms mean. Here, `X-RateLimit-Limit` means the total number of requests we can make to this endpoint. The `X-RateLimit-Remaining` means the remaining requests available during the bucket time window before the limit is reset.

`X-RateLimit-Reset` gives the Epoch time when the rate limit will be reset. If you haven't heard of it, Epoch time is the universal Unix time, which is the time elapsed since Jan 1, 1970. Many computer systems and software use this time, which can be easily converted into a human-readable format. 

The `X-RateLimit-Reset-After` gives the time in seconds before our rate limit will be reset. The last thing here is `X-RateLimit-Bucket`,which is a random string given by Discord. This random string doesn't mean anything, but it keeps track of this Discord rate limit. It's a unique string, representing that the user has gotten rate-limited for their Discord channel. 

## What Happens When Rate Limits Are Exceeded?

Discord will return a 429 status code after reaching a rate limit. Your application must inspect the `X-RateLimit-Reset-After` header or `retry_after` from the body to check how long it needs to wait to retry the request.

An example response from a request being rate limited will look like the following:

```http
< HTTP/1.1 429 TOO MANY REQUESTS
< Content-Type: application/json
< Retry-After: 65
< X-RateLimit-Limit: 10
< X-RateLimit-Remaining: 0
< X-RateLimit-Reset: 1470173023.123
< X-RateLimit-Reset-After: 64.57
< X-RateLimit-Bucket: abcd1234
< X-RateLimit-Scope: user
{
"message": "You are being rate limited.",
"retry_after": 64.57,
"global": false
}
```

## What Is the Invalid Request Limit?

If a single IP address makes too many invalid HTTP requests from the browser, they're restricted from accessing the Discord API. The limit is currently set at 10,000 per 10 minutes. This is a very high number and can only be made by larger applications, which should always have logging to avoid reaching this limit. 

In the context of rate-limiting, the important status code is 429

* A 429 status can be avoided by always inspecting the rate limit, which was mentioned in the previous section.

## Handling Rate Limits for Bots

The handling of rate limits for bots depends on the bot's size. If the bot is small and created using [discord.py](https://discordpy.readthedocs.io/en/stable/), then the rate limit will automatically be handled by the bot. This library has built-in code which will never let your bot hit the rate limit. 

Problems will be more likely to happen when the bot becomes larger. At that point, we would generally split our bot into multiple processes. We need to give each route a rate limit by dividing the global rate limit and then synchronizing the route rate limit with the global rate limit. 

Below, we will learn two methods to solve the issue of rate-limiting. One is through synchronization with Redis, and the other is through a global request proxy. 

### Handling Rate Limits With Redis

We can synchronize the rate limit between processes by using a database like [Redis](https://redis.io/). Here, we store the rate limit in the shared key-value storage of Redis so that all processes know about each other's rate limit. How that works is detailed in the steps below. 
* Before the request, the process checks whether Redis contains a key that shows that the global rate limit was touched.
* This process creates a key that identifies the request route.
* It checks the time to live for the request key in Redis.
* It also checks the remaining value for the request key in Redis.
* The process waits for the time to live to be over, once the remaining value is 0.

**After Receiving Request Code 2XX**

* The process gets the rate limit information from the response headers.
* It puts the remaining value into Redis, where the time to live is the X-RateLimit-Reset-After.

**After Receiving Request Code 429**

* The process checks whether the global rate limit was reached.
* If the global rate limit was reached: Process sets a key in Redis that indicates that the global rate limit was reached.
* If the per-route limit was reached: Process sets the remaining value for the request route in Redis to 0.
Ultimately, if a process will hit the rate limit, another process can start to take the further requests. 

![handling rate limits](handling-rate-limits.jpg 'handling-rate-limits')

## Handling Rate Limits With Global Request Proxy

Instead of storing a key-value pair in a Redis database, we can use a central proxy server, where all requests go through this server, and it handles the global rate limit. It can also handle the individual process rate limits. 

One of the most popular free and open-source global request proxies is called [twilight-http-proxy](https://github.com/twilight-rs/http-proxy). It will synchronize the global and individual process rate limits for us automatically. 

You can also use the reverse proxy feature of NGINX to achieve the same goal, as it allows setting of the global rate limit. The NGINX config will look like below. 

```http
limit_req_zone $proxy_host zone=global:1m rate=40r/s;
log_format discord_logs '$remote_addr [$time_local] 
$upstream_http_cf_ray $upstream_http_cf_request_id 
$upstream_cache_status $status "$request" $body_bytes_sent';

server {
    location / {
        limit_req zone=global burst=3000;
        limit_req_status 697;
        proxy_set_header Authorization "Bot your-token";
        proxy_pass https://discord.com;
        proxy_read_timeout 80;
        client_max_body_size 6M;
        access_log /var/log/discord_proxy.log discord_logs;
    }
    listen 10.0.0.6:8888;
}
```
> One of the most **popular free** and **open-source** global request proxies is called **twiight-http-proxy**

This adds the global rate limit with `limit_req_zone`, where the max body size is 6MB. An additional 2000 requests will be queued if the global rate limit of forty requests per second is reached, and a response of a 697 status code will be given to all requests. The global rate limit will never be reached, and our Discord app will work great. 

## Conclusion

In this post, we've learned about rate limit issues in the Discord API. We also learned about rate limit exceeded messages and have looked into dealing with Discord API rate limiting from a developer's perspective. We've learned about solving this issue with Redis or solving it through a central global proxy request server, with detailed steps provided for each. 

Now you should have the information and tools you need to fix any Discord API rate limiting issues that you encounter, making working with the Discord API much easier. You could work toward avoiding hitting Discord API rate limits altogether by having a `discord.py` bot for smaller communities, and using the solutions with Redis and a central global proxy server for bigger communities. 

If you enjoy this article, follow [@fusebitio](https://twitter.com/fusebitio) on Twitter for the latest developer content on Node.js, JavaScript, and APIs.

*This post was written by Nabendu Biswas. [Nabendu](https://thewebdev.tech/) has been working in the software industry for the past 15 years, starting as a C++ developer, then moving on to databases. For the past six years he’s been working as a web-developer working in the JavaScript ecosystem, and developing web-apps in ReactJS, NodeJS, GraphQL. He loves to blog about what he learns and what he’s up to.*

