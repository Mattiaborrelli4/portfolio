/**
 * Esempio di utilizzo del sistema audio con error handling robusto
 *
 * Questo file mostra come integrare il sistema audio nel portfolio
 * con gestione errori completa e graceful degradation
 */

import { audioSequencer } from './audio-sequencer.js';

// ============================================================================
// ESEMPIO 1: Inizializzazione con preload e error handling
// ============================================================================

async function initAudioSystem() {
  try {
    console.log('🎵 Inizializzazione sistema audio...');

    // Carica le note con retry automatico
    const result = await audioSequencer.loadNotes();

    if (result.failed.length > 0) {
      console.warn(`⚠️ ${result.failed.length} note fallite, usando sintetizzatore`);
    }

    if (result.success.length > 0) {
      console.log(`✅ ${result.success.length} note caricate con successo`);
    }

    // Verifica stato
    const status = audioSequencer.getStatus();
    console.log('Stato sistema audio:', status);

    return status;
  } catch (error) {
    console.error('❌ Errore inizializzazione audio:', error);
    // Il sito continua a funzionare anche se audio fallisce
    return null;
  }
}

// ============================================================================
// ESEMPIO 2: Setup melody button con error handling
// ============================================================================

function setupMelodyButton() {
  const melodyBtn = document.getElementById('melodyBtn');

  if (!melodyBtn) {
    console.warn('Melody button non trovato');
    return;
  }

  melodyBtn.addEventListener('click', async () => {
    try {
      // Se le note non sono ancora state caricate, caricale ora
      if (!audioSequencer.notesLoaded) {
        melodyBtn.disabled = true;
        melodyBtn.textContent = '⏳ Caricamento...';

        await audioSequencer.loadNotes();

        melodyBtn.disabled = false;
      }

      // Toggle melodia
      const isPlaying = audioSequencer.toggle();

      // Aggiorna UI
      if (isPlaying) {
        melodyBtn.classList.add('playing');
        melodyBtn.innerHTML = `
          <span class="melody-btn-icon">⏸</span>
          Pause melody
        `;
      } else {
        melodyBtn.classList.remove('playing');
        melodyBtn.innerHTML = `
          <span class="melody-btn-icon">♪</span>
          Play a hidden melody
        `;
      }
    } catch (error) {
      console.error('Errore toggle melodia:', error);
      // Mostra messaggio user-friendly
      audioSequencer.showUserMessage(
        'Impossibile riprodurre audio. Riprova più tardi.',
        'warning'
      );
    }
  });
}

// ============================================================================
// ESEMPIO 3: Setup skill buttons con audio feedback
// ============================================================================

function setupSkillButtons() {
  const skillButtons = document.querySelectorAll('.skill-note');

  // Mappa skill -> note musicali
  const skillNotes = {
    'JavaScript': 'C4',
    'TypeScript': 'D4',
    'React': 'E4',
    'Vue.js': 'F4',
    'Node.js': 'G4',
    'CSS': 'A4',
    'HTML': 'B4',
    'Git': 'C5'
  };

  skillButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      try {
        const skillName = btn.textContent.trim();
        const note = skillNotes[skillName];

        if (note) {
          // Suona la nota - gestisce errori internamente
          audioSequencer.playNote(note, 0.2);
        }
      } catch (error) {
        // Silenzioso - non interrompere l'UX per errori audio
        console.warn('Errore play note:', error);
      }
    });
  });
}

// ============================================================================
// ESEMPIO 4: Monitoraggio errori audio
// ============================================================================

function setupAudioErrorMonitoring() {
  // Controlla errori ogni 30 secondi
  setInterval(() => {
    const errorReport = audioSequencer.getErrorReport();

    if (errorReport.errors.length > 0) {
      console.warn('⚠️ Errori audio rilevati:', errorReport.errors.length);
      console.log('Errori:', errorReport.errors);
      console.log('Note fallite:', errorReport.failedNotes);
    }
  }, 30000);

  // Log stato finale del caricamento
  setTimeout(() => {
    const status = audioSequencer.getStatus();
    console.log('📊 Report finale sistema audio:', {
      noteCaricate: status.loadedCount,
      noteFallite: status.failedCount,
      tentativi: status.loadAttempts,
      audioSupportato: status.audioSupported,
      contestoAudio: status.audioContextState
    });
  }, 5000);
}

