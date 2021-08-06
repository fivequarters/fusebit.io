module.exports = {
    permalink: process.env.ELEVENTY_ENV === 'production' ? "| #{ page.filePathStem.replace('/_pages/', '/') }/index.html" : "| #{ page.filePathStem.replace('/_pages/', '/') }.html",
};
