# MILLORA DE LA PRESENTACIÓ DE LA DEFENSA DEL TR (VALIA) AMB LA SKILL presentacions-projecte

> Còpia literal del prompt de millora enviat pels autors el 17-11-2026. És el prompt vigent. Precedència: normes del centre > Teoria.docx > skill > aquest prompt > `PROMPT_PRESENTACIO.md` > la resta.

## 0. Objectiu
Porta la presentació de la defensa del nostre TR a la nota màxima:
- 30/30 a la rúbrica de la skill (R1–R10, de 0 a 3 cadascun);
- el màxim a cada criteri de la rúbrica del centre.
Si alguna cosa impedeix el màxim (dades pendents o apartats del TR encara no escrits), no la dissimulis: digues exactament què falta.

## 1. Què has de fer servir
1. La skill `presentacions-projecte`: carrega-la abans de res i segueix-ne el flux. Si no està disponible, aplica l'apartat 4 d'aquest prompt, que en resumeix les regles.
2. Les skills `frontend-design` (pàgines HTML) i `dataviz` (abans del primer gràfic), si hi són.
3. Tots aquests fitxers:
   - `presentacio/` sencera, si ja existeix: index.html, css/, js/, dades/dades.json, GUIO.md, PENDENTS.md, PREGUNTES_TRIBUNAL.md.
   - `referencia/PROMPT_PRESENTACIO.md`: el prompt mestre anterior. Les seves decisions tècniques continuen vigents (reveal.js 5 + GSAP 3, sense internet, PDF amb DeckTape, dades.json, identitat de Valia, fotos reals).
   - `referencia/Teoria.docx`: mana sobre el contingut.
   - `referencia/normes_centre.pdf` i la rúbrica del centre: manen sobre el format i el temps.
   - `referencia/`: logo, mascota, fotos, captures, tràiler i build de la PWA.
Precedència: normes del centre > Teoria.docx > skill > aquest prompt > prompt mestre anterior > la resta.
Si `presentacio/` no existeix, construeix-la de zero amb el prompt mestre anterior + aquest prompt.

## 2. Com treballaràs
- Fases M0–M7. PARA i espera la meva aprovació al final de M2 i de M3.
- Abans de cada fase, 3 línies del que faràs. En acabar: què has fet, què has comprovat i què queda pendent.
- No inventis cap dada, xifra, cita ni referència. Si falta, [PENDENT DE VERIFICAR] visible a la pantalla i a PENDENTS.md.
- No reescriguis el que ja puntua 3: millora només el que baixa la nota.
- Cost 0 €.

## 3. Fases
M0 · Inventari i entorn
- Llista els fitxers, què hi falta i les contradiccions entre ells.
- Comprova les eines: Node, Playwright, DeckTape, ffmpeg i les skills.

M1 · Diagnosi (nota de partida)
- Puntua la presentació actual amb la rúbrica de la skill (R1–R10) i amb la del centre.
- Taula: criteri | nota | pantalla on es veu | per què | què cal per al màxim.
- Fes que un subagent que no hagi vist la feina també la puntuï. Si les notes no coincideixen, explica per què.

M2 · Brífing i concepte (passos 1 i 2 de la skill) · STOP
- Fitxa de 6 línies: objectiu, públic, context i durada, mitjà, material, missatge únic.
- Perfil P3 (acadèmic), amb els blocs de viabilitat del P2.
- Missatge únic: proposa'n un. Candidat del TR (apartat 4.5): «No volem crear una altra aplicació de rutes, sinó aprofitar les rutes per connectar les persones amb tot allò que ofereix el territori.» Escurça'l a ≤ 15 paraules sense canviar-ne el sentit.
- 2–3 conceptes amb la taula de la skill i UNA recomanació. Aplica les regles de prioritat:
  - Si les normes exigeixen PowerPoint: .pptx (skill pptx) amb les mecàniques a dins. Si no: presentació HTML cinematogràfica.
  - El missatge és espacial: el mapa del Vallès Oriental és la columna vertebral. Cada capítol hi torna i fa zoom a un lloc.
  - Hi ha supòsits financers discutibles: simulador d'escenaris (usuaris, conversió, comissions). Els 3 escenaris ja calculats es veuen sense clicar.
  - Hi ha prototip: demo de ≤ 90 s amb un vídeo com a pla B.
  - La sala pot no tenir internet: tot en local + PDF.
  - Si hi ha públic (alumnes): 1 pregunta «prediu-ho» a mà alçada, amb la resposta a la pantalla següent. Sense eines de votació en línia.

