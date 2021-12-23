---
post_title: PagerDuty Discord Integration
post_author: Shehzad Akbar
post_author_avatar: shehzad.jpg
date: '2021-12-23'
post_image: blog-slack-bot-hubspot-main.png
post_excerpt: Integrating Slack and HubSpot can be challenging. In this blog post you can learn how to create the exact integration that you want.
post_slug: pagerduty-discord-integration
tags: ['post', 'integrations']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-slack-bot-hubspot-social.png
---

PagerDuty has incredible support for their Slack integration, but if your team collaborates mainly in Discord, then they’ve left you out to dry. 

So, we built out a PagerDuty integration for Discord users -- one that gets you started quickly and is fully customizable to your needs.

**What could you do with this integration?**

Our goal is to show you how easy it is to use fusebit and replicate the Slack Integration, but for Discord. 

In this blog post, you will learn how to build an interactive slash command for a Discord bot that lets users create a new incident in real-time within PagerDuty, giving you full control of what action is performed and how it responds to users. 

We’ll start you off with the first slash command, and you can add more, customizing it as you need. 

**Let’s see the integration in action!**

![placeholder](placeholder.png 'placeholder')

**Try it out now!**

1. [Install the bot](placeholder) for free.
2. You will need to authorize access to your Discord server and PagerDuty account.
3. In the discord server, type the `/pd create incident` command followed by the title and description of the incident you wish to create. You will be asked to identify the service you want to attach this incident to.
4. Done! You created an incident in PagerDuty through this Discord bot

Once you have the example running, you may wish to customize it to your needs, including modifying PagerDuty details or displaying the data.. 

To really supercharge your incident management response times, you may want to send custom notifications or receive alerts to solve problems faster. You can do this using Fusebit! 

Read on in the next section to learn how. 

If you have questions at any point, don’t hesitate to ask us directly from the chat box in the bottom right corner of your screen!

## Create New Integration

First, [sign up to Fusebit for free](placeholder). 

Click on the **PagerDuty Discord Bot** integration. Here, you can also customize the Discord and PagerDuty connector names. Click on “Create”.

![placeholder](placeholder.png 'placeholder')

Go through the onboarding flow, which will take you through the different pieces of your integration dashboard and take you to the editor. If you don’t see it, you can click ‘launch tutorial’ on the top right to get started.

## Test the Integration

![placeholder](placeholder.png 'placeholder')

We can invoke any endpoint inside this integration right from inside the editor. To demonstrate how to retrieve data from PagerDuty and send it to Discord, we mocked out a simple ‘test’ endpoint.

Go ahead and hit the run button to get started.

![placeholder](placeholder.png 'placeholder')

As this is an integration that uses both Discord and PagerDuty, you will need to authenticate against both before successfully running this integration. 

While authenticating, choose a PagerDuty account that you want to send & receive information from and choose a Discord server and channel that you want to receive updates on.

Once you have successfully authorized against both services, you will receive a notification in your discord channel alerting you how many incidents have been triggered in the last 7 days.

![placeholder](placeholder.png 'placeholder')

You will also receive a message in your console letting you know that the message was successfully delivered to Discord.

![placeholder](placeholder.png 'placeholder')

We can do this by leveraging the power of our Discord & PagerDuty clients.The API Key and API Tokens are tied to the Connector and stored along with the credentials of the authorizing user in an “Integration Install” entity, so we always have the right account credentials being used.

## Enabling listening to Slash Commands from Discord
So far, we’ve tested this integration from inside Fusebit using the Run button. This is because you will need to set up your own Discord App to perform some of the more advanced actions, such as registering your own slash commands or listening to events through a webhook URL.

