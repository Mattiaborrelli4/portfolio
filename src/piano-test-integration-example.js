/**
 * ESEMPIO INTEGRAZIONE PIANO TEST SUITE
 * =======================================
 *
 * Questo file mostra come integrare la test suite del piano interattivo
 * nel progetto esistente (main.js).
 *
 * Due modalità di integrazione:
 * 1. Development Mode - Test suite sempre caricata
 * 2. Production Mode - Test suite caricata solo su richiesta
 */

// ============================================================================
// OPZIONE 1: IMPORTAZIONE DIRETTA (Development)
// ============================================================================

/**
 * Aggiungi in main.js:
 *
 * import './piano-test-suite.js';
 *
 * La test suite sarà disponibile globalmente come:
 * window.PianoTestSuite
 */

// Esempio di utilizzo in main.js:

/*
// In main.js, dopo l'inizializzazione

import './piano-test-suite.js';

// Aggiungi comando debug in development
if (import.meta.env.DEV) {
  // Aggiungi keyboard shortcut per test
  document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+T = Run all tests
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
      e.preventDefault();
      console.log('🧪 Running test suite...');
      window.PianoTestSuite.runAllTests();
    }

    // Ctrl+Shift+D = Debug state
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      console.log('🔍 Debugging sequencer...');
      window.PianoTestSuite.debugLogSequencerState();
    }

    // Ctrl+Shift+N = Test each note
    if (e.ctrlKey && e.shiftKey && e.key === 'N') {
      e.preventDefault();
      console.log('🎵 Testing all notes...');
      window.PianoTestSuite.debugTestEachNote();
    }
  });

  // Log info in console
  console.group('🎹 Piano Test Suite Available');
  console.log('Keyboard Shortcuts:');
  console.log('  Ctrl+Shift+T - Run all tests');
  console.log('  Ctrl+Shift+D - Debug state');
  console.log('  Ctrl+Shift+N - Test each note');
  console.log('');
  console.log('API Methods:');
  console.log('  window.PianoTestSuite.runAllTests()');
  console.log('  window.PianoTestSuite.runQuickTest()');
  console.log('  window.PianoTestSuite.debugTestEachNote()');
  console.log('  window.PianoTestSuite.debugLogSequencerState()');
  console.log('  window.PianoTestSuite.debugVisualizeWaveforms()');
  console.log('  window.PianoTestSuite.debugCheckSyncLatency()');
  console.log('');
  console.log('Test Cases:');
  console.log('  window.PianoTestSuite.testAudioLoading()');
  console.log('  window.PianoTestSuite.testPlayMelody()');
  console.log('  window.PianoTestSuite.testVisualSync()');
  console.log('  window.PianoTestSuite.testHoverNote()');
  console.log('  window.PianoTestSuite.testTogglePlayStop()');
  console.log('  window.PianoTestSuite.testPerformance()');
  console.log('  window.PianoTestSuite.testMobile()');
  console.groupEnd();

  // Esponi globalmente
  window.runPianoTests = () => window.PianoTestSuite.runAllTests();
  window.debugPiano = () => window.PianoTestSuite.debugLogSequencerState();
}
*/

// ============================================================================
// OPZIONE 2: CARICAMENTO DINAMICO (Production)
// ============================================================================

/**
 * Carica la test suite solo quando necessario
 * Aggiungi questo codice in main.js
 */

/*
// In main.js

// Funzione per caricare test suite su richiesta
async function loadTestSuite() {
  if (!window.PianoTestSuite) {
    console.log('📦 Loading piano test suite...');

    try {
      const module = await import('./piano-test-suite.js');
      console.log('✅ Test suite loaded!');
      return module;
    } catch (error) {
      console.error('❌ Failed to load test suite:', error);
      return null;
    }
  }

  return window.PianoTestSuite;
}

// Aggiungi comando per caricare test suite
if (import.meta.env.DEV) {
  // Aggiungi keyboard shortcut
  document.addEventListener('keydown', async (e) => {
    // Ctrl+Shift+T = Load and run tests
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
      e.preventDefault();

      const suite = await loadTestSuite();
      if (suite) {
        console.log('🧪 Running tests...');
        await suite.runAllTests();
      }
    }
  });

  console.log('💡 Press Ctrl+Shift+T to load and run piano test suite');
}

// Oppure aggiungi bottone debug nella pagina
if (import.meta.env.DEV) {
  const debugBtn = document.createElement('button');
  debugBtn.textContent = '🧪 Run Piano Tests';
  debugBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    padding: 10px 20px;
    background: #2C5F7F;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: monospace;
    font-size: 14px;
  `;

  debugBtn.addEventListener('click', async () => {
    const suite = await loadTestSuite();
    if (suite) {
      await suite.runAllTests();
    }
  });

  document.body.appendChild(debugBtn);
}
*/

// ============================================================================
// OPZIONE 3: INTEGRAZIONE CON AUDIO CONTROLLER ESISTENTE
// ============================================================================

/**
 * Se hai già un AudioController, estendilo con funzioni di test
 *
 * Aggiungi questo al tuo AudioController in main.js:
 */

/*
// Extendi AudioController con test methods
class AudioControllerWithTests extends AudioController {
  constructor() {
    super();
    this.testMode = false;
  }

  // Abilita modalità test
  enableTestMode() {
    this.testMode = true;
    console.log('🧪 Test mode enabled');
  }

  // Disabilita modalità test
  disableTestMode() {
    this.testMode = false;
    console.log('✅ Test mode disabled');
  }

  // Test singola nota
  async testNote(noteName) {
    if (!this.testMode) {
      console.warn('⚠️ Test mode not enabled');
      return;
    }

    const noteData = PIANO_NOTES[noteName];
    if (!noteData) {
      console.error(`❌ Note ${noteName} not found`);
      return;
    }

    console.log(`🎵 Testing ${noteName} (${noteData.name})`);

    // Crea e suona nota
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = noteData.frequency;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.5);

    oscillator.start(now);
    oscillator.stop(now + 0.5);

    // Aggiorna visual
    const skillButton = document.querySelector(
      `[data-skill="${noteData.skill}"]`
    );

    if (skillButton) {
      skillButton.classList.add('active');

      setTimeout(() => {
        skillButton.classList.remove('active');
      }, 450);
    }

    console.log(`✅ Note ${noteName} tested successfully`);
  }

  // Test tutte le note
  async testAllNotes() {
    this.enableTestMode();

    console.log('🎵 Testing all notes...');

    for (const noteName of Object.keys(PIANO_NOTES)) {
      await this.testNote(noteName);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    console.log('✅ All notes tested!');
    this.disableTestMode();
  }

  // Debug stato
  debugState() {
    console.group('🎛️ Audio Controller State');

    console.log('Test Mode:', this.testMode);
    console.log('Is Ready:', this.isReady);
    console.log('Is Playing:', this.isPlaying);

    if (this.player) {
      console.log('YouTube Player State:', this.player.getPlayerState());
    }

    console.groupEnd();
  }
}

// Sostituisci AudioController con versione con test
// In init():
if (import.meta.env.DEV) {
  audioController = new AudioControllerWithTests();

  // Aggiungi shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+T = Test all notes
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
      e.preventDefault();
      audioController.testAllNotes();
    }

    // Ctrl+Shift+D = Debug state
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      audioController.debugState();
    }
  });

  console.log('💡 AudioController test methods available:');
  console.log('  audioController.testAllNotes()');
  console.log('  audioController.testNote("C4")');
  console.log('  audioController.debugState()');
  console.log('');
  console.log('Shortcuts:');
  console.log('  Ctrl+Shift+T - Test all notes');
  console.log('  Ctrl+Shift+D - Debug state');
} else {
  audioController = new AudioController();
}
*/

// ============================================================================
// OPZIONE 4: TEST AUTOMATICI ALL'AVVIO
// ============================================================================

/**
 * Esegui test automaticamente all'avvio in development
 *
 * Aggiungi in main.js alla fine di init():
 */

/*
// In init(), alla fine

if (import.meta.env.DEV) {
  // Carica test suite
  import('./piano-test-suite.js').then(async (suite) => {
    console.log('🧪 Development mode detected');

    // Wait per pagina caricata
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Esegui quick test
    console.log('⚡ Running quick test...');
    const results = await suite.runQuickTest();

    // Log risultati
    const allPassed = Object.values(results).every(r => r.passed);

    if (allPassed) {
      console.log('✅ All tests passed! Piano ready.');
    } else {
      console.warn('⚠️ Some tests failed. Check console for details.');
    }

    // Aggiungi info in pagina
    const testInfo = document.createElement('div');
    testInfo.id = 'piano-test-info';
    testInfo.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 10px;
      background: ${allPassed ? '#4CAF50' : '#f44336'};
      color: white;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 9999;
    `;
    testInfo.innerHTML = `
      <div>🎹 Piano Tests</div>
      <div>${allPassed ? '✅ PASSED' : '❌ FAILED'}</div>
    `;

    document.body.appendChild(testInfo);

    // Rimuovi dopo 5 secondi
    setTimeout(() => {
      testInfo.remove();
    }, 5000);
  }).catch(error => {
    console.error('❌ Failed to load test suite:', error);
  });
}
*/

// ============================================================================
// ESEMPIO COMPLETO DI INTEGRAZIONE
// ============================================================================

/**
 * Esempio completo pronto per essere copiato in main.js
 *
 * Sostituisci la parte di inizializzazione dell'audioController in init()
 */

/*
// In init(), sostituisci:

// Initialize audio controller
audioController = new AudioController();
console.log('✅ Audio controller initialized');

// Con:

// Initialize audio controller with test support
if (import.meta.env.DEV) {
  // Development mode: Con test suite
  class TestableAudioController extends AudioController {
    constructor() {
      super();
      this.setupTestFeatures();
    }

    setupTestFeatures() {
      // Aggiungi methods di test
      this.runTests = async () => {
        const suite = await import('./piano-test-suite.js');
        return await suite.runAllTests();
      };

      this.quickTest = async () => {
        const suite = await import('./piano-test-suite.js');
        return await suite.runQuickTest();
      };

      this.debug = () => {
        const PianoTestSuite = window.PianoTestSuite;
        if (PianoTestSuite) {
          PianoTestSuite.debugLogSequencerState();
        }
      };

      // Aggiungi keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey) {
          switch(e.key) {
            case 'T':
              e.preventDefault();
              this.runTests();
              break;
            case 'Q':
              e.preventDefault();
              this.quickTest();
              break;
            case 'D':
              e.preventDefault();
              this.debug();
              break;
          }
        }
      });

      // Aggiungi debug button
      this.addDebugButton();
    }

    addDebugButton() {
      const btn = document.createElement('button');
      btn.innerHTML = '🎹 Test';
      btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 8px 16px;
        background: #2C5F7F;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-family: monospace;
      `;

      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.textContent = '⏳ Testing...';

        try {
          const results = await this.quickTest();
          const allPassed = Object.values(results).every(r => r.passed);

          btn.textContent = allPassed ? '✅ Pass' : '❌ Fail';
          btn.style.background = allPassed ? '#4CAF50' : '#f44336';

          setTimeout(() => {
            btn.textContent = '🎹 Test';
            btn.style.background = '#2C5F7F';
            btn.disabled = false;
          }, 3000);

        } catch (error) {
          btn.textContent = '❌ Error';
          btn.style.background = '#f44336';

          setTimeout(() => {
            btn.textContent = '🎹 Test';
            btn.style.background = '#2C5F7F';
            btn.disabled = false;
          }, 3000);
        }
      });

      document.body.appendChild(btn);

      console.log('💡 Debug button added (bottom-right)');
      console.log('💡 Keyboard shortcuts:');
      console.log('  Ctrl+Shift+T - Run all tests');
      console.log('  Ctrl+Shift+Q - Quick test');
      console.log('  Ctrl+Shift+D - Debug state');
    }
  }

  audioController = new TestableAudioController();
  console.log('✅ Audio controller initialized (with test support)');

} else {
  // Production mode: Senza test suite
  audioController = new AudioController();
  console.log('✅ Audio controller initialized');
}
*/

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Esempi di utilizzo della test suite
 */

