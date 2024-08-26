 

async function saveImagetoCollection(inputString){
    const temp = inputString.split(" ");

    imageInput =document.getElementById(temp[2]); 
    const saveButton =document.getElementById(temp[3]); 
    console.log(temp,'TEMPIMAGE') 
    let imageForm = new FormData();
    imageForm.append("ImageRecordIndex",temp[0])
    imageForm.append("imageField",temp[1])
    for(let file of imageInput.files  ){
        imageForm.append("currentImage",file)
        }
    const upload = await fetch('/imageDoc/upload',{method:'post',body:imageForm})
    .then(res=>{
        return res.json()
    })
    .catch(err=>{
        console.log(err);
    })
    console.log(upload);
    if(upload.saved){
        swal({
            title: "success",
            text: upload.message,
            icon: "success",
            button: "OK",
          }).then(()=>{
            saveButton.style.display='none'
          })
    }
    else if(upload.update){
        swal({
            title: "success",
            text: upload.message,
            icon: "success",
            button: "OK",
          }).then(((value)=>saveButton.style.display='none'))
    }
    else if(upload.found){
        swal({
            title: "success",
            text: upload.message,
            icon: "success",
            button: "OK",
          }).then(((value)=>saveButton.style.display='none'))
    }
} 

async function SaveCompany() {

    let companyform = new FormData();
    companyform.append("firstname", document.getElementById("idFirstName").value)
    companyform.append("CompanyID", document.getElementById("idCompanyID").value)
    companyform.append("lastName", document.getElementById("idlastName").value)
    companyform.append("contactNumber", document.getElementById("idcontactNumber").value)
    companyform.append("secondaryNumber", document.getElementById("idsecondaryNumber").value)
    companyform.append("email", document.getElementById("idemail").value)
    companyform.append("buildingNumber", document.getElementById("idbuildingNumber").value)
    companyform.append("BuildingNameName", document.getElementById("idBuildingNameName").value)
    companyform.append("StreetName", document.getElementById("idStreetName").value)
    companyform.append("district", document.getElementById("iddistrict").value)
    companyform.append("city", document.getElementById("idcity").value)
    companyform.append("pincode", document.getElementById("idpincode").value)
    companyform.append("state", document.getElementById("idstate").value)
    companyform.append("country", document.getElementById("idcountry").value)
    companyform.append("Active", document.getElementById("idActive").checked)
    companyform.append("pancard", document.getElementById("idpancard").value)
    companyform.append("RegisteredDate", document.getElementById("iddor").value)
    companyform.append("createduser", document.getElementById("loggeduser").value)
    companyform.append("Companydiscription", document.getElementById("idCompanydiscription").value)

    const compImageInput2 = document.getElementById('IdCompanyImages2');
    for (let file of compImageInput2.files) {
        companyform.append("roomiMages", file);
    }
    const compImageInput = document.getElementById('IdCompanyImages1');
    for (let file of compImageInput.files) {
        companyform.append("roomiMages", file);
    }


    const result = await fetch('/Company/SaveCompany', { method: 'POST', body: companyform }).
        then(res => {
            return res.json();
        }).catch(err => {
            console.log(err);
        })
    console.log(result);
    if (result) {
        window.location.reload();
    }
}

function convertToUpperCase() {
    var input = document.getElementById("myInput");
    input.value = input.value.toUpperCase();
}

function loadpage(pagenumber) {

}

 




function uploadImageToParentNew(fileInputId, parentElementId, savebutton,uploadIcon) {

    const fileInput = document.getElementById(fileInputId);
    const parentElement = document.getElementById(parentElementId);
    const saveElement = document.getElementById(savebutton);
    const inputIcon = document.getElementById(uploadIcon);
    
    if (fileInput.files.length > 0) {
        const imageUrl = URL.createObjectURL(fileInput.files[0]);   
        parentElement.style.backgroundImage = `url(${imageUrl})`;
        saveElement.style.display = ''
        
    } else {

        parentElement.style.backgroundImage = 'none';
        //relativeElement.style.backgroundImage = 'none';
    }
}




