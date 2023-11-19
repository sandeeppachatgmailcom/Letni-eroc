 
const adminController = require('../controller/adminController')
 
const modelCheckinPlan = require('../model/planMaster')

async function  LoadPlan(){try {
    
           result = await modelCheckinPlan.CheckinPlan.find({deleted:false})
      
    return result;
} catch (error) {
    console.log(error);
}} 
async function  LoadPlanByID(planId){
    try {
        result = await modelCheckinPlan.CheckinPlan.findOne({ planIndex:planId})
        console.log(result);
        return result;
    } catch (error) {
    console.log(error);       
    }
}


async function  saveCheckinPlan (data){
    try {
        let result = await modelCheckinPlan.CheckinPlan.updateOne({planIndex:data.planIndex},{$set:data},{upsert:true}) 
        if ((result.modifiedCount + result.upsertedCount) > 0) { result = { saved: true } }
        else { result = { saved: false } }
        return result;
    } catch (error) {
        console.log(error);
    }
} 

async function  deleteCheckinPlan (data){
    try {
        if (!data.planIndex){data.planIndex = await adminController.getIndex('CheckinPlan') }
        
        let  result = await modelCheckinPlan.CheckinPlan.updateOne({planIndex:data.planIndex},{$set:{deleted:true}}) 
        if ((result.modifiedCount + result.upsertedCount) >= 0) { result = { deleted: true } }
        else { result = { deleted: false } }
        return result;
    } catch (error) {
        console.log(error);
    }
} 

const CheckinPlan = modelCheckinPlan.CheckinPlan;
module.exports={CheckinPlan,LoadPlan,saveCheckinPlan,deleteCheckinPlan,LoadPlanByID}