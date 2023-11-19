const express = require('express');
const router = express.Router()
const facilty = require('../functions/facilty')
const HBank = require('../functions/humanbank')

const getRoot = (req,res)=>{
   try {
      res.redirect('/admin')
   } catch (error) {
      console.log(error);
   }
} 
const getfacilty = async (req,res)=>{
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

 const facility = await facilty.loadAllfacilty()
 console.log(facility);
 if(!facility) facility = {}; 
    res.render('Services',{facility,user})
   } catch (error) {
      console.log(error);
   }
} 
const postsaveFacilty = async (req,res)=>{
  try {
   console.log('Reached Backend');
   const result1 = await facilty.SaveFacilty(req.body)
   console.log(req.body);
      res.json(result1);
  } catch (error) {
   console.log(error);
  }
} 
module.exports = {getRoot,getfacilty,postsaveFacilty};