#!/usr/bin/env node
// Construeix la presentació autònoma: UN sol fitxer HTML amb tot incrustat (CSS, JS, tipografies, fotos, dades, mapa, QR).
// Font: autonoma/plantilla.html + autonoma/estil.css + autonoma/motor.js + autonoma/img/ + dades/dades.json
//       + media/mapa-valles.js + js/valia-rig.js + referencia/pwa/app.js (generador de QR del prototip).
// Ús (des de presentacio/): node eines/autonoma.mjs [fitxer-sortida]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ARREL = join(dirname(fileURLToPath(import.meta.url)), '..');
const A = join(ARREL, 'autonoma');
const SORTIDA = resolve(process.argv[2] || join(ARREL, 'previsualitzacio', 'index.html'));
const llegeix = p => readFileSync(p, 'utf8');
const b64 = (p, mime) => `data:${mime};base64,${readFileSync(p).toString('base64')}`;

// QR amb el mateix generador del prototip (ISO/IEC 18004, basat en Nayuki, MIT)
const app = llegeix(join(ARREL, '..', 'referencia', 'pwa', 'app.js'));
const i0 = app.indexOf('const QR = (function'), i1 = app.indexOf('/* ---- mascot.js ---- */');
if (i0 < 0 || i1 < 0) throw new Error('No trobo el generador de QR a app.js');
const QR = new Function(app.slice(i0, i1) + '\nreturn QR;')();
const URL_APP = 'https://ufachord94.github.io/VALIA/';
const qr = QR.svg(URL_APP, { size: 300 }).replace('<svg ', `<svg role="img" aria-label="Codi QR cap a ${URL_APP}" `);

const dades = JSON.parse(llegeix(join(ARREL, 'dades', 'dades.json')));
const segur = s => s.replace(/<\/(script)/gi, '<\\/$1');
const css = llegeix(join(A, 'estil.css'))
  .replace('{{FONT_FRAUNCES}}', () => b64(join(ARREL, 'fonts', 'fraunces-latin-full-normal.woff2'), 'font/woff2'))
  .replace('{{FONT_INTER}}', () => b64(join(ARREL, 'fonts', 'inter-latin-wght-normal.woff2'), 'font/woff2'));

let html = llegeix(join(A, 'plantilla.html'))
  .replace('{{CSS}}', () => css)
  .replace('{{DADES}}', () => segur(JSON.stringify(dades)))
  .replace('{{MAPA}}', () => segur(llegeix(join(ARREL, 'media', 'mapa-valles.js'))))
  .replace('{{RIG}}', () => segur(llegeix(join(ARREL, 'js', 'valia-rig.js'))))
  .replace('{{MOTOR}}', () => segur(llegeix(join(A, 'motor.js'))))
  .replaceAll('{{QR}}', () => qr);

const usades = new Set();
html = html.replace(/src="img:([\w-]+)"/g, (m, nom) => {
  const f = join(A, 'img', nom + '.jpg'); if (!existsSync(f)) throw new Error('Falta la imatge ' + f);
  usades.add(nom); return `src="${b64(f, 'image/jpeg')}"`;
});
const restes = html.match(/\{\{[A-Z_]+\}\}/g);
if (restes) throw new Error('Marcadors sense substituir: ' + restes.join(', '));
const externs = html.match(/(?:src|href)="https?:[^"]+"|url\(\s*['"]?https?:/g);
if (externs) throw new Error('Recursos externs: ' + externs.join(', '));

mkdirSync(dirname(SORTIDA), { recursive: true });
writeFileSync(SORTIDA, html);
console.log(`Escrit ${SORTIDA} · ${(html.length / 1048576).toFixed(2)} MB · imatges: ${[...usades].join(', ')}`);
