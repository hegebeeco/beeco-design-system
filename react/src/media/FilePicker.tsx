import { useId, useState, type ReactNode } from 'react';
import { Field } from '../field/Field';
import { FieldInput } from '../field/FieldInput';
import { Button } from '../inputs/Button';
import { formatHu } from '../inputs/number';
import { checkFiles, mbText, type Rejection } from './files';
import { IcFile } from './icons';

const MB = 1024 * 1024;
/** A fájl mérete emberi formában: kicsinél kB, különben MB (tizedesvesszővel) */
export const fileSizeText = (bytes: number) => (bytes < 0.1 * MB ? `${formatHu(Math.max(1, Math.round(bytes / 1024)), 0)} kB` : `${mbText(bytes)} MB`);

export type FilePickerProps = {
  label: string;
  /** Súgó: mit kell kiválasztani és miért (kötelező, 3/A) */
  help: ReactNode;
  /** A kiválasztott fájl (vezérelt) */
  value: File | null;
  onChange: (file: File | null) => void;
  /** Elfogadott MIME-típusok – a DS a fájl TARTALMÁBÓL ellenőrzi, nem a kiterjesztésből */
  accept: readonly string[];
  /** A fájlválasztó `accept` attribútuma (pl. '.xlsx') – a böngésző szűréséhez */
  acceptAttr?: string;
  maxSizeMB: number;
  /** E fölött csak figyelmeztet (pl. a szerver alapértelmezett határa) */
  warnSizeMB?: number;
  /** Rövid formátum-leírás a korlát-sorba (pl. „.xlsx”) */
  formatText: string;
  /** Rossz típusnál a teendő (pl. „Mentsd el Excel-munkafüzetként (.xlsx)”) */
  typeHint?: string;
  sizeHint?: string;
  /** Külső hiba (pl. a feltöltés nem sikerült) */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  /** Folyamatban (a fájlkártyán „Feltöltés…”, a „Másik fájl” tiltva) */
  busy?: boolean;
};

/**
 * FilePicker (molekula, Javaslat 18): EGY fájl kiválasztása – húzd-ide mező, a DS tartalom-alapú ellenőrzése (típus, méret),
 * kiválasztás után fájlkártya (név, méret, „Másik fájl”). NEM tölt fel: a feltöltést a projekt indítja (pl. egy ablak
 * „Feltöltés” gombja). A FileImport-tól abban tér el, hogy nincs automatikus import és eredménylista.
 */
export function FilePicker({ label, help, value, onChange, accept, acceptAttr, maxSizeMB, warnSizeMB, formatText, typeHint, sizeHint,
  error, required, disabled, busy }: FilePickerProps) {
  const [rej, setRej] = useState<Rejection | null>(null);
  const rejId = useId();
  const pick = async (list: FileList | null) => {
    const f = list?.[0];
    if (!f) return;
    const r = await checkFiles([f], { accept, maxSizeMB, unit: 'fájl', typeHint, sizeHint });
    const elutasitva = r.rejected[0] ?? null;
    setRej(elutasitva);
    onChange(elutasitva ? null : r.ok[0] ?? null);
  };
  const nagy = Boolean(value && warnSizeMB && value.size > warnSizeMB * MB);
  const hiba = error ?? (rej ? `${rej.file} – ${rej.reason}. ${rej.next}` : undefined);

  return (
    <Field label={label} help={help} required={required} disabled={disabled} error={hiba}
      range={`${formatText} · legfeljebb ${formatHu(maxSizeMB, 1)} MB · 1 fájl`}
      notice={nagy ? `A fájl ${formatHu(warnSizeMB ?? 0, 1)} MB-nál nagyobb – a szerver elutasíthatja. Ha nem megy, bontsd kisebb részekre.` : undefined}>
      <FieldInput>
        {(f) => !value ? (
          <label className="bc-dropzone" onDragOver={(e) => { if (!disabled) e.preventDefault(); }}
            onDrop={(e) => { e.preventDefault(); if (!disabled) void pick(e.dataTransfer.files); }}>
            <input id={f.id} type="file" className="bc-upload-input" disabled={disabled} required={required} accept={acceptAttr ?? accept.join(',')}
              aria-describedby={[f.describedBy, rej && rejId].filter(Boolean).join(' ') || undefined} aria-invalid={f.invalid || undefined}
              onChange={(e) => { void pick(e.currentTarget.files); e.currentTarget.value = ''; }} />
            <IcFile /><strong>Fájl kiválasztása</strong><span>vagy húzd ide</span>
          </label>
        ) : (
          <div className="bc-filecard" aria-busy={busy || undefined}>
            <div className="bc-filecard-row"><b>{value.name}</b><span className="bc-filecard-size">{fileSizeText(value.size)}</span></div>
            <div className="bc-filecard-row" role="status">
              <span>{busy ? 'Feltöltés…' : 'Feltöltésre kész.'}</span>
              <Button variant="ghost" size="sm" disabled={busy || disabled} onClick={() => { setRej(null); onChange(null); }}>Másik fájl</Button>
            </div>
          </div>
        )}
      </FieldInput>
    </Field>
  );
}
