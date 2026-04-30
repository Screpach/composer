import { motion } from 'framer-motion';
import type { NoteDef } from '../constants/notes';

type Props = {
  note: NoteDef;
  active: boolean;
  large?: boolean;
  onPress: (note: NoteDef) => void;
  onRelease: (note: NoteDef) => void;
};

export default function Key({ note, active, large, onPress, onRelease }: Props) {
  return (
    <motion.button
      aria-label={`${note.name} step ${note.step}`}
      whileTap={{ scale: 0.97 }}
      animate={{ boxShadow: active ? '0 0 24px rgba(34,200,255,.6), inset 0 0 20px rgba(42,130,255,.4)' : '' }}
      className={`key-glass rounded-2xl border border-white/35 text-white/90 outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
        large ? 'h-64 text-5xl' : 'h-28 text-3xl'
      }`}
      onMouseDown={() => onPress(note)}
      onMouseUp={() => onRelease(note)}
      onMouseLeave={() => onRelease(note)}
      onTouchStart={(e) => {
        e.preventDefault();
        onPress(note);
      }}
      onTouchEnd={() => onRelease(note)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPress(note);
        }
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onRelease(note);
        }
      }}
    >
      <div className="flex h-full flex-col items-center justify-center">
        <span>{note.name}</span>
        <span className="text-2xl opacity-85">step {note.step}</span>
      </div>
    </motion.button>
  );
}
