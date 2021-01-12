import * as dotenv from "dotenv";
import * as playwright from "playwright";

dotenv.config({
    path: __dirname + '/../.env'
});

(async () => {
    const browserType = playwright.chromium;

    // Launch browser.
    const browser = await browserType.launch({
        headless: process.env.DRIVER_HEADLESS === 'TRUE' ? true : false,
        devtools: process.env.DRIVER_DEVTOOLS === 'TRUE' ? true : false,
    });

    // Create a context.
    const context = await browser.newContext();

    // Create a page.
    const page = await context.newPage();

    const closeApplication = async () => {
        // Close the browser.
        if (process.env.DRIVER_CLOSE === 'TRUE') {
            await browser.close();
        }
    }

    try {
        console.log('connecting to facebook');

        await page.goto('https://www.facebook.com');
        await page.waitForTimeout(2000);

        // If the page contains a modal
        await page.click('button[data-testid="cookie-policy-banner-accept"]');

        await page.waitForTimeout(100);

        console.log('loggin in');

        // Login sequence
        await page.fill('input[name="email"]', `${process.env.USERNAME}`);
        await page.fill('input[name="pass"]', `${process.env.PASSWORD}`);
        await page.click('button[name="login"]');

        console.log('logged in');

        // Homepage
        await page.waitForSelector('text=Maarten Knijnenberg');

        console.log('connecting to birthdays page');

        // Navigate to brithdays section
        await page.goto('https://www.facebook.com/events/birthdays', { waitUntil: 'networkidle' });

        // Wait for the vandaag Jarig section.
        const todayBirthdayExists = await page.waitForSelector('text=Vandaag jarig');

        // If the value not exists we will stop.
        if (!todayBirthdayExists) {
            console.log('todayBirthdayExists not exists');
            return closeApplication();
        }

        // 1. check if fetch all anchor tags
        console.log('there are birthdays today');

        // const list = await page.evaluate(() => {
        //     const elements = document.querySelectorAll('.tvmbv18p.s1tcr66n');

        //     let result:any[] = [];

        //     return elements.forEach((element) => {
        //         if (element.innerHTML.indexOf("Je hebt iets op de tijdlijn van") !== -1) {
        //             return;
        //         }

        //         result.push(element);
        //     });

        //     // return result;
        // });

        // console.log('list: ', list);

    } catch (err) {
        console.log('err during the lifecycle: ', err);
        return;
    }

    closeApplication();
})();