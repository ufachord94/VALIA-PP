/* Valia · defensa del TR · lògica de la presentació
   - Omple els textos i les xifres des de dades/dades.js (generat a partir de dades.json).
   - Afegeix les notes de l'orador (dades/notes.js, generat a partir de GUIO.md).
   - Cada diapositiva amb data-escena té «passos»: 0 = entrada; 1, 2… = un per fragment.
     Els passos són una línia de temps de GSAP que es pot reproduir o saltar a qualsevol estat.
   - Sender: la barra de progrés on camina la mascota del logotip.
   - Tecles: D = mode fosc · A = activar o desactivar animacions · S = vista de l'orador · Esc = resum. */
(function () {
  'use strict';
  const D = window.VALIA_DADES, NOTES = window.VALIA_NOTES || {}, MAPA = window.VALIA_MAPA;
  const RIG = window.ValiaRig, FIG = window.ValiaAnim, MASC = window.Mascot;
  const html = document.documentElement, NS = 'http://www.w3.org/2000/svg';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  gsap.registerPlugin(DrawSVGPlugin, SplitText, MotionPathPlugin, Flip);
  if (MASC) MASC.pause(true); // la mascota del prototip té un bucle propi; aquí la movem nosaltres

  /* ---------- Preferències ---------- */
  const llegeix = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const desa = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sense emmagatzematge: no passa res */ } };
  const esImpressio = /print-pdf|view=print/i.test(location.search);
  let animacions = llegeix('valia-animacions') !== 'no' && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (llegeix('valia-tema') === 'fosc') html.dataset.tema = 'fosc';
  html.classList.toggle('sense-animacions', !animacions);
  const potAnimar = () => animacions && !esImpressio;

  /* ---------- Dades ---------- */
  function dada(cami) {
    let o = D;
    for (const t of cami.split('.')) { if (o == null) break; o = o[t]; }
    if (o == null) console.warn('[dades] no trobo la clau', cami);
    return o;
  }
  function format(v, f) {
    if (Array.isArray(v)) return v.length > 1 ? v.slice(0, -1).join(', ') + ' i ' + v[v.length - 1] : String(v[0]);
    if (typeof v !== 'number') return String(v);
    if (f === 'any') return String(v);
    const [e, d] = String(Math.abs(v)).split('.');
    const g = e.length > 4 ? e.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : e;
    return (v < 0 ? '−' : '') + g + (d ? ',' + d : '');
  }
  function marcaPendent(el) { el.classList.add('es-pendent'); el.title = 'Dada pendent: vegeu PENDENTS.md'; }
  function omple(el) {
    const d = dada(el.dataset.d), camp = el.dataset.camp || 'valor';
    const v = d && d[camp];
    if (v == null) { el.textContent = '[PENDENT]'; marcaPendent(el); return; }
    if (el.dataset.format === 'fraccio') {
      const m = String(v).match(/^(\d+)\s+(de cada)\s+(\d+)$/);
      el.innerHTML = m ? `<span class="u">${m[1]}</span> <small>${m[2]}</small> ${m[3]}` : format(v);
    } else el.textContent = format(v, el.dataset.format);
    if (d.estat === 'PENDENT') marcaPendent(el);
  }
  function peu(el) {
    const grups = new Map(), mapes = [], pendents = [];
    for (const c of el.dataset.peu.split(/\s+/).filter(Boolean)) {
      const d = dada(c); if (!d || !d.peu) continue;
      if (d.estat === 'PENDENT') pendents.push(c);
      if (/^Mapa:/.test(d.peu.autor)) { if (!mapes.includes(d.peu.autor)) mapes.push(d.peu.autor); continue; }
      if (!grups.has(d.peu.data)) grups.set(d.peu.data, []);
      const g = grups.get(d.peu.data); if (!g.includes(d.peu.autor)) g.push(d.peu.autor);
    }
    const n = [...grups.values()].reduce((s, a) => s + a.length, 0);
    let t = n ? (n > 1 ? 'Fonts: ' : 'Font: ') + [...grups].map(([data, a]) => `${format(a)} (${data})`).join('; ') + '.' : '';
    mapes.forEach(m => { t += (t ? ' ' : '') + m + '.'; });
    if (el.dataset.peuExtra) t += ' ' + el.dataset.peuExtra;
    el.textContent = t.trim();
    if (pendents.length) {
      const b = document.createElement('span'); b.className = 'marca-pendent'; b.textContent = 'Pendent';
      b.title = pendents.map(c => c + ': ' + (dada(c).nota || '')).join('\n');
      el.append(' ', b);
    }
  }
  function prepara() {
    $$('[data-d]').forEach(omple);
    $$('[data-compta]').forEach(el => { const d = dada(el.dataset.compta); el.textContent = d ? format(d.valor) : '[PENDENT]'; if (!d || d.estat === 'PENDENT') marcaPendent(el); });
    $$('[data-peu]').forEach(peu);
    $$('.reveal .slides > section[data-diapo]').forEach(s => {
      const n = NOTES[s.dataset.diapo]; if (!n || $('aside.notes', s)) return;
      const a = document.createElement('aside'); a.className = 'notes'; a.innerHTML = n; s.appendChild(a);
    });
  }

  /* ---------- Figures: logotip, mascota i mapa ---------- */
  function logoSVG() {
    const L = FIG.LEAF;
    return `<svg viewBox="0 4 120 120" width="96" height="96" role="img" aria-label="Logotip de Valia">
      <g transform="${L.rot}"><path class="tija" d="${L.stem}" fill="none" stroke="#00A86B" stroke-width="4.2" stroke-linecap="round"/>
      <path class="fulla" d="${L.blade}" fill="#00A86B" stroke="#00A86B" stroke-width="1.5"/>
      <path class="nervi" d="${L.rib}" fill="none" stroke="#FFFFFF" stroke-opacity=".32" stroke-width="2" stroke-linecap="round"/></g>
      <g class="excursionista">${FIG.staticFigure('#FFFFFF')}</g></svg>`;
  }
  const NECK = [1.2, -23.5];
  function parts(g) { const o = {}; $$('[data-p]', g).forEach(p => { o[p.getAttribute('data-p')] = p; }); return o; }
  function aplicaPostura(pp, p) {
    const tr = FIG.poseTransforms(p);
    for (const k in tr) if (pp[k]) pp[k].setAttribute('transform', tr[k]);
    if (pp.head) pp.head.setAttribute('transform', `rotate(${(p.head || 0).toFixed(2)} ${NECK[0]} ${NECK[1]})`);
  }
  function figuraSVG(postura, cls) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '-18 -66 44 70'); svg.setAttribute('class', cls || '');
    svg.innerHTML = `<g>${FIG.figureMarkup('currentColor')}</g>`;
    aplicaPostura(parts(svg), postura);
    return svg;
  }
  function mapaSVG(cont, { punts = true } = {}) {
    const [x, y, w, h] = MAPA.viewBox;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
    svg.innerHTML = `<path class="comarca" d="${MAPA.comarca}"/>` +
      `<g class="munis">${MAPA.municipis.map(m => `<circle class="muni" cx="${m.x}" cy="${m.y}" r="8"><title>${m.nom}</title></circle>`).join('')}</g>` +
      (punts ? `<g class="punts">${Object.entries(MAPA.punts).map(([id, p]) =>
        `<g class="pt" data-punt="${id}"><circle class="halo" cx="${p.x}" cy="${p.y}" r="${id === 'granollers' ? 0 : 52}"/><circle class="punt" cx="${p.x}" cy="${p.y}" r="${id === 'granollers' ? 11 : 17}"/></g>`).join('')}</g>` : '');
    cont.prepend(svg);
    $$('.lloc', cont).forEach(l => {
      const p = MAPA.punts[l.dataset.punt]; if (!p) return;
      l.style.left = (100 * p.x / w) + '%'; l.style.top = (100 * p.y / h) + '%';
      l.style.marginLeft = (l.dataset.dx || 0) + 'px'; l.style.marginTop = (l.dataset.dy || 0) + 'px';
      if (l.dataset.costat === 'esq') l.classList.add('esq');
      gsap.set(l, { xPercent: l.classList.contains('esq') ? -100 : 0, yPercent: -50 });
    });
    return svg;
  }

  /* ---------- Sender: barra de progrés amb la mascota ---------- */
  const Sender = (() => {
    const X0 = 120, X1 = 1800, Y = 1044, K = 1.05, ULTIMA = (D.temps.diapositives.length - 1) || 15;
    const RW = RIG.make({ flat: true }), C = RW.C, TE = 4.6, XE = RW.state(TE).X;
    const xDe = n => X0 + (X1 - X0) * Math.max(0, Math.min(1, n / ULTIMA));
    const el = document.createElement('div'); el.className = 'sender'; el.setAttribute('aria-hidden', 'true');
    const fites = Array.from({ length: ULTIMA + 1 }, (_, i) => `<circle class="fita" data-i="${i}" cx="${xDe(i)}" cy="${Y}" r="7"/>`).join('');
    el.innerHTML = `<svg width="1920" height="1080" viewBox="0 0 1920 1080">
      <line class="camí" x1="${X0}" y1="${Y}" x2="${X1}" y2="${Y}"/><line class="fet" x1="${X0}" y1="${Y}" x2="${X0}" y2="${Y}"/>${fites}
      <g class="mascota">${FIG.figureMarkup('currentColor')}</g></svg>`;
    const fet = $('.fet', el), masc = $('.mascota', el), pp = parts(masc);
    let x = X0, diapo = 0, anim = null;
    const clona = p => MASC.mix(p, p, 0);
    function desplaça(p, dx) {
      const o = clona(p); [o.H, o.lF.K, o.lF.P, o.lN.K, o.lN.P, o.SN, o.SF, o.armN.E, o.armN.P, o.armF.E, o.armF.P, o.tip, o.top].forEach(a => { a[0] += dx; });
      return o;
    }
    const camina = fase => desplaça(RW.pose(TE + fase * C.T), -XE);
    const ss = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
    function dibuixa(p, xx, mirall) {
      masc.setAttribute('transform', `translate(${xx.toFixed(1)} ${Y - 4}) scale(${mirall ? -K : K} ${K})`);
      aplicaPostura(pp, p); fet.setAttribute('x2', xx.toFixed(1));
      $$('.fita', el).forEach(f => f.classList.toggle('passada', xDe(+f.dataset.i) <= xx + 0.5));
    }
    function repos(p) { dibuixa(p || MASC.B.logo, x, false); }
    function ves(n, animat) {
      diapo = n; const xt = xDe(n), dist = xt - x, d = Math.abs(dist);
      if (anim) { anim.kill(); anim = null; }
      if (!animat || !potAnimar() || d < 1 || d > 3.2 * (X1 - X0) / ULTIMA) { x = xt; repos(); return; }
      const x0 = x, o = { u: 0 }, mirall = dist < 0;
      anim = gsap.to(o, {
        u: 1, duration: Math.min(1.2, Math.max(0.6, 0.4 + d / 280)), ease: 'power1.inOut',
        onUpdate() {
          x = x0 + dist * o.u;
          let p = camina((d * o.u) / (C.S * K));                          // els peus no rellisquen: fase = distància / gambada
          const b = Math.min(1, o.u / 0.14, (1 - o.u) / 0.14);
          if (b < 1) p = MASC.mix(MASC.B.logo, p, ss(b));
          dibuixa(p, x, mirall);
        },
        onComplete() { anim = null; repos(); }
      });
    }
    function pas(enrere) { // un pas sense desplaçar-se (portada): de dret a la postura del logotip
      if (!potAnimar()) { repos(); return gsap.to({}, { duration: 0 }); }
      const o = { u: 0 }, [a, b] = enrere ? [MASC.B.logo, MASC.B.stand] : [MASC.B.stand, MASC.B.logo];
      return gsap.to(o, { u: 1, duration: 0.6, ease: 'power2.inOut', onUpdate() { dibuixa(MASC.mix(a, b, o.u), x, false); } });
    }
    return { el, ves, pas, repos, dreta: () => dibuixa(MASC.B.stand, x, false) };
  })();

  /* ---------- Escenes ---------- */
  const lineesTitular = (sec, tl, pos) => {
    const h = $('.titular', sec); if (!h) return;
    const st = SplitText.create(h, { type: 'lines', mask: 'lines', linesClass: 'linia' });
    tl.from(st.lines, { yPercent: 105, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, pos);
  };
  const comptador = (el, tl, pos, dur) => {
    const d = dada(el.dataset.compta); if (!d || typeof d.valor !== 'number') return;
    const o = { v: 0 };
    tl.fromTo(o, { v: 0 }, { v: d.valor, duration: dur || 1, ease: 'power2.out', onUpdate: () => { el.textContent = format(Math.round(o.v)); } }, pos);
  };

  const ESCENES = {
    portada: {
      munta(sec) {
        $('.logo', sec).innerHTML = logoSVG();
        mapaSVG($('.mapa', sec), { punts: false });
      },
      passos: [],
      entra(sec) {
        const fulla = $('.logo .fulla', sec), tija = $('.logo .tija', sec), figura = $$('.logo .excursionista, .logo .nervi', sec);
        const camí = $('.mapa .comarca', sec), munis = $$('.mapa .muni', sec);
        this.atura(sec);
        if (!potAnimar()) { gsap.set([fulla, tija, ...figura, camí, ...munis], { clearProps: 'all' }); Sender.repos(); return; }
        const logo = gsap.timeline();
        logo.fromTo(fulla, { drawSVG: '0%', fillOpacity: 0 }, { drawSVG: '100%', duration: 1.0, ease: 'power2.inOut' })
          .fromTo(tija, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4 }, '-=0.3')
          .to(fulla, { fillOpacity: 1, duration: 0.5 }, '-=0.1')
          .fromTo(figura, { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.2');
        const bucle = gsap.timeline({ repeat: -1 });
        bucle.add(() => Sender.dreta())
          .set([camí, ...munis], { opacity: 1 })
          .fromTo(camí, { drawSVG: '0%', fillOpacity: 0 }, { drawSVG: '100%', duration: 1.2, ease: 'power1.inOut' })
          .to(camí, { fillOpacity: 1, duration: 0.5 })
          .fromTo(munis, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.4, ease: 'back.out(2.5)', stagger: { each: 0.02, from: 'random' } }, '-=0.4')
          .add(Sender.pas(), '+=0.1')
          .to({}, { duration: 6 })
          .to([camí, ...munis], { opacity: 0, duration: 0.6 });
        this.tls = [logo, bucle];
      },
      surt(sec) { this.atura(sec); },
      atura() { (this.tls || []).forEach(t => t.kill()); this.tls = []; Sender.repos(); }
    },

    ganxo: {
      munta(sec) {
        // Tres joves: un camina (fa l'activitat física recomanada) i dos estan quiets.
        // La postura codifica la dada, no només el color. La figura verda es posa damunt de la grisa i apareix al pas 1.
        const pila = document.createElement('div'); pila.className = 'pila';
        const actiu = figuraSVG(MASC.B.logo, 'fig activa');
        pila.append(figuraSVG(MASC.B.logo, 'fig'), actiu);
        $('.figures', sec).append(pila, figuraSVG(MASC.B.stand, 'fig'), figuraSVG(MASC.B.stand, 'fig'));
        this.actiu = actiu;
      },
      passos: [
        (tl, sec) => { // 0 · eslògan
          const st = SplitText.create($('.eslogan', sec), { type: 'words', wordsClass: 'paraula' });
          tl.set($('.dades', sec), { autoAlpha: 0 })
            .set($('.eslogan', sec), { autoAlpha: 1 })
            .from(st.words, { y: 40, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' });
        },
        (tl, sec) => { // 1 · la dada
          const grups = Array.from($('.figures', sec).children), actiu = ESCENES.ganxo.actiu;
          // ~1,7 s: titular, les tres figures en gris i, després, una es torna verda alhora que surt la xifra
          tl.to($('.eslogan', sec), { autoAlpha: 0, y: -30, duration: 0.4, ease: 'power2.in' })
            .set($('.dades', sec), { autoAlpha: 1 });
          lineesTitular(sec, tl, '>-0.05');
          tl.from(grups, { autoAlpha: 0, y: 30, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '<0.2')
            .fromTo(actiu, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power1.inOut' }, '>-0.1')
            .from([$('.xifra', sec), $('.lectura', sec)], { autoAlpha: 0, y: 24, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '<')
            .from($('.peu', sec), { autoAlpha: 0, duration: 0.4 }, '<');
        }
      ]
    },

    territori: {
      munta(sec) { mapaSVG($('.mapa', sec)); },
      passos: [
        (tl, sec) => { // 0 · contorn, 39 municipis i capital
          const camí = $('.comarca', sec), munis = $$('.muni', sec);
          tl.set($$('.lloc[data-pas], .pt:not([data-punt="granollers"]), .km372', sec), { autoAlpha: 0 });
          lineesTitular(sec, tl, 0);
          tl.fromTo(camí, { drawSVG: '0%', fillOpacity: 0 }, { drawSVG: '100%', duration: 1.2, ease: 'power1.inOut' }, 0.2)
            .to(camí, { fillOpacity: 1, duration: 0.4 }, '>-0.2')
            .fromTo(munis, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.35, ease: 'back.out(2.5)', stagger: { each: 0.02, from: 'random' } }, 0.9);
          comptador($('[data-compta="territori.municipis"]', sec), tl, 0.9, 0.35 + 0.02 * 38);
          tl.from([$('.pt[data-punt="granollers"]', sec), $('.lloc[data-punt="granollers"]', sec)], { autoAlpha: 0, duration: 0.4 }, '>-0.2');
        },
        ...['1', '2', '3', '4'].map(n => (tl, sec) => { // 1–4 · Montseny, Montnegre, Gallecs, Caldes
          const l = $(`.lloc[data-pas="${n}"]`, sec), g = $(`.pt[data-punt="${l.dataset.punt}"]`, sec);
          tl.set(g, { autoAlpha: 1 })
            .from($('.halo', g), { scale: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'power2.out' })
            .from($('.punt', g), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(2.2)' }, '<')
            .to(l, { autoAlpha: 1, duration: 0.5 }, '<0.15')
            .from(l, { x: l.classList.contains('esq') ? 24 : -24, duration: 0.5, ease: 'power2.out' }, '<');
        }),
        (tl, sec) => { // 5 · xarxa projectada
          const b = $('.km372', sec);
          tl.to(b, { autoAlpha: 1, duration: 0.4 }).from(b, { y: 24, duration: 0.5, ease: 'power2.out' }, '<');
          comptador($('[data-compta="territori.xarxa_projectada_km"]', sec), tl, '<', 1.0);
        }
      ]
    }
  };

  /* ---------- Motor de passos ---------- */
  const estats = new WeakMap();
  function escena(sec) {
    let e = estats.get(sec);
    if (!e) { const def = ESCENES[sec.dataset.escena] || { passos: [] }; e = { def, tl: null, anim: null }; estats.set(sec, e); def.munta && def.munta(sec); }
    return e;
  }
  function linia(sec) {
    const e = escena(sec);
    if (!e.tl) {
      const tl = gsap.timeline({ paused: true });
      e.def.passos.forEach((f, i) => { tl.addLabel('p' + i); f(tl, sec); tl.addLabel('f' + i); });
      e.tl = tl;
    }
    return e.tl;
  }
  function mostra(sec, n, animat) {
    const e = escena(sec), ult = e.def.passos.length - 1; if (ult < 0) return;
    const tl = linia(sec); n = Math.max(0, Math.min(n, ult));
    if (e.anim) { e.anim.kill(); e.anim = null; }
    // Sense suprimir esdeveniments: els comptadors escriuen el text amb onUpdate i han d'arribar al valor final.
    if (animat && potAnimar()) { tl.seek('p' + n, false); e.anim = tl.tweenFromTo('p' + n, 'f' + n); }
    else tl.seek('f' + n, false);
  }
  const pasActual = () => { const f = Reveal.getIndices().f; return (typeof f === 'number' ? f : -1) + 1; };
  const diapo = sec => +(sec && sec.dataset.diapo || 0);
  let hAnterior = -1;
  function entra(sec, endavant) {
    const n = pasActual(), e = escena(sec);
    mostra(sec, n, endavant && n === 0);
    e.def.entra && e.def.entra(sec);
    Sender.ves(diapo(sec), endavant !== null);
    hAnterior = Reveal.getIndices().h;
  }
  function surt(sec) { if (!sec) return; const e = escena(sec); if (e.anim) { e.anim.progress(1).kill(); e.anim = null; } e.def.surt && e.def.surt(sec); }

  /* ---------- Tecles ---------- */
  let avisT = null;
  function avis(text) {
    let a = $('.avis'); if (!a) { a = document.createElement('div'); a.className = 'avis'; a.setAttribute('role', 'status'); document.body.append(a); }
    a.textContent = text; a.classList.add('visible'); clearTimeout(avisT); avisT = setTimeout(() => a.classList.remove('visible'), 1400);
  }
  function canviaTema() {
    if (html.dataset.tema === 'fosc') delete html.dataset.tema; else html.dataset.tema = 'fosc';
    desa('valia-tema', html.dataset.tema || 'clar'); avis(html.dataset.tema ? 'Mode fosc' : 'Mode clar');
  }
  function canviaAnimacions() {
    animacions = !animacions; desa('valia-animacions', animacions ? 'si' : 'no');
    html.classList.toggle('sense-animacions', !animacions);
    Reveal.configure({ transition: animacions ? 'fade' : 'none' });
    const s = Reveal.getCurrentSlide(); surt(s); mostra(s, pasActual(), false); escena(s).def.entra && escena(s).def.entra(s); Sender.ves(diapo(s), false);
    avis(animacions ? 'Animacions activades' : 'Animacions desactivades');
  }

  /* ---------- Arrencada ---------- */
  prepara();
  const arrenca = () => {
    Reveal.initialize({
      width: 1920, height: 1080, margin: 0, minScale: 0.05, maxScale: 4,
      center: false, hash: true, controls: false, progress: false, slideNumber: false,
      transition: animacions ? 'fade' : 'none', transitionSpeed: 'fast', backgroundTransition: 'none',
      pdfSeparateFragments: false, pdfMaxPagesPerSlide: 1,
      keyboard: { 68: canviaTema, 65: canviaAnimacions },
      plugins: [window.RevealNotes].filter(Boolean)
    });
    Reveal.on('ready', ev => {
      $('.reveal .slides').append(Sender.el);
      if (esImpressio) { $$('.reveal .slides > section').forEach(s => { const e = escena(s); mostra(s, e.def.passos.length - 1, false); }); return; }
      entra(ev.currentSlide, true);
    });
    Reveal.on('slidechanged', ev => { const endavant = ev.indexh > hAnterior; surt(ev.previousSlide); entra(ev.currentSlide, endavant); });
    Reveal.on('fragmentshown', () => mostra(Reveal.getCurrentSlide(), pasActual(), true));
    Reveal.on('fragmenthidden', () => mostra(Reveal.getCurrentSlide(), pasActual(), false));
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(arrenca, arrenca);
})();
