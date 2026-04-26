import type { AnalysisBlock, ChordEvent, GenerateOptions, HarmonyPlan, NoteEvent, Pitch, VoiceLine } from "@/types/music";
import { profiles } from "@/lib/harmony/profiles";
import { durationFromQuarter, keyCenter, midiToPitch, pitchToMidi, staffRangeClamp, toPitchString, transposePitch } from "@/lib/theory/pitch";
import { mulberry32, weightedChoice } from "@/lib/theory/prng";
import { serializeMusicXML } from "@/lib/musicxml/serialize";

const BAR_BEATS = 4;

function generateBassPlan(options: GenerateOptions): Pitch[] {
  const rand = mulberry32(options.seed + 17);
  const root = keyCenter(options.key, 2);
  const profile = profiles[options.composer];
  const pattern = weightedChoice(profile.bassSchemata.map((name) => ({ item: name, weight: 1 })), rand);

  const motions: Record<string, number[]> = {
    "rule-of-octave variant": [0, 2, 4, 5, 7, 5, 7, 0],
    "1-7-6-5": [0, -1, -3, -5, -3, -2, -1, 0],
    "circle of fifths": [0, -5, -10, -3, -8, -1, -6, 0],
    "chromatic descent": [0, -1, -2, -3, -4, -5, -6, -7],
    "C→F# field": [0, 6, 3, 9, 0, 6, 9, 1],
    default: [0, 2, 3, 5, 7, 6, 7, 0]
  };
  const selected = motions[pattern] ?? motions.default;
  return selected.map((i) => transposePitch(root, i));
}

function makeChordEvents(options: GenerateOptions, bassPlan: Pitch[]): ChordEvent[] {
  const rand = mulberry32(options.seed + 99);
  const profile = profiles[options.composer];
  const cadence = weightedChoice(profile.cadencePool.map((c) => ({ item: c.name, weight: c.weight })), rand);
  const modulation = weightedChoice(profile.modulationPool.map((m) => ({ item: m.name, weight: m.weight })), rand);

  return bassPlan.map((bass, idx) => {
    const sonority = weightedChoice(profile.sonorityPool.map((s) => ({ item: s.name, weight: s.weight + options.complexity / 3 })), rand);
    const bar = idx + 1;
    const phraseTag = bar <= 2 ? "opening" : bar <= 4 ? "response" : "continuation";
    const cadTag = bar >= 7 ? cadence : bar === 4 ? "half-cadence gesture" : undefined;
    const modTag = bar >= 3 ? modulation : "tonic-field";
    const label = `${sonority} @ ${toPitchString(bass)}`;
    const pcs = [pitchToMidi(bass) % 12, (pitchToMidi(bass) + 4) % 12, (pitchToMidi(bass) + 7) % 12];
    return {
      bar,
      beat: 1,
      duration: durationFromQuarter(BAR_BEATS),
      bassPitch: bass,
      sonorityType: sonority,
      pitchClasses: pcs,
      spelling: [toPitchString(bass)],
      label,
      romanOptional: options.composer === "scriabin" && options.complexity >= 4 ? undefined : ["I", "V", "vi", "ii", "Ger+6"][idx % 5],
      functionOptional: phraseTag,
      schemaTag: profile.bassSchemata[idx % profile.bassSchemata.length],
      cadenceTag: cadTag,
      modulationTag: modTag,
      composerTags: profile.dna
    };
  });
}

