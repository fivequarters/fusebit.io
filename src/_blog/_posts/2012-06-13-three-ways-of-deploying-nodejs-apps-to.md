---
post_title: Three ways of deploying node.js apps to Windows Azure
date: 2012-06-13
post_author: Tomasz Janczuk
post_author_avatar: tomek.png
post_image: blog-tomek.png
post_slug: three-ways-of-deploying-node.js-apps-to-windows-azure
post_date_in_url: true
post_og_image: site
post_excerpt: Tomek on Software - shaken, not stirred
tags:
  - post
---




In this post I compare and contrast three ways of deploying node.js applications to Windows Azure to help you choose a method that is best suited to your requirements.  

[Windows Azure](https://www.windowsazure.com/) is an application hosting platform operated by Microsoft that supports a variety of application technologies: from ASP.NET, PHP, node.js, to Java and Python. In case of node.js applications, you have at least three ways of hosting it in Windows Azure. They differ with the features of the runtime, deployment experience, and management and diagnostics capabilities. The picture below shows the common and distinctive aspects of using Windows Azure Worker Role, Windows Azure Web Site, or git-azure.  

 ![Three ways of deploying node.js applications to Windows Azure](http://lh3.ggpht.com/-WPF9gt4_0D0/T9jjC-iXEQI/AAAAAAAACCU/vFM_HkG1qFY/Screen%252520Shot%2525202012-06-13%252520at%25252010.26.33%252520AM_thumb%25255B4%25255D.png?imgmax=800)  

[Windows Azure Web Site](https://www.windowsazure.com/en-us/home/scenarios/web-sites/) is an exciting new feature of Windows Azure announced recently. It provides a shared hosting environment in which your node.js application is hosted in the Internet Information Services (IIS) web server using the [iisnode](https://github.com/tjanczuk/iisnode) technology; a given VM is hosting apps from multiple tenants. The key advantage of Windows Azure Web Sites is the ability to deploy your application using Git to a Git repository provided by Windows Azure itself. Creation of a new application as well as subsequent updates take seconds. The runtime environment does not support WebSockets. Given that Web Sites operate in a shared hosting environment, you also do not get administrative access to the machine (e.g. no RDP or SSH). You can access logs generated by the node.js applications using FTP. If you are developing your node.js application on a Mac, you can use command line tools from Windows Azure SDK for node.js to manage your Windows Azure services, create apps, etc. If you are using Windows to develop your app, you have a choice of [WebMatrix](http://jbeckwith.com/2012/06/07/node-js-meet-webmatrix-2/) or Visual Studio to deploy your app. You can also develop and deploy online using [http://c9.io](http://c9.io).   

In contrast to the shared hosting environment of Windows Azure Web Sites, the [Windows Azure Worker Role](https://www.windowsazure.com/en-us/home/scenarios/cloud-services/) provides you with your own VM with administrative access using RDP (from a Windows client machine). Deploying applications to Windows Azure Worker Role requires provisioning of that VM which takes minutes rather then seconds. Subsequent updates of the application are also substantially longer than in case of Windows Azure Web Sites. Node.js applications running in Windows Azure Worker Role are self-hosted (as opposed to hosted in [iisnode](https://github.com/tjanczuk/iisnode)), which does not provide [the benefits of hosting in IIS](https://github.com/tjanczuk/iisnode/wiki), but on the other hand improves performance in a number of scenarios, enables WebSockets, and has smaller potential of application compatibility issues. If you are developing your node.js application on a Mac, you can use the command line tools from Windows Azure SDK for node.js to deploy to Windows Azure Worker Role. If you are developing on Windows, you can use corresponding PowerShell toolset, or deploy from [WebMatrix](http://jbeckwith.com/2012/06/07/node-js-meet-webmatrix-2/) or Visual Studio. Similarly to Windows Azure Web Sites, you can also develop and deploy online from [http://c9.io](http://c9.io).   

The [git-azure](https://github.com/tjanczuk/git-azure) project attempts to consolidate elements of the Windows Azure Worker Role and Windows Azure Web Site environment and add a few of its own to create a unique environment for running node.js applications in Windows Azure. git-azure enables deploying multiple node.js applications into a single instance of Windows Azure Worker Role using Git from Mac. You retain the administrative access to the VM using RDP offered by Windows Azure Worker Role, but you can also use SSH for a more convenient access from the Mac. SSH allows you to open a remote console or remotely execute scripts on your VM. In git-azure, multiple node.js applications are self-hosted behind an HTTP and WebSocket reverse proxy that is part of the git-azure runtime environment. All applications are accessible on port 80 and 443 with the use implicit or explicit routing rules. git-azure is tightly integrated with a Git repository where your applications reside. The repository is external to git-azure (e.g. GitHub). Initial deployment of git-azure is similar to deploying node.js applications to Windows Azure Worker Role – it requires provisioning of your own VM and takes minutes. After that, however, adding and modifying applications with a simple ‘git push’ takes seconds with the use post receive hooks, similar to the characteristics of the Windows Azure Web Site. Git-azure provides real time access to logs generated by your applications and the git-azure runtime. The logs are streamed over WebSockets to a web browser a client terminal console. Since applications are self-hosted, WebSockets (both secure and non-secure) are supported. Some other distinctive features of git-azure are support for running multiple node.js engines side by side, SSL by default, and support for specifying custom X.509 credentials per application. When you use git-azure, you develop and maintain your applications using the common set of tools and workflow for node.js apps (i.e. likely your favorite text editor + GitHub), while git-azure provides command line extensions of the Git toolchain to facilitate deployment of your app to Windows Azure. Read more about git-azure or watch a 7 minute inroductory video in the [Develop on Mac, host on GitHub, and deploy to Windows Azure post](http://tomasz.janczuk.org/2012/05/develop-on-mac-host-on-github-and.html).   }