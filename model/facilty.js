const mongoose = require('mongoose')
const db = require('./mongoose');

const NewFacilty =new mongoose.Schema({
    Serviceindex:{type:String,required:true,unique:true},
    ServiceName: { type: String, required: true },
    ServiceImages1: { type: String },
    ServiceImages2: { type: String },
    ServiceImages3: { type: String },
    ServiceImages4: { type: String },
    hsnCode: {type:String },
    timestamp: { type: Date, default: Date.now },
    username: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    edited: { type: Boolean, default: true },
    blocked:{type:Boolean,default:false}
  });
  const facilty = db.model('facilty',NewFacilty);
  
   
  module.exports = {facilty }