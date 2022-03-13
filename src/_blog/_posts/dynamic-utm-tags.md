---
post_title: Streamline Funnel Analytics with Dynamic UTM Tags
post_author: Chris More
post_author_avatar: cmore.png
date: '2022-03-11'
post_image: blog-dynamic-utm-main.png
post_excerpt: There is love-hate relationship with UTM parameters for both developers and marketers. Let’s explore a solution that will improve both reporting and the collective smiles on your team.
post_slug: dynamic-utm-tags
tags: ['post', 'growth']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-dynamic-utm-main.png
---

## The Reporting Challenge

UTM tags, or "Urchin tracking module", are the standard way marketing and growth professionals measure the impact of campaigns. Even though UTM tracking tags are part of the Google Analytics ecosystem (thanks for a 2005 acquisition), almost all analytics platforms use them.

While UTMs are ubiquitous in analytics, they require constant effort to ensure external links are tagged. The reality is that only a  few links contain UTM tags. Links that do have UTMs are often only digital marketing campaigns, generated through manual tagging with the help of a campaign URL builder. This creates a challenge when you want to create standard reports to compare the performance across all marketing channels. This is even more important when your analytics stack extends beyond the Google ecosystem.

Below is a screenshot of a Mixpanel report I created to look at the sources coming to fusebit.io. The issue is that the source analysis in Mixpanel assumes utm_source is set. 

![Mixpanel Source Report Before Dynamic UTMs with-shadow](blog-dynamic-utm-mixpanel-sources-before.png "Mixpanel Source Report Before Dynamic UTMs")

What was frustrating about the report above was that I knew I was getting traffic from other sources, but those sources were not using UTM and thus were not included in the report. I created workarounds, but it was painful. The pain was relieved when I found a solution to the missing UTM tags.

This article will provide a solution to that reporting challenge described above and allow you to create streamlined reports based on your website’s traffic source.

## Solving the Missing UTM Tag Problem

It is possible with JavaScript to dynamically add UTM tags when someone visits your website from any external source. By adding the missing UTM tags, you can easily create a report comparing one source to another and be confident you are capturing all the traffic. Google Analytics does a good job of filling in missing sources, but other analytics tools rely heavily on populated UTM tags.

Now that we know it is possible to use technology to populate UTM tags, let’s see how this works in practice.

## Setting Up the Logic

As a recap, the most commonly used UTM tags are:

* **utm_source** = The source parameter is usually the domain or website the referring traffic came from
* **utm_medium** = The medium is the category or type of referring traffic
* **utm_campaign** = The campaign name or campaign parameter is usually a code used for marketing attribution

When someone visits your website, it typically includes an HTTP referring header (as seen below) that includes the full URL of where they came from before to landing on your website. We will use that header value in the logic used to populate the missing UTM tags.

![HTTP Referer Header](blog-dynamic-utm-headers.png "HTTP Referer Header")

Let’s use this pseudocode below to explain how the logic will function.

```
If (utm_source.exists == FALSE) {
    utm_source = referring-hostname
    utm_medium = “referral”
    utm_campaign = “none”
}
```

We are going to set the source to the referring hostname, the medium to simply “referral”, and the campaign to “none”. Setting the medium to “referral” will also align with Google Analytics and other analytics software that uses the same medium value for non-campaign traffic from external websites.

To illustrate how this would work, if there was a link on example.com to fusebit.io/integrations/ that did not contain UTM tags, we could dynamically set the UTM parameters to:

``https://fusebit.io/integrations/?utm_source=example.com&utm_medium=referral&utm_campaign=none``

From the perspective of your analytics solution, it would look like the example.com link to fusebit.io had UTM parameters when it did not.

Got it? Let’s dive into the code.

## Show Me the Code

Here is the JavaScript that will dynamically create UTM parameters, and then I will explain how it all works. This code will be in the ``<head>`` section of your website’s HTML above any analytics tags.

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

**Let’s break down how this code works.**

``const searchParams = new URLSearchParams(window.location.search);``

The code above simply gets the URL parameters from the visitor’s browser address.

``if (!searchParams.get('utm_source') && document.referrer) {``

We then check to see if utm_source is **not** defined and if the referring URL is available.

``const referrerHostname = new URL(document.referrer).hostname;``

Then we set a variable using the hostname of the referring URL as the value.

``if (referrerHostname !== window.location.hostname) {``

Just double-check above that the hostname isn’t the current website, or we would be adding UTM parameters as a visitor is browsing each site page, which is overkill.

``const url = new URL(window.location);``

This is setting a variable of your visitor’s current web browser address.

``url.searchParams.set('utm_source', referrerHostname); url.searchParams.set('utm_medium', 'referral'); url.searchParams.set('utm_campaign', 'none');``

Then all we do is set the UTM values to the referring hostname and the two static values we discussed previously.

``window.history.replaceState({}, '', url);``

Then, finally above, we replace the web browser’s current address with the newly constructed URL with the dynamic UTM parameters. 

**Voilà!** Any external link to your website will be automatically tagged with UTM parameters when none are present.

## Considerations

While setting UTM parameters dynamically is great, there are a few items to keep in mind as this will impact reporting going forward. If you are comparing analytics before you made this change, the utm_source and utm_medium parameters will be slightly different.

For example, in Google Analytics, traffic from Twitter.com gets automatically tagged as “social” as the medium. With the code above and no UTM parameters, the utm_medium value would change from “social” to “referral”.  Also, traffic from Google organic will change from “google / organic” to “www.google.com / referral”.

While these changes in the source and medium will slightly impact basic reporting in Google Analytics, this can be overcome by creating segments like the following:

![Google Analytics Organic Segment with-shadow](blog-dynamic-utm-segment.png "Google Analytics Organic Segment")

The GA segment above creates a cohort of visitors that match both the historical and new values created by the dynamic UTM parameters. It is also possible to expand the functionality of this code and include an array of search engines and social media sites that could be categorized as “organic” and “social” respectively. A future follow-up blog post will explore potential advanced features. 

While we have talked a lot about Google Analytics, the changes above have an even bigger impact on other analytics tools like Segment and Mixpanel that out-of-the-box doesn’t categorize sources automatically and rely more heavily on UTM parameters.

Below is a screenshot of a Mixpanel report I created to look at the distribution of traffic sources for fusebit.io. In Mixpanel, out-of-the-box source analysis requires utm_source to be populated. If you were using the code snippet above, you can view all of your sources regardless if they were tagged with UTM parameters.

![Mixpanel Source Report After Dynamic UTMs with-shadow](blog-dynamic-utm-mixpanel-sources-after.png "Mixpanel Source Report After Dynamic UTMs")

Boom! We now have a single report in Mixpanel that shows all of the source traffic regardless if the external links are tagged with UTM codes.

## Before You Go

If you find this article and code helpful, feel free to modify the code further, and let me know what improvements you have made. You can find me on [Twitter @chrismore](https://twitter.com/chrismore) and feel free to reach out with questions or comments. Follow [@fusebitio](https://twitter.com/fusebitio) on Twitter for more great content and to be notified when we publish new features of the dynamic UTM code.

Finally, if you are building a product that will be integrated to other tools like Slack, GitHub, or Salesforce, check out [Fusebit](https://fusebit.io/) for low-code integration solutions. It is all free to try and made for developers.
