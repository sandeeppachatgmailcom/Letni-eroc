const express = require('express')
const router = express.Router();
const companies = require('../functions/company')
const HBank = require('../functions/humanbank');
const tariff = require('../functions/tariff');
const controller = require('../controller/adminController')
const tariffmaster = require('../functions/tariff')
const checkinPlans = require('../functions/planMaster');
const rooms = require('../functions/rooms');
const floorMaster   = require('../functions/floor');
const checkinmaster = require('../functions/checkIn');
const payment = require('../functions/payments');
const reception = require('../functions/checkinDetails')
const dailyoccupancy = require('../functions/occupancydetails')
const fntReservation = require('../functions/reservation')



const getRoot = (req,res)=>{
  res.render('login')
} 

const postaddoccupancy = async (req,res)=>{
  try {
    
  req.body.session = req.sessionID;
  const verify = await HBank.verifyUser(req.body)
  if(verify.verified){
    let  bookingDetails = await fntReservation.getReservationBybookingID(req.body.bookingID) 
    console.log(bookingDetails)
    const user =verify.user;
     
    res.render('RoomChart',{user,bookingDetails})
  }
  else {
    res.redirect('/hotel')
  }
  } catch (error) {
   console.log(error); 
  }
} 
const postunlinkRoom = async (req,res)=>{
  try {
    const unlinkBooking  = await fntReservation.unlinkBooking(req.body)  
    res.json(unlinkBooking)
  } catch (error) {
    console.log(error);
  }
 
} 

const postupdateReservationWithRoom = async (req,res)=>{
  try {
    
  const dailydetails = await dailyoccupancy.occupancy.updateMany({occupancyIndex:req.body.occupancyIndex},{$set:{roomIndex:req.body.roomIndex}})   
  const checkinSummary = await reception.checkinDetails.updateOne({occupancyIndex:req.body.occupancyIndex},{$set:{roomIndex:req.body.roomIndex}})   
  console.log(dailydetails,'dailydetails',checkinSummary,'checkinSummary')
  if(dailydetails.modifiedCount && checkinSummary.modifiedCount ){
    res.json({
      updated:true,
      roomIndex:req.body.roomIndex,
      
    })   
  }
  
  } catch (error) {
  console.log(error);  
  }
} 

const postloadAvailableRooms = async (req,res)=>{
  try {
    
  
  let allRooms = await rooms.loadroomByCompanyId(req.body.companiIndex);
  
  let availableroom = allRooms.filter((room) => {
    return (room.roomType === req.body.tariffIndex && (!room.blocked)) ;

  });
 
  let room=[];
 
  let bookedRooms = await dailyoccupancy.occupancy.find({ tariffIndex: req.body.tariffIndex, transDate: {
    $gte: new Date(req.body.arrivalDate),
    $lte: new Date(req.body.depart_Date)
  }});

  console.log(bookedRooms,'bookedRooms');
  if (!bookedRooms){  bookedRooms='';}
  
  for(let i =0;i<availableroom.length;i++){
    let flag = 0;
    for(let j=0;j<bookedRooms.length;j++){
      if(availableroom[i].roomIndex==bookedRooms[j].roomIndex){
        flag++ 
        break;
      }
      
    }
    if(!flag){
      room.push(availableroom[i]);
    }
  }
  console.log(room,'room');
  res.json(room)
  } catch (error) {
    console.log(error);
  }
} 
const getloadhomepage =  async (req, res) => {
   try {
    
    const inputs = req.body;
     
    req.body.session = req.sessionID;
    const result =await HBank.verifyUser(req.body)   
   
    const user = await HBank.HumanResource.findOne({activeSession: req.sessionID, deleted: false });
    bookingDetails={};
    if(result.verified){
    
      const profile = await companies.company.findOne({email:user.email});
      
    
      if(!profile){
        res.redirect('/custom/customSearch')
        return
      }
      const activtariff = await tariff.loadtariff('');
      const activePlans = await checkinPlans.LoadPlan();
      let existingTariff = profile.roomtypes;
      let existingPlan = profile.checkinplan;
      const availablerooms =await rooms.loadroomByCompanyId(profile.CompanyID);
      const floors = await floorMaster.loadAllFloor()
      const category = await tariffmaster.loadtariff('')
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

    res.cookie('userName',result.user)
    if (!availablerooms )availablerooms={};
    let  reservation = await checkinmaster.loadReservationbyCompany(profile.CompanyID)         
    if(!reservation)reservation ='';
    let payments = await payment.loadPaymentByCompanyID(profile.CompanyID)
    if(!payments)  payments='';
    let occupancyDetails = await reception.loadIndividualBookingByCompany(profile.CompanyID);
   if(!occupancyDetails) occupancyDetails='';
   console.log(tariffPackages);
  res.render('companyhomePage', { user, tariffPackages, profile, inputs,Plans,availablerooms,floors,category,reservation,payments,occupancyDetails });
  }
    else{
      res.redirect('/')
    }
    
  
   } catch (error) {
  console.log(error);  
   }

}
const postloadhomepage =  async (req, res) => {
  try {
    const inputs = req.body;
    const userlogrecord = {
      username: req.body.Username,
      sessionId: req.sessionID,
      folder: req.path,
      method: req.method,
      loggedOut: false,
      ip: req.ip,
    };
     
    req.body.session = req.sessionID;
    const result =await HBank.verifyUser(req.body)   
     
    const user = await HBank.HumanResource.findOne({activeSession: req.sessionID, deleted: false });
    bookingDetails={};
    if(result.verified){
      const profile = await companies.company.findOne({email:user.email});
      if(!profile){
        res.redirect('/custom/customSearch')
        return
      }
      const activtariff = await tariff.loadtariff('');
      const activePlans = await checkinPlans.LoadPlan();
      let existingTariff = profile.roomtypes;
      let existingPlan = profile.checkinplan;
      const availablerooms =await rooms.loadroomByCompanyId(profile.CompanyID);
      const floors = await floorMaster.loadAllFloor()
      const category = await tariffmaster.loadtariff('')

      

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
    if (!availablerooms )availablerooms={};
    let  reservation = await checkinmaster.loadReservationbyCompany(profile.CompanyID)         
    if(!reservation)reservation ='';
    let payments = await payment.loadPaymentByCompanyID(profile.CompanyID)
    if(!payments)  payments='';
    let occupancyDetails = await reception.loadIndividualBookingByCompany(profile.CompanyID);
   if(!occupancyDetails) occupancyDetails='';
  res.render('companyhomePage', { user, tariffPackages, profile, inputs,Plans,availablerooms,floors,category,reservation,payments,occupancyDetails });
  }
    else{
      res.redirect('/')
    }
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }

} 
const postsaveTariff = async (req, res) => {
  try {
    
  const user = await HBank.HumanResource.findOne({activeSession: req.sessionID, deleted: false });
  const profile = await companies.company.findOne({email:user.email});
  const newRoomType = {
    tariffName: req.body.tariffName,
    tariffIndex: req.body.tariffIndex,
    roomRentSingle: parseInt(req.body.roomRentSingle),
    extraPerson: parseInt(req.body.extraPerson),
    tax: parseInt(req.body.tax),
    includeChild: req.body.includeChild,
    defaultCheckinplan: req.body.defaultCheckinplan,
    Discription: req.body.Discription,
    username: req.body.username,
    SpecialRent: parseInt(req.body.specialRent),
    deleted: false
  };
  let result
    
  if (!newRoomType.tariffIndex) {
    newRoomType.tariffIndex = await controller.getIndex('TARIFF');
    result = await companies.company.updateOne(
      {
        CompanyID: req.body.CompanyID
      },
      {
        $push: { roomtypes: newRoomType }
      },
      {
        upsert:true
      }
    ); 
      
    await tariffmaster.tariff.updateOne(
        { tariffIndex: newRoomType.tariffIndex },
        newRoomType,
        { upsert: true }
      );
  
      } else {
     result = await companies.company.updateOne(
      {
        CompanyID: profile.CompanyID,
        'roomtypes.tariffIndex': newRoomType.tariffIndex
      },
      {
        $set: { 'roomtypes.$': newRoomType,
      
      }  
      },
       
    );
  }
   
    let response = {};
    if (result.modifiedCount > 0) {
      response = { update: true };
    } else if (result.upsertedCount > 0) {
      response = { saved: true };
    } else {
      response = { matched: true };
    }
    res.json(response);
  } catch (error) {
    console.log(error);
  }
} 
const postdisableTariff = async (req,res)=>{
  try {
    
  const result = await companies.company.updateOne(
    {CompanyID:req.body.CompanyID,
      'roomtypes.tariffIndex': req.body.tariffIndex
    },
    {
      $set:{"roomtypes.$.isActive":false
      
      }
    }
  )
  
 let responce ={}
 if(result.modifiedCount>0) responce={update:true} 
 else if(result.upsertedCount>0) responce={saved:true}
 else if(!result.upsertedCount && result.matchedCount && result.modifiedCount ) responce={matched:true} 
 res.json(responce)
  
  } catch (error) {
  console.log(error);  
  }
} 
const postenableTariff = async (req,res)=>{
  try {
    
  const result = await companies.company.updateOne(
    {CompanyID:req.body.CompanyID,
      'roomtypes.tariffIndex': req.body.tariffIndex
    },
    {
      $set:{"roomtypes.$.isActive":true
      }
    }
  )
 let responce ={}
 if(result.modifiedCount>0) responce={update:true} 
 else if(result.upsertedCount>0) responce={saved:true}
 else if(!result.upsertedCount && result.matchedCount && result.modifiedCount ) responce={matched:true} 
 res.json(responce)
  } catch (error) {
    console.log(error);
  }
} 
const postdeletetariffPermanent = async (req,res)=>{
try {
  
  const result = await companies.company.updateOne(
    {CompanyID:req.body.CompanyID,
      'roomtypes.tariffIndex': req.body.tariffIndex
    },
    {
      $set:{"roomtypes.$.deleted":true
      
      }
    }
  )
  
 let responce ={}
 if(result.modifiedCount>0) responce={update:true} 
 else if(result.upsertedCount>0) responce={saved:true}
 else if(!result.upsertedCount && result.matchedCount && result.modifiedCount ) responce={matched:true} 
 res.json(responce)
} catch (error) {
  console.log(error);
}
} 
const postsavePlanToCompanies = async(req,res)=>{
 try {
  
  const addToComp = await companies.insertNewCheckinPlan(req.body)
  res.json(addToComp)
 } catch (error) {
  console.log(error);
 }  
   
} 
const postactivatePlan = async (req,res)=>{
 try {
  const result = await companies.activateCheckinplan(req.body);
  res.json(result);
 } catch (error) {
  console.log(error);
 }
} 
const getloadtariff  = async (req, res) => {
try {
  
  const inputs = req.body;
  const userlogrecord = {
    username: req.body.Username,
    sessionId: req.sessionID,
    folder: req.path,
    method: req.method,
    loggedOut: false,
    ip: req.ip,
  };
   
  req.body.session = req.sessionID;
  const result =await HBank.verifyUser(req.body)   
   
  const user = result.userdetails;
  bookingDetails={};
if(result.verified){
    const profile = await companies.company.findOne({email:req.body.userName});
    if(!profile){
      res.redirect('/custom/customSearch')
      return
    }
    const activtariff = await tariff.loadtariff('');
    const activePlans = await checkinPlans.LoadPlan();
    let existingTariff = profile.roomtypes;
    let existingPlan = profile.checkinplan;
    const availablerooms =await rooms.loadroomByCompanyId(profile.CompanyID);
    const floors = await floorMaster.loadAllFloor()
    const category = await tariffmaster.loadtariff('')
    let Plans = existingPlan.filter(item1=>
    activePlans.some(item2=>item2.planIndex ==item1.planIndex)); 
   
    let tariffPackages = existingTariff.filter(item1 =>
    activtariff.some(item2 => item2.tariffIndex === item1.tariffIndex)
    );

    if(Plans.length<1){
      Plans = await checkinPlans.LoadPlan()
      Plans.map(async (element)=>{
        element.activated = false;
        await companies.company.updateOne(
          {CompanyID:profile.CompanyID},
          {$push:{"checkinplan":element}},
          {upsert:true}
          );
      });
    }

   if (tariffPackages.length < 1) {
      tariffPackages = await tariff.loadtariff('')
      const tariffPromises = tariffPackages.map(async (element) => {
      element.activated = false;
      const tempTariff = await companies.company.updateOne(
        { CompanyID: profile.CompanyID },
        { $push: { "roomtypes": element } },
        { upsert: true }
      );
     });
    await Promise.all(tariffPromises);
   }
  else {
   }
  res.cookie('userName',req.body.userName)
  if (!availablerooms )availablerooms={};
  res.render('companyhomePage', { user, tariffPackages, profile, inputs,Plans,availablerooms,floors,category });
  
}
else{
  res.redirect('/')
}
  

} catch (error) {
  console.log(error);
}

} ;



module.exports = {getRoot,postaddoccupancy,postunlinkRoom,postupdateReservationWithRoom,postloadAvailableRooms ,getloadhomepage,postloadhomepage,postsaveTariff
,postdisableTariff,postdeletetariffPermanent,postsavePlanToCompanies,postactivatePlan,getloadtariff,postenableTariff};