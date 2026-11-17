/* Valia · defensa del TR · lògica de la presentació (F3)
   - Omple textos i xifres des de dades/dades.js (generat de dades.json) i construeix els components
     (targetes d'hipòtesi, fases, matriu, pictograma, mapa, QR, logo i mascota).
   - Afegeix les notes de l'orador (dades/notes.js, generat de GUIO.md).
   - Diapositives amb data-escena: «passos» de GSAP (0 = entrada; 1, 2… = un per fragment).
   - Sender: la barra de progrés on camina la mascota del logotip.
   - Tecles: D = mode fosc · A = animacions · S = vista de l'orador · Esc = resum. */
(function () {
  'use strict';
  const D = window.VALIA_DADES, NOTES = window.VALIA_NOTES || {}, MAPA = window.VALIA_MAPA, QR = window.VALIA_QR || '';
  const RIG = window.ValiaRig, FIG = window.ValiaAnim, MASC = window.Mascot;
  const html = document.documentElement, NS = 'http://www.w3.org/2000/svg';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  gsap.registerPlugin(DrawSVGPlugin, SplitText, MotionPathPlugin, Flip);
  if (MASC) MASC.pause(true);

  /* ---------- Preferències ---------- */
  const llegeix = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const desa = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sense emmagatzematge */ } };
  // ?print-pdf (reveal.js) o ?decktape (PDF de seguretat): tot en l'estat final, sense animacions
  const esImpressio = /print-pdf|view=print|decktape/i.test(location.search);
  let animacions = !esImpressio && llegeix('valia-animacions') !== 'no' && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (llegeix('valia-tema') === 'fosc') html.dataset.tema = 'fosc';
  html.classList.toggle('sense-animacions', !animacions);
  const potAnimar = () => animacions && !esImpressio;

  /* ---------- Dades ---------- */
  function dada(cami) { let o = D; for (const t of cami.split('.')) { if (o == null) break; o = o[t]; } if (o == null) console.warn('[dades] no trobo la clau', cami); return o; }
  function format(v, f) {
    if (Array.isArray(v)) return v.length > 1 ? v.slice(0, -1).join(', ') + ' i ' + v[v.length - 1] : String(v[0]);
    if (typeof v !== 'number' || f === 'any') return String(v);
    const [e, d] = String(Math.abs(v)).split('.'); const g = e.length > 4 ? e.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : e;
    return (v < 0 ? '−' : '') + g + (d ? ',' + d : '');
  }
  const xip = t => { const s = document.createElement('span'); s.className = 'pendent'; s.textContent = t || '[PENDENT]'; return s; };
  function omple(el) {
    const d = dada(el.dataset.d), v = d && d[el.dataset.camp || 'valor'];
    if (v == null) { el.replaceChildren(xip()); return; }
    const m = el.dataset.format === 'fraccio' && String(v).match(/^(\d+)\s+(de cada)\s+(\d+)$/);
    if (m) el.innerHTML = `<span class="u">${m[1]}</span> <small>${m[2]}</small> ${m[3]}`; else el.textContent = format(v, el.dataset.format);
    if (d.estat === 'PENDENT') {
      if (el.dataset.pendentDiscret) { const b = document.createElement('span'); b.className = 'marca-pendent'; b.textContent = el.dataset.pendentDiscret; el.append(' ', b); }
      else el.classList.add('es-pendent');
    }
  }
  function peu(el) {
    const grups = new Map(), mapes = [], pendents = [];
    for (const c of (el.dataset.peu || '').split(/\s+/).filter(Boolean)) {
      const d = dada(c); if (!d || !d.peu) continue;
      if (d.estat === 'PENDENT') pendents.push(c);
      if (/^Mapa:/.test(d.peu.autor)) { if (!mapes.includes(d.peu.autor)) mapes.push(d.peu.autor); continue; }
      if (!grups.has(d.peu.data)) grups.set(d.peu.data, []);
      const g = grups.get(d.peu.data); if (!g.includes(d.peu.autor)) g.push(d.peu.autor);
    }
    const n = [...grups.values()].reduce((s, a) => s + a.length, 0);
    let t = n ? (n > 1 ? 'Fonts: ' : 'Font: ') + [...grups].map(([data, a]) => `${format(a)} (${data})`).join('; ') + '.' : '';
    mapes.forEach(m => { t += (t ? ' ' : '') + m + '.'; });
    if (el.dataset.peuExtra) t += (t ? ' ' : '') + el.dataset.peuExtra;
    el.textContent = t.trim();
    if (pendents.length) { const b = document.createElement('span'); b.className = 'marca-pendent'; b.textContent = 'Pendent'; b.title = pendents.map(c => c + ': ' + (dada(c).nota || '')).join('\n'); el.append(' ', b); }
  }

  /* ---------- Figures: logotip, mascota, mapa, símbols ---------- */
  function logoSVG() {
    const L = FIG.LEAF;
    return `<svg viewBox="0 4 120 120" role="img" aria-label="Logotip de Valia"><g transform="${L.rot}"><path d="${L.stem}" fill="none" stroke="#00A86B" stroke-width="4.2" stroke-linecap="round"/><path d="${L.blade}" fill="#00A86B"/><path d="${L.rib}" fill="none" stroke="#FFFFFF" stroke-opacity=".32" stroke-width="2" stroke-linecap="round"/></g>${FIG.staticFigure('#FFFFFF')}</svg>`;
  }
  const NECK = [1.2, -23.5];
  const parts = g => { const o = {}; $$('[data-p]', g).forEach(p => { o[p.getAttribute('data-p')] = p; }); return o; };
  function aplicaPostura(pp, p) {
    const tr = FIG.poseTransforms(p); for (const k in tr) if (pp[k]) pp[k].setAttribute('transform', tr[k]);
    if (pp.head) pp.head.setAttribute('transform', `rotate(${(p.head || 0).toFixed(2)} ${NECK[0]} ${NECK[1]})`);
  }
  function figuraSVG(postura, cls, roca) {
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '-28 -66 56 70'); svg.setAttribute('class', cls || '');
    svg.innerHTML = (roca ? '<path class="roca" d="M-12 0C-13 -6 -9 -13.2 0 -13.6C9 -14 13 -7 12.4 0Z"/>' : '') + `<g>${FIG.figureMarkup('currentColor')}</g>`;
    aplicaPostura(parts(svg), postura); return svg;
  }
  const SIMB = { si: '<circle class="si" cx="26" cy="26" r="24"/><path class="si-v" d="M15 27l7 7 15-16"/>', parcial: '<circle class="parc-c" cx="26" cy="26" r="21.5"/><path class="parc-f" d="M26 4.5a21.5 21.5 0 0 0 0 43Z"/>', no: '<path class="no" d="M15 15l22 22M37 15 15 37"/>', limitada: '<path class="no" d="M12 26h28"/>' };
  const NOMSIMB = { si: 'Sí', parcial: 'Parcial', no: 'No', limitada: 'Limitada' };
  const simbol = t => `<svg viewBox="0 0 52 52" class="simb" role="img" aria-label="${NOMSIMB[t]}">${SIMB[t]}</svg>`;
  function mapaSVG(cont) {
    const [x, y, w, h] = MAPA.viewBox, punts = (cont.dataset.punts || '').split(/\s+/).filter(Boolean);
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`); svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `<path class="comarca" d="${MAPA.comarca}"/>` +
      `<g class="munis">${MAPA.municipis.map(m => `<circle class="muni" cx="${m.x}" cy="${m.y}" r="8"><title>${m.nom}</title></circle>`).join('')}</g>` +
      `<g class="punts">${punts.map(id => { const p = MAPA.punts[id], g = id === 'granollers'; return `<g class="pt" data-punt="${id}"><circle class="halo" cx="${p.x}" cy="${p.y}" r="${g ? 0 : 52}"/><circle class="punt" cx="${p.x}" cy="${p.y}" r="${g ? 11 : 17}"/></g>`; }).join('')}</g>`;
    cont.prepend(svg);
    $$('.lloc', cont).forEach(l => {
      const p = MAPA.punts[l.dataset.punt]; if (!p) return;
      l.style.left = (100 * p.x / w) + '%'; l.style.top = (100 * p.y / h) + '%';
      l.style.marginLeft = (l.dataset.dx || 0) + 'px'; l.style.marginTop = (l.dataset.dy || 0) + 'px';
      if (l.dataset.costat === 'esq') l.classList.add('esq');
      gsap.set(l, { xPercent: l.classList.contains('esq') ? -100 : 0, yPercent: -50 });
    });
  }

  /* ---------- Construcció dels components ---------- */
  function construeix() {
    $$('[data-logo]').forEach(el => { el.innerHTML = logoSVG(); });
    $$('[data-qr]').forEach(el => { el.innerHTML = QR; });
    $$('[data-contorn]').forEach(el => { const [x, y, w, h] = MAPA.viewBox; el.innerHTML = `<svg viewBox="${x} ${y} ${w} ${h}" aria-hidden="true"><path data-a="dibuixa" pathLength="1" style="--d:.3s" d="${MAPA.comarca}"/></svg>`; });
    $$('[data-tancament]').forEach(el => { el.innerHTML = String(dada('projecte.tancament').valor).split(/(?<=\.)\s+/).map(t => `<span>${t}</span>`).join(''); });
    $$('.mapa[data-punts]').forEach(mapaSVG);
    // D1 · pictograma: un jove camina, dos estan asseguts (la postura codifica la dada)
    $$('.ganxo .figures').forEach(f => {
      const nom = t => { const s = document.createElement('span'); s.className = 'fig-nom'; s.textContent = t; return s; };
      const pila = document.createElement('div'); pila.className = 'pila';
      const actiu = figuraSVG(MASC.B.logo, 'fig activa'); pila.append(figuraSVG(MASC.B.logo, 'fig'), actiu, nom('es mou prou'));
      const assegut = () => { const w = document.createElement('div'); w.append(figuraSVG(MASC.B.sit, 'fig', true), nom('no prou')); return w; };
      f.append(pila, assegut(), assegut());
    });
    // D2 i D14 · targetes d'hipòtesi
    $$('[data-hipotesis]').forEach(c => {
      const final = c.dataset.hipotesis === 'final';
      c.innerHTML = dada('recerca.hipotesis_secundaries').map((h, k) => `<div class="targeta" data-a="puja" style="--d:${(0.3 + k * 0.15).toFixed(2)}s">
        <span class="codi">${h.id}</span><span class="ambit">${h.ambit}</span><p class="frase">${h.targeta}</p>
        <p class="indicador"><b>Indicador:</b> ${h.indicador_curt}</p>
        ${final ? `<p class="indicador"><b>Resultat:</b> ${h.resultat == null ? '<span class="pendent">[PENDENT]</span>' : h.resultat}</p><div class="veredicte">${h.veredicte == null ? 'Sense veredicte fins que hi hagi resultat' : h.veredicte}</div>` : ''}
      </div>`).join('');
    });
    // D3 · fases de la metodologia
    $$('[data-fases]').forEach(c => {
      c.innerHTML = dada('recerca.metodologia_fases').map((f, k) => `<div class="fase${f.estat === 'PENDENT' ? ' pendent-f' : ''}" data-a="puja" style="--d:${(0.4 + k * 0.12).toFixed(2)}s">
        <div class="n">${f.n}</div><b>${f.nom}</b><span>${f.on_es_al_tr ? 'TR ' + f.on_es_al_tr.replace('PROTOTIP_DOC', 'i prototip') : '<span class="pendent">[PENDENT]</span>'}</span></div>`).join('');
    });
    // D6 · matriu de plataformes + columna de Valia
    $$('[data-matriu]').forEach(mt => {
      const plat = dada('benchmarking.plataformes').valor, files = dada('benchmarking.matriu').valor, valia = (dada('benchmarking.columna_valia') || {}).valor;
      let h = `<div class="cap">Funció</div>` + plat.map(p => `<div class="cap">${p}</div>`).join('') + (valia ? `<div class="cap valia">Valia (prototip)</div>` : '');
      mt.dataset.matriu.split('|').forEach((nom, r) => {
        const f = files.find(x => x.funcionalitat === nom); if (!f) return;
        h += `<div data-a="puja" style="--d:${(0.3 + r * 0.15).toFixed(2)}s">${nom}</div>` + plat.map((p, c) => `<div class="cel" data-a="creix" style="--d:${(0.45 + r * 0.15 + c * 0.06).toFixed(2)}s">${simbol(f[p])}</div>`).join('');
        if (valia) h += `<div class="cel valia" data-a="creix" style="--d:${(1.5 + r * 0.12).toFixed(2)}s">${simbol(valia[nom] || 'no')}</div>`;
      });
      mt.innerHTML = h;
      const lg = mt.parentElement.querySelector('.llegenda'); if (lg) lg.innerHTML = ['si', 'parcial', 'no'].map(t => `<span>${simbol(t)} ${NOMSIMB[t]}</span>`).join('');
    });
    // D7 · mascota de la ruta
    $$('.ruta-svg .mascota').forEach(g => { g.innerHTML = FIG.figureMarkup('currentColor'); });
  }
  function prepara() {
    construeix();
    $$('[data-d]').forEach(omple);
    $$('[data-compta]').forEach(el => { const d = dada(el.dataset.compta); el.textContent = d ? format(d.valor) : '[PENDENT]'; });
    $$('[data-peu], [data-peu-extra]').forEach(peu);
    $$('.reveal .slides > section[data-diapo]').forEach(s => {
      const n = NOTES[s.dataset.diapo]; if (!n || $('aside.notes', s)) return;
      const a = document.createElement('aside'); a.className = 'notes'; a.innerHTML = n; s.appendChild(a);
    });
  }

  /* ---------- Marxa de la mascota (rig del prototip) ---------- */
  const RW = RIG.make({ flat: true }), C = RW.C, TE = 4.6, XE = RW.state(TE).X;
  const clona = p => MASC.mix(p, p, 0);
  function desplaça(p, dx) { const o = clona(p); [o.H, o.lF.K, o.lF.P, o.lN.K, o.lN.P, o.SN, o.SF, o.armN.E, o.armN.P, o.armF.E, o.armF.P, o.tip, o.top].forEach(a => { a[0] += dx; }); return o; }
  const ss = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  const posturaMarxa = (recorregut, k, u) => { const p = desplaça(RW.pose(TE + (recorregut / (C.S * k)) * C.T), -XE); const b = Math.min(1, u / 0.14, (1 - u) / 0.14); return b < 1 ? MASC.mix(MASC.B.logo, p, ss(b)) : p; };

  /* ---------- Sender: barra de progrés amb la mascota ---------- */
  const Sender = (() => {
    const X0 = 120, X1 = 1800, Y = 1044, K = 1.05, ULTIMA = (D.temps.diapositives.length - 1) || 15;
    const xDe = n => X0 + (X1 - X0) * Math.max(0, Math.min(1, n / ULTIMA));
    const el = document.createElement('div'); el.className = 'sender'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<svg width="1920" height="1080" viewBox="0 0 1920 1080"><line class="camí" x1="${X0}" y1="${Y}" x2="${X1}" y2="${Y}"/><line class="fet" x1="${X0}" y1="${Y}" x2="${X0}" y2="${Y}"/>` +
      Array.from({ length: ULTIMA + 1 }, (_, i) => `<circle class="fita" data-i="${i}" cx="${xDe(i)}" cy="${Y}" r="7"/>`).join('') + `<g class="mascota">${FIG.figureMarkup('currentColor')}</g></svg>`;
    const fet = $('.fet', el), masc = $('.mascota', el), pp = parts(masc);
    let x = X0, anim = null;
    function dibuixa(p, xx, mirall) {
      masc.setAttribute('transform', `translate(${xx.toFixed(1)} ${Y - 4}) scale(${mirall ? -K : K} ${K})`); aplicaPostura(pp, p); fet.setAttribute('x2', xx.toFixed(1));
      $$('.fita', el).forEach(f => f.classList.toggle('passada', xDe(+f.dataset.i) <= xx + 0.5));
    }
    function ves(n, animat) {
      const xt = xDe(n), dist = xt - x, d = Math.abs(dist); if (anim) { anim.kill(); anim = null; }
      if (!animat || !potAnimar() || d < 1 || d > 3.2 * (X1 - X0) / ULTIMA) { x = xt; dibuixa(MASC.B.logo, x, false); return; }
      const x0 = x, o = { u: 0 };
      anim = gsap.to(o, { u: 1, duration: Math.min(1.2, Math.max(0.6, 0.4 + d / 280)), ease: 'power1.inOut',
        onUpdate() { x = x0 + dist * o.u; dibuixa(posturaMarxa(d * o.u, K, o.u), x, dist < 0); },
        onComplete() { anim = null; dibuixa(MASC.B.logo, x, false); } });
    }
    dibuixa(MASC.B.logo, X0, false);
    return { el, ves };
  })();

  /* ---------- Escenes ---------- */
  const lineesTitular = (sec, tl, pos) => { const h = $('.titular', sec); if (!h) return; const st = SplitText.create(h, { type: 'lines', mask: 'lines' }); tl.from(st.lines, { yPercent: 105, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, pos); };
  const comptador = (el, tl, pos, dur) => { const d = el && dada(el.dataset.compta); if (!d || typeof d.valor !== 'number') return; const o = { v: 0 }; tl.fromTo(o, { v: 0 }, { v: d.valor, duration: dur || 1, ease: 'power2.out', onUpdate: () => { el.textContent = format(Math.round(o.v)); } }, pos); };
  let marxa = null;
  const ESCENES = {
    ganxo: {
      passos: [
        (tl, sec) => { const st = SplitText.create($('.eslogan', sec), { type: 'words' }); tl.set($('.dades', sec), { autoAlpha: 0 }).set($('.eslogan', sec), { autoAlpha: 1 }).from(st.words, { y: 40, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' }); },
        (tl, sec) => {
          const grups = Array.from($('.figures', sec).children), actiu = $('.fig.activa', sec);
          tl.to($('.eslogan', sec), { autoAlpha: 0, y: -30, duration: 0.4, ease: 'power2.in' }).set($('.dades', sec), { autoAlpha: 1 });
          lineesTitular(sec, tl, '>-0.05');
          tl.from(grups, { autoAlpha: 0, y: 30, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '<0.2')
            .fromTo(actiu, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, '>-0.1')
            .from([$('.xifra', sec), $('.lectura', sec)], { autoAlpha: 0, y: 24, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '<');
        }
      ]
    },
    territori: {
      passos: [
        (tl, sec) => {
          tl.set($$('.lloc[data-pas], .pt:not([data-punt="granollers"]), .km372', sec), { autoAlpha: 0 });
          tl.fromTo($('.comarca', sec), { drawSVG: '0%', fillOpacity: 0 }, { drawSVG: '100%', duration: 1.2, ease: 'power1.inOut' }, 0.2)
            .to($('.comarca', sec), { fillOpacity: 1, duration: 0.4 }, '>-0.2')
            .fromTo($$('.muni', sec), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.35, ease: 'back.out(2.5)', stagger: { each: 0.02, from: 'random' } }, 0.9);
        },
        ...['1', '2', '3', '4'].map(n => (tl, sec) => {
          const l = $(`.lloc[data-pas="${n}"]`, sec), g = $(`.pt[data-punt="${l.dataset.punt}"]`, sec);
          tl.set(g, { autoAlpha: 1 }).from($('.halo', g), { scale: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'power2.out' })
            .from($('.punt', g), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(2.2)' }, '<').to(l, { autoAlpha: 1, duration: 0.5 }, '<0.15');
        }),
        (tl, sec) => { const b = $('.km372', sec); tl.to(b, { autoAlpha: 1, duration: 0.4 }).from(b, { y: 24, duration: 0.5, ease: 'power2.out' }, '<'); comptador($('[data-compta]', b), tl, '<', 1.0); }
      ]
    },
    sortida: {
      passos: [],
      entra(sec) {
        const svg = $('.ruta-svg', sec), cami = $('#ruta-sortida', svg), m = $('.mascota', svg), pp = m._pp || (m._pp = parts(m)), parades = $$('.parada', svg), k = 1.6;
        const L = cami.getTotalLength(), longs = parades.map(p => { const cx = +p.dataset.x, cy = +p.dataset.y; let best = 0, bd = Infinity; for (let l = 0; l <= L; l += 4) { const q = cami.getPointAtLength(l), dd = (q.x - cx) ** 2 + (q.y - cy) ** 2; if (dd < bd) { bd = dd; best = l; } } return best; });
        const posa = (l, p) => { const q = cami.getPointAtLength(l), q2 = cami.getPointAtLength(Math.min(L, l + 2)); m.setAttribute('transform', `translate(${q.x.toFixed(1)} ${(q.y - 6).toFixed(1)}) scale(${q2.x < q.x ? -k : k} ${k})`); aplicaPostura(pp, p); };
        if (marxa) { marxa.kill(); marxa = null; }
        if (!potAnimar()) { sec.classList.remove('caminant'); parades.forEach(p => p.classList.add('vista')); posa(longs[longs.length - 1], MASC.B.logo); return; }
        sec.classList.add('caminant'); parades.forEach(p => p.classList.remove('vista')); posa(0, MASC.B.logo);
        const tl = gsap.timeline({ delay: 0.5, onComplete: () => sec.classList.remove('caminant') }); let l0 = 0;
        longs.forEach((l1, i) => { const dl = l1 - l0, a = l0, o = { u: 0 }; tl.to(o, { u: 1, duration: Math.min(1.2, 0.5 + dl / 400), ease: 'power1.inOut', onUpdate: () => posa(a + dl * o.u, posturaMarxa(dl * o.u, k, o.u)) }).call(() => { posa(l1, MASC.B.logo); parades[i].classList.add('vista'); }).to({}, { duration: 0.3 }); l0 = l1; });
        marxa = tl;
      },
      surt() { if (marxa) { marxa.progress(1).kill(); marxa = null; } }
    }
  };

  /* ---------- Motor de passos ---------- */
  const estats = new WeakMap();
  function escena(sec) { let e = estats.get(sec); if (!e) { e = { def: ESCENES[sec.dataset.escena] || { passos: [] }, tl: null, anim: null }; estats.set(sec, e); } return e; }
  function linia(sec) { const e = escena(sec); if (!e.tl) { const tl = gsap.timeline({ paused: true }); e.def.passos.forEach((f, i) => { tl.addLabel('p' + i); f(tl, sec); tl.addLabel('f' + i); }); e.tl = tl; } return e.tl; }
  function mostra(sec, n, animat) {
    const e = escena(sec), ult = e.def.passos.length - 1; if (ult < 0) return;
    const tl = linia(sec); n = Math.max(0, Math.min(n, ult)); if (e.anim) { e.anim.kill(); e.anim = null; }
    if (animat && potAnimar()) { tl.seek('p' + n, false); e.anim = tl.tweenFromTo('p' + n, 'f' + n); } else tl.seek('f' + n, false);
  }
  const pasActual = () => { const f = Reveal.getIndices().f; return (typeof f === 'number' ? f : -1) + 1; };
  const diapo = sec => +(sec && sec.dataset.diapo || 0);
  let hAnterior = -1;
  function entra(sec, endavant) { const n = pasActual(), e = escena(sec); mostra(sec, n, endavant && n === 0); if (e.def.entra) e.def.entra(sec); Sender.ves(diapo(sec), endavant !== null); hAnterior = Reveal.getIndices().h; }
  function surt(sec) { if (!sec) return; const e = escena(sec); if (e.anim) { e.anim.progress(1).kill(); e.anim = null; } if (e.def.surt) e.def.surt(sec); }

  /* ---------- Tecles ---------- */
  let avisT = null;
  function avis(text) { let a = $('.avis'); if (!a) { a = document.createElement('div'); a.className = 'avis'; a.setAttribute('role', 'status'); document.body.append(a); } a.textContent = text; a.classList.add('visible'); clearTimeout(avisT); avisT = setTimeout(() => a.classList.remove('visible'), 1400); }
  function canviaTema() { if (html.dataset.tema === 'fosc') delete html.dataset.tema; else html.dataset.tema = 'fosc'; desa('valia-tema', html.dataset.tema || 'clar'); avis(html.dataset.tema ? 'Mode fosc' : 'Mode clar'); }
  function canviaAnimacions() {
    animacions = !animacions; desa('valia-animacions', animacions ? 'si' : 'no'); html.classList.toggle('sense-animacions', !animacions);
    Reveal.configure({ transition: animacions ? 'fade' : 'none' });
    const s = Reveal.getCurrentSlide(); surt(s); mostra(s, pasActual(), false); if (escena(s).def.entra) escena(s).def.entra(s); Sender.ves(diapo(s), false);
    avis(animacions ? 'Animacions activades' : 'Animacions desactivades');
  }

  /* ---------- Arrencada ---------- */
  prepara();
  const arrenca = () => {
    Reveal.initialize({
      width: 1920, height: 1080, margin: 0, minScale: 0.05, maxScale: 4, center: false, hash: true,
      controls: false, progress: false, slideNumber: false, transition: animacions ? 'fade' : 'none', transitionSpeed: 'fast', backgroundTransition: 'none',
      pdfSeparateFragments: false, pdfMaxPagesPerSlide: 1, keyboard: { 68: canviaTema, 65: canviaAnimacions }, plugins: [window.RevealNotes].filter(Boolean)
    });
    Reveal.on('ready', ev => {
      $('.reveal .slides').prepend(Sender.el); // al principi: reveal.js considera última la diapositiva que no té cap germà al darrere
      if (esImpressio) { $$('.reveal .slides > section').forEach(s => { const e = escena(s); mostra(s, e.def.passos.length - 1, false); if (e.def.entra) e.def.entra(s); }); return; }
      entra(ev.currentSlide, true);
    });
    Reveal.on('slidechanged', ev => { const endavant = ev.indexh > hAnterior; surt(ev.previousSlide); entra(ev.currentSlide, endavant); });
    Reveal.on('fragmentshown', () => mostra(Reveal.getCurrentSlide(), pasActual(), true));
    Reveal.on('fragmenthidden', () => mostra(Reveal.getCurrentSlide(), pasActual(), false));
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(arrenca, arrenca);
})();
