
const axios = require('axios').default;
const cheerio = require("cheerio");
const mailer = require("./mailer");
const model = require("./model");

const sendNotification = (items) => {
    const updatedItems = items.filter((item) => item.updateFlag);

    if (updatedItems.length) {
        console.log("updated items", updatedItems.length);
        mailer.sendMail(updatedItems);
    }
};

const merge = (items, values) => {
    return items.map(({ url, selector }, i) => {
        return { url, selector, value: values[i] };
    });
};

async function fetch({ url, selector }) {
    console.log("fetch", url, selector);

    try {
        const resp = await axios.get(url);
        let $ = cheerio.load(resp.data);

        if(selector.startsWith('noscript')) {
            $ = cheerio.load($('noscript').first().html())
            selector = selector.replace('noscript', '').trim()
        }

        return ($(selector).first().text() || '').trim();
    } catch (err) {
        console.log(err);
    }
    return;
}

const fetchAndSave = async ({ url, selector }) => {
    const value = await fetch({ url, selector });
    const news = await model.save({ url, selector, value });
    return news
};

const fetchAll = async () => {
    const resp = await model.getAll();
    const values = await Promise.all(
        resp.map(({ url, selector }) => fetch({ url, selector }))
    );
    const items = await model.saveAll(merge(resp, values));
    console.log("fetched items", items.length);

    sendNotification(items);
    model.disconnect();

    return items;
};

module.exports = {
    fetchAndSave,
    fetchAll,
    fetch,
}
