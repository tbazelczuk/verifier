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

async function fetch(url, selector) {
  try {
    const resp = await axios.get(url);
    const $ = cheerio.load(resp.data);
    const html = $(selector).html();
    console.log("fetch", url, selector, html);
    return html;
  } catch (err) {
    console.log(err);
  }
  return;
}

const install = async (url, selector) => {
  const value = await fetch(url, selector);
  await model.save({ url, selector, value });
};

const fetchAll = async () => {
  // await install("https://trilon.io/blog", ".blog-list a");
  // await install("https://reactjs.org/blog/", "h1");
  // await install("https://reactjs.org/versions/", "h3");
  // await install("https://infernojs.org/", "h1");
  // await install('https://github.com/infernojs/inferno/releases', '.release-header a');

  const resp = await model.getAll();
  const values = await Promise.all(
    resp.map(({ url, selector }) => fetch(url, selector))
  );

  const items = await model.saveAll(merge(resp, values));
  console.log("fetched items", items.length);

  sendNotification(items);
  model.disconnect();

  return items;
};

model.connect().then(() => {
  fetchAll();
});
