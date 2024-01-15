const express = require('express');
const router = express.Router()
const jwt = require('jsonwebtoken')
function verifyToken (req,res,next){
   try {
     console.log(req.session,'Display');
     let authHeader = req.session.headers;
     if(!authHeader){ next();}
     let token = authHeader;
     jwt.verify(token,'PassKey',(err,decoded)=>{
         if(err){
             res.clearCookie('Username');
             req.session.destroy();
         res.render('login')
         }
         else{
             next();
         }
     })
     
   } catch (error) {
    console.log(error);
   }
}
function createJwt(payload, secretKey, options = {}) {
  try {
    if (typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('Payload must be a plain object.');
    }

    const token = jwt.sign(payload, secretKey, options);
    return token;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately, e.g., return an error response
    throw error;
  }
}
 
module.exports = {verifyToken,createJwt}