async function loadCompanies(value) {
    const company = JSON.parse(value);
    console.log(company);
    document.getElementById("idpincode").value = company.pincode;
    await loadPincode();
    document.getElementById("idFirstName").value = company.firstName;
    document.getElementById("idCompanyID").value = company.CompanyID;
    document.getElementById("idlastName").value = company.lastName;
    document.getElementById("idcontactNumber").value = company.contactNumber;
    document.getElementById("idsecondaryNumber").value = company.secondaryNumber;
    document.getElementById("idemail").value = company.email;
    document.getElementById("idbuildingNumber").value = company.buildingNumber;
    document.getElementById("idBuildingNameName").value = company.BuildingName;
    document.getElementById("idStreetName").value = company.StreetName;
    document.getElementById("iddistrict").value = company.district;
    document.getElementById("idcity").value = company.city;
    document.getElementById("idstate").value = company.state;
    document.getElementById("idcountry").value = company.country;
    document.getElementById("idActive").checked = company.Active;
    document.getElementById("idpancard").value = company.pancard;
    document.getElementById("iddor").value = convertToHTMLDatetimeFormat(company.RegisteredDate);
    document.getElementById("idpancard").value = company.pancard;
    document.getElementById("idCompanydiscription").value = company.Companydiscription;
    document.getElementById("IdCompanyImagesbuton2").style.backgroundImage = "url('" + company.image2 + "')";
    document.getElementById("IdCompanyImagesbuton1").style.backgroundImage = "url('" + company.image1 + "')";
    document.getElementById("idShowCompanyImage2").style.backgroundImage = "url('" + company.image2 + "')";
    document.getElementById("idShowCompanyImage1").style.backgroundImage = "url('" + company.image1 + "')";
}
function convertToHTMLDatetimeFormat(inputDateTime) {
    const dateObject = new Date(inputDateTime);

    // Extract date components
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    // Extract time components
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');
    const seconds = String(dateObject.getSeconds()).padStart(2, '0');

    // Format the date and time in 'yyyy-MM-ddThh:mm' format
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
}

async function saveTariffToCompanies(tariffIndex){
    
    const id = tariffIndex;
    
    newTariff = {
        tariffName: document.getElementById(`idCompTariffname+${id}`).value,
        roomRentSingle: document.getElementById(`idRent-Single+${id}`).value,
        specialRent:document.getElementById(`idSpecialRent+${id}`).value,
        extraPerson: document.getElementById(`idExtraPerson+${id}`).value,
        tax: document.getElementById(`IdTaxrate+${id}`).value,
        includeChild: document.getElementById(`idincludeChild+${id}`).checked,
        defaultCheckinplan: document.getElementById(`IdDefaultPlan+${id}`).value,
        username: document.getElementById(`loggeduser`).innerHTML,
        tariffIndex: document.getElementById(`IdTariffIndex+${id}`).value,
        Discription:document.getElementById(`iddiscription+${id}`).value,
         
    }
    console.log(newTariff),'new tariff';
    const result = await fetch('/vedurehomepage/saveTariff',{method:'post',headers:{"Content-Type":"application/json"},body:JSON.stringify(newTariff)})
    .then(res=>{
        return res.json()
    })
    .catch(err=>{
        console.log(err)
    })
    console.log(result);
    if(result.update){
        swal({
            title: "success",
            text: "Tariff updated!",
            icon: "success",
            button: "OK",
          });
        
        //   disabletariffModal(id)
    }
    else if(result.saved){
        swal({
            title: "success",
            text: "Tariff added!",
            icon: "success",
            button: "OK",
          });
        
        //   disabletariffModal(id)
    }
    else if(result.matched){
        swal({
            title: "success",
            text: "No changes found!",
            icon: "success",
            button: "OK",
          });
        
        //   disabletariffModal(id)
    }
}

