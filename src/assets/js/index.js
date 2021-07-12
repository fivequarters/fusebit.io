/* eslint-disable */
import '../css/main.scss';

const screenRes = {
    isMobile: window.matchMedia('screen and (max-width: 700px)').matches,
    isTablet: window.matchMedia('screen and (max-width: 1000px)').matches,
    isDesktop: window.matchMedia('screen and (min-width: 1001px)').matches,
};

const scrollMagicController = new ScrollMagic.Controller();

const sectionHero = document.querySelector('.hero');
if (sectionHero) {
    const heroHeight = sectionHero.getBoundingClientRect().height;

    new ScrollMagic.Scene({
        triggerElement: sectionHero,
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
            sectionSupport.getBoundingClientRect().height,
            'support card base'
        );
        ballpath(
            '#support__dot--card1',
            'card1',
            0,
            300,
            220,
            'support card 1'
        );
        ballpath(
            '#support__dot--card2',
            'card2',
            1,
            300,
            220,
            'support card 2'
        );
        ballpath(
            '#support__dot--card3',
            'card3',
            2,
            300,
            220,
            'support card 3'
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

    if (screenRes.isDesktop) {
        featuresBase.to(featuresDot, {
            duration: 0.5,
            motionPath: {
                path: `.features__path--base--path1`,
                align: `.features__path--base--path1`,
                alignOrigin: [0.5, 0.5],
            },
        });

        new ScrollMagic.Scene({
            triggerElement: '.features',
            offset: -42,
            duration:
                document.querySelector('.features__path--base').clientHeight *
                1.2,
            triggerHook: 0.4,
        })
            .setTween(featuresBase)
            //.addIndicators({ name: 'Base path desktop' })
            .addTo(scrollMagicController);
    } else {
        featuresBase.to(featuresDot, {
            motionPath: {
                path: `.features__path--base--path3`,
                align: `.features__path--base--path3`,
                alignOrigin: [0.5, 0.5],
            },
        });

        new ScrollMagic.Scene({
            triggerElement: '.features',
            offset: -42,
            duration:
                document
                    .querySelector('.features__path--base--path3')
                    .getBoundingClientRect().height * 1.5,
            triggerHook: 0.4,
        })
            .setTween(featuresBase)
            //.addIndicators({ name: 'Base path mobile' })
            .addTo(scrollMagicController);
    }

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

    // Toggle active class to items into Features
    for (let i = 1; i <= 6; i++) {
        new ScrollMagic.Scene({
            triggerElement: '#f' + i,
            duration: document.querySelector('#f' + i).clientHeight,
            triggerHook: 0.7,
        })
            .setClassToggle('#f' + i, 'features__list--item-active')
            //.addIndicators()
            .addTo(scrollMagicController);
    }
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
        duration: integrationsHeight - integrationsHeight / 3,
    })
        .setTween('.integrations__item--image', {
            right: -100,
            opacity: 1,
        })
        //.addIndicators()
        .addTo(scrollMagicController);
}

const sectionWeprovide = document.querySelector('.weprovide');
if (sectionWeprovide) {
    const weprovideHeight = sectionWeprovide.getBoundingClientRect().height;

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
}
