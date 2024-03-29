---
post_title: Fusetunnel - A Fast, Scalable, and Free Tunnel
post_author: Lizz Parody
post_author_avatar: lizz.png
date: '2021-10-07'
post_image: blog-fusetunnel-main.png
post_excerpt: Fusetunnel is end-to-end encrypted, giving a developer greater security for sharing your localhost app.
post_slug: fusetunnel-fast-scalable-and-free-tunnel
tags: ['post','developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-fusetunnel-social-card.png
---

There are many times where we want to expose localhost apps with the world, either for testing purposes, to show progress, demo websites or run personal cloud services from your home. [Fusetunnel](https://github.com/fusebit/tunnel) helps you to do this easily! No need to mess with DNS or deploy to have others test out your changes.

Fusetunnel, a Localtunnel alternative, is great for working with browser testing tools like Browserling or external API callback services like Twilio, which require a public URL for callbacks.

Fusetunnel is Fusebit’s version of [localtunnel](https://github.com/localtunnel/localtunnel).

The main difference with localtunnel (and other tunnels) is that Fusetunnel is **end-to-end encrypted**, giving the user greater security, promoting data protection, and preventing unauthorized access to data.

And it’s free!

Compared to ngrok, an alternative paid product, Fusetunnel doesn't have rate limiting, so you can send as much traffic as you want through it.

## How does Fusetunnel work? 

Let's say that you have this simple hello world Node.js app:

![Simple Node.js Hello World](blog-fusetunnel-hello-world.png "Simple Node.js Hello World")

To get the tunnel server and share your website or web service, first, you have to install it with the following command in your terminal:

`npm i -g @fusebit/tunnel`

Then run:

`ft -p 3000`

This will give you a public unique URL ready to share with the world! No more sharing localhost links by accident 😜.

![Run the command ft -p <backend-service-port>](blog-fusetunnel-ft-command.png "command to get your public URL")

You can also run the quickstart command `npx ft --port 3000` instead.

Open the random URL, and voila! You can share a remote server and more.

![Public URL](blog-fusetunnel-url.png "public localhost URL ready to share and test")

Now you have a fully encrypted and secure tunnel to the internet, you can also create custom domains.

### Before you go…
If you want to build and test integrations for your application without the hassle, visit [fusebit.io](https://fusebit.io/).  Our code-first integration platform and SaaS connectors remove the headaches of dealing with different APIs and eliminate the operational burden when running at scale.
