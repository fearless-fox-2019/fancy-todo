const nodemailer = require("nodemailer");
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure:false,
    auth: {
        type: 'login',
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

module.exports = transporter