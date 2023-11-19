
const tariff = require('../model/tariff')
const hBank = require('../model/humanbank')
const checkin = require('../model/checkIn')
const plan = require('../model/planMaster')
const rooms = require('../model/rooms')
const modcheckinDetails = require('../model/checkinDetails')
async function loadIndividualBookingByCompany(companyID) {
  try {
    const result = await modcheckinDetails.checkinDetails.find({
      companiIndex: companyID,
      reservationNumber: { $ne: null },
      checkinReferance: null
    });
     const bookings = result.map(async (booking) => {
      booking.tariff = await tariff.tariff.findOne({ tariffIndex: booking.tariffIndex });
      booking.customer = await hBank.HumanResource.findOne({ hrId: booking.guestindex }, { _id: 0, password: 0, activeSession: 0 });
      booking.bookings = await checkin.checkIn.findOne({ reservationNumber: booking.reservationNumber });
      booking.plan = await plan.CheckinPlan.findOne({planIndex:booking.planIndex}) 
      booking.room  = await rooms.depart.findOne({roomIndex:booking.roomIndex}) 
      
      return booking; // This 'return' ensures 'booking' is included in the 'bookings' array
    }) ;
  
     // This should display the updated data
  
    return  await Promise.all(bookings) ;
  } catch (error) {
    return error 
  }
}

const checkinDetails = modcheckinDetails.checkinDetails;
module.exports= {checkinDetails,loadIndividualBookingByCompany}