
const mongoose = require('mongoose');
const db = require('./mongoose');

const newPincode = mongoose.Schema({
     officename : {type:String},
     pincode : {type:Number},
     officeType : {type:String},
     Deliverystatus : {type:String},
     divisionname : {type:String},
     regionname : {type:String},
     circlename : {type:String},
     Taluk : {type:String},
     Districtname : {type:String},
     statename : {type:String},
     Telephone : {type:String},
     RelatedSuboffice : {type:String},
     RelatedHeadoffice : {type:String},
  })

  const pincode = db.model('pincode',newPincode);
   
  module.exports = {pincode }