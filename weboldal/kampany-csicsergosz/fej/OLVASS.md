# Fejléc-kód (Webflow: oldal → Custom code → Head)

`horgony.js` beágyazva (`<script>…</script>`) a lap fejlécében fut, minden más szkript előtt.
Az oldalon belüli horgonygombokat (`a[href^="#"]`) ez kezeli: sima görgetés a célra, **új böngésző-előzmény nélkül**
(`history.replaceState`), a Webflow saját görgetése és a site-szintű Trustindex újrakattintása kiiktatva.

Miért a fejlécben: a kampányszkriptek (`defer`, jsDelivr) lassú hálózaton több másodperc után érkeznek. Addig a
natív/Webflow-kezelő minden kattintásra előzményt írt, és a Mac trackpad „Vissza” mozdulata (enyhén oldalirányú
kétujjas görgetés) a látogatót a gombhoz dobta vissza. A fülek (`.cs_kinek_gomb`) és az oldalsó útvonal
(`.cs-utvonal_pont`) saját kezelőt kapnak; amíg a fülkezelő nem él (nincs `role="tab"`), a fülkattintás nem csinál semmit.
