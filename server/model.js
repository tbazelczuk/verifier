const mongoose = require("mongoose");

const uristring =
  process.env.MONGODB_URI || "mongodb://localhost/HelloMongoose";

var NewsSchema = new mongoose.Schema(
  {
    url: String,
    value: String,
    selector: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const NewsModel = mongoose.model("News", NewsSchema);

async function connect() {
  return new Promise(function (resolve, reject) {
    mongoose.connect(
      uristring,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      function (err, res) {
        if (err) {
          console.error("ERROR connecting to mongodb:", err);
          reject();
        } else {
          console.log("Succeeded connected to mongodb");
          resolve();
        }
      }
    );
  });
}

function disconnect() {
  mongoose.disconnect();
  console.log("Succeeded disconnect from mongodb");
}

async function getAll() {
  var query = NewsModel.find(null, null, {
    sort: { updated_at: -1 },
  });
  return query;
}

const shouldUpdate = (item, doc) => {
  return item.value !== doc.value;
};

async function save(item) {
  return new Promise(function (resolve, reject) {
    const { url } = item;

    NewsModel.findOne({ url })
      .then((doc) => {
        if (!doc) {
          var model = new NewsModel(item);
          model
            .save()
            .then((doc) => {
              doc.newFlag = true;
              console.log("succeess saved", doc);
              resolve(doc);
            })
            .catch((err) => {
              console.log(err);
              reject();
            });
        } else if (shouldUpdate(item, doc)) {
          NewsModel.findOneAndUpdate({ url }, item, { new: true })
            .then((newDoc) => {
              newDoc.updateFlag = true;
              newDoc.prevItem = doc;
              console.log("succeess updated", newDoc);
              resolve(newDoc);
            })
            .catch((err) => {
              console.log(err);
              reject();
            });
        } else {
          resolve(doc);
        }
      })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });
}

async function saveAll(items) {
  let arr = [];
  for (var i = 0; i < items.length; i++) {
    arr.push(save(items[i]));
  }
  return Promise.all(arr);
}

module.exports = {
  disconnect,
  connect,
  saveAll,
  save,
  getAll,
};
