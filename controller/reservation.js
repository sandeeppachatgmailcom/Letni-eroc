const express = require('express')
const router = express.Router();
const hbank = require('../functions/humanbank')
const company = require('../functions/company')
const checkin = require('../functions/checkIn')
const paymentModel = require('../functions/payments') 
const occupancy = require('../functions/occupancydetails')
const Razorpaytrans = require('../controller/razorPay')
const getRoot = (req,res)=>{
  res.redirect('/')
} 
const postsavereservation =  async (req, res) => {
  const userDetails = await hbank.HumanResource.findOne({ activeSession: req.sessionID })
  req.body.custId = userDetails.hrId
  if (userDetails.country != 'India') req.body.Foreigner = true
  else req.body.Foreigner = false
  let tariff = await company.company.findOne({ CompanyID:req.body.companyID ,"roomtypes.tariffIndex": req.body.tariffIndex}, { roomtypes: 1,checkinplan:1, _id: 0 })
 
  
  let plans = tariff.checkinplan 
   
 
  tariff = tariff.roomtypes;
  if(!req.body.checkinplan)req.body.checkinplan = '';
   let plansfilter = plans.filter(element=>element.planIndex==req.body.checkinplan   );
   if(!plansfilter) plansfilter=[];
    
   let tarifffilter = tariff.filter(element => element.tariffIndex === req.body.tariffIndex);
  req.body.rent = tarifffilter[0].roomRentSingle 
  req.body.specialRate = tarifffilter[0].SpecialRent
  req.body.extraCharge  = tarifffilter[0].extraPerson
  req.body.planAmount = plansfilter[0] ?plansfilter[0].amount:0;
  req.body.planExtraAmount = plansfilter[0]?plansfilter[0].extraCharge:0;
  req.body.planCapacity = plansfilter[0]?plansfilter[0].maxPax:0   
  req.body.totalRoom  = parseInt(req.body.totalRoom)
  const totalAmount = parseInt(req.body.totalAmount);
   
  const result = await checkin.saveReservation(req.body)
  

  const paymentEntry = {
    transDate: Date.now(),
    paymentDate: Date.now(),
    paymentIndex: req.body.paymentIndex,
    paymentReferance: result.reference,
    accountHead: 'RESERVATION',
    amount: totalAmount,
    custommerId: req.body.custId,
    companyID: req.body.companyID,
    cancelled: false,
    createdUser: req.body.custommerId,
    systemEntry: true
  }
  const savedebit = await paymentModel.MakeEntry(paymentEntry)
  const order = await Razorpaytrans.RazorCreateOrder(totalAmount,result.reference)
  
  res.json({ success: true, order, totalAmount,result })
} 

const postconfirmPayment = async (req, res) => {
   
   
   
   
  let bookingDetails = req.body.bookingDetails
  const payment_id = req.body.razorpay_payment_id;
  const userDetails = await hbank.HumanResource.findOne({ activeSession: req.sessionID })
  req.body.custId = userDetails.hrId
  bookingDetails.custId = userDetails.hrId;
  bookingDetails.reservationNumber = req.body.reservationNumber;
 
  const payment = await Razorpaytrans.razorMatchPayment(req.body.razorpay_payment_id);
      
   
  if (payment.status === 'captured') {
    const ReceipttEntry = {
      transDate: Date.now(),
      paymentDate: Date.now(),
      paymentIndex: req.body.paymentIndex,
      paymentReferance: req.body.paymentReferance,
      accountHead: 'RAZORPAYACCOUNT',
      amount: parseInt(payment.amount)/100,
      custommerId: req.body.custId,
      receiptNumber:req.body.razorpay_payment_id,
      companyID: bookingDetails.companyID,
      cancelled: false,
      createdUser: req.body.custId,
      systemEntry: true,
      transactionReferanceNumber:payment.acquirer_data.upi_transaction_id,
      TransferMode:payment.vpa,
      orderID:req.body.order_id 
    }
    const saveCreditEntry = await paymentModel.MakeCreditEntry(ReceipttEntry)
    const saveReservationDetails = await occupancy.saveReservationDetails(bookingDetails)
    console.log(req.body,'from reservation');
    res.json({ status: true });
  } else {
    console.log(req.body);
    // const cancelBooking = await checkin.cancelBooking(req.body)  
    res.json({ status: false });
  }
}
 
module.exports = {getRoot,postsavereservation,postconfirmPayment};
 