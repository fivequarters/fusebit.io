function blink(el, duration = 0.3, repeatDelay = 0) {
    const tl = gsap.timeline({ repeat: -1, repeatDelay });

    tl.to(el, { duration, alpha: 0 });
    tl.to(el, { duration, alpha: 1 });
}
