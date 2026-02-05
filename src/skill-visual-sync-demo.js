/**
 * Demo del Sistema di Sincronizzazione Visiva
 *
 * Questo file mostra come usare il sistema di sincronizzazione visiva
 * per illuminare le skill cards in sincronia con l'audio.
 *
 * Per eseguire questa demo:
 * 1. Apri la console del browser (F12)
 * 2. Assicurati che il portfolio sia caricato
 * 3. Esegui uno dei comandi qui sotto
 */

// ============================================================================
// ESEMPI DI UTILIZZO
// ============================================================================

/**
 * ESEMPIO 1: Test Base
 * Illumina tutte le skill cards in sequenza
 */
export function demoBasicTest() {
  console.log('🎵 Demo 1: Test Base - Illuminazione cards in sequenza');

  const skillSync = window.__portfolioContexts?.skillSync;

  if (!skillSync) {
    console.error('❌ SkillSync non inizializzato');
    return;
  }

  // Test tutte le cards
  skillSync.test();
}

/**
 * ESEMPIO 2: Sincronizzazione Singola Nota
 * Illumina una specifica skill card
 */
export function demoSingleNote() {
  console.log('🎵 Demo 2: Singola Nota - Illumina card JavaScript');

  const skillSync = window.__portfolioContexts?.skillSync;

  if (!skillSync) {
    console.error('❌ SkillSync non inizializzato');
    return;
  }

  // Illumina la card JavaScript (frequenza C4 = 261.63Hz)
  skillSync.sync('C4');
}

/**
 * ESEMPIO 3: Sequenza Personalizzata
 * Crea una sequenza di note personalizzata
 */
export function demoCustomSequence() {
  console.log('🎵 Demo 3: Sequenza Personalizzata');

  const skillSync = window.__portfolioContexts?.skillSync;

  if (!skillSync) {
    console.error('❌ SkillSync non inizializzato');
    return;
  }

  // Sequenza: C4, E4, G4, C5 (arpeggio C maggiore)
  const sequence = ['C4', 'E4', 'G4', 'C5'];
  let delay = 0;

  sequence.forEach((note, index) => {
    setTimeout(() => {
      console.log(`  🎵 Nota ${index + 1}: ${note}`);
      skillSync.sync(note);
    }, delay);

    delay += 400; // 400ms tra le note
  });
}

/**
 * ESEMPIO 4: Melodia Completa
 * Suona una melodia con illuminazione sincronizzata
 */
export function demoMelody() {
  console.log('🎵 Demo 4: Melodia "Twinkle Twinkle"');

  const skillSync = window.__portfolioContexts?.skillSync;
  const audio = window.__portfolioContexts?.audioSequencer;

  if (!skillSync || !audio) {
    console.error('❌ Sistema non inizializzato');
    return;
  }

  // Twinkle Twinkle Little Star
  const melody = [
    { note: 'C4', duration: 500 },
    { note: 'C4', duration: 500 },
    { note: 'G4', duration: 500 },
    { note: 'G4', duration: 500 },
    { note: 'A4', duration: 500 },
    { note: 'A4', duration: 500 },
    { note: 'G4', duration: 1000 },
  ];

  let currentTime = 0;

  melody.forEach((noteData, index) => {
    setTimeout(() => {
      console.log(`  🎵 Nota ${index + 1}: ${noteData.note} (${noteData.duration}ms)`);
      skillSync.sync(noteData.note);
    }, currentTime);

    currentTime += noteData.duration;
  });
}

/**
 * ESEMPIO 5: Statistiche
 * Mostra le statistiche del sistema
 */
export function demoStats() {
  console.log('📊 Demo 5: Statistiche del Sistema');

  const skillSync = window.__portfolioContexts?.skillSync;

  if (!skillSync) {
    console.error('❌ SkillSync non inizializzato');
    return;
  }

  const stats = skillSync.getStats();

  console.log('═══════════════════════════════════');
  console.log('📊 Statistiche Skill Visual Sync');
  console.log('═══════════════════════════════════');
  console.log(`🎯 Totale Cards: ${stats.totalCards}`);
  console.log(`⏱️ Durata Illuminazione: ${stats.illuminationDuration}ms`);
  console.log(`🎼 Frequenze Mappate: ${stats.frequenciesMapped}`);
  console.log(`💾 Skills Cached: ${stats.cachedSkills.length}`);
  console.log('═══════════════════════════════════');
  console.log('📋 Skills:');
  stats.cachedSkills.forEach((skill, index) => {
    console.log(`   ${index + 1}. ${skill}`);
  });
  console.log('═══════════════════════════════════');
}

/**
 * ESEMPIO 6: Test Performance
 * Testa le performance del sistema
 */
export function demoPerformanceTest() {
  console.log('⚡ Demo 6: Test Performance');

  const skillSync = window.__portfolioContexts?.skillSync;

  if (!skillSync) {
    console.error('❌ SkillSync non inizializzato');
    return;
  }

  const iterations = 50;
  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    setTimeout(() => {
      const randomNote = ['C4', 'E4', 'G4', 'C5'][Math.floor(Math.random() * 4)];
      skillSync.sync(randomNote);

      if (i === iterations - 1) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        const avgTime = duration / iterations;

        console.log('═══════════════════════════════════');
        console.log('⚡ Risultati Performance Test');
        console.log('═══════════════════════════════════');
        console.log(`🔄 Iterazioni: ${iterations}`);
        console.log(`⏱️ Tempo Totale: ${duration.toFixed(2)}ms`);
        console.log(`📊 Tempo Medio: ${avgTime.toFixed(2)}ms per operazione`);
        console.log(`🚀 Ops al secondo: ${(1000 / avgTime).toFixed(0)}`);
        console.log('═══════════════════════════════════');
      }
    }, i * 100);
  }
}

