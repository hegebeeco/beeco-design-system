import { sizePair } from './files';
import { IcClose, IcRetry, IcWarn } from './icons';
import { Progress } from './Stepper';
import type { UploadItem } from './useUploads';

/** Töltődő (vagy elakadt) kép csempéje: előnézet, „2,1/3,4 MB”, haladás, Megszakítás / Újra. */
export function UploadTile({ item, onCancel, onRetry }: { item: UploadItem; onCancel: () => void; onRetry: () => void }) {
  const { file, loaded, status } = item;
  const failed = status === 'error';
  const sizeText = sizePair(loaded, file.size);
  return (
    <li className={failed ? 'bc-tile is-upload is-failed' : 'bc-tile is-upload'} data-upload={file.name}>
      <img src={item.preview} alt="" />
      <div className="bc-tile-status">
        {failed ? (
          <>
            <span className="bc-tile-err"><IcWarn />Nem sikerült</span>
            <span className="bc-tile-actions">
              <button type="button" className="bc-icon-btn" onClick={onRetry} aria-label={`Újrapróbálás: ${file.name}`}><IcRetry /></button>
              <button type="button" className="bc-icon-btn" onClick={onCancel} aria-label={`Eltávolítás: ${file.name}`}><IcClose /></button>
            </span>
          </>
        ) : (
          <>
            <span className="bc-tile-size">{sizeText}</span>
            <button type="button" className="bc-icon-btn" onClick={onCancel} aria-label={`Feltöltés megszakítása: ${file.name}`}><IcClose /></button>
          </>
        )}
      </div>
      {!failed && <Progress value={loaded} max={file.size} label={`${file.name} feltöltése`} valueText={sizeText} />}
      {failed && item.error && <span className="bc-sr">{item.error}</span>}
    </li>
  );
}
