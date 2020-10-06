const Data = require("./lib/data");

(async () => {
    try {
        const data = await new Data();

        await data.connect('https://www.facebook.com');

        // Login into the site.
        await data.login(
            process.env.USERNAME,
            process.env.PASSWORD,
        );

        // Wait for 7 seconds.
        await data.wait(7000);

        await data.goTo('https://www.facebook.com/events/birthdays/');

        // Wait for 2 seconds.
        await data.wait(2000);

        // Run the birthday script.
        await data.BirthdaysToday();

        // Close the connection.
        if (process.env.DRIVER_CLOSE === 'true') {
            await data.disconnect();
        }
    } catch (error) {
        console.log('global error: ', error);
        await data.disconnect();
    }
})();
