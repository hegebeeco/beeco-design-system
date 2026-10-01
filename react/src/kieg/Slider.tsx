import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { Field, type FieldProps } from '../field/Field';
import { FieldInput } from '../field/FieldInput';
import { formatHu } from '../inputs/number';
import { defaultBig, keyValue, pctOf, snap, valueAt, type SliderSpec } from './sliderCore';

type Common = FieldProps & {
  min: number;
  max: number;
  /** Lépésköz (alap 1) */
  step?: number;
  /** PageUp/PageDown lépése (alap: a tartomány tizede) */
  bigStep?: number;
  /** Mértékegység a kijelzésben és a tartományban: km, %, Ft */
  unit?: string;
  /** Saját kijelzés (alap: magyar szám + egység) */
  format?: (v: number) => string;
  /** Űrlapba küldéshez (rejtett mező) */
  name?: string;
};
export type SliderProps = Common & { value: number; onChange: (value: number) => void };
export type RangeSliderProps = Common & {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  /** Legalább ennyi legyen a két fogantyú között (alap 0) */
  minGap?: number;
};

const fmt = (unit: string | undefined, step: number) => (v: number) => `${formatHu(v, (String(step).split('.')[1] ?? '').length)}${unit ? ` ${unit}` : ''}`;

type TrackProps = { values: number[]; onChange: (v: number[]) => void; spec: SliderSpec; labels: string[]; format: (v: number) => string; disabled?: boolean; minGap: number; describedBy?: string; invalid?: boolean };

/** A sáv + 1 vagy 2 fogantyú (role="slider"). Egér, érintés (húzás, koppintás a sávra) és billentyűzet. */
function Track({ values, onChange, spec, labels, format, disabled, minGap, describedBy, invalid }: TrackProps) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<number | null>(null);
  const set = (i: number, raw: number) => {
    let x = snap(raw, spec);
    if (values.length === 2) x = i === 0 ? Math.min(x, values[1] - minGap) : Math.max(x, values[0] + minGap);
    if (x === values[i]) return;
    const next = [...values]; next[i] = x; onChange(next);
  };
  const thumbs = () => track.current?.querySelectorAll<HTMLElement>('[role=slider]');
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    const v = valueAt(e.clientX, e.currentTarget.getBoundingClientRect(), spec);
    // A közelebbi fogantyú mozdul (egyenlő távolságnál a „menetirány” szerinti)
    const i = values.length === 1 ? 0 : Math.abs(v - values[0]) < Math.abs(v - values[1]) || (v < values[0]) ? 0 : 1;
    set(i, v); drag.current = i;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault(); thumbs()?.[i]?.focus();
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => { if (drag.current !== null) set(drag.current, valueAt(e.clientX, e.currentTarget.getBoundingClientRect(), spec)); };
  const onKey = (i: number) => (e: KeyboardEvent<HTMLSpanElement>) => {
    const v = keyValue(e.key, values[i], spec);
    if (v === null || disabled) return;
    e.preventDefault(); set(i, v);
  };
  const lo = values.length === 2 ? pctOf(values[0], spec) : 0;
  const hi = pctOf(values[values.length - 1], spec);

  return (
    <div ref={track} className="bc-slider-track" data-disabled={disabled || undefined} onPointerDown={onDown} onPointerMove={onMove}
      onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
      <span className="bc-slider-rail" aria-hidden="true"><span className="bc-slider-fill" style={{ left: `${lo}%`, width: `${hi - lo}%` }} /></span>
      {values.map((v, i) => (
        <span key={i} role="slider" tabIndex={disabled ? -1 : 0} className="bc-slider-thumb" style={{ left: `${pctOf(v, spec)}%` }}
          aria-label={labels[i]} aria-valuemin={i === 1 ? values[0] + minGap : spec.min} aria-valuemax={i === 0 && values.length === 2 ? values[1] - minGap : spec.max}
          aria-valuenow={v} aria-valuetext={format(v)} aria-disabled={disabled || undefined} aria-describedby={describedBy}
          aria-invalid={invalid || undefined} aria-orientation="horizontal" onKeyDown={onKey(i)} />
      ))}
    </div>
  );
}

/** Mindkét csúszka közös kerete: Field (címke, súgó, tartomány) + élő érték-kijelzés + sáv + min/max felirat */
function Frame(p: Common & { values: number[]; onValues: (v: number[]) => void; minGap?: number; thumbLabels: (label: string) => string[] }) {
  const step = p.step ?? 1;
  const spec: SliderSpec = { min: p.min, max: p.max, step, bigStep: p.bigStep ?? defaultBig(p.min, p.max, step) };
  const format = p.format ?? fmt(p.unit, step);
  const shown = p.values.map(format).join(' – ');
  return (
    <Field label={p.label} help={p.help} range={p.range ?? `${format(p.min)} – ${format(p.max)} · lépés: ${format(step)}`} error={p.error} notice={p.notice}
      required={p.required} disabled={p.disabled} className={p.className} labelFor={false}>
      <FieldInput>
        {(f) => (
          <div className="bc-slider">
            <output className="bc-slider-out" aria-hidden="true">{shown}</output>
            <Track values={p.values} onChange={p.onValues} spec={spec} labels={p.thumbLabels(p.label)} format={format} disabled={p.disabled}
              minGap={p.minGap ?? 0} describedBy={f.describedBy} invalid={f.invalid} />
            {p.name && <input type="hidden" name={p.name} value={p.values.join('–')} aria-labelledby={`${f.id}-label`} />}
          </div>
        )}
      </FieldInput>
    </Field>
  );
}

/**
 * Slider (atom + Field, Javaslat 06a/4): egy érték húzással, koppintással vagy billentyűvel
 * (nyilak: lépés · PageUp/PageDown: nagy lépés · Home/End: határ). Érintésen 44 px-es fogantyú.
 */
export function Slider({ value, onChange, ...rest }: SliderProps) {
  return <Frame {...rest} values={[value]} onValues={(v) => onChange(v[0])} thumbLabels={(l) => [l]} />;
}

/** RangeSlider: két fogantyú (alsó és felső határ) – nem keresztezhetik egymást; minGap tartja a távolságot. */
export function RangeSlider({ value, onChange, minGap, ...rest }: RangeSliderProps) {
  return <Frame {...rest} values={value} minGap={minGap} onValues={(v) => onChange([v[0], v[1]])} thumbLabels={(l) => [`${l}: alsó határ`, `${l}: felső határ`]} />;
}
