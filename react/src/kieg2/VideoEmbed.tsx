import { useEffect, useRef, useState } from 'react';
import { cx } from '../cx';
import { Button } from '../inputs/Button';
import { HexLoader } from '../meh/motion';
import { parseVideoUrl, type VideoSource } from './videoUrl';
import { VideoPlayer, type CaptionTrack } from './VideoPlayer';

type Embeddable = Extract<VideoSource, { kind: 'youtube' | 'vimeo' }>;
export type VideoEmbedProps = { source: Embeddable; title: string; className?: string };

/**
 * Beágyazott videó KATTINTÁSRA (06b/15, adatvédelem): kattintás előtt egyetlen kérés sem megy a YouTube/Vimeo felé
 * (előnézeti kép sem – az is harmadik féltől jönne). Kattintás után a lejátszó betölt, és elindul.
 */
export function VideoEmbed({ source, title, className }: VideoEmbedProps) {
  const [on, setOn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => { setOn(false); setLoaded(false); setSlow(false); }, [source.embedUrl]);
  useEffect(() => {
    if (!on || loaded) return;
    frame.current?.focus(); // a gomb eltűnt – a fókusz a lejátszóra kerül
    const t = setTimeout(() => setSlow(true), 15_000);
    return () => clearTimeout(t);
  }, [on, loaded]);

  return (
    <figure className={cx('bc-video', 'bc-vembed', className)} data-provider={source.kind} data-state={on ? (loaded ? 'ready' : 'loading') : 'placeholder'}>
      <div className="bc-video-frame">
        {on ? (
          <>
            <iframe ref={frame} className="bc-video-el" src={source.embedUrl} title={`${title} – ${source.provider}-videó`} onLoad={() => setLoaded(true)}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
            {!loaded && (
              <div className="bc-video-loading" role="status">
                <HexLoader label="Töltöm a lejátszót" />
                <span>{slow ? 'Lassan tölt a lejátszó.' : `Töltöm a ${source.provider} lejátszóját…`}</span>
                {slow && <a className="bc-btn is-secondary is-sm" href={source.watchUrl} target="_blank" rel="noopener noreferrer">Megnyitás: {source.provider}</a>}
              </div>
            )}
          </>
        ) : (
          <div className="bc-vembed-ph">
            <span className="bc-badge is-muted">{source.provider}</span>
            <Button size="lg" onClick={() => setOn(true)} aria-describedby={`vembed-${source.id}`}
              icon={<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>}>
              Videó betöltése
            </Button>
            <p className="bc-vembed-note" id={`vembed-${source.id}`}>
              Kattintásra a {source.provider} lejátszója töltődik be, és a {source.provider} ekkor adatot (pl. sütit) tárolhat a gépeden.
            </p>
          </div>
        )}
      </div>
      <figcaption className="bc-video-cap">
        <span className="bc-video-title">{title}</span>
        <a className="bc-video-link" href={source.watchUrl} target="_blank" rel="noopener noreferrer">Megnyitás a {source.provider} oldalán<span className="bc-sr"> (új lapon)</span></a>
      </figcaption>
    </figure>
  );
}

export type VideoPreviewProps = { url: string; title: string; poster?: string; captions?: ReadonlyArray<CaptionTrack>; className?: string };

/**
 * VideoPreview (06b/15): egy beírt/beillesztett link előnézete – saját fájl → VideoPlayer, YouTube/Vimeo → kattintásra betöltő
 * beágyazás, üres → útmutatás, hibás/nem támogatott → mi a baj és mi a teendő.
 */
export function VideoPreview({ url, title, poster, captions, className }: VideoPreviewProps) {
  const s = parseVideoUrl(url);
  if (s.kind === 'empty') return <p className={cx('bc-video-empty', className)}>Még nincs videó – illeszd be a linket (YouTube, Vimeo vagy MP4/WebM).</p>;
  if (s.kind === 'invalid') return <p className={cx('bc-alert is-warning', className)} role="alert" data-reason={s.reason}><span>{s.message}</span></p>;
  if (s.kind === 'file') return <VideoPlayer title={title} src={s.url} poster={poster} captions={captions} className={className} />;
  return <VideoEmbed source={s} title={title} className={className} />;
}
