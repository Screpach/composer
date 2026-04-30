import { motion } from 'framer-motion';
import { Volume2, Waves, RadioTower, AlertTriangle } from 'lucide-react';
import { type WaveType } from '../hooks/useAudioEngine';

export type Mode = 'single' | 'interval' | 'chord';

type Props = {
  keepSounding: boolean;
  setKeepSounding: (v: boolean) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  volume: number;
  setVolume: (n: number) => void;
  waveform: WaveType;
  setWaveform: (w: WaveType) => void;
  rootFrequency: number;
  setRootFrequency: (n: number) => void;
  stopAll: () => void;
};

export default function Controls(props: Props) { const {keepSounding,setKeepSounding,mode,setMode,volume,setVolume,waveform,setWaveform,rootFrequency,setRootFrequency,stopAll}=props;
  return <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-3">
      <div className="glass-panel flex items-center justify-between px-5 py-4"><span>Keep sounding</span><button role="switch" aria-checked={keepSounding} onClick={()=>setKeepSounding(!keepSounding)} className={`relative h-9 w-20 rounded-full transition ${keepSounding?'bg-blue-600':'bg-white/25'}`}><motion.span layout className="absolute top-1 h-7 w-7 rounded-full bg-white" style={{left:keepSounding?46:4}}/></button></div>
      <div className="glass-panel p-1 grid grid-cols-3">{(['single','interval','chord'] as Mode[]).map(m=><button key={m} onClick={()=>setMode(m)} className={`rounded-2xl py-3 capitalize ${mode===m?'bg-white/75 text-slate-800':'text-white/90'}`}>{m}</button>)}</div>
      <div className="glass-panel flex items-center justify-center gap-2"><RadioTower size={16}/>Tuning: 31-EDO</div>
    </div>
    <div className="grid gap-3 md:grid-cols-4">
      <label className="glass-panel flex items-center gap-2 px-3 py-2"><Volume2 size={16}/><input aria-label="Master volume" type="range" min={0} max={1} step={0.01} value={volume} onChange={e=>setVolume(Number(e.target.value))} className="w-full"/></label>
      <label className="glass-panel flex items-center gap-2 px-3 py-2"><Waves size={16}/><select aria-label="Waveform" value={waveform} onChange={e=>setWaveform(e.target.value as WaveType)} className="w-full bg-transparent outline-none"><option>sine</option><option>triangle</option><option>sawtooth</option><option>square</option></select></label>
      <label className="glass-panel flex items-center gap-2 px-3 py-2">C4 Hz<input aria-label="Root frequency" type="number" step="0.001" value={rootFrequency} onChange={e=>setRootFrequency(Number(e.target.value)||261.625565)} className="w-full rounded-lg bg-white/20 px-2 py-1"/></label>
      <button className="glass-panel flex items-center justify-center gap-2 px-4 py-2" onClick={stopAll}><AlertTriangle size={16}/>Stop All</button>
    </div>
  </div>;
}
