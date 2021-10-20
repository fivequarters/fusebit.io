const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    intercomAppId: process.env.INTERCOM_APP_ID,
    url: process.env.BASE_URL,
    canonicalUrl: process.env.CANONICAL_URL,
};
