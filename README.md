# 31-EDO Studio

A playable browser-based 31-tone equal temperament instrument inspired by a Liquid Glass macOS keyboard concept.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- Web Audio API
- Lucide React icons

## Features

- Full one-octave 31-EDO note set (31 labeled keys)
- Polyphonic real-time synthesis with smooth attack/release envelope
- Keep sounding toggle (latching behavior)
- Single / Interval / Chord modes
- Interval step + cents display in Interval mode
- Master volume, waveform selector, and root frequency control
- Stop All / Panic action and Escape key binding
- Touch, mouse, and keyboard (Enter/Space) support with ARIA labels
- Animated glassmorphism UI

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Tuning formula

`frequency = rootFrequency * 2 ** (step / 31)`

Default root: C step 0 = C4 = **261.625565 Hz**.
