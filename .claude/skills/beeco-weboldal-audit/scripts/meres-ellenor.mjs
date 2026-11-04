#!/usr/bin/env node
// beeco-weboldal-audit · meres-ellenor.mjs – a mérési terv gépi ellenőrzése élő vagy staging oldalon.
// Használat:
//   export NODE_PATH=$HOME/CLAUDE/beeco-ds-fooldal/node_modules
//   node meres-ellenor.mjs --env live            # https://www.beeco.hu
//   node meres-ellenor.mjs --env staging         # https://beeco-weboldal.webflow.io
//   node meres-ellenor.mjs --env https://x.webflow.io --page fooldal,kapcsolat --out <mappa>
// Kapcsolók: --plan <json> (alap: reference/meresi-terv.json) · --page <id,id> · --consent-loads N (alap 7) · --no-consent
//            --consent-page /útvonal (alap: /) · --slow (a 60 mp-es tesztek is) · --simulate-fix (önteszt: a consent-kör a Webflow gtag('config') sora nélkül tölti be az oldalt, a webhelyet nem módosítja) · --out <mappa> (report.md + meres-ellenor.json)
// Kilépési kód: 0 nincs ✗ · 3 van ✗ (a consent-jel hibája is) · 1 használati hiba.
// Csak olvas: analitikai kérés, űrlapküldés és navigáció nem megy ki (lásd lib-meres-ellenor.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { runPage, consentRound, summarize, toMarkdown } from './lib-meres-ellenor.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true); };
const ENVS = { live: 'https://www.beeco.hu', staging: 'https://beeco-weboldal.webflow.io' };
const envArg = opt('env', 'live');
const origin = ENVS[envArg] || (/^https?:\/\//.test(String(envArg)) ? String(envArg).replace(/\/$/, '') : '');
if (!origin) { console.error('Használat: --env live|staging|<origin>'); process.exit(1); }
const planFile = opt('plan', path.join(here, '..', 'reference', 'meresi-terv.json'));
const plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
const only = opt('page', '') ? String(opt('page')).split(',') : null;
const loads = +opt('consent-loads', plan.consent?.loads || 7);
const outDir = opt('out', '');

let chromium;
try { ({ chromium } = createRequire(import.meta.url)('playwright')); }
catch { console.error('Playwright nem található: export NODE_PATH=$HOME/CLAUDE/beeco-ds-fooldal/node_modules'); process.exit(1); }

const started = new Date().toISOString().slice(0, 16).replace('T', ' ');
const browser = await chromium.launch();
const pages = []; let consent = null;
try {
  if (!argv.includes('--no-consent')) {
    const cp = opt('consent-page', plan.consent?.page || '/');
    console.error(`consent-kör: ${loads} friss betöltés (${origin}${cp})…`);
    consent = await consentRound(browser, origin, { path: cp, loads, gcsRe: plan.consent?.gcsPattern || '^G1[01][01]$', simulateFix: argv.includes('--simulate-fix') });
  }
  for (const pg of plan.pages) {
    if (only && !only.includes(pg.id)) continue;
    console.error(`oldal: ${pg.path}…`);
    pages.push(await runPage(browser, origin, pg, { slow: argv.includes('--slow') }));
  }
} finally { await browser.close(); }

const cnt = summarize(pages, consent);
const md = toMarkdown({ origin, pages, consent, cnt, started });
console.log(md);
if (outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'report.md'), md);
  fs.writeFileSync(path.join(outDir, 'meres-ellenor.json'), JSON.stringify({ origin, started, cnt, consent, pages }, null, 1));
}
process.exit(cnt.fail ? 3 : 0);
