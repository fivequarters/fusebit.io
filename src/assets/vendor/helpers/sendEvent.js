(() => {
    const links = document.getElementsByClassName('track-with-segment');
    links.forEach((link) => {
        const { eventName, objectLocation, ...rest } = link.dataset;

        analytics.trackLink(link, eventName, {
            objectLocation,
            domain: 'fusebit.io',
            ...(rest || {}),
        });
    });
})();
