# Közös weboldal-viselkedés

## horgony.js – oldalon belüli horgonygombok (lap fejléc-kódjába, beágyazva)
Sima görgetés a célra **új böngésző-előzmény nélkül** (`history.replaceState`), a Webflow saját görgetése és a
site-szintű Trustindex újrakattintása kiiktatva; a fejlécben fut, így a késleltetett szkriptek előtt is él.
Békén hagyja: `[role="button"]` / `[role="tab"]` (az oldal JS-e kezeli; a Webflow dokumentum-szintű kezelőjéig viszont nem jut fel a kattintás, mert az pushState-tel előzményt írna), `.w-tab-link` (Webflow-fülek), `.cs-utvonal_pont`.
Miért: e nélkül minden horgonykattintás előzményt írt, és a Mac trackpad „Vissza” mozdulata a gombhoz dobta vissza a látogatót.
Használja: CsicsergŐsz (`kampany-csicsergosz/fej/horgony.js`, korábbi változat), Főoldal Szuperhős (draft).
Site-szintre csak tesztelt oldalanként vihető (a nem kezelt fül- és lenyíló-megoldásokat előbb ellenőrizni kell).
