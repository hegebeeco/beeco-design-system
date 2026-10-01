/** Egy videólink értelmezése (06b/15): saját fájl, YouTube, Vimeo – vagy miért nem jó. Hálózati kérés nélkül, csak a szövegből. */
export type VideoSource =
  | { kind: 'empty' }
  | { kind: 'file'; url: string }
  | { kind: 'youtube' | 'vimeo'; id: string; provider: string; embedUrl: string; watchUrl: string }
  | { kind: 'invalid'; reason: 'not-url' | 'unsupported' | 'bad-id' | 'insecure'; message: string };

const FILE_EXT = /\.(mp4|m4v|webm|ogv|ogg|mov)$/i;
const YT_ID = /^[A-Za-z0-9_-]{11}$/;

/** A hibaüzenet mindig megmondja a következő lépést */
export const VIDEO_URL_MSG = {
  'not-url': 'Ez nem link. Másold be a teljes címet, pl. https://youtu.be/… vagy https://vimeo.com/…',
  unsupported: 'Ezt a linket nem tudom lejátszani. YouTube-, Vimeo- vagy MP4/WebM-videólinket adj meg.',
  'bad-id': 'A link hiányos: nincs benne a videó azonosítója. Másold ki újra a videó „Megosztás” gombjával.',
  insecure: 'Csak biztonságos (https://) linket tudok beágyazni. Írd át a link elejét https://-re.',
} as const;

const bad = (reason: keyof typeof VIDEO_URL_MSG): VideoSource => ({ kind: 'invalid', reason, message: VIDEO_URL_MSG[reason] });

/** YouTube „t=1m30s” / „t=90” / „start=90” → másodperc */
function startSeconds(u: URL): number | undefined {
  const t = u.searchParams.get('start') ?? u.searchParams.get('t');
  if (!t) return undefined;
  const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(t);
  if (!m) return undefined;
  const s = Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
  return s > 0 ? s : undefined;
}

export function parseVideoUrl(input: string): VideoSource {
  const raw = input.trim();
  if (!raw) return { kind: 'empty' };
  if (/^(blob:|data:video\/)/i.test(raw)) return { kind: 'file', url: raw };
  let u: URL;
  try { u = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`); } catch { return bad('not-url'); }
  if (!/^https?:$/.test(u.protocol) || !u.hostname.includes('.')) return bad('not-url');
  const host = u.hostname.replace(/^(www\.|m\.)/, '');

  if (['youtube.com', 'youtu.be', 'youtube-nocookie.com', 'music.youtube.com'].includes(host)) {
    const parts = u.pathname.split('/').filter(Boolean);
    const id = host === 'youtu.be' ? parts[0] : u.searchParams.get('v') ?? (['embed', 'shorts', 'live', 'v'].includes(parts[0]) ? parts[1] : undefined);
    if (!id || !YT_ID.test(id)) return bad('bad-id');
    const start = startSeconds(u);
    // youtube-nocookie: a „fokozott adatvédelmi mód” – kevesebb süti, mint a sima beágyazásnál
    return { kind: 'youtube', id, provider: 'YouTube', watchUrl: `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ''}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0${start ? `&start=${start}` : ''}` };
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = u.pathname.split('/').filter(Boolean).find((p) => /^\d{6,12}$/.test(p));
    if (!id) return bad('bad-id');
    // dnt=1: a Vimeo nem követi a nézőt
    return { kind: 'vimeo', id, provider: 'Vimeo', watchUrl: `https://vimeo.com/${id}`, embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1` };
  }
  if (FILE_EXT.test(u.pathname)) return u.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(u.hostname) ? { kind: 'file', url: u.href } : bad('insecure');
  return bad('unsupported');
}
