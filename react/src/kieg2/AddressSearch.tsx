import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Combobox } from '../pickers/Combobox';
import type { AddressHit } from './geo';

export type AddressSearchProps = {
  /** A projekt keresője: lekérdezés → találatok. A DS nem hív semmilyen szolgáltatást magától. */
  search: (query: string, signal: AbortSignal) => Promise<ReadonlyArray<AddressHit>>;
  onPick: (hit: AddressHit) => void;
  label?: string;
  help?: ReactNode;
  /** Ennyi betűtől keres (alap: 3) */
  minChars?: number;
  /** Ennyi ms gépelési szünet után keres (alap: 300) */
  debounceMs?: number;
  disabled?: boolean;
};

/**
 * Címkereső a meglévő Combobox-szal (06b/13): gépelés → késleltetett, megszakítható keresés → lista → választás.
 * Töltés és hiba (Újrapróbálás) a Combobox saját állapotaival. A Combobox nem ad lekérdezés-eseményt,
 * ezért a burok a buborékoló input-eseményből olvassa a beírt szöveget.
 */
export function AddressSearch({ search, onPick, label = 'Cím keresése', minChars = 3, debounceMs = 300, disabled,
  help = 'Írd be a címet vagy a hely nevét (pl. „Andrássy út 12, Budapest”), és válassz a listából – a tű és a koordináták maguktól beállnak.' }: AddressSearchProps) {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<ReadonlyArray<AddressHit>>([]);
  const [picked, setPicked] = useState<AddressHit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [tick, setTick] = useState(0); // újrapróbáláskor nő → újra keres
  const searchRef = useRef(search);
  searchRef.current = search;

  useEffect(() => {
    const q = query.trim();
    if (q.length < minChars) { setHits([]); setLoading(false); setError(undefined); return; }
    const ctl = new AbortController();
    setLoading(true); setError(undefined);
    const t = setTimeout(() => {
      searchRef.current(q, ctl.signal)
        .then((r) => { if (!ctl.signal.aborted) { setHits(r); setLoading(false); } })
        .catch(() => { if (!ctl.signal.aborted) { setLoading(false); setError('A címkeresés most nem működik. Próbáld újra, vagy írd be a koordinátákat.'); } });
    }, debounceMs);
    return () => { clearTimeout(t); ctl.abort(); };
  }, [query, minChars, debounceMs, tick]);

  // A kiválasztott találat a lista cseréje után is megmarad (különben a mező az azonosítót mutatná)
  const options = useMemo(() => {
    const list = hits.map((h) => ({ value: h.id, label: h.label }));
    if (picked && !hits.some((h) => h.id === picked.id)) list.unshift({ value: picked.id, label: picked.label });
    return list;
  }, [hits, picked]);

  return (
    <div className="bc-loc-search">
      {/* Szerveroldali keresés: a Combobox nem szűr újra helyben (filter={false}), a gépelést az onQueryChange adja */}
      <Combobox label={label} help={help} range={`legalább ${minChars} betű`} disabled={disabled}
        filter={false} onQueryChange={setQuery} minChars={minChars}
        placeholder="Utca, házszám, település" options={options} value={picked?.id ?? null}
        loading={loading} loadError={error} onRetry={() => setTick((n) => n + 1)}
        onChange={(id) => {
          const h = hits.find((x) => x.id === id) ?? (picked?.id === id ? picked : null);
          setPicked(h);
          if (h) onPick(h);
        }} />
    </div>
  );
}
