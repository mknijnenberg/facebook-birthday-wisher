const { Builder, By, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const celebrations = require('./celebrations');

class Data {
    constructor() {
        this.driver = null;
    }

    async connect(url) {
        console.log('connecting to the website...');

        try {
            const chromeOptions = new chrome.Options();

            // If the driver has not been set to HEADLESS, we will show the browser.
            if (process.env.DRIVER_HEADLESS === 'true') {
                chromeOptions.addArguments('--headless');
            }

            chromeOptions.addArguments('-disable-notifications');
            chromeOptions.addArguments('-disable-popup-blocking');

            // Connect the new driver.
            this.driver = new Builder()
                .forBrowser('chrome')
                .setChromeOptions(chromeOptions)
                .build();

                // Go the url.
                await this.driver.get(url);
        } catch (error) {
            console.log('connect: ', error);
        }
    }

    async login(username, password) {
        console.log('login in...');

        try {
            // Find the username input and fill in the username.
            await this.driver.findElement(By.name('email')).sendKeys(username);

            // Find the password input and fill in the password and Submit.
            await this.driver.findElement(By.name('pass')).sendKeys(password, Key.RETURN);
        } catch (error) {
            console.log('login: ', error);
        }
    }

    async wait(mlliseconds) {
        console.log(`waiting ${ mlliseconds } milliseconds...`);

        try {
            await this.driver.sleep(mlliseconds);
            return;
        } catch (error) {
            console.log('wait: ', error);
        }
    }

    async goTo(url) {
        console.log(`going to ${ url }...`);

        try {
            await this.driver.get(url);
        } catch (error) {
            console.log('goTo: ', error);
        }
    }

    async goToPersonalWebsite(link) {
        try {
            console.log('opening url');
            const url = `window.open('${ link }', '_blank');`;

            await this.driver.executeScript(url);

            // wait 3 seconds.
            await this.wait(3000);

            // Get all tabs list.
            const parent = await this.driver.getWindowHandle();
            const tabs = await this.driver.getAllWindowHandles();

            // Switch to the new tab.
            await this.driver.switchTo().window(tabs[1]);

            // Click on the info button.
            await this.driver.findElement(By.xpath('//div[@id="fbTimelineHeadline"]//a[@data-tab-key="about"]')).click();

            // wait 5 seconds.
            await this.wait(5000);

            const text = await this.driver.findElement(By.xpath('//span[contains(text(),"Details over ")]')).getText();

            const splitted = await text.split('over ');

            // Close the new page.
            await this.driver.close();

            // Return to the parent page.
            await this.driver.switchTo().window(parent);

            return splitted[1];
        } catch (error) {
            console.log('goToPersonalWebsite: ', error);

            // Close the new page.
            await this.driver.close();

            // Return to the parent page.
            await this.driver.switchTo().window(parent);

            return null;
        }
    }

    async generateCelebrations(name, link) {
        return await celebrations.generate(name, link);
    }

    async BirthdaysToday() {
        try {
            return await this.driver.findElement(By.id('birthdays_today_card')).then(async (element) => {
                return await element.findElements(By.xpath(".//following-sibling::*/ul/li")).then(async (items) => {
                    console.log('items length: ', items.length);

                    for (let index = 0; index < items.length; index++) {
                        await (async () => {
                            const newItem = await items[index];

                            let link;
                            let textareaFound;

                            await newItem.findElement(By.xpath('.//textarea')).then(async () => {
                                console.log('text')
                                textareaFound = true;
                            }).catch(() => {
                                textareaFound = false;
                            });

                            console.log('textareaFound: ', textareaFound);

                            if (!textareaFound) {
                                // Wait 5 seconds.
                                await this.wait(5000);

                                return;
                            }

                            await console.log("Let's search for the name");

                            const name = await newItem.findElement(By.xpath('.//a[1]')).then(async (item) => {
                                link = await item.getAttribute('href');

                                const name = await this.goToPersonalWebsite(link);

                                if (!name) {
                                    return null;
                                }

                                return name;
                            });

                            await console.log("Fill in the textarea");

                            const sentence = await newItem.findElement(By.xpath('.//textarea')).then(async (textarea) => {
                                const sentence = await this.generateCelebrations(name, link);

                                if (!sentence) {
                                    return null;
                                }

                                console.log('writing the sentence: ', sentence);

                                if (process.env.SUBMIT_VALUES === 'true') {
                                    await textarea.sendKeys(sentence, Key.RETURN);
                                } else {
                                    await textarea.sendKeys(sentence);
                                }

                                return sentence;
                            });

                            await console.log('filled in: ' + sentence)

                            await this.wait(5000);
                        })();
                    }
                }).catch((error) => {
                    console.log('no birthdays today.', error);
                    return null;
                });
            }).catch((error) => {
                console.log('no birthdays today.', error);
                return null;
            });
        } catch (error) {
            console.log('searchForBirthdaysOfToday: ', error);
            return false;
        }
    }

    async disconnect() {
        await this.driver.sleep(1000);

        await this.driver.quit();

        console.log('close off the connection...');
    }
};

module.exports = Data;
