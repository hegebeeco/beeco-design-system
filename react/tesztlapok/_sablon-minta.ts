// MINTAADAT az oldalsablon-tesztlapokhoz – nem valódi beeco-adat (kitalált nevek és számok).
export type Partner = { id: string; nev: string; varos: string; tipus: string; aktiv: boolean; kuponok: number; modositva: string };

const NEVEK = ['Méhes Kávézó', 'Zöld Sarok Bolt', 'Körforgó Javítóműhely', 'Csomagolásmentes Kamra', 'Bringás Pont', 'Helyi Pékség', 'Second Hand Butik', 'Virágos Rét Tanösvény'];
const VAROS = ['Méhesd', 'Budapest', 'Szeged', 'Pécs', 'Győr'];
export const TIPUSOK = ['Vendéglátás', 'Kereskedelem', 'Szolgáltatás', 'Természet'];

/** n partner, determinisztikusan (minden betöltéskor ugyanaz) */
export function partnerek(n: number): Partner[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `p-${i + 1}`,
    nev: i === 3 ? 'Csomagolásmentes Kamra és Közösségi Tér a Méhesdi Főtér Sarkán, udvari bejárattal' : `${NEVEK[i % NEVEK.length]}${i >= NEVEK.length ? ` ${Math.floor(i / NEVEK.length) + 1}.` : ''}`,
    varos: VAROS[(i * 3) % VAROS.length],
    tipus: TIPUSOK[(i * 5) % TIPUSOK.length],
    aktiv: i % 6 !== 2,
    kuponok: (i * 7) % 13,
    modositva: `2026-${String(9 - (i % 8)).padStart(2, '0')}-${String(1 + ((i * 11) % 28)).padStart(2, '0')}`,
  }));
}
