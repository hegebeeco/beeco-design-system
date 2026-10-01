import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../cx';
import { HelpButton } from '../field/HelpButton';
import { Button } from '../inputs/Button';
import { formatHu } from '../inputs/number';
import { SegmentedControl } from '../inputs/SegmentedControl';
import { HexLoader } from '../meh/motion';
import { PlusIcon } from './icons';
import { AudienceRuleRow } from './AudienceRule';
import { audienceProblems, describeAudience, newRule, type Audience, type AudienceField } from './audience';

export type AudienceEstimate = {
  /** Becsült létszám (a hívó számolja, pl. a szerver előnézeti hívásából); null = még nincs */
  count: number | null;
  loading?: boolean;
  /** Ha nem sikerült becsülni: rövid ok + teendő */
  error?: string;
};

export type AudienceBuilderProps = {
  fields: ReadonlyArray<AudienceField>;
  value: Audience;
  onChange: (value: Audience) => void;
  estimate?: AudienceEstimate;
  /** Legfeljebb ennyi feltétel (alap 10) */
  maxRules?: number;
  /** Minden hiba látsszon (pl. mentési kísérlet után); különben feltételenként az első kilépés után */
  showErrors?: boolean;
  /** Súgó: mire jó a célcsoport, mi történik, ha üres */
  help?: ReactNode;
  label?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * AudienceBuilder (organizmus, Javaslat 06a/10): „ha … és/vagy …” szabálysorok (mező · feltétel · érték),
 * élő létszám-becslés (a hívó adja), üres és hibás szabály jelzése, legfeljebb maxRules feltétel (számlálóval).
 */
export function AudienceBuilder({ fields, value, onChange, estimate, maxRules = 10, showErrors, label = 'Célcsoport',
  help = 'Kik kapják meg az üzenetet. Feltétel nélkül mindenki; minden feltétel szűkít (ÉS) vagy bővít (VAGY). A létszám becslés – a küldés pillanatában eltérhet.', disabled, className }: AudienceBuilderProps) {
  const uid = useId();
  const [touched, setTouched] = useState<Set<string>>(() => new Set());
  const focusRule = useRef<string | null>(null);
  const addBtn = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLFieldSetElement>(null);
  const problems = audienceProblems(value, fields);
  const bad = Object.keys(problems).length;
  const full = value.rules.length >= maxRules;

  useEffect(() => {
    if (!focusRule.current) return;
    root.current?.querySelector<HTMLElement>(`[data-rule="${focusRule.current}"] select`)?.focus();
    focusRule.current = null;
  });

  const add = () => { if (full) return; const r = newRule(); focusRule.current = r.id; onChange({ ...value, rules: [...value.rules, r] }); };
  const remove = (id: string) => { onChange({ ...value, rules: value.rules.filter((r) => r.id !== id) }); addBtn.current?.focus(); };

  return (
    <fieldset ref={root} className={cx('bc-aud', className)} disabled={disabled} aria-labelledby={`${uid}-l`}>
      <legend className="bc-label-row bc-aud-legend"><span className="bc-label" id={`${uid}-l`}>{label}</span><HelpButton label={label}>{help}</HelpButton></legend>

      {value.rules.length >= 2 && (
        <div className="bc-aud-join">
          <span className="bc-aud-join-label">Kik kapják meg? <span className="bc-muted">ÉS: akikre minden feltétel igaz · VAGY: akikre legalább egy.</span></span>
          <SegmentedControl label="A feltételek kapcsolata" value={value.join} onChange={(join) => onChange({ ...value, join })}
            items={[{ value: 'and', label: 'ÉS' }, { value: 'or', label: 'VAGY' }]} />
        </div>
      )}

      {value.rules.length === 0
        ? <div className="bc-alert is-info"><p><strong>Nincs feltétel:</strong> az üzenetet mindenki megkapja. Szűkítéshez adj hozzá feltételt.</p></div>
        : (
          <ol className="bc-aud-rules">
            {value.rules.map((r, i) => (
              <Fragment key={r.id}>
                {i > 0 && <li className="bc-aud-joiner" aria-hidden="true"><span className="bc-badge is-muted">{value.join === 'and' ? 'ÉS' : 'VAGY'}</span></li>}
                <AudienceRuleRow rule={r} n={i + 1} fields={fields} disabled={disabled}
                  error={showErrors || touched.has(r.id) ? problems[r.id] : undefined}
                  onBlur={() => setTouched((t) => (t.has(r.id) ? t : new Set(t).add(r.id)))}
                  onChange={(nr) => onChange({ ...value, rules: value.rules.map((x) => (x.id === r.id ? nr : x)) })}
                  onRemove={() => remove(r.id)} />
              </Fragment>
            ))}
          </ol>
        )}

      <div className="bc-row bc-aud-add">
        <Button ref={addBtn} variant="secondary" size="sm" icon={<PlusIcon />} onClick={add} disabled={full || disabled}>Feltétel hozzáadása</Button>
        <span className={cx('bc-count', full ? 'is-full' : value.rules.length >= maxRules * 0.9 && 'is-near')}>
          {value.rules.length}/{maxRules} feltétel{full ? ' – elérted a határt' : ''}
        </span>
      </div>

      <div className="bc-aud-estimate" role="status" aria-live="polite">
        <span className="bc-aud-estimate-label">Becsült címzettek</span>
        {estimate?.loading ? <span className="bc-row"><HexLoader label="Számoljuk a címzetteket" /> Számoljuk…</span>
          : estimate?.error ? <span className="bc-error">{estimate.error}</span>
            : <strong className="bc-num bc-aud-count">{estimate?.count == null ? '–' : `${formatHu(estimate.count, 0)} fő`}</strong>}
        <span className="bc-aud-summary">Kik: {describeAudience(value, fields)}</span>
        {bad > 0 && <span className="bc-aud-warn">{bad} hibás feltétel kimaradt a becslésből – javítsd vagy töröld.</span>}
      </div>
    </fieldset>
  );
}