// ============================================================================
// ESEMPIO 5: Cleanup prima di navigare away
// ============================================================================

function setupAudioCleanup() {
  // Cleanup quando l'utente lascia la pagina
  window.addEventListener('beforeunload', () => {
    try {
      audioSequencer.stop();
      audioSequencer.cleanup();
      console.log('🧹 Audio system cleanup completato');
    } catch (error) {
      console.warn('Errore cleanup audio:', error);
    }
  });

  // Cleanup quando la pagina va in background
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Ferma la melodia per risparmiare risorse
      try {
        if (audioSequencer.isPlaying) {
          audioSequencer.stop();
          console.log('⏸️ Melodia fermata (pagina in background)');
        }
      } catch (error) {
        console.warn('Errore stop melodia:', error);
      }
    }
  });
}

// ============================================================================
// ESEMPIO 6: Integrazione completa nel main.js
// ============================================================================

export async function initAudioFeature() {
  try {
    console.group('🎵 Audio System Initialization');

    // 1. Carica le note
    const loadResult = await audioSequencer.loadNotes();

    // 2. Verifica se audio è supportato
    if (!audioSequencer.errorState.audioSupported) {
      console.warn('⚠️ Audio non supportato in questo browser');
      console.groupEnd();
      return false;
    }

    // 3. Setup melody button
    setupMelodyButton();

    // 4. Setup skill buttons
    setupSkillButtons();

    // 5. Setup monitoring
    setupAudioErrorMonitoring();

    // 6. Setup cleanup
    setupAudioCleanup();

    console.log('✅ Sistema audio inizializzato');
    console.log(`📊 Note caricate: ${loadResult.success.length}/${loadResult.success.length + loadResult.failed.length}`);
    console.groupEnd();

    return true;
  } catch (error) {
    console.error('❌ Errore inizializzazione sistema audio:', error);
    console.groupEnd();
    // Il sito continua a funzionare
    return false;
  }
}

// ============================================================================
// FUNZIONI HELPER per Debug
// ============================================================================

/**
 * Testa tutte le note audio
 */
export async function testAllNotes() {
  console.log('🎵 Testing tutte le note...');

  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

  for (const note of notes) {
    console.log(`Suono ${note}...`);
    audioSequencer.playNote(note, 0.3);
    await new Promise(resolve => setTimeout(resolve, 400));
  }

  console.log('✅ Test completato');
}

/**
 * Ottieni report dettagliato del sistema audio
 */
export function getAudioSystemReport() {
  const status = audioSequencer.getStatus();
  const errors = audioSequencer.getErrorReport();

  return {
    supportato: status.audioSupported,
    funzionante: status.notesLoaded && status.loadedCount > 0,
    noteCaricate: status.loadedCount,
    noteFallite: status.failedCount,
    tentativiCaricamento: status.loadAttempts,
    totaleErrori: errors.errors.length,
    erroriRecenti: errors.errors.slice(-5),
    contestoAudio: status.audioContextState
  };
}

/**
 * Reset completo del sistema audio (per debug)
 */
export function resetAudioSystem() {
  console.warn('🔄 Reset sistema audio...');

  try {
    audioSequencer.stop();
    audioSequencer.cleanup();

    // Reset stato errori
    audioSequencer.errorState = {
      audioSupported: true,
      loadingFailed: false,
      loadAttempts: 0,
      loadedNotes: new Set(),
      failedNotes: new Set(),
      errors: []
    };

    audioSequencer.notesLoaded = false;

    console.log('✅ Reset completato');
  } catch (error) {
    console.error('❌ Errore reset:', error);
  }
}

// Esporta funzioni per uso in main.js
export default {
  initAudioFeature,
  testAllNotes,
  getAudioSystemReport,
  resetAudioSystem
};
