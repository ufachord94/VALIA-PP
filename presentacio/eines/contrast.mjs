#!/usr/bin/env node
// Comprova el contrast WCAG dels colors de css/valia.css, en mode clar i fosc.
// Text: ≥ 4,5:1. Marques gràfiques que porten informació: ≥ 3:1.
// Ús (des de presentacio/): node eines/contrast.mjs
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'css', 'valia.css'), 'utf8');
const bloc = sel => { const i = css.indexOf(sel + ' {'); const j = css.indexOf('}', i); return css.slice(i, j); };
const tokens = txt => Object.fromEntries([...txt.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map(m => [m[1], m[2]]));
const clar = tokens(bloc(':root')), fosc = { ...clar, ...tokens(bloc(':root[data-tema="fosc"]')) };

const lum = hex => { const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const PARELLES = [
  // [primer pla, fons, mínim, ús]
  ['tinta', 'paper', 4.5, 'text principal'], ['tinta', 'terra', 4.5, 'text sobre el mapa'],
  ['tinta-2', 'paper', 4.5, 'text secundari i peus'], ['tinta-2', 'terra', 4.5, 'etiquetes sobre el mapa'],
  ['senya', 'paper', 4.5, 'text verd i xifres'], ['pendent-text', 'pendent-fons', 4.5, 'marca PENDENT'],
  ['sobre-maragda', 'maragda', 4.5, 'text sobre el verd maragda'],
  ['senya', 'paper', 3, 'figura activa, punts del mapa, sender'], ['apagat', 'paper', 3, 'figures inactives'],
  ['apagat', 'terra', 3, 'municipis sobre el mapa'], ['fil-mapa', 'paper', 3, 'contorn de la comarca'],
];
let errors = 0;
for (const [nom, t] of [['clar', clar], ['fosc', fosc]]) {
  console.log(`\nMode ${nom}`);
  for (const [a, b, min, us] of PARELLES) {
    if (!t[a] || !t[b]) { console.log(`  ?    ${a} / ${b}: falta el color`); continue; }
    const r = ratio(t[a], t[b]), ok = r >= min; if (!ok) errors++;
    console.log(`  ${ok ? 'OK  ' : 'FALLA'} ${r.toFixed(2).padStart(5)}:1 (mín. ${min}) ${a} ${t[a]} sobre ${b} ${t[b]} · ${us}`);
  }
}
console.log(errors ? `\n${errors} parella(es) per sota del mínim.` : '\nTots els contrastos compleixen.');
process.exit(errors ? 1 : 0);
