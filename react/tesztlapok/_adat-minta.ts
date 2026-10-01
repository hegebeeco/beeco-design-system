// MINTAADAT a tesztlapokhoz – nem valódi beeco-adat (a számok kitaláltak, csak a komponensek kipróbálására)
import type { ChartData } from '../src';

export type Poi = { id: string; nev: string; kategoria?: string | null; cimkek: string[]; aktiv: boolean; modositva: string; kepek: number | null; cim: string };

const NEVEK = ['Zöld Sarok Kávézó', 'Körforgó Javítóműhely', 'Virágos Rét Tanösvény', 'Méhesdi Piac', 'Csomagolásmentes Kamra', 'Bringás Pont', 'Helyi Pékség', 'Second Hand Butik'];
const KAT = ['Vendéglátás', 'Szolgáltatás', 'Természet', 'Kereskedelem'];
const CIMKE = ['bio', 'javító', 'tanösvény', 'helyi termék', 'vegán', 'bérlés'];

/** n darab POI, determinisztikusan (minden betöltéskor ugyanaz) */
export function pois(n: number): Poi[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `poi-${i + 1}`,
    nev: i === 2 ? 'Nagyon hosszú nevű csomagolásmentes bolt és közösségi tér a Méhesdi főtér sarkán, udvari bejárattal' : `${NEVEK[i % NEVEK.length]}${i >= NEVEK.length ? ` ${Math.floor(i / NEVEK.length) + 1}.` : ''}`,
    kategoria: i % 11 === 5 ? null : KAT[(i * 7) % KAT.length],
    cimkek: CIMKE.filter((_, k) => (i + k) % 4 === 0),
    aktiv: i % 5 !== 3,
    modositva: `2026-${String(9 - (i % 9)).padStart(2, '0')}-${String(1 + ((i * 13) % 28)).padStart(2, '0')}`,
    kepek: i % 6 === 4 ? null : (i * 3) % 7,
    cim: `Méhesd, Fő utca ${i + 1}.`,
  }));
}

const HETEK = ['07. 06.', '07. 13.', '07. 20.', '07. 27.', '08. 03.', '08. 10.', '08. 17.', '08. 24.', '08. 31.', '09. 07.', '09. 14.', '09. 21.'];

/** Aktivált és beváltott kuponok hetente – 2 rejtett hét (< 5 érintett) */
export const kuponHetente: ChartData = {
  categories: HETEK, unit: 'db', xLabel: 'hét (hétfőtől)', yLabel: 'db / hét', gapLabel: 'rejtett hét (< 5 érintett)',
  series: [
    { key: 'akt', label: 'Aktivált kuponok', values: [42, 51, 48, null, 63, 70, 66, 74, null, 81, 77, 88] },
    { key: 'bev', label: 'Beváltások', values: [18, 22, 25, null, 30, 41, 38, 45, null, 52, 49, 60] },
  ],
};

export const egySorozat = (values: Array<number | null>, cats = HETEK.slice(0, values.length), unit = 'db'): ChartData =>
  ({ categories: cats, unit, xLabel: 'hét', series: [{ key: 'a', label: 'Beváltások', values }] });

/** 90 nap – sok kategória (felirat-ritkítás, oldalra görgetés telefonon) */
export const napi90: ChartData = {
  categories: Array.from({ length: 90 }, (_, i) => { const d = new Date(Date.UTC(2026, 6, 1 + i)); return `${String(d.getUTCMonth() + 1).padStart(2, '0')}. ${String(d.getUTCDate()).padStart(2, '0')}.`; }),
  unit: 'fő', xLabel: 'nap', series: [{ key: 'u', label: 'Aktív felhasználók', values: Array.from({ length: 90 }, (_, i) => (i === 40 ? null : 120 + Math.round(40 * Math.sin(i / 6)) + (i % 7) * 4)) }],
};

/** Hosszú kategórianevek – vízszintes sáv */
export const kategoriak: ChartData = {
  categories: ['Vendéglátás', 'Csomagolásmentes és újratöltő boltok, közösségi terek', 'Javítás és kölcsönzés', 'Természet', 'Helyi termelők piaca', 'Egyéb'],
  unit: 'db', xLabel: 'kategória', yLabel: 'POI-k száma', series: [{ key: 'p', label: 'POI-k', values: [48, 31, 27, 19, 12, 4] }],
};

export const hibajegyek: ChartData = {
  categories: HETEK.slice(4), unit: 'db', xLabel: 'hét', yLabel: 'hibajegy / hét',
  series: [{ key: 'uj', label: 'Létrejött', values: [12, 9, 15, 7, 11, 0, 8, 10] }, { key: 'meg', label: 'Megoldott', values: [8, 11, 10, 9, null, 6, 12, 9] }],
};

export const tartalmak: ChartData = {
  categories: ['04.', '05.', '06.', '07.', '08.', '09.'], unit: 'db', xLabel: 'hónap (2026)', yLabel: 'tartalom / hónap',
  series: [{ key: 'k', label: 'Kupon', values: [5, 8, 6, 9, 12, 10] }, { key: 'e', label: 'Esemény', values: [2, 3, 5, 4, 6, 3] }, { key: 'a', label: 'Edukatív anyag', values: [1, 0, 2, 3, 2, 4] }],
};

export const negativ: ChartData = {
  categories: ['04.', '05.', '06.', '07.', '08.', '09.'], unit: 'fő', xLabel: 'hónap (2026)', yLabel: 'változás (fő)',
  series: [{ key: 'v', label: 'Taglétszám változása', values: [14, 6, -9, -3, 11, 4] }],
};

export const negativVonal: ChartData = { ...negativ, series: [...negativ.series, { key: 'c', label: 'Célérték', values: [5, 5, 5, 5, 5, 5] }] };
export const ures: ChartData = { categories: [], unit: 'db', xLabel: 'hét', series: [{ key: 'a', label: 'Beváltások', values: [] }] };
export const csakNull: ChartData = egySorozat([null, null, null, null]);
export const trend = [12, 14, 13, 17, 16, 19, null, 22, 24, 23, 27, 29];
