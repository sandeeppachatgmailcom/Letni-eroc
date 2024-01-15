const express = require('express')
const router = express.Router()
const publiccontroller = require('../controller/publicApi')


router.get('/hotels',publiccontroller.getHotels)
router.post('/authUser',publiccontroller.postAuthUser)
router.post('/changePassword',publiccontroller.postChangePassword )
router.post('/createUser',publiccontroller.postCreateUser )
router.post('/deleteUser',publiccontroller.postdeteUser )
router.get('/alluser',publiccontroller.getAllUser)



/*
for creat and update user .
 data = {
        hrId: staff ID  (unique),
        firstName: firstName name of user ,
        lastName: lastName of user ,
        contactNumber: contactNumber (unique),
        secondaryNumber: secondaryNumber,
        username: username,
        email: email (unique),
        HouseNumber: HouseNumber,
        HouseName: HouseName,
        StreetName: StreetName,
        district: district,
        city: city,
        pincode: pincode,
        state: state,
        country: country,
        Active: true,
        isAdmin: isAdmin,
        married: married,
        isloggedIn: isloggedIn,
        pancard: pancard (unique),
        adhaar: adhaar (unique),
        dob: new Date(dob),
        marriedDate: new Date(marriedDate),
        gender: gender,
        deleted: false,
        createduser: createduser,
        systemUser: systemUser,
        activeSession:session,
        profilePicture:'/Images/'+hrId+'profilePicture',
        wallPappper:'/Images/'+hrId+'wallPappper' 
    }
*/
  

module.exports = router
