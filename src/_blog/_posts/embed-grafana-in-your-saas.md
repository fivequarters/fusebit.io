---
post_title: Embed Grafana for Your Customers in React
post_author: Benn Bollay
post_author_avatar: benn.png
date: '2022-03-03'
post_image: blog-embed-grafana-in-react.png
post_excerpt: Let's dive deep into the code that integrated Grafana with Fusebit's ReactJS app, providing graphing, tracing, and visualization for their customers.
post_slug: grafana-in-react
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: https://fusebit.io/assets/images/blog/blog-embed-grafana-in-react.png
---

## Embed Grafana in your SaaS
Every infrastructure SaaS needs some kind of graphing, tracing, visualization, or logging tool to expose systemic behaviors to their customers.  While there are a lot of closed source packages available, the Grafana dashboard by Grafana Labs hits that sweet spot by providing a wide set of capabilities and extensibility points, as well as a scalable and battle-tested architecture.

Here at Fusebit, we took a solid look around to decide whether we wanted to spend substantial engineering effort to implement our own, or if there were any interesting solutions we could leverage to simplify our lives.  

We considered at all of the usual suspects - d3.js, ElasticSearch, commercial, etc - and decided that none of them quite fit the cost or maintenance profile we were looking for.  Writing our own with d3 seemed like a ton of work in UX and development, ElasticSearch is legendary for being an operational nightmare to deploy and run, and the various other options required external SaaS contracts that would restrict our ability to deploy on GovCloud or other low-connectivity regions.

Grafana, though, had many of the elements that we were looking for.  An Open Source licensing model, easy to read source code, approachable documentation, scalable storage with S3, and support for OpenTelemetry in the form of Tempo.

However, Grafana itself is primarily deployed as a standalone app - think an IT department sharing a dashboard, or an operations team setting up alerts on a Prometheus database. Our needs are different and while there are hints, here and there about how to deploy it in an embedded ReactJS app, there was very little substantive guidance doing so.

After several months of effort, we wanted to share how we embedded Grafana in our ReactJS-based development environment, including leveraging our private authorization system to restrict access to customer data, and creating a platform for us to layer additional features on in the future.

Let’s take a closer look!
## Requirements

We started with several non-negotiable requirements:

  * ReactJS compatible - All of our existing UX was built in ReactJS, and we didn’t want to change that.
  * Single-login - customers login to your SaaS application, not again to the Grafana dashboard.  This must be true even if a customer opens a new window, refreshes a panel, etc.
  * Data isolation - data must be isolated between customers, in a way that protects confidentiality.
  * Panel rendering - logging and tracing are not the entire application, they’re enrichment around existing value. Therefore, the solution needs to render within a panel or `<div>` in the larger application.
  * Support the Grafana Explorer - many features in Grafana are rooted in the Explorer, and we wanted to allow our customers to explore their integration’s behavior, performance, and logs through that experience.
  * No authorization race conditions - only Fusebit’s authorization model is authoritative, and there should be no avenue to authenticate directly to Grafana without first engaging with Fusebit’s authorization mechanism.

Fortunately, the Grafana dashboard already supported an “iframe” version of its dashboard, which allowed us to render just the visual elements - a logging panel, for example - that we wanted within our existing development environment.

We spent some time thinking about building a more native version that integrated tighter with ReactJS, perhaps some form of a React component, but decided that was just too much effort.  An iframe, while not ideal, does provide the contextual separation that allows both our ReactJS application and the Grafana application to coexist.

## Solving for Authentication

