const mongoose = require('mongoose');
const db = require('./mongoose');


const Newcheckin = new mongoose.Schema({
  frontDeskTransid: { type: String, requfrontDeskTransidired: true, unique: true },
  checkinReferance: { type: String },
  reservationNumber: { type: String },
  grcNumber: { type: String },
  hrId: { type: String },
  IdProofNumber: { type: String },
  arrivalDate: { type: Date },
  arrivalTime: { type: String },
  depart_Date: { type: Date },
  departureTime: { type: String },
  arrivalFrom: { type: String },
  goingTo: { type: String },
  Foreigner: { type: Boolean },
  FormCNumber: { type: String },
  roomId: { type: String },
  category: { type: String },
  tariff: { type: String },
  specialRate: { type: Number },
  ExtraChargeRent:{type: Number,default:0},
  PlanAmount:{type: Number,default:0},
  ExtraChargePlan:{type: Number,default:0},
  TotalPax: { type: Number, required: true },
  planCapacity:{ type: Number, default:0},
  totalDays:{ type: Number,default:0},
  Male: { type: Number },
  feMale: { type: Number },
  otherSex: { type: Number },
  child: { type: Number },
  adult: { type: Number },
  specialrequierments: { type: String },
  CompanyName: { type: String },
  AgentId: { type: String },
  CheckinPlan: { type: String },
  delete: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  createUser: { type: String },
  totalAmount:{type:Number},
  transDate:{type:Date,default:Date.now()},
  totalRoom:{type:Number,default:0}
  
})
const checkIn = db.model('checkin', Newcheckin);
 
  
module.exports = { checkIn}