1. [Follow our developer guide](https://developer.fusebit.io/docs/discord#creating-your-own-discord-app) to see how to set up your own Discord App and Bot.
    a. For this integration to work, make sure to configure the following scopes: `application.commands`,`incoming.webhooks`,`identify`
2. You will need to go to the Integration Installs tab and delete any existing installs after switching over to your own Discord application, as you will have to re-authenticate.

## Walking Through the Code
In this integration, there are three main actions to consider:

1. Configuring & Registering a Discord Slash Command
2. Listening to & Responding to a Discord Slash Command 
3. Retrieving Information from Pagerduty

### Configuring & Registering a Discord Slash Command
#### Configure your Slash Command
In lines 34 - 67, you can define the structure of the slash command you want to expose to your Discord App users. Modify any of these as you need to.You can learn more about the shape [here](https://discord.com/developers/docs/interactions/application-commands#slash-commands). 

```javascript
function slashCommandConfiguration() {
  const command = { name: 'pd',description: 'PagerDuty Commands',
    options: [
      {name: 'incident',description: 'Incident related commands', type: 2,
        options: [
          { name: 'create', description: 'Create new PD Incident', type: 1,
            options: [
              { name: 'title', description: 'Incident Title', type: 3,required: true, },
              { name: 'description', description: 'Short Description of the Issue', type: 3, required: true,
              },],},],},],};
  return command;
}
```
#### Register your Slash Command

Once you are done configuring your Slash Command, you can simply register your slash command by running the endpoint in line 71.  

Discord allows you to scope your Slash Commands to a specific guild. This is helpful for testing your commands before publishing them globally to all application users. 

To help with this. We’ve provided you with an endpoint that will give you the list of guild IDs for the user you authenticated with, in lines 95 - 105.

```javascript
router.get('/api/tenant/:tenantId/guilds', integration.middleware.authorizeUser('install:get'), async (ctx) => {
  const discordClient = await integration.tenant.getSdkByTenant(ctx, connectorName, ctx.params.tenantId);
  const guilds = await discordClient.user.get(`users/@me/guilds`);

  const guildDetails = guilds.map((guild) => ({
    guildName: guild.name,
    guildID: guild.id,
  }));
  ctx.body = guildDetails;
});
 ```

### Listening to & Responding to a Discord Slash Command 
#### Listening for Slash Commands

Nothing to do here! If you configure your app correctly, the integration will automatically listen for slash commands from servers where your app was authenticated against.

![placeholder](placeholder.png 'placeholder')

#### Responding to Slash Commands
In this specific Slash Command, we first receive an interaction and then send back a follow-up message for more information until we have all the details required. 

Discord sends an Application ID & Message Token that can be used to track a series of interactions for the same message and send follow up messages to the Discord user.  

Look through lines 119 - 182 to see how we have handled the follow up messaging flow. You will likely want to abstract this as you add more custom slash commands of your own! 

### Retrieving Information from Pagerduty

In lines 44 - 53, we retrieve the services that the authenticated user has under their PagerDuty account. 

![placeholder](placeholder.png 'placeholder')

In lines 76 - 91, we leverage the final values we have received from all the slash bot interactions and create a PagerDuty incident. 

![placeholder](placeholder.png 'placeholder')

Done! You should now have a good understanding of how to add your own Discord Slash Commands and configure them to work with PagerDuty. 

**Pro Tip:** You can also add more Connectors such as Github, Linear, etc., and work directly with their REST APIs within the same integration.

If you have questions, reach out directly to us through the chatbox on the bottom right of your screen!

## Before you go…
If you are looking to create flexible and powerful integrations using other platforms, check out [Fusebit](https://fusebit.io/), and follow us on [Twitter](https://twitter.com/fusebitio)!

**Notes**

Rip off what they do in Slack, but do it for Discord instead. 

https://support.pagerduty.com/docs/slack-integration-guide

**Available Slash Commands**
- Creating On-Demand Slack Channels
- Create a Slack Channel from a PagerDuty Incident
- Create a Slack Channel from a Slack Incident Notification
- Create an Incident Trigger Slack Workflow
- Use an Incident Trigger Slack Workflow

**Available Slash Commands**
Once the updated integration has been installed, new slash commands will be available. These slash commands can be run from Slack channels that are configured with PagerDuty:

- `/pd help`: Displays a help message with a list of these available slash commands.
- `/pd trigger`: Trigger a new PagerDuty incident within the Slack interface.
- `/pd unlink`: Unlink your current Slack user from your PagerDuty user.
- `/pd invite @ [Slack User Name]`: Invites the specified Slack user as a responder to your PagerDuty account.
- `/pd oncall`: View who is on call for a PagerDuty service.
- `/pd insights`: Configure the PagerDuty Analytics Slack integration to send recurring Insights to Slack.


