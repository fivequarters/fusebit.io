const SEATTLE = {
    mobile: 'left: -274px; top: -18px',
    desktop: 'left: -202px; top: 37px',
};
const WALLA_WALLA = {
    mobile: 'left: -253px; top: -2px',
    desktop: 'left: -170px; top: 49px',
};
const PORTLAND = {
    mobile: 'left: -274px; top: 16px',
    desktop: 'left: -202px; top: 73px',
};
const AUSTIN = {
    mobile: 'left: -276px; top: 42px',
    desktop: 'left: -134px; top: 128px',
};
const SAN_FRANCISCO = {
    mobile: 'left: -240px; top: 40px',
    desktop: 'left: -211px; top: 119px',
};
const TORONTO = {
    mobile: 'left: -187px; top: -10px',
    desktop: 'left: -18px; top: 50px',
};
const MEDELLIN = {
    mobile: 'left: -195px; bottom: -118px',
    desktop: 'left: -51px; bottom: -19px',
};
const PORTO_ALEGRE = {
    mobile: 'left: -138px; bottom: -214px',
    desktop: 'right: 169px; bottom: -212px',
};

const COLORS = {
    orange: 'teams__dot--orange',
    yellow: 'teams__dot--bright-yellow',
    blue: 'teams__dot--light-blue',
};

const SIZES = {
    bg: 'teams__dot--bg',
    sm: 'teams__dot--sm',
};

module.exports = {
    locations: [
        SEATTLE,
        WALLA_WALLA,
        PORTLAND,
        AUSTIN,
        SAN_FRANCISCO,
        TORONTO,
        MEDELLIN,
        PORTO_ALEGRE,
    ],
    people: [
        {
            name: 'Tomasz Janczuk',
            img: 'tomek.png',
            job: 'Co-founder & CEO',
            social: {
                github: 'https://github.com/tjanczuk',
                twitter: 'https://twitter.com/tjanczuk',
                linkedin: 'https://www.linkedin.com/in/tjanczuk',
            },
            dot: {
                coordinates: {
                    mobile: 'left: -274px; top: -38px',
                    desktop: 'left: -202px; top: 13px',
                },
                classNames: `${SIZES.bg} ${COLORS.orange}`,
            },
        },
        {
            name: 'Benn Bollay',
            img: 'benn.png',
            job: 'Co-founder & CTO',
            social: {
                github: 'https://github.com/bennbollay',
                twitter: '',
                linkedin: 'https://www.linkedin.com/in/bennbollay',
            },
            dot: {
                coordinates: {
                    mobile: 'left: -293px; top: -30px',
                    desktop: 'left: -225px; top: 23px',
                },
                classNames: `${SIZES.bg} ${COLORS.yellow}`,
            },
        },
        {
            name: 'Yavor Georgiev',
            img: 'yavor.png',
            job: 'Co-founder & CPO',
            social: {
                github: 'https://github.com/yavorg',
                twitter: 'https://twitter.com/YavorGeorgiev',
                linkedin: 'http://linkedin.com/in/yavorg',
            },
            dot: {
                coordinates: {
                    mobile: 'left: -291px; top: -11px',
                    desktop: 'left: -225px; top: 45px',
                },
                classNames: `${SIZES.bg} ${COLORS.blue}`,
            },
        },
        {
            name: 'Chris Dukelow',
            img: 'duke.png',
            job: 'CFO',
            social: {
                github: '',
                twitter: 'https://twitter.com/chrisdukelow',
                linkedin: 'https://www.linkedin.com/in/dukelow/',
            },
            dot: {
                coordinates: {
                    mobile: 'left: -243px; top: -2px',
                    desktop: 'left: -156px; top: 49px',
                },
                classNames: `${SIZES.bg} ${COLORS.yellow}`,
            },
        },
        {
            name: 'Chris More',
            img: 'chris.png',
            job: 'VP of Growth',
            social: {
                github: 'https://github.com/chrismore',
                twitter: 'https://twitter.com/chrismore',
                linkedin: 'https://www.linkedin.com/in/chrismore/',
            },
            dot: {
                coordinates: {
                    mobile: 'left: -295px; top: 42px',
                    desktop: 'left: -120px; top: 128px',
                },
                classNames: `${SIZES.bg} ${COLORS.blue}`,
            },
        },
        {
            name: 'Jacob Haller-Roby',
            img: 'jake.png',
            job: 'Engineer',
            social: {
                github: 'https://github.com/jscotroby',
                twitter: '',
                linkedin:
                    'https://www.linkedin.com/in/jacob-haller-roby-35118148/',
            },
            dot: {
                coordinates: {
                    mobile: 'left: -265px; top: 16px',
                    desktop: 'left: -202px; top: 83px',
                },
                classNames: `${SIZES.bg} ${COLORS.orange}`,
            },
        },
        {
            name: 'Ruben Restrepo',
            img: 'ruben.png',
            job: 'Engineer',
            social: {
                github: 'https://github.com/degrammer',
                twitter: 'https://twitter.com/degrammer',
                linkedin: 'https://www.linkedin.com/in/rubenrestrepo',
            },
            dot: {
                coordinates: {
                    mobile: 'left: -195px; bottom: -107px',
                    desktop: 'left: -51px; bottom: -10px',
                },
                classNames: `${SIZES.bg} ${COLORS.yellow}`,
            },
        },
        {
            name: 'Bruno Krebs',
            img: 'bruno.png',
            job: 'Engineer',
            social: {
                github: 'https://github.com/brunokrebs',
                twitter: 'https://twitter.com/brunoskrebs',
                linkedin: 'https://www.linkedin.com/in/brunokrebs',
            },
            dot: {
                coordinates: {
                    mobile: 'left: -157px; bottom: -214px',
                    desktop: 'right: 189px; bottom: -212px',
                },
                classNames: `${SIZES.bg} ${COLORS.orange}`,
            },
        },
        {
            name: 'Liz Parody',
            img: 'liz.jpg',
            job: 'Head Developer Advocate',
            social: {
                github: 'https://github.com/lizparody',
                twitter: 'https://twitter.com/lizparody23',
                linkedin: 'https://www.linkedin.com/in/lizparody',
            },
            dot: {
                coordinates: {
                    mobile: 'left: -215px; bottom: -118px',
                    desktop: 'left: -51px; bottom: -40px',
                },
                classNames: `${SIZES.bg} ${COLORS.orange}`,
            },
        },
        {
            name: 'Matthew Zhao',
            img: 'matthew.jpg',
            job: 'Engineer',
            social: {
                github: 'https://github.com/matthewzhaocc',
                twitter: '',
                linkedin: 'https://twitter.com/Matthew49104261',
            },
            dot: {
                coordinates: {
                    mobile: 'left: -240px; top: 50px',
                    desktop: 'left: -211px; top: 135px',
                },
                classNames: `${SIZES.bg} ${COLORS.blue}`,
            },
        },
        {
            name: 'Shehzad Akbar',
            img: 'shehzad.jpg',
            job: 'Product Manager',
            social: {
                github: 'https://github.com/msakbar',
                twitter: 'https://twitter.com/shehzadakbar',
                linkedin: 'https://www.linkedin.com/in/shehzad-akbar',
            },
            dot: {
                coordinates: {
                    mobile: 'left: -197px; top: 0',
                    desktop: 'left: -45px; top: 50px',
                },
                classNames: `${SIZES.bg} ${COLORS.yellow}`,
            },
        },
    ],
};
