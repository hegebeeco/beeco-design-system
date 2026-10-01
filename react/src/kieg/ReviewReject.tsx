import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '../inputs/Button';
import { RadioGroup } from '../inputs/Choice';
import { TextArea } from '../inputs/TextArea';
import { shake } from '../meh/motion';

type Props = {
  /** Gyakori okok (rádió); ha nincs, csak a szabad szöveg */
  reasons?: ReadonlyArray<string>;
  busy?: boolean;
  onSubmit: (reason: string) => void;
  onCancel: () => void;
};

const MIN = 10, MAX = 300;

/**
 * Elutasítás indokkal (a ReviewQueue része): gyakori ok VAGY legalább 10 karakteres saját indoklás kötelező.
 * Ctrl/⌘+Enter elküldi, Esc visszalép; nyitáskor a fókusz az első választásra kerül.
 */
export function ReviewReject({ reasons = [], busy, onSubmit, onCancel }: Props) {
  const uid = useId();
  const [preset, setPreset] = useState<string>();
  const [text, setText] = useState('');
  const [err, setErr] = useState<string>();
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { box.current?.querySelector<HTMLElement>('input[type=radio], textarea')?.focus(); }, []);

  const submit = () => {
    if (busy) return;
    const t = text.trim();
    if (!preset && t.length < MIN) {
      setErr(reasons.length ? `Válassz okot, vagy írd le legalább ${MIN} karakterben – a beküldő ebből tudja, mit javítson.` : `Írd le legalább ${MIN} karakterben, miért utasítod el – most ${t.length}.`);
      shake(box.current);
      return;
    }
    onSubmit(preset ? (t ? `${preset}: ${t}` : preset) : t);
  };

  return (
    <div ref={box} className="bc-review-reject bc-anim-rise" role="group" aria-label="Elutasítás indokkal"
      onKeyDown={(e) => {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onCancel(); }
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); submit(); }
      }}>
      {reasons.length > 0 && (
        <RadioGroup label="Miért utasítod el?" name={`${uid}-ok`} value={preset ?? ''} onChange={(v) => { setPreset(v); setErr(undefined); }}
          help="A választott ok a beküldőhöz és a naplóba kerül. Ha egyik sem illik, írd le saját szavaiddal lent."
          options={reasons.map((r) => ({ value: r, label: r }))} />
      )}
      <TextArea label={reasons.length ? 'Kiegészítés (ha egyik ok sem illik: kötelező)' : 'Indoklás'} rows={3} maxLength={MAX}
        help="Pár szó arról, mi a baj és mit kellene javítani. Ez a naplóba kerül, és a beküldő is látja."
        range={reasons.length ? `ok választásával nem kötelező · különben ${MIN}–${MAX} karakter` : `${MIN}–${MAX} karakter`}
        value={text} error={err} required={!preset}
        onChange={(e) => { setText(e.target.value); if (err) setErr(undefined); }} />
      <div className="bc-row is-end">
        <Button variant="secondary" size="sm" onClick={onCancel} disabled={busy}>Mégse (Esc)</Button>
        <Button variant="danger" size="sm" busy={busy} onClick={submit}>Elutasítás</Button>
      </div>
    </div>
  );
}
