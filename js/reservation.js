const form = document.querySelector("#reservationForm");

if(form){

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const data = {

name:form.name.value,
phone:form.phone.value,
space:form.space.value,
date:form.date.value,
time:form.time.value

};


if(!data.date || !data.time){

alert("날짜와 시간을 선택하세요");

return;

}


await sendReservation(data);

alert("예약 요청이 접수되었습니다.");

form.reset();

});

}
