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

function normalizeFacilityToken(token) {
  return String(token || "")
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase();
}

function facilityIconSvg(kind) {
  // Keep SVGs inline to avoid missing assets.
  switch (kind) {
    case "wifi":
      return `
        <svg class="facility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 9a12 12 0 0 1 14 0"></path>
          <path d="M8.5 12.5a7 7 0 0 1 7 0"></path>
          <circle cx="12" cy="18" r="1.3" fill="currentColor" stroke="none"></circle>
        </svg>
      `;
    case "projector":
      return `
        <svg class="facility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="12" rx="2"></rect>
          <circle cx="12" cy="11" r="2.2" fill="currentColor" stroke="none"></circle>
          <path d="M8 21h8"></path>
        </svg>
      `;
    case "microphone":
      return `
        <svg class="facility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z"></path>
          <path d="M19 11a7 7 0 0 1-14 0"></path>
          <path d="M12 18v3"></path>
        </svg>
      `;
    case "ac":
      return `
        <svg class="facility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14 14.5V6a2 2 0 0 0-4 0v8.5"></path>
          <circle cx="12" cy="17" r="3" fill="currentColor" stroke="none"></circle>
          <path d="M5 4l2 2"></path>
          <path d="M19 4l-2 2"></path>
        </svg>
      `;
    case "display":
      return `
        <svg class="facility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="6" width="18" height="12" rx="2"></rect>
          <path d="M8 21h8"></path>
        </svg>
      `;
    case "whiteboard":
      return `
        <svg class="facility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2"></rect>
          <path d="M8 9h8"></path>
          <path d="M8 13h6"></path>
          <path d="M8 17h8"></path>
        </svg>
      `;
    case "table":
      return `
        <svg class="facility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="10" width="18" height="6" rx="2"></rect>
          <path d="M6 16v4"></path>
          <path d="M10 16v4"></path>
          <path d="M14 16v4"></path>
          <path d="M18 16v4"></path>
        </svg>
      `;
    case "chair":
      return `
        <svg class="facility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 6a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v8H9V6z"></path>
          <path d="M9 14H6a2 2 0 0 0-2 2v4"></path>
          <path d="M16 14h2a2 2 0 0 1 2 2v4"></path>
        </svg>
      `;
    case "light":
      return `
        <svg class="facility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 18h6"></path>
          <path d="M10 22h4"></path>
          <path d="M8 14a6 6 0 1 1 8 0l-1 2H9l-1-2z"></path>
        </svg>
      `;
    case "writing-board":
      return `
        <svg class="facility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="4" y="6" width="16" height="14" rx="2"></rect>
          <path d="M8 10h8"></path>
          <path d="M8 14h6"></path>
          <path d="M16 18l2 1"></path>
        </svg>
      `;
    case "outlet":
      return `
        <svg class="facility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="7" y="2" width="10" height="20" rx="2"></rect>
          <circle cx="11" cy="12" r="1.4" fill="currentColor" stroke="none"></circle>
          <circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none"></circle>
          <path d="M10 22h4"></path>
        </svg>
      `;
    default:
      return `
        <svg class="facility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 8v4"></path>
          <path d="M12 16h.01"></path>
        </svg>
      `;
  }
}

function resolveFacilityBadgeMeta(token) {
  const t = normalizeFacilityToken(token);
  const raw = String(token || "").trim();

  if (!raw) return { label: "", icon: facilityIconSvg("default") };

  if (t.includes("와이파이") || t.includes("wi-fi") || t.includes("wifi")) return { label: "와이파이", icon: facilityIconSvg("wifi") };
  if (t.includes("빔프로젝터")) return { label: "빔프로젝터", icon: facilityIconSvg("projector") };
  if (t.includes("무선마이크") || t.includes("마이크")) return { label: "무선마이크", icon: facilityIconSvg("microphone") };
  if (t.includes("냉난방")) return { label: "냉난방", icon: facilityIconSvg("ac") };
  if (t.includes("tv") || t.includes("모니터")) return { label: raw, icon: facilityIconSvg("display") };
  if (t.includes("화이트보드")) return { label: "화이트보드", icon: facilityIconSvg("whiteboard") };
  if (t.includes("테이블")) return { label: "테이블", icon: facilityIconSvg("table") };
  if (t.includes("의자")) return { label: "의자", icon: facilityIconSvg("chair") };
  if (t.includes("조명")) return { label: raw.includes("개별") ? "개별 조명" : "조명", icon: facilityIconSvg("light") };
  if (t.includes("필기보드")) return { label: "필기보드", icon: facilityIconSvg("writing-board") };
  if (t.includes("전원") || t.includes("콘센트")) return { label: "전원 콘센트", icon: facilityIconSvg("outlet") };

  return { label: raw, icon: facilityIconSvg("default") };
}

function renderFacilityBadges(container, facilityText) {
  if (!container) return;

  const rawText = String(facilityText || "");
  const tokens = rawText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  container.innerHTML = "";

  const seen = new Set();
  tokens.forEach((token) => {
    const norm = normalizeFacilityToken(token);
    if (!norm || seen.has(norm)) return;
    seen.add(norm);

    const meta = resolveFacilityBadgeMeta(token);
    if (!meta.label) return;

    const badge = document.createElement("span");
    badge.className = "facility-badge";
    badge.setAttribute("role", "listitem");
    badge.title = meta.label;
    badge.innerHTML = meta.icon + '<span class="facility-badge-text"></span>';
    const textEl = badge.querySelector(".facility-badge-text");
    if (textEl) textEl.textContent = meta.label;
    container.appendChild(badge);
  });
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
    const facilityTextEl = document.getElementById("facilityText");
    if (facilityTextEl) facilityTextEl.textContent = info.facility || "";
    const facilityBadgesEl = document.getElementById("facilityBadges");
    renderFacilityBadges(facilityBadgesEl, info.facility);
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
