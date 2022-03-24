---
post_title: Upload Google Spreadsheet Chart to Slack
post_author: Tomasz Janczuk
post_author_avatar: tomek.png
date: '2022-03-23'
post_image: api-metering-express.jpg
post_excerpt: This post shows how you can automate sending Google Spreadsheet charts to Slack on a schedule. No programming experience is required.
post_slug: upload-google-spreadsheet-charts-to-slack
tags: ['post', 'developer tools', 'integrations', 'addon']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/api-metering-express.jpg
posts_related:
  [
    'run-nodejs-from-google-sheets',
    'api-metering-and-analytics-for-early-stage-startups',
    '5-women-in-tech',
  ]
---

This post will show you how to automatically send a Google Spreadsheet chart to Slack on a schedule - no programming skills required. 10 minutes from now, you will be able to start sending that sales, growth, or financial report you created in Google Sheets to your team on Slack every week, day, or even every hour, completely automatically.

![Upload Google Spreadsheet Chart to Slack](blog-upload-1.png)

Let’s go!

## From Google Sheets to Slack

There will be three parts of the solution: a Slack Application, the Google Sheets spreadsheet, and a piece of associated AppsScript (a Google script language for adding custom behaviors to Google apps). You will see some code along the way, but don’t worry - no programming skills are required. You will only copy & paste a few lines of it.

Your Google Spreadsheet contains the chart you want to send to Slack. We will associate a piece of a custom script with the spreadsheet and configure it to run regularly, for example daily. The script will get an image of a chart you created in the Google Spreadsheet, and upload it as a file to Slack using Slack APIs and the Slack Application you will register.

## Google Sheet With a Chart

If you don’t have one already, create a Google Spreadsheet with a chart you want to send to Slack. For example, it could be a sales report that looks like this:

![Upload Google Spreadsheet Chart to Slack](blog-upload-2.png)

Take note of the chart _title_ as you will need it later to identify the chart you want to upload to Slack. In the example above, the chart title is _Sales_.

## Create Slack Application

You need to register a new Slack Application in your Slack workspace to be able to upload your chart to Slack using Slack APIs.

Go to <a href="https://api.slack.com/apps/" target="_blank">https://api.slack.com/apps/</a> and log in with your Slack credentials. Click the big green _Create New App_ button and choose the _From scratch_ option:

![Upload Google Spreadsheet Chart to Slack](blog-upload-3.png)

On the next screen, give your app a name, say _GSheet Reports_, and select the Slack workspace you want to add it to. Click _Create App_.

![Upload Google Spreadsheet Chart to Slack](blog-upload-4.png)

You will end up on a configuration page of your new Slack App. Select the _OAuth & Permissions_ section in the navigation panel on the left, and then scroll down until you find the _Scopes_ section. In the _Bot Token Scopes_ subsection, click the _Add an OAuth Scope_ button, then select and add the _files:write_ scope. Your screen should now look like this:

![Upload Google Spreadsheet Chart to Slack](blog-upload-5.png)

Scroll back up in the _OAuth & Permissions_ section until you find _OAuth Tokens for your Workspace_. Click the _Install to Workspace_ button there, and authorize your new Slack App in your selected Slack workspace. When this process is done, take note of the _Bot User OAuth Token_ that was generated. It will be used later when uploading your Google Sheets chart to Slack.

![Upload Google Spreadsheet Chart to Slack](blog-upload-6.png)

Lastly, in your Slack workspace itself, determine the channel you want to send the charts from Google Sheets to, and invite the Slack App you just created to this channel. Slack Apps can only send messages to channels they were invited to.

You can invite your Slack App to a channel by mentioning its name in a message (e.g. `@GSheet Reports`), pressing enter, and confirming the invitation of the app to the channel:

![Upload Google Spreadsheet Chart to Slack](blog-upload-7.png)

Take note of the channel name you invited your Slack App to.

That’s it as far as Slack is concerned - let’s go back to your Google Spreadsheet to configure it.

## Use AppsScript to Send GSheet Chart to Slack

Back in the Google Spreadsheet, go to _Extensions | Apps Script_. In a new tab, the Apps Script editor will open up. Change the name of the project to something familiar, e.g. _GSheet Reports_, then highlight and delete all the code from the panel showing the _myFunction_ function. You should have a clean slate like this:

