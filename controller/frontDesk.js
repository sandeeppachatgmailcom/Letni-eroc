
const express = require('express')
const router = express.Router();
const frontDesk = require('../model/checkIn')
const checkinPlan = require('../model/planMaster')
const Rooms = require('../model/rooms')
const tariffmaster = require('../model/tariff')
const frontoffice = require('../model/checkIn')
console.log('I reched front desk router')
 

router.get('/',(req,res)=>{
    res.redirect('/')
})

router.get('/',async (req,res)=>{
    const saveCheckIn =await frontDesk.getCheckinWithAllDetails(req.body);
    const plan = await checkinPlan.LoadPlan('');
    const tariff = await tariffmaster.loadtariff('');
    const rooms = await Rooms.loadrooms('');
    res.render('checkin',{saveCheckIn,plan,tariff,rooms});
});

router.post('/loadCheckin',async (req,res)=>{
    console.log(req.body,'API: /loadCheckin');
    //const result = await frontoffice.SearchCheckin(req.body );
    const result = await frontoffice.getCheckinWithAllDetails(req.body)
    console.log(result);
    res.json(result);
})

router.post('/SaveCheckin',async(req,resp)=>{
console.log(req.body,'API:/SaveCheckin');
const result = await frontoffice.saveCheckin(req.body)
resp.json(result)
} )



module.exports= router
