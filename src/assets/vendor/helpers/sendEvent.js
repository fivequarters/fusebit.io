function sendEvent(category, action, label) {
    // TODO: Access to proccess.env to check if the path has / or not at the end
    const _label = label ? label : window.location.pathname.split('/')[1] || '';

    gtag('event', action, {
        event_category: category,
        event_label: '/' + _label,
    });
}

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
