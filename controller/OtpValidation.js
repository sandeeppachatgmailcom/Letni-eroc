const OtpAuther= require('../model/otpvalidation');
const nodeMailer = require('nodemailer')
const randomString = require('randomstring') 
const Hbank = require('../functions/humanbank')
 


async function resendOtp(Email,sessionID){
    let result ;
    
        let transporter =await nodeMailer.createTransport({
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
        let randomOtp = otp
        const mailOptions = {
            from: 'info@lajhna.com', // Sender email
            to: Email, // Recipient email
            subject: 'OTP Verification Code',
            text: `Your OTP is: ${otp}`,
        };
   
        const resultotp = await OtpAuther.Otp.updateOne({authorisationname:Email},{$set:{sessionId:sessionID,authorisationname:Email,otp:otp,verified:false,expired:false}},{upsert:true} )
        result = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                    
            } else {
                res.json()
            }
        });

    
 
 
    return {upsertedCount:1};
} 

 
async function validateOtp(Email,Otppassword,sessionID){
    console.log(Email,Otppassword,'function here')
    const result = await OtpAuther.Otp.updateOne(
        { authorisationname: Email, otp: Otppassword },
        { $set: { verified: true } });
    const activateUser = await Hbank.HumanResource.updateOne({email:Email},{$set:{Active:true,activeSession:sessionID}})    
    console.log(result,'otp')
    return result;
} 
async function makeOTPExpired(Email){
     
    const result = await OtpAuther.Otp.updateOne(
        { authorisationname: Email },
        { $set: { expired: true } });
    return result;
} 
 
module.exports={validateOtp,makeOTPExpired,resendOtp}