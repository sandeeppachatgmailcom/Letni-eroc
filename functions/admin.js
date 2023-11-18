
const HBank = require('../functions/humanbank')
const reserv = require('../functions/reservation')
const fntcompany = require('../functions/company')
const utils = require('../functions/commonUtils')



const postactivateCompany = async (req,res)=>{
    const status =await  fntcompany.changeCompanyActiveNot(req.body)    
    res.json(status)
} 
const postloadHotelByPagebyNumber = async (req,res)=>{
    console.log(req.body,'page Number   ')
    const company =await fntcompany.company.find({Active:true,deleted:false}).skip(req.body.skip).limit(req.body.limit)
    res.json(company);
}

const getRoot = async (req,res)=>{
   
    res.render('adminlogin')
} 
const postadminLogin = async (req,res)=>{
    req.body.session = req.sessionID;
    req.body.path= req.path
    const result =await HBank.verifyUser(req.body)   
    if(result.verified){
        if(result.isAdmin){
            result.path='/admin/dashBoard'
            console.log(result,'resultresult');
            res.json(result)
        }
        else{
            result.verified=true;
            result.message = 'you are not a admin'
            res.json(result)
        }
        
    }
    else{

        res.json(result)
    }

}  
const postdisableUser = async (req,res)=>{
    const active =await  HBank.HumanResource.findOne({hrId:req.body.hrId},{Active:1,_id:0})
    console.log(active);
    let result ={
        active:false,
        message:''
    }
    if(active.Active){
        await HBank.HumanResource.updateOne({hrId:req.body.hrId},{$set:{Active:false,activeSession:null}})
        result.active=false;
        result.message='user disabled'
    }
    else{
        await  HBank.HumanResource.updateOne({hrId:req.body.hrId},{$set:{Active:true}})
        result.active=true;
        result.message='user activated'
    }
    res.json( result)
} 
const getdashboard = async (req,res)=>{
    req.body.session = req.sessionID;
    const result =await HBank.verifyUser(req.body)  
    const activeUsers =  await  HBank.HumanResource.find({deleted:false},{hrId:1,_id:0,firstName:1,email:1,contactNumber:1,Active:1})  
    const hotels = await fntcompany.getCompanySummary()
    const pageHotels =Math.ceil(hotels.length/5) 
    console.log(activeUsers);

    let user = ''
    if(result.verified){
        user=  result.userdetails
        const today = new Date()
        console.log(today);
        const { firstDay, lastDay } = utils.getFirst_lastDayOfMonth(new Date()); 
        console.log(firstDay, lastDay)
          

        const monthlyReservationsa = await reserv.getdatewiseBookingMonth(firstDay,lastDay)
            let tempDate = new Date(firstDay);
            let bookings=[];
                while(tempDate< new Date(lastDay)){
                    let flag =0; 
                    monthlyReservationsa.forEach(element => {
                        if( element.transdate.getTime()==tempDate.getTime() ){
                            bookings.push(element)
                            flag++
                             
                        }    
                    });
                    if(!flag){
                        bookings.push({
                            transdate:new Date(tempDate),
                            totalRoom:0
                        })
                    }
                     
                    
                    tempDate.setDate(tempDate.getDate()+1)
                }
           res.render('adminDashBoard',{user,bookings,activeUsers,hotels,pageHotels})
    }
    else{
        
        res.render('adminlogin') 
    }

    
} 
module.exports = {postactivateCompany,getRoot,postadminLogin ,postdisableUser,getdashboard,postloadHotelByPagebyNumber }
