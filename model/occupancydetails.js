const mongoose = require('mongoose');
const db = require('./mongoose');
const adminController = require('../controller/adminController')
const checkinDetails = require('../model/checkIn')


    const newRoom = new mongoose.Schema({
            occupancyIndex:{type:String},
            roomNumber:{type:Number},
            roomIndex:{type:String},
            roomName:{type:String},
            companyIndex:{type:String},
            roomType:{type:String },
            blocked:{type:Boolean,default:true},
            deleted:{type:Boolean,default:false},
            userCreated:{type:String},
            timeStamp:{type:String,default:Date.now()},
            totalOccupancy:{type:Number,default:0},
            adult:{type:Number,default:0},
            male:{type:Number,default:0},
            feMale:{type:Number,default:0},
            guestId:{type:String},
            rent:{type:Number,default:0},
            specialRent:{type:Number,default:0},
            checkinId:{type:String},
            reservationId:{type:String},
            arrivalDate:{type:Date},
            arrivalTime :{type:String},
            departureDate:{type:Date},
            departureTime:{type:String},
            dirty:{type:Boolean,default:false},
            maintainance:{type:Boolean,default:false},
            blocked:{type:Boolean,default:false},
            occupied:{type:Boolean,default:false},
            transDate:{type:Date,default:Date.now()},
            })

 const occupancy = db.model('occupancy',newRoom )  

 async function saveReservationDetails(bookingDetails) {
        console.log(bookingDetails, 'saveReservationDetails');
        let tempDate = bookingDetails.arrivalDate.split('-');
        const startDate = new Date(tempDate[2], tempDate[1] - 1, tempDate[0]);
        tempDate = bookingDetails.departureDate.split('-');
        let startTime = bookingDetails.arrivalTime;
        let endTime = '00:00:00';
        const endDate = new Date(tempDate[2], tempDate[1] - 1, tempDate[0]);
        const reservationDetails = await checkinDetails.checkIn.findOne({ reservationNumber: bookingDetails.reservationNumber })
    
        while (startDate <= endDate) {
            let dailyEntry = {
                occupancyIndex: await adminController.getIndex('OCCUPANCY'),
                companyIndex: bookingDetails.companyID,
                roomType: bookingDetails.tariffIndex,
                userCreated: bookingDetails.custId,
                totalOccupancy: bookingDetails.totalGuest,
                guestId: bookingDetails.custId,
                rent: parseInt(reservationDetails.tariff),
                specialRent: parseInt(reservationDetails.specialRate),
                reservationId: bookingDetails.reservationNumber,
                checkinPlan: reservationDetails.CheckinPlan,
                transDate: formatDate(startDate), // You need to format the date here
                startTime: startTime,
                endTime: endTime,
            }
            await occupancy.updateOne({reservationId:bookingDetails.reservationNumber,transDate:formatDate(startDate)},{$set:dailyEntry},{upsert:true}) 
            startDate.setDate(startDate.getDate() + 1);
            startTime = '00:00:00';
            if (startDate.getDate() === endDate.getDate()) {
                endTime = bookingDetails.departureTime;
            }
        }
    }
    
  
    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    

         

        
 
 
 module.exports = {occupancy,saveReservationDetails}
