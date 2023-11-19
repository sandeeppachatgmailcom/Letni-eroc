 
const adminController = require('../controller/adminController')
  const modelpincode = require('../model/pincode')

async function loadPincode(pincodeobj){try {
  
      console.log(pincodeobj,'pincode reached vbacked ');
      const result = await modelpincode.pincode.find({pincode:pincodeobj.pincode});
      return result;
} catch (error) {
  console.log(error);
}
  }
  const pincode =  modelpincode.pincode;
  module.exports = {pincode,loadPincode}