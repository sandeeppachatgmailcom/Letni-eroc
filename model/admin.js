
const mongoose = require('mongoose');
const db = require('./mongoose');


const admin = mongoose.Schema({
    companyindex:{type:String,required:true,unique:true},
    companyName:{type:String},
    gstIn:{type:String},
    RoomNo:{type:String},
    streetName:{type:String},
    areaName:{type:String},
    cityName:{type:String},
    district:{type:String},
    state:{type:String},
    email :{type:String},
    contactNumber:{type:number},
    website:{type:String}, 
    Banner:{type:String},
    deleted:{type:Boolean,default:false }
})

const companies = db.model('Companies',admin)
 

module.exports ={companies }
