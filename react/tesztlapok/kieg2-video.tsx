import { useEffect, useState } from 'react';
import { VideoPlayer, VideoPreview, type CaptionTrack } from '../src/kieg2';
import { TextField } from '../src/inputs/TextField';
import { Case, Grid, mount } from './_keret';

/**
 * Mintavideó HÁLÓZAT NÉLKÜL: a böngésző maga veszi fel egy vászonról (MediaRecorder → WebM blob), a felirat és a poszter is helyben készül.
 * Így a tesztlap egyetlen külső kérést sem indít.
 */
async function makeClip(): Promise<{ src: string; poster: string } | null> {
  if (typeof MediaRecorder === 'undefined') return null;
  const cv = document.createElement('canvas'); cv.width = 320; cv.height = 180;
  const g = cv.getContext('2d')!;
  const css = getComputedStyle(document.documentElement);
  const col = (n: string) => css.getPropertyValue(n).trim();
  const frame = (k: number) => {
    g.fillStyle = col('--bc-surface-accent'); g.fillRect(0, 0, 320, 180);
    g.fillStyle = col('--bc-accent'); g.beginPath(); g.arc(40 + k * 240, 90, 24, 0, Math.PI * 2); g.fill();
    g.fillStyle = col('--bc-black'); g.font = '20px sans-serif'; g.fillText('Mintavideó (mintaadat)', 70, 40);
  };
  frame(0);
  const poster = cv.toDataURL('image/png');
  const rec = new MediaRecorder(cv.captureStream(20), { mimeType: 'video/webm' });
  const parts: Blob[] = [];
  rec.ondataavailable = (e) => parts.push(e.data);
  const done = new Promise<void>((r) => { rec.onstop = () => r(); });
  rec.start();
  const t0 = performance.now();
  await new Promise<void>((r) => { const step = () => { const k = (performance.now() - t0) / 1500; frame(Math.min(1, k)); if (k < 1) requestAnimationFrame(step); else r(); }; requestAnimationFrame(step); });
  rec.stop(); await done;
  return { src: URL.createObjectURL(new Blob(parts, { type: 'video/webm' })), poster };
}

const VTT = 'WEBVTT\n\n00:00.000 --> 00:01.500\nZümm – ez egy mintafelirat.\n';
const CAPS: CaptionTrack[] = [{ src: URL.createObjectURL(new Blob([VTT], { type: 'text/vtt' })), srclang: 'hu', label: 'Magyar', default: true }];

function Oldal() {
  const [clip, setClip] = useState<{ src: string; poster: string } | null>();
  const [link, setLink] = useState('');
  useEffect(() => { void makeClip().then(setClip).catch(() => setClip(null)); }, []);
  return (
    <>
      <Grid title="Saját videófájl – natív lejátszó">
        <Case id="video" title="Poszter, magyar felirat, billentyűk" wide>
          <VideoPlayer title="Így működik a kuponbeváltás (mintaadat)" src={clip?.src} poster={clip?.poster} captions={CAPS} />
        </Case>
        <Case id="video-nincs-felirat" title="Felirat nélkül – figyelmeztet"><VideoPlayer title="Kaptárlátogatás (mintaadat)" src={clip?.src} /></Case>
        <Case id="video-tolt" title="Töltés (még nincs forrás)"><VideoPlayer title="Készülő videó (mintaadat)" /></Case>
        <Case id="video-hiba" title="Nem támogatott / sérült fájl → teendő + Újrapróbálás"><VideoPlayer title="Hibás fájl (mintaadat)" src="data:video/mp4;base64,AAAAIGZ0eXBpc29t" /></Case>
      </Grid>
      <Grid title="Beágyazás (YouTube, Vimeo) – kattintásra tölt">
        <Case id="embed-yt" title="YouTube – kattintás előtt semmi nem megy ki"><VideoPreview title="Beporzók a városban (mintaadat)" url="https://www.youtube.com/watch?v=M7lc1UVf-VE&t=1m5s" /></Case>
        <Case id="embed-vimeo" title="Vimeo"><VideoPreview title="Kertnyitó (mintaadat)" url="https://vimeo.com/76979871" /></Case>
      </Grid>
      <Grid title="Link beillesztése és hibás linkek">
        <Case id="link" title="Beillesztett link → előnézet">
          <TextField label="Videó linkje" type="url" value={link} onChange={(e) => setLink(e.target.value)} maxLength={500}
            help="YouTube-, Vimeo- vagy MP4/WebM-link. Az appban a partner oldalán jelenik meg; a lejátszó csak koppintásra töltődik be." />
          <VideoPreview title="Beillesztett videó (mintaadat)" url={link} />
        </Case>
        <Case id="link-hibak" title="Nem link · nem támogatott · hiányos · nem biztonságos">
          {['ez nem link', 'https://example.com/oldal', 'https://www.youtube.com/watch?v=abc', 'http://example.com/video.mp4'].map((u) => (
            <div key={u}><p className="tl-out">{u}</p><VideoPreview title="Hibás link (mintaadat)" url={u} /></div>
          ))}
        </Case>
      </Grid>
    </>
  );
}
mount('Kiegészítők – videó', 'VideoPlayer és beágyazás (06b/15): natív lejátszó poszterrel és felirattal, billentyűk, töltés és hiba; YouTube/Vimeo csak kattintásra tölt (adatvédelem), hibás link teendővel. A mintavideó a böngészőben készül, hálózat nélkül.', <Oldal />);
