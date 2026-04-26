# Romantic Harmony Generator

A Next.js App Router demo that generates **exactly 8-bar (2+2+4)** harmonic studies in Romantic styles.

## Stack
- Next.js App Router + React + TypeScript strict
- Tailwind CSS + lightweight shadcn-style UI primitives
- Framer Motion
- Jotai state
- React Hook Form + Zod
- OpenSheetMusicDisplay (MusicXML render)
- Tone.js playback
- Web Worker generation pipeline

## Features
- 10 composer profiles: Beethoven, Schubert, Hummel, Chopin, Mendelssohn, Schumann, Brahms, Wagner, Rachmaninoff, Scriabin
- Seeded deterministic generation
- Phrase form fixed to bars **1–2 / 3–4 / 5–8**
- Bass-schema-first generation, then sonority color, modulation, cadence, voice realization
- MusicXML 4.0 export and copy/download
- Notation rendering in browser and local playback
- Analysis panel: bass schema, cadence, modulation, warnings

## Run
```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Architecture
- `app/` routes
- `components/` UI and rendering
- `lib/harmony/` profiles + generator engine
- `lib/musicxml/` serializer
- `lib/audio/` Tone playback
- `lib/theory/` pitch + PRNG helpers
- `workers/harmonyWorker.ts` generation worker
- `types/music.ts` strict models

## Musical design notes
The generator is **not Roman-numeral lookup first**. It models:
- bass schemata and rule-of-octave variants
- cadential schemata and dominant fields
- partimento-pattern behavior
- style-specific modulation habits
- style-exception voice-leading checks

Roman numerals are included as optional annotation in common-practice profiles.
