const mongoose = require('mongoose');
const db = require('./mongoose');


const Newcheckin = new mongoose.Schema({
  // frontDeskTransid: { type: String },
  checkinReferance: { type: String },
  reservationNumber: { type: String },
  occupancyIndex:{ type: String },
  grcNumber: { type: String },
  guestindex: { type: String },
  arrivalDate: { type: Date },
  arrivalTime: { type: String },
  depart_Date: { type: Date },
  departureTime: { type: String },
  arrivalFrom: { type: String },
  goingTo: { type: String },
  Foreigner: { type: Boolean },
  FormCNumber: { type: String },
  roomIndex: { type: String },
  tariffIndex: { type: String },
  roomRent: { type: Number },
  ExtraChargeRent:{type: Number,default:0},
  rentCapacity:{type: Number,default:0},
  planIndex: { type: String },
  PlanAmount:{type: Number,default:0},
  ExtraChargePlan:{type: Number,default:0},
  TotalPax: { type: Number, required: true,default:0 },
  planCapacity:{ type: Number, default:0},
  totalDays:{ type: Number,default:0},
  Male: { type: Number },
  feMale: { type: Number },
  otherSex: { type: Number },
  child: { type: Number },
  adult: { type: Number },
  specialrequierments: { type: String },
  companiIndex: { type: String },
  AgentId: { type: String },
  delete: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  createUser: { type: String },
  totalAmount:{type:Number},
  transDate:{type:Date,default:Date.now()},
  occupancyDetails:[
    {contactNumber:{type:String},
    Name:{type:String},
    hrId:{type:String},
    }
  ]
  
})
const checkinDetails = db.model('checkinDetail', Newcheckin);
module.exports= {checkinDetails}