async function savePlanToCompanies(planid){
    
    const data = {
    planIndex:document.getElementById(`idplanIndex${planid}`).value,
    planName:document.getElementById(`idPlanname${planid}`).value,
    shortName:document.getElementById(`idShortName${planid}`).value,
    maxPax:document.getElementById(`idAllowedPax${planid}`).value,
    amount:document.getElementById(`idPlanAmount${planid}`).value,
    extraCharge:document.getElementById(`idExtraCharge${planid}`).value,
    Creattime:Date.now(),
    user:document.getElementById(`loggeduser`).innerText,
    discription:document.getElementById(`iddiscription${planid}`).value,
    CompanyID:document.getElementById(`idCompanyId${planid}`).innerText 
}
console.log(`idCompanyId${planid}`)
console.log(data);
const result = await fetch ('/vedurehomepage/savePlanToCompanies',{method:'post',headers:{"Content-Type":"Application/json"},body:JSON.stringify(data)})
.then(res=>{
    return res.json()
})
.catch(err=>{
    return (err)
})
console.log(result)
if(result.update){
    swal({
        title: "success",
        text: "Tariff updated!",
        icon: "success",
        button: "OK",
      }).then(((value)=>window.location.reload()))
    
      
}
else if(result.saved){
    swal({
        title: "success",
        text: "Tariff added!",
        icon: "success",
        button: "OK",
      }).then(window.Location.reload());
    
       
}
else if(result.matched){
    swal({
        title: "success",
        text: "No changes found!",
        icon: "success",
        button: "OK",
      });
    
       
}
}

function disabletariffModal(id){
    console.log(id);
    // document.getElementById(`idCompTariffname+${id}`).readOnly =true,
    //document.getElementById(`idRent-Single+${id}`).readOnly =true,
    document.getElementById(`idSpecialRent+${id}`).readOnly =true,
    document.getElementById(`idExtraPerson+${id}`).readOnly =true,
    document.getElementById(`IdTaxrate+${id}`).readOnly =true,
    document.getElementById(`idincludeChild+${id}`).disabled =true,
    document.getElementById(`IdDefaultPlan+${id}`).readOnly =true,
    document.getElementById(`loggeduser`).readOnly =true,
    document.getElementById(`IdTariffIndex+${id}`).readOnly =true,
    document.getElementById(`iddiscription+${id}`).readOnly =true,
    document.getElementById(`idCompanyId`).readOnly =true 
}

function EnabletariiModal(id){
    console.log(id);
    document.getElementById(`idCompTariffname+${id}`).readOnly =false,
    document.getElementById(`idRent-Single+${id}`).readOnly =false,
    document.getElementById(`idSpecialRent+${id}`).readOnly =false,
    document.getElementById(`idExtraPerson+${id}`).readOnly =false,
    document.getElementById(`IdTaxrate+${id}`).readOnly =false,
    document.getElementById(`idincludeChild+${id}`).disabled  =false,
    document.getElementById(`IdDefaultPlan+${id}`).readOnly =false,
    document.getElementById(`loggeduser`).readOnly =false,
    document.getElementById(`IdTariffIndex+${id}`).readOnly =false,
    document.getElementById(`iddiscription+${id}`).readOnly =false,
    document.getElementById(`idCompanyId`).readOnly =false
    console.log(id)
}

