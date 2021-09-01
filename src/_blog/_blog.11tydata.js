module.exports = {
    permalink:
        "| #{tag === 'post' ? 'blog/index.html' : process.env.ELEVENTY_ENV === 'production' ? `blog/tags/${tag}/index.html` : `blog/tags/${tag}.html`}",
};
