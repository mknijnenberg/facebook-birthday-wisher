const overwrites = () => {
    const list = {
        'michelle.kingma': 'Michelle',
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


module.exports = overwrites();
