const db = require('./mongoose')
const mongoose = require('mongoose')
 
 
const newTariff = new mongoose.Schema({
tariffName:{type:String,required:true,unique:true},
tariffIndex:{type:String,required:true,unique:true},
roomRentSingle:{type:Number,required:true,default:0},
extraPerson:{type:Number,required:true,default:0},
tax:{type:Number,required:true,default:0},
includeChild:{type:Boolean,required:true,default:true},
defaultCheckinplan:{type:String,required:true},
Discription:{type:String},
timestamp: { type: Date, default: Date.now },
username: { type: String, required: true },
SpecialRent:{type:Number,required:true,default:0},
itemname: { type: String },
HSNCode: { type: String },
deleted:{type:Boolean,default:false,required:true},
cancelPeriod :{type:Number,default:48}
}) 

const tariff = db.model('TARIFFMASTER',newTariff);
 
module.exports = {tariff }
