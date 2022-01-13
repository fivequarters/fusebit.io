---
post_title: Make your DevOps Team Happy with this PagerDuty + Discord Integration
post_author: Shehzad Akbar
post_author_avatar: shehzad.jpg
date: '2021-12-23'
post_image: blog-pagerduty-discord-main.png
post_excerpt: Integrating Slack and HubSpot can be challenging. In this blog post you can learn how to create the exact integration that you want.
post_slug: pagerduty-discord-integration
tags: ['post', 'integrations']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-pagerduty-discord-main.png
---

PagerDuty has incredible support for their Slack integration, but if your team collaborates mainly in Discord, then you’re sadly out of luck. 

So, we built out a PagerDuty integration for Discord users -- one that gets you started quickly and is fully customizable to your needs.

**Let’s see the integration in action!**

![PagerDuty Discord Integration](https://fusebit.io/assets/images/blog/blog-pagerduty-discord-gif.gif)

**Try it out now!**

1. [Install the bot](https://api.us-west-1.on.fusebit.io/v2/account/acc-f64569d3c8c14166/subscription/sub-1431c8fd3dc14cbe/integration/pagerduty-discord-bot/api/service/start 'Install the bot CTA_SMALL') for free.
2. You will need to authorize access to your Discord server and PagerDuty account.
3. In the Discord server, type the “/pd create incident” command followed by the title and description of the incident you wish to create. You will be asked to identify the service you want to attach this incident to.
4. Done! You created an incident in PagerDuty through this Discord bot

**What could you do with this integration?**

Our goal is to show you how easy it is to use Fusebit and build a bot that’s as powerful and feature rich as the Slack Integration, but for Discord. 

In this blog post, you will learn how to build an interactive Slash Command for a Discord bot that lets users create a new incident in real-time within PagerDuty, giving you full control of what action is performed and how it responds to users. 

We’ll start you off with the first slash command, and you can add more, customizing it as you need. Once you have it running, you may wish to customize it to your needs to really supercharge your incident management response times, for instance - you may want to have PagerDuty immediately message the on-call individual in Discord and then create a dedicated channel with a pre-determined group of users to coordinate the troubleshooting and resolution.

You can do this using Fusebit! 

Read on in the next section to learn how. 

If you have questions at any point, don’t hesitate to ask us directly from the chat box in the bottom right corner of your screen!

## Create New Integration

First, [sign up to Fusebit for free](https://manage.fusebit.io/?key=e2e-pagerduty-discord-bot). 

Click on the **PagerDuty Discord Bot** integration.Click on “Create”.

![PagerDuty Discord Integration](blog-pagerduty-discord-integration.png "PagerDuty Discord Integration")

Go through the onboarding tutorial, which will take you through the different pieces of your Integration dashboard and place you right into the Fusebit Editor. If you don’t see the tutorial, you can click “Launch Tutorial” on the top right to get started.

## Test the Integration

To demonstrate how to retrieve data from PagerDuty and send it to Discord, we mocked out a simple ‘test’ endpoint that you can invoke right from inside the editor.

If you followed the tutorial, you may already have executed it. 

As this is an integration that uses both Discord and PagerDuty, you will need to authenticate against both before successfully running this integration for the first time.

![PagerDuty Discord Integration](blog-pagerduty-discord-auth.png "PagerDuty Discord Integration") 

While authenticating, choose a PagerDuty account that you want to send & receive information from and choose a Discord server and channel that you want to receive updates on.

Once you have successfully authorized both services, you will receive a message in your selected discord channel alerting you how many incidents have been triggered in the last 7 days.

![PagerDuty Discord Integration](blog-pagerduty-discord-bot.png "PagerDuty Discord Integration") 

You will also receive a message in your console letting you know that the message was successfully delivered to Discord.

In the test endpoint, we reference pagerdutyClient and discordClient. These are the SDK clients used to invoke the respective services. Because of Fusebit magic, those objects are already supplied with the right credentials (such as API Keys and API Tokens), based on the authorization you completed earlier.

```javascript
  const pagerdutyClient = await integration.tenant.getSdkByTenant(ctx, pagerDutyConnector, ctx.params.tenantId);
  const discordClient = await integration.tenant.getSdkByTenant(ctx, discordConnector, ctx.params.tenantId);
```

## Enabling listening to Slash Commands from Discord
So far, we’ve tested this Integration from inside Fusebit using the Run button with limited permissions. You will need to set up your own Discord App to perform some of the more advanced actions such as posting messages through a Bot, registering your own Slash Commands or listening to events through a webhook URL.

For this integration to work, you will need to configure your own discord application and bot with the following scopes: `applications.commands`,`identify`, ‘incoming.webhook’ `bot` and set the bot permissions=2147486720

[Follow our developer guide](https://developer.fusebit.io/docs/discord#creating-your-own-discord-app) to see how to set up your own Discord App and Bot.


You will need to go to the Integration Installs tab and delete any existing Installs after switching over to your own Discord application, as you will have to re-authenticate.
## Walking Through the Code
In this Integration, there are three main actions to consider:

Configuring & Registering a Discord Slash Command
Listening to & Responding to a Discord Slash Command 
Retrieving Information from PagerDuty

### Configuring & Registering a Discord Slash Command
#### Configure your Slash Command
In lines 34 - 70, you can define the structure of the slash command you want to expose to your Discord App users. Modify any of these as you need to.You can learn more about the shape [here](https://discord.com/developers/docs/interactions/application-commands#slash-commands). 

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

Once you are done configuring your Slash Command, Discord allows you to also register your Slash Commands to a specific guild as well as globally. This can be helpful for testing your commands before publishing them globally to all application users. 

You can simply register your Slash Command to your specific guild by running the <code>router.post('/api/tenant/:tenantId/:guild/slash-command'</code> endpoint in line 73 directly from the Run button.  If you need to find your Guild ID, [here’s a quick guide](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).

![PagerDuty Discord Integration](blog-pagerduty-discord-run.gif "PagerDuty Discord Integration") 

If you wish to register your Slash Command globally for all users of your Integration, you can run the <code>router.post('/api/tenant/:tenantId/slash-command'</code> endpoint instead. 

### Listening to & Responding to a Discord Slash Command 
#### Listening for Slash Commands

Nothing to do here! If you configure your app correctly, the Integration will automatically listen for Slash Commands from servers where your app was authenticated against.

Look for the <code>integration.event.on('/:componentName/webhook/:eventType')</code> endpoint in line 105 to follow this.
Responding to Slash Commands
Discord sends an Application ID & Message Token that can be used to track a series of interactions for the same message and send follow up messages to the Discord user.  

In this specific Slash Command, we first receive an interaction and then send back a follow-up message for more information until we have all the details required. 

Look through lines 116 - 180 to see how we have handled the follow up messaging flow. You will likely want to abstract this as you add more custom Slash Commands of your own! 

### Retrieving Information from PagerDuty

In lines 121 - 129, we retrieve the services that the authenticated user has under their PagerDuty account. 

```javascript
    const pdServices = await pagerdutyClient.get('/services');
    const serviceDetails = pdServices.data.services.map((service) => ({
      label: service.name,
      value: JSON.stringify({
        title: incidentTitle,
        description: incidentDescription,
        serviceid: service.id,
      }),
    }));
```

In lines 155 - 170, we create a PagerDuty incident with the information received from the Discord user. 

```javascript
      const createdIncident = await pagerdutyClient.post('/incidents', {
        data: {
          incident: {
            type: 'incident',
            title: values.title,
            service: {
              id: values.serviceid,
              type: 'service',
            },
            body: {
              type: 'incident_body',
              details: values.description,
            },
          },
        },
      });
```

Done! You should now have a good understanding of how to add your own Discord Slash Commands and configure them to work with PagerDuty. 

**Pro Tip:** You can also add more Connectors such as Github, Linear, etc., and work directly with their REST APIs within the same Integration.

If you have questions, reach out directly to us through the chat box on the bottom right of your screen!

### Before you go…
If you are looking to create flexible and powerful integrations using other platforms, check out [Fusebit](https://fusebit.io/), and follow us on [Twitter](https://twitter.com/fusebitio)!