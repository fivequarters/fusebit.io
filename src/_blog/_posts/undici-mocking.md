---
post_title: Mocking With Undici Like a Pro
post_author: Yavor Georgiev
post_author_avatar: yavor.png
date: '2022-01-13'
post_image: blog-undici-mocks.jpg
post_excerpt: This post goes into detail into Undici's mocking support, which enables you to write fast and reliable unit tests.
post_slug: undici-mocking
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/twitter-undici-mocks.jpg
---

Undici is a fast, reliable, and spec-compliant HTTP/1.1 client that is written from scratch and represents the evolution of the Node.js HTTP stack. It is quickly becoming one of the most popular packages out there, with almost half a million weekly [downloads on npm](https://www.npmjs.com/package/undici). And if you don’t believe us, check out [this tweet](https://twitter.com/matteocollina/status/1471164160721539076) from Node.js TSC member Matteo Collina.

Because Undici re-invents HTTP primitives and relies directly on sockets, our established mocking approaches like Nock [no longer work](https://github.com/nock/nock/issues/2183). Luckily, Undici comes with its own built-in mocks, so we can still write unit tests against it. This post goes into detail into Undici’s mocking support, walking you through specific use-cases and examples.

## Unit-testing setup

First, let’s set up a simple example of a client class that consumes a remote dog facts API. We will have two methods: `getBreeds` returns a list of breeds and `getBreedImages` returns a list of images, taking the breed as a parameter.

```javascript
const { request } = require('undici');

module.exports.getBreeds = async () => {
  const { body } = await request('https://dog.ceo/api/breeds/list/all');
  const data = (await body.json()).message;
  return data;
};

module.exports.getBreedImages = async (breed) => {
  const { statusCode, body } = await request(
    `https://dog.ceo/api/breed/${breed}/images`
  );

  let data = (await body.json()).message;
  if (statusCode == 404) {
    let e = new Error(data);
    e.code = 'BreedNotFound';
    throw e;
  }
  return data;
};
```

Using [Mocha](https://mochajs.org) as our testing framework of choice, here are three example unit tests that verify the expected functionality of those two methods.

```javascript
const { getBreeds, getBreedImages } = require('./dog-client');
const assert = require('assert');

describe('DogClient', function () {
  describe('#getBreeds()', function () {
    it('should return an object containing list of breeds', async function () {
      const breeds = await getBreeds();
      assert.ok(breeds.hound);
      assert.ok(breeds.chihuahua);
    });
  });
  describe('#getBreedImages()', function () {
    it('should return an array of images for known breeds', async function () {
      const images = await getBreedImages('hound');
      assert.ok(images[0].startsWith('https://'));
      assert.ok(images[0].endsWith('.jpg'));
    });
    it('should throw an error for unknown breeds', async function () {
      try {
        const images = await getBreedImages('half-chimpanzee-half-elephant');
      } catch (e) {
        assert.equal(e.code, 'BreedNotFound');
      }
    });
  });
});
```

These tests work great, assuming the underlying web service [https://dog.ceo/api](https://dog.ceo/api) is up and responding promptly. However as we all know, networks are frequently unpredictable, which can wreak havoc on unit tests, causing timeouts and false negatives. That’s where mocking comes in; assuming the responses coming from the web service are fairly stable, we can replace it with an in-memory mock, whose responses are always fast and predictable.

## Undici’s mocking support

Many HTTP mocking frameworks, including [Nock](https://github.com/nock/nock), work by intercepting HTTP requests using Node.js built-in HTTP stack. However, Undici seeks to evolve and re-imagine that stack, and therefore does not rely on any of its modules, but relies directly on raw sockets. That’s why frameworks like Nock [do not work with Undici](https://github.com/nock/nock/issues/2183), and that’s why it needs its own mocking support.

You will likely want to grab the latest version of the Undici module, but anything above version 4 will do, since that’s when the mocking support first shipped.

The basic entrypoint into the mocking system is the [`MockAgent` class](https://undici.nodejs.org/#/docs/api/MockAgent), which has a [`get()` method](https://undici.nodejs.org/#/docs/api/MockAgent?id=mockagentgetorigin) returning a [`MockCilent`](https://undici.nodejs.org/#/docs/api/MockClient) or [`MockPool`](https://undici.nodejs.org/#/docs/api/MockPool) instance, depending on the number of connections specified in the `MockAgent` constructor (`new MockAgent({ connections: 1 })` results in `MockClient`). This behavior is analogous to the non-mocked counterparts of those classes.

To use an instance of `MockAgent`, you pass it to the global static `setGlobalDispatcher()` method, which basically tells it which dispatcher to use: real or mocked.

Now that we have Undici using a `MockAgent`, the last remaining piece is to actually build the mock that will serve as the in-memory replica of the remote web service. For that, we use the [`intercept()`](https://undici.nodejs.org/#/docs/api/MockClient?id=mockclientinterceptoptions) method on `MockClient` or `MockPool`. The method takes an object with a `path` and a `method` that tells it what requests to match (you can also match on `headers` and `body`), then you chain a [`reply()`](https://undici.nodejs.org/#/docs/api/MockPool?id=return-mockinterceptor) method where you do the work of actually responding in lieu of the service.

Let’s see how this works for our example.

## Putting it together

Our test method stays unchanged, with the addition of the following at the top, which plugs in our `DogClientMockAgent`:

```javascript
const DogClientMockAgent = require('./dog-client-mock.js');
const { setGlobalDispatcher } = require('undici');

