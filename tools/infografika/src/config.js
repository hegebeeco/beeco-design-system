/* Beállítások, paletta, mezőnevek */
const TYPE_HINTS = {
  bigstat:"1. sor – fő szám: mire vonatkozik | érték | mértékegység | emoji<br>További 1–3 sor – egyenértékek: felirat | érték | mértékegység | emoji",
  icongrid:"Megnevezés | darab (összesen 100) | szín (a–f) | emoji<br>Az utolsó, f színű sor halványan jelenik meg („a többi”).",
  dotscale:"Megnevezés | érték | szín (a–f) | emoji<br>6–12 sor ideális. Nagy különbségnél kapcsold be a logaritmikus skálát.",
  bar:"Megnevezés | érték | helyezés | kategória (a/b) | emoji<br>2–7 sor fér el szépen.",
  donut:"Megnevezés | érték | szín (a–f) | emoji | x = kiemelt<br>Színek: a sárga, b fehér, c krém, d világoszöld, e zöld, f szürkés. 3–7 szelet ideális.",
  treemap:"Megnevezés | érték | szín (a–f) | emoji<br>A kis cellák felirata a jelmagyarázatba kerül. 3–9 elem ideális.",
  compare:"Pontosan 2 sor: Megnevezés | érték | mértékegység | emoji | apró megjegyzés<br>Csak azonos mértékegységet hasonlíts!"
};
// A szeletpaletta értékei a tokens.css-ben vannak (--pal-a…f); itt csak a kódok és az alapsorrend.
const PAL_SEQ = ["a","c","b","d","e","f"];
const STORE_KEY = "beeco-infografika-v2";
const HEIGHTS = {f45:1350, f11:1080, f916:1920};
const $ = id => document.getElementById(id);
const fields = {type:"f-type",title:"f-title",sub:"f-sub",ca:"f-ca",cb:"f-cb",center:"f-center",unit:"f-unit",fmt:"f-fmt",data:"f-data",bubble:"f-bubble",src:"f-src"};