Grafana has definitely been used by other people to do similar things in the past, but nothing quite matched the requirements we had.  Primarily, our need for a custom authorization model challenged the [generic OAuth](https://grafana.com/docs/grafana/latest/auth/generic-oauth/) model.  It wasn’t acceptable to force customers to re-login to Grafana when they’d already logged in to our integration console.

We then looked at the [Auth Proxy](https://grafana.com/docs/grafana/latest/auth/auth-proxy/) model. It definitely had the right elements but required us to repeat the authorization phase while fully proxying each API request to provide authentication header tokens.  While less than ideal, elements did match our existing deployment architecture with a centralized NodeJS application providing execution control.  Maybe we could combine the two?

The default authentication method works by directing users through a `/login` endpoint.  This endpoint then provides a `grafana_session` cookie that is provided on all subsequent requests.  We can combine this with the Auth Proxy to satisfy these requirements.

## Solution

After substantial consideration, we came up with the following architecture: within an iframe, supply an existing JWT to a special endpoint.  This endpoint would then exchange the JWT for a `grafana_session` cookie, and redirect the iframe from the special endpoint to the URL proxied by the service and backed by the actual Grafana instance.

### Dataflow diagram

![Grafana+React Authentication Flow with-shadow](auth_flow.svg "Grafana+React Authentication Flow")

Let’s take a look at each of these steps in more detail.

### Establishing Authentication
#### Delegating to the iframe

In our React app, we created an iframe and set it to a `bootstrap` endpoint, supplying as a query parameter a JWT `accessToken` that was supported by our existing backend infrastructure.

```javascript
  // Create a url to perform the authentication bootstrap between our JWT and
  // Grafana’s cookie
  const iframeUrl = new URL(`${baseUrl}grafana/bootstrap`);

  iframeUrl.search = new URLSearchParams({
    [FUSEBIT_QUERY_AUTHZ]: accessToken,
    // … add additional parameters here, like dashboard rendering variables
  }).toString();

  element.innerHTML = [
    `<div class="fusebit-logs-inner-container">`,
    `<iframe id="${id}" src="${iframeUrl.toString()}" style="position: relative; height: 100%; width: 100%;" scrolling="no" frameborder="0"></iframe>`,
    `</div>`,
  ].join('');
```

As you’ll see later in the Express implementation of the `bootstrap` endpoint, we actually support supplying other query parameters and extended parts of the URL.  These become parts of the URL that the iframe is redirected to post-authorization.

#### Extracting the Cookie

Once we’ve authorized the JWT in the server as having access to the logs and traces of the account (which can sometimes contain important information, so granular access control is a must!), we need to mint a session cookie to hand back to the browser.  This session cookie is supplied on every request to a Grafana endpoint, and provides the authorization details that Grafana uses to determine the organization and account of the current user.

Because we’re using a cookie-based authentication mechanism, the bootstrap URL needs to be in the same path hierarchy as the Grafana deployment itself.

With the authorized JWT in hand, we’re able to determine an `accountId` and an `orgId`.  The `accountId` is the username of the active user, from the perspective of Grafana, and is populated by our account provisioning system into Grafana’s internal database.  For `orgId`, we used our globally unique Fusebit account id.  Because we’re able to validate the account id and user prior to this step, we don’t have to worry about keeping Grafana’s database up-to-date - as long as the initial accounts are created, subsequent account removal can be performed opportunistically.

Together, the `accountId` and `orgId` are sufficient to fully authenticate a given request to the Grafana API.  These are supplied in the headers (change-able in `grafana.ini`) `X-WEBAUTH-USER` and `X-Grafana-Org-Id`.  See [Authentication HTTP API](https://grafana.com/docs/grafana/latest/http_api/auth/) and [Proxy Authentication](https://grafana.com/docs/grafana/latest/auth/auth-proxy/) for more details.

```javascript
    // Create a request with the right user/org to the Grafana API /login
    // endpoint to get a session cookie
    response = await superagent
      .get(`${grafana.location}/login`)
      .set(‘X-WEBAUTH-USER’, accountId)
      .set(‘X-Grafana-Org-Id’, orgId)
      .redirects(0)
      .ok((r) => r.status < 400);
```

By making this request to the `/login` endpoint, we convince the Grafana backend API to provide a `grafana_session` cookie that’s tied to that account within the specified organization.

Let’s extract out the cookie (or you can use a cookie parsing library):

```typescript
    // Extract out the cookie and expiration from the headers
    const sessionSetCookies = (response.headers['set-cookie'] as string[])
      .map(
        (setCookie) => setCookie.match(
          'grafana_session=(?<token>[a-f0-9]{32});.*Max-Age=(?<maxAge>[0-9]*);'
        )?.groups
      )
      .filter(x => x);

    if (sessionSetCookies.length !== 1) {
      return next(http_error(403, `Unable to login with account: ${accountId}`));
    }

    // Return the session in a Set-Cookie header to the client,
    // for subsequent requests
    const sessionCookie = sessionSetCookies[0].token;
    const sessionMaxAge = Number(sessionSetCookies[0].maxAge);
```

With the cookie in hand, we’re ready to send the iframe on to the proxied Grafana endpoint, setting the cookie to an appropriately restricted path and domain:

```javascript
    res.cookie('grafana_session', sessionCookie, {
      path: grafana.mountPoint,
      domain: API_PUBLIC_HOST,
      sameSite: 'none',
      secure: true,
      maxAge: sessionMaxAge,
    });
```

**Note**: while all of this is on the same site, setting `sameSite` to anything other than `none` prevented the cookie from being issued.

**Note**: Some adblockers interfere, inconsistently, with this process `¯\_(ツ)_/¯`

Finish off the bootstrap phase by redirecting the iframe to the endpoint, persisting any subordinate path elements or additional query parameters to the redirect itself.

```typescript
    // Redirect the browser to the actual Grafana url, with
    // a filtered set of query parameters
    const redirectUrl = new URL(`${API_PUBLIC_ENDPOINT}${grafana.mountPoint}/${req.params.subPath}`);
    Object.entries(req.query)
      .filter(([key]) =>
        key !== FUSEBIT_QUERY_AUTHZ &&
        key !== FUSEBIT_QUERY_ACCOUNT
      ).forEach(([key, value]) =>
        redirectUrl.searchParams.set(key, value));

    return res.redirect(redirectUrl.toString());
```

### Proxying data requests in NodeJS (bonus content)

While any modern traffic proxy could easily split traffic out between the authentication bootstrap endpoint and the rest of the endpoints, we ended up implementing this in our existing proxy infrastructure to avoid dealing with additional moving parts.  This is a fairly standard proxy implemented in express, with a whitelist of allowed headers.

It’s very important to make sure that proxy disallows the `X-WEBAUTH-USER` and `X-Grafana-Org-Id` headers, otherwise, a caller could arbitrarily set their identity to any other user, compromising data across the platform.

Here’s the list of headers that we allowed:

```javascript
const allowedHeaders = [
  'Date',
  'Transfer-Encoding',
  'Accept',
  'Accept-Encoding',
  'Host',
  'Origin',
  'Referer',
  'User-Agent',
  'Content-Encoding',
  'Content-Length',
  'Content-Type',
  'Cookie',
].map((entry) => entry.toLowerCase());
```

Then, we implemented a basic request proxy in express to the HTTP endpoint exposed in our internal infrastructure:

```typescript
router.use('*', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const headers: Record<string, any> = {};

  // Attach any query parameters
  const grafanaUrl = new URL(`${grafana.location}${req.params[0]}`);
  Object.entries(req.query).forEach(
    ([key, value]) => grafanaUrl.searchParams.set(key, value as any)
  );

  // Only copy approved headers over
  Object.entries(req.headers).forEach(([key, value]) => {
    if (typeof value === 'string' && allowedHeaders.includes(key.toLowerCase())) {
      headers[key] = value;
    }
  });

  const requestParams = {
    host: grafanaUrl.hostname,
    port: grafanaUrl.port,
    path: `${grafanaUrl.pathname}${grafanaUrl.search}`,
    method: req.method,
    headers,
  };

  // Proxy the request using the http library
  const connection = http.request(requestParams, (resp) => {
    Object.entries(resp.headers).forEach(([key, value]) => res.setHeader(key, value));
    resp.pipe(res);
  });

  connection.on('error', (e) => {
    return next(e);
  });

  // Pipe traffic between the two endpoints.
  req.pipe(connection, { end: true });
});
```

### Creating Accounts
We also need to provision an organization, an account, and a basic dashboard on account provisioning in our system.  We put some additional effort here to make sure it’s idempotent - this allows us to run the provisioning code whenever we want to change the default dashboard, add new panels, or alter data source configurations inside of Grafana:

```typescript
router.post(
  '/',
  authorize({ operation: AccountActions.updateAccount }),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const accountId = req.params.accountId;

    const creds = await grafana.getAdminCreds();

    let action: string = 'unknown';
    try {
      action = 'Create Organization';
      // Create the organization
      let response = await superagent
        .post(`${grafana.location}/api/orgs`)
        .set(grafana.authHeader, creds.grafana.admin_username)
        .send({ name: accountId })
        .ok((r) => r.status < 399 || r.status === 409);

      let orgId: number;
      if (response.status === 409) {
        action = 'Get Organization';
        // Organization already exists, query directly
        response = await superagent
          .get(`${grafana.location}/api/orgs/name/${accountId}`)
          .set(grafana.authHeader, creds.grafana.admin_username);
        orgId = response.body.id;
      } else {
        orgId = response.body.orgId;
      }

      let userId: number;
      action = 'Create User';
      // Create the user
      response = await superagent
        .post(`${grafana.location}/api/admin/users`)
        .set(grafana.authHeader, creds.grafana.admin_username)
        .send({
          name: accountId,
          email: accountId,
          login: accountId,
          password: crypto.randomBytes(16).toString('hex'),
          OrgId: orgId,
        })
        .ok((r) => r.status < 399 || r.status === 412);
      if (response.status === 412) {
        action = 'Get User ID';
        response = await superagent
          .get(`${grafana.location}/api/users/search?query=${accountId}`)
          .set(grafana.authHeader, creds.grafana.admin_username)
          .set(grafana.orgHeader, `${orgId}`);
        userId = response.body.users[0].id;
      } else {
        userId = response.body.id;
      }

      action = 'Update Role';
      // Set the role for the user to Viewer
      response = await superagent
        .patch(`${grafana.location}/api/org/users/${userId}`)
        .set(grafana.authHeader, creds.grafana.admin_username)
        .set(grafana.orgHeader, `${orgId}`)
        .send({ role: 'Viewer' }); // Change this from Viewer to Admin if you want more access.

      action = 'Create Datasources';
      // Create the datasources using the admin user
      const dataSources = addAccountId(accountId, defaultDatasources);
      await Promise.all(
        dataSources.map(async (dataSource: any) => {
          const addResponse = await superagent
            .post(`${grafana.location}/api/datasources`)
            .set(grafana.authHeader, creds.grafana.admin_username)
            .set(grafana.orgHeader, `${orgId}`)
            .send(dataSource)
            .ok((r) => r.status < 399 || r.status === 409);

          if (addResponse.status !== 409) {
            return addResponse;
          }

          // Update an existing datasource.
          const getDataSource = await superagent
            .get(`${grafana.location}/api/datasources/uid/${dataSource.uid}`)
            .set(grafana.authHeader, creds.grafana.admin_username)
            .set(grafana.orgHeader, `${orgId}`);

          const dataSourceId = getDataSource.body.id;

          return superagent
            .put(`${grafana.location}/api/datasources/${dataSourceId}`)
            .set(grafana.authHeader, creds.grafana.admin_username)
            .set(grafana.orgHeader, `${orgId}`)
            .send(dataSource);
        })
      );

      action = 'Create Dashboards';
      // Create the dashboards using the admin user (json)
      const dashboards = JSON.parse(
        JSON.stringify(defaultDashboards).replace(new RegExp('{{accountId}}', 'g'), req.params.accountId)
      );

      await Promise.all(
        dashboards.map((dashboard: any) =>
          superagent
            .post(`${grafana.location}/api/dashboards/db`)
            .set(grafana.authHeader, creds.grafana.admin_username)
            .set(grafana.orgHeader, `${orgId}`)
            .send({
              dashboard,
              overwrite: true,
            })
        )
      );

      res.send({ status: 'ok' });
    } catch (err) {
      // Leave this in for the moment just to accelerate diagnostics
      console.log(action, err.response?.error, err);
      return next(http_error(500, `Failed step '${action}': ${err.response?.error || err}`));
    }
  }
);
```

Figuring out exactly how to authenticate, specify the organization, and deal with idempotency was a bit of a challenge.  Hopefully, the above code helps you with your own implementation!
## To wrap up…

Hopefully, you’ll find the above code and implementation details helpful!  Don’t hesitate to reach out if you have any questions, and we’ll be happy to help push through.  You can find me on the [Fusebit Discord](https://discord.gg/SN4rhhCH), our [community Slack](https://join.slack.com/t/fusebitio/shared_invite/zt-qe7uidtf-4cs6OgaomFVgAF_fQZubfg), and at [benn@fusebit.io](mailto:benn@fusebit.io).

The next post will cover how we implemented direct publishing of logs to Loki, traces to Tempo, all from within our NodeJS backend!
