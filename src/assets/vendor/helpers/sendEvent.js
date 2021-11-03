(() => {
    const links = document.getElementsByClassName('track-with-segment');
    links.forEach((link) => {
        const eventName = link.dataset.eventName;
        const objectLocation = link.dataset.objectLocation;

        analytics.trackLink(link, eventName, {
            objectLocation,
            domain: 'fusebit.io',
        });
    });
})();
