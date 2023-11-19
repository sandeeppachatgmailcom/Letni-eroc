 
const controller = require('../controller/adminController')
const humanBank = require('../model/humanbank')
const tariff = require('../model/tariff')
const modelcheckIn  = require('../model/checkIn')
const modelPayment = require('../model/payments')
const Razorpaytrans = require('../controller/razorPay')
const userBank = require('../functions/humanbank');

async function saveCheckin(checkinobj) {try {
  
    if (!checkinobj.hrId) {
      checkinobj.hrId = await controller.getIndex('humanBank');
      const newCustomer = {
        firstName: checkinobj.firstName,
        contactNumber: checkinobj.contactNumber,
        email: checkinobj.email,
        username: checkinobj.contactNumber,
        category: checkinobj.category,
        hrId: checkinobj.hrId
      }
      const saveHuman = await humanBank.saveHuman(newCustomer)
    }
    if (!checkinobj.checkinReferance) { checkinobj.checkinReferance = await controller.getIndex('CHECKIN') }
    if (!await modelcheckIn.checkIn.findOne({ checkinReferance: checkinobj.checkinReferance })) { checkinobj.frontDeskTransid = await controller.getIndex('FRONTID') }
    data = {
      frontDeskTransid: checkinobj.frontDeskTransid,
      checkinReferance: checkinobj.checkinReferance,
      IdProofNumber: checkinobj.IdProofNumber,
      reservationNumber: checkinobj.reservationNumber,
      grcNumber: checkinobj.grcNumber,
      hrId: checkinobj.hrId,
      arrivalDate: checkinobj.arrivalDate,
      arrivalTime: checkinobj.arrivalTime,
      depart_Date: checkinobj.depart_Date,
      departureTime: checkinobj.departureTime,
      arrivalFrom: checkinobj.arrivalFrom,
      goingTo: checkinobj.goingTo,
      Foreigner: checkinobj.Foreigner,
      FormCNumber: checkinobj.FormCNumber,
      roomId: checkinobj.roomId,
      category: checkinobj.category,
      tariff: checkinobj.tariff,
      specialRate: checkinobj.specialRate,
      TotalPax: checkinobj.TotalPax,
      Male: checkinobj.Male,
      feMale: checkinobj.feMale,
      otherSex: checkinobj.otherSex,
      child: checkinobj.child,
      adult: checkinobj.adult,
      specialrequierments: checkinobj.specialrequierments,
      CompanyName: checkinobj.CompanyName,
      AgentId: checkinobj.AgentId,
      CheckinPlan: checkinobj.CheckinPlan,
      delete: checkinobj.false,
      update: checkinobj.update,
      createUser: checkinobj.createUser
    }
     
    let result = await modelcheckIn.checkIn.updateOne({ checkinReferance: checkinobj.checkinReferance, reservationNumber: checkinobj.reservationNumber }, { $set: data }, { upsert: true })
    data = result.modifiedCount + result.acknowledged
    if (data > 0) { result: { saved: true } }
    else { result: { saved: false } }
     
    return result;
  
} catch (error) {
  console.log(error);
}}
async function saveReservation(reservationObj) {try {
  
     
    if (!reservationObj.reservationNumber) { reservationObj.reservationNumber = await controller.getIndex('RESERVATION') }
    if (!await modelcheckIn.checkIn.findOne({ reservationNumber: reservationObj.reservationNumber })) { reservationObj.frontDeskTransid = await controller.getIndex('FRONTID') }
    data = {
      frontDeskTransid: reservationObj.frontDeskTransid,
      reservationNumber: reservationObj.reservationNumber,
      custId: reservationObj.custId,
      arrivalDate: new Date(reservationObj.arrivalDate),
      arrivalTime: reservationObj.arrivalTime,
      depart_Date: new Date(reservationObj.departureDate),
      departureTime: reservationObj.departureTime,
      Foreigner: reservationObj.Foreigner,
      tariff:reservationObj.tariffIndex,
      specialRate: reservationObj.specialRate,
      TotalPax: reservationObj.totalGuest,
      totalDays:reservationObj.totalDays,
      specialrequierments: reservationObj.specialRequest,
      CompanyName: reservationObj.companyID,
      CheckinPlan: reservationObj.checkinplan,
      totalAmount:reservationObj.totalAmount,
      delete: false,
      update: false,
      createUser: reservationObj.custId,
      ExtraChargeRent:reservationObj.extraCharge,
      PlanAmount:reservationObj.planAmount,
      ExtraChargePlan:reservationObj.planExtraAmount,
      planCapacity:reservationObj.planCapacity,
      totalRoom:reservationObj.totalRoom
    }
    let result = await modelcheckIn.checkIn.updateOne({ reservationNumber: reservationObj.reservationNumber }, { $set: data }, { upsert: true })
    result.reference = reservationObj.reservationNumber;
    data = result.modifiedCount + result.acknowledged;
    if (data > 0) { result: { saved: true } }
    else { result: { saved: false } }
     
    return result;
  
} catch (error) {
  console.log(error);
}}

