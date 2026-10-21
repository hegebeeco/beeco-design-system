#!/usr/bin/env node
// Perszóna-ügynök utasítások kitöltése egy feladatkönyvtár első köréhez.
// Használat: node tools/persona-test/prompts.mjs <scenarios/oldal.json> <runsDir> [--pairs '<json>']
// Kimenet: <runsDir>/_prompts/<persona>-<feladat>[-<lencse>].md, egy fájl = egy ügynök.
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const PERSONA_DIR = path.join(ROOT, 'research/personas');

const args = process.argv.slice(2);
const scenarioArg = args[0];
const runsDir = args[1];
if (!scenarioArg || !runsDir) {
  console.error('Használat: node tools/persona-test/prompts.mjs <scenarios/oldal.json> <runsDir> [--pairs <json>]');
  process.exit(2);
}
const pairsIdx = args.indexOf('--pairs');

const scenarioFile = fs.existsSync(scenarioArg) ? scenarioArg : path.join(PERSONA_DIR, 'scenarios', scenarioArg);
const scenarioDoc = JSON.parse(fs.readFileSync(scenarioFile, 'utf8'));
const personas = JSON.parse(fs.readFileSync(path.join(PERSONA_DIR, 'personas.json'), 'utf8')).personas;
const lenses = JSON.parse(fs.readFileSync(path.join(PERSONA_DIR, 'lenses.json'), 'utf8')).lenses;
const templateRaw = fs.readFileSync(path.join(PERSONA_DIR, 'agent-prompt.md'), 'utf8');
// A sablon törzse az első '---' elválasztó után kezdődik (előtte a főügynöknek szóló bevezető van).
const sepIdx = templateRaw.indexOf('\n---\n');
const template = sepIdx >= 0 ? templateRaw.slice(sepIdx + 5) : templateRaw;

const pairs = pairsIdx >= 0 ? JSON.parse(args[pairsIdx + 1]) : scenarioDoc.firstRound;
if (!Array.isArray(pairs) || !pairs.length) throw new Error('Nincs párosítás (firstRound vagy --pairs).');

const byId = (list, id, kind) => {
  const hit = list.find(x => x.id === id);
  if (!hit) throw new Error(`Ismeretlen ${kind}: ${id}`);
  return hit;
};
const list = xs => (xs || []).map(x => `- ${x}`).join('\n');
const scenarioBase = path.basename(scenarioFile);

const FIVE_SECOND_NOTE = '\n\n**Ötmásodperces feladat:** a `start` után egyetlen `look`, görgetés és kattintás nélkül. Utána rögtön `finish`, a válaszod az, amit 5 másodperc alatt megértettél.\n';

const outDir = path.join(runsDir, '_prompts');
fs.mkdirSync(outDir, { recursive: true });
let count = 0;

for (const pair of pairs) {
  const persona = byId(personas, pair.persona, 'perszóna');
  for (const scenarioId of pair.scenarios) {
    const scenario = byId(scenarioDoc.scenarios, scenarioId, 'feladat');
    const fiveSecond = scenario.mode === 'fiveSecond';
    // Az ötmásodperces teszthez nem kell lencse: az első benyomást mérjük.
    const lens = !fiveSecond && pair.lens ? byId(lenses, pair.lens, 'lencse') : null;
    const runName = [persona.id, scenario.id, lens && lens.id].filter(Boolean).join('-');
    const runDir = path.join(runsDir, runName);
    const values = {
      'persona.name': persona.name,
      'persona.label': persona.label,
      'persona.summary': persona.summary,
      'persona.goal': persona.goal,
      'persona.arrival.intent': persona.arrival.intent,
      'persona.id': persona.id,
      'device': `${persona.device.type === 'mobile' ? 'telefon' : 'számítógép'} (${persona.device.viewport.join('×')})`,
      'network': `${persona.device.network} hálózat`,
      'lens.effect, ha van': lens ? `Ezen felül: ${lens.effect}.` : '',
      'knowledge.digital': String(persona.knowledge.digital),
      'knowledge.topic': String(persona.knowledge.topic),
      'behaviours': list(persona.behaviours),
      'objections': list(persona.objections),
      'decisionCriteria': list(persona.decisionCriteria),
      'voice': persona.voice,
      'exitWhen': persona.exitWhen,
      'scenario.task': scenario.task,
      'budget.seconds': String(scenario.budget.seconds),
      'budget.actions': String(scenario.budget.actions),
      'runDir': runDir,
      'scenarioRef': `${scenarioBase}#${scenario.id}`,
      '--lens id': lens ? `--lens ${lens.id}` : '',
    };
    let text = template.replace(/\{([^{}]+)\}/g, (whole, key) => (key in values ? values[key] : whole));
    const left = text.match(/\{(persona|scenario|budget|lens|runDir|device|network|behaviours|objections|decisionCriteria|voice|exitWhen|knowledge)[^{}]*\}/g);
    if (left) throw new Error(`${runName}: kitöltetlen helyek maradtak: ${[...new Set(left)].join(', ')}`);
    if (fiveSecond) text += FIVE_SECOND_NOTE;
    fs.writeFileSync(path.join(outDir, `${runName}.md`), text);
    count++;
  }
}
console.log(`${count} utasítás: ${outDir}`);
