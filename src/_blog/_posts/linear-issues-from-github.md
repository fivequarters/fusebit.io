---
post_title: Creating Linear issues from slash commands in GitHub!
post_author: Liz Parody
post_author_avatar: liz.png
date: '2022-01-06'
post_image: blog-linear-github-main.png
post_excerpt: In this blog post, you will learn how to create Linear issues from a GitHub comment (using slash commands).
post_slug: linear-issues-from-github
tags: ['post','integrations']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-linear-github-main.png
---

In this blog post, you will learn how to create Linear issues from a GitHub comment (using slash commands), as you can see in the image below:

**GitHub comment** - using `/linear` slash command
![GitHub Linear Integration](blog-linear-github-create-linear-issue.png "GitHub Linear Integration")

**Issue created in Linear**
![GitHub Linear Integration](blog-linear-github-linear-issue.png "GitHub Linear Integration")

This integration allows you to see, review the code, and create issues without leaving GitHub, saving you time and keeping GitHub and Linear synchronized.

Brilliant, right? Well, let's get started below on setting up this integration.

## The GitHub-Linear integration

1. Sign up or log in for a free [Fusebit account](https://manage.fusebit.io/signup)  
2. Create your first connector (github) and second connector (linear) following [this instructions](https://developer.fusebit.io/docs/adding-multiple-connectors). It should look like the image below:
![GitHub Linear Integration](blog-linear-github-two-connectors.png "GitHub Linear Integration")

3. **Modify the integration logic:** click `edit` in the middle column and you can paste the code below (for development purposes use this code as a reference, you can modify it with your preferred logic to integrate Linear and GitHub).

```javascript
const { Integration } = require('@fusebit-int/framework');
 
const integration = new Integration();
 
const router = integration.router;
 
const connectorName = 'github';
 
// Create a new GitHub issue authenticated as a GitHub App Installation
router.post('/api/tenant/:tenantId/app/:owner/:repo/issue', async (ctx) => {
 const githubapp = await integration.tenant.getSdkByTenant(ctx, connectorName, ctx.params.tenantId);
 const appClient = await githubapp.app();
 const { data: installations } = await appClient.rest.apps.listInstallations();
 
 if (!installations.length) {
   ctx.throw(404, 'This application has no installations');
 }
 
 const installation = installations.find((installation) => installation.account.login === ctx.params.owner);
 
 if (!installation) {
   ctx.throw(404, `Installation not found for account ${ctx.params.owner}`);
 }
 
 // Now you have your installation, you can request an access token to the specific installation
 // We perform all that work for you and you get back an authenticated SDK as a GitHub installation.
 const installationClient = await appClient.installation(installation.id);
 
 const { data } = await installationClient.rest.issues.create({
   owner: ctx.params.owner,
   repo: ctx.params.repo,
   title: 'Hello world from Fusebit',
 });
 ctx.body = data;
});
 
// Subscribe to events
integration.event.on('/:componentName/webhook/issue_comment.created', async (ctx) => {
  const {
   data: { comment, repository, issue, installation },
 } = ctx.req.body.data;
 const commentText = comment.body;
 console.log(commentText);
 const isLinearCommand = commentText.match(/^\/linear/g).length > 0;
 if (isLinearCommand) {
   const linearClient = await integration.service.getSdk(ctx, 'linear', ctx.req.body.installIds[0]);
   const [titlePart, description] = commentText.split('\n');
   const title = titlePart.replace('/linear', '');
   const teams = await linearClient.teams();
   const team = teams.nodes[0];
   if (team.id) {
     try {
       const { _issue } = await linearClient.issueCreate({ teamId: team.id, title, description });
       const linearIssue = await linearClient.issue(_issue.id);
       console.log(linearIssue);
       // Reply to GitHub that the issue was created on Linear
       const issueBody = `Issue created: <a href="${linearIssue.url}" target="_blank">${linearIssue.identifier}</a>`;
       const githubClient = await integration.service.getSdk(ctx, 'github', ctx.req.body.installIds[0]);
       const installationClient = await githubClient.installation(installation.id);
       if (!installationClient) {
         return;
       }
       await installationClient.rest.issues.createComment({
         owner: repository.owner.login,
         repo: repository.name,
         issue_number: issue.number,
         body: issueBody,
       });
     } catch (e) {
       console.log('Failed to create Linear Issue', e);
       throw e;
     }
   }
 }
});
 
module.exports = integration;
```
 > **Note:** Change the constant `connectorName` with the name of your own GitHub connector.

This code is open source and will allow you to create Linear issues from a GitHub comment using slash commands. Click ‘Save’, but before it runs successfully, we need to configure Linear and connect to GitHub.

## Configuring Linear
1. You will need to create a Linear app following [these instructions](https://developer.fusebit.io/docs/linear#creating-your-own-linear-app). In this example, it’s not necessary to configure webhooks support.
2. In the Fusebit Connector Configuration, change the scopes of your application to `read write`.
2. Click `Save` in both your Linear app and Fusebit portal.

## Configuring GitHub
1. In the Fusebit portal, click on your GitHub connector and `Enable Production Credentials`.
![GitHub Linear Integration](blog-linear-github-click-github.png "GitHub Linear Integration")

2. Under GitHub Configuration, copy the OAuth2 Redirect URL and webhook URL that you will need in further steps.
![GitHub Linear Integration](blog-linear-github-configuration.png "GitHub Linear Integration")

3. log in to [GitHub](https://github.com/) and click `Settings` under your profile. (You can log in with your personal account or an organization’s account). 
4. Click on Developer Settings on the left, and click on the `New GitHub App` button. 
![GitHub Linear Integration](blog-linear-github-dev-settings.png "GitHub Linear Integration")

5. Give a name and description and paste the callback URL from step #2. Ensure that the checkbox “Expire user authorization tokens” is enabled when the GitHub token expires. We will get a new token that can be replaced easily.
![GitHub Linear Integration](blog-linear-github-callback-url.png "GitHub Linear Integration")

6. Scroll down, and paste the Webhook URL under **Webhook** section in your GitHub app.
![GitHub Linear Integration](blog-linear-github-webhook-url.png "GitHub Linear Integration")

7. Under the **Repository permissions**, give `Read & write` permissions to **Issues**
![GitHub Linear Integration](blog-linear-github-permissions.png "GitHub Linear Integration")

8. In the **Subscribe to events** section, check the `Issue comment` checkbox. GitHub will notify us through webhooks when you create, edit, or delete a comment. Finally, click on **Create GitHub App**.

This will display the App ID and Client ID. Click on the `Generate a new client secret` button.
![GitHub Linear Integration](blog-linear-github-private-key.png "GitHub Linear Integration")

9. Go back to the Fusebit Portal and paste the App ID, Client ID, and Client Secret.
![GitHub Linear Integration](blog-linear-github-connector-config.png "GitHub Linear Integration")

10. It’s highly recommended to add a Webhook secret for security reasons (you can get it by running the command `openssl rand -base64 16` in your terminal or using your preferred method).

You'll need to set up your secret token in two places: Fusebit and GitHub.
Paste the secret token in **Webhook Secret from your GitHub App** in the Fusebit GitHub connector, scroll down, and click `Save`.
Paste the same token in **Webhook secret (optional)** in the webhook section in GitHub. 

If you want, you can upload a logo for your app. Click on **Save changes**
![GitHub Linear Integration](blog-linear-github-photo.png "GitHub Linear Integration")

11. Now click on **Install App** on the left, click on the **Install** green button. We are installing our GitHub app using our user. You can install it in all your repositories or select one repository.
![GitHub Linear Integration](blog-linear-github-install-app.png "GitHub Linear Integration")

12. **Getting a GitHub Private Key**: it’s necessary to generate a private key and add it to your Fusebit connector to authenticate as a GitHub installation. Go back to “General” in the Developer Settings in GitHub, scroll down, and click on “Generate a private key”. This will download a file, open it, and copy and paste it into Fusebit Connector Configuration. 
![GitHub Linear Integration](blog-linear-github-generate-key.png "GitHub Linear Integration")

Paste it in the Fusebit Connector. 
![GitHub Linear Integration](blog-linear-github-secret-key.png "GitHub Linear Integration")

To get more information about private keys, you can read in the developer docs [Authenticating with GitHub Apps](https://docs.github.com/en/developers/apps/building-github-apps/authenticating-with-github-apps).

And that’s it! You have your GitHub app configured. 

> Note: This is a list of available endpoints for GitHub Apps: [Available endpoints](https://docs.github.com/en/rest/overview/endpoints-available-for-github-apps).

 
## Run the integration

Go to the Fusebit portal and click on `Run`. Authorize GitHub and Linear.
![GitHub Linear Integration](blog-linear-github-run.png "GitHub Linear Integration")

In the GitHub repository of your choice, go to issues and create a new comment.
![GitHub Linear Integration](blog-linear-github-create-linear-issue.png "GitHub Linear Integration")

You can even create a description in a second line.
![GitHub Linear Integration](blog-linear-github-description.png "GitHub Linear Integration")

It will create a new issue in Linear like this:
![GitHub Linear Integration](blog-linear-github-title-description.png "GitHub Linear Integration")

Make sure to always include the keyword `/linear` at the beginning of the comment. 

To check that the Webhook works correctly, in your GitHub app, click on the **Advanced** button and you will see the recent deliveries of the webhook.
![GitHub Linear Integration](blog-linear-github-webhooks.png "GitHub Linear Integration")

## One Last Thing…

You can create slash commands with many applications, Asana, Git, Slack or GitHub Actions. 

There are other features you can include with the slash command and your source code, like assigning an issue, doing git rebase, including dates and more. We are excited to see in which creative ways you can use slash commands in GitHub for yourself or your community.