async function deleteCheckin(checkinReferance) {
  try {
    const frontDeskTransid = await modelcheckIn.checkIn.findOne({ checkinReferance: checkinReferance }, { _id: 0, frontDeskTransid: 1 })
    let result = await modelcheckIn.checkIn.updateOne({ frontDeskTransid: frontDeskTransid.frontDeskTransid }, { $set: { delete: true } })
    let data = result.modifiedCount + result.acknowledged
    if (data > 0) { result: { deleted: true } }
    else { result: { deleted: false } }
    
    return result;
  } catch (error) {
    console.log(error);
  }
}
async function deleteReservation(reservationNumber) {
 try {
   const frontDeskTransid = await modelcheckIn.checkIn.findOne({ reservationNumber: reservationNumber }, { _id: 0, frontDeskTransid: 1 })
   let result = await modelcheckIn.checkIn.updateOne({ frontDeskTransid: frontDeskTransid.frontDeskTransid }, { $set: { delete: true } })
   let data = result.modifiedCount + result.acknowledged
   if (data > 0) { result: { deleted: true } }
   else { result: { deleted: false } }
 
   return result;
 } catch (error) {
  console.log(error);
 }
}
async function SearchCheckin(FrontData) {
 try {
   const custId = await humanBank.combiSearchHuman(FrontData)
   if (!custId) custId = [];
   const checkinDetails = await modelcheckIn.checkIn.find({ hrId: { $in: custId.map((item => { return item.hrId })) }, delete: false })
   return checkinDetails;
 } catch (error) {
  console.log(error);
 }
}


async function getCheckinWithAllDetails(FrontData) {
  try {
    const results = await modelcheckIn.checkIn.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'hrId',
          foreignField: 'hrId',
          as: 'customerDetails',
        }
      },
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: 'roomIndex',
          as: 'roomsDetails',
        }
      },
      {
        $lookup: {
          from: 'tariffmasters',
          localField: 'tariff',
          foreignField: 'tariffIndex',
          as: 'tariffMaster',
        }
      },
      {
          $match: {
            "customerDetails.contactNumber": {
              $regex: new RegExp(FrontData.contactNumber, "i")
            },
          "customerDetails.email": {
            $regex: new RegExp(FrontData.email, "i")
          }
        }
      }
    ]);
     
    return results;
  } catch (error) {
    console.error(error);
  }
}
async function cancelResevation(bookingObj){
  try {
    const result =  await modelcheckIn.checkIn.updateOne({reservationNumber:bookingObj.reservationNumber},{$set:{delete:true}})
    const  user =await userBank.findUser(bookingObj.sessionID)
    const paymentId = await modelPayment.payment.findOne({entryType:"Dr",paymentReferance:bookingObj.bookingID,accountHead:user.hrId},{_id:0,receiptNumber:1})
    let refund;
    if(paymentId){
    refund = await Razorpaytrans.razorRefundPayment(paymentId.receiptNumber) }
    else{
      refund ={}
    }
    //let refund={};
    refund.status== 'processed'    
    console.log(result);
    let status
    if(result.modifiedCount>0){
        if(refund.status== 'processed'){
            status={
                cancelled:true,
                message:'Booking Cancelled& refund processed , it will credit in your account with in 24 working hours'
            }
        }
        else{
            status={
              cancelled:true,
                message:'Booking Cancelled'
            }
        }
         
        return status;
    }
   
    
  } catch (error) {
    console.log(error);
  }
}

async function loadCheckin(checkinReferance) {
 try {
   const checkinDetails = await modelcheckIn.checkIn.find({ checkinReferance: { $regex: `${checkinReferance}`, $options: 'i' }, delete: false })
   return checkinDetails;
 } catch (error) {
  console.log(error);
 }
}
async function loadReservationbyCompany(companyID) {
  
  try {
    
    const reservationDetails = await modelcheckIn.checkIn.find({ CompanyName: companyID, delete: false });
    
    if(reservationDetails){ 
      const bookings = reservationDetails.map(async (booking) => {
        booking.tariffName = (await tariff.tariff.findOne({ tariffIndex: booking.tariff }, { _id: 0, tariffName: 1 })).tariffName;
        const bookedBy = await humanBank.HumanResource.findOne({ hrId: booking.createUser }, { _id: 0, firstName: 1, contactNumber: 1, email: 1,specialrequierments:1 });
        if(bookedBy){
            booking.firstName = bookedBy.firstName;
            booking.email = bookedBy.email;
            booking.contactNumber = bookedBy.contactNumber;
            booking.preferance = bookedBy.specialrequierments;
        }
        else {
          booking.firstName = 'bookedBy.firstName';
            booking.email = 'bookedBy.email';
            booking.contactNumber = 'bookedBy.contactNumber';
            booking.preferance = 'bookedBy.specialrequierments';
        }
        return booking; // Return the modified booking object
      });
    
      const result = await Promise.all(bookings); // Wait for all promises to complete
      return result;
    }
    else return {}
      
  } catch (error) {
    console.log(error);
  }
}

const checkIn = modelcheckIn.checkIn;  
module.exports = { checkIn, saveCheckin, saveReservation, deleteCheckin, loadCheckin, SearchCheckin, getCheckinWithAllDetails,loadReservationbyCompany,cancelResevation }