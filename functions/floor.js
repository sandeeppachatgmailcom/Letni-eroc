 
 
  const Modelfloors =require('../model/floor')
  
  async function loadAllFloor(){
    try {
      let result =  await Modelfloors.floors.find()
      return result; 
    } catch (error) {
      console.log(error);
    }
  }
  const floors = Modelfloors.floors
  module.exports = {floors,loadAllFloor}