![Upload Google Spreadsheet Chart to Slack](blog-upload-8.png)

Now, copy & paste the code shown below to the Apps Script code panel:

```javascript
// Title of the chart to send to Slack as it appears in GSheet
const chartTitle = 'Sales';
// Slack Bot Token from the Slack App configuration page
const slackBotToken = 'xoxb-000000000000-0000000000000-SkjhDgDkjhSKJShsSKJ';
// Comma delimited channel IDs or names
const slackChannels = 'sales-report';

function sendChartToSlack() {
  // Get chart with the specified title
  const chart = SpreadsheetApp.getActiveSheet()
    .getCharts()
    .find((chart) => chart.getOptions().get('title') === chartTitle);
  if (!chart) {
    throw new Error(
      `Cannot find chart titled '${chartTitle}' in the current sheet.`
    );
  }

  // Upload chart to Slack as a file
  const options = {
    method: 'post',
    headers: {
      Authorization: `Bearer ${slackBotToken}`,
    },
    payload: {
      title: chartTitle,
      filetype: 'png',
      file: chart.getAs('image/png'),
      channels: slackChannels,
    },
    muteHttpExceptions: true,
  };
  const response = UrlFetchApp.fetch(
    'https://slack.com/api/files.upload',
    options
  );
  if (response.getResponseCode() !== 200) {
    throw new Error(
      `Error uploading Google Sheets image to Slack: HTTP ${response.getResponseCode()}: ${response.getContentText()}`
    );
  }
  const body = JSON.parse(response.getContentText());
  if (!body.ok) {
    throw new Error(
      `Error uploading Google Sheets image to Slack: ${body.error}`
    );
  }
}
```

Next, modify lines 2, 4, and 6:

- Line 2: replace the _Sales_ string with the title of the chart you want to export from your Google Spreadsheet.
- Line 4: replace the Slack Bot Token (the string starting with _xoxb-_) with the Slack Bot Token you took note of when creating your Slack App.
- Line 6: replace the Slack channel name with the name of the channel you invited your Slack App to.

![Upload Google Spreadsheet Chart to Slack](blog-upload-9.png)

Save the script by clicking the disk symbol. Then, manually test your integration by clicking the _Run_ button above the script panel. During the first run of the script, you will be prompted to authorize access of the script to your spreadsheet.

If everything was set up correctly, you should see your Google Sheet chart showing up in the Slack channel you selected:

![Upload Google Spreadsheet Chart to Slack](blog-upload-1.png)

Congratulations, you can now send your Google Spreadsheet chart to Slack! In the next step, we will automate it so that it will happen on a schedule without any manual involvement.

## Send GSheet Charts to Slack Daily

If you have closed the Apps Script panel already, open it again by going to _Extensions | Apps Script_ in your Google Spreadsheet. Then on the left, select the _Triggers_ section:

![Upload Google Spreadsheet Chart to Slack](blog-upload-10.png)

Click the _Add Trigger_ button. In the dialog that will show up, change the _Select event source_ drop down to _Time-driven_, and then configure how frequently you want your Google Sheets chart to be sent to Slack using the dropdowns that follow. In the example below, the chart will be sent to Slack every day between midnight and 1 am GMT:

![Upload Google Spreadsheet Chart to Slack](blog-upload-11.png)

Click _Save_, and you are all set. Your chart report will be sent to Slack following the schedule you defined in the Apps Script trigger. Congratulations!

## Getting Data Into Your Google Spreadsheet

Now that you can create a beautiful chart in a Google Spreadsheet and automatically send it to Slack, the question is where does the data underlying that chart come from? Google Sheet rarely is the source of truth and you need to import the latest data from an external data source like Salesforce or QuickBooks.

If you are a developer, you should check out the [Fusebit Add-On for Google Sheets](https://fusebit.io/blog/run-nodejs-from-google-sheets/). Using Fusebit, you can use Node.js and npm packages along with Fusebit SaaS Connectors to automate the import of data from any number of external systems or databases.

## What is Fusebit?

[Fusebit](https://fusebit.io) is a code-first integration platform that helps developers add integrations to their apps. We live and breathe integrations. Follow us on Twitter [@fusebitio](https://twitter.com/fusebitio) for great developer content, and check out some cool OSS projects at [github.com/fusebit](https://github.com/fusebit).
