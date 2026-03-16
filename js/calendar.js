const startHour = 9;
const endHour = 21;

const slotContainer = document.querySelector("#timeSlots");

function createTimeSlots(){

if(!slotContainer) return;

for(let h=startHour; h<=endHour; h++){

let hour = String(h).padStart(2,"0");

let slot = document.createElement("button");

slot.className = "time-slot";

slot.innerText = `${hour}:00`;

slot.dataset.time = `${hour}:00`;

slot.addEventListener("click",()=>{

document.querySelectorAll(".time-slot")
.forEach(s=>s.classList.remove("active"));

slot.classList.add("active");

document.querySelector("input[name=time]").value = slot.dataset.time;

});

slotContainer.appendChild(slot);

}

}

createTimeSlots();
