
 

const getCheckinPlan=async (req,res)=>{
   try {
    res.render('checkinPlans')
   } catch (error) {
    console.log(error);
   }
}





    
 


module.exports = {getCheckinPlan}