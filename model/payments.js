const mongoose = require('mongoose')
const db = require('./mongoose')

const NewPayment = new mongoose.Schema({
    transDate:{type:Date},
    paymentDate:{type:Date},
    paymentIndex:{type:String},
    paymentReferance:{type:String,required:true},
    voucherNumber:{type:String},
    accountHead:{type:String},
    entryType:{type:String},
    debit:{type:Number},
    credit:{type:Number},
    custommerId:{type:String,required:true},
    receiptNumber:{type:String},
    companyID:{type:String},
    cancelled:{type:Boolean},
    createdUser:{type:String},
    transactionReferanceNumber:{type:String},
    TransferMode:{type:String}
})

const payment = db.model('payment',NewPayment)
  
module.exports = {payment }  	
