// Vizuális regressziós teszt: minden minta minden formátumban.
// Első futás / szándékos változás után: npm run test:update (új alapképek).
import { test, expect } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const PAGE = pathToFileURL(resolve("dist/beeco-infografika.html")).href;
const PRESETS = ["drawdown", "esoerdo", "etrend", "teszta", "tej", "farmer", "pazarlas", "letra"];
const FORMATS = ["f45", "f11", "f916"];

async function show(page, preset, fmt) {
  await page.goto(PAGE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.selectOption("#f-fmt", fmt);
  await page.selectOption("#f-preset", preset);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => { const i = document.getElementById("p-figure"); return i.complete && i.naturalWidth > 0; });
  await page.evaluate(() => { const s = document.getElementById("scaler"); s.style.transform = "none"; s.style.width = "1080px"; s.style.height = "auto"; });
}

for (const preset of PRESETS) for (const fmt of FORMATS) {
  test(`${preset} – ${fmt}`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await show(page, preset, fmt);
    expect(errors, "JavaScript-hiba az oldalon").toEqual([]);
    expect(await page.locator("#errors").innerText(), "adat-figyelmeztetés a mintán").toBe("");
    await expect(page.locator("#poster")).toHaveScreenshot(`${preset}-${fmt}.png`);
  });
}

// Elrendezés-őr (az „Ismert hibák” regressziós tesztje): nincs levágott felirat, és a buborék nem lóg a diagramra.
for (const preset of PRESETS) for (const fmt of FORMATS) {
  test(`elrendezés – ${preset} – ${fmt}`, async ({ page }) => {
    await show(page, preset, fmt);
    const bad = await page.evaluate(() => {
      const out = [], poster = document.getElementById("poster");
      for (const el of poster.querySelectorAll(".lab, .lab b, .dsr .lab, .ccol h3, .pitem b, .tc b, .bs-lab, .iglist span")) {
        if (el.scrollWidth > el.clientWidth + 1) out.push(`levágott felirat: „${el.textContent.trim()}” (${el.scrollWidth} > ${el.clientWidth} px)`);
      }
      // a diagram alja az árnyékréteggel (.sh) együtt
      const chartBottom = Math.max(poster.querySelector(".chart").getBoundingClientRect().bottom, poster.querySelector(".chart > .sh").getBoundingClientRect().bottom);
      for (const [name, el] of [["a buborék", document.getElementById("p-bubblewrap")], ["a figura", document.getElementById("p-figure")]]) {
        const r = el.getBoundingClientRect();
        if (r.height && getComputedStyle(el).visibility !== "hidden" && r.top < chartBottom) out.push(`${name} rálóg a diagramra (${Math.round(chartBottom - r.top)} px)`);
      }
      return out;
    });
    expect(bad).toEqual([]);
  });
}

// Figuraválasztó: a fajta váltása szűri a listát, a kép a DS-ből beágyazva betölt, arányosan ül a dobozban.
// A kis (think), a széles (vörösbegy) és a magas (liba) figura minden formátumban; egyik sem érhet fel a diagramig.
for (const [kind, figure] of [["bee", "bee-think"], ["bird", "bird-robin-sing"], ["bird", "bird-goose"]]) for (const fmt of FORMATS) {
  test(`figura ${figure} – ${fmt}`, async ({ page }) => {
    await show(page, "teszta", fmt);
    await page.selectOption("#f-kind", kind);
    await page.selectOption("#f-figure", figure);
    await page.waitForFunction(() => { const i = document.getElementById("p-figure"); return i.complete && i.naturalWidth > 0; });
    await expect(page.locator("#l-figure")).toHaveText(kind === "bee" ? "Méh hangulata" : "Melyik madár?");
    const gap = await page.evaluate(() => {
      const p = document.getElementById("poster"), chartBottom = Math.max(p.querySelector(".chart").getBoundingClientRect().bottom, p.querySelector(".chart > .sh").getBoundingClientRect().bottom);
      return Math.round(document.getElementById("p-figure").getBoundingClientRect().top - chartBottom);
    });
    expect(gap, "a figura teteje és a diagram alja (árnyékkal) közti hely, px").toBeGreaterThanOrEqual(0);
    await expect(page.locator("#poster")).toHaveScreenshot(`figura-${figure}-${fmt}.png`);
  });
}

test("a fajta váltása az új lista első figuráját adja, és megmarad újratöltés után", async ({ page }) => {
  await show(page, "drawdown", "f45");
  await expect(page.locator("#f-figure")).toHaveValue("bee-super");
  await page.selectOption("#f-kind", "bird");
  await expect(page.locator("#f-figure")).toHaveValue("bird-robin");
  await expect(page.locator("#f-figure option")).toHaveCount(9);
  await page.reload();
  await expect(page.locator("#f-kind")).toHaveValue("bird");
  await expect(page.locator("#f-figure")).toHaveValue("bird-robin");
  await page.selectOption("#f-preset", "tej");
  await expect(page.locator("#f-figure"), "minta betöltése nem dobja el a választott figurát").toHaveValue("bird-robin");
});

test("túl hosszú buborékszövegnél figyelmeztet", async ({ page }) => {
  await show(page, "teszta", "f45");
  await expect(page.locator("#errors")).toHaveText("");
  await page.fill("#f-bubble", "Ez egy nagyon hosszú buborékszöveg, ami négy-öt sorba tördelődik, és ezért felfelé nőve rálógna a diagramra.");
  await expect(page.locator("#errors")).toContainText("rálóg a diagramra");
});

test("export madárral (SVG) – egyezik az alapképpel", async ({ page }) => {
  await show(page, "teszta", "f45");
  await page.selectOption("#f-kind", "bird");
  await page.waitForFunction(() => { const i = document.getElementById("p-figure"); return i.complete && i.naturalWidth > 0; });
  const png = await page.evaluate(async () => {
    const c = await html2canvas(document.getElementById("poster"), { scale: 1, backgroundColor: null });
    return c.toDataURL("image/png");
  });
  const img = Buffer.from(png.split(",")[1], "base64");
  expect(img.length).toBeGreaterThan(50_000);
  expect(img).toMatchSnapshot("export-madar.png", { maxDiffPixelRatio: 0.02 });
});

// Az export (html2canvas) korábban fekete téglalapokat rajzolt az árnyékok helyére.
// Ez a teszt az exportált PNG-t is alapképhez köti: ha az export elromlik, piros lesz.
for (const preset of ["drawdown", "esoerdo", "etrend"]) {
  test(`export egyezik az előnézettel – ${preset}`, async ({ page }) => {
    await show(page, preset, "f45");
    const png = await page.evaluate(async () => {
      const c = await html2canvas(document.getElementById("poster"), { scale: 1, backgroundColor: null });
      return c.toDataURL("image/png");
    });
    const img = Buffer.from(png.split(",")[1], "base64");
    expect(img.length).toBeGreaterThan(50_000);
    expect(img).toMatchSnapshot(`export-${preset}.png`, { maxDiffPixelRatio: 0.02 });
  });
}
