# PENDENTS · Presentació de la defensa del TR «Vallès Endins» (app Valia)

Estat: **F1 aprovada (17-11-2026). F2 lliurada, pendent de la vostra aprovació.** Darrera actualització: 17-11-2026.

Llegenda: 🔴 bloqueja una fase · 🟠 risc davant del tribunal · 🟡 millora o comprovació.

## Resum

- El TR pujat arriba fins a l'apartat 4 (introducció, territori i benchmarking), més el document del prototip.
- **No hi ha encara:** rutes pilot, enquestes ni proves amb usuaris, model de negoci, pla econòmic, màrqueting, fórmula de l'IIT ni conclusions.
- Conseqüència: de les 15 diapositives, **5 són [PENDENT] senceres** (D9, D10, D11, D12 i D14) i **2 ho són en part** (D3 i D13). Sumen 6:40 dels 13:25.
- De les 83 dades de `dades/dades.json`, 31 tenen algun [PENDENT].

---

## A. Decisions vostres

Resoltes el 17-11-2026: guió de F1 aprovat; **A1 = Xavi, A2 = Unai**; portada amb «Vallès Endins» en gran i «Valia» a sota; les 17 imatges de `referencia/pwa/img/` són fotos vostres i es poden fer servir.

| # | Decisió | Què he fet servir mentrestant | Recomanació |
|---|---|---|---|
| A1 | ✅ Qui és A1 i qui A2 | A1 = Xavi Hernandez Godoy (Turisme i Convenis) · A2 = Unai Farràs Chordjian (Empresa, Economia i Màrqueting) | Confirmat |
| A2 | ✅ Nom a la portada | Títol del TR en gran i, a sota, «Valia · El Vallès que encara no has viscut.» | Confirmat. Recomanació pendent: al TR escrit, una frase que digui que l'app es diu Valia |
| A3 | 🟠 Superfície de la comarca: el TR diu 727 km²; la Cambra de Barcelona i el vostre mòdul de mapa (que cita l'Idescat) diuen 735 km² | La D4 **no ensenya** la superfície: no cal per a l'argument | Corregir el TR a 735 km² després de comprovar-ho a l'Idescat. No ensenyar cap xifra dubtosa en pantalla |
| A4 | 🟠 Matriu de benchmarking: el TR dona «Sí» a Google Maps a «Impacte territorial mesurable» i a «Participació d'agents locals» | Matriu transcrita tal com és al TR, marcada PENDENT | Revisar aquestes dues cel·les: la primera contradiu el §4.5, on mesurar l'impacte és justament el buit que detecteu |
| A5 | 🟠 Columna «Valia» a la matriu: al TR no hi és | Prevista com a «Valia (proposta)» | Afegir-la, però distingint el que el prototip ja ensenya del que encara és disseny. I afegir-la també al TR |
| A6 | ✅ Fotos | Les 17 imatges de `pwa/img/` són vostres: les faré servir a partir de F3 | Confirmat. Al prototip, la guia (`guia.html`) encara diu «Les imatges dels llocs són provisionals»: convé treure-ho |
| A7 | 🟠 Ruta de la D7: la fase de rutes pilot no és al TR | «Itinerari termal de Caldes», del prototip, amb establiments d'exemple | Confirmeu la ruta. Si teniu una ruta pilot feta de debò, millor aquella |
| A8 | 🟡 «Microaventura»: la paraula no surt ni al TR ni al document del prototip | La faig servir a la D7 amb una definició treta del §4.5 | Mantenir-la i afegir-la al treball escrit, o canviar-la per «experiència» |
| A9 | 🟡 Pregunta de recerca: no és escrita al TR (hi ha hipòtesis i objectius) | La del prompt, abreujada a 17 paraules per a la pantalla | Afegir-la a l'apartat 1 del TR |

---

## B. Apartats que falten al TR i què necessito de cada un

| Diapositiva | Què falta exactament |
|---|---|
| **D3 · Metodologia** (en part) | Què s'ha fet a les fases 4 (rutes pilot), 5 (proves amb usuaris) i 6 (viabilitat i impacte): una frase per fase |
| **D9 · Investigació de camp** | Enquesta: mostra (n), dates, canal i perfil dels enquestats · resultats de les preguntes clau (interès, valoració, intenció de repetir, disposició a pagar) · proves del prototip amb usuaris: quants, quan i què se'ls va demanar · agents del territori contactats i què van dir |
| **D10 · Model de negoci** | Els nou blocs del Canvas · segments de clients · fonts d'ingressos i preus · proposta de valor per a cada segment · socis i recursos clau |
| **D11 · Viabilitat econòmica** | Taula de supòsits · resultats a tres anys en tres escenaris · punt d'equilibri (en usuaris o ingressos, i en quin mes) · inversió inicial i necessitat de finançament · fonts de finançament |
| **D12 · Màrqueting** | Públic objectiu, canals i missatges · calendari o embut de llançament amb fites · pressupost · què vol dir «Branding Verd» (no surt al TR) |
| **D13 · IIT** (en part) | Fórmula amb variables, escala i pesos · justificació dels pesos · un exemple calculat pas a pas · fonts oficials dels factors de CO₂ (els del prototip són «d'exemple») |
| **D14 · Conclusions** | Resultat de cada indicador · veredicte de cada hipòtesi · resposta a la pregunta de recerca · limitacions i línies de futur |
| **Annex** | Supòsits econòmics · DAFO i CAME · PESTEL · cinc forces de Porter · marc legal · càlcul complet de l'IIT · fitxa tècnica de l'enquesta · declaració d'ús d'IA · la referència de l'estudi dels mercats municipals |

Sense resultats no hi haurà veredicte a la D14: només la cadena hipòtesi → indicador → [PENDENT].

---

## C. Contradiccions entre el prompt i el material

| # | El prompt diu | El material diu | Com ho he resolt |
|---|---|---|---|
| C1 | Dada del ganxo: «Zapico et al., 2023» | El TR cita Zapico et al. (2023), que és l'estudi PASOS: «només una de cada tres persones d'entre 8 i 16 anys» | Coincideix. Faig servir «1 de cada 3», no «33 %» (vegeu D2) |
| C2 | «Xarxa de 372 km» | El TR diu que el Consell Comarcal «ha plantejat» la xarxa. El títol de la font diu «projecta una xarxa de 372 km per accedir als polígons» | 🟠 A la D4 hi dic «projectats». No és una xarxa de senders turístics que ja existeixi |
| C3 | App amb «rutes amb IA» | Document del prototip: «les respostes no les genera una IA real. Surten de normes senzilles» | 🟠 A la D8 es diu explícitament que l'assistent és simulat |
| C4 | «Contaminació zero» com a risc | L'expressió no surt al TR. La hipòtesi diu «minimitzi l'impacte ambiental» | Resolt al text escrit. A la D13 hi ha la frase «No prometem contaminació zero». Que no s'escapi oralment |
| C5 | Metodologia en cinc fases: teoria, benchmarking, camp, prototip i pla econòmic | El TR (§1.5) en descriu sis i en un altre ordre: territori, benchmarking, proposta i prototip, rutes pilot, proves amb usuaris, viabilitat i impacte | Faig servir les sis del TR |
| C6 | Terminologia: «microaventures», «regeneració territorial», «Branding Verd» | Cap dels tres termes surt al TR | 🟡 «Microaventura» es manté amb definició (A8). Els altres dos no els faig servir |
| C7 | La columna de Valia «és l'única completa» | La matriu del TR no té columna de Valia | 🟠 Vegeu A5 |
| C8 | Mapes amb límits de l'ICGC | El prototip fa servir límits d'OpenStreetMap | 🟡 Per a les diapositives calen els de l'ICGC (vegeu F) |
| C9 | Tot funciona amb doble clic (`file://`) i la demo va en un `iframe` | Amb `file://` la PWA carrega, però el mapa real no. El mapa, a més, demana tessel·les a internet | 🟠 La demo de tres passos evita el mapa. Hi haurà un servidor local opcional i el vídeo com a pla B |
| C10 | Sense cap petició externa | La PWA demana la tipografia Inter a `fonts.googleapis.com` | 🟡 A la còpia de la demo, Inter en local |
| C11 | «Eines gratuïtes i de codi obert» + GSAP | GSAP 3.15.1 és gratuït amb tots els plugins, però la seva llicència no és de codi obert | 🟡 El mantinc (decidit a l'apartat 5). A la declaració d'eines: «gratuït» |
| C12 | reveal.js 5 | L'última versió és la 6.0.2; l'última 5.x, la 5.2.1 | 🟡 Faig servir la 5.2.1 |
| C13 | Superfície: 727 km² | Vegeu A3 | 🟠 |

---

## D. Riscos del treball escrit que el tribunal pot veure

La rúbrica valora la coherència entre la defensa i el treball. Això no ho puc arreglar jo: és al TR.

| # | Risc | On |
|---|---|---|
| D1 | 🟠 Sis notes i el peu de la Figura 2 tenen enllaços amb `?utm_source=chatgpt.com`. Delata d'on surt la referència | Notes 2, 3, 4, 5, 6 i 7, i Figura 2 |
| D2 | 🟠 La Figura 2 atribueix el gràfic a «Herrera-Ramos et al. (2023)» amb el mateix DOI que la nota 3 (Zapico et al.). L'autor principal és Zapico. A més, «33 % / 67 %» és més precís que el que he pogut contrastar: PASOS 2019 dona un 36,7 % que compleix i l'avanç de PASOS 2022, un 70,6 % que no | §2 |
| D3 | 🟠 La crida de nota «4» surt dues vegades. L'estudi de la Generalitat sobre els mercats municipals (2025) no té referència enlloc | §2.1 i §2.2 |
| D4 | 🟠 La portada i les quatre imatges del §3.1 (Gallecs, Montseny, Granollers i Congost) semblen generades amb IA. Si ho són, s'ha de dir al peu, i no es poden presentar com a fotos dels llocs | Portada i §3.1 |
| D5 | 🟠 El §4.1 llista 12 criteris (dos amb el número 11, i un és «Ús d'intel·ligència artificial»). La matriu del §4.3 té 13 files diferents: no hi ha la IA i hi ha «Comunitat d'usuaris» | §4.1 i §4.3 |
| D6 | 🟡 Numeració de figures: hi ha «Figura 1» a «Figura 4» dins d'una mateixa imatge, a més de les Figures 1, 2 i 3 del text i una «Figura X» | §1.2, §2, §3.1, §3.9 i §4.3 |
| D7 | 🟡 Tres noms per al mateix projecte: «Vallès Endins» (portada), «Valia» (app) i «GreenVallès» (guia del prototip i compte de demostració `…@greenvalles.cat`) | Portada i prototip |
| D8 | 🟡 Ortografia: «Metodología» (dues vegades, amb accent castellà), «la nostre edat», «Vam emprendre tres decisions» (hauria de ser «prendre»), una frase tallada al final del §2.2 («l'activitat físic») i «Solucions actuals amb el problema» (a l'índex, «al problema») | §1.5, §2.1, §2.2, §4.1, §4.2 i prototip |
| D9 | 🟡 Fonts febles: Viquipèdia en anglès per al Museu de Granollers, blogs i webs de turisme. Les notes 15 i 23 citen un article sobre Gallecs per parlar del modernisme i dels rius | Notes 15, 17 i 23 |
| D10 | 🟡 La guia del prototip parla de «12 llocs»; al catàleg de rutes n'hi ha 11 | Prototip |

---

## E. Fitxers que encara falten

| Fitxer | Estat | Per a què |
|---|---|---|
| `referencia/normes_centre.pdf` | 🟠 No hi és, i no he trobat les normes del vostre institut a internet | Sense això aplico 15 minuts com a màxim i objectiu de 13:30 |
| `referencia/fotos/` | ✅ No cal | Les fotos són les 17 de `referencia/pwa/img/` (A6). Si en teniu més, pugeu-les aquí |
| `referencia/video/valia_trailer_45s_1080p.mp4` | 🟠 No hi és | Pla B de la D8 i tall de 15–20 s |
| Projecte Remotion del tràiler | 🟡 No hi és | Sense el projecte, el tall el faig retallant el MP4 amb FFmpeg |
| Data de la defensa | 🟡 No consta | Per al kit d'assaig |

---

## F. Accés de xarxa (segueix bloquejat)

El 17-11-2026 vau autoritzar la descàrrega, però el control automàtic de permisos de la sessió la va tornar a rebutjar. En total han estat quatre intents: tres amb `curl` i un amb el lector de pàgines. No he baixat res de l'ICGC ni de l'Idescat. Aquest control no el puc desactivar jo.

**Mentrestant:** el mapa de F2 fa servir el contorn de la comarca i el centre dels 39 municipis del mòdul de mapa del prototip (OpenStreetMap, ODbL). Al peu de la portada i de la D4 hi ha l'atribució d'OSM i una marca **PENDENT** visible.

**La solució més ràpida (5 minuts, des del vostre ordinador):**
1. Obriu la pàgina de [Divisions administratives de l'ICGC](https://www.icgc.cat/en/Geoinformation-and-Maps/Data-and-products/Cartographic-geoinformation/Administrative-boundaries) (la podeu canviar a català des del mateix web).
2. Descarregueu la versió vigent en **GeoJSON** (o SHP) a escala 1:50.000 o 1:250.000.
3. Pugeu el ZIP a `referencia/icgc/` de la branca `claude/valia-tr-defense-f428bx`.

Amb aquest fitxer canvio el mapa per l'oficial (contorn i límits dels 39 municipis) i el peu passa a dir: «Elaboració pròpia a partir de dades de l'Institut Cartogràfic i Geològic de Catalunya (ICGC), sota llicència CC BY 4.0».

| Què necessito | Per a què | Alternativa |
|---|---|---|
| Límits comarcals i municipals de l'ICGC | Mapa de la portada, de la D4 i de la D7 | Pujar el fitxer (passos de dalt) |
| Fitxa comarcal de l'Idescat | Tancar la decisió A3 (727 o 735 km²) | Pujar una captura o el PDF de la fitxa |

---

## G. F2 · Sistema visual: decisions i comprovacions

| Tema | Decisió | Per què |
|---|---|---|
| GSAP | 3.15.0 (abril de 2026), no 3.15.1 | La 3.15.1 tenia 13 dies quan la vaig instal·lar: millor una versió provada |
| Tipografies | Fraunces 600 als titulars i Inter al cos, totes dues en local | Fraunces és la del prototip. Només 2 famílies |
| Colors del pictograma (D1) | Verd `#006B47` (es mou) i gris `#7A9488` (no arriba al mínim) | Validats amb l'eina de la guia de visualització: separació per a daltonisme ΔE 16,2 (mín. 8), visió normal 18,9 (mín. 15), contrast ≥ 3:1. Els avisos de «croma» i de «banda de lluminositat» són per a paletes de sèries i aquí no apliquen: el gris ha de semblar gris |
| Pictograma (D1) | La figura que es mou camina i les quietes estan dretes | La postura codifica la dada: no depèn només del color |
| Etiquetes del mapa (D4) | Montseny, Montnegre, Gallecs i Caldes, situats per coordenades | Són «ubicacions indicatives» (ho diu el peu), no límits de parcs: no tinc les geometries oficials dels espais naturals |
| «372 km» (D4) | L'etiqueta diu «d'itineraris projectats per anar a peu i en bici» | La font diu que és una xarxa projectada per accedir als polígons. A les notes de l'orador ho recordo |

**Comprovat el 17-11-2026, obrint `index.html` amb `file://`:** 0 peticions externes · 0 errors de consola · cap text fora del llenç a 1920×1080, 1366×768 i 1024×768 · tots els contrastos per sobre del mínim, en mode clar i fosc (`eines/contrast.mjs`) · cap xifra escrita a mà a l'HTML (`eines/comprova.mjs`). Captures i vídeo a `qa/f2/`.
