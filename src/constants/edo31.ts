export const ROOT_FREQUENCY = 261.625565;
export const ROOT_OCTAVE = 4;

export const VOICES = [
  { id: 'v1', name: 'Voice 1 • Top', color: 'text-cyan-400', clef: 'treble' as const },
  { id: 'v2', name: 'Voice 2 • 2nd', color: 'text-violet-400', clef: 'treble' as const },
  { id: 'v3', name: 'Voice 3 • 3rd', color: 'text-emerald-400', clef: 'treble' as const },
  { id: 'v4', name: 'Voice 4 • Bottom', color: 'text-amber-400', clef: 'bass' as const }
];

export const KEY_LAYOUT = [
  { name: 'C', step: 0, col: 0, row: 0 }, { name: 'D', step: 5, col: 1, row: 0 }, { name: 'E', step: 10, col: 2, row: 0 },
  { name: 'F', step: 13, col: 3, row: 0 }, { name: 'G', step: 18, col: 4, row: 0 }, { name: 'A', step: 23, col: 5, row: 0 },
  { name: 'B', step: 28, col: 6, row: 0 },
  { name: 'C#', step: 2, col: 0, row: 1 }, { name: 'Db', step: 3, col: 0, row: 2 }, { name: 'C##', step: 4, col: 0, row: 3 }, { name: 'Dbb', step: 1, col: 0, row: 4 },
  { name: 'Eb', step: 8, col: 1, row: 1 }, { name: 'D#', step: 7, col: 1, row: 2 }, { name: 'D##', step: 9, col: 1, row: 3 }, { name: 'Ebb', step: 6, col: 1, row: 4 },
  { name: 'E#', step: 12, col: 2, row: 2 }, { name: 'Fb', step: 11, col: 2, row: 3 },
  { name: 'F#', step: 15, col: 3, row: 1 }, { name: 'Gb', step: 16, col: 3, row: 2 }, { name: 'F##', step: 17, col: 3, row: 3 }, { name: 'Gbb', step: 14, col: 3, row: 4 },
  { name: 'G#', step: 20, col: 4, row: 1 }, { name: 'Ab', step: 21, col: 4, row: 2 }, { name: 'G##', step: 22, col: 4, row: 3 }, { name: 'Abb', step: 19, col: 4, row: 4 },
  { name: 'Bb', step: 26, col: 5, row: 1 }, { name: 'A#', step: 25, col: 5, row: 2 }, { name: 'A##', step: 27, col: 5, row: 3 }, { name: 'Bbb', step: 24, col: 5, row: 4 },
  { name: 'B#', step: 30, col: 6, row: 1 }, { name: 'Cb', step: 29, col: 6, row: 2 }
];
