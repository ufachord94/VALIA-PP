# INFORME DE MILLORA · Defensa del TR «Vallès Endins» (app Valia)

Prompt vigent: `referencia/PROMPT_MILLORA.md`. Skill: `presentacions-projecte`.
Estat: **M2 lliurada, aturada per a l'aprovació dels autors** (17-11-2026).

---

## M0 · Inventari i entorn

### Fitxers

| Fitxer | Estat | Nota |
|---|---|---|
| `presentacio/` (index.html, css, js, dades.json, GUIO.md, PENDENTS.md) | ✅ | Estat F2: 3 diapositives construïdes (D0, D1, D4) i el guió sencer |
| `presentacio/PREGUNTES_TRIBUNAL.md` | ❌ | Es fa a M5 |
| `referencia/PROMPT_PRESENTACIO.md` | ✅ creat avui | No existia: era només a la conversa. Còpia literal |
| `referencia/Teoria.docx` | ⚠️ | El TR és `referencia/TR Xavi_Unai definitiuEVA.docx`. Només arriba a l'apartat 4 |
| `referencia/normes_centre.pdf` i rúbrica del centre | ❌ | Supòsit: 15 min màxim i sense obligació de PowerPoint |
| `referencia/video/` i `referencia/trailer/` | ❌ | El vídeo de pla B el puc generar jo des de la PWA local |
| `referencia/icgc/` | ❌ | La descàrrega segueix bloquejada pel control de permisos de la sessió |
| `referencia/pwa/`, `logo/`, `qr/`, 17 fotos pròpies | ✅ | |

### Eines

| Eina | Estat |
|---|---|
| Node 22.23 · Playwright 1.63 amb Chromium | ✅ |
| DeckTape 3.17.0 | ✅ Instal·lat i provat: PDF de 3 pàgines a 1920×1080 amb `file://`, cada diapositiva en l'estat final |
| ffmpeg 6.1 · LibreOffice · pdftoppm | ✅ |
| Python: python-pptx, reportlab, Pillow | ✅ (sense matplotlib ni qrcode: el QR ja és al prototip) |
| Skills `presentacions-projecte`, `dataviz`, `pptx`, `pdf` | ✅ |
| Skill `frontend-design` | ❌ No n'hi ha: faig servir `artifact-design`, la més semblant |
| Skill `video-making` | ❌ El vídeo es fa amb Playwright i ffmpeg |

**Error trobat i corregit a M0:** el sender (la barra de la mascota) estava inserit després de l'última diapositiva. Reveal.js decideix que una diapositiva és l'última si no té cap element germà al darrere, i per això DeckTape no acabava mai. Ara el sender va al principi del contenidor.

### Contradiccions

| # | Entre | Conflicte | Com es resol |
|---|---|---|---|
| 1 | Prompt mestre ↔ prompt de millora | D15 «Surt. Explora. Suma. + QR + agraïments» ↔ «cap pantalla de Gràcies» | Pantalla final: missatge únic + QR. Les gràcies, només de paraula |
| 2 | Prompt mestre ↔ prompt de millora | Limitacions només a l'annex ↔ al cos principal | Pantalla de limitacions al cos |
| 3 | Prompt mestre ↔ prompt de millora | Mapa a D4 i D7 ↔ mapa com a columna vertebral | Concepte A (vegeu M2) |
| 4 | Prompt de millora ↔ TR | Simulador amb usuaris, conversió i comissions ↔ el TR no té cap supòsit econòmic | El simulador es prepara, però sense xifres fins que existeixi el pla econòmic |
| 5 | Prompt de millora ↔ TR | Metodologia amb n i dates, veredictes, viabilitat P2, riscos, full de ruta ↔ apartats inexistents | [PENDENT DE VERIFICAR] visible |
| 6 | Prompt de millora ↔ TR | «Ús d'IA declarat igual que al TR» ↔ el TR no té declaració, només dos peus de figura («Elaborada en IA (OpenAI, 2026)») | Pendent de la vostra declaració |
| 7 | GUIO ↔ TR | La metodologia del TR (§1.5) és en futur («seguirem»); el titular de la D3 diu «hem seguit» | Titular coherent amb el que el TR pugui demostrar |
| 8 | GUIO ↔ TR | La targeta H3 diu «Economia local»; el TR diu «economia i el màrqueting». La D2 diu que la IA «augmenta» l'interès; el TR diu «pot augmentar» | Etiquetes i verbs literals del TR |
| 9 | Prompt mestre ↔ TR | «Microaventura», «Valia» i la pregunta de recerca no surten al TR | Ja era a PENDENTS (A2, A8, A9) |

---

## M1 · Diagnosi: nota de partida

Puntuat per mi i, de forma independent, per un subagent que no havia vist la feina (no coneixia les meves notes).

### Rúbrica de la skill (R1–R10)

