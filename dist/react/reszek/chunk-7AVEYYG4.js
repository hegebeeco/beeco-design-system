/* beeco design system 1.46.3 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  formatHu
} from "./chunk-Z27KC3NB.js";

// react/src/media/files.ts
var MB = 1024 * 1024;
var mbText = (bytes) => formatHu(bytes / MB, bytes > 0 && bytes < 0.1 * MB ? 2 : 1) || "0";
var sizePair = (loaded, total) => {
  const l = Math.min(loaded, total);
  if (total < 0.1 * MB) return `${formatHu(l / 1024, 0)}/${formatHu(Math.max(1, total / 1024), 0)} kB`;
  return `${mbText(l)}/${mbText(total)} MB`;
};
var at = (b, off, s) => [...s].every((ch, i) => b[off + i] === ch.charCodeAt(0));
var FILE_TYPES = {
  "image/jpeg": { name: "JPG", test: (b) => b[0] === 255 && b[1] === 216 && b[2] === 255 },
  "image/png": { name: "PNG", test: (b) => b[0] === 137 && at(b, 1, "PNG") },
  "image/webp": { name: "WebP", test: (b) => at(b, 0, "RIFF") && at(b, 8, "WEBP") },
  "image/gif": { name: "GIF", test: (b) => at(b, 0, "GIF8") },
  "video/mp4": { name: "MP4", test: (b) => at(b, 4, "ftyp") && !at(b, 8, "qt") },
  // .xlsx = ZIP-konténer, .xls = régi OLE-konténer
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { name: "XLSX", test: (b) => b[0] === 80 && b[1] === 75 && b[2] === 3 && b[3] === 4 },
  "application/vnd.ms-excel": { name: "XLS", test: (b) => b[0] === 208 && b[1] === 207 && b[2] === 17 && b[3] === 224 }
};
var masikFormatum = (b) => {
  if (at(b, 4, "ftyp")) {
    if (["heic", "heix", "hevc", "heim", "heis", "mif1", "msf1"].some((m) => at(b, 8, m))) return "HEIC";
    if (at(b, 8, "qt")) return "MOV";
  }
  const hit = Object.values(FILE_TYPES).find((s) => s.test(b));
  return hit ? hit.name : null;
};
async function sniffType(file, accept) {
  const buf = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  return accept.find((mime) => FILE_TYPES[mime]?.test(buf)) ?? null;
}
var typeNames = (accept) => accept.map((m) => FILE_TYPES[m]?.name ?? m).join(", ");
var extOf = (name) => name.includes(".") ? name.split(".").pop().toUpperCase() : "";
var fileKey = (f) => `${f.name}|${f.size}`;
async function checkFiles(files, o) {
  const ok = [];
  const rejected = [];
  const unit = o.unit ?? "f\xE1jl";
  const seen = new Set(o.known);
  let room = o.room ?? Infinity;
  const over = [];
  for (const f of files) {
    if (f.size === 0) {
      rejected.push({ file: f.name, reason: "\xFCres f\xE1jl (0 b\xE1jt)", next: "V\xE1laszd ki \xFAjra az eredetit \u2013 lehet, hogy a ment\xE9s nem siker\xFClt." });
      continue;
    }
    const type = await sniffType(f, o.accept);
    if (!type) {
      const fej = new Uint8Array(await f.slice(0, 16).arrayBuffer());
      const valodi = masikFormatum(fej);
      const ext = valodi ?? extOf(f.name);
      const egyezo = (m) => FILE_TYPES[m]?.name.toUpperCase() === ext || ext === "JPEG" && m === "image/jpeg";
      const known = !valodi && o.accept.some(egyezo);
      if (known) {
        rejected.push({ file: f.name, ...o.unreadable ?? { reason: "ezt a f\xE1jlt nem tudjuk beolvasni (lehet, hogy s\xE9r\xFClt)", next: `Pr\xF3b\xE1ld \xFAjra export\xE1lni ${FILE_TYPES[o.accept.find(egyezo) ?? "image/jpeg"]?.name ?? ext}-k\xE9nt, \xE9s t\xF6ltsd fel \xFAjra.` } });
        continue;
      }
      rejected.push({ file: f.name, reason: `${ext ? `ezt a form\xE1tumot (${ext})` : "ezt a f\xE1jlt"} nem tudjuk fogadni \u2013 csak ${typeNames(o.accept)} lehet`, next: o.typeHint ?? `Mentsd el ${typeNames(o.accept).split(", ")[0]}-k\xE9nt, \xE9s t\xF6ltsd fel \xFAjra.` });
      continue;
    }
    if (f.size > o.maxSizeMB * MB) {
      rejected.push({ file: f.name, reason: `${mbText(f.size)} MB, a hat\xE1r ${formatHu(o.maxSizeMB, 1)} MB`, next: o.sizeHint ?? "Kicsiny\xEDtsd le, \xE9s pr\xF3b\xE1ld \xFAjra." });
      continue;
    }
    const k = fileKey(f);
    if (seen.has(k)) {
      rejected.push({ file: f.name, reason: "ezt a f\xE1jlt m\xE1r kiv\xE1lasztottad", next: "Ha m\xE1sikat sz\xE1nt\xE1l, v\xE1laszd ki azt." });
      continue;
    }
    if (room <= 0) {
      over.push(f.name);
      continue;
    }
    seen.add(k);
    room--;
    ok.push(f);
  }
  if (over.length) rejected.push({ file: over.length === 1 ? over[0] : `${over.length} ${unit}`, reason: `nem f\xE9rt be \u2013 legfeljebb ${o.max ?? ""} ${unit} lehet`, next: `T\xF6r\xF6lj egyet, ha \xFAjat tenn\xE9l fel.` });
  return { ok, rejected };
}
var isAbort = (e) => e instanceof DOMException && e.name === "AbortError";
var errorText = (e) => e instanceof Error && e.message ? e.message : "Nem siker\xFClt felt\xF6lteni \u2013 ellen\u0151rizd a kapcsolatot, \xE9s pr\xF3b\xE1ld \xFAjra.";

export {
  mbText,
  sizePair,
  FILE_TYPES,
  sniffType,
  typeNames,
  fileKey,
  checkFiles,
  isAbort,
  errorText
};
