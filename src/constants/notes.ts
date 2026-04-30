export type NoteDef = {
  id: string;
  name: string;
  step: number;
  lane: string;
  row: number;
};

export const ROOT_FREQUENCY = 261.625565;

export const BASE_NOTES = [
  { id: 'C', name: 'C', step: 0, lane: 'C', row: 0 },
  { id: 'D', name: 'D', step: 5, lane: 'D', row: 0 },
  { id: 'E', name: 'E', step: 10, lane: 'E', row: 0 },
  { id: 'F', name: 'F', step: 13, lane: 'F', row: 0 },
  { id: 'G', name: 'G', step: 18, lane: 'G', row: 0 },
  { id: 'A', name: 'A', step: 23, lane: 'A', row: 0 },
  { id: 'B', name: 'B', step: 28, lane: 'B', row: 0 },
] satisfies NoteDef[];

export const STACK_NOTES = [
  { id: 'C#', name: 'C#', step: 2, lane: 'C', row: 1 },
  { id: 'Db', name: 'Db', step: 3, lane: 'C', row: 2 },
  { id: 'C##', name: 'C##', step: 4, lane: 'C', row: 3 },
  { id: 'Dbb', name: 'Dbb', step: 1, lane: 'C', row: 4 },
  { id: 'Eb', name: 'Eb', step: 8, lane: 'D', row: 1 },
  { id: 'D#', name: 'D#', step: 7, lane: 'D', row: 2 },
  { id: 'D##', name: 'D##', step: 9, lane: 'D', row: 3 },
  { id: 'Ebb', name: 'Ebb', step: 6, lane: 'D', row: 4 },
  { id: 'E#', name: 'E#', step: 12, lane: 'E-F', row: 1 },
  { id: 'Fb', name: 'Fb', step: 11, lane: 'E-F', row: 2 },
  { id: 'F#', name: 'F#', step: 15, lane: 'F', row: 1 },
  { id: 'Gb', name: 'Gb', step: 16, lane: 'F', row: 2 },
  { id: 'F##', name: 'F##', step: 17, lane: 'F', row: 3 },
  { id: 'Gbb', name: 'Gbb', step: 14, lane: 'F', row: 4 },
  { id: 'G#', name: 'G#', step: 20, lane: 'G', row: 1 },
  { id: 'Ab', name: 'Ab', step: 21, lane: 'G', row: 2 },
  { id: 'G##', name: 'G##', step: 22, lane: 'G', row: 3 },
  { id: 'Abb', name: 'Abb', step: 19, lane: 'G', row: 4 },
  { id: 'Bb', name: 'Bb', step: 26, lane: 'A', row: 1 },
  { id: 'A#', name: 'A#', step: 25, lane: 'A', row: 2 },
  { id: 'A##', name: 'A##', step: 27, lane: 'A', row: 3 },
  { id: 'Bbb', name: 'Bbb', step: 24, lane: 'A', row: 4 },
  { id: 'B#', name: 'B#', step: 30, lane: 'B', row: 1 },
  { id: 'Cb', name: 'Cb', step: 29, lane: 'B', row: 2 },
] satisfies NoteDef[];

export const ALL_NOTES = [...BASE_NOTES, ...STACK_NOTES];
export const LANES = ['C', 'D', 'E-F', 'F', 'G', 'A', 'B'] as const;

export const freqFromStep = (step: number, rootFrequency: number) => rootFrequency * 2 ** (step / 31);
