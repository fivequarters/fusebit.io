---
post_title: Create an interactive Image Carousel in Slack
post_author: Rubén Restrepo
post_author_avatar: bencho.png
date: '2022-03-23'
post_image: blog-slack-image-carousel.jpeg
post_excerpt: Learn how to use Slack block kit to build an interactive Image Carousel 
post_slug: slack-interactive-image-carousel
tags: ['post', 'developer tools', 'node.js']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-slack-image-carousel.jpeg
posts_related: ['customize-linear-slack-notifications', 'send-hubpsot-companies-to-slack', 'slack-bot-hubspot-integration']
---


Have you ever wondered how to create a great image slideshow carousel with Slack using Block Kit? This seems like a simple task, but you need to take into account several things in order to get it working:

Understand [Block Kit](https://api.slack.com/block-kit) (Slack official building blocks for creating user interfaces)
Configure and create a Slack Application. We use [Fusebit](https://developer.fusebit.io/docs/slack) to easily and rapidly create our application, but you can roll your own too!
Learn how to handle elements interactivity

At the end of this blog post, you will learn how to create an image carousel like the following in Slack:

![Create an interactive Image Carousel in Slack with-shadow](carousel.gif 'Interactive Image Carousel in Slack')


One of the main characteristics of a carousel is the navigation controls allowing you to navigate through the different items in a circular fashion.

## Use cases

There are many interesting use cases for this pattern, but let’s see some use cases in the context of a Slack application:

  - Provides a better user experience since the content changes dynamically in the same message.
  - Gives the user the possibility to select an option between a large list of items while keeping focus on the current one.
  - Really useful when you have visual items to display, like images from a search result.
  - You can mix this pattern with other UI elements, like adding forms to build complex interactions.

## Planning our carousel

Let’s understand the basic principles of how an image carousel works by defining the UI elements needed to build it and some basic logic of the system.

### Controls

The Carousel needs 2 different types of components: *Informational* and *interactive*.
Let’s review the layout of the carousel from the example above:

![Create an interactive Image Carousel in Slack with-shadow](blog-slack-image-carousel-layout.png 'Interactive Image Carousel in Slack layout')


  1. **Carousel header**: A simple [section block](https://api.slack.com/reference/block-kit/blocks#section) used as the page indicator.
  2. **Divider**: A content [divider](https://api.slack.com/reference/block-kit/blocks#divider) between the header and the carousel item.
  3. **Item title**: A [section](https://api.slack.com/reference/block-kit/blocks#section) block with the item text and an optional content.
  4. **Item image**: An [image block](https://api.slack.com/reference/block-kit/blocks#image) used to display an image, in our example, dog photos.
  5. **Navigation controls**: [Button elements](https://api.slack.com/reference/block-kit/block-elements#button) with back and forth controls.

Let’s see an example of each section using block kit! You can copy and paste the code in the online [block kit builder](https://app.slack.com/block-kit-builder/) to preview the results.

## First item

The navigation controls determine the item to display in the carousel. Remember: we show one item at a time, for a carousel of *n* items, where *n >= 2*, the previous and next buttons are calculated in the following way:

Next button value =  2
Previous button value =  n

Navigation controls keep the memory of the pagination of the carousel; we use the value property to calculate  the page all the time:

```json
  { "type": "button", "text": { "type": "plain_text", "text": "<<" }, "value": "4" }

```

```json
{
   "blocks": [
       { "type": "section", "text": { "type": "mrkdwn", "text": "Page 1 of 4" } },
       { "type": "divider" },
       {
           "type": "section",
           "text": {
               "type": "mrkdwn",
               "text": "*The 25 Cutest Dog Breeds - Most Adorable Dogs and Puppies*\nwww.goodhousekeeping.com"
           },
           "accessory": {
               "type": "image",
               "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDYe_GnDDkCQOm9TUTyuEIAsgp36zPA6lDFKnRclTCck1oCiS9LY9b0og&s",
               "alt_text": "The 25 Cutest Dog Breeds - Most Adorable Dogs and Puppies"
           }
       },
       {
           "type": "actions",
           "elements": [
               { "type": "button", "text": { "type": "plain_text", "text": "<<" }, "value": "4" },
               { "type": "button", "text": { "type": "plain_text", "text": ">>" }, "value": "2" }
           ]
       }
   ]
}
 
```
Let’s define a javascript function that allow us to generate the previous block kit dynamically:
```javascript

/**
 * Builds an image carousel using Slack block kit elements.
 * @param currentItem {object} The current item to display
 * @param currentPage {number} The currently displayed page
 * @param prevPage {number} The previous page number
 * @param nextPage {number} The next page number
 * 
 * @returns {string} A carousel component built with block kit elements.
 */

 const buildCarousel = (currentItem, currentPage, prevPage, nextPage) => {
  return {
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Page ${currentPage} of ${ITEMS.length}`
        },
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*${currentItem.title}*\n${currentItem.displayLink}`
        },
        "accessory": {
          "type": "image",
          "image_url": currentItem.thumbnailLink,
          "alt_text": currentItem.title
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "<<"
            },
            "value": `${prevPage}`
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": ">>"
            },
            "value": `${nextPage}`
          }
        ]
      }
    ]
  };
};

``` 
Each code example that references the `ITEMS` object, represents the list of the images we display in our carousel:

```javascript

// The collection of items (dogs) to display in the carousel
const ITEMS = [
  {
    "title": "The 25 Cutest Dog Breeds - Most Adorable Dogs and Puppies",
    "displayLink": "www.goodhousekeeping.com",
    "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDYe_GnDDkCQOm9TUTyuEIAsgp36zPA6lDFKnRclTCck1oCiS9LY9b0og&s",
  },
  {
    "title": "What is your dog's lifespan? A Princeton geneticist is seeking the ...",
    "displayLink": "www.princeton.edu",
    "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWwz2S2Qb60RBQIUa3-T_RYsC4nr5O0MeMRJIiCXN_-moc31fnkXF0pG8&s"
  },
  {
    "title": "Akita inu puppy conformation",
    "displayLink": "www.goodhousekeeping.com",
    "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyPED76DnkZeoKDdMTggHi9qtMByMnZoIthA&usqp=CAU",

  },
  {
    "title": "Dog Pictures: Cute & Funny Pictures of Dogs.",
    "displayLink": "www.akc.org",
    "thumbnailLink": "https://www.akc.org/wp-content/uploads/2017/04/Lagotto-Romangolo-Tongue-Out-500x487.jpg",
  }
];


```

Now, using the previous `buildCarousel` function, let’s build the first carousel item:

```javascript
 
 const carousel = buildCarousel(ITEMS[0], 1, ITEMS.length, 2);

```

## Configuring your Slack app
Now we have the building blocks of our image carousel, we need to configure a Slack app in order to send the carousel to a specific channel and handle the navigation controls using Slack interactions.

If you don’t have your own Slack application, please follow the instructions on using [Fusebit](https://developer.fusebit.io/docs/slack).  Fusebit provides a free-tier on their integration platform that works quite well for this use case.

With your Slack application working correctly, let’s see the next  steps in order to handle user interactivity in your carousel:

We need to *enable* [interactivity](https://api.slack.com/messaging/interactivity#components) in your Slack application. Navigate to your Slack application’s interactivity and shortcuts section and set up a request URL. Slack will send a POST request to this URL with interactivity details from a specific user action.

If you’re using Fusebit, the URL is located in your Slack Connector settings, under the *Events API Request URL*.  You will also want to specify the name of the Integration you want to handle the interactivity events as the “Default Event Handler”.  Save the configuration, and move on to the integration itself.

If you’re using your own application, you’ll need to configure a POST endpoint at a url, and perform the necessary authentication and authorization of the incoming request before processing the incoming interactivity event. [Learn how to do it](https://api.slack.com/messaging/interactivity#components)

## Handling interactivity

Now we know how to handle the first element, let’s see how to do it for the other items from the list.

We need to accomplish the following things:
  - Update pagination state in each navigation control.
  - Update the original slack message with the next or previous item (according to the clicked button).
  - Handle the user clicks on each navigation control.

### Updating pagination state in each navigation control

Parse the payload from the interactivity event and get the button value from the actions array. In our use case, it’s safe to assume that the action will always be an array of 1 item in our use case.

Let’s see how to accomplish circular navigation using the back and forth buttons assuming there are at least two items (An image carousel only makes sense if there are at least two items, otherwise, don’t use this UI pattern).

If you’re using Fusebit, the interactivity events are handled under the `immediate response` route, if you’re using your own endpoint, ensure you are handling that endpoint properly.

We’ll use Fusebit for this code, but the same code can be used directly in a KoaJS router, or with slight modifications (replacing `ctx` with `req` and `res`) in a classic Express app (after you implement the necessary authorization checks on the event, of course).


```javascript

router.post('/api/fusebit/webhook/event/immediate-response', async (ctx) => {
  const payload = JSON.parse(ctx.req.body.payload);
  const { actions, channel, response_url } = payload;
  const page = Number(actions[0].value);
  const prevPage = page === 1 ? ITEMS.length : page - 1;
  const nextPage = page === ITEMS.length ? 1 : page + 1;
  const carousel = buildCarousel(ITEMS[page - 1], page, prevPage, nextPage);

  await superagent.post(response_url, { channel: channel.id, ...carousel });
  
});

```


### Update the original slack message

If you noticed in our previous code example, we use the `response_url` coming from the interaction payload to publish messages back to the original Slack message where the interaction happened.[Read more about handling message responses](https://api.slack.com/interactivity/handling#message_responses)

We use the great [superagent](https://www.npmjs.com/package/superagent) library for our HTTP request - you can replace this with `request()` if you want to.

Play with your own Slack Image Carousel! [See the full source code example from Fusebit](https://api.us-west-1.on.fusebit.io/v1/run/sub-c2eaf0578e7140ca/share/share/edit?integrationId=slack-image-carousel-demo)


## Conclusion
Hopefully, you have a working Image carousel in your Slack workspace!
Slack block kit provides a powerful mechanism to build custom user interfaces. In this blog post, we covered how to use it to render navigation controls and how to handle user actions via the Slack interactivity feature. You probably realized how easy it is to build a Slack application using Fusebit; we’re looking forward to hearing from you, we’re happy to answer any questions you may have.

[Get Started for Free with Fusebit](https://manage.fusebit.io/signup?utm_source=fusebit.io&utm_medium=referral&utm_campaign=slack-interactive-image-carousel 'Install the bot CTA_SMALL')
