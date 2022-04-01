---
post_title: Generate WebAssembly With AssemblyScript, a TypeScript-like language
post_author: Rubén Restrepo
post_author_avatar: bencho.png
date: '2022-03-31'
post_image: assembly-script-main.jpg
post_excerpt: Learn how to write WebAssembly code with the familiarity of a TypeScript-like language, create low-level code with the existing web ecosystem you already know.
post_slug: generate-web-assembly-with-typescript
tags: ['post', 'developer tools', 'node.js']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/assembly-script-main.jpg
posts_related: ['node-testing-comes-to-core', 'key-generation-webcrypto', 'api-monitoring-and-alerting']
---

[WebAssembly](https://webassembly.org/), also referred as Wasm, is a binary format created for the web. It allows you to access browser functionality through the same Web APIs accessible from your regular JavaScript. One of the biggest promises of WebAssembly is efficiency and velocity, aiming to run at [near-native performance speed](https://webassembly.org/docs/portability/#assumptions-for-efficient-execution) safely by respecting the permissions security policies of the browser.

Despite its web nature, WebAssembly can also run in [non-web](https://webassembly.org/docs/non-web/) modes, such as servers, IoT devices, Mobile/Desktop applications, taking into account some web features will not be available.

While the four major browsers currently support WebAssembly - Firefox, Chrome, Safari, and Edge - some features are fully supported.
[Checkout](https://webassembly.org/roadmap/) if your browser already supports some features (check your browser column). See specific browser version support via [caniuse](https://caniuse.com/wasm).

You can use different programming languages to produce WebAssembly, from JavaScript to Haskell. You can even use Python in the browser with [pyodide](https://pyodide.org).

## Why WebAssembly

There are many compelling use cases. Wasm opens the doors to porting computational heavy stuff to the web:
- Image and video manipulation
- Music streaming
- Games
- Emulators
- Compilers
- CAD applications
- VR applications
- VPN
- Encryption

You can even run Doom from the browser using Wasm: 🤯
- [Running Doom in Grafana](https://grafana.com/blog/2022/03/31/can-grafana-run-doom/)
- [Multiplayer Doom on Cloudflare workers](https://blog.cloudflare.com/doom-multiplayer-workers/)

[And many more](https://webassembly.org/docs/use-cases/)...

In this blog post, we will learn how to use a variant of TypeScript to produce WebAssembly and communicate with it using JavaScript, just from your browser! We will be using [AssemblyScript](https://www.assemblyscript.org/).

## Why AssemblyScript

As we already mentioned, you can target Wasm with different programming languages, even JavaScript.

If you work with JavaScript and Node.js, there is a high possibility you are using [TypeScript](https://www.typescriptlang.org/). According to the State of JS Survey from 2021, [69% of developers are using it today](https://2021.stateofjs.com/en-US/conclusion/). One of TypeScript’s main advantages is that it adds statically typed support to JavaScript.

JavaScript developers feel more natural and frictionless to keep using a language similar to TypeScript for generating Wasm; this is where AssemblyScript comes into play.

## Writing AssemblyScript

AssemblyScript code will look similar to TypeScript. No worries if you are not familiar with it. I promise you will get it if you’re already familiar with JavaScript.

The main difference between regular TypeScript and AssemblyScript is the typings. AssemblyScript uses [WebAssembly types](https://www.assemblyscript.org/types.html).

Let’s understand the difference with the following example:

This is a non-portable AssemblyScript code that is not 100% accurate with TypeScript:

```typescript
let someFloat: f32 = 1.5
let someInt: i32 = <i32>someFloat
```
In TypeScript, all numeric types are aliases of `number`, so there is no distinction between these numeric types. 

The generated portable TypeScript code using AssemblyScript compiler will be:

```typescript
let someFloat: f32 = 1.5
let someInt: i32 = i32(someFloat)
```

After compiling the code with the regular typescript compiler, the result will be:

```javascript
var someFloat = 1.5
var someInt = someFloat | 0
```

[Read more about code portability on assemblyscript.org](https://www.assemblyscript.org/compiler.html#portability)

You can write AssemblyScript in two different ways:
- Standard library
- Low-level WebAssembly

These approaches are not mutually exclusive, and you can mix both of them according to your needs.

### Standard Library

AssemblyScript provides a standard JavaScript-like [standard library](https://www.assemblyscript.org/stdlib/globals.html) similar to those used by JavaScript.

```typescript
// It takes in two 32-bit integer values
// And returns a 32-bit integer value.
export function addInteger(a: i32, b: i32): i32 {
  return a + b;
}
```

### Low-level WebAssembly

In some instances, you will need to write low-level WebAssembly
An extract of the previous function in WebAssembly will look like the following instruction:

```wasm
(func $assembly/index/addInteger (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  i32.add
 )
```

You should avoid non-strict TypeScript code since not all will be valid AssemblyScript code. [Read more about TypeScript strict mode](https://www.typescriptlang.org/tsconfig/#strict).

If you feel curious about the AssemblyScript typings, check out the [assembly.json](https://github.com/AssemblyScript/assemblyscript/blob/main/std/assembly.json) and [tsconfig-base.json](https://github.com/AssemblyScript/assemblyscript/blob/main/tsconfig-base.json) GitHub repos.

### Writing Your First AssemblyScript

Ensure you have Node.js latest LTS version installed on your machine; you can get it from [nodejs.org](https://nodejs.org/). Using older versions of Node.js can lead to errors using the AssemblyScript compiler.

Initialize a new Node.js project by running the following command in your favorite terminal:

```bash
npm init --yes
```

Install the compiler as a development dependency:

```bash
npm install --save-dev assemblyscript
```
 
The AssemblyScript project provides a utility called **asinit** used for scaffolding your project. Basically, what it does is the following:

- It creates a directory with the AssemblyScript sources that will compile to WebAssembly. 
- Add TypeScript needed configuration file.
- Add AssemblyScript configuration file.
- A compiled WebAssembly directory.
- Add proper configuration to your package.json file.
- Example HTML file that loads the module in a browser.

Run the utility via npx:

```bash
npx asinit .
```

After running the previous command, you should have the following project structure:

![Generate WebAssembly with TypeScript with-shadow](assembly-script-1.png 'Project structure')

In your package.json file, you should have the following scripts available:

```json
"scripts": {
  "test": "node tests",
  "asbuild:debug": "asc assembly/index.ts --target debug",
  "asbuild:release": "asc assembly/index.ts --target release",
  "asbuild": "npm run asbuild:debug && npm run asbuild:release",
  "start": "npx serve ."
}
```

Let’s understand each script:

- **test**: Ensure your code works!. By running compiled JavaScript tests written under the tests folder.
- **asbuild:debug**: AssemblyScript debugging target. By default, source maps and debugging information in emitted binaries are enabled. You can always change that in your asconfig.json file.
- **asbuild:release**: AssemblyScript release target. Creates an optimized output for your Wasm binaries; It enables source maps by default, useful for debugging.
- **asbuild:build**: Runs asbuild compiler for release and debug targets.
- **start**: Starts a local webserver serving the module directory, defaulting to display index.html

Now, it’s time to write our first Wasm code! Let’s add a simple function that adds two numbers.

1. Open your index.ts file under the assembly folder and add the following code:

```typescript
export function addInteger(a: i32, b: i32): i32 {
  return a + b;
}
```

As you can see, this is close to a regular TypeScript code, and the only difference is the typings that come for WebAssembly types; in this case, i32 represents a 32-bit signed integer. In TypeScript, you would use just a number type.

2. Compile your code to Wasm:

In your terminal run

```bash
 npm run asbuild
```

This will generate a build folder with the debug and release targets (by default).Ensure you have the following files created:

![Generate WebAssembly with TypeScript with-shadow](assembly-script-2.png 'Build files')

3. In your index.html file (located at the root level of your project), add the following code:

```markup
<script type="module">
 import { addInteger } from "./build/release.js";
 document.body.innerText = addInteger(1,2);
</script>
```

Inside release.js file, you will find the auto generated code to load a WebAssembly file from your browser, it will use the method [WebAssembly.compileStreaming()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/compileStreaming), one interesting thing to notice here, is that the method accepts a Promise, so you can use [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) to load your wasm file.

```javascript
async function instantiate(module, imports = {}) {
 const { exports } = await WebAssembly.instantiate(module, imports);
 return exports;
}
export const {
 addInteger
} = await (async url => instantiate(
 await (
   typeof globalThis.fetch === "function"
     ? WebAssembly.compileStreaming(globalThis.fetch(url))
     : WebAssembly.compile(await (await import("node:fs/promises")).readFile(url))
 ), {
 }
))(new URL("release.wasm", import.meta.url));

```

4. Start the local server to view the result:

```bash
npm run start
```

![Generate WebAssembly with TypeScript with-shadow](assembly-script-3.png 'Start server')

Now, open your browser and see the result printed on the screen!

You can also read the official [AssemblyScript getting started guide](https://www.assemblyscript.org/getting-started.html#setting-up-a-new-project).

## Example: Create a Browser-Based Pendulum

Alright, drawing a pendulum in the browser is not desperately in need of using Wasm, but the main idea is to help you to get some concepts on how you can use Wasm to rely on the math calculations needed to animate and paint our pendulum:

<iframe src="https://codesandbox.io/embed/tender-ritchie-06ory9?autoresize=1&fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="tender-ritchie-06ory9"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

[![Edit tender-ritchie-06ory9](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/tender-ritchie-06ory9?autoresize=1&fontsize=14&hidenavigation=1&theme=dark)

The Wasm code will be responsible for the position calculation of our pendulum, there are two functions:

### Main function

```typescript
export function init(startPositionX: f64, amplitude: u32, w: u32, h: u32): void {
 angle = 0;
 var needed = <i32>(((w * h * sizeof<i32>() + 0xffff)) & ~0xffff) >>> 16;
 var actual = memory.size();
 if (needed > actual) memory.grow(needed - actual);
 pendulum = new Pendulum(startPositionX, amplitude);
}
```

This function is in charge of the initialization of variables by storing them in a class object called Pendulum; another responsibility of this function is memory assignment; it uses the configured canvas width and height to calculate the needed memory. If you don’t assign memory correctly, your Wasm may fail. [Read about memory management](https://www.assemblyscript.org/stdlib/globals.html#memory)

### Move Function

```typescript
export function move():void {
 angle += 10;
 if (angle == 360 || angle > 360) {
   angle = 0;
 }
 pendulum.nextPosition  = pendulum.initialPosition + pendulum.amplitude * Math.sin((angle * Math.PI) / 180);
}

```
The move function recalculates the next position of the Pendulum in the x direction. We use the pendulum formula to calculate the position.

[View source code on GitHub](https://github.com/fusebit/blog-examples/tree/main/assembly-script) 

### Debugging WebAssembly

You can debug your WebAssembly code from a supported browser. Let’s review how you can do it using Chrome.

1. Ensure that you’re running the `asc` compiler with a debugging target. Ensure source maps are enabled since it will help you inspect your code clearer from your browser.
2. Ensure you have WebAssembly debugging enabled (check the option under Chrome developer tools settings > Experiments)

![Generate WebAssembly with TypeScript with-shadow](assembly-script-4.png 'Debugging Wasm')

3. Once enabled, you need to reload your browser; just click Reload DevTools from the message that appeared after you closed the settings window.

![Generate WebAssembly with TypeScript with-shadow](assembly-script-5.png 'Reload DevTools')

4. Now you can add breakpoints to your code and inspect it! 

![Generate WebAssembly with TypeScript with-shadow](assembly-script-6.png 'Inspecting Wasm')

## To Wrap Up

This blog post is just the tip of the Iceberg. AssemblyScript is a well-documented project with advanced [examples](https://www.assemblyscript.org/examples.html) and exciting implementations.

I firmly believe this project can reduce the gap in Wasm adoption and open up the gates to drive more interest to use Wasm by using a variant of TypeScript.

Hopefully, this blog post helped you increase your interest in experimenting with WebAssembly yourself. Don’t hesitate to reach out if you have any questions, and we’ll be happy to help push through. You can find me on the [Fusebit community Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg).

[Fusebit](https://fusebit.io) is a code-first integration platform that helps developers integrate their applications with external systems and APIs. We used monkey patching ourselves to make our integrations better! To learn more, take [Fusebit for a spin](https://manage.fusebit.io/signup?utm_source=fusebit.io&utm_medium=referral&utm_campaign=blog&utm_content=generate-web-assembly-with-typescript) or look at our [getting started guide](https://developer.fusebit.io/docs/getting-started?utm_source=fusebit.io&utm_medium=referral&utm_campaign=blog&utm_content=generate-web-assembly-with-typescript)!

## Bonus section

Did you know you can run that WebAssembly code in Node.js? Just add the following code in a new file at the root level of your project and run it as a regular node.js file.

```javascript
import * as fs from 'fs';
const wasmBuffer = fs.readFileSync('./build/release.wasm');
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  const add = wasmModule.instance.exports.addInteger;
  const sum = add(1,2);
  console.log(sum); // Outputs: 3
});
```

Note: if you are using `CommonJS` instead, ensure you change the way you import the `fs` library:

```javascript
const fs = require('fs');
const wasmBuffer = fs.readFileSync('./build/release.wasm');
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  const add = wasmModule.instance.exports.addInteger;
  const sum = add(1,2);
  console.log(sum); // Outputs: 3
});
```
