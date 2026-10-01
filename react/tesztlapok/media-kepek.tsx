import { useState } from 'react';
import { Avatar, Gallery, ImageCropper, ImageUploader, type CropArea, type GalleryImage } from '../src/media';
import { Case, Grid, mount } from './_keret';
import { imageUpload, images, svgImg } from './_media-minta';

const HELP = 'Ezek a képek jelennek meg az appban a hely oldalán; az első a borító, az látszik a térképes kártyán is. Világos, fekvő fotó a legjobb.';

function U({ id, start, ...p }: { id: string; start: GalleryImage[] } & Partial<Parameters<typeof ImageUploader>[0]>) {
  const [v, setV] = useState<GalleryImage[]>(start);
  return <><ImageUploader label="Képek" help={HELP} images={v} onChange={setV} upload={imageUpload} {...p} />
    <p className="tl-out" data-out={id}>sorrend: {v.map((x) => x.id).join(', ') || 'nincs'} · leírás nélkül: {v.filter((x) => !x.alt).length}</p></>;
}
function G({ id, start, ordering, own }: { id: string; start: GalleryImage[]; ordering?: boolean; own?: boolean }) {
  const [v, setV] = useState<GalleryImage[]>(start);
  return <><Gallery images={v} onChange={setV} ordering={ordering} confirmDelete={own ? (img) => window.confirm(`Törlöd: ${img.alt}?`) : undefined} />
    <p className="tl-out" data-out={id}>sorrend: {v.map((x) => x.id).join(', ')}</p></>;
}
function C({ id, src, fixed, minW }: { id: string; src: string; fixed?: boolean; minW?: number }) {
  const [a, setA] = useState<CropArea | null>(null);
  return <><ImageCropper src={src} aspects={fixed ? [{ label: '1:1', value: 1 }] : undefined} minOutputWidth={minW} onCrop={setA} />
    <p className="tl-out" data-out={id}>kivágás: {a ? `${a.width}×${a.height} px @ ${a.x},${a.y}` : '–'}</p></>;
}

const LONG = 'A Zöld Sarok kávézó terasza egy késő nyári délutánon, virágzó levendulával teli ládákkal, fonott székekkel, a háttérben a régi piactér fáival és egy biciklitárolóval, ahol három kerékpár áll (mintaadat)';

function Oldal() {
  return (
    <>
      <Grid title="Képfeltöltő (1A) – a galéria-rácsba épül">
        <Case id="kep-negy" title="4/10 kép, egy leírás nélkül (fő eset)" wide><U id="negy" start={images(4, { noAlt: [3] })} /></Case>
        <Case id="kep-ures" title="Üres (0 kép)"><U id="ures" start={[]} required /></Case>
        <Case id="kep-egy" title="1 kép"><U id="egy" start={images(1)} maxCount={3} /></Case>
        <Case id="kep-tele" title="Tele: 12/12 kép"><U id="tele" start={images(12)} maxCount={12} /></Case>
        <Case id="kep-kicsi" title="Szűk határ: 2 kép, 1 MB, csak JPG"><U id="kicsi" start={[]} maxCount={2} maxSizeMB={1} accept={['image/jpeg']} /></Case>
        <Case id="kep-hiba" title="Hibával (kötelező)"><U id="hiba" start={[]} required error="Legalább egy kép kell – az app a borítót a hely kártyáján mutatja." /></Case>
        <Case id="kep-tiltott" title="Tiltott"><U id="tiltott" start={images(2)} disabled /></Case>
        <Case id="kep-olvas" title="Csak olvasható"><U id="olvas" start={images(3)} readOnly /></Case>
      </Grid>
      <Grid title="Galéria (2A) és nagyító">
        <Case id="gal-szeles" title="Nagyon széles és magas kép, átlátszó háttér"><G id="szeles" start={images(3, { wide: true })} /></Case>
        <Case id="gal-hosszu" title="Hosszú képleírás"><G id="hosszu" start={[{ id: 'h1', src: svgImg(2), alt: LONG }, ...images(2)]} /></Case>
        <Case id="gal-sorrend-nelkul" title="Sorrend nélkül (ordering=false), projekt-megerősítéssel"><G id="nosort" start={images(3)} ordering={false} own /></Case>
        <Case id="gal-nez" title="Csak nézhető, 0 kép"><Gallery images={[]} /></Case>
      </Grid>
      <Grid title="Képvágó (3A)">
        <Case id="vago" title="16:9 / 1:1, nagyítás 1–8×" wide><C id="vago" src={svgImg(1, 1200, 800, 'vágandó kép')} /></Case>
        <Case id="vago-kicsi" title="Rögzített 1:1, kicsi kép → homályos lehet"><C id="vagokicsi" src={svgImg(3, 300, 200, 'kicsi')} fixed minW={600} /></Case>
      </Grid>
      <Grid title="Avatar">
        <Case id="avatar" title="Méretek, monogram, hibás kép, cég">
          <div className="bc-row">
            <Avatar name="Kovács Ádám" size={24} /><Avatar name="Kovács Ádám" size={32} /><Avatar name="Kovács Ádám" /><Avatar name="Kovács Ádám" size={64} />
            <Avatar name="Zsófia" /><Avatar name="Tóth Kata" src={svgImg(0, 80, 80)} /><Avatar name="Nagy Éva" src="data:image/png;base64,AAAA" />
            <Avatar name="Zöld Sarok Kft." shape="square" size={64} /><span className="bc-row" style={{ gap: 'var(--bc-sp-2)' }}><Avatar name="Kiss Béla" size={32} decorative /> Kiss Béla</span>
          </div>
        </Case>
        <Case id="cimkek" title="Állapotjelvények (bc-badge) és címkék (bc-chip)">
          <div className="bc-row"><span className="bc-badge is-success">Aktív</span><span className="bc-badge is-warning">Ellenőrzésre vár</span><span className="bc-badge is-danger">Lejárt</span><span className="bc-badge is-muted">Piszkozat</span></div>
          <div className="bc-row"><span className="bc-chip"><span>Vegán</span></span><span className="bc-chip"><span>Kutyabarát</span></span><span className="bc-chip"><span>Nagyon hosszú címke, ami levágódik a végén</span></span></div>
        </Case>
      </Grid>
    </>
  );
}
mount('Média – képek', 'Képfeltöltő a galériában (húzás, fájlválasztó, billentyűzet), borító és sorrend, képleírás, nagyító, képvágó, avatar. Minden kép és név mintaadat.', <Oldal />);
