# 31-EDO Studio

Interactive 31-tone equal temperament composition studio built with React + TypeScript + Vite.

## Install
- `npm install`

## Run dev
- `npm run dev`

## Build
- `npm run build`

## 31-EDO formula
`frequency = 261.625565 * 2 ** (((octave - 4) * 31 + step) / 31)` where C4 step 0 is the root.

## Editing workflow
1. Select voice and note duration.
2. Click a 31-EDO keyboard key to hear and insert a note.
3. Cursor advances automatically.
4. Use toolbar for rests, tie, dotted, delete, undo/redo, add measure, and clear.
5. Play/Stop controls schedule score playback.

## Shortcuts
- `1..4`: select voice
- `ArrowLeft/ArrowRight`: move cursor
- `Escape`: stop all

## Persistence
- Auto-saves to localStorage.
- Reload restores score.
- Inspector and footer controls remain interactive.

## Known limitations
- Notation renderer is a simplified SVG staff rather than full engraving.
- Tie/slur is stored in data model and toolbar state, with minimal visual rendering.
