import { formatHu } from '../inputs/number';

/** Fájl-segédek a feltöltőkhöz: méret magyarul, típus a TARTALOM alapján (nem a kiterjesztésből), ellenőrzés okkal és teendővel. */

const MB = 1024 * 1024;
/** 2 202 009 bájt → „2,1” (MB, egy tizedes; 0,1 MB alatt két tizedes, hogy ne legyen „0”) */
export const mbText = (bytes: number) => formatHu(bytes / MB, bytes > 0 && bytes < 0.1 * MB ? 2 : 1) || '0';

/** Élő állapot „2,1/5 MB” – kis fájlnál kB-ban („12/68 kB”), hogy ne „0/0 MB” legyen */
export const sizePair = (loaded: number, total: number) => {
  const l = Math.min(loaded, total);
  if (total < 0.1 * MB) return `${formatHu(l / 1024, 0)}/${formatHu(Math.max(1, total / 1024), 0)} kB`;
  return `${mbText(l)}/${mbText(total)} MB`;
};

/** Ismert fájltípusok: MIME → rövid név + a fájl eleji „bűvös bájtok” ellenőrzője */
type Sig = { name: string; test: (b: Uint8Array) => boolean };
const at = (b: Uint8Array, off: number, s: string) => [...s].every((ch, i) => b[off + i] === ch.charCodeAt(0));
export const FILE_TYPES: Record<string, Sig> = {
  'image/jpeg': { name: 'JPG', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  'image/png': { name: 'PNG', test: (b) => b[0] === 0x89 && at(b, 1, 'PNG') },
  'image/webp': { name: 'WebP', test: (b) => at(b, 0, 'RIFF') && at(b, 8, 'WEBP') },
  'image/gif': { name: 'GIF', test: (b) => at(b, 0, 'GIF8') },
  'video/mp4': { name: 'MP4', test: (b) => at(b, 4, 'ftyp') && !at(b, 8, 'qt') },
  // .xlsx = ZIP-konténer, .xls = régi OLE-konténer
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { name: 'XLSX', test: (b) => b[0] === 0x50 && b[1] === 0x4b && b[2] === 3 && b[3] === 4 },
  'application/vnd.ms-excel': { name: 'XLS', test: (b) => b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0 },
};

/** Felismerhető, de nem engedett formátum a tartalomból (pl. átnevezett iPhone-kép): ilyenkor „rossz formátum”, nem „olvashatatlan” */
const masikFormatum = (b: Uint8Array): string | null => {
  if (at(b, 4, 'ftyp')) {
    if (['heic', 'heix', 'hevc', 'heim', 'heis', 'mif1', 'msf1'].some((m) => at(b, 8, m))) return 'HEIC';
    if (at(b, 8, 'qt')) return 'MOV';
  }
  const hit = Object.values(FILE_TYPES).find((s) => s.test(b));
  return hit ? hit.name : null;
};

/** A fájl valódi típusa az első bájtjai alapján (null = ismeretlen / nem engedett) */
export async function sniffType(file: File, accept: readonly string[]): Promise<string | null> {
  const buf = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  return accept.find((mime) => FILE_TYPES[mime]?.test(buf)) ?? null;
}

/** Engedett típusok szövegesen: „JPG, PNG, WebP” */
export const typeNames = (accept: readonly string[]) => accept.map((m) => FILE_TYPES[m]?.name ?? m).join(', ');

/** A kiterjesztésből „ismerős” név a hibaüzenethez (pl. HEIC, MOV, CSV) */
const extOf = (name: string) => (name.includes('.') ? name.split('.').pop()!.toUpperCase() : '');

export type Rejection = { file: string; reason: string; next: string };
export type CheckOptions = {
  accept: readonly string[];
  maxSizeMB: number;
  /** Még ennyi fér (a darabszám-határból); Infinity = nincs határ */
  room?: number;
  /** A darabszám-határ (az üzenethez) */
  max?: number;
  /** Már fent lévő vagy épp töltődő fájlok kulcsai (ugyanaz a fájl kétszer) */
  known?: ReadonlySet<string>;
  /** Mit tegyen, ha a típus rossz – a projekt pontosíthatja */
  typeHint?: string;
  /** Olvashatatlan fájl: a kiterjesztése engedett típus (pl. .mp4), de a tartalma nem az (sérült, félbemaradt export).
   *  Alap: „ezt a fájlt nem tudjuk beolvasni” + „Próbáld újra exportálni <TÍPUS>-ként, és töltsd fel újra.” */
  unreadable?: { reason: string; next: string };
  /** Mit tegyen, ha túl nagy */
  sizeHint?: string;
  /** Egység a darab-üzenethez: „kép”, „videó”, „fájl” */
  unit?: string;
};

/** Egyszerű kulcs az azonos fájl felismeréséhez (név + méret) */
export const fileKey = (f: File) => `${f.name}|${f.size}`;

/**
 * Fájlok ellenőrzése feltöltés ELŐTT: a hibás el sem indul, és mindegyikhez ok + teendő tartozik.
 * Sorrend: üres → típus (tartalom szerint) → méret → ugyanaz kétszer → darabszám (az első N indul, a többiről üzenet).
 */
export async function checkFiles(files: readonly File[], o: CheckOptions) {
  const ok: File[] = [];
  const rejected: Rejection[] = [];
  const unit = o.unit ?? 'fájl';
  const seen = new Set(o.known);
  let room = o.room ?? Infinity;
  const over: string[] = [];
  for (const f of files) {
    if (f.size === 0) { rejected.push({ file: f.name, reason: 'üres fájl (0 bájt)', next: 'Válaszd ki újra az eredetit – lehet, hogy a mentés nem sikerült.' }); continue; }
    const type = await sniffType(f, o.accept);
    if (!type) {
      const fej = new Uint8Array(await f.slice(0, 16).arrayBuffer());
      const valodi = masikFormatum(fej);
      const ext = valodi ?? extOf(f.name);
      // A kiterjesztés szerint engedett típus, de a tartalom nem az → nem „rossz formátum” (önellentmondó lenne: „MP4 – csak MP4 lehet”), hanem olvashatatlan
      const known = !valodi && o.accept.some((m) => FILE_TYPES[m]?.name === ext || (ext === 'JPEG' && m === 'image/jpeg'));
      if (known) { rejected.push({ file: f.name, ...(o.unreadable ?? { reason: 'ezt a fájlt nem tudjuk beolvasni (lehet, hogy sérült)', next: `Próbáld újra exportálni ${FILE_TYPES[o.accept.find((m) => FILE_TYPES[m]?.name === ext) ?? 'image/jpeg']?.name ?? ext}-ként, és töltsd fel újra.` }) }); continue; }
      rejected.push({ file: f.name, reason: `${ext ? `ezt a formátumot (${ext})` : 'ezt a fájlt'} nem tudjuk fogadni – csak ${typeNames(o.accept)} lehet`, next: o.typeHint ?? `Mentsd el ${typeNames(o.accept).split(', ')[0]}-ként, és töltsd fel újra.` });
      continue;
    }
    if (f.size > o.maxSizeMB * MB) {
      rejected.push({ file: f.name, reason: `${mbText(f.size)} MB, a határ ${formatHu(o.maxSizeMB, 1)} MB`, next: o.sizeHint ?? 'Kicsinyítsd le, és próbáld újra.' });
      continue;
    }
    const k = fileKey(f);
    if (seen.has(k)) { rejected.push({ file: f.name, reason: 'ezt a fájlt már kiválasztottad', next: 'Ha másikat szántál, válaszd ki azt.' }); continue; }
    if (room <= 0) { over.push(f.name); continue; }
    seen.add(k); room--; ok.push(f);
  }
  if (over.length) rejected.push({ file: over.length === 1 ? over[0] : `${over.length} ${unit}`, reason: `nem fért be – legfeljebb ${o.max ?? ''} ${unit} lehet`, next: `Törölj egyet, ha újat tennél fel.` });
  return { ok, rejected };
}

/** Feltöltő függvény, amit a projekt ad (a DS-ben nincs hálózati kód). Haladást jelez, megszakítható. */
export type UploadFn<R> = (file: File, ctx: { onProgress: (loaded: number) => void; signal: AbortSignal }) => Promise<R>;

/** Megszakítás felismerése (AbortController → DOMException 'AbortError') */
export const isAbort = (e: unknown) => e instanceof DOMException && e.name === 'AbortError';

/** Hibaüzenet a projekt hibájából – ha nem ad szöveget, általános teendővel */
export const errorText = (e: unknown) => (e instanceof Error && e.message ? e.message : 'Nem sikerült feltölteni – ellenőrizd a kapcsolatot, és próbáld újra.');
