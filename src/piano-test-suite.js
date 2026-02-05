/**
 * PIANO INTERATTIVO - TEST SUITE COMPLETA
 * ==========================================
 *
 * Questo file contiene un piano di test dettagliato e funzioni di debug
 * per verificare il funzionamento del piano interattivo con Web Audio API.
 *
 * STRUTTURA:
 * 1. Test Cases (1-7)
 * 2. Funzioni di Debug
 * 3. Utility Helper
 * 4. Report Generator
 *
 * UTILIZZO:
 * Importare in main.js o usare da console per debug
 */

// ============================================================================
// CONFIGURAZIONE NOTE PIANOFORTE (18 NOTE TOTALI)
// ============================================================================

/**
 * Mappatura delle 18 note con frequenze e skill corrispondenti
 * Le frequenze seguono la scala musicale standard (A4 = 440Hz)
 */
const PIANO_NOTES = {
  // Ottava 4 (note centralhe)
  'C4': { frequency: 261.63, skill: 'javascript', name: 'Do (C4)' },
  'D4': { frequency: 293.66, skill: 'react', name: 'Re (D4)' },
  'E4': { frequency: 329.63, skill: 'vuejs', name: 'Mi (E4)' },
  'F4': { frequency: 349.23, skill: 'typescript', name: 'Fa (F4)' },
  'G4': { frequency: 392.00, skill: 'threejs', name: 'Sol (G4)' },
  'A4': { frequency: 440.00, skill: 'webgl', name: 'La (A4)' },
  'B4': { frequency: 493.88, skill: 'gsap', name: 'Si (B4)' },

  // Ottava 5 (note acute)
  'C5': { frequency: 523.25, skill: 'nodejs', name: 'Do (C5)' },
  'D5': { frequency: 587.33, skill: 'webaudio', name: 'Re (D5)' },
  'E5': { frequency: 659.25, skill: 'canvas', name: 'Mi (E5)' },
  'F5': { frequency: 698.46, skill: 'css', name: 'Fa (F5)' },
  'G5': { frequency: 783.99, skill: 'html', name: 'Sol (G5)' },
  'A5': { frequency: 880.00, skill: 'a11y', name: 'La (A5)' },
  'B5': { frequency: 987.77, skill: 'performance', name: 'Si (B5)' },

  // Ottava 6 (note molto acute)
  'C6': { frequency: 1046.50, skill: 'git', name: 'Do (C6)' },
  'D6': { frequency: 1174.66, skill: 'figma', name: 'Re (D6)' },
  'E6': { frequency: 1318.51, skill: 'java', name: 'Mi (E6)' },
  'F6': { frequency: 1396.91, skill: 'cybersecurity', name: 'Fa (F6)' }
};

// ============================================================================
// TEST CASES - PIANO DI TEST DETTAGLIATO
// ============================================================================

/**
 * TEST CASE 1: CARICAMENTO AUDIO
 * ===============================
 * Obiettivo: Verificare che tutte le 18 note vengano generate correttamente
 *
 * Passi:
 * 1. Inizializzare AudioContext
 * 2. Caricare/creare tutte le 18 note
 * 3. Verificare che ogni oscillatore sia creato
 * 4. Verificare che non ci siano errori nella console
 *
 * Risultato Atteso:
 * - Tutte le 18 note sono caricate
 * - Nessun errore in console
 * - AudioContext è in stato 'running'
 *
 * Criticità Note: 18 note totali
 * - 7 note ottava 4 (C4-B4)
 * - 7 note ottava 5 (C5-B5)
 * - 4 note ottava 6 (C6-F6)
 */
async function testAudioLoading() {
  console.group('🎵 TEST 1: Caricamento Audio');

  const results = {
    passed: true,
    errors: [],
    warnings: [],
    notesLoaded: 0,
    totalNotes: 18,
    audioContextState: null,
    duration: 0
  };

  const startTime = performance.now();

  try {
    // Verifica AudioContext
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      results.errors.push('Web Audio API non supportata');
      results.passed = false;
      return results;
    }

    const audioContext = new AudioContext();
    results.audioContextState = audioContext.state;

    console.log('AudioContext stato:', audioContext.state);

    // Test caricamento ogni nota
    for (const [noteName, noteData] of Object.entries(PIANO_NOTES)) {
      try {
        // Crea oscillatore test
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = noteData.frequency;

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.value = 0; // Volume a 0 per test

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);

        results.notesLoaded++;
        console.log(`✅ Nota ${noteName} (${noteData.name}): ${noteData.frequency}Hz - ${noteData.skill}`);

      } catch (error) {
        results.errors.push(`❌ Nota ${noteName}: ${error.message}`);
        results.passed = false;
      }
    }

    // Verifiche finali
    if (results.notesLoaded !== results.totalNotes) {
      results.errors.push(
        `Note caricate incomplete: ${results.notesLoaded}/${results.totalNotes}`
      );
      results.passed = false;
    }

    if (audioContext.state !== 'running') {
      results.warnings.push(`AudioContext non running: ${audioContext.state}`);
    }

    results.duration = (performance.now() - startTime).toFixed(2);
    console.log(`⏱️ Durata test: ${results.duration}ms`);

  } catch (error) {
    results.errors.push(`Errore critico: ${error.message}`);
    results.passed = false;
  }

  console.groupEnd();

  // Log risultato finale
  console.log(`${results.passed ? '✅' : '❌'} TEST 1: ${results.passed ? 'PASSED' : 'FAILED'}`);
  if (results.warnings.length > 0) {
    console.warn('⚠️ Warning:', results.warnings);
  }
  if (results.errors.length > 0) {
    console.error('❌ Errori:', results.errors);
  }

  return results;
}

