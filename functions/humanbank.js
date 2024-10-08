
const Controller = require('../controller/adminController')
const OtpMaster = require('../model/otpvalidation')
const company = require('../model/company')

const ModelHumanResource = require('../model/humanbank')
async function saveHuman(NewHumanObj) {
    try {
        let exist = await ModelHumanResource.HumanResource.findOne(
            {
                $or: [
                    {hrId: NewHumanObj.hrId },
                    {email: NewHumanObj.email },
                    {contactNumber: NewHumanObj.contactNumber },
                    {pancard: NewHumanObj.pancard},
                    {adhaar: NewHumanObj.adhaar }
                ]
            })
        if (!exist) {

            if (!NewHumanObj.hrId) { NewHumanObj.hrId = await Controller.getIndex('humanBank') }
            if (!NewHumanObj.isAdmin) { NewHumanObj.isAdmin = false }
            const data = {
                firstName: NewHumanObj.firstName,
                lastName: NewHumanObj.lastName,
                contactNumber: NewHumanObj.contactNumber,
                secondaryNumber: NewHumanObj.secondaryNumber,
                username: NewHumanObj.username,
                email: NewHumanObj.email,
                HouseNumber: NewHumanObj.HouseNumber,
                HouseName: NewHumanObj.HouseName,
                StreetName: NewHumanObj.StreetName,
                district: NewHumanObj.district,
                city: NewHumanObj.city,
                pincode: NewHumanObj.pincode,
                state: NewHumanObj.state,
                country: NewHumanObj.country,
                Active: true,
                isAdmin: NewHumanObj.isAdmin,
                married: NewHumanObj.married,
                isloggedIn: NewHumanObj.isloggedIn,
                pancard: NewHumanObj.pancard,
                adhaar: NewHumanObj.adhaar,
                dob: new Date(NewHumanObj.dob),
                marriedDate: new Date(NewHumanObj.marriedDate),
                gender: NewHumanObj.gender,
                deleted: NewHumanObj.false,
                createduser: NewHumanObj.createduser,
                systemUser: NewHumanObj.systemUser,
                activeSession: NewHumanObj.session,
                profilePicture: '/Images/' + NewHumanObj.hrId + 'profilePicture',
                wallPappper: '/Images/' + NewHumanObj.hrId + 'wallPappper'
            }

            const result = await ModelHumanResource.HumanResource.updateOne({ hrId: NewHumanObj.hrId }, { $set: data }, { upsert: true })
            result.hrId = NewHumanObj.hrId;
            result.email = NewHumanObj.email
            result.contactNumber = NewHumanObj.contactNumber,
                result.message = 'save succes',
                result.saved = true;
            console.log(result)
            return result;
        }
        else return {
            saved: false,
            message: 'data already exist',
        }

    } catch (error) {
        console.log(error);
    }
}

