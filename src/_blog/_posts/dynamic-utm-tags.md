---
post_title: Streamline Funnel Analytics with Dynamic UTM Tags
post_author: Chris More
post_author_avatar: cmore.png
date: '2022-03-11'
post_image: blog-dynamic-utm-main.jpg
post_excerpt: There is love-hate relationship with UTM parameters for both developers and marketers. Let’s explore a solution that will make everyone a bit more happy.
post_slug: dynamic-utm-tags
tags: ['post', 'growth']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-dynamic-utm-main.jpg
---

## The Reporting Challenge

UTM tags, or “Urchin tracking module”, are the standard way marketing and growth professionals measure the impact of acquisition campaigns and their associated links. Even though UTM tags are part of the Google Analytics ecosystem (thanks for a 2005 software acquisition), almost all software uses them to provide a standard signal to your marketing and product analytics solution.

While UTMs are ubiquitous among analytics, they require constant effort to make sure as many external links as possible are tagged. In a perfect world, all links are tagged and you can create a single report comparing sources across paid, referral, and organic channels. The reality the only links that contain UTM tags are the ones that have been manually defined. This creates a challenge as at some point you will want to compare from various sources and many of those sources won’t have UTM parameters.

This article will provide a solution to that reporting challenge and allow you to create reports based off of UTM tag values regardless if you or your team has defined them.

## Solving the Missing UTM Tag Problem

It is possible with JavaScript to dynamically add UTM tags when someone visits your website when they are missing. By dynamically adding the UTM tags, you can easily create a report comparing one source to another and be confident that both have UTM tags. 

As a recap, The most commonly used UTM tags are:

* **utm_source** = The source parameter is usallly the domain or website the referring traffic came from
* **utm_medium** = The medium is the category or type of referring traffic
* **utm_campaign** = The campaign is usually a code used to uniquely identify a specific marketing campaign

## Setting Up the Logic

When someone visits your website, it typically includes a HTTP referring header that includes the full URL of where they came from prior to landing on your website. We are going to use that header value in the logic used to set the dynamic UTM tags.

The general idea of what are going to do here is use the HTTP referring header to determine the source and manually set the medium and campaign parameter values. We will only do this when there are no UTM parameters present in the URL.

Let’s use this pseudocode logic to explain how this will all work.

```
If (utm_source.exists == FALSE) {
    utm_source = referringHostname
    utm_medium = “referral”
    utm_campaign = “none”
}
```

What we are going to do is set the source to the referring hostname, the medium to simply “referral”, and the campaign to “none”. Setting the medium to “referral” will also align with Google Analytics and other analytics software that uses the same medium for non-campaign traffic from external websites.

To illustrate how this would work, if there was a link on example.com without UTM parameters to fusebit.io/integrations/, we would dynamically set the UTM parameters to:

``https://fusebit.io/integrations/?utm_source=example.com&utm_medium=referral&utm_campaign=none``

Simple, right? Let’s dive into the code next.

## Show Me the Code

Here is the JavaScript that will dynamically create UTM parameters and then I will explain how it all works.

```
<script>
const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.get('utm_source') && document.referrer) {
    const referrerHostname = new URL(document.referrer).hostname;
    if (referrerHostname !== window.location.hostname) {
          const url = new URL(window.location);
          url.searchParams.set('utm_source', referrerHostname);
url.searchParams.set('utm_medium', 'referral');
      url.searchParams.set('utm_campaign', 'none');
      window.history.replaceState({}, '', url);
    }
  }
</script>
```

Let’s break it down.

``const searchParams = new URLSearchParams(window.location.search);``

This code is simply getting the parameters from the URL.

``if (!searchParams.get('utm_source') && document.referrer) {``

We then check to see if utm_source is *not* defined and if we are able to see the referring URL.

``const referrerHostname = new URL(document.referrer).hostname;``

Then we set a variable using the hostname of the referring URL as the value.

``if (referrerHostname !== window.location.hostname) {``

Just double checking that the hostname isn’t the current website or we would be adding UTM parameters as a visitor is browsing each page of the site, which isn’t necessary. 

``const url = new URL(window.location);``

This is setting a variable of visitor’s currently web browser address.

```
url.searchParams.set('utm_source', referrerHostname);
url.searchParams.set('utm_medium', 'referral');
url.searchParams.set('utm_campaign', 'none');
```

Then all we do is set the UTM values to the referring hostname and the two static values we discussed previously.

``window.history.replaceState({}, '', url);``

Then, finally, we replace the web browser’s currently address with the newly constructed URL with the dynamic UTM parameters. Voilà!

## Considerations

While setting UTM parameters dynamically is great, there are a few items to keep in mind as this will impact reporting going forward. If you are comparing to historical analytics, the utm_source and utm_medium parameters will be slightly different.

For example, in Google Analytics, traffic from Twitter.com gets automatically tagged as “social” as the medium. With the code above and no UTM parameters, the utm_medium value would change from “social” to “referral”.  Also, traffic from Google organic will change from “google / organic” to “www.google.com / referral”. 

While these changes in the source and medium will slightly impact basic reporting in Google Analytics, this can be overcome by creating segments like the following:

(insert segment image)

The segment creates a cohort of visitors that match both the historical and new values created by the dynamic UTM parameters.

While we have talked a lot about Google Analytics, the changes above have an even bigger impact in other analytics tools like Segment and Mixpanel that out-of-the-box don’t categorize source automatically and rely more heavily on UTM parameters.

## Before You Go

If you find this article and code helpful, feel free to modify the code further and let me know what improvements you have made. Mention me on [Twitter](https://twitter.com/chrismore) or ping me on [GitHub](github.com/chrismore) with questions or to share your code changes. Follow [@fusebitio](https://twitter.com/fusebitio) on Twitter for additional developer and growth content.

Finally, if you are building a product that will be integrated to other tools like Slack, GitHub, or Salesforce, check out [Fusebit](https://fusebit.io/) for low-code integration solutions.
