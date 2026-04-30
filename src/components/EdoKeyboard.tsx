import { KEY_LAYOUT } from '../constants/edo31';
import { useStudioStore } from '../store/useStudioStore';
import { stepToFrequency } from '../utils/frequency';
import { audioEngine } from '../audio/audioEngine';
import { EdoKey } from './EdoKey';

export function EdoKeyboard(){const s=useStudioStore();
const click=(name:string,step:number)=>{const f=stepToFrequency(step,s.octave);const id=`${name}-${s.octave}`;audioEngine.play(id,f,s.waveform,s.keepSounding);if(s.stepEntry&&!s.restMode) s.enterNote(name,step,f);};
return <div className='rounded-3xl bg-white/30 p-3'><div className='grid grid-cols-7 gap-2'>{KEY_LAYOUT.map(k=><div key={k.name+k.step} style={{gridColumn:k.col+1, gridRow:k.row+1}}><EdoKey label={`${k.name} · ${k.step}`} onClick={()=>click(k.name,k.step)} active={false}/></div>)}</div></div>}
