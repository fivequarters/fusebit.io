const freeCard = {
    highlightColor: 'var(--green)',
    title: 'Developer',
    price: 'Free Forever',
    features: [
        '10 SaaS integrations',
        'Add integrations to your multi-tenant application',
        'Accelerate integration development with Fusebit Framework, Node.js, and NPM',
        'Run, scale, secure, and monitor integrations in Fusebit Cloud Runtime',
        'Automate deployments using CLI',
        'Invite your team',
        'Get community support'
    ],
    link: {
        id: 'price-tier-1',
        href: 'https://account.fusebit.io/signup',
        text: 'Get Started for Free',
        location: 'Price Tier 1',
        eventName: 'Price Tier Button Clicked',
        target: '_blank',
        rel: 'noreferrer',
    },
    description:
        'Up to 5,000 executions of the integration logic per month across all connectors',
};

const businessCard = {
    highlightColor: 'var(--yellow)',
    title: 'Team',
    price: '$199/mo',
    features: [
        'All the features of Developer, plus',
        '30 SaaS integrations',
        'Advanced integration analytics'
    ],
    link: {
        id: 'price-tier-2',
        text: 'Contact',
        location: 'Price Tier 2',
        eventName: 'Price Tier Button Clicked',
    },
    description:
        'Up to 100,000 executions of the integration logic per month across all connectors',
};

const enterpriseCard = {
    highlightColor: 'var(--orange)',
    title: 'Enterprise',
    price: 'Custom pricing',
    features: [
        'Everything in Team, plus',
        'Unlimited SaaS integrations',
        'Custom limits',
        'Dedicated deployment',
        'Private Cloud',
        'Self-managed deployment',
        'Data locality',
        'Business support',
        'SLA',
    ],
    link: {
        id: 'price-tier-3',
        text: 'Contact',
        location: 'Price Tier 3',
        eventName: 'Price Tier Button Clicked',
    },
};

module.exports = {
    cards: [freeCard, businessCard, enterpriseCard],
};
