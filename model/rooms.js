const mongoose = require('mongoose');
const db = require('./mongoose');


const newRoom = new mongoose.Schema({
        roomNumber:{type:Number,required:true},
        roomIndex:{type:String,required:true},
        roomName:{type:String,required:true},
        companyIndex:{type:String,required:true},
        roomiMages:[String], 
        floor:{type:String,required:true},
        interCom:{type:String,required:true},
        size:{type:Number,required:true,default:0},
        roomType:{type:String,required:true },
        blocked:{type:Boolean,default:true},
        deleted:{type:Boolean,default:false},
        status:{type:String,default:'V'},
        userCreated:{type:String,required:true},
        timeStamp:{type:String,required:true,default:Date.now()},
        maxOccupancy:{type:Number,required:true,default:0},
        NormalOccupancy:{type:Number,required:true,default:0},
        minimumPax:{type:Number,required:true,default:0},
        guestId:{type:String},
        checkinId:{type:String},
        billing:{type:Boolean,default:false},
        rentOut:{type:Boolean,default:false},
        dirty:{type:Boolean,default:false}
},
{index:[{roomIndex:'combined_index',fields:['roomNumber','companyIndex'],unique:true}]})

const depart= db.model('ROOMS',newRoom);
 

module.exports = {depart }
