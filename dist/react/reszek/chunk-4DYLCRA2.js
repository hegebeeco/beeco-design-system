/* beeco design system 1.47.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/kieg2/draw.ts
var REVEAL_STEPS = [110, 150, 210, 290, 400, 540];
var STAMP_MS = 400;
var REVEAL_TOTAL_MS = REVEAL_STEPS.reduce((a, b) => a + b, 0) + STAMP_MS;
function cryptoIndex(n) {
  if (!Number.isInteger(n) || n < 1) throw new Error("\xDCres r\xE9sztvev\u0151-lista");
  if (n === 1) return 0;
  const limit = Math.floor(4294967296 / n) * n;
  const buf = new Uint32Array(1);
  for (; ; ) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return buf[0] % n;
  }
}
function tickerNames(pool, count) {
  if (!pool.length) return [];
  const stride = pool.length > 7 ? 7 : 1;
  return Array.from({ length: count }, (_, i) => pool[i * stride % pool.length].name);
}
var drawTime = (d) => d.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
var wait = (ms) => new Promise((r) => setTimeout(r, ms));

export {
  REVEAL_STEPS,
  STAMP_MS,
  REVEAL_TOTAL_MS,
  cryptoIndex,
  tickerNames,
  drawTime,
  wait
};
