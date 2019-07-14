const nodemailer = require("nodemailer")

const user = process.env.NODE_MAILER_USER
const pass = process.env.NODE_MAILER_PASSWORD

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass
  }
});

let sendNotification = (data) => {
    return new Promise ((resolve,reject)=>{
        let mailOptions = {
            from: user,
            to: data,
            subject: 'Welcome to MY FANCY TODO!!!',
            text: "SELAMAT BERGABUNG BERSAMA KAMI! silahkan sigin untuk memulai hari-harimu"
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                reject(error);
            } else {
                resolve('Email sent: ' + info.response)
                console.log('Email sent: ' + info.response);
            }
        }) 
    })
}
module.exports = sendNotification