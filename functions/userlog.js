 
const modelUserLog = require('../model/userlog')

async function logout(username){
   try {
     let logout =await  modelUserLog.UserLog.updateMany({username:username},{$set:{loggedOut:true}})
     if(logout.modifiedCount>=0) {logout ={logout:true}} else {logout ={logout:false}}  
     console.log(logout)
     return logout;
   } catch (error) {
    console.log(error);
   }
}
const UserLog = modelUserLog.UserLog;
module.exports = { UserLog,logout };

