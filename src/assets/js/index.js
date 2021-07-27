/* eslint-disable */
import '../css/main.scss';

const screenRes = {
    isMobile: window.matchMedia('screen and (max-width: 700px)').matches,
    isTablet: window.matchMedia('screen and (max-width: 1000px)').matches,
    isDesktop: window.matchMedia('screen and (min-width: 1001px)').matches,
    isBigRes: window.matchMedia('screen and (min-height: 1439px)').matches,
    isCustom: function (size) {
        return window.matchMedia('screen and (max-width: ' + size + 'px)')
            .matches;
    },
};

const scrollMagicController = new ScrollMagic.Controller();

const homepage = document.querySelector('.homepage');
if (homepage) {
    const initialPosition = {
        top: 0,
        opacity: 1,
    };

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
                screenRes.isDesktop
                    ? supportHeight * 1.82
                    : supportHeight * 1.7,
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
                .addTo(scrollMagicController);
        }

        new ScrollMagic.Scene({
            triggerElement: sectionSupport,
            triggerHook: 1,
            offset: 100,
            duration: 270,
        })
            .setTween('.support__title', initialPosition)
            .addTo(scrollMagicController);

        new ScrollMagic.Scene({
            triggerElement: sectionSupport,
            triggerHook: 1,
            offset: 100,
            duration: 300,
        })
            .setTween('.support__text', initialPosition)
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
            .addTo(scrollMagicController);
    }

    const sectionFeatures = document.querySelector('.features');
    if (sectionFeatures) {
        const featuresHeight = sectionFeatures.getBoundingClientRect().height;
        const featuresDot = sectionFeatures.querySelector(
            '.features__path--dot'
        );
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
            const padding = 16;

            if (
                obj1 >= obj2.rect.top - padding &&
                obj1 <= obj2.rect.bottom + padding
            ) {
                return true;
            } else {
                return false;
            }
        }

        const featuresSceneDuration = featuresHeight * 1.7;
        const featuresScene = new ScrollMagic.Scene({
            triggerElement: '.features',
            offset: -400,
            duration: screenRes.isDesktop
                ? featuresSceneDuration
                : featuresHeight * 1.2,
            triggerHook: 0.25,
        })
            .setTween(featuresBase)
            .on('progress', (e) => {
                const dotRect = featuresDot.getBoundingClientRect();
                const dotMiddle = dotRect.top + dotRect.height / 2;

                let counter = 0;
                for (let i = 1; i <= 6; i++) {
                    const item = setElement('#f' + i);

                    if (isIntersecting(dotMiddle, item)) {
                        item.item.classList.add('features__list--item-active');
                        featuresDot.style.opacity = 0;
                    } else {
                        item.item.classList.remove(
                            'features__list--item-active'
                        );
                        counter++;
                    }
                }

                if (counter === 6) {
                    featuresDot.style.opacity = 1;
                }

                if (screenRes.isDesktop) {
                    if (
                        e.progress > 0.2393 &&
                        featuresScene.duration() !== 2000 &&
                        e.scrollDirection === 'FORWARD'
                    ) {
                        featuresScene.duration(2000);
                    } else if (
                        e.progress < 0.4345 &&
                        featuresScene.duration() === 2000 &&
                        e.scrollDirection === 'REVERSE'
                    ) {
                        featuresScene.duration(featuresSceneDuration);
                    }
                }
            })
            .addTo(scrollMagicController);

        new ScrollMagic.Scene({
            triggerElement: '.features',
            triggerHook: 1,
            offset: 100,
            duration: 300,
        })
            .setTween('.features__title--1', initialPosition)
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
            .addTo(scrollMagicController);

        new ScrollMagic.Scene({
            triggerElement: '.features',
            triggerHook: 1,
            offset: featuresHeight / 2,
            duration: 500,
        })
            .setTween('.features__title--2', initialPosition)
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
            offset: -100,
            duration: 400,
        })
            .setTween('.integrate__title', initialPosition)
            //.addIndicators({ name: 'title' })
            .addTo(scrollMagicController);

        new ScrollMagic.Scene({
            triggerElement: sectionIntegrate,
            triggerHook: 1,
            offset: 0,
            duration: 500,
        })
            .setTween('.integrate__cta', initialPosition)
            //.addIndicators({ name: 'cta' })
            .addTo(scrollMagicController);

        // Orbital
        /* function initOrbitalBall(obj, path, startEnd, duration) {
            // Paths 1 - 2 - 3 - 4

            gsap.timeline({
                repeat: -1,
            }).to(document.querySelector(obj), {
                motionPath: {
                    path: `.integrate__orbital--${path}`,
                    align: `.integrate__orbital--${path}`,
                    alignOrigin: [0.5, 0.5],
                    autoRotate: false,
                    start: startEnd,
                    end: startEnd,
                },
                duration: duration,
                ease: 'linear',
            });
        }
        initOrbitalBall('#orbit__ball--2', 1, 0.1, 12);
        initOrbitalBall('#orbit__ball--3', 2, 0, 15);
        initOrbitalBall('#orbit__ball--4', 2, 0.8, 15);
        initOrbitalBall('#orbit__ball--5', 3, 0.3, 18);
        initOrbitalBall('#orbit__ball--6', 3, 0.9, 18);
        initOrbitalBall('#orbit__ball--7', 4, 0.3, 21);
        initOrbitalBall('#orbit__ball--8', 4, 0.6, 21);
        initOrbitalBall('#orbit__ball--9', 4, 0.8, 21); */
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

        let scDuration = 0;
        if (screenRes.isMobile) {
            scDuration = integrationsHeight * 1.5;
        } else if (screenRes.isCustom(1400)) {
            scDuration = integrationsHeight;
        } else {
            scDuration = integrationsHeight * 2;
        }

        new ScrollMagic.Scene({
            triggerElement: '.integrations',
            triggerHook: 0.7,
            offset: screenRes.isMobile ? 100 : integrationsHeight / 3,
            duration: scDuration,
        })
            .setTween(integrationsDot, {
                motionPath: {
                    path: screenRes.isMobile
                        ? `.integrations__path--mobile--path`
                        : `.integrations__path--desktop--path`,
                    align: screenRes.isMobile
                        ? `.integrations__path--mobile--path`
                        : `.integrations__path--desktop--path`,
                    alignOrigin: [0.5, 0.5],
                },
            })
            .on('progress', (e) => {
                const dotRect = integrationsDot.getBoundingClientRect();
                const dotMiddle = dotRect.top + dotRect.height / 2;

                let counter = 0;
                for (let i = 0; i < integrationsItems.length; i++) {
                    const item = integrationsItems[i];

                    const activeClass = 'integrations__item-active';

                    if (screenRes.isMobile) {
                        item.classList.add(activeClass);
                    } else {
                        if (isDotIntersecting(dotMiddle, item)) {
                            item.classList.add(activeClass);
                            integrationsDot.style.opacity = 0;
                        } else {
                            item.classList.remove(activeClass);
                            counter++;
                        }

                        if (counter === 3) {
                            integrationsDot.style.opacity = 1;
                        }
                    }
                }
            })
            .addTo(scrollMagicController);

        new ScrollMagic.Scene({
            triggerElement: sectionIntegrations,
            triggerHook: 1,
            offset: -100,
            duration: 200,
        })
            .setTween('.integrations__title', initialPosition)
            //.addIndicators({ name: 'title' })
            .addTo(scrollMagicController);

        new ScrollMagic.Scene({
            triggerElement: sectionIntegrations,
            triggerHook: 1,
            offset: -80,
            duration: 220,
        })
            .setTween('.integrations__text', {
                left: 0,
                opacity: 1,
            })
            //.addIndicators({ name: 'txt' })
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
            offset: screenRes.isMobile ? 0 : weprovideHeight / 5.7,
            duration: screenRes.isMobile
                ? 300
                : weprovideHeight - weprovideHeight / 2,
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
                    end: screenRes.isMobile ? 0.4 : 1,
                },
            })
            .on('progress', (e) => {
                weprovideDot.style.opacity = e.progress > 0 ? 1 : 0;

                const dotRect = weprovideDot.getBoundingClientRect();
                const dotMiddle = dotRect.left - dotRect.width / 2;

                for (let i = 0; i < weprovideItems.length; i++) {
                    const item = weprovideItems[i];
                    const itemIcon = item.querySelector(
                        '.weprovide__item--icon'
                    );

                    if (isDotIntersecting(dotMiddle, itemIcon)) {
                        e.scrollDirection === 'FORWARD'
                            ? item.classList.add('weprovide__item--active')
                            : item.classList.remove('weprovide__item--active');
                        weprovideDot.style.zIndex = -1;
                    } else if (
                        !isDotIntersecting(dotMiddle, itemIcon) &&
                        item.classList.contains('weprovide__item--active')
                    ) {
                        weprovideDot.style.zIndex = -1;
                    }

                    if (e.progress < 0.224 && e.scrollDirection === 'REVERSE') {
                        item.classList.remove('weprovide__item--active');
                    }

                    if (e.progress > 0.8 && e.scrollDirection === 'FORWARD') {
                        item.classList.add('weprovide__item--active');
                    }
                }
            })
            .addTo(scrollMagicController);

        new ScrollMagic.Scene({
            triggerElement: sectionWeprovide,
            triggerHook: 1,
            offset: -100,
            duration: 300,
        })
            .setTween('.weprovide__title', initialPosition)
            .addTo(scrollMagicController);
    }

    const sectionTestimonials = document.querySelector('.testimonials');
    if (sectionTestimonials) {
        const testimonialsHeight =
            sectionTestimonials.getBoundingClientRect().height;

        new ScrollMagic.Scene({
            triggerElement: sectionTestimonials,
            triggerHook: 1,
            offset: -150,
            duration: testimonialsHeight / 2,
        })
            .setTween('.testimonials__title', initialPosition)
            .addTo(scrollMagicController);

        new ScrollMagic.Scene({
            triggerElement: sectionTestimonials,
            triggerHook: 1,
            offset: -150,
            duration: testimonialsHeight / 1.5,
        })
            .setTween('.testimonials__text', initialPosition)
            .addTo(scrollMagicController);
    }

    const sectionPrefooter = document.querySelector('.prefooter');
    if (sectionPrefooter) {
        const prefooterHeight = sectionPrefooter.getBoundingClientRect().height;
        const prefooterDot = document.querySelector('.prefooter__path--dot');

        new ScrollMagic.Scene({
            triggerElement: sectionPrefooter,
            triggerHook: 1,
            offset: -100,
            duration: 300,
        })
            .setTween('.prefooter__title', {
                left: 0,
                opacity: 1,
            })
            .addTo(scrollMagicController);

        new ScrollMagic.Scene({
            triggerElement: sectionPrefooter,
            triggerHook: 1,
            offset: -100,
            duration: 300,
        })
            .setTween('.prefooter__text', {
                left: 0,
                opacity: 1,
            })
            .addTo(scrollMagicController);

        new ScrollMagic.Scene({
            triggerElement: sectionPrefooter,
            triggerHook: 1,
            offset: 0,
            duration: prefooterHeight / 1.5,
        })
            .setTween('.prefooter__cta', {
                left: 0,
                opacity: 1,
            })
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
                    prefooterDot.classList.contains(
                        'prefooter__path--dot--blured'
                    )
                ) {
                    prefooterDot.classList.remove(
                        'prefooter__path--dot--blured'
                    );
                }
            },
        });
    }
}
