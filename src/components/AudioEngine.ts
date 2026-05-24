// Web Audio API Synthesizer for high-fidelity retro terminal sounds and biometrics
class AudioEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        // @ts-ignore
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
      } catch (e) {
        console.error('Web Audio API not supported', e);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle(enabled: boolean) {
    this.isEnabled = enabled;
    if (enabled) this.init();
  }

  // Brief retro system click sound
  playClick() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = Math.random() > 0.6 ? 'triangle' : 'sine';
    // Small high-freq snap
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Classic mechanical terminal keyboard typing click
  playTypeKeyPress() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400 + Math.random() * 200, now);
    osc.frequency.setValueAtTime(200, now + 0.02);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Low alert buzz for diagnostic Warnings/Error
  playAlertWarning() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.25);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Multi-frequency digital sweep sound for sweeps or boots
  playSweep() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Deep rhythmic dual pulse ("lub-dub") biometric heartbeat
  playHeartbeat(intensity: number = 1.0) {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreq = 50 + intensity * 5; // Deep sub-bass

    // 1. "Lub" Sound (first beat)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(30, now + 0.15);
    
    gain1.gain.setValueAtTime(0.5 * intensity, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.17);

    // 2. "Dub" Sound (second beat, slightly higher and offset by 150ms)
    setTimeout(() => {
      if (!this.isEnabled || !this.ctx) return;
      const tNow = this.ctx.currentTime;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 1.15, tNow);
      osc2.frequency.exponentialRampToValueAtTime(32, tNow + 0.18);
      
      gain2.gain.setValueAtTime(0.35 * intensity, tNow);
      gain2.gain.exponentialRampToValueAtTime(0.001, tNow + 0.19);
      
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      
      osc2.start(tNow);
      osc2.stop(tNow + 0.2);
    }, 160);
  }

  // Success arpeggio when decryption is complete
  playDecryptionSuccess() {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C arpeggio for bright resolve

    notes.forEach((freq, index) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const playTime = now + (index * 0.08);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, playTime);

      gain.gain.setValueAtTime(0.06, playTime);
      gain.gain.exponentialRampToValueAtTime(0.001, playTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(playTime);
      osc.stop(playTime + 0.3);
    });
  }
}

export const audioEngine = new AudioEngine();
