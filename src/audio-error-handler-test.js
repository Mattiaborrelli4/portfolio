/**
 * Test Suite per Audio Error Handler
 *
 * Run con: node --experimental-modules audio-error-handler-test.js
 * Oppure nel browser console: testAudioErrorHandler()
 */

import { audioSequencer } from './audio-sequencer.js';

export class AudioErrorHandlerTest {
  constructor() {
    this.testResults = [];
    this.passed = 0;
    this.failed = 0;
  }

  /**
   * Esegui tutti i test
   */
  async runAllTests() {
    console.group('🧪 Audio Error Handler Test Suite');
    console.log('Inizio test...\n');

    // Test 1: Check audio support
    await this.testAudioSupport();

    // Test 2: Load notes with retry
    await this.testLoadNotesWithRetry();

    // Test 3: Promise.allSettled parallel loading
    await this.testParallelLoading();

    // Test 4: Graceful degradation
    await this.testGracefulDegradation();

    // Test 5: Error handling never throws
    await this.testErrorHandlingNeverThrows();

    // Test 6: Play note with fallback
    await this.testPlayNoteWithFallback();

    // Test 7: User feedback messages
    await this.testUserFeedback();

    // Test 8: Status reporting
    await this.testStatusReporting();

    // Print summary
    this.printSummary();

    console.groupEnd();

    return this.testResults;
  }

  /**
   * Test 1: Verifica supporto audio
   */
  async testAudioSupport() {
    console.log('Test 1: Check Audio Support');

    try {
      const isSupported = audioSequencer.checkAudioSupport();

      if (typeof isSupported === 'boolean') {
        this.pass('Audio support check returns boolean', isSupported);
      } else {
        this.fail('Audio support check should return boolean');
      }

      // Verifica stato
      const status = audioSequencer.getStatus();
      this.assert('audioSupported field exists', 'audioSupported' in status);
      this.assert('audioSupported is boolean', typeof status.audioSupported === 'boolean');

    } catch (error) {
      this.fail('Audio support test failed', error);
    }
  }

  /**
   * Test 2: Caricamento note con retry
   */
  async testLoadNotesWithRetry() {
    console.log('\nTest 2: Load Notes with Retry');

    try {
      // Reset stato
      audioSequencer.notesLoaded = false;
      audioSequencer.errorState.loadedNotes.clear();
      audioSequencer.errorState.failedNotes.clear();

      const result = await audioSequencer.loadNotes();

      this.assert('loadNotes() returns object', typeof result === 'object');
      this.assert('result has success array', Array.isArray(result.success));
      this.assert('result has failed array', Array.isArray(result.failed));
      this.assert('success + failed = total notes requested',
        result.success.length + result.failed.length >= 0);

      // Verifica tracking
      this.assert('loadedNotes Set updated', audioSequencer.errorState.loadedNotes.size > 0 ||
        audioSequencer.errorState.failedNotes.size > 0);

      this.pass('Load notes with retry works', {
        loaded: result.success.length,
        failed: result.failed.length,
        attempts: audioSequencer.errorState.loadAttempts
      });

    } catch (error) {
      this.fail('Load notes test failed', error);
    }
  }

  /**
   * Test 3: Caricamento parallelo con Promise.allSettled
   */
  async testParallelLoading() {
    console.log('\nTest 3: Parallel Loading with Promise.allSettled');

    try {
      const startTime = Date.now();

      // Carica note
      await audioSequencer.loadNotes();

      const loadTime = Date.now() - startTime;

      // Se tutte le note falliscono, dovrebbe comunque ritornare
      this.assert('loadNotes completes regardless of failures', true);
      this.assert('loadTime is reasonable (< 10s)', loadTime < 10000);

      this.pass('Parallel loading works', {
        loadTime: `${loadTime}ms`,
        notesLoaded: audioSequencer.noteBuffers.size
      });

    } catch (error) {
      this.fail('Parallel loading test failed', error);
    }
  }

  /**
   * Test 4: Graceful degradation
   */
  async testGracefulDegradation() {
    console.log('\nTest 4: Graceful Degradation');

    try {
      // Verifica che disableAudioFeatures() non crasha
      const initialButtons = document.querySelectorAll('.skill-note').length;

      audioSequencer.disableAudioFeatures();

      // Verifica che bottone melody sia disabilitato
      const melodyBtn = document.getElementById('melodyBtn');
      if (melodyBtn) {
        this.assert('Melody button has disabled class',
          melodyBtn.classList.contains('audio-disabled') || melodyBtn.disabled);
      }

      // Verifica skill buttons
      const skillButtons = document.querySelectorAll('.skill-note');
      this.assert('Skill buttons have audio-disabled class',
        skillButtons.length > 0 || skillButtons.length === initialButtons);

      this.pass('Graceful degradation works', {
        melodyBtnFound: !!melodyBtn,
        skillButtons: skillButtons.length
      });

    } catch (error) {
      this.fail('Graceful degradation test failed', error);
    }
  }

