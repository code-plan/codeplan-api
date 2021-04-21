/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable camelcase */
const mailgun = require("mailgun-js");

const domain = process.env.MAILGUN_DOMAIN;
const api_key = process.env.MAILGUN_APIKEY;
const mg = mailgun({ apiKey: api_key, domain });

module.exports = {
  mg,
  send_mail(subject, html, to) {
    const data = {
      from: "Codeplan <no-reply@codeplan.dev.br>",
      to,
      subject,
      html,
    };
    mg.messages().send(data, (error, body) => {
      if (error) console.log(error);
    });
  },
};
