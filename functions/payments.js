 
const controller = require('../controller/adminController')
const voucherSerial = require('../functions/voucherSerial') 
const  hBank   = require('./humanbank')


const modelpayment = require('../model/payments')
 
async function MakeEntry(reqobj){try {
  
  if(!reqobj.paymentIndex) reqobj.paymentIndex = await controller.getIndex('PAYMENT') 
  reqobj.bookName =reqobj.accountHead
  if(!reqobj.voucherNumber) reqobj.voucherNumber = await voucherSerial.getVoucherNumber(reqobj)
  const debitData = { 
      transDate : reqobj.transDate ,
      paymentDate : reqobj.paymentDate ,
      paymentIndex : reqobj.paymentIndex ,
      paymentReferance : reqobj.paymentReferance,
      voucherNumber:reqobj.voucherNumber,
      accountHead : reqobj.accountHead ,
      debit : reqobj.amount ,
      entryType:'Dr',
      credit : 0,
      custommerId :  reqobj.accountHead ,
      companyID : reqobj.companyID ,
      cancelled : reqobj.cancelled ,
      createdUser : reqobj.createdUser 
  }
  const crediData = { 
      transDate : reqobj.transDate ,
      paymentDate : reqobj.paymentDate ,
      paymentIndex : reqobj.paymentIndex ,
      paymentReferance : reqobj.paymentReferance,
      accountHead :reqobj.custommerId  ,
      voucherNumber:reqobj.voucherNumber,
      debit :0 ,
      entryType:'Cr',
      credit : reqobj.amount ,
      custommerId : reqobj.custommerId ,
      companyID : reqobj.companyID ,
      cancelled : reqobj.cancelled ,
      createdUser : reqobj.createdUser 
  }
  
  const debitEntry = await modelpayment.payment.updateOne({voucherNumber:reqobj.voucherNumber,companyID : reqobj.companyID,entryType:'Dr' },{$set:debitData},{upsert:true})
  const creditEntry = await modelpayment.payment.updateOne({voucherNumber:reqobj.voucherNumber,companyID : reqobj.companyID,entryType:'Cr'},{$set:crediData},{upsert:true})
  return [debitEntry,creditEntry];
  
  
} catch (error) {
  console.log(error);
}}


async function MakeCreditEntry(reqobj){
     
   try {
     reqobj.bookName =reqobj.accountHead
 if(!reqobj.voucherNumber) reqobj.voucherNumber = await voucherSerial.getVoucherNumber(reqobj)
     if(!reqobj.paymentIndex) reqobj.paymentIndex = await controller.getIndex('PAYMENT') 
     const debitData= { 
         transDate : reqobj.transDate ,
         paymentDate : reqobj.paymentDate ,
         paymentIndex : reqobj.paymentIndex ,
         paymentReferance : reqobj.paymentReferance,
         voucherNumber:reqobj.voucherNumber,
         accountHead : reqobj.accountHead ,
         debit : 0,
         entryType:'Dr',
         credit : reqobj.amount ,
         custommerId : reqobj.custommerId ,
         receiptNumber:reqobj.receiptNumber,
         companyID : reqobj.companyID ,
         cancelled : reqobj.cancelled ,
         createdUser : reqobj.createdUser ,
         transactionReferanceNumber:reqobj.transactionReferanceNumber,
         TransferMode:reqobj.TransferMode
     }
     const  crediData = { 
         transDate : reqobj.transDate ,
         paymentDate : reqobj.paymentDate ,
         paymentIndex : reqobj.paymentIndex ,
         paymentReferance : reqobj.paymentReferance,
         accountHead :reqobj.custommerId  ,
         voucherNumber:reqobj.voucherNumber,
         debit :reqobj.amount  ,
         entryType:'Cr',
         credit : 0,
         receiptNumber:reqobj.receiptNumber,
         custommerId :  reqobj.accountHead ,
         companyID : reqobj.companyID ,
         cancelled : reqobj.cancelled ,
         transactionReferanceNumber:reqobj.transactionReferanceNumber,
         createdUser : reqobj.createdUser 
     }
      
     const debitEntry = await modelpayment.payment.updateOne({voucherNumber:reqobj.voucherNumber,companyID : reqobj.companyID,entryType:'Dr' },{$set:debitData},{upsert:true})
     const creditEntry = await modelpayment.payment.updateOne({voucherNumber:reqobj.voucherNumber,companyID : reqobj.companyID,entryType:'Cr'},{$set:crediData},{upsert:true})
     if((debitEntry.upsertedCount>0||debitEntry.modifiedCount>0)&&(creditEntry.upsertedCount>0||creditEntry.modifiedCount>0))
     return {saved:true};
     
   } catch (error) {
    console.log(error);
   }}
    
    
    
    async function loadPaymentByCompanyID(CompanyID) {
        try {
          const paymentDetails = await modelpayment.payment.find({
            companyID: CompanyID,
            accountHead: { $regex: `^${'HR'}`, $options: 'i' }
          });
        
          const custommerPromises = paymentDetails.map(async (entry) => {
            const custommer = await hBank.HumanResource.findOne({ hrId: entry.custommerId });
            if(custommer){ 
              entry.customerName = custommer.firstName;
            }
            else{
              entry.customerName = 'Reservation'
            }
          });
        
          await Promise.all(custommerPromises); // Wait for all custommerPromises to complete
          paymentDetails.sort((a, b) => {
              const dateComparison = new Date(a.transDate) - new Date(b.transDate);
          
              if (dateComparison === 0) {
                return a.paymentIndex - b.paymentIndex;
              }
          
              return dateComparison;
            });
          
        
          return paymentDetails;
        } catch (error) {
          console.log(error);
        }
      }
const payment = modelpayment.payment;
module.exports = {payment,MakeEntry,MakeCreditEntry,loadPaymentByCompanyID}  	
