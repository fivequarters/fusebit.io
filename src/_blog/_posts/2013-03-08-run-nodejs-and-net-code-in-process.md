---
post_title: Run node.js and .NET code in-process
date: 2013-03-08
post_author: Tomasz Janczuk
post_author_avatar: tomek.png
post_image: blog-tomek.png
post_slug: run-node.js-and-.net-code-in-process
post_date_in_url: true
post_og_image: site
post_excerpt: Tomek on Software - shaken, not stirred
tags:
  - post
---




The [owin](https://github.com/tjanczuk/owin) project allows running node.js and .NET code in-process. It provides an asynchronous mechanism for calling .NET code from node.js and node.js code from .NET. The owin module takes care of marshaling the data between V8 and CLR and reconciling the threading models.   

With owin you can:  

1. Use 24,000+ npm modules for node.js and 11,000+ nuget packages and .NET Framework within a single application.  
2. Combine the benefits of single-threaded node.js and multi-threaded CLR to run applications composed of IO-bound workloads and CPU-bound computations in-process.  
3. Write node.js extensions in C# and .NET Framework instead of C/C++/Win32.  
4. Use excellent CLR debugging tools (e.g. Visual Studio) to debug .NET code in your application.  
  

Owin is based on a prescriptive pattern of a fully asynchronous interop interface shown below. It combines the essential aspects of event-based, async node.js programming model with the modern, TPL based async model that .NET offers:  

 ![clr2v8-2](http://lh6.ggpht.com/-c99ILjYyne8/UTouoCrfT5I/AAAAAAAADbQ/GqhhN6QdcVo/clr2v8-2_thumb%25255B2%25255D.png?imgmax=800)   

Check out the [owin project on GitHub](https://github.com/tjanczuk/owin) for in-depth description of the features it offers. Below is simple example that illustrates the gist of the idea.    

### Hello, world  

You need Windows, node.js v0.8.x (tested with 0.8.19), and .NET Framework 4.5 on the machine.   

Implemenent a .NET function to be called from node.js in Startup.cs as follows:  

{% highlight javascript linenos %}
   using System.Threading.Tasks;  
  
namespace Owin.Sample  
{  
    public class Startup  
    {  
        public Task<object> Invoke(object input)  
        {  
            return Task.FromResult<object>(".NET welcomes " + input.ToString());  
        }  
    }  
}
  

{% endhighlight %}



Compile it to Owin.Sample.dll with:

{% highlight javascript linenos %}
csc /target:library /out:Owin.Sample.dll Startup.cs
  

{% endhighlight %}





Install owin:

{% highlight javascript linenos %}
npm install owin
  

{% endhighlight %}





Implement the node.js application that will call into the .NET code in server.js:

{% highlight javascript linenos %}
var owin = require('owin');  
  
var helloWorld = owin.func('Owin.Sample.dll');  
  
helloWorld('JavaScript', function (error, result) {  
    if (error) throw error;  
    console.log(result);  
});
  

{% endhighlight %}





Run the node.js application and enjoy the response generated by .NET code displayed to the console from the node.js callback function:

{% highlight javascript linenos %}
C:\projects\barebones>node sample.js  
.NET welcomes JavaScript
  

{% endhighlight %}





The sample shows calling a .NET function from node.js, passing a string parameter to it, and receiving a string result via a callback in node.js. 

### More

Visit the [owin project on GitHub](https://github.com/tjanczuk/owin) for in-depth documentation. Contributions and derived work welcome!

Check out the previous reincarnation of the [owin@0.4.0](http://tomasz.janczuk.org/2013/02/hosting-net-code-in-nodejs-applications.html) project to get a better idea of the scenarios that informed the project in the first place. 

Enjoy!  }