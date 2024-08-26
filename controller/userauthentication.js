const cookie = require('cookie-parser');
const { Document } = require('mongoose');
const memoryCache = require('memory-cache');
const express = require('express');
const router = express.Router();
const session = require('express-session');
const HBank = require('../functions/humanbank');
const userlog = require('../functions/userlog')
const ActiveID = require('../functions/userlog')
const OTPValidate = require('../controller/OtpValidation')
const jwt = require("jsonwebtoken")
const pincode = require('../functions/pincode')
const companies = require('../functions/company')
const controller = require('../controller/adminController')
const tariffs = require('../functions/tariff')
const nodeMailer = require('nodemailer')
const randomString = require('randomstring') 
const validation = require('../model/otpvalidation')
const email = require('../controller/emailService')
const server = 'http://localhost:5200/Images/';

const getRoot = (req,res)=>{
    try {
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
} 
const posthotelLogin = async (req,res)=>{try {
    
        req.body.session = req.sessionID; 
        req.body.path = req.path;
        console.log(req.path,'pathththth');
        const result =await HBank.verifyUser(req.body);
        console.log(result);
        result.path = '/vedurehomepage/loadhomepage'
        res.json(result)
} catch (error) {
    console.log(error);
}
} 
async function findUser(sessionID) {
   try {
     const activeUser = await ActiveID.UserLog.findOne({ sessionId: sessionID, loggedOut: false }, { username: 1, _id: 0 })
     
     return activeUser
   } catch (error) {
    console.log(error);
   }
}
async function userSessionAuthentication(sessionID, username, password) {
    try {
        const SessionExist = await userlog.UserLog.findOne({ sessionId: sessionID });
        if (SessionExist) {
            const existUser = SessionExist.username;
            if (existUser != username) {
                return false
            }
            else {
                return true
            }
        }
        else {
        }
    } catch (error) {
        console.log(error);
    }
}
const postcustFetchLogin = async (req,res)=>{
    try {
        req.body.session = req.sessionID;
        const verified =await HBank.verifyUser(req.body)
        if(verified.otp){
            res.render('otp',{verified})
            return
        }
        const user={
            firstName:verified.user,
        }
        if (verified.verified){
            res.cookie('username',verified.user)
        }
        res.json(verified)
    } catch (error) {
        console.log(error);
    }
    
}
 
const postcustLogin = async (req,res)=>{
    try {
        req.body.session = req.sessionID;
    
        const verified =await HBank.verifyUser(req.body)
        if(verified.otp){
            res.render('otp',{verified})
            return
        }
        
        let  user=''
        if(verified.userdetails){user ={firstName : verified.userdetails.firstName}}
        if (verified.verified){
            
            res.cookie('username',verified.user)
        
        req.body.ditrictName='';
        req.body.roomCategoryID='';
        req.body.budgetStart=0;
        req.body.budgetEnd=30000;
        const generalData = await companies.SearchCompany('')
        const tariff = await tariffs.loadtariff('')
        let district = new Set();
        const inputData = req.body;
        const pincode = generalData.forEach(element => {
            district.add(element.district )
        });
         const result =await companies.company.find({district:{ $regex: `^${req.body.ditrictName}`, $options: 'i' },deleted:false,
         "roomtypes.tariffIndex": { $regex: `^${req.body.roomCategoryID}`, $options: 'i' },
         "roomtypes.SpecialRent":{$gte:req.body.budgetStart},
         "roomtypes.SpecialRent":{$lte:req.body.budgetEnd}})
        res.render('detailedSearch',{user,result,generalData,tariff,district,inputData} )
    }
     
    else res.redirect('/')
    } catch (error) {
        console.log(error);
    }
}


const getcustLogin = async (req,res)=>{
  try {
      req.body.session = req.sessionID;
  
      const verified =await HBank.verifyUser(req.body)
      let  user=''
      if(verified.userdetails){user ={firstName : verified.userdetails.firstName}}
      if (verified.verified){
          res.cookie('username',verified.user)
      }
      req.body.ditrictName='';
      req.body.roomCategoryID='';
      req.body.budgetStart=0;
      req.body.budgetEnd=30000;
      const inputData = req.body;
      const currentDateTimeString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
      const month = currentDateTimeString.slice(0, 2);
      const day = currentDateTimeString.slice(3, 5);
      const year = currentDateTimeString.slice(6, 10);
      const time = currentDateTimeString.slice(12, 23);
      let [hour, minute, secAndPeriod] = time.split(':');
      const [sec, period] = secAndPeriod.split(' ');
      if(hour.length==1)hour = '0'+hour;
      if (period == 'PM') hour =  parseInt(hour) + 12;
      const mytime = year+'-'+month+'-'+day+'T'+hour+':'+minute
      console.log( typeof( mytime),typeof(new Date().toISOString().slice(0,16)))
      console.log(   mytime ,new Date().toISOString().slice(0,16))
      if(!inputData.CheckinDate) inputData.CheckinDate = mytime
      if(!inputData.CheckoutDate) inputData.CheckoutDate =  mytime
      if(!inputData.GuestCount) inputData.GuestCount='1'
      if(!inputData.nameRoomCount) inputData.nameRoomCount='1'
      if(!inputData.budgetStart) inputData.budgetStart=0
      if(!inputData.budgetEnd) inputData.budgetEnd=10000
      
      const generalData = await companies.SearchCompany('')
      const tariff = await tariffs.loadtariff('')
      let district = new Set();
      
      const pincode = generalData.forEach(element => {
          district.add(element.district )
      });
       const result =await companies.company.find({district:{ $regex: `^${req.body.ditrictName}`, $options: 'i' },deleted:false,
       "roomtypes.tariffIndex": { $regex: `^${req.body.roomCategoryID}`, $options: 'i' },
       "roomtypes.SpecialRent":{$gte:req.body.budgetStart},
       "roomtypes.SpecialRent":{$lte:req.body.budgetEnd}})
      res.render('detailedSearch',{user,result,generalData,tariff,district,inputData} )
  } catch (error) {
    console.log(error);
  }
} 
const postOtpAuthentication = async (req, res) => {
    try {
        
        let result = await OTPValidate.validateOtp(req.body.email, req.body.otp);
        if ((result.modifiedCount + result.upsertedCount) > 0) { result = { Verified: true } }
        else { result = { Verified: false } }
        
        res.json(result)
    } catch (error) {
        console.log(error);
    }
     
} 
const postlogout =  async (req, res) => {
    try {
        req.body.session = req.sessionID
        const source = req.get('Referer').split('/')[3];  
        console.log(source,'sourcesourcesourcesource');
        const verifyaccount = HBank.verifyUser(req.body)
        console.log(verifyaccount); 
        let logout= await HBank.HumanResource.updateOne({activeSession:req.sessionID},{$set:{activeSession:null}})
        if(logout.modifiedCount){
            logout={
                logout:true,
                path:'/'+source
            }
        }
        else{
            logout={
                logout:false
            }
        }
        res.clearCookie('username');
        res.clearCookie('userName');
        res.clearCookie('connect.sid');
        req.session.destroy();
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.json(logout)
    } catch (error) {
        console.log(error);
    }
} 
const postfindUser = async (req, res) => {
    try {
        const user = await findUser(req.sessionID);
        
        res.json(user)
    } catch (error) {
        console.log(error);
    }
} 
const postvendurelogin = async (req, res) => {
  try {
      const userlogrecord = {
          username: req.body.Username,
          sessionId: req.sessionID,  
          folder: req.path, 
          method: req.method,
          loggedOut: false,
          ip: req.ip
      }
      const posted = await userlog.UserLog.updateOne({ sessionId: req.sessionID }, { $set: userlogrecord }, { upsert: true })
      let  result = await HBank.HumanResource.findOne({$or:[{ email: req.body.Username, password: req.body.Password,deleted: false },{ contactNumber: req.body.Username, password: req.body.Password,deleted: false }]}, { username: 1, _id: 0,email:1})
      if (result){ result = JSON.stringify(result);}
      //else result=null;
       reply = { Verified: false };
      if (result) {
          reply = { Verified: true }
          const token = jwt.sign(JSON.parse(result), 'PassKey', { expiresIn: 10 })  
          req.session.headers=token;
      }
      else { reply = { Verified: false } }
      res.cookie('username', req.body.userName)
      res.json(reply)
  } catch (error) {
    console.log(error);
  }
     
} 
const postlogin= async (req, res) => {
  try {
      
      const userlogrecord = {
          username: req.body.Username,
          sessionId: req.sessionID,  
          folder: req.path, 
          method: req.method,
          loggedOut: false,
          ip: req.ip
      }
      req.body.session = req.sessionID; 
      const result =await HBank.verifyUser(req.body);
       
       
      if (result.verified) {
          //const token = jwt.sign(JSON.parse(result), 'PassKey', { expiresIn: 30 }) //jwt tocken implemented here 
          //req.session.headers=token;
      }
      res.cookie('userName', req.body.userName)
      res.json(result)
  } catch (error) {
    console.log(error);
  }
     
} 
const postverifyUsenameWithPassword =async (req,res)=>{
  try {
      req.body.session = req.sessionID;
      req.body.path= req.path
      console.log(req.path,req.body)
      const result =await HBank.verifyUser(req.body)
      console.log(result,'result')
      res.json(result)
  } catch (error) {
    console.log(error);
  }
} 
const postchangePassword = async (req,res)=>{
   try {
     const result =await HBank.changePassword(req.body);
     console.log(result); 
     let responseData = false;
     if(result){
 
          responseData= {updated:true} 
      }
      else {
          responseData= {updated:false} 
      }
      res.json(responseData);
     
   } catch (error) {
    console.log(error);
   }
} 
const postVerifyEmail =async(req,res)=>{
   try {
      console.log(req.path);
      const result = await HBank.HumanResource.findOne({email:req.body.email,Active:true})
      console.log(result,'result')
      let responseData = false;
      if(result){
          if(req.body.path=='/VerifyEmail'){
             responseData= {verified:true}
          }
          else responseData= {verified:true} 
      }
      else {
         if(req.body.path=='/VerifyEmail'){
             responseData= {verified:false}
          }
          else responseData= {verified:false} 
      }
      console.log(responseData);
      res.json(responseData);
   } catch (error) {
    console.log(error);
   }
} 
const postverifyPhone= async (req,res)=>{
       
     try {
         const result = await HBank.HumanResource.findOne({contactNumber:req.body.phone})
         let responseData = false;
         if(result){
            responseData={verified:true}
         }
         else{
            responseData={verified:false}
         }
         res.json(responseData);
    
     } catch (error) {
        console.log(error);
     }
 } 
const postverifyUser= async (req,res)=>{
     try {
        const result = await HBank.HumanResource.findOne({username:req.body.username})
         
        let responseData = false;
         if(result){
            responseData={verified:true}
         }
         else{
            responseData={verified:false}
         }
         res.json(responseData);
     } catch (error) {
        console.log(error);
     }
 
 
 } 
const postauthenticatelogin=  async(req,res)=>{
    try {
        
       const result = await HBank.HumanResource.findOne({username:req.body.username , password:req.body.password})
         
        if(result){
           res.json({Verified:true})
        }
        else{
           res.json({verified:false})
        }
    } catch (error) {
        console.log(error);
    }
 } 
const postsignup = async (req, res) => {
   
    try {
        try {
            let transporter =await nodeMailer.createTransport({
                service: "gmail",
                auth: {
                    user: 'sandeeppachat@gmail.com',
                    pass: 'pjwh gfdx ybus veui'
                }
            })
            const otp =await randomString.generate({
                length: 6,
                charset: 'numeric',
            });
            let randomOtp = otp
            const mailOptions = {
                from: 'sandeeppachat@gmail.com', // Sender email
                to: req.body.email, // Recipient email
                subject: 'OTP Verification Code',
                text: `Your OTP is: ${otp}`,
            };
       
            const resultotp = await validation.Otp.updateOne({authorisationname:req.body.email},{$set:{sessionId:req.sessionID,authorisationname:req.body.email,otp:otp,verified:false}},{upsert:true} )
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                        
                } else {
                    res.json({otp:true})
                }
            });
    
            
            const hrid = await controller.getIndex('humanBank');
            const hashedPassword = await controller.encryptPassword(req.body.password) 
            const newUser = {  
                hrId: hrid,
                firstName: req.body.firstName,
                lastName: req.body.secondName,
                contactNumber: req.body.contactNumber,
                email: req.body.email,
                username: req.body.username,
                password:hashedPassword,
                isAdmin: req.body.isAdmin,
                Active: req.body.Active,
                isloggedIn: req.body.isLoggedIn,
                deleted:false,
                profilePicture:server+hrid+'profilePicture',
                wallPappper:server+hrid+'wallPappper'
            } 
            console.log('reachd backend');    
           
            let saved = await HBank.HumanResource.updateOne({hrId: hrid},{$set:newUser},{upsert:true}) 
            console.log(newUser)    
            let result ;
            if((saved.upsertedCount+saved.modifiedCount)>0){
                result={saved: true};
            }
            else {
                result = {saved:false};
            }
            
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    } catch (error) {
        console.log(error);
    }
} 
const getsignup =  (req, res) => {
    try {
        res.render('signup');
    } catch (error) {
        console.log(error);
    }
} 
const postloadPincode =  async (req,res)=>{
try {
    const result =await pincode.loadPincode(req.body);
res.json(result)
} catch (error) {
    console.log(error);
}
} 
const postloadUserCompany = async (req,res)=>{
   try {
         
    const result =await HBank.SearchHumanbyUsername(req.body)
    
    const mobile = result[0].contactNumber;
        
    const companyList =await companies.loadHuman(mobile);
    res.json(companyList);
   } catch (error) {
    console.log(error);
   }
} 
const postconfirmOtp = async (req,res)=>{
   try {
    const result =await OTPValidate.validateOtp(req.body.email,req.body.otp,req.sessionID);
    console.log(req.body,'asaasassasasas');
    if(result.modifiedCount){
    res.json({verified:true});       
    }
    else{
        res.json({verified:false});       
    }
   } catch (error) {
    console.log(error);
   }
    
} 
const postSetOtpExpired = async (req,res)=>{
   try {
    const result =await OTPValidate.makeOTPExpired(req.body.email);
    if(result.modifiedCount){
    res.json({expired:true});       
    }
    else{
        res.json({expired:false});       
    }
    
   } catch (error) {
    console.log(error);
   }
} 
const postresendOtp = async (req,res)=>{
    try {
        console.log('reached here');
        const result =await OTPValidate.resendOtp(req.body.email,res.sessionID);
        console.log(result);
        if(result.upsertedCount){
        res.json({created:true});       
        }
        else{
            res.json({created:false});       
        }
        
    } catch (error) {
        console.log(error);
    }
} 

module.exports = {posthotelLogin,postcustFetchLogin,postresendOtp,postSetOtpExpired,postconfirmOtp,postloadUserCompany,
    postloadPincode  ,getsignup,postsignup,postauthenticatelogin,postverifyUser,postverifyPhone,postVerifyEmail,
    postchangePassword,postverifyUsenameWithPassword, postlogin,postvendurelogin,postfindUser,postlogout,postOtpAuthentication
    ,getcustLogin,postcustLogin,userSessionAuthentication,getRoot};
