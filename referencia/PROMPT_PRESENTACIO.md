# PROMPT MESTRE · PRESENTACIÓ DE LA DEFENSA DEL TR (VALIA)

> Còpia literal del prompt mestre que els autors van enviar el 14-11-2026, desada aquí el 17-11-2026 perquè el prompt de millora la cita com a `referencia/PROMPT_PRESENTACIO.md`. Les decisions tècniques continuen vigents. En cas de conflicte manen, per aquest ordre: normes del centre > Teoria.docx > skill `presentacions-projecte` > `PROMPT_MILLORA.md` > aquest fitxer.

## 0. Com treballaràs
- Treballa per fases (F0–F8). Al final de F1 i de F2, PARA i espera la meva aprovació.
- Abans de cada fase, digues en 3 línies què faràs. En acabar, digues què has fet, què has comprovat i què queda pendent.
- Mai inventis dades, xifres, cites ni referències. Si una dada no és a `referencia/`, posa [PENDENT] i afegeix-la a `PENDENTS.md`.
- Cost: 0 €. Només eines gratuïtes i de codi obert.
- Si tens una skill de disseny frontend disponible, fes-la servir.

## 1. Context
Som dos alumnes de 2n de Batxillerat. Hem de defensar el nostre Treball de Recerca davant d'un tribunal de 3 professors.
- Projecte: Valia (abans GreenVallès), una startup amb una app (PWA) de turisme actiu i sostenible al Vallès Oriental: rutes amb IA, gamificació, patrimoni, productes Km0, comerç de proximitat i l'Índex d'Impacte Territorial (IIT).
- Pregunta de recerca: «És viable la creació d'una empresa basada en una plataforma digital intel·ligent que promogui el turisme sostenible, l'activitat física i el comerç local al Vallès Oriental?»
- Hipòtesi principal i les 3 secundàries: copia-les literalment de `referencia/Teoria.docx`.
- Autor 1 (A1) = Turisme i Convenis: experiència d'usuari, rutes, convenis Km0.
- Autor 2 (A2) = Empresa, Economia i Màrqueting: viabilitat, costos i ingressos, màrqueting.
- Idea clau que ha de quedar clara: no competim amb Komoot, Wikiloc, AllTrails ni Google Maps. Connectem en una sola experiència (microaventures) el que avui està dispers.
- Eslògan: «El Vallès que encara no has viscut.» Tancament: «Surt. Explora. Suma.»
- App publicada: https://ufachord94.github.io/VALIA

## 2. Fitxers de referència (carpeta `referencia/`)
- `Teoria.docx`: versió vigent del TR. Mana sobre tot el contingut.
- `normes_centre.pdf`: normes i rúbrica de l'institut (si hi és, mana sobre l'apartat 3).
- `logo/`: logo i mascota (SVG o PNG).
- `fotos/`: fotos reals fetes per nosaltres. Són les ÚNIQUES fotos permeses.
- `captures/`: captures de la PWA.
- `video/valia_trailer_45s_1080p.mp4` i, si hi és, el projecte Remotion del tràiler a `trailer/`.
- `pwa/`: build de la PWA, per fer la demo sense internet.
Precedència: normes del centre > Teoria.docx > aquest prompt > la resta.

## 3. Normes de la defensa (recerca prèvia)
- Durada: la majoria de centres de Catalunya donen 15 minuts d'exposició com a màxim i després uns 5–10 minuts de preguntes. Alguns centres tallen l'exposició en arribar al límit. Objectiu: 13:30 ± 0:30.
- Tribunal de 3 professors amb rúbrica. Valora: obertura i tancament, ordre, síntesi, coherència amb el treball escrit, adequació al temps, llenguatge oral, suport visual i respostes a les preguntes.
- Llengua: català. Revisió ortogràfica obligatòria: els errors es magnifiquen en pantalla.
- Suport visual: més imatge que text. No és el treball escrit projectat.
- Els dos autors parlen un temps semblant (≈ 50/50).

## 4. Principis de disseny (no negociables)
1. Assertion-evidence: cada diapositiva té un titular en forma de FRASE (màxim 2 línies) que diu la conclusió, i a sota una evidència visual (gràfic, mapa, foto o esquema). Res de llistes de punts.
2. Una idea per diapositiva. Màxim ~20 paraules de text visible, sense comptar les etiquetes dels gràfics.
3. Fil narratiu híbrid: l'estructura acadèmica del TR (pregunta → hipòtesis → metodologia → resultats → conclusions) amb l'estructura d'un pitch de startup (problema → solució → per què ara → mercat → competència → producte → model de negoci → finances).
4. Cada animació explica alguna cosa: aparèixer per ordre, transformar, comparar o recórrer. Cap animació decorativa. Durada de 0,4 a 1,2 s. Res que es mogui mentre parlem.
5. Cada dada porta font i any al peu, en petit («Font: Idescat, 2025» o «Elaboració pròpia a partir de …»).
6. Llegible des del fons de l'aula amb projector. Base 1920×1080. Text mínim 28 px, titulars ≥ 52 px i xifres clau ≥ 120 px. Contrast ≥ 4,5:1, comprovat. Fons clar per defecte, perquè els projectors renten els colors foscos. Mode fosc opcional (tecla D).
7. Identitat de Valia:
   - Verds de la marca: bosc #0B3D2A, maragda #00A86B, menta #F1FBF6.
   - Text i enllaços en verd #006B47. El #00A86B NOMÉS amb text negre.
   - Tipografia: la del prototip (Fraunces per als titulars). Per al cos, la del prototip o Inter. Totes les fonts incrustades en local.
