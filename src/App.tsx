import { useEffect, useMemo, useState } from 'react';
import Controls, { type Mode } from './components/Controls';
import Keyboard from './components/Keyboard';
import ActiveNotes from './components/ActiveNotes';
import { ALL_NOTES, ROOT_FREQUENCY, freqFromStep, type NoteDef } from './constants/notes';
import { useAudioEngine, type WaveType } from './hooks/useAudioEngine';

export default function App() {
  const [keepSounding, setKeepSounding] = useState(false);
  const [mode, setMode] = useState<Mode>('single');
  const [activeSteps, setActiveSteps] = useState<Set<number>>(new Set());
  const [volume, setVolume] = useState(0.3);
  const [waveform, setWaveform] = useState<WaveType>('sine');
  const [rootFrequency, setRootFrequency] = useState(ROOT_FREQUENCY);
  const { startNote, stopNote, stopAll, setMasterVolume } = useAudioEngine();

  useEffect(() => setMasterVolume(volume), [volume, setMasterVolume]);

  const engage = (note: NoteDef, shift = false) => {
    const step = note.step;
    const freq = freqFromStep(step, rootFrequency);
    setActiveSteps((prev) => {
      const next = new Set(prev);
      if (mode === 'single') {
        if (keepSounding) {
          if (next.has(step)) {
            next.delete(step); stopNote(step);
          } else {
            if (!shift) { next.forEach((s) => stopNote(s)); next.clear(); }
            next.add(step); startNote(step, freq, waveform);
          }
        } else {
          next.forEach((s) => stopNote(s)); next.clear();
          next.add(step); startNote(step, freq, waveform);
        }
      } else if (mode === 'interval') {
        if (next.has(step)) { next.delete(step); stopNote(step); }
        else {
          if (next.size >= 2) { const first = [...next][0]; next.delete(first); stopNote(first); }
          next.add(step); startNote(step, freq, waveform);
        }
      } else {
        if (next.has(step)) { next.delete(step); stopNote(step); }
        else { next.add(step); startNote(step, freq, waveform); }
      }
      return next;
    });
  };

  const release = (note: NoteDef) => {
    if (keepSounding) return;
    if (mode === 'single') {
      setActiveSteps((prev) => {
        const next = new Set(prev);
        if (next.delete(note.step)) stopNote(note.step);
        return next;
      });
    }
  };

  const clearAll = () => { stopAll(); setActiveSteps(new Set()); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') clearAll(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const activeNotes = useMemo(() => ALL_NOTES.filter((n) => activeSteps.has(n.step)).sort((a, b) => a.step - b.step).map((n) => ({ ...n, frequency: freqFromStep(n.step, rootFrequency) })), [activeSteps, rootFrequency]);
  const interval = mode === 'interval' && activeNotes.length === 2 ? activeNotes[1].step - activeNotes[0].step : null;

  return <main className="min-h-screen bg-gradient-to-br from-orange-200 via-sky-400 to-blue-900 p-4 md:p-8 text-white">
    <div className="mx-auto max-w-[1280px] rounded-[2rem] border border-white/35 bg-white/15 p-5 shadow-glass backdrop-blur-2xl md:p-8">
      <div className="mb-4 flex items-center justify-between"><div className="flex gap-2"><span className="dot bg-red-400"/><span className="dot bg-yellow-400"/><span className="dot bg-green-400"/></div><h1 className="text-4xl font-medium">31-EDO Studio</h1><span/></div>
      <Controls keepSounding={keepSounding} setKeepSounding={setKeepSounding} mode={mode} setMode={setMode} volume={volume} setVolume={setVolume} waveform={waveform} setWaveform={setWaveform} rootFrequency={rootFrequency} setRootFrequency={setRootFrequency} stopAll={clearAll} />
      {interval !== null && <div className="mt-3 rounded-xl bg-white/10 px-3 py-2">Interval: {interval} steps ({((interval * 1200) / 31).toFixed(2)} cents)</div>}
      <Keyboard activeSteps={activeSteps} onPress={(n) => engage(n, (window.event as MouseEvent | undefined)?.shiftKey)} onRelease={release} />
      <ActiveNotes notes={activeNotes} />
    </div>
  </main>;
}