| Criteri | Jo | Subagent | Pantalla | Per què | Què cal per al 3 |
|---|---|---|---|---|---|
| R1 Missatge únic | 1 | 1 | D1, D6, D15 | La idea que es pot recordar («no volem una altra app de rutes») surt a la D6, cap al minut 4. El final és un eslògan. Hi ha tres lemes que competeixen | Missatge únic a la D1 (≤ 60 s), repetit a la D14 i escrit a la D15 |
| R2 Estructura completa | 0 | 0 | D9–D12, D14, i falten diapositives | Falten apartats obligatoris: validació amb n i data, veredictes, resposta a la pregunta, limitacions, viabilitat P2, riscos, full de ruta | Resultats reals al TR + pantalles de limitacions, riscos i full de ruta |
| R3 Veracitat | 2 | 2 | D1, D4, dades.json | Totes les xifres visibles tenen font, però no s'han obert les fonts primàries. La xifra del ganxo no està llegida a l'article. Hi ha fonts febles no marcades (Turismedia) | Font, any i enllaç verificat per xifra; fonts febles canviades o marcades |
| R4 Titulars-frase | 1 | 1 | GUIO | 8–9 de 15 són frases (53–64 %, per sota del 80 %). Llegits seguits, s'aturen al prototip | Titulars de D9–D14 amb resultat i veredicte |
| R5 Càrrega cognitiva | 2 | 2 | D4, D6 (pla), D10 (pla) | La D1 compleix. La D4 té 5 blocs i dues idees. La matriu de 13×5 i el Canvas de 9 blocs es passen | Treure els 372 km de la D4; matriu reduïda a 4–5 files; Canvas amb 2 blocs ressaltats |
| R6 Evidència visual | 2 | 2 | D1, D4 | Tenen significat i etiquetes directes, però no demostren el titular sencer. A la D1, els joves «inactius» són excursionistes amb bastó | Figures inactives assegudes; un mapa que demostri «dispers → connectat» |
| R7 Format adequat | 2 | 2 | Global | Cel·la correcta (HTML de defensa). Regles de prioritat a mitges: el mapa no és el fil, no hi ha simulador ni vídeo de pla B, no hi ha versió per llegir | Concepte A + simulador + vídeo + slidedoc i one-pager |
| R8 Sistema visual | 2 | 2 | D0, D1, D4 | Identitat pròpia i contrast comprovat, però hi ha errors visibles: etiquetes de la D4 que es creuen amb el contorn, el peu de la D1 amb doble marge (x = 240) | Corregir els solapaments i el peu; ritme variat a tot el deck |
| R9 Preparació | 2 | 2 | GUIO, notes | Hi ha notes i 13:25 ≤ 90 %, però 6:40 no tenen guió, no hi ha respostes a les preguntes i el pla B és només sobre el paper. La D8 té 24 s per a 8 tocs de pantalla | 10–15 preguntes amb resposta, vídeo, PDF i assaig cronometrat |
| R10 Crida a l'acció | 1 | 1 | D15 | Eslògan + QR + «Gràcies»: petició vaga | Missatge únic + pas següent concret i datat + QR |
| **Total** | **15/30** | **15/30** | | **No arriba als mínims** (R1, R2 i R3 < 3; quatre criteris < 2) | |

### Criteris del tribunal (sense rúbrica oficial: criteris habituals, E51)

| Criteri | Jo | Subagent | Diferència i per què |
|---|---|---|---|
| Obertura i tancament | 2 | 1 | Jo valorava sobretot el ganxo amb dada i font. El subagent penalitza la fórmula «Bon dia, us presentem…» i el tancament amb «Gràcies». **Té raó**: compte el 1 |
| Ordre i estructura | 2 | 2 | Coincidim. A més, el subagent veu 8 canvis d'orador |
| Síntesi | 2 | 2 | Coincidim. La D4 és un «fullet turístic»: 8 dades que no serveixen cap hipòtesi |
| Coherència amb el treball escrit | 1 | 1 | Coincidim |
| Adequació al temps | 1 | 2 | Jo penalitzava que 6:40 no es puguin cronometrar. El subagent ho dona per bo sobre el paper. **Compte el 1**: un temps no assajat no és adequat |
| Llenguatge oral (segons el guió) | 2 | 2 | Coincidim |
| Suport visual | 2 | 2 | Coincidim |
| Preparació per a les preguntes | 1 | 1 | Coincidim |
| **Total** | **13/24** | **13/24** | Mateix total amb dues diferències que es compensen. **Nota de partida consolidada: 12/24** (en cada desacord, la nota més baixa) |

**Coincidència:** 10 de 10 criteris de la skill i 6 de 8 del tribunal.

**Què m'ha fet veure el subagent i jo no havia vist:**
1. El doble marge del peu de la D1.
2. La contradicció de les figures «inactives» amb bastó.
3. El temps irreal de la demo.
4. El verb «augmenta» en lloc de «pot augmentar».
5. Els 8 canvis d'orador.
6. La D4 com a fullet turístic.

### Sostre de nota sense més contingut del TR

