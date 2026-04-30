import { BASE_NOTES, STACK_NOTES, LANES, type NoteDef } from '../constants/notes';
import Key from './Key';

type Props = {
  activeSteps: Set<number>;
  onPress: (note: NoteDef) => void;
  onRelease: (note: NoteDef) => void;
};

export default function Keyboard({ activeSteps, onPress, onRelease }: Props) {
  return (
    <div className="mt-6 overflow-x-auto pb-3">
      <div className="min-w-[1000px]">
        <div className="mb-1 grid grid-cols-7 gap-3 px-2">
          {LANES.map((lane) => {
            const notes = STACK_NOTES.filter((n) => n.lane === lane).sort((a, b) => a.row - b.row);
            return (
              <div key={lane} className="flex flex-col-reverse gap-2">
                {notes.map((note) => (
                  <Key key={note.id} note={note} active={activeSteps.has(note.step)} onPress={onPress} onRelease={onRelease} />
                ))}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7 gap-3">
          {BASE_NOTES.map((note) => (
            <Key key={note.id} note={note} active={activeSteps.has(note.step)} onPress={onPress} onRelease={onRelease} large />
          ))}
        </div>
      </div>
    </div>
  );
}
