const puppeteer = require('puppeteer');

async function fetch({ url, selector }) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle2',
    });

    const textContent = await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : '';
    }, selector);

    await browser.close();

    return textContent
}

module.exports = {
    fetch
}
