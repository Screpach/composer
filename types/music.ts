export type ComposerId =
  | "beethoven"
  | "schubert"
  | "hummel"
  | "chopin"
  | "mendelssohn"
  | "schumann"
  | "brahms"
  | "wagner"
  | "rachmaninoff"
  | "scriabin";

export type Step = "C" | "D" | "E" | "F" | "G" | "A" | "B";

export type Pitch = {
  step: Step;
  alter: -2 | -1 | 0 | 1 | 2;
  octave: number;
};

export type DurationValue = "whole" | "half" | "quarter" | "eighth" | "dotted-quarter" | "dotted-half";

export type Duration = {
  divisions: number;
  value: DurationValue;
};

export type VoiceId = "soprano" | "alto" | "tenor" | "bass" | "rightHand" | "leftHand";

export type NoteEvent = {
  bar: number;
  beat: number;
  duration: Duration;
  pitch: Pitch;
  voice: VoiceId;
  tieStart?: boolean;
  tieEnd?: boolean;
};

export type ChordEvent = {
  bar: number;
  beat: number;
  duration: Duration;
  bassPitch: Pitch;
  sonorityType: string;
  pitchClasses: number[];
  spelling: string[];
  label: string;
  romanOptional?: string;
  functionOptional?: string;
  schemaTag: string;
  cadenceTag?: string;
  modulationTag?: string;
  composerTags: string[];
};

export type VoiceLine = {
  voice: VoiceId;
  notes: NoteEvent[];
};

export type AnalysisDecision = {
  bar: number;
  decision: string;
  reason: string;
};

export type AnalysisBlock = {
  overview: string;
  bassSchema: string[];
  chordRationale: string[];
  modulationPath: string;
  cadenceType: string;
  voiceLeadingWarnings: string[];
  decisions: AnalysisDecision[];
};

export type HarmonyPlan = {
  key: string;
  mode: "major" | "minor" | "auto";
  meter: string;
  tempo: number;
  composer: ComposerId;
  phraseShape: [2, 2, 4];
  events: ChordEvent[];
  melody: NoteEvent[];
  voices: VoiceLine[];
  analysis: AnalysisBlock;
  musicXml: string;
};

export type TextureId = "chorale" | "piano-reduction" | "grand-staff-arpeggiated" | "satb" | "bass-figures";

export type GenerateOptions = {
  composer: ComposerId;
  key: string;
  mode: "major" | "minor" | "auto";
  complexity: 1 | 2 | 3 | 4 | 5;
  texture: TextureId;
  tempo: number;
  seed: number;
};
