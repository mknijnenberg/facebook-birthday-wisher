const celebrations = () => {
    const general = [
        'van harte!',
        'Fijne dag vandaag!',
        'Gefeliciteerd!',
        'Gefeliciteerd, fijne dag vandaag!',
    ];

    const named = [
        'van harte {{name}}!',
        'Gefeliciteerd {{name}}!',
        'Gefeliciteerd {{name}}, fijne dag vandaag!',
    ];

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

    const generate = (name) => {
        if (!name) {
            return generateGeneral();
        }

        return generateNamed(name);
    };

    return {
        generate: generate,
    };
}

module.exports = celebrations();
