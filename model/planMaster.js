const db = require('../model/mongoose')
const mongose = require('mongoose');

const newPlan =mongose.Schema( {
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
    deleted:{type:Boolean,default:false}

})

const CheckinPlan = db.model('CheckinPlan',newPlan);
 
module.exports={CheckinPlan }