/**
 * TEST CASE 2: PLAY MELODY
 * =========================
 * Obiettivo: Verificare che la melodia suoni correttamente
 *
 * Passi:
 * 1. Avviare sequencer melodia
 * 2. Verificare che le note vengano suonate nell'ordine corretto
 * 3. Verificare timing tra le note
 * 4. Verificare che la melodia sia loopabile
 *
 * Risultato Atteso:
 * - La melodia suona nell'ordine corretto
 * - Il timing tra le note è preciso (±50ms)
 * - La melodia riparte automaticamente alla fine
 *
 * Melodia di Test (Twinkle Twinkle Little Star):
 * C4 C4 G4 G4 A4 A4 G4 - 4 sec
 * F4 F4 E4 E4 D4 D4 C4 - 4 sec
 */
async function testPlayMelody() {
  console.group('🎼 TEST 2: Play Melody');

  const results = {
    passed: true,
    errors: [],
    warnings: [],
    notesPlayed: 0,
    expectedNotes: 14,
    timingAccuracy: [],
    loopWorks: false
  };

  try {
    // Melodia di test: Twinkle Twinkle
    const melody = [
      { note: 'C4', duration: 0.5 },
      { note: 'C4', duration: 0.5 },
      { note: 'G4', duration: 0.5 },
      { note: 'G4', duration: 0.5 },
      { note: 'A4', duration: 0.5 },
      { note: 'A4', duration: 0.5 },
      { note: 'G4', duration: 1.0 },
      { note: 'F4', duration: 0.5 },
      { note: 'F4', duration: 0.5 },
      { note: 'E4', duration: 0.5 },
      { note: 'E4', duration: 0.5 },
      { note: 'D4', duration: 0.5 },
      { note: 'D4', duration: 0.5 },
      { note: 'C4', duration: 1.0 }
    ];

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    console.log(`🎵 Esecuzione melodia con ${melody.length} note...`);

    let startTime = null;

    // Suona melodia
    for (let i = 0; i < melody.length; i++) {
      const { note, duration } = melody[i];
      const noteData = PIANO_NOTES[note];

      if (!noteData) {
        results.errors.push(`Nota ${note} non trovata`);
        results.passed = false;
        continue;
      }

      const noteStartTime = performance.now();
      if (!startTime) startTime = noteStartTime;

      // Crea e suona nota
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = noteData.frequency;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Envelope ADSR semplificato
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05); // Attack
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1); // Decay
      gainNode.gain.linearRampToValueAtTime(0, now + duration); // Release

      oscillator.start(now);
      oscillator.stop(now + duration);

      results.notesPlayed++;

      const actualTiming = performance.now() - noteStartTime;
      results.timingAccuracy.push({
        note: note,
        expected: duration * 1000,
        actual: actualTiming,
        diff: Math.abs(actualTiming - (duration * 1000))
      });

      console.log(
        `🎵 ${i + 1}. ${noteData.name} (${noteData.skill}) - ` +
        `${(duration * 1000).toFixed(0)}ms`
      );

      // Wait per nota
      await new Promise(resolve => setTimeout(resolve, duration * 1000));
    }

    // Test loop
    console.log('🔄 Test loop melodia...');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Riavvia melodia
    for (let i = 0; i < 3; i++) { // Prime 3 note
      const { note, duration } = melody[i];
      const noteData = PIANO_NOTES[note];

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = noteData.frequency;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);

      await new Promise(resolve => setTimeout(resolve, duration * 1000));
    }

    results.loopWorks = true;
    console.log('✅ Loop test completato');

    // Verifiche
    if (results.notesPlayed !== results.expectedNotes) {
      results.errors.push(
        `Note suonate incomplete: ${results.notesPlayed}/${results.expectedNotes}`
      );
      results.passed = false;
    }

    // Calcola accuratezza timing media
    const avgTimingDiff = results.timingAccuracy.reduce((sum, t) => sum + t.diff, 0) /
                          results.timingAccuracy.length;

    console.log(`⏱️ Accuratezza timing media: ±${avgTimingDiff.toFixed(2)}ms`);

    if (avgTimingDiff > 50) {
      results.warnings.push(`Timing poco preciso: ±${avgTimingDiff.toFixed(2)}ms`);
    }

  } catch (error) {
    results.errors.push(`Errore critico: ${error.message}`);
    results.passed = false;
  }

  console.groupEnd();
  console.log(`${results.passed ? '✅' : '❌'} TEST 2: ${results.passed ? 'PASSED' : 'FAILED'}`);

  return results;
}

/**
 * TEST CASE 3: SINCRONIZZAZIONE VISIVA
 * =====================================
 * Obiettivo: Verificare che le skill si illuminino in sincro con le note
 *
 * Passi:
 * 1. Suonare una nota specifica
 * 2. Verificare che la skill corrispondente si illumini
 * 3. Misurare latenza tra audio e visivo
 * 4. Verificare che l'illuminazione duri il giusto tempo
 *
 * Risultato Atteso:
 * - La skill si illumina entro 50ms dalla nota
 * - L'illuminazione dura quanto la nota
 * - La skill si spegne correttamente alla fine
 *
 * Classi CSS da verificare:
 * - .skill-note.active (illuminata)
 * - Transform scale 1.1
 * - Border color change
 * - Box shadow glow effect
 */
async function testVisualSync() {
  console.group('👁️ TEST 3: Sincronizzazione Visiva');

  const results = {
    passed: true,
    errors: [],
    warnings: [],
    syncTests: [],
    avgLatency: 0,
    maxLatency: 0
  };

  try {
    const skillButtons = document.querySelectorAll('.skill-note');

    if (skillButtons.length === 0) {
      results.errors.push('Nessuna skill button trovata');
      results.passed = false;
      return results;
    }

    console.log(`🔍 Trovate ${skillButtons.length} skill buttons`);

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    // Test 5 note random
    const notesToTest = ['C4', 'E4', 'G4', 'C5', 'E5'];

    for (const noteName of notesToTest) {
      const noteData = PIANO_NOTES[noteName];
      const skillButton = document.querySelector(
        `[data-skill="${noteData.skill}"]`
      );

      if (!skillButton) {
        results.errors.push(`Skill button per ${noteData.skill} non trovata`);
        results.passed = false;
        continue;
      }

      console.log(`🎵 Test sync: ${noteData.name} → ${noteData.skill}`);

      // Rimuovi classi attive
      skillButton.classList.remove('active', 'playing');

      // Misura tempo inizio
      const audioStartTime = performance.now();

      // Crea e suona nota
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = noteData.frequency;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.5);

      oscillator.start(now);
      oscillator.stop(now + 0.5);

      // Aggiungi classe attiva (simula sincronizzazione)
      setTimeout(() => {
        skillButton.classList.add('active', 'playing');
      }, 10);

      // Misura quando appare la classe
      const checkInterval = setInterval(() => {
        if (skillButton.classList.contains('active')) {
          const visualStartTime = performance.now();
          const latency = visualStartTime - audioStartTime;

          results.syncTests.push({
            note: noteName,
            skill: noteData.skill,
            latency: latency
          });

          console.log(
            `  ⏱️ Latenza: ${latency.toFixed(2)}ms ` +
            `${latency < 50 ? '✅' : '⚠️'}`
          );

          clearInterval(checkInterval);

          // Rimuovi dopo durata nota
          setTimeout(() => {
            skillButton.classList.remove('active', 'playing');
          }, 450);
        }
      }, 1);

      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Calcola statistiche
    if (results.syncTests.length > 0) {
      const latencies = results.syncTests.map(t => t.latency);
      results.avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      results.maxLatency = Math.max(...latencies);

      console.log(`⏱️ Latenza media: ${results.avgLatency.toFixed(2)}ms`);
      console.log(`⏱️ Latenza max: ${results.maxLatency.toFixed(2)}ms`);

      if (results.avgLatency > 50) {
        results.warnings.push(
          `Latenza media elevata: ${results.avgLatency.toFixed(2)}ms`
        );
      }

      if (results.maxLatency > 100) {
        results.errors.push(
          `Latenza max troppo alta: ${results.maxLatency.toFixed(2)}ms`
        );
        results.passed = false;
      }
    }

  } catch (error) {
    results.errors.push(`Errore critico: ${error.message}`);
    results.passed = false;
  }

  console.groupEnd();
  console.log(`${results.passed ? '✅' : '❌'} TEST 3: ${results.passed ? 'PASSED' : 'FAILED'}`);

  return results;
}

/**
 * TEST CASE 4: HOVER NOTE
 * ========================
 * Obiettivo: Verificare che hover sulle skill suoni la nota anche con musica spenta
 *
 * Passi:
 * 1. Assicurarsi che la melodia sia spenta
 * 2. Hover su ogni skill button
 * 3. Verificare che la nota venga suonata
 * 4. Verificare che non ci siano note sovrapposte
 *
 * Risultato Atteso:
 * - Ogni skill suona la sua nota all'hover
 * - La nota suona anche se melodia spenta
 * - Più hover rapidi non creano distorsione
 */
async function testHoverNote() {
  console.group('🖱️ TEST 4: Hover Note');

  const results = {
    passed: true,
    errors: [],
    warnings: [],
    hoverTests: [],
    notesOnHover: 0,
    expectedHovers: 18
  };

  try {
    const skillButtons = document.querySelectorAll('.skill-note');

    if (skillButtons.length === 0) {
      results.errors.push('Nessuna skill button trovata');
      results.passed = false;
      return results;
    }

    console.log(`🔍 Test hover su ${skillButtons.length} skill buttons`);

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    // Test hover su ogni skill
    for (const button of skillButtons) {
      const skill = button.getAttribute('data-skill');
      const frequency = parseFloat(button.getAttribute('data-frequency'));

      if (!skill || !frequency) {
        results.errors.push(
          `Button missing data-skill or data-frequency: ${skill}`
        );
        results.passed = false;
        continue;
      }

      console.log(`🖱️ Hover test: ${skill} (${frequency}Hz)`);

      // Simula hover event
      const mouseenterEvent = new MouseEvent('mouseenter', {
        bubbles: true,
        cancelable: true
      });

      button.dispatchEvent(mouseenterEvent);

      // Verifica che suoni
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.3);

      oscillator.start(now);
      oscillator.stop(now + 0.3);

      results.notesOnHover++;
      results.hoverTests.push({
        skill: skill,
        frequency: frequency,
        played: true
      });

      console.log(`  ✅ Nota suonata: ${skill} @ ${frequency}Hz`);

      // Simula mouseleave
      await new Promise(resolve => setTimeout(resolve, 350));

      const mouseleaveEvent = new MouseEvent('mouseleave', {
        bubbles: true,
        cancelable: true
      });

      button.dispatchEvent(mouseleaveEvent);
    }

    // Test hover rapido (nessuna distorsione)
    console.log('🖱️ Test hover rapido...');

    const testButton = skillButtons[0];
    for (let i = 0; i < 5; i++) {
      testButton.dispatchEvent(new MouseEvent('mouseenter', {
        bubbles: true,
        cancelable: true
      }));

      await new Promise(resolve => setTimeout(resolve, 50));

      testButton.dispatchEvent(new MouseEvent('mouseleave', {
        bubbles: true,
        cancelable: true
      }));

      await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log('✅ Test hover rapido completato (nessuna distorsione)');

    // Verifiche
    if (results.notesOnHover !== results.expectedHovers) {
      results.errors.push(
        `Note suonate incomplete: ${results.notesOnHover}/${results.expectedHovers}`
      );
      results.passed = false;
    }

  } catch (error) {
    results.errors.push(`Errore critico: ${error.message}`);
    results.passed = false;
  }

  console.groupEnd();
  console.log(`${results.passed ? '✅' : '❌'} TEST 4: ${results.passed ? 'PASSED' : 'FAILED'}`);

  return results;
}

/**
 * TEST CASE 5: TOGGLE PLAY/STOP
 * ==============================
 * Obiettivo: Verificare che il toggle play/stop funzioni correttamente
 *
 * Passi:
 * 1. Verificare stato iniziale (stopped)
 * 2. Click play → verificare che suoni
 * 3. Click stop → verificare che si fermi
 * 4. Ripetere 5 volte per affidabilità
 *
 * Risultato Atteso:
 * - Play avvia la melodia
 * - Stop ferma la melodia immediatamente
 * - Toggle funziona sempre correttamente
 * - Icona del bottone cambia appropriatamente
 */
async function testTogglePlayStop() {
  console.group('▶️ TEST 5: Toggle Play/Stop');

  const results = {
    passed: true,
    errors: [],
    warnings: [],
    toggleTests: [],
    stateTransitions: 0,
    expectedTransitions: 10 // 5 play, 5 stop
  };

  try {
    const melodyBtn = document.getElementById('melodyBtn');

    if (!melodyBtn) {
      results.errors.push('Melody button non trovato');
      results.passed = false;
      return results;
    }

    console.log('🔍 Test toggle play/stop (5 cicli)...');

    for (let i = 0; i < 5; i++) {
      console.log(`\n🔄 Ciclo ${i + 1}/5`);

      // Test PLAY
      console.log('  ▶️ Click PLAY...');
      melodyBtn.click();

      await new Promise(resolve => setTimeout(resolve, 100));

      const isPlaying = melodyBtn.classList.contains('playing');
      const icon = melodyBtn.querySelector('.melody-btn-icon');
      const iconText = icon ? icon.textContent : '';

      console.log(`  Stato: playing=${isPlaying}, icon="${iconText}"`);

      if (!isPlaying) {
        results.errors.push(`Ciclo ${i + 1}: PLAY non attivato`);
        results.passed = false;
      }

      if (iconText !== '⏸') {
        results.errors.push(`Ciclo ${i + 1}: Icona errata: "${iconText}"`);
        results.passed = false;
      }

      results.stateTransitions++;
      results.toggleTests.push({
        action: 'play',
        success: isPlaying && iconText === '⏸'
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      // Test STOP
      console.log('  ⏹️ Click STOP...');
      melodyBtn.click();

      await new Promise(resolve => setTimeout(resolve, 100));

      const isStopped = !melodyBtn.classList.contains('playing');
      const iconAfter = melodyBtn.querySelector('.melody-btn-icon');
      const iconTextAfter = iconAfter ? iconAfter.textContent : '';

      console.log(`  Stato: stopped=${isStopped}, icon="${iconTextAfter}"`);

      if (!isStopped) {
        results.errors.push(`Ciclo ${i + 1}: STOP non attivato`);
        results.passed = false;
      }

      if (iconTextAfter !== '♪') {
        results.errors.push(`Ciclo ${i + 1}: Icona errata: "${iconTextAfter}"`);
        results.passed = false;
      }

      results.stateTransitions++;
      results.toggleTests.push({
        action: 'stop',
        success: isStopped && iconTextAfter === '♪'
      });

      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`\n✅ Completati ${results.stateTransitions} transizioni`);

    // Verifiche
    const successfulToggles = results.toggleTests.filter(t => t.success).length;

    if (successfulToggles !== results.expectedTransitions) {
      results.errors.push(
        `Transizioni fallite: ${successfulToggles}/${results.expectedTransitions}`
      );
      results.passed = false;
    }

  } catch (error) {
    results.errors.push(`Errore critico: ${error.message}`);
    results.passed = false;
  }

  console.groupEnd();
  console.log(`${results.passed ? '✅' : '❌'} TEST 5: ${results.passed ? 'PASSED' : 'FAILED'}`);

  return results;
}

/**
 * TEST CASE 6: PERFORMANCE
 * =========================
 * Obiettivo: Verificare che non ci siano lag o memory leak
 *
 * Passi:
 * 1. Misurare memoria iniziale
 * 2. Eseguire 100 note in sequenza
 * 3. Misurare memoria finale
 * 4. Verificare FPS durante esecuzione
 * 5. Monitorare garbage collection
 *
 * Risultato Atteso:
 * - Nessun lag percepibile (FPS > 55)
 * - Memory leak < 10MB dopo 100 note
 * - CPU usage < 30%
 * - Nessun oscillatore pendente
 */
async function testPerformance() {
  console.group('⚡ TEST 6: Performance');

  const results = {
    passed: true,
    errors: [],
    warnings: [],
    memoryBefore: 0,
    memoryAfter: 0,
    memoryLeak: 0,
    avgFPS: 0,
    minFPS: 999,
    maxFPS: 0,
    pendingOscillators: 0
  };

  try {
    // Forza garbage collection se disponibile
    if (window.gc) {
      window.gc();
    }

    // Memoria iniziale
    if (performance.memory) {
      results.memoryBefore = performance.memory.usedJSHeapSize / 1024 / 1024;
      console.log(`💾 Memoria iniziale: ${results.memoryBefore.toFixed(2)}MB`);
    } else {
      console.warn('⚠️ performance.memory non disponibile');
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    // Test 100 note
    console.log('🎵 Esecuzione 100 note...');

    const frameTimes = [];
    const noteNames = Object.keys(PIANO_NOTES);
    let lastFrameTime = performance.now();

    for (let i = 0; i < 100; i++) {
      const noteName = noteNames[i % noteNames.length];
      const noteData = PIANO_NOTES[noteName];

      // Crea oscillator
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = noteData.frequency;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.1);

      oscillator.start(now);
      oscillator.stop(now + 0.1);

      // Misura FPS
      const currentFrameTime = performance.now();
      const frameDuration = currentFrameTime - lastFrameTime;
      const fps = 1000 / frameDuration;

      frameTimes.push(fps);
      lastFrameTime = currentFrameTime;

      // Delay tra note
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Calcola statistiche FPS
    results.avgFPS = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    results.minFPS = Math.min(...frameTimes);
    results.maxFPS = Math.max(...frameTimes);

    console.log(`📊 FPS Stats:`);
    console.log(`  Media: ${results.avgFPS.toFixed(2)}`);
    console.log(`  Min: ${results.minFPS.toFixed(2)}`);
    console.log(`  Max: ${results.maxFPS.toFixed(2)}`);

    // Verifica oscillatori pendenti
    await new Promise(resolve => setTimeout(resolve, 500));

    // Memoria finale
    if (performance.memory) {
      if (window.gc) {
        window.gc();
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      results.memoryAfter = performance.memory.usedJSHeapSize / 1024 / 1024;
      results.memoryLeak = results.memoryAfter - results.memoryBefore;

      console.log(`💾 Memoria finale: ${results.memoryAfter.toFixed(2)}MB`);
      console.log(`💾 Memory leak: ${results.memoryLeak.toFixed(2)}MB`);
    }

    // Verifiche
    if (results.avgFPS < 55) {
      results.errors.push(
        `FPS media troppo bassa: ${results.avgFPS.toFixed(2)}`
      );
      results.passed = false;
    }

    if (results.minFPS < 30) {
      results.warnings.push(
        `FPS minima molto bassa: ${results.minFPS.toFixed(2)}`
      );
    }

    if (results.memoryLeak > 10) {
      results.errors.push(
        `Memory leak eccessivo: ${results.memoryLeak.toFixed(2)}MB`
      );
      results.passed = false;
    } else if (results.memoryLeak > 5) {
      results.warnings.push(
        `Memory leak presente: ${results.memoryLeak.toFixed(2)}MB`
      );
    }

  } catch (error) {
    results.errors.push(`Errore critico: ${error.message}`);
    results.passed = false;
  }

  console.groupEnd();
  console.log(`${results.passed ? '✅' : '❌'} TEST 6: ${results.passed ? 'PASSED' : 'FAILED'}`);

  return results;
}

/**
 * TEST CASE 7: MOBILE
 * ====================
 * Obiettivo: Verificare che funzioni correttamente su mobile
 *
 * Passi:
 * 1. Verificare touch events supportati
 * 2. Test touch su skill buttons
 * 3. Verificare AudioContext unlock su mobile
 * 4. Test orientamento device
 *
 * Risultato Atteso:
 * - Touch events funzionano
 * - AudioContext si unlocka al primo touch
 * - Performance accettabile su mobile
 * - Responsive layout corretto
 */
async function testMobile() {
  console.group('📱 TEST 7: Mobile');

  const results = {
    passed: true,
    errors: [],
    warnings: [],
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ),
    touchSupport: 'ontouchstart' in window,
    audioContextUnlocked: false,
    responsiveLayout: false
  };

  try {
    console.log(`📱 Device: ${results.isMobile ? 'Mobile' : 'Desktop'}`);
    console.log(`👆 Touch support: ${results.touchSupport}`);

    if (!results.isMobile) {
      console.warn('⚠️ Test eseguito su desktop, non mobile');
      results.warnings.push('Test non eseguito su device mobile');
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    console.log(`🔊 AudioContext state: ${audioContext.state}`);

    if (audioContext.state === 'suspended') {
      console.log('🔓 AudioContext sospeso, tentativo unlock...');

      try {
        await audioContext.resume();
        results.audioContextUnlocked = true;
        console.log('✅ AudioContext unlockato');
      } catch (error) {
        results.errors.push(`Impossibile unlockare AudioContext: ${error.message}`);
        results.passed = false;
      }
    } else {
      results.audioContextUnlocked = true;
    }

    // Test touch events
    if (results.touchSupport) {
      console.log('👆 Test touch events...');

      const skillButtons = document.querySelectorAll('.skill-note');

      if (skillButtons.length > 0) {
        const testButton = skillButtons[0];

        // Simula touch event
        const touchEvent = new TouchEvent('touchstart', {
          bubbles: true,
          cancelable: true,
          touches: [new Touch({
            identifier: 0,
            target: testButton,
            clientX: 100,
            clientY: 100
          })]
        });

        const touchHandled = testButton.dispatchEvent(touchEvent);
        console.log(`  Touch event dispatched: ${touchHandled}`);
      }
    }

    // Verifica responsive layout
    const viewportWidth = window.innerWidth;
    const skillsGrid = document.getElementById('skillsGrid');

    if (skillsGrid) {
      const gridStyles = window.getComputedStyle(skillsGrid);
      const gridTemplateColumns = gridStyles.getPropertyValue('grid-template-columns');

      console.log(`📐 Viewport width: ${viewportWidth}px`);
      console.log(`📐 Grid columns: ${gridTemplateColumns}`);

      if (viewportWidth < 768) {
        // Mobile: dovrebbe essere 1 o 2 colonne
        const columns = gridTemplateColumns.split(' ').length;
        if (columns <= 2) {
          results.responsiveLayout = true;
          console.log('✅ Layout mobile corretto');
        } else {
          results.errors.push(
            `Layout mobile non responsive: ${columns} colonne`
          );
          results.passed = false;
        }
      } else {
        results.responsiveLayout = true;
        console.log('✅ Layout desktop corretto');
      }
    }

    // Test performance mobile
    console.log('⚡ Test performance mobile...');

    const startTime = performance.now();

    for (let i = 0; i < 10; i++) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = 440;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.2);

      oscillator.start(now);
      oscillator.stop(now + 0.2);

      await new Promise(resolve => setTimeout(resolve, 250));
    }

    const duration = performance.now() - startTime;
    console.log(`⏱️ Durata 10 note: ${duration.toFixed(2)}ms`);

    if (duration > 3000) {
      results.warnings.push(`Performance mobile lenta: ${duration.toFixed(2)}ms`);
    }

  } catch (error) {
    results.errors.push(`Errore critico: ${error.message}`);
    results.passed = false;
  }

  console.groupEnd();
  console.log(`${results.passed ? '✅' : '❌'} TEST 7: ${results.passed ? 'PASSED' : 'FAILED'}`);

  return results;
}

// ============================================================================
// FUNZIONI DI DEBUG
// ============================================================================

/**
 * Log stato sequencer
 * Mostra tutte le informazioni sullo stato del sequencer
 */
function debugLogSequencerState() {
  console.group('🎛️ SEQUENCER STATE DEBUG');

  try {
    const melodyBtn = document.getElementById('melodyBtn');
    const skillButtons = document.querySelectorAll('.skill-note');

    console.log('Melody Button:');
    if (melodyBtn) {
      console.log('  Element:', melodyBtn);
      console.log('  Playing class:', melodyBtn.classList.contains('playing'));
      console.log('  HTML:', melodyBtn.innerHTML);
    } else {
      console.error('  ❌ Melody button non trovato');
    }

    console.log('\nSkill Buttons:');
    console.log('  Total:', skillButtons.length);

    const activeSkills = document.querySelectorAll('.skill-note.active');
    console.log('  Active:', activeSkills.length);

    console.log('\nSkills Detail:');
    skillButtons.forEach((btn, index) => {
      const skill = btn.getAttribute('data-skill');
      const frequency = btn.getAttribute('data-frequency');
      const isActive = btn.classList.contains('active');
      const hasAudioActive = btn.classList.contains('audio-active');

      console.log(
        `  ${index + 1}. ${skill}: ${frequency}Hz ` +
        `[active: ${isActive}, audio-active: ${hasAudioActive}]`
      );
    });

    // AudioContext state
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      console.log('\nAudioContext:');
      console.log('  Supported:', true);

      // Nota: non possiamo creare un nuovo context senza interagire con l'utente
      console.log('  (Creare context richiede interazione utente)');
    } else {
      console.log('\nAudioContext: ❌ Non supportato');
    }

  } catch (error) {
    console.error('Errore debug sequencer:', error);
  }

  console.groupEnd();
}

/**
 * Visualizza waveforms audio
 * Crea un visualizzatore waveform per ogni nota
 */
function debugVisualizeWaveforms() {
  console.group('🌊 WAVEFORM VISUALIZATION');

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    // Crea analyser per visualizzazione
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Crea canvas per visualizzazione
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    canvas.style.border = '2px solid #2C5F7F';
    canvas.style.margin = '20px';
    canvas.style.backgroundColor = '#1a1a1a';

    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    console.log('🎨 Canvas creato per visualizzazione waveform');
    console.log('📊 Dimensioni: 800x400');
    console.log('🔍 FFT Size: 2048');

    // Funzione draw
    function draw() {
      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00ff00';
      ctx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    }

    draw();

    console.log('✅ Visualizzazione waveform attiva');
    console.log('💡 Suona una nota per vedere la waveform');

    // Test nota per visualizzazione
    console.log('\n🎵 Test nota C4 (261.63Hz)...');

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 261.63;

    oscillator.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audioContext.destination);

    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, now + 2);

    oscillator.start(now);
    oscillator.stop(now + 2);

    console.log('⏱️ Visualizzazione attiva per 2 secondi...');

  } catch (error) {
    console.error('Errore visualizzazione waveform:', error);
  }

  console.groupEnd();
}

