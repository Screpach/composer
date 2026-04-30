export class AudioEngine {
  private ctx?: AudioContext;
  private gain?: GainNode;
  private notes = new Map<string, { osc: OscillatorNode; env: GainNode }>();
  private ensure() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.gain = this.ctx.createGain();
      this.gain.gain.value = 0.6;
      this.gain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }
  setVolume(v: number) { this.ensure(); if (this.gain) this.gain.gain.value = v; }
  play(id: string, frequency: number, waveform: OscillatorType, hold = false) {
    this.ensure();
    if (!this.ctx || !this.gain || this.notes.has(id)) return;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = waveform; osc.frequency.value = frequency;
    env.gain.setValueAtTime(0, this.ctx.currentTime);
    env.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.01);
    if (!hold) env.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);
    osc.connect(env); env.connect(this.gain); osc.start();
    if (!hold) osc.stop(this.ctx.currentTime + 0.4);
    this.notes.set(id, { osc, env });
    osc.onended = () => this.notes.delete(id);
  }
  stop(id: string) { const n=this.notes.get(id); if (!n||!this.ctx) return; n.env.gain.cancelScheduledValues(this.ctx.currentTime); n.env.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime+0.08); n.osc.stop(this.ctx.currentTime+0.1); }
  stopAll(){ [...this.notes.keys()].forEach((k)=>this.stop(k)); }
}
export const audioEngine = new AudioEngine();
