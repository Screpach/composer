import { create } from 'zustand';
import { produce } from 'immer';
import { VOICES } from '../constants/edo31';
import { DurationName, ScoreEvent, ScoreState } from '../types/score';
import { durationToBeats } from '../utils/durations';
import { loadState, saveState } from '../utils/storage';

const id = () => crypto.randomUUID();
const base = (): ScoreState => ({
  voices: VOICES,
  measures: Array.from({ length: 6 }, (_, index) => ({ index })),
  events: [], selectedVoiceId: 'v1', cursorMeasure: 0, cursorBeat: 0, selectedDuration: 'quarter', octave: 4, tempo: 120,
  timeSignature: { beats: 4, beatValue: 4 }, stepEntry: true, keepSounding: false, restMode: false, dotted: false, tied: false,
  waveform: 'triangle', masterVolume: 0.6, activeNotes: [], enteredNotes: [], isPlaying: false, playheadBeat: 0, history: [], future: []
});

type Actions = {
  setVoice: (id: string) => void; setDuration: (d: DurationName) => void; setTempo: (n: number) => void; setOctave: (n: number) => void;
  toggle: (k: 'stepEntry'|'keepSounding'|'restMode'|'dotted'|'tied')=>void; setWaveform:(w:OscillatorType)=>void; setVolume:(v:number)=>void;
  enterNote:(name:string,step:number,frequency:number)=>void; insertRest:()=>void; undo:()=>void; redo:()=>void; moveCursor:(delta:number)=>void;
  addMeasure:()=>void; clear:()=>void; deleteSelected:()=>void; selectEvent:(id?:string)=>void; setPlaying:(v:boolean)=>void; setPlayhead:(b:number)=>void;
  importState:(s:ScoreState)=>void; resetDemo:()=>void; clearEntered:()=>void;
};

export const useStudioStore = create<ScoreState & Actions>((set, get) => ({ ...((loadState() as ScoreState) ?? base()),
  setVoice:(v)=>set({selectedVoiceId:v}), setDuration:(d)=>set({selectedDuration:d}), setTempo:(tempo)=>set({tempo}), setOctave:(octave)=>set({octave}),
  toggle:(k)=>set((s)=>({[k]:!s[k]} as Partial<ScoreState>)), setWaveform:(waveform)=>set({waveform}), setVolume:(masterVolume)=>set({masterVolume}),
  selectEvent:(selectedEventId)=>set({selectedEventId}), setPlaying:(isPlaying)=>set({isPlaying}), setPlayhead:(playheadBeat)=>set({playheadBeat}),
  enterNote:(name,step,frequency)=>set(produce((s:ScoreState)=>{const ev:ScoreEvent={id:id(),type:'note',voiceId:s.selectedVoiceId,measureIndex:s.cursorMeasure,beat:s.cursorBeat,duration:s.selectedDuration,dotted:s.dotted,tied:s.tied,noteName:name,step,octave:s.octave,frequency};s.history.push({events:s.events, cursorMeasure:s.cursorMeasure,cursorBeat:s.cursorBeat,measures:s.measures,enteredNotes:s.enteredNotes}); s.events=[...s.events,ev]; s.enteredNotes=[{id:id(),name,step,voiceId:s.selectedVoiceId,frequency},...s.enteredNotes].slice(0,20); const jump=durationToBeats(s.selectedDuration,s.dotted); let b=s.cursorBeat+jump,m=s.cursorMeasure; while(b>=4){b-=4;m++; if(m>=s.measures.length) s.measures.push({index:s.measures.length});} s.cursorBeat=b; s.cursorMeasure=m; s.future=[]; })),
  insertRest:()=>set(produce((s:ScoreState)=>{const ev:ScoreEvent={id:id(),type:'rest',voiceId:s.selectedVoiceId,measureIndex:s.cursorMeasure,beat:s.cursorBeat,duration:s.selectedDuration,dotted:s.dotted,tied:false}; s.events=[...s.events,ev];})),
  undo:()=>set(produce((s:ScoreState)=>{const prev=s.history.pop(); if(!prev) return; s.future.push({events:s.events,cursorMeasure:s.cursorMeasure,cursorBeat:s.cursorBeat,measures:s.measures,enteredNotes:s.enteredNotes}); Object.assign(s,prev);})),
  redo:()=>set(produce((s:ScoreState)=>{const next=s.future.pop(); if(!next) return; s.history.push({events:s.events,cursorMeasure:s.cursorMeasure,cursorBeat:s.cursorBeat,measures:s.measures,enteredNotes:s.enteredNotes}); Object.assign(s,next);})),
  moveCursor:(d)=>set(produce((s:ScoreState)=>{let total=s.cursorMeasure*4+s.cursorBeat+d; if(total<0) total=0; s.cursorMeasure=Math.floor(total/4); while(s.cursorMeasure>=s.measures.length) s.measures.push({index:s.measures.length}); s.cursorBeat=total%4;})),
  addMeasure:()=>set((s)=>({measures:[...s.measures,{index:s.measures.length}]})),
  clear:()=>set(base()), deleteSelected:()=>set(produce((s:ScoreState)=>{if(!s.selectedEventId) return; s.events=s.events.filter(e=>e.id!==s.selectedEventId); s.selectedEventId=undefined;})),
  importState:(s)=>set({...s}), resetDemo:()=>set(base()), clearEntered:()=>set({enteredNotes:[]})
}));

useStudioStore.subscribe((s)=>saveState(s));
