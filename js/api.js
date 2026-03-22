let siteConfigCache = null;

async function loadSiteConfig() {
  if (siteConfigCache) return siteConfigCache;
  const res = await fetch("data/config.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("config load failed");
  siteConfigCache = await res.json();
  return siteConfigCache;
}

/**
 * 예약 데이터를 원격 엔드포인트로 전송합니다.
 * data/config.json 에서 api.enabled 가 true 이고 reservationUrl 이 설정된 경우에만 요청합니다.
 * (Google Apps Script Web App, Supabase Edge, 자체 서버 등 POST URL)
 */
async function sendReservationRequest(payload) {
  try {
    const cfg = await loadSiteConfig();
    const api = cfg.api || {};
    const url = (api.reservationUrl || "").trim();
    if (!api.enabled || !url) {
      return { ok: true, skipped: true };
    }

    const method = api.method || "POST";
    const headers = Object.assign(
      { "Content-Type": "application/json" },
      api.headers && typeof api.headers === "object" ? api.headers : {}
    );

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify({
        ...payload,
        site: cfg.site?.name || "SAI Space",
      }),
    });

    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch (_) {
      /* plain text 응답 */
    }
    return { ok: res.ok, status: res.status, json, raw: text };
  } catch (e) {
    console.error(e);
    return { ok: false, error: String(e) };
  }
}

window.loadSiteConfig = loadSiteConfig;
window.sendReservationRequest = sendReservationRequest;
