const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const model = require("./server/model");

model.connect();

app.get("/api/sites", async (req, res, next) => {
  const resp = await model.getAll();
  res.json(resp);
});

// app.use(express.static(path.join(__dirname, "dist", "crawler")));

app.get("*", function (req, res) {
  res.send('Hello World!')
  // res.sendFile(path.join(__dirname, "dist", "crawler", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server started at", PORT);
});
