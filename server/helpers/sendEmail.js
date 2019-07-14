var nodemailer = require('nodemailer');
module.exports = {
    sendEmail(toEMail, nameProject,by) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'yamadaviu@gmail.com',
                pass: process.env.PASSWORD
            }
        });

        var mailOptions = {
            from: 'yamadaviu@gmail.com',
            to: toEMail,
            subject: 'fancy todo notification member',
            html: `
            <div class="container"> 
    <div class="row">
            <div class="col-sm-4 offset-sm-4" style="border-left: 6px solid red;">
                
    <h1><img src="https://img.icons8.com/color/60/000000/hummingbird.png"></h1>
    <h1>Hello, this is from lovelyz in Todos.</h1><br>
    <p>I would like to inform you that you are now a member
        of project named <b>${nameProject}</b> added by ${by}.
        <br>Go Check it Now! <br>
        <b>Thank You ^^</b>
    </p>
</div>
</div>
</div>

            `
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err;
            console.log('Email sent: ' + info.response);
        });
    }
}

