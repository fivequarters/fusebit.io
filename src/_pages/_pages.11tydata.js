const fetch = require('node-fetch');

// eslint-disable-next-line func-names
module.exports = async function () {
    const integrationsPromise = await fetch(
        `${process.env.PORTAL_BASE_URL}/feed/integrationsFeed.json`,
    );

    const connectorsPromise = await fetch(
        `${process.env.PORTAL_BASE_URL}/feed/connectorsFeed.json`,
    );

    const integrations = (await integrationsPromise.json()).filter((i) => !i.private);

    const connectors = (await connectorsPromise.json()).filter((i) => !i.private && i.snippets);

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
        integrationCategories: [
            'All',
            ...new Set(
                integrations.map((i) => i.tags.catalog.split(',')).flat(),
            ),
        ],
        connectors: connectors.map((i) => ({
            id: i.id,
            logo: i.smallIcon,
            name: i.name,
            snippets: i.snippets,
        })),
    };
};
