import { useMemo } from 'react';
import { useStudioStore } from '../store/useStudioStore';

export function ScoreEditor(){const s=useStudioStore();const byVoice=useMemo(()=>s.voices.map(v=>s.events.filter(e=>e.voiceId===v.id)),[s.events,s.voices]);
return <div className='rounded-3xl bg-white/35 p-4 backdrop-blur min-h-[320px] overflow-auto'>
  <svg width={Math.max(900,s.measures.length*140)} height={260}>
    {s.voices.map((v,vi)=><g key={v.id}><text x={8} y={35+vi*55} className='fill-slate-700 text-xs'>{v.name}</text>{[0,1,2,3,4].map(l=><line key={l} x1={90} y1={20+vi*55+l*6} x2={90+s.measures.length*130} y2={20+vi*55+l*6} stroke='#94a3b8' strokeOpacity='0.6'/> )}</g>)}
    {s.measures.map((m,i)=><g key={i}><line x1={90+i*130} y1={20} x2={90+i*130} y2={240} stroke='#64748b'/><text x={95+i*130} y={14} fontSize='10'>{i+1}</text></g>)}
    {s.events.map((e)=>{const vi=s.voices.findIndex(v=>v.id===e.voiceId);const x=100+e.measureIndex*130+e.beat*30;const y=32+vi*55+(e.type==='rest'?18:((30-(e.step??0))%12));return <g key={e.id} onClick={()=>s.selectEvent(e.id)}><circle cx={x} cy={y} r={6} fill={s.selectedEventId===e.id?'#0ea5e9':'#334155'}/><text x={x-8} y={y-10} fontSize='8'>{e.noteName ?? 'R'} {e.step ?? ''}</text></g>;})}
    <rect x={100+s.cursorMeasure*130+s.cursorBeat*30} y={15} width={2} height={230} fill='#06b6d4'/>
  </svg></div>}
