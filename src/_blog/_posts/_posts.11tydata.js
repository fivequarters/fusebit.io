/* eslint-disable object-curly-newline */
const { getYear, getDate, getMonth } = require('date-fns');

module.exports = {
    eleventyComputed: {
        layout: 'post.pug',
        permalink: (data) => {
            // eslint-disable-next-line no-undef
            const slug = data.post_slug ? data.post_slug : filters.slug(data.post_title || '');

            if (data.post_date_in_url) {
                const date = new Date(data.date.replace('-', '/'));
                const year = getYear(date);
                const day = `${getDate(date)}`.padStart(2, '0');
                const month = `${getMonth(date) + 1}`.padStart(2, '0');

                return `blog/${year}/${month}/${day}/${slug}.html`;
            }

            return `blog/${slug}.html`;
        },
    },
};
