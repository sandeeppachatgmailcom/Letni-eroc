
const nodeMailer = require('nodemailer')
const randomString = require('randomstring') 
const validation = require('../model/otpvalidation')




async function sendotpmail(toemail,sessionID){
    try {
        
    console.log('reached mailer ');
    let transporter = await nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: 'sandeeppachat@gmail.com',
            pass: 'gitd fmxg ssed djmu'
        }
    })

    const otp =await randomString.generate({
        length: 6,
        charset: 'numeric',
    });

    const mailOptions = {
        from: process.env.nodeMailerEmail, // Sender email
        to: toemail, // Recipient email
        subject: 'OTP Verification Code',
        text: `Dear User,

        We received a request to access your My boookings Account  ${toemail} through your email address. Your Google verification code is: <h2> ${otp} </h2>
        If you did not request this code, it is possible that someone else is trying to access the Google Account sandeeppachat@gmail.com. Do not forward or give this code to anyone.

        Sincerely yours,

        My Bookings  team`,
    };
    const resultotp = await validation.Otp.updateOne({authorisationname:req.body.email},{$set:{sessionId:sessionID,authorisationname:req.body.email,otp:otp,verified:false}},{upsert:true} )
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return {otp:false}    
        } else {
           return {otp:true} 
        }
    });
    } catch (error) {
       console.log(error); 
    }

}

module.exports = {sendotpmail}