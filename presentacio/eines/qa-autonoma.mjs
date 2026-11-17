#!/usr/bin/env node
// Control de qualitat de la presentació autònoma i exportació a PDF (una pàgina 16:9 per diapositiva).
// Ús (des de presentacio/): node eines/qa-autonoma.mjs <index.html> <carpeta-captures> [<sortida.pdf>]
import { mkdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const [HTML, CAP, PDF] = process.argv.slice(2).map(p => p && resolve(p));
const URL0 = pathToFileURL(HTML).href;
mkdirSync(CAP, { recursive: true });
const problemes = [], externes = new Set(), errors = [];
const vigila = p => {
  p.on('request', r => { if (!/^(file|data|blob|about):/.test(r.url())) externes.add(r.url()); });
  p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('pageerror', e => errors.push('pageerror: ' + e.message));
};
const browser = await chromium.launch();

// 1. Escenari a tres mides, cada diapositiva en l'estat final
for (const [w, h] of [[1920, 1080], [1366, 768], [1024, 768]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); vigila(p);
  await p.goto(URL0 + '#1', { waitUntil: 'load' }); await p.waitForTimeout(500);
  const n = await p.evaluate(() => document.querySelectorAll('.d').length);
  for (let i = 1; i <= n; i++) {
    await p.evaluate(k => { location.hash = '#' + k; dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' })); for (let j = 1; j < k; j++) dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })); }, i);
    await p.waitForTimeout(650);
    await p.screenshot({ path: join(CAP, `d${String(i).padStart(2, '0')}-${w}x${h}.png`) });
    if (w !== 1920) continue;
    const r = await p.evaluate(() => {
      const s = document.querySelector('.d.actiu'), R = s.getBoundingClientRect(), k = R.width / 1920, out = { fora: [], solapats: [], buida: false, imatges: [], pendents: [] };
      const vis = el => { const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0; };
      const blocs = [...s.querySelectorAll('h1,h2,h3,p,li,.xifra,.lloc,.tile,.targeta,.mobil,.cel,.matriu > div,text')].filter(vis);
      for (const el of blocs) { const r = el.getBoundingClientRect(); if (!r.width) continue; if (r.left < R.left - 1 || r.right > R.right + 1 || r.top < R.top - 1 || r.bottom > R.bottom + 1) out.fora.push((el.className.baseVal ?? el.className) + ' «' + (el.textContent || '').trim().slice(0, 40) + '»'); }
      // text que desborda la seva caixa (tallat)
      for (const el of s.querySelectorAll('h1,h2,h3,p,li,b,span')) { if (!vis(el)) continue; if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible') out.fora.push('tallat: «' + el.textContent.trim().slice(0, 40) + '»'); }
      // solapaments entre blocs de text germans de primer nivell
      const caixes = [...s.querySelectorAll(':scope > .titular, :scope > .avant, :scope > .peu, :scope > .peu-foto, :scope > .text, :scope > .foto, :scope > .mapa, :scope > .cos2, :scope > .matriu, :scope > .llegenda, :scope > .esquema, :scope > .ruta-svg, :scope > .mobils, :scope > .qr, :scope > .flux, :scope > .nivells, :scope > .dims, :scope > .formula, :scope > .compromis, :scope > .tiles, :scope > .columnes')].map(e => [e.className.baseVal ?? e.className, e.getBoundingClientRect()]);
      for (let a = 0; a < caixes.length; a++) for (let b = a + 1; b < caixes.length; b++) { const [na, x] = caixes[a], [nb, y] = caixes[b]; const ox = Math.min(x.right, y.right) - Math.max(x.left, y.left), oy = Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top); if (ox > 4 && oy > 4) out.solapats.push(`${na} × ${nb} (${Math.round(ox / k)}×${Math.round(oy / k)} px)`); }
      out.buida = (s.innerText || '').trim().length < 20;
      for (const im of s.querySelectorAll('img')) if (!im.complete || !im.naturalWidth) out.imatges.push(im.alt);
      out.pendents = [...s.querySelectorAll('.pendent')].map(e => (e.closest('.tile,li,p')?.textContent || '').replace(/\s+/g, ' ').trim());
      out.titol = (s.querySelector('h1,h2,.crida')?.textContent || '').replace(/\s+/g, ' ').trim();
      return out;
    });
    problemes.push({ i, ...r });
  }
  await ctx.close();
}

// 2. Mòbil vertical (pàgina sencera)
const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const pm = await ctxM.newPage(); vigila(pm);
await pm.goto(URL0, { waitUntil: 'load' }); await pm.waitForTimeout(800);
const mob = await pm.evaluate(() => ({ ample: document.documentElement.scrollWidth, alt: document.documentElement.scrollHeight, vw: innerWidth }));
await pm.screenshot({ path: join(CAP, 'mobil-pagina-sencera.png'), fullPage: true });
await ctxM.close();

// 3. PDF
let pagines = null;
if (PDF) {
  const ctxP = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const pp = await ctxP.newPage(); vigila(pp);
  await pp.goto(URL0 + '?imprimir', { waitUntil: 'load' }); await pp.evaluate(() => document.fonts.ready); await pp.waitForTimeout(500);
  await pp.pdf({ path: PDF, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
  await ctxP.close();
  pagines = execFileSync('pdfinfo', [PDF]).toString().match(/Pages:\s+(\d+)/)[1];
}
await browser.close();

// Informe
console.log('\nDIAPOSITIVES (1920×1080)');
for (const r of problemes) {
  const avis = [...r.fora.map(f => 'FORA/TALLAT ' + f), ...r.solapats.map(s => 'SOLAPAT ' + s), ...(r.buida ? ['BUIDA'] : []), ...r.imatges.map(i => 'IMATGE TRENCADA ' + i)];
  console.log(`${String(r.i).padStart(2)} · ${r.titol.slice(0, 90)}${avis.length ? '\n     ' + avis.join('\n     ') : ''}`);
}
console.log('\nMÒBIL 390 px:', mob.ample > mob.vw + 1 ? `DESBORDA (${mob.ample} px d'amplada)` : `sense desbordament horitzontal · ${mob.alt} px d'alçada`);
console.log('Peticions externes:', externes.size ? [...externes].join(', ') : 0);
console.log('Errors de consola:', errors.length ? [...new Set(errors)].join(' | ') : 0);
if (PDF) console.log(`PDF: ${pagines} pàgines · ${(statSync(PDF).size / 1048576).toFixed(2)} MB`);
const pend = problemes.flatMap(r => r.pendents.map(t => `D${r.i}: ${t}`));
console.log(`\n[DADA PENDENT] (${pend.length}):\n  ` + pend.join('\n  '));
