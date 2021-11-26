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

Integrating [Slack](https://slack.com/) and [HubSpot](https://www.hubspot.com/) can be challenging. HubSpot has an [built-in bot for Slack](https://www.hubspot.com/slack) that allows you to create a task from a Slack message and associate it with a contact, company or deal in HubSpot, it also allows you to receive notifications in Slack when there is new events or activities in HubSpot, and allows slash commands.

**But sometimes the built-in bot capabilities aren’t sufficient, or you want to create a HubSpot Slack bot for your specific task or workflow, for example:** 

- If you want to lookup HubSpot contacts and companies, *but* customize the Slack response message to include more fields, including custom fields that are not supported by the built-in bot like location, job title, last activity date and more
- Lookup a contact in multiple systems and provide a single view, for example, CRM data from HubSpot with activity data from Mixpanel
- Create a HubSpot contact directly from Slack
- Get HubSpot statistics printed to a Slack channel for your coworkers to see
- Generate a weekly report in Slack of HubSpot leads 

In these cases, you face a significant challenge: you need to figure out how to connect the two APIs, listen for notifications from Slack, execute actions in HubSpot, and send responses back to Slack. In addition, you need to figure out authentication and where to host your solution. 

**That’s where Fusebit comes in handy and makes this task 10x easier**. In this blog post, you will learn how to create a Slack bot that responds to a specific command and returns the information you need from HubSpot, giving you full control of what data is fetched and how it is displayed. 

Let’s say that you would like to get immediate information about your customers or users by running just one command in Slack. For example, if you run “lookup user@email.com” on Slack and receive relevant information about that user from HubSpot. It could be basic data such as full name, email, company, date created, or more detailed information like marketing contact status, location, or annual company revenue. 

![Slack Bot in HubSpot](blog-slack-bot-hubspot-output.png "Slack Bot in HubSpot")

Try it out yourself! 

1. [Click here](https://api.us-west-1.on.fusebit.io/v2/account/acc-f64569d3c8c14166/subscription/sub-1431c8fd3dc14cbe/integration/hubspot-slack-bot/api/service/start) to install the bot 
2. You will need to authorize access to your HubSpot instance and Slack workspace
3. Add the bot to a Slack channel, by clicking the drop-down next to the channel name, clicking **Integrations**, and then selecting **Add an App** and then finding “HubSpot Bot”
4. Type the “lookup” command followed by the email address of a HubSpot contact, for example “lookup joe@example.com”.

Once you have the example running, you may wish to customize it to your needs, including modifying HubSpot search or how the data is displayed. Read on to learn how. 

# Connect to HubSpot

First, you should [sign up to Fusebit for free](https://fusebit.io/#signup). 

In the [Fusebit Management Portal](https://manage.fusebit.io/?utm_source=fusebit.io&utm_medium=referral&utm_campaign=slack-hubspot-blog&utm_content=connect), click “New Integration” button as you can see in the image below:

![New Integration Slack](blog-slack-bot-hubpost-new-integration.png "New Integration Slack - HubSpot")

You will see a new window where you can select the platform you want to do an integration, select HubSpot, change the name of the integration (in this case Demo), you can also customize the HubSpot connector name (in this case hubspotConnector) and click on the button “Create”.

![HubSpot Connector](blog-slack-bot-hubspot-connector.png "HubSpot Connector")

Now you have a simple integration connected to HubSpot.

# Connect to Slack 
We now need to connect the Integration to Slack so we can send the results from HubSpot to Slack. Click on “Add New” in your Integration to add a Slack connector.

![Add new Slack connector](blog-slack-bot-hubspot-add-new.png "Add new Slack connector")

Choose Slack and click on the “Create” button.

![Slack Connector](blog-slack-bot-hubspot-slackConnector.png "Slack Connector")

On the right column on the Portal, you will be able to see your HubSpot and Slack connector.

![Slack and HubSpot Connector](blog-slack-bot-hubspot-both-connectors.png "Slack and HubSpot Connector")

Now you are ready to modify the business logic of the Integration to perform the HubSpot lookup and send the results to Slack.

### Add your Integration logic
You can edit the code of the Integration by hitting the Edit button in the middle.

![Edit Integration](blog-slack-bot-hubspot-edit.png "Edit Integration")

The integration logic is written in JavaScript and runs within a Node.js environment. For more information, see [Integration Programming Model](https://developer.fusebit.io/docs/integration-programming-model).

Paste in the following code in the editor.

```javascript
const { Integration } = require('@fusebit-int/framework');

const integration = new Integration();
const router = integration.router;

router.post('/api/tenant/:tenantId/test', integration.middleware.authorizeUser('install:get'), async (ctx) => {

  const slackClient = await integration.tenant.getSdkByTenant(ctx, 'slackConnector', ctx.params.tenantId);
  const hubspotClient = await integration.tenant.getSdkByTenant(ctx, 'hubspotConnector', ctx.params.tenantId);

  const contact = await lookupAndPost(
    ctx.req.body.email,
    slackClient.fusebit.credentials.authed_user.id,
    slackClient,
    hubspotClient);

  ctx.body = contact;

});

integration.event.on('/:componentName/webhook/event_callback', async (ctx) => {
  const slackClient = await integration.service.getSdk(ctx, 'slackConnector', ctx.req.body.installIds[0]);
  const hubspotClient = await integration.service.getSdk(ctx, 'hubspotConnector', ctx.req.body.installIds[0]);

  // Parsing for "lookup <mailto:contact@fusebit.io|contact@fusebit.io>"
  const regex = new RegExp('(lookup.*<mailto:)([a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+)', 'g');
  const result = regex.exec(ctx.req.body.data.event.text);
  if (result) {
    await lookupAndPost(result[2], ctx.req.body.data.event.channel, slackClient, hubspotClient);
  }
});

async function lookupAndPost(email, slackChannel, slackClient, hubSpotClient) {
  const filter = { propertyName: 'email', operator: 'EQ', value: email };
  const sorts = JSON.stringify({ propertyName: 'createdate', direction: 'DESCENDING' });
  const properties = ['createdate', 'firstname', 'lastname', 'email', 'website', 'city', 'country', 'company', 'jobtitle'];
  const limit = 1;
  const after = 0;

  const result = await hubSpotClient.crm.contacts.searchApi.doSearch({
    filterGroups: [{ filters: [filter] }],
    sorts: [sorts],
    email,
    properties,
    limit,
    after,
  });
  const contact = (result.body.results[0] || {}).properties;

  if (contact) {
    slackClient.chat.postMessage({
      text: `
      :slightly_smiling_face: Name: ${contact.firstname} ${contact.lastname}
      :email: <mailto:${contact.email}|Email:> ${contact.email}
      :date: Date created: ${contact.createdate}
      :flag-us: Location: ${contact.city}, (${contact.country})
      :computer: Job title: ${contact.jobtitle}
      :100: Company: ${contact.company}
      :link: Website: ${contact.website || 'not found'}
    `,
      channel: slackChannel,
    });
  } else {
    slackClient.chat.postMessage({ text: 'Contact not found',  channel: slackChannel });
  }
  console.log('contact', contact);
}

module.exports = integration;

```

`hubspotClient` and `slackClient` in line 8 and 9 create pre-configured clients with credentials necessary to communicate with your HubSpot and Slack account. The `lookupAndPost` function in line 11 will look for the email you provided on slack and create a contact.

### Test the Integration
We can invoke the `test` method of this integration right from inside the editor to see how this works, but we first need to configure a test request passing the HubSpot email to look up:

![Edit Integration](blog-slack-bot-hubspot-config.png "Edit Integration")

In the Payload section, add the email you want to look for in JSON format.

![Edit Integration](blog-slack-bot-hubspot-runner.png "Edit Integration")

You are now ready to hit Run to try it out!

![Edit Integration](blog-slack-bot-hubspot-run.png "Edit Integration")

You will need to authenticate before being able to successfully run this integration. Choose a HubSpot account and authorize Fusebit to connect to it.

![Edit Integration](blog-slack-bot-hubspot-authenticate.png "Edit Integration")

You will also need to authorize access to a Slack workspace, so you can see the results of the HubSpot search. 

![Edit Integration](blog-slack-bot-hubspot-authenticate2.png "Edit Integration")

Once you have authorized HubSpot to connect with Fusebit, you will see the contact you configured in the Run button retrieved and its details shown in the Console output.

![Edit Integration](blog-slack-bot-hubspot-console.png "Edit Integration")

You should also see a message in Slack with the search result. 

![Edit Integration](blog-slack-bot-hubspot-final.png "Edit Integration")

Feel free to modify the `hubSpotClient.crm.contacts.searchApi.doSearch` (line 40) and  `slackClient.chat.postMessage` (line 51) calls in the `lookupAndPost` method to customize what your bot does. If you want to have custom properties, you can change it in the line 36 in `properties`.

### Enabling search from Slack
So far we’ve tested this integration from inside Fusebit using the Run button. However we really want to be able to start the search from inside Slack by sending a “lookup” command. 

1. In the Fusebit portal, select the Slack connector. You will need to create your own Slack application to be able to receive Slack events. [Follow our developer guide](https://developer.fusebit.io/docs/slack#receiving-events-from-slack-event-api-support) to see how.
2. You will need to go to the integration Installs tab and delete any existing installs after you switch over to your own Slack application, and you will have to re-authenticate.
3. When a message is received from Slack, the `integration.event.on` on line 21 is invoked to receive the data. In line 26 we have a regex which will extract the email from the information received from Slack ("lookup %3Cmailto:contact@fusebit.io|contact@fusebit.io%3E"), if there is a result, it will look up that email and post it in the Slack channel. Modify this logic to change the command the bot responds to or to collect additional parameters.
4. Don’t forget to make sure the bot is added to the Slack channel where you are sending commands, otherwise your events will not be received. 

### Before you go…
If you are looking to create flexible and powerful integrations using other SaaS platforms, check out [Fusebit](https://fusebit.io/), and follow us on [Twitter](https://twitter.com/fusebitio)!

