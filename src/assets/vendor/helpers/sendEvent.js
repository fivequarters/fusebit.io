function sendEvent(category, action, label) {
    const _label = label
        ? label
        : window.location.pathname.split('/').pop() || '';

    gtag('event', action, {
        event_category: category,
        event_label: '/' + _label,
    });
}
