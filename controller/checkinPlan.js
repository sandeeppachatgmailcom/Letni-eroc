const cookie = require('cookie-parser');
const { Document } = require('mongoose');
const memoryCache = require('memory-cache');
const multer = require("multer")
const express = require('express');
const router = express.Router();
const session = require('express-session');
const { render } = require('ejs');
const CheckinPlan = require('../functions/planMaster')
const adminController = require('../controller/adminController')
HBank = require('../functions/humanbank')
const getRoot = (req,res)=>{
    try {
        
         res.redirect('/admin')
    } catch (error) {
        res.render('error404')
    }
   
} 


const postsaveCheckinplan = async(req,res)=>{
    try {
        if (!req.body.planIndex){req.body.planIndex=await adminController.getIndex('CheckinPlan')}
        console.log(req.body)
        const data = {
        planIndex:req.body.planIndex,
        planName:req.body.planName,
        shortName:req.body.shortName, 
        maxPax:req.body.maxPax, 
        amount:req.body.amount, 
        extraCharge:req.body.extraCharge, 
        discription:req.body.discription,
        Creattime:req.body.Creattime, 
        user:req.body.user, 
        LastUpdate:req.body.LastUpdate,
        deleted:false,
        }
        console.log(data);
        const result = await CheckinPlan.saveCheckinPlan(data) ;
        res.json(result);

    } catch (error) {
        console.log(error)
}
} 
const getplan = async (req,res)=>{
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

    const plans = await CheckinPlan.LoadPlan();
    res.render('checkinPlans',{plans,user})
    } catch (error) {
       console.log(error); 
    }
} 
const postdeletePlan = async (req,res)=>{
    try {
        console.log(req.body);
    const result = await CheckinPlan.deleteCheckinPlan(req.body);
    res.json(result)
    } catch (error) {
        console.log(error);
    }
} 
module.exports = {getRoot,postsaveCheckinplan,getplan,postdeletePlan}