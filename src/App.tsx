import { useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { TopToolbar } from './components/TopToolbar';
import { VoiceSelector } from './components/VoiceSelector';
import { NotationToolbar } from './components/NotationToolbar';
import { ScoreEditor } from './components/ScoreEditor';
import { EdoKeyboard } from './components/EdoKeyboard';
import { NoteEntryInspector } from './components/NoteEntryInspector';
import { EnteredNotesFooter } from './components/EnteredNotesFooter';
import { useStudioStore } from './store/useStudioStore';
import { audioEngine } from './audio/audioEngine';

export default function App() {
  const s = useStudioStore();
  const onStop=()=>{audioEngine.stopAll();s.setPlaying(false);};
  const onPlay=()=>{s.setPlaying(true);const events=[...s.events].sort((a,b)=>(a.measureIndex*4+a.beat)-(b.measureIndex*4+b.beat));const start=performance.now();const spb=60000/s.tempo;events.forEach(ev=>{if(ev.type==='note'&&ev.frequency){setTimeout(()=>audioEngine.play(`play-${ev.id}`,ev.frequency!,s.waveform,false),(ev.measureIndex*4+ev.beat)*spb);}});setTimeout(()=>s.setPlaying(false),(((events.length?events[events.length-1].measureIndex:0))*4+4)*spb+400);};
  useEffect(()=>{const h=(e:KeyboardEvent)=>{if(e.key==='Escape') onStop();if(e.key==='ArrowLeft') s.moveCursor(-1);if(e.key==='ArrowRight') s.moveCursor(1);if(['1','2','3','4'].includes(e.key)) s.setVoice(`v${e.key}`);};window.addEventListener('keydown',h);return ()=>window.removeEventListener('keydown',h);});
  return <AppShell><div className='mb-3 flex items-center justify-between'><div className='flex gap-2'><span className='size-3 rounded-full bg-red-400'/><span className='size-3 rounded-full bg-yellow-400'/><span className='size-3 rounded-full bg-green-400'/></div><div className='font-semibold'>31-EDO Studio · studio.31edo.app</div></div><TopToolbar onPlay={onPlay} onStop={onStop}/><div className='mt-3'><VoiceSelector/></div><div className='mt-3'><NotationToolbar/></div><div className='mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_300px]'><div className='space-y-3'><ScoreEditor/><EdoKeyboard/></div><NoteEntryInspector/></div><div className='mt-3'><EnteredNotesFooter/></div></AppShell>;
}
