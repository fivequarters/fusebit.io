---
post_title: 'Google Sheets API Tutorial: The Basics You Need to Get Going'
post_author: Israel Oyetunji
post_author_avatar: israel.png
date: '2022-07-19'
post_image: google-sheet-api-tutorial.png
post_excerpt: In this Google Sheets API tutorial for beginners, learn how to use the Google Sheets API to perform basic CRUD operations.
post_slug: google-sheets-api-tutorial
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'google-sheets-api-limits',
    'run-nodejs-from-google-sheets',
    'upload-google-spreadsheet-charts-to-slack',
  ]
---

The Google Sheets API enables us to read, write, and update a spreadsheet's data. We can also use it to render user interfaces (UIs) by fetching data from Google Sheets, which will then serve as a database. The Google Sheets API helps developers import data into spreadsheets and build apps that interact with Google Sheets, maximizing functions and increasing productivity. 

In this Google Sheets API tutorial for beginners, you’ll learn how to use the Google Sheets API to perform basic CRUD operations. 

## Prerequisites for Google Sheets API Tutorial

This tutorial assumes that you have 

* a basic understanding of JavaScript and Node.js,
* [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed on your computer,
* a code editor (such as VS Code), and
* a Google account.

## Project Setup

To use the Google Sheets API, you need a Google Cloud Platform Project with the API enabled, as well as authorization credentials. To get those, follow the steps below. 

### Step 1: Create a New Project

First, open the Google Cloud Console, and then create a new project. 

![Google Sheets API Tutorial](google-sheets-api-1.png "Google Sheets API Tutorial")

### Step 2: Enable API and Services

At the top left, click **Menu ☰** > **APIs and Services** > **Enabled APIs and Services**. 

Then click on the **+ Enable APIs and Services **button. 

![Google Sheets API Tutorial](google-sheets-api-2.png "Google Sheets API Tutorial")

### Step 3: Create a Service Account

Now that the API is enabled, it will direct you to a page where you can configure the settings for the API. 

In the left sidebar, click on the **Credentials** tab, and then click the **Create Credentials** button at the top. 

Next, select **Service Account** in the drop-down menu. 

![Google Sheets API Tutorial](google-sheets-api-3.png "Google Sheets API Tutorial")

In the next screen, provide the service account details required; then, click **Create and Continue**. 

![Google Sheets API Tutorial](google-sheets-api-4.png "Google Sheets API Tutorial")

Click **Continue** and **Done** respectively on the next two dialogs.

Now, your newly created service account will be on the credentials page. 

Copy the email address of the service account to the clipboard, as we'll need it later to share the spreadsheet with this account. 

You'll be directed to the next screen, where we'll create a new key. To do so, click on the **Keys** tab, and then click on the **Add Key** button. 

Select the **Create New Key** option, and then the key type of **JSON**.

![Google Sheets API Tutorial](google-sheets-api-5.png "Google Sheets API Tutorial")

Lastly, rename the downloaded JSON file, and move it into your project folder. This keyfile contains the credentials of the service account that we need in our Node.js script to access the spreadsheet from Google Sheets.

## How to Use the Google Sheets API

Now that we're done setting up the project and its credentials in the Google cloud console, let's explore how to use the basic API functions in Google Sheets. 

### Create a Spreadsheet

Before diving into the code, head over to [Google Sheets](https://docs.google.com/spreadsheets/u/0/) and make a new spreadsheet. Enter in some dummy data so that we have something to fetch while testing the API. 

![Google Sheets API Tutorial](google-sheets-api-6.png "Google Sheets API Tutorial")

Now, let’s add the service account email address and assign it the Editor role, which gives it permission to read, write, update, and delete data. 

Click on the **Share** button in the top-right corner. This will open a modal where we'll share the spreadsheet with the service account. Make sure to uncheck the **Notify people** checkbox. 

![Google Sheets API Tutorial](google-sheets-api-7.png "Google Sheets API Tutorial")

Click the **Share** button to share the spreadsheet with the service account. 

### Application Setup

Now that we're done with the configuration, let's get into the code. Open up your code editor and create a new project folder. I'll be using [VS Code](https://code.visualstudio.com/Download). 

Copy and paste the downloaded keyfile into the root of the directory. Rename the file to a simpler one, like keys.json. 

Next, navigate to the root of the project, open up the integrated terminal in VS Code, and run this command: 

```
npm init -y
```

This command will initialize the directory and create an empty package.json file, which defines important information about the project such as dependencies and project version. 

Next, let's install a couple of dependencies: 

* [Google APIs](https://www.npmjs.com/package/googleapis#installation), to access the Google Sheets API
* [Express](https://www.npmjs.com/package/express), to manage the server and routing
* [nodemon](https://www.npmjs.com/package/nodemon), for local development so that the server will restart when we save the file

```
npm install googleapis express
```

When that is finished installing, run the following code to install nodemon as a dev dependency:

```
npm install nodemon --save-dev
```

After running the commands, you'll get a package-lock.json file and the node_modules folder. 

++Now, to configure nodemon to restart the server on every file save, open up the package.json file and add the following code: 

```
"scripts": {
    "dev": "nodemon ."
  },
```

This will enable us to run the dev server using the command **npm run dev**. 

Now, your package.json file should look like this: 

```
{
  "dependencies": {
    "express": "^4.18.1",
    "googleapis": "^101.0.0",
  },
  "scripts": {
    "dev": "nodemon ."
  },
  "name": "quickstart",
  "version": "1.0.0",
  "main": "index.js",
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "nodemon": "^2.0.19"
  }
}
```

Note that the dependency versions may be different. 

### Integrating the Google Sheets API

Next, create a file named index.js in the project folder. Open the index.js file and import the dependencies we just installed. 

```
const express = require("express");

const { google } = require("googleapis");
```

Initialize Express and listen for the server. I'm using port 8080, but you can choose any port. 

```
const app = express();
const port = 8080;

//This allows us to parse the incoming request body as JSON
app.use(express.json());

// With this, we'll listen for the server on port 8080
app.listen(port, () => console.log(`Listening on port ${port}`));
```

Next, add the following code: 

```
async function authSheets() {
  //Function for authentication object
  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  //Create client instance for auth
  const authClient = await auth.getClient();

  //Instance of the Sheets API
  const sheets = google.sheets({ version: "v4", auth: authClient });

  return {
    auth,
    authClient,
    sheets,
  };
}
```

Let's break the above code into bits: 

First, we created a new Google auth object so that we can authorize the API request. This works by passing in the **keyFile**, which is the keys.json (assuming the file is stored at the root level of the project), and scopes property, which specifies the Google API we're using. 

Second, the **authClient** variable stores the service account details (client instance) from the **getClient()** method once the details have been verified in the auth object. 

Third, we create an instance of the Google Sheets API. It takes an object with two properties: version (the current version, in our case v4) and auth, the authClient that we created. 

Lastly, we return the variables so that we can access the spreadsheet values in any routes of the app.

### Reading Data From a Spreadsheet

Now, to get the data from the spreadsheet, we'll use the **[sheets.spreadsheets.values.get](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get)** method, which takes in two required path parameters—**spreadsheetId** and **range**—and stores them in a response variable. 

```
app.get("/", async (req, res) => {
  const { sheets } = await authSheets();

  // Read rows from spreadsheet
  const getRows = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: "Sheet1",
  });

  res.send(getRows.data);
});
```

We extract the **spreadsheetId** from the URL of the spreadsheet and store it in a global variable, **id**:

![Google Sheets API Tutorial](google-sheets-api-8.png "Google Sheets API Tutorial")

The text underlined in red is the spreadsheet ID. 

```
const id = "12fSSjNTpDtTJ8vF4T3LRYe36WjPEfn1_sr_lSSpZJUo";
```

While the range defines the range of cells to read from, here we use the spreadsheet name. Every spreadsheet file has at least one sheet, which is identified by the sheet name. In our example, we're using the sheet name Sheet 1, which you can find at the bottom left of the spreadsheet. 

You can also limit the range of the sheet by adding the sheet name, an exclamation symbol, and then the column range (e.g., **Sheet1!A1:C5**). 

The **sheets.spreadsheets.values.get** method has three other optional query parameters: 


* **majorDimension** defines the major dimension of the values, either rows or columns. The default is ROWS.
* **valueRenderOption** defines how values should be rendered in the output. The default is FORMATTED_VALUE.
* **dateTimeRenderOption** defines how dates, times and duration should be rendered in the output. The default is SERIAL_NUMBER.

Now, run the following command in the terminal to start the server: 

```
npm run dev
```

![Google Sheets API Tutorial](google-sheets-api-9.png "Google Sheets API Tutorial")

Then, head over to your browser, and type in [http://localhost:8080/](http://localhost:8080/). The result should be something like this: 

![Google Sheets API Tutorial](google-sheets-api-10.png "Google Sheets API Tutorial")

If it doesn't look aligned like this, install [JSONVue](https://chrome.google.com/webstore/detail/jsonvue/chklaanhfefbnpoihckbnefhakgolnmc/) to format your JSON files in the browser. With this, we've successfully read the data from our spreadsheet.

### Writing and Updating Data into the Spreadsheet

To append data after a table of data in a sheet, use the **[sheets.spreadsheets.values.append](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append)** method, which takes in the spreadsheet ID, the range of cells to write into, the value entered by the user, and the resource object containing the information to insert into the rows. 

```js
// Write rows to spreadsheet
await sheets.spreadsheets.values.append({
  spreadsheetId: id,
  range: "Sheet1",
  valueInputOption: "USER_ENTERED",
  resource: {
    values: [["Gabriella", "Female", "4. Senior"]],
  },
});
```

The **valueInputOption** property defines how the input data should be interpreted. The values will be parsed according to how the user typed them into the UI.

The **resource** object has a child, **values**, which is an array of the data to be added to the sheets. Here, we're adding a new row with the values for the student name, gender, and class level. 

Save the code and head over to Google Sheets, where you'll find that the new entry has been added. If not, refresh the local server and then go back to Google Sheets.

![Google Sheets API Tutorial](google-sheets-api-11.png "Google Sheets API Tutorial")

There's also the option of using the **[spreadsheets.values.update](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update)** request. This enables us to write data to a specified range. For example, the following code will update the class level of Alexandra to "2. Sophomore": 

```js
await sheets.spreadsheets.values.update({
  spreadsheetId: id,
  range: "Sheet1!C2",
  valueInputOption: "USER_ENTERED",
  resource: {
    values: [["2. Sophomore"]],
  },
});
```

![Google Sheets API Tutorial](google-sheets-api-12.png "Google Sheets API Tutorial")

### Deleting Data From Google Sheets

Using the **[spreadsheets.values.clear](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/clear)** method, we can clear values from a spreadsheet. To do that, specify the spreadsheet ID and range. The code below will clear all the values from row A6 to C6: 

```
await sheets.spreadsheets.values.clear({
  spreadsheetId: id,
  range: "Sheet1!A6:C6",
});
```

### Updating Spreadsheet Formatting

With the Google Sheets API, we can update the formatting of cells and ranges within spreadsheets. 

The following code defines the style for each cell for the range defined. Here, we add a dashed border line with a red color: 

```js
await sheets.spreadsheets.batchUpdate({
  spreadsheetId: id,
  resource: {
    requests: [
      {
        updateBorders: {
          range: {
            sheetId: 0,
            startRowIndex: 0,
            endRowIndex: 6,
            startColumnIndex: 0,
            endColumnIndex: 3,
          },
          top: {
            style: "DASHED",
            width: 1,
            color: {
              red: 1.0,
            },
          },
          bottom: {
            style: "DASHED",
            width: 1,
            color: {
              red: 1.0,
            },
          },
          innerHorizontal: {
            style: "DASHED",
            width: 1,
            color: {
              red: 1.0,
            },
          },
        },
      },
    ],
  },
});
```

This is the resulting layout:

![Google Sheets API Tutorial](google-sheets-api-13.png "Google Sheets API Tutorial")

## Google Sheets API FAQs

Here are some frequently asked questions about the Google Sheets API. 

### Can I Use Google Sheets API for Free?

Using the Google Sheets API is free, but each user has usage limits. The Google Sheets API [usage limits ](https://developers.google.com/sheets/api/limits)are quotas and limitations imposed by Google to make sure their API is used fairly and to protect their systems. 

![Google Sheets API Tutorial](google-sheets-api-14.png "Google Sheets API Tutorial")

However, you may not exhaust this limit unless your app has a lot of users. If you do exceed the limits, you’ll get a **429: Too many requests** error. If this happens, try using the [exponential backoff algorithm](https://developers.google.com/sheets/api/limits#exponential). 

### How Do I Use APIs in Google Sheets?

Just as you can use the Google Sheets API to read and write Google Sheets, you can also take advantage of its connectivity to use other APIs. 

Take, for example, the [Fusebit add-on for Google Sheets](https://developer.fusebit.io/docs/google-sheets-addon). Fusebit enables you to use Node.js, npm, and Fusebit Connectors to quickly connect to any API or data source with low friction and the flexibility of code. This gives you a lot of superpowers, including getting contacts from Salesforce, query data in MongoDB, importing companies from HubSpot, importing records from MySQL, downloading unpaid invoices from QuickBooks, and more. [Check out the Fusebit blog](https://fusebit.io/blog/run-nodejs-from-google-sheets/) to see what else you can achieve with the Fusebit Google Sheets Add-On. 

## Conclusion

In this tutorial, we've explored some basic functions of the Google Sheets API, and you've seen how easy it is to set up. But that's not all. From here, you can make anything simple from a Google Forms clone to a video requests app, or you can use it for something more complex like using it as a database from where an app fetches data and renders it on the front end. 

I hope you found this post helpful and insightful. If you want to explore the other functions, check out the [documentation](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values). Happy coding! 

_This post was written by Israel Oyetunji. [Israel](https://twitter.com/israelmitolu) is a frontend developer with a knack for creating engaging UI and interactive experiences. He has proven experience developing consumer-focused websites using HTML, CSS, Javascript, React JS, SASS, and relevant technologies. He loves writing about tech and creating how-to tutorials for developers._
