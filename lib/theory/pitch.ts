import type { Pitch, Step } from "@/types/music";

const STEP_TO_PC: Record<Step, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const STEPS: Step[] = ["C", "D", "E", "F", "G", "A", "B"];

export function pitchToMidi(p: Pitch): number {
  return (p.octave + 1) * 12 + STEP_TO_PC[p.step] + p.alter;
}

export function midiToPitch(midi: number): Pitch {
  const octave = Math.floor(midi / 12) - 1;
  const pc = ((midi % 12) + 12) % 12;
  const variants: Array<{ step: Step; alter: -2 | -1 | 0 | 1 | 2 }> = [
    { step: "C", alter: 0 },
    { step: "C", alter: 1 },
    { step: "D", alter: 0 },
    { step: "E", alter: -1 },
    { step: "E", alter: 0 },
    { step: "F", alter: 0 },
    { step: "F", alter: 1 },
    { step: "G", alter: 0 },
    { step: "A", alter: -1 },
    { step: "A", alter: 0 },
    { step: "B", alter: -1 },
    { step: "B", alter: 0 }
  ];
  return { ...variants[pc], octave };
}

export function transposePitch(pitch: Pitch, semitones: number): Pitch {
  return midiToPitch(pitchToMidi(pitch) + semitones);
}

export function toPitchString(pitch: Pitch): string {
  const accidental = pitch.alter === 0 ? "" : pitch.alter > 0 ? "#".repeat(pitch.alter) : "b".repeat(-pitch.alter);
  return `${pitch.step}${accidental}${pitch.octave}`;
}

export function keyCenter(key: string, octave = 3): Pitch {
  const normalized = key.replace("m", "");
  const step = normalized[0] as Step;
  const accidental = normalized.includes("#") ? 1 : normalized.includes("b") ? -1 : 0;
  return { step, alter: accidental as -1 | 0 | 1, octave };
}

export function durationFromQuarter(beats: number) {
  if (beats === 4) return { divisions: 4, value: "whole" as const };
  if (beats === 3) return { divisions: 4, value: "dotted-half" as const };
  if (beats === 2) return { divisions: 4, value: "half" as const };
  if (beats === 1.5) return { divisions: 4, value: "dotted-quarter" as const };
  if (beats === 1) return { divisions: 4, value: "quarter" as const };
  return { divisions: 4, value: "eighth" as const };
}

export function staffRangeClamp(midi: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, midi));
}

export function diatonicStepIndex(step: Step): number {
  return STEPS.indexOf(step);
}
