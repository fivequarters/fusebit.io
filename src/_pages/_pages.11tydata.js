module.exports = {
    permalink: process.env.ELEVENTY_ENV === 'production' ? "| #{ page.filePathStem.replace('/_pages/', '/') + (page.filePathStem === '/_pages/index' ? '.html' : '/index.html') }" : "| #{ page.filePathStem.replace('/_pages/', '/') }.html",
};
