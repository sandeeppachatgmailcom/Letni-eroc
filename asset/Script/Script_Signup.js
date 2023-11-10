

async function SaveCheckinPlan(){
    const data = {
    planIndex:document.getElementById('idplanIndex').value,
    planName:document.getElementById("idPlanname").value,
    shortName:document.getElementById("idShortName").value,
    maxPax:document.getElementById("idAllowedPax").value,
    amount:document.getElementById("idPlanAmount").value,
    extraCharge:document.getElementById("idExtraCharge").value,
    user:document.getElementById('loggeduser').innerHTML,
    discription:document.getElementById("iddiscription").value,
    deleted:false
    }
    
    const result = await fetch('/checkinplan/saveCheckinplan',{method:'POST',headers:{"Content-Type":"Application/json"},body: JSON.stringify(data)})
    .then(res=>{
        return res.json();
    }).catch()

    if(result.saved){
        window.location.assign("/checkinplan/plan");
    }
     

}

function loadCheckinPlan(data){
    const plan = JSON.parse(data); 
    MakePlanReadonly();
    document.getElementById('idplanIndex').value=plan.planIndex,
    document.getElementById("idPlanname").value=plan.planName,
    document.getElementById("idShortName").value=plan.shortName,
    document.getElementById("idAllowedPax").value=plan.maxPax,
    document.getElementById("idPlanAmount").value=plan.amount,
    document.getElementById("idExtraCharge").value=plan.extraCharge,
    document.getElementById('loggeduser').innerHTML=plan.user,
    document.getElementById("iddiscription").value=plan.discription
    
}

function MakePlanReadonlyFalse(){
    document.getElementById('idplanIndex').readOnly=false,
    document.getElementById("idPlanname").readOnly=false,
    document.getElementById("idShortName").readOnly=false,
    document.getElementById("idAllowedPax").readOnly=false,
    document.getElementById("idPlanAmount").readOnly=false,
    document.getElementById("idExtraCharge").readOnly=false,
    document.getElementById("iddiscription").readOnly=false
}

function MakePlanReadonly(){
    document.getElementById('idplanIndex').readOnly=true,
    document.getElementById("idPlanname").readOnly=true,
    document.getElementById("idShortName").readOnly=true,
    document.getElementById("idAllowedPax").readOnly=true,
    document.getElementById("idPlanAmount").readOnly=true,
    document.getElementById("idExtraCharge").readOnly=true,
    document.getElementById("iddiscription").readOnly=true
    
}
async function login(){
    const data = {userName : document.getElementById('idUserName').value ,
    password : document.getElementById('idUserPassword').value }
    
    
    const  result = await fetch ('/authenticate/login',{method:'post',headers:{"Content-Type":"Application/json"},body:JSON.stringify(data)})
    .then( res=>{
        return res.json()
    })
    .catch(err=>{
        
    })
    window.location.assign("/floorMap/floorMap");
  }

  async function verifyuserWithPassword(inputusername ,input_Field,outputfield){
    const username = document.getElementById(inputusername).value;
    const password = document.getElementById(input_Field).value;
    if(password.length<1 || username.length<1 ){
        document.getElementById(input_Field).focus();
    return
    }
    else {
        const data = {
            userName:username,
            password:password
        }
        const result = await fetch('/authenticate/verifyUsenameWithPassword',{method:'post',headers:{"Content-Type":"Application/json"},body:JSON.stringify(data)})
        .then(res =>{
            return res.json();
        })
        .catch(err=>{
            console.log(err)
        }) 
         
        return result 
    }
   

}  

