const blacklist = require('./blacklist');
const overwrites = require('./overwrites');
const specials = require('./specials');

const celebrations = () => {
    // const regex = /(?:<=https:\/\/www\.facebook\.com\/).*(?=\?eid)/;
    const firstRegex = 'https://www.facebook.com/';
    const secondRegex = '?eid';

    const TYPE_GENERAL = 1;
    const TYPE_NAMED = 2;
    const TYPE_BLACKLIST = 3;
    const TYPE_SPECIAL = 4;

    const general = [
        'Van harte!',
        'Fijne dag vandaag!',
        'Gefeliciteerd!',
        'Gefeliciteerd, fijne dag vandaag!',
    ];

    const named = [
        'van harte {{name}}!',
        'Gefeliciteerd {{name}}!',
        'Gefeliciteerd {{name}}, fijne dag vandaag!',
    ];

    const validate = (string) => {
        try {
            const first = string.split(firstRegex)[1];
            const second = first.split(secondRegex)[0];

            return second;
        } catch (e) {
            return null;
        }
    }

    const generateNamed = (name) => {
        let sentence;

        const index = Math.floor(Math.random() * (named.length));

        const value = named[index];

        sentence = value.replace('{{name}}', name);

        return sentence;
    }

    const generateGeneral = () => {
        const index = Math.floor(Math.random() * (general.length));

        return general[index];
    }

    const generate = (name, link) => {
        let section = null;
        let status = TYPE_GENERAL;

        if (link) {
            section = validate(link);

            console.log('section: ', section);

            if (!section) {
                console.log('section does not exist');
                return;
            }

            if (blacklist.has(section)) {
                console.log('blacklisted');
                status = TYPE_BLACKLIST;
                return;
            }

            if (specials.has(section)) {
                console.log('special');
                status = TYPE_SPECIAL;
            }

            if (overwrites.has(section)) {
                console.log('overwrite');
                status = TYPE_NAMED;
                name = overwrites.get(section);
            }
        }

        console.log('status: ', status);

        switch (status) {
            case TYPE_GENERAL:
                return generateGeneral();
            case TYPE_NAMED:
                return generateNamed(name);
            case TYPE_SPECIAL:
                return specials.get(section);
            case TYPE_BLACKLIST:
            default:
                return null;
        }
    };

    return {
        generate: generate,
    };
}

module.exports = celebrations();