M3 · Arc i sistema visual (passos 3 i 4) · STOP
- Taula: # | titular-frase | evidència | apartat | qui parla | temps | mecànica.
- Llegeix tots els titulars seguits: han d'explicar la història sols. Si un no es pot escriure, l'apartat no està madur: marca'l com a pendent.
- Annex de preguntes: supòsits, mètode, càlculs i fonts.
- Fitxa del sistema visual (8–10 línies) amb un motiu gràfic que neixi del projecte (p. ex. el traç d'una ruta o les corbes de nivell del Vallès) i 3 pantalles de mostra.

M4 · Producció (pas 5): aplica els canvis aprovats.
M5 · Preparació (pas 6): apartat 5 d'aquest prompt.
M6 · Revisió (pas 7):
- Torna a puntuar, amb un subagent independent.
- Repeteix fins a 30/30 o fins que només quedin bloquejos de dades.
- Obre la font de cada xifra per verificar-la.
M7 · Lliurament: `INFORME_MILLORA.md` (apartat 6).

## 4. Regles (resum de la skill i correccions al prompt anterior)
Disseny:
- Cada pantalla: titular-frase (≤ 2 línies) + evidència visual. Una idea, ≤ 4 blocs visibles, ≤ 20 paraules.
- No posis a la pantalla el que diem en veu alta. Etiquetes al costat de les dades, no llegendes.
- La conclusió mai depèn d'un clic: la interacció només aprofundeix.
- Contrast narratiu entre «el que és» i «el que podria ser» (p. ex. la ruta d'avui repartida en 3 apps → la mateixa ruta a Valia).
- Ritme: alterna xifra gran · gràfic · foto real · pausa amb frase. Mai la mateixa composició més de 2 vegades seguides.
- Moviment de 0,4 a 1,2 s, només si explica alguna cosa. Respecta `prefers-reduced-motion`.
- No facis servir mites: piràmide de l'aprenentatge, «8 segons d'atenció», «l'atenció cau als 10 minuts» ni «7 ± 2».
Contingut obligatori (P3 + P2):
- Ganxo amb el missatge únic en ≤ 60 s.
- Pregunta de recerca i hipòtesis copiades literalment de Teoria.docx.
- Metodologia amb la mostra (n) i les dates.
- Cada hipòtesi → indicador → resultat → veredicte. Les hipòtesis tornen al final amb el veredicte.
- Resposta explícita a la pregunta de recerca, en una frase.
- Limitacions del treball en una pantalla del cos principal, no només a l'annex.
- Ús d'IA declarat, igual que al TR.
- Viabilitat tècnica, comercial, econòmica i financera; inversió inicial i fonts; 3 escenaris a 3 anys; punt d'equilibri; 3 riscos amb la seva mitigació.
- «Contaminació zero»: tal com la formuli el TR. Si no s'ha reformulat, titular honest (impacte mínim mesurat + compensació) i avís a PENDENTS.md.
- Tancament: repeteix el missatge únic + QR. Cap pantalla de «Gràcies» ni de «Preguntes?».
Temps:
- Notes a 130 paraules per minut. Total ≤ 90 % del temps (15 min → 13:30). Repartiment entre els dos autors ≈ 50/50.

## 5. Lliuraments
1. Presentació en directe: `index.html` sense internet, `dist/` per a l'USB i PDF de seguretat.
2. Versió per llegir sola, per enviar al tribunal: slidedoc de 12–15 pàgines (PDF) + one-pager A4 amb QR.
3. Notes de l'orador per pantalla: qui parla, temps, 3–5 frases clau, transició i una pregunta probable.
4. `PREGUNTES_TRIBUNAL.md`: 10–15 preguntes difícils amb una resposta de 2–3 frases i la pantalla d'annex que la recolza. Inclou: el supòsit més feble, la competència (Wikiloc, Komoot), el risc principal, l'afirmació més absoluta, per què una startup i no un servei municipal, el RGPD i l'ús d'IA.
5. Pla B tècnic: vídeo de la demo, PDF i còpia a l'USB.
6. Mode assaig amb cronòmetre per pantalla.

## 6. Verificació i informe
Abans d'entregar:
- Captures amb Playwright a 1920×1080, 1366×768 i 1024×768: res tallat ni superposat.
- 0 peticions externes i funciona amb `file://`.
- Contrast ≥ 4,5:1. Cos ≥ 28 px, titulars 52–64 px, xifres clau ≥ 120 px.
- Cada xifra coincideix amb dades.json i amb Teoria.docx.
- Ortografia catalana sense castellanismes.
`INFORME_MILLORA.md`:
- Rúbrica abans i després, criteri per criteri, amb la pantalla que ho demostra.
- Llista de canvis fets.
- Què impedeix encara el 10 i qui ho ha de resoldre (nosaltres o tu).
Al final, ofereix-te a fer de tribunal: fes-nos les preguntes una a una i valora les respostes.
