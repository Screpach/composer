export type DurationName = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth';

export interface EdoNote {
  id: string;
  name: string;
  step: number;
  octave: number;
  frequency: number;
}

export interface ScoreEvent {
  id: string;
  type: 'note' | 'rest';
  voiceId: string;
  measureIndex: number;
  beat: number;
  duration: DurationName;
  dotted: boolean;
  tied: boolean;
  noteName?: string;
  step?: number;
  octave?: number;
  frequency?: number;
}

export interface Voice {
  id: string;
  name: string;
  color: string;
  clef: 'treble' | 'bass';
}

export interface Measure {
  index: number;
}

export interface EnteredNoteChip {
  id: string;
  name: string;
  step: number;
  voiceId: string;
  frequency: number;
}

export interface ScoreState {
  voices: Voice[];
  measures: Measure[];
  events: ScoreEvent[];
  selectedVoiceId: string;
  cursorMeasure: number;
  cursorBeat: number;
  selectedDuration: DurationName;
  octave: number;
  tempo: number;
  timeSignature: { beats: number; beatValue: number };
  stepEntry: boolean;
  keepSounding: boolean;
  restMode: boolean;
  dotted: boolean;
  tied: boolean;
  waveform: OscillatorType;
  masterVolume: number;
  activeNotes: string[];
  enteredNotes: EnteredNoteChip[];
  selectedEventId?: string;
  isPlaying: boolean;
  playheadBeat: number;
  history: ScoreSnapshot[];
  future: ScoreSnapshot[];
}

export type ScoreSnapshot = Pick<
  ScoreState,
  'events' | 'cursorMeasure' | 'cursorBeat' | 'measures' | 'enteredNotes'
>;
