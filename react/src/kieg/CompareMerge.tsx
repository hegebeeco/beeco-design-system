import { useId, useState, type ReactNode } from 'react';
import { cx } from '../cx';
import { HelpButton } from '../field/HelpButton';
import { Button } from '../inputs/Button';
import { RadioGroup } from '../inputs/Choice';
import { ProgressBar } from '../meh/motion';
import { KiegDialog } from './KiegDialog';
import { MergeFieldChoice } from './MergeField';
import { differing, isBlank, mergedValues, showValue, suggest, type MergeFieldDef, type MergeRecord } from './merge';

export type CompareMergeProps = {
  /** Az összefésülendő rekordok (2 vagy több) */
  records: MergeRecord[];
  fields: MergeFieldDef[];
  /** Mezőnként melyik rekord értéke maradjon: { name: 'poi-1204' } */
  choices: Record<string, string>;
  onChoicesChange: (choices: Record<string, string>) => void;
  /** Melyik rekord marad meg (azonosító, kapcsolatok) – ha megadod, ezt is választani kell */
  survivor?: string;
  onSurvivorChange?: (id: string) => void;
  /** Az összefésülés; ígéretnél a gomb pörög, hiba esetén az ablak kiírja és újrapróbálható */
  onMerge: (result: Record<string, unknown>, choices: Record<string, string>) => void | Promise<void>;
  /** A megerősítő ablak következmény-mondata */
  consequence?: ReactNode;
  className?: string;
};

/**
 * CompareMerge (organizmus, Javaslat 06a/11): rekordok egymás mellett, mezőnként rádiós választás, eltérések kiemelve
 * (szöveggel is: „eltér”), javaslat a kitöltött értékekre, élő eredmény-előnézet, megerősítés.
 */
