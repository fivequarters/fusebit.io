---
post_title: How to Use the Google Calendar API With JavaScript
post_author: Keshav Malik
post_author_avatar: keshav.png
date: '2022-06-03'
post_image: google-calendar-api.png
post_excerpt: In this post, we'll cover how to use the Google Calendar API with JavaScript including detailed examples of useful tasks.
post_slug: google-calendar-api-javascript
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'integrate-google-calendar-node-everyauth',
    'send-email-gmail-api',
    'gmail-api-node-tutorial',
  ]
---

The [Google Calendar API](https://developers.google.com/calendar/api) provides powerful functionality to create a wide variety of applications. Using the [API](https://www.redhat.com/en/topics/api/what-are-application-programming-interfaces), you can build calendar clients and applications that can register and make changes to calendars and view, update, and delete events. 

Google Calendar API has several features that can help anyone use it to their advantage. It is the mark of an excellent programmer to know how to use this API effectively. This blog post looks at how to use the API and, hopefully, offers a few ideas about using it to your advantage. 

Before we take a deep dive into the integration, let’s take a closer look at the Google Calendar API. 

> Google Calendar API has several features that can **help anyone** use it to their advantage. 

## What Is a Google Calendar API?

The Google Calendar API is a bridge between [Google Calendar](https://calendar.google.com/) and the developer's website or application. Using the Google Calendar API, developers can build integrations between their website or app and Google Calendar.  

## Requirements for Integrating Google Calendar API

If you want to integrate Google Calendar into your app, you need to know that there are a few requirements you have to meet in order to follow along with the tutorial successfully. Firstly, I assume that you have a basic understanding of APIs in general.  

Also, I use Node.js to integrate the API, but you don't need to know Node.js to follow along. 

Lastly, I assume the following points: 

* [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) are installed on your system
* You have a Google account to set things up.
* You have sound knowledge of how to use command-line interface ([CLI)](https://en.wikipedia.org/wiki/Command-line_interface)

Before getting into details, let’s understand how the application will use Google Calendar API to perform different operations. The diagram below will help you to understand the workflow:  

![google calendar api javascript](google-calendar-api-1.png "google calendar api javascript")

## Get Started With Google Calendar API

First, we’ll need to enable Google Calendar API from the Google console and create credentials for authentication. Google offers multiple ways to authenticate, including: 

* API key
* OAuth 2.0 consent
* Service account

In this guide, we’ll be using a service account because we're not dealing with any user data but will be playing around with the application data only. 

While setting up the credentials, make sure you select “Application Data” when asked, “What data will you be accessing?” 

![google calendar api javascript with-shadow](google-calendar-api-2.png "google calendar api javascript")

Once you do this, you’ll see an email in the “Service Account” block. Click on that and navigate to the “Keys” tab. Create a new key (key type: JSON). Once you create a key, a [JSON](https://www.json.org/json-en.html) file containing the private key will download. 

Let’s create a dummy calendar that we can use to follow along with this guide. Once you create a new calendar, go to calendar settings and add the service account email in the “Share with specific people” option (set permissions to "Make changes to events"). 

## Integrate Node.js Application With Google Calendar API

The steps we have performed so far are just the basic setup. Now we’ll create a Node.js application and integrate it with the API. 

To get started, create a folder named calendar-api and use the following command from the terminal after changing the directory: 

```bash
npm init -y
```

This command will create a package.json  and the lock file. Now let’s install the required packages using npm: 

```bash
npm install dotenv googleapis
```

The above command will install the packages [dotenv](https://www.npmjs.com/package/dotenv) and [googleapis](https://www.npmjs.com/package/googleapis) . We’ll be using the dotenv file to store the API secrets securely. 

**Note:** If you plan to push this project to GitHub, create a .gitignore file and add .env to it to avoid moving your secrets to GitHub. 

Next, create two different files in the root directory, main.js and .env. The first will be our main file, and we’ll be writing all our code inside it. The .env  file will contain your secrets. 

Inside the .env  file, paste the following code and the secrets from the downloaded JSON file: 

```js
type=
project_id=
private_key_id=
private_key=
client_email=
client_id=
auth_uri=
token_uri=
auth_provider_x509_cert_url= 
client_x509_cert_url=
calendar_id=
project_number=
```

You can find the calendar_id from the Calendar Settings &lt; Integrate calendar and project_number  from the Project Settings (See [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)).  

You have securely saved your secrets. Now let's start writing code in the main.js file. First we'll create an event using events.insert()  method, and then we'll list all the events. 

To get started, first rename the downloaded JSON file as keys.json and move it to the project's root directory. Once you've done this, paste the following code into the main.js file: 

```js
const { google } = require("googleapis");
require("dotenv").config();

const GOOGLE_PRIVATE_KEY = process.env.private_key;
const GOOGLE_CLIENT_EMAIL = process.env.client_email;
const GOOGLE_PROJECT_NUMBER = process.env.project_number;
const GOOGLE_CALENDAR_ID = process.env.calendar_id;

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

const calendar = google.calendar({
  version: "v3",
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient,
});

const auth = new google.auth.GoogleAuth({
  keyFile: "./keys.json",
  scopes: SCOPES,
});

var calendarEvent = {
  summary: "Test Event added by Node.js",
  description: "This event was created by Node.js",
  start: {
    dateTime: "2022-06-03T09:00:00-02:00",
    timeZone: "Asia/Kolkata",
  },
  end: {
    dateTime: "2022-06-04T17:00:00-02:00",
    timeZone: "Asia/Kolkata",
  },
  attendees: [],
  reminders: {
    useDefault: false,
    overrides: [
      { method: "email", minutes: 24 * 60 },
      { method: "popup", minutes: 10 },
    ],
  },
};

const addCalendarEvent = async () => {
  auth.getClient().then((auth) => {
    calendar.events.insert(
      {
        auth: auth,
        calendarId: GOOGLE_CALENDAR_ID,
        resource: calendarEvent,
      },
      function (error, response) {
        if (error) {
          console.log("Something went wrong: " + err); // If there is an error, log it to the console
          return;
        }
		console.log("Event created successfully.")
        console.log("Event details: ", response.data); // Log the event details
      }
    );
  });
};

addCalendarEvent();
```

We have created a Google Auth client using the keys.json  file in the above code snippet. Then we created a calendarEvent object that contains all the event details. To add events to the calendar, use the calendarEvent object with the events.insert method in the addCalendarEvent function. 

To add the event to your calendar, simply run the code using the following command: 

```bash
node main.js
```

If you don’t have any errors in the code, Google Calendar will successfully add the event. 

### List Events Using Google Calendar API

Now that we've added events to the calendar, how do we know that the events are in there? Let’s write another function that will list all upcoming events. To get started, add the function below underneath the addCalendarEvent function. Make sure you comment on the line of code where you call the addCalendarEvent function to avoid adding multiple events again and again. 

```js
const listCalendarEvents = () => {
  calendar.events.list(
    {
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    },
    (error, result) => {
      if (error) {
        console.log("Something went wrong: ", error); // If there is an error, log it to the console
      } else {
        if (result.data.items.length > 0) {
          console.log("List of upcoming events: ", result.data.items); // If there are events, print them out
        } else {
          console.log("No upcoming events found."); // If no events are found
        }
      }
    }
  );
};
listCalendarEvents();
```

The above code uses googleapis to create a JWT client and fetches the list of events from the calendar. To run the code, open the terminal and use the following command: 

```bash
node main.js
```

The output of the code will look something like this: 

```js
Upcoming events are:  [
  {
    kind: 'calendar#event',
    etag: '"33045144xxxxxx"',
    id: 'xxxxxxxxxxx',
    status: 'confirmed',
    htmlLink: 'xxxxxx',
    created: '2022-05-11T08:20:17.000Z',
    updated: '2022-05-11T08:20:17.917Z',
    summary: 'Manually added event',
    creator: { email: 'xxxxx@gmail.com' },
    organizer: {
      email: '891xxxx8@group.calendar.google.com',
      displayName: 'Fusebit',
      self: true
    },
    start: { dateTime: '2022-05-12T13:00:00+05:30', timeZone: 'Asia/Kolkata' },
    end: { dateTime: '2022-05-12T14:00:00+05:30', timeZone: 'Asia/Kolkata' },
    iCalUID: '6xxxxxxb@google.com',
    sequence: 0,
    reminders: { useDefault: true },
    eventType: 'default'
  },
  {
    kind: 'calendar#event',
    etag: '"33045xxxxxxxxxx"',
    id: 'nqj3ukgm6ifxxxxxxxxxx',
    status: 'confirmed',
    htmlLink: 'https://www.google.com/calendar/event?eid=xxxx',
    created: '2022-05-11T09:27:38.000Z',
    updated: '2022-05-11T09:27:38.924Z',
    summary: 'Event added by Node.js',
    description: 'This event was created by Node.js',
    creator: {
      email: 'xxxxxx.iam.gserviceaccount.com'
    },
    organizer: {
      email: '8xxxxx@group.calendar.google.com',
      displayName: 'Fusebit',
      self: true
    },
    start: { dateTime: '2022-06-03T16:30:00+05:30', timeZone: 'Asia/Kolkata' },
    end: { dateTime: '2022-06-05T00:30:00+05:30', timeZone: 'Asia/Kolkata' },
    iCalUID: 'xxxxxxx@google.com',
    sequence: 0,
    reminders: { useDefault: false, overrides: [Array] },
    eventType: 'default'
  }
]
```

If you don’t have any events in your calendar, you might get “No upcoming events found” as your output. 

**Note:** The above code snippets are referenced from [Node.js Quickstart Guide](https://github.com/googleworkspace/node-samples/tree/master/calendar/quickstart) and Google's [API Documentation](https://developers.google.com/calendar/api/guides/create-events#node.js). 

> The Google Calendar API is a **powerful** way to get a lot of functionality out of your calendar.

## Conclusion

The Google Calendar API is a powerful way to get a lot of functionality out of your calendar. You can import events directly into your calendar, add new events, and even schedule recurring meetings using the Google Calendar API. There are a lot of great things you can do with the API.  

In this post, we covered the API's "create" and "get events" functionalities, but that’s not all it can do. [Google Calendar API](https://developers.google.com/calendar/api) offers many more functionalities that you can use when building your next application. 

We hope that our guide has helped you understand how to use the API to build something great! If you have any questions, please reach out to us on [Twitter](https://twitter.com/fusebitio).  

Thank you for reading. We are always excited when one of our posts can provide helpful information about a topic like this! 

_This post was written by Keshav Malik. [Keshav](https://theinfosecguy.xyz/) is a full-time developer who loves to build and break stuff. He is constantly on the lookout for new and interesting technologies and enjoys working with a diverse set of technologies in his spare time. He loves music and plays badminton whenever the opportunity presents itself._
