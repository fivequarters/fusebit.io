---
post_title: Create Your First Node.js GitHub Action, a How-To Guide
post_author: Dawid Ziolkowski
post_author_avatar: dawid.png
date: '2022-05-19'
post_image: node-github-actions.png
post_excerpt: In this post, you'll learn what GitHub Actions are and how to create your first GitHub Action for your Node.js application.
post_slug: first-nodejs-github-action
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'github-search-api',
    'github-api-list-repositories',
    'integrate-github-api-everyauth',
  ]
---

GitHub Actions are becoming more and more popular. They are simple to use yet offer a lot of capabilities. Starting with GitHub Actions is relatively easy, and GitHub can even automatically recommend templates based on what's in your repository. In this post, you'll learn how to create your first Node.js GitHub Action. 

## What Are GitHub Actions?

Let's start from the beginning. What are GitHub Actions? Simply said, GitHub Action is a service that allows you to create automation workflows. Most commonly, GitHub Actions are used as a continuous integration and continuous delivery (CI/CD) tool, but you can define workflows that'll do pretty much anything you want. 

Long story short, to create a GitHub Action, you'll need to create a YAML definition file where you specify when and what your GitHub Action should do. Let's discuss this in more detail. 

![What Are GitHub Actions](github-actions-blocks.png "What Are GitHub Actions")

### Building Blocks

First, you need an event. An event is what triggers the workflow. Your workflow can start, for example, based on activity on your GitHub repository, schedule, or REST API call. You can, of course, also start your workflow manually. In total, there are over 30 different events you can use to trigger your workflow. The full list is available [here](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows). 

Once you have your trigger, you need to define what the workflow should do. For that, you can use either shell scripts or so-called actions. Shell scripts give you unlimited possibilities, but actions will help you save some time building your workflow because they are simple-to-use predefined scripts. With actions, you can simplify repetitive tasks like authenticating to your cloud provider or pulling your repository. 

You can further organize your actions and scripts into Jobs. For simple workflows, you can chuck everything into one job, but in more complex scenarios, you may have multiple jobs running in parallel or one after another. 

> With actions, you can **simplify repetitive tasks** like authenticating to your cloud provider or pulling your repository.

## Node.js + GitHub Actions

So, what can GitHub Action do with Node.js applications? Quite a lot. It all depends on what you want to achieve. 

Do you want to build and test your application? Build and publish a Node.js package to npm? Build and deploy to Azure, AWS, GCP, or another cloud provider? All of that (and more) is possible with GitHub Actions. 

How do you build a GitHub Action workflow for a Node.js application? You have two options. The first option is to start from an empty YAML file and define everything yourself. The second option is to go to your repository with your Node.js application and click on the "Actions" tab—GitHub will automatically propose Node.js-based example workflows for you. 

![Get Started with GitHub actions](github-actions-get-started.png "Get Started with GitHub actions")

So, if you want to get an idea of how GitHub Action works with Node.js applications, the best option to start is choosing the "Node.js" workflow from the "Suggested for this repository" section. As you can see from the screenshot above, this workflow will "Build and test a Node.js project with npm." To create your first GitHub Action, you can simply click on "Configure," and you'll be redirected to the GitHub editor: 

![GitHub actions workflow](github-actions-yaml.png "GitHub actions workflow")
 
A few things are happening here. First, at the top, you get a little bit of an explanation of what an Action will do. You'll also see a link to the ["Using Node.js with GitHub Actions"](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs) page, which we encourage you to check out. Then, you'll see the three main sections of the GitHub Action YAML definition file. First, you define the name of this GitHub Action, then you specify the triggers (on), and the rest (jobs) is the actual definition of what that GitHub Action will do. 

On the right side of the screen (next to the editor), you'll see two additional tabs: Marketplace and Documentation. The latter is a self-explanatory and very useful cheat sheet–type of document. The Marketplace, however, is a great and easy-to-use list of predefined actions: 

![GitHub actions marketplace](github-actions-marketplace.png "GitHub actions marketplace")

If you click on any Action that interests you, you'll see a short description and the instructions on how to use it: 

![GitHub actions instructions](github-actions-instructions.png "GitHub actions instructions")

Let's leave the extras for now and try to run our first GitHub Action. In order to do that, you need to commit the opened template first. You can do that by simply clicking "start commit" in the top right corner of the editor. All GitHub workflows are saved as YAML files in** .github/workflows/** directory. Once you commit the YAML file, your GitHub Action will be ready to use. In fact, if you didn't change the default trigger for this workflow, your Action will run immediately after your commit because the default trigger is "on commit." 

