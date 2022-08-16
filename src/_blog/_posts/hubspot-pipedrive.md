---
post_title: HubSpot Pipedrive Integration, From Start to Finish
post_author: Eric Goebelbecker
post_author_avatar: eric.png
date: '2022-08-11'
post_image: hubspot-pipedrive-integration.png
post_excerpt: HubSpot and Pipedrive can help your team manage sales and track your marketing. Here's how to get them to work together.
post_slug: hubspot-pipedrive-integration
tags: ['post', 'integrations']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'unified-apis',
    'slack-bot-hubspot-integration',
    'everyauth-hubspot',
  ]
---

When you're looking for a cloud-based CRM that will help with managing sales and drive your marketing, Pipedrive and HubSpot are always two of the major contenders. But they are two very different tools, and it's not always a binary decision. Sometimes you might be better off using both. 

In this tutorial, we're going to look at HubSpot and Pipedrive integration. After we compare the two platforms, we'll see how you can use HubSpot Data Sync to get them working together. 

## Hubspot vs. Pipedrive
### What is HubSpot?

HubSpot is a cloud-based inbound marketing and sales platform. Focusing primarily on helping sales and marketing, it offers tools for content management, web analytics, social media marketing, search engine optimization (SEO), and content management. 

HubSpot's goal is to help your marketing, sales, and customer service work better as a team. It has integrated tools that help you ensure that all your prospects and customers see a consistent message. At the same time, HubSpot gives you a unified dashboard so you can get a better picture of your ROI on marketing. 

> HubSpot’s **goal** is to help your **marketing, sales** and **customer** service work better as a team.

You can use HubSpot for: 

* **Websites** - you can design, build, and host your website with their drag-and-drop tools.
* **Keywords** - find, organize, and track keywords to drive your search results.
* **Blogs** - you can create and publish blog content, and target your keywords.
* **Email marketing** - improve your email deliverability and increase your response rates with tools for building personalized campaigns.
* **Ads** - measure impressions and clicks, plus integrated tools to track leads.
* **Social media management** - improve your social results with the ability to post to more than one network while tracking your responses.
* **Reporting** - HubSpot ties all these tools together with centralized reporting that helps you coordinate your sales, marketing, and customer interactions.

HubSpot offers a free tier, along with three different levels of paid service. 

### What is Pipedrive?

Pipedrive is a CRM platform for sales teams. It's cloud-based, like Hubspot, so you can access your data from the web while Pipedrive manages it for you. Pipedrive differs from Hubspot because it focuses primarily on sales. The tagline on their website is "The first CRM designed by salespeople, for salespeople." 

Pipedrive offers an extensive set of tools: sales reminders, lead management, automation tools, and customizable sales pipelines. It also offers its own email marketing tools for building custom email campaigns. 

Sales teams also benefit from tools for scheduling sales meetings, creating documents for proposals, and even tools for e-signatures. 

Pipedrive limits their free trial to one month. They offer four different service levels. 

## What's the Difference Between HubSpot and Pipedrive?

We already touched on the primary difference between these two CRMs: HubSpot's emphasis is on sales and marketing, while Pipedrive's focus is on sales management. This difference in purpose has an enormous influence on their features and the tools that they offer. 

HubSpot has a more extensive marketing toolbox, with features like SEO, SEM, and A/B testing. It also integrates with more third-party tools. 

Pipedrive is exclusively a CRM. While it has fewer tools, it's more focused and costs less per user. 

## Does HubSpot Connect With Pipedrive?

