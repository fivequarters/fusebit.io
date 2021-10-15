const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    url: process.env.BASE_URL,
    canonicalUrl: process.env.CANONICAL_URL,
};
