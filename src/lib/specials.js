const specials = () => {
    const list = {
        'linda.veeke': 'Gefeliciteerd meis!',
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
