/* Fitxer generat per eines/construeix.mjs a partir de referencia/pwa/app.js (prototip Valia, seccions rig.js, anim.js i mascot.js). No l'editeu a mà. */
/* ---- rig.js ---- */
/* Valia · logotip articulat + animació de càrrega (SVG + requestAnimationFrame)
   Unitats: u = unitat de la figura. Coordenades del món en u, eix y cap amunt, origen a terra sota el maluc inicial.
   Tot el moviment es fa amb transform i opacity. */
(function (root) {
  'use strict';
  function make(o) {
    o = o || {};
    var D2R = Math.PI / 180, R2D = 180 / Math.PI;

    /* ---------- cos i marxa ---------- */
    var C = {
      T: 1.05,            // s per cicle (2 passos) → 114 passos/min
      S: 39,              // gambada (2 passos) en u
      BETA: 0.62,         // fracció de recolzament
      AF: 0.235,          // peu davanter en tocar terra: +0,27·S davant del maluc
      L1: 12.5, L2: 12.5, // cuixa, tíbia
      LF: 5.5, RC: 3.7,   // peu (taló→punta) i radi de la bota
      H_LOW: 26.7, BOB: 1.3, // alçada del maluc al doble recolzament i oscil·lació (≈2,5 px)
      GHS: 14, GTO: -55,  // inclinació del peu en tocar (taló) i en enlairar-se (punta), graus
      PF0: 0.12, PF1: 0.45, CLEAR: 2.0,
      LU: 9.5, LFA: 9.0,  // braç i avantbraç
      SHN: [2.6, 18.6],   // espatlla propera (x endavant, y amunt des del maluc, al marc del tronc)
      SHF: [-0.6, 18.6],
      DS: 21, GS: 40, LS: 46, RH: 14, STK: 0.55, // bastó: on es planta, on l'agafa la mà, llarg, fase en què s'aixeca
      CF: 0.6,            // els peus veuen el 60 % de la curvatura (diferència < 0,6 px; evita que el maluc baixi massa)
      N_REV: o.N_REV || 9 // una volta del globus = N cicles exactes → bucle perfecte
    };
    C.V = C.S / C.T;                       // u/s
    C.R = C.N_REV * C.S / (2 * Math.PI);   // radi del globus en u (≈66,5 u)

    /* ---------- calendari ---------- */
    /* Logotip: figura dins la fulla (caixa de 120 u de fulla). f = escala figura→fulla; HX, GY = maluc i terra inicials; CX, CY = centre de la fulla */
    var LOGO = { f: 0.9, HX: 46, GY: 92, CX: 60.6, CY: 57.65 };
    var TL = { t0: 1.2, tGlobe: 2.4, tPop: 0.45, tStop: 2.6, travel: (LOGO.CX - LOGO.HX) / LOGO.f };

    function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
    function sstep(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
    function s5(x) { x = clamp(x, 0, 1); return x * x * x * (x * (x * 6 - 15) + 10); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function easeOutBack(x, c1) { var c3 = c1 + 1, y = x - 1; return 1 + c3 * y * y * y + c1 * y * y; }
    function easeOutCubic(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); }

    /* Integració numèrica del calendari: velocitat relativa al terra (w), velocitat a pantalla (u), fase, terra recorregut (G), posició (X), escala i gir del globus */
    var DT = 1 / 1000, TMAX = 4.5, N = Math.round(TMAX / DT) + 1;
    var A = { w: new Float64Array(N), u: new Float64Array(N), ph: new Float64Array(N), G: new Float64Array(N), X: new Float64Array(N), s: new Float64Array(N), th: new Float64Array(N) };
    function wAt(t) { return C.V * sstep((t - TL.t0) / 1.05); }
    function globeScale(t) { if (t < TL.tGlobe) return 0; var x = (t - TL.tGlobe) / TL.tPop; return x >= 1 ? 1 : easeOutBack(x, 1.5); }
    function solveTimeline(td0) {
      var X = 0, G = 0, ph = 0, th = 0;
      for (var i = 0; i < N; i++) {
        var t = i * DT, w = wAt(t), m = 1 - sstep((t - td0) / (TL.tStop - td0)), u = w * m, s = globeScale(t);
        A.w[i] = w; A.u[i] = u; A.ph[i] = ph; A.G[i] = G; A.X[i] = X; A.s[i] = s; A.th[i] = th;
        X += u * DT; G += w * DT; ph += w / C.S * DT;
        if (t >= TL.tGlobe) th -= w / (C.R * Math.max(s, 0.35)) * DT; // sense lliscament: ω = w / (R·s)
      }
      return X;
    }
    // tria el moment en què comença a frenar perquè recorri exactament TL.travel u (≈26 px)
    var lo = TL.t0 + 0.05, hi = TL.tStop - 0.05;
    for (var k = 0; k < 40; k++) { var mid = (lo + hi) / 2; if (solveTimeline(mid) > TL.travel) hi = mid; else lo = mid; }
    TL.td0 = (lo + hi) / 2; solveTimeline(TL.td0);
    var END = { t: (N - 1) * DT, ph: A.ph[N - 1], G: A.G[N - 1], X: A.X[N - 1], th: A.th[N - 1] };

    function sample(arr, t) { var f = t / DT, i = Math.floor(f); if (i >= N - 1) return arr[N - 1]; if (i < 0) return arr[0]; var a = f - i; return arr[i] * (1 - a) + arr[i + 1] * a; }
    function state(t) {
      if (t <= END.t) return { w: sample(A.w, t), u: sample(A.u, t), ph: sample(A.ph, t), G: sample(A.G, t), X: sample(A.X, t), s: globeScale(t), th: sample(A.th, t) };
      var dt = t - END.t; // règim estable: caminar sobre el globus a velocitat constant
      return { w: C.V, u: 0, ph: END.ph + dt / C.T, G: END.G + C.V * dt, X: END.X, s: 1, th: END.th - C.V * dt / C.R };
    }
    // terra recorregut en funció de la fase (per planificar les petjades)
    function GofPh(ph) {
      if (ph <= 0) return ph * C.S;
      if (ph >= END.ph) return END.G + (ph - END.ph) * C.S;
      var a = 0, b = N - 1; while (b - a > 1) { var m = (a + b) >> 1; if (A.ph[m] < ph) a = m; else b = m; }
      var f = (ph - A.ph[a]) / ((A.ph[b] - A.ph[a]) || 1); return A.G[a] + (A.G[b] - A.G[a]) * f;
    }
    function curv(t) { return o.flat ? 0 : sstep((t - TL.tGlobe) / 0.35); }

    /* Terra: un punt del terra a distància d (u, mesurada sobre la superfície) del maluc → posició al món, tangent i normal */
    function groundFrame(d, X, c) {
      var a = c * d / C.R;
      return { x: X + (1 - c) * d + c * C.R * Math.sin(d / C.R), y: -c * C.R * (1 - Math.cos(d / C.R)), tx: Math.cos(a), ty: -Math.sin(a), nx: Math.sin(a), ny: Math.cos(a) };
    }
    function gp(F, a, b) { return [F.x + a * F.tx + b * F.nx, F.y + a * F.ty + b * F.ny]; } // a: al llarg del terra, b: cap amunt

    /* Peu: retorna turmell (A) i inclinació absoluta del peu (graus, + = punta amunt) */
    function footAt(ph, off, st, c) {
      var p = ph - off, n = Math.floor(p), q = p - n; c *= C.CF;
      var gTd = GofPh(n + off) + C.AF * C.S;           // on toca el taló en aquest pas
      var d = gTd - st.G;                               // distància taló–maluc sobre el terra
      var gam, Ap, Fr;
      if (q < C.BETA) {
        if (q < C.PF1) {                                  // taló com a pivot i després peu pla
          gam = q < C.PF0 ? C.GHS * (1 - s5(q / C.PF0)) : 0;
          Fr = groundFrame(d, st.X, c); Ap = gp(Fr, 0, C.RC);
        } else {                                          // punta com a pivot: el taló s'aixeca
          gam = C.GTO * s5((q - C.PF1) / (C.BETA - C.PF1));
          var g = gam * D2R; Fr = groundFrame(d + C.LF, st.X, c);
          Ap = gp(Fr, -C.LF * Math.cos(g), C.RC - C.LF * Math.sin(g));
        }
        return { A: Ap, g: gam + Math.atan2(Fr.ty, Fr.tx) * R2D, contact: true };
      }
      // vol: del punt d'enlairament al següent contacte de taló
      var u = (q - C.BETA) / (1 - C.BETA);
      var gLo = gTd;                                     // el peu s'enlaira des de la seva pròpia petjada
      var gNext = GofPh(n + 1 + off) + C.AF * C.S;
      var dLo = gLo - st.G + C.LF, dTd = gNext - st.G;   // punta a l'enlairar, taló a l'arribar
      var e = s5(u), e2 = u * u * (3 - 2 * u) + 0.5 * u * (1 - u) * (1 - u); // surt amb una mica de velocitat cap endavant
      var gam2 = lerp(C.GTO, C.GHS, s5(clamp((u - 0.05) / 0.9, 0, 1)));
      var gr = gam2 * D2R;
      // turmell interpolat sobre el terra: a l'inici, turmell = punta − LF·dir; al final, turmell sobre el taló
      var aLo = dLo - C.LF * Math.cos(C.GTO * D2R), hLo = C.RC - C.LF * Math.sin(C.GTO * D2R);
      var dd = lerp(aLo, dTd, e2), hh = lerp(hLo, C.RC, e) + C.CLEAR * Math.pow(Math.sin(Math.PI * u), 1.3);
      var Fs = groundFrame(dd, st.X, c);
      return { A: gp(Fs, 0, hh), g: gam2 + Math.atan2(Fs.ty, Fs.tx) * R2D, contact: false };
    }

    /* IK de dues barres al pla: maluc H → turmell P; el genoll apunta endavant (+x) */
    function ik2(H, P, l1, l2) {
      var dx = P[0] - H[0], dy = P[1] - H[1], D = Math.hypot(dx, dy), Dc = Math.min(D, (l1 + l2) * 0.9995);
      var base = Math.atan2(dy, dx);
      var cosA = clamp((l1 * l1 + Dc * Dc - l2 * l2) / (2 * l1 * Dc), -1, 1), a = Math.acos(cosA);
      var th1 = base + a;                       // genoll endavant (en y amunt, girar cap a +x des de baix)
      var K = [H[0] + l1 * Math.cos(th1), H[1] + l1 * Math.sin(th1)];
      var Pe = [H[0] + Dc * Math.cos(base), H[1] + Dc * Math.sin(base)];
      return { K: K, P: Pe, slip: D - Dc };
    }
    function ikArm(S, P, l1, l2) { // colze cap enrere i avall
      var dx = P[0] - S[0], dy = P[1] - S[1], D = Math.hypot(dx, dy), Dc = Math.min(D, (l1 + l2) * 0.999);
      var base = Math.atan2(dy, dx), cosA = clamp((l1 * l1 + Dc * Dc - l2 * l2) / (2 * l1 * Dc), -1, 1), a = Math.acos(cosA);
      var th1 = base - a;
      return { E: [S[0] + l1 * Math.cos(th1), S[1] + l1 * Math.sin(th1)], P: [S[0] + Dc * Math.cos(base), S[1] + Dc * Math.sin(base)] };
    }

    /* Bastó: punta clavada al terra (fase 0 → STK) i vol fins al següent clavat */
    function stickTip(ph, st, c) {
      var n = Math.floor(ph), q = ph - n;
      var g0 = GofPh(n) + C.DS;
      if (q < C.STK) { var F = groundFrame(g0 - st.G, st.X, c); return { T: [F.x, F.y], planted: true }; }
      var u = (q - C.STK) / (1 - C.STK), g1 = GofPh(n + 1) + C.DS;
      var d = lerp(g0, g1, s5(u)) - st.G, F2 = groundFrame(d, st.X, c);
      return { T: gp(F2, 0, 4.2 * Math.pow(Math.sin(Math.PI * u), 1.2)), planted: false };
    }

    function circleX(P0, r0, P1, r1) {
      var dx = P1[0] - P0[0], dy = P1[1] - P0[1], d = Math.hypot(dx, dy);
      if (d > r0 + r1 || d < Math.abs(r0 - r1)) return [P0[0] + r0 * dx / d, P0[1] + r0 * dy / d];
      var a = (r0 * r0 - r1 * r1 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r0 * r0 - a * a));
      var mx = P0[0] + a * dx / d, my = P0[1] + a * dy / d;
      var c1 = [mx + h * dy / d, my - h * dx / d], c2 = [mx - h * dy / d, my + h * dx / d];
      return c1[0] > c2[0] ? c1 : c2;
    }

    function softMin(a, b, k) { var h = clamp(0.5 + 0.5 * (b - a) / k, 0, 1); return lerp(b, a, h) - k * h * (1 - h); }

    /* Postura completa en el temps t */
    function pose(t) {
      var st = state(t), ph = st.ph, c = curv(t);
      var walk = sstep((t - TL.t0) / 0.6);
      var lean = lerp(3, 5, walk) * D2R;                     // inclinació endavant 3° → 5°
      var hy = C.H_LOW + C.BOB * Math.pow(Math.sin(2 * Math.PI * ph), 2); // més baix al doble recolzament, més alt a mig pas
      var fF = footAt(ph, 0, st, c), fN = footAt(ph, 0.5, st, c);
      // el maluc no pot pujar més del que permet la cama de recolzament estirada (sobre el globus els peus queden més avall)
      var Lr = (C.L1 + C.L2) * 0.992;
      [fF, fN].forEach(function (f) { if (!f.contact) return; var dx = f.A[0] - st.X; if (Math.abs(dx) < Lr) hy = softMin(hy, f.A[1] + Math.sqrt(Lr * Lr - dx * dx), 0.35); });
      var H = [st.X, hy];
      var lF = ik2(H, fF.A, C.L1, C.L2), lN = ik2(H, fN.A, C.L1, C.L2);
      function tor(p) { return [H[0] + p[0] * Math.cos(lean) + p[1] * Math.sin(lean), H[1] - p[0] * Math.sin(lean) + p[1] * Math.cos(lean)]; }
      var SN = tor(C.SHN), SF = tor(C.SHF);
      var tip = stickTip(ph, st, c);
      // la mà propera és on el bastó (agafat a GS de la punta) queda a RH de l'espatlla: intersecció de dos cercles, la de davant
      var hand = circleX(tip.T, C.GS, SN, C.RH);
      var armN = ikArm(SN, hand, C.LU, C.LFA);
      var sdx = armN.P[0] - tip.T[0], sdy = armN.P[1] - tip.T[1], sl = Math.hypot(sdx, sdy);
      var top = [tip.T[0] + C.LS * sdx / sl, tip.T[1] + C.LS * sdy / sl];
      var aF = (10 - 22 * Math.cos(2 * Math.PI * ph)) * D2R, eF = aF + 35 * D2R;
      var handF = [SF[0] + C.LU * Math.sin(aF) + C.LFA * Math.sin(eF), SF[1] - C.LU * Math.cos(aF) - C.LFA * Math.cos(eF)];
      var armF = ikArm(SF, handF, C.LU, C.LFA);
      return { st: st, c: c, H: H, lean: lean, lF: lF, lN: lN, fF: fF, fN: fN, SN: SN, SF: SF, armN: armN, armF: armF, tip: tip.T, top: top, planted: tip.planted };
    }

    return { C: C, TL: TL, LOGO: LOGO, pose: pose, state: state, GofPh: GofPh, groundFrame: groundFrame, curv: curv, globeScale: globeScale, sstep: sstep, s5: s5, easeOutCubic: easeOutCubic, easeOutBack: easeOutBack, clamp: clamp, lerp: lerp };
  }
  root.ValiaRig = make({ N_REV: 9 });
  root.ValiaRig.make = make;
})(typeof window !== 'undefined' ? window : globalThis);

