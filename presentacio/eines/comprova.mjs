#!/usr/bin/env node
// Comprova la coherència entre GUIO.md i dades/dades.json i actualitza la taula de temps del guió.
// Ús: node eines/comprova.mjs            (des de la carpeta presentacio/)
//     node eines/comprova.mjs --nomes-llegir   (no reescriu GUIO.md)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ARREL = join(dirname(fileURLToPath(import.meta.url)), '..');
const fitxerGuio = join(ARREL, 'GUIO.md');
const fitxerDades = join(ARREL, 'dades', 'dades.json');
const nomesLlegir = process.argv.includes('--nomes-llegir');

const dades = JSON.parse(readFileSync(fitxerDades, 'utf8'));
let guio = readFileSync(fitxerGuio, 'utf8');
const PPM = dades.temps.paraules_per_minut;
const errors = [];
const avisos = [];

// ---------- 1. Estructura de dades.json ----------
const CAMPS = ['valor', 'unitat', 'any', 'font', 'url', 'estat'];
const pendents = [];
let nDades = 0;
function recorre(node, cami) {
  if (Array.isArray(node)) return node.forEach((x, i) => recorre(x, `${cami}[${i}]`));
  if (!node || typeof node !== 'object') return;
  const esDada = 'estat' in node && ('valor' in node || 'font' in node);
  if (esDada) {
    nDades++;
    if (!['verificat', 'PENDENT'].includes(node.estat)) errors.push(`${cami}: estat «${node.estat}» no vàlid`);
    if ('valor' in node) for (const c of CAMPS) if (!(c in node)) errors.push(`${cami}: falta el camp «${c}»`);
    if (node.estat === 'verificat' && 'valor' in node && node.valor === null) errors.push(`${cami}: «verificat» amb valor buit`);
    if (node.estat === 'PENDENT' || node.estat_resultat === 'PENDENT') pendents.push(cami);
    if ('valor' in node) return; // les fulles amb «valor» no es recorren per dins
  }
  for (const [k, v] of Object.entries(node)) if (k !== '_meta') recorre(v, cami ? `${cami}.${k}` : k);
}
recorre(dades, '');

