import { motion } from 'framer-motion';
export function EdoKey({label,onClick,active}:{label:string;onClick:()=>void;active:boolean}){return <motion.button whileTap={{scale:.95}} onClick={onClick} aria-label={label} className={`rounded-xl border px-2 py-1 text-xs ${active?'bg-cyan-300 shadow-glow':'bg-white/50'}`}>{label}</motion.button>}
