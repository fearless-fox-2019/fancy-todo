const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    }
});

function sendEmail(to, subject, body) {
  let mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: subject,
    html: body
  }

  transporter.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);

    } else {
      console.log(success);

    }
  })
}

module.exports = sendEmail