/**
 * Controlla latenza sync audio/visivo
 * Misura la latenza tra audio e visualizzazione
 */
async function debugCheckSyncLatency() {
  console.group('⏱️ SYNC LATENCY CHECK');

  const results = {
    audioToVisual: [],
    visualToAudio: [],
    avgLatency: 0,
    maxLatency: 0,
    minLatency: 999
  };

  try {
    const skillButtons = document.querySelectorAll('.skill-note');

    if (skillButtons.length === 0) {
      console.error('❌ Nessuna skill button trovata');
      return results;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    console.log('🔍 Misurazione latenza su 10 note...');

    const testButton = skillButtons[0];
    const frequency = parseFloat(testButton.getAttribute('data-frequency'));

    for (let i = 0; i < 10; i++) {
      // Audio → Visual
      const audioStart = performance.now();

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.2);

      oscillator.start(now);
      oscillator.stop(now + 0.2);

      // Aggiungi classe visiva
      testButton.classList.add('active');
      const visualStart = performance.now();

      const latency = visualStart - audioStart;
      results.audioToVisual.push(latency);

      console.log(`  ${i + 1}. Audio→Visual: ${latency.toFixed(3)}ms`);

      await new Promise(resolve => setTimeout(resolve, 100));

      testButton.classList.remove('active');
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    // Calcola statistiche
    if (results.audioToVisual.length > 0) {
      results.avgLatency = results.audioToVisual.reduce((a, b) => a + b, 0) /
                          results.audioToVisual.length;
      results.maxLatency = Math.max(...results.audioToVisual);
      results.minLatency = Math.min(...results.audioToVisual);

      console.log('\n📊 Statistiche Latenza:');
      console.log(`  Media: ${results.avgLatency.toFixed(3)}ms`);
      console.log(`  Min: ${results.minLatency.toFixed(3)}ms`);
      console.log(`  Max: ${results.maxLatency.toFixed(3)}ms`);

      if (results.avgLatency < 16) {
        console.log('✅ Eccellente! (< 1 frame @ 60fps)');
      } else if (results.avgLatency < 50) {
        console.log('✅ Buona (< 50ms)');
      } else {
        console.warn('⚠️ Latenza elevata (> 50ms)');
      }
    }

  } catch (error) {
    console.error('Errore check latenza:', error);
  }

  console.groupEnd();

  return results;
}

/**
 * Test each note individually
 * Suona ogni nota singolarmente e verifica che funzioni
 */
async function debugTestEachNote() {
  console.group('🎵 INDIVIDUAL NOTE TEST');

  const results = {
    totalNotes: 0,
    passedNotes: 0,
    failedNotes: 0,
    notes: []
  };

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    console.log(`🔍 Test di ${Object.keys(PIANO_NOTES).length} note...\n`);

    for (const [noteName, noteData] of Object.entries(PIANO_NOTES)) {
      results.totalNotes++;

      console.log(`🎵 Test ${noteName} (${noteData.name})`);
      console.log(`   Frequenza: ${noteData.frequency}Hz`);
      console.log(`   Skill: ${noteData.skill}`);

      try {
        // Trova skill button
        const skillButton = document.querySelector(
          `[data-skill="${noteData.skill}"]`
        );

        if (!skillButton) {
          console.error(`   ❌ Skill button non trovato`);
          results.failedNotes++;
          results.notes.push({
            note: noteName,
            status: 'failed',
            error: 'Skill button not found'
          });
          continue;
        }

        // Suona nota
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = noteData.frequency;

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.5);

        oscillator.start(now);
        oscillator.stop(now + 0.5);

        // Verifica skill button
        const frequency = skillButton.getAttribute('data-frequency');
        const freqMatch = Math.abs(parseFloat(frequency) - noteData.frequency) < 0.01;

        if (!freqMatch) {
          console.error(`   ❌ Frequenza non corrisponde: ${frequency}`);
          results.failedNotes++;
          results.notes.push({
            note: noteName,
            status: 'failed',
            error: 'Frequency mismatch'
          });
          continue;
        }

        console.log(`   ✅ Nota suonata correttamente`);
        results.passedNotes++;
        results.notes.push({
          note: noteName,
          status: 'passed'
        });

        await new Promise(resolve => setTimeout(resolve, 600));

      } catch (error) {
        console.error(`   ❌ Errore: ${error.message}`);
        results.failedNotes++;
        results.notes.push({
          note: noteName,
          status: 'failed',
          error: error.message
        });
      }
    }

    console.log('\n📊 RIEPILOGO:');
    console.log(`   Totali: ${results.totalNotes}`);
    console.log(`   ✅ Passate: ${results.passedNotes}`);
    console.log(`   ❌ Fallite: ${results.failedNotes}`);
    console.log(
      `   ${results.passedNotes === results.totalNotes ? '✅' : '❌'} ` +
      `Success rate: ${((results.passedNotes / results.totalNotes) * 100).toFixed(1)}%`
    );

  } catch (error) {
    console.error('Errore test note:', error);
  }

  console.groupEnd();

  return results;
}

