document.addEventListener("DOMContentLoaded",()=>{

const container = document.getElementById("timeSlots");
if(!container) return;

const start = 9;
const end = 21;

for(let h=start;h<=end;h++){

let hour = String(h).padStart(2,"0");

let btn = document.createElement("button");

btn.className="time-slot";
btn.innerText=hour+":00";

btn.onclick=()=>{

document.querySelectorAll(".time-slot")
.forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

document.querySelector("input[name=time]").value=hour+":00";

}

container.appendChild(btn);

}

});
