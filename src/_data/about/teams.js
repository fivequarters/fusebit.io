const SEATTLE = 'left: -202px; top: 37px';
const WALLA_WALLA = 'left: -170px; top: 49px';
const PORTLAND = 'left: -202px; top: 73px';
const AUSTIN = 'left: -134px; top: 128px';
const SAN_FRANCISCO = 'left: -211px; top: 119px';
const TORONTO = 'left: -18px; top: 50px';
const MEDELLIN = 'left: -51px; bottom: -19px';
const PORTO_ALEGRE = 'right: 169px; bottom: -212px';

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
            img: 'fusebit.jpg',
            job: 'Co-founder & CEO',
            social: {
                github: 'https://github.com/tjanczuk',
                twitter: 'https://twitter.com/tjanczuk',
                linkedin: 'https://www.linkedin.com/in/tjanczuk',
            },
            dot: {
                coordinates: 'left: -202px; top: 13px',
                classNames: `${SIZES.bg} ${COLORS.orange}`,
            },
        },
        {
            name: 'Benn Bollay',
            img: 'fusebit.jpg',
            job: 'Co-founder & CTO',
            social: {
                github: 'https://github.com/bennbollay',
                twitter: '',
                linkedin: 'https://www.linkedin.com/in/bennbollay',
            },
            dot: {
                coordinates: 'left: -225px; top: 23px',
                classNames: `${SIZES.bg} ${COLORS.yellow}`,
            },
        },
        {
            name: 'Yavor Georgiev',
            img: 'fusebit.jpg',
            job: 'Co-founder & CPO',
            social: {
                github: 'https://github.com/yavorg',
                twitter: 'https://twitter.com/YavorGeorgiev',
                linkedin: 'http://linkedin.com/in/yavorg',
            },
            dot: {
                coordinates: 'left: -225px; top: 45px',
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
                coordinates: 'left: -156px; top: 49px',
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
                coordinates: 'left: -120px; top: 128px',
                classNames: `${SIZES.bg} ${COLORS.blue}`,
            },
        },
        {
            name: 'Jacob Haller-Roby',
            img: 'jake.jpg',
            job: 'Engineer',
            social: {
                github: 'https://github.com/jscotroby',
                twitter: '',
                linkedin: 'https://www.linkedin.com/in/jacob-haller-roby-35118148/',
            },
            dot: {
                coordinates: 'left: -202px; top: 83px',
                classNames: `${SIZES.bg} ${COLORS.orange}`,
            },
        },
        {
            name: 'Ruben Restrepo',
            img: 'ruben.jpg',
            job: 'Engineer',
            social: {
                github: 'https://github.com/degrammer',
                twitter: 'https://twitter.com/degrammer',
                linkedin: 'https://www.linkedin.com/in/rubenrestrepo',
            },
            dot: {
                coordinates: 'left: -51px; bottom: -10px',
                classNames: `${SIZES.bg} ${COLORS.yellow}`,
            },
        },
        {
            name: 'Bruno Krebs',
            img: 'bruno.jpg',
            job: 'Engineer',
            social: {
                github: 'https://github.com/brunokrebs',
                twitter: 'https://twitter.com/brunoskrebs',
                linkedin: 'https://www.linkedin.com/in/brunokrebs',
            },
            dot: {
                coordinates: 'right: 189px; bottom: -212px',
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
                coordinates: 'left: -51px; bottom: -40px',
                classNames: `${SIZES.bg} ${COLORS.orange}`,
            },
        },
        {
            name: 'Matthew Zhao',
            img: 'fusebit.jpg',
            job: 'Engineer',
            social: {
                github: 'https://github.com/matthewzhaocc',
                twitter: '',
                linkedin: 'https://twitter.com/Matthew49104261',
            },
            dot: {
                coordinates: 'left: -211px; top: 135px',
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
                coordinates: 'left: -45px; top: 50px',
                classNames: `${SIZES.bg} ${COLORS.yellow}`,
            },
        },
    ],
};
