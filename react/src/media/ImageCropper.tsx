import { useState, type KeyboardEvent, type ReactNode } from 'react';
import Cropper from 'react-easy-crop';
import { Field } from '../field/Field';
import { FieldInput } from '../field/FieldInput';
import { Button } from '../inputs/Button';
import { formatHu } from '../inputs/number';
import { SegmentedControl } from '../inputs/SegmentedControl';

export type CropArea = { x: number; y: number; width: number; height: number };
export type AspectPreset = { label: string; value: number };

export type ImageCropperProps = {
  /** A kép (objectURL vagy URL) */
  src: string;
  /** Választható képarányok; ha csak egy van (a projekt rögzíti), a választó nem látszik */
  aspects?: readonly AspectPreset[];
  minZoom?: number;
  maxZoom?: number;
  /** A kivágott terület (a kép eredeti képpontjaiban) – minden mozdulat végén */
  onCrop: (area: CropArea, info: { zoom: number; aspect: AspectPreset }) => void;
  /** Ha a kivágás ennél keskenyebb (px), figyelmeztet: „a kép homályos lehet” */
  minOutputWidth?: number;
  /** Súgó a nagyítás csúszkához (mire kell a kép) */
  zoomHelp?: ReactNode;
  /** Súgó a képarányhoz */
  aspectHelp?: ReactNode;
};

const DEFAULT_ASPECTS: AspectPreset[] = [{ label: '16:9', value: 16 / 9 }, { label: '1:1', value: 1 }];

/**
 * ImageCropper (organizmus, Javaslat 04 – 3A): a react-easy-crop DS-burokban.
 * Húzás és csípés (érintés), görgő; billentyűzet: a keret a nyilakkal mozog, + / − nagyít; csúszka súgóval és tartománnyal; „Alaphelyzet”.
 */
export function ImageCropper({ src, aspects = DEFAULT_ASPECTS, minZoom = 1, maxZoom = 8, onCrop, minOutputWidth, zoomHelp, aspectHelp }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(minZoom);
  const [aspect, setAspect] = useState(aspects[0]);
  const [small, setSmall] = useState<number | null>(null);
  const clampZoom = (z: number) => Math.min(maxZoom, Math.max(minZoom, Math.round(z * 10) / 10));
  const zoomText = `${formatHu(zoom, 1)}×`;

  // + / − (és a számbillentyűzet) nagyít a vágókereten is
  const onKey = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    if (e.key === '+' || e.key === '=') { e.preventDefault(); setZoom((z) => clampZoom(z + 0.2)); }
    if (e.key === '-' || e.key === '_') { e.preventDefault(); setZoom((z) => clampZoom(z - 0.2)); }
  };
  const reset = () => { setZoom(minZoom); setCrop({ x: 0, y: 0 }); };

  return (
    <div className="bc-cropper" onKeyDown={onKey}>
      {aspects.length > 1 && (
        <div className="bc-cropper-row">
          <span className="bc-label" id="bc-crop-aspect">Képarány</span>
          <SegmentedControl label="Képarány" value={aspect.label} onChange={(l) => setAspect(aspects.find((a) => a.label === l) ?? aspects[0])}
            items={aspects.map((a) => ({ value: a.label, label: a.label }))} />
          {aspectHelp && <span className="bc-help">{aspectHelp}</span>}
        </div>
      )}
      <div className="bc-cropper-stage">
        <Cropper image={src} crop={crop} zoom={zoom} aspect={aspect.value} minZoom={minZoom} maxZoom={maxZoom} zoomSpeed={0.5} keyboardStep={10}
          onCropChange={setCrop} onZoomChange={(z) => setZoom(clampZoom(z))} objectFit="contain" showGrid
          classes={{ containerClassName: 'bc-cropper-box', cropAreaClassName: 'bc-cropper-area' }}
          cropperProps={{ 'aria-label': `Kivágás helye (${aspect.label}) – a nyilakkal mozgatod, a + és − gombbal nagyítasz`, role: 'group' }}
          onCropComplete={(_, px) => { setSmall(minOutputWidth && px.width < minOutputWidth ? Math.round(px.width) : null); onCrop(px, { zoom, aspect }); }} />
      </div>
      <Field label="Nagyítás" help={zoomHelp ?? 'Húzd a csúszkát, vagy nyomd a + és − gombot, hogy a lényeg kitöltse a keretet. Egyes képernyőkön kisebben jelenik meg a kép, ezért ne vágd túl szorosra.'}
        range={`${formatHu(minZoom, 0)}–${formatHu(maxZoom, 0)}×`} notice={small ? `A kivágás csak ${small} px széles (legalább ${minOutputWidth} px kell) – a kép homályos lehet. Nagyíts kevésbé, vagy válassz nagyobb képet.` : undefined}>
        <FieldInput>
          {(f) => (
            <div className="bc-cropper-zoom">
              <input id={f.id} type="range" className="bc-range" min={minZoom} max={maxZoom} step={0.1} value={zoom} aria-describedby={f.describedBy}
                aria-valuetext={zoomText} onChange={(e) => setZoom(clampZoom(Number(e.target.value)))} />
              <output htmlFor={f.id} className="bc-cropper-out" data-zoom>{zoomText}</output>
              <Button variant="secondary" size="sm" onClick={reset} disabled={zoom === minZoom && crop.x === 0 && crop.y === 0}>Alaphelyzet</Button>
            </div>
          )}
        </FieldInput>
      </Field>
    </div>
  );
}
