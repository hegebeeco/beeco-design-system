import type { ReactNode } from 'react';
import { ChartCard, type ChartData } from '../src';

// A grafikon-tesztlapok közös kártyája – minden kötelező résszel (3/B); mintaadat
export const FORRAS = 'beeco admin, mintaadat (nem valódi) · lekérdezve: 2026. 10. 01. 09:12';
export const SUGO = 'Mintaadat a tesztlaphoz. Élesben: honnan jön az adat, és hogyan számoljuk (pl. egy felhasználó naponta egyszer számít).';
export const OLVASD = <><p>Minden oszlop vagy pont egy időszak összesítése. A csíkos sáv hiányzó vagy rejtett érték – nem nulla.</p><p>Mintaadat: ebből nem következik semmi a valóságról.</p></>;

/** Egy kártya az összes kötelező résszel (3/B) – a tesztlap rövidítése */
export function K({ title, data, children, ...p }: { title: string; data: ChartData; children: ReactNode; status?: 'ready' | 'loading' | 'error'; onRetry?: () => void; emptyAction?: ReactNode; period?: string }) {
  return (
    <ChartCard title={title} unit={data.yLabel ?? data.unit} period={p.period ?? '2026. 07–09.'} help={SUGO} howToRead={OLVASD} source={FORRAS} data={data} sample
      status={p.status} onRetry={p.onRetry} emptyAction={p.emptyAction}>{children}</ChartCard>
  );
}

