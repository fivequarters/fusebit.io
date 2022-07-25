const fetch = require('node-fetch');

// eslint-disable-next-line func-names
module.exports = async function () {
    const integrationsFeedPromise = await fetch(`${process.env.PORTAL_BASE_URL}/feed/integrationsFeed.json`);

    function normalizeIntegration(i) {
        return {
            id: i.id,
            logo: i.smallIcon,
            name: i.name,
            outOfPlan: i.outOfPlan,
            catalog: i.tags.catalog,
            description: i.description,
            docs: i?.resources?.configureAppDocUrl,
            guide: i?.website_description,
        };
    }

    const integrationsFeed = await integrationsFeedPromise.json();

    const integrationsFeedFiltered = integrationsFeed.filter(
        (i) => !i.private && !i.parent,
    );

    const integrations = integrationsFeedFiltered.map((integration) => {
        const children = integrationsFeed.reduce((acc, curr) => {
            if (curr?.parent?.includes?.(integration.id) && !curr.private) {
                const int = normalizeIntegration(curr);
                acc.push(int);
            }

            return acc;
        }, []);

        return {
            ...normalizeIntegration(integration),
            children,
        };
    });

    return {
        permalink:
            process.env.ELEVENTY_ENV === 'production'
                ? "| #{ page.filePathStem.replace('/_pages/', '/') + (page.filePathStem === '/_pages/index' ? '.html' : '/index.html') }"
                : "| #{ page.filePathStem.replace('/_pages/', '/') }.html",
        integrations,
        integrationCategories: [
            'All',
            ...new Set(
                integrationsFeed.map((i) => i.tags.catalog.split(',')).flat(),
            ),
        ],
    };
};
