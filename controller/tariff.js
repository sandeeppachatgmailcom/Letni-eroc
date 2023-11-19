//const userModel = require('../Model/userModel')
const cookie = require('cookie-parser');
const { Document, default: mongoose } = require('mongoose');
const memoryCache = require('memory-cache');
const multer = require("multer")
const express = require('express');
const router = express.Router();
const session = require('express-session');
const { render } = require('ejs');
const HBank = require('../functions/humanbank');
const DBcollections = require('../model/dbcollections');
const tariffmaster = require('../functions/tariff')
const controller = require('../controller/adminController')
const checkInPlan = require('../functions/planMaster')
const getRoot = (req,res)=>{
    res.redirect('/admin')
} 

const gettariff = async (req, res) => {
    try {
        req.body.session = req.sessionID;
        let user=''
        const verify = await HBank.verifyUser(req.body)
        if(verify.verified){
            user =verify.userdetails;
            
        }
        else {
            res.redirect('/admin')
        }

        const chkplans = await checkInPlan.LoadPlan()
        const data = await tariffmaster.loadtariff('');
        res.render('tariff', { data,chkplans,user });
    } catch (error) {
        console.error("Error getting tariff data:", error);
        res.status(500).send("Internal Server Error");
    }
} 

const posttariffsearch = async (req,res)=>{
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

    const chkplans = await checkInPlan.LoadPlan()
     const data = await tariffmaster.loadtariff(req.body.searchvalue)
     console.log(req.body.searchvalue)
     res.render('tariff', { data,chkplans,user });
   } catch (error) {
    console.log(error);
   }
} 

const postsaveCategory = async (req,res)=>{
    
   try {
     console.log(req.body.tariffName);   
     let result =  await tariffmaster.savecategory(
         req.body.tariffName,
         req.body.tariffIndex,
         req.body.roomRentSingle,
         req.body.extraPerson,
         req.body.tax,
         req.body.includeChild,
         req.body.defaultCheckinplan,
         req.body.timestamp,
         req.body.username,
         req.body.HSNCode,
         req.body.itemname
         );
         console.log(result.acknowledged);
         if (result.acknowledged){result = { Saved:true }}
         else(result = {Saved:false}) 
         res.json(result)
   } catch (error) {
    console.log(error);
   }
} 
const postdeleteTariff=async (req,res)=>{
   try {
     console.log(req.body.tariffIndex)
     let result = await (tariffmaster.tariff.updateOne({tariffIndex:req.body.tariffIndex},{$set:{deleted:true}}))
     console.log(result.acknowledged);
     if(result.acknowledged ){
         result={deleted:true}
     }
     else
     {
         result={deleted:false}
     }
     res.json(result)
   } catch (error) {
    console.log(error);
   }
} 


module.exports = {getRoot,gettariff,posttariffsearch,postsaveCategory,postdeleteTariff}