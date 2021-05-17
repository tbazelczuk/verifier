const SendGrid = require("sendgrid");
const sendGrid = SendGrid(process.env.SENDGRID_API_KEY);

function prepareHtmlItem(item) {
  if (item.prevItem) {
    return `<strike>${item.prevItem.value}</strike> - ${item.value}`;
  }
  return item.value;
}

function prepareHtml(items) {
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
      prepareHtmlItem(item);
    html += "</li>";
  }
  html += "</ol>";
  return html;
}

function sendMail(items) {
  let html = prepareHtml(items);

  const request = sendGrid.emptyRequest({
    method: "POST",
    path: "/v3/mail/send",
    body: {
      personalizations: [
        {
          to: [
            {
              email: "tbazelczuk@gmail.com",
            },
          ],
          subject: "Verifier",
        },
      ],
      from: {
        email: "test@example.com",
      },
      content: [
        {
          type: "text/html",
          value: html,
        },
      ],
    },
  });

  return sendGrid
    .API(request)
    .then(function (response) {
      console.log("sendMail", response.statusCode);
    })
    .catch(function (error) {
      console.log("sendMail", error.response);
    });
}

module.exports = {
  sendMail,
};
