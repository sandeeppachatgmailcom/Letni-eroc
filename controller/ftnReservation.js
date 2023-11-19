const occupancies =  require('../functions/occupancydetails')
const rooms = require ('../functions/rooms') 
const express = require('express')
const mongoose = require('mongoose');
const adminController = require('../controller/adminController')
const company = require('../functions/company')
const frontOffice = require('../functions/checkIn') 

async function getReservationDateWise(fromTime, endTime, companyID, roosObj) {
  try {
    
  const startDate = new Date(fromTime);
  const endDate = new Date(endTime);
  const result = [];
  
  let dailyReservation = []; 
  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateString = date.toISOString().split('T')[0];
    
    for (const element of roosObj) {
      const temp={}
      try {
        
          const reservedcount = await occupancies.occupancy
          .find({
            tariffIndex: element.tariffIndex,
            dateString: dateString,
            companyIndex:companyID

          })
          .countDocuments();
           
   
         temp.dateString=dateString
         temp.tariffIndex=element.tariffIndex
         temp.reservedcount = reservedcount;
         temp.availableRoom =  element.availableRoom - reservedcount >0 ?element.availableRoom - reservedcount:0;
         dailyReservation.push(temp)  
      } catch (error) {
        console.error("Error querying database:", error);
      }
    }
  }
   
  const minReservations = {};

  dailyReservation.forEach((item) => {
    const { tariffIndex, availableRoom } = item;
  
    // Check if we have seen this tariffIndex before
    if (minReservations[tariffIndex] === undefined) {
      // If not, initialize it with the current reservedcount
      minReservations[tariffIndex] = availableRoom;
    } else {
      // If we have seen this tariffIndex before, update it if the current reservedcount is smaller
      if (availableRoom < minReservations[tariffIndex]) {
        minReservations[tariffIndex] = availableRoom;
      }
    }
  });
 
for(const tariff of roosObj ){
 
  tariff.totalRoom = minReservations[tariff.tariffIndex];
 
  
}      
 
 
  return  {roosObj,dailyReservation} ;
  } catch (error) {
    console.log(error);
  }
}

  async function oldgetReservationDateWise(fromTime, endTime, companyID) {
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
            roomType: "$tariffIndex",
            transDate: "$transDate",
            blockedCount: { $sum: { $cond: [{ $eq: ["$blocked", true] }, 1, 0] } },
            dirtyCount: { $sum: { $cond: [{ $eq: ["$dirty", true] }, 1, 0] } },
            reservationCount: { $sum: { $cond: [{ $ne: ["$occupancyIndex", null] }, 1, 0] }},
          
        },
        }
      },
      {
        $project: {
          _id: 1,
          transDate: "$_id.transDate",
          roomType: "$_id.tariffIndex",
          blockedCount: 1,
          dirtyCount: 1,
          reservationCount: 1,
           
        }
      }
    ]);
     
    return result;
    } catch (error) {
      console.log(error);
    }
  }


  async function getRoomAvailalability(companyID){
    try {
      
    const result =await company.company.findOne({CompanyID:companyID,deleted:false})
    let roomTypes = result.roomtypes;
    if(!roomTypes) roomTypes=''
    for(const item of roomTypes){
      item.availableRoom = await rooms.depart.find({roomType:item.tariffIndex,deleted:false,companyIndex:companyID}).countDocuments() 
    } 
     
    console.log(roomTypes)
    return roomTypes
    } catch (error) {
      console.log(error);
    }
    }
    


async function oldgetRoomAvailalability(companyID){
  try {
    
const result =await rooms.depart.aggregate([{
  $match:{
      companyIndex:companyID,
      deleted:false
  }
},
{
  $group:{
      _id:{
          roomType:"$roomType",
          bookedDate:"$dateString"
      },
      roomCount: { $sum: { $cond: [{ $eq: ["$deleted", false] }, 1, 0] } },
 }
},
{
  $project:{
      _id:0,
      roomType:"$_id.roomType",
      bookedDate:"$dateString",
      roomCount:1
  }
}])
return result
  } catch (error) {
    console.log(error);
  }
}

async function loadreservationByCustID(custID){
try {
  const result = await frontOffice.checkIn.find({createUser:custID,delete:false}).sort({ reservationNumber: -1 })
  return result;
} catch (error) {
  console.log(error);
}
}



module.exports = {getReservationDateWise,getRoomAvailalability,loadreservationByCustID}


