require("dotenv").config();

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.log(err);
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "tbazelczuk@gmail.com",
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });

  return transporter;
};

const sendEmail = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

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

  sendEmail({
    subject: "Verifier",
    html: html,
    to: "tbazelczuk@gmail.com",
    from: process.env.EMAIL
  });
}

module.exports = {
  sendMail,
};