async function validateUserwithPassword(inputusername ,input_Field,outputfield,newpasswordtext,retypePassword){
const result = await verifyuserWithPassword(inputusername,input_Field,outputfield)
 
    if (result.verified) {
        
        while (document.getElementById(outputfield).classList.length > 0) {
            document.getElementById(outputfield).classList.remove(document.getElementById(outputfield).classList.item(0));
        }
        document.getElementById(outputfield).classList.add('btn')
        document.getElementById(outputfield).classList.add('btn-success')
        document.getElementById(outputfield).classList.add('bi')
        document.getElementById(outputfield).classList.add('bi-patch-check')
        document.getElementById(newpasswordtext).readOnly = false
        document.getElementById(retypePassword).readOnly = false
    }
    else {
        
        while (document.getElementById(outputfield).classList.length > 0) {
            document.getElementById(outputfield).classList.remove(document.getElementById(outputfield).classList.item(0));
        }
        document.getElementById(outputfield).classList.add('btn')
        document.getElementById(outputfield).classList.add('btn-danger')
        document.getElementById(outputfield).classList.add('bi')
        document.getElementById(outputfield).classList.add('bi-patch-check')
        document.getElementById(newpasswordtext).readOnly = true
        document.getElementById(retypePassword).readOnly = true 
    } 
}
 







async function verifyPasswordBackend(inputusername ,input_Field,outputfield){
   
        const result =await verifyuserWithPassword(inputusername,input_Field,outputfield)
        
        if (result.verified) {
        
            while (document.getElementById(outputfield).classList.length > 0) {
                document.getElementById(outputfield).classList.remove(document.getElementById(outputfield).classList.item(0));
            }
            document.getElementById(outputfield).classList.add('btn')
            document.getElementById(outputfield).classList.add('btn-success')
            document.getElementById(outputfield).classList.add('bi')
            document.getElementById(outputfield).classList.add('bi-patch-check')
            

            
        }
        else {
            
            while (document.getElementById(outputfield).classList.length > 0) {
                document.getElementById(outputfield).classList.remove(document.getElementById(outputfield).classList.item(0));
            }
            document.getElementById(outputfield).classList.add('btn')
            document.getElementById(outputfield).classList.add('btn-danger')
            document.getElementById(outputfield).classList.add('bi')
            document.getElementById(outputfield).classList.add('bi-patch-check')
            
             
        }
         
        return result.verified; 
     
   

}  
async function verifyEmail(Email_Field,outputfield,path) {
     
    const email = document.getElementById(Email_Field).value;
    if (email.length == 0) {
        document.getElementById(Email_Field).focus();
        return
    }
    const data = { email: email,
                    path:path }
    let result = await fetch('/authenticate/VerifyEmail', {
        method: 'post',
        headers: {
            "Content-Type": "application/json" // Note the colon after "content-type" and the correct header name "Content-Type"
        },
        body: JSON.stringify(data)
    }
    ).then((res) => {

            return res.json()
        }
        )
        .catch()
    
    let signuptxt = document.getElementById('Signup_Email_text');
    
    if (result.verified) {
         
        while (document.getElementById(outputfield).classList.length > 0) {
            document.getElementById(outputfield).classList.remove(document.getElementById(outputfield).classList.item(0));
           
        }
        
        document.getElementById(outputfield).classList.add('btn')
        document.getElementById(outputfield).classList.add('btn-danger')
        document.getElementById(outputfield).classList.add('bi')
        document.getElementById(outputfield).classList.add('bi-patch-check')
         
        alert("The email you entered is already Exist")
    }
    else {
         
        while (document.getElementById(outputfield).classList.length > 0) {
            document.getElementById(outputfield).classList.remove(document.getElementById(outputfield).classList.item(0));
        }
        document.getElementById(outputfield).classList.add('btn')
        document.getElementById(outputfield).classList.add('btn-success')
        document.getElementById(outputfield).classList.add('bi')
        document.getElementById(outputfield).classList.add('bi-patch-check')
        signuptxt.setAttribute("readonly", "true");
    }
    return result.verified
}


