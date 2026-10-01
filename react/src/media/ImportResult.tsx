import { useState } from 'react';
import { Button } from '../inputs/Button';
import { formatHu } from '../inputs/number';
import { IcCopy, IcDownload } from './icons';

export type ImportIssue = {
  /** Az Excel sorszáma (ahogy az Excelben látszik, a fejléccel együtt számolva) */
  row: number;
  /** Oszlop neve vagy betűje, ha ismert */
  column?: string;
  /** Mi a baj – ha a backend nem adja meg, üres */
  reason?: string;
  /** Mit tegyél */
  next?: string;
  level: 'error' | 'warning';
};
export type ImportSummary = { total: number; imported: number; issues: readonly ImportIssue[] };

export type ImportResultProps = {
  result: ImportSummary;
  /** A letöltött lista fájlneve */
  fileName?: string;
  /** Egyszerre ennyi sor látszik (a többi a letöltött/másolt listában) */
  limit?: number;
};

const LEVEL = { error: 'Hiba', warning: 'Figyelmeztetés' } as const;
const NO_REASON = 'Az okot a rendszer nem adta meg – nyisd meg a sort az Excelben, és nézd át.';
const csvCell = (s: string) => `"${s.replace(/"/g, '""')}"`;
/** A lista táblázatként (Excelbe illeszthető / letölthető) */
export const issuesToCsv = (issues: readonly ImportIssue[], sep = ';') =>
  [['Sor', 'Oszlop', 'Szint', 'Mi a baj', 'Mit tegyél'], ...issues.map((i) => [String(i.row), i.column ?? '', LEVEL[i.level], i.reason ?? NO_REASON, i.next ?? ''])]
    .map((r) => r.map(csvCell).join(sep)).join('\r\n');

/**
 * ImportResult (organizmus, Javaslat 04 – 5B): az import eredménye – összesítő + a hibás sorok listája
 * (sor, oszlop, ok, teendő), másolható és letölthető. A szint szöveggel is ott van, nem csak színnel.
 */
export function ImportResult({ result, fileName = 'import-hibalista.csv', limit = 200 }: ImportResultProps) {
  const [said, setSaid] = useState('');
  const { total, imported, issues } = result;
  const errors = issues.filter((i) => i.level === 'error').length;
  const warnings = issues.length - errors;
  const shown = [...issues].sort((a, b) => a.row - b.row).slice(0, limit);
  const kind = total === 0 ? 'is-warning' : imported === 0 ? 'is-danger' : issues.length ? 'is-warning' : 'is-success';

  const copy = async () => {
    try { await navigator.clipboard.writeText(issuesToCsv(issues, '\t')); setSaid('A listát a vágólapra másoltam – beillesztheted az Excelbe.'); }
    catch { setSaid('Nem sikerült másolni – töltsd le inkább a listát.'); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob(['﻿' + issuesToCsv(issues)], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = fileName; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaid(`Letöltve: ${fileName}`);
  };

  return (
    <section className="bc-import-result">
      <div className={`bc-alert ${kind}`} role={imported === 0 && total > 0 ? 'alert' : 'status'}>
        <p>
          {total === 0 ? <><strong>A fájlban nincs adatsor.</strong> Csak a fejléc van benne? Töltsd ki a sablont, és próbáld újra.</>
            : <><strong>{formatHu(total, 0)} sorból {formatHu(imported, 0)} bekerült.</strong>{' '}
              {errors > 0 && <>{formatHu(errors, 0)} sor kimaradt (hiba). </>}
              {warnings > 0 && <>{formatHu(warnings, 0)} sor figyelmeztetéssel került be. </>}
              {issues.length === 0 && 'Minden sor rendben volt.'}</>}
        </p>
      </div>
      {issues.length > 0 && (
        <>
          <div className="bc-table-wrap bc-import-list" tabIndex={0} role="region" aria-label={`Hibalista: ${issues.length} sor, ${imported}/${total} bekerült`}>
            <table className="bc-table is-dense">
              <thead><tr><th scope="col" className="is-num">Sor</th><th scope="col">Oszlop</th><th scope="col">Mi a baj, mit tegyél</th></tr></thead>
              <tbody>
                {shown.map((i, n) => (
                  <tr key={`${i.row}-${i.column}-${n}`} className={`is-${i.level}`}>
                    <td className="is-num">{i.row}.</td>
                    <td>{i.column ?? '–'}</td>
                    <td><span className={`bc-badge ${i.level === 'error' ? 'is-danger' : 'is-warning'}`}>{LEVEL[i.level]}</span> {i.reason ?? NO_REASON}{i.next && <> <b>{i.next}</b></>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {issues.length > shown.length && <p className="bc-help">Az első {limit} sort mutatom; a teljes lista ({formatHu(issues.length, 0)} sor) a letöltött fájlban van.</p>}
          <div className="bc-row">
            <Button variant="secondary" size="sm" icon={<IcDownload />} onClick={download}>Hibalista letöltése</Button>
            <Button variant="ghost" size="sm" icon={<IcCopy />} onClick={() => void copy()}>Másolás</Button>
            <span className="bc-notice" role="status">{said}</span>
          </div>
        </>
      )}
    </section>
  );
}
