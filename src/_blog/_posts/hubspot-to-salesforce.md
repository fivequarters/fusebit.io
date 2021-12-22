---
post_title: Import Contacts from HubSpot to Salesforce
post_author: Liz Parody
post_author_avatar: liz.png
date: '2021-12-22'
post_image: blog-hubspot-salesfoce-sync.png
post_excerpt: In this blog post, you will learn how to easily import contacts from HubSpot to Salesforce with a few clicks using Fusebit.
post_slug: contacts-from-hubspot-to-salesforce
tags: ['post', 'integrations']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-hubspot-salesfoce-social.png
---
In this blog post, you will learn how to easily import contacts from HubSpot to Salesforce with a few clicks using Fusebit.

**Contact in HubSpot**
![Contact in HubSpot](blog-hubspot-salesfoce-hubspot-contacts.png 'Contact in HubSpot')

**Contact sync in Salesforce**

![Contact in Salesforce](blog-hubspot-salesfoce-salesforce-contacts.png 'Contact in Salesforce')

## Create HubSpot and Salesforce integration
1. Sign up or log in to Fusebit
2. Click on “New Integration”. Choose HubSpot Contacts sync in the middle column, and change the integration name and the HubSpot Connector name (optional). Click on Create.
![create integration](blog-hubspot-salesfoce-fusebit.png 'create integration')
3. In the right column “Connectors”, click on `Add new`, or `Link existing` and create a Salesforce connector.
![create integration](blog-hubspot-salesfoce-connectors.png 'create integration')

As a Salesforce and HubSpot user, you can create powerful integrations between the two systems with the power of code.

Click on “Edit” in the middle column, and replace the code with:

```javascript
const { Integration } = require('@fusebit-int/framework');

const integration = new Integration();
const router = integration.router;

const hubspotConnector = 'hubspot';
const sfdcConnector = 'salesforce';

router.post('/api/tenant/:tenantId/sync', integration.middleware.authorizeUser('install:get'), async (ctx) => {
  const hubspotClient = await integration.tenant.getSdkByTenant(ctx, hubspotConnector, ctx.params.tenantId);
  const sfdcClient = await integration.tenant.getSdkByTenant(ctx, sfdcConnector, ctx.params.tenantId);
  const contacts = await hubspotClient.crm.contacts.getAll();
  await Promise.all(contacts.map(async (contact) => {
    const res = await sfdcClient.sobject('Contact').create({LastName: contact.properties.lastname, Email: contact.properties.email, FirstName: contact.properties.firstname})
  }))
  ctx.body = `Successfully performed initial import from hubSpot to SFDC.`;
});

integration.event.on('/:componentName/webhook/:eventtype', async (ctx) => {
    const hubspotClient = await integration.service.getSdk(ctx, hubspotConnector, ctx.req.body.installIds[0])
    const sfdcClient = await integration.service.getSdk(ctx, sfdcConnector, ctx.req.body.installIds[0]);
    const contact = await hubspotClient.crm.contacts.basicApi.getById(ctx.req.body.data.objectId);
    await sfdcClient.sobject('Contact').create({LastName: contact.properties.lastname, Email: contact.properties.email, FirstName: contact.properties.firstname})
});

module.exports = integration;
```

Keep in mind to change the constants `hubspotConnector`and `sfdcConnector` with your own connector name.

Now that you have both connectors and the integration logic let’s configure HubSpot and Salesforce.

## Configure HubSpot Developers
1. Go to https://developers.hubspot.com/ 
2. Log in or create an app developer account
3. In the Apps tab, click on “Create App”
4. On the `Basic info` on the left, click on `Auth` to find the Client ID and Client Secret, as you can see in the image below.
![HubSpot Dev](blog-hubspot-salesfoce-hubspot-dev.png 'HubSpot Dev')

5. Copy the Client ID and Client secret. **Go to the Fusebit portal**
    - Click on the HubSpot connector
    - Enable Production Credentials
    - Paste the Client ID and Client secret in the Fusebit Connector Configuration.
![integration configuration](blog-hubspot-salesfoce-configuration.png 'integration configuration')

6. Change the scopes so you have access to Read and Write contacts in HubSpot: `crm.objects.contacts.read crm.objects.contacts.write`.
![integration scopes](blog-hubspot-salesfoce-scopes.png 'integration scopes')

7. In the Fusebit HubSpot configuration, copy the OAuth2 Redirect URL
![integration redirect](blog-hubspot-salesfoce-redirect.png 'integration redirect')

8. Go back to auth settings inside your HubSpot app, and paste the URL in the “Redirect URL” field.
![two-way sync](blog-hubspot-salesfoce-url.png 'two-way sync')

9. In the scopes sections, check `crm.objects.contacts` Write and Read options. This will give write and read access to the HubSpot contacts in our integration setup. Click **Save** in both the HubSpot app and the Connector Configuration in Fusebit. 
This is the recommended setup, but you can explore with custom properties.
(In this section, you can select custom objects or custom fields of your preference)
![sync type](blog-hubspot-salesfoce-checkbox.png 'sync type')


### HubSpot webhooks
1. In the Connector Configuration in the Fusebit portal, copy `Webhook URL`.
![field mapping](blog-hubspot-salesfoce-webhook.png 'field mapping')
2. Go to your HubSpot app and paste it in the “Target URL” field inside Webhooks. Click on the “Create subscription” button.
![sync type](blog-hubspot-salesfoce-subscription.png 'sync type')
3. In the “Which object types?” field, select “Contact”, and in the “Listen for which events?” question, select “Created”.
4. Finally, check the “Contact” checkbox in the Event subscriptions and “Activate”, and you will finish with the HubSpot workflow.
![migration process](blog-hubspot-salesfoce-activate.png 'migration process')


## Run the Integration

Check the “Settings” button next to “Run” in the Fusebit portal to finish the setup and the integration process. And change the URL to include `sync` instead of `test`. This will allow you to begin syncing Hubspot and Salesforce contacts.
![data integration](blog-hubspot-salesfoce-config.png 'data integration')
![property sync](blog-hubspot-salesfoce-sync.png 'property sync')

Click Run.
## Connect Salesforce
1. Go to your regular HubSpot account (not HubSpot Developers), and create a new contact.
![migrate data](blog-hubspot-salesfoce-create-contact.png 'migrate data')
2. Sign up or log in with your Salesforce credentials
3. In Salesforce CRM, refresh the page and make sure you are filtering by `All Contacts`, and you will see the newly created contact! 🎉  You can also import all your contact records of your company.
![integration user](blog-hubspot-salesfoce-result.png 'integration user')

One Last Thing…
If you have any questions, you can [contact us](). Keep in mind that you can create any HubSpot Salesforce integration using Fusebit, filter contact activity, get contact data, advanced setup and sync data between the two platforms.

If you want to use other platforms, create powerful bi-directional sync and improve your customer experience, for example sending new Salesforce leads to your marketing team in slack, check out [Fusebit](https://fusebit.io/), and follow us on [Twitter](https://twitter.com/fusebitio)!