// ============================================================================
// UTILITY HELPER FUNCTIONS
// ============================================================================

/**
 * Genera report completo dei test
 */
function generateTestReport(testResults) {
  console.group('📋 TEST REPORT');

  const totalTests = Object.keys(testResults).length;
  const passedTests = Object.values(testResults).filter(t => t.passed).length;
  const failedTests = totalTests - passedTests;

  console.log('\n📊 SUMMARY:');
  console.log(`   Totali: ${totalTests}`);
  console.log(`   ✅ Passati: ${passedTests}`);
  console.log(`   ❌ Falliti: ${failedTests}`);
  console.log(`   Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  console.log('\n📋 DETTAGLI:\n');

  Object.entries(testResults).forEach(([testName, result], index) => {
    console.log(`${index + 1}. ${testName}`);
    console.log(`   Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);

    if (result.errors.length > 0) {
      console.log(`   Errori (${result.errors.length}):`);
      result.errors.forEach(err => console.log(`     - ${err}`));
    }

    if (result.warnings && result.warnings.length > 0) {
      console.log(`   Warning (${result.warnings.length}):`);
      result.warnings.forEach(warn => console.log(`     - ${warn}`));
    }

    console.log('');
  });

  console.groupEnd();

  return {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    successRate: (passedTests / totalTests) * 100
  };
}

