/**
 * Skill Visual Sync - Sistema di Sincronizzazione Visiva per Skill Cards
 *
 * Questo modulo gestisce l'illuminazione delle skill cards sincronizzata con l'audio.
 * Quando una nota suona, la skill card corrispondente si illumina in blu scuro (#2C5F7F).
 *
 * Funzionalità:
 * - Mappatura frequenza → skill card
 * - Illuminazione sincronizzata con l'audio
 * - Timing preciso: 300ms di illuminazione
 * - Transizione graduale al colore originale
 * - Gestione perfetta del timing con Web Audio API
 */

export class SkillVisualSync {
  constructor() {
    // Mappatura frequenza → skill card (basata su data-frequency del HTML)
    this.frequencyToSkill = {
      261.63: 'javascript',    // C4
      293.66: 'react',         // D4
      329.63: 'vuejs',         // E4
      349.23: 'typescript',    // F4
      392.00: 'threejs',       // G4
      440.00: 'webgl',         // A4
      493.88: 'gsap',          // B4
      523.25: 'nodejs',        // C5
      587.33: 'webaudio',      // D5
      659.25: 'canvas',        // E5
      698.46: 'css',           // F5
      783.99: 'html',          // G5
      880.00: 'a11y',          // A5
      987.77: 'performance',   // B5
      1046.50: 'git',          // C6
      1174.66: 'figma',        // D6
      1318.51: 'java',         // E6
      1396.91: 'cybersecurity' // F6
    };

    // Cache delle skill cards per performance
    this.skillCardsCache = new Map();

    // Durata dell'illuminazione (ms)
    this.illuminationDuration = 300;

    // Inizializza
    this.init();
  }

  /**
   * Inizializza il sistema
   */
  init() {
    this.cacheSkillCards();
    console.log('✅ Skill Visual Sync initialized');
  }

  /**
   * Cache tutte le skill cards per accesso rapido
   */
  cacheSkillCards() {
    const skillCards = document.querySelectorAll('.skill-note');

    skillCards.forEach(card => {
      const skillName = card.getAttribute('data-skill');
      if (skillName) {
        this.skillCardsCache.set(skillName, card);
      }
    });

    console.log(`📦 Cached ${this.skillCardsCache.size} skill cards`);
  }

  /**
   * Trova la skill card in base alla frequenza
   * @param {number} frequency - Frequenza in Hz
   * @returns {HTMLElement|null} - La skill card o null
   */
  findSkillCardByFrequency(frequency) {
    // Arrotonda la frequenza per gestire la precisione floating point
    const roundedFreq = Math.round(frequency * 100) / 100;

    // Trova il nome della skill
    const skillName = this.frequencyToSkill[roundedFreq];

    if (!skillName) {
      console.warn(`⚠️ Nessuna skill trovata per frequenza: ${roundedFreq}Hz`);
      return null;
    }

    // Ritorna la skill card dalla cache
    const card = this.skillCardsCache.get(skillName);

    if (!card) {
      console.warn(`⚠️ Skill card non trovata: ${skillName}`);
    }

    return card;
  }

  /**
   * Illumina una skill card con effetto sincronizzato
   * @param {HTMLElement} skillCard - La skill card da illuminare
   * @param {number} duration - Durata illuminazione in ms (default: 300ms)
   */
  illuminateSkillCard(skillCard, duration = null) {
    if (!skillCard) return;

    const illuminationTime = duration || this.illuminationDuration;

    // Aggiungi la classe per l'effetto illuminato
    skillCard.classList.add('skill-note--playing');

    // Rimuovi la classe dopo la durata specificata
    setTimeout(() => {
      skillCard.classList.remove('skill-note--playing');
    }, illuminationTime);
  }

  /**
   * Sincronizza l'illuminazione con la riproduzione di una nota
   * Questo è il metodo principale da chiamare quando suona una nota
   * @param {number|string} noteIdentifier - Frequenza (Hz) o nome nota (es. 'C4')
   */
  syncWithNote(noteIdentifier) {
    let frequency;

    // Se è una stringa (nome nota), convertila in frequenza
    if (typeof noteIdentifier === 'string') {
      frequency = this.getFrequencyFromNoteName(noteIdentifier);
    } else {
      frequency = noteIdentifier;
    }

    if (!frequency) {
      console.warn(`⚠️ Impossibile determinare frequenza per: ${noteIdentifier}`);
      return;
    }

    // Trova e illumina la skill card
    const skillCard = this.findSkillCardByFrequency(frequency);

    if (skillCard) {
      this.illuminateSkillCard(skillCard);
    }
  }

