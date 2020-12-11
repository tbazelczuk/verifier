const notifier = require('node-notifier');
const axios = require('axios');
const _ = require('lodash');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ items: [] }).write();

const items = [
  // {
  //   url: 'https://api.github.com/repos/facebook/react/git/ref/heads/master',
  //   open: 'https://github.com/facebook/react/tree/master',
  //   type: 'json',
  //   selector: 'object.sha'
  // },
  {
    url: 'https://api.github.com/repos/raphamorim/react-ape/git/ref/heads/navigation-api',
    open: 'https://github.com/raphamorim/react-ape/tree/navigation-api',
    type: 'json',
    selector: 'object.sha'
}];

async function fetchItem(item) {
  try {
    console.log('fetching:', item.url);
    const response = await axios.get(item.url, {
      headers: {
        Authorization: 'token 12e9cc71798ae05e2ea6d0e77d13923c0758c8e5'
      }
    });
    return _.get(response.data, item.selector);
  } catch (error) {
    console.error(error);
  }
}

function findItem(item) {
  return db.get('items').find({ url: item.url }).value();
}

function updateItem(url, hash) {
  return db.get('items').find({ url: url }).assign({
    hash: hash
  }).write();
}

function addItem(url, hash) {
  return db.get('items').push({ url: url, hash: hash }).write();
}

async function verifyItem(item) {
  let shouldNofity = false;

  const resp = await fetchItem(item);
  const foundItem = findItem(item);
  
  if(!foundItem) {
    addItem(item.url, resp);
    shouldNofity = true;
  } else if(foundItem.hash !== resp) {
    updateItem(item.url, resp);
    shouldNofity = true;
  }

  if(shouldNofity){
    notifier.notify({
      title: 'Notifier',
      message: 'New change: ' + item.url,
      open: item.open
    });
  }
}

function start() {
  items.forEach((item) => {
    verifyItem(item);
  });
};

module.exports = {
  start: start
}

start();

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});