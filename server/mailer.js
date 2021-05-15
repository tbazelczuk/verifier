const sgMail = require("@sendgrid/mail");

sgMail.setTwilioEmailAuth(
  process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD
);

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

  const msg = {
    to: "tbazelczuk@gmail.com",
    from: "test@example.com",
    subject: "Verifier",
    html,
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log("email send", response[0].statusCode);
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = {
  sendMail,
};
