# Javaslat 20 – Admin UX-elemek: lépésenkénti szerkesztő, kattintható lépésjelző, kereső-paletta, sorbeli kapcsoló, bővített előnézet, saját naptár-fajták, nyomtatás, menüállapot és ⌘S

*Állapot: **jóváhagyva** · készítette: Claude (ADMINAPP) · dátum: 2026-10-05*
*Kristóf jóváhagyta, 2026-10-05 – minden elemét.*

## 1. Igény
- Hol kell: beeco admin (a partner-app is használhatja) – a „CEO-funkciók és UX/UI javaslatok” (UX-1 globális kereső, UX-3 gyors műveletek, UX-5 lépésenkénti felvétel, UX-9 billentyűparancsok, Hatás-riport, app-előnézet) fejlesztése közben merültek fel.
- Mit old meg: amit az admin eddig projekt-szinten, a DS megkerülésével oldott meg, az közös, tesztelt elem lesz – a partner-app is ugyanígy kapja.
- Ma helyette (admin, `wt/helyi-osszes`):
  - `src/components/Lepesek/` (Lepesek.tsx, lepesLogika.ts) – az EditPage-en belüli lépés-keret; a gombsor Mentését `:has()`-szal rejti (`.bc-sablon-form:has(.lepesek[data-utolso='nem']) .bc-sablon-bar button[type='submit']`), saját Vissza/Tovább sor, saját kattintható pirula-gomb;
  - `src/components/GlobalisKereso/` – Modal + SearchBox + `.bc-option` sorok kézzel összerakva („DS-javaslat: CommandPalette”);
  - `src/components/SorKapcsolo/` – a DS `Switch` mezőnek készült (címke-sor + kötelező súgó), a táblázatsorba saját tömör kapcsoló kellett;
  - `src/components/AppElonezet/` – a PreviewCard csak partner/kupon/értesítés kártyát tud: edukáció, esemény, részletek nézet, képarány és a `Clamp` saját másolatban;
  - `pages/Partners/adatlap/PartnerNaptar.tsx` – a kupon-időzítés az „education” fajtára van ráültetve (más felirattal), mert a naptár nem bővíthető;
  - `pages/Hatas/HatasRiport.tsx` `hatas-nyomtatas` – a nyomtatási szabályok (keret rejtve, világos téma papíron) oldal-szinten;
  - `components/AdminShell/AdminShell.scss` – a telefonos fiókban a kereső-gomb rejtve, mert a DS `useShellNav`-ja nem nyilvános;
  - `ds/billentyuk.ts` – „⌘S (mentés) nincs: a DS EditPage nem ad rá módot”.

## 2. Mire épül (docs/komponensek.md 1.)
- DS-elemek: `EditPage`, `ErrorSummary`, `Stepper` (`.bc-steps`), `Button`, `Modal` (Radix Dialog), `SearchBox`, `.bc-option`, `.bc-kbd`, `.bc-switch`, `PreviewCard` + `Clamp`, `MonthCalendar`, `Dashboard`, `AppShell` + `ShellNavContext`, `notify`.
- Szintek: piktogram (IcLeft/IcRight) és `SwitchInput`, `Clamp` – atom · kattintható `Stepper` – molekula · `CommandPalette`, `PreviewCard`, `MonthCalendar` – organizmus · `EditPage` lépés-mód, `Dashboard` nyomtatás, `useShellNav` – sablon.
- Új vizuális minta nincs: minden a meglévő osztályokból és tokenekből (a kattintható pirula a meglévő `.bc-steps` pirula, a tömör kapcsoló a `.bc-switch` kisebb sínnel).

## 3. Változatok és a választott megoldás
| Elem | A (választott) | B | Miért A |
|---|---|---|---|
| Lépésenkénti szerkesztő | `EditPage steps` prop – a sablon maga rajzolja a gombsort | külön `StepForm` sablon | egy helyen marad az őr, a piszkozat, az összesítő; a `:has()`-os rejtés megszűnik |
| Kereső-paletta | `CommandPalette` a DS `Modal`-ra (Radix Dialog) építve, a keresést a projekt végzi | cmdk könyvtár | nincs új függőség, a Modal fókusz- és Esc-kezelése marad |
| Sorbeli kapcsoló | új `SwitchInput` atom (`size="sm"`), a `CheckboxInput` mintájára | `Switch size="sm"` | a `Switch` mező (kötelező súgó, címke-sor) – a sorban a súgó az oszlopfejlécben van |
| Előnézet | `PreviewCard` új változatok + `view` + `aspect` | külön elem fajtánként | egy telefonkeret, egy levágás-mérés |
| Naptár-fajták | `kindDefs` (címke, szerepszín, piktogram), generikus típus | szabad szín | csak szerepszín – a méz a kijelölésé marad |

