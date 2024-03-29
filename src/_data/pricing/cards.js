const freeCard = {
    highlightColor: 'var(--green)',
    title: 'Developer',
    price: 'Free',
    features: [
        '3 SaaS integrations',
        'Add integrations to your multi-tenant application',
        'Accelerate integration development with Fusebit Framework, Node.js, and NPM',
        'Run, scale, secure, and monitor integrations in Fusebit Cloud Runtime',
        'Automate deployments using CLI',
        'Invite your team',
        'Community support',
    ],
    link: {
        id: 'price-tier-1',
        text: 'Contact',
        location: 'Price Tier 1',
        eventName: 'Price Tier Button Clicked',
        onClick: "openModal('#modal__pricing')",
    },
    description:
        'Up to 5,000 executions of the integration logic per month across all connectors',
};

const businessCard = {
    highlightColor: 'var(--yellow)',
    title: 'Team',
    price: '$499/month',
    features: [
        'All the features of Developer, plus',
        '10 SaaS integrations',
        'Advanced integration analytics',
        'Email support',
    ],
    link: {
        id: 'price-tier-2',
        text: 'Contact',
        location: 'Price Tier 2',
        eventName: 'Price Tier Button Clicked',
        onClick: "openModal('#modal__pricing')",
    },
    description:
        'Up to 100,000 executions of the integration logic per month across all connectors',
};

const enterpriseCard = {
    highlightColor: 'var(--orange)',
    title: 'Enterprise',
    price: 'Custom Pricing',
    features: [
        'Everything in Team, plus',
        'Unlimited SaaS integrations',
        'Custom limits',
        'Dedicated deployment',
        'Private Cloud',
        'Self-managed deployment',
        'Data locality',
        'Dedicated support & SLA',
    ],
    link: {
        id: 'price-tier-3',
        text: 'Contact',
        location: 'Price Tier 3',
        eventName: 'Price Tier Button Clicked',
        onClick: "openModal('#modal__pricing')",
    },
};

module.exports = {
    cards: [freeCard, businessCard, enterpriseCard],
};
