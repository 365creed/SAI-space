(function () {
  function monthMatrix(year, monthIndex) {
    const first = new Date(year, monthIndex, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }

  function eventsOnDate(list, year, monthIndex, day) {
    const iso = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return list.filter((p) => p && p.date === iso);
  }

  function truncate(s, n) {
    const t = String(s || "");
    return t.length > n ? t.slice(0, n - 1) + "…" : t;
  }

  function render(container) {
    if (!container || !window.FixedScheduleLib) return;

    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    if (container.dataset.year) year = parseInt(container.dataset.year, 10);
    if (container.dataset.month) month = parseInt(container.dataset.month, 10) - 1;

    const programs = FixedScheduleLib.getMergedProgramsForMonth(year, month);

    const wrap = document.createElement("div");
    wrap.className = "prog-cal admin-cal";

    const nav = document.createElement("div");
    nav.className = "prog-cal-nav";
    const prev = document.createElement("button");
    prev.type = "button";
    prev.textContent = "‹";
    prev.className = "prog-cal-nav-btn";
    prev.setAttribute("aria-label", "이전 달");
    const title = document.createElement("div");
    title.className = "prog-cal-title";
    title.textContent = `${year}년 ${month + 1}월`;
    const next = document.createElement("button");
    next.type = "button";
    next.textContent = "›";
    next.className = "prog-cal-nav-btn";
    next.setAttribute("aria-label", "다음 달");

    function go(delta) {
      month += delta;
      if (month < 0) {
        month = 11;
        year--;
      }
      if (month > 11) {
        month = 0;
        year++;
      }
      container.dataset.year = String(year);
      container.dataset.month = String(month + 1);
      render(container);
    }

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    nav.append(prev, title, next);
    wrap.appendChild(nav);

    const grid = document.createElement("div");
    grid.className = "prog-cal-grid";
    ["일", "월", "화", "수", "목", "금", "토"].forEach((w) => {
      const h = document.createElement("div");
      h.className = "prog-cal-weekday";
      h.textContent = w;
      grid.appendChild(h);
    });

    const cells = monthMatrix(year, month);
    cells.forEach((day) => {
      if (day === null) {
        const empty = document.createElement("div");
        empty.className = "prog-cal-cell prog-cal-cell--empty admin-cal-cell--pad";
        grid.appendChild(empty);
        return;
      }

      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "prog-cal-cell admin-cal-cell";

      const num = document.createElement("span");
      num.className = "prog-cal-daynum";
      num.textContent = String(day);
      cell.appendChild(num);

      const evs = eventsOnDate(programs, year, month, day);
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      if (evs.length) {
        cell.classList.add("prog-cal-cell--has");
        const listEl = document.createElement("div");
        listEl.className = "admin-cal-evlist";
        evs.slice(0, 4).forEach((e) => {
          const row = document.createElement("div");
          row.className = "admin-cal-ev";
          const rawTitle = (e.title || "").replace(/\s*·\s*프로그램\s*$/, "");
          row.textContent = truncate(rawTitle || e.title, 14);
          listEl.appendChild(row);
        });
        if (evs.length > 4) {
          const more = document.createElement("div");
          more.className = "admin-cal-ev admin-cal-ev--more";
          more.textContent = `+${evs.length - 4}`;
          listEl.appendChild(more);
        }
        cell.appendChild(listEl);
        cell.title = evs
          .map((e) => {
            let line = `${e.title}${e.time ? " · " + e.time : ""}`;
            if (e.kind === "fixed" && e.managerName) line += ` · ${e.managerName}`;
            return line;
          })
          .join("\n");
      } else {
        cell.title = `${iso} — 일정 등록`;
      }

      cell.addEventListener("click", () => {
        const dateEl = document.getElementById("programDate");
        if (dateEl) dateEl.value = iso;
        const titleEl = document.getElementById("programTitle");
        if (titleEl) {
          titleEl.focus();
          titleEl.select();
        }
        const form = document.getElementById("admin-oneoff-form");
        if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      grid.appendChild(cell);
    });
    wrap.appendChild(grid);
    container.replaceChildren(wrap);
  }

  function renderAll() {
    document.querySelectorAll("[data-admin-calendar]").forEach((el) => render(el));
  }

  document.addEventListener("DOMContentLoaded", renderAll);
  window.addEventListener("pageshow", () => setTimeout(renderAll, 0));
  window.addEventListener("storage", (e) => {
    if (e.key === "programSchedules" || e.key === "fixedClubSchedules") renderAll();
  });
  window.addEventListener("sai-programs-changed", renderAll);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") renderAll();
  });

  window.renderAdminScheduleCalendar = renderAll;
})();