8. La mascota del logo és el fil conductor. Camina per la barra de progrés i presenta cada capítol, com al tràiler, sense robar protagonisme.
9. Prohibit: imatges generades per IA, fotos de Google o de bancs d'imatges sense llicència, clipart, emojis com a icones i més de 2 famílies tipogràfiques.

## 5. Tecnologia (decidida)
- reveal.js 5 (presentació HTML): auto-animate, fragments, vista de l'orador (tecla S) amb notes i cronòmetre, mode resum (Esc) i exportació a PDF.
- GSAP 3 (gratuït, amb tots els plugins):
  - DrawSVG per dibuixar el mapa i les rutes;
  - MotionPath perquè la mascota recorri la ruta;
  - Flip per fusionar 3 apps en 1;
  - SplitText per als titulars;
  - comptadors per a les xifres.
- Gràfics: SVG propi o Chart.js en local, animats, amb dades llegides de `dades/dades.json`.
- Mapes: límits comarcals i municipals de l'ICGC (CC BY 4.0, reconeixement obligatori) convertits a SVG. Sense tessel·les en directe.
- Vídeo: MP4 H.264 en local, mai des de YouTube. Si hi ha el projecte Remotion, crea una composició `TallPresentacio` de 15–20 s amb el millor del tràiler.
- QR: generat en local, cap a l'app publicada.
- Tot ha de funcionar SENSE INTERNET: cap CDN ni cap petició externa.
  - S'ha d'obrir amb doble clic a `index.html` des d'un USB (Chrome i Edge, Windows) i també amb un servidor local.
- Respecta `prefers-reduced-motion` i afegeix la tecla A per desactivar totes les animacions, per si l'ordinador del centre és lent.

## 6. Estructura (15 diapositives principals + annex)
Els temps són orientatius. Ajusta'ls a les dades reals del TR, però no superis 13:30 en total.

| # | Diapositiva | Qui | Temps | Element visual |
|---|---|---|---|---|
| 0 | Portada en bucle, mentre el tribunal s'asseu | — | 0:00 | Logo i mapa del Vallès que es dibuixen amb línia; títol, autors, tutor i curs |
| 1 | Ganxo | A1 | 0:40 | Eslògan amb SplitText + una dada impactant del TR (p. ex. activitat física dels joves, Zapico et al., 2023) |
| 2 | Pregunta de recerca i hipòtesis | A2 | 0:50 | Pregunta en gran; les 3 hipòtesis són 3 targetes que tornaran a la diapositiva 14 |
| 3 | Metodologia | A2 | 0:40 | Línia del temps animada de les fases: teoria, benchmarking, camp, prototip i pla econòmic |
| 4 | El territori | A1 | 1:00 | Mapa SVG que es dibuixa: 39 municipis, 727 km², Montseny, Montnegre-Corredor, Gallecs (733 ha), Caldes (74 °C) i xarxa de 372 km |
| 5 | El problema: tot està dispers | A1 | 0:50 | 3 o 4 mòbils amb apps diferents que es fusionen en 1 (Flip) |
| 6 | Benchmarking | A2 | 0:50 | Matriu de funcions que s'omple columna a columna; la de Valia és l'única completa |
| 7 | La solució: una microaventura | A1 | 1:10 | La mascota recorre una ruta real al mapa i s'atura a: patrimoni → productor Km0 → comerç → punts guanyats |
| 8 | Prototip en directe | A1 | 1:05 | Mòbil amb la PWA local (iframe) per a una demo de 3 passos; QR perquè el tribunal la provi; pla B: vídeo de 20 s |
| 9 | Investigació de camp | A1 | 1:00 | Resultats clau de les enquestes i entrevistes en gràfics que creixen, amb la mostra (n) i la data |
| 10 | Model de negoci | A2 | 1:00 | Canvas que s'omple bloc a bloc i ressalta segments i fonts d'ingressos |
| 11 | Viabilitat econòmica | A2 | 1:20 | 3 escenaris a 3 anys amb la línia del punt d'equilibri que es dibuixa; necessitat i fonts de finançament |
| 12 | Màrqueting i Branding Verd | A2 | 0:30 | Embut o calendari de llançament |
| 13 | Sostenibilitat i IIT | A1 | 1:00 | La fórmula de l'IIT es construeix peça a peça, amb un exemple calculat; reformulació honesta de «contaminació zero» |
| 14 | Conclusions | A2 | 1:10 | Les 3 targetes de la diapositiva 2 tornen (auto-animate) i reben un veredicte (verificada, parcialment verificada o no verificada) amb l'indicador que ho demostra |
| 15 | Tancament | A1 + A2 | 0:20 | «Surt. Explora. Suma.» + QR + agraïments |

