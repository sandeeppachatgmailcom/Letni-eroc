const mongoose = require('mongoose');
const db = require('../model/mongoose');

const HBank = require('../model/humanbank')
const checkin = require('../model/checkIn')
const chkinDetails = require('../model/checkinDetails')
const dailyoccupancy = require('../model/occupancydetails')

async function getReservationBybookingID(bookingID){
    const booking =await chkinDetails.checkinDetails.find({reservationNumber:bookingID }) 
     const guest = await HBank.HumanResource.findOne({ hrId:booking[0].createUser },{_id:0,firstName:1,contactNumber:1,email:1})
    for (const book of booking){
        book.guest=guest;
    }
    return  booking ;
}

async function unlinkBooking(reqobj){ 
    const findBooking = await chkinDetails.checkinDetails.updateOne({occupancyIndex:reqobj.occupancyIndex},{$set:{roomIndex:null}})
    const dailybooking = await dailyoccupancy.occupancy.updateMany({occupancyIndex:reqobj.occupancyIndex},{$set:{roomIndex:null}})
    console.log( reqobj,findBooking , dailybooking   );
    if(findBooking.modifiedCount && dailybooking.modifiedCount ){
        return {unlink:true}
    }
    else{
        return {unlink:false}
    }
}



async function searchReservationBydate(fromDate,toDate){
    const reservation = await checkin.checkIn.find({arrivalDate:{$gte:new Date(fromDate),$lte: new Date(toDate) },delete:false})
    return reservation;
}

async function getdatewiseBookingMonth(fromDate,toDate){
    const data = await checkin.checkIn.aggregate([
        {
            $match:{
                arrivalDate: {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate)
                }       
            }
        },
        {
           $group:{
            _id:{
                year:{$year:'$arrivalDate'},
                month:{$month:'$arrivalDate'},
                day:{$dayOfMonth:'$arrivalDate'}
            },
            totalRoom:{$sum:'$totalRoom'}
           } 
        },
        {
            $project:{
                _id:0,
                transdate:{
                    $dateFromParts: {
                        year: '$_id.year',
                        month: '$_id.month',
                        day: '$_id.day'
                      }
                },
                totalRoom: 1
            }
        },
        {
            $sort: { date: 1 }
        }]);

        return data
}

module.exports ={searchReservationBydate,getdatewiseBookingMonth,unlinkBooking,getReservationBybookingID}
