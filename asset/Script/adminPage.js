 
 window.onload = function () {
    myloadGraph();
  };
  function myloadGraph() {

    const Graphdata = document.getElementById("idGraphData").value;
       
    const booking = JSON.parse(Graphdata);
    const labels = booking.map(item => item.transdate.split('T')[0])
    const data = booking.map(item => item.totalRoom)

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'RESERVATION STATUS',
          data: data,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });


  }


async function loadHotelByPagebyNumber(skip){
  const data ={
    skip:parseInt(skip)*5,
    limit:(parseInt(skip)*5)+5
  }
  const result = await fetch ('/admin/loadHotelByPagebyNumber',{method:'POST',headers:{"Content-type":"Application/json"},body:JSON.stringify(data)})
  .then(res=>{
    return res.json()
  })
  .catch(err=>{
    console.log(err)
  })
let innerHTML=''  
result.forEach(hotel => {
  innerHTML = innerHTML + `   
               
                  <td> 
                      <small class="text text-primary " style="font-size: 20px;">
                     ${hotel.firstName}
                      
                     </small> <br>
                      <small>
                      ${hotel.email}
                      </small> <br>
                      <small>
                      ${hotel.contactNumber}
                      </small>
                  </td>
                  <td> 
                      <small>
                      ${hotel.totalRooms}
                      </small>
                  </td>
                  <td> 
                      <small>
                      ${hotel.activeTariff}
                      </small>
                  </td>
                  <td> 
                      <small>
                      ${hotel.activePlans}
                      </small>
                  </td>
                   <br>
               `
});
document.getElementById('idAdmincompanyList').innerHTML = ''
document.getElementById('idAdmincompanyList').innerHTML = innerHTML;

}


