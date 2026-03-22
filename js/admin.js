if (localStorage.getItem("admin") !== "true") {
  alert("관리자 로그인 후 접근 가능합니다.");
  location.href = "login.html";
}

const SPACE_LABELS = {
  "3F_BIG_LECTURE": "3층 큰강의실",
  "2F_SMALL_LECTURE": "2층 소강의실",
  "2F_SMALL_ROOM_1": "작은방1",
  "2F_SMALL_ROOM_2": "작은방2",
  "2F_SMALL_ROOM_3": "작은방3",
};

let members = [];
let programs = [];

function genId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function notifyProgramsChanged() {
  window.dispatchEvent(new CustomEvent("sai-programs-changed"));
}

function saveMembers() {
  localStorage.setItem("members", JSON.stringify(members));
}

function savePrograms() {
  localStorage.setItem("programSchedules", JSON.stringify(programs));
  notifyProgramsChanged();
}

function migratePrograms(list) {
  let changed = false;
  const out = list.map((p) => {
    if (p.date && p.spaceKey && p.title) {
      return { id: p.id || genId("p"), ...p };
    }
    changed = true;
    return {
      id: p.id || genId("p"),
      title: p.title || "프로그램",
      time: p.time || "",
      date: p.date || "2026-01-15",
      spaceKey: p.spaceKey || "3F_BIG_LECTURE",
    };
  });
  return { list: out, changed };
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
  document.getElementById("memberName").value = "";
  document.getElementById("memberPhone").value = "";
  alert(`회원번호 발급 완료: ${id}`);
}

function addProgram() {
  const dateEl = document.getElementById("programDate");
  const title = document.getElementById("programTitle").value.trim();
  const time = document.getElementById("programTime").value.trim();
  const spaceKey = document.getElementById("programSpace").value;
  const date = dateEl.value;

  if (!date || !title) {
    alert("날짜와 프로그램명을 입력하세요");
    return;
  }

  programs.push({
    id: genId("p"),
    date,
    spaceKey,
    title,
    time: time || "",
  });
  savePrograms();
  renderPrograms();
  document.getElementById("programTitle").value = "";
  document.getElementById("programTime").value = "";
}

function deleteProgram(id) {
  if (!confirm("이 일정을 삭제할까요?")) return;
  programs = programs.filter((p) => p.id !== id);
  savePrograms();
  renderPrograms();
}

function renderMembers() {
  const list = document.getElementById("memberList");
  if (!list) return;
  list.innerHTML = "";
  if (members.length === 0) {
    list.innerHTML = "<li>등록된 회원이 없습니다.</li>";
    return;
  }

  members.forEach((member) => {
    const li = document.createElement("li");
    li.textContent = `${member.name} · ${member.id}${member.phone ? " · " + member.phone : ""}`;
    list.appendChild(li);
  });
}

function renderPrograms() {
  const tbody = document.getElementById("programTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const sorted = [...programs].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    return (a.title || "").localeCompare(b.title || "");
  });

  if (sorted.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="5" style="text-align:center;color:#888;">등록된 일정이 없습니다.</td>';
    tbody.appendChild(tr);
    return;
  }

  sorted.forEach((p) => {
    const tr = document.createElement("tr");
    ["td", "td", "td", "td", "td"].forEach((_, i) => tr.appendChild(document.createElement("td")));
    tr.cells[0].textContent = p.date || "";
    tr.cells[1].textContent = SPACE_LABELS[p.spaceKey] || p.spaceKey || "";
    tr.cells[2].textContent = p.title || "";
    tr.cells[3].textContent = p.time || "";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-tiny";
    btn.textContent = "삭제";
    btn.addEventListener("click", () => deleteProgram(p.id));
    tr.cells[4].appendChild(btn);
    tbody.appendChild(tr);
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function exportMembersCsv() {
  const rows = [["id", "name", "phone"], ...members.map((m) => [m.id, m.name || "", m.phone || ""])];
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "sai-members.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

function parseCsvRows(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim());
  const rows = [];
  for (const line of lines) {
    const row = [];
    let cur = "";
    let inQ = false;
    for (let j = 0; j < line.length; j++) {
      const c = line[j];
      if (c === '"' && line[j + 1] === '"') {
        cur += '"';
        j++;
        continue;
      }
      if (c === '"') {
        inQ = !inQ;
        continue;
      }
      if (!inQ && c === ",") {
        row.push(cur);
        cur = "";
        continue;
      }
      cur += c;
    }
    row.push(cur);
    rows.push(row);
  }
  return rows;
}

function importMembersCsv(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const rows = parseCsvRows(String(reader.result));
      if (rows.length < 2) {
        alert("CSV에 데이터 행이 없습니다.");
        return;
      }
      const header = rows[0].map((h) => h.trim().toLowerCase());
      const iId = header.indexOf("id");
      const iName = header.indexOf("name");
      const iPhone = header.indexOf("phone");
      if (iId < 0 || iName < 0) {
        alert("첫 행에 id, name 컬럼이 필요합니다. (phone 선택)");
        return;
      }
      const byId = new Map(members.map((m) => [m.id, m]));
      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row[iId]) continue;
        const rec = {
          id: row[iId].trim(),
          name: row[iName] != null ? row[iName].trim() : "",
          phone: iPhone >= 0 && row[iPhone] != null ? row[iPhone].trim() : "",
        };
        byId.set(rec.id, rec);
      }
      members = Array.from(byId.values());
      saveMembers();
      renderMembers();
      alert(`회원 ${members.length}명 반영되었습니다.`);
    } catch (e) {
      alert("CSV 처리 실패: " + e.message);
    }
    input.value = "";
  };
  reader.readAsText(file, "UTF-8");
}

