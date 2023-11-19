const express = require('express')
const router = express.Router()
const Hbank = require('../functions/humanbank')
const access = require('../functions/formAccess') 
const multer = require('multer') 
const verifyAccess = require('../middleware/userAccess')
const companies = require('../functions/company')
const ctrlCompany = require('../controller/company')
const tariffs = require('../functions/tariff')


const getRoot = async (req, res) => {
    try {
        req.body.session = req.sessionID;
        const result  =  await Hbank.verifyUser(req.body)
        let user =''
         
        if(result.userdetails){
          user ={firstName : result.userdetails.firstName}
        }
        const  comp =await  ctrlCompany.loadActivecompanies()
        const generalData = await companies.SearchCompany('')
        const tariff = await tariffs.loadtariff('')
        let district = new Set();
        const pincode = generalData.forEach(element => {
            district.add(element.district )
        });
        const pagename ='custommerPage'; 
        res.cookie('page',pagename)
            res.render(pagename,{user,district,tariff,generalData,comp })
    }
    catch (err) { console.log(err.message) }

} 

module.exports = {getRoot}