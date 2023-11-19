 
 
const modelUserLog = require('../model/userAccess');
 


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

async function verifyaccess (objConnection){
    try {
        if(!objConnection.body.username){objConnection.body.username = objConnection.query.username}
        
    //const verify = await modelUserLog.UserLog.findOne({folder:objConnection.path ,method:objConnection.method,username:objConnection.cookies.username})
    return {verify:true} 
    if(verify){
        return {verify:true}
    }
    else  return {verify:true}
    } catch (error) {
        console.log(error);
    }
}
 



const UserLog = modelUserLog.UserLog;
module.exports = { UserLog,logout,verifyaccess };

