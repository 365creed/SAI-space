const TEST_MEMBER_ID = "19840314";

const defaultSpaceData = {
  "3F_BIG_LECTURE": {
    title: "3층 큰강의실",
    type: "공간유형: 강연/세미나 홀",
    area: "공간면적: 약 45평",
    time: "예약시간: 최소 1시간부터, 09:00 ~ 21:00",
    image: "assets/img/seminar.png",
    facility: "빔프로젝터, 무선마이크, 냉난방, 와이파이",
    notice: "음향 장비 사용 후 원위치, 종료 10분 전 정리 필수",
    refund: "이용 7일 전 100%, 3일 전 50%, 당일 환불 불가",
  },
  "2F_SMALL_LECTURE": {
    title: "2층 소강의실",
    type: "공간유형: 소규모 강의/워크숍",
    area: "공간면적: 약 22평",
    time: "예약시간: 최소 1시간부터, 09:00 ~ 21:00",
    image: "assets/img/meeting.png",
    facility: "TV/모니터, 화이트보드, 냉난방, 와이파이",
    notice: "음식물 반입 가능(냄새 강한 음식 제외), 벽면 부착 금지",
    refund: "이용 5일 전 100%, 2일 전 50%, 당일 환불 불가",
  },
  "2F_SMALL_ROOM_1": {
    title: "2층 작은방 1",
    type: "공간유형: 소모임/스터디 룸",
    area: "공간면적: 약 8평",
    time: "예약시간: 최소 1시간부터, 09:00 ~ 21:00",
    image: "assets/img/space3.png",
    facility: "테이블, 의자, 개별 조명, 와이파이",
    notice: "최대 수용인원 준수, 종료 후 쓰레기 분리배출",
    refund: "이용 3일 전 100%, 1일 전 50%, 당일 환불 불가",
  },
  "2F_SMALL_ROOM_2": {
    title: "2층 작은방 2",
    type: "공간유형: 코칭/멘토링 룸",
    area: "공간면적: 약 8평",
    time: "예약시간: 최소 1시간부터, 09:00 ~ 21:00",
    image: "assets/img/small-room2.png",
    facility: "테이블, 의자, 필기보드, 와이파이",
    notice: "정숙 유지, 비품 훼손 시 배상 책임 발생",
    refund: "이용 3일 전 100%, 1일 전 50%, 당일 환불 불가",
  },
  "2F_SMALL_ROOM_3": {
    title: "2층 작은방 3",
    type: "공간유형: 소규모 프로젝트 룸",
    area: "공간면적: 약 8평",
    time: "예약시간: 최소 1시간부터, 09:00 ~ 21:00",
    image: "assets/img/small-room3.png",
    facility: "테이블, 의자, 전원 콘센트, 와이파이",
    notice: "공용공간 소음 유발 금지, 냉난방 종료 확인 필수",
    refund: "이용 3일 전 100%, 1일 전 50%, 당일 환불 불가",
  },
};

function mapSpacesJson(arr) {
  const o = {};
  arr.forEach((s) => {
    if (!s.key) return;
    o[s.key] = {
      title: s.title,
      type: s.type,
      area: s.area,
      time: s.time,
      image: s.image,
      facility: s.facility,
      notice: s.notice,
      refund: s.refund,
    };
  });
  return o;
}

async function mergeMembersFromData() {
  try {
    const res = await fetch("data/members.json", { cache: "no-cache" });
    if (!res.ok) return;
    const remote = await res.json();
    if (!Array.isArray(remote)) return;
    const key = "members";
    let local = JSON.parse(localStorage.getItem(key)) || [];
    const seen = new Set(local.map((m) => m.id));
    remote.forEach((m) => {
      if (m.id && !seen.has(m.id)) {
        local.push({ id: m.id, name: m.name || "", phone: m.phone || "" });
        seen.add(m.id);
      }
    });
    localStorage.setItem(key, JSON.stringify(local));
  } catch (e) {
    console.warn("members.json", e);
  }
}

async function loadSpaceData() {
  try {
    const res = await fetch("data/spaces.json", { cache: "no-cache" });
    if (!res.ok) return defaultSpaceData;
    const arr = await res.json();
    if (!Array.isArray(arr) || !arr.length) return defaultSpaceData;
    return mapSpacesJson(arr);
  } catch (e) {
    console.warn("spaces.json", e);
    return defaultSpaceData;
  }
}

