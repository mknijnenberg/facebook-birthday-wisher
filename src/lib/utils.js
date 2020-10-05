const utils = () => {
    const utils = {
        isValidDate: (date) => {
            typeof date === 'object' &&
            typeof date.getTime === 'function' &&
            !isNaN(date.getTime())
        },

        isNotEmpty: (arr) => {
            return typeof arr != "undefined" && arr != null && arr.length != null && arr.length > 0;
        },

        // sleep time expects milliseconds
        sleep: (time) => {
            return new Promise((resolve) => setTimeout(resolve, time));
        },

        monthNames: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ],
    }

    return utils;
}

module.exports = utils();
