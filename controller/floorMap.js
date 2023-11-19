const express = require('express');
const router = express.Router();
const department = require('../functions/rooms')
const tarifftype = require('../functions/tariff')
const roomsDetails = require('../functions/rooms')
const floors = require('../functions/floor')
const HBank = require('../functions/humanbank')

const verifyAccess = require('../middleware/userAccess')

const getRoot = (req,res)=>{
  try {
    res.redirect('/admin')
  } catch (error) {
    console.log(error);
  }
} 

const getfloorMap = async (req, res) => {
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
    const rooms = await department.getRoomsWithTariffDetails();
    const tariff = await tarifftype.loadtariff('')
    const floor = await floors.loadAllFloor();
    res.render('floorMap', { rooms, tariff,floor,user })
   } catch (error) {
    console.log(error);
   }
} 

const postAggregatePage = async (req, res) => {
    
    try {
        const result = await getRoomsWithAllDetails(req.body)
        res.json(result);
    } catch (error) {
        console.log(error);
    }
} 

async function getRoomsWithAllDetails(DataObj) {


    try {
         
        const results = await roomsDetails.depart.aggregate([
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'roomIndex',
                    foreignField: 'roomIndex',
                    as: 'roomsDetail',
                }
            },
            {
                $lookup: {
                    from: 'tariffmasters',
                    localField: 'roomType',
                    foreignField: 'tariffIndex',
                    as: 'tariffMaster',
                }
            },
            {
                $match: {
                    "roomsDetail.roomIndex": {
                        $regex: new RegExp(DataObj.RoomIndex, "i")
                    },
                    "roomsDetail.floor": {
                        $regex: new RegExp(DataObj.floorIndex, "i")
                    },
                    "roomsDetail.blocked": DataObj.blocked,
                    "roomsDetail.roomType": {
                        $regex: new RegExp(DataObj.TariffIndex, "i")
                    }
                     
                }
            }

        ]);
         
        return results;
    } catch (error) {
        console.error(error);
    }
}
module.exports = {getRoot,getfloorMap,postAggregatePage,getRoomsWithAllDetails}
