document.addEventListener("DOMContentLoaded",()=>{

const form=document.getElementById("reservationForm");

if(!form) return;

form.addEventListener("submit",(e)=>{

e.preventDefault();

const name=form.name.value;
const phone=form.phone.value;
const date=form.date.value;
const time=form.time.value;

if(!date||!time){

alert("날짜와 시간을 선택하세요");
return;

}

alert("예약 요청이 접수되었습니다.");

form.reset();

});

});
