const SEATTLE = {
    mobile: {
        left: -254,
        top: -28,
    },
    desktop: {
        left: -177,
        top: 37,
    },
};
const WALLA_WALLA = {
    mobile: {
        left: -253,
        top: -2,
    },
    desktop: {
        left: -170,
        top: 49,
    },
};
const PORTLAND = {
    mobile: {
        left: -274,
        top: 16,
    },
    desktop: {
        left: -202,
        top: 73,
    },
};
const AUSTIN = {
    mobile: {
        left: -276,
        top: 42,
    },
    desktop: {
        left: -134,
        top: 128,
    },
};
const SAN_FRANCISCO = {
    mobile: {
        left: -240,
        top: 40,
    },
    desktop: {
        left: -211,
        top: 119,
    },
};
const TORONTO = {
    mobile: {
        left: -187,
        top: -10,
    },
    desktop: {
        left: -18,
        top: 50,
    },
};
const MEDELLIN = {
    mobile: {
        left: -195,
        bottom: -118,
    },
    desktop: {
        left: -51,
        bottom: -19,
    },
};
const PORTO_ALEGRE = {
    mobile: {
        left: -138,
        bottom: -214,
    },
    desktop: {
        right: 169,
        bottom: -212,
    },
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
                    mobile: {
                        left: SEATTLE.mobile.left,
                        top: SEATTLE.mobile.top - 20,
                    },
                    desktop: {
                        left: SEATTLE.desktop.left,
                        top: SEATTLE.desktop.top - 24,
                    },
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
                    mobile: {
                        left: SEATTLE.mobile.left - 19,
                        top: SEATTLE.mobile.top - 12,
                    },
                    desktop: {
                        left: SEATTLE.desktop.left - 23,
                        top: SEATTLE.desktop.top - 14,
                    },
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
                    mobile: {
                        left: SEATTLE.mobile.left - 17,
                        top: SEATTLE.mobile.top + 7,
                    },
                    desktop: {
                        left: SEATTLE.desktop.left - 23,
                        top: SEATTLE.desktop.top + 8,
                    },
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
                    mobile: {
                        left: WALLA_WALLA.mobile.left + 10,
                        top: WALLA_WALLA.mobile.top,
                    },
                    desktop: {
                        left: WALLA_WALLA.desktop.left + 14,
                        top: WALLA_WALLA.desktop.top,
                    },
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
                    mobile: {
                        left: AUSTIN.mobile.left - 19,
                        top: AUSTIN.mobile.top,
                    },
                    desktop: {
                        left: AUSTIN.desktop.left + 14,
                        top: AUSTIN.desktop.top - 5,
                    },
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
                    mobile: {
                        left: PORTLAND.mobile.left + 9,
                        top: PORTLAND.mobile.top,
                    },
                    desktop: {
                        left: PORTLAND.desktop.left + 14,
                        top: PORTLAND.desktop.top + 10,
                    },
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
                    mobile: {
                        left: MEDELLIN.mobile.left,
                        bottom: MEDELLIN.mobile.bottom + 11,
                    },
                    desktop: {
                        left: MEDELLIN.desktop.left,
                        bottom: MEDELLIN.desktop.bottom + 3,
                    },
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
                    mobile: {
                        left: PORTO_ALEGRE.mobile.left,
                        bottom: PORTO_ALEGRE.mobile.bottom,
                    },
                    desktop: {
                        right: PORTO_ALEGRE.desktop.right,
                        bottom: PORTO_ALEGRE.desktop.bottom,
                    },
                },
                classNames: `${SIZES.bg} ${COLORS.orange}`,
            },
        },
        {
            name: 'Lizz Parody',
            img: 'liz.jpg',
            job: 'Head Developer Advocate',
            social: {
                github: 'https://github.com/lizzparody',
                twitter: 'https://twitter.com/lizzparody',
                linkedin: 'https://www.linkedin.com/in/lizparody',
            },
            dot: {
                coordinates: {
                    mobile: {
                        left: MEDELLIN.mobile.left - 20,
                        bottom: MEDELLIN.mobile.bottom,
                    },
                    desktop: {
                        left: MEDELLIN.desktop.left,
                        bottom: MEDELLIN.desktop.bottom - 21,
                    },
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
                    mobile: {
                        left: SAN_FRANCISCO.mobile.left,
                        top: SAN_FRANCISCO.mobile.top + 10,
                    },
                    desktop: {
                        left: SAN_FRANCISCO.desktop.left,
                        top: SAN_FRANCISCO.desktop.top + 16,
                    },
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
                    mobile: {
                        left: TORONTO.mobile.left - 10,
                        top: TORONTO.mobile.top + 10,
                    },
                    desktop: {
                        left: TORONTO.desktop.left - 27,
                        top: TORONTO.desktop.top,
                    },
                },
                classNames: `${SIZES.bg} ${COLORS.yellow}`,
            },
        },
    ],
};