## 4. Állapotok
- **EditPage lépés-mód:** első lépés (nincs Vissza) · köztes (Vissza / Tovább, nincs Mentés) · utolsó (Vissza / Mentés) · lépéshiba „Tovább” után (a gombsor jelzés-helyén, élőben eltűnik) · mentés közben · mentés-hiba korábbi lépésben (odaugrik) · siker · másolat (minden lépés elérhető).
- **Stepper:** todo · current (`aria-current="step"`) · done · error; onSelect-tel a bejárt lépés gomb (rámutatás, fókusz).
- **CommandPalette:** üres (legutóbbiak + tipp) · túl rövid · töltés („Keresem…”, `aria-busy`) · találatok csoportokban · kiemelt sor · tiltott sor · nincs találat · hiba újrapróbálással · 1000+ találat.
- **SwitchInput:** be · ki · mentés közben (`aria-busy`, tiltott) · tiltott · állapot-szöveggel / nélkül · md / sm.
- **PreviewCard:** kártya · részletek · üres mezők (helykitöltő) · levágás · kép nélkül (saját felirat) · kiemelt.
- **Dashboard nyomtatás:** képernyő · nyomtatás (keret és vezérlők rejtve, világos téma) · nyomtatás után (a téma visszaáll).

## 5. Szélső esetek (tesztlapon)
- `sablon-lepesek` (új): Tovább hibás lépéssel (fókusz az első hibás mezőn, a többi lépés hibája nem látszik) · Enter szövegmezőben = Tovább · kattintható jelző (44 px, a pirula ≤ 34 px) · Vissza · Ctrl+S köztes lépésen (figyelmeztet, nem ment) · szerverhiba az 1. lépésben a 3. lépésről mentve (odaugrik, fókusz az összesítőn) · összesítő-link másik lépés mezőjére · siker · telefon 390 px (Mégse · Vissza · Tovább elfér) · hosszú lépésnevek 320 px-en · másolat.
- `vezerlok-tomor` (új): kattintható lépésjelző (egér, Enter), hibás lépés választható, onSelect nélkül nincs gomb · táblázatsor kapcsolóval (a sor < 60 px, a kapcsoló 44×44), mentés közben tiltott, Szóköz kapcsol, hosszú név · nyíl-piktogramok.
- `reteg-paletta` (új): Ctrl+K nyit/zár · csoportok · kiemelés (`<mark>`) · ↑/↓ körbe, tiltott sor kihagyva · Enter / Ctrl+Enter (új lap, nyitva marad) · egér · túl rövid · nincs találat · hiba · töltés · 1200 találat (Ctrl+End, görgetés) · 320 px · useShellNav: becsukott sáv, telefonos fiók bezárul a kereső előtt.
- `kieg-elonezet`: edukáció (kártyaszöveg / leírás eleje) · részletek (teljes szöveg, sortörés, görgethető régió, 4:3 kép) · esemény (kiemelt, kezdés nélkül, 1:1) · kártya ↔ részletek váltó · kupon részletek · Clamp önállóan (`onCut`).
- `media-naptar`: saját fajták (kupon-időzítés, zárva) – címke, piktogram, szerepszín, szűrő, nap-lista.
- `sablon-iranyitopult`: nyomtatás (sötét módból is világos, keret és vezérlők rejtve, árnyék nincs, utána visszaáll).