async function SearchHuman(SerchKey) {
    try {
        const data = await ModelHumanResource.HumanResource.find({ firstName: { $regex: `^${SerchKey}`, $options: 'i' }, deleted: false })
        return data
    } catch (error) {
        console.log(error);
    }
}
async function SearchHumanbyUsername(humanObj) {

    try {
        const data = await ModelHumanResource.HumanResource.find({ username: { $regex: `^${humanObj.SerchKey}`, $options: 'i' }, deleted: false }, { password: 0 })
        return data;
    } catch (error) {
        console.log(error);
    }
}
async function verifyUser(userObject) {
    /* 
    input: {
        session:sessionid,
        email:email,
        password:password 
    }
    */
    try {
        
       
        if (userObject.path == '/verifyUsenameWithPassword') {
            userObject.session = "noactivesession"
            
        }
        console.log(userObject,'9999999999999999')

       // let user = await ModelHumanResource.HumanResource.findOne({ email: userObject.email },{password:0,_id:0})
       let user = await ModelHumanResource.HumanResource.findOne({ activeSession: userObject.session }, { password: 0, _id: 0 })
       console.log(user,'user------------V')
        if (userObject.path == '/hotelLogin') {
            user = '';
            await ModelHumanResource.HumanResource.updateOne({ activeSession: userObject.session }, { $set: { activeSession: null } })
        }
        if (userObject.path == '/adminLogin') {
            user = '';
            await ModelHumanResource.HumanResource.updateOne({ activeSession: userObject.session }, { $set: { activeSession: null } })
        }
        if (user) {
            console.log(user,'user------>>>>>>>>>>')

            user.companyID = await company.company.findOne({ email: user.email }, { CompanyID: 1, Active: 1, _id: 0 })
            if (!user.companyID) user.companyID = {}
            console.log(user.companyID.Active, 'user.companyID.Active')
            return {
                verified: true,
                user: user.firstName,
                userdetails: user,
                userActive: user.Active,
                userIsAdmin: user.isAdmin,
                company: user.companyID.CompanyID,
                companyActive: user.companyID.Active,
                message: 'sas',
                isAdmin: user.isAdmin
            };
        }
        else {
            if (userObject.userName) {
                let verified = {
                    verified        : '',
                    email           : '',
                    user            : '',
                    userdetails     : '',
                    userActive      : '',
                    isAdmin         : '',
                    company         : '',
                    companyActive   : '',
                    message         : '',
                    isAdmin         : '',
                    user            : '',
                }
                console.log('first',userObject.userName)
                const password = await ModelHumanResource.HumanResource.findOne({ email: userObject.userName})
                console.log(password,'password')

                if (password) {
                    password.companyID = await company.company.findOne({ email: password.email }, { CompanyID: 1, Active: 1, _id: 0 });
                    const otpValidation = await OtpMaster.Otp.findOne({ authorisationname: userObject.userName, verified: false })
                    if (otpValidation) {
                        verified = {
                            verified: false,
                            otp: null,
                            message: 'Otp Validation Pending',
                            userdetails: '',
                            company: '',
                            isAdmin: false
                        }
                        return verified
                    }

                    const result = await Controller.comparePassword(userObject.password, password.password)
                    if (result) {
                        if (userObject.path != '/verifyUsenameWithPassword') {
                            await ModelHumanResource.HumanResource.updateOne({ email: userObject.userName }, { $set: { activeSession: userObject.session } })
                        }
                        if (password.Active) {
                            verified = {
                                verified: true,
                                email: userObject.userName,
                                user: password.firstName,
                                userdetails: password,
                                userActive: password.Active,

                                company: password.companyID,
                                companyActive: password.Active,
                                message: 'Account is veryfied ,your profile is ' + verified.userActive + 'you have power to login' + company,
                                isAdmin: password.isAdmin,

                            }
                            return verified
                        }
                        else {
                            verified = {
                                verified: false,
                                email: userObject.userName,
                                userdetails: password,
                                isAdmin: password.isAdmin,
                                message: 'blocked by the admin!!! '

                            }
                            return verified
                        }
                    }
                    else {
                        verified = {
                            verified: false,
                            otp: null,
                            message: "invalid credentials"
                        }
                    }
                    verified.user = password.firstName;
                    return verified;
                }
                return {
                    verified: false,
                    otp: null,
                    message: "not a valid user"
                }
            }

            else {
                verified = {
                    verified: false,
                    email: '',
                    userdetails: '',
                    isAdmin: false,
                    message: 'no user found '

                }
                return verified
            }
        }
    } catch (error) {
        console.log(error);
    }
}
async function combiSearchHuman(searchValues) {
    try {
        const data = await ModelHumanResource.HumanResource.find({
            contactNumber: { $regex: `^${searchValues.contactNumber}`, $options: 'i' },
            firstName: { $regex: `^${searchValues.firstName}`, $options: 'i' },
            email: { $regex: `^${searchValues.email}`, $options: 'i' }, deleted: false
        })
        return data
    } catch (error) {
        console.log(error);
    }
}

async function deleteHuman(hrId) {
    try {
        const result = await ModelHumanResource.HumanResource.updateOne({ hrId: hrId }, { $set: { deleted: true } } )
        return result
    } catch (error) {
        console.log(error);
    }
}
async function loadHuman(contactNumber) {
    try {
        const result = await ModelHumanResource.HumanResource.find({ contactNumber: contactNumber, deleted: true })
        return result
    } catch (error) {
        console.log(error);
    }
}
async function changePassword(humanObj) {
    try {
        const password = await Controller.encryptPassword(humanObj.password);

        const result = await ModelHumanResource.HumanResource.updateOne({ email: humanObj.username }, { $set: { password: password } })

        return result
    } catch (error) {
        console.log(error);
    }
}

async function findUser(sessionID) {
    try {
        const activeUser = await ModelHumanResource.HumanResource.findOne({ activeSession: sessionID }, { password: 0, _id: 0 })
        console.log(activeUser);
        return activeUser
    } catch (error) {
        console.log(error);
    }
}

const HumanResource = ModelHumanResource.HumanResource;
module.exports = { findUser, HumanResource, SearchHuman, saveHuman, deleteHuman, combiSearchHuman, SearchHumanbyUsername, verifyUser, changePassword };
