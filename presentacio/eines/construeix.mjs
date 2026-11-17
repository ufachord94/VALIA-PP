#!/usr/bin/env node
// Construeix els fitxers que la presentació llegeix amb <script> (així funciona amb doble clic, sense servidor):
//   dades/dades.js      ← dades/dades.json            (font única de dades)
//   dades/notes.js      ← GUIO.md                     (notes de l'orador)
//   media/mapa-valles.js← referencia/pwa/valia-map/data (contorn i municipis, projectats a SVG)
//   js/valia-rig.js     ← referencia/pwa/app.js       (mascota articulada del prototip)
//   js/vendor/, fonts/  ← node_modules                (llibreries i tipografies en local)
// Ús (des de presentacio/): node eines/construeix.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ARREL = join(dirname(fileURLToPath(import.meta.url)), '..');
const REF = join(ARREL, '..', 'referencia');
const NM = join(ARREL, 'node_modules');
const llegeix = p => readFileSync(p, 'utf8');
const escriu = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s); console.log('  escrit', p.replace(ARREL + '/', '')); };
const capcalera = font => `/* Fitxer generat per eines/construeix.mjs a partir de ${font}. No l'editeu a mà. */\n`;

// ---------- 1. Dades ----------
const dades = JSON.parse(llegeix(join(ARREL, 'dades', 'dades.json')));
escriu(join(ARREL, 'dades', 'dades.js'), capcalera('dades/dades.json') + 'window.VALIA_DADES = ' + JSON.stringify(dades) + ';\n');

