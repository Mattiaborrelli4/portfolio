/**
 * Skill Melody Player - Simple Catchy Melody
 *
 * VERSIONE SEMPLICE E ORECCCHIABILE
 * Tonalità: Do maggiore | Tempo: 120 BPM | Metro: 4/4 | 20 battute
 *
 * Struttura:
 * - Intro (4 battute)
 * - Tema principale (8 battute)
 * - Variazione (4 battute)
 * - Conclusione (4 battute)
 */

export class SkillMelodyPlayer {
  constructor(audioSequencer) {
    this.audioSequencer = audioSequencer;
    this.skillButtons = [];
    this.skillMap = new Map();
    this.isPlaying = false;
    this.melodyTimeouts = [];

    // TEMPO: 120 BPM (moderato, orecchiabile)
    this.bpm = 120;
    this.beatDuration = 60000 / this.bpm; // 500ms per beat
  }

  /**
   * Inizializza il player
   */
  init() {
    this.skillButtons = Array.from(document.querySelectorAll('.skill-note'));

    this.skillButtons.forEach(button => {
      const skillName = button.getAttribute('data-skill');
      this.skillMap.set(skillName, button);
    });

    console.log(`🎵 Simple Melody Player inizializzato con ${this.skillButtons.length} skill buttons`);
  }

  /**
   * Avvia la melodia semplice
   */
  start() {
    if (this.isPlaying) {
      console.log('🎵 Già in riproduzione');
      return;
    }

    if (this.skillMap.size === 0) {
      console.warn('⚠️ Nessun skill button trovato');
      return;
    }

    this.isPlaying = true;
    console.log('▶️ Simple Catchy Melody (20 battute) 🎵');

    this.playMelody();
  }

  /**
   * Melodia semplice orecchiabile
   */
  playMelody() {
    const beat = this.beatDuration; // 500ms

    // Timeline delle note - progressione melodica semplice
    const timeline = [];

    // 🎵 INTRO (4 battute) - Ascending pattern
    timeline.push({ skill: 'javascript', delay: beat * 0, duration: beat * 1 });      // C4
    timeline.push({ skill: 'typescript', delay: beat * 1, duration: beat * 1 });   // D4
    timeline.push({ skill: 'vite', delay: beat * 2, duration: beat * 1 });        // E4
    timeline.push({ skill: 'nodejs', delay: beat * 3, duration: beat * 1 });         // F4
    timeline.push({ skill: 'python', delay: beat * 3.5, duration: beat * 0.5 }); // F#4 (ornamento)

    // 🎵 TEMA PRINCIPALE (8 battute) - Melody line
    // Riff 1
    timeline.push({ skill: 'javascript', delay: beat * 4, duration: beat * 1.5 });      // C4
    timeline.push({ skill: 'vite', delay: beat * 5.5, duration: beat * 1 });         // E4
    timeline.push({ skill: 'nodejs', delay: beat * 6.5, duration: beat * 0.5 });          // F4
    timeline.push({ skill: 'typescript', delay: beat * 7, duration: beat * 1.5 });   // D4

    // Riff 2
    timeline.push({ skill: 'vite', delay: beat * 8.5, duration: beat * 1 });        // E4
    timeline.push({ skill: 'nodejs', delay: beat * 9.5, duration: beat * 0.5 });          // F4
    timeline.push({ skill: 'javascript', delay: beat * 10, duration: beat * 2 });  // C4
    timeline.push({ skill: 'python', delay: beat * 11.5, duration: beat * 0.5 }); // F#4

    // 🎵 VARIAZIONE (4 battute) - Descending
    timeline.push({ skill: 'nodejs', delay: beat * 12, duration: beat * 1 });         // F4
    timeline.push({ skill: 'vite', delay: beat * 13, duration: beat * 1 });        // E4
    timeline.push({ skill: 'typescript', delay: beat * 14, duration: beat * 1 });   // D4
    timeline.push({ skill: 'javascript', delay: beat * 15, duration: beat * 1 });  // C4

    // 🎵 CONCLUSIONE (4 battute) - Final chord
    // Chiusura armonica
    timeline.push({ skill: 'javascript', delay: beat * 16, duration: beat * 4 });    // C4
    timeline.push({ skill: 'typescript', delay: beat * 16, duration: beat * 4 });   // D4
    timeline.push({ skill: 'vite', delay: beat * 16, duration: beat * 4 });      // E4
    timeline.push({ skill: 'nodejs', delay: beat * 16, duration: beat * 4 });       // F4
    timeline.push({ skill: 'python', delay: beat * 16, duration: beat * 4 });     // F#4 (top note)

    // Suona tutte le note in timeline
    timeline.forEach(note => {
      const timeout = setTimeout(() => {
        if (!this.isPlaying) return;

        const button = this.skillMap.get(note.skill);
        if (button) {
          this.playSkillButton(button, note.duration / 1000);
        }
      }, note.delay);

      this.melodyTimeouts.push(timeout);
    });

    // Loop alla fine
    const totalDuration = beat * 20; // 20 battute totali (4+8+4+4)
    const loopTimeout = setTimeout(() => {
      if (this.isPlaying) {
        console.log('🔄 Loop melodia...');
        this.playMelody();
      }
    }, totalDuration);

    this.melodyTimeouts.push(loopTimeout);
  }

  /**
   * Suona un singolo skill button
   */
  playSkillButton(button, durationMultiplier = 1) {
    const frequency = parseFloat(button.getAttribute('data-frequency'));
    const skillName = button.getAttribute('data-skill');

    if (!frequency) {
      console.warn(`⚠️ Nessuna frequenza per ${skillName}`);
      return;
    }

    const noteDuration = durationMultiplier;
    this.audioSequencer.playNoteByFrequency(frequency, noteDuration);

    button.classList.add('melody-playing');

    setTimeout(() => {
      button.classList.remove('melody-playing');
    }, noteDuration * 1000 + 150);
  }

  /**
   * Ferma la melodia
   */
  stop() {
    if (!this.isPlaying) {
      console.log('⏸️ Già fermato');
      return;
    }

    this.isPlaying = false;

    this.melodyTimeouts.forEach(timeout => clearTimeout(timeout));
    this.melodyTimeouts = [];

    this.skillButtons.forEach(button => {
      button.classList.remove('melody-playing');
    });

    console.log('⏹️ Simple Melody fermata');
  }

  /**
   * Toggle play/stop
   */
  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  /**
   * Imposta velocità
   */
  setSpeed(bpm) {
    this.bpm = Math.max(80, Math.min(140, bpm));
    this.beatDuration = 60000 / this.bpm;
    console.log(`⏱️ Velocità: ${this.bpm} BPM`);

    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  /**
   * Cleanup
   */
  cleanup() {
    this.stop();
  }
}

export default SkillMelodyPlayer;