## 6. API
```tsx
// 1. EditPage lépés-mód + 8. ⌘S
<EditPage … saveShortcut
  steps={{ label: 'Az új POI felvételének lépései', allReachable: masolat, onStepChange: (id) => …,
    items: [{ id: 'alap', title: 'Alapadatok', description: '…', fields: ['nev', 'kategoria'] }, { id: 'hely', title: 'Hely', fields: ['cim'] }, …] }}>
  {({ errorOf, step }) => step === 'alap' ? <FormSection …/> : …}
</EditPage>
// 2. Kattintható Stepper + nyilak
<Stepper label="…" steps={[{ id, label, state, reachable }]} onSelect={(i, step) => …} />
<Button icon={<IcRight />}>Tovább</Button>
// 3. Kereső-paletta
<CommandPalette open={nyitva} onOpenChange={setNyitva} query={q} onQueryChange={setQ} minChars={2} hint="Írj legalább 2 betűt."
  groups={[{ id: 'partner', label: 'Partnerek', items: [{ id, label, description: 'Partner', icon, data }] }]}
  status={isFetching ? 'loading' : isError ? 'error' : 'ready'} onRetry={refetch} onSelect={(it, { newTab }) => …} />
commandHotkeyLabel() // „⌘K” / „Ctrl+K” · useCommandHotkey(fn) – saját gombhoz
// 4. Sorbeli kapcsoló
<SwitchInput size="sm" checked={…} onChange={…} aria-label={`Látható az appban: ${nev}`} onText="Látható" offText="Rejtett" busy={ment} />
// 5. Előnézet
<PreviewCard variant="edukacio" | "esemeny" | … view="card" | "detail" aspect={4 / 3} emptyImageText="Nincs kép – alapkép" … />
<Clamp k="cim" label="A cím" lines={2} placeholder="Cím helye" onCut={…}>{cim}</Clamp>
// 6. Naptár saját fajtákkal
<MonthCalendar events={…} kinds={['event', 'kupon']} kindDefs={{ kupon: { label: 'Kupon-időzítés', tone: 'neutral', icon: <IkonKupon /> } }} />
// 7. Nyomtatható riport
<Dashboard printable actions={<Button onClick={() => window.print()}>Nyomtatás / PDF</Button>} … />   // vagy: usePrintFrame()
// 8. Menüállapot
const { closeNav, openNav, navOpen, narrow, collapsed, inShell } = useShellNav();
```
CSS: `.bc-steps-btn` · `.bc-switch.is-sm`, `.bc-switch-inline`, `.bc-switch-state` · `.bc-cmdk-*` · `.bc-pv-full`, `.bc-pv-rows`, `.bc-pv-tags`, `.bc-pv-featured`, `.bc-pv-screen.is-scroll`, `--pv-aspect` · `.bc-mcal-ev.is-danger|is-neutral`, `.bc-mcal-ic` · `.bc-sablon-steps`, `.bc-sablon-step-*` · `@media print` + `.bc-print-page`, `.bc-print-hide`.

Visszafelé kompatibilis: semmi nem változott nevet, minden új prop opcionális; a `MonthCalendar` generikus, de a `kindDefs` nélküli hívás típusa változatlan (`CalKind`).

## 7. Hozzáférhetőség
- Lépés-mód: lépésváltáskor a fókusz a lépés címére (h2, `tabIndex=-1`), hibánál az első hibás mezőre; a lépés hibája `role="alert"`; a lépés tartalma `role="group"` a cím nevével; a jelzőben az állapot képernyőolvasó-szövegként is („kész”, „hiba”).
- Stepper: a bejárt lépés valódi `<button>` (Tab, Enter, Szóköz), 44 px érintési felület; a mostani `aria-current="step"`.
- CommandPalette: WAI-ARIA combobox + listbox (`aria-activedescendant`), csoportok `role="group"` névvel, élő találatszám (`role="status"`), tiltott sor `aria-disabled`, Radix fókuszcsapda és visszatérő fókusz; a billentyű-tipp érintőképernyőn rejtve.
- SwitchInput: `role="switch"` + `aria-checked`, kötelező `aria-label`, mentés közben `aria-busy`; az állapot szövegben is (nem csak színnel).
- Előnézet: a részletek nézet görgethető régiója billentyűzettel elérhető (`tabIndex=0`, `role="region"`).
- Naptár: a saját fajtát a csík, a szerepszín, a piktogram és a felirat is mondja; a nap neve (aria-label) a fajta nevét is felolvassa.
- Nyomtatás: papíron mindig világos téma (kontraszt), a vezérlők nem kerülnek papírra.

## 8. Döntés
- Dátum: 2026-10-05 – Kristóf: mind a nyolc elem elfogadva.
- Választott változat: mindenhol az A (3. pont).
- Megjegyzés: a ⌘S lépés-módban csak az utolsó lépésen ment (előtte figyelmeztet, a fókusz a „Tovább”-ra kerül) – így nem ugrik a felhasználó egy még nem látott lépés hibájára.
