// Egyetlen, önálló HTML-t épít a dist/ mappába (ezt lehet publikálni / továbbküldeni).
// Futtatás: npm run build
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = p => readFileSync(join(root, p), "utf8");
const MIME = { ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };
const dataUri = p => `data:${MIME[extname(p)]};base64,${readFileSync(join(root, p)).toString("base64")}`;

let html = read("index.html");
html = html.replace(/<link rel="stylesheet" href="((?!https?:)[^"]+)">/g, (_, p) => `<style>\n${read(p)}</style>`);
html = html.replace(/<script src="((?!https?:)[^"]+)"><\/script>/g, (_, p) => `<script>\n${read(p)}</script>`);
// A DS-ből (../../) hivatkozott figurák: a HTML-ben és a figures.js-ben is beágyazzuk őket.
html = html.replace(/"(\.\.\/\.\.\/[^"]+\.(?:webp|png|svg|jpe?g))"/g, (_, p) => `"${dataUri(p)}"`);
html = html.replace(/src="(assets\/[^"]+)"/g, (_, p) => `src="${dataUri(p)}"`);

// Ami nem ágyazódott be (pl. aposztrófos útvonal, CSS url()), az az önálló HTML-ben eltörne – inkább álljunk meg.
const left = html.match(/\.\.\/\.\.\/[^"'\s)]+/);
if (left) throw new Error(`Nem beágyazott hivatkozás maradt a kimenetben: ${left[0]}`);

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist/beeco-infografika.html"), html);
console.log(`dist/beeco-infografika.html kész (${(html.length / 1024).toFixed(0)} kB)`);
