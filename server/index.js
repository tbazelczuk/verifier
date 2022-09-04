require("dotenv").config();

const path = require("path");
const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const PORT = process.env.PORT || 5000;
const model = require("./model");
const mailer = require("./mailer");
const { fetch, fetchAndSave } = require("./repo");
const { fetchWithPuppeteer } = require("./fetch");

// model.connect();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '..', "web", "build")));

app.get("/api/sites", async (req, res, next) => {
  const sites = await model.getAll();
  res.json(sites);
});

app.post("/api/sites", async (req, res, next) => {
  try {
    const body = req.body;
    const site = await fetchAndSave(body);
    res.json(site);
  } catch ({ message }) {
    res.json({ message });
  }
});

app.put("/api/sites", async (req, res, next) => {
  const body = req.body
  const site = await model.update(body)
  res.json(site);
});

app.put("/api/fetch", async (req, res, next) => {
  const { url, selector } = req.body
  const value = await fetchWithPuppeteer({ url, selector })
  res.json({ value });
});

// app.put("/api/fetch", async (req, res, next) => {
//   const { url, selector } = req.body
//   const value = await fetch({ url, selector })
//   res.json({ value });
// });

app.delete("/api/delete", async (req, res, next) => {
  const { _id } = req.body
  await model.deleteById(_id)
  res.json({ _id });
});

app.get("/api/sendMail", function (req, res) {
  mailer.sendMail([{ url: "foo", value: 1, prevItem: { value: 2 } }]);
  res.send("sendMail");
});

app.listen(PORT, () => {
  console.log("Server started at", PORT);
});
