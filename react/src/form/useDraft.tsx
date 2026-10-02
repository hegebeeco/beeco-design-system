import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../inputs/Button';

/**
 * Piszkozat (Javaslat 13/7): a félbehagyott űrlap az eszközön (localStorage) megmarad – lefagyás, véletlen bezárás,
 * lejárt belépés után felajánljuk a visszaállítást. Csak ezen az eszközön, a böngészőben; jelszót, tokent ne tegyél bele.
 * Sikeres mentés után törlődik (az EditPage `draft` beállítása ezt magától intézi).
 */
export type DraftOptions<T> = {
  /** Egyedi kulcs: űrlap + rekord, pl. „uzenet:uj” vagy „esemeny:126”. null = kikapcsolva */
  key: string | null;
  /** Az űrlap mostani értékei (JSON-ként menthető) */
  values: T;
  /** Csak módosított űrlapot mentünk */
  dirty: boolean;
  /** Visszaállításkor ezt hívjuk (pl. react-hook-form reset(values, { keepDefaultValues: true })) */
  onRestore: (values: T) => void;
  /** Ennél régebbi piszkozatot nem ajánlunk fel (alap: 7 nap) */
  maxAgeDays?: number;
  /** Mentés késleltetése gépelés közben (alap: 800 ms) */
  debounceMs?: number;
};

type Stored<T> = { v: 1; savedAt: number; values: T };
const PREFIX = 'bc-draft:';
const read = <T,>(key: string): Stored<T> | null => {
  try { const s = localStorage.getItem(PREFIX + key); const p = s ? JSON.parse(s) : null; return p && p.v === 1 ? p : null; } catch { return null; }
};
const remove = (key: string) => { try { localStorage.removeItem(PREFIX + key); } catch { /* privát mód */ } };

export function useDraft<T>({ key, values, dirty, onRestore, maxAgeDays = 7, debounceMs = 800 }: DraftOptions<T>) {
  // Az induláskor talált piszkozat (csak ezt ajánljuk fel – a gépelés közbeni mentések nem jelennek meg ajánlatként)
  const [found, setFound] = useState<Stored<T> | null>(null);
  const kezdo = useRef<string | null>(null);
  useEffect(() => {
    if (!key || kezdo.current === key) return;
    kezdo.current = key;
    const s = read<T>(key);
    if (s && Date.now() - s.savedAt > maxAgeDays * 864e5) { remove(key); setFound(null); } else setFound(s);
  }, [key, maxAgeDays]);

  // Mentés: módosított űrlapnál, késleltetve; amíg az ajánlat nyitva van, nem írjuk felül a régit
  const json = JSON.stringify(values);
  // Sikeres mentés / elvetés után ugyanazokat az értékeket nem mentjük újra (egy még futó késleltetett írás se hozza vissza)
  const torolt = useRef<string | null>(null);
  useEffect(() => {
    if (!key || !dirty || found || torolt.current === json) return;
    const t = window.setTimeout(() => {
      if (torolt.current === json) return;
      try { localStorage.setItem(PREFIX + key, JSON.stringify({ v: 1, savedAt: Date.now(), values: JSON.parse(json) } satisfies Stored<T>)); } catch { /* tele / privát mód: piszkozat nélkül megy */ }
    }, debounceMs);
    return () => window.clearTimeout(t);
  }, [key, dirty, json, found, debounceMs]);
  const jsonRef = useRef(json);
  jsonRef.current = json;

  const restore = useCallback(() => { if (found) { onRestore(found.values); setFound(null); } }, [found, onRestore]);
  const discard = useCallback(() => { if (key) remove(key); setFound(null); }, [key]);
  const clear = useCallback(() => { torolt.current = jsonRef.current; if (key) remove(key); setFound(null); }, [key]);
  return { draft: found, restore, discard, clear };
}

/** „Van egy be nem fejezett változat” sáv – Visszaállítás / Elvetés */
export function DraftNotice({ savedAt, onRestore, onDiscard }: { savedAt: number; onRestore: () => void; onDiscard: () => void }) {
  const mikor = new Date(savedAt);
  const ma = new Date().toDateString() === mikor.toDateString();
  const ido = mikor.toLocaleString('hu-HU', ma ? { hour: '2-digit', minute: '2-digit' } : { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  return (
    <div className="bc-alert is-info bc-draft" role="status">
      <div>
        <p><strong>Van egy be nem fejezett változatod ({ma ? `ma ${ido}` : ido}).</strong> Ezen az eszközön mentettük, mielőtt elhagytad az oldalt.</p>
        <div className="bc-row bc-draft-actions">
          <Button size="sm" onClick={onRestore}>Visszaállítás</Button>
          <Button size="sm" variant="secondary" onClick={onDiscard}>Elvetés</Button>
        </div>
      </div>
    </div>
  );
}