function realizeVoices(events: ChordEvent[], composer: GenerateOptions["composer"]): VoiceLine[] {
  const soprano: NoteEvent[] = [];
  const alto: NoteEvent[] = [];
  const tenor: NoteEvent[] = [];
  const bass: NoteEvent[] = [];

  for (const e of events) {
    const bMidi = pitchToMidi(e.bassPitch);
    const tMidi = staffRangeClamp(bMidi + 12, 48, 67);
    const aMidi = staffRangeClamp(bMidi + 17, 55, 74);
    const sMidi = staffRangeClamp(bMidi + 24 + (e.bar > 4 ? 2 : 0), 60, composer === "rachmaninoff" ? 88 : 81);
    const duration = durationFromQuarter(4);
    bass.push({ bar: e.bar, beat: 1, duration, pitch: midiToPitch(bMidi), voice: "bass" });
    tenor.push({ bar: e.bar, beat: 1, duration, pitch: midiToPitch(tMidi), voice: "tenor" });
    alto.push({ bar: e.bar, beat: 1, duration, pitch: midiToPitch(aMidi), voice: "alto" });
    soprano.push({ bar: e.bar, beat: 1, duration, pitch: midiToPitch(sMidi), voice: "soprano" });
  }

  return [
    { voice: "soprano", notes: soprano },
    { voice: "alto", notes: alto },
    { voice: "tenor", notes: tenor },
    { voice: "bass", notes: bass }
  ];
}

function voiceLeadingWarnings(voices: VoiceLine[], composer: GenerateOptions["composer"], complexity: number): string[] {
  const warnings: string[] = [];
  for (let i = 1; i < voices[0].notes.length; i += 1) {
    const prev = voices.map((v) => pitchToMidi(v.notes[i - 1].pitch));
    const curr = voices.map((v) => pitchToMidi(v.notes[i].pitch));
    const outerPrev = Math.abs(prev[0] - prev[3]) % 12;
    const outerCurr = Math.abs(curr[0] - curr[3]) % 12;
    if (outerPrev === 7 && outerCurr === 7 && composer !== "wagner" && composer !== "scriabin") warnings.push(`Bar ${i + 1}: potential parallel fifths in outer voices.`);
    if (complexity <= 2 && curr[0] - prev[0] > 7) warnings.push(`Bar ${i + 1}: soprano leap larger than preferred stepwise contour.`);
  }
  if (composer === "scriabin" && complexity >= 4) warnings.push("Late Scriabin mode: common-practice tendency-tone checks relaxed by style exception.");
  return warnings;
}

function makeAnalysis(options: GenerateOptions, events: ChordEvent[], warnings: string[]): AnalysisBlock {
  const profile = profiles[options.composer];
  return {
    overview: `8-bar study after ${profile.title} in ${options.key} ${options.mode}, phrase logic 2+2+4 with a weighted ${profile.dna[0]} focus.`,
    bassSchema: events.map((e) => `Bar ${e.bar}: ${e.schemaTag}`),
    chordRationale: events.map((e) => `Bar ${e.bar}: ${e.label}. Chosen from ${options.composer} compatibility pools.`),
    modulationPath: events.slice(2).map((e) => e.modulationTag).filter(Boolean).join(" → "),
    cadenceType: events[6].cadenceTag ?? "deferred cadence",
    voiceLeadingWarnings: warnings,
    decisions: events.map((e) => ({ bar: e.bar, decision: e.label, reason: `Aligned to ${e.schemaTag} and ${e.modulationTag}.` }))
  };
}

export function generateStudy(options: GenerateOptions): HarmonyPlan {
  const bassPlan = generateBassPlan(options);
  const events = makeChordEvents(options, bassPlan);
  const voices = realizeVoices(events, options.composer);
  const warnings = voiceLeadingWarnings(voices, options.composer, options.complexity);
  const melody = voices[0].notes;
  const analysis = makeAnalysis(options, events, warnings);

  const basePlan = {
    key: options.key,
    mode: options.mode,
    meter: "4/4",
    tempo: options.tempo,
    composer: options.composer,
    phraseShape: [2, 2, 4] as [2, 2, 4],
    events,
    melody,
    voices,
    analysis
  };

  const musicXml = serializeMusicXML(basePlan as Omit<HarmonyPlan, "musicXml">);
  return { ...basePlan, musicXml };
}
