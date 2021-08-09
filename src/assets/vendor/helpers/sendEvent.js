function sendEvent(category, action, label) {
    gtag('event', action, {
        event_category: category,
        event_label: label,
    });
}
