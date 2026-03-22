if (localStorage.getItem("admin") !== "true") {
  alert("관리자 로그인 후 접근 가능합니다.");
  location.href = "login.html";
}

let members = [];
let programs = [];

function saveMembers() {
  localStorage.setItem("members", JSON.stringify(members));
}

function savePrograms() {
  localStorage.setItem("programSchedules", JSON.stringify(programs));
}

function createMember() {
  const name = document.getElementById("memberName").value.trim();
  const phone = document.getElementById("memberPhone").value.trim();
  if (!name) {
    alert("회원 이름을 입력하세요");
    return;
  }

  const id = `M${Date.now().toString().slice(-6)}`;
  members.push({ id, name, phone });
  saveMembers();
  renderMembers();
  alert(`회원번호 발급 완료: ${id}`);
}

function addProgram() {
  const title = document.getElementById("programTitle").value.trim();
  const time = document.getElementById("programTime").value.trim();
  if (!title || !time) {
    alert("프로그램명과 운영 시간을 입력하세요");
    return;
  }
  programs.push({ title, time });
  savePrograms();
  renderPrograms();
}

function renderMembers() {
  const list = document.getElementById("memberList");
  list.innerHTML = "";
  if (members.length === 0) {
    list.innerHTML = "<li>등록된 회원이 없습니다.</li>";
    return;
  }

  members.forEach((member) => {
    const li = document.createElement("li");
    li.textContent = `${member.name} / ${member.id}${member.phone ? ` / ${member.phone}` : ""}`;
    list.appendChild(li);
  });
}

function renderPrograms() {
  const list = document.getElementById("programList");
  list.innerHTML = "";
  if (programs.length === 0) {
    list.innerHTML = "<li>등록된 프로그램 일정이 없습니다.</li>";
    return;
  }

  programs.forEach((program) => {
    const li = document.createElement("li");
    li.textContent = `${program.title} (${program.time})`;
    list.appendChild(li);
  });
}

function logout() {
  localStorage.removeItem("admin");
  location.href = "login.html";
}

async function mergeMembersFromData() {
  try {
    const res = await fetch("data/members.json", { cache: "no-cache" });
    if (!res.ok) return;
    const remote = await res.json();
    if (!Array.isArray(remote)) return;
    let local = JSON.parse(localStorage.getItem("members")) || [];
    const seen = new Set(local.map((m) => m.id));
    remote.forEach((m) => {
      if (m.id && !seen.has(m.id)) {
        local.push({ id: m.id, name: m.name || "", phone: m.phone || "" });
        seen.add(m.id);
      }
    });
    localStorage.setItem("members", JSON.stringify(local));
  } catch (e) {
    console.warn("members.json", e);
  }
}

async function initAdmin() {
  await mergeMembersFromData();
  members = JSON.parse(localStorage.getItem("members")) || [];
  programs = JSON.parse(localStorage.getItem("programSchedules")) || [];
  renderMembers();
  renderPrograms();
}

initAdmin();