So, it's clear that HubSpot and Pipedrive have some overlap. But, they differ enough that some organizations might want to combine Pipedrive's focus on sales with HubSpot data-driven marketing tools. Fortunately, you can do that without trying to maintain two CRMs in parallel. You can sync your data between Pipedrive and HubSpot automatically with [Data Sync by HubSpot](https://ecosystem.hubspot.com/marketplace/apps/sales/crm/pipedrive). Data Sync is HubSpot's generalized synchronization tool for sharing your data with external services. 

When you first set up Data Sync, you select which parts of your systems to synchronize, and the default behavior is to bring HubSpot and Pipedrive into sync with each other. Then, Data Sync synchronizes updates every five minutes. So, the integration keeps the two applications in synchronization, without manual intervention. Data Sync comes with "out-of-the-box" field mappings that should work for most users, so you don't have to spend too much time getting started. 

But you don't have to settle for the defaults if you want to take control of how Data Sync shares your data between HubSpot and Pipedrive. You can set up custom filters to control which records and fields the integration shares between apps. You can also create custom field mappings. 

> Data Sync comes with **out-of-the-box** field mappings that should work for most users, so you don’t have to spend too much time getting started.

Let's take a look at how to set HubSpot Pipedrive integration. 

## HubSpot Pipedrive Integration

### Prerequisites

In order to use Data Sync, you must have [App Marketplace permissions](https://knowledge.hubspot.com/settings/hubspot-user-permissions-guide#admin) or be a [super admin](https://knowledge.hubspot.com/settings/hubspot-user-permissions-guide#super-admin) in your HubSpot account. You may synchronize with Pipedrive with an [Essential, Advanced, Professional, or Enterprise plan.](https://www.pipedrive.com/en/pricing) Advanced options like custom fields and synchronizations require a paid HubSpot plan. 

### Install Pipedrive Integration

Since this is a HubSpot integration, you'll do all the work from your HubSpot account. Start by logging in to your account. 

Then, select the Marketplace icon from the toolbar on the top right-hand side of the screen.

![HubSpot Pipedrive integration](hubspot-pipedrive-1.png "HubSpot Pipedrive integration")

Next, select App Marketplace from the dropdown menu.

![HubSpot Pipedrive integration](hubspot-pipedrive-2.png "HubSpot Pipedrive integration")

This takes you to the marketplace. Now, search for Pipedrive to find the integration.

![HubSpot Pipedrive integration](hubspot-pipedrive-3.png "HubSpot Pipedrive integration")

Select Pipedrive and you'll go to the integration page.

![HubSpot Pipedrive integration with-shadow](hubspot-pipedrive-4.png "HubSpot Pipedrive integration")

Click the Install app button, and HubSpot will prompt you for approval to proceed with the integration.   

![HubSpot Pipedrive integration with-shadow](hubspot-pipedrive-5.png "HubSpot Pipedrive integration")

Click on **Connect to Pipedrive**. HubSpot will send you to Pipedrive to login and allow the connection between your accounts. 

![HubSpot Pipedrive integration with-shadow](hubspot-pipedrive-6.png "HubSpot Pipedrive integration")

Login to Pipedrive, and you'll see the permissions dialog. 

![HubSpot Pipedrive integration with-shadow](hubspot-pipedrive-7.png "HubSpot Pipedrive integration")

HubSpot needs full access to Deals, Contacts, Products, and Leads in order to synchronize them with HubSpot. It also needs to see your user account information.   

Click Allow and Install. This will take you back to HubSpot. 

![HubSpot Pipedrive integration with-shadow](hubspot-pipedrive-8.png "HubSpot Pipedrive integration")

You've installed the integration. Next, let's set up a synchronization.

### Set Up Synchronization

Click **Set up sync.** 

Now HubSpot with take you to the sync page where you'll need to select what you want to sync. 

Let's start with syncing HubSpot contacts with Pipedrive people. 

![HubSpot Pipedrive integration with-shadow](hubspot-pipedrive-9.png "HubSpot Pipedrive integration")

Select **Contact sync** and then click **Next**.   

Now, you're at the contact sync screen. 

![HubSpot Pipedrive integration with-shadow](hubspot-pipedrive-10.png "HubSpot Pipedrive integration")

The default setting is to synchronize all users between the platforms. You filter the users with the dropdown menu if you wish.   

This option will only filter people added to Pipedrive after August 4, 2022: 

![HubSpot Pipedrive integration with-shadow](hubspot-pipedrive-11.png "HubSpot Pipedrive integration")

The default behavior is also to prioritize HubSpot over Pipedrive in the case of a conflict. You can override that, too: 

![HubSpot Pipedrive integration with-shadow](hubspot-pipedrive-12.png "HubSpot Pipedrive integration")

Before we proceed, let's look at a few more sync options. 

Click **Field mappings**. 

![HubSpot Pipedrive integration with-shadow](hubspot-pipedrive-13.png "HubSpot Pipedrive integration")

HubSpot has already set up sane defaults for syncing users between them and Pipedrive. 

If you click **Add new mapping, **You'll see options to add new fields if you have an Operation Hub Starter account or higher. 

For now, we can stick with the defaults and click **Review **on the top right-hand side of the page.

![HubSpot Pipedrive integration with-shadow](hubspot-pipedrive-14.png "HubSpot Pipedrive integration")
  This This looks good, so click **Save and sync.**

HubSpot takes you to the syncing dashboard: 

![HubSpot Pipedrive integration with-shadow](hubspot-pipedrive-15.png "HubSpot Pipedrive integration")

It's up and running. 

From here you can add additional synchronizations for Companies and Deals using the same process.

## HubSpot and Pipedrive Together

We've covered HubSpot and Pipedrive, how they can help you manage your sales and marketing, and how they can work together. Then, we used HubSpot Data Sync to synchronize contacts between HubSpot and Pipedrive accounts. As we went through the setup, we looked at a few of the options and set up a working sync. 

These cloud-based CRMs are powerful additions to any sales and marketing team, and there's no reason to limit yourself to only one. You can [integrate](https://fusebit.io/about/#demo) HubSpot and Pipedrive today!   

_This post was written by Eric Goebelbecker. [Eric](http://ericgoebelbecker.com/) has worked in the financial markets in New York City for 25 years, developing infrastructure for market data and financial information exchange (FIX) protocol networks. He loves to talk about what makes teams effective (or not so effective!)._
