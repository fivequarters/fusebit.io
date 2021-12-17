const fetch = require('node-fetch');

// eslint-disable-next-line func-names
module.exports = async function () {
    const integrationsPromise = (
        await fetch(
            'https://stage-manage.fusebit.io/feed/integrationsFeed.json',
        )
    );

    const integrations = await integrationsPromise.json();

    return {
        permalink:
            process.env.ELEVENTY_ENV === 'production'
                ? "| #{ page.filePathStem.replace('/_pages/', '/') + (page.filePathStem === '/_pages/index' ? '.html' : '/index.html') }"
                : "| #{ page.filePathStem.replace('/_pages/', '/') }.html",
        integrations: integrations.map(((i) => ({
            id: i.id,
            logo: i.smallIcon,
            name: i.name,
            outOfPlan: i.outOfPlan,
        }))),
    };
};
