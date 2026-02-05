/**
 * 🎹 PIANO QUICK TEST - Console Script
 * =====================================
 *
 * Script rapido per testare il piano interattivo dalla console browser.
 *
 * COME USARE:
 * 1. Apri la console del browser (F12)
 * 2. Copia e incolla questo script
 * 3. Chiama le funzioni disponibili
 *
 * AUTORE: Mattia Borrelli
 * VERSIONE: 1.0.0
 */

(function() {
  'use strict';

  console.log('%c🎹 Piano Quick Test', 'font-size: 20px; font-weight: bold; color: #2C5F7F;');
  console.log('%c==================', 'font-size: 20px; font-weight: bold; color: #2C5F7F;');
  console.log('');

  // ============================================================================
  // CONFIGURAZIONE
  // ============================================================================

  const PIANO_NOTES = {
    'C4': { frequency: 261.63, skill: 'javascript', name: 'Do (C4)' },
    'D4': { frequency: 293.66, skill: 'react', name: 'Re (D4)' },
    'E4': { frequency: 329.63, skill: 'vuejs', name: 'Mi (E4)' },
    'F4': { frequency: 349.23, skill: 'typescript', name: 'Fa (F4)' },
    'G4': { frequency: 392.00, skill: 'threejs', name: 'Sol (G4)' },
    'A4': { frequency: 440.00, skill: 'webgl', name: 'La (A4)' },
    'B4': { frequency: 493.88, skill: 'gsap', name: 'Si (B4)' },
    'C5': { frequency: 523.25, skill: 'nodejs', name: 'Do (C5)' },
    'D5': { frequency: 587.33, skill: 'webaudio', name: 'Re (D5)' },
    'E5': { frequency: 659.25, skill: 'canvas', name: 'Mi (E5)' },
    'F5': { frequency: 698.46, skill: 'css', name: 'Fa (F5)' },
    'G5': { frequency: 783.99, skill: 'html', name: 'Sol (G5)' },
    'A5': { frequency: 880.00, skill: 'a11y', name: 'La (A5)' },
    'B5': { frequency: 987.77, skill: 'performance', name: 'Si (B5)' },
    'C6': { frequency: 1046.50, skill: 'git', name: 'Do (C6)' },
    'D6': { frequency: 1174.66, skill: 'figma', name: 'Re (D6)' },
    'E6': { frequency: 1318.51, skill: 'java', name: 'Mi (E6)' },
    'F6': { frequency: 1396.91, skill: 'cybersecurity', name: 'Fa (F6)' }
  };

  // ============================================================================
  // FUNZIONI DI TEST
  // ============================================================================

  /**
   * Test rapido - verifica le funzionalità base
   */
  window.pianoQuickTest = async function() {
    console.group('⚡ Piano Quick Test');

    try {
      // 1. Verifica AudioContext
      console.log('1️⃣ Verifica AudioContext...');
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        console.error('❌ Web Audio API non supportata');
        console.groupEnd();
        return false;
      }

      const audioContext = new AudioContext();

      if (audioContext.state === 'suspended') {
        console.warn('⚠️ AudioContext sospeso - click per unlockare');
        await audioContext.resume();
      }

      console.log('✅ AudioContext:', audioContext.state);

      // 2. Verifica skill buttons
      console.log('2️⃣ Verifica skill buttons...');
      const skillButtons = document.querySelectorAll('.skill-note');

      if (skillButtons.length === 0) {
        console.error('❌ Nessuna skill button trovata');
        console.groupEnd();
        return false;
      }

      console.log(`✅ Trovate ${skillButtons.length} skill buttons`);

      // 3. Test melody button
      console.log('3️⃣ Verifica melody button...');
      const melodyBtn = document.getElementById('melodyBtn');

      if (!melodyBtn) {
        console.error('❌ Melody button non trovato');
        console.groupEnd();
        return false;
      }

      console.log('✅ Melody button trovato');

      // 4. Test nota singola
      console.log('4️⃣ Test nota singola (C4)...');
      const noteData = PIANO_NOTES['C4'];

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = noteData.frequency;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.3);

      oscillator.start(now);
      oscillator.stop(now + 0.3);

      console.log('✅ Nota suonata:', noteData.name);

      await new Promise(resolve => setTimeout(resolve, 400));

      console.log('');
      console.log('%c✅ QUICK TEST PASSED', 'color: #4CAF50; font-size: 14px; font-weight: bold;');

      console.groupEnd();
      return true;

    } catch (error) {
      console.error('❌ Errore:', error);
      console.groupEnd();
      return false;
    }
  };

  /**
   * Suona una nota specifica
   * @param {string} noteName - Nome della nota (es. 'C4', 'E5')
   */
  window.pianoPlayNote = async function(noteName) {
    const noteData = PIANO_NOTES[noteName];

    if (!noteData) {
      console.error(`❌ Nota ${noteName} non trovata`);
      console.log('Note disponibili:', Object.keys(PIANO_NOTES).join(', '));
      return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

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

      // Aggiorna visual
      const skillButton = document.querySelector(`[data-skill="${noteData.skill}"]`);

      if (skillButton) {
        skillButton.classList.add('active');
        setTimeout(() => skillButton.classList.remove('active'), 450);
      }

      console.log(`🎵 Suonata: ${noteData.name} (${noteData.frequency}Hz) - ${noteData.skill}`);

    } catch (error) {
      console.error('❌ Errore:', error);
    }
  };

  /**
   * Suona scala musicale
   */
  window.pianoPlayScale = async function() {
    console.log('🎼 Suonando scala...');

    const scale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

    for (const note of scale) {
      await pianoPlayNote(note);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    console.log('✅ Scala completata');
  };

  /**
   * Suona melodia (Twinkle Twinkle)
   */
  window.pianoPlayMelody = async function() {
    console.log('🎵 Suonando melodia...');

    const melody = [
      'C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4',
      'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'
    ];

    const durations = [
      500, 500, 500, 500, 500, 500, 1000,
      500, 500, 500, 500, 500, 500, 1000
    ];

    for (let i = 0; i < melody.length; i++) {
      await pianoPlayNote(melody[i]);
      await new Promise(resolve => setTimeout(resolve, durations[i]));
    }

    console.log('✅ Melodia completata');
  };

  /**
   * Test tutte le note
   */
  window.pianoTestAllNotes = async function() {
    console.log('🎵 Test di tutte le note...');
    console.log('========================');

    let passed = 0;
    let failed = 0;

    for (const [noteName, noteData] of Object.entries(PIANO_NOTES)) {
      try {
        await pianoPlayNote(noteName);
        passed++;
        console.log(`✅ ${noteName}: ${noteData.name}`);
        await new Promise(resolve => setTimeout(resolve, 600));
      } catch (error) {
        failed++;
        console.error(`❌ ${noteName}: ${error.message}`);
      }
    }

    console.log('');
    console.log('📊 RISULTATI:');
    console.log(`✅ Passate: ${passed}`);
    console.log(`❌ Fallite: ${failed}`);
    console.log(`📈 Success rate: ${((passed / 18) * 100).toFixed(1)}%`);
  };

  /**
   * Verifica stato sequencer
   */
  window.pianoCheckState = function() {
    console.group('🎛️ Stato Sequencer');

    // Melody button
    const melodyBtn = document.getElementById('melodyBtn');
    console.log('Melody Button:');
    console.log('  Esiste:', !!melodyBtn);
    if (melodyBtn) {
      console.log('  Playing:', melodyBtn.classList.contains('playing'));
      console.log('  HTML:', melodyBtn.innerHTML.substring(0, 50) + '...');
    }

    // Skill buttons
    const skillButtons = document.querySelectorAll('.skill-note');
    console.log('\nSkill Buttons:');
    console.log('  Totali:', skillButtons.length);
    console.log('  Attive:', document.querySelectorAll('.skill-note.active').length);

    // Audio context
    console.log('\nAudio Context:');
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    console.log('  Supportato:', !!AudioContext);

    console.groupEnd();
  };

  /**
   * Test performance veloce
   */
  window.pianoPerfTest = async function() {
    console.log('⚡ Performance Test (10 note)...');

    const startTime = performance.now();

    for (let i = 0; i < 10; i++) {
      await pianoPlayNote('C4');
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    const duration = performance.now() - startTime;
    const avgTime = duration / 10;

    console.log(`⏱️ Durata totale: ${duration.toFixed(2)}ms`);
    console.log(`⏱️ Media per nota: ${avgTime.toFixed(2)}ms`);

    if (avgTime < 100) {
      console.log('%c✅ Eccellente!', 'color: #4CAF50;');
    } else if (avgTime < 200) {
      console.log('%c⚠️ Accettabile', 'color: #FF9800;');
    } else {
      console.log('%c❌ Lento', 'color: #f44336;');
    }
  };

  /**
   * Mostra aiuto
   */
  window.pianoHelp = function() {
    console.log('%c🎹 Piano Quick Test - Aiuto', 'font-size: 16px; font-weight: bold; color: #2C5F7F;');
    console.log('');
    console.log('📝 Funzioni disponibili:');
    console.log('');
    console.log('%cTest:', 'font-weight: bold;');
    console.log('  pianoQuickTest()        - Test rapido');
    console.log('  pianoTestAllNotes()     - Test tutte le note');
    console.log('  pianoCheckState()       - Verifica stato');
    console.log('  pianoPerfTest()         - Test performance');
    console.log('');
    console.log('%cPlay:', 'font-weight: bold;');
    console.log('  pianoPlayNote("C4")     - Suona nota specifica');
    console.log('  pianoPlayScale()        - Suona scala');
    console.log('  pianoPlayMelody()       - Suona melodia');
    console.log('');
    console.log('%cUtility:', 'font-weight: bold;');
    console.log('  pianoHelp()             - Mostra questo aiuto');
    console.log('');
    console.log('%cNote disponibili:', 'font-weight: bold;');
    console.log('  ', Object.keys(PIANO_NOTES).join(', '));
    console.log('');
    console.log('%cEsempi:', 'font-weight: bold;');
    console.log('  pianoQuickTest()');
    console.log('  pianoPlayNote("E5")');
    console.log('  pianoPlayMelody()');
    console.log('  pianoTestAllNotes()');
    console.log('');
    console.log('%c💡 Suggerimento: Scrivi pianoHelp() per vedere questo messaggio', 'color: #2C5F7F;');
  };

  // ============================================================================
  // INIT
  // ============================================================================

  console.log('✅ Piano Quick Test caricato!');
  console.log('');
  console.log('%c💡 Digita pianoHelp() per vedere i comandi disponibili', 'color: #2C5F7F; font-size: 12px;');
  console.log('');

  // Mostra aiuto automaticamente
  pianoHelp();

})();
