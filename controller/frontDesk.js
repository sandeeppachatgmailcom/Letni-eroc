
const express = require('express')
const router = express.Router();
const frontDesk = require('../functions/checkIn')
const checkinPlan = require('../functions/planMaster')
const Rooms = require('../functions/rooms')
const tariffmaster = require('../functions/tariff')
const frontoffice = require('../functions/checkIn')
const HBank = require('../functions/humanbank')
console.log('I reched front desk router')
 

const getRoot = (req,res)=>{
   try {
    res.redirect('/')
   } catch (error) {
    console.log(error);
   }
} 
const getModuleRoute = async (req,res)=>{
    try {
        
    req.body.session = req.sessionID;
    let user = ''
    const verify = await HBank.verifyUser(req.body)
    if (verify.verified) {
        user = verify.user;

    }
    else {
        res.redirect('/admin')
    }

    
  
    const saveCheckIn =await frontDesk.getCheckinWithAllDetails(req.body);
    const plan = await checkinPlan.LoadPlan('');
    const tariff = await tariffmaster.loadtariff('');
    const rooms = await Rooms.loadrooms('');
    res.render('checkin',{saveCheckIn,plan,tariff,rooms,user});
    } catch (error) {
        console.log(error);
    }
} ;
const postloadCheckin = async (req,res)=>{
   try {
    console.log(req.body,'API: /loadCheckin');
    //const result = await frontoffice.SearchCheckin(req.body );
    const result = await frontoffice.getCheckinWithAllDetails(req.body)
    console.log(result);
    res.json(result);
   } catch (error) {
    console.log(error);
   }

} 
const postSaveCheckin = async(req,resp)=>{
    try {
        
console.log(req.body,'API:/SaveCheckin');
const result = await frontoffice.saveCheckin(req.body)
resp.json(result)
    } catch (error) {
        console.log(error);
    }
}  
module.exports= {getRoot,getModuleRoute,postloadCheckin,postSaveCheckin}
