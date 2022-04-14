---
post_title: How To Add Slash Commands to Your Discord Bot
post_author: Shehzad Akbar
post_author_avatar: shehzad.png
date: '2022-01-19'
post_image: discord-slash-commands-main.png
post_excerpt: Slash Commands are an extremely powerful way to provide rich interactivity for members of your Discord server, all you have to do is type “/” and you're ready to use your favorite bot.
post_slug: discord-slash-commands
tags: ['post', 'integrations']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/discord-slash-commands-main.png
---

According to the Verge, “[Discord is quietly building an app empire of bots](https://www.theverge.com/2021/11/17/22787018/discord-bots-app-discovery-platform)” and they’ve recently added Slash Commands as a cornerstone of their bot and messaging infrastructure.

Slash Commands are an extremely powerful way to provide rich interactivity for members of your Discord server, all you have to do is type “/” and you're ready to use your favorite bot. You can easily see all the bot’s commands, input validation, and error handling help you get the command right the first time.

## What will I learn in this blog post?

In this blog post, I'll walk you through how to configure, register and handle Slash Commands for your own Discord bot through Fusebit. To get started, you will need to get two housekeeping items out of the way.

First, create a Fusebit account below and keep this blog post open in another tab.

[Create Free Fusebit Account](https://manage.fusebit.io/?key=discord-slash-commands&utm_source=fusebit.io&utm_medium=referral&utm_campaign=blog&utm_content=discord-slash-command 'Create Fusebit Account CTA_LARGE'). 

Second, you will need to set up your own Discord App and Bot. [Follow our developer guide](https://developer.fusebit.io/docs/discord#creating-your-own-discord-app) to see how to set one up and configure it for Fusebit.

**For this integration to work, you will need to configure your own discord application and bot with the following scopes: `applications.commands`,`identify`, `incoming.webhook`, `bot` and set the bot permissions=2147486720**

Now that those items are out of the way, there are two main steps to building a custom Discord slash command bot:

1. Configure & Register a Discord Slash Command
2. Listen for & Respond to a Discord Slash Command 

Let’s get started! 

## How To Test the Integration

To demonstrate how to send a message to a channel through the Discord API using channel webhooks, we mocked out a simple ‘test’ endpoint that you can invoke right from inside the editor.

You will need to login to your Discord before successfully running this integration for the first time. Once you have successfully authorized, you will receive a message in the Discord channel you selected to receive incoming webhook messages from.

![discord slash commands](discord-slash-result.png 'discord slash commands')

You will also see a message in your console letting you know that the message was successfully delivered to Discord.

![discord slash commands server with-shadow](discord-slash-server.png 'discord slash commands server')

In the test endpoint, we reference a discordClient. 

```javascript
  const discordClient = await integration.tenant.getSdkByTenant(ctx, discordConnector, ctx.params.tenantId);
```

This is the SDK client used to invoke the Discord endpoints. Because of Fusebit magic, those objects are already supplied with the right credentials (such as API Keys and API Tokens), based on the authorization you completed earlier.

## Configure & Register a Discord Slash Command

### How To Configure your Slash Command 

Slash Commands are typically one level, but Discord enables developers to make more organized and complex groups of application commands that can be one level deep within a group. Learn more about this through the Discord Developer Portal [here](https://discord.com/developers/docs/interactions/application-commands#slash-commands).

In this blog post, we will walk through how to register a single Slash Command only and you can do that by using the `configureSlashCommand()` function. 

In this example, we are using ‘command’ as the command name, along with parameterOne and parameterTwo as the command options, you will retrieve these values later in this tutorial. 

```javascript
function configureSlashCommand() {
  const command = {
    name: 'command',
    description: 'Command that gets triggered',
    type: 1,
    options: [
      {
        name: 'parameterOne',
        description: 'First parameter of the Command',
        type: 3,
        required: true,
      },
      {
        name: 'parameterTwo',
        description: 'Second parameter of the Command',
        type: 3,
        required: true,
      },
    ],
  };
  return command;
}
```

Learn more about the different option types [here](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type). 

### How To Register your Slash Command

Once you are done configuring your Slash Command, Discord allows you to also register your Slash Commands as guild commands as well as globally to all users. This can be helpful for testing your commands locally before making them available to everyone. 

You can simply register your Slash Command to your specific guild by running the <code>router.post('/api/tenant/:tenantId/:guild/slash-command'</code> endpoint in line 47 directly from the Run button.  

If you need to find your Guild ID, [here’s a quick guide](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).

![discord slash commands](discord-slash-gif.gif 'discord slash commands')

If you wish to register your Slash Command globally for all users of your Integration, you can run the <code>router.post('/api/tenant/:tenantId/slash-command'</code> endpoint instead. 

## Listen for & Respond to a Discord Slash Command 
### How To Listen for Slash Commands

Nothing to do here! If you configured your app correctly through the developer docs, Fusebit will automatically listen for Slash Commands from servers where your app was authenticated against.

Look for the <code>integration.event.on('/:componentName/webhook/:eventType')</code> endpoint in line 75 to follow this.

**Responding to Slash Commands**

Discord sends an Application ID & Message Token that can be used to track a series of interactions for the same message and send follow up messages to the Discord user.  

```javascript
integration.event.on('/:componentName/webhook/:eventType', async (ctx) => {
  const {
    data: { data: event, application_id, token },
  } = ctx.req.body;

  const [parameterOne, parameterTwo] = event.options;
  const responseMessage = `You sent me ${parameterOne.value} and ${parameterTwo.value} as your parameters!`;

  // Read more about interactions here: https://discord.com/developers/docs/interactions/receiving-and-responding
  await superagent
    .post(`https://discord.com/api/v8/webhooks/${application_id}/${token}`)
    .send({ content: responseMessage });
});
```

In the code here, we’re extracting the parameters that we had specified as name values in the options while configuring the Slash Command and sending back a response in the form of a Discord message object.

Done! You should now have a good understanding of how to add your own Discord Slash Commands for your bot and to reply with the appropriate context!. 

**Pro Tip:** You can also add more Connectors such as Github, Linear, etc., and work directly with their REST APIs within the same Integration.

## Other Discord Bot Integration Examples

With Fusebit, it is easy to build a Discord bot that integrates deeply with any of our available connectors. Here are a few blog posts showing how to build specific integrations with advanced configurations and options such as context menus, rich embedded messages and more!

[PagerDuty + Discord Integration](https://fusebit.io/blog/pagerduty-discord-integration/)

### How To Get More Discord and Developer Tips

If you are looking to create flexible and powerful integrations using other platforms like Slack, Salesforce and GitHub, check out [Fusebit](https://fusebit.io/) to get started, and follow us on Twitter [@fusebitio](https://twitter.com/fusebitio) for our daily developer posts.
