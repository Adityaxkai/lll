// Web Audio API ambient sound generator & interactive SFX
// No external MP3 dependencies required; works 100% offline & instantly!

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.isMuted = true; // Off by default as requested!
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Romantic ambient chord progression: Cmaj9 -> Am9 -> Fmaj7 -> Gsus4
  startBackgroundMusic() {
    this.init();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;

    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 392.00], // G
    ];

    let chordIdx = 0;

    const playNextChord = () => {
      if (!this.isPlayingMusic) return;
      if (!this.isMuted && this.ctx) {
        const chord = chords[chordIdx % chords.length];
        chord.forEach((freq, i) => {
          this.playWarmPad(freq, 3.8, 0.04 + i * 0.01);
        });

        // Arpeggiated melody note
        const melodyNotes = [523.25, 587.33, 659.25, 783.99];
        const randomNote = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
        setTimeout(() => {
          if (this.isPlayingMusic && !this.isMuted) {
            this.playCelestaNote(randomNote, 2.5, 0.06);
          }
        }, 1200);
      }
      chordIdx++;
      this.musicTimer = setTimeout(playNextChord, 4000);
    };

    playNextChord();
  }

  stopBackgroundMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  toggleMusic() {
    if (this.isMuted) {
      this.isMuted = false;
      if (!this.isPlayingMusic) {
        this.startBackgroundMusic();
      }
      return true;
    } else {
      this.isMuted = true;
      return false;
    }
  }

  playWarmPad(freq, duration = 3.5, volume = 0.05) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio fallback handling
    }
  }

  playCelestaNote(freq, duration = 2.0, volume = 0.08) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio fallback handling
    }
  }

  playChime() {
    this.init();
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playCelestaNote(freq, 1.2, 0.12);
      }, idx * 100);
    });
  }

  playUnlock() {
    this.init();
    if (this.isMuted) return;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5 (Bright major chime)
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playCelestaNote(freq, 1.5, 0.15);
      }, idx * 120);
    });
  }

  playCelebration() {
    this.init();
    if (this.isMuted) return;
    const chords = [
      [523.25, 659.25, 783.99],
      [587.33, 739.99, 880.00],
      [659.25, 830.61, 987.77],
      [1046.50, 1318.51, 1567.98]
    ];
    chords.forEach((chord, i) => {
      setTimeout(() => {
        chord.forEach(f => this.playCelestaNote(f, 2.0, 0.15));
      }, i * 180);
    });
  }
}

export const sounds = new SoundEngine();
