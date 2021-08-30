/* eslint-disable object-curly-newline */
module.exports = {
    eleventyComputed: {
        permalink: (data) => {
            // eslint-disable-next-line no-undef
            const { getYear, getDay, getMonth, slug: createSlug } = filters;

            const year = getYear(data.post_date);
            const day = getDay(data.post_date);
            const month = getMonth(data.post_date);
            const slug = createSlug(data.post_title || '');

            return `blog/${year}/${day}/${month}/${slug}.html`;
        },
    },
};