  /**
   * Converte nome nota in frequenza
   * @param {string} noteName - Nome della nota (es. 'C4', 'E4')
   * @returns {number|null} - Frequenza in Hz o null
   */
  getFrequencyFromNoteName(noteName) {
    const noteFrequencies = {
      'C4': 261.63,
      'D4': 293.66,
      'E4': 329.63,
      'F4': 349.23,
      'G4': 392.00,
      'A4': 440.00,
      'B4': 493.88,
      'C5': 523.25,
      'D5': 587.33,
      'E5': 659.25,
      'F5': 698.46,
      'G5': 783.99,
      'A5': 880.00,
      'B5': 987.77,
      'C6': 1046.50
    };

    return noteFrequencies[noteName] || null;
  }

  /**
   * Crea un callback per AudioSequencer
   * Da usare con audioSequencer.onNotePlay()
   * @returns {Function} - Callback da passare ad AudioSequencer
   */
  createAudioCallback() {
    return (noteName) => {
      this.syncWithNote(noteName);
    };
  }

  /**
   * Imposta la durata dell'illuminazione
   * @param {number} duration - Durata in millisecondi
   */
  setIlluminationDuration(duration) {
    this.illuminationDuration = Math.max(100, Math.min(1000, duration));
    console.log(`⏱️ Illumination duration set to: ${this.illuminationDuration}ms`);
  }

  /**
   * Test visivo - illumina tutte le skill cards in sequenza
   * Utile per debug e demo
   */
  testAllCards() {
    console.log('🧪 Testing all skill cards...');
    let delay = 0;

    this.skillCardsCache.forEach((card, skillName) => {
      setTimeout(() => {
        console.log(`  Testing: ${skillName}`);
        this.illuminateSkillCard(card, 500);
      }, delay);

      delay += 600;
    });
  }

  /**
   * Resetta lo stato (rimuove tutte le classi attive)
   */
  reset() {
    this.skillCardsCache.forEach((card) => {
      card.classList.remove('skill-note--playing');
    });
    console.log('🔄 Visual sync reset');
  }

  /**
   * Ottieni statistiche del sistema
   * @returns {Object} - Statistiche
   */
  getStats() {
    return {
      totalCards: this.skillCardsCache.size,
      illuminationDuration: this.illuminationDuration,
      frequenciesMapped: Object.keys(this.frequencyToSkill).length,
      cachedSkills: Array.from(this.skillCardsCache.keys())
    };
  }
}

/**
 * Istanza singleton per uso immediato
 */
export const skillVisualSync = new SkillVisualSync();

/**
 * Funzione helper per configurare la sincronizzazione completa
 *
 * Esempio di utilizzo:
 *
 * import { audioSequencer } from './audio-sequencer.js';
 * import { setupSkillVisualSync } from './skill-visual-sync.js';
 *
 * // Configura tutto
 * const { sync, cleanup } = setupSkillVisualSync(audioSequencer);
 *
 * // Quando vuoi
 * sync(); // Sincronizza manualmente
 * cleanup(); // Pulisci
 *
 * @param {AudioSequencer} audioSequencer - Istanza AudioSequencer
 * @param {number} illuminationDuration - Durata illuminazione in ms (optional)
 * @returns {Object} - Metodi di controllo
 */
export function setupSkillVisualSync(audioSequencer, illuminationDuration = 300) {
  const visualSync = new SkillVisualSync();

  // Imposta durata personalizzata se specificata
  if (illuminationDuration !== 300) {
    visualSync.setIlluminationDuration(illuminationDuration);
  }

  // Registra il callback per sincronizzare con l'audio
  audioSequencer.onNotePlay(visualSync.createAudioCallback());

  console.log('✅ Skill visual sync configured');

  return {
    /**
     * Sincronizza manualmente una nota
     * @param {number|string} note - Frequenza o nome nota
     */
    sync: (note) => visualSync.syncWithNote(note),

    /**
     * Test tutte le cards
     */
    test: () => visualSync.testAllCards(),

    /**
     * Resetta lo stato
     */
    reset: () => visualSync.reset(),

    /**
     * Modifica durata illuminazione
     * @param {number} duration - Nuova durata in ms
     */
    setDuration: (duration) => visualSync.setIlluminationDuration(duration),

    /**
     * Ottieni statistiche
     */
    getStats: () => visualSync.getStats(),

    /**
     * Cleanup
     */
    cleanup: () => {
      visualSync.reset();
    }
  };
}

export default SkillVisualSync;
