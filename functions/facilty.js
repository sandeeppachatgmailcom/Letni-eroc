 
const controller = require('../controller/adminController')
  
  const Modelfacilty = require('../model/facilty')
  
  async function loadAllfacilty(){
    try {
      let result =  await Modelfacilty.facilty.find()
      return result; 
    } catch (error) {
      console.log(error);
    }
  }

  async function SaveFacilty(ReqObj){
    try {
      console.log('Reached Schema');
      if(!ReqObj.Serviceindex){ReqObj.Serviceindex=await controller.getIndex('Facilty') }
      const existdata = await Modelfacilty.facilty.find({Serviceindex:ReqObj.Serviceindex})
      if(!existdata ) existdata = blankData;
      if(!ReqObj.ServiceName){return {saved:false} }
      if(!ReqObj.ServiceImages1){ReqObj.Serviceindex=existdata.ServiceImages1 }
      if(!ReqObj.ServiceImages2){ReqObj.Serviceindex=existdata.ServiceImages2 }
      if(!ReqObj.ServiceImages3){ReqObj.Serviceindex=existdata.ServiceImages3 }
      if(!ReqObj.ServiceImages4){ReqObj.Serviceindex=existdata.ServiceImages4 }
  
      const data= {
        Serviceindex:ReqObj.Serviceindex,
        ServiceName: ReqObj.ServiceName,
        ServiceImages1: ReqObj.ServiceImages1,
        ServiceImages2:ReqObj.ServiceImages2,
        ServiceImages3:ReqObj.ServiceImages3,
        ServiceImages4:ReqObj.ServiceImages4,
        hsnCode: ReqObj.hsnCode,
        timestamp: Date.now(),
        username: ReqObj.username,
        deleted: false,
        edited: ReqObj.edited,
        blocked:ReqObj.blocked
      }
      const result = await Modelfacilty.facilty.updateOne({Serviceindex:ReqObj.Serviceindex},{$set:data},{upsert:true})
      let value = false;
      if (result.modifiedCount>0){value = {updated:true}}
      else if (result.upsertedCount>0){value = {saved:true}}
      else if (!result.modifiedCount && result.upsertedCount && result.acknowledged ) {value={exist:true}}
      return value;
    } catch (error) {
      console.log(error);
    }
  }
  const facilty = Modelfacilty.facilty;
  module.exports = {facilty,loadAllfacilty,SaveFacilty}