---
post_title: Customize Linear’s Slack Notifications
post_author: Lizz Parody
post_author_avatar: liz.png
date: '2021-12-14'
post_image: blog-linear-and-slack-main.png
post_excerpt: Create the flexible and customizable integrations between Linear and Slack using Fusebit.
post_slug: customize-linear-slack-notifications
tags: ['post', 'integrations']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-linear-slack-social-card.png
---

As a software developer, you can build flexible and customizable integrations between Linear and Slack using Fusebit. These integrations can be as complex as summarizing the status and updates of all the Linear issues in your Slack workspace or as simple as sending a congratulations message in Slack when you complete a new issue in Linear.

For example, receiving the following Slack message:

![Linear and Slack notification](blog-linear-slack-notification.png 'Linear and Slack notification')

(If instead of Linear you use GitHub or GitLab, you can go to the last section).

You or your engineering team can run this integration by clicking below:

<a class="cta_large" href="https://api.us-west-1.on.fusebit.io/v2/account/acc-f64569d3c8c14166/subscription/sub-1431c8fd3dc14cbe/integration/linear-slack-notification/api/service/start">Run the integration</a>

## How does the integration work?

First, [sign up or login](https://manage.fusebit.io/) to your Fusebit account and click on the “New integration” button.

![Linear and Slack new integration](blog-new-integration.png 'Linear and Slack new integration')

You can change the integration name and Slack connector name with just one click on "Create."

![Linear and Slack connector](blog-linear-slack-connector.png 'Linear and Slack connector')

In the "connectors" column, click on the "Add new" button to add the Linear connector (or "Link existing" if you already have a Linear connector).

Now you will be able to see both Slack and Linear connectors.

![Linear and Slack both connectors](blog-linear-slack-both-connectors.png 'Linear and Slack both connectors')

Click "Edit" in the middle column to change the logic of your integration and then paste the following code:

```javascript
const { Integration } = require('@fusebit-int/framework');

const integration = new Integration();

const slackConnector = 'slack-connector';
const slackChannel = 'liz-linear-bot';

integration.event.on('/:componentName/webhook/:eventtype', async (ctx) => {
  if (
    ctx.params.eventtype === 'Issue.update' &&
    ctx.req.body.data.data.state.name === 'Done'
  ) {
    const slackClient = await integration.service.getSdk(
      ctx,
      slackConnector,
      ctx.req.body.installIds[0]
    );
    const result = await slackClient.chat.postMessage({
      text: `Congratulations, ${ctx.req.body.data.data.assignee.name} for completing ${ctx.req.body.data.data.title} issue!`,
      channel: slackChannel,
    });
  }
});

module.exports = integration;
```

In line 5, you will see the `slack-connector` you created in the previous step, and in line 7, you will see the webhook that will listen to the status on Linear when it is "Done." The `slackClient.chat.postMessage` will post your congratulations `text` in a specific `channel` in your Slack account. The channel can be public or private.

You will need to access Linear and Slack API. Click `Run` in the upper left corner and complete the login flow, where you will need to authorize both apps.

![Linear and Slack authorization](blog-linear-slack-authorization.png 'Linear and Slack authorization')

### Configure your Linear connector

To see the **configuration of your Linear connector**, click on `linear-connector` in the Fusebit portal:

![Linear and Slack, linear configuration](blog-linear-slack-linear-configuration.png 'Linear and Slack, configuration')

Here you can find `OAuth2 Redirect URL` and `Webhook URL`. You will need those in the following steps.

Now, go to your Linear app. In the upper left corner, click `Workspace settings`.

![Linear and Slack workspace settings](blog-linear-slack-workspace.png 'Linear and Slack workspace settings')

Click on `API` and `Create new` to create a Linear app.

![Linear and Slack API](blog-linear-slack-linear-api.png 'Linear and Slack API')

Fill out the information. Here is where you paste the `Callback URLs` and the `Webhook URL` you copied in the steps above. Ensure you have checked the `issues` checkbox and enabled the public visibility of the application and the Webhooks.

![Linear and Slack config](blog-linear-slack-config.png 'Linear and Slack config')

Finally, click on `Create` on Linear.

Now you will see the Client ID and the Client secret. Copy them.

![Linear and Slack client id](blog-linear-slack-client-id.png 'Linear and Slack client id')

In the **configuration of your Linear connector**, paste the Client ID and the Client secret from the previous step.

![Linear and Slack connector configuration](blog-linear-slack-conector-config.png 'Linear and Slack connector configuration')

## Run the Integration

Finally, when you or somebody on your team completes a Linear issue, you will see a congratulations message on a Slack channel! You can go beyond and customize the Linear-Slack integration as you want, creating common Slack alerts, automated tasks, or the workflow of your preference.

<a class="cta_large" href="https://api.us-west-1.on.fusebit.io/v2/account/acc-f64569d3c8c14166/subscription/sub-1431c8fd3dc14cbe/integration/linear-slack-notification/api/service/start">Run the integration</a>

### Looking for more integrations?

If you are a developer looking to create flexible and powerful integrations using other SaaS platforms or tools, check out [Fusebit](https://fusebit.io/) and follow us on [Twitter](https://twitter.com/fusebitio)!