async function verifyphone(phone) {
    const data = { phone: document.getElementById(phone).value };
    if (data.phone.length != 10) {
        alert("please give a valid number")
        document.getElementById(phone).value = "";
        return;
    }
    const result = await fetch('/authenticate/verifyPhone', {
        method: 'post',
        headers: {
            "Content-Type": "application/json" // Note the colon after "content-type" and the correct header name "Content-Type"
        },
        body: JSON.stringify(data)
    }
    )
        .then((res) => {
            return res.json()
        }
        )
        .catch()
    
    let signuptxt = document.getElementById('Signup_Email_Phone');

    if (result.verified) {
        
        while (document.getElementById('Signup_phone_Bt').classList.length > 0) {
            document.getElementById('Signup_phone_Bt').classList.remove(document.getElementById('Signup_phone_Bt').classList.item(0));
        }
        document.getElementById('Signup_phone_Bt').classList.add('btn')
        document.getElementById('Signup_phone_Bt').classList.add('btn-danger')
        document.getElementById('Signup_phone_Bt').classList.add('bi')
        document.getElementById('Signup_phone_Bt').classList.add('bi-search')
        alert("The number you entered is already Exist")
    }
    else {
        
        while (document.getElementById('Signup_phone_Bt').classList.length > 0) {
            document.getElementById('Signup_phone_Bt').classList.remove(document.getElementById('Signup_phone_Bt').classList.item(0));
        }
        document.getElementById('Signup_phone_Bt').classList.add('btn')
        document.getElementById('Signup_phone_Bt').classList.add('btn-success')
        document.getElementById('Signup_phone_Bt').classList.add('bi')
        document.getElementById('Signup_phone_Bt').classList.add('bi-patch-check')
        signuptxt.setAttribute("readonly", "true");
    }
    console.log(result.verified);
    return result.verified
}

function matchPassword( firstText,retypeText,resultbtn){
if(document.getElementById(firstText).value==document.getElementById(retypeText).value){
    while (document.getElementById(resultbtn).classList.length > 0) {
        document.getElementById(resultbtn).classList.remove(document.getElementById(resultbtn).classList.item(0));
    }
    document.getElementById(resultbtn).classList.add('btn')
    document.getElementById(resultbtn).classList.add('btn-success')
    document.getElementById(resultbtn).classList.add('bi')
    document.getElementById(resultbtn).classList.add('bi-patch-check')
    return true;
}

else{
    while (document.getElementById(resultbtn).classList.length > 0) {
        document.getElementById(resultbtn).classList.remove(document.getElementById(resultbtn).classList.item(0));
    }
    document.getElementById(resultbtn).classList.add('btn')
    document.getElementById(resultbtn).classList.add('btn-danger')
    document.getElementById(resultbtn).classList.add('bi')
    document.getElementById(resultbtn).classList.add('bi-patch-check')
        return false;
}
}

async function changeaPassword(email,newpassword){
const userName = document.getElementById(email).value;
const NewPassword = document.getElementById(newpassword).value;
const confirmuserName =await verifyEmail('idVerifyEmail-Phone','Signup_Email_Bt');
const confirmNewPassword = await verifyPassword('idNewPasswordtext','idNewPasswordbtn');
const confirmmatchPassword = await matchPassword('idNewPasswordtext','idRetypePasswordtext','idRetypePasswordbtn')
data = {
    username :userName,
    password:NewPassword 
}
 
if(!confirmuserName&&confirmNewPassword&&confirmmatchPassword ){
    const result =await fetch('/authenticate/changePassword',{method:'post',headers:{"Content-type":"Application/json"},body:JSON.stringify(data)})
    .then(res=>{
        return res.json()
    })
    .catch((err)=>{
        console.log(err)
    })
     
    if(result.updated){
        swal({
            title: "success",
            text: "Password changed successfully!",
            icon: "success",
            button: "OK",
          }).then((value)=>{
            window.location.reload();
          }) 
    }
}
else {
    swal({
        title: "failed",
        text: "Wrong or incvalid credentials !",
        icon: "error",
        button: "OK",
      })  
}



}

