function sendEvent(category, action, label) {
    // TODO: Access to proccess.env to check if the path has / or not at the end
    const _label = label ? label : window.location.pathname.split('/')[1] || '';

    gtag('event', action, {
        event_category: category,
        event_label: '/' + _label,
    });
}

function notifySegment(event, objectLocation) {
    analytics.track(event, {
        objectLocation,
        domain: 'fusebit.io',
    });
}
