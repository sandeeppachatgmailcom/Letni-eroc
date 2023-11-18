const mongoose = require('mongoose');
const db = require('./mongoose');
const newRoom = new mongoose.Schema({
            occupancyIndex:{type:String},
            companyIndex:{type:String},
            tariffIndex:{type:String },
            roomIndex:{type:String},
            userCreated:{type:String},
            totalOccupancy:{type:Number,default:0},
            guestId:{type:String},
            roomRent:{type:Number,default:0},
            planIndex:{type:String},
            transDate:{type:Date,default:Date.now()},
            startTime:{type:String},
            endTime:{type:String},
            dateString:{type:String},
            blocked:{type:Boolean,default:true},
            deleted:{type:Boolean,default:false},
            maintainance:{type:Boolean,default:false},
            blocked:{type:Boolean,default:false},
            occupied:{type:Boolean,default:false},
            timeStamp:{type:String,default:Date.now()},
            dirty:{type:Boolean,default:false},
            blockedBy:{type:String}
            })
 const occupancy = db.model('dailyroomStatus',newRoom )  


 
 module.exports = {occupancy }
