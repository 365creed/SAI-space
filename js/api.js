const API_URL = "YOUR_GOOGLE_SCRIPT_URL";


async function sendReservation(data){

try{

const res = await fetch(API_URL,{

method:"POST",
body:JSON.stringify(data),
headers:{
"Content-Type":"application/json"
}

});

return await res.json();

}catch(e){

console.error(e);

}

}
