function blink(el, duration = 0.3, repeatDelay = 0) {
    const tl = new TimelineMax({ repeat: -1, repeatDelay });

    tl.to(el, duration, { alpha: 0 }).to(el, duration, { alpha: 1 });
}
