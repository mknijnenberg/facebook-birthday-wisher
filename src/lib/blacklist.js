const blacklist = () => {
    const list = [];

    return {
        has: (key) => {
            return !!~list.indexOf(key);
        },
    };
}


module.exports = blacklist();
