const express = require('express')
const router = express.Router();
const frontDesk = require('../functions/checkIn')
const checkinPlan = require('../functions/planMaster')
const Rooms = require('../functions/rooms')
const tariffmaster = require('../functions/tariff')
const frontoffice = require('../functions/checkIn')
const floor =  require('../functions/floor')
const token = require('../middleware/jwt')
const getRoot = (req,res)=>{
  try {
      res.redirect('/admin')    
  } catch (error) {
    console.log(error);
  }
} 
const postloadfloorbypagenumber = async (req, res) => {
   try {
    req.body.session = req.sessionID;
    let user = ''
    const verify = await HBank.verifyUser(req.body)
    if (verify.verified) {
        user = verify.user;

    }
    else {
        res.redirect('/admin')
    }

    let pagenumber = req.body.index;
    const perpage = 2;
    const data = await floor.floors.find().countDocuments()
    .then(documents => {docCount = documents;
        return floor.floors.find()
        .skip((pagenumber - 1) * perpage)
        .limit(perpage)
        })
    const pagecount = await floor.floors.find()
        .countDocuments()
        .then(tcount => {
        return Math.ceil(tcount / perpage);
    })
    res.render('floor', { data, pagecount,user })
   } catch (error) {
    console.log(error);
   }
} 
const postsavefloor = async (req, res) => {
    try {
        
    let index = ''
    if (req.body.floorindex === '') { index = await getIndex('floor') }
    else index = req.body.floorindex;
    const newFloor = {
        floorname: req.body.floorname,
        floornumber: req.body.floornumber,
        floorsize: req.body.floorsize,
        username: req.body.username,
    }
    const isExit = await floor.floors.findOne({$or:[{floorname:req.body.floorname},{floornumber:req.body.floornumber},{floorindex:req.body.floorindex}]})
        console.log(isExit); 
        let saved = '';
         
            const result = await floor.floors.updateOne({ floorindex:index }, newFloor, { upsert: true });
            if (result) {
                saved = { result: 'Saved' }
            }
            else {
                saved = { result: 'false' }
            }
            if(isExit)   saved = { result: 'Updated' }
            res.json(saved)
    } catch (error) {
        console.log(error);
    }
}
const postdeleteFloor = async (req, res) => {
    try {
        const floorindex = req.body.floorindex;
     
    let result = await floor.floors.deleteOne({ floorindex: floorindex });
    if (result.acknowledged) {
        result = { deleted: true }
    }
    else {
        result = { deleted: false }
    }
    res.json(result)
    } catch (error) {
        console.log(error);
    }
}
const postsearch = async  (req,res)=>{
    try {
        
console.log('backend reached for  file search');
try {
    req.body.session = req.sessionID;
    let user = ''
    const verify = await HBank.verifyUser(req.body)
    if (verify.verified) {
        user = verify.user;

    }
    else {
        res.redirect('/admin')
    }

    const data = await floor.floors.find({$or:[{floorname:{$regex:`${req.body.searchvalue}`,$options:'i'}}]})
    console.log(data);
    const perpage = 10;
    const pagecount = await floor.floors.find({$or:[{floorname:{$regex:`${req.body.searchvalue}`,$options:'i'}}]})
    .countDocuments()
    .then(tcount => {return Math.ceil(tcount / perpage)})
    res.render('floor',{data,pagecount,user})
} catch (error) {
}
    } catch (error) {
        console.log(error);
    }
} 
const getfloors = async (req, res) => {
    try {
        
    req.body.session = req.sessionID;
    let user = ''
    const verify = await HBank.verifyUser(req.body)
    if (verify.verified) {
        user = verify.user;

    }
    else {
        res.redirect('/admin')
    }

    let docCount = 0;
    const pagenumber = 1
    const perpage = 10;
    const data = await floor.floors.find()
        .countDocuments()
        .then(documents => {
            docCount = documents;
            return floor.floors.find()
                .skip((pagenumber - 1) * perpage)
                .limit(perpage)
        }
        )
    const pagecount = await floor.floors.find()
        .countDocuments()
        .then(tcount => {
            return Math.ceil(tcount / perpage);
        }
        )
    res.render('floor', { data, pagecount,user })
    } catch (error) {
        console.log(error);
    }
} 


module.exports = {getRoot,postloadfloorbypagenumber,postsavefloor,postdeleteFloor,postsearch,getfloors};