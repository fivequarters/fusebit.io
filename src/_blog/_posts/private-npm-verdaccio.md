---
post_title: Why Private Npm Registries Matter and How Verdaccio Makes It Easy
post_author: Shehzad Akbar
post_author_avatar: shehzad.png
date: '2022-02-10'
post_image: blog-private-npn-main.jpg
post_excerpt: Most developers really only write a fraction of the code that powers their applications, the rest of it comes from public registries like npm and yarn. While useful, you should consider setting up a private registry to protect against unforeseen circumstances and enhance collaboration across your team.
post_slug: private-npm-verdaccio
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-pagerduty-discord-main.png
---

##Why private npm registries matter##

Most developers really only write a fraction of the code that powers their applications. The rest of it is leveraged through public, freely available, and mostly open source libraries through tools such as npm and Yarn. 

The npm package ecosystem itself has [over 1.3 million packages]((https://blog.npmjs.org/post/615388323067854848/so-long-and-thanks-for-all-the-packages.html) and powers thousands of applications on the internet. This availability of high-quality and well-maintained packages has been critical in helping companies and their developers move fast while focusing exclusively on the code related to the core business problem they are solving. 

There is also a certain amount of risk associated with relying directly on libraries that companies lack direct control over. Additionally, for teams with larger codebases and diversified product lines, they will write libraries for internal use that they don’t want exposed to the public.

Having a private npm registry addresses these concerns and this is why [Fusebit also offers a private package registry](https://developer.fusebit.io/docs/private-package-registry) for all our customers and their integrations, out of box. 

However, there are also other open source tools out there, like [Verdaccio](https://verdaccio.org/), that are playing a large role in making it easy to set one up and get started. 

With Verdaccio, you’re able to:

* Use private packages to protect your internal libraries from public exposure
* Cache your registry to speed up build times and limit exposure from upstream changes
* Link multiple registries from different sources and consolidate them into one single endpoint

It also comes with a sleek web interface to help manage your packages and has built-in authentication that provides the ability to allow and restrict access to packages and scoped packages as needed.

##Getting Started with Verdaccio##

To get started, install it directly from npm with:

```
npm install -g verdaccio
```

Once installed, you can fire it up with the following CLI Command:

```
verdaccio
```

The default installation uses port 4873, but you can change the port by using ```verdaccio --listen 5000```

The installation will create a default [configuration file](https://verdaccio.org/docs/configuration) that leverages a local database and basic authentication. However, you can modify this file to: 

* Change storage location of your packages
* Define the plugins directory to extend Verdaccio
* Modify the proxy settings
* Define package access control settings
* Set your uplinks that will be used as fallback if packages aren’t available locally

Once set up, you will need to add a new user before you can publish. You will be asked to set up a new user with a login and password along with an email address. 

 ```
npm adduser --registry http://localhost:4873/
```
This will also automatically log you into Verdaccio with the newly created user and use those credentials when you deploy your package as well. 

##Deploying your Packages to the Registry##

Next, you will want to publish your package to the registry. For the purposes of demonstration, we’ll walk you through setting this up with an example package called ‘verdaccio-fusebit’.

First, create a new directory called ‘verdacio-fusebit’ and initialize a new npm directory using ```npm init -f ``` 

This will create the following json:

```
{
  "name": "verdaccio-fusebit",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Next, in your directory, create a new file called index.js which contains your module. It can even be something as simple as this Hello World function:

```javascript
function helloWorld() {
  console.log ("Hello world from Fusebit!")
}

module.exports = helloWorld;
```

Finally, you can publish to your registry by using:

```
npm publish --registry http://localhost:4873
```

NOTE: Make sure that you bump your package number everytime you publish, otherwise it won’t let you publish.

Head over to [http://localhost:4873](http://localhost:4873), and you will be able to see your newly published package!

![Verdaccio Package](blog-private-npm-plugin.gif "Verdaccio Package")

To access and install your new package in any project, simply use: 

```npm install --registry http://localhost:4873 verdaccio-fusebit```

If you want to set this registry as your default so you don’t have to pass in the registry flag everytime, you can do this through:

```npm set registry http://localhost:4873/```

##Deploying to the Cloud##

Verdaccio has support for [AWS](https://verdaccio.org/docs/amazon), [Kubernetes](https://verdaccio.org/docs/kubernetes), and [Docker](https://verdaccio.org/docs/docker) so you can easily deploy your registry to the cloud and scale quickly. To learn more about how to do this and integrate directly with your CI tools, go to [https://verdaccio.org](https://verdaccio.org).

Follow [https://twitter.com/fusebitio](@fusebitio) on Twitter for more developer-focused content including developer tools, APIs, and integrations.