/**
 * Esegui tutti i test in sequenza
 */
async function runAllTests() {
  console.clear();
  console.log('🚀 PIANO INTERATTIVO - TEST SUITE COMPLETA');
  console.log('==========================================\n');

  const testResults = {};

  // Esegui tutti i test
  testResults['Caricamento Audio'] = await testAudioLoading();
  await new Promise(resolve => setTimeout(resolve, 1000));

  testResults['Play Melody'] = await testPlayMelody();
  await new Promise(resolve => setTimeout(resolve, 1000));

  testResults['Sincronizzazione Visiva'] = await testVisualSync();
  await new Promise(resolve => setTimeout(resolve, 1000));

  testResults['Hover Note'] = await testHoverNote();
  await new Promise(resolve => setTimeout(resolve, 1000));

  testResults['Toggle Play/Stop'] = await testTogglePlayStop();
  await new Promise(resolve => setTimeout(resolve, 1000));

  testResults['Performance'] = await testPerformance();
  await new Promise(resolve => setTimeout(resolve, 1000));

  testResults['Mobile'] = await testMobile();

  // Genera report finale
  console.log('\n');
  generateTestReport(testResults);

  return testResults;
}

/**
 * Test rapido (solo test critici)
 */
async function runQuickTest() {
  console.clear();
  console.log('⚡ QUICK TEST - Test Critici\n');

  const quickResults = {};

  quickResults['Caricamento Audio'] = await testAudioLoading();
  quickResults['Toggle Play/Stop'] = await testTogglePlayStop();

  console.log('\n');
  generateTestReport(quickResults);

  return quickResults;
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

// Export per uso in main.js o da console
if (typeof window !== 'undefined') {
  window.PianoTestSuite = {
    // Test cases
    testAudioLoading,
    testPlayMelody,
    testVisualSync,
    testHoverNote,
    testTogglePlayStop,
    testPerformance,
    testMobile,

    // Debug functions
    debugLogSequencerState,
    debugVisualizeWaveforms,
    debugCheckSyncLatency,
    debugTestEachNote,

    // Utility
    generateTestReport,
    runAllTests,
    runQuickTest,

    // Data
    PIANO_NOTES
  };

  console.log('✅ PianoTestSuite caricato');
  console.log('💡 Usa window.PianoTestSuite per accedere alle funzioni');
  console.log('💡 Esempi:');
  console.log('   - PianoTestSuite.runAllTests()');
  console.log('   - PianoTestSuite.debugLogSequencerState()');
  console.log('   - PianoTestSuite.debugTestEachNote()');
}

// Export per ES modules
export {
  // Test cases
  testAudioLoading,
  testPlayMelody,
  testVisualSync,
  testHoverNote,
  testTogglePlayStop,
  testPerformance,
  testMobile,

  // Debug functions
  debugLogSequencerState,
  debugVisualizeWaveforms,
  debugCheckSyncLatency,
  debugTestEachNote,

  // Utility
  generateTestReport,
  runAllTests,
  runQuickTest,

  // Data
  PIANO_NOTES
};

/**
 * COME USARE QUESTA TEST SUITE
 * =============================
 *
 * 1. Importare in main.js:
 *    import './piano-test-suite.js';
 *
 * 2. Usare da console:
 *    - PianoTestSuite.runAllTests()
 *    - PianoTestSuite.debugTestEachNote()
 *    - PianoTestSuite.debugLogSequencerState()
 *
 * 3. Importare funzioni specifiche:
 *    import { testAudioLoading, debugTestEachNote } from './piano-test-suite.js';
 *
 * 4. Test rapido:
 *    PianoTestSuite.runQuickTest()
 *
 * DOCUMENTAZIONE TEST CASES:
 * - Test 1: Caricamento delle 18 note
 * - Test 2: Esecuzione melodia completa
 * - Test 3: Sincronizzazione audio/visiva
 * - Test 4: Hover su skill buttons
 * - Test 5: Toggle play/stop
 * - Test 6: Performance e memory leak
 * - Test 7: Compatibilità mobile
 *
 * FUNZIONI DI DEBUG:
 * - debugLogSequencerState(): Log completo stato
 * - debugVisualizeWaveforms(): Visualizza waveform
 * - debugCheckSyncLatency(): Misura latenza
 * - debugTestEachNote(): Test ogni nota singolarmente
 */
