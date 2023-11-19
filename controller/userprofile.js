const express = require('express')
const router = express.Router();
const checkin = require('../functions/checkIn')
const payments = require('../functions/payments')
const company = require('../functions/company')
const Razorpaytrans = require('../controller/razorPay')
const userBank = require('../functions/humanbank');
const { LogarithmicScale } = require('chart.js');

const getprofile = (req,res)=>{
    try {
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
}


const cancelBooking = async (req,res)=>{
   try {
     let count = await payments.payment.find({paymentReferance:req.body.bookingID,transactionReferanceNumber:{$ne:null}}).countDocuments();
     console.log(count); 
     if(count){ 
        
         const reservedtime =  await checkin.checkIn.findOne({reservationNumber:req.body.bookingID},{arrivalDate:1,_id:0})
         const currentTime =  new Date()
         const temp = (new Date(reservedtime)-currentTime)
         let hoursDifference =(reservedtime.arrivalDate-currentTime) / (1000 * 60 * 60);
         
         if(hoursDifference<48){
             const status={
                 status:false,
                 message:'Sorry ,its too late.you couldnt able to cancel the booking now '
             }
             res.json(status)
             return;
         }
         else {
             const result =  await checkin.checkIn.updateOne({reservationNumber:req.body.bookingID},{$set:{delete:true}})
             const  user =await userBank.findUser(req.sessionID)
             const paymentId = await payments.payment.findOne({entryType:"Dr",paymentReferance: req.body.bookingID,accountHead:user.hrId},{_id:0,receiptNumber:1})
             const refund = await Razorpaytrans.razorRefundPayment(paymentId.receiptNumber)
             //let refund={};
             refund.status== 'processed'    
             console.log(result);
             let status
             if(result.modifiedCount>0){
                 if(refund.status== 'processed'){
                     status={
                         status:true,
                         message:'Booking Cancelled& refund processed , it will credit in your account with in 24 working hours'
                     }
                 }
                 else{
                     status={
                         status:true,
                         message:'Booking Cancelled'
                     }
                 }
                 res.json(status)
                 return;
             }
         }
     }
     else{
         console.log( await payments.payment.find({paymentReferance:req.body.bookingID}));
         await payments.payment.updateMany({paymentReferance:req.body.bookingID},{$set:{cancelled:true}})
         const result =  await checkin.checkIn.updateOne({reservationNumber:req.body.bookingID},{$set:{delete:true}})
         let status
         status={
             status:true,
             message:'Booking Cancelled,No payment received against this booking '
         }
         res.json(status)
     }
 
   } catch (error) {
    console.log(error);
   }
}
const getPaymentHistory = async (req,res)=>{
   try {
     const user =await userBank.findUser(req.sessionID);
     
     if(!user) {
         res.redirect('/')
         return;
     }
     let bookingDetails = null
     console.log(req.body.userID);
     const paymentHistory = await payments.payment.find({accountHead:user.hrId,cancelled:false},{_id:0,cancelled:0})
     for(let i =0;i<paymentHistory.length;i++){
         let p  = await company.company.findOne({CompanyID:paymentHistory[i].companyID})
         paymentHistory[i].hotel = p.lastName
         
     }
     
     
     res.render('custommerHomePage',{user,bookingDetails,paymentHistory})
 
   } catch (error) {
    console.log(error);
   }
}

const loadProfile = async (req,res)=>{
   try {
     const user =await userBank.findUser(req.sessionID);
     console.log(user)
     if(!user) {
         res.redirect('/')
         return;
     }
     let bookingDetails = null;
     let paymentHistory = null;
     
     res.render('custommerHomePage',{user,bookingDetails,paymentHistory})
 
   } catch (error) {
    console.log(error);
   }
}
module.exports = {getprofile,cancelBooking,getPaymentHistory,loadProfile}