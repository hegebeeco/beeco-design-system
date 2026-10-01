// Mintaadat a média-tesztlapokhoz: generált SVG-képek (nincs valódi fotó), hamis feltöltő (haladással, megszakítható).
import type { GalleryImage, UploadFn } from '../src/media';

const PAL = [['#D8E4BC', '#8BA863'], ['#C6E0F6', '#66A3DD'], ['#FEEEBB', '#FECF39'], ['#EEF3DE', '#6E8947'], ['#FDEEE6', '#DB3A34']];

/** Színátmenetes SVG-kép data URL-ként; w×h tetszőleges (nagyon széles / magas esethez is) */
export function svgImg(i: number, w = 400, h = 300, text = '') {
  const [a, b] = PAL[i % PAL.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="${w * 0.7}" cy="${h * 0.35}" r="${Math.min(w, h) * 0.15}" fill="#FFF8E7" opacity=".8"/><text x="50%" y="90%" font-family="sans-serif" font-size="${Math.min(w, h) * 0.12}" text-anchor="middle" fill="#2F371E">${text}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const ALTS = ['A kávézó terasza nyáron, virágládákkal (mintaadat)', 'Pult a friss péksüteményekkel (mintaadat)', 'Kerékpártároló a bejárat mellett (mintaadat)',
  'Zöld Sarok belső tere (mintaadat)', 'Kóstoló a helyi termelőkkel (mintaadat)', 'Kert a méhlegelővel (mintaadat)'];

export function images(n: number, opts: { noAlt?: number[]; wide?: boolean } = {}): GalleryImage[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `k${i + 1}`,
    src: opts.wide && i === 0 ? svgImg(i, 1600, 80, 'nagyon széles') : opts.wide && i === 1 ? svgImg(i, 80, 1600, '') : svgImg(i, 400, 300, String(i + 1)),
    alt: opts.noAlt?.includes(i) ? '' : ALTS[i % ALTS.length],
  }));
}

const tried = new Set<string>();
/**
 * Hamis feltöltő: ~1 mp alatt 8 lépésben „tölt”; a nevében „hiba” szót tartalmazó fájl első próbára 60%-nál elakad,
 * a „lassu” nevű 4× lassabb. A megszakítást (AbortSignal) tiszteletben tartja.
 */
export function fakeUpload<R>(make: (file: File) => R, ms = 120): UploadFn<R> {
  return (file, { onProgress, signal }) => new Promise<R>((resolve, reject) => {
    let n = 0; const step = file.size / 8;
    const t = setInterval(() => {
      n = Math.min(file.size, n + step); onProgress(n);
      if (/hiba/.test(file.name) && !tried.has(file.name) && n >= file.size * 0.6) { tried.add(file.name); clearInterval(t); reject(new Error('Megszakadt a kapcsolat 60%-nál.')); return; }
      if (n >= file.size) { clearInterval(t); try { resolve(make(file)); } catch (e) { reject(e); } }
    }, /lassu/.test(file.name) ? ms * 4 : ms);
    signal.addEventListener('abort', () => { clearInterval(t); reject(new DOMException('Megszakítva', 'AbortError')); });
  });
}

let up = 0;
export const imageUpload = fakeUpload<GalleryImage>((f) => ({ id: `fel${++up}`, src: URL.createObjectURL(f), alt: '' }));