So, that's it! Congratulations! You got yourself a GitHub Action for your Node.js application. If you go to the "Action" tab in your repository, you'll now see the Action that we just created instead of the example Node.js Actions templates that GitHub proposes: 

![GitHub actions run](github-actions-run.png "GitHub actions run")
 
And when you click on the workflow run ("Create nodeaction.js.yml"), you'll see what happened exactly during that run:

![GitHub actions workflow](github-actions-workflow.png "GitHub actions workflow")

It's a start, but our GitHub Action currently doesn't do much. Let's add some more Actions to it. First, we want to know what the maintained LTS versions of Node.js are. For that, we can search the GitHub Action Marketplace, and by typing "Node LTS," you'll find a "Node LTS versions" action: 

![GitHub actions node](github-actions-node.png "GitHub actions node")

The description of that Action tells us to add the following code to our workflow's YAML definition: 

```yaml
- name: Node LTS versions
  uses: msimerson/node-lts-versions@v1.1.1
```

Let's do that. You can add it either as a new job or as an extra step in an existing **build** job. Let's add it to the existing step. You can add the code at any point in the **steps** section. The only thing you need to remember is that the new line starts from dash, so this is correct: 

```yaml
steps:
    - uses: actions/checkout@v3
    - name: Node LTS versions
      uses: msimerson/node-lts-versions@v1.1.1
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      env:
        FORCE_COLOR: 0
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
```

and the one below is not because we added our **Node LTS versions** action in between the parameters of the **Use Node.js (...)** action. 

```yaml
steps:
    - uses: actions/checkout@v3
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
    - name: Node LTS versions
      uses: msimerson/node-lts-versions@v1.1.1
      env:
        FORCE_COLOR: 0
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
```

Now let's add something even more useful: security scanning. This is very simple to do with GitHub Actions. Again, we'll use GitHub Actions Marketplace: 

![GitHub actions security](github-actions-secuirty.png "GitHub actions security")

This time, we will add the new Action as a new job. Therefore, we need to specify new job and add code provided by **nodejsscan** Action there: 

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [12.x, 14.x, 16.x]
    steps:
    - uses: actions/checkout@v3
    - name: Node LTS versions
      uses: msimerson/node-lts-versions@v1.1.1
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      env:
        FORCE_COLOR: 0
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test
  securityscan:
    runs-on: ubuntu-latest
    name: njsscan check
    steps:
    - name: Checkout the code
      uses: actions/checkout@v2
    - name: nodejsscan scan
      id: njsscan
      uses: ajinabraham/njsscan-action@master
      with:
        args: '.'
```

Now it's time to commit the GitHub Action YAML file and see if our new GitHub Action works as expected. For that, you can go again to the "Actions" tab in your repository and click on the latest workflow run. If everything went well, you should see all four jobs (four because we are executing the build stage three times for three versions of Node + our new security scan stage) with happy green checkboxes: 

![GitHub action commit](github-actions-commit.png "GitHub action commit")
 
You can click on the "security scan" block to see the details of the scan. You can also try to add another action to the security scan stage and send the report to your email. 

> In a matter of minutes, you can have automated **build**, **test**, and **security scanning** for your application.

## Summary

As you can see, GitHub Actions are quite easy to start with. They work well with Node.js applications and even come with many predefined Node.js templates. In a matter of minutes, you can have automated build, test, and security scanning for your application. But the fact that GitHub Actions are simple to use doesn't mean they have limited capabilities. In fact, you can create very complex workflows with GitHub Actions. There are plenty of triggers available, so you can create multiple actions for different purposes. GitHub Marketplace also offers plenty of easy-to-use templates for recurring tasks. 

Check out Fusebit. [Fusebit](https://fusebit.io) is a code-first SaaS integration platform for developers to add third-party integrations to their products or projects. It prioritizes developer experience at all levels, and its flexible, cloud-native architecture facilitates seamless deployment, and operation of your projects at scale.

_This post was written by Dawid Ziolkowski. [Dawid](https://medium.com/@dawid.ziolkowski) has 10 years of experience as a Network/System Engineer at the beginning, DevOps in between, Cloud Native Engineer recently. He’s worked for an IT outsourcing company, a research institute, telco, a hosting company, and a consultancy company, so he’s gathered a lot of knowledge from different perspectives. Nowadays he’s helping companies move to cloud and/or redesign their infrastructure for a more Cloud Native approach._
