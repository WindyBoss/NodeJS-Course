const sgMail = require("@sendgrid/mail");

/**
 * It is necessary to register before in https://sendgrid.com/
 * Later to Create a sender (user)
 * And get Api key
 * */
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "example@gmail.com", // Change to your recipient
  from: process.env.Send_Mail, // Change to your verified sender
  subject: "Sending with SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  // if mail provider support html tags or it is possible to create a template on sendgrid.com
};
sgMail
  .send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });
