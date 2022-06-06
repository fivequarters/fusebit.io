---
post_title: Is Remix the Next-Gen React Framework You Should Use?
post_author: Samuel Torimiro
post_author_avatar: samuel.png
date: '2022-05-27'
post_image: remix-react-framework.png
post_excerpt: Remix JS is a full stack web framework that lets you build fast, slick, and resilient websites. It is one of the newer web frameworks built on React.
post_slug: remix-react-framework
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related: ['new-express-5-features', 'everyauth', 'integrate-github-api-everyauth']
---

[Remix](https://remix.run/), the recent full-stack framework built on top of React, can serve as your data fetching library, router, and bundler. Its distributed web architecture means two things: it’s fast, and it can run anywhere.

The features Remix offers can provide great developer experience (DX) and user experience (UX) while extending the functionality of React. But, of course, you do have other options for React frameworks. Should you choose Remix for your projects?

This article will help you decide. The following is a comparison between Remix and other frameworks such as Next.js and Gatsby, based on factors such as routing, data fetching, and serving speeds. With this information, you can choose the best framework for your use case.

## Remix vs. React

React, as well as other JavaScript libraries and frameworks, enables you to build client-side rendered (CSR) applications. When a user visits your web application for the first time, they get a blank page while they wait for JavaScript to process other necessary features for them to see. This can lead to poor user experience (UX). Additionally, you can’t get search engine optimization (SEO) from processing your HTML from the client.

Remix renders your HTML on the server and then sends the response to the browser so that you get great SEO out of the box. Since the HTML pages are loaded on the server, users don’t have to wait to see something tangible on the screen.

Remix goes even further by helping you handle forms for mutations and data fetching, among other features, which can be complicated in React.

## Remix vs. Other React Frameworks

Other React frameworks can help build performant React applications. One of the most popular frameworks is Next.js due to the additional features it provides out of the box. Remix, though, offers some unique features that make it worth learning.

The following is a comparison between Remix and other frameworks based on how they handle routing; static site generation (SSG) and server-side rendering (SSR); data fetching; form handling; cookie and session support; and error, race condition, and interruption handling.

### Routing

Routing, or the process of navigating between different pages in a website, is an important function since websites generally consist of multiple pages that render either static or dynamic content.

Both Remix and Next.js support a file-based route, in which you create a file and it can immediately be accessed via your browser. Once you bootstrap a new project in Remix, for instance, you can create a new file inside the `routes` folder. Both frameworks also support client-side route navigation—meaning a user can visit a page without refreshing the browser—and dynamic routes. In Remix, a `$` symbol before the name of the file serves as the named parameter.

Where Remix stands out is its use of nested routes. Next.js does support [nested routes](https://nextjs.org/docs/routing/introduction#nested-routes) from a file standpoint, but Remix allows you to create a hierarchy of routes in which each route is a separate file that can determine where its children should be displayed. This means you can have multiple routes active on a page.

> Note: a route in Remix is a file that exports a component.

For example, say you have a route `articles.jsx`:

```js
import { Outlet } from "@remix-run/react";

export default function Articles() {
  return (
    <div>
        <h1>This is the articles route<h1>
        <Outlet />
    </div>    
  );
}
```

You can create a folder called `articles`, and each file inside that folder can be nested inside the `Outlet` stated in the `articles.jsx` file, which is the parent route.

Say you create a file inside the `articles` folder called `new.jsx`. If you navigate to `/articles/new`, the `Outlet` found in the parent route will be replaced by the content found inside the `new.jsx` route.

### Static Site Generation and Server-Side Rendering

SSG runs your code on build time and can be shipped to a content delivery network (CDN) to speed up website delivery to users. SSG can be problematic with dynamic content, though. Also, rebuilding the site on each change can be time-consuming, especially when there are lots of static files and assets.

If you deploy web applications on the edge, meaning in different regions worldwide using services like [Cloudflare Workers](https://workers.cloudflare.com/), [Deno Deploy](https://deno.com/), and [AWS Lambda](https://aws.amazon.com/lambda/), SSG becomes less important since the data is near to the user.

Remix focuses on SSR, meaning it loads data on the server, sends back the full HTML file to the browser, and deploys it to the edge. With edge computing, which is generally cost-effective, SSR can be as fast if not faster than SSG.

Next.js still recommends that you build static pages with SSG and dynamic content with SSR. This is similar to [Gatsby](https://www.gatsbyjs.com/), another React framework for creating static-site-generated pages. However, since you can run Remix on the edge plus have fresh data, you don’t need to use SSG with Remix. Not until Next.js version 12 could you run your server-side-rendered web apps on the edge using [edge functions](https://vercel.com/docs/concepts/functions/edge-functions).

SSG was introduced because servers were slow, but this is not the case anymore.

### Data Fetching

To make your website dynamic, you get data from a database or from an API that’s either created internally or obtained from a third-party provider. Remix simplifies this process for you.

Since Remix runs your code on the server, data is also fetched there. This is defined using a special function called `loader`. Because the data is fetched on the server, you can manipulate what you send back to the browser. Since you don’t have to send all the data, you can modify it the way you want and send only what’s needed back to the client. This improves UX because it decreases the total amount of data transmitted.

For instance:

```js
import { json } from "@remix-run/{runtime}";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  return json([
    { id: "1", title: "First Title" },
    { id: "2", title: "Second Title" },
  ]);
};

export default function Articles() {
  const articles = useLoaderData();
  return (
    <div>
      <h1>Articles</h1>
      {articles.map((articles) => (
        <div key={articles.id}>{articles.title}</div>
      ))}
    </div>
  );
}
```

In the above code, the `loader` function gets the data and `useLoaderData` accesses the data from the component, all running on the server.

> Note: the default function found in a route is always the component.

In contrast, Next.js provides several ways of loading data to your component, such as using `getStaticProps` or `getServerSideProps`.

### Form Handling

When creating a web application, you’ll need a way to mutate data. Remix makes this simple because it understands how the browser handles forms.

Unlike other React frameworks, Remix follows native browser features, meaning that you don’t need JavaScript to submit a form. Instead, Remix only uses JavaScript to enhance form submission.

Here’s an example of a form in Remix:

```js
import { Form } from "@remix-run/react";


  return (
    <Form method="post">
        <input type="text" name="title" />
        <input type="text" name="body" />
        <button type="submit">Create</button>
    </Form>
  );
}
```

Remix has a special `<Form>` tag that does what the native `<form>` element does in HTML, with some JavaScript enhancement. This means it understands form submission and can serialize and eventually submit the form. Additionally, Remix offers an `action` function in the same file. It’s responsible for getting the request and processing the form data, which also runs on the server:

```js
import { redirect } from "@remix-run/{runtime}";

export async function action ({ request }) {
    const body = await request.formData()
    const article = await createPost(body)
    return redirect('/articles')
}
```

In the above code, the native [request object](https://developer.mozilla.org/en-US/docs/Web/API/Request) from the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) gets the form data submitted from the browser. Once you get the form data, you can do whatever you want with it. This code shows a function called `createPost` and redirects the user to another page using the `redirect` function provided by Remix.

In Next.js, to enhance form submission with JavaScript, you’d have to use the `event.preventDefault()` function and then use JavaScript to send a POST request to submit the form data. Remix saves you those extra steps, allowing you to submit the form using the **Submit** button. Forms in Remix can work without being JavaScript enabled.

### Cookie and Session Support

Without the help of cookies and sessions, it can be impossible to keep track of specific users. For example, if you have an authentication feature in your web application, your server can send a cookie to the browser once a user has successfully logged in.

Remix supports managing cookies and sessions out of the box, using several APIs: `createCookie`, `isCookie`, `createCookieSessionStorage`, and `isSession`. With Next.js, however, you need a third-party service like [nookies](https://github.com/maticzav/nookies) to manage this for you.

### Error, Race Condition, and Interruption Handling

Each route in Remix can have an error function called `ErrorBoundary`. If a child component renders an error, it won’t crash the application; the error will only be shown for the child component while the parent works as expected. This is because each file is independent of the others due to nested routes.

If an error occurs on the server in Next.js on a particular route, it throws a 500 error code, causing the whole UI to be non-functional.

Here’s an example of an error boundary function in a Remix route:

```js
export function ErrorBoundary({ error }) {
    return (
        <div>
            <p>{error}</p>
        </div>
    )
}
```

If there is no error boundary function in the route module, it bubbles up to the top to use the next error boundary it can find. This means errors can become contextual. Remix catches errors both on the client and server, unlike React, which only catches errors on the client.

Furthermore, race conditions can occur when you’re trying to make multiple POST requests at once. Remix by default takes care of this for you, so there’s no need to worry about stale data.

## Conclusion

Both Remix and Next.js offer powerful React frameworks for your projects. Remix, however, stands out from Next.js in how it deals with nested routes, form handling, support for cookies, and error handling.

Once you’ve chosen a framework, you’ll need to focus on building your code and your integrations. [Fusebit](https://fusebit.io/) can help you do both. The cloud-native software-as-a-service (SaaS) platform enables you to quickly and easily implement integrations in your products. It’s scalable, flexible, and seamless, and it automates everything from health checks to alerts. Fusebit is an excellent way to improve your DX.

For more developer content, be sure to follow [@fusebitio](https://twitter.com/fusebitio) on Twitter.