async function freezeTariff(tariff){
    const temp = tariff.split(',');
    console.log(temp)
data = {tariffIndex:temp[0],
        CompanyID:temp[1]}
  const result = await fetch('/vedurehomepage/disableTariff',{method:'post',headers:{"Content-Type":"application/json"},body:JSON.stringify(data)})
.then(res=>{
    return res.json()
})
.catch(err=>{
    console.log(err)
}) 
if(result.update){
    swal({
        title: "success",
        text: "Tariff freezed",
        icon: "success",
        button: "OK",
      }).then((value) => {
        window.location.reload()});
    
     
}
else if(result.saved){
    swal({
        title: "success",
        text: "Tariff added!",
        icon: "success",
        button: "OK",
      });
    
      window.location.reload();
}
else if(result.matched){
    swal({
        title: "success",
        text: "No changes found!",
        icon: "success",
        button: "OK",
      });
      window.location.reload();
       
}
}
async function enableplanModal(checkinplanindex){
    console.log(checkinplanindex);
const temp = checkinplanindex.split(',')
    data = {planIndex:temp[0],
            companyId:temp[1]

}
const result = await fetch('/vedurehomepage/activatePlan',{method:'post',headers:{"Content-Type":"Application/json"},body:JSON.stringify(data)})
.then(res=>{
    return res.json()
})
.catch(err=>{
    console.log(err);
})
console.log(result)
 
if(result.update){
    swal({
        title: "success",
        text: "Tariff freezed",
        icon: "success",
        button: "OK",
      }).then((value) => {
        window.location.reload()});
    
     
}
else if(result.saved){
    swal({
        title: "success",
        text: "Tariff added!",
        icon: "success",
        button: "OK",
      }).then((value) => {
        window.location.reload()});
    
      window.location.reload();
}
else if(result.matched){
    swal({
        title: "success",
        text: "No changes found!",
        icon: "success",
        button: "OK",
      }).then((value) => {
        window.location.reload()});

}
}

async function enableTariff(tariff){
  
    const temp = tariff.split(','); 
    console.log(temp)
    data = {tariffIndex:temp[0],
        CompanyID:temp[1]}
    const result = await fetch('/vedurehomepage/enableTariff',{method:'post',headers:{"Content-Type":"application/json"},body:JSON.stringify(data)})
    .then(res=>{
        return res.json()
    })
    .catch(err=>{
        console.log(err)
    }) 
    console.log(result);
    
    if(result.update){
        swal({
            title: "success",
            text: "Tariff Active",
            icon: "success",
            button: "OK",
          }).then((value)=>{
            window.location.reload();
          })
         
    }
    else if(result.saved){
        swal({
            title: "success",
            text: "Tariff Active!",
            icon: "success",
            button: "OK",
          }).then((value)=>{
            window.location.reload();
          }) 
    }
    else if(result.matched){
        swal({
            title: "success",
            text: "No changes found!",
            icon: "success",
            button: "OK",
          }).then((value)=>{
            window.location.reload();
          })
         
         
    }
}  
async function deleteTariffPermanently(tariff){
    const temp = tariff.split(',');
    console.log(temp)
    data = {tariffIndex:temp[0],
        CompanyID:temp[1]}
    const result = await fetch('/vedurehomepage/deletetariffPermanent',{method:'post',headers:{"Content-Type":"application/json"},body:JSON.stringify(data)})
    .then(res=>{
        return res.json()
    })
    .catch(err=>{
        console.log(err)
    }) 
    console.log(result);
    
    if(result.update){
        swal({
            title: "success",
            text: "Tariff freezed",
            icon: "success",
            button: "OK",
          }).then((value) => {
            window.location.reload()});
         
    }
    else if(result.saved){
        swal({
            title: "success",
            text: "Tariff added!",
            icon: "success",
            button: "OK",
          }).then((value) => {
            window.location.reload()});
        
           
    }
    else if(result.matched){
        swal({
            title: "success",
            text: "No changes found!",
            icon: "success",
            button: "OK",
          }).then((value) => {
            window.location.reload()});
         
    }
   
}

