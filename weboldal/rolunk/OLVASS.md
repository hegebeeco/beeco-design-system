# Rólunk-oldalak (A /rolunk, B /csapatunk, C /hatasunk) – natív Webflow, `ds-` design-system blokkokkal

Kristóf döntése (2026-10-15): mindhárom változat külön oldal, saját CTA-val.
- **A · Rólunk** (Történet) – CTA: Töltsd le az appot. Draft: page 6ad0ccce07f0edf900c2ab1e, /rolunk-uj-draft
- **B · Csapat** (Arcok) – CTA: Csatlakozz a rajhoz. Draft: 6ad0cf80413b208bfe0b0075, /csapatunk-uj-draft
- **C · Hatás** – CTA: Legyünk partnerek. Draft: 6ad0ce6ea932768559e8ca0b, /hatasunk-draft

## Felépítés
- `gen_ds.py` → `ki/a.json`, `ki/b.json`, `ki/c.json` (whtml-akciók). Minden osztály CSS-e az első előfordulásnál megy be.
- Közös, oldalfüggetlen osztályok `ds-` előtaggal: szekció és háttérváltozatok, burok, szekciófej, szalag, cím1–3, lead, szöveg,
  gomb (+ ds-masod), chip, fotó, kártya, idővonal, számsáv, tovább-kártya, logósor, díj, grafikon (méretarányos sávok),
  cikk, idézet, „út” kártya, ember, raj, tanácsadó, levél.
- Színek a beeco DS változókra kötve (`valtozok.json`; a whtml nyersen hagyja a var()-t, utána a stílus-eszközzel kötöttük be).
- Komponensek (csoport „beeco DS”): **DS · Szakmai partnerek**, **DS · Csatlakozz a rajhoz**.
- Kód csak az A és B oldal fejlécében: a horgonykezelő (sima görgetés a rögzített menü alá, előzmény nélkül).

## Élesítés (Kristóf)
A három draft most draft:false (staging). Élesítéskor: a mostani /rolunk, /csapatunk helyére cserélni, új /hatasunk; /tortenetunk → /rolunk átirányítás megfontolandó. Előtte draft:true visszaállítás, ha nem kerülnek ki.