async function changeaPassword(email,newpassword){
    
    const userName = document.getElementById(email).value;
    const NewPassword = document.getElementById(newpassword).value;
data = {
    username :userName,
    password:NewPassword 
}
if( userName&&NewPassword ){
    const result =await fetch('/authenticate/changePassword',{method:'post',headers:{"Content-type":"Application/json"},body:JSON.stringify(data)})
    .then(res=>{
        return res.json()
    })
    .catch((err)=>{
        console.log(err)
    })
     
    if(result.updated){
        swal({
            title: "success",
            text: "Password changed successfully!",
            icon: "success",
            button: "OK",
          }).then((value)=>{
            window.location.reload();
          }) 
    }
}
else {
    swal({
        title: "failed",
        text: "Wrong or incvalid credentials !",
        icon: "error",
        button: "OK",
      })  
}



}





function verifyPassword(inputElement,outputElement) {
    let password = document.getElementById(inputElement).value;
    let uppercase = false;
    let lowercase = false;
    let specialcase = false;
    let numerics = false;
    let verified = false;
    for (i = 0; i < password.length; i++) {
        const temp = password.charCodeAt(i);
        if (temp >= 32 && temp <= 47) specialcase = true;
        if (temp >= 48 && temp <= 57) numerics = true;
        if (temp >= 58 && temp <= 64) specialcase = true;
        if (temp >= 65 && temp <= 90) uppercase = true;
        if (temp >= 91 && temp <= 96) specialcase = true;
        if (temp >= 98 && temp <= 122) lowercase = true;
        if (temp >= 123 && temp <= 126) specialcase = true;
    }
    if ((uppercase) && (lowercase) && (specialcase) && (numerics) && password.length >= 8) {
        
        
        while (document.getElementById(outputElement).classList.length > 0) {
            document.getElementById(outputElement).classList.remove(document.getElementById(outputElement).classList.item(0));
        }
        document.getElementById(outputElement).classList.add('btn')
        document.getElementById(outputElement).classList.add('btn-success')
        document.getElementById(outputElement).classList.add('bi')
        document.getElementById(outputElement).classList.add('bi-patch-check')
        return verified = true;
    }
    else {

        
        alert("Password Should be alphanumeric and minimum length of 8 ");
        document.getElementById('outputElement').value = "";
        document.getElementById('User_Login_password').focus();
        document.getElementById(outputElement).style.color = 'red';  
       
        return verified = false;
    }


}
function nothing() {
    document.getElementById('User_Login_password').focus();
}


async function verifyUser(username) {
    const data = { username: document.getElementById(username).value }
    
    if (data.username.length < 10) {
        alert("username should be minimum 10 charecter ")
        document.getElementById(username).value = "";
        return;
    }
    else {

        const result = await fetch('/authenticate/verifyUser', { method: 'post', headers: { "Content-Type": "Application/json" }, body: JSON.stringify(data) })
            .then((res) => {
                return res.json();
            })
            .catch()
        
        let signuptxt = document.getElementById('Signup_User_Name');
        if (result.verified) {
            
            while (document.getElementById('Signup_username_Bt').classList.length > 0) {
                document.getElementById('Signup_username_Bt').classList.remove(document.getElementById('Signup_username_Bt').classList.item(0));
            }
            document.getElementById('Signup_username_Bt').classList.add('btn')
            document.getElementById('Signup_username_Bt').classList.add('btn-danger')
            document.getElementById('Signup_username_Bt').classList.add('bi')
            document.getElementById('Signup_username_Bt').classList.add('bi-search')
        }
        else {
            
            while (document.getElementById('Signup_username_Bt').classList.length > 0) {
                document.getElementById('Signup_username_Bt').classList.remove(document.getElementById('Signup_username_Bt').classList.item(0));
            }
            document.getElementById('Signup_username_Bt').classList.add('btn')
            document.getElementById('Signup_username_Bt').classList.add('btn-success')
            document.getElementById('Signup_username_Bt').classList.add('bi')
            document.getElementById('Signup_username_Bt').classList.add('bi-patch-check')
            signuptxt.setAttribute("readonly", "true");
        }
        return result.verified
    }
}