Avui, sense els apartats que falten al TR, el màxim honest és **≈ 22/30**:
- R2 es queda a 0 mentre faltin apartats obligatoris.
- R4 es queda a 2.
- R10 a 2, sense un pas següent decidit per vosaltres.
- R3 depèn de poder obrir les fonts.

**El 30/30 depèn de vosaltres:** treball de camp amb n i dates, model de negoci, pla econòmic (supòsits, 3 escenaris, punt d'equilibri, inversió i fonts), fórmula de l'IIT, conclusions amb veredicte, limitacions, riscos, full de ruta, declaració d'ús d'IA i un pas següent concret.

---

## M2 · Brífing i concepte

### Fitxa

| | |
|---|---|
| **Objectiu** | La nota màxima: que el tribunal vegi que la pregunta es respon amb evidència i que l'exposició és coherent amb el TR |
| **Públic** | Tribunal de 3 professors (decideix). Coneixen el mètode de recerca, no el turisme ni les startups. Els preocupa el rigor, la coherència amb el TR i que les hipòtesis es verifiquin. Possibles alumnes oients |
| **Context i durada** | En directe, aula amb projector, sense internet garantit. Màxim 15 min (objectiu 13:30) + 5–10 min de preguntes. Sense normes: supòsit que no exigeixen PowerPoint |
| **Mitjà** | HTML local (reveal.js + GSAP) des d'USB + PDF de seguretat (DeckTape). Versió per llegir: slidedoc PDF de 12–15 pàgines + one-pager A4 amb QR |
| **Material** | TR (apartats 1–4), document del prototip, PWA v6.0 local, 17 fotos pròpies, logo i mascota, QR. Falten camp, negoci, finances, IIT, conclusions i normes |
| **Missatge únic** | «No volem una altra aplicació de rutes: volem rutes que et connectin amb el territori.» (15 paraules) |

**Perfil:** P3 (acadèmic) amb els blocs de viabilitat del P2.

### Concepte

| | A · El Vallès com a fil | B · Hipòtesi a hipòtesi | C · Llenç del Vallès |
|---|---|---|---|
| Mecànica | Un sol mapa SVG de la comarca és l'escenari. Cada capítol hi torna i fa zoom a un lloc: territori, ruta d'avui en 4 apps, la mateixa ruta a Valia, impacte i tancament. Les pantalles de dades (camp, finances) són assertion-evidence a pantalla completa | Deck assertion-evidence lineal que segueix el P3. Les 3 targetes d'hipòtesi són el fil i tornen amb veredicte. El mapa, només a D4 i D7 | Tot el TR dibuixat en un gran llenç-mapa. La presentació és un recorregut de zoom per parades, com un GR, i torna a la vista global per concloure |
| Per què encaixa | Cel·la «defensa acadèmica · directe» + regla 3: la tesi del TR (§4.5) és espacial. Contrast «el que és / el que podria ser» amb la mateixa ruta (E23). Imatge reconeixible amb significat (E42, C6). Zoom només on la relació part ↔ tot és el missatge (C7) | Cel·la exacta de la matriu. Assertion-evidence (E13). Menys risc tècnic | Regla 3 portada a l'extrem. El llenç amb zoom es valora més organitzat i persuasiu (E16) |
| Esforç / risc | Alt (la base ja hi és). Risc: fatiga de moviment si tot fa zoom, i evidència feble dels mapes narratius (E41). Mitigació: màxim 6 tornades al mapa | Mitjà. Risc: no aplica la regla 3, R7 es queda en 2 i és menys memorable | Alt+. Risc: no millora la comprensió (E16), pot marejar, encaixa malament amb l'ordre P3 i les dades financeres, i el PDF queda pobre |
| Eina | HTML reveal.js 5 + GSAP (DrawSVG, MotionPath, Flip) en local. PDF amb DeckTape. Slidedoc i one-pager amb `page.pdf` de Playwright | Igual | Igual + SVG gegant |

**Recomano: A · El Vallès com a fil.** Raons:
1. La regla 3 hi aplica de debò. L'argument del TR és que els recursos existeixen però estan repartits pel territori, i el mapa ho **demostra** en lloc de dir-ho: la mateixa ruta, primer dispersa en 4 apps i després connectada.
2. Manté l'estructura P3 que espera el tribunal (hipòtesis que tornen amb veredicte) i les dades com a assertion-evidence (E13). El mapa és el fil, no l'únic recurs.
3. Aprofita el que ja funciona i està provat (mapa, mascota, motor de passos, comprovacions, DeckTape).

**Mecàniques afegides:**
- **«Prediu-ho» a mà alçada** a la D1 (E38): «De cada 3 joves de 8 a 16 anys, quants fan l'activitat física recomanada?». La resposta surt a la pantalla següent.
- **Demo de ≤ 90 s** amb un vídeo de 20 s com a pla B, generat des de la PWA local.
- **Simulador d'escenaris** a l'annex de finances: es construeix l'estructura, però les xifres esperen el pla econòmic del TR.
- **Fora de línia + PDF**: verificat.
