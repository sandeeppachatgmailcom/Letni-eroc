const controller = require('../controller/adminController');
 
const companies = require('../model/company')

const modelTariff = require('../model/tariff') 
const tariff = modelTariff.tariff;


async function loadtariffWithAny(Obj) {
try {
    const loadtariff =await  companies.company.find({ CompanyID:Obj.submitCompanyDetails},{_id:0,tariff:1,BuildingName:1,
        buildingNumber:1,city:1 ,contactNumber:1,country:1,createduser:1,deleted:1,district:1,email:1,firstName:1,image1:1,
        image2:1, isloggedIn:1, lastName:1, pancard:1, pincode:1, secondaryNumber:1,state:1}); 
    
        
      return loadtariff ;
       
    
} catch (error) {
    console.log(tariff);
}}

async function loadtariff(SearchKey) {
    try {
        const loadtariff = await modelTariff.tariff.find({tariffName:{$regex:`^${SearchKey}`,$options:'i'},deleted:false});
        
        return loadtariff;
    } catch (error) {
        console.error("Error loading tariff:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}


async function savecategory(
    tariffName,
    tariffIndex,
    roomRentSingle,
    extraPerson,
    tax,
    includeChild,
    defaultCheckinplan,
    timestamp,
    username,
    HSNCode,
    itemname,
    ){
    try {
        if(!tariffIndex){tariffIndex = await controller.getIndex('TARIFF')}
            
    const data = {
        tariffName:tariffName,
        tariffIndex:tariffIndex,
        roomRentSingle:roomRentSingle,
        extraPerson:extraPerson,
        tax:tax,
        includeChild:includeChild,
        defaultCheckinplan:defaultCheckinplan,
        timestamp:timestamp,
        username:username,
        HSNCode:HSNCode,
        itemname:itemname,
        deleted:false     
       }
        
      const result = await modelTariff.tariff.updateOne({tariffIndex:tariffIndex},data,{upsert:true})
       
      return result;
    } catch (error) {
        console.log(tariff);
    }
} 

const postdeletetariff = async (req,res)=>{
    try {
        
        let result = await (modelTariff.tariff.updateOne({tariffIndex:req.body.tariffIndex},{$set:{deleted:true}}))
        
        if(result.acknowledged ){
            result={deleted:true}
        }
        else
        {
            result={deleted:false}
        }
        res.json(result)
    } catch (error) {
        console.log(tariff);
    }
}

module.exports = {tariff,loadtariff,savecategory,postdeletetariff,loadtariffWithAny }
