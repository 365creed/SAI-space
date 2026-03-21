const MEMBER_VERIFIED_KEY = "saiReservationMemberOk";

function getStoredMembers() {
  try {
    return JSON.parse(localStorage.getItem("members")) || [];
  } catch {
    return [];
  }
}

function checkMember() {
  const input = document.getElementById("memberId");
  const msg = document.getElementById("memberGateMsg");
  const gate = document.getElementById("memberGate");
  const section = document.getElementById("reservationSection");
  if (!input || !msg || !section) return;

  const raw = (input.value || "").trim();
  if (!raw) {
    msg.textContent = "회원번호를 입력해 주세요.";
    return;
  }

  const members = getStoredMembers();
  const ok = members.some((m) => String(m.id).trim().toUpperCase() === raw.toUpperCase());

  if (!ok) {
    msg.textContent = "등록된 회원번호가 아닙니다. 관리자에게 문의해 주세요.";
    sessionStorage.removeItem(MEMBER_VERIFIED_KEY);
    return;
  }

  sessionStorage.setItem(MEMBER_VERIFIED_KEY, "1");
  msg.textContent = "확인되었습니다. 아래에서 예약 정보를 입력해 주세요.";
  section.hidden = false;
  if (gate) gate.classList.add("member-gate--done");
}

function tryRestoreMemberSession() {
  if (sessionStorage.getItem(MEMBER_VERIFIED_KEY) !== "1") return;
  const section = document.getElementById("reservationSection");
  const gate = document.getElementById("memberGate");
  const msg = document.getElementById("memberGateMsg");
  if (section) section.hidden = false;
  if (gate) gate.classList.add("member-gate--done");
  if (msg) msg.textContent = "회원 확인이 유지되었습니다.";
}

document.addEventListener("DOMContentLoaded", () => {
  tryRestoreMemberSession();

  const form = document.getElementById("reservationForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (sessionStorage.getItem(MEMBER_VERIFIED_KEY) !== "1") {
      alert("먼저 회원번호로 예약 진행을 눌러 주세요.");
      return;
    }

    const name = form.name.value;
    const phone = form.phone.value;
    const date = form.date.value;
    const time = form.time.value;

    if (!date || !time) {
      alert("날짜와 시간을 선택하세요");
      return;
    }

    alert("예약 요청이 접수되었습니다.");
    form.reset();
    document.querySelectorAll(".time-slot.active").forEach((b) => b.classList.remove("active"));
    if (form.querySelector("input[name=time]")) form.querySelector("input[name=time]").value = "";
  });
});
