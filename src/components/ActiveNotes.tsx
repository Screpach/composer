import { AnimatePresence, motion } from 'framer-motion';

type Active = { name: string; step: number; frequency: number };

export default function ActiveNotes({ notes }: { notes: Active[] }) {
  return (
    <div className="glass-panel mt-6 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="mr-1 font-semibold text-white/90">Active notes</span>
        <AnimatePresence>
          {notes.map((n, i) => (
            <motion.div key={n.step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: ['#8ce7ff', '#5dc8ff', '#ad8bff', '#6ea3ff'][i % 4] }} />
              <span>{n.name}</span><span className="opacity-75">step {n.step}</span><span className="opacity-75">{n.frequency.toFixed(2)} Hz</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
