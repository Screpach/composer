import { ROOT_FREQUENCY, ROOT_OCTAVE } from '../constants/edo31';

export const stepToFrequency = (step: number, octave: number) => ROOT_FREQUENCY * 2 ** (((octave - ROOT_OCTAVE) * 31 + step) / 31);
