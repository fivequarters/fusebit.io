---
post_title: API Metering for Express Apps Using BigQuery
post_author: Tomasz Janczuk
Post_author_avatar: tomek.png
date: '2022-03-18'
post_image: api-metering-express.jpg
post_excerpt: This post introduces Express middleware that allows you to start sending HTTP API metering data from your app to BigQuery in under ten minutes.
post_slug: api-metering-analytics-express
tags: ['post', 'developer tools', 'node.js']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/api-metering-express.jpg
posts_related:
  [
    'api-metering-and-analytics-for-early-stage-startups',
    'dynamic-utm-tags',
    'run-every-nodejs-version-in-lambda',
  ]
---

In the previous blog post, [API Metering and Analytics for Early Stage Startups](https://fusebit.io/blog/api-metering-and-analytics-for-early-stage-startups/), I wrote about a simple yet flexible HTTP metering and analytics solution that uses BigQuery and Data Studio. This post will introduce the [@fusebit/apimeter](https://github.com/fusebit/apimeter) project, which provides an Express middleware you can use to capture API metering information from your Node.js app in BigQuery. You can add it to your app in less than ten minutes to derive insights from your API usage.

## Enable API Metering in Your Express App

The [@fusebit/apimeter](https://github.com/fusebit/apimeter) project on Github contains detailed setup instructions for Google Cloud and Express. After you have pre-created the necessary BigQuery table and obtained the Google service account credentials, enabling metering in your app is as simple as adding the _apimeter_ middleware.

First, add the `@fusebit/apimeter` module to your app:

```bash
npm install --save @fusebit/apimeter
```

Then in your app, add the following:

```javascript
const app = require("express")();
const { apimeter } = require("@fusebit/apimeter");

app.use(apimeter({
  projecId: "apimeter",
  dataset: "dwh",
  table: "apicalls",
  credentials: require(‘{path-to-the-google-service-credentials-file}.json’),
}));
```

See [@fusebit/apimeter](https://github.com/fusebit/apimeter) to explain the various options you can pass to the middleware.

And that’s it! Once you run your app and HTTP API calls start coming in, metering data will be captured in the BigQuery table nearly instantaneously. You can run arbitrary SQL queries against it using the Google Cloud Console for BigQuery:

![API Metering in BigQuery](blog-api-metering-bigquery.png 'API Metering in BigQuery')

If you want to create visual reports from this data, a great place to start is Google’s [Data Studio](https://datastudio.withgoogle.com/). It is free to use and integrates natively with BigQuery. It is easy to create custom histograms or visual reports highlighting a particular aspect of your API usage:

![API Metering solution for startups](blog-metering-solution.png 'API Metering solution for Startups')

![API Metering analytics for startups](blog-metering-stats.png 'API Metering analytics for Startups')

Here is a great tutorial for [visualizing BigQuery data in Data Studio](https://cloud.google.com/bigquery/docs/visualize-data-studio) you can check out.

## What is Fusebit?

[Fusebit](https://fusebit.io) is a code-first integration platform that helps developers add integrations to their apps. It is code- and API-centric, hence the importance of HTTP API metering for us.

Fusebit is a platform for developers by developers. Follow us on Twitter [@fusebitio](https://twitter.com/fusebitio) for more great developer content, and check out other cool OSS projects at [github.com/fusebit](https://github.com/fusebit).
