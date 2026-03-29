(function () {
  const STORAGE_KEY = "fixedClubSchedules";

  function safeParse(json, fallback) {
    try {
      const v = JSON.parse(json);
      return Array.isArray(v) ? v : fallback;
    } catch {
      return fallback;
    }
  }

  /** 해당 날짜가 그 달에서 몇 번째 같은 요일인지 (1~5) */
  function nthWeekdayOfMonth(year, monthIndex, day) {
    const wd = new Date(year, monthIndex, day).getDay();
    let n = 0;
    for (let i = 1; i <= day; i++) {
      if (new Date(year, monthIndex, i).getDay() === wd) n++;
    }
    return n;
  }

  function normalizeRule(r) {
    if (!r || typeof r !== "object") return null;
    const weekdays = Array.isArray(r.weekdays)
      ? r.weekdays.map((x) => Number(x)).filter((x) => x >= 0 && x <= 6)
      : [];
    let weeksInMonth = r.weeksInMonth;
    if (weeksInMonth != null && !Array.isArray(weeksInMonth)) {
      weeksInMonth = null;
    }
    if (Array.isArray(weeksInMonth)) {
      weeksInMonth = weeksInMonth.map(Number).filter((n) => n >= 1 && n <= 5);
      if (weeksInMonth.length === 0) weeksInMonth = null;
    }

    const programName = String(r.programName || r.clubName || "").trim() || "프로그램";
    return {
      id: String(r.id || "").trim() || "rule_" + Date.now(),
      category: String(r.category || "").trim() || "기타",
      programName,
      weekdays,
      time: String(r.time || "").trim(),
      managerName: String(r.managerName || "").trim(),
      phone: String(r.phone || "").trim(),
      spaceKey: String(r.spaceKey || "2F_SMALL_LECTURE").trim(),
      weeksInMonth,
      calendarSkip: Boolean(r.calendarSkip),
    };
  }

  function ensureSeedFromClubData() {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const seed = window.PROGRAM_SCHEDULE_SEED || window.CLUB_SCHEDULE_SEED;
    if (!seed || !seed.length) return;
    const rules = seed.map(normalizeRule).filter(Boolean);
    saveFixedRules(rules);
  }

  function getFixedRulesFromStorage() {
    ensureSeedFromClubData();
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = safeParse(raw, []);
    return list.map(normalizeRule).filter(Boolean);
  }

  function expandRulesToMonthEvents(rules, year, monthIndex) {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const out = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const wd = new Date(year, monthIndex, d).getDay();
      const iso = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const weekNum = nthWeekdayOfMonth(year, monthIndex, d);

      for (const r of rules) {
        if (r.calendarSkip) continue;
        if (!r.weekdays || r.weekdays.length === 0) continue;
        if (!r.weekdays.includes(wd)) continue;
        if (r.weeksInMonth && r.weeksInMonth.length) {
          if (!r.weeksInMonth.includes(weekNum)) continue;
        }
        const title = `${r.programName || r.clubName || "프로그램"} · 프로그램`;
        out.push({
          id: `fx_${r.id}_${iso}`,
          date: iso,
          spaceKey: r.spaceKey,
          title,
          time: r.time || "",
          kind: "fixed",
          category: r.category,
          managerName: r.managerName,
          phone: r.phone,
          clubRuleId: r.id,
        });
      }
    }
    return out;
  }

  function getOneOffPrograms() {
    try {
      return JSON.parse(localStorage.getItem("programSchedules")) || [];
    } catch {
      return [];
    }
  }

  /** 캘린더용: 일회 일정 + 고정 스케줄 전개(해당 월) */
  function getMergedProgramsForMonth(year, monthIndex) {
    const oneOff = getOneOffPrograms().filter((p) => p && p.date);
    const rules = getFixedRulesFromStorage();
    const fixedEvents = expandRulesToMonthEvents(rules, year, monthIndex);
    return [...oneOff, ...fixedEvents];
  }

  function saveFixedRules(rules) {
    const normalized = rules.map(normalizeRule).filter(Boolean);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    try {
      window.dispatchEvent(new CustomEvent("sai-programs-changed"));
    } catch (_) {}
  }

  window.FixedScheduleLib = {
    STORAGE_KEY,
    nthWeekdayOfMonth,
    normalizeRule,
    ensureSeedFromClubData,
    getFixedRulesFromStorage,
    expandRulesToMonthEvents,
    getMergedProgramsForMonth,
    getOneOffPrograms,
    saveFixedRules,
  };
})();