/* ---- anim.js ---- */
/* Valia · construcció del logotip (SVG) i de l'escena de càrrega. Depèn de ValiaRig. */
(function (root) {
  'use strict';
  var V = root.ValiaRig, C = V.C, LOGO = V.LOGO, D2R = Math.PI / 180, R2D = 180 / Math.PI; // rig per defecte (postura estàtica del logotip)
  var NS = 'http://www.w3.org/2000/svg';

  /* ---------- fulla (caixa de 120 u, girada 22° en sentit horari sobre 62,59) ---------- */
  var LEAF = {
    rot: 'rotate(22 62 59)',
    blade: 'M62 109C109 91 101 33 62 6C23 33 15 91 62 109Z',
    rib: 'M62 104C60.6 80 60.8 42 62 13',
    stem: 'M62 107C62.6 113 62 117 60.4 121'
  };

  /* ---------- figura: dimensions en u ---------- */
  var W = { thigh: 8, shin: 7.4, foot: 7.4, uarm: 6, farm: 5.6, stick: 3.2 };
  function line(L, w, col, up) { return '<line x1="0" y1="0" x2="0" y2="' + (up ? -L : L) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>'; }
  /* marcatge de la figura articulada; cada part és un grup separat (data-p) que es mou només amb transform */
  function figureMarkup(col) {
    var leg = function (s) {
      return '<g data-p="thigh' + s + '">' + line(C.L1, W.thigh, col) +
        '<g data-p="shin' + s + '" transform="translate(0 ' + C.L1 + ')">' + line(C.L2, W.shin, col) +
        '<g data-p="foot' + s + '" transform="translate(0 ' + C.L2 + ')">' + line(C.LF, W.foot, col) + '</g></g></g>';
    };
    var arm = function (s, w1, w2) {
      return '<g data-p="uarm' + s + '">' + line(C.LU, w1, col) +
        '<g data-p="farm' + s + '" transform="translate(0 ' + C.LU + ')">' + line(C.LFA, w2, col) + '</g></g>';
    };
    return '<g data-p="armFgrp">' + arm('F', W.uarm, W.farm) + '</g>' + leg('F') +
      '<g data-p="torso"><rect x="-6.5" y="-22" width="13" height="23.5" rx="6.5" fill="' + col + '"/>' +
      '<g data-p="pack"><rect x="-13.2" y="-20.6" width="9.6" height="14.4" rx="3.6" fill="' + col + '"/></g>' +
      '<g data-p="head"><circle cx="1.8" cy="-30.6" r="6.2" fill="' + col + '"/></g></g>' +
      leg('N') + '<g data-p="stick">' + line(C.LS, W.stick, col) + '</g>' + arm('N', W.uarm, W.farm);
  }
  function angSvg(P, Q) { return Math.atan2(Q[0] - P[0], -(Q[1] - P[1])) * R2D; } // angle des de "avall" cap a +x
  function tf(x, y, a) { return 'translate(' + x.toFixed(3) + ' ' + y.toFixed(3) + ') rotate(' + (-a).toFixed(3) + ')'; }
  function footDir(g) { return Math.atan2(Math.cos(g * D2R), Math.sin(g * D2R)) * R2D; } // vector (cos g, sin g) amb y amunt
  /* transformacions de cada part per a una postura (coordenades de la figura: x endavant, y amunt → SVG: (x, -y)) */
  function poseTransforms(p) {
    var o = {};
    function legT(s, L, f) {
      var a1 = angSvg(p.H, L.K), a2 = angSvg(L.K, L.P), a3 = footDir(f.g);
      o['thigh' + s] = tf(p.H[0], -p.H[1], a1);
      o['shin' + s] = 'translate(0 ' + C.L1 + ') rotate(' + (-(a2 - a1)).toFixed(3) + ')';
      o['foot' + s] = 'translate(0 ' + C.L2 + ') rotate(' + (-(a3 - a2)).toFixed(3) + ')';
    }
    legT('F', p.lF, p.fF); legT('N', p.lN, p.fN);
    o.torso = 'translate(' + p.H[0].toFixed(3) + ' ' + (-p.H[1]).toFixed(3) + ') rotate(' + (p.lean * R2D).toFixed(3) + ')';
    function armT(s, SH, A) { var a1 = angSvg(SH, A.E), a2 = angSvg(A.E, A.P); o['uarm' + s] = tf(SH[0], -SH[1], a1); o['farm' + s] = 'translate(0 ' + C.LU + ') rotate(' + (-(a2 - a1)).toFixed(3) + ')'; }
    armT('N', p.SN, p.armN); armT('F', p.SF, p.armF);
    o.stick = tf(p.tip[0], -p.tip[1], angSvg(p.tip, p.top));
    return o;
  }
  function bake(markup, tr) { // insereix les transformacions dins del marcatge (per al logotip estàtic)
    return markup.replace(/<g data-p="(\w+)"( transform="[^"]*")?/g, function (m, k) { return tr[k] ? '<g data-p="' + k + '" transform="' + tr[k] + '"' : m; });
  }

  /* ---------- logotip estàtic ----------
     variant: 'color' (fulla + persona blanca), 'mono' (fulla blanca, persona en negatiu), 'icon' (icona d'app), 'iconDark'
     leaf: color de la fulla; small: versió per a mides petites (≤32 px), figura més gran i traços més gruixuts */
  var _id = 0;
  function figBox(small) { return small ? { f: 1.02, HX: 44.5, GY: 96 } : { f: LOGO.f, HX: LOGO.HX, GY: LOGO.GY }; }
  function staticFigure(col, small) {
    var b = figBox(small), tr = poseTransforms(V.pose(0)), m = figureMarkup(col);
    if (small) m = m.replace(/stroke-width="([\d.]+)"/g, function (s, w) { return 'stroke-width="' + (+w * 1.14).toFixed(2) + '"'; });
    return '<g transform="translate(' + b.HX + ' ' + b.GY + ') scale(' + b.f + ')">' + bake(m, tr) + '</g>';
  }
  function logoSVG(opt) {
    opt = opt || {}; var v = opt.variant || 'color', size = opt.size || 64, leaf = opt.leaf || '#00A86B', id = 'vl' + (++_id), small = !!opt.small;
    var vb = '0 4 120 120', fig, body;
    if (v === 'color') {
      body = '<g transform="' + LEAF.rot + '"><path d="' + LEAF.stem + '" fill="none" stroke="' + leaf + '" stroke-width="' + (small ? 5.5 : 4.2) + '" stroke-linecap="round"/><path d="' + LEAF.blade + '" fill="' + leaf + '"/>' +
        (small ? '' : '<path d="' + LEAF.rib + '" fill="none" stroke="' + (opt.figure || '#FFFFFF') + '" stroke-opacity=".32" stroke-width="2" stroke-linecap="round"/>') + '</g>' + staticFigure(opt.figure || '#FFFFFF', small);
    } else {
      var fg = opt.fg || '#FFFFFF';
      var mask = '<mask id="' + id + '" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="130"><rect x="0" y="0" width="120" height="130" fill="#fff"/>' +
        (small ? '' : '<path transform="' + LEAF.rot + '" d="' + LEAF.rib + '" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/>') + staticFigure('#000', small) + '</mask>';
      var leafG = '<g mask="url(#' + id + ')"><g transform="' + LEAF.rot + '"><path d="' + LEAF.stem + '" fill="none" stroke="' + fg + '" stroke-width="' + (small ? 5.5 : 4.2) + '" stroke-linecap="round"/><path d="' + LEAF.blade + '" fill="' + fg + '"/></g></g>';
      if (v === 'mono') body = '<defs>' + mask + '</defs>' + leafG;
      else { // icona d'app: fons sòlid i fulla dins de la zona segura (cercle del 62 %)
        var bg = v === 'iconDark' ? '#0B0D0C' : '#00A86B';
        vb = '0 0 120 120';
        if (v === 'iconDark') {
          body = '<rect width="120" height="120" rx="27" fill="' + bg + '"/><g transform="translate(60 60) scale(.64) translate(-60.6 -63)"><g transform="' + LEAF.rot + '"><path d="' + LEAF.stem + '" fill="none" stroke="#00A86B" stroke-width="5" stroke-linecap="round"/><path d="' + LEAF.blade + '" fill="#00A86B"/></g>' + staticFigure('#FFFFFF', true) + '</g>';
        } else {
          body = '<defs>' + mask + '</defs><rect width="120" height="120" rx="27" fill="' + bg + '"/><g transform="translate(60 60) scale(.64) translate(-60.6 -63)">' + leafG + '</g>';
        }
      }
    }
    return '<svg xmlns="' + NS + '" viewBox="' + vb + '" width="' + size + '" height="' + size + '" role="img" aria-label="' + (opt.label || 'Valia') + '">' + body + '</svg>';
  }

  /* ---------- escena de càrrega (390×844), configurable ----------
     cfg: rig (instància de ValiaRig.make), K (px per u de la figura), OY (centre del logotip), name, font, size, weight, ls,
          nameGap (de la base del globus a la línia base del nom), tagline, tagGap */
  var MINT = '#D3F4E4', DK = '#0A6B44', RP0 = 95; // el globus es dibuixa amb radi de referència RP0 i s'escala
  /* fites del Vallès Oriental, dibuixades amb la base a (0,0) i cap amunt */
  var LANDMARKS = [
    { k: 'termes', n: 'Termes romanes de Caldes', svg: '<path d="M-23 0V-16H23V0Z" fill="' + MINT + '"/><rect x="-25" y="-19.5" width="50" height="3.5" rx="1.2" fill="' + MINT + '"/>' +
      [-14, 0, 14].map(function (x) { return '<path d="M' + (x - 4.6) + ' 0V-7.6A4.6 4.6 0 0 1 ' + (x + 4.6) + ' -7.6V0Z" fill="' + DK + '"/>'; }).join('') +
      '<g fill="none" stroke="#FFFFFF" stroke-opacity=".75" stroke-width="1.6" stroke-linecap="round"><path d="M-9 -23q-3-3.5 0-7t0-7"/><path d="M0 -23q-3-3.5 0-7t0-7"/><path d="M9 -23q-3-3.5 0-7t0-7"/></g>' },
    { k: 'montseny', n: 'Montseny · Turó de l\'Home', svg: '<path d="M-30 0L-12 -27L-6 -22L4 -34L30 0Z" fill="' + MINT + '"/><path d="M4 -34L-1 -27.5L3 -26L7 -29.5Z" fill="#FFFFFF"/><rect x="1.4" y="-41" width="5.2" height="5" rx="1" fill="' + MINT + '"/><path d="M4 -41V-50M1.8 -46.5H6.2" stroke="' + MINT + '" stroke-width="1.6" stroke-linecap="round"/>' },
    { k: 'fai', n: 'Sant Miquel del Fai', svg: '<path d="M-26 0V-25Q-26 -32 -18 -32H16Q24 -32 24 -25V0Z" fill="' + MINT + '"/><path d="M5 -32C3 -22 7 -11 5 0" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" fill="none"/><path d="M9 -30C8 -20 10 -10 9 0" stroke="#FFFFFF" stroke-opacity=".6" stroke-width="1.6" fill="none"/><path d="M-21 0V-9L-14.5 -14.5L-8 -9V0Z" fill="' + DK + '"/><path d="M-15.8 -14.5V-19.5H-13.2V-14.5" fill="' + DK + '"/>' },
    { k: 'porxada', n: 'La Porxada de Granollers', svg: '<path d="M-27 -15L-20 -22H20L27 -15Z" fill="' + MINT + '"/><rect x="-26" y="-15.5" width="52" height="2.6" fill="' + MINT + '"/>' +
      [0, 1, 2, 3, 4, 5].map(function (i) { return '<rect x="' + (-22.6 + i * 8.6).toFixed(1) + '" y="-13" width="2.4" height="12" fill="' + MINT + '"/>'; }).join('') + '<rect x="-27" y="-1.6" width="54" height="1.6" fill="' + MINT + '"/>' },
    { k: 'campanar', n: 'Campanar romànic', svg: '<rect x="-7.5" y="-37" width="15" height="37" fill="' + MINT + '"/><path d="M-9 -37L0 -46L9 -37Z" fill="' + MINT + '"/>' +
      [-31, -21].map(function (y) { return '<path d="M-5 ' + y + 'v-4.2a1.7 1.7 0 0 1 3.4 0v4.2zM1.6 ' + y + 'v-4.2a1.7 1.7 0 0 1 3.4 0v4.2z" fill="' + DK + '"/>'; }).join('') + '<path d="M-7.5 -26.5H7.5M-7.5 -16.5H7.5" stroke="' + DK + '" stroke-opacity=".35" stroke-width="1"/>' },
    { k: 'fageda', n: 'La fageda del Montseny', svg: '<g fill="' + MINT + '"><rect x="-14.2" y="-14" width="2.6" height="14"/><circle cx="-12.9" cy="-19" r="8"/><rect x="-1.3" y="-19" width="2.8" height="19"/><circle cx="0" cy="-26" r="10.5"/><rect x="11" y="-11" width="2.4" height="11"/><circle cx="12.2" cy="-15.5" r="6.8"/></g><g fill="' + DK + '" fill-opacity=".18"><circle cx="-10.5" cy="-17" r="4"/><circle cx="3.5" cy="-23" r="5"/></g>' },
    { k: 'gallecs', n: 'Espai rural de Gallecs', svg: '<path d="M-15 0V-12L-5 -20L5 -12V0Z" fill="' + MINT + '"/><path d="M5 0V-9H16V0Z" fill="' + MINT + '"/><rect x="-7" y="-7" width="4" height="7" fill="' + DK + '"/><rect x="-11" y="-13" width="3" height="3" fill="' + DK + '"/><rect x="-2" y="-13" width="3" height="3" fill="' + DK + '"/>' +
      '<g stroke="' + MINT + '" stroke-width="1.4" stroke-linecap="round"><path d="M-27 0V-6M-24 0V-8M-21 0V-6"/><path d="M20 0V-7M23 0V-9M26 0V-6"/></g>' }
  ];
  var LM_A0 = 64; // angle inicial de la primera fita (graus des de dalt, en sentit horari): arriba per la dreta

  function geom(cfg) {
    var R = cfg.rig || V, K = cfg.K || 1.7, KB = K / LOGO.f, OX = cfg.OX || 195, OY = cfg.OY || 270;
    var GROUND = OY + (LOGO.GY - LOGO.CY) * KB, X0 = OX + (LOGO.HX - LOGO.CX) * KB, RP = R.C.R * K;
    var WM_Y = GROUND + 2 * RP + (cfg.nameGap || 100);
    return { R: R, K: K, KB: KB, OX: OX, OY: OY, GROUND: GROUND, X0: X0, RP: RP, gsc: RP / RP0, WM_Y: WM_Y, TG_Y: WM_Y + (cfg.tagGap || 32) };
  }
  function sceneMarkup(g, cfg) {
    var trees = '', i, a;
    var treeAng = [20, 41, 92, 113, 146, 165, 196, 219, 247, 271, 302, 324, 352];
    for (i = 0; i < treeAng.length; i++) {
      a = treeAng[i]; var h = 6 + (i * 7) % 5;
      trees += '<g transform="rotate(' + a + ') translate(0 ' + (-RP0) + ')"><rect x="-.8" y="' + (-h) + '" width="1.6" height="' + h + '" fill="' + DK + '"/><circle cx="0" cy="' + (-h - 2.6) + '" r="' + (3.2 + (i % 3) * .6) + '" fill="' + DK + '"/></g>';
    }
    var lms = LANDMARKS.map(function (L, j) { return '<g data-lm="' + L.k + '" transform="rotate(' + (LM_A0 + j * 360 / LANDMARKS.length).toFixed(2) + ') translate(0 ' + (-RP0 + 0.5) + ')"><title>' + L.n + '</title>' + L.svg + '</g>'; }).join('');
    var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    return '<defs>' +
      '<radialGradient id="vgG" cx="36%" cy="28%" r="78%"><stop offset="0" stop-color="#2DCB8B"/><stop offset=".55" stop-color="#00A86B"/><stop offset="1" stop-color="#06774B"/></radialGradient>' +
      '<radialGradient id="vgH"><stop offset=".78" stop-color="#D9FBEA" stop-opacity="0"/><stop offset=".83" stop-color="#D9FBEA" stop-opacity=".34"/><stop offset="1" stop-color="#D9FBEA" stop-opacity="0"/></radialGradient>' +
      '<filter id="vgB" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="2.6"/></filter>' +
      '<filter id="vgS" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="1" stdDeviation="1.1" flood-color="#00140B" flood-opacity=".38"/></filter>' +
      '</defs>' +
      '<g id="vHalo" opacity="0"><g transform="translate(' + g.OX + ' ' + (g.GROUND + g.RP).toFixed(2) + ') scale(' + g.gsc.toFixed(4) + ')"><circle r="' + (RP0 + 24) + '" fill="url(#vgH)"/></g></g>' +
      '<g id="vGlobe" transform="translate(' + g.OX + ' ' + g.GROUND + ') scale(0)">' +
      '<g id="vGlobeRot">' +
      '<circle r="' + RP0 + '" fill="url(#vgG)"/>' +
      '<g fill="#FFFFFF" fill-opacity=".07"><ellipse cx="-30" cy="-38" rx="34" ry="16" transform="rotate(-24)"/><ellipse cx="34" cy="30" rx="30" ry="14" transform="rotate(32)"/><ellipse cx="-26" cy="44" rx="22" ry="11"/></g>' +
      '<circle r="' + (RP0 - 12) + '" fill="none" stroke="#FFFFFF" stroke-opacity=".26" stroke-width="1.6" stroke-dasharray="18 9 4 9" stroke-linecap="round"/>' +
      '<path d="M-60 40C-30 20 10 52 52 26" fill="none" stroke="#FFFFFF" stroke-opacity=".18" stroke-width="1.4" stroke-dasharray="3 5" stroke-linecap="round"/>' +
      trees + lms + '</g>' +
      '<ellipse cx="0" cy="' + (-RP0 + 2.5) + '" rx="30" ry="5" fill="#00170D" fill-opacity=".42" filter="url(#vgB)"/>' +
      '</g>' +
      '<g id="vLogo">' +
      '<g id="vLeaf"><g transform="translate(' + (g.OX - LOGO.CX * g.KB).toFixed(3) + ' ' + (g.OY - LOGO.CY * g.KB).toFixed(3) + ') scale(' + g.KB.toFixed(4) + ')"><g transform="' + LEAF.rot + '">' +
      '<path d="' + LEAF.stem + '" fill="none" stroke="#00A86B" stroke-width="4.2" stroke-linecap="round"/><path d="' + LEAF.blade + '" fill="#00A86B"/><path d="' + LEAF.rib + '" fill="none" stroke="#FFFFFF" stroke-opacity=".32" stroke-width="2" stroke-linecap="round"/></g></g></g>' +
      '<g id="vFlight"><g id="vFig" filter="url(#vgS)" style="color:#FFFFFF"><g id="vFigMap">' + figureMarkup('currentColor') + '</g></g></g>' +
      '</g>' +
      '<g id="vWord" opacity="0"><text x="' + g.OX + '" y="' + g.WM_Y.toFixed(1) + '" text-anchor="middle" font-family="' + (cfg.font || 'Inter, system-ui, sans-serif') + '" font-weight="' + (cfg.weight || 700) + '" font-size="' + (cfg.size || 36) + '" letter-spacing="' + (cfg.ls == null ? -0.7 : cfg.ls) + '" fill="#FFFFFF">' + esc(cfg.name || 'Valia') + '</text>' +
      (cfg.tagline ? '<text data-tag x="' + g.OX + '" y="' + g.TG_Y.toFixed(1) + '" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-weight="500" font-size="15" fill="#FFFFFF" fill-opacity=".9">' + esc(cfg.tagline) + '</text>' : '') + '</g>';
  }

  /* fulla que vola: t de 0 a 1 entre 0,4 s i 1,8 s (desplaçaments en px a escala K = 1,7; s'escalen amb K) */
  function leafFly(u) {
    var s = V.sstep, env = s(u / 0.12);
    var dx = 292 * Math.pow(u, 1.55);
    var dy = -26 * Math.sin(Math.PI * u) * Math.pow(1 - u, 0.6) + 80 * Math.pow(u, 2.2) + 9 * Math.sin(2 * Math.PI * 2.2 * u) * u;
    var rot = env * (34 * Math.sin(2 * Math.PI * 1.45 * u + 0.35) * (0.75 + 0.35 * u) - 34 * Math.sin(0.35) * 0.75 * (1 - s(u / 0.3)) + 25 * u);
    var sx = 1 - 0.8 * Math.sin(Math.PI * s((u - 0.3) / 0.4));
    var sc = 1 - 0.2 * s(u);
    var op = 1 - s((u - 0.62) / 0.3);
    return { dx: dx, dy: dy, rot: rot, sx: sx, sc: sc, op: op };
  }

  function Scene(svg, cfg) {
    cfg = cfg || {};
    this.cfg = cfg; this.g = geom(cfg); this.R = this.g.R;
    svg.innerHTML = sceneMarkup(this.g, cfg);
    if (cfg.label) svg.setAttribute('aria-label', cfg.label);
    var q = function (s) { return svg.querySelector(s); };
    var parts = {}; Array.prototype.forEach.call(svg.querySelectorAll('#vFigMap [data-p]'), function (g) { parts[g.getAttribute('data-p')] = g; });
    this.el = { svg: svg, halo: q('#vHalo'), globe: q('#vGlobe'), rot: q('#vGlobeRot'), logo: q('#vLogo'), leaf: q('#vLeaf'), fig: q('#vFigMap'), word: q('#vWord'), parts: parts };
  }
  Scene.prototype.render = function (t, reduced) {
    var e = this.el, s = V.sstep, g = this.g, R = this.R, OX = g.OX, OY = g.OY;
    if (reduced) { // reduir animacions: logotip quiet + marca, sense moviment
      e.logo.setAttribute('opacity', 1); e.logo.removeAttribute('transform');
      e.leaf.setAttribute('opacity', 1); e.leaf.removeAttribute('transform');
      this.pose(0); e.word.setAttribute('opacity', 1); e.word.removeAttribute('transform');
      e.globe.setAttribute('transform', 'translate(' + OX + ' ' + g.GROUND + ') scale(0)'); e.halo.setAttribute('opacity', 0);
      return;
    }
    // fase 0: el logotip apareix centrat i quiet
    var a = V.easeOutCubic(t / 0.3), sc0 = 0.94 + 0.06 * a;
    e.logo.setAttribute('opacity', a.toFixed(3));
    e.logo.setAttribute('transform', 'translate(' + OX + ' ' + OY + ') scale(' + sc0.toFixed(4) + ') translate(' + (-OX) + ' ' + (-OY) + ')');
    // fase 1: la fulla vola cap a la dreta (recorregut proporcional a la mida del logotip)
    var u = V.clamp((t - 0.4) / 1.4, 0, 1), L = leafFly(u), ks = g.K / 1.7;
    e.leaf.setAttribute('opacity', L.op.toFixed(3));
    e.leaf.setAttribute('transform', 'translate(' + (OX + L.dx * Math.max(ks, 0.85)).toFixed(2) + ' ' + (OY + L.dy * ks).toFixed(2) + ') rotate(' + L.rot.toFixed(2) + ') scale(' + (L.sx * L.sc).toFixed(4) + ' ' + L.sc.toFixed(4) + ') translate(' + (-OX) + ' ' + (-OY) + ')');
    // fases 2–4: la persona camina; el globus apareix i gira
    var p = this.pose(t);
    var st = p.st, gs = st.s, gx = g.X0 + st.X * g.K;
    e.globe.setAttribute('transform', 'translate(' + gx.toFixed(2) + ' ' + (g.GROUND + g.RP * gs).toFixed(2) + ') scale(' + (gs * g.gsc).toFixed(4) + ')');
    e.rot.setAttribute('transform', 'rotate(' + (st.th * R2D).toFixed(3) + ')');
    e.halo.setAttribute('opacity', s((t - 2.5) / 0.45).toFixed(3));
    var wv = s((t - 1.2) / 0.6);
    e.word.setAttribute('opacity', wv.toFixed(3));
    e.word.setAttribute('transform', 'translate(0 ' + (8 * (1 - wv)).toFixed(2) + ')');
  };
  Scene.prototype.pose = function (t) {
    var p = this.R.pose(t), tr = poseTransforms(p), e = this.el, g = this.g;
    e.fig.setAttribute('transform', 'translate(' + g.X0.toFixed(3) + ' ' + g.GROUND.toFixed(3) + ') scale(' + g.K + ')');
    for (var k in tr) if (e.parts[k]) e.parts[k].setAttribute('transform', tr[k]);
    return p;
  };

  root.ValiaAnim = { logoSVG: logoSVG, Scene: Scene, LANDMARKS: LANDMARKS, geom: geom, figureMarkup: figureMarkup, poseTransforms: poseTransforms, LEAF: LEAF, staticFigure: staticFigure };
})(typeof window !== 'undefined' ? window : globalThis);

/* ---- mascot.js ---- */
/* Valia · mascota
   El personatge del logotip (excursionista amb motxilla i bastó) és la cara visible de la IA.
   Fa servir exactament la mateixa figura articulada que el logotip i la pantalla de càrrega
   (mateixes peces, proporcions i gruixos); només canvia la postura i el color segons el fons.
   Unitats: u de la figura; món amb y cap amunt i terra a y = 0; a l'SVG, y cap avall. */
(function (root) {
  'use strict';
  const R = root.ValiaRig, A = root.ValiaAnim, C = R.C, D2R = Math.PI / 180;
  const RW = R.make({ flat: true });              // marxa sobre terra pla («buscant»)
  const NECK = [1.2, -23.5];                       // pivot del cap, en coordenades del tronc
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const ss = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const out3 = x => { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); };
  const dir = a => [Math.sin(a * D2R), -Math.cos(a * D2R)];
  const TAU = Math.PI * 2;

  /* ---------- cinemàtica inversa (igual que el rig de la càrrega) ---------- */
  function ik2(H, P, l1, l2) {
    const dx = P[0] - H[0], dy = P[1] - H[1], D = Math.hypot(dx, dy), Dc = Math.min(D, (l1 + l2) * 0.9995);
    const base = Math.atan2(dy, dx), a = Math.acos(clamp((l1 * l1 + Dc * Dc - l2 * l2) / (2 * l1 * Dc), -1, 1));
    const th1 = base + a;
    return { K: [H[0] + l1 * Math.cos(th1), H[1] + l1 * Math.sin(th1)], P: [H[0] + Dc * Math.cos(base), H[1] + Dc * Math.sin(base)] };
  }
  function ikArm(S, P, l1, l2, up) {
    const dx = P[0] - S[0], dy = P[1] - S[1], D = Math.hypot(dx, dy), Dc = Math.min(D, (l1 + l2) * 0.999);
    const base = Math.atan2(dy, dx), a = Math.acos(clamp((l1 * l1 + Dc * Dc - l2 * l2) / (2 * l1 * Dc), -1, 1));
    const th1 = up ? base + a : base - a;           // colze cap enrere i avall (per defecte) o cap amunt
    return { E: [S[0] + l1 * Math.cos(th1), S[1] + l1 * Math.sin(th1)], P: [S[0] + Dc * Math.cos(base), S[1] + Dc * Math.sin(base)] };
  }

  /* ---------- postura a partir d'objectius ----------
     s = { hx, hy, lean (°), head (°), fF:[x,y,g], fN:[x,y,g], hF:[x,y], hN:[x,y] | stick.held,
           stick: { tip:[x,y], ang, held, grip } | { ang, grip } (agafat per la mà propera), fx } */
  function pose(s) {
    const H = [s.hx || 0, s.hy], lean = (s.lean || 0) * D2R;
    const tor = p => [H[0] + p[0] * Math.cos(lean) + p[1] * Math.sin(lean), H[1] - p[0] * Math.sin(lean) + p[1] * Math.cos(lean)];
    const SN = tor(C.SHN), SF = tor(C.SHF), st = s.stick || {};
    let tip, top, hN = s.hN;
    const d = dir(st.ang == null ? 186 : st.ang), g = st.grip || C.GS;
    if (st.tip) { tip = st.tip; if (st.held) hN = [tip[0] + g * d[0], tip[1] + g * d[1]]; }
    else tip = [hN[0] - g * d[0], hN[1] - g * d[1]];
    top = [tip[0] + C.LS * d[0], tip[1] + C.LS * d[1]];
    return {
      H, lean, head: s.head || 0,
      lF: ik2(H, s.fF, C.L1, C.L2), lN: ik2(H, s.fN, C.L1, C.L2), fF: { g: s.fF[2] || 0 }, fN: { g: s.fN[2] || 0 },
      SN, SF, armN: ikArm(SN, hN, C.LU, C.LFA, s.upN), armF: ikArm(SF, s.hF, C.LU, C.LFA, s.upF), tip, top, fx: s.fx || {}
    };
  }
  /* interpolació entre dues postures (posicions); els angles es tornen a calcular en dibuixar */
  function mix(a, b, t) {
    if (typeof a === 'number') return lerp(a, b, t);
    if (Array.isArray(a)) return a.map((v, i) => mix(v, b[i], t));
    if (a && typeof a === 'object') { const o = {}; for (const k in a) o[k] = k === 'fx' ? (t < 0.5 ? a.fx : b.fx) : (b && k in b ? mix(a[k], b[k], t) : a[k]); return o; }
    return a;
  }

  /* ---------- postures clau ---------- */
  const LOGO = { hx: 0, hy: 26.63, lean: 3, head: 0, fF: [9.16, 3.7, 14], fN: [-10.27, 4.52, -8.5], hF: [1.92, 27.66], stick: { tip: [21, 0], ang: 186.4, held: true } };
  const STAND = { hx: 0, hy: 27.4, lean: 2, head: 0, fF: [5.2, 3.7, 0], fN: [-4.6, 3.7, 0], hF: [-2.5, 28.5], stick: { tip: [17, 0], ang: 191, held: true, grip: 38 } };
  const WALKX = R.make({ flat: true });
  const K = {
    logo: LOGO, stand: STAND,
    wave: { hx: 0, hy: 27.4, lean: 1, head: -6, fF: [5.2, 3.7, 0], fN: [-4.6, 3.7, 0], hF: [-4, 30], hN: [12, 63], stick: { ang: 180, grip: 30 } },
    listen: { hx: 0, hy: 26.6, lean: 12, head: 12, fF: [6.5, 3.7, 0], fN: [-5.2, 3.7, 0], hF: [-1, 30], hN: [-1.6, 55.5], upN: true, stick: { tip: [14.5, 0], ang: 197 } },
    think: { hx: 0, hy: 27.4, lean: -3, head: -16, fF: [4.6, 3.7, 0], fN: [-5.4, 3.7, 0], hF: [7, 45.5], hN: [8.6, 54.2], upN: true, stick: { tip: [16, 0], ang: 200 } },
    talk: { hx: 0, hy: 27.4, lean: 4, head: 4, fF: [5.2, 3.7, 0], fN: [-4.6, 3.7, 0], hF: [8, 38], hN: [15, 44], stick: { ang: 128, grip: 22 } },
    point: { hx: 0, hy: 27.1, lean: 6, head: 10, fF: [6.5, 3.7, 0], fN: [-5.5, 3.7, 0], hF: [-2.5, 29], hN: [15, 42], stick: { ang: 240, grip: 30 } },
    sit: { hx: 1, hy: 14.6, lean: 16, head: 24, fF: [15.5, 3.7, 0], fN: [13, 3.7, 0], hF: [12.5, 18.5], hN: [14.5, 19.5], stick: { tip: [-24, 1.6], ang: 92 } },
    crouch: { hx: 0, hy: 21.5, lean: 14, head: 6, fF: [5.2, 3.7, 0], fN: [-4.6, 3.7, 0], hF: [-8, 26], hN: [8, 30], stick: { ang: 205, grip: 34 } },
    tuck: { hx: 0, hy: 27.4, lean: -4, head: -8, fF: [7, 9.5, -10], fN: [-7.5, 9, -25], hF: [-10, 57], hN: [14, 61], upN: true, upF: true, stick: { ang: 172, grip: 32 } },
    cheer: { hx: 0, hy: 27.4, lean: -3, head: -8, fF: [6, 3.7, 0], fN: [-5.5, 3.7, 0], hF: [-10, 57], hN: [13.5, 61], upN: true, upF: true, stick: { ang: 174, grip: 32 } }
  };
  const B = {}; for (const k in K) B[k] = pose(K[k]);
  const with_ = (base, o) => Object.assign({}, base, o);

  /* ---------- estats ----------
     Cada estat: f(t, m) → postura i efectes. one: durada si és d'un sol cop (després passa a «next»). */
  const STATES = {
    repos: { label: 'en repòs', f(t) { const b = Math.sin(TAU * t / 3.4); const tap = ss((t % 3.4 - 2.6) / 0.15) * (1 - ss((t % 3.4 - 2.85) / 0.2));
      return pose(with_(LOGO, { hy: LOGO.hy + 0.35 * b, lean: 3 + 0.7 * b, head: 1.5 * Math.sin(TAU * t / 3.4 + 1), stick: { tip: [21, 1.6 * tap], ang: 186.4, held: true } })); },
      still: () => B.logo },
    saludant: { label: 'saludant', one: 1.5, next: 'repos', f(t) {
      const up = ss((t - 0.08) / 0.24), down = ss((t - 1.22) / 0.26), w = up * (1 - down);
      const wv = Math.sin(TAU * 2.2 * (t - 0.3)) * ss((t - 0.3) / 0.15) * (1 - ss((t - 1.1) / 0.2));
      let s = mix(B.stand, pose(with_(K.wave, { hN: [12 + 1.5 * wv, 63], stick: { ang: 180 + 16 * wv, grip: 30 } })), w);
      const cr = t < 0.12 ? ss(t / 0.12) : 1 - ss((t - 0.12) / 0.1);
      if (cr > 0) s = mix(s, B.crouch, 0.3 * cr);
      const air = t > 0.17 && t < 0.47 ? Math.sin(Math.PI * (t - 0.17) / 0.3) * 3.4 : 0;
      return lift(s, air); },
      still: () => B.wave },
    escoltant: { label: 't\'escolta', f(t, m) { const p = m._pulse ? clamp(1 - (performance.now() - m._pulse) / 380, 0, 1) : 0;
      const b = Math.sin(TAU * t / 2.4);
      const s = pose(with_(K.listen, { lean: 11 + 1.2 * b + 2 * p, head: 14 + 3 * p, hy: 26.6 + 0.25 * b }));
      s.fx = { arcs: 0.35 + 0.65 * p }; return s; },
      still: () => { const s = pose(K.listen); s.fx = { arcs: 0.7 }; return s; } },
    pensant: { label: 'pensant', f(t) { const b = Math.sin(TAU * t / 2.8);
      const s = pose(with_(K.think, { lean: -3 + 1.2 * b, head: -16 + 4 * b, hx: 0.4 * b }));
      s.fx = { dots: (t % 1.2) / 1.2 }; return s; },
      still: () => { const s = pose(K.think); s.fx = { dots: -1 }; return s; } },
    responent: { label: 'responent', f(t) { const g = Math.sin(TAU * 1.5 * t), n = Math.sin(TAU * 3 * t);
      const s = pose(with_(K.talk, { stick: { ang: 128 + 9 * g, grip: 22 }, hN: [15 + 1.2 * g, 44 + 1 * g], hF: [8 + 1.5 * Math.sin(TAU * 1.5 * t + 1.4), 38], head: 4 + 3 * n, hy: 27.4 + 0.25 * n }));
      s.fx = { lines: (t * 1.5) % 1 }; return s; },
      still: () => B.talk },
    proposant: { label: 'proposant', one: 0.9, next: 'proposantHold', f(t) { const k = out3(t / 0.45);
      return mix(B.stand, B.point, k); }, still: () => B.point },
    proposantHold: { label: 'proposant', f(t) { const tap = Math.sin(TAU * 0.9 * t);
      return pose(with_(K.point, { stick: { ang: 240 + 3.5 * tap, grip: 30 }, head: 10 + 2 * tap })); }, still: () => B.point },
    error: { label: 'sense connexió', f(t) { const b = Math.sin(TAU * t / 4.2);
      const s = pose(with_(K.sit, { lean: 16 + 2.2 * b, head: 24 + 3 * b }));
      s.fx = { rock: 1, cloud: 0.5 + 0.5 * Math.sin(TAU * t / 2.1) }; return s; },
      still: () => { const s = pose(K.sit); s.fx = { rock: 1, cloud: 1 }; return s; } },
    buscant: { label: 'buscant', f(t) { const p = RW.pose(3 + t), X = p.st.X; const s = shift(p, -X); s.head = 0; s.fx = { ground: p.st.G % 8 }; return s; },
      still: () => { const s = shift(RW.pose(3.3), -RW.state(3.3).X); s.head = 0; s.fx = { ground: 0, still: 1 }; return s; } },
    celebrant: { label: 'celebrant', one: 1.7, next: 'celebrantHold', f(t) {
      let s;
      if (t < 0.16) s = mix(B.stand, B.crouch, out3(t / 0.16));
      else if (t < 0.56) { const u = (t - 0.16) / 0.4; s = mix(B.crouch, B.tuck, out3(Math.min(1, u * 2.5))); s = mix(s, B.crouch, ss((u - 0.74) / 0.26)); s = lift(s, 14 * Math.sin(Math.PI * u)); }
      else if (t < 0.78) s = mix(B.crouch, B.cheer, out3((t - 0.56) / 0.22));
      else { const w = Math.sin(TAU * 2 * (t - 0.78)); s = pose(with_(K.cheer, { hN: [13.5 + 1.4 * w, 61], hF: [-10 - 1.4 * w, 57], stick: { ang: 174 + 9 * w, grip: 32 } })); }
      s.fx = { confetti: clamp((t - 0.4) / 1.2, 0, 1) }; return s; },
      still: () => { const s = pose(K.cheer); s.fx = { sparkle: 1 }; return s; } },
    celebrantHold: { label: 'celebrant', f(t) { const w = Math.sin(TAU * 0.8 * t);
      return pose(with_(K.cheer, { hN: [13.5 + w, 61], hF: [-10 - w, 57], stick: { ang: 174 + 4 * w, grip: 32 }, hy: 27.4 + 0.3 * Math.sin(TAU * 1.6 * t) })); },
      still: () => { const s = pose(K.cheer); s.fx = { sparkle: 1 }; return s; } }
  };
  function shift(p, dx) { const o = mix(p, p, 0); const sx = a => { a[0] += dx; }; sx(o.H); sx(o.lF.K); sx(o.lF.P); sx(o.lN.K); sx(o.lN.P); sx(o.SN); sx(o.SF); sx(o.armN.E); sx(o.armN.P); sx(o.armF.E); sx(o.armF.P); sx(o.tip); sx(o.top); return o; }
  function lift(p, dy) { if (!dy) return p; const o = mix(p, p, 0); [o.H, o.lF.K, o.lF.P, o.lN.K, o.lN.P, o.SN, o.SF, o.armN.E, o.armN.P, o.armF.E, o.armF.P, o.tip, o.top].forEach(a => { a[1] += dy; }); return o; }

  /* ---------- dibuix ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  const LEAFP = 'M0 6C3.6 4.3 4.2 -0.6 0 -4.6C-4.2 -0.6 -3.6 4.3 0 6Z';
  function fxMarkup() {
    const dots = [0, 1, 2].map(i => `<circle data-dot="${i}" cx="${14 + i * 6}" cy="${-62 - i * 6.5}" r="${2.2 + i * 0.5}"/>`).join('');
    const arcs = [0, 1, 2].map(i => { const r = 4.6 + i * 3.4, x = 16 + i * 3.4, y = -57; return `<path data-arc="${i}" d="M${x} ${y + r}a${r} ${r} 0 0 0 0 ${-2 * r}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" transform="rotate(-14 ${x} ${y})"/>`; }).join('');
    const conf = Array.from({ length: 12 }, (_, i) => `<path data-cf="${i}" d="${LEAFP}" fill="${['#00A86B', '#F2B200', '#1FD08A', '#0E8257'][i % 4]}"/>`).join('');
    return {
      back: `<g data-fx="rock" opacity="0"><path d="M-12 0C-13 -6 -9 -13.2 0 -13.6C9 -14 13 -7 12.4 0Z" fill="var(--m-rock,#C9D3CC)"/></g>
             <g data-fx="ground" opacity="0" fill="currentColor">${Array.from({ length: 11 }, (_, i) => `<circle cx="${-36 + i * 8}" cy="1.6" r="1.2" opacity="${(1 - Math.abs(i - 5) / 6).toFixed(2)}"/>`).join('')}</g>`,
      front: `<g data-fx="dots" opacity="0" fill="currentColor">${dots}</g>
              <g data-fx="arcs" opacity="0">${arcs}</g>
              <g data-fx="cloud" opacity="0" transform="translate(16 -74)"><path d="M-9 4h17a5.5 5.5 0 0 0 0-11a7.6 7.6 0 0 0-14.6 1.6A4.8 4.8 0 0 0-9 4Z" fill="var(--m-cloud,#E5E9E6)"/><path d="M-6 -9L8 6" stroke="var(--m-slash,#D70015)" stroke-width="2.4" stroke-linecap="round"/></g>
              <g data-fx="lines" opacity="0" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M0 0l5 -3"/><path d="M1 5l6 0"/></g>
              <g data-fx="conf">${conf}</g>
              <g data-fx="sparkle" opacity="0" fill="var(--m-spark,#F2B200)"><path d="M-14 -70l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6Z"/><path d="M22 -66l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2Z"/><path d="M26 -84l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1Z"/></g>`
    };
  }
  const CONF = Array.from({ length: 12 }, (_, i) => { const a = -Math.PI / 2 + (i - 5.5) * 0.24 + (i % 2 ? 0.06 : -0.05); return { vx: Math.cos(a) * (34 + (i * 7) % 16), vy: Math.sin(a) * (52 + (i * 11) % 20), r: (i * 47) % 360, vr: (i % 2 ? 1 : -1) * (240 + (i * 37) % 200), s: 0.8 + (i % 3) * 0.18 }; });

  const LIVE = new Set();
  let RM = false;                                     // «Reduir moviment»
  let PAUSED = false;
  function tick(now) {
    if (!PAUSED) LIVE.forEach(m => { if (!m.el.isConnected) { LIVE.delete(m); return; } m.frame(now); });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  class Mascot {
    /* opt: { size (px d'alçada), view: 'full'|'avatar'|'bust', color, state, label } */
    constructor(host, opt) {
      opt = opt || {};
      this.opt = opt; this.el = document.createElement('span'); this.el.className = 'masc ' + (opt.cls || '');
      const vb = opt.view === 'avatar' ? '-26 -76 62 70' : opt.view === 'bust' ? '-22 -74 52 52' : '-34 -104 96 110';
      const fx = fxMarkup();
      this.el.innerHTML = `<svg viewBox="${vb}" role="img" aria-label="" focusable="false" style="height:${opt.size || 96}px;width:auto;overflow:visible">
        <g class="m-root">${fx.back}<g class="m-body">${A.figureMarkup('currentColor')}</g>${fx.front}</g></svg>`;
      host && host.appendChild(this.el);
      this.svg = this.el.firstElementChild; this.parts = {};
      this.svg.querySelectorAll('.m-body [data-p]').forEach(g => { this.parts[g.getAttribute('data-p')] = g; });
      this.fx = {}; this.svg.querySelectorAll('[data-fx]').forEach(g => { this.fx[g.getAttribute('data-fx')] = g; });
      this.dots = [...this.svg.querySelectorAll('[data-dot]')]; this.arcs = [...this.svg.querySelectorAll('[data-arc]')]; this.cf = [...this.svg.querySelectorAll('[data-cf]')];
      this.state = null; this.t0 = performance.now(); this.from = null; this.blend = 0; this.label = opt.label || 'Assistent de Valia';
      this.set(opt.state || 'repos', { instant: true });
      LIVE.add(this);
    }
    set(state, o) {
      o = o || {};
      if (!STATES[state]) return this;
      if (this.state === state && !o.restart) return this;
      const now = performance.now();
      this.from = o.fromPose || this.cur || null; this.fromT = now; this.blendDur = o.instant || RM ? 0 : (o.blend || 0.28);
      this.state = state; this.t0 = now; this.onDone = o.onDone || null;
      this.svg.setAttribute('aria-label', this.label + ': ' + STATES[state].label);
      this.svg.dataset.state = state;
      this.frame(now);
      return this;
    }
    pulse() { this._pulse = performance.now(); }
    frame(now) {
      const S = STATES[this.state];
      let t = (now - this.t0) / 1000, p;
      if (RM || this.opt.still) p = S.still();
      else {
        if (S.one && t >= S.one) { const cb = this.onDone; this.onDone = null; this.set(S.next, { blend: 0.2 }); cb && cb(); return; }
        p = S.f(t, this);
      }
      if (this.from && this.blendDur > 0) {
        const k = ss((now - this.fromT) / 1000 / this.blendDur);
        if (k < 1) { const fxB = p.fx; p = mix(this.from, p, k); p.fx = k < 0.5 ? (this.from.fx || {}) : fxB; } else this.from = null;
      }
      this.cur = p; this.draw(p, t);
    }
    draw(p, t) {
      const tr = A.poseTransforms(p);
      for (const k in tr) if (this.parts[k]) this.parts[k].setAttribute('transform', tr[k]);
      if (this.parts.head) this.parts.head.setAttribute('transform', `rotate(${(p.head || 0).toFixed(2)} ${NECK[0]} ${NECK[1]})`);
      const fx = p.fx || {}, F = this.fx;
      F.rock.setAttribute('opacity', fx.rock ? 1 : 0);
      F.ground.setAttribute('opacity', fx.ground != null ? 0.45 : 0);
      if (fx.ground != null) F.ground.setAttribute('transform', `translate(${(-(fx.ground || 0)).toFixed(2)} 0)`);
      // punts de «pensant»
      F.dots.setAttribute('opacity', fx.dots != null ? 1 : 0);
      if (fx.dots != null) this.dots.forEach((d, i) => { const ph = fx.dots < 0 ? 1 : clamp(Math.sin(Math.PI * clamp((fx.dots * 1.6 - i * 0.22), 0, 1)), 0, 1); d.setAttribute('opacity', (fx.dots < 0 ? 0.85 : 0.25 + 0.75 * ph).toFixed(2)); d.setAttribute('transform', `translate(0 ${fx.dots < 0 ? 0 : (-2.4 * ph).toFixed(2)})`); });
      F.arcs.setAttribute('opacity', fx.arcs != null ? 1 : 0);
      if (fx.arcs != null) this.arcs.forEach((a, i) => a.setAttribute('opacity', clamp(fx.arcs * 1.4 - i * 0.28, 0.12, 1).toFixed(2)));
      F.cloud.setAttribute('opacity', fx.cloud ? (0.75 + 0.25 * fx.cloud).toFixed(2) : 0);
      if (fx.cloud) F.cloud.setAttribute('transform', `translate(16 ${(-74 - 1.2 * fx.cloud).toFixed(2)})`);
      // línies de gest vora la punta del bastó
      if (fx.lines != null) { const tp = p.tip; F.lines.setAttribute('opacity', (0.25 + 0.6 * Math.sin(Math.PI * fx.lines)).toFixed(2)); F.lines.setAttribute('transform', `translate(${(tp[0] + 2).toFixed(1)} ${(-tp[1] - 4).toFixed(1)})`); } else F.lines.setAttribute('opacity', 0);
      // confeti de fulles
      const cfv = fx.confetti;
      this.cf.forEach((c, i) => {
        if (cfv == null || cfv <= 0 || cfv >= 1) { c.setAttribute('opacity', 0); return; }
        const q = CONF[i], tt = cfv * 1.15, x = q.vx * tt, y = -62 + q.vy * tt + 46 * tt * tt;
        c.setAttribute('opacity', (1 - ss((cfv - 0.62) / 0.38)).toFixed(2));
        c.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(q.r + q.vr * tt).toFixed(0)}) scale(${q.s})`);
      });
      F.sparkle.setAttribute('opacity', fx.sparkle ? 1 : 0);
    }
    destroy() { LIVE.delete(this); this.el.remove(); }
  }

  root.Mascot = {
    create: (host, opt) => new Mascot(host, opt),
    STATES, pose, mix, K, B,
    setReduced(v) { RM = !!v; LIVE.forEach(m => m.frame(performance.now())); },
    pause(v) { PAUSED = !!v; },
    get reduced() { return RM; },
    labels: () => Object.fromEntries(Object.entries(STATES).map(([k, v]) => [k, v.label]))
  };
})(typeof window !== 'undefined' ? window : globalThis);

