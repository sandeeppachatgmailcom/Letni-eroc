 
const adminController = require('../controller/adminController')
const floor = require ('../functions/floor')
const tariff = require('../functions/tariff')
const hBank = require('../functions/humanbank')

 
const modelDepart= require('../model/rooms')
async function loadrooms(RoomNumber){
        try {
          const result = await modelDepart.depart.find({deleted:false})
          return result ;
        } catch (error) {
          console.log(error);
        }
} 

async function SaveRooms(Roomobj,fileObj) {
       try {
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
         let result =await modelDepart.depart.updateOne({ roomIndex: Roomobj.roomIndex }, room, { upsert: true })
        return result;
       } catch (error) {
        console.log(error);
       }
    }

async function loadSaleRoom(SearchKey) {
        try {
             let result = await modelDepart.depart.find({roomName: { $regex: `^${SearchKey}`, $options: 'i' }  , deleted: false });
                return result;
        } catch (error) {
            console.error('Error:', error);
            throw error; // Rethrow the error to handle it in the calling code
        }
    }
async function deleteRoom(roomIndex){
      try {
          let result = await modelDepart.depart.updateOne({roomIndex:roomIndex},{$set:{deleted:true}})
          return result;
      } catch (error) {
        console.log(error);
      }
    }
async function getRoomsWithTariffDetails() {
        try {
          const results = await modelDepart.depart.aggregate([
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
      try {
          const result = await modelDepart.depart.find({ companyIndex: companyId, deleted: false }, { _id: 0 });
          let rooms = [];
            const roomPromises = result.map(async (items) => {
            items.floorName = (await floor.floors.findOne({ floorindex: items.floor }, { floorname: 1, _id: 0 })).floorname;
            items.category =  (await tariff.tariff.findOne({tariffIndex:items.roomType},{tariffName:1,_id:0})).tariffName;
            return items ;
          });
          rooms = await Promise.all(roomPromises);
          return rooms;
      } catch (error) {
        console.log(error);
      }
      }
async function loadAllroom(){
        try {
          let result = await  modelDepart.depart.find()
          return result;
        } catch (error) {
          console.log(error);
        }
    }

    const depart = modelDepart.depart;
module.exports = {depart,loadrooms,SaveRooms,loadSaleRoom,loadAllroom,getRoomsWithTariffDetails,deleteRoom,loadroomByCompanyId}
