const htmlmin = require('html-minifier');
const fs = require('fs');

module.exports = function (eleventyConfig) {
    eleventyConfig.setUseGitIgnore(false);

    // Watch our compiled assets for changes
    eleventyConfig.addWatchTarget('./src/compiled-assets/main.css');
    eleventyConfig.addWatchTarget('./src/compiled-assets/main.js');
    eleventyConfig.addWatchTarget('./src/compiled-assets/vendor.js');

    // Copy src/compiled-assets to /assets
    eleventyConfig.addPassthroughCopy({ 'src/compiled-assets': 'assets' });
    // Copy all images
    eleventyConfig.addPassthroughCopy('src/assets/images');
    eleventyConfig.addPassthroughCopy('src/assets/vendor');
    eleventyConfig.addPassthroughCopy({ 'src/assets/meta': '/' });

    eleventyConfig.setBrowserSyncConfig({
        server: {
            baseDir: './dist',
            serveStaticOptions: {
                extensions: ['html'],
            },
        },
        callbacks: {
            ready: function (err, bs) {
                bs.addMiddleware('*', (req, res) => {
                    const content_404 = fs.readFileSync('dist/404.html');
                    res.writeHead(404, {
                        'Content-Type': 'text/html; charset=UTF-8',
                    });
                    res.write(content_404);
                    res.end();
                });
            },
        },
    });

    if (process.env.ELEVENTY_ENV === 'production') {
        eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
            if (outputPath.endsWith('.html')) {
                const minified = htmlmin.minify(content, {
                    collapseInlineTagWhitespace: false,
                    collapseWhitespace: true,
                    removeComments: true,
                    sortClassName: true,
                    useShortDoctype: true,
                });

                return minified;
            }

            return content;
        });
    }

    return {
        dir: {
            includes: '_components',
            input: 'src',
            layouts: '_layouts',
            output: 'dist',
        },
        templateFormats: ['pug', 'md'],
        htmlTemplateEngine: 'pug',
    };
};
