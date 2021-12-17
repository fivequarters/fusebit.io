const fetch = require('node-fetch');

// eslint-disable-next-line func-names
module.exports = async function () {
    // 'https://stage-manage.fusebit.io/feed/integrationsFeed.json'

    const integrationsPromise = await fetch(
        'http://localhost:8080/integrationsFeed.json'
    );

    const integrations = await integrationsPromise.json();

    return {
        permalink:
            process.env.ELEVENTY_ENV === 'production'
                ? "| #{ page.filePathStem.replace('/_pages/', '/') + (page.filePathStem === '/_pages/index' ? '.html' : '/index.html') }"
                : "| #{ page.filePathStem.replace('/_pages/', '/') }.html",
        integrations: integrations.map((i) => ({
            id: i.id,
            logo: i.smallIcon,
            name: i.name,
            outOfPlan: i.outOfPlan,
            catalog: i.tags.catalog,
        })),
        integrationsCategories: [
            'All',
            ...new Set(
                integrations.map((i) => i.tags.catalog.split(',')).flat()
            ),
        ],
    };
};
