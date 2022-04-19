---
post_title: Track Your Favorite Crypto Prices in Slack With This Node.js Bot
post_author: Yavor Georgiev
post_author_avatar: yavor.png
date: '2022-03-28'
post_image: blog-crypto-bot.jpg
post_excerpt: Track your favorite crypto coins and get notifications of price changes in Slack using Node.js and JavaScript
post_slug: crypto-price-tracking-bot
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/twitter-crypto-bot.png
---

Whether you're into Bitcoin, Ethereum, Tether, or any other cryptocurrency, you have to admit that keeping track of highs/lows and overall trends can influence your buy/sell trading strategy. I am a novice in the crypto space and only dabble with small amounts, so please don't take any of this as financial advice. But I was curious whether I could build a bot that would track a given coin's market price and let me know when it exceeds or dips below its 10-day moving average.

I didn't want to settle for any of the off-the-shelf solutions I found for the following reasons:

- I wanted **direct control of the data** so I can specify the exact comparison criteria and time ranges
- I wanted the flexibility to do **more sophisticated** calculations
- I want to (eventually) add the ability to make this a crypto trading bot to **automate trading** via API

Luckily, I had Fusebit at my disposal, which made this task trivial. Fusebit lets me write a small JavaScript function where I can execute my calculations and decide whether to send a notification via Slack. It also lets me connect to any public API, so I relied on [CoinAPI](https://www.coinapi.io), which lets you get market data on different crypto coins in close to real-time from different exchanges (including Coinbase, Bitfinex, and Binance) for free. Fusebit is based on Node.js, which means I can also use tons of [free JS libraries on the npm package registry](https://npmjs.org).

## Creating a simple crypto price tracking bot

First, you need to obtain a [free CoinAPI key](https://docs.coinapi.io), which you will need later in this post.

Once you have your key, sign up for Fusebit:

<a class="cta_large" href="https://manage.fusebit.io?key=e2e-crypto-slack-bot">Sign up for Fusebit for free</a>

1. Select **Slack Crypto Bot** when creating a new integration and specify the API key you obtained earlier
1. Click the **Edit** button and then **Run** once the editor loads
1. Finally, you will need to authorize access to a Slack workspace and the bot will then send you a DM with the current price for Bitcoin

![Slack message sent by bot](blog-crypto-bot-slack-message.png)

If you got this far, then congrats, everything is working! But the fun is just beginning. This bot will only run on demand (when you hit the **Run** button), so let's learn how to make this a regular check, and how to make other customizations.

## Customizing the bot

To get the bot to run regularly on a schedule:

1. Select **Configuration** in the Fusebit Editor
1. Add a similar section to the object. (Useful [reference for the `cron` string](https://crontab.guru))

```json
"schedule": [
  {
    "cron": "0 * * * *",
    "endpoint": "/check-delta",
    "timezone": "America/Los_Angeles"
  }
]
```

You may also want to check for the value of another crypto coin. Simply change the following line to a different symbol. You need to be familiar with Node.js and JavaScript to make this change.

```javascript
const ticker = 'BTC';
```

You may want to get data for multiple symbols at once, you can repeat the following lines in the source code to get data and construct a response message.

```javascript
const range = await get10dayRange(ctx, ticker);
const rate = await getRate(ctx, ticker);
const message = printTickerMessage(ticker, rate, range.high, range.low);
```

## What's next

This is just a very basic example and I'm eager to expand what this Fusebit bot can do. In particular, I'm curious if we can enable Node.js-based algorithmic trading.

What other capabilities should we add? Any cool usage examples you're willing to share? Contact us at [@fusebitio](https://twitter.com/fusebitio) on Twitter.
