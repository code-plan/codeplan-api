/* eslint-disable no-shadow */
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

module.exports = {
  client,
  send_sms(message, to) {
    client.messages.create({ body: message, from: "+13474976753", to }).then();
    // .then((message) => console.log(message.sid));
  },
};
