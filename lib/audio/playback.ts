import * as Tone from "tone";
import type { HarmonyPlan } from "@/types/music";
import { pitchToMidi } from "@/lib/theory/pitch";

let activePart: Tone.Part | null = null;
let synth: Tone.PolySynth | null = null;

export async function playPlan(plan: HarmonyPlan) {
  await Tone.start();
  Tone.Transport.cancel();
  Tone.Transport.bpm.value = plan.tempo;

  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, release: 0.5 }
    }).toDestination();
  }

  const notes = plan.voices.flatMap((v) =>
    v.notes.map((n) => ({
      time: `${n.bar - 1}:0:0`,
      note: Tone.Frequency(pitchToMidi(n.pitch), "midi").toNote(),
      dur: "1m"
    }))
  );

  activePart?.dispose();
  activePart = new Tone.Part((time, value: { note: string; dur: Tone.Unit.Time }) => {
    synth?.triggerAttackRelease(value.note, value.dur, time, 0.55);
  }, notes).start(0);

  Tone.Transport.start();
}

export function stopPlan() {
  Tone.Transport.stop();
  Tone.Transport.cancel();
}