// ---------- 2. Notes de l'orador (de GUIO.md) ----------
const guio = llegeix(join(ARREL, 'GUIO.md'));
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[PENDENT([^\]]*)\]/g, '<mark>[PENDENT$1]</mark>');
const rols = dades.projecte.rols.valor;
const nom = q => q.replace(/A1/g, `${rols.A1.split(' ')[0]} (A1)`).replace(/A2/g, `${rols.A2.split(' ')[0]} (A2)`);
const notes = {};
for (const bloc of guio.split(/^## (?=D\d+ · )/m).slice(1)) {
  const b = bloc.split(/^## (?!D\d+ · )/m)[0];
  const n = Number(b.match(/^D(\d+)/)[1]);
  const titol = b.match(/^D\d+ · (.+)$/m)[1].trim();
  const qui = (b.match(/\*\*Qui parla:\*\* ([^·\n]+)/) || [, ''])[1].trim();
  const temps = (b.match(/\*\*Temps:\*\* ([\d:]+)/) || [, ''])[1];
  const cita = et => { const m = b.match(new RegExp(`\\*\\*${et}\\*\\*\\n((?:>.*\\n?)+)`)); return m ? m[1].split('\n').map(l => l.replace(/^> ?/, '').trim()).filter(Boolean) : []; };
  const preg = (b.match(/\*\*Pregunta possible del tribunal:\*\* (.+)$/m) || [, ''])[1];
  notes[n] = `<p class="n-cap"><b>${esc(nom(qui))}</b> · ${esc(temps)} · ${esc(titol)}</p>` +
    `<ul>${cita('Guió').map(l => `<li>${md(nom(l))}</li>`).join('')}</ul>` +
    (cita('Transició').length ? `<p><i>Transició:</i> ${md(cita('Transició').join(' '))}</p>` : '') +
    (preg ? `<p><i>Pregunta possible:</i> ${md(preg)}</p>` : '');
}
escriu(join(ARREL, 'dades', 'notes.js'), capcalera('GUIO.md') + 'window.VALIA_NOTES = ' + JSON.stringify(notes) + ';\n');

// ---------- 3. Mapa (provisional: OpenStreetMap del prototip; s'ha de canviar per l'ICGC) ----------
const MD = join(REF, 'pwa', 'valia-map', 'data');
const limit = JSON.parse(llegeix(join(MD, 'limit.geojson')));
const municipis = JSON.parse(llegeix(join(MD, 'municipis.json')));
const geoms = (limit.features || [limit]).map(f => f.geometry || f);
const anells = [];
for (const g of geoms) {
  if (g.type === 'Polygon') anells.push(...g.coordinates);
  else if (g.type === 'MultiPolygon') g.coordinates.forEach(p => anells.push(...p));
}
let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
for (const a of anells) for (const [lo, la] of a) { x0 = Math.min(x0, lo); x1 = Math.max(x1, lo); y0 = Math.min(y0, la); y1 = Math.max(y1, la); }
const kx = Math.cos(((y0 + y1) / 2) * Math.PI / 180);
const AMPLE = 1000, MARGE = 6;
const s = (AMPLE - 2 * MARGE) / ((x1 - x0) * kx);
const ALT = Math.round((y1 - y0) * s + 2 * MARGE);
const proj = ([lo, la]) => [MARGE + (lo - x0) * kx * s, MARGE + (y1 - la) * s];
function dp(pts, tol) { // Douglas-Peucker
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let iMax = 0, dMax = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const d = Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / L;
    if (d > dMax) { dMax = d; iMax = i; }
  }
  if (dMax <= tol) return [a, b];
  return dp(pts.slice(0, iMax + 1), tol).slice(0, -1).concat(dp(pts.slice(iMax), tol));
}
function dpAnell(pts, tol) { // anell tancat: es parteix pel punt més llunyà del primer i se simplifiquen les dues meitats
  const q = pts.slice(); const [a0, an] = [q[0], q[q.length - 1]];
  if (a0[0] === an[0] && a0[1] === an[1]) q.pop();
  let k = 0, dM = 0; q.forEach((p, i) => { const d = Math.hypot(p[0] - q[0][0], p[1] - q[0][1]); if (d > dM) { dM = d; k = i; } });
  return dp(q.slice(0, k + 1), tol).slice(0, -1).concat(dp(q.slice(k).concat([q[0]]), tol).slice(0, -1));
}
const f1 = n => (Math.round(n * 10) / 10).toString();
let nPunts = 0;
const comarca = anells.map(a => {
  const p = dpAnell(a.map(proj), 0.6); nPunts += p.length;
  return 'M' + p.map(q => f1(q[0]) + ' ' + f1(q[1])).join('L') + 'Z';
}).join('');
const pt = ll => { const [x, y] = proj(ll); return { x: +f1(x), y: +f1(y) }; };
const mapa = {
  viewBox: [0, 0, AMPLE, ALT],
  comarca,
  municipis: municipis.map(m => ({ nom: m.name, ine: m.ine, ...pt(m.center) })),
  punts: Object.fromEntries(dades.mapa.punts.valor.map(p => [p.id, { etiqueta: p.etiqueta, ...pt(p.lonlat) }])),
  origen: 'OpenStreetMap (ODbL), via referencia/pwa/valia-map/data (9-11-2026)'
};
escriu(join(ARREL, 'media', 'mapa-valles.js'), capcalera('referencia/pwa/valia-map/data (OpenStreetMap, ODbL)') + 'window.VALIA_MAPA = ' + JSON.stringify(mapa) + ';\n');
console.log(`  mapa: ${anells.length} anell(s), ${nPunts} punts després de simplificar, ${mapa.municipis.length} municipis, ${AMPLE}×${ALT}`);

// ---------- 4. Mascota (rig del prototip) ----------
const app = llegeix(join(REF, 'pwa', 'app.js'));
const tros = (de, fins) => { const i = app.indexOf(de), j = app.indexOf(fins, i + 1); if (i < 0 || j < 0) throw new Error('No trobo ' + de); return app.slice(i, j); };
const rig = tros('/* ---- rig.js ---- */', '/* ---- qr.js ---- */') + tros('/* ---- mascot.js ---- */', '/* ---- app.js ---- */');
escriu(join(ARREL, 'js', 'valia-rig.js'), capcalera('referencia/pwa/app.js (prototip Valia, seccions rig.js, anim.js i mascot.js)') + rig);

// ---------- 5. Llibreries i tipografies en local ----------
if (!existsSync(NM)) { console.log('  (sense node_modules: no copio llibreries; feu «npm install» si cal actualitzar-les)'); process.exit(0); }
const copia = (de, a) => { mkdirSync(dirname(a), { recursive: true }); copyFileSync(de, a); };
const VEN = join(ARREL, 'js', 'vendor');
for (const f of ['reset.css', 'reveal.css', 'reveal.js']) copia(join(NM, 'reveal.js', 'dist', f), join(VEN, f));
copia(join(NM, 'reveal.js', 'plugin', 'notes', 'notes.js'), join(VEN, 'notes.js'));
copia(join(NM, 'reveal.js', 'LICENSE'), join(VEN, 'LICENSE-reveal.js.txt'));
for (const f of ['gsap.min.js', 'DrawSVGPlugin.min.js', 'SplitText.min.js', 'MotionPathPlugin.min.js', 'Flip.min.js']) copia(join(NM, 'gsap', 'dist', f), join(VEN, f));
for (const f of ['LICENSE', 'LICENSE.md', 'README.md']) if (existsSync(join(NM, 'gsap', f))) { copia(join(NM, 'gsap', f), join(VEN, 'LICENSE-gsap.txt')); break; }
const FO = join(ARREL, 'fonts');
for (const f of ['fraunces-latin-full-normal.woff2', 'fraunces-latin-ext-full-normal.woff2']) copia(join(NM, '@fontsource-variable', 'fraunces', 'files', f), join(FO, f));
for (const f of ['inter-latin-wght-normal.woff2', 'inter-latin-ext-wght-normal.woff2']) copia(join(NM, '@fontsource-variable', 'inter', 'files', f), join(FO, f));
copia(join(NM, '@fontsource-variable', 'fraunces', 'LICENSE'), join(FO, 'LICENSE-Fraunces-OFL.txt'));
copia(join(NM, '@fontsource-variable', 'inter', 'LICENSE'), join(FO, 'LICENSE-Inter-OFL.txt'));
console.log('  llibreries i tipografies copiades');
