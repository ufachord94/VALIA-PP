# PENDENTS · Presentació de la defensa del TR (Valia)

Estat: **F0 (inventari) acabada · F1 bloquejada** fins que arribi `referencia/Teoria.docx`.
Darrera actualització: 14-11-2026.

Llegenda: 🔴 bloqueja una fase · 🟠 risc davant del tribunal · 🟡 millora o comprovació.

---

## A. Fitxers que falten

| # | Què falta | Estat | Bloqueja | Què en necessito exactament |
|---|---|---|---|---|
| A1 | `referencia/Teoria.docx` | 🔴 No és a cap repositori | F1 sencera | Hipòtesi principal i 3 secundàries (literals), metodologia i fases, resultats de les enquestes i entrevistes (n, dates, preguntes), benchmarking, model de negoci (Canvas), pla econòmic (supòsits, 3 escenaris, punt d'equilibri, finançament), fórmula i exemple de l'IIT, DAFO/CAME, PESTEL, Porter, marc legal, conclusions, declaració d'ús d'IA i bibliografia |
| A2 | Dades de la portada | 🔴 No consten enlloc | F2 (portada) | Nom i cognoms dels dos autors (i qui és A1 i qui A2), tutor o tutora, institut, curs i data de la defensa |
| A3 | `referencia/normes_centre.pdf` | 🟠 No hi és | — | Sense això aplico l'apartat 3 del prompt (15 min màxim, objectiu 13:30). Si el centre talla abans o exigeix un format, cal saber-ho ara |
| A4 | `referencia/fotos/` | 🟠 Buida | Diapositives amb foto | Fotos pròpies. Les 17 imatges de `pwa/img/` són **provisionals** segons la guia del prototip («Les imatges dels llocs són provisionals») i d'origen no acreditat: no les faré servir a les diapositives |
| A5 | `referencia/video/valia_trailer_45s_1080p.mp4` i projecte Remotion | 🟠 No hi són | Pla B de la diapositiva 8 | El MP4 (H.264). Sense el projecte Remotion, el tall de 15–20 s el faig retallant el MP4 amb FFmpeg |
| A6 | `referencia/captures/` | 🟡 Buida | — | No cal: les genero amb Playwright des de `referencia/pwa/` |

Recuperat sense que calgui pujar-ho: la PWA (`referencia/pwa/`, de `ufachord94/VALIA@48f8ca3`) i el logo amb la mascota (`referencia/logo/`).

---

## B. Contradiccions entre el prompt i el material real

| # | El prompt diu | El que he trobat | Proposta |
|---|---|---|---|
| B1 | Superfície de la comarca: **727 km²** | El mòdul de mapa del vostre prototip calcula **735,7 km²** i cita «Idescat: 735 km²». La Cambra de Barcelona (2020) també dona 735 km². 727 no surt a cap font consultada | 🟠 Fer servir la xifra de l'Idescat i revisar què diu `Teoria.docx`. Pendent de llegir la fitxa de l'Idescat directament (amfitrió bloquejat per la xarxa de l'entorn) |
| B2 | App amb «rutes amb IA» | La guia del prototip diu: «**Simulat**: l'assistent respon per paraules clau. La IA real és la fase següent» | 🟠 A la defensa: «assistent simulat al prototip; IA real prevista a la fase següent». Dir «rutes amb IA» com a fet és atacable |
| B3 | Mapes amb límits de l'**ICGC** (CC BY 4.0) | El prototip fa servir límits d'**OpenStreetMap** (ODbL), amb Aiguafreda afegida a mà | 🟡 Per a les diapositives baixo els límits oficials de l'ICGC. Cal obrir l'accés de xarxa a `geoserveis.icgc.cat` |
| B4 | Tot ha de funcionar amb doble clic (`file://`) **i** la demo va en un `iframe` amb la PWA local | Amb `file://` la PWA carrega, però el **mapa real no** (Chrome bloqueja els mòduls ES i `fetch` en local). A més, el mapa demana tessel·les a internet | 🟠 Demo de 3 passos que no passi pel mapa (inici de sessió → xat → ruta guiada/recompenses), més un `obre.bat` opcional amb servidor local, més el vídeo com a pla B |
| B5 | Sense cap petició externa | La PWA demana la tipografia Inter a `fonts.googleapis.com` | 🟡 A la còpia de la demo, Inter en local |
| B6 | «Només eines gratuïtes i de codi obert» + GSAP 3 | GSAP 3.15.1 és gratuït amb tots els plugins (DrawSVG, MotionPath, Flip i SplitText inclosos), però la seva llicència («Standard no charge») **no és de codi obert** | 🟡 Mantinc GSAP perquè està decidit a l'apartat 5. Cost: 0 €. A la declaració d'eines s'ha de dir «gratuït», no «codi obert» |
| B7 | reveal.js 5 | La versió actual és la 6.0.2; la darrera 5.x és la 5.2.1 | 🟡 Faig servir la 5.2.1, com diu el prompt |
| B8 | Marca Valia | El compte de demostració del prototip és `jurat@greenvalles.cat` i la guia parla del TR «GreenVallès» | 🟡 Ho explico en una frase («abans GreenVallès») o es canvia al prototip |

---

## C. Xifres del prompt: contrast preliminar

Contrast fet amb cerca web, **pendent de llegir cada font primària i de comparar-ho amb `Teoria.docx`**. Cap d'aquestes xifres entra a `dades.json` com a «verificada» fins llavors.

| Dada del prompt | Resultat | Font trobada |
|---|---|---|
| 39 municipis | Coincideix | [Cambra de Barcelona, 2020](https://cambrabcn.org/wp-content/uploads/2024/01/ITDB_20_Valles-Oriental.pdf) |
| 727 km² | **No coincideix**: 735 km² | [Cambra de Barcelona, 2020](https://cambrabcn.org/wp-content/uploads/2024/01/ITDB_20_Valles-Oriental.pdf) · [Idescat, fitxa comarcal](https://www.idescat.cat/emex/?id=41) (no llegida) |
| Gallecs, 733 ha | Coincideix (733,52 ha). Atenció: la part inclosa al PEIN són 698,91 ha | [Diputació de Barcelona, Patrimoni Cultural](https://patrimonicultural.diba.cat/print/pdf/node/56879) |
| Caldes, 74 °C | Coincideix. Altres fonts donen 76 °C | [Patrimoni Cultural, Generalitat](https://patrimoni.gencat.cat/en/collection/caldes-de-montbui-aquae-calidae) |
| Xarxa de 372 km | **[PENDENT]**: no l'he trobat a cap font | Cal la font que cita el TR |
| Zapico et al. (2023), activitat física dels joves | **[PENDENT]**: l'estudi existeix, però no en tinc la xifra ni la cita exacta | Cal la cita del TR |

---

## D. Riscos de contingut que s'han de resoldre amb el TR al davant

| # | Risc | Per què importa |
|---|---|---|
| D1 | 🟠 «Contaminació zero» | No puc saber si el TR l'ha reformulada. Titular defensable proposat: «Impacte mínim, mesurat i compensat». S'ha de tancar a F1 |
| D2 | 🟠 Factors de CO₂ del prototip | La guia del prototip diu que són «d'exemple (pendents de fonts oficials)». Si l'IIT de la diapositiva 13 es calcula amb aquests factors, el tribunal ho pot tombar |
| D3 | 🟠 Convenis Km0 | El prototip diu: «Establiments adherits: pendents dels convenis Km0». A les diapositives 7 i 10, els comerços s'han de marcar com a «exemple» |
| D4 | 🟠 Veredicte de les hipòtesis | Sense resultats al TR no hi haurà veredicte a la diapositiva 14: només la cadena hipòtesi → indicador → [PENDENT] |
| D5 | 🟡 Temps | La taula del prompt suma 13:25 (A1 ≈ 6:55, A2 ≈ 6:30). Punts tibants: la demo en directe (1:05) i la viabilitat econòmica (1:20) |

---

## E. Accés de xarxa pendent d'aprovar

| Amfitrió | Per a què | Estat |
|---|---|---|
| `geoserveis.icgc.cat` | Baixar els límits comarcals i municipals oficials (ICGC, CC BY 4.0) | Bloquejat per la xarxa de l'entorn |
| `www.idescat.cat` | Llegir les xifres oficials de la comarca | Bloquejat per la xarxa de l'entorn |
