---
post_title: Type Annotations in JavaScript
post_author: Lizz Parody
post_author_avatar: lizz.png
date: '2022-07-22'
post_image: javascript-type-annotations.png
post_excerpt: Learn about the TC39 proposal of adding static typing to JavaScript
post_slug: type-annotations-javascript
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'node-18-prefix-only-modules',
    'node-18-release',
    'node-fetch',
  ]
---

Static Typing is the number one feature missing in JavaScript, according to 16K developers participating in the [State of JavaScript survey 2022]([https://2021.stateofjs.com/en-US/opinions/#currently_missing_from_js_wins](https://2021.stateofjs.com/en-US/opinions/#currently_missing_from_js_wins)). There are so many opinions and conversations around it, that [TC39]([https://tc39.es/](https://tc39.es/)), the committee which standardizes the JavaScript language launched a [new Stage 0 proposal]([https://github.com/tc39/proposal-type-annotations](https://github.com/tc39/proposal-type-annotations)) to enable JavaScript developers to add type annotations to their JavaScript code.

![JavaScript Soft Typing Support](javascript-typing-support-1.png "JavaScript Soft Typing Support")

Let’s understand what is happening and why this could have a major impact on how we write JavaScript.

## A Little Bit of History: TypeScript, JavaScript, and Concepts

When JavaScript was first released 27 years ago, it was designed to be a dynamic language or weakly typed language, meaning that developers don’t have to specify the types of information that will be stored in a variable in advance. JavaScript assigns the type of a variable based on the information assigned to it. (e.g.  arrays, strings, object, etc). The opposite is _*Strong typed*_ language, where specifying types in advance is enforced by the compiler, such as Java, Python and Ruby.

Having a loosely typed language is a bittersweet experience.

The sweet part is because it gives you a lot of flexibility and less developer effort as the compiler performs certain kinds of type conversions. The bitter part is because fewer errors are caught at compile time, leaving many bugs to be caught at runtime.

Loosely typed languages allows to things like this: 1 + “1” = 11

And errors like this: ``cannot read property x of undefined``

As well as other similar errors and weird stuff that could be preventable by adding type syntax. That’s why TypeScript was invented.

### JavaScript + Types = TypeScript 

TypeScript is a superset of JavaScript, is not a JavaScript framework, meaning that you can completely write valid JavaScript without using any extra features Typescript offers. You can build on JavaScript by adding syntax for type declarations, classes, and other object-oriented features with type-checking.

In other words, typescript is a type-checking language that doesn’t change how JavaScript is interpreted by the browser.

[TypeScript]([https://www.typescriptlang.org/](https://www.typescriptlang.org/)) was first released in 2012 and “is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale”, now is the seventh most popular language among developers according to [Stack Overflow survey 2021]([https://insights.stackoverflow.com/survey/2021#most-popular-technologies-language](https://insights.stackoverflow.com/survey/2021#most-popular-technologies-language)), and fourth according to [The State of the Octoverse]([https://octoverse.github.com/#top-languages-over-the-years](https://octoverse.github.com/#top-languages-over-the-years)).

![JavaScript Soft Typing Support](javascript-typing-support-2.png "JavaScript Soft Typing Support")

Its use and adoption have been extensive, exponential, and explosive! But, it really started to take off in 2017. Its popularity has been growing because, by [providing minimal checking syntax on top of JavaScript](https://thenewstack.io/typescript-getting-popular/), TypeScript allows developers to type check their code, helping find bugs and improve documentation of large JavaScript code bases.

Some argue that TypeScript faces the same fate as Coffeescript, which includes improvements for the JavaScript Language such as `for..of` loops. Those improvements were later included in the JavaScript language itself in ES6, making CoffeScript irrelevant. TypeScript, as a “superset” of JS, could become irrelevant if JavaScript itself adopts all the TypeScript improvements.

Because JavaScript is the lingua franca of the web, a small change can potentially break millions of sites and applications. Luckily, TC39 members always consider features that are completely backward-compatible.

TypeScript is so compatible with JavaScript that if you change a JavaScript file extension for `.ts`, boom! You have a valid TypeScript file! And, the extra type syntax is optional. You only add it if it brings benefits to you, no wonder why is growing in popularity. 

![JavaScript Soft Typing Support](javascript-typing-support-3.png "JavaScript Soft Typing Support")

## Deep Dive into the Proposal: Type Declarations in JavaScript

The main purpose of the proposal is to “Reserve a space for static type syntax inside the ECMAScript language. JavaScript engines would treat type syntax as comments”. [TC39 Proposal]([https://tc39.es/proposal-type-annotations/](https://tc39.es/proposal-type-annotations/)) that means:

> Everything in this proposal has no runtime behavior and would be ignored by a JavaScript runtime.

### Type Annotations in Variables and Functions

Using type annotations, a developer can explicitly state the type of variable or expression (if it’s a string, type, boolean…). They start with colon : followed by the type. Check the following example:

```js
let x: string;

x = "Using annotations";
```

If `x` is assigned to a number `x = 10`, TypeScript will throw an error. However, the JavaScript engine follows the TC39 proposal. The result **won’t throw an error**, **because annotations are equivalent to comments**. They don’t change the semantics of the program.

So what’s the difference? 

Well, because a picture is worth a thousand words, check this out:

![JavaScript Soft Typing Support](javascript-typing-support-4.png "JavaScript Soft Typing Support")

<center><figcaption>[Before and after type annotations](https://tc39.es/proposal-type-annotations/)<figcaption></center>

This means that when you write JavaScript with type annotations, it won’t throw an error anymore. Even if you state that `x` is a string and you assigned it to a number; you won’t see a comment as such, instead, it will remain as a comment inside the javascript engine, the runtime code will be interpreted like this:

```js
let x: string;

x = "Using annotations";
```

Currently, a “plugin” is necessary in some tools if you want TypeScript to work. But with this proposal, these tools could support type annotations by default. Full TypeScript support, could remain an opt-in mode.

> Basically, the transpilation from TypeScript to JavaScript is avoided. If you create a TypeScript program, it should run without transpiling.

You can have annotations placed on parameters inside a function, to specify the types that function accepts, for example:

```js
function equals(x: number, y: number): boolean {
    return x === y;
}
```

In this case, only numbers are accepted as parameters, and the return value of the function will be a boolean.

### Type Declarations: Inference

Type inference is the opposite of type annotations; instead of you explicitly declaring a type on variables and functions, you can write information without worrying about the type, the typing support will figure out the type, based on the information you give it.

The type inference can save you some keystrokes and will likely cover approximately 90% of your use cases, as we can see in the following example:

![JavaScript Soft Typing Support](javascript-typing-support-5.png "JavaScript Soft Typing Support")

<center><figcaption>Example of inference using VS Code<figcaption></center>

### Type Declarations: Type Alias

Type aliasing consists of giving one type a new name; it doesn’t create a new type. It can declare a name for a broader set of types. Aliasing a primitive isn’t very practical as it’s easy using primitive types, but one of the best usages is for documentation purposes. 

Example:

```js
type importantNumber = number;
```

## Will all of TypeScript be supported by this proposal?

Short answer: no. Only the main types that are shown in the section below. [For example enums, namespaces and class parameter properties are unlikely to be supported](https://tc39.es/proposal-type-annotations/). In addition, specifying type arguments at function call-sites will require a slightly different syntax.

## Kinds of Types

[The allowed types in this proposal are]([https://github.com/tc39/proposal-type-annotations/blob/master/syntax/grammar-ideas.md#allowed-types](https://github.com/tc39/proposal-type-annotations/blob/master/syntax/grammar-ideas.md#allowed-types)):

* Simple "identifier" style: `number, Foo, string`
* Adding `?: number?, ?number, Foo?`
* Adding parentheses after an identifier: .`string[], Foo<T>, Foo<T extends ReturnType<Bar>>`
* Starting with parentheses: `{x: number, y: number}, {|x: number, y: number|}, (() => number)`

There are other types into consideration, but for now, the types above will be supported.

## Parameter Optionality

When declaring parameters for a function in JavaScript, all the parameters are **required** and if the client has no value for the parameter, they can pass the “null” value instead. If the client doesn’t pass any value (not even null) the parameters will be assigned to `undefined` which can be a source of errors. The **parameter optionality** means that the parameters for that function are not required, they are optional.

**Parameter Optionality Syntax**

You just need to add the question mark “?” between the parameter name and the colon “:” as shown in the example below.

```js
function myFunction(param1: number, param2?: number) {
}
```

In this case, param2 is optional, param1 is required. 

## Generics

[Generics]([https://www.typescriptlang.org/docs/handbook/2/generics.html](https://www.typescriptlang.org/docs/handbook/2/generics.html)) is one of the main tools in the toolbox for creating *reusable components* in languages such as C# or Java, this means, being able to create components that work with multiple types instead of just one. This could be useful in the way the user can use their own types.

If you are familiar with TypeScript, this is where the famous **any** type comes into play.

```js
function myFunction(arg: any): any {
 return arg;
}
```

**Any** type is the most generic one. The example above means that the function allows specifying arbitrary properties, even ones that don’t exist. But, **we are losing the information about the type when the function returns**. For example, if we pass a `number,` the only information we have is that it is `any` type, not a number.

There is a way of capturing the type of the argument that describes what’s being returned: using the **type variable** that works on types rather than values, giving us type safety. 

## What’s next?

For this proposal to be fully integrated to JavaScript, it needs to pass four stages. Right now is in the first stage: accepted for consideration.

Here are the stages for the TC39 process:

*  🙋Stage 0: To be proposed
* [💡 Stage 1: ](https://nitayneeman.com/posts/introducing-all-stages-of-the-tc39-process-in-ecmascript/#stage-1-proposal)Accepted for consideration
* [✍🏻 Stage 2: Draft](https://nitayneeman.com/posts/introducing-all-stages-of-the-tc39-process-in-ecmascript/#stage-2-draft)
* [📝 Stage 3: Candidate](https://nitayneeman.com/posts/introducing-all-stages-of-the-tc39-process-in-ecmascript/#stage-3-candidate) - waiting for implementation
* [✅ Stage ](https://nitayneeman.com/posts/introducing-all-stages-of-the-tc39-process-in-ecmascript/#stage-4-finished)4: Accepted

For more information on how the process works, visit the [official documentation]([https://tc39.es/process-document/](https://tc39.es/process-document/)).

Some argue that Type Annotations are the future, and this proposal will likely be accepted since it is one of the most (or the most) requested features in JavaScript.  

One of the co-autors of this proposal [Gil Tayar](https://www.youtube.com/watch?v=SdV9Xy0E4CM&ab_channel=JSConf), says that if this proposal lands:

1. There will be no more transpilations of most of TS and Flow
  * With real browser ESM, removing *all* tooling during development will be possible
2. Code will still be checked by third-party checkers (TS and Flow)
3. Slow converge of incompatible TS/FLow to the new syntax
4. Tooling will become much simpler
5. Other type systems will be experimented with, but it will take time, probably years, but it will be worth the wait.

## About Fusebit

At [Fusebit](https://fusebit.io/), we live and breathe integrations. Our developer-friendly integration platform embraces code-first philosophy to support ultimate flexibility in addressing complex integration scenarios. The platform solves the generic integration challenges and supports creating unified APIs uniquely optimized for your own application and customer needs.

Relevant links:

[https://css-tricks.com/the-relevance-of-typescript-in-2022](https://css-tricks.com/the-relevance-of-typescript-in-2022/#:~:text=According%20to%20Stack%20Overflow's%202021,and%20most%2Dawaited%20developer%20surveys)

[https://www.quora.com/Why-is-TypeScript-a-superset-of-JavaScript](https://www.quora.com/Why-is-TypeScript-a-superset-of-JavaScript) 

[https://medium.com/@tomdale/glimmer-js-whats-the-deal-with-typescript-f666d1a3aad0](https://medium.com/@tomdale/glimmer-js-whats-the-deal-with-typescript-f666d1a3aad0) 

[https://medium.com/swlh/typescript-annotation-inference-eb714f66fb11](https://medium.com/swlh/typescript-annotation-inference-eb714f66fb11)

[https://nodesource.com/blog/new-JavaScript-era-coming](https://nodesource.com/blog/new-JavaScript-era-coming)

[https://www.geeksforgeeks.org/what-are-type-aliases-and-how-to-create-it-in-typescript](https://www.geeksforgeeks.org/what-are-type-aliases-and-how-to-create-it-in-typescript) 

[https://dotnetpattern.com/typescript-optional-parameters](https://dotnetpattern.com/typescript-optional-parameters#:~:text=TypeScript%20provides%20a%20Optional%20parameters,pass%20value%20to%20optional%20parameters)