async function verifyandupdate() {
    let email=true;
    let phone=true;
     
    
    let password=true;

     setTimeout(async () => { email =  await verifyEmail('Signup_Email_text','Signup_Email_Bt') }, 50);
     setTimeout(async () => { phone =await verifyphone('Signup_Email_Phone') }, 150);
     
     setTimeout(async() => {
    let verified ;
    
    data = {
        firstName: document.getElementById('Signup_name_text').value,
        email: document.getElementById('Signup_Email_text').value,
        contactNumber: document.getElementById('Signup_Email_Phone').value,
        username: document.getElementById('Signup_User_Name').value,
        password: document.getElementById('User_Login_password').value,
        isAdmin: false,
        Active: false,
        isLoggedIn: false
    }
    if (!document.getElementById('Signup_name_text').value) {
        document.getElementById('Signup_name_text').style.borderColor = 'red';
        document.getElementById('IdInfoText').innerText='All fields are Mandatory'
    }
    console.log(email,phone,(document.getElementById('Signup_name_text').value));
    if(!email&&(document.getElementById('Signup_name_text').value)){
        openModal()
        console.log(data);
        setTimeout(async () => {
            let result = await fetch('/authenticate/signup', {
                method: 'post',
                headers: {
                    "Content-Type": "application/json" // Note the colon after "content-type" and the correct header name "Content-Type"
                },
                body: JSON.stringify(data)
            })
                .then((res) => {
                   return res.json();
                }
                )
                .catch()
                
             
            closeModal();
            if (result.saved) {
                 
                document.getElementById("Bt_verifyOtp").hidden = false;
                document.getElementById("Bt_verifyOtp").click();
                document.getElementById("Bt_verifyOtp").hidden = true;
                document.getElementById("idverify_Email").value = data.email; 
                document.getElementById("idverify_Email").disabled = true;
                executeOtpTimer("Bt_resendOtp");
                document.getElementById("IdInfoText").innerText='Click Signup for sign in '
            }
    }, 0);}
},500);    

}

if (document.getElementById("idlaunchPageText")){
    document.getElementById("idlaunchPageText").addEventListener('load',AnimatedTextforhotelLogin("idlaunchPageText"))
}
if (document.getElementById("idanimatedMessageLogin")){
document.getElementById("idanimatedMessageLogin").addEventListener('load',AnimatedTextforhotelLogin("idanimatedMessageLogin"))
}
if (document.getElementById("idanimatedMessageLogin")){
    document.getElementById("idanimatedMessageLogin").addEventListener('load',AnimatedTextforhotelLogin("idanimatedMessageLogin"))
    }
    
function AnimatedTextforhotelLogin(name){
        
    const message = document.getElementById(name).textContent;
    const text = document.getElementById(name);
    let i=0
    function animation (){
        if(i< message.length){
            setTimeout( () => {
                text.innerText = message.slice(0,i+1);
                i++
                animation()
            }, 50);
        }
        
    }
    animation ();

}
if(document.getElementById('Signup_name_text')){
document.getElementById('Signup_name_text').addEventListener('change',()=>{
    if (!document.getElementById('Signup_name_text').value) document.getElementById('Signup_name_text').style.borderColor = "red"
    else document.getElementById('Signup_name_text').style.borderColor = "grey"
})}