function drilldown(iddiv,originsize){
    
const divclass = document.getElementById(iddiv);
let height = originsize+'px';
if(divclass?.style?.overflow=="hidden"){
    divclass.style=""
    divclass.style.overflow='';  
    divclass.style.flexWrap="wrap"  
    divclass.classList.add('flex-wrap')
    divclass.classList.remove('flex-nowrap')
    console.log(divclass.style,divclass.classList)
}
else if (divclass?.style?.overflow ==""){
    divclass.style=""
    divclass.style.overflow='hidden';
    divclass.style.height = height;
    divclass.style.flexWrap="nowrap"
    divclass.classList.remove('flex-wrap')
    divclass.classList.add('flex-nowrap')
    console.log(divclass.style,divclass.classList)

}
 
}

function readlesspaln(Element,toggleElement){  
    document.getElementById(toggleElement).style=null
    document.getElementById(toggleElement).style.display='none'
    document.getElementById(Element).style.display=''
    document.getElementById(Element).style.height='20px'
    document.getElementById(Element).style.overflow='hidden'
   } 

   
function collapse(iddiv,originsize){
     
const divclass = document.getElementById(iddiv);
let height = originsize+'px';
if(divclass.style.height==height){
    divclass.style=""
    divclass.style.overflow='hidden' ;   
    console.log(divclass.style,divclass.classList)
}
else if (divclass.style.height ==""){
    divclass.style="";
    divclass.style.height = height;
    divclass.style.overflow='hidden' ;
    console.log(divclass.style,divclass.classList)

}
 
}
async function switchRoomStatus(roomIndex,buttonID){
const bt = document.getElementById(buttonID)
    const result = await fetch('/Company/switchRoomStatus',{method:'post',headers:{"Content-Type":"Application/json"},body:JSON.stringify({roomIndex:roomIndex})})
    .then(res=>{
        return res.json()
    })
    .catch(err=>{
        console.log(err)
    })
    console.log(result);
    if(result.blocked){
        bt.classList.remove('btn-danger');
        bt.classList.add('btn-success');
        bt.textContent='ON'
    }
    else{
        bt.classList.remove('btn-success');
        bt.classList.add('btn-danger');
        bt.textContent='OFF' 
    }
}

async function loadAvailableRooms(bookidDetails) {
    let tempbooking = JSON.parse(bookidDetails)
    console.log(JSON.parse(bookidDetails));
    const result = await fetch('/vedurehomepage/loadAvailableRooms', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: bookidDetails
    })
    .then((res) => res.json())
    .catch((err) => {
        console.log(err);
    });

    console.log(result);
    console.log(tempbooking.occupancyIndex);

    if (result) {
        const selectList = document.getElementById(`idAvailableRoom${tempbooking.occupancyIndex}`);
        console.log(selectList);
        while (selectList.options.length > 0) {
            selectList.options.remove(0);
        }
        result.forEach((room) => {
            const option = document.createElement('option');
            option.value = room.roomIndex;
            option.innerText = room.roomName;
            selectList.appendChild(option);
        });

    }
}

async function updateReservationWithRoom(bookidDetails) {
    let tempbooking = JSON.parse(bookidDetails)
    const selectList = document.getElementById(`idAvailableRoom${tempbooking.occupancyIndex}`);
    tempbooking.roomIndex=selectList.value;
    console.log(JSON.parse(bookidDetails));
    const result = await fetch('/vedurehomepage/updateReservationWithRoom', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tempbooking)
    })
    .then((res) => res.json())
    .catch((err) => {
        console.log(err);
    });

    console.log(result);
    console.log(tempbooking.occupancyIndex);

    if (result.updated) {
        
        selectList.disabled=true

    }
}

async function unlinkAssignedReservation(occupancyIndex){
    const data = {
        occupancyIndex:occupancyIndex,
         
    }
    const result = await fetch('/hotel/unlinkRoom',{method:'post',headers:{"Content-Type":"Application/json"},body:JSON.stringify(data)}) 
    .then(res=>{
        return res.json()
    })
    .catch(err=>{
        console.log(err);
    })
    console.log(result);
    if(result.unlink){
        window.location.reload();
    }
    }
