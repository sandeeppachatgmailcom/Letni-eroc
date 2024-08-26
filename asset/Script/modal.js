async function loginvendure(){
    const data = {Username : document.getElementById('idUserName').value ,
    Password : document.getElementById('idUserPassword').value }
    
    
    const  result = await fetch ('/authenticate/vendurelogin',{method:'post',headers:{"Content-Type":"Application/json"},body:JSON.stringify(data)})
    .then( res=>{
        return res.json()
    })
    .catch(err=>{
        
    })
    
    window.location.assign("/vedurehomepage/loadhomepage");
    
  }
  async function signinCustomer(notify){
    const data = {
        userName:document.getElementById("idUserNameCustomer").value,
         password:document.getElementById("idUserPasswordcustomer").value,
    }
    const result =await fetch('/authenticate/custFetchLogin',{method:'POST',headers:{"Content-type":"Application/json"},body:JSON.stringify(data)})
    .then(res=>{
        return res.json()
    })
    .catch((err)=>{
        console.log(err)
    })
    if(result.userActive && result.verified){
       window.location.reload();
    }
    if( !result.verified){
       document.getElementById(notify).textContent= result.message
    }
    let innerhtml = `<ul class="navbar-nav ms-auto mb-2 mb-lg-0">
    <li class="nav-item"><a class="nav-link active" aria-current="page" href="#!">Home</a></li>
    <li class="nav-item"><a class="nav-link" href="#!">About</a></li>
    <li class="nav-item"><a class="nav-link" href="#!">Contact</a></li>
    <li class="nav-item"><a class="nav-link" href="/authenticate/signup">Signup</a></li>
    <button id="idloggedusermenubar" value="" class="btn"  ></button>
    <button id="idloggedusermenubar" type="button" onclick="logout()" value="${result.firstname}" class="btn btn-success bi bi-power" >${result.user}</button>
  </ul>`

  document.getElementById("navbarSupportedContent").innerHTML=innerhtml;
  } 
  
  async function verifyUserbeforeConfirm(){
    const data = {
         userName:'',
         password:'',
    }
    const result =await fetch('/authenticate/custFetchLogin',{method:'POST',headers:{"Content-type":"Application/json"},body:JSON.stringify(data)})
    .then(res=>{
        return res.json()
    })
    .catch((err)=>{
        console.log(err)
    })
    
    console.log(result);
    if(result.userActive && result.verified){
        const formId = document.getElementById('idconfirmReservationsbutton');
       
        formId.click()

    }
    if( !result.verified){
        //document.getElementById('customerLogin').modal('show')
        $('#customerLogin').modal('show');
    }
     
  } 