//const userModel = require('../Model/userModel')
const cookie = require('cookie-parser');

const { Document } = require('mongoose');
const memoryCache = require('memory-cache');
const multer = require("multer")
const express = require('express');
const router = express.Router();
const session = require('express-session');
const { render } = require('ejs');
const HBank = require('../functions/humanbank');
const DBcollections = require('../model/dbcollections');
const frontoffice = require('../functions/checkIn') 
const floor = require('../functions/floor')
const rooms = require('../functions/rooms')
const adminController = require('../controller/adminController')
const getRoot = (req,res)=>{
    try {
        res.redirect('/admin')
    } catch (error) {
        console.log(error);
    }
} 
const postloadcustommer = async (req,res)=>{
   try {
    console.log(req.body);
    const result = await HBank.loadHuman('');
    console.log(result);
    res.json(result);
   } catch (error) {
    console.log(error);
   }
} 
const gethuman = async(req,res)=>{
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

    const data = await HBank.SearchHuman('');
    res.render('human',{data,user});
   } catch (error) {
    console.log(error);
   }
} 
const postSaveHuman = async (req,res)=>{
    try {
        req.body.session=req.sessionID;
    let result =await HBank.saveHuman(req.body) ; 
    if((result.modifiedCount )>0){
        result = {saved:true} 
        result.message= 'profile Edited successfully'}
    else if(( result.upsertedCount)>0){    
        result = {saved:true} 
        result.message= 'profile created successfully'}
     
    else {
        result={saved:false}
        result.message= 'Something went wrong please try again!!'}
    res.json(result)
    } catch (error) {
        console.log();
    }
} 
const postsearchHuman = async (req,res)=>{
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

    let data = await HBank.SearchHuman(req.body.searchvalue);
    res.render('human',{data,user});
    } catch (error) {
        console.log(error);
    }
}  
const postDeleteHuman = async (req, res) => {
  try {
    let result = await HBank.deleteHuman(req.body.hrId)
    if ((result.modifiedCount + result.upsertedCount) > 0) { result = { deleted: true } }
    else { result = { deleted: false } }
    res.json(result)
  } catch (error) {
    console.log(error);
  }
} 

module.exports={getRoot,postloadcustommer,postDeleteHuman,postsearchHuman,postSaveHuman,gethuman};