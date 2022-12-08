const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    url: process.env.BASE_URL,
    canonicalUrl: process.env.CANONICAL_URL,
    portalBaseUrl: process.env.PORTAL_BASE_URL,
    connectorsFeedUrl: process.env.CONNECTORS_FEED_URL || `${process.env.PORTAL_BASE_URL}/feed/connectorsFeed.json`,
};
