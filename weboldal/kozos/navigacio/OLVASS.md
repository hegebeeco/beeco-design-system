# Navigáció: „Öt ajtó” navbar + „Záró jelenet” lábléc

Webflow-komponensek (Designer, NAVIGÁCIÓ csoport):

| Komponens | Variánsok | Embed (CSS/JS) |
|---|---|---|
| `NAVBAR_OT_AJTO` | alap (teljes menü) · **Egyszerű** (logó + „‹ beeco.hu főoldal” + Töltsd le!) | `embed-bn.html` |
| `LABLEC_ZARO` | alap (jelenet + Levélke-hírlevél + linksorok) · **Egyszerű** (fekete alsó sáv: logó, 4 link, közösségi, jogi) | `embed-bl.html` |

## Fájlok
- `bn-bl.css`: forrás-CSS, olvasható formában. Az `.bn-egyszeru` / `.bl-egyszeru` módosítók a helyi próbához kellenek.
- `bn.js`: menü-viselkedés (panelek, Esc, kívül kattintás, hamburger, `menu_csoport` / `menu_kattintas` dataLayer-esemény, aktuális oldal jelölése).
- `embed-bn.html`, `embed-bl.html`: ez kerül a komponensek HtmlEmbed elemébe, változtatás nélkül.
- `wf-*.html`: a Webflow-ba beszúrt jelölés (whtml).
- `gen.py`: legenerálja a `bn.html`, `bl.html` és `proba.html` fájlokat (helyi próba).
- `variant_sel.py`: a Webflow-variáns osztályait (`w-variant-…`) felveszi az egyszerűsített szabályokba.

## Miért kell a `w-variant-…` a CSS-be
A Webflow a variánsstílust `:where(.w-variant-…)` formában írja, ami egyosztálynyi súly. Az embed később töltődik be, ezért az alapértékei felülírnák a variánst. Az embed ezért maga is célozza a variáns osztályát, így kétosztálynyi súllyal nyer. Ha a variáns id-ja változik (például új variáns jön létre), a `variant_sel.py` `VAR` szótárát kell frissíteni, és újra kell futtatni.

## Webflow-környezet
- `body:has(.bn){margin-top:0}`: a `main_body` osztály 60 px-es margója a régi, fix navbart kompenzálta.
- A globális `a` és `a:hover` stílus (700-as vastagság, zöld szín, aláhúzás) érintőképernyőn átszínezné a menüt, ezért a `.bn a:hover` és a `.bl a:hover` szabály ezt visszaállítja.
- A Levélke a Sender űrlapot használja (`data-sender-form-id="e30255ec7043d5a6Ezl"`), ugyanazt a listát, mint a régi lábléc.

## Állapot (2026-10-14)
- Fut a `fooldal-szuperhos-draft` oldalon (teljes változat) és a `navigacio-teszt-draft` oldalon (egyszerű változat). Mindkettő draft.
- A 45 oldalas cseréhez (`NAVBAR_FINISH` és `beeeco - footer` helyett) és az élesítéshez Kristóf jóváhagyása kell.
