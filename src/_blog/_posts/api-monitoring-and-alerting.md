---
post_title: Free API Health Monitoring And Alerting for Early Stage Startups
post_author: Tomasz Janczuk
post_author_avatar: tomek.png
date: '2022-03-25'
post_image: blog-api-monitoring-alerting.png
post_excerpt: Monitor the health and uptime of your HTTP API using Google Sheets, and get downtime alerts through Slack. Completely free. Set up in 2 minutes.
post_slug: api-monitoring-and-alerting
tags: ['post', 'developer tools', 'integrations']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-api-monitoring-alerting.png
posts_related:
  [
    'run-nodejs-from-google-sheets',
    'api-metering-and-analytics-for-early-stage-startups',
    'upload-google-spreadsheet-charts-to-slack',
  ]
---

You have just deployed your brand new API to the cloud. First users are showing up. You want them to have a great experience. How do you monitor the health of your API and get alerted about downtime? There are many commercial tools that offer application monitoring. In this post, I will show how you can do it yourself in under 2 minutes and completely free.

![Free API Health Monitoring And Alerting for Early Stage Startups](blog-health-1.png)

When you are done, you will have a Google Spreadsheet that checks your HTTP API every minute, shows you the current status, 24-hour history of uptime, and sends a notification to Slack when the health status of your API changes.

## Set Up Free Health Monitoring for Your API

If you want to cut to the chase, open the <a href="https://docs.google.com/spreadsheets/d/1lKSKanf28dNhSgi1dYQJ_U3q9K_jYgzd5-7l8_nBO88/edit?usp=sharing" target="\_blank">API Health Monitoring</a> Google Spreadsheet that is shared publicly, make your own copy of it (File | Make a copy), and then follow the instructions in the _Config_ sheet. You will have a working, free HTTP API monitoring solution set up in under two minutes.

Or follow the more detailed instructions below to understand how it all hangs together.

## Free Health Monitoring and Alerting with Google Sheets and Slack

The basic idea is to set up a Google Spreadsheet with a custom Apps Script triggered every minute. The script issues an HTTP GET request against the URL of your API to check for its health (2xx is good, anything else is bad - you may need to add an endpoint like this to your app). The result data is then collected in the spreadsheet itself and used to create a health dashboard and a health histogram. In addition, the Apps Script sends a notification to Slack using Slack Incoming Webhooks whenever the status of your API changes. This way you can get the 2:45 am alerts that you were so yearning for.

The good news is that we at [Fusebit](https://fusebit.io) have already created this spreadsheet for you so that you can just make a copy, configure, and profit. Let’s go!

First, open the <a href="https://docs.google.com/spreadsheets/d/1lKSKanf28dNhSgi1dYQJ_U3q9K_jYgzd5-7l8_nBO88/edit?usp=sharing" target="\_blank">API Health Monitoring</a> Google Spreadsheet, and use _File | Make a copy_ to create a copy of it in your own Google Account so that you can modify it and make it truly yours.

![Free API Health Monitoring And Alerting for Early Stage Startups](blog-health-2.png)

Notice the yellow warning about the AppsScript contained in this Google Spreadsheet. At this point, if you are concerned about us mining bitcoin on your Google Account, you should inspect the script behind this spreadsheet by going to _Extensions | Apps Script_ after you click OK to create your copy of the spreadsheet.

![Free API Health Monitoring And Alerting for Early Stage Startups](blog-health-3.png)

Once you feast your eyes on the Apps Script code, switch back to the _Config_ tab in your copy of the spreadsheet. Generally speaking, we will follow the instructions on that tab.

First, enter the URL you want to monitor in cell B10. When we are done, the Apps Script will issue HTTP GET requests to that URL every minute, and register the result. All 2xx responses are treated as success, all others indicate a failure.

![Free API Health Monitoring And Alerting for Early Stage Startups](blog-health-4.png)

Next, you need to authorize the Apps Script code you saw a moment ago to do its job. You can do it by going to the _API Health Monitoring | Authorize_ menu, and following through a number of scary-looking permission screens. This is Google trying to help you not shoot yourself in the foot with a script you obtained from an untrusted source. But, since inspecting the script you already gained confidence in its purpose and moral high standard, you can just follow through granting it all the permissions it needs. The scariest of all the screens is probably this one:

![Free API Health Monitoring And Alerting for Early Stage Startups](blog-health-5.png)

The way to get past it is to choose the _Advanced_ link on the lower left.

Once you granted the authorization, it is time to start the health monitoring process. You can do this by going to _API Health Monitoring | Start_. The Apps Script behind this command will create a trigger within your spreadsheet. The trigger calls a health monitoring function in the Apps Script every minute. The function issues the HTTP GET request against your URL, and stores the result.

Now, go back to the _Health_ tab in your spreadsheet. You should see the result of the very first health check executed against your API:

![Free API Health Monitoring And Alerting for Early Stage Startups](blog-health-6.png)

On the left, you can see the current status of the API (_Healthy_), and the timestamp of that health check. If your API is in a failed state, you will also see the duration of the current downtime period.

On the right, you can see a histogram of the API health that eventually will show the last 24 hours' worth of health checks, which is how much of the result data is retained. The example above contains just a single measurement, but once you have been running this for 24 hours, you will see a more complete picture:

![Free API Health Monitoring And Alerting for Early Stage Startups](blog-health-1.png)

Now, let’s put a cherry on top of this health monitoring solution: alerting. We will configure the spreadsheet to send Slack notifications whenever the health status of your API changes. You will receive notifications when your API starts failing, another when it recovers from a failure, and also every 5 minutes during continued downtime. (Just in case you hit a snooze button when you receive that first notification at 2:45 am).

First go to your Slack and create a <a href=”https://api.slack.com/messaging/webhooks” target=”_blank”>Slack Incoming Webhook</a> for the Slack channel where you want to receive those notifications. Then put the webhook URL in the Config!B11 cell of your spreadsheet.

![Free API Health Monitoring And Alerting for Early Stage Startups](blog-health-7.png)

And that’s it! You will now be getting your notifications delivered to Slack.

![Free API Health Monitoring And Alerting for Early Stage Startups](blog-health-8.png)

Your health monitoring and alerting tool on a shoestring is now complete. It is running in the background even if you close your spreadsheet and will send you a Slack notification when needed so that you can sleep calmly. Or not.

If you ever want to turn it off, simply delete the spreadsheet. If you want to temporarily disable it, remove the URL from Config!B10.

## What is Fusebit?

[Fusebit](https://fusebit.io) is a code-first integration platform that helps developers add integrations to their apps. We live and breathe integrations. Follow us on Twitter [@fusebitio](https://twitter.com/fusebitio) for great developer content, and check out some cool OSS projects at [github.com/fusebit](https://github.com/fusebit).
