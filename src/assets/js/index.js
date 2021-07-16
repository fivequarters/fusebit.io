/* eslint-disable */
import '../css/main.scss';

const screenRes = {
    isMobile: window.matchMedia('screen and (max-width: 700px)').matches,
    isTablet: window.matchMedia('screen and (max-width: 1000px)').matches,
    isDesktop: window.matchMedia('screen and (min-width: 1001px)').matches,
    isBigRes: window.matchMedia('screen and (min-height: 1439px)').matches,
};

const scrollMagicController = new ScrollMagic.Controller();

const sectionHero = document.querySelector('.hero');
if (sectionHero) {
    const heroHeight = sectionHero.getBoundingClientRect().height;

    new ScrollMagic.Scene({
        triggerElement: sectionHero,
        triggerHook: screenRes.isBigRes ? 0.2 : 0.5,
        offset: heroHeight / 1.6,
        duration: heroHeight / 2,
    })
        .setTween('.hero__images--desktop', {
            left: '120%',
            opacity: 0,
        })
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: sectionHero,
        triggerHook: screenRes.isBigRes ? 0.2 : 0.5,
        offset: heroHeight / 1.4,
        duration: heroHeight / 2,
    })
        .setTween('.hero__images--mobile', {
            left: '120%',
            opacity: 0,
        })
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: sectionHero,
        triggerHook: screenRes.isBigRes ? 0.185 : 0.5,
        offset: heroHeight / 2,
        duration: heroHeight,
    })
        .setTween('.hero__title', {
            left: -400,
            opacity: 0,
        })
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: sectionHero,
        triggerHook: screenRes.isBigRes ? 0.2 : 0.5,
        offset: heroHeight / 2,
        duration: heroHeight,
    })
        .setTween('.hero__text', {
            left: -200,
            opacity: 0,
        })
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: sectionHero,
        triggerHook: screenRes.isBigRes ? 0.2 : 0.5,
        offset: heroHeight / 2,
        duration: heroHeight,
    })
        .setTween('.hero__cta', {
            left: -100,
            opacity: 0,
        })
        .addTo(scrollMagicController);
}

