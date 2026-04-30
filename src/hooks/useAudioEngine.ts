import { useCallback, useRef } from 'react';

export type WaveType = OscillatorType;

type Voice = {
  osc: OscillatorNode;
  gain: GainNode;
};

const ATTACK = 0.015;
const RELEASE = 0.14;

export function useAudioEngine() {
  const ctxRef = useRef<AudioContext | null>(null);
  const voices = useRef<Map<number, Voice>>(new Map());
  const masterRef = useRef<GainNode | null>(null);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
      masterRef.current = ctxRef.current.createGain();
      masterRef.current.gain.value = 0.3;
      masterRef.current.connect(ctxRef.current.destination);
    }
    if (ctxRef.current.state === 'suspended') {
      void ctxRef.current.resume();
    }
    return { ctx: ctxRef.current, master: masterRef.current! };
  }, []);

  const startNote = useCallback((step: number, frequency: number, waveform: WaveType) => {
    if (voices.current.has(step)) return;
    const { ctx, master } = ensureCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveform;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(1, ctx.currentTime + ATTACK);
    osc.connect(gain);
    gain.connect(master);
    osc.start();
    voices.current.set(step, { osc, gain });
  }, [ensureCtx]);

  const stopNote = useCallback((step: number) => {
    const voice = voices.current.get(step);
    const ctx = ctxRef.current;
    if (!voice || !ctx) return;
    const now = ctx.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + RELEASE);
    voice.osc.stop(now + RELEASE + 0.02);
    voices.current.delete(step);
  }, []);

  const stopAll = useCallback(() => {
    [...voices.current.keys()].forEach((step) => stopNote(step));
  }, [stopNote]);

  const setMasterVolume = useCallback((value: number) => {
    const master = masterRef.current;
    const ctx = ctxRef.current;
    if (!master || !ctx) return;
    master.gain.setTargetAtTime(value, ctx.currentTime, 0.05);
  }, []);

  return { startNote, stopNote, stopAll, setMasterVolume };
}
