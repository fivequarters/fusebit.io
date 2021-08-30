/* eslint-disable object-curly-newline */
const { getYear, getDate, getMonth } = require('date-fns');

module.exports = {
    eleventyComputed: {
        permalink: (data) => {
            const date = new Date(data.date.replace('-', '/'));
            const year = getYear(date);
            const day = `${getDate(date)}`.padStart(2, '0');
            const month = `${getMonth(date) + 1}`.padStart(2, '0');

            // eslint-disable-next-line no-undef
            const slug = filters.slug(data.post_title || '');

            return `blog/${year}/${day}/${month}/${slug}.html`;
        },
    },
};
