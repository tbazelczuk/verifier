require("dotenv").config();

const { connect } = require("./model");
const { fetchAll } = require("./repo");

connect().then(() => {
  fetchAll();
});