/**
 * ESEMPIO 7: Frequenza Personalizzata
 * Illumina una card usando direttamente la frequenza
 */
export function demoFrequencyDirect() {
  console.log('🎵 Demo 7: Frequenza Diretta');

  const skillSync = window.__portfolioContexts?.skillSync;

  if (!skillSync) {
    console.error('❌ SkillSync non inizializzato');
    return;
  }

  // Illumina React usando la frequenza diretta (293.66Hz = D4)
  console.log('  🎵 Illuminando React (293.66Hz)');
  skillSync.sync(293.66);
}

/**
 * ESEMPIO 8: Reset Sistema
 * Resetta lo stato del sistema
 */
export function demoReset() {
  console.log('🔄 Demo 8: Reset Sistema');

  const skillSync = window.__portfolioContexts?.skillSync;

  if (!skillSync) {
    console.error('❌ SkillSync non inizializzato');
    return;
  }

  skillSync.reset();
  console.log('  ✅ Sistema resettato');
}

/**
 * ESEMPIO 9: Modifica Durata
 * Modifica la durata dell'illuminazione
 */
export function demoChangeDuration() {
  console.log('⏱️ Demo 9: Modifica Durata');

  const skillSync = window.__portfolioContexts?.skillSync;

  if (!skillSync) {
    console.error('❌ SkillSync non inizializzato');
    return;
  }

  // Imposta durata a 600ms
  skillSync.setDuration(600);
  console.log('  ⏱️ Durata impostata a 600ms');

  // Test con nuova durata
  setTimeout(() => {
    console.log('  🎵 Test con nuova durata...');
    skillSync.sync('C4');
  }, 500);

  // Ripristina durata originale
  setTimeout(() => {
    skillSync.setDuration(300);
    console.log('  ⏱️ Durata ripristinata a 300ms');
  }, 2000);
}

/**
 * ESEMPIO 10: Demo Completa
 * Esegue tutti gli esempi in sequenza
 */
export function demoComplete() {
  console.log('🎬 Demo Completa - Esecuzione di tutti gli esempi');

  const demos = [
    { name: 'Test Base', fn: demoBasicTest, delay: 5000 },
    { name: 'Singola Nota', fn: demoSingleNote, delay: 2000 },
    { name: 'Sequenza Personalizzata', fn: demoCustomSequence, delay: 3000 },
    { name: 'Melodia', fn: demoMelody, delay: 5000 },
    { name: 'Statistiche', fn: demoStats, delay: 2000 },
    { name: 'Performance Test', fn: demoPerformanceTest, delay: 8000 },
    { name: 'Frequenza Diretta', fn: demoFrequencyDirect, delay: 1500 },
    { name: 'Reset', fn: demoReset, delay: 1000 },
  ];

  let totalDelay = 0;

  demos.forEach((demo, index) => {
    setTimeout(() => {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`📌 Demo ${index + 1}/${demos.length}: ${demo.name}`);
      console.log(`${'='.repeat(50)}\n`);

      demo.fn();
    }, totalDelay);

    totalDelay += demo.delay;
  });

  // Message finale
  setTimeout(() => {
    console.log(`\n${'='.repeat(50)}`);
    console.log('🎉 Demo Completa Terminata!');
    console.log(`${'='.repeat(50)}\n`);
    console.log('💡 Prova singolarmente:');
    console.log('   demoBasicTest()');
    console.log('   demoSingleNote()');
    console.log('   demoCustomSequence()');
    console.log('   demoMelody()');
    console.log('   demoStats()');
    console.log('   e altro...');
    console.log(`${'='.repeat(50)}\n`);
  }, totalDelay);
}

// ============================================================================
// EXPORTS
// ============================================================================

// Esporta tutte le demo
export const demos = {
  basicTest: demoBasicTest,
  singleNote: demoSingleNote,
  customSequence: demoCustomSequence,
  melody: demoMelody,
  stats: demoStats,
  performanceTest: demoPerformanceTest,
  frequencyDirect: demoFrequencyDirect,
  reset: demoReset,
  changeDuration: demoChangeDuration,
  complete: demoComplete
};

// Auto-registrazione in development mode
if (import.meta.env.DEV) {
  // Aggiungi all'oggetto globale per accesso da console
  window.__portfolioDemos = demos;

  console.log('🎬 Demo Skill Visual Sync disponibili:');
  console.log('  - demoBasicTest()');
  console.log('  - demoSingleNote()');
  console.log('  - demoCustomSequence()');
  console.log('  - demoMelody()');
  console.log('  - demoStats()');
  console.log('  - demoPerformanceTest()');
  console.log('  - demoFrequencyDirect()');
  console.log('  - demoReset()');
  console.log('  - demoChangeDuration()');
  console.log('  - demoComplete()');
  console.log('\n💡 Esegui demoComplete() per vedere tutti gli esempi!\n');
}

export default demos;