function renderStats() {
  const panel = document.getElementById("statsPanel");
  if (!panel) return;
  let o = {};
  try {
    o = JSON.parse(localStorage.getItem("saiPageStats") || "{}");
  } catch {
    o = {};
  }
  const entries = Object.entries(o).filter(([k]) => !k.startsWith("_"));
  entries.sort((a, b) => (b[1] || 0) - (a[1] || 0));
  const total = o._total != null ? o._total : entries.reduce((s, [, v]) => s + (Number(v) || 0), 0);
  const last = o._lastVisit || o._last || "-";

  let html = `<p><strong>누적 페이지뷰(합계)</strong>: ${total}</p>`;
  html += `<p style="font-size:12px;color:#666;">마지막 기록: ${escapeHtml(String(last))}</p>`;
  html += "<table><tbody>";
  if (entries.length === 0) {
    html += "<tr><td>아직 집계 데이터가 없습니다. 사이트 페이지를 방문하면 쌓입니다.</td></tr>";
  } else {
    entries.slice(0, 30).forEach(([path, n]) => {
      html += `<tr><td>${escapeHtml(path)}</td><td style="text-align:right">${Number(n) || 0}</td></tr>`;
    });
  }
  html += "</tbody></table>";
  panel.innerHTML = html;
}

function resetStats() {
  if (!confirm("접속 통계를 초기화할까요?")) return;
  localStorage.removeItem("saiPageStats");
  renderStats();
}

async function mergeMembersFromData() {
  try {
    const res = await fetch("data/members.json", { cache: "no-cache" });
    if (!res.ok) return;
    const remote = await res.json();
    if (!Array.isArray(remote)) return;
    let local = JSON.parse(localStorage.getItem("members")) || [];
    const byId = new Map(local.map((m) => [m.id, m]));
    remote.forEach((m) => {
      if (m.id && !byId.has(m.id)) {
        byId.set(m.id, { id: m.id, name: m.name || "", phone: m.phone || "" });
      }
    });
    members = Array.from(byId.values());
    saveMembers();
  } catch (e) {
    console.warn("members.json", e);
  }
}

async function initAdmin() {
  try {
    members = JSON.parse(localStorage.getItem("members")) || [];
  } catch {
    members = [];
  }
  await mergeMembersFromData();
  try {
    members = JSON.parse(localStorage.getItem("members")) || [];
  } catch {
    members = [];
  }
  try {
    programs = JSON.parse(localStorage.getItem("programSchedules")) || [];
  } catch {
    programs = [];
  }
  const mig = migratePrograms(programs);
  programs = mig.list;
  if (mig.changed) savePrograms();

  const dateEl = document.getElementById("programDate");
  if (dateEl && !dateEl.value) {
    dateEl.value = new Date().toISOString().slice(0, 10);
  }

  renderMembers();
  renderPrograms();
  renderStats();
}

function logout() {
  localStorage.removeItem("admin");
  location.href = "login.html";
}

initAdmin();
