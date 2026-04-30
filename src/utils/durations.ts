import { DurationName } from '../types/score';
export const DURATION_BEATS: Record<DurationName, number> = { whole: 4, half: 2, quarter: 1, eighth: 0.5, sixteenth: 0.25 };
export const durationToBeats = (d: DurationName, dotted: boolean) => DURATION_BEATS[d] * (dotted ? 1.5 : 1);