const sectionSupport = document.querySelector('.support');
if (sectionSupport) {
    const supportHeight = sectionSupport.getBoundingClientRect().height;
    const supportDot = sectionSupport.querySelector('.support__path--dot');
    const allCards = sectionSupport.querySelectorAll('.card');
    const supportBase = new gsap.timeline();

    if (window.matchMedia('(min-width: 1175px)').matches) {
        function ballpath(
            target,
            targetPath,
            cardPos,
            offset,
            duration,
            indicatorName
        ) {
            function handleActiveCard(progress, val, currCard, debug) {
                if (debug) console.log(progress);

                if (progress == val) {
                    allCards[currCard].classList.add('card--active');
                } else {
                    allCards[currCard].classList.remove('card--active');
                }
            }

            const gsapTimeline = new gsap.timeline();

            const options = (id, isReverse) => ({
                duration: 0.5,
                motionPath: {
                    path: `.support__path--${id}--path`,
                    align: `.support__path--${id}--path`,
                    alignOrigin: [0.5, 0.5],
                    start: isReverse ? 1 : 0,
                    end: isReverse ? 0 : 1,
                },
            });
            gsapTimeline.to(target, options(targetPath, false));

            // Path 1
            new ScrollMagic.Scene({
                triggerElement: '.support',
                duration: duration,
                offset: offset,
                triggerHook: 0.75,
            })
                .setTween(gsapTimeline)
                .on('progress', (e) => {
                    if (targetPath !== 'base') {
                        handleActiveCard(e.progress, 1, cardPos, false);
                    }
                })
                //.addIndicators({ name: indicatorName })
                .addTo(scrollMagicController);
        }
        ballpath(
            '#support__dot--card0',
            'base',
            3,
            300,
            screenRes.isDesktop ? supportHeight * 1.82 : supportHeight * 1.7,
            'SUPPORT'
        );
    } else {
        supportBase.to(supportDot, {
            duration: 0.5,
            motionPath: {
                path: `.support__path--base--path`,
                align: `.support__path--base--path`,
                alignOrigin: [0.5, 0.5],
            },
        });

        new ScrollMagic.Scene({
            triggerElement: '.support',
            offset: 0,
            duration: document.querySelector('.support__path--base')
                .clientHeight,
            triggerHook: 0,
        })
            .setTween(supportBase)
            //.addIndicators({ name: 'Base path' })
            .addTo(scrollMagicController);
    }

    new ScrollMagic.Scene({
        triggerElement: sectionSupport,
        triggerHook: 1,
        offset: 100,
        duration: 400,
    })
        .setTween('.support__title', {
            top: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: sectionSupport,
        triggerHook: 1,
        offset: 100,
        duration: supportHeight / 1.5,
    })
        .setTween('.support__text', {
            top: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: sectionSupport,
        triggerHook: 0.85,
        offset: 0,
        duration: 400,
    })
        .setTween('.support__image', {
            left: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);
}

const sectionFeatures = document.querySelector('.features');
if (sectionFeatures) {
    const featuresHeight = sectionFeatures.getBoundingClientRect().height;
    const featuresDot = sectionFeatures.querySelector('.features__path--dot');
    const featuresBase = new gsap.timeline();

    featuresBase.to(featuresDot, {
        motionPath: {
            path: screenRes.isDesktop
                ? `.features__path--base--path1`
                : `.features__path--base--path3`,

            align: screenRes.isDesktop
                ? `.features__path--base--path1`
                : `.features__path--base--path3`,
            alignOrigin: [0.5, 0.5],
        },
    });

    function setElement(obj, target) {
        const item = sectionFeatures.querySelector(obj);
        const itemRect = item.getBoundingClientRect();

        return {
            item: item,
            rect: itemRect,
        };
    }

    function isIntersecting(obj1, obj2) {
        if (obj1 >= obj2.rect.top && obj1 <= obj2.rect.bottom) {
            obj2.item.classList.add('features__list--item-active');
        } else {
            obj2.item.classList.remove('features__list--item-active');
        }
    }

    new ScrollMagic.Scene({
        triggerElement: '.features',
        offset: -55,
        duration: screenRes.isDesktop
            ? featuresHeight * 1.1
            : featuresHeight * 1.2,
        triggerHook: 0.25,
    })
        .setTween(featuresBase)
        .on('progress', (e) => {
            const dotRect = featuresDot.getBoundingClientRect();
            const dotMiddle = dotRect.top + dotRect.height / 2;

            for (let i = 1; i <= 6; i++) {
                const item = setElement('#f' + i);

                isIntersecting(dotMiddle, item);
            }
        })
        //.addIndicators({ name: 'FEATURES' })
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: '.features',
        triggerHook: 1,
        offset: 400,
        duration: 300,
    })
        .setTween('.features__title--1', {
            top: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);

    // Marketplace
    new ScrollMagic.Scene({
        triggerElement: '.features',
        triggerHook: 1,
        offset: 200,
        duration: 500,
    })
        .setTween('.features__images--marketplace', {
            left: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: '.features',
        triggerHook: 1,
        offset: featuresHeight / 2,
        duration: 500,
    })
        .setTween('.features__title--2', {
            top: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);

    // graph
    new ScrollMagic.Scene({
        triggerElement: '.features',
        triggerHook: 1,
        offset: featuresHeight / 1.8,
        duration: 300,
    })
        .setTween('.features__images--graph', {
            left: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);
}

const sectionIntegrate = document.querySelector('.integrate');
if (sectionIntegrate) {
    new ScrollMagic.Scene({
        triggerElement: sectionIntegrate,
        triggerHook: 1,
        offset: 0,
        duration: 400,
    })
        .setTween('.integrate__title', {
            top: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: sectionIntegrate,
        triggerHook: 1,
        offset: 100,
        duration: 500,
    })
        .setTween('.integrate__cta', {
            top: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);
}

const sectionIntegrations = document.querySelector('.integrations');
if (sectionIntegrations) {
    const integrationsHeight =
        sectionIntegrations.getBoundingClientRect().height;
    const integrationsDot = sectionIntegrations.querySelector(
        '.integrations__path--dot'
    );

    const integrationsItems = sectionIntegrations.querySelectorAll(
        '.integrations__item'
    );
    function isDotIntersecting(obj1, obj2) {
        if (
            obj1 >= obj2.getBoundingClientRect().top &&
            obj1 <= obj2.getBoundingClientRect().bottom
        ) {
            return true;
        }

        return false;
    }

    new ScrollMagic.Scene({
        triggerElement: '.integrations',
        triggerHook: 0.5,
        offset: screenRes.isMobile ? 100 : integrationsHeight / 3,
        duration: screenRes.isMobile
            ? integrationsHeight - 100
            : integrationsHeight * 1.5,
    })
        .setTween(integrationsDot, {
            motionPath: {
                path: `.integrations__path--path`,
                align: `.integrations__path--path`,
                alignOrigin: [0.5, 0.5],
            },
        })
        .on('progress', (e) => {
            const dotRect = integrationsDot.getBoundingClientRect();
            const dotMiddle = dotRect.top + dotRect.height / 2;

            for (let i = 0; i < integrationsItems.length; i++) {
                const item = integrationsItems[i];
                const itemIcon = item.querySelector(
                    '.integrations__item--icon'
                );

                const activeClass = screenRes.isDesktop
                    ? 'integrations__item-active'
                    : 'integrations__item-active-indicator';

                if (isDotIntersecting(dotMiddle, item)) {
                    item.classList.add(activeClass);
                    integrationsDot.style.opacity = 0;
                } else if (
                    !isDotIntersecting(dotMiddle, item) &&
                    item.classList.contains(activeClass)
                ) {
                    item.classList.remove(activeClass);
                    integrationsDot.style.opacity = 1;
                }
            }
        })
        //.addIndicators({ name: 'INTEGRATIONS' })
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: sectionIntegrations,
        triggerHook: 1,
        offset: 0,
        duration: integrationsHeight / 2,
    })
        .setTween('.integrations__title', {
            top: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: sectionIntegrations,
        triggerHook: 1,
        offset: 0,
        duration: integrationsHeight / 2,
    })
        .setTween('.integrations__text', {
            left: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: sectionIntegrations,
        triggerHook: 1,
        offset: integrationsHeight / 4,
        duration: screenRes.isMobile
            ? 400
            : integrationsHeight - integrationsHeight / 3,
    })
        .setTween('.integrations__item--image', {
            right: screenRes.isMobile ? -50 : -100,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);
}

const sectionWeprovide = document.querySelector('.weprovide');
if (sectionWeprovide) {
    const weprovideHeight = sectionWeprovide.getBoundingClientRect().height;
    const weprovideDot = sectionWeprovide.querySelector(
        '.weprovide__path--dot'
    );

    const weprovideItems =
        sectionWeprovide.querySelectorAll('.weprovide__item');
    function isDotIntersecting(obj1, obj2) {
        if (
            obj1 >= obj2.getBoundingClientRect().left &&
            obj1 <= obj2.getBoundingClientRect().right
        ) {
            return true;
        }

        return false;
    }

    new ScrollMagic.Scene({
        triggerElement: '.weprovide',
        triggerHook: 0.5,
        offset: weprovideHeight / 5.7,
        duration: weprovideHeight - weprovideHeight / 2,
    })
        .setTween(weprovideDot, {
            motionPath: {
                path: screenRes.isDesktop
                    ? '.weprovide__path--desktop--path'
                    : '.weprovide__path--mobile--path',
                align: screenRes.isDesktop
                    ? '.weprovide__path--desktop--path'
                    : '.weprovide__path--mobile--path',
                alignOrigin: [0.5, 0.5],
            },
        })
        .on('progress', (e) => {
            weprovideDot.style.opacity = e.progress > 0 ? 1 : 0;

            const dotRect = weprovideDot.getBoundingClientRect();
            const dotMiddle = dotRect.left - dotRect.width / 2;

            for (let i = 0; i < weprovideItems.length; i++) {
                const item = weprovideItems[i];
                const itemIcon = item.querySelector('.weprovide__item--icon');

                if (isDotIntersecting(dotMiddle, itemIcon)) {
                    item.classList.add('weprovide__item--active');
                    weprovideDot.style.opacity = 0;
                } else if (
                    !isDotIntersecting(dotMiddle, itemIcon) &&
                    item.classList.contains('weprovide__item--active')
                ) {
                    item.classList.remove('weprovide__item--active');
                    weprovideDot.style.opacity = 0;
                }
            }
        })
        //.addIndicators({ name: 'WEPROVIDE' })
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: sectionWeprovide,
        triggerHook: 1,
        offset: 0,
        duration: 400,
    })
        .setTween('.weprovide__title', {
            top: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);
}

const sectionTestimonials = document.querySelector('.testimonials');
if (sectionTestimonials) {
    const testimonialsHeight =
        sectionTestimonials.getBoundingClientRect().height;

    new ScrollMagic.Scene({
        triggerElement: sectionTestimonials,
        triggerHook: 1,
        offset: 0,
        duration: testimonialsHeight / 2,
    })
        .setTween('.testimonials__title', {
            top: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: sectionTestimonials,
        triggerHook: 1,
        offset: 0,
        duration: testimonialsHeight / 1.5,
    })
        .setTween('.testimonials__text', {
            top: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);
}

const sectionPrefooter = document.querySelector('.prefooter');
if (sectionPrefooter) {
    const prefooterHeight = sectionPrefooter.getBoundingClientRect().height;
    const prefooterDot = document.querySelector('.prefooter__path--dot');

    new ScrollMagic.Scene({
        triggerElement: sectionPrefooter,
        triggerHook: 1,
        offset: 0,
        duration: prefooterHeight / 2,
    })
        .setTween('.prefooter__title', {
            left: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: sectionPrefooter,
        triggerHook: 1,
        offset: 0,
        duration: prefooterHeight / 1.5,
    })
        .setTween('.prefooter__text', {
            left: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);

    new ScrollMagic.Scene({
        triggerElement: sectionPrefooter,
        triggerHook: 1,
        offset: 0,
        duration: prefooterHeight / 1,
    })
        .setTween('.prefooter__cta', {
            left: 0,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);

    gsap.timeline({
        repeat: -1,
        repeatDelay: 3,
    }).to(prefooterDot, {
        motionPath: {
            path: '.prefooter__path--path',
            align: '.prefooter__path--path',
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0.9,
            //start: 0.53,
            end: 1.9,
        },
        duration: 8,
        ease: 'power1.inOut',
        onUpdate: function () {
            if (this.progress() > 0.55 && this.progress() < 0.76) {
                prefooterDot.classList.add('prefooter__path--dot--blured');
            } else if (
                prefooterDot.classList.contains('prefooter__path--dot--blured')
            ) {
                prefooterDot.classList.remove('prefooter__path--dot--blured');
            }
        },
    });
}
