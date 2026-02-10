/**
 * Sistema Audio per Portfolio - AudioSequencer con Robust Error Handling
 *
 * Questa classe gestisce la riproduzione audio delle note musicali per le animazioni
 * delle skill cards. Utilizza la Web Audio API per generare e riprodurre suoni.
 *
 * Funzionalità:
 * - Caricamento asincrono dei file audio delle note con retry logic
 * - Riproduzione melodica sequenziale in loop
 * - Riproduzione di singole note per interazioni hover
 * - Callback per sincronizzare illuminazioni visive con note audio
 * - Controlli completi: start, stop, toggle
 * - GRACEFUL DEGRADATION: Il sito funziona anche se audio fallisce
 * - Retry logic per file che falliscono il caricamento
 * - User-friendly feedback via console/UI
 * - Preload con indicatore di caricamento
 * - Gestione errori robusta con try/catch
 *
 * @author Portfolio Audio System
 * @version 2.0.0 - Enhanced Error Handling
 */

export class AudioSequencer {
  /**
   * Costruttore - Inizializza il sistema audio
   * Crea il contesto audio e configura le proprietà base
   */
  constructor() {
    // Contesto audio Web Audio API
    this.audioContext = null;

    // Map per memorizzare i buffer audio delle note
    this.noteBuffers = new Map();

    // Array che definisce la sequenza melodica (note da suonare in loop)
    this.melodySequence = [
      'C4', 'E4', 'G4', 'B4',
      'C5', 'B4', 'G4', 'E4'
    ];

    // Indice della nota corrente nella sequenza
    this.currentNoteIndex = 0;

    // Timer per gestire il ritmo della melodia
    this.melodyInterval = null;

    // Intervallo temporale tra le note (in millisecondi)
    this.noteInterval = 500;

    // Flag per indicare se la melodia è in riproduzione
    this.isPlaying = false;

    // Volume master (0.0 - 1.0)
    this.masterVolume = 0.3;

    // Callback da eseguire quando viene suonata una nota
    this.onNoteCallback = null;

    // Frequenze delle note per generazione sintetica (fallback)
    this.noteFrequencies = {
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
      'C6': 1046.50,
      'D6': 1174.66,
      'E6': 1318.51,
      'F6': 1396.91
    };

    // Flag per indicare se le note sono state caricate
    this.notesLoaded = false;

    // ========== ROBUST ERROR HANDLING ==========
    // Configuration
    this.config = {
      maxRetries: 3,
      retryDelay: 1000, // ms
      loadingTimeout: 10000, // 10 seconds
      enableLogging: true
    };

    // Error tracking
    this.errorState = {
      audioSupported: true,
      loadingFailed: false,
      loadAttempts: 0,
      loadedNotes: new Set(),
      failedNotes: new Set(),
      errors: []
    };

    // UI elements
    this.ui = {
      loadingIndicator: null,
      errorMessage: null,
      melodyBtn: null
    };

    // Verifica supporto audio all'inizio
    this.checkAudioSupport();
  }

