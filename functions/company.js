const mongoose = require('mongoose')
const db = require('../model/mongoose')
const modelcompany = require('../model/company')
const rooms = require('../model/rooms')
const  loadtariff  = require('./tariff');
const controller = require('../controller/adminController')
const checkinPlans =require('../functions/planMaster')
const document = require('../model/documents')
 

async function  getCompanySummary(){
const allcompany = await modelcompany.company.find({deleted:false})
const allrooms = await rooms.depart.find({deleted:false})

let summary = []
allcompany.map( (async hotel=>{
    const roomTypes = hotel.roomtypes;
    const plans = hotel.checkinplan;
    const activeroomTypes = roomTypes.filter(item=> item.isActive==true) 
    const activePlans = plans.filter(item=> item.isActive==true)
    const ActiveRooms = allrooms.filter(room=> room.companyIndex==hotel.CompanyID )
     
    const data ={
        companyId:hotel.CompanyID,
        firstName : hotel.firstName ,
        email:hotel.email,
        active:hotel.Active,
        contactNumber :hotel.contactNumber,
        activeTariff : activeroomTypes.length,
        activePlans: activePlans.length ,
        totalRooms : ActiveRooms.length
    }
    summary.push(data)
}))  
 
return summary
}
async function changeCompanyActiveNot(reqObj){
    let result ={
        active:false,
        message:''
    }
const Active =  await modelcompany.company.findOne({CompanyID:reqObj.CompanyID},{_id:0,Active:1})
 
if(Active.Active){
    const update  = await modelcompany.company.updateOne({CompanyID:reqObj.CompanyID},{$set:{Active:false}})
        result.active=false  
        result.message= 'company deactivated'
}
else{
    const update = await modelcompany.company.updateOne({CompanyID:reqObj.CompanyID},{$set:{Active:true}})
        result.active=true  
        result.message= 'company Activated'
}
 
return result;
}
const company = modelcompany.company;
 

async function saveCompany(objcompany) {
    if (!objcompany.CompanyID) { objcompany.CompanyID = await controller.getIndex('COMPANY') }
     
    if(objcompany.imagearray[0]==""){objcompany.imagearray[0] =await company.findOne({ CompanyID: objcompany.CompanyID }, { image1: 1, _id: 0 })}
    if(objcompany.imagearray[1]==""){objcompany.imagearray[1] =await company.findOne({ CompanyID: objcompany.CompanyID }, { image2: 1, _id: 0 })}
    const data = {
        CompanyID:objcompany.CompanyID,
        firstName:objcompany.firstname,
        lastName:objcompany.lastName,
        contactNumber:objcompany.contactNumber,
        secondaryNumber:objcompany.secondaryNumber,
        email:objcompany.email,
        buildingNumber:objcompany.buildingNumber,
        BuildingName:objcompany.BuildingNameName,
        StreetName:objcompany.StreetName,
        district:objcompany.district,
        city:objcompany.city,
        pincode:objcompany.pincode,
        state:objcompany.state,
        country:objcompany.country,
        Active:objcompany.Active,
        isloggedIn:objcompany.isloggedIn,
        pancard:objcompany.pancard,
        RegisteredDate:objcompany.RegisteredDate,
        deleted:objcompany.deleted,
        createduser:objcompany.createduser ,
        image1:objcompany.CompanyID+'image1',
        image2:objcompany.CompanyID+'image2',
        image3:objcompany.CompanyID+'image3',
        Companydiscription:objcompany.Companydiscription
       } 
   
    const result = await modelcompany.company.updateOne({ CompanyID: objcompany.CompanyID }, { $set: data }, { upsert: true })
    return result;
    
}

async function SearchCompany(SerchKey) {
    const data = await modelcompany.company.find({firstName: { $regex: `^${SerchKey}`, $options: 'i' }, deleted: false,Active:true },{_id:0})
    return data
}

async function combiSearchCompany(searchValues) {
    const data = await modelcompany.company.find({
        contactNumber: { $regex: `^${searchValues.contactNumber}`, $options: 'i' },
        firstName: { $regex: `^${searchValues.firstName}`, $options: 'i' },
        email: { $regex: `^${searchValues.email}`, $options: 'i' }, deleted: false
    })
    return data
}

async function deleteCompany(CompanyID) {
    const result = await modelcompany.company.updateOne({ CompanyID: CompanyID }, { $set: { deleted: true } }, { upsert: true })
    return result
}
async function loadHuman(contactNumber) {
    const result = await modelcompany.company.find({ contactNumber: contactNumber, deleted: false })
    return result   
}
async function SearchbyCompanyByAny(SerchKey) {
    const data = await modelcompany.company.findOne({$or:[{firstName: {$regex: `^${SerchKey.CompanySearchKey}`, $options: 'i' }},{CompanyID: { $regex: `^${SerchKey.CompanySearchKey}`, $options: 'i' } },{contactNumber: { $regex: `^${SerchKey.Username}`, $options: 'i' } }]})
    return data

}
async function insertNewCheckinPlan(planobj){
    
    let checkinplan={
        planIndex:planobj.planIndex,
        planName:planobj.planName,
        shortName:planobj.shortName,
        maxPax:planobj.maxPax,
        amount:planobj.amount,
        extraCharge:planobj.extraCharge,
        user:planobj.user,
        LastUpdate:Date.now(),
        discription:planobj.discription,
        deleted:false
    }
    let  result ;
    if (planobj.planIndex){
     result = await modelcompany.company.updateOne({CompanyID:planobj.CompanyID,"checkinplan.planIndex":planobj.planIndex}
    ,{$set:{
        'checkinplan.$':checkinplan}
    })
    }
    else {
         
        checkinplan.planIndex = await controller.getIndex('CheckinPlan');
        const ogplans = await checkinPlans.saveCheckinPlan(checkinplan);
        result =  result = await modelcompany.company.updateOne({CompanyID:planobj.CompanyID}
        ,{$push:{
             checkinplan:checkinplan}
        })
    }
 
let response = {};
    if (result.modifiedCount > 0) {
      response = { update: true };
    } else if (result.upsertedCount > 0) {
      response = { saved: true };
    } else {
      response = result;
    }
    return response ;
 
}
async function activateCheckinplan(planobj){
    const exist = await modelcompany.company.findOne({CompanyID:planobj.companyId,"checkinplan.planIndex":planobj.planIndex},{"checkinplan.$":1,_id:0}) 
    console.log(planobj,'planobjplanobjplanobj',exist.checkinplan[0],'existexistexist');
    let result ;
    if (exist.checkinplan[0].isActive) {
         
     result =await modelcompany.company.updateOne({CompanyID:planobj.companyId,"checkinplan.planIndex":planobj.planIndex},
        {$set:{
            "checkinplan.$.isActive":false
        }})
    }else if (!exist.checkinplan[0].deleted)  {
         
        result =await modelcompany.company.updateOne({CompanyID:planobj.companyId,"checkinplan.planIndex":planobj.planIndex},
        {$set:{
            "checkinplan.$.isActive":true
        }})    

}
 
let response = {};
    if (result.modifiedCount > 0) {
      response = { update: true };
    } else if (result.upsertedCount > 0) {
      response = { saved: true };
    } else if (!result.modifiedCount && !result.upsertedCount &&  result.matchedCount){
      response = { matched: true };
    }
    return response ;
}
 
module.exports = {company,getCompanySummary,changeCompanyActiveNot , company, SearchCompany, saveCompany, deleteCompany, combiSearchCompany,loadHuman,SearchbyCompanyByAny,insertNewCheckinPlan, activateCheckinplan };


