const express = require('express')
const router = express.Router(); 
const clearCache = require('../middleware/userAccess')
const ImageDoc = require('../router/documentMaster')
const userAuthentic = require('../router/userauthentication')
const personalProfile = require('../router/userprofile')
const frontDesk = require('../router/frontDesk')
const rooms = require('../router/rooms')
const hbank = require('../router/human') 
const floorMaster = require('../router/floorMaster')
const roomcat = require('../router/tariff')
const CheckinPlan = require('../router/checkinPlan')
const floorMap = require('../router/floorMap') 
const userfacilty = require('../router/facility')
const DocumentUpload = require('../router/DocumentUpload')
const company = require('../router/company')
const customSearch = require('../router/custommerSeach')
const hotelshomePage = require('../router/hotelHomePage')
const reservation = require('../router/reservation')
const admin = require('../router/admin')
const root = require('../router/root')
const public = require('../router/public')




router.use(clearCache.clearCache);

router.use('/user',personalProfile)
router.use('/admin',admin)
router.use('/public',public)

router.use('/checkin',frontDesk)
router.use('/frontOffice',frontDesk)
router.use('/rooms',rooms)
router.use('/authenticate',userAuthentic)
router.use('/admincontroller',userAuthentic)
router.use('/Human',hbank)
router.use('/floorMaster',floorMaster)
router.use('/roomType',roomcat)
router.use('/checkinplan',CheckinPlan)
router.use('/floorMap',floorMap)
router.use('/facilty',userfacilty)
router.use('/DocumentUpload',DocumentUpload)
router.use('/Company',company)
router.use('/custom',customSearch)
router.use('/vedurehomepage',hotelshomePage)
router.use('/hotel',hotelshomePage)
router.use('/reservation',reservation)
router.use('/imageDoc',ImageDoc)
router.use('/' ,root) 












module.exports=router;
