# Fusebit Website

## Getting started

1. Clone or fork this repo
2. `cd` into the project directory and run `npm install` or `yarn`

## Running and serving a dev build

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

---
post_title: string  (e.g Twilio, Segment, Github, and Auth0 are Setting a New Trend)
post_author: string (e.g Tomasz Janczuk)
post_author_avatar: string (e.g https://fusebit.io/tomek.png)
date: 'YYYY-MM-DD' (e.g '2019-07-04') | This prop will be used to order the collections of posts by date.
post_image: string (e.g https://fusebit.io/blog-buy-build-main.jpg) | The hero image of your post
post_excerpt: string (e.g It is 2019. A 250 person company uses an average of 123 SaaS applications...)
post_slug: buy-then-build-and-integrate | This prop will set the slug of the post, if omitted the slug will be generated from the title.
post_date_in_url: boolean | You can define if you want a date path in your url or not. If omitted defaults to `false`.
tags: string[] (e.g ['post', 'popular']) | The tags you want to set to an article, **'post' is always required when creating a blog post**.
---