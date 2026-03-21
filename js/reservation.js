document.addEventListener("DOMContentLoaded",()=>{

let memberChecked = false;

window.checkMember = () => {
  const input = document.getElementById("memberId");
  const id = input ? input.value.trim() : "";

  if (!id) {
    alert("회원번호를 입력하세요");
    input && input.focus();
    return;
  }

  memberChecked = true;
  alert("회원번호 확인 완료");
};

const form=document.getElementById("reservationForm");

if(!form) return;

form.addEventListener("submit",(e)=>{

e.preventDefault();

if(!memberChecked){
  alert("예약 진행 전 회원번호를 확인하세요");
  return;
}

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