// Example 1: Test singolo specifico
/*
async function testSpecificFeature() {
  const suite = await import('./piano-test-suite.js');

  // Test solo sincronizzazione visiva
  const result = await suite.testVisualSync();

  if (result.passed) {
    console.log('✅ Visual sync OK');
  } else {
    console.error('❌ Visual sync failed');
    console.error(result.errors);
  }
}
*/

// Example 2: Test con report personalizzato
/*
async function testWithCustomReport() {
  const suite = await import('./piano-test-suite.js');

  const results = await suite.runAllTests();

  // Crea report personalizzato
  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language
    },
    results: results,
    summary: suite.generateTestReport(results)
  };

  // Salva in localStorage
  localStorage.setItem('pianoTestReport', JSON.stringify(report));

  // Oppure invia a server
  // fetch('/api/test-results', {
  //   method: 'POST',
  //   body: JSON.stringify(report)
  // });

  console.log('📊 Report saved:', report);
}
*/

// Example 3: Test periodici (monitoring)
/*
function startPeriodicTesting() {
  // Esegui test ogni 5 minuti
  setInterval(async () => {
    console.log('🔄 Running periodic tests...');

    const suite = await import('./piano-test-suite.js');
    const results = await suite.runQuickTest();

    const allPassed = Object.values(results).every(r => r.passed);

    if (!allPassed) {
      console.warn('⚠️ Periodic test detected issues!');
      // Invia notifica
      sendNotification('Piano tests failed!');
    }

  }, 5 * 60 * 1000); // 5 minuti
}

function sendNotification(message) {
  // Mostra notifica browser
  if (Notification.permission === 'granted') {
    new Notification('Piano Test Alert', {
      body: message,
      icon: '/icon.png'
    });
  }
}
*/

// Example 4: Test in risposta a eventi
/*
// Test quando device orientation cambia
window.addEventListener('orientationchange', async () => {
  console.log('📱 Orientation changed, running mobile test...');

  const suite = await import('./piano-test-suite.js');
  await suite.testMobile();
});

// Test quando page visibility cambia
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible') {
    console.log('👁️ Page visible, running quick test...');

    const suite = await import('./piano-test-suite.js');
    await suite.runQuickTest();
  }
});
*/

// Example 5: A/B testing delle performance
/*
async function performanceABTest() {
  const suite = await import('./piano-test-suite.js');

  console.log('🔬 Running A/B performance test...');

  // Test configurazione A
  console.log('Testing configuration A...');
  const resultA = await suite.testPerformance();

  // Cambia configurazione
  // ...modifica impostazioni...

  // Test configurazione B
  console.log('Testing configuration B...');
  const resultB = await suite.testPerformance();

  // Confronta
  console.log('📊 A/B Test Results:');
  console.log('Config A avg FPS:', resultA.avgFPS);
  console.log('Config B avg FPS:', resultB.avgFPS);

  if (resultB.avgFPS > resultA.avgFPS) {
    console.log('✅ Config B is better!');
  } else {
    console.log('✅ Config A is better!');
  }
}
*/

// ============================================================================
// EXPORT
// ============================================================================

// Esporta come modulo se usato come file separato
export const examples = {
  option1: 'Importazione diretta (Development)',
  option2: 'Caricamento dinamico (Production)',
  option3: 'Integrazione con AudioController',
  option4: 'Test automatici all\'avvio',
  example1: 'Test singolo specifico',
  example2: 'Test con report personalizzato',
  example3: 'Test periodici',
  example4: 'Test in risposta a eventi',
  example5: 'A/B testing performance'
};

// Log info se caricato direttamente
if (import.meta.env.DEV) {
  console.log('📚 Piano Test Integration Examples loaded');
  console.log('💡 See this file for integration examples');
  console.log('📖 Full documentation: PIANO-TEST-DOCUMENTATION.md');
}
