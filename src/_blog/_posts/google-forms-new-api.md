---
post_title: Google Forms New API Using Node.js
post_author: Rubén Restrepo
post_author_avatar: bencho.png
date: '2022-03-04'
post_image: google-form-api-nodejs.png
post_excerpt: Google Forms API is currently in open beta. Learn what you can do and how to do it using Node.js even before Google supports their Node.js SDK.
post_slug: google-form-using-nodejs
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/google-form-api-nodejs.png
---

Google Forms are undoubtedly a popular way to create online forms and surveys, and they’re easy to make, share and analyze. Introducing an API just makes sense given the popularity of the service and the needs Google Forms is solving.

With an API, you will be able to customize how you export your forms responses to other systems like Airtable, your Slack, or dynamically create forms on the fly from other systems.

The Google Forms API is currently in Open Beta, but you can already interact with it by applying to the [Early Adopter Program](https://developers.google.com/forms/api/eap).

Usually, approval to the Early Access program takes up to 5 days after you submit the form.
Once generally available, the Google Forms API SDK will be part of the [official Google APIs Node.js package](https://www.npmjs.com/package/googleapis).

Once you have access to it, ensure you have configured a [Google Cloud](https://cloud.google.com) Project with the proper credentials, in this blog post, the code examples will be using an OAuth 2.0 client access token.


The Google Forms API supports the following RESTful endpoints:

Reading form content
  * Questions
  * Options

Reading form settings and metadata
  * Title and description
  * Quiz settings
  * Correct answers (quiz answer key)
  * Point values
  * Feedback

Push notifications
  * Receive notifications when data changes in forms

In this blog post, we will use the RESTful interface to interact with the API. We will update the content once the Node.js SDK is officially released. 

If you want to receive a notification once Google Forms API reaches General Availability, 
<a class="cta_small" href="https://manage.fusebit.io/signup?utm_source=fusebit.io&utm_medium=referral&utm_campaign=google-forms-new-api">sign up to Fusebit for free</a>.

We will be using the popular Node.js Library `superagent` to perform the requests.

## Creating a new Form

Creating a new form only requires the form title, then you add form contents via an update to the created form.

Let’s see how you can create a new form:

```javascript
const programmingLanguagesForm = await superagent
   .post("https://forms.googleapis.com/v1beta/forms", {
       info: {
           title: "Your favorite programming language",
       },
   })
   .set("Authorization", `Bearer ${access_token}`);
  const { responderUri } = programmingLanguagesForm.body;
  console.log(`New Form created:: ${responderUri}`);

```

## Add Form items

Now you have created a new form, let’s add items to it. One easy trick is to design your form elements in the [Google Forms UI](https://www.google.com/forms/about/) itself as a guide to understanding the shape of the components you will add to it.

If you aren’t familiar with Google APIs, the request body will look weird at first glance since, despite it being a RESTful interface, it follows [gRPC Transcoding](https://google.aip.dev/127) syntax.
 
You will send a POST request to the `batchUpdate` endpoint. it’s called a `batchUpdate` because it can perform several changes to the Form in the same request:

* Add a new Form Item(s)
* Delete an existing form item(s)
* Update a current form item(s)

```javascript
const updatedForm = await superagent
  .post(`https://forms.googleapis.com/v1beta/forms/${formId}:batchUpdate`, {
    requests: [
      {
        createItem: {
          item: {
            title: "The C programming language",
            description: "Watch the history of the C programming language",
            videoItem: {
              video: {
                youtubeUri: "https://www.youtube.com/watch?v=de2Hsvxaf8M",
              },
            },
          },
          location: {
            index: 0,
          },
        },
      },
    ],
  })
  .set("Authorization", `Bearer ${access_token}`);
```

The created form will look like this

![Google Forms API Node.js with-shadow](blog-google-form-nodejs.png 'Google Forms API Node.js')

Now let’s add more items to the previous form

```javascript
const updatedForm = await superagent.post(`https://forms.googleapis.com/v1beta/forms/${formId}:batchUpdate`, {
    requests: [
      {
        createItem: {
          item: {
            title: "The C programming language",
            description: "Watch the history of the C programming language",
            videoItem: {
              video: {
                youtubeUri: "https://www.youtube.com/watch?v=de2Hsvxaf8M"
              }
            }
          },
          location: {
            index: 0
          }
        }
      },
      {
        createItem: {
          item: {
            title: "What's your favorite programming language",
            questionItem: {
              question: {
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: 'Java' },
                    { value: 'Python' },
                    { value: 'JavaScript' },

                  ]
                }
              }
            }
          },
          location: {
            index: 1
          }
        }
      },
      {
        createItem: {
          item: {
            title: "Do you have experience with JavaScript programming language?",
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'DROP_DOWN',
                  options: [
                    {
                      value: 'yes',
                    },
                    {
                      value: 'No'
                    }
                  ]
                }
              }
            }
          },
           location: {
            index: 2
          }
        }
      }
    ]
  })
    .set('Authorization', `Bearer ${access_token}`);

```

The form will look now like this

![Google Forms API Node.js with-shadow](blog-google-form-api.png 'Google Forms API Node.js')

As you may have noticed from the previous code example, there are different types of items you can add:

* textQuestion
* textQuestion with paragraph
* textQuestion with multiple choice
* choiceQuestion of type CHECKBOX
* choiceQuestion of type DROP_DOWN
* fileUploadQuestion
* scaleQuestion
* questionGroup of type RADIO
* questionGroup of type CHECKBOX
* dateQuestion
* timeQuestion


## Conclusion

Google Forms API will open lots of possibilities. Once the API reaches GA this year, we're looking forward to it so everyone can use it without applying to the Early Access Program.

Here are a few examples of what you will be able to do with the forms API:

### Form questions

* Export Form questions and responses to third-party tools like [Airtable](https://www.airtable.com/)
* Import Form questions in Advanced surveys tools like [Polly](https://www.polly.ai/)

### Form Responses

* Receive notifications for new form responses in a Slack channel.
* Create rich infographics from quiz responses in a third-party tool like [Tableu](https://www.tableau.com/)
* Integrate with better reporting tools to analyze responses like [Microsoft Power BI](https://powerbi.microsoft.com)

### Form Management

* Create new forms dynamically from third-party tools, like an LMS (Learning Management System).
* A Slack bot that allows you to list and edit forms questions.
* Add questions, point values, correct answers
* Import questions from a third-party system into Google Forms like [SurveyMonkey](https://www.surveymonkey.com/)

## Before you go...

If you are a developer looking to create flexible and powerful integrations using other SaaS platforms or tools, check out [Fusebit](https://fusebit.io/) and follow us on [Twitter](https://twitter.com/fusebitio)!
