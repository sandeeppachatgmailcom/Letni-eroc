 

const modelvoucherSerial = require('../model/voucherSerial')
const { tariff } = require('./tariff')
$inc: { nextIndex: 1 }


async function getVoucherNumber (reqObj){
  try {
    const NewCompany= {
      activeYear: true,
      bookName: reqObj.bookName,
      companyID: reqObj.companyID,
      deleted: false,
      __v: 0,
      financialYear: "2324",
      nextIndex: 100001,
      prefix: "JV"
    }
      let result =await modelvoucherSerial.voucherSerial.findOneAndUpdate({bookName:reqObj.bookName,companyID:reqObj.companyID,activeYear:true,deleted:false },{$inc:{nextIndex:1}},{upsert:true})
      if(!result) {  await modelvoucherSerial.voucherSerial.insertOne({$inc:{nextIndex:1}})
      result =await modelvoucherSerial.voucherSerial.findOneAndUpdate({bookName:reqObj.bookName,companyID:reqObj.companyID,activeYear:true,deleted:false },{$inc:{nextIndex:1}},{upsert:true})
    }
    console.log(result);
      const serialNumber = result.prefix+result.financialYear+result.nextIndex;
  return serialNumber; 
  } catch (error) {
    console.log(error);
  }
}
// Export the model
const voucherSerial = modelvoucherSerial.voucherSerial;
module.exports = { voucherSerial,getVoucherNumber };

