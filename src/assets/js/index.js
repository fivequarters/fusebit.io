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
const Scene = ScrollMagic.Scene;

function setSceneDuration(durationPerSizesObj) {
    if (screenRes.isMobile) {
        return durationPerSizesObj.mobile;
    } else if (screenRes.isTablet) {
        return durationPerSizesObj.tablet;
    } else if (screenRes.isBigRes) {
        return durationPerSizesObj.bigres;
    } else if (screenRes.isDesktop) {
        return durationPerSizesObj.desktop;
    }
}

const homepage = document.querySelector('.homepage');
if (homepage) {
    const initialPosition = {
        top: 0,
        opacity: 1,
    };

    const path1 = document.querySelector('.path1');
    const path1Dot = document.querySelector('.path1__dot');
    path1.style.top = document.querySelector('.support').offsetTop + 65 + 'px';
    path1.style.opacity = 1;

    function alignPathToTopSection(path, section) {
        path.style.top = document.querySelector(section).offsetTop + 65 + 'px';
    }

    window.addEventListener('resize', () =>
        alignPathToTopSection(path1, '.support')
    );

    const section1IndicatorsArr = document.querySelectorAll(
        '.features [class*="indicator"]'
    );

    function isDotIntersecting(
        dot,
        target,
        topBottom = true,
        leftRight = false
    ) {
        const padding = 16;

        if (
            (topBottom &&
                dot >= target.getBoundingClientRect().top - padding &&
                dot <= target.getBoundingClientRect().bottom + padding) ||
            (leftRight &&
                dot >= target.getBoundingClientRect().left - padding &&
                dot <= target.getBoundingClientRect().right + padding)
        ) {
            return true;
        } else {
            return false;
        }
    }

    gsap.to(path1Dot, {
        scrollTrigger: {
            trigger: path1,
            start: 'top 5%',
            end: 'bottom 5%',
            scrub: 0,
            //markers: true,
            pint: true,
            onUpdate: ({ progress }) => {
                const dotRect = path1Dot.getBoundingClientRect();
                const dotMiddle = dotRect.top + dotRect.height / 2;

                let counter = 0;
                for (let i = 0; i < section1IndicatorsArr.length; i++) {
                    const item = section1IndicatorsArr[i];
                    const itemParent = item.parentNode;

                    //.features__list--item-active

                    if (isDotIntersecting(dotMiddle, item, true, false)) {
                        itemParent.classList.add('features__list--item-active');
                        path1Dot.style.opacity = 0;
                    } else {
                        itemParent.classList.remove(
                            'features__list--item-active'
                        );
                        counter++;
                    }
                }

                if (counter === section1IndicatorsArr.length) {
                    path1Dot.style.opacity = 1;
                }
            },
        },
        duration: 1,
        ease: 'in',
        immediateRender: true,
        motionPath: {
            path: screenRes.isDesktop ? '.desktop--path' : '.mobile--path',
            align: screenRes.isDesktop ? '.desktop--path' : '.mobile--path',
            alignOrigin: [0.5, 0.5],
        },
    });

    const sectionSupport = document.querySelector('.support');
    if (sectionSupport) {
        const supportHeight = sectionSupport.getBoundingClientRect().height;
        const supportDot = sectionSupport.querySelector('.support__path--dot');

        const dotDuration = setSceneDuration({
            desktop: supportHeight * 2,
            tablet: supportHeight * 2.2,
            mobile: supportHeight * 1.4,
            bigres: supportHeight * 2,
        });

        new Scene({
            triggerElement: sectionSupport,
            triggerHook: 1,
            offset: -100,
            duration: 270,
        })
            .setTween('.support__title', initialPosition)
            .addTo(scrollMagicController);

        new Scene({
            triggerElement: sectionSupport,
            triggerHook: 1,
            offset: 100,
            duration: 300,
        })
            .setTween('.support__text', initialPosition)
            .addTo(scrollMagicController);

        if (screenRes.isDesktop) {
            new Scene({
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

        const dotDuration = setSceneDuration({
            desktop: featuresHeight * 1.7,
            tablet: featuresHeight * 2.2,
            mobile: featuresHeight * 2,
            bigres: featuresHeight * 1.7,
        });

        new Scene({
            triggerElement: '.features',
            triggerHook: 1,
            offset: 100,
            duration: 300,
        })
            .setTween('.features__title--1', initialPosition)
            //.addIndicators()
            .addTo(scrollMagicController);

        // Marketplace
        new Scene({
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

        const title2Duration = setSceneDuration({
            desktop: 500,
            tablet: featuresHeight * 2.2,
            mobile: 200,
            bigres: 500,
        });
        new Scene({
            triggerElement: '.features',
            triggerHook: 1,
            offset: featuresHeight / 2,
            duration: title2Duration,
        })
            .setTween('.features__title--2', initialPosition)
            .addTo(scrollMagicController);

        // graph
        new Scene({
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
        const titleDuration = setSceneDuration({
            desktop: 300,
            tablet: 250,
            mobile: 200,
            bigres: 300,
        });
        new Scene({
            triggerElement: sectionIntegrate,
            triggerHook: 1,
            offset: -100,
            duration: titleDuration,
        })
            .setTween('.integrate__title', initialPosition)
            .addTo(scrollMagicController);

        const ctaDuration = setSceneDuration({
            desktop: 300,
            tablet: 250,
            mobile: 200,
            bigres: 300,
        });
        new Scene({
            triggerElement: sectionIntegrate,
            triggerHook: 1,
            offset: 0,
            duration: ctaDuration,
        })
            .setTween('.integrate__cta', initialPosition)
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

        const dotDuration = setSceneDuration({
            desktop: integrationsHeight * 2,
            tablet: integrationsHeight * 1.5,
            mobile: integrationsHeight * 1.5,
            bigres: integrationsHeight * 2,
        });
        const integrationsScene = new Scene({
            triggerElement: '.integrations',
            triggerHook: 0.7,
            offset: screenRes.isMobile ? 100 : integrationsHeight / 3,
            duration: dotDuration,
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

                if (
                    e.progress > 0.71 &&
                    e.scrollDirection === 'FORWARD' &&
                    integrationsScene.duration() !== 2000
                ) {
                    integrationsScene.duration(2000);
                } else if (
                    e.progress < 1 &&
                    e.scrollDirection === 'REVERSE' &&
                    integrationsScene.duration() === 2000
                ) {
                    integrationsScene.duration(dotDuration);
                }
            })
            //.addIndicators({ name: 'inte' })
            .addTo(scrollMagicController);

        new Scene({
            triggerElement: sectionIntegrations,
            triggerHook: 1,
            offset: -100,
            duration: 200,
        })
            .setTween('.integrations__title', initialPosition)
            //.addIndicators({ name: 'title' })
            .addTo(scrollMagicController);

        new Scene({
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

        new Scene({
            triggerElement: '.weprovide',
            triggerHook: 0.5,
            offset: screenRes.isMobile ? 100 : weprovideHeight / 5.7,
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
            // .addIndicators({ name: 'weprovide' })
            .addTo(scrollMagicController);

        new Scene({
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

        new Scene({
            triggerElement: sectionTestimonials,
            triggerHook: 1,
            offset: -150,
            duration: testimonialsHeight / 2,
        })
            .setTween('.testimonials__title', initialPosition)
            .addTo(scrollMagicController);

        new Scene({
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

        new Scene({
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

        new Scene({
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

        new Scene({
            triggerElement: sectionPrefooter,
            triggerHook: 1,
            offset: 0,
            duration: 200,
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
