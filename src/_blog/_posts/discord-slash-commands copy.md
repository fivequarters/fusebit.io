---
post_title: Linear and Discord Slash Commands
post_author: Shehzad Akbar
post_author_avatar: shehzad.png
date: '2022-01-20'
post_image: blog-linear-discord-main.png
post_excerpt: Learn how to build an interactive Slash Command for a Discord bot that lets users create a new issue in Linear.
post_slug: linear-discord-slash-commands
tags: ['post', 'integrations']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-linear-discord-main.png
---

Linear is the newest player to join the “issue management tool club” and it’s taking the dev world by storm with it’s simple interface. It doesn’t, however, have a Discord integration yet.  

So, we built one out for you -- one that gets you started quickly and is fully customizable to your needs.

**Let’s see the integration in action!**

![linear discord slash commands](blog-linear-discord-result.gif 'linear discord slash commands')

**Try it out now!**

1. [Install the bot](https://api.us-west-1.on.fusebit.io/v2/account/acc-f64569d3c8c14166/subscription/sub-1431c8fd3dc14cbe/integration/linear-discord-bot/api/service/start) for free.
2. You will need to authorize access to your Discord server and Linear account.
3. In the Discord server, type the “/linear issue create” command followed by the title of the issue you wish to create. You will be asked to identify the team you want to create this issue for.
4. Done! You created an issue in Linear through this Discord bot

**What could you do with this integration?**

Our goal is to show you how easy it is to use Fusebit and quickly build a bot that’s easily customizable and powerful at the same time.

In this blog post, you will learn how to build an interactive Slash Command for a Discord bot that lets users create a new issue in Linear, giving you full control of what action is performed and how it responds to users. 

We’ll start you off with the first Slash Command, and you can add more, customizing it as you need. Once you have it running, you may wish to customize it to your needs to really supercharge your Linear and Discord integration - for example, you may want the ability to watch for changes to a specific issue, or add comments directly to an issue from within Discord.

You can do this using Fusebit! 

Read on in the next section to learn how. 

If you have questions at any point, don’t hesitate to ask us directly from the chat box in the bottom right corner of your screen!

## Create New Integration

First, [sign up to Fusebit for free](https://manage.fusebit.io/?key=e2e-linear-discord-bot?utm_source=fusebit.io&utm_medium=referral&utm_campaign=blog&utm_content=discord-linear-integration). 

Click on the **Linear Discord Bot** integration.Click on “Create”.

![linear discord integration](blog-linear-discord-integration.png 'linear discord integration')

Go through the onboarding tutorial, which will take you through the different pieces of your Integration dashboard and place you right into the Fusebit Editor. If you don’t see the tutorial, you can click “Launch Tutorial” on the top right to get started.

## Test the Integration

To demonstrate how to retrieve data from Linear and send it to Discord, we mocked out a simple ‘test’ endpoint that you can invoke right from inside the editor.

If you followed the tutorial, you may already have executed it. 

As this is an integration that uses both Discord and Linear, you will need to authenticate against both before successfully running this integration for the first time.

![linear discord slash commands authorization with-shadow](blog-linear-discord-auth.png 'linear discord slash commands authorization')

<center>*While authenticating, choose a Linear account that you want to send & receive information from and choose a Discord server and channel that you want to receive updates on.*</center>

Once you have successfully authorized both services, you will receive a message in your selected Discord channel alerting you how many issues have been assigned to you.

![linear discord slash commands bot](blog-linear-discord-bot.png 'linear discord bot')

You will also receive a message in your console letting you know that the message was successfully delivered to Discord.

In the test endpoint, we reference linearClient and discordClient. These are the SDK clients used to invoke the respective services. Because of Fusebit magic, those objects are already supplied with the right credentials (such as API Keys and API Tokens), based on the authorization you completed earlier.

```javascript
  const linearClient = await integration.tenant.getSdkByTenant(ctx, linearConnector, ctx.params.tenantId);
  const discordClient = await integration.tenant.getSdkByTenant(ctx, discordConnector, ctx.params.tenantId);
```

## Enabling listening to Slash Commands from Discord
So far, we’ve tested this Integration from inside Fusebit using the Run button with limited permissions. You will need to set up your own Discord App to perform some of the more advanced actions such as posting messages through a Bot, registering your own Slash Commands or listening to events through a webhook URL.

1. For this integration to work, you will need to configure your own Discord application and bot with the following scopes: `applications.commands`,`identify`, `webhook.incoming` `bot` and set the bot permissions = `2147486720`

[Follow our developer guide](https://developer.fusebit.io/docs/discord#creating-your-own-discord-app) to see how to set up your own Discord App and Bot.


2. You will need to go to the Integration Installs tab and delete any existing Installs after switching over to your own Discord application, as you will have to re-authenticate.

## Walking Through the Code
In this Integration, there are three main actions to consider:

1. Configuring & Registering a Discord Slash Command
2. Listening to & Responding to a Discord Slash Command 
3. Retrieving Information from Linear

### Configuring & Registering a Discord Slash Command
#### Configure your Slash Command

In lines 26 - 57, you can define the structure of the Slash Command you want to expose to your Discord App users. Modify any of these as you need to.You can learn more about the shape [here](https://discord.com/developers/docs/interactions/application-commands#slash-commands). 

```javascript
const configureSlashCommand = () => {
  const command = {
    name: 'linear',
    description: 'Linear Commands',
    options: [
      {
        name: 'issue',
        description: 'Issue related commands',
        type: 2,
        options: [
          {
            name: 'create',
            description: 'Create new Linear Issue',
            type: 1,
            options: [
              {
                name: 'title',
                description: 'Issue Title',
                type: 3,
                required: true,
              }, ], }, ], }, ], };

  return command;
};

```
#### Register your Slash Command

Once you are done configuring your Slash Command, Discord allows you to also register your Slash Commands to a specific guild as well as globally. This can be helpful for testing your commands before publishing them globally to all application users. 

You can simply register your Slash Command to your specific guild by running the <code>router.post('/api/tenant/:tenantId/:guild/slash-command'</code> endpoint in line 62 directly from the Run button.  If you need to find your Guild ID, [here’s a quick guide](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).

![linear discord slash commands IDE](blog-linear-discord-ide.gif 'linear discord slash commands IDE')

If you wish to register your Slash Command globally for all users of your Integration, you can run the <code>router.post('/api/tenant/:tenantId/slash-command'</code> endpoint instead. 

### Listening to & Responding to a Discord Slash Command 
#### Listening for Slash Commands

Nothing to do here! If you configure your app correctly, the Integration will automatically listen for Slash Commands from servers where your app was authenticated against.

Look for the <code>integration.event.on('/:componentName/webhook/:eventType')</code> endpoint in line 100 to follow this.
Responding to Slash Commands
Discord sends an Application ID & Message Token that can be used to track a series of interactions for the same message and send follow up messages to the Discord user.  

In this specific Slash Command, we first receive an interaction and then send back a follow-up message for more information until we have all the details required. 

Look through lines 110 - 160 to see how we have handled the follow up messaging flow. You will likely want to abstract this as you add more custom Slash Commands of your own! 

### Retrieving Information from Linear

In lines 112 - 120, we retrieve the teams that the authenticated user has under their Linear account.

```javascript
    const linearTeams = await linearClient.teams();
    const teamNames = linearTeams.nodes.map((team) => ({
      label: team.name,
      value: JSON.stringify({
        title: issueTitle,
        teamid: team.id,
      }),
    }));
```

In lines 146 - 151, we create a Linear issue with the information received from the Discord user. 

```javascript
      const data = { title: values.title, description: values.description, teamId: values.teamid };

      const { _issue } = await linearClient.issueCreate(data);
      const linearIssue = await linearClient.issue(_issue.id);

      content = `Issue created: ${linearIssue.url}`;
```

Done! You should now have a good understanding of how to add your own Discord Slash Commands and configure them to work with Linear. 

**Pro Tip:** You can also add more Connectors such as Github, PagerDuty, etc., and work directly with their REST APIs within the same Integration.

If you have questions, reach out directly to us through the chat box on the bottom right of your screen!

### Before you go…
If you are looking to create flexible and powerful integrations using other platforms, check out [Fusebit](https://fusebit.io/), and follow us on [Twitter](https://twitter.com/fusebitio)!