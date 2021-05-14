const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

let receivers = ["tbazelczuk@gmail.com"];

function prepareHtmlValue(item) {
  if (item.prevItem) {
    return `<strike>${item.prevItem.value}</strike> - ${item.value}`;
  }
  return item.value;
}

function sendMail(items) {
  let html = "<ol>";
  for (var i = 0; i < items.length; i++) {
    let item = items[i];
    html += "<li>";
    html +=
      '<a href="' +
      item.url +
      '"> ' +
      item.url +
      "</a> - " +
      prepareHtmlValue(item);
    html += "</li>";
  }
  html += "</ol>";

  const options = {
    from: "sender@email.com", // sender address
    to: receivers.join(", "), // list of receivers
    subject: "Verifier", // Subject line
    html: html,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) console.log(err);
  });
}

module.exports = {
  sendMail,
};
