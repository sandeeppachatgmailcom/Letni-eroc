const express = require('express')
const router = express.Router();
const midware = require('../middleware/multer')
const companies = require('../model/company')
const tariffs = require('../model/tariff')
const checkinplans = require('../model/planMaster')
const ejs = require('ejs')
const human = require('../model/humanbank')
const controller = require('../controller/adminController')
const ftnReservation = require('../controller/ftnReservation');
 
const payments = require('../model/payments')
   
router.post('/viewReservation',async (req,res)=>{
    let temp = req.body.bookingDetails.split(',');
    let extrapax =parseInt(req.body.guestCount)- parseInt(req.body.roomCount*2)
    if (extrapax<0) extrapax=0  
    const BookingSummary={
     totalRoom : req.body.roomCount,
     totalGuest : req.body.guestCount,
     extraPax:extrapax,
     companyID : temp[0],
     tariffIndex : temp[1],
     arrivalDate : temp[2],
     arrivalTime: temp[2].split('T')[1],
     departureDate : temp[3],
     departureTime: temp[3].split('T')[1],
     totalDays:controller.calculateDays(temp[2],temp[3])
}


req.body.session = req.sessionID;
const result =await human.verifyUser(req.body)  
const user = result.userdetails;

    
if(user){
    
    req.body.CompanySearchKey = temp[0];
    const company=await companies.SearchbyCompanyByAny(req.body)
    const checkinplan = company.checkinplan.filter(item => item.isActive===true);
    const tariffplans = company.roomtypes.filter(item=> item.tariffIndex===BookingSummary.tariffIndex)
     
    res.render('confirmReservation',{user,company,checkinplan,tariffplans,BookingSummary})
} 
else  {res.redirect('/')}     
})
 
router.post('/confirmBooking',(req,res)=>{
    res.json(req.body);
    let temp = req.body.bookingDetails.split(',');
    const BookingSummary={
     totalRoom : req.body.roomCount,
     totalGuest : req.body.guestCount,
     companyID : temp[0],
     tariffIndex : temp[1],
     arrivalDate : temp[2],
     departureDate : temp[3],
}

 
})

router.post('/customSearch',async (req,res)=>{
    console.log('/customSearch REACHED ');  
    let user = await human.HumanResource.findOne({activeSession:req.sessionID})
    if (!user)
    user = {};
    const generalData = await companies.SearchCompany('')
    const tariff = await tariffs.loadtariff('')
    let district = new Set();
    let  inputData = req.body;
    
    inputData.GuestCount = parseInt(inputData.GuestCount)
    inputData.nameRoomCount = parseInt(inputData.nameRoomCount)
    console.log(inputData,'inputDatainputDatainputDatainputDatainputDatainputDatainputData');
    const pincode = generalData.forEach(element => {
        district.add(element.district )
    });
        
     let result = await companies.company.find({district:{ $regex: `^${req.body.ditrictName}`, $options: 'i' },deleted:false})
        res.render('detailedSearch',{user,result,generalData,tariff,district,inputData} )
        
    
    
   
})

router.get('/customSearch',async (req,res)=>{
      
    let user = await human.HumanResource.findOne({activeSession:req.sessionID})
    if (!user)
    user = {};
    const generalData = await companies.SearchCompany('')
    const tariff = await tariffs.loadtariff('')
    let district = new Set();
     
    let  inputData = req.body;
    inputData.GuestCount = parseInt(inputData.GuestCount)
    inputData.nameRoomCount = parseInt(inputData.nameRoomCount)
   if(!inputData.GuestCount&&!inputData.nameRoomCount){
    inputData.GuestCount=2
    inputData.nameRoomCount=1
    inputData.budgetStart=0;
    inputData.budgetEnd=30000;
    inputData.roomCategoryID='';
    inputData.districtName=''
    inputData.CheckinDate = Date.now()
    inputData.CheckoutDate=Date.now()+1;
    }

    const pincode = generalData.forEach(element => {
        district.add(element.district )
    });
        
     let result = await companies.company.find({district:{ $regex: `^${req.body.ditrictName}`, $options: 'i' },deleted:false})
        res.render('detailedSearch',{user,result,generalData,tariff,district,inputData} )
 })

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

router.post('/loadHotelDetails', async (req, res) => {
    const totalRoomSummary = await ftnReservation.getRoomAvailalability(req.body.hotelId);
    const reservationSummary = await ftnReservation.getReservationDateWise(req.body.StartDate, req.body.EndDate, req.body.hotelId,totalRoomSummary );
     console.log(totalRoomSummary,reservationSummary);
    req.body.CompanySearchKey = req.body.hotelId;
    let result  = await companies.SearchbyCompanyByAny(req.body);
    result.roomtypes =  reservationSummary.roosObj
    res.json(result);
});

router.get('/Home',async (req,res)=>{
    let user = await human.HumanResource.findOne({activeSession:req.sessionID})
     
    if(!user) {
        res.redirect('/')
        return;
    }
    const reservationDetails = await ftnReservation.loadreservationByCustID(user.hrId)
    let bookingDetails = JSON.stringify(reservationDetails)
    bookingDetails = JSON.parse(bookingDetails )
     
    for(let i=0;i<bookingDetails.length;i++){
        const hotel = await companies.SearchbyCompanyByAny({CompanySearchKey:bookingDetails[i].CompanyName})
        bookingDetails[i].companyName = hotel.firstName;
        bookingDetails[i].email = hotel.email;
        bookingDetails[i].contactNumber = hotel.contactNumber;
        bookingDetails[i].BuildingName = hotel.BuildingName;
        bookingDetails[i].StreetName = hotel.StreetName;
        bookingDetails[i].district = hotel.district;
        bookingDetails[i].image1 = hotel.image1;
        bookingDetails[i].companyName = hotel.firstName;
        const checkinPlan = await checkinplans.LoadPlanByID(bookingDetails[i].CheckinPlan)
        const tariffDetails = hotel.roomtypes;
        const payment = await payments.payment.findOne({paymentReferance:bookingDetails[i].reservationNumber,custommerId:user.hrId,entryType:"Dr"})
            
        if(payment){ 
            bookingDetails[i].transactionReferanceNumber = payment.transactionReferanceNumber
            bookingDetails[i].receiptNumber=payment.receiptNumber
            bookingDetails[i].accountHead=payment.accountHead
            }
        
         
         
        if(checkinPlan){
            bookingDetails[i].checkinPlanName = checkinPlan.planName;
            bookingDetails[i].CheckinPlanmaxPax = checkinPlan.maxPax;
            bookingDetails[i].CheckinPlanextraCharge = checkinPlan.extraCharge;
            bookingDetails[i].CheckinPlandiscription = checkinPlan.discription;
            bookingDetails[i].CheckinPlanamount = checkinPlan.amount;

            for(let k=0;k<tariffDetails.length;k++){
                 if(bookingDetails[i].tariff==tariffDetails[k].tariffIndex ){
                    bookingDetails[i].tariffName = tariffDetails[k].tariffName;
                    bookingDetails[i].roomRentSingle = tariffDetails[k].roomRentSingle;
                    bookingDetails[i].extraPerson = tariffDetails[k].extraPerson;
                    bookingDetails[i].Discription = tariffDetails[k].Discription;
                    bookingDetails[i].SpecialRent = tariffDetails[k].SpecialRent;
                }
             }
            
 
             
        }
        
    }
    
    const paymentHistory=null;
     

    res.render('custommerHomePage',{user,bookingDetails,paymentHistory})
})


module.exports = router;