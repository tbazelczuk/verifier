const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const model = require("./server/model");
const mailer = require("./server/mailer");

model.connect();

app.get("/api/sites", async (req, res, next) => {
  const resp = await model.getAll();
  res.json(resp);
});

// app.use(express.static(path.join(__dirname, "dist", "crawler")));

app.get("/api/sendMail", function (req, res) {
  mailer.sendMail([{ url: "foo", value: 1, updatedItem: { value: 2 } }]);
  res.send("sendMail");
});

app.get("*", function (req, res) {
  res.send("Hello World!");
  // res.sendFile(path.join(__dirname, "dist", "crawler", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server started at", PORT);
});
