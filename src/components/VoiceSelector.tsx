import { useStudioStore } from '../store/useStudioStore';
import { motion } from 'framer-motion';
export function VoiceSelector(){const {voices,selectedVoiceId,setVoice}=useStudioStore();return <div className='flex gap-2'>{voices.map(v=><motion.button whileTap={{scale:.96}} key={v.id} onClick={()=>setVoice(v.id)} className={`rounded-2xl px-3 py-2 border ${selectedVoiceId===v.id?'bg-white/70':'bg-white/30'} ${v.color}`}>{v.name}</motion.button>)}</div>;}
