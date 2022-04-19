---
post_title: Send HubSpot Companies to Slack!
post_author: Liz Parody
post_author_avatar: liz.png
date: '2021-12-15'
post_image: blog-hubspot-to-slack-main.png
post_excerpt: There are hundreds of data integrations you can do between HubSpot and Slack. One of them is to send the number of HubSpot companies to a Slack channel.
post_slug: send-hubpsot-companies-to-slack
tags: ['post', 'integrations']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-hubspot-to-slack-social.png
---

There are hundreds of data integrations you can do between HubSpot and Slack. One of them is to send the number of HubSpot companies to a Slack channel.

With just a few steps and lines of code, you can easily create it!

1. Click <a class="cta_small" href="https://manage.fusebit.io/make/slack-send-message+hubspot-crud-companies">Install the integration</a> to get started
2. Create an account or login to Fusebit
3. You will be redirected to the Fusebit web editor with already most of the code you need. ![HubSpot Slack Snippet](blog-hubspot-to-slack-snippet.png "HubSpot Slack Snippet")
4. Now, let’s fetch HubSpot companies, we can do this with one line of code: 
`const companies = await hubspotGetCompanies(ctx);` <br>
in line 16 (inside `integration.router.post`)
5. Send the new message to Slack with <br>
`await slackSendMessage(ctx, `You have ${companies.length} companies in HubSpot`)` <br>
in line 19 (or any other message of your preference).
6. In addition to sending the message directly within Slack you can also send it in the response body. Change what’s inside of the `ctx.body` to `companies: companies.length` and that’s it!

**Run the Integration**

Click on `Run` and authorize your Slack account and HubSpot account.

![HubSpot Slack Run Integration](blog-hubspot-to-slack-run.png "HubSpot Slack Run Integration")

And you will receive the slack message below with the number of companies you have in HubSpot.

![HubSpot Slack Run Integration](blog-hubspot-to-slack-result.png "HubSpot Slack Run Integration")

You can also do a similar process to search your HubSpot contacts, send slack notifications (in a private or public channel), search for a new company, and other HubSpot Slack Integration.

## Before you go…

Fusebit allows you to integrate HubSpot CRM with multiple platforms, including Google Sheets, Microsoft Teams, GitHub, and also create tasks from external platforms, fetch deals assigned to a team member, receive HubSpot Notifications in real time, send HubSpot conversations to Slack, and many other integrations with the power of code.
