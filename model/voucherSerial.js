const mongoose = require('mongoose');
const db = require('./mongoose'); // Make sure this path is correct and points to your Mongoose connection setup file

// Define a Mongoose schema
const newSeries = new mongoose.Schema({
  bookName: { type: String },
  DepartMent:{ type: String },
  companyID:{type:String},
  financialYear:{type:String},
  nextIndex: { type: Number, default: 100000 }, // Corrected the field name to 'nextIndex'
  prefix: { type: String },
  activeYear:{type:Boolean,default:false},
  deleted:{type:Boolean,default:false}
});

// Compile the Mongoose model
const voucherSerial = mongoose.model('voucherSerial',newSeries);


 
module.exports = { voucherSerial  };