setGlobalDispatcher(DogClientMockAgent);
```

The implementation of `DogClientMockAgent` is where you will need to do the bulk of the work. Unlike other mocking frameworks, I couldn’t find a way for Undici to record some real requests and generate the mocks for me, so I had to create those from scratch:

```javascript
const { MockAgent } = require('undici');
const Breeds = require('./breeds.json');

const agent = new MockAgent();
agent.disableNetConnect();

const client = agent.get('https://dog.ceo');
client
  .intercept({
    path: '/api/breeds/list/all',
    method: 'GET',
  })
  .reply(200, {
    message: Breeds,
    status: 'success',
  });

function isValidBreedImagePath(path) {
  const match = /\/api\/breed\/([\da-z-]*)\/images/.exec(path);

  // If the overall path matched and the specific breed they specified was known
  return match && Breeds[match[1].toLowerCase()] != null;
}

// Success case when a valid breed is passed
client
  .intercept({
    path: isValidBreedImagePath,
    method: 'GET',
  })
  .reply(200, {
    message: [
      'https://images.dog.ceo/breeds/hound-walker/n02089867_149.jpg',
      'https://images.dog.ceo/breeds/hound-walker/n02089867_1504.jpg',
      'https://images.dog.ceo/breeds/hound-walker/n02089867_1504.jpg',
    ],
    status: 'success',
  });

// Error case when an invalid breed is passed
client
  .intercept({
    path: (path) => !isValidBreedImagePath(path),
    method: 'GET',
  })
  .reply(404, {
    message: 'Breed not found (master breed does not exist)',
    status: 'error',
    code: 404,
  });

module.exports = agent;
```

By default, `MockAgent` will pass through any calls it cannot match via an `intercept()` method into real HTTP requests, which can make debugging tricky since you don’t know if you’re getting your response from the mock or the real remote web service. The [`MockAgent.disableNetConnect()` property](https://undici.nodejs.org/#/docs/api/MockAgent?id=mockagentdisablenetconnect) disables that behavior and forces the agent to throw an error when matching fails, making debugging much easier.

Here are a couple of quirks and limitations I noticed along the way:

- `MockAgent.get()` can only take a base URL with no additional path segments attached to it, so for example supplying [https://dog.ceo](https://dog.ceo) works great, but [https://dog.ceo/api](https://dog.ceo/api) throws an unhelpful `InvalidArgumentError: invalid url`
- The `path` passed as part of [the options object](https://undici.nodejs.org/#/docs/api/MockPool?id=parameter-mockpoolinterceptoptions) you pass to `MockClient.intercept()` can be a literal path string, but also a `Regex` and even a function that Undici will use to match incoming requests by their path. Initially I got excited about that, until I realized that there is no way to access any of the matched values in the `reply()` method… so it’s not possible to return a different reply based on the request path. In my example, I wanted to return an error when an invalid value is supplied via the path. The workaround here is to create multiple interceptors… one for each case you want to test. It looks a bit clunky, but does the job.
- Another quirk on the `path` property is that it needs to start with `/`, otherwise the path will not match and you will get an error along the lines of `UND_MOCK_ERR_MOCK_NOT_MATCHED`.

## Conclusion

I hope you enjoyed this introduction on how to build reliable Undici unit tests using mocks. The full code of this example is [available here](https://gist.github.com/yavorg/49551a0b34522791ef4b2192dda51fb4). There are many further details to cover when it comes to Undici mocking, so please let us know via [@fusebitio](https://twitter.com/fusebitio) on Twitter if you’d like to see another post on the topic.
