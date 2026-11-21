import { createRoot } from 'react-dom/client';
import { StrictMode, useEffect, type ReactNode } from 'react';

/** Tesztlap-keret: cím, leírás, esetek rácsa. A téma a rendszert követi (data-theme="auto"), a futtató sötétre is kapcsolja. */
export function mount(title: string, intro: string, body: ReactNode) {
  document.title = `Tesztlap – ${title}`;
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <main className="tl-wrap">
        <header className="bc-page-header">
          <div>
            <p className="bc-muted" style={{ margin: 0 }}>beeco design system · tesztlap</p>
            <h1>{title}</h1>
            <p>{intro}</p>
          </div>
        </header>
        {body}
      </main>
    </StrictMode>,
  );
}

/** Egy eset: rövid név + mit mutat; data-case azonosító a gépi teszthez */
export function Case({ id, title, children, wide }: { id: string; title: string; children: ReactNode; wide?: boolean }) {
  return (
    <section className="tl-case" data-case={id} style={wide ? { gridColumn: '1 / -1' } : undefined} aria-label={title}>
      <h2 className="tl-case-title">{title}</h2>
      {children}
    </section>
  );
}

export function Grid({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <h2 className="tl-group">{title}</h2>
      <div className="tl-grid">{children}</div>
    </>
  );
}

/**
 * Őr a StrictMode-os próbákhoz (a tesztlap első sora: `// react-build: dev-react`): a hatás fejlesztői React + StrictMode alatt KÉTSZER fut
 * (felépít → lebont → újra felépít). A forgatókönyv ezt ellenőrzi (`window.__hatasFutas === 2`); ha egyszer fut, a próba nem bizonyít semmit.
 */
export function HatasSzamlalo() {
  useEffect(() => { const w = window as unknown as { __hatasFutas?: number }; w.__hatasFutas = (w.__hatasFutas ?? 0) + 1; }, []);
  return null;
}
