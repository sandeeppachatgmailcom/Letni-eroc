
const bcrypt = require('bcrypt')
const serialNumbers = require('../functions/serialNumbers')



async function encryptPassword(password) {
    try {
        const hashedpass = await bcrypt.hash(password, 10); // Adjust the salt rounds as needed
        return hashedpass;
    } catch (err) {
        console.error('Error:', err);
        throw err; // You can choose to handle or rethrow the error here
    }
}
async function comparePassword(newPassword,hashedPassword) {
    try {
        const isMatch  = await bcrypt.compare(newPassword,hashedPassword); // Adjust the salt rounds as needed
        return isMatch ;
    } catch (err) {
        console.error('Error:', err);
        throw err; // You can choose to handle or rethrow the error here
    }
}
    
async function getIndex(CollName) {
    try {
        $inc: { nextIndex: 1 }
    const result = await serialNumbers.serialNumbers.findOne({ tableName: CollName });
     console.log(result,CollName);
    await serialNumbers.serialNumbers.updateOne({ tableName: CollName }, { $inc: {nextIndex:1} })
    const serialnumber = result.prefix + result.nextIndex;
    return serialnumber;
    } catch (error) {
        return (error)
    }
}
     

    
function convertToCustomFormat(inputDateTime) {
    try {
    
        // Create a Date object from the input date-time string
        const dateObject = new Date(inputDateTime);
    
        // Extract date components
        const day = String(dateObject.getDate()).padStart(2, '0');
        const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = String(dateObject.getFullYear()).slice(-2); // Get the last 2 digits of the year
    
        // Extract time components
        const hours = String(dateObject.getHours()).padStart(2, '0');
        const minutes = String(dateObject.getMinutes()).padStart(2, '0');
        const seconds = String(dateObject.getSeconds()).padStart(2, '0');
    
        // Format the date and time in 'dd-mm-yy,hh-mm-ss' format
        const formattedDateTime = `${day}-${month}-${year},${hours}-${minutes}-${seconds}`;
    
        return formattedDateTime;
} catch (error) {
    
}
}
 
    
function formatDate(inputDate) {
        try {
            const parts = inputDate.split('-'); // Split the input string by '-'
        
        if (parts.length === 3) {
            const yyyy = parts[0];
            const mm = parts[1];
            const dd = parts[2];
            
            // Rearrange the parts into 'dd-mm-yyyy' format
            const formattedDate = `${dd}-${mm}-${yyyy}`;
            
            return formattedDate;
        } else {
            // Handle invalid input gracefully
            return 'Invalid Date';
        }
        } catch (error) {
            
        }
}

 
function calculateDays(startDate,endDate){
    try {
    
    const graceHours = .5;
    let temp = startDate.split('T');
    const fromdate =new Date(temp[0]);
    let  arrivalTime = temp[1].split(':')
    temp = endDate.split('T');
    const todate = new Date(temp[0]);
    let  deptTime = temp[1].split(':')
    const days =todate-fromdate;
    let diffDays = Math.ceil(days / (1000 * 60 * 60 * 24)); 
    deptTime = ((parseInt(deptTime[0])*60)+(parseInt(deptTime[1])))/60 
    arrivalTime = ((parseInt(arrivalTime[0])*60)+(parseInt(arrivalTime[1])))/60
    const timeDiff = deptTime - arrivalTime ;
    if(timeDiff>graceHours) diffDays++; 
     
    return diffDays;
} catch (error) {
    
}
}

module.exports = {getIndex, convertToCustomFormat,encryptPassword,comparePassword,formatDate,calculateDays}