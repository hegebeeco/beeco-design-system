/* beeco design system 1.52.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/kieg2/videoUrl.ts
var FILE_EXT = /\.(mp4|m4v|webm|ogv|ogg|mov)$/i;
var YT_ID = /^[A-Za-z0-9_-]{11}$/;
var VIDEO_URL_MSG = {
  "not-url": "Ez nem link. M\xE1sold be a teljes c\xEDmet, pl. https://youtu.be/\u2026 vagy https://vimeo.com/\u2026",
  unsupported: "Ezt a linket nem tudom lej\xE1tszani. YouTube-, Vimeo- vagy MP4/WebM-vide\xF3linket adj meg.",
  "bad-id": "A link hi\xE1nyos: nincs benne a vide\xF3 azonos\xEDt\xF3ja. M\xE1sold ki \xFAjra a vide\xF3 \u201EMegoszt\xE1s\u201D gombj\xE1val.",
  insecure: "Csak biztons\xE1gos (https://) linket tudok be\xE1gyazni. \xCDrd \xE1t a link elej\xE9t https://-re."
};
var bad = (reason) => ({ kind: "invalid", reason, message: VIDEO_URL_MSG[reason] });
function startSeconds(u) {
  const t = u.searchParams.get("start") ?? u.searchParams.get("t");
  if (!t) return void 0;
  const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(t);
  if (!m) return void 0;
  const s = Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
  return s > 0 ? s : void 0;
}
function parseVideoUrl(input) {
  const raw = input.trim();
  if (!raw) return { kind: "empty" };
  if (/^(blob:|data:video\/)/i.test(raw)) return { kind: "file", url: raw };
  let u;
  try {
    u = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return bad("not-url");
  }
  if (!/^https?:$/.test(u.protocol) || !u.hostname.includes(".")) return bad("not-url");
  const host = u.hostname.replace(/^(www\.|m\.)/, "");
  if (["youtube.com", "youtu.be", "youtube-nocookie.com", "music.youtube.com"].includes(host)) {
    const parts = u.pathname.split("/").filter(Boolean);
    const id = host === "youtu.be" ? parts[0] : u.searchParams.get("v") ?? (["embed", "shorts", "live", "v"].includes(parts[0]) ? parts[1] : void 0);
    if (!id || !YT_ID.test(id)) return bad("bad-id");
    const start = startSeconds(u);
    return {
      kind: "youtube",
      id,
      provider: "YouTube",
      watchUrl: `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ""}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0${start ? `&start=${start}` : ""}`
    };
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = u.pathname.split("/").filter(Boolean).find((p) => /^\d{6,12}$/.test(p));
    if (!id) return bad("bad-id");
    return { kind: "vimeo", id, provider: "Vimeo", watchUrl: `https://vimeo.com/${id}`, embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1` };
  }
  if (FILE_EXT.test(u.pathname)) return u.protocol === "https:" || ["localhost", "127.0.0.1"].includes(u.hostname) ? { kind: "file", url: u.href } : bad("insecure");
  return bad("unsupported");
}

export {
  VIDEO_URL_MSG,
  parseVideoUrl
};