async function vedurelogin( email,password){
const data = {
    userName:document.getElementById(email).value,
    password:document.getElementById(password).value
}
const result = await fetch('/authenticate/hotelLogin',{method:'post',headers:{"Content-Type":"Application/json"},body:JSON.stringify(data)})
.then(res=>{
    return res.json()
})
.catch(err=>{
    console.log(err);
})
if(result.verified&& result.companyActive){
    window.location.href=result.path
}
else if(result.verified&& !result.companyActive){
    document.getElementById('idInfoVendureLogin').textContent ='Your Company id is not Active, please contact the admin'
}
else{
    document.getElementById('idInfoVendureLogin').textContent =result.message
}
}



  function executeOtpTimer(btnElement) {
    const otpButton = document.getElementById(btnElement);
    let time = 60;
    otpButton.value = time;
    async function updateTimer() {
      if (time >= 0) {
        otpButton.textContent = time + "Sec remains ";
        time--;
        const timer = setTimeout(updateTimer, 1000);
      }
      else {
        otpButton.textContent ='Resend OTP'
        data ={
            email:document.getElementById("idverify_Email").value
        }
         
        const result =await fetch('/authenticate/SetOtpExpired',{method:'post',headers:{"content-Type":"Application/json"},body:JSON.stringify(data)})
        .then(res=>{
            return res.json()
        })
        .catch(err=>{
            console.log(err)
        })
        
        if(result.expired){
            swal({
                title: "Expired",
                text: "Otp Expired!",
                icon: "error",
                button: "OK",
              })
        }
      }
    }
  
    updateTimer();
  }
async function resendOtp(email,count){
     
     
    data ={
        email: document.getElementById(email).value
    }
    if (document.getElementById(email).value){ 
    const result =await fetch('/authenticate/resendOtp',{method:'post',headers:{"Content-Type":"Application/json"},body:JSON.stringify(data)})
    .then(res=>{
        return res.json()
    })
    .catch(err=>{
        console.log(err);
    })
    if(result.created){
        executeOtpTimer(count);

    }
}
else alert('emaid id could not be blank ')
}






function CancelEntry() {
    window.location.reload();
}

