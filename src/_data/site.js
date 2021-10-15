const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    url: 'https://fusebit.io',
    intercomAppId: process.env.INTERCOM_APP_ID,
};
