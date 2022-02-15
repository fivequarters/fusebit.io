---
post_title: Run Every Node.js Version in AWS Lambda
post_author: Tomasz Janczuk
post_author_avatar: tomek.png
date: '2022-02-15'
post_image: everynode-banner.png
post_excerpt: Run any version of Node.js in AWS Lambda within hours after release using custom AWS Lambda runtimes from Fusebit
post_slug: run-every-nodejs-version-in-lambda
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/twitter-everynode.png
---

So you want to create an AWS Lambda function running the latest version of Node.js? Maybe you want to use the new [fetch()](https://fusebit.io/blog/node-fetch/) API? Or need that one feature of the latest V8? Or just deploy your next serverless app with the latest and greatest version?

Whatever the reason, you have a small problem - Amazon Web Services usually takes some time before adding support for new versions of Node.js. As of this writing, Node.js v18 is about to ship, and the latest version supported by AWS is v14.

Enter [fusebit/everynode](https://github.com/fusebit/everynode). Everynode allows you to:

- Run **any version of Node.js in AWS Lambda**,
- in any commercial AWS region,
- **within hours of the release of that Node.js version**.

<img width="689" alt="Run Any Node.js Version in AWS Lambda" src="https://user-images.githubusercontent.com/822369/153952823-df80628b-5d86-467c-b3a5-c4494e28a8b0.png">

## Quickstart

Let's deploy a _Hello, World_ Lambda function using Node.js 17.5.0 to us-west-1.

First, create the Lambda deployment package:

```bash
cat > function.js << EOF
exports.handler = (event, context, callback) => {
  callback(null, {
    message: "Hello from Node " + process.version
  });
};
EOF

zip function.zip function.js
```

Next, create the _hello17_ Lambda function in us-west-1 that uses a custom Lambda runtime with Node.js v17.5.0 provided by Fusebit:

```bash
# The ARN of the custom runtime layer containg Node.js 17.5.0 for us-west-1
LAYER=arn:aws:lambda:us-west-1:072686360478:layer:node-17_5_0:6

# Create a Lambda function using Node.js 17.5.0
aws lambda create-function --function-name hello17 \
  --layers $LAYER \
  --region us-west-1 \
  --zip-file fileb://function.zip \
  --handler function.handler \
  --runtime provided
  --role {iam-role-arn}
```

Last, call the function:

```bash
aws lambda invoke --function-name hello17 response.json
cat response.json
```

And voila, welcome to Node.js v17.5.0 function successfully deployed to AWS Lambda:

```json
{ "message": "Hello from Node v17.5.0" }
```

Read more at [fusebit/everynode](https://github.com/fusebit/everynode) to discover how to create a Lambda function using any other version of Node.js or region!

## How does it work?

The [fusebit/everynode](https://github.com/fusebit/everynode) project provides pre-built [AWS Lambda layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) that contain [custom AWS Lambda runtimes](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-custom.html) for every Node.js version >=11 running on Amazon Linux 2 in all commercial AWS regions. The layers are built and hosted by [Fusebit](https://fusebit.io) for all developers to use.

We constantly monitor for new Node.js releases and generally provide new AWS Lambda runtime layers in all AWS regions within six hours after release.

## What is Fusebit?

[Fusebit](https://fusebit.io) is a code-first integration platform that helps developers add integrations to their apps. The ability to run any version of Node.js in AWS Lambda is something we had to solve ourselves internally and decided to share the solution with all developers, free forever.

Check out the project at [fusebit/everynode](https://github.com/fusebit/everynode) to get involved, experiment, or report an issue.

Follow us on Twitter [@fusebitio](https://twitter.com/fusebitio) for announcements about the availability of new Node.js versions in AWS Lambda.