async function Authenticateuser() {

    let username = document.getElementById('login_DIv1_Username').value;
    let password = document.getElementById('login_DIv1_Password').value;
    data = {
        username: username,
        password: password
    };
    
    let result = await fetch('/signin', {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then((res) => {
            return res.json();
        }
        )
        .catch()
    if (result.verified) {
        window.location.href = '/floor'
    }
    else {
        alert("Wrong username or Password ")
        window.location.reload();
    }
}

function loadHome() {
    window.location.href = '/'
}

function upload(file) {
    const formData = new FormData()
    formData.append("file", file)
}
function deleteFloor() {
    const data = { floorindex: document.getElementById('Bt_Save_Update').value }
    let sure = confirm('do you want to delete ?')
    if (sure) {
        const result = fetch('/floorMaster/deleteFloor', {
            method: 'POST',
            headers: { 'Content-Type': "Application/json" },
            body: JSON.stringify(data)
        })
            .then(result => {
                
                window.location.reload();
            })
            .catch()
    }
}

async function searchitem() {
    
    const data = { searchvalue: document.getElementById('idSearchname').value }
    const result = await fetch('/floorMaster/search', {
        method: 'POST',
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(data)
    })
        .then((searchresult) => {
            return searchresult.json();
        })
        .catch(err => {
            
        })
    
}


async function SaveFloor(id) {
    const data = {
        floorname: document.getElementById('floorname').value,
        floornumber: document.getElementById('floornumber').value,
        floorsize: document.getElementById('floorsize').value,
        username: document.getElementById('loggeduser').innerHTML,
        floorindex: document.getElementById('Bt_Save_Update').value
    }
    
    const result = await fetch('/floorMaster/savefloor', {
        method: 'POST',
        headers: { "content-type": "Application/json" },
        body: JSON.stringify(data)
    })
        .then((saved) => {
            return saved.json()
        }

        )
        .catch((err) => {
            
        })
    
    if (result == 'Updated') {
        alert('Floor already Exist,Updated')
        window.location.reload();
    }
    else if (result == 'Saved') {
        alert('Floor Saved successfully')
        window.location.reload();
    }
    else if (result == 'false') {
        alert('Floor didnt saved')
        window.location.reload();
    }
    else window.location.reload();


}

function MakeReadonlyTrue() {
    document.getElementById('floorname').readOnly = true;
    document.getElementById('floornumber').readOnly = true;
    document.getElementById('floorsize').readOnly = true;
}
function MakeReadonlyFalse() {
    document.getElementById('floorname').readOnly = false;
    document.getElementById('floornumber').readOnly = false;
    document.getElementById('floorsize').readOnly = false;
}

function loadData(id) {
    const data = JSON.parse(id)
    MakeReadonlyTrue();

    document.getElementById('floorname').value = data.floorname
    document.getElementById('floornumber').value = data.floornumber
    document.getElementById('floorsize').value = data.floorsize
    document.getElementById('Bt_Save_Update').value = data.floorindex
}

async function Loadpagebyindex(index) {
    await fetch('/floorMaster/loadfloorbypagenumber', {
        method: 'POST',
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify({ index: index })
    })
        .then(data => {

        })
        .catch()
}

async function CheckUser() {
    const data = {
        SerchKey: document.getElementById("login_DIv1_Username").value
    }
    
    const result = await fetch('/authenticate/loadUserCompany', {
        method: 'POST',
        headers: { "content-type": "Application/json" },
        body: JSON.stringify(data)
    })
        .then(res => {
            return res.json();
        }).catch(err => {
        })
    const companylist = document.getElementById("idCompanyList");
    while (companylist.options.length >0) {
        companylist.remove(0);
    }
    for (let i = 0; i < result.length; i++) {
        const newOption = document.createElement('option');
        newOption.textContent = result[i].lastName
        newOption.value = result[i].CompanyID
        companylist.appendChild(newOption)
    }
}



 async function verifyOneTimePassword(email,otp){
    data ={
        email:   document.getElementById(email).value,
        otp : document.getElementById(otp).value
    }
    const result = await fetch('/authenticate/confirmOtp',{method:'post',headers:{"Content-Type":"Application/json"},body:JSON.stringify(data)})
    .then(res=>{
        return res.json()
    })
    .catch(err=>{
        console.log(err)
    })
    return result ;
 }
 
async function tryOtp(  passwordDiv,otpDiv,email,idbtResendOtp ){
    document.getElementById(passwordDiv).hidden = true
    document.getElementById(otpDiv).hidden = false;
    await resendOtp(email,idbtResendOtp)
} 



async function validateuserUsingOtp(email,newOtp,alertbtn,newPassword,retypePassword){
const result = await verifyOneTimePassword(email,newOtp);
if(result.verified){
    document.getElementById(alertbtn).classList.add('btn')
    document.getElementById(alertbtn).classList.add('btn-success')
    document.getElementById(alertbtn).classList.add('bi')
    document.getElementById(alertbtn).classList.add('bi-patch-check')
    document.getElementById(newPassword).readOnly = false;
    document.getElementById(retypePassword).readOnly = false
}
else{
    document.getElementById(alertbtn).classList.add('btn')
    document.getElementById(alertbtn).classList.add('btn-danger')
    document.getElementById(alertbtn).classList.add('bi')
    document.getElementById(alertbtn).classList.add('bi-patch-check')
    document.getElementById(newPassword).readOnly = true;
    document.getElementById(retypePassword).readOnly = true
}

}

                    
async function verifyOtp(dofunc){
    const result = await verifyOneTimePassword( "idverify_Email" , "id_otp" )
    if (result.verified && dofunc=='reset'){
         
        const myElement = document.getElementById("openResetModal");
        const email = document.getElementById("idVerifyEmailOtp");
        myElement.click()
        email.value = data.email;
        email.disabled = true;
    }
    else if (result.verified && dofunc=='validate'){
         
        swal({
            title: "success",
            text: "otp Validation Success!",
            icon: "success",
            button: "OK",
          }).then((value)=>{
            window.location.reload();
          })
    }
}

function openModal(){
   let modal =new bootstrap.Modal(document.getElementById('idShowProgressModal'))
    
   modal.show();
   console.log('going to open')
   return
}

function closeModal(){
    document.getElementById('idShowProgressModal').style.display = 'none';
    document.querySelector('#idShowProgressModal .btn-close').click();
    // let modal =new bootstrap.Modal(document.getElementById('idShowProgressModal')) 
    // modal.hide();
    console.log('going to close')
    return
}

  