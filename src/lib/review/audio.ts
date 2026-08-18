class SoundSynth {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  private createNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  public playMoveSound(isCapture = false, isCheck = false, isMate = false) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      if (isMate) {
        // Deep, satisfying victory chord with heavy wooden resonance
        [130.81, 164.81, 196.0, 261.63].forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(600, now + idx * 0.07);

          gain.gain.setValueAtTime(0.28, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.5);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.55);
        });
        return;
      }

      // 1. Chunky Wooden Impact Fundamental Body (Low-frequency thud)
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      const bodyFilter = this.ctx.createBiquadFilter();

      const startFreq = isCheck ? 210 : isCapture ? 160 : 135;
      const endFreq = isCheck ? 100 : isCapture ? 65 : 50;
      const duration = isCapture ? 0.095 : 0.075;

      bodyOsc.type = "triangle";
      bodyOsc.frequency.setValueAtTime(startFreq, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

      bodyFilter.type = "lowpass";
      bodyFilter.frequency.setValueAtTime(450, now);
      bodyFilter.frequency.exponentialRampToValueAtTime(140, now + duration);

      bodyGain.gain.setValueAtTime(isCapture ? 0.45 : 0.35, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      bodyOsc.connect(bodyFilter);
      bodyFilter.connect(bodyGain);
      bodyGain.connect(this.ctx.destination);

      bodyOsc.start(now);
      bodyOsc.stop(now + duration + 0.01);

      // 2. Clunky Tactile Contact Snap (Filtered noise burst)
      const noiseBuffer = this.createNoiseBuffer();
      if (noiseBuffer) {
        const noiseSource = this.ctx.createBufferSource();
        const noiseFilter = this.ctx.createBiquadFilter();
        const noiseGain = this.ctx.createGain();

        noiseSource.buffer = noiseBuffer;

        noiseFilter.type = "bandpass";
        noiseFilter.frequency.setValueAtTime(isCapture ? 850 : 620, now);
        noiseFilter.Q.setValueAtTime(1.6, now);

        noiseGain.gain.setValueAtTime(isCapture ? 0.28 : 0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noiseSource.start(now);
        noiseSource.stop(now + 0.04);
      }

      // 3. Double-Clack Impact for Piece Captures
      if (isCapture) {
        const t2 = now + 0.028;
        const o2 = this.ctx.createOscillator();
        const g2 = this.ctx.createGain();
        const f2 = this.ctx.createBiquadFilter();

        o2.type = "triangle";
        o2.frequency.setValueAtTime(180, t2);
        o2.frequency.exponentialRampToValueAtTime(75, t2 + 0.055);

        f2.type = "lowpass";
        f2.frequency.setValueAtTime(500, t2);

        g2.gain.setValueAtTime(0.32, t2);
        g2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.055);

        o2.connect(f2);
        f2.connect(g2);
        g2.connect(this.ctx.destination);

        o2.start(t2);
        o2.stop(t2 + 0.06);
      }
    } catch {
      // AudioContext fallback
    }
  }
}

export const soundSynth = new SoundSynth();