async function activateCompany(CompanyID){

const data = {
  CompanyID:CompanyID
}
console.log(data);
const result = await fetch('/admin/activateCompany',{method:'post',headers:{"Content-Type":"Application/json"},body:JSON.stringify(data)})
.then(res=>{
  return res.json()
})
.catch(err=>{
  console.log(err);
})
console.log(result)

const buttonActivate = document.getElementById('idBtadminActivateCompany'+CompanyID)
console.log(buttonActivate);
if(result.active){
    buttonActivate.classList.remove('text-success');
    buttonActivate.classList.add('text-danger');
    buttonActivate.classList.remove('bi-play-fill');
    buttonActivate.classList.add('bi-pause-circle-fill');
    
}
else{
    buttonActivate.classList.remove('text-danger');
    buttonActivate.classList.add('text-success');
    buttonActivate.classList.remove('bi-pause-circle-fill');
    buttonActivate.classList.add('bi-play-fill');
}


}




     function loadActiveuser(users){
        document.getElementById('idSearchtextUser').value=''  
        const activeOnly = document.getElementById('idadminActiveUser');
        const display = document.getElementById('idlistusers');
        alluser = JSON.parse(users) 
        let innerhtml=''
        if(activeOnly.checked){
          alluser.forEach(user => {
              if(user.Active){
              innerhtml+= `<div class="container-fluid d-flex border btn  rounded ">
                          <div class="container-fluid w-100 col-9 " disabled >
                              <small class="text-left btn w-100 rounded text-dark justify-content-start " style="font-size: 10px;" >
                                  <small class="text-primary" style="font-size: 15px;"> ${user.firstName}  </small> <br>
                                  ${user.contactNumber} <br>
                                  ${user.email} 
                                 
                              </small> 
                          </div>
                          <div class="btn col-3  w-100 rounded text-secondary justify-content-start ">
                                
                                      <button  value="${user.hrId}" onclick="activateUser(event.target.value)" id="idbtActivateuser${user.hrId}" class="btn text-danger bi bi-pause-circle-fill"  > </button>
                               
                          </div>
                      </div>`  
                  }
          });
        }
        else{
          alluser.forEach(user => {
              let switchclass='';
              if(user.Active){
                  switchclass = 'text-danger bi-pause-circle-fill'
              }
              else {
                  switchclass = 'text-success bi-play-fill'
              }
  
  
              innerhtml+= `<div class="container-fluid d-flex border btn  rounded ">
                          <div class="container-fluid w-100 col-9 " disabled >
                              <small class="text-left btn w-100 rounded text-dark justify-content-start " style="font-size: 10px;" >
                                  <small class="text-primary" style="font-size: 15px;"> ${user.firstName}  </small> <br>
                                  ${user.contactNumber} <br>
                                  ${user.email} 
                                 
                              </small> 
                          </div>
                          <div class="btn col-3  w-100 rounded text-secondary justify-content-start ">
                                    
                                      <button  value="${user.hrId}" onclick="activateUser(event.target.value)" id="idbtActivateuser${user.hrId}" class="btn bi ${switchclass}   "  > </button>
                               
                          </div>
                      </div>  `
                   
          });
      }
      display.innerHTML = innerhtml;
  }
  
  async function activateUser(userId){
      
  data ={
      hrId:userId
  }
  const result = await fetch('/admin/disableUser',{method:'post',headers:{"content-Type":"Application/json"},body:JSON.stringify(data)})
  .then(res=>{
      return res.json()
  })
  .catch(err=>{
      console.log(err);
  })
  
  const buttonActivate = document.getElementById('idbtActivateuser'+userId)
  console.log(buttonActivate);
  if(result.active){
      buttonActivate.classList.remove('text-success');
      buttonActivate.classList.add('text-danger');
      buttonActivate.classList.remove('bi-play-fill');
      buttonActivate.classList.add('bi-pause-circle-fill');
      
  }
  else{
      buttonActivate.classList.remove('text-danger');
      buttonActivate.classList.add('text-success');
      buttonActivate.classList.remove('bi-pause-circle-fill');
      buttonActivate.classList.add('bi-play-fill');
  }
   
  }
  
  async function searchUser(searchText){
  const display = document.getElementById('idlistusers');
  let innerhtml = ''
  const data = JSON.parse(document.getElementById('idadminActiveUser').value)
  console.log(searchText);
  const filteredData = data.filter(item=>{
      const lowerCaseFirstName = item.firstName.toLowerCase();  
      return lowerCaseFirstName.startsWith(searchText);
  })
  
  console.log(filteredData);
  filteredData.forEach(user => {
              let switchclass='';
              if(user.Active){
                  switchclass = 'text-danger bi-pause-circle-fill'
              }
              else {
                  switchclass = 'text-success bi-play-fill'
              }
  
  
              innerhtml+= `<div class="container-fluid d-flex border btn  rounded ">
                          <div class="container-fluid w-100 col-9 " disabled >
                              <small class="text-left btn w-100 rounded text-dark justify-content-start " style="font-size: 10px;" >
                                  <small class="text-primary" style="font-size: 15px;"> ${user.firstName}  </small> <br>
                                  ${user.contactNumber} <br>
                                  ${user.email} 
                                 
                              </small> 
                          </div>
                          <div class="btn col-3  w-100 rounded text-secondary justify-content-start ">
                                    
                                      <button  value="${user.hrId}" onclick="activateUser(event.target.value)" id="idbtActivateuser${user.hrId}" class="btn bi ${switchclass}   "  > </button>
                               
                          </div>
                      </div>  `
                   
          });
          display.innerHTML = innerhtml;
  
  }


  
async function adminlogin( email,password){
    const data = {
        userName:document.getElementById(email).value,
        password:document.getElementById(password).value
    }
    const result = await fetch('/admin/adminLogin',{method:'post',headers:{"Content-Type":"Application/json"},body:JSON.stringify(data)})
    .then(res=>{
        return res.json()
    })
    .catch(err=>{
        console.log(err);
    })
    console.log(result);
      if(result.verified&&result.isAdmin&&result.userActive){
        window.location.href=result.path
      }
      else if(result.verified&& !result.isAdmin){
        document.getElementById("idMessageBarAdminlogin").textContent = 'you are not an admin' 
      }
      else if(result.verified&&!result.userActive){
        document.getElementById("idMessageBarAdminlogin").textContent ='Your id is not active'
    
    }
}

   