---
post_title: A Better Slack Bot for HubSpot
post_author: Liz Parody
post_author_avatar: liz.png
date: '2021-11-25'
post_image: blog-slack-bot-hubspot-main.png
post_excerpt: Integrating Slack and HubSpot can be challenging. In this blog post you can learn how to create the exact integration that you want.
post_slug: slack-bot-hubspot-integration
tags: ['post', 'integrations']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-slack-bot-hubspot-social.png
---

Integrating [Slack](https://slack.com/) and [HubSpot](https://www.hubspot.com/) can be difficult for developers. 

HubSpot has an [built-in bot for Slack](https://www.hubspot.com/slack) **, but sometimes the built-in bot capabilities aren't flexible enough for developers.**.

In this blog post, you will learn how to code a Slack bot that responds to a specific command and returns the information you need from HubSpot, giving you full control of what data is fetched and how it is displayed. 

**What could you do with this integration?**

Let’s say that you would like to get information about your users by running just one command in Slack. For example, if you run “lookup user@email.com” on Slack and receive relevant information about that user from HubSpot. 

**Let’s see the integration in action!**

![Slack Bot in HubSpot](blog-slack-bot-hubspot-output.png "Slack Bot in HubSpot")

One item to note about the “lookup” keyword is that it can be placed anywhere on a slack message. If you are having a conversation with a team member, you can say for example “Hey @user2 can you please reach out to customer Acme, here's the contact info lookup acme@email.com”, the team member will receive the information needed from that user.

**Try it out now!**

1. [Install the bot](https://api.us-west-1.on.fusebit.io/v2/account/acc-f64569d3c8c14166/subscription/sub-1431c8fd3dc14cbe/integration/hubspot-slack-bot/api/service/start) for free.
2. You will need to authorize access to your HubSpot instance and Slack workspace.
3. Add the bot to a Slack channel, by clicking the drop-down next to the channel name, clicking **Integrations**, and then selecting **Add an App** and then finding “HubSpot Bot”.
4. Type the “lookup” command followed by the email address of a HubSpot contact, for example “lookup joe@example.com”.

Once you have the example running, you may wish to customize it to your needs, including modifying HubSpot search or how the data is displayed. Read on to learn how. 

# Create New Integration

First, [sign up to Fusebit for free](https://manage.fusebit.io/?key=e2e-hubspot-slack-bot). 

Click on the **HubSpot Slack Bot** integration. You can customize the Slack and HubSpot connector name. Click on “Create”.

![HubSpot Slack Bot](blog-slack-bot-hubspot-create.png "New Integration Slack - HubSpot")

You can edit the code of the Integration by hitting the Edit button in the middle.

![Edit Integration](blog-slack-bot-hubspot-edit.png "Edit Integration")

## Test the Integration
We can invoke the `test` method of this integration right from inside the editor to see how this works, but we first need to configure a test request passing the HubSpot email to look up:

![Configuration slack bot](blog-slack-bot-hubspot-config.png "Configuration slack bot")

In the Payload section, add the email you want to look for in JSON format.

![Configure Runner](blog-slack-bot-hubspot-runner.png "Configure Runner")

You will need to authenticate before being able to successfully run this integration. Choose a HubSpot account and authorize Fusebit to connect to it.

![Authenticate HubSpot](blog-slack-bot-hubspot-authenticate.png "Authenticate HubSpot")

You will also need to authorize access to a Slack workspace, so you can see the results of the HubSpot search. 

![Authenticate Slack](blog-slack-bot-hubspot-authenticate2.png "Authenticate Slack")

You are now ready to hit Run to try it out!

![Run Integration](blog-slack-bot-hubspot-run.png "Run Integration")

Once you have authorized HubSpot to connect with Fusebit, you will see the contact you configured in the Run button retrieved and its details shown in the Console output.

![Console output](blog-slack-bot-hubspot-console.png "Console output")

You should also see a message in Slack with the search result. 

![Final Output](blog-slack-bot-hubspot-final.png "Final Output")

`hubspotClient` and `slackClient` in line 10 and 11 create pre-configured clients with credentials necessary to communicate with your HubSpot and Slack account. The `lookupAndPost` function in line 13 will look for the email you provided on slack and create a contact.

Feel free to modify the `hubSpotClient.crm.contacts.searchApi.doSearch` (line 54) and  `slackClient.chat.postMessage` (line 65) calls in the `lookupAndPost` method to customize what your bot does. If you want to have custom properties, you can change it in the line 40 in `properties`.

## Enabling search from Slack
So far we’ve tested this integration from inside Fusebit using the Run button. However we really want to be able to start the search from inside Slack by sending a “lookup” command. 

1. In the Fusebit portal, select the Slack connector. You will need to create your own Slack application to be able to receive Slack events. [Follow our developer guide](https://developer.fusebit.io/docs/slack#receiving-events-from-slack-event-api-support) to see how.
2. You will need to go to the integration Installs tab and delete any existing installs after you switch over to your own Slack application, and you will have to re-authenticate.
3. When a message is received from Slack, the `integration.event.on` on line 21 is invoked to receive the data. In line 28 we have a regex which will extract the email from the information received from Slack ("lookup <mailto:contact@fusebit.io|contact@fusebit.io>"), if there is a result, it will look up that email and post it in the Slack channel. Modify this logic to change the command the bot responds to or to collect additional parameters.
4. Don’t forget to make sure the bot is added to the Slack channel where you are sending commands, otherwise your events will not be received. 

### Before you go…
If you are looking to create flexible and powerful integrations using other SaaS platforms, check out [Fusebit](https://fusebit.io/), and follow us on [Twitter](https://twitter.com/fusebitio)!

