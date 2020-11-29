const specials = () => {
    const list = {
        'linda.veeke': 'Gefeliciteerd meis!',
        'leonie.vandermeer.7': 'Gefeliciteerd lieverd! 😘',
    };

    return {
        has: (key) => {
            return list.hasOwnProperty(key);
        },
        get: (key) => {
            return list[key];
        },
    };
}


module.exports = specials();
