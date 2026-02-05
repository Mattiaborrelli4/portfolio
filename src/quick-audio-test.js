/**
 * Quick Test Script - Audio Error Handler
 *
 * Copy-paste questo codice nella browser console per testare rapidamente
 * il sistema di gestione errori audio
 */

// ============================================================================
// QUICK TEST - Copia e incolla nella console del browser
// ============================================================================

async function quickAudioTest() {
  console.group('🧪 Quick Audio Test');

  try {
    // 1. Test import
    console.log('Step 1: Importing audioSequencer...');
    // Nota: Se hai già importato in main.js, usa direttamente window.__portfolioContexts

    let sequencer = window.__portfolioContexts?.audioSequencer;

    if (!sequencer) {
      console.warn('⚠️ AudioSequencer non trovato in window.__portfolioContexts');
      console.log('ℹ️ Se hai importato come module, usa: import { audioSequencer } from "./audio-sequencer.js"');
      console.groupEnd();
      return;
    }

    console.log('✅ AudioSequencer trovato');

    // 2. Test stato iniziale
    console.log('\nStep 2: Checking initial state...');
    const initialStatus = sequencer.getStatus();
    console.table({
      'Audio Supportato': initialStatus.audioSupported,
      'Note Caricate': initialStatus.notesLoaded,
      'Contesto Audio': initialStatus.audioContextState
    });

    // 3. Test caricamento note
    console.log('\nStep 3: Loading notes with retry...');
    console.time('Load time');

    const loadResult = await sequencer.loadNotes();

    console.timeEnd('Load time');
    console.log(`✅ Loaded: ${loadResult.success.length} notes`);
    console.log(`⚠️ Failed: ${loadResult.failed.length} notes`);

    if (loadResult.failed.length > 0) {
      console.warn('Note fallite:', loadResult.failed);
    }

    // 4. Test play note
    console.log('\nStep 4: Testing play note...');
    sequencer.playNote('C4', 0.3);
    console.log('✅ Note C4 played (check if you hear it)');

    await new Promise(resolve => setTimeout(resolve, 500));

    // 5. Test melody toggle
    console.log('\nStep 5: Testing melody toggle...');
    const wasPlaying = sequencer.isPlayingMelody();

    sequencer.toggle();
    const isPlaying = sequencer.isPlayingMelody();

    console.log(`✅ Melody ${wasPlaying ? 'stopped' : 'started'} (now ${isPlaying ? 'playing' : 'stopped'})`);

    // 6. Test status finale
    console.log('\nStep 6: Final status check...');
    const finalStatus = sequencer.getStatus();
    console.table({
      'Is Playing': finalStatus.isPlaying,
      'Notes Loaded': finalStatus.notesLoaded,
      'Loaded Count': finalStatus.loadedCount,
      'Failed Count': finalStatus.failedCount,
      'Load Attempts': finalStatus.loadAttempts
    });

    // 7. Test error report
    console.log('\nStep 7: Error report...');
    const errorReport = sequencer.getErrorReport();
    console.log(`Total errors: ${errorReport.errors.length}`);
    if (errorReport.errors.length > 0) {
      console.table(errorReport.errors.slice(-3)); // Ultimi 3 errori
    }

    // 8. Test user message
    console.log('\nStep 8: Testing user feedback...');
    sequencer.showUserMessage('Test message from quick test', 'success');

    console.log('\n✅ Quick test completed!');
    console.log('\n📊 Summary:');
    console.log(`- Audio supportato: ${finalStatus.audioSupported ? '✅' : '❌'}`);
    console.log(`- Note caricate: ${finalStatus.loadedCount}`);
    console.log(`- Note fallite: ${finalStatus.failedCount}`);
    console.log(`- Melody playing: ${isPlaying ? '✅' : '❌'}`);

    if (!isPlaying) {
      console.log('\n💡 Tip: Click the melody button on the page to start/pause');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }

  console.groupEnd();
}

// Esegui il test
quickAudioTest();

// ============================================================================
// BONUS: Funzioni helper per testing manuale
// ============================================================================

/**
 * Test tutte le note musicali
 */
window.testAllNotes = async function() {
  console.log('🎵 Testing all notes...');

  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
  const sequencer = window.__portfolioContexts?.audioSequencer;

  if (!sequencer) {
    console.error('AudioSequencer non trovato');
    return;
  }

  for (const note of notes) {
    console.log(`Playing ${note}...`);
    sequencer.playNote(note, 0.2);
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('✅ All notes tested');
};

/**
 * Test melody start/stop
 */
window.testMelody = function() {
  console.log('🎵 Testing melody...');

  const sequencer = window.__portfolioContexts?.audioSequencer;

  if (!sequencer) {
    console.error('AudioSequencer non trovato');
    return;
  }

  const isPlaying = sequencer.toggle();

  console.log(`Melody ${isPlaying ? 'STARTED' : 'STOPPED'}`);
  console.log(`Run testMelody() again to toggle`);

  return isPlaying;
};

/**
 * Get system report
 */
window.getAudioReport = function() {
  const sequencer = window.__portfolioContexts?.audioSequencer;

  if (!sequencer) {
    console.error('AudioSequencer non trovato');
    return;
  }

  const status = sequencer.getStatus();
  const errors = sequencer.getErrorReport();

  console.group('📊 Audio System Report');
  console.log('Status:', status);
  console.log('Errors:', errors);
  console.groupEnd();

  return { status, errors };
};

/**
 * Test graceful degradation (simula no audio support)
 */
window.testGracefulDegradation = function() {
  console.log('🧪 Testing graceful degradation...');

  const sequencer = window.__portfolioContexts?.audioSequencer;

  if (!sequencer) {
    console.error('AudioSequencer non trovato');
    return;
  }

  // Chiama disableAudioFeatures per testare
  sequencer.disableAudioFeatures();

  const melodyBtn = document.getElementById('melodyBtn');
  const skillButtons = document.querySelectorAll('.skill-note');

  console.log('✅ Graceful degradation test completed');
  console.log('- Melody button disabled:', melodyBtn?.disabled);
  console.log('- Skill buttons with .audio-disabled:', skillButtons.length);

  console.log('\n💡 Refresh the page to reset');
};

/**
 * Reset audio system
 */
window.resetAudioSystem = function() {
  console.log('🔄 Resetting audio system...');

  const sequencer = window.__portfolioContexts?.audioSequencer;

  if (!sequencer) {
    console.error('AudioSequencer non trovato');
    return;
  }

  sequencer.stop();
  sequencer.notesLoaded = false;
  sequencer.errorState.loadedNotes.clear();
  sequencer.errorState.failedNotes.clear();
  sequencer.errorState.errors = [];
  sequencer.noteBuffers.clear();

  console.log('✅ Audio system reset');
  console.log('💡 Run quickAudioTest() again to reinitialize');
};

// ============================================================================
// HELPERS - Info e comandi utili
// ============================================================================

console.log(`
🎵 Audio Error Handler - Quick Test Loaded!

Comandi disponibili:
- quickAudioTest()     : Esegui test completo
- testAllNotes()        : Testa tutte le note
- testMelody()          : Testa start/stop melodia
- getAudioReport()      : Ottieni report sistema
- testGracefulDegradation() : Testa graceful degradation
- resetAudioSystem()    : Resetta il sistema

Esempio:
  await quickAudioTest()
  testAllNotes()
  testMelody()
`);

export { quickAudioTest };
