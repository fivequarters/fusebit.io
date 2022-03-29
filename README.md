# Fusebit Website

## Getting started

1. Clone or fork this repo
2. `cd` into the project directory and run `npm install` or `yarn`

## Running and serving a dev build

Create a `.env` file:

```
INTERCOM_APP_ID=
BASE_URL=http://localhost:3001
CANONICAL_URL=http://localhost:3001
PORTAL_BASE_URL=https://manage.fusebit.io
CONNECTORS_FEED_URL=https://manage.fusebit.io/feed/integrationsFeed.json
```

Run the server:
```sh
npm run dev
```

or

```sh
yarn dev
```

Browse to [http://localhost:8080/index/](http://localhost:8080/index/).

## Running and serving a prod build

```sh
npm run prod
npm run serve:prod
```

or

```sh
yarn prod
yarn serve:prod
```

Browse to [http://localhost:5000](http://localhost:5000).

## Deploy in S3

1) Build the application

```sh
npm run prod
```

or

```sh
yarn prod
```

2) Upload `build` folder content into the bucket

```sh
aws s3 sync ./build s3://${bucket_name} --profile ${profile} --cache-control max-age=31536000
```

3) Refresh cloudfront (optional)
```sh
aws cloudfront create-invalidation --profile ${profile} --distribution-id ${cloudfront_id} --paths '/*'
```

## Technologies used

* [Eleventy](https://www.11ty.dev/)
* [PUG](https://pugjs.org/) as the templating language
* [Sass](https://sass-lang.com/) for writing CSS
* [Babel](https://babeljs.io/) for transpiling and polyfilling JavaScript
* [Autoprefixer](https://github.com/postcss/autoprefixer) for vendor prefixing CSS
* [Webpack](https://webpack.js.org/) for compiling the Sass and JavaScript assets
* [ESLint](https://eslint.org/) and [Airbnb's base configuration](https://www.npmjs.com/package/eslint-config-airbnb-base) for linting

## Project structure

```
src/
  _components/
    All UI partials
  _data/
    Eleventy data files
  _layouts/
    Base page layouts
  _pages/
    Each individual page template
  assets/
    css/
      index.scss
      All other scss files
    js/
      index.js
      All other js files
    images/
      All images used
    meta/
      Favicon, icons and manifest file
Configuration and build files
```

Files in `assets` will be handled by webpack, Eleventy will transform all of the directories with a leading `_`, and will copy across any `images`.

Eleventy’s output will be to a `build` directory at the root level.

## Blog
Everytime you want to add a post to the blog you should create a markdown file (.md) inside `src/_blog/_posts` folder and set these variables in the front matter. 

**All images should be added inside /src/assets/images/blog folder. When declaring the frontamatter (below section) only reference them by its name, without the full path.**
```
---
post_title: string | The title of the post  

post_author: string | The author name of the post 

post_author_avatar: string | The url of the author avatar image

post_authors: array of objects | The list of authors for a post. Each object in the list can have the following keys: `name` **required** and `avatar` **optional**. i.e `[{ name: 'Randall Tombaugh', avatar: 'randall.png' }, { name: 'Yavor', avatar: 'yavor.png' }]`

date: string | The date of the post with the following format: 'YYYY-MM-DD'. This prop will be used to order the collections of posts by date.

post_image: string | The url of the hero image of the post

post_excerpt: string | The post excerpt that's going to be shown in the blog homepage (/blog)

post_slug: string | This prop will set the slug of the post, if omitted the slug will be generated from the title.

tags: string[] | The list of tags you want to set to an article, **'post' is always required when creating a blog post**.

post_date_in_url: boolean | When setting this prop you can define if you want a date path in your url or not. If omitted defaults to `false`.

post_og_image: string | Could be `hero`, `site` or a custom url. `hero` will set the hero image of the post. `site` will set the default og image of the marketing site. If this prop is omitted it'll default to `hero`.

posts_related: string[] | A URL slugs list of the related posts. If ommited, the most recent posts will be displayed by default. It works with 1, 2 or a maximum of 3 values on the array.
---
```

### Full example:

```
---
post_title: The Role of Integrations in Building a Unicorn
post_author: Tomasz Janczuk // **Deprecated** use `post_authors` instead 
post_author_avatar: tomek.png // **Deprecated** use `post_authors` instead
post_authors: [{ name: 'Randall Tombaugh', avatar: 'randall.png' }, { name: 'Yavor', avatar: 'yavor.png' }]
date: '2019-08-26'
post_image: blog-interview-with-auth0-main.png
post_excerpt: We spoke with Eugenio Pace, the co-founder and CEO of [Auth0](https://auth0.com/), to get the scoop on his company's approach to integrations.
post_slug: interview-with-eugenio-pace-auth0-ceo
tags: ['post']
post_date_in_url: true
post_og_image: https://cdn.fusebit.io/twitter/twitter-orange.png
posts_related: ['nodejs-https-imports','run-every-nodejs-version-in-lambda','run-nodejs-from-google-sheets']
---
```

### How to add images?

```
![Semantic description of image](image.png "Image Title")
```

And if you want the image to have a shadow add the `with-shadow` prefix to the
semantic description of the image

```
![Semantic description of image with-shadow](image.png "Image Title")
```

### How to add videos?

It'll depend if the video is located locally or externally. This would be an example of a video added externally, from Youtube. For more details you can [take a look here](https://about.gitlab.com/handbook/markdown-guide/#videos)

```
<figure class="post__video">
  <iframe src="https://www.youtube.com/embed/enMumwvLAug" frameborder="0" allowfullscreen="true"> </iframe>
</figure>
```

And this is how you can do it with a video located locally (poster is not required).

```
<figure class="post__video" poster="path/to/poster_image.png">
  <video controls="true" allowfullscreen="true">
    <source src="path/to/video.mp4" type="video/mp4">
    <source src="path/to/video.ogg" type="video/ogg">
    <source src="path/to/video.webm" type="video/webm">
  </video>
</figure>
```

### How to add button links and normal links?

For a normal link, just add it like so:

```
[Your Text](https://yourlink.com)
```

For a button link, there are two size options, small and large.

To add a small button link, add a title with the word `CTA_SMALL`:

```
[Your Text](https://yourlink.com 'Install the integration CTA_SMALL')
```

To add a large button link, add a title with the word `CTA_LARGE`:

```
[Your Text](https://yourlink.com 'Install the integration CTA_LARGE')
```