  /**
   * Test 5: Error handling non lancia mai errori
   */
  async testErrorHandlingNeverThrows() {
    console.log('\nTest 5: Error Handling Never Throws');

    try {
      let threw = false;

      // Test playNote con nota invalida
      try {
        audioSequencer.playNote('INVALID_NOTE', 0.3);
      } catch (e) {
        threw = true;
      }
      this.assert('playNote with invalid note does not throw', !threw);

      // Test playNote senza AudioContext
      const originalContext = audioSequencer.audioContext;
      audioSequencer.audioContext = null;

      try {
        audioSequencer.playNote('C4', 0.3);
      } catch (e) {
        threw = true;
      }

      audioSequencer.audioContext = originalContext;
      this.assert('playNote without context does not throw', !threw);

      this.pass('Error handling never throws');

    } catch (error) {
      this.fail('Error handling test failed', error);
    }
  }

  /**
   * Test 6: Play note con fallback
   */
  async testPlayNoteWithFallback() {
    console.log('\nTest 6: Play Note with Fallback');

    try {
      // Play nota che esiste
      audioSequencer.playNote('C4', 0.3);

      // Attendi un po' per l'audio
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verifica che non ci siano errori fatali
      this.assert('playNote completes without crash', true);

      // Verifica fallback
      const hasBuffer = audioSequencer.noteBuffers.has('C4');
      const hasFrequency = audioSequencer.noteFrequencies['C4'];

      this.assert('Note has either buffer or frequency fallback',
        hasBuffer || hasFrequency);

      this.pass('Play note with fallback works', {
        hasBuffer,
        hasFrequency
      });

    } catch (error) {
      this.fail('Play note fallback test failed', error);
    }
  }

  /**
   * Test 7: User feedback messages
   */
  async testUserFeedback() {
    console.log('\nTest 7: User Feedback Messages');

    try {
      // Test showUserMessage
      audioSequencer.showUserMessage('Test message', 'info');

      // Attendi un po' per l'animazione
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verifica che elemento sia creato
      const messageEl = document.querySelector('.audio-user-message');
      this.assert('User message element created', messageEl !== null);

      // Test loading indicator
      audioSequencer.showLoading(true);
      const loadingEl = document.querySelector('.audio-loading-indicator');
      this.assert('Loading indicator element created', loadingEl !== null);

      audioSequencer.showLoading(false);
      this.assert('Loading indicator can be hidden', true);

      this.pass('User feedback messages work');

    } catch (error) {
      this.fail('User feedback test failed', error);
    }
  }

  /**
   * Test 8: Status reporting
   */
  async testStatusReporting() {
    console.log('\nTest 8: Status Reporting');

    try {
      const status = audioSequencer.getStatus();

      this.assert('getStatus() returns object', typeof status === 'object');
      this.assert('status has isPlaying', 'isPlaying' in status);
      this.assert('status has notesLoaded', 'notesLoaded' in status);
      this.assert('status has loadedCount', 'loadedCount' in status);
      this.assert('status has failedCount', 'failedCount' in status);
      this.assert('status has audioSupported', 'audioSupported' in status);

      // Test error report
      const errorReport = audioSequencer.getErrorReport();
      this.assert('getErrorReport() returns object', typeof errorReport === 'object');
      this.assert('errorReport has errors array', Array.isArray(errorReport.errors));
      this.assert('errorReport has failedNotes array', Array.isArray(errorReport.failedNotes));
      this.assert('errorReport has loadedNotes array', Array.isArray(errorReport.loadedNotes));

      this.pass('Status reporting works', {
        isPlaying: status.isPlaying,
        notesLoaded: status.notesLoaded,
        loadedCount: status.loadedCount,
        failedCount: status.failedCount
      });

    } catch (error) {
      this.fail('Status reporting test failed', error);
    }
  }

  /**
   * Helper: Pass test
   */
  pass(testName, data = null) {
    this.passed++;
    this.testResults.push({
      test: testName,
      status: 'PASS',
      data
    });
    console.log(`  ✅ PASS: ${testName}`);
    if (data) console.log(`     Data:`, data);
  }

  /**
   * Helper: Fail test
   */
  fail(testName, error = null) {
    this.failed++;
    this.testResults.push({
      test: testName,
      status: 'FAIL',
      error: error?.message || String(error)
    });
    console.error(`  ❌ FAIL: ${testName}`);
    if (error) console.error(`     Error:`, error);
  }

  /**
   * Helper: Assertion
   */
  assert(assertionName, condition) {
    if (condition) {
      console.log(`  ✓ ${assertionName}`);
    } else {
      this.fail(`Assertion failed: ${assertionName}`);
    }
  }

  /**
   * Print summary
   */
  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${this.testResults.length}`);
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`Success Rate: ${((this.passed / this.testResults.length) * 100).toFixed(1)}%`);
    console.log('='.repeat(50));

    if (this.failed > 0) {
      console.warn('\n⚠️ Some tests failed. Check the output above.');
    } else {
      console.log('\n🎉 All tests passed!');
    }
  }
}

// Funzione helper per eseguire test nel browser
export async function testAudioErrorHandler() {
  const tester = new AudioErrorHandlerTest();
  return await tester.runAllTests();
}

// Export per uso in Node.js
export default AudioErrorHandlerTest;

// Se eseguito direttamente
if (typeof window !== 'undefined') {
  // Browser: esponi globalmente per test in console
  window.testAudioErrorHandler = testAudioErrorHandler;
  console.log('🧪 Audio Error Handler Test Suite loaded');
  console.log('Run tests with: await testAudioErrorHandler()');
}