Annex en diapositives verticals, que NO compten en el temps i serveixen per a les preguntes: taula de supòsits econòmics, DAFO i CAME, PESTEL, 5 forces de Porter, marc legal, càlcul complet de l'IIT, fitxa tècnica de l'enquesta, limitacions del treball, declaració d'ús d'IA i bibliografia en APA 7.

## 7. Regles de contingut
- Font única de dades: `dades/dades.json`. Cada valor porta `valor`, `unitat`, `any`, `font`, `url` i `estat` (verificat o PENDENT). Les diapositives llegeixen d'aquí: cap xifra escrita a mà a l'HTML.
- Extreu-ho tot de `Teoria.docx`. Si un apartat del TR encara no existeix (camp, model de negoci, finances, IIT o conclusions), crea la diapositiva amb [PENDENT] ben visible i llista exactament quines dades falten.
- «Contaminació zero»: no la presentis com un fet. Si el TR no l'ha reformulada, marca-ho com a risc a `PENDENTS.md` i proposa un titular defensable: impacte mínim mesurat + compensació.
- Hipòtesis: cada una amb la cadena hipòtesi → indicador → resultat. Si no hi ha resultat, no hi posis veredicte.
- Coherència terminològica amb el TR: microaventures, IIT, comerç de proximitat, Km0, turisme actiu, regeneració territorial.
- Català normatiu, registre acadèmic però natural, en primera persona del plural.
- Els comerços ficticis del prototip s'han d'indicar com a «exemple».
- Mapes de l'ICGC, al peu: «Elaboració pròpia a partir de dades de l'Institut Cartogràfic i Geològic de Catalunya (ICGC), sota llicència CC BY 4.0».

## 8. Notes de l'orador
Per a cada diapositiva:
- qui parla i quant de temps;
- el guió en 3–5 frases curtes, no un text per llegir;
- la frase de transició cap a la següent;
- una pregunta possible del tribunal.
Calcula el temps a 130 paraules per minut i avisa si alguna part se'n va.

## 9. Fases
- F0 · Inventari: llegeix tota la carpeta `referencia/`. Llista què hi ha, què hi falta i les contradiccions amb aquest prompt.
- F1 · Contingut i guió (STOP): crea `dades/dades.json`, `GUIO.md` i `PENDENTS.md`. `GUIO.md` porta, per a cada diapositiva: el titular-frase, l'evidència visual, qui parla, el temps i les notes. Espera la meva aprovació.
- F2 · Sistema visual (STOP): fes 3 diapositives de mostra (la portada, una de dades i una de mapa) amb l'estil final. Espera la meva aprovació.
- F3 · Construcció de totes les diapositives, sense animacions avançades.
- F4 · Animacions i transicions (GSAP i auto-animate), una per una, segons la taula.
- F5 · Multimèdia: tall del tràiler, demo local de la PWA, QR, mapa i ruta animada.
- F6 · Annex per a les preguntes.
- F7 · Control de qualitat i exportacions (apartat 10).
- F8 · Kit d'assaig:
  - `GUIO_BUTXACA.pdf`: 1 full per persona amb els temps i les paraules clau.
  - `PREGUNTES_TRIBUNAL.md`: 15 preguntes difícils amb una resposta curta. Inclou com a mínim: «contaminació zero», el realisme dels supòsits, per què una startup i no un projecte municipal, la competència de Wikiloc, el RGPD i l'ús d'IA en el TR.
  - Un mode assaig amb cronòmetre per diapositiva.

## 10. Control de qualitat (F7, obligatori)
- Captures de cada diapositiva (Playwright) a 1920×1080, 1366×768 i 1024×768 (projector 4:3): res tallat ni superposat.
- 0 peticions de xarxa externes (comprovat al registre de xarxa) i funciona obrint `index.html` amb `file://`.
- Contrast ≥ 4,5:1 en tots els textos i mida mínima respectada.
- Totes les xifres coincideixen amb `dades.json` i amb `Teoria.docx`. Cap [PENDENT] amagat.
- Ortografia catalana revisada, sense castellanismes.
- Temps total de les notes ≤ 13:30.
- Funciona amb el teclat, el ratolí i un comandament de presentacions (fletxes, Re Pàg i Av Pàg).
- Exporta `dist/` (la carpeta per a l'USB) i `Valia_defensa_TR.pdf` (amb DeckTape; és la versió de seguretat, sense animacions). Comprova que el PDF s'obre bé.

## 11. Lliurament
presentacio/
  index.html · css/ · js/ · fonts/ · media/ · dades/dades.json
  GUIO.md · PENDENTS.md · PREGUNTES_TRIBUNAL.md · GUIO_BUTXACA.pdf
  dist/ (per a l'USB) · Valia_defensa_TR.pdf
  LLEGEIX-ME.md (com obrir-la, tecles i pla B)
