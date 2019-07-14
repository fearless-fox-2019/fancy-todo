var nodemailer = require('nodemailer');
module.exports = (userEmail,message,name) => {
    let htmlMessage = `
        <h2>Hello ${name}, here's your uncompleted tasks!<h2><br>
        ${message}
    `
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
            user: 'gamergarage2020@gmail.com',
            pass: process.env.PASSWORD_EMAIL
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let HelperOptions = {
        from: '"WhatTodo offical" <gamergarage2020@gmail.com>',
        to: userEmail,
        subject: 'Your Uncompleted Tasks',
        // text: message,
        html : htmlMessage
    };

    transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("The message was sent!");
        console.log(info);
    });
}