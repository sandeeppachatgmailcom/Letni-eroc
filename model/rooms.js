const mongoose = require('mongoose');
const db = require('./mongoose');
const adminController = require('../controller/adminController')
const floor = require ('../model/floor')
const tariff = require('../model/tariff')
const hBank = require('../model/humanbank')


const newRoom = new mongoose.Schema({
        roomNumber:{type:Number,required:true},
        roomIndex:{type:String,required:true},
        roomName:{type:String,required:true},
        companyIndex:{type:String,required:true},
        roomiMages:[String], 
        floor:{type:String,required:true},
        interCom:{type:String,required:true},
        size:{type:Number,required:true,default:0},
        roomType:{type:String,required:true },
        blocked:{type:Boolean,default:true},
        deleted:{type:Boolean,default:false},
        status:{type:String,default:'V'},
        userCreated:{type:String,required:true},
        timeStamp:{type:String,required:true,default:Date.now()},
        maxOccupancy:{type:Number,required:true,default:0},
        NormalOccupancy:{type:Number,required:true,default:0},
        minimumPax:{type:Number,required:true,default:0},
        guestId:{type:String},
        checkinId:{type:String},
        billing:{type:Boolean,default:false},
        rentOut:{type:Boolean,default:false},
        dirty:{type:Boolean,default:false}
},
{index:[{roomIndex:'combined_index',fields:['roomNumber','companyIndex'],unique:true}]})

const depart= db.model('ROOMS',newRoom);
async function loadrooms(RoomNumber){
        const result = await depart.find({deleted:false})
        return result ;
} 

async function SaveRooms(Roomobj,fileObj) {
        const files = fileObj;
        
        const imagePaths = fileObj.map((image) => 'http://localhost:5200/Images/'+image) ;
        
        timeStamp = Date.now();
        if (!Roomobj.roomIndex) Roomobj.roomIndex = await adminController.getIndex('DEPARTMENT');
        if (!Roomobj.blocked) { Roomobj.blocked = false }
        if (!Roomobj.deleted) { Roomobj.deleted = false };
        if (!Roomobj.status) { Roomobj.status = 'V' };
        if (!Roomobj.maxOccupancy) { Roomobj.maxOccupancy = 0 }
        if (!Roomobj.NormalOccupancy) { Roomobj.NormalOccupancy = 0 }
        if (!Roomobj.minimumPax) { Roomobj.minimumPax = 0 }
        if (!Roomobj.guestId) { Roomobj.guestId = 'Vacant' }
        if (!Roomobj.checkinId) { Roomobj.checkinId = 'Vacant' }
        if (!Roomobj.billing) { Roomobj.billing = false }
        if (!Roomobj.rentOut) { Roomobj.rentOut = false }
        if(!Roomobj.companyIndex){
          let company = await  hBank.verifyUser(Roomobj)
          Roomobj.companyIndex = company.company;
        }
        const room = {
            roomNumber: Roomobj.roomNumber,
            roomIndex: Roomobj.roomIndex,
            roomName: Roomobj.roomName,
            floor: Roomobj.floor,
            interCom: Roomobj.interCom,
            size: Roomobj.size,
            roomiMages:imagePaths,
            roomType: Roomobj.roomType,
            blocked: Roomobj.blocked,
            deleted: Roomobj.deleted,
            status: Roomobj.status,
            userCreated: Roomobj.userCreated,
            timeStamp: Roomobj.timeStamp,
            maxOccupancy: Roomobj.maxOccupancy,
            NormalOccupancy: Roomobj.NormalOccupancy,
            minimumPax: Roomobj.minimumPax,
            guestId: Roomobj.guestId,
            checkinId: Roomobj.checkinId,
            billing: Roomobj.billing,
            rentOut: Roomobj.rentOut,
            companyIndex:Roomobj.companyIndex
        }
        let result =await depart.updateOne({ roomIndex: Roomobj.roomIndex }, room, { upsert: true })
       
        return result;
    }

    async function loadSaleRoom(SearchKey) {
        try {
            
             let result = await depart.find({roomName: { $regex: `^${SearchKey}`, $options: 'i' }  , deleted: false });
                return result;
        } catch (error) {
            console.error('Error:', error);
            throw error; // Rethrow the error to handle it in the calling code
        }
    }
    async function deleteRoom(roomIndex){
        let result = await depart.updateOne({roomIndex:roomIndex},{$set:{deleted:true}})
        
        return result;
    }
    
    async function getRoomsWithTariffDetails() {
        try {
          const results = await depart.aggregate([
            {  $lookup: {
                from: 'tariffmasters', // Collection name to lookup (replace with actual name)
                localField: 'roomType', // Assuming 'roomType' in Room collection corresponds to 'tariffIndex' in tariffmaster collection
                foreignField: 'tariffIndex',
                as: 'tariffDetails',
              },
            },
            {
              $unwind: '$tariffDetails',
            },
          ]);
          
          return results
        } catch (error) {
          console.error(error);
        }
      }
      async function loadroomByCompanyId(companyId) {
        const result = await depart.find({ companyIndex: companyId, deleted: false }, { _id: 0 });
        let rooms = [];
          const roomPromises = result.map(async (items) => {
          items.floorName = (await floor.floors.findOne({ floorindex: items.floor }, { floorname: 1, _id: 0 })).floorname;
          items.category =  (await tariff.tariff.findOne({tariffIndex:items.roomType},{tariffName:1,_id:0})).tariffName;
          return items ;
        });
        rooms = await Promise.all(roomPromises);
        return rooms;
      }
      
     
    
    
    async function loadAllroom(){
        let result = await  depart.find()
        return result;
    }
     



module.exports = {depart,loadrooms,SaveRooms,loadSaleRoom,loadAllroom,getRoomsWithTariffDetails,deleteRoom,loadroomByCompanyId}
