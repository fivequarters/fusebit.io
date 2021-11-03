const freeCard = {
    highlightColor: 'var(--green)',
    title: 'Professional',
    price: 'Free Forever',
    features: ['3 connectors'],
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
    title: 'Business',
    price: '$199/mo',
    features: ['10 connectors'],
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
