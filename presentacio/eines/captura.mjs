#!/usr/bin/env node
// Control de qualitat amb Playwright: obre index.html com amb doble clic (file://), sense animacions,
// i fa una captura de cada estat de cada diapositiva. Registra les peticions externes i els errors.
// Ús (des de presentacio/): node eines/captura.mjs [carpeta-sortida] [--video]
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ARREL = join(dirname(fileURLToPath(import.meta.url)), '..');
const SORTIDA = resolve(process.argv.find((a, i) => i > 1 && !a.startsWith('--')) || join(ARREL, 'qa'));
const URL_INDEX = pathToFileURL(join(ARREL, 'index.html')).href;
const MIDES = [[1920, 1080], [1366, 768], [1024, 768]];
mkdirSync(SORTIDA, { recursive: true });

const externes = new Set(), errors = [];
const vigila = page => {
  page.on('request', r => { const u = r.url(); if (!/^(file|data|blob|about):/.test(u)) externes.add(u); });
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`); });
  page.on('pageerror', e => errors.push('[pageerror] ' + e.message));
  page.on('requestfailed', r => errors.push('[requestfailed] ' + r.url()));
};

const browser = await chromium.launch();
const estats = [];
const PASSADES = MIDES.map(([w, h]) => ({ w, h, fosc: false }));
if (process.argv.includes('--fosc')) PASSADES.push({ w: 1920, h: 1080, fosc: true });
for (const { w, h, fosc } of PASSADES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage(); vigila(page);
  await page.goto(URL_INDEX, { waitUntil: 'load' });
  await page.waitForFunction(() => window.Reveal && Reveal.isReady && Reveal.isReady());
  if (fosc) await page.evaluate(() => { document.documentElement.dataset.tema = 'fosc'; });
  await page.waitForTimeout(300);
  const diapos = await page.evaluate(() => Reveal.getSlides().map((s, i) => ({ i, diapo: s.dataset.diapo, frags: s.querySelectorAll('.fragment').length })));
  for (const d of diapos) {
    const passos = w === 1920 && !fosc ? [...Array(d.frags + 1).keys()].map(k => k - 1) : [d.frags - 1];
    for (const f of passos) {
      await page.evaluate(([i, f]) => Reveal.slide(i, 0, f), [d.i, f]);
      await page.waitForTimeout(250);
      const nom = `D${String(d.diapo).padStart(2, '0')}-pas${f + 1}-${w}x${h}${fosc ? '-fosc' : ''}.png`;
      await page.screenshot({ path: join(SORTIDA, nom) });
      // Comprovació de desbordaments: elements de text que surten del llenç de 1920×1080
      const fora = await page.evaluate(() => {
        const s = Reveal.getCurrentSlide(), r0 = s.getBoundingClientRect(), k = r0.width / 1920, out = [];
        s.querySelectorAll('h1,h2,p,.xifra,.etiqueta,.lloc,.lectura').forEach(el => {
          const st = getComputedStyle(el); if (st.visibility === 'hidden' || +st.opacity === 0 || el.closest('[style*="visibility: hidden"]')) return;
          const r = el.getBoundingClientRect(); if (!r.width) return;
          if (r.left < r0.left - 1 || r.right > r0.right + 1 || r.top < r0.top - 1 || r.bottom > r0.bottom + 1) out.push(`${el.className || el.tagName}: ${Math.round((r.right - r0.left) / k)}×${Math.round((r.bottom - r0.top) / k)}`);
        });
        return out;
      });
      estats.push({ nom, fora });
    }
  }
  await ctx.close();
}

// Vídeo opcional amb animacions (per revisar el moviment)
if (process.argv.includes('--video')) {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, recordVideo: { dir: SORTIDA, size: { width: 1280, height: 720 } } });
  const page = await ctx.newPage(); vigila(page);
  await page.goto(URL_INDEX, { waitUntil: 'load' });
  await page.waitForFunction(() => window.Reveal && Reveal.isReady && Reveal.isReady());
  const espera = ms => page.waitForTimeout(ms);
  await espera(6500);                                     // portada: logotip, mapa i pas de la mascota
  const pasos = [1800, 2600, 3200, 1500, 1500, 1500, 1500, 2000];
  for (const ms of pasos) { await page.keyboard.press('ArrowRight'); await espera(ms); }
  await page.keyboard.press('ArrowLeft'); await espera(1200); // tornar enrere: la mascota camina cap a l'esquerra
  await page.keyboard.press('Home'); await espera(1800);
  await ctx.close();
  console.log('Vídeo desat a', SORTIDA);
}
await browser.close();

console.log(`Captures: ${estats.length} a ${SORTIDA}`);
const ambFora = estats.filter(e => e.fora.length);
console.log(ambFora.length ? 'DESBORDAMENTS:\n' + ambFora.map(e => `  ${e.nom}: ${e.fora.join('; ')}`).join('\n') : 'Cap text fora del llenç.');
console.log(externes.size ? 'PETICIONS EXTERNES:\n  ' + [...externes].join('\n  ') : 'Peticions externes: 0');
console.log(errors.length ? 'ERRORS I AVISOS:\n  ' + [...new Set(errors)].join('\n  ') : 'Errors de consola: 0');
process.exit(externes.size || errors.some(e => /error/.test(e)) ? 1 : 0);
