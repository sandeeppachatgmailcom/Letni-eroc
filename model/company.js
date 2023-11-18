const mongoose = require('mongoose');
const db = require('./mongoose'); // Ensure the correct path to your mongoose connection setup

const NewCompany = new mongoose.Schema({
    CompanyID: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String },
    contactNumber: { type: String, required: true },
    secondaryNumber: { type: String },
    email: { type: String, required: true },
    buildingNumber: { type: String },
    BuildingName: { type: String },
    StreetName: { type: String },
    district: { type: String },
    city: { type: String },
    pincode: { type: String },
    state: { type: String },
    country: { type: String },
    Active: { type: Boolean, default: false },
    isloggedIn: { type: Boolean, default: false },
    pancard: { type: String },
    RegisteredDate: { type: Date },
    deleted: { type: Boolean, default: false },
    createduser: { type: String },
    image1:{type:String},
    image2:{type:String},
    image3:{type:String},
    Companydiscription:{type:String},
    checkinplan:[{
        planIndex:{type:String,required:true,unique:true},
        planName:{type:String,required:true,unique:true},
        shortName:{type:String,required:true,unique:true},
        maxPax:{type:Number,required:true,default:1},
        amount:{type:Number,required:true,default:0},
        extraCharge:{type:Number,required:true,default:0},
        Creattime:{type:Date,required:true,default:Date.now()},
        user:{type:String},
        LastUpdate:{type:Date,required:true,default:Date.now()},
        discription:{type:String},
        deleted:{type:Boolean,default:false},
        isActive:{ type:Boolean,default:false}
    }],
    roomtypes:[{
        tariffName:{type:String },
        tariffIndex:{type:String },
        roomRentSingle:{type:Number,required:true,default:0},
        extraPerson:{type:Number,required:true,default:0},
        tax:{type:Number,required:true,default:0},
        includeChild:{type:Boolean,required:true,default:true},
        defaultCheckinplan:{type:String,required:true},
        Discription:{type:String},
        timestamp: { type: Date, default: Date.now()},
        username: { type: String, required: true },
        SpecialRent:{type:Number,required:true,default:0},
        itemname: { type: String },
        HSNCode: { type: String },
        deleted:{type:Boolean,default:false,required:true},
        reservationCount:{type:Number,required:true,default:0},
        totalRoom:{type:Number,required:true,default:0},
        bufferTime:{type:Number,default:48}  ,
        isActive:{ type:Boolean,default:false}
    }]
});
 



const  company = db.model('Company',NewCompany);
 
module.exports = { company};
