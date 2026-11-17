/* Valia · motor de la presentació autònoma (sense dependències).
   Escenari 1920×1080 escalat a la pantalla · mòbil vertical: diapositives en columna · ?imprimir: totes en l'estat final.
   Tecles: → ← ↑ ↓ · Av Pàg · Re Pàg · espai · Inici · Fi · F (pantalla completa) · A (animacions). */
(function () {
  'use strict';
  const D = JSON.parse(document.getElementById('valia-dades').textContent);
  const MAPA = window.VALIA_MAPA, RIG = window.ValiaRig, FIG = window.ValiaAnim, MASC = window.Mascot;
  if (MASC) MASC.pause(true);
  const html = document.documentElement, NS = 'http://www.w3.org/2000/svg';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const llegeix = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const desa = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sense emmagatzematge */ } };
  const IMPRESSIO = /[?&]imprimir\b/.test(location.search);
  const MOBIL = 'screen and (max-width: 760px), screen and (orientation: portrait) and (max-width: 1100px)';
  const esMobil = () => !IMPRESSIO && matchMedia(MOBIL).matches;
  let quiet = IMPRESSIO || matchMedia('(prefers-reduced-motion: reduce)').matches || llegeix('valia-quiet') === '1';
  html.classList.toggle('quiet', quiet);

  /* ---------- Dades ---------- */
  function dada(cami) { let o = D; for (const t of cami.split('.')) { if (o == null) break; o = o[t]; } if (o == null) console.warn('[dades] falta', cami); return o; }
  function format(v, f) {
    if (Array.isArray(v)) return v.length > 1 ? v.slice(0, -1).join(', ') + ' i ' + v[v.length - 1] : String(v[0]);
    if (typeof v !== 'number' || f === 'any') return String(v);
    const [e, d] = String(Math.abs(v)).split('.'); const g = e.length > 4 ? e.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : e;
    return (v < 0 ? '−' : '') + g + (d ? ',' + d : '');
  }
  const pendent = () => { const s = document.createElement('span'); s.className = 'pendent'; s.textContent = '[DADA PENDENT]'; return s; };
  function omple(el) {
    const d = dada(el.dataset.d), v = d && d[el.dataset.camp || 'valor'];
    if (v == null) { el.replaceChildren(pendent()); return; }
    if (el.dataset.format === 'fraccio') {
      const m = String(v).match(/^(\d+)\s+(de cada)\s+(\d+)$/);
      if (m) { el.innerHTML = `<span class="u">${m[1]}</span> <small>${m[2]}</small> ${m[3]}`; return; }
    }
    el.textContent = format(v, el.dataset.format);
  }
  function peu(el) {
    const grups = new Map(), mapes = [];
    for (const c of (el.dataset.peu || '').split(/\s+/).filter(Boolean)) {
      const d = dada(c); if (!d || !d.peu) continue;
      if (/^Mapa:/.test(d.peu.autor)) { if (!mapes.includes(d.peu.autor)) mapes.push(d.peu.autor); continue; }
      if (!grups.has(d.peu.data)) grups.set(d.peu.data, []);
      const g = grups.get(d.peu.data); if (!g.includes(d.peu.autor)) g.push(d.peu.autor);
    }
    const n = [...grups.values()].reduce((s, a) => s + a.length, 0);
    let t = n ? (n > 1 ? 'Fonts: ' : 'Font: ') + [...grups].map(([data, a]) => `${format(a)} (${data})`).join('; ') + '.' : '';
    mapes.forEach(m => { t += (t ? ' ' : '') + m + '.'; });
    if (el.dataset.peuExtra) t += (t ? ' ' : '') + el.dataset.peuExtra;
    el.textContent = t.trim();
  }

  /* ---------- Figures ---------- */
  const NECK = [1.2, -23.5];
  const parts = g => { const o = {}; $$('[data-p]', g).forEach(p => { o[p.getAttribute('data-p')] = p; }); return o; };
  function postura(pp, p) {
    const tr = FIG.poseTransforms(p); for (const k in tr) if (pp[k]) pp[k].setAttribute('transform', tr[k]);
    if (pp.head) pp.head.setAttribute('transform', `rotate(${(p.head || 0).toFixed(2)} ${NECK[0]} ${NECK[1]})`);
  }
  function figura(pose, cls, roca) {
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '-28 -66 56 70'); s.setAttribute('class', cls); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = (roca ? '<path class="roca" d="M-12 0C-13 -6 -9 -13.2 0 -13.6C9 -14 13 -7 12.4 0Z"/>' : '') + `<g>${FIG.figureMarkup('currentColor')}</g>`;
    postura(parts(s), pose); return s;
  }
  function logoSVG(mida) {
    const L = FIG.LEAF;
    return `<svg viewBox="0 4 120 120" width="${mida}" height="${mida}" role="img" aria-label="Logotip de Valia"><g transform="${L.rot}"><path d="${L.stem}" fill="none" stroke="#00A86B" stroke-width="4.2" stroke-linecap="round"/><path d="${L.blade}" fill="#00A86B"/><path d="${L.rib}" fill="none" stroke="#FFFFFF" stroke-opacity=".32" stroke-width="2" stroke-linecap="round"/></g>${FIG.staticFigure('#FFFFFF')}</svg>`;
  }
  const SIMB = {
    si: '<circle class="si" cx="26" cy="26" r="24"/><path class="si-v" d="M15 27l7 7 15-16"/>',
    parcial: '<circle class="parc-c" cx="26" cy="26" r="21.5"/><path class="parc-f" d="M26 4.5a21.5 21.5 0 0 0 0 43Z"/>',
    no: '<path class="no" d="M15 15l22 22M37 15 15 37"/>', limitada: '<path class="no" d="M12 26h28"/>'
  };
  const NOMSIMB = { si: 'Sí', parcial: 'Parcial', no: 'No', limitada: 'Limitada' };
  const simbol = t => `<svg viewBox="0 0 52 52" class="simb" role="img" aria-label="${NOMSIMB[t]}">${SIMB[t]}</svg>`;
  function mapa(cont, opcions) {
    const [x, y, w, h] = MAPA.viewBox, punts = (opcions && opcions.punts) || [];
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', `${x} ${y} ${w} ${h}`); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = `<path class="comarca" d="${MAPA.comarca}"/>` +
      `<g>${MAPA.municipis.map((m, k) => `<circle class="muni" data-a="creix" style="--d:${(0.5 + (k * 7 % 39) * 0.018).toFixed(2)}s" cx="${m.x}" cy="${m.y}" r="8"/>`).join('')}</g>` +
      punts.map((id, k) => { const p = MAPA.punts[id]; return `<g data-a="creix" style="--d:${(1.3 + k * 0.25).toFixed(2)}s"><circle class="halo" cx="${p.x}" cy="${p.y}" r="52"/><circle class="punt" cx="${p.x}" cy="${p.y}" r="17"/></g>`; }).join('');
    cont.prepend(s);
    $$('.lloc', cont).forEach(l => { const p = MAPA.punts[l.dataset.punt]; l.style.left = `calc(${100 * p.x / w}% + ${l.dataset.dx || 0}px)`; l.style.top = `calc(${100 * p.y / h}% + ${l.dataset.dy || 0}px)`; });
  }

  /* ---------- Tweens mínims (requestAnimationFrame) ---------- */
  const ss = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  const inOut = t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  function tween(dur, update, done, ease) {
    let t0 = null, viu = true;
    const pas = now => { if (!viu) return; if (t0 === null) t0 = now; const u = Math.min(1, (now - t0) / (dur * 1000)); update((ease || inOut)(u), u); if (u < 1) requestAnimationFrame(pas); else if (done) done(); };
    requestAnimationFrame(pas); return { kill() { viu = false; } };
  }

  /* ---------- Marxa de la mascota (rig del prototip) ---------- */
  const RW = RIG.make({ flat: true }), C = RW.C, TE = 4.6, XE = RW.state(TE).X;
  const clona = p => MASC.mix(p, p, 0);
  function desplaça(p, dx) { const o = clona(p); [o.H, o.lF.K, o.lF.P, o.lN.K, o.lN.P, o.SN, o.SF, o.armN.E, o.armN.P, o.armF.E, o.armF.P, o.tip, o.top].forEach(a => { a[0] += dx; }); return o; }
  const camina = fase => desplaça(RW.pose(TE + fase * C.T), -XE);
  const posturaMarxa = (recorregut, k, u) => { let p = camina(recorregut / (C.S * k)); const b = Math.min(1, u / 0.14, (1 - u) / 0.14); return b < 1 ? MASC.mix(MASC.B.logo, p, ss(b)) : p; };

  /* ---------- Sender ---------- */
  const N = $$('.d').length, X0 = 120, X1 = 1800, Y = 1044, K = 1.05;
  const xDe = n => X0 + (X1 - X0) * (N > 1 ? n / (N - 1) : 0);
  const senderSVG = n => `<svg width="1920" height="1080" viewBox="0 0 1920 1080"><line class="camí" x1="${X0}" y1="${Y}" x2="${X1}" y2="${Y}"/><line class="fet" x1="${X0}" y1="${Y}" x2="${xDe(n)}" y2="${Y}"/>` +
    Array.from({ length: N }, (_, i) => `<circle class="fita${xDe(i) <= xDe(n) + 0.5 ? ' passada' : ''}" data-i="${i}" cx="${xDe(i)}" cy="${Y}" r="7"/>`).join('') +
    `<g class="mascota" transform="translate(${xDe(n)} ${Y - 4}) scale(${K})">${FIG.figureMarkup('currentColor')}</g></svg>`;
  const Sender = (() => {
    const el = document.createElement('div'); el.className = 'sender'; el.setAttribute('aria-hidden', 'true'); el.innerHTML = senderSVG(0);
    const fet = $('.fet', el), m = $('.mascota', el), pp = parts(m);
    let x = X0, anim = null;
    function dibuixa(p, xx, mirall) {
      m.setAttribute('transform', `translate(${xx.toFixed(1)} ${Y - 4}) scale(${mirall ? -K : K} ${K})`); postura(pp, p); fet.setAttribute('x2', xx.toFixed(1));
      $$('.fita', el).forEach(f => f.classList.toggle('passada', xDe(+f.dataset.i) <= xx + 0.5));
    }
    function ves(n, animat) {
      const xt = xDe(n), dist = xt - x, d = Math.abs(dist); if (anim) { anim.kill(); anim = null; }
      if (!animat || quiet || d < 1 || d > 3.2 * (X1 - X0) / (N - 1)) { x = xt; dibuixa(MASC.B.logo, x, false); return; }
      const x0 = x;
      anim = tween(Math.min(1.2, Math.max(0.6, 0.4 + d / 280)), (e, u) => { x = x0 + dist * e; dibuixa(posturaMarxa(d * e, K, u), x, dist < 0); }, () => { anim = null; dibuixa(MASC.B.logo, x, false); });
    }
    dibuixa(MASC.B.logo, X0, false);
    return { el, ves };
  })();

  /* ---------- Construcció de les diapositives ---------- */
  function prepara() {
    $$('[data-d]').forEach(omple);
    $$('[data-compta]').forEach(el => { const d = dada(el.dataset.compta); el.textContent = d ? format(d.valor) : '[DADA PENDENT]'; });
    $$('[data-peu], [data-peu-extra]').forEach(peu);
    $$('[data-logo]').forEach(el => { el.innerHTML = logoSVG(+el.dataset.logo || 104); });
    $$('.ruta-svg .mascota').forEach(g => { g.innerHTML = FIG.figureMarkup('currentColor'); });
    // portada: contorn de la comarca sobre la foto
    $$('[data-contorn]').forEach(el => { const [x, y, w, h] = MAPA.viewBox; el.innerHTML = `<svg viewBox="${x} ${y} ${w} ${h}" aria-hidden="true"><path data-a="dibuixa" pathLength="1" style="--d:.3s" d="${MAPA.comarca}"/></svg>`; });
    // joves: un camina, dos estan asseguts
    const fg = $('.joves .figures');
    if (fg) [[MASC.B.logo, 'fig activa', false, 'es mou prou'], [MASC.B.sit, 'fig', true, 'no prou'], [MASC.B.sit, 'fig', true, 'no prou']].forEach(([p, c, r, nom], k) => {
      const w = document.createElement('div'); w.setAttribute('data-a', 'puja'); w.style.setProperty('--d', (0.5 + k * 0.15) + 's');
      w.append(figura(p, c, r)); const n = document.createElement('span'); n.className = 'fig-nom'; n.textContent = nom; w.append(n); fg.append(w);
    });
    // mapes
    $$('.mapa[data-punts]').forEach(m => mapa(m, { punts: m.dataset.punts.split(/\s+/) }));
    // matriu de plataformes
    const mt = $('.dispers .matriu');
    if (mt) {
      const plat = dada('benchmarking.plataformes').valor, files = dada('benchmarking.matriu').valor, tria = mt.dataset.files.split('|');
      const valia = (dada('benchmarking.columna_valia') || {}).valor;
      let h = `<div class="cap">Funció</div>` + plat.map(p => `<div class="cap">${p}</div>`).join('') + (valia ? `<div class="cap valia">Valia (prototip)</div>` : '');
      tria.forEach((nom, r) => {
        const f = files.find(x => x.funcionalitat === nom); if (!f) return;
        h += `<div data-a="puja" style="--d:${(0.3 + r * 0.15).toFixed(2)}s">${nom}</div>` + plat.map((p, c) => `<div class="cel" data-a="creix" style="--d:${(0.45 + r * 0.15 + c * 0.06).toFixed(2)}s">${simbol(f[p])}</div>`).join('');
        if (valia) h += `<div class="cel valia" data-a="creix" style="--d:${(1.5 + r * 0.12).toFixed(2)}s">${simbol(valia[nom] || 'no')}</div>`;
      });
      mt.innerHTML = h;
      const lg = $('.dispers .llegenda'); if (lg) lg.innerHTML = ['si', 'parcial', 'no'].map(t => `<span>${simbol(t)} ${NOMSIMB[t]}</span>`).join('');
    }
    // llistes des de les dades
    $$('[data-llista]').forEach(ul => { const v = dada(ul.dataset.llista).valor; const tria = (ul.dataset.tria || '').split(',').filter(Boolean).map(Number); (tria.length ? tria.map(i => v[i]) : v).forEach((t, k) => { const li = document.createElement('li'); li.textContent = typeof t === 'string' ? t : t.nom; li.setAttribute('data-a', 'puja'); li.style.setProperty('--d', (0.6 + k * 0.12).toFixed(2) + 's'); ul.append(li); }); });
    // nivells
    const nv = $('.recompenses .nivells');
    if (nv) { const L = dada('prototip.nivells').valor, w = 1680, pas = (w - 160) / (L.length - 1); nv.innerHTML = `<svg viewBox="0 0 ${w} 120" aria-hidden="true"><line x1="80" y1="30" x2="${w - 80}" y2="30"/>${L.map((l, i) => `<g data-a="creix" style="--d:${(1 + i * 0.1).toFixed(2)}s"><circle cx="${80 + i * pas}" cy="30" r="${12 + i * 3}"/></g><text x="${80 + i * pas}" y="104">${l.nom}</text>`).join('')}</svg><p class="nomes-mobil etiqueta">Nivells: ${L.map(l => l.nom).join(' → ')}</p>`; }
    // sender estàtic dins de cada pàgina (PDF)
    $$('.d').forEach((s, i) => { const e = document.createElement('div'); e.className = 'sender-pagina'; e.setAttribute('aria-hidden', 'true'); e.innerHTML = senderSVG(i); s.append(e); });
    $('.escenari').append(Sender.el);
  }

  /* ---------- Escenes amb lògica pròpia ---------- */
  const comptadors = s => { if (quiet) return; $$('[data-compta]', s).forEach(el => { const d = dada(el.dataset.compta); if (!d || typeof d.valor !== 'number') return; tween(0.9, e => { el.textContent = format(Math.round(d.valor * e)); }, null, t => 1 - Math.pow(1 - t, 3)); }); };
  let marxa = null;
  function sortida(s) {
    const svg = $('.ruta-svg', s); if (!svg) return; const camí = $('#ruta-sortida', svg), m = $('.mascota', svg), pp = m._pp || (m._pp = parts(m)), parades = $$('.parada', svg), k = 1.6;
    const L = camí.getTotalLength(), longs = parades.map(p => { const cx = +p.dataset.x, cy = +p.dataset.y; let best = 0, bd = Infinity; for (let l = 0; l <= L; l += 4) { const q = camí.getPointAtLength(l), dd = (q.x - cx) ** 2 + (q.y - cy) ** 2; if (dd < bd) { bd = dd; best = l; } } return best; });
    const posa = (l, p) => { const q = camí.getPointAtLength(l), q2 = camí.getPointAtLength(Math.min(L, l + 2)); m.setAttribute('transform', `translate(${q.x.toFixed(1)} ${(q.y - 6).toFixed(1)}) scale(${q2.x < q.x ? -k : k} ${k})`); postura(pp, p); };
    if (marxa) { marxa.kill(); marxa = null; }
    if (quiet || esMobil()) { s.classList.remove('caminant'); parades.forEach(p => p.classList.add('vista')); posa(longs[longs.length - 1], MASC.B.logo); return; }
    s.classList.add('caminant'); parades.forEach(p => p.classList.remove('vista')); posa(0, MASC.B.logo);
    let i = 0, l0 = 0;
    const seg = () => { if (i >= longs.length) { s.classList.remove('caminant'); marxa = null; return; } const l1 = longs[i], dl = l1 - l0; marxa = tween(Math.min(1.2, 0.5 + dl / 400), (e, u) => posa(l0 + dl * e, posturaMarxa(dl * e, k, u)), () => { posa(l1, MASC.B.logo); parades[i].classList.add('vista'); l0 = l1; i++; marxa = { kill() {} }; setTimeout(seg, 350); }); };
    setTimeout(seg, 500);
  }
  const ESCENES = { sortida };
  function entra(s) { comptadors(s); const f = ESCENES[s.dataset.escena]; if (f) f(s); }

  /* ---------- Navegació ---------- */
  const slides = $$('.d'), esc = $('.escenari');
  let actual = -1;
  const comptador = $('.controls .n');
  function escala() { if (esMobil() || IMPRESSIO) { esc.style.transform = ''; return; } const s = Math.min(innerWidth / 1920, innerHeight / 1080); esc.style.transform = `translate(${((innerWidth - 1920 * s) / 2).toFixed(1)}px, ${((innerHeight - 1080 * s) / 2).toFixed(1)}px) scale(${s.toFixed(5)})`; }
  function ves(n, animat) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    if (esMobil()) { slides[n].scrollIntoView({ behavior: quiet ? 'auto' : 'smooth', block: 'start' }); return; }
    if (n === actual) return;
    if (actual >= 0) slides[actual].classList.remove('actiu');
    actual = n; slides[n].classList.add('actiu'); entra(slides[n]);
    Sender.ves(n, animat !== false); if (comptador) comptador.textContent = `${n + 1} / ${slides.length}`;
    try { history.replaceState(null, '', '#' + (n + 1)); } catch (e) { /* file:// en alguns navegadors */ }
  }
  const segona = () => (esMobil() ? Math.max(0, slides.findIndex(s => s.getBoundingClientRect().top > 10) - 1) : actual);
  let avisT = null;
  function avis(t) { let a = $('.avis'); if (!a) { a = document.createElement('div'); a.className = 'avis'; a.setAttribute('role', 'status'); document.body.append(a); } a.textContent = t; a.classList.add('visible'); clearTimeout(avisT); avisT = setTimeout(() => a.classList.remove('visible'), 1400); }
  addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key, ara = esMobil() ? segona() : actual;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); ves(ara + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); ves(ara - 1); }
    else if (k === 'Home') { e.preventDefault(); ves(0, false); }
    else if (k === 'End') { e.preventDefault(); ves(slides.length - 1, false); }
    else if (k === 'f' || k === 'F') { const d = document; if (d.fullscreenElement) d.exitFullscreen(); else if (html.requestFullscreen) html.requestFullscreen().catch(() => {}); }
    else if (k === 'a' || k === 'A') { quiet = !quiet; html.classList.toggle('quiet', quiet); desa('valia-quiet', quiet ? '1' : '0'); avis(quiet ? 'Animacions desactivades' : 'Animacions activades'); if (actual >= 0) entra(slides[actual]); }
  });
  let tx = null, ty = null;
  addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', e => { if (tx === null || esMobil()) return; const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) ves(actual + (dx < 0 ? 1 : -1)); tx = null; }, { passive: true });
  $$('.controls button').forEach(b => b.addEventListener('click', () => ves((esMobil() ? segona() : actual) + (+b.dataset.dir))));
  addEventListener('resize', () => { escala(); if (!esMobil() && actual < 0) ves(0, false); });

  /* ---------- Arrencada ---------- */
  prepara();
  if (IMPRESSIO) { html.classList.add('quiet'); slides.forEach(s => { s.classList.add('actiu'); const f = ESCENES[s.dataset.escena]; if (f) f(s); }); return; }
  escala();
  const inici = Math.max(0, Math.min(slides.length - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
  // En mòbil totes les diapositives queden en l'estat final (sense animacions d'entrada): es llegeixen fent scroll.
  const arrenca = () => { if (esMobil()) { html.classList.add('quiet'); slides.forEach(s => { s.classList.add('actiu'); entra(s); }); if (inici) slides[inici].scrollIntoView(); } else ves(inici, false); };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(arrenca, arrenca);
})();
