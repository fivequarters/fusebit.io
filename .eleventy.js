const htmlmin = require('html-minifier');
const fs = require('fs');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const { format } = require('date-fns');
const Image = require('@11ty/eleventy-img');
const { parseHTML } = require('linkedom');

function getImageMeta(src, widths) {
    const options = {
        widths: widths || [300, 600, 900, 1200, null],
        formats: ['png', 'webp', 'jpg'],
        outputDir: process.env.ELEVENTY_ENV === 'production' ? './build/assets/images/11ty' : './src/assets/images/11ty',
        urlPath: '/assets/images/11ty',
    };

    const url = `./src/assets/images/${src}`;

    Image(url, options);

    return Image.statsSync(url, options);
}

function getImageUrl(src, width, format = 'jpeg', widths) {
    const metadata = getImageMeta(src, widths);

    return metadata[format]?.find((image) => image.width === width)?.url || '';
}

function getImageTag(src, alt = '', sizes, attrs = {}, widths) {
    const metadata = getImageMeta(src, widths);

    const imageAttributes = {
        alt,
        loading: 'lazy',
        decoding: 'async',
        sizes: sizes || '(min-width: 768px) 50vw, 100vw',
        ...attrs,
    };

    return Image.generateHTML(metadata, imageAttributes);
}

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
    eleventyConfig.addPassthroughCopy({ public: '/' });
    eleventyConfig.addPlugin(syntaxHighlight);

    eleventyConfig.setBrowserSyncConfig({
        server: {
            baseDir: ['./build'],
            serveStaticOptions: {
                extensions: ['html'],
            },
        },
        callbacks: {
            ready: function (err, bs) {
                bs.addMiddleware('*', (req, res) => {
                    const content_404 = fs.readFileSync('build/404/index.html');
                    res.writeHead(404, {
                        'Content-Type': 'text/html; charset=UTF-8',
                    });
                    res.write(content_404);
                    res.end();
                });
            },
        },
    });

    eleventyConfig.addTransform(
        'transform-blog-images',
        function (content, outputPath) {
            if (outputPath.endsWith('.html') && outputPath.includes('blog')) {
                const { document } = parseHTML(content);

                const images = [
                    ...document.querySelectorAll('img:not(#hero-image)'),
                ];

                images
                    .filter((i) => !i.src.includes('svg') && !i.src.includes('footer__bg'))
                    .forEach((i) => {
                        i.outerHTML = getImageTag(`blog/${i.src}`, i.alt, null);
                    });

                return `<!DOCTYPE html>${document.documentElement.outerHTML}`;
            }

            return content;
        }
    );

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

    eleventyConfig.addFilter('keys', (obj) => Object.keys(obj));
    eleventyConfig.addFilter('format', format);
    eleventyConfig.addFilter('getImageTag', getImageTag);
    eleventyConfig.addFilter('getImageUrl', getImageUrl);

    global.filters = eleventyConfig.javascriptFunctions;
    eleventyConfig.setPugOptions({
        globals: ['filters'],
    });

    return {
        dir: {
            includes: '_components',
            input: 'src',
            layouts: '_layouts',
            output: 'build',
        },
        templateFormats: ['pug', 'md'],
        htmlTemplateEngine: 'pug',
    };
};
