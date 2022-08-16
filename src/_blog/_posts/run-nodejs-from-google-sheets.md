---
post_title: Run Node.js from Google Sheets
post_author: Tomasz Janczuk
post_author_avatar: tomek.png
date: '2022-01-24'
post_image: google-sheets-addon-banner.png
post_excerpt: Import data from any API or data source to Google Sheets using Node.js, NPM, and Fusebit Connectors.
post_slug: run-nodejs-from-google-sheets
tags: ['post', 'developer tools', 'integrations', 'node.js']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/twitter-google-sheets-addon.png
posts_related:
  [
    'upload-google-spreadsheet-charts-to-slack',
    'nodejs-https-imports',
    'run-every-nodejs-version-in-lambda',
  ]
---

Google Sheets is a Swiss Army knife of data processing, but it is only as good as the data you can get into it. What can you do when a CSV export from your source-of-truth system is not available and the Ctrl-C and Ctrl-V keys on your keyboard have worn off? There is Apps Script, but it only goes so far. There are dedicated add-ons, but they are not always available for the systems you care about or do not do exactly what you need.

## Node.js, NPM, and Fusebit Connectors in Google Sheets

Enter [Fusebit Add-On for Google Sheets](https://developer.fusebit.io/docs/google-sheets-addon). Fusebit enables you to use Node.js, NPM, and Fusebit Connectors to quickly connect to any API or data source with low friction and the flexibility of code.

![Get COVID-19 Data into Google Sheets](google-sheets-addon-covid.gif 'Get COVID-19 Data into Google Sheets')

With Fusebit, you can import data from any API serverlessly and not worry about security, servers, scalability, deployments, and all that overhead that has prevented you from automating data import into Google Sheets before.

All you need is code.

## What can you do with the Fusebit Add-On for Google Sheets?

To start, you can get data into Google Sheets from any Node.js code you write and using any NPM module you want. Which is to say, you can access any system and API out there, including those speaking protocols other than HTTP, like databases.

In short, you can do everything.

Get contacts from **Salesforce**? Check. Query data in **MongoDB**? Check. Import companies from **HubSpot**? Check. Import records from **MySQL**? Check. Download unpaid invoices from **QuickBooks**? Check. Get results of an analytics query in **PostgresSQL**? Check...

You get the idea.

But wait, it is about to get better.

## And then, there were Fusebit Connectors

Fusebit Connectors solve the problem of authorizing access to the target systems you need and let you cut right to writing code that matters.

You don't need to worry about the idiosyncrasies of OAuth between API providers, refreshing your access tokens, or finding the best SDK to talk to a specific API. We've done this for you so you can focus on making the right API calls and manipulating your data.

Say you want to import companies from HubSpot into Google Sheets. With Fusebit Connectors, this is the Node.js code you would write:

```javascript
async (ctx) =>
  (await hubspotGetCompanies(ctx)).map((c) => [
    c.properties.name,
    c.properties.domain,
  ]);
```

To get to a result like this in your Google Spreadsheet:

![Import data from HubSpot to Google Sheets](google-sheets-addon-hubspot.png 'Import data from HubSpot to Google Sheets')

Short line of code for a developer, giant leap for the growth team.

## How do I get started?

Go to [Getting Started with Google Sheets](https://developer.fusebit.io/docs/google-sheets-addon) for a step-by-step walk through. You will be writing Node.js code to call from your Google Sheet in no time.

Once you become a pro, you can automate future spreadsheets by installing the Fusebit Add-On from the _Extensions | Get add-ons_ menu in your Google Sheet, or directly from the Google Marketplace.

## What is Fusebit?

[Fusebit](https://fusebit.io) is a code-first integration platform that helps developers integrate their applications with external systems and APIs. The Fusebit Add-On for Google Sheets demonstrates just a little bit of what the platform can do - to learn more, [get Fusebit for a spin](https://developer.fusebit.io/docs/getting-started).
