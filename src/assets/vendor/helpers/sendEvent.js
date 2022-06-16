(() => {
    const analyticsLinks = document.getElementsByClassName('track-with-segment');
    const linkedinLinks = document.getElementsByClassName('track-with-linkedin');
    
    analyticsLinks.forEach((link) => {
        const { eventName, objectLocation, ...rest } = link.dataset;

        analytics.trackLink(link, eventName, {
            objectLocation,
            domain: 'fusebit.io',
            ...(rest || {}),
        });
    });

    linkedinLinks.forEach((link) => {
        link.addEventListener('click', () => {
            window.lintrk('track', { conversion_id: 8344146 });
        });
    });
})();