  /**
   * Inizializza il Contesto Audio
   * Deve essere chiamato dopo un'interazione dell'utente (gesture)
   * per rispettare le politiche dei browser sull'autoplay
   */
  async initAudioContext() {
    if (!this.audioContext) {
      // Crea un nuovo AudioContext
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Configura il volume master
      this.masterGainNode = this.audioContext.createGain();
      this.masterGainNode.gain.value = this.masterVolume;
      this.masterGainNode.connect(this.audioContext.destination);
    }

    // Riattiva il contesto se è sospeso (stato suspended)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Carica asincronamente tutti i file audio delle note
   * Cerca i file nella cartella /assets/sounds/notes/
   * Se i file non esistono, usa la generazione sintetica come fallback
   *
   * @returns {Promise<void>} Promise risolto quando tutte le note sono caricate
   */
  async loadNotes() {
    if (this.notesLoaded) {
      console.log('🎵 Note già caricate');
      return;
    }

    console.log('🎵 Caricamento note audio...');

    // Inizializza il contesto audio
    await this.initAudioContext();

    // Definisci le note da caricare
    const notesToLoad = [...new Set(this.melodySequence)]; // Note uniche
    const loadPromises = [];

    // Tentativo di caricare ogni file audio
    for (const note of notesToLoad) {
      const promise = this.loadNoteFile(note).catch((error) => {
        console.warn(`⚠️ Impossibile caricare ${note}.wav, userò generazione sintetica`);
        // Non interrompere il caricamento se una nota manca
        return null;
      });
      loadPromises.push(promise);
    }

    // Attendi che tutti i tentativi di caricamento siano completati
    await Promise.all(loadPromises);

    this.notesLoaded = true;
    console.log('✅ Sistema audio pronto');
  }

  /**
   * Carica un singolo file audio di una nota
   *
   * @param {string} noteName - Nome della nota (es. 'C4', 'E4')
   * @returns {Promise<AudioBuffer>} Buffer audio della nota
   */
  async loadNoteFile(noteName) {
    const notePath = `/assets/sounds/notes/${noteName}.wav`;

    try {
      const response = await fetch(notePath);

      if (!response.ok) {
        throw new Error(`File non trovato: ${notePath}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      // Memorizza il buffer nella map
      this.noteBuffers.set(noteName, audioBuffer);
      console.log(`✓ Caricata nota: ${noteName}`);

      return audioBuffer;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Avvia la riproduzione della melodia in loop
   * Le note vengono suonate sequenzialmente con un intervallo regolare
   *
   * @param {number} interval - Intervallo tra le note in ms (opzionale, default 500ms)
   */
  start(interval = 500) {
    if (this.isPlaying) {
      console.log('🎵 Melodia già in riproduzione');
      return;
    }

    if (!this.notesLoaded) {
      console.warn('⚠️ Note non ancora caricate. Chiamare loadNotes() prima di start()');
      return;
    }

    this.noteInterval = interval;
    this.isPlaying = true;
    console.log(`▶️ Avvio melodia (intervallo: ${interval}ms)`);

    // Suona la prima nota immediatamente
    this.playNextNote();

    // Configura il timer per le note successive
    this.melodyInterval = setInterval(() => {
      this.playNextNote();
    }, this.noteInterval);
  }

  /**
   * Ferma la riproduzione della melodia
   * Resetta l'indice alla nota iniziale
   */
  stop() {
    if (!this.isPlaying) {
      console.log('⏸️ Melodia già fermata');
      return;
    }

    this.isPlaying = false;

    // Ferma il timer
    if (this.melodyInterval) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }

    // Resetta l'indice
    this.currentNoteIndex = 0;
    console.log('⏹️ Melodia fermata');
  }

  /**
   * Attiva/Disattiva la riproduzione della melodia
   * Se è in riproduzione la ferma, se è ferma la avvia
   *
   * @param {number} interval - Intervallo tra le note in ms (opzionale)
   * @returns {boolean} Nuovo stato di riproduzione (true se sta suonando, false altrimenti)
   */
  toggle(interval = null) {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(interval || this.noteInterval);
      return true;
    }
  }

  /**
   * Verifica se la melodia è attualmente in riproduzione
   *
   * @returns {boolean} true se la melodia sta suonando, false altrimenti
   */
  isPlayingMelody() {
    return this.isPlaying;
  }

  /**
   * Suona la prossima nota nella sequenza melodica
   * Gestisce il loop tornando all'inizio quando finisce la sequenza
   * Esegue il callback per illuminare la skill card corrispondente
   */
  playNextNote() {
    if (!this.isPlaying) return;

    // Ottieni il nome della nota corrente
    const noteName = this.melodySequence[this.currentNoteIndex];

    // Suona la nota
    this.playNote(noteName);

    // Passa alla prossima nota (gestione loop)
    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melodySequence.length;
  }

  /**
   * Suona una singola nota specificata
   * Prima cerca di usare il buffer audio caricato, se non esiste usa generazione sintetica
   * Questo metodo è usato per le interazioni hover sulle skill cards
   *
   * @param {string} noteName - Nome della nota da suonare (es. 'C4', 'E4', 'G4')
   * @param {number} duration - Durata in secondi (opzionale, default 0.3s per note singole)
   */
  playNote(noteName, duration = 0.3) {
    // Assicurati che il contesto audio sia attivo
    if (!this.audioContext) {
      this.initAudioContext().then(() => this.playNote(noteName, duration));
      return;
    }

    // Riattiva il contesto se sospeso
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Prima prova a suonare il buffer audio caricato
    if (this.noteBuffers.has(noteName)) {
      this.playBufferNote(noteName);
    } else {
      // Fallback: generazione sintetica
      this.playSyntheticNote(noteName, duration);
    }

    // Esegui il callback per sincronizzare con effetti visivi
    if (this.onNoteCallback) {
      this.onNoteCallback(noteName);
    }
  }

  /**
   * Suona una nota usando il buffer audio caricato da file
   *
   * @param {string} noteName - Nome della nota da suonare
   */
  playBufferNote(noteName) {
    const audioBuffer = this.noteBuffers.get(noteName);

    if (!audioBuffer || !this.audioContext) return;

    // Crea un nodo sorgente per il buffer
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Crea un nodo gain per controllare il volume di questa nota
    const noteGain = this.audioContext.createGain();
    noteGain.gain.value = 0.5; // Volume della singola nota

    // Collega: source -> noteGain -> masterGain -> destination
    source.connect(noteGain);
    noteGain.connect(this.masterGainNode);

    // Avvia la riproduzione
    source.start(0);
  }

  /**
   * Suona una nota usando generazione sintetica (oscillatore)
   * Fallback quando i file audio non sono disponibili
   *
   * @param {string} noteName - Nome della nota da suonare
   * @param {number} duration - Durata della nota in secondi
   */
  playSyntheticNote(noteName, duration) {
    if (!this.audioContext) return;

    // Ottieni la frequenza della nota
    const frequency = this.noteFrequencies[noteName];

    if (!frequency) {
      console.warn(`⚠️ Frequenza non trovata per la nota: ${noteName}`);
      return;
    }

    // Crea un oscillatore (onda sinusoidale per un suono puro)
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine'; // Tipo d'onda: sine, square, sawtooth, triangle
    oscillator.frequency.value = frequency;

    // Crea un nodo gain per l'inviluppo (attack, decay)
    const envelope = this.audioContext.createGain();

    // Collega: oscillator -> envelope -> masterGain -> destination
    oscillator.connect(envelope);
    envelope.connect(this.masterGainNode);

    // Configura l'inviluppo ADSR semplificato
    const now = this.audioContext.currentTime;
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(0.5, now + 0.05); // Attack
    envelope.gain.exponentialRampToValueAtTime(0.01, now + duration); // Decay

    // Avvia e ferma l'oscillatore
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  /**
   * Registra un callback da eseguire quando viene suonata una nota
   * Utile per sincronizzare effetti visivi (es. illuminare skill card)
   *
   * @param {Function} callback - Funzione callback che riceve noteName come parametro
   */
  onNotePlay(callback) {
    if (typeof callback === 'function') {
      this.onNoteCallback = callback;
      console.log('✅ Callback registrato per eventi di riproduzione note');
    } else {
      console.warn('⚠️ Il callback deve essere una funzione');
    }
  }

  /**
   * Imposta il volume master
   *
   * @param {number} volume - Volume desiderato (0.0 - 1.0)
   */
  setMasterVolume(volume) {
    // Clampa il valore tra 0 e 1
    this.masterVolume = Math.max(0, Math.min(1, volume));

    if (this.masterGainNode) {
      this.masterGainNode.gain.value = this.masterVolume;
    }

    console.log(`🔊 Volume impostato a: ${(this.masterVolume * 100).toFixed(0)}%`);
  }

  /**
   * Imposta l'intervallo tra le note della melodia
   *
   * @param {number} interval - Nuovo intervallo in millisecondi
   */
  setNoteInterval(interval) {
    this.noteInterval = Math.max(100, interval); // Minimo 100ms

    // Se la melodia sta suonando, riavvia con il nuovo intervallo
    if (this.isPlaying) {
      this.stop();
      this.start(this.noteInterval);
    }

    console.log(`⏱️ Intervallo note impostato a: ${this.noteInterval}ms`);
  }

  /**
   * Ottiene lo stato attuale del sistema audio
   *
   * @returns {Object} Oggetto con lo stato del sistema
   */
  getStatus() {
    return {
      isPlaying: this.isPlaying,
      notesLoaded: this.notesLoaded,
      currentNoteIndex: this.currentNoteIndex,
      noteInterval: this.noteInterval,
      masterVolume: this.masterVolume,
      loadedNotes: Array.from(this.noteBuffers.keys()),
      audioContextState: this.audioContext?.state || 'not_initialized'
    };
  }

  /**
   * Pulisce le risorse audio quando non sono più necessarie
   * Utile per prevenire memory leak in applicazioni a lungo termine
   */
  cleanup() {
    // Ferma la melodia se sta suonando
    this.stop();

    // Svuota i buffer audio
    this.noteBuffers.clear();
    this.notesLoaded = false;

    // Chiudi il contesto audio
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    console.log('🧹 Sistema audio pulito');
  }

  // ========== ROBUST ERROR HANDLING METHODS ==========

  /**
   * Verifica se Web Audio API è supportata
   * Se non lo è, disabilita graziosamente le funzionalità audio
   */
  checkAudioSupport() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        this.errorState.audioSupported = false;
        this.log('Web Audio API non supportata in questo browser', 'warning');
        this.disableAudioFeatures();
        return false;
      }

      return true;
    } catch (error) {
      this.handleError('Check audio support failed', error);
      this.errorState.audioSupported = false;
      this.disableAudioFeatures();
      return false;
    }
  }

  /**
   * Disabilita le funzionalità audio in modo graceful
   * Il sito continua a funzionare normalmente
   */
  disableAudioFeatures() {
    try {
      // Disabilita melody button
      const melodyBtn = document.getElementById('melodyBtn');
      if (melodyBtn) {
        melodyBtn.disabled = true;
        melodyBtn.classList.add('audio-disabled');
        melodyBtn.innerHTML = `
          <span class="melody-btn-icon">🔇</span>
          Audio non disponibile
        `;
        melodyBtn.style.opacity = '0.5';
        melodyBtn.style.cursor = 'not-allowed';
      }

      // Aggiorna skill buttons
      const skillButtons = document.querySelectorAll('.skill-note');
      skillButtons.forEach(btn => {
        btn.classList.add('audio-disabled');
        btn.setAttribute('title', 'Audio non disponibile in questo browser');
      });

      this.log('Funzionalità audio disabilitate graziosamente', 'info');
    } catch (error) {
      this.handleError('Failed to disable audio features', error);
    }
  }

  /**
   * Inizializza il Contesto Audio con retry logic
   * Mai lancia errori - sempre gestisce graceful degradation
   */
  async initAudioContext() {
    if (!this.errorState.audioSupported) {
      this.log('Audio non supportato, skip init AudioContext', 'warning');
      return null;
    }

    if (!this.audioContext) {
      try {
        // Crea un nuovo AudioContext
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Configura il volume master
        this.masterGainNode = this.audioContext.createGain();
        this.masterGainNode.gain.value = this.masterVolume;
        this.masterGainNode.connect(this.audioContext.destination);

        this.log('AudioContext inizializzato con successo', 'success');
      } catch (error) {
        this.handleError('Init AudioContext failed', error);
        this.errorState.audioSupported = false;
        this.disableAudioFeatures();
        return null;
      }
    }

    // Riattiva il contesto se è sospeso (stato suspended)
    try {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    } catch (error) {
      this.handleError('Resume AudioContext failed', error);
    }

    return this.audioContext;
  }

  /**
   * Carica asincronamente tutti i file audio delle note
   * Con retry logic e Promise.allSettled per caricamento parallelo
   *
   * @returns {Promise<Object>} Oggetto con { success: [], failed: [] }
   */
  async loadNotes() {
    if (this.notesLoaded) {
      this.log('Note già caricate', 'info');
      return { success: Array.from(this.errorState.loadedNotes), failed: [] };
    }

    if (!this.errorState.audioSupported) {
      this.log('Audio non supportato, skip caricamento note', 'warning');
      return { success: [], failed: this.melodySequence };
    }

    this.showLoading(true);
    this.errorState.loadAttempts++;

    this.log(`Caricamento note audio (tentativo ${this.errorState.loadAttempts})...`, 'info');

    // Inizializza il contesto audio
    await this.initAudioContext();

    if (!this.audioContext) {
      this.showLoading(false);
      return { success: [], failed: this.melodySequence };
    }

    // Definisci le note da caricare (solo note uniche)
    const notesToLoad = [...new Set(this.melodySequence)];

    try {
      // Usa Promise.allSettled per caricamento parallelo robusto
      // Se una nota fallisce, le altre continuano
      const results = await Promise.allSettled(
        notesToLoad.map(note => this.loadNoteWithRetry(note))
      );

      // Processa i risultati
      const successful = [];
      const failed = [];

      results.forEach((result, index) => {
        const noteName = notesToLoad[index];

        if (result.status === 'fulfilled') {
          successful.push(noteName);
          this.errorState.loadedNotes.add(noteName);
        } else {
          failed.push(noteName);
          this.errorState.failedNotes.add(noteName);
          this.log(
            `Fallito caricamento nota: ${noteName}`,
            'error',
            result.reason
          );
        }
      });

      // Aggiorna stato
      this.notesLoaded = true;
      this.errorState.loadingFailed = failed.length === notesToLoad.length;

      // Mostra messaggio appropriato
      if (this.errorState.loadingFailed) {
        this.showUserMessage(
          'Impossibile caricare audio. Il sito funzionerà normalmente senza audio.',
          'error'
        );
        this.log('Tutte le note sono fallite', 'error');
      } else if (failed.length > 0) {
        this.showUserMessage(
          `${successful.length} di ${notesToLoad.length} note caricate. Usando fallback sintetico.`,
          'warning'
        );
        this.log(`${successful.length} note caricate, ${failed.length} fallite`, 'warning');
      } else {
        this.log('✅ Tutte le note caricate con successo', 'success');
      }

      this.showLoading(false);

      return { success: successful, failed };
    } catch (error) {
      this.handleError('Load notes failed', error);
      this.showLoading(false);
      this.notesLoaded = true; // Previene retry infiniti
      return { success: [], failed: notesToLoad };
    }
  }

  /**
   * Carica una singola nota con retry logic
   *
   * @param {string} noteName - Nome della nota
   * @param {number} attempt - Numero tentativo corrente
   * @returns {Promise<AudioBuffer|null>}
   */
  async loadNoteWithRetry(noteName, attempt = 1) {
    const notePath = `/assets/sounds/notes/${noteName}.wav`;

    try {
      this.log(`Caricamento ${noteName} (tentativo ${attempt}/${this.config.maxRetries})`, 'info');

      const response = await fetch(notePath);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      // Memorizza il buffer nella map
      this.noteBuffers.set(noteName, audioBuffer);

      if (attempt > 1) {
        this.log(`✓ ${noteName} caricata dopo ${attempt} tentativi`, 'success');
      } else {
        this.log(`✓ ${noteName} caricata`, 'success');
      }

      return audioBuffer;
    } catch (error) {
      this.log(
        `Tentativo ${attempt} fallito per ${noteName}: ${error.message}`,
        'warning'
      );

      // Retry se non abbiamo superato maxRetries
      if (attempt < this.config.maxRetries) {
        // Exponential backoff
        const delay = this.config.retryDelay * attempt;
        await this.delay(delay);
        return this.loadNoteWithRetry(noteName, attempt + 1);
      }

      // Max retries superato - fallisce graceful
      throw new Error(
        `Impossibile caricare ${noteName} dopo ${this.config.maxRetries} tentativi: ${error.message}`
      );
    }
  }

  /**
   * Suona una singola nota specificata con error handling
   * Prima cerca di usare il buffer audio caricato, se non esiste usa generazione sintetica
   * MAI lancia errori - sempre gestisce graceful degradation
   *
   * @param {string} noteName - Nome della nota da suonare (es. 'C4', 'E4', 'G4')
   * @param {number} duration - Durata in secondi (opzionale, default 0.3s per note singole)
   */
  playNote(noteName, duration = 0.3) {
    try {
      // Se audio non supportato, ritorna silent
      if (!this.errorState.audioSupported) {
        return;
      }

      // Assicurati che il contesto audio sia attivo
      if (!this.audioContext) {
        this.initAudioContext().then(() => {
          if (this.audioContext) {
            this.playNote(noteName, duration);
          }
        });
        return;
      }

      // Riattiva il contesto se sospeso (catch errori silenziosamente)
      try {
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume().catch(err => {
            this.log('Resume context fallito', 'warning', err);
          });
        }
      } catch (error) {
        this.log('Errore check stato context', 'warning', error);
      }

      // Prima prova a suonare il buffer audio caricato
      if (this.noteBuffers.has(noteName)) {
        this.playBufferNote(noteName);
      } else {
        // Fallback: generazione sintetica
        this.playSyntheticNote(noteName, duration);
      }

      // Esegui il callback per sincronizzare con effetti visivi
      if (this.onNoteCallback) {
        try {
          this.onNoteCallback(noteName);
        } catch (error) {
          this.log('Errore callback onNote', 'warning', error);
        }
      }
    } catch (error) {
      // Mai crashare - logga e continua
      this.handleError(`Play note ${noteName} failed`, error);
    }
  }

  /**
   * Suona una nota usando il buffer audio caricato da file
   * Con error handling robusto
   */
  playBufferNote(noteName) {
    try {
      const audioBuffer = this.noteBuffers.get(noteName);

      if (!audioBuffer || !this.audioContext) return;

      // Crea un nodo sorgente per il buffer
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Crea un nodo gain per controllare il volume di questa nota
      const noteGain = this.audioContext.createGain();
      noteGain.gain.value = 0.5; // Volume della singola nota

      // Collega: source -> noteGain -> masterGain -> destination
      source.connect(noteGain);
      noteGain.connect(this.masterGainNode);

      // Avvia la riproduzione (catch errori silenziosamente)
      source.start(0);
    } catch (error) {
      this.handleError(`Play buffer note ${noteName} failed`, error);
    }
  }

  /**
   * Suona una nota usando generazione sintetica (PIANO ACOUSTICO)
   * Simula un piano acustico naturale - Solo Sine e Triangle, niente elettronico
   */
  playSyntheticNote(noteName, duration) {
    try {
      if (!this.audioContext) return;

      // Ottieni la frequenza della nota
      const frequency = this.noteFrequencies[noteName];

      if (!frequency) {
        this.log(`Frequenza non trovata per: ${noteName}`, 'warning');
        return;
      }

      const now = this.audioContext.currentTime;

      // === OSCILLATORE PRINCIPALE (Sine) - Fondamenta pure ===
      const primaryOsc = this.audioContext.createOscillator();
      primaryOsc.type = 'sine';
      primaryOsc.frequency.value = frequency;

      const primaryGain = this.audioContext.createGain();
      primaryGain.gain.value = 0.30; // Volume principale

      // === OSCILLATORE SECONDARIO (Triangle) - Corpo caldo ===
      const secondaryOsc = this.audioContext.createOscillator();
      secondaryOsc.type = 'triangle';
      secondaryOsc.frequency.value = frequency;

      const secondaryGain = this.audioContext.createGain();
      secondaryGain.gain.value = 0.20; // Corpo medio

      // === TERZO OSCILLATORE (Sine) - Armonici naturali ===
      const thirdOsc = this.audioContext.createOscillator();
      thirdOsc.type = 'sine';
      thirdOsc.frequency.value = frequency; // Niente detune - suono naturale

      const thirdGain = this.audioContext.createGain();
      thirdGain.gain.value = 0.12; // Armonici naturali

      // === QUARTO OSCILLATORE (Sine sub-ottava) - Profondità naturale ===
      const fourthOsc = this.audioContext.createOscillator();
      fourthOsc.type = 'sine';
      fourthOsc.frequency.value = frequency * 0.5; // Ottava sotto per profondità

      const fourthGain = this.audioContext.createGain();
      fourthGain.gain.value = 0.08; // Bassi profondi naturali

      // === QUINTO OSCILLATORE (Sine) - Ottava per brillantezza ===
      const fifthOsc = this.audioContext.createOscillator();
      fifthOsc.type = 'sine';
      fifthOsc.frequency.value = frequency * 2; // Ottava sopra

      const fifthGain = this.audioContext.createGain();
      fifthGain.gain.value = 0.06; // Brillantezza delicata

      // === SESTO OSCILLATORE (Sine) - Due ottave sopra per armonici ===
      const sixthOsc = this.audioContext.createOscillator();
      sixthOsc.type = 'sine';
      sixthOsc.frequency.value = frequency * 3; // Due ottave sopra

      const sixthGain = this.audioContext.createGain();
      sixthGain.gain.value = 0.03; // Armonici molto alti

      // === CONVOLVER REVERB (effetto riverbero) ===
      const convolver = this.audioContext.createConvolver();
      const reverbBuffer = this.createReverbBuffer();
      convolver.buffer = reverbBuffer;

      const reverbGain = this.audioContext.createGain();
      reverbGain.gain.value = 0.25; // Reverb medio

      // DRY/WET mixer
      const dryGain = this.audioContext.createGain();
      dryGain.gain.value = 0.75; // Suono diretto

      const wetGain = this.audioContext.createGain();
      wetGain.gain.value = 0.25; // Suono riverberato

      // === MASTER ENVELOPE per piano orchestrale ===
      const masterEnvelope = this.audioContext.createGain();

      // Collega tutti gli oscillatori al master envelope
      primaryOsc.connect(primaryGain);
      secondaryOsc.connect(secondaryGain);
      thirdOsc.connect(thirdGain);
      fourthOsc.connect(fourthGain);
      fifthOsc.connect(fifthGain);
      sixthOsc.connect(sixthGain);

      // Collega oscillatori → master envelope → dry/wet → destination
      primaryGain.connect(masterEnvelope);
      secondaryGain.connect(masterEnvelope);
      thirdGain.connect(masterEnvelope);
      fourthGain.connect(masterEnvelope);
      fifthGain.connect(masterEnvelope);
      sixthGain.connect(masterEnvelope);

      // Dry path (suono diretto)
      masterEnvelope.connect(dryGain);
      dryGain.connect(this.masterGainNode);

      // Wet path (con reverb)
      masterEnvelope.connect(convolver);
      convolver.connect(reverbGain);
      reverbGain.connect(wetGain);
      wetGain.connect(this.masterGainNode);

      // === INVILUPPO PIANO ACOUSTICO ===
      // Attack definito e percussivo (come un piano vero)
      masterEnvelope.gain.setValueAtTime(0, now);
      masterEnvelope.gain.linearRampToValueAtTime(0.45, now + 0.015); // 15ms attack - rapido e definito

      // Decay inizale (parte percussiva)
      masterEnvelope.gain.exponentialRampToValueAtTime(0.30, now + 0.15); // Decay veloce

      // Sustain lungo (come un piano orchestrale)
      masterEnvelope.gain.exponentialRampToValueAtTime(0.20, now + duration * 0.6);

      // Release naturale
      masterEnvelope.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.5);

      // Avvia tutti gli oscillatori
      primaryOsc.start(now);
      secondaryOsc.start(now);
      thirdOsc.start(now);
      fourthOsc.start(now);
      fifthOsc.start(now);
      sixthOsc.start(now);

      // Ferma tutti gli oscillatori
      primaryOsc.stop(now + duration + 0.6);
      secondaryOsc.stop(now + duration + 0.6);
      thirdOsc.stop(now + duration + 0.6);
      fourthOsc.stop(now + duration + 0.6);
      fifthOsc.stop(now + duration + 0.6);
      sixthOsc.stop(now + duration + 0.6);
    } catch (error) {
      this.handleError(`Play synthetic note ${noteName} failed`, error);
    }
  }

  /**
   * Crea un buffer di reverb per il suono orchestrale
   * Genera un impulse response per simulare una sala da concerto
   */
  createReverbBuffer() {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * 2.5; // 2.5 secondi di reverb
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        // Decay esponenziale con rumore per riverbero naturale
        const decay = Math.pow(1 - i / length, 2);
        channelData[i] = (Math.random() * 2 - 1) * decay * 0.5;
      }
    }

    return impulse;
  }

  /**
   * Mostra/nascondi indicatore di caricamento
   */
  showLoading(show) {
    try {
      let indicator = document.querySelector('.audio-loading-indicator');

      if (show && !indicator) {
        // Crea indicatore se non esiste
        indicator = document.createElement('div');
        indicator.className = 'audio-loading-indicator';
        indicator.innerHTML = `
          <div class="loading-spinner"></div>
          <span class="loading-text">Caricamento audio...</span>
        `;
        indicator.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: var(--color-primary, #2C5F7F);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          z-index: 10000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(indicator);
      }

      if (indicator) {
        indicator.style.display = show ? 'flex' : 'none';
      }
    } catch (error) {
      this.handleError('Show loading failed', error);
    }
  }

  /**
   * Mostra messaggio user-friendly
   */
  showUserMessage(message, type = 'info') {
    // Log to console
    this.log(message, type);

    // Mostra in UI temporaneamente
    try {
      let msgEl = document.querySelector('.audio-user-message');

      if (!msgEl) {
        msgEl = document.createElement('div');
        msgEl.className = 'audio-user-message';
        msgEl.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 12px 20px;
          border-radius: 8px;
          display: none;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          max-width: 400px;
          z-index: 10000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(msgEl);
      }

      msgEl.textContent = message;
      msgEl.style.background =
        type === 'error' ? '#f44336' :
        type === 'warning' ? '#ff9800' :
        type === 'success' ? '#4caf50' :
        '#2196f3';
      msgEl.style.color = 'white';
      msgEl.style.display = 'flex';

      // Auto-hide dopo 5 secondi
      setTimeout(() => {
        if (msgEl && msgEl.parentNode) {
          msgEl.style.display = 'none';
        }
      }, 5000);
    } catch (error) {
      this.handleError('Show user message failed', error);
    }
  }

  /**
   * Gestione errori centralizzata
   * Mai lancia errori - sempre logga e continua
   */
  handleError(context, error) {
    const errorMessage = error?.message || String(error);

    // Aggiungi all'array errori
    this.errorState.errors.push({
      context,
      error: errorMessage,
      timestamp: new Date().toISOString()
    });

    // Log con stile
    this.log(`${context}: ${errorMessage}`, 'error');

    // Mai throw - il sito deve sempre continuare
    return {
      handled: true,
      context,
      error: errorMessage
    };
  }

  /**
   * Logging utility con colori
   */
  log(message, level = 'info', data = null) {
    if (!this.config.enableLogging) return;

    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[AudioSequencer ${timestamp}]`;

    const styles = {
      info: 'color: #2196f3',
      success: 'color: #4caf50',
      warning: 'color: #ff9800',
      error: 'color: #f44336'
    };

    const style = styles[level] || styles.info;

    if (data) {
      console.log(`${prefix} %c${message}`, style, data);
    } else {
      console.log(`${prefix} %c${message}`, style);
    }
  }

  /**
   * Utility: Delay per retry
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Ottieni stato dettagliato del sistema
   */
  getStatus() {
    return {
      isPlaying: this.isPlaying,
      notesLoaded: this.notesLoaded,
      currentNoteIndex: this.currentNoteIndex,
      noteInterval: this.noteInterval,
      masterVolume: this.masterVolume,
      loadedNotes: Array.from(this.noteBuffers.keys()),
      audioContextState: this.audioContext?.state || 'not_initialized',
      audioSupported: this.errorState.audioSupported,
      loadingFailed: this.errorState.loadingFailed,
      loadedCount: this.errorState.loadedNotes.size,
      failedCount: this.errorState.failedNotes.size,
      errorCount: this.errorState.errors.length,
      loadAttempts: this.errorState.loadAttempts
    };
  }

  /**
   * Ottieni report errori
   */
  getErrorReport() {
    return {
      errors: this.errorState.errors,
      failedNotes: Array.from(this.errorState.failedNotes),
      loadedNotes: Array.from(this.errorState.loadedNotes),
      audioSupported: this.errorState.audioSupported
    };
  }

  /**
   * Suona una nota in base alla frequenza (Hz)
   * Mappa la frequenza al nome della nota e suona
   *
   * @param {number} frequency - Frequenza della nota in Hz
   * @param {number} duration - Durata della nota in secondi (default 0.3)
   */
  playNoteByFrequency(frequency, duration = 0.3) {
    // Mappa frequenza → nome nota
    const frequencyToNote = {
      261.63: 'C4',
      293.66: 'D4',
      329.63: 'E4',
      349.23: 'F4',
      392.00: 'G4',
      440.00: 'A4',
      493.88: 'B4',
      523.25: 'C5',
      587.33: 'D5',
      659.25: 'E5',
      698.46: 'F5',
      783.99: 'G5',
      880.00: 'A5',
      987.77: 'B5',
      1046.50: 'C6',
      1174.66: 'D6',
      1318.51: 'E6',
      1396.91: 'F6'
    };

    const noteName = frequencyToNote[frequency];

    if (noteName) {
      this.playNote(noteName, duration);
    } else {
      console.warn(`⚠️ Frequenza non mappata: ${frequency} Hz`);
    }
  }
}

/**
 * Istanza singleton preconfigurata per uso immediato
 *
 * Esempio di utilizzo:
 *
 * // Inizializzazione
 * await audioSequencer.loadNotes();
 *
 * // Avvio melodia
 * audioSequencer.start();
 *
 * // Callback per illuminare skill cards
 * audioSequencer.onNotePlay((noteName) => {
 *   illuminateCard(noteName);
 * });
 *
 * // Hover su card
 * cardElement.addEventListener('mouseenter', () => {
 *   audioSequencer.playNote('C4');
 * });
 */
export const audioSequencer = new AudioSequencer();

/**
 * Mappa tra note e skill cards per il callback
 * Configura quale card illuminare per ogni nota
 *
 * @type {Object}
 */
export const noteCardMapping = {
  'C4': 0,  // Prima card (es. JavaScript)
  'E4': 1,  // Seconda card (es. React)
  'G4': 2,  // Terza card (es. Node.js)
  'B4': 3,  // Quarta card (es. Python)
  'C5': 4,  // Quinta card (es. CSS)
  'D4': 5,  // Sesta card (es. HTML)
  'F4': 6,  // Settima card (es. Git)
  'A4': 7   // Ottava card (es. SQL)
};

/**
 * Funzione helper per configurare il callback di illuminazione card
 *
 * @param {Array} cards - Array di elementi DOM delle skill cards
 * @returns {Function} Callback configurato
 */
export function createCardIlluminateCallback(cards) {
  return (noteName) => {
    const cardIndex = noteCardMapping[noteName];
    if (cardIndex !== undefined && cards[cardIndex]) {
      const card = cards[cardIndex];

      // Aggiungi classe per l'effetto illuminato
      card.classList.add('audio-playing');

      // Rimuovi la classe dopo l'animazione
      setTimeout(() => {
        card.classList.remove('audio-playing');
      }, 400);
    }
  };
}

export default AudioSequencer;
