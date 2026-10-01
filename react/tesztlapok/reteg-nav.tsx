import { useState } from 'react';
import { Breadcrumbs, Button, DropdownMenu, IconButton, MoreIcon, NavTabs, PageHeader, Tabs, usePageTitle, type RenderLink } from '../src';
import { Case, Grid, mount } from './_keret';

const panel = (t: string) => <p>{t} panel tartalma (mintaadat).</p>;
const HOSSZU = 'Fenntartható Belváros Kezdeményezés 2026 – őszi kupon- és javítóhét partnerprogramjának kiemelt sablonja (mintaadat)';
// Router-független link: itt egy „router”, ami a hash-t állítja (a projektben React Router <Link>)
const hashLink: RenderLink = ({ href, children, ...p }) => <a href={`#${href}`} {...p}>{children}</a>;

function Oldal() {
  const [tab, setTab] = useState('attekintes');
  const [cim, setCim] = useState('Nyári kávé 10%');
  usePageTitle(cim, 'beeco admin');
  const tiz = ['Áttekintés', 'Felhasználók', 'Lábnyom', 'Öntözés', 'Kaptárak', 'Kuponok', 'Események', 'Nyereményjáték', 'Üzenetek', 'Rajok'];
  return (
    <>
      <Grid title="Fülek (Tabs) – panelváltó, 6A">
        <Case id="tabs-ket" title="2 fül, vezérelt (?tab=)">
          <Tabs label="Kupon nézetei" value={tab} onValueChange={setTab}
            items={[{ value: 'attekintes', label: 'Áttekintés', content: panel('Áttekintés') }, { value: 'idozites', label: 'Időzítések', content: panel('Időzítések') }]} />
          <p className="tl-out" data-out="tab">fül: {tab}</p>
        </Case>
        <Case id="tabs-tiz" title="10 fül: görgethető sor, halványuló szél, számláló, tiltott" wide>
          <Tabs label="Analitika nézetei" defaultValue="Rajok"
            items={tiz.map((t, i) => ({ value: t, label: t, count: i === 2 ? 3 : undefined, disabled: i === 7, content: panel(t) }))} />
        </Case>
        <Case id="tabs-hosszu" title="Hosszú fülnév">
          <Tabs label="Programok" items={[{ value: 'a', label: 'Őszi kupon- és javítóhét partnerprogram (mintaadat)', content: panel('Hosszú') }, { value: 'b', label: 'Rövid', content: panel('Rövid') }]} />
        </Case>
      </Grid>
      <Grid title="Oldal-navigáció (NavTabs) – linkek, aria-current">
        <Case id="navtabs" title="Naptár nézetei (router-független link)" wide>
          <NavTabs label="Naptár nézetei" renderLink={hashLink}
            items={[{ href: 'naptar', label: 'Naptár', current: true }, { href: 'esemenyek', label: 'Események', count: 12 }, { href: 'kulonleges', label: 'Különleges napok' }, { href: 'erdekessegek', label: 'Napi érdekességek' }]} />
        </Case>
      </Grid>
      <Grid title="Oldalfej és morzsamenü (PageHeader, Breadcrumbs) – 7A">
        <Case id="ph-alap" title="Cím, leírás, morzsa, 2 művelet; usePageTitle" wide>
          <PageHeader title={cim} description="Kupon-sablon · 3 időzítés (mintaadat)" renderLink={hashLink}
            breadcrumbs={[{ label: 'Kuponok', href: 'kuponok' }, { label: 'Sablonok', href: 'sablonok' }, { label: cim }]}
            actions={<><Button variant="secondary" onClick={() => setCim(cim === HOSSZU ? 'Nyári kávé 10%' : HOSSZU)}>Átnevezés</Button><Button>Új időzítés</Button></>} />
        </Case>
        <Case id="ph-hosszu" title="Nagyon hosszú elemnév, 3+ művelet → „⋯”" wide>
          <PageHeader title={HOSSZU} renderLink={hashLink} breadcrumbsLabel="Hol vagy (2. példa)" breadcrumbs={[{ label: 'Partnerek', href: 'partnerek' }, { label: HOSSZU }]}
            actions={<><Button variant="secondary">Szerkesztés</Button><Button>Új kupon</Button>
              <DropdownMenu label="További műveletek" trigger={<IconButton aria-label="További műveletek"><MoreIcon /></IconButton>}
                items={[{ label: 'Archiválás' }, 'separator', { label: 'Törlés…', danger: true }]} /></>} />
        </Case>
        <Case id="ph-tolt" title="Töltés (csontváz)"><PageHeader title="" loading breadcrumbsLabel="Hol vagy (3. példa)" breadcrumbs={[{ label: 'Partnerek', href: 'partnerek' }, { label: 'Töltöm…' }]} renderLink={hashLink} /></Case>
        <Case id="ph-nincs" title="Nem található; jogosultság nélküli szülő (nem link)">
          <PageHeader title="Nincs ilyen partner" breadcrumbsLabel="Hol vagy (4. példa)" description="Lehet, hogy közben törölték. Nézd meg a partnerlistát." renderLink={hashLink}
            breadcrumbs={[{ label: 'Admin' }, { label: 'Partnerek', href: 'partnerek' }, { label: 'Nem található' }]} actions={<Button variant="secondary">Vissza a listához</Button>} />
        </Case>
        <Case id="crumbs-sok" title="7 szint: a középsők „…” mögött" wide>
          <Breadcrumbs label="Hol vagy (5. példa)" renderLink={hashLink} items={['Admin', 'Tartalom', 'Kuponok', 'Sablonok', 'Nyári', 'Kávézók', 'Nyári kávé 10%'].map((l, i, a) => ({ label: l, href: i < a.length - 1 ? `sz${i}` : undefined }))} />
        </Case>
      </Grid>
    </>
  );
}

mount('Rétegek – navigáció', 'Fülek (panelváltó és linkes), oldalfej, morzsamenü, a böngészőfül címe (usePageTitle).', <Oldal />);
