# Presentació de la defensa · «Vallès Endins» (app Valia)

Estat: **F3 feta.** Hi ha les 16 diapositives (D0–D15) amb el sistema visual nou: fotos pròpies, targetes, captures del prototip i la mascota al sender. L'annex (F6) i les animacions avançades (F4) encara no hi són.

## Com obrir-la

1. Copieu la carpeta `presentacio/` sencera (o, més endavant, `dist/`) a l'USB.
2. Feu doble clic a `index.html`. S'obre amb Chrome o Edge i **no necessita internet**.
3. Premeu **F** per posar-la a pantalla completa.

## Tecles

| Tecla | Què fa |
|---|---|
| → · Av Pàg · espai | Següent pas o diapositiva (també amb el comandament de presentacions) |
| ← · Re Pàg | Pas o diapositiva anterior |
| **S** | Vista de l'orador: notes, cronòmetre i diapositiva següent (s'obre en una finestra nova) |
| **Esc** | Resum de totes les diapositives |
| **D** | Mode fosc o mode clar (per defecte, clar: els projectors renten els fons foscos) |
| **A** | Activar o desactivar les animacions (si l'ordinador del centre va lent) |
| **B** | Pantalla en negre |
| Inici · Fi | Primera o última diapositiva |

Si l'ordinador té activada l'opció «reduir el moviment», la presentació surt sense animacions.

## Com està feta

- **Una sola font de dades:** `dades/dades.json`. Cap xifra s'escriu a mà a l'HTML: les diapositives la llegeixen amb `data-d="clau"`, i el peu de font es construeix amb el camp `peu` de cada dada.
- **Notes de l'orador:** surten de `GUIO.md`.
- **Mascota:** és la figura articulada del prototip (`js/valia-rig.js`, extreta de `referencia/pwa/app.js`). Camina pel sender del peu a mesura que avança la presentació.
- **Llibreries locals** (`js/vendor/`): reveal.js 5.2.1 (MIT) i GSAP 3.15.0 (gratuïta amb tots els plugins; la llicència és la «Standard no charge», no de codi obert).
- **Tipografies locals** (`fonts/`): Fraunces i Inter (llicència OFL).

Després de canviar `dades.json` o `GUIO.md`, cal tornar a generar els fitxers derivats:

```bash
node eines/construeix.mjs
```

## Comprovacions

```bash
node eines/comprova.mjs
```

```bash
node eines/contrast.mjs
```

```bash
node eines/captura.mjs qa/f2 --fosc --video
```

- `comprova.mjs`: claus de dades, xifres escrites a mà i temps del guió.
- `contrast.mjs`: contrast WCAG de tots els colors, en mode clar i fosc.
- `captura.mjs`: captures de cada estat a 1920×1080, 1366×768 i 1024×768, obrint el fitxer amb `file://`. Registra les peticions externes i els errors de consola.

## Pla B

- Si la vista de l'orador (S) no s'obre, el navegador ha bloquejat la finestra emergent: permeteu-la o feu servir el guió imprès.
- Si l'ordinador va lent, premeu **A**.
- Si el navegador no obre l'HTML: obriu `Valia_defensa_TR.pdf` (16 pàgines, sense animacions).

## PDF de seguretat (DeckTape)

`?decktape` fa que la presentació es mostri en l'estat final, sense animacions:

```bash
npx decktape reveal --chrome-path /ruta/al/chrome --size 1920x1080 --pause 300 "file:///…/presentacio/index.html?decktape" Valia_defensa_TR.pdf
```
