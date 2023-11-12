
function readmoreplan(Element,toggleElement){
     
    document.getElementById(Element).style.display='none'
    document.getElementById(toggleElement).style.display='contents' 
   } 
   function readlesspaln(Element,toggleElement){  
     
    document.getElementById(toggleElement).style=null
    document.getElementById(toggleElement).style.display='none'
    document.getElementById(Element).style.display=''
    document.getElementById(Element).style.height='20px'
    document.getElementById(Element).style.overflow='hidden'
     
   }  

   function CalculateRentWithPlan(input){
     
    let temp = input.split(',')
    
    const SalesDetails ={
            planCapacity:parseInt( temp[0]),
            planAmount:parseInt( temp[1]),
            planExtraCharge:parseInt( temp[2]),
            rentExtraCharge:parseInt( temp[3]),
            rentExtraPersonCount:parseInt( temp[4]),
            rentSpecialAmount:parseInt( temp[5]),
            rentTotalDays:parseInt( temp[6]),
            rentTotalRooms:parseInt( temp[7]),
            totalOccupancy:parseInt( temp[8]),
            planIndex:temp[9]
    }
    const rent = SalesDetails.rentTotalRooms*SalesDetails.rentTotalDays*SalesDetails.rentSpecialAmount;
    const rentExtraPax = ((SalesDetails.totalOccupancy-(SalesDetails.rentTotalRooms*2)>0?SalesDetails.totalOccupancy-(SalesDetails.rentTotalRooms*2):0) )*SalesDetails.rentExtraCharge*SalesDetails.rentTotalDays;
    const planExtraPax= SalesDetails.totalOccupancy- (SalesDetails.planCapacity*SalesDetails.rentTotalRooms)
    const planCharge = SalesDetails.planAmount*SalesDetails.rentTotalRooms*SalesDetails.rentTotalDays;
    let planExtraCharge = planExtraPax* SalesDetails.planExtraCharge*SalesDetails.rentTotalDays;
    if(planExtraCharge<0) planExtraCharge=0;
    const TotalAmount = rent+rentExtraPax+planCharge+planExtraCharge;
     
     
    document.getElementById('idplanAmountReservation').innerText = planCharge+planExtraCharge+'/-';
    document.getElementById('idfinalAmount').innerText = TotalAmount ;
    document.getElementById("idCheckinPlan").innerText =  SalesDetails.planIndex;
     
    document.getElementById('idTablePlan').textContent = planCharge/SalesDetails.rentTotalDays ;
    document.getElementById('idTablePlanTotal').textContent = planCharge ;
    document.getElementById('idTablePlanExtra').textContent = planExtraCharge/SalesDetails.rentTotalDays ;
    document.getElementById('idTablePlanExtraTotal').textContent = planExtraCharge ;
    document.getElementById('idTabletotal').textContent = TotalAmount ;
    
}

async function saveReservation(bookings) {
  let data = JSON.parse(bookings);
  data.checkinplan = document.getElementById("idCheckinPlan").innerText;
  data.totalAmount = document.getElementById("idfinalAmount").innerText?document.getElementById("idfinalAmount").innerText:0;
  data.specialRequest = document.getElementById("idSpecialRequest").value;
  data.totalRent =   document.getElementById("idSpecialRequest").value;
  openModal();
   

  try {
    const result = await fetch("/reservation/savereservation", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    .then((res)=>{
      return res.json()
    })
    .catch(err=>{
      console.log(err);
    })

    closeModal() 
    let bookingDetails = JSON.parse(bookings)
    const reservationResult = result
    bookingDetails.reservationNumber = result.result.reference; 
    bookingDetails.reservedDetails = result.result;
    // Handle Razorpay payment
    handleRazorpayPayment(reservationResult, bookingDetails);
  } catch (error) {
    console.error("Error saving reservation:", error);
    // Handle the error as needed, e.g., display an error message to the user
  }
}

function handleRazorpayPayment(result, bookingDetails) {
  var options = {
    key: "rzp_test_6damh00ndxLBqq",
    amount: result.totalAmount*100 ,
    currency: "INR",
    name: "Machintko",
    order_id: result.order.id,
    handler: async function (response) {
      response.bookingDetails = bookingDetails;
      response.order_id = result.order.id;
      response.paymentReferance = result.result.reference
       
      // Handle successful payment
      const confirmed = await confirmPayment(response);
       
    },
  };

  var rzp1 = new Razorpay(options);
  rzp1.on("payment.failed", function (response) {
    alert(response)
  });
  rzp1.open();

}

async function verifyPaymentStatus(BookidID){
const result = await fetch('/custom/getPayment',{method:'POST',headers:{"Content-Type":"Application/json"},body:JSON.stringify({reservationNumber:BookidID})})
.then((res)=>{
  return res
})
.catch(err=>{
   
})
}

async function confirmPayment(paymentDetails) {
  openModal();
    const confirmPaymentResponse = await fetch("/reservation/confirmPayment", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentDetails),
    }).then(confirmPaymentResult=>{
      return confirmPaymentResult.json()
    })
    .catch((err)=>{
      console.log(err);
    })
 
  if(confirmPaymentResponse.status){
     
    window.location.assign('/custom/Home');
  }
  else{
    swal({
      title: "failed",
      text: "Payment failed please try again",
      icon: "error",
      button: "OK",
    })
 
  }
}



