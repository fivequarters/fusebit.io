---
post_title: Signing JWT Securely From Your Browser Using WebCrypto
post_author: Matthew Zhao
post_author_avatar: matthew.png
date: '2022-03-25'
post_image: blog-jwt-webcrypto.png
post_excerpt: With the Web Crypto API, we have a large variety of untapped opportunities available to client-side SaaS Web applications!
post_slug: signing-jwt-from-browser-using-webcrypto
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-jwt-webcrypto.png
---

Traditionally we look at keying material as something that exists, primarily, serverside, or only in crafted scenarios with HTTPS client-side certificates. But, with the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API), we have a large variety of untapped opportunities available to client-side SaaS Web applications!

In this post, we will explore the basic mechanics of Web Cryptography API RSA key generation, creating PEM certificates for use with SSH or other environments, and how to use those keys to sign JWTs for web authentication.

But first - why would we want to do any of this?

## Why?

Traditional security measures in the browser started, in the dark ages, with Basic authentication using just a username and a password. Over the years, we’ve progressed from those humble beginnings to using cookies, secrets in the header, and eventually arrived at using JSON Web Tokens - for better or worse - as the defacto bearer token authentication mechanism.

These JWTs are issued via identity providers - Google, GitHub, Microsoft, Apple, and so forth - and are passed on each request back to the server.  The JWT is cryptographically validated and authorized for the requested resource on the server. But the issuer of the JWT remains locked behind the identity provider’s infrastructure.

By and large, this is a good thing - the user's browser is, despite many years of effort, the least defended and most vulnerable element of the system. Plus, each authentication system would also need to be configured to trust the browser in a way that is moderately unnatural for modern architectures, which consider themselves as the sole source of authorization truth.

## Delegated authorization models

Systems like AWS IAM, CI/CD, and the relationship between a user's browser and other local tooling like a CLI often handle authentication and authorization as independent channels. This isolation leads to user experiences that are less than ideal: having to manually copy secrets and client IDs from the browser into a hand-crafted configuration file for the AWS CLI, for example, or being unable to create lower-empowered accounts without substantial manual effort in the tooling.

## Locally-driven authentication

What if we supported creating authentication tokens with embedded authorization information directly in the browser? This would allow the browser to operate as an effective peer to traditional OAuth2 experiences, empowering other consumers on the local system to perform restricted operations.

This would allow us to:

  * Create our own JWTs from the browser that are suitable for less-trusted environments.
  * Keep key pairs in local storage for fast user authentication without having to perform OAuth2 round trips through an identity provider.
  * Perform API calls without having to request a key directly from a third-party system.

## A real-world example

Here at Fusebit, we use our ability to mint JWTs from the browser with local private keys to perform authorized API calls against our backend, without having to implement a wholly independent authorization mechanism. Additionally, these generated keys can live in OS protected spaces such as [Apple Keychain](https://developer.apple.com/documentation/security/certificate_key_and_trust_services/keys/signing_and_verifying) adding an additional layer of security over keys stored elsewhere.

Having a single code path to authorize an API call allows us to simplify our authentication and authorization code, and leverage the same mechanisms throughout our various platforms and integrations: CLI, web, and automation all use the same mechanisms.

# Implementation

Let’s look at the underlying code that enables this functionality within the browser.

## New key generation

First, let’s generate a new RSA 4kb key:

```typescript
const generatedKeyPair: CryptoKeyPair = await crypto.subtle.generateKey(
  {
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  },
  true,
  ['sign', 'verify']
);
```

This creates a RSA key, with a 4k modulus, that is suitable for use with for signing data and verifying existing signatures.

## Convert the key to PEM

We can then take the returned `generatedKeyPair` and convert it to PEM:

```typescript
function toPem(key: ArrayBuffer, type: 'private' | 'public'): string {
  const pemContents = breakPemIntoMultipleLines(arrayBufferToBase64(key));
  return `-----BEGIN ${type.toUpperCase()} KEY-----\n${pemContents}-----END ${type.toUpperCase()} KEY-----`;
}

// Let’s use the new toPem function to create PEM format strings for the privateKey and publicKey
const privateKeyBuffer: ArrayBuffer = await crypto.subtle.exportKey('pkcs8', generatedKeyPair.privateKey);
const privateKeyPem = toPem(privateKeyBuffer, 'private');

const exportedPublicKey: ArrayBuffer = await crypto.subtle.exportKey('spki', generatedKeyPair.publicKey);
const publicKeyPem = toPem(exportedPublicKey, 'public');
```

These PEM keys can be easily exported to the filesystem and used by a wide variety of tools such as `ssh` or `openssl`.

## Creating and signing a JWT

Signing a JWT requires creating an object in a specific format, and then signing it using the private key we’ve created earlier.  There’s lots of examples of JWT formats out there, so consider this code largely as an example, rather than prescriptive for all cases:

```typescript
export async function signJwt(
  tokenPayload: TokenPayload,
  issuer: Issuer,
  privateKey: CryptoKey,
  algorithmOptions: Record<string, string> = {}
): Promise<string> {
  const header = {
    alg: algorithmOptions.algorithm || 'RS256',
    typ: 'JWT',
    kid: issuer.publicKeys[0].keyId,
  };

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const neverEndingExpInSeconds = 9999999999;

  const payload: TokenPayload = {
    iss: issuer.id,
    iat: nowInSeconds,
    exp: neverEndingExpInSeconds,
    ...tokenPayload,
  };

  const stringifiedHeader = JSON.stringify(header);
  const stringifiedPayload = JSON.stringify(payload);

  const headerBase64 = uint8ArrayToString(stringToUint8Array(stringifiedHeader));
  const payloadBase64 = uint8ArrayToString(stringToUint8Array(stringifiedPayload));
  const headerAndPayload = `${headerBase64}.${payloadBase64}`;

  const messageAsUint8Array = stringToUint8Array(headerAndPayload);

  const signature = await crypto.subtle.sign(
    {
      name: algorithmOptions.name || 'RSASSA-PKCS1-v1_5',
      hash: algorithmOptions.hash || 'SHA-256',
    },
    privateKey,
    messageAsUint8Array
  );

  const base64Signature = uint8ArrayToString(new Uint8Array(signature));

  return `${headerAndPayload}.${base64Signature}`;
}
```
## To wrap up…

Hopefully, you’ll find the above code and implementation details helpful!  Don’t hesitate to reach out if you have any questions, and we’ll be happy to help push through.  You can find me on the [Fusebit Discord](https://discord.gg/SN4rhhCH), our [community Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg), and at [benn@fusebit.io](mailto:benn@fusebit.io).

[Fusebit](https://fusebit.io) is a code-first integration platform that helps developers integrate their applications with external systems and APIs. We used monkey patching ourselves to make our integrations better! To learn more, take [Fusebit for a spin](https://manage.fusebit.io/signup) or look at our [getting started guide](https://developer.fusebit.io/docs/getting-started)!

# Appendix:

Here’s a variety of utility functions used in the previous code examples:

```typescript
function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(arrayBuffer);
  let byteString = '';
  byteArray.forEach((byte) => {
    byteString += String.fromCharCode(byte);
  });
  return btoa(byteString);
}

function breakPemIntoMultipleLines(pem: string): string {
  const charsPerLine = 64;
  let pemContents = '';
  while (pem.length > 0) {
    pemContents += `${pem.substring(0, charsPerLine)}\n`;
    pem = pem.substring(64);
  }
  return pemContents;
}
function base64ToUint8Array(base64Contents: string): Uint8Array {
  base64Contents = base64Contents.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
  const content = atob(base64Contents);
  return new Uint8Array(content.split('').map((c) => c.charCodeAt(0)));
}

function stringToUint8Array(contents: string): Uint8Array {
  const encoded = btoa(unescape(encodeURIComponent(contents)));
  return base64ToUint8Array(encoded);
}

function uint8ArrayToString(unsignedArray: Uint8Array): string {
  const base64string = btoa(String.fromCharCode(...unsignedArray));
  return base64string.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
```
