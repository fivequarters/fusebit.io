const cardOne = {
    className: 'hero__card-highlight--professional',
    title: 'Professional',
    price: 'Free Forever',
    features: ['3 connectors'],
    link: {
        id: 'price-tier-1',
        href: 'http://manage.fusebit.io/quickstart?key=slack',
        text: 'Login',
    },
    description:
        'Up to 5,000 executions of the integration logic per month across all connectors',
};

const cardTwo = {
    className: 'hero__card-highlight--business',
    title: 'Business',
    price: '$199/mo',
    features: ['10 connectors'],
    link: {
        id: 'price-tier-2',
        text: 'Contact',
    },
    description:
        'Up to 100,000 executions of the integration logic per month across all connectors',
};

const cardThree = {
    className: 'hero__card-highlight--enterprise',
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
    },
};

module.exports = {
    cards: [cardOne, cardTwo, cardThree],
};
