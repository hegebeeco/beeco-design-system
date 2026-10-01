import { useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../cx';
import { Button } from '../inputs/Button';
import { BeeMoment } from '../meh/BeeMoment';
import { HexLoader } from '../meh/motion';

/** Feliratsáv (WebVTT) */
export type CaptionTrack = { src: string; srclang: string; label: string; default?: boolean };

export type VideoPlayerProps = {
  /** A videó címe – a lejátszó akadálymentes neve (kötelező) */
  title: string;
  /** Videófájl címe. Amíg nincs (pl. aláírt link készül), a lejátszó töltést mutat. */
  src?: string;
  poster?: string;
  captions?: ReadonlyArray<CaptionTrack>;
  /** Ha nincs felirat, szóljon-e a lejátszó alatt (szerkesztőfelületen hasznos; alap: igen) */
  warnNoCaptions?: boolean;
  onError?: (code: number) => void;
  className?: string;
};

/** A MediaError kódjai → mi a baj és mi a teendő */
const ERR: Record<number, string> = {
  2: 'A videó nem töltődött le (hálózati hiba). Ellenőrizd a kapcsolatot, és próbáld újra.',
  3: 'A videófájl sérült, nem lehet lejátszani. Töltsd fel újra.',
  4: 'Ezt a videót a böngésző nem tudja lejátszani (rossz vagy nem támogatott formátum). MP4 (H.264) vagy WebM fájlt tölts fel.',
};
const SEEK = 5;

/**
 * VideoPlayer (organizmus, Javaslat 06b/15): natív <video> a böngésző saját vezérlőivel + poszter, feliratsávok,
 * billentyűk (Szóköz/K lejátszás–szünet, ←/→ 5 mp, M némítás), töltés és hiba állapot újrapróbálással.
 */
export function VideoPlayer({ title, src, poster, captions = [], warnNoCaptions = true, onError, className }: VideoPlayerProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [code, setCode] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [said, setSaid] = useState('');

  const onKey = (e: KeyboardEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    const k = e.key.toLowerCase();
    // A Szóközt a böngésző natív vezérlője kezeli a fókuszált <video controls>-on (ha mi is kezelnénk, kétszer váltana)
    if (k === 'k') { if (v.paused) void v.play().catch(() => undefined); else v.pause(); }
    else if (k === 'arrowleft' || k === 'arrowright') { v.currentTime = Math.max(0, v.currentTime + (k === 'arrowleft' ? -SEEK : SEEK)); setSaid(`${k === 'arrowleft' ? 'Vissza' : 'Előre'} ${SEEK} másodperc`); }
    else if (k === 'm') { v.muted = !v.muted; setSaid(v.muted ? 'Némítva' : 'Hang bekapcsolva'); }
    else return;
    e.preventDefault();
  };

  const showLoading = !src || state === 'loading';
  return (
    <figure className={cx('bc-video', className)} data-state={src ? state : 'loading'}>
      <div className="bc-video-frame">
        {state === 'error' ? (
          <BeeMoment inline live="alert" szerep="gondolkodo" sima={ERR[code] ?? 'A videó nem játszható le. Próbáld újra, vagy töltsd fel újra a fájlt.'}
            action={<Button variant="secondary" size="sm" onClick={() => { setState('loading'); setAttempt((n) => n + 1); }}>Újrapróbálás</Button>} />
        ) : (
          <>
            {src && (
              <video key={`${src}#${attempt}`} ref={video} className="bc-video-el" controls preload="metadata" playsInline tabIndex={0}
                poster={poster} src={src} aria-label={title}
                onLoadedMetadata={() => setState('ready')} onCanPlay={() => setState('ready')}
                onPlay={() => setSaid('Lejátszás')} onPause={() => setSaid('Szünet')}
                onError={(e) => { const c = e.currentTarget.error?.code ?? 0; setCode(c); setState('error'); onError?.(c); }} onKeyDown={onKey}>
                {captions.map((t) => <track key={t.src} kind="captions" src={t.src} srcLang={t.srclang} label={t.label} default={t.default} />)}
              </video>
            )}
            {showLoading && <div className="bc-video-loading" role="status"><HexLoader label="Töltöm a videót" /><span>Töltöm a videót…</span></div>}
          </>
        )}
      </div>
      <figcaption className="bc-video-cap">
        <span className="bc-video-title">{title}</span>
        {src && state !== 'error' && <span className="bc-video-keys">Billentyűk: Szóköz vagy K – lejátszás/szünet · ←/→ – 5 mp · M – némítás</span>}
        {warnNoCaptions && !captions.length && state !== 'error' && <span className="bc-video-nocc">Ehhez a videóhoz nincs felirat – tölts fel egy .vtt feliratfájlt, hogy hang nélkül is érthető legyen.</span>}
      </figcaption>
      <p className="bc-sr" role="status">{said}</p>
    </figure>
  );
}
