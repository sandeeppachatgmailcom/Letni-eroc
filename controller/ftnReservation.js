const occupancies =  require('../model/occupancydetails')
const rooms = require ('../model/rooms') 
const express = require('express')
const mongoose = require('mongoose');
const adminController = require('../controller/adminController')
const checkinDetails = require('../model/checkIn')
const frontOffice = require('../model/checkIn') 

async function getReservationDateWise(fromTime, endTime, companyID) {
    try {
        const result = await occupancies.occupancy.aggregate([
            {
                $match: {
                    transDate: {
                        $gte: new Date(fromTime),
                        $lte: new Date(endTime)
                    },
                    companyIndex: companyID
                }
            },
            {
                $group: {
                    _id: {
                        roomType: "$roomType",
                        transDate: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$transDate"
                            }
                        },
                        
                    },
                    blockedCount: { $sum: { $cond: [{ $eq: ["$blocked", true] }, 1, 0] } },
                    dirtyCount: { $sum: { $cond: [{ $eq: ["$dirty", true] }, 1, 0] } },
                    maintenanceCount: { $sum: { $cond: [{ $eq: ["$maintenance", true] }, 1, 0] } },
                    reservationCount: { $sum: { $cond: [{ $ne: ["$reservationId", null] }, 1, 0] } },
                    checkinCount: { $sum: { $cond: [{ $ne: ["$checkinId", null] }, 1, 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    transDate: "$_id.transDate",
                    tariffIndex: "$_id.roomType",  
                    blockedCount: 1,
                    dirtyCount: 1,
                    maintenanceCount: 1,
                    reservationCount: 1,
                    checkinCount: 1
                }
            }
        ]);
       return result;
    } catch (error) {
        // Handle any errors here
        console.error(error);
        throw error;
    }
}
async function getRoomAvailalability(companyID){
const result =await rooms.depart.aggregate([{
    $match:{
        companyIndex:companyID,
        deleted:false
    }
},
{
    $group:{
        _id:{
            roomType:"$roomType"
        },
        roomCount: { $sum: { $cond: [{ $eq: ["$deleted", false] }, 1, 0] } },
   }
},
{
    $project:{
        _id:0,
        roomType:"$_id.roomType",
        roomCount:1
    }
}])
 
console.log(result,'room aggregation')
return result
}

async function loadreservationByCustID(custID){
    const result = await frontOffice.checkIn.find({hrId:custID})
    return result;
}



module.exports = {getReservationDateWise,getRoomAvailalability,loadreservationByCustID}


