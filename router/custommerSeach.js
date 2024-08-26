const express = require('express')
const router = express.Router();
const companies = require('../model/company')
const tariffs = require('../model/tariff')
const checkinplans = require('../model/planMaster')
const customSearch = require('../controller/custommerSeach')

router.post('/loadHotelDetails',customSearch.postloadHotelDetails);
router.post('/loadHotelBasedResult',customSearch.postloadHotelDetails);
router.get('/Home',customSearch.getHome)
router.get('/',customSearch.getRoot)   
router.post('/viewReservation',customSearch.postviewReservation)
router.post('/confirmBooking',customSearch.postconfirmBooking)
router.post('/customSearch',customSearch.postcustomSearch)
router.get('/customSearch',customSearch.getcustomSearch)
router.use('/TariffSearch',async (req,res)=>{
    
    const generalData = await companies.SearchCompany('')
    const tariff = await tariffs.loadtariff('')
    let district = new Set();
  
    const pincode = generalData.forEach(element => {
        district.add(element.district )
    });
       
    let result = await tariffs.loadtariffWithAny(req.body);
    result = result[0]
    
    const tariffDetails= result.tariff

     
    const inputData = req.body
    res.render('companyWiseDetails',{inputData,generalData,tariff,result,district,tariffDetails});
     
})
router.use('/loadPlans',async(req,res)=>{
    
    plans = await checkinplans.LoadPlan();
    
    res.json(plans);
})


module.exports = router;