function ensureTestMember() {
  const key = "members";
  let members = JSON.parse(localStorage.getItem(key)) || [];
  if (!members.some((m) => m.id === TEST_MEMBER_ID)) {
    members.push({ id: TEST_MEMBER_ID, name: "예약 테스트(사전등록)", phone: "" });
    localStorage.setItem(key, JSON.stringify(members));
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await mergeMembersFromData();
  ensureTestMember();

  const spaceData = await loadSpaceData();

  const form = document.getElementById("reservationForm");
  const memberInput = document.getElementById("memberId");
  const status = document.getElementById("memberCheckStatus");
  const fieldset = document.getElementById("reservationFieldset");
  const locked = document.getElementById("reservationLockedContent");
  const spaceSelect = form ? form.querySelector("select[name=space]") : null;

  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const qSpace = params.get("space");
  const qDate = params.get("date");
  if (spaceSelect && qSpace && spaceData[qSpace]) {
    spaceSelect.value = qSpace;
  }
  const dateInput = form.querySelector('input[name="date"]');
  if (dateInput && qDate) {
    dateInput.value = qDate;
  }

  function setLockedPanel(show) {
    if (!locked) return;
    locked.hidden = !show;
    locked.setAttribute("aria-hidden", show ? "false" : "true");
  }

  function renderSpaceDetail(spaceKey) {
    const info = spaceData[spaceKey];
    if (!info) return;

    document.getElementById("spaceTitle").textContent = info.title;
    document.getElementById("spaceType").textContent = info.type;
    document.getElementById("spaceArea").textContent = info.area;
    document.getElementById("spaceTime").textContent = info.time;
    document.getElementById("spaceImage").src = info.image;
    document.getElementById("facilityText").textContent = info.facility;
    document.getElementById("noticeText").textContent = info.notice;
    document.getElementById("refundText").textContent = info.refund;
  }

  if (spaceSelect) {
    renderSpaceDetail(spaceSelect.value);
    spaceSelect.addEventListener("change", () => renderSpaceDetail(spaceSelect.value));
  }

  let memberChecked = false;
  setLockedPanel(false);

  if (params.get("from") === "program" && status) {
    status.textContent = "프로그램에서 연결되었습니다. 회원번호 인증 후 예약을 진행하세요.";
  }

  window.checkMember = () => {
    const id = memberInput ? memberInput.value.trim() : "";
    if (!id) {
      alert("회원번호를 입력하세요");
      if (memberInput) memberInput.focus();
      return;
    }

    const members = JSON.parse(localStorage.getItem("members")) || [];
    const exists = members.some((member) => member.id === id);

    if (!exists) {
      memberChecked = false;
      if (fieldset) fieldset.disabled = true;
      setLockedPanel(false);
      if (status) status.textContent = "등록된 회원번호가 아닙니다. 관리자에게 회원가입 요청 후 진행해주세요.";
      return;
    }

    memberChecked = true;
    if (fieldset) fieldset.disabled = false;
    setLockedPanel(true);
    if (status) status.textContent = `회원번호 확인 완료: ${id}`;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!memberChecked) {
      alert("회원번호 확인 후 예약을 진행해주세요");
      return;
    }

    const date = form.date.value;
    const time = form.time.value;
    if (!date || !time) {
      alert("날짜와 시간을 선택하세요");
      return;
    }

    const spaceKey = form.space.value;
    const payload = {
      memberId: memberInput ? memberInput.value.trim() : "",
      name: form.name.value,
      phone: form.phone.value,
      space: spaceKey,
      spaceLabel: spaceData[spaceKey]?.title || spaceKey,
      date,
      time,
      submittedAt: new Date().toISOString(),
    };

    let extra = "";
    if (typeof window.sendReservationRequest === "function") {
      const result = await window.sendReservationRequest(payload);
      if (result && result.ok && !result.skipped) {
        extra = "\n원격 서버로 전송되었습니다.";
      } else if (result && result.skipped) {
        extra = "";
      } else if (result && !result.ok) {
        extra = "\n(원격 전송에 실패했을 수 있습니다. 관리자에게 문의하세요.)";
      }
    }

    alert(`예약 요청이 접수되었습니다.${extra}`);
    form.reset();
    if (spaceSelect) renderSpaceDetail(spaceSelect.value);
  });
});