// ---------- 2. Diapositives del guió ----------
const blocs = guio.split(/^## (?=D\d+ · )/m).slice(1).map(b => b.split(/^## (?!D\d+ · )/m)[0]);
const mmss = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const compta = t => (t.match(/[\p{L}\p{N}][\p{L}\p{N}'’·-]*/gu) || []).length;

function existeix(cami) {
  let nodes = [dades];
  for (const tros of cami.split('.')) {
    const clau = tros.replace(/\[\]$/, '');
    nodes = nodes.flatMap(n => (n && typeof n === 'object' && clau in n ? [n[clau]] : []));
    if (tros.endsWith('[]')) nodes = nodes.flatMap(n => (Array.isArray(n) ? n : []));
    if (!nodes.length) return false;
  }
  return true;
}

const files = [];
for (const b of blocs) {
  const n = Number(b.match(/^D(\d+)/)[1]);
  const titol = b.match(/^D\d+ · (.+)$/m)[1].trim();
  const qui = (b.match(/\*\*Qui parla:\*\* ([^·\n]+)/) || [, '?'])[1].trim();
  const t = b.match(/\*\*Temps:\*\* (\d+):(\d\d)/);
  const franja = t ? Number(t[1]) * 60 + Number(t[2]) : null;
  const estat = (b.match(/\*\*Estat:\*\* (\S+)/) || [, '?'])[1];
  const titular = (b.match(/\*\*Titular:\*\* (.+)$/m) || [, ''])[1];

  const cites = etiqueta => {
    const m = b.match(new RegExp(`\\*\\*${etiqueta}\\*\\*\\n((?:>.*\\n?)+)`));
    return m ? m[1].replace(/^> ?/gm, '') : '';
  };
  const parlat = `${cites('Guió')}\n${cites('Transició')}`;
  const tePendent = /\[PENDENT/.test(parlat);
  const net = parlat.replace(/\[PENDENT[^\]]*\]/g, ' ').replace(/\([^)]*\)/g, ' ');
  const paraules = compta(net);
  const estimat = (paraules / PPM) * 60;

  // comprovacions
  const esperat = dades.temps.diapositives.find(d => d.n === n);
  if (!esperat) errors.push(`D${n}: no és a dades.temps.diapositives`);
  else if (esperat.s !== franja) errors.push(`D${n}: el guió diu ${franja} s i dades.json en diu ${esperat.s}`);
  if (n > 0 && !tePendent && estimat > franja) errors.push(`D${n}: el guió (${mmss(estimat)}) no cap a la franja (${mmss(franja)})`);
  const paraulesTitular = compta(titular.replace(/\[PENDENT\]/g, ''));
  if (n > 0 && paraulesTitular > 20) avisos.push(`D${n}: titular de ${paraulesTitular} paraules (màxim orientatiu: 20)`);
  const linDades = (b.match(/\*\*Dades:\*\* (.+)$/m) || [, ''])[1];
  for (const m of linDades.matchAll(/`([^`]+)`/g)) {
    const c = m[1].replace(/^\./, '');
    if (m[1].startsWith('.')) continue; // camí relatiu a l'anterior (p. ex. `.resultat`)
    if (!existeix(c)) errors.push(`D${n}: la clau «${c}» no existeix a dades.json`);
  }
  files.push({ n, titol, qui, franja, estat, paraules, estimat, tePendent });
}

// ---------- 3. Taula de temps ----------
const total = files.reduce((s, f) => s + f.franja, 0);
const perQui = { A1: 0, A2: 0 };
for (const f of files) {
  if (f.qui === 'A1') perQui.A1 += f.franja;
  else if (f.qui === 'A2') perQui.A2 += f.franja;
  else if (/A1 \+ A2/.test(f.qui)) { perQui.A1 += f.franja / 2; perQui.A2 += f.franja / 2; }
}
const complets = files.filter(f => f.n > 0 && !f.tePendent);
const incomplets = files.filter(f => f.tePendent);

const linies = [
  '| # | Diapositiva | Qui | Franja | Paraules del guió | Temps estimat | Estat |',
  '|---|---|---|---|---|---|---|',
  ...files.map(f => {
    let est = f.n === 0 ? '—' : mmss(f.estimat);
    let nota = f.estat;
    if (f.tePendent) { est = `${mmss(f.estimat)} + [PENDENT]`; }
    else if (f.n > 0 && f.estimat > f.franja) nota += ' **SE’N VA**';
    return `| ${f.n} | ${f.titol} | ${f.qui.replace(/ningú.*/, '—')} | ${mmss(f.franja)} | ${f.n === 0 ? '—' : f.paraules} | ${est} | ${nota} |`;
  }),
  `| | **Total** | | **${mmss(total)}** | | | |`,
  '',
  `- **Temps total previst: ${mmss(total)}** (objectiu ${mmss(dades.temps.objectiu_s)} ± 0:30; màxim ${mmss(dades.temps.maxim_s)}).`,
  `- **Repartiment:** A1 ${mmss(perQui.A1)} (${Math.round((perQui.A1 / total) * 100)} %) · A2 ${mmss(perQui.A2)} (${Math.round((perQui.A2 / total) * 100)} %).`,
  `- **Diapositives amb el guió complet (${complets.length}):** ${complets.map(f => `D${f.n}`).join(', ')}. Sumen ${mmss(complets.reduce((s, f) => s + f.estimat, 0))} de guió en ${mmss(complets.reduce((s, f) => s + f.franja, 0))} de franja.`,
  `- **Diapositives amb [PENDENT] al guió (${incomplets.length}):** ${incomplets.map(f => `D${f.n}`).join(', ')}. Tenen reservats ${mmss(incomplets.reduce((s, f) => s + f.franja, 0))}; el temps real no es pot calcular fins que hi hagi contingut.`,
  `- El temps estimat és el del text escrit a ${PPM} paraules per minut. A la D8 cal sumar-hi el temps de tocar la pantalla durant la demostració.`,
];
const taula = linies.join('\n');
const nou = guio.replace(/<!-- TEMPS:INICI -->[\s\S]*<!-- TEMPS:FI -->/, `<!-- TEMPS:INICI -->\n${taula}\n<!-- TEMPS:FI -->`);
if (!nomesLlegir && nou !== guio) writeFileSync(fitxerGuio, nou);

// ---------- 4. Xifres escrites a mà a l'HTML i fitxers generats desactualitzats ----------
const fitxerHtml = join(ARREL, 'index.html');
if (existsSync(fitxerHtml)) {
  const text = readFileSync(fitxerHtml, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
  const amb = text.split(/\s{2,}/).map(s => s.trim()).filter(s => /\d/.test(s));
  if (amb.length) errors.push(`index.html té xifres escrites a mà (han de sortir de dades.json): ${amb.map(s => `«${s.slice(0, 50)}»`).join(', ')}`);
  const djs = join(ARREL, 'dades', 'dades.js');
  if (!existsSync(djs) || !readFileSync(djs, 'utf8').includes(JSON.stringify(dades))) errors.push('dades/dades.js no coincideix amb dades.json: executeu «node eines/construeix.mjs»');
  const htmlNet = readFileSync(fitxerHtml, 'utf8').replace(/<!--[\s\S]*?-->/g, ' ');
  for (const m of htmlNet.matchAll(/data-(?:d|compta)="([^"]+)"/g)) {
    if (!existeix(m[1])) errors.push(`index.html fa servir la clau «${m[1]}», que no existeix a dades.json`);
  }
  for (const m of htmlNet.matchAll(/data-peu="([^"]+)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c && !existeix(c)) errors.push(`index.html cita al peu la clau «${c}», que no existeix a dades.json`);
  }
}

// ---------- 5. Informe ----------
console.log(taula.replace(/\*\*/g, ''));
console.log(`\ndades.json: ${nDades} dades, ${pendents.length} amb algun PENDENT.`);
if (avisos.length) console.log('\nAVISOS\n' + avisos.map(a => '  - ' + a).join('\n'));
if (total > dades.temps.objectiu_s + 30) errors.push(`El total (${mmss(total)}) passa de l'objectiu + 0:30`);
if (errors.length) { console.log('\nERRORS\n' + errors.map(e => '  - ' + e).join('\n')); process.exit(1); }
console.log('\nCap error.');
