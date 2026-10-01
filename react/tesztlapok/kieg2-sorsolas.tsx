import { useRef, useState } from 'react';
import { PrizeDrawReveal, type DrawParticipant, type DrawRecord } from '../src/kieg2';
import { Case, Grid, mount } from './_keret';

/** Mintaadat: kitalált, részben takart nevek (a projekt így adja át) */
const NEVEK = ['Kiss A.', 'Nagy B.', 'Tóth C.', 'Szabó D.', 'Horváth E.', 'Varga F.', 'Kovács G.', 'Molnár H.', 'Németh I.', 'Farkas J.', 'Balogh K.', 'Papp L.',
  'Takács M.', 'Juhász N.', 'Lakatos O.', 'Mészáros P.', 'Oláh R.', 'Simon S.', 'Rácz T.', 'Fekete Ú.', 'Szilágyi V.', 'Török Z.', 'Fehér Ő.', 'Gál Ű.'];
const SOK: DrawParticipant[] = NEVEK.map((n, i) => ({ id: `p${i + 1}`, name: `${n} (mintaadat)`, detail: `${['k', 'n', 't', 's'][i % 4]}***@pelda.hu` }));
const EGY: DrawParticipant[] = [SOK[4]];
const HOSSZU: DrawParticipant[] = [
  { id: 'h1', name: 'Hosszúnevű-Szentgyörgyváryné Kisasszonyfalvi Erzsébet Margit (mintaadat)', detail: 'nagyon.hosszu.emailcim.szokoz.nelkul.amit.nem.lehet.tordelni@pelda-domain-nev.hu' },
  { id: 'h2', name: '<b>HTML-szerű</b> név 🐝 (mintaadat)' },
];

/** Mintasorsoló: determinisztikus (a tesztnek), a húzható listából mindig a 3. elemet (vagy az utolsót) adja */
const fixDraw = (pool: ReadonlyArray<DrawParticipant>) => pool[Math.min(2, pool.length - 1)];
const failDraw = () => Promise.reject(new Error('szerverhiba'));
const slowDraw = (pool: ReadonlyArray<DrawParticipant>) => new Promise<DrawParticipant>((r) => setTimeout(() => r(pool[0]), 3500));

function Naplo({ id, ...p }: { id: string } & Omit<Parameters<typeof PrizeDrawReveal>[0], 'onDrawn' | 'onReroll'>) {
  const [sorok, setSorok] = useState<string[]>([]);
  const t0 = useRef(0);
  const add = (s: string) => setSorok((l) => [...l, s]);
  return (
    <>
      <div onClickCapture={(e) => { if ((e.target as HTMLElement).closest('button')?.textContent === 'Sorsolás') t0.current = performance.now(); }}>
        <PrizeDrawReveal {...p}
          onDrawn={(r: DrawRecord) => add(`húzás ${r.attempt}: ${r.winner.id}${r.test ? ' teszt' : ''} ${Math.round(performance.now() - t0.current)}ms`)}
          onReroll={({ previous, reason }) => add(`újra: ${previous.id} – ${reason}`)} />
      </div>
      <p className="tl-out" data-out={id}>{sorok.join(' | ') || 'még nincs húzás'}</p>
    </>
  );
}

mount('Kiegészítők – sorsolás', 'PrizeDrawReveal (06b/14): résztvevők száma, „Sorsolás” rövid méhsejt-felfedéssel (≤ 2,5 s, csökkentett mozgásnál azonnal), nyertes a Bajnok méhvel és hatszög-konfettivel, újrasorsolás csak indokkal, jegyzőkönyv. Minden név mintaadat.', (
  <>
    <Grid title="Sorsolás – bekötött sorsolóval">
      <Case id="sorsolas" title="24 résztvevő, felfedés, újrasorsolás indokkal" wide><Naplo id="sorsolas" prize="2 db mozijegy a Zöld Sarok kávézótól (mintaadat)" participants={SOK} draw={fixDraw} /></Case>
      <Case id="sorsolas-egy" title="1 résztvevő – felfedés nélkül, újrasorsolás nem lehet"><Naplo id="sorsolas-egy" prize="Mézes csomag (mintaadat)" participants={EGY} draw={fixDraw} /></Case>
      <Case id="sorsolas-ures" title="0 résztvevő – a Sorsolás tiltva, teendővel"><Naplo id="sorsolas-ures" prize="Kerti szerszámkészlet (mintaadat)" participants={[]} draw={fixDraw} /></Case>
    </Grid>
    <Grid title="Szélső esetek">
      <Case id="sorsolas-teszt" title="Nincs sorsoló → teszt-sorsolás (crypto), jól láthatóan"><Naplo id="sorsolas-teszt" prize="Vászontáska (mintaadat)" participants={SOK.slice(0, 5)} /></Case>
      <Case id="sorsolas-hiba" title="A sorsoló hibázik → Újrapróbálás"><Naplo id="sorsolas-hiba" prize="Kávé (mintaadat)" participants={SOK.slice(0, 3)} draw={failDraw} /></Case>
      <Case id="sorsolas-lassu" title="Lassú sorsoló → „Még sorsolunk”"><Naplo id="sorsolas-lassu" prize="Növény (mintaadat)" participants={SOK.slice(0, 8)} draw={slowDraw} /></Case>
      <Case id="sorsolas-tolt" title="A résztvevők töltődnek"><Naplo id="sorsolas-tolt" prize="Könyv (mintaadat)" participants={[]} loading draw={fixDraw} /></Case>
      <Case id="sorsolas-hosszu" title="Hosszú nevek és nyeremény, HTML-szerű szöveg, emoji"><Naplo id="sorsolas-hosszu" prize="Egy nagyon hosszú nevű nyeremény: hétvégi wellness-csomag két főre a Balaton-felvidéken, félpanzióval (mintaadat)" participants={HOSSZU} draw={fixDraw} /></Case>
    </Grid>
  </>
));
