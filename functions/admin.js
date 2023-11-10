
const mongoose = require('mongoose');
const db = require('./mongoose');
const adminController = require('../controller/adminController')
const humanBank = require('../model/humanbank');
const { companies } = require('../model/admin');
companies= require('../model/company') 


async function crateComapny(company){
if(!company.companyindex) {company.companyindex  = await adminController.getIndex('company')}
const exist  = await companies.companies.find( {$or:[{companyName:company.companyName},{gstIn:company.gstIn},{contactNumber:company.contactNumber},
    {email:company.email},{website:company.website}]}) 

if(exist){
    return {exist:true}
}  
else{
const data = {
companyindex:company.companyindex,
companyName:company.companyName,
gstIn:company.gstIn,
RoomNo:company.RoomNo,
streetName:company.streetName,
areaName:company.areaName,
cityName:company.cityName,
district:company.district,
state:company.state,
email: company.email ,
contactNumber:company.contactNumber,
website:company.website, 
Banner:company.Banner}
}
    const save = await companies.companies.updateOne({companyindex:company.companyindex},{$set:data},{upsert:true}) 
    console.log(save);
    if (save.modifiedCount>0){
        return {edited:true}
    }
    else if(save.upsertedCount>0){
        return {Saved:true}
    }
    else return{nothing:true}
}


async function deleteComapny(company){
    if(company.companyindex) {company
        const deleted = await companies.companies.updateOne({companyindex:company.companyindex},{$set:{deleted:true}}) 
        console.log(deleted);
        if (deleted.modifiedCount>0){
            return {deleted:true}
        }
        else if(save.upsertedCount>0){
            return {Saved:true}
        }
        else return {nothing:true}
    }
    
}
async function loadComapny(company){
        const company = await companies.companies.find({companyName:{$regex:`^${company.searchKey}`,$options:'i'},deleted:false}  )  
        console.log(company);
        if(company) {
            return company;
        }
        else { return {result:false}}
    }
     
const company = companies.company;
module.exports ={company,loadComapny,deleteComapny,crateComapny}
