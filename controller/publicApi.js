

const express = require('express')
const router = express.Router()
const fntcompany = require('../functions/company')
const human = require('../functions/humanbank')


const getHotels = async (req, res) => {
    console.log(req.body);
    const company = await fntcompany.company.find({ Active: true, deleted: false })
    res.json(company)
}

const postAuthUser = async (req,res)=>{
    const verified= await human.verifyUser({session:req.sessionID,
        userName:req.body.email,
        password:req.body.password} )
        console.log(req.body)
        let result ='';
        !verified?result= verified :
        result ={
            verified:verified?.verified,
            email:verified?.email,
            user:verified?.firstName,
            isAdmin:verified.userdetails?.isAdmin ,
            Wallpapper:verified.userdetails?.wallPappper,
            profilePicture:verified.userdetails?.profilePicture

        } 
res.json(result)
}

const postChangePassword = async (req,res)=>{
    let session = req.sessionID;
    if(req.body.newpassword) session=req.sessionID+Date.now();
    const verified= await human.verifyUser({session:session,
        userName:req.body.email,
        password:req.body.password} )
        if(verified.verified){
           const result =await human.changePassword({
            username:req.body.email,
            password:req.body.newpassword
        })
        if(result.modifiedCount) return res.status(200).json(
            {message:'Password Changed',
            updated:true,
            usename:req.body.email });
        }
        else return res.json(verified) 
        
}

const postCreateUser =async (req,res)=>{
    const data = {
        hrId: req.body.hrId  ,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        secondaryNumber: req.body.secondaryNumber,
        username: req.body.username,
        email: req.body.email,
        HouseNumber: req.body.HouseNumber,
        HouseName: req.body.HouseName,
        StreetName: req.body.StreetName,
        district: req.body.district,
        city: req.body.city,
        pincode: req.body.pincode,
        state: req.body.state,
        country: req.body.country,
        Active: true,
        isAdmin: req.body.isAdmin,
        married: req.body.married,
        isloggedIn: req.body.isloggedIn,
        pancard: req.body.pancard,
        adhaar: req.body.adhaar,
        dob: new Date(req.body.dob),
        marriedDate: new Date(req.body.marriedDate),
        gender: req.body.gender,
        deleted: req.body.false,
        createduser: req.body.createduser,
        systemUser: req.body.systemUser,
        activeSession:req.body.session,
        profilePicture:'/Images/'+req.body.hrId+'profilePicture',
        wallPappper:'/Images/'+req.body.hrId+'wallPappper' 
    }
    const result = await human.saveHuman(data)
    
    console.log(result)
    
    
    res.status(200).json(result)
}
const postdeteUser = async(req,res)=>{
    
   const result = await human.deleteHuman(req.body.hrId)
    console.log(result)
    res.json(result)
}

const getAllUser =async (req,res)=>{
const result =  await human.HumanResource.find({},{id:0,password:0,adhaar:0,pancard:0,activeSession:0})
console.log('hai')
res.json(result);
}

module.exports = { getHotels,postAuthUser,postChangePassword,postCreateUser,postdeteUser,getAllUser }