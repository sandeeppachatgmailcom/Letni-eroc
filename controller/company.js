  
const express = require('express');
const router = express.Router();
const companies = require('../functions/company') 
const pincodes = require('../functions/pincode') 
const HBank = require('../functions/humanbank') 
const tariff = require('../functions/tariff')
const checkinPlans = require('../functions/planMaster')
const rooms = require('../functions/rooms')
const getRoot = (req,res)=>{
  res.redirect('/hotel')
} 
const postloadcustommer = async (req,res)=>{
  try {
    const result = await company.loadcompany('');
    res.json(result);
  } catch (error) {
    console.log(error);
  }
} 
const postswitchRoomStatus = async (req,res)=>{
 try {
  const result = await rooms.depart.findOne({roomIndex:req.body.roomIndex},{blocked:1,_id:0})
  if(result.blocked){
       await rooms.depart.updateOne({roomIndex:req.body.roomIndex},{$set:{blocked:false}})
  }
  else {
       await rooms.depart.updateOne({roomIndex:req.body.roomIndex},{$set:{blocked:true}})
  }
  const reply = await rooms.depart.findOne({roomIndex:req.body.roomIndex},{blocked:1,_id:0})
  
  res.json(reply);
 } catch (error) {
  console.log(error);
 }
} 
const getloadTariff = async (req,res)=>{
  try {
    
    req.body.session = req.sessionID;
    const result =await HBank.verifyUser(req.body)  
    const user = await HBank.HumanResource.findOne({activeSession: req.sessionID, deleted: false },{password:0});
    if(result.verified){
      const profile = await companies.company.findOne({email:user.email});
        if(!profile){
          res.redirect('/custom/customSearch')
          return
        }
        const activtariff = await tariff.loadtariff('');
        let existingTariff = profile.roomtypes;
        let tariffPackages=[];
        for (let i=0;i<activtariff.length;i++){
        let flag=0;
            for (let j=0;j<existingTariff.length;j++){
                if(existingTariff[j].tariffIndex==activtariff[i].tariffIndex){
                tariffPackages.push(existingTariff[j])
                flag++;
                break;
                }
            }
            if(!flag){
            tariffPackages.push(activtariff[i])
            await companies.company.updateOne(
                { CompanyID: profile.CompanyID },
                { $push: { "roomtypes": activtariff[i] } },
                { upsert: true }
            );
            }
        }
        res.cookie('userName',req.body.userName)
        let   availablerooms
        let   inputs 
        let   Plans 
        let   floors 
        let   category 
        let reservation 
        let payments
        let occupancyDetails 
        res.render('companyhomePage', { user, tariffPackages, profile, inputs,Plans,availablerooms,floors,category,reservation,payments,occupancyDetails });
    }
    else{
        res.redirect('/')
      }  
 
  } catch (error) {
    console.log(error);   
  } 
} 

const getloadPlan = async (req,res)=>{
    try {
      req.body.session = req.sessionID;
    const result =await HBank.verifyUser(req.body)  
    const user = await HBank.HumanResource.findOne({activeSession: req.sessionID, deleted: false },{password:0});
    if(result.verified){
      const profile = await companies.company.findOne({email:user.email});
        if(!profile){
          res.redirect('/custom/customSearch')
          return
        }

        const activePlans = await checkinPlans.LoadPlan();
        let existingPlan = profile.checkinplan;
        let Plans = [];
        for (let i=0;i<activePlans.length;i++){
        let flag=0;
        for(let j=0;j<existingPlan.length;j++){
          if( existingPlan[j].planIndex==activePlans[i].planIndex   ){
               Plans.push(existingPlan[j])
               flag++; 
               break;
          }
           
        }
        if(!flag) {Plans.push(activePlans[i])
          await companies.company.updateOne(
                    {CompanyID:profile.CompanyID},
                    {$push:{"checkinplan":activePlans[i]}},
                    {upsert:true}
                    );}
      }
        res.cookie('userName',req.body.userName)
        let  availablerooms 
        let  inputs  
        let  tariffPackages 
        let  floors   
        let  category   
        let reservation 
        let payments
        let occupancyDetails 
        
        res.render('companyhomePage', { occupancyDetails ,user, tariffPackages, profile, inputs,Plans,availablerooms,floors,category,reservation,payments });
    }
    else{
        res.redirect('/')
      }  
  

    } catch (error) {
      console.log(error);      
    }
    }  

const getloadRoom = async (req,res)=>{
    try {
      req.body.session = req.sessionID;
    const result =await HBank.verifyUser(req.body)  
    const user = await HBank.HumanResource.findOne({activeSession: req.sessionID, deleted: false },{password:0});
     
    if(result.verified){
        const profile = await companies.company.findOne({email:user.email});
        if(!profile){
          res.redirect('/custom/customSearch')
          return
        } 

        const availablerooms =await rooms.loadroomByCompanyId(profile.CompanyID);
         
        res.cookie('userName',req.body.userName)
        let tariffPackages 
        let  inputs ;
        let  Plans  ;
        let  floors ;
        let  category ;
        let reservation 
        let payments;
        let occupancyDetails ;
        
        res.render('companyhomePage', { occupancyDetails ,user, tariffPackages, profile, inputs,Plans,availablerooms,floors,category,reservation,payments });
    }
    else{
        res.redirect('/')
      }  
  

    } catch (error) {
      console.log(error);      
    }
    } 
const getCompany = async(req,res)=>{
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

    let data = await companies.SearchCompany('');
    let count = data.length;
    count = Math.floor(count/10);
    count++;
    let pincode =  await pincodes.loadPincode(req.body)
     
    res.render('companies',{data,count,pincode,user});

  } catch (error) {
    console.log(error)    
  }
} 

const postSaveCompany =  async (req,res)=>{
     
    try {
        let imgArray = [];
        for (let i = 0; i < req.files.length; i++) {
          imgArray.push('http://localhost:5200/Images/'+req.files[i].filename);
        }
        req.body.imagearray = imgArray;
        let result =await companies.saveCompany(req.body) ;
        if((result.modifiedCount + result.upsertedCount)>0){result = {saved:true}}
        else {result={saved:false}}
        res.json(result)
    } catch (error) {
      
    }
    } 

const postsearchCompany =async (req,res)=>{
  try {
  
    let data = await companies.SearchCompany(req.body.searchvalue);
    res.render('human',{data});
} catch (error) {
  console.log(error);
}
}  
const postDeleteCompany =  async (req, res) => {
  try {
    
    let result = await companies.deleteCompany(req.body.hrId)
    if ((result.modifiedCount + result.upsertedCount) > 0) { result = { deleted: true } }
    else { result = { deleted: false } }
    res.json(result)
  } catch (error) {
    console.log(error);
  }
} 

const loadActivecompanies = async ()=>{
  try {
    const comp = await companies.company.find({deleted:false}).skip(1).limit(7)
  console.log(comp,'comp');
  return comp;
  } catch (error) {
    console.log(error);
  }
}
module.exports={postloadcustommer,getRoot,postswitchRoomStatus,getloadTariff,getloadPlan,
  getloadRoom,getCompany,postSaveCompany,postsearchCompany,postDeleteCompany,loadActivecompanies};