export function CompareMerge({ records, fields, choices, onChoicesChange, survivor, onSurvivorChange, onMerge, consequence, className }: CompareMergeProps) {
  const uid = useId();
  const [showSame, setShowSame] = useState(false);
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>();
  const diff = differing(records, fields);
  const diffKeys = new Set(diff.map((f) => f.key));
  const same = fields.filter((f) => !diffKeys.has(f.key));
  const decided = diff.filter((f) => choices[f.key]).length;
  const result = mergedValues(records, fields, choices);
  const reqErr = (f: MergeFieldDef) => (f.required && choices[f.key] && isBlank(result[f.key]) ? `A(z) „${f.label}” nem lehet üres – válassz kitöltött értéket.` : undefined);
  const blocked = diff.some(reqErr);
  const needSurvivor = Boolean(onSurvivorChange) && !survivor;
  const ready = decided === diff.length && !blocked && !needSurvivor;
  const missing = [diff.length - decided > 0 && `${diff.length - decided} mező`, needSurvivor && 'a megmaradó rekord', blocked && 'egy kötelező mező üres'].filter(Boolean).join(', ');

  const run = async () => {
    if (busy) return;
    setErr(undefined);
    try { const r = onMerge(result, choices); if (r instanceof Promise) { setBusy(true); await r; } setBusy(false); setAsking(false); }
    catch (e) { setBusy(false); setErr(`Nem sikerült az összefésülés${e instanceof Error && e.message ? `: ${e.message}` : ''}. Próbáld újra.`); }
  };
  const survivorLabel = records.find((r) => r.id === survivor)?.label;

  return (
    <div className={cx('bc-merge', className)}>
      <div className="bc-merge-head">
        <div className="bc-merge-intro">
          <p><strong>{diff.length} mező tér el</strong>, {same.length} egyezik. Mezőnként válaszd ki, melyik érték maradjon.</p>
          <HelpButton label="Összefésülés">Az egyező mezők maradnak, ahogy vannak. Az eltérőknél te döntöd el, melyik rekord értéke kerül az eredménybe. A „Javaslat” csak ott dönt, ahol egyetlen rekordban van kitöltve az adat.</HelpButton>
        </div>
        <div className="bc-row">
          <Button variant="secondary" size="sm" onClick={() => onChoicesChange(suggest(records, fields, choices))}>Javaslat: a kitöltött értékek</Button>
          {records.map((r) => (
            <Button key={r.id} variant="ghost" size="sm" onClick={() => onChoicesChange(Object.fromEntries(diff.map((f) => [f.key, r.id])))}>Mind innen: {r.label}</Button>
          ))}
        </div>
        <div className="bc-merge-progress">
          <ProgressBar value={diff.length ? decided / diff.length : 1} label="Eldöntött mezők" />
          <span className="bc-count" role="status">{decided}/{diff.length} eltérő mező eldöntve</span>
        </div>
      </div>

      {onSurvivorChange && (
        <RadioGroup label="Melyik rekord maradjon meg?" name={`${uid}-survivor`} value={survivor} onChange={onSurvivorChange}
          help="A megmaradó rekord azonosítója, értékelései és kapcsolatai maradnak; a másik törlődik. A mezők értékét lent választod."
          options={records.map((r) => ({ value: r.id, label: r.label }))} />
      )}

      <div className="bc-merge-fields">
        {diff.map((f) => <MergeFieldChoice key={f.key} field={f} records={records} chosen={choices[f.key]} error={reqErr(f)}
          onChoose={(id) => onChoicesChange({ ...choices, [f.key]: id })} />)}
        {diff.length === 0 && <div className="bc-alert is-info"><p>Minden mező egyezik{onSurvivorChange ? ' – csak a megmaradó rekordot kell kiválasztanod.' : ': az összefésülés csak a duplikátumot szünteti meg.'}</p></div>}
      </div>

      {same.length > 0 && (
        <div className="bc-merge-same">
          <Button variant="ghost" size="sm" aria-expanded={showSame} onClick={() => setShowSame(!showSame)}>{showSame ? 'Egyező mezők elrejtése' : `Egyező mezők mutatása (${same.length})`}</Button>
          {showSame && <dl className="bc-merge-result">{same.map((f) => <div key={f.key}><dt>{f.label}</dt><dd>{isBlank(result[f.key]) ? '(üres)' : (f.format ?? showValue)(result[f.key])} <span className="bc-badge is-muted">egyezik</span></dd></div>)}</dl>}
        </div>
      )}

      {diff.length > 0 && <div className="bc-card is-flat bc-merge-preview">
        <h3 className="bc-card-title">Az eredmény</h3>
        <dl className="bc-merge-result">
          {diff.map((f) => (
            <div key={f.key} data-result={f.key}><dt>{f.label}</dt>
              <dd>{choices[f.key] ? (isBlank(result[f.key]) ? '(üres)' : (f.format ?? showValue)(result[f.key])) : <em className="bc-merge-todo">még nem választottál</em>}</dd></div>
          ))}
        </dl>
      </div>}

      <div className="bc-form-actions bc-merge-actions">
        {!ready && <span className="bc-merge-missing">Hiányzik: {missing}.</span>}
        <Button disabled={!ready} onClick={() => setAsking(true)}>Összefésülés</Button>
      </div>

      <KiegDialog open={asking} onCancel={() => { if (!busy) setAsking(false); }} title="Összefésülöd a rekordokat?"
        actions={<>
          <Button variant="secondary" data-autofocus disabled={busy} onClick={() => setAsking(false)}>Mégse</Button>
          <Button variant="danger" busy={busy} onClick={() => void run()}>Végleges összefésülés</Button>
        </>}>
        <p>{consequence ?? `${survivorLabel ? `Megmarad: ${survivorLabel}. ` : ''}A többi rekord törlődik, a választott értékek a megmaradóba kerülnek. Ez nem vonható vissza.`}</p>
        {err && <div className="bc-alert is-danger" role="alert"><p>{err}</p></div>}
      </KiegDialog>
    </div>
  );
}
