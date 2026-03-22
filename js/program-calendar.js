(function () {
  function getPrograms() {
    try {
      return JSON.parse(localStorage.getItem("programSchedules")) || [];
    } catch {
      return [];
    }
  }

  function filterPrograms(list, filter) {
    return list.filter((p) => {
      if (!p || !p.date) return false;
      if (filter === "all") return true;
      if (filter === "big") return p.spaceKey === "3F_BIG_LECTURE";
      if (filter === "small_lecture") return p.spaceKey === "2F_SMALL_LECTURE";
      if (filter === "small_rooms") return /^2F_SMALL_ROOM_[123]$/.test(p.spaceKey || "");
      return true;
    });
  }

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
    return list.filter((p) => p.date === iso);
  }

  function render(container, filter) {
    if (!container) return;

    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    if (container.dataset.year) year = parseInt(container.dataset.year, 10);
    if (container.dataset.month) month = parseInt(container.dataset.month, 10) - 1;

    const programs = filterPrograms(getPrograms(), filter);

    const wrap = document.createElement("div");
    wrap.className = "prog-cal";

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
      render(container, filter);
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
      const cell = document.createElement("div");
      cell.className = "prog-cal-cell";
      if (day === null) {
        cell.classList.add("prog-cal-cell--empty");
        grid.appendChild(cell);
        return;
      }
      const num = document.createElement("span");
      num.className = "prog-cal-daynum";
      num.textContent = String(day);
      cell.appendChild(num);
      const evs = eventsOnDate(programs, year, month, day);
      if (evs.length) {
        cell.classList.add("prog-cal-cell--has");
        const dots = document.createElement("div");
        dots.className = "prog-cal-dots";
        evs.slice(0, 4).forEach(() => {
          const s = document.createElement("span");
          dots.appendChild(s);
        });
        cell.appendChild(dots);
        cell.title = evs.map((e) => `${e.title}${e.time ? " · " + e.time : ""}`).join("\n");
        cell.style.cursor = "pointer";
        cell.addEventListener("click", () => {
          const first = evs[0];
          const sp = encodeURIComponent(first.spaceKey || "3F_BIG_LECTURE");
          const dt = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          window.location.href = `reservation.html?date=${dt}&space=${sp}&from=program`;
        });
      }
      grid.appendChild(cell);
    });
    wrap.appendChild(grid);

    container.replaceChildren(wrap);
  }

  function renderAll() {
    document.querySelectorAll("[data-calendar]").forEach((el) => {
      const f = el.getAttribute("data-calendar") || "all";
      render(el, f);
    });
  }

  document.addEventListener("DOMContentLoaded", renderAll);
  window.addEventListener("pageshow", () => setTimeout(renderAll, 0));
  window.addEventListener("storage", (e) => {
    if (e.key === "programSchedules") renderAll();
  });
  window.addEventListener("sai-programs-changed", renderAll);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") renderAll();
  });

  window.refreshProgramCalendars = renderAll;
})();
