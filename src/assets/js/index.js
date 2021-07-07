/* eslint-disable */
import '../css/main.scss';

const screenRes = {
    isMobile: window.matchMedia('screen and (max-width: 700px)').matches,
    isTablet: window.matchMedia('screen and (max-width: 1000px)').matches,
    isDesktop: window.matchMedia('screen and (min-width: 1001px)').matches,
};

const scrollMagicController = new ScrollMagic.Controller();

const sectionSupport = document.querySelector('.support');
if (sectionSupport) {
    const supportDot = sectionSupport.querySelector('.support__path--dot');
    const allCards = sectionSupport.querySelectorAll('.card');
    const supportBase = new gsap.timeline();

    if (window.matchMedia('(min-width: 1175px)').matches) {
        const supportCard1 = new gsap.timeline();
        const supportCard1Reverse = new gsap.timeline();
        const supportCard2 = new gsap.timeline();
        const supportCard2Reverse = new gsap.timeline();
        const supportCard3 = new gsap.timeline();
        const supportCard3Reverse = new gsap.timeline();

        function handleActiveCard(progress, val, currCard, debug) {
            if (debug) console.log(progress);

            if (progress == val) {
                allCards[currCard].classList.add('card--active');
            } else {
                allCards[currCard].classList.remove('card--active');
            }
        }

        const supportCardOption = (id, isReverse) => ({
            duration: 0.5,
            motionPath: {
                path: `.support__path--card${id}--path`,
                align: `.support__path--card${id}--path`,
                alignOrigin: [0.5, 0.5],
                start: isReverse ? 1 : 0,
                end: isReverse ? 0 : 1,
            },
        });

        supportCard1.to(supportDot, supportCardOption(1, false));
        supportCard1Reverse.to(supportDot, supportCardOption(1, true));
        supportCard2.to(supportDot, supportCardOption(2, false));
        supportCard2Reverse.to(supportDot, supportCardOption(2, true));
        supportCard3.to(supportDot, supportCardOption(3, false));
        supportCard3Reverse.to(supportDot, supportCardOption(3, true));

        supportBase.to(supportDot, {
            duration: 0.5,
            motionPath: {
                path: `.support__path--base--path`,
                align: `.support__path--base--path`,
                alignOrigin: [0.5, 0.5],
            },
        });

        // Support Base pin
        new ScrollMagic.Scene({
            triggerElement: '.support',
            duration: 3900,
            triggerHook: 0,
            offset: window.matchMedia('(max-width: 1400px)').matches ? 80 : 0,
        })
            .setPin('.support')
            .addTo(scrollMagicController);

        // Support card 1
        new ScrollMagic.Scene({
            triggerElement: '.support',
            duration: 500,
            triggerHook: 0,
        })
            .setTween(supportCard1)
            .on('progress', (e) => handleActiveCard(e.progress, 1, 0, false))
            .addTo(scrollMagicController);

        // Support card 1 Reverse
        new ScrollMagic.Scene({
            triggerElement: '.support',
            offset: 900,
            duration: 300,
            triggerHook: 0,
        })
            .setTween(supportCard1Reverse)
            .on('progress', (e) => handleActiveCard(e.progress, 0, 0, false))
            .addTo(scrollMagicController);

        // Support card 2
        new ScrollMagic.Scene({
            triggerElement: '.support',
            offset: 1300,
            duration: 500,
            triggerHook: 0,
        })
            .setTween(supportCard2)
            .on('progress', (e) => handleActiveCard(e.progress, 1, 1, false))
            .addTo(scrollMagicController);

        // Support card 2 Reverse
        new ScrollMagic.Scene({
            triggerElement: '.support',
            offset: 2200,
            duration: 300,
            triggerHook: 0,
        })
            .setTween(supportCard2Reverse)
            .on('progress', (e) => handleActiveCard(e.progress, 0, 1, false))
            .addTo(scrollMagicController);

        // Support card 3
        new ScrollMagic.Scene({
            triggerElement: '.support',
            offset: 2600,
            duration: 500,
            triggerHook: 0,
        })
            .setTween(supportCard3)
            .on('progress', (e) => handleActiveCard(e.progress, 1, 2, false))
            .addTo(scrollMagicController);

        // Support card 3 Reverse
        new ScrollMagic.Scene({
            triggerElement: '.support',
            offset: 3500,
            duration: 400,
            triggerHook: 0,
        })
            .setTween(supportCard3Reverse)
            .on('progress', (e) => handleActiveCard(e.progress, 0, 2, false))
            .addTo(scrollMagicController);

        // Support base path
        new ScrollMagic.Scene({
            triggerElement: '.support',
            offset: 3900,
            duration: 1000,
            triggerHook: 0,
        })
            .setTween(supportBase)
            .addTo(scrollMagicController);
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
            duration: 0.5,
            motionPath: {
                path: `.features__path--base--path2`,
                align: `.features__path--base--path2`,
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
            //.addIndicators({ name: 'Base path mobile' })
            .addTo(scrollMagicController);
    }

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
