const nodemailer = require('nodemailer')

module.exports = (obj) => {
     // send email

     const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `fancytodooomailer@gmail.com`,
            pass: process.env.NODE_MAILER_PASSWORD
        }
    })

    const emailCont = `
    Dear ${obj.name},
    Thank you for register to our application with email ${obj.email}.
    We'll promise you to keep all your data privacy.
    
    Enjoy our aplication!
    Best regards,
    
    
    FancyTodoo.`

    console.log(emailCont);
    
    const mailOptions = {
        from: 'admin@jfinder.com', // sender address
        to: obj.email, // list of receivers
        subject: 'Success create new account in FancyTodoo', // Subject line
        html: emailCont
    };
    // console.log(emailCont);

    transporter.sendMail(mailOptions, function (err, info) {
        if(err){
            console.log(err);
            console.log("gagal send");
            
        } else {
            console.log(info);
            console.log("ke send alhamdulillah");
            
        }
    })
}