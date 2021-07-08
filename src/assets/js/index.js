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
    const heroContent = new gsap.timeline();
}

const sectionSupport = document.querySelector('.support');
if (sectionSupport) {
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
}

const sectionFeatures = document.querySelector('.features');
if (sectionFeatures) {
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

    // Animaciones de entrada
    new ScrollMagic.Scene({
        triggerElement: '.features',
        offset: 200,
        duration: sectionFeatures.getBoundingClientRect().height - 400,
        triggerHook: 0.5,
    })
        .setClassToggle('.features__content', 'fadeInUp')
        //.addIndicators()
        .addTo(scrollMagicController);

    //
    new ScrollMagic.Scene({
        triggerElement: '.features',
        offset: 200,
        duration: sectionFeatures.getBoundingClientRect().height - 400,
        triggerHook: 0.5,
    })
        .setClassToggle('.features__images--marketplace', 'fadeInRight')
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
