/* beeco design system 1.43.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  hangnem_gen_default
} from "./chunk-NTYPO63C.js";

// react/src/meh/say.ts
function say(pillanat, valtozat) {
  const p = hangnem_gen_default.pillanatok[pillanat];
  const vs = p.valtozatok;
  const n = vs.length;
  const i = valtozat ?? Math.floor(Date.now() / 864e5) % n;
  const v = vs[(i % n + n) % n];
  return { poen: v.poen, sima: v.sima, meh: p.meh };
}
var szerepek = hangnem_gen_default.szerepek;
var pillanatok = Object.keys(hangnem_gen_default.pillanatok);

export {
  say,
  szerepek,
  pillanatok
};
