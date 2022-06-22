---
post_title: Is WebAssembly the New Docker?
post_author: Paul Ibeabuchi
post_author_avatar: paul.png
date: '2022-06-21'
post_image: webassembly-docker.png
post_excerpt: Learn the differences between WebAssembly, Docker, and other virtualization technologies of your choice as well as examine the benefits and drawbacks of WebAssembly.
post_slug: webassembly-is-the-new-docker
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'remix-react-framework',
    'process-large-files-nodejs-streams',
    'google-calendar-api-javascript',
  ]
---
[WebAssembly](https://webassembly.org/) (also called Wasm) is a low-level language that uses a compact binary format to run at near-native performance speed. That enables it to compile and run code written in languages like Rust, C#, and C/C++ on the web alongside JavaScript, which previously wasn’t possible. WebAssembly’s modules provide functions that can be used with JavaScript by importing them into a web app (using Node.js).

Because WebAssembly uses a binary instruction format for a stack-based virtual machine, it’s fast and efficient. It’s also memory-safe and highly debuggable. You can use its modules to run Assembly-like low-level languages on the web, but you can also use it outside of a web browser. WebAssembly isn’t meant to replace JavaScript; instead, it complements it when used in a browser.

Other virtualization tools offer different functions and abilities. For instance, [Docker](https://docs.docker.com/get-started/overview/) is a platform that allows you to deploy and run your applications in an isolated state using containers, or platform-agnostic separate environments in which your application is packaged alongside the dependencies and resources needed for it to run. This quicker access makes your application fast and highly performant.

Another tool, [containerd](https://containerd.io/), is a container runtime that helps you manage the lifecycle of your application, such as running images in your container, pushing and pulling images to the system registry, or handling storage. It was initially extracted out of Docker but soon became a standalone platform that runs without needing Docker.

In this article, you’ll learn how WebAssembly compares to other virtualization tools on criteria including architecture, space, security, cold start, and recommended use cases, so that you can decide whether WebAssembly is right for your organization.

## How WebAssembly Compares

The following is a look at how WebAssembly compares to Docker and containerd using various criteria.

### Architecture

WebAssembly uses [ahead-of-time](https://www.baeldung.com/ahead-of-time-compilation) (AOT) or [just-in-time](https://www.freecodecamp.org/news/just-in-time-compilation-explained/) (JIT) compilation to precompile executables. When you write code in a language and compile it to WebAssembly, it’s compiled to instruction sets that are stored in binary format, usually as a `.wasm` file. The file is executed by a runtime environment, such as a browser, which converts the `.wasm` file to the actual code of the machine the browser is running on. This precompiling makes WebAssembly much faster than Docker.

It uses these [key concepts](https://developer.mozilla.org/en-US/docs/WebAssembly/Concepts#webassembly_key_concepts) to achieve better performance:

* **Modules:** Unlike Docker, WebAssembly is containerless and uses [modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module), which are basically units of deployment, or stateless WebAssembly binary code that has been compiled to machine code by the browser for execution. Modules can be imported and used via JavaScript (Node.js) on the web.
* **Memory:** A module when instantiated requires [memory](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) that you can allocate yourself or set to be allocated automatically. This memory is an ArrayBuffer with a linear array of bytes from which you can read and write data, which gives you access to [manage memory](https://hacks.mozilla.org/2017/07/memory-in-webassembly-and-why-its-safer-than-you-think/) safely.
* **Tables:** Memory holds bytes of information. To store other data types, WebAssembly provides [Tables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Table), or resizable typed arrays for storing data that aren’t raw bytes and can’t be stored in memory.
* **Instance**: An [instance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance) is a composition of a module packaged with the state it requires at runtime as well as resources such as memory, table, and other imported values.

![WebAssembly architecture](https://imgur.com/PIaBCv1.png)

Docker uses a client-server architecture in which the client usually talks to the Docker daemon (a background process that helps to manage containers) by using REST APIs or over a network interface. Users interact with the Docker client interface, which in turn communicates with the Docker daemon. The daemon manages Docker objects such as images (stored in Docker registries), containers, volumes, and networks.

![Docker architecture](https://imgur.com/wskzRbl.png)

Lastly, containerd consists of three main parts: the client, the containerd daemon, and the containerd shim. The client provides the interface for users to interact with the system, which could be ctr, nerdctl, or the Go library, which ships with containerd. The containerd daemon manages resources and includes an API server (gRPC API), the Container Runtime Interface (CRI) plug-in, and resource management tools for garbage collection and data storage. The containerd shim manages the container instances and running processes.

![containerd architecture](https://imgur.com/iZN9rwI.png)

### Space

WebAssembly code and containerd shims take up less space than Docker. A typical WebAssembly `.wasm` file or containerd shim usually requires less than 10 MB, while an average production Docker image is usually above 200 MB. This is because Docker [won’t automatically](https://docs.docker.com/config/pruning/) clean up unused objects that can take up extra disk space; you’ll have to prune them yourself.

### Security

Security is one of the major goals of WebAssembly. Its [security model](https://webassembly.org/docs/security/) is designed to protect users from malicious modules and help developers build more secure applications with safer execution semantics. It also enforces [Control Flow Integrity](https://www.microsoft.com/en-us/research/publication/control-flow-integrity/) (CFI) on modules, which helps to prevent attacks on control flow and memory safety errors.

WebAssembly is less likely than Docker to attract surface attacks such as pulling malicious or outdated images or leaving hardcoded secrets in images, since WebAssembly has no CLI or SSH daemon.

Docker evaluates security based on [four major areas](https://docs.docker.com/engine/security/) listed in its security documentation. It offers the following features:

* The option to require Docker daemon root privileges
* Docker Content Trust verification, in which the Docker engine is configured to run only signed images
* The option to use antivirus software
* The option to use AppArmor (a Linux security module that protects your OS from threats)

Although Docker provides various ways to secure applications, it’s the most bloated of the three tools since it uses a CLI or SSH daemon, which makes it an easy target. SSH usage requires caution, and you [should be careful](https://jpetazzo.github.io/2014/06/23/docker-ssh-considered-evil/#:~:text=Your%20containers%20should,should%20think%20twice.) running SSH containers. Docker’s documentation lists [some of the vulnerabilities](https://docs.docker.com/engine/security/non-events/) that can threaten an application.

While containerd doesn’t use a CLI or SSH daemon like Docker does, it’s still vulnerable to the same surface attacks as Docker. With access to the containerd socket file, anyone can download crictl or nerdctl and use the socket to perform malicious acts. Its Linux capabilities, such as `sys_chroot`, `mknod`, `net_raw`, and `audit_write`, also make it vulnerable to attacks.

### Cold Start

WebAssembly’s startup time, though it [can be optimized](https://pspdfkit.com/blog/2018/optimize-webassembly-startup-performance/), is noticeably faster than that of Docker and containerd since it compiles all the resources and code in a single module. Docker images work like a complete filesystem and must load up the resources required by the application.

### Best Use Cases

WebAssembly, which is designed to be platform-agnostic, can be used for building web applications in languages other than JavaScript. It’s good for applications that require near-native speed to perform well. You can use it in a browser for building audio streaming applications, live video augmentation, platform simulators, and developer tools. Outside the web, you can use it to build hybrid native apps on mobile devices or server-side applications.

Docker and containerd are both suitable for pre-deployment application testing, deploying containerized applications, deploying microservices applications, creating continuous rapid deployments, and managing development pipelines.

Docker, unlike WebAssembly, isn’t suitable for GUI applications, desktop applications, smaller applications, or applications running on operating systems other than Windows or Linux.

## Benefits of WebAssembly

WebAssembly is the first choice for most platforms because it provides the following benefits:

* It’s faster than Docker because it compiles to machine code, which is faster to execute.
* It allows you to run code written in languages like C/C++, C#, and Rust in your browser by compiling them into formats that your browser can execute.
* It can also be used to build server-side applications.
* It works well for gaming; VR, audio, and video streaming; and image editing.
* Though it functions independently, it can be used with Docker or Kubernetes.
* It has a faster cold start than Docker.
* It’s portable and secure, as well as more lightweight than Docker.
* It’s compatible with most modern browsers, such as Chrome, Safari, and Firefox.
* Its modules are easy to import and use.
* Unlike Docker, it’s not limited to Windows and Linux.

## Drawbacks of WebAssembly

WebAssembly does feature some disadvantages, including the following:

* It doesn’t currently offer a [garbage collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) feature but intends to do so in the future.
* When used on the browser, WebAssembly relies heavily on JavaScript to access the Document Object Model (DOM). Without JavaScript, WebAssembly can’t be used on the web.

## Conclusion

As you’ve seen in this article, WebAssembly offers flexibility, speed, and a versatile array of features. It works especially well for web applications as well as server-side applications outside the web. There are various situations in which WebAssembly will be a better choice for you than either Docker or containerd.

If you’re creating an application with WebAssembly, consider [Fusebit](https://fusebit.io/). The software-as-a-service (SaaS) tool enables developers to more easily add third-party integrations to their project. Fusebit is designed to prioritize developers’ needs and offers cloud-native functionality, including smooth deployment and scalability.

Follow [@fusebitio](https://twitter.com/fusebitio) on Twitter for more developer content.
