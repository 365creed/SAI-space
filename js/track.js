(function () {
  try {
    const key = "saiPageStats";
    const path = location.pathname.split("/").pop() || "index.html";
    const o = JSON.parse(localStorage.getItem(key) || "{}");
    o[path] = (o[path] || 0) + 1;
    o._total = (o._total || 0) + 1;
    o._lastVisit = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(o));
  } catch (e) {
    /* ignore */
  }
})();
