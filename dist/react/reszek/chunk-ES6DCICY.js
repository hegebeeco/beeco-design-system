/* beeco design system 1.46.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/kieg/phone.ts
var MOBIL = ["20", "30", "31", "50", "70"];
var VIDEK = "22 23 24 25 26 27 28 29 32 33 34 35 36 37 42 44 45 46 47 48 49 52 53 54 55 56 57 59 62 63 66 68 69 72 73 74 75 76 77 78 79 82 83 84 85 87 88 89 92 93 94 95 96 99 80 90 91".split(" ");
var MAX_DIGITS = 9;
function phoneInfo(digits) {
  const d = digits.slice(0, MAX_DIGITS);
  let kind = "ismeretlen", need = MAX_DIGITS, area;
  if (d.startsWith("1")) {
    kind = "vezetekes";
    need = 8;
    area = "1";
  } else if (d.length >= 2) {
    area = d.slice(0, 2);
    if (MOBIL.includes(area)) kind = "mobil";
    else if (area === "21") kind = "vezetekes";
    else if (VIDEK.includes(area)) {
      kind = "vezetekes";
      need = 8;
    }
  }
  const complete = d.length === need;
  return { digits: d, kind, need, area, complete, valid: complete && kind !== "ismeretlen" };
}
function formatNational(digits) {
  const i = phoneInfo(digits);
  const d = i.digits;
  const groups = d.startsWith("1") ? [1, 3, 4] : i.need === 8 ? [2, 3, 3] : [2, 3, 4];
  const out = [];
  let at = 0;
  for (const g of groups) {
    if (at >= d.length) break;
    out.push(d.slice(at, at + g));
    at += g;
  }
  return out.join(" ");
}
function parsePhone(text) {
  const t = text.trim();
  const letters = /\p{L}/u.test(t);
  let d = t.replace(/\D/g, "");
  const plus = t.startsWith("+");
  if (plus || d.startsWith("00")) {
    const cc = plus ? d : d.slice(2);
    if (!cc.startsWith("36")) return { digits: "", foreign: cc.length > 0, letters, cropped: false };
    d = cc.slice(2);
  } else if (d.startsWith("06")) d = d.slice(2);
  else if (d.startsWith("36") && d.length >= 10) d = d.slice(2);
  const need = phoneInfo(d).need;
  return { digits: d.slice(0, need), foreign: false, letters, cropped: d.length > need };
}
function typedDigits(raw) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("0036")) d = d.slice(4);
  else if (d.startsWith("06")) d = d.slice(2);
  return { digits: d, letters: /\p{L}/u.test(raw) };
}
var toE164 = (digits) => digits ? `+36${digits}` : "";
function formatHuPhone(value) {
  if (!value) return "";
  const p = parsePhone(value);
  return p.foreign || !p.digits ? value : `+36 ${formatNational(p.digits)}`;
}
function phoneProblem(i, want = "barmely") {
  if (!i.digits) return void 0;
  if (i.digits.length >= 2 && i.kind === "ismeretlen") return `Ismeretlen el\u0151h\xEDv\xF3: ${i.area}. Mobil: 20, 30, 31, 50, 70 \xB7 Budapest: 1 \xB7 vid\xE9k: pl. 52.`;
  if (want === "mobil" && i.kind === "vezetekes") return "Ide mobilsz\xE1m kell: 20, 30, 31, 50 vagy 70 kezdet\u0171.";
  if (want === "vezetekes" && i.kind === "mobil") return "Ide vezet\xE9kes sz\xE1m kell, pl. 1 234 5678 vagy 52 123 456.";
  if (!i.complete) {
    const left = i.need - i.digits.length;
    const pelda = i.need === 8 ? i.area === "1" ? "1 234 5678" : "52 123 456" : "30 123 4567";
    return `M\xE9g ${left} sz\xE1mjegy hi\xE1nyzik \u2013 \xEDgy n\xE9z ki: ${pelda}.`;
  }
  return void 0;
}

export {
  MOBIL,
  MAX_DIGITS,
  phoneInfo,
  formatNational,
  parsePhone,
  typedDigits,
  toE164,
  formatHuPhone,
  phoneProblem
};
