/**
 * Skill Visual Sync - Debug Utilities
 *
 * Strumenti di debug per il sistema di sincronizzazione visiva
 *
 * USO:
 * 1. Importa questo file in main.js per development
 * 2. Apri la console del browser
 * 3. Usa le funzioni disponibili globalmente
 */

export class SkillVisualDebug {
  constructor() {
    this.isEnabled = false;
    this.debugLog = [];
    this.maxLogEntries = 100;
  }

  /**
   * Abilita il debug mode
   */
  enable() {
    this.isEnabled = true;
    console.log('🐛 Skill Visual Debug ENABLED');
    this.log('Debug mode enabled');
  }

  /**
   * Disabilita il debug mode
   */
  disable() {
    this.isEnabled = false;
    console.log('🐛 Skill Visual Debug DISABLED');
  }

  /**
   * Logga un messaggio
   */
  log(message, data = null) {
    if (!this.isEnabled) return;

    const entry = {
      timestamp: new Date().toISOString(),
      message,
      data
    };

    this.debugLog.push(entry);

    // Mantieni solo gli ultimi N entries
    if (this.debugLog.length > this.maxLogEntries) {
      this.debugLog.shift();
    }

    console.log(`🐛 [SkillSync] ${message}`, data || '');
  }

  /**
   * Mostra tutti i log
   */
  showLogs() {
    console.table(this.debugLog);
  }

  /**
   * Pulisci i log
   */
  clearLogs() {
    this.debugLog = [];
    console.log('🐛 Logs cleared');
  }

  /**
   * Esporta i log in JSON
   */
  exportLogs() {
    const json = JSON.stringify(this.debugLog, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `skill-visual-debug-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
    console.log('🐛 Logs exported');
  }

  /**
   * Ispeziona una skill card
   */
  inspectCard(skillName) {
    const card = document.querySelector(`[data-skill="${skillName}"]`);

    if (!card) {
      console.warn(`⚠️ Card not found: ${skillName}`);
      return;
    }

    const frequency = card.getAttribute('data-frequency');
    const classes = Array.from(card.classList);
    const isPlaying = classes.includes('skill-note--playing');
    const rect = card.getBoundingClientRect();

    console.log('📋 Card Inspection:', {
      skill: skillName,
      frequency: frequency,
      classes: classes,
      isPlaying: isPlaying,
      position: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      },
      styles: {
        backgroundColor: getComputedStyle(card).backgroundColor,
        borderColor: getComputedStyle(card).borderColor,
        transform: getComputedStyle(card).transform
      }
    });

    return card;
  }

  /**
   * Mostra tutte le skill cards
   */
  showAllCards() {
    const cards = document.querySelectorAll('.skill-note');
    const cardData = [];

    cards.forEach(card => {
      const skill = card.getAttribute('data-skill');
      const frequency = card.getAttribute('data-frequency');

      cardData.push({
        skill,
        frequency,
        hasDataFrequency: !!frequency,
        hasDataSkill: !!skill
      });
    });

    console.table(cardData);
    return cardData;
  }

  /**
   * Verifica l'integrità del sistema
   */
  checkIntegrity() {
    const issues = [];

    // Check 1: Cards esistono
    const cards = document.querySelectorAll('.skill-note');
    if (cards.length === 0) {
      issues.push({
        severity: 'error',
        message: 'Nessuna skill card trovata'
      });
    }

    // Check 2: Cards hanno attributi richiesti
    cards.forEach(card => {
      const skill = card.getAttribute('data-skill');
      const frequency = card.getAttribute('data-frequency');

      if (!skill) {
        issues.push({
          severity: 'warning',
          message: 'Card senza data-skill',
          card: card.outerHTML.substring(0, 100)
        });
      }

      if (!frequency) {
        issues.push({
          severity: 'warning',
          message: 'Card senza data-frequency',
          card: card.outerHTML.substring(0, 100)
        });
      }
    });

    // Check 3: SkillSync inizializzato
    const skillSync = window.__portfolioContexts?.skillSync;
    if (!skillSync) {
      issues.push({
        severity: 'error',
        message: 'SkillSync non inizializzato'
      });
    }

    // Check 4: AudioSequencer inizializzato
    const audio = window.__portfolioContexts?.audioSequencer;
    if (!audio) {
      issues.push({
        severity: 'error',
        message: 'AudioSequencer non inizializzato'
      });
    }

    // Check 5: CSS caricato
    const testCard = document.querySelector('.skill-note');
    if (testCard) {
      const styles = getComputedStyle(testCard);
      // Test transizioni applicate
      const hasTransition = styles.transition !== 'all 0s ease 0s';
      if (!hasTransition) {
        issues.push({
          severity: 'warning',
          message: 'Transizioni CSS non applicate'
        });
      }
    }

    // Report
    console.log('\n═══════════════════════════════════');
    console.log('🔍 Skill Visual Sync Integrity Check');
    console.log('═══════════════════════════════════');

    if (issues.length === 0) {
      console.log('✅ Nessun problema trovato!');
    } else {
      const errors = issues.filter(i => i.severity === 'error');
      const warnings = issues.filter(i => i.severity === 'warning');

      console.log(`❌ Errori: ${errors.length}`);
      errors.forEach(issue => console.error(`  - ${issue.message}`));

      console.log(`⚠️ Warning: ${warnings.length}`);
      warnings.forEach(issue => console.warn(`  - ${issue.message}`));
    }

    console.log('═══════════════════════════════════\n');

    return {
      passed: issues.filter(i => i.severity === 'error').length === 0,
      issues
    };
  }

  /**
   * Test visual di una card
   */
  testCard(skillName, duration = 500) {
    this.log(`Testing card: ${skillName}`);

    const card = document.querySelector(`[data-skill="${skillName}"]`);

    if (!card) {
      console.warn(`⚠️ Card not found: ${skillName}`);
      return;
    }

    // Aggiungi classe
    card.classList.add('skill-note--playing');
    console.log(`✨ Card "${skillName}" illuminata`);

    // Rimuovi dopo duration
    setTimeout(() => {
      card.classList.remove('skill-note--playing');
      console.log(`💫 Card "${skillName}" spenta`);
    }, duration);

    return card;
  }

  /**
   * Benchmark del sistema
   */
  benchmark(iterations = 100) {
    console.log(`⚡ Benchmark: ${iterations} iterazioni`);

    const results = {
      syncTime: [],
      totalTime: []
    };

    const skillSync = window.__portfolioContexts?.skillSync;

    if (!skillSync) {
      console.error('❌ SkillSync non inizializzato');
      return;
    }

    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      const iterStart = performance.now();

      skillSync.sync('C4');

      const iterEnd = performance.now();
      results.syncTime.push(iterEnd - iterStart);
    }

    const end = performance.now();

    results.totalTime = end - start;

    // Statistiche
    const avgSync = results.syncTime.reduce((a, b) => a + b, 0) / results.syncTime.length;
    const minSync = Math.min(...results.syncTime);
    const maxSync = Math.max(...results.syncTime);

    console.log('\n═══════════════════════════════════');
    console.log('⚡ Benchmark Results');
    console.log('═══════════════════════════════════');
    console.log(`🔄 Iterazioni: ${iterations}`);
    console.log(`⏱️ Tempo Totale: ${results.totalTime.toFixed(2)}ms`);
    console.log(`📊 Tempo Medio Sync: ${avgSync.toFixed(3)}ms`);
    console.log(`⚡ Tempo Minimo: ${minSync.toFixed(3)}ms`);
    console.log(`🐌 Tempo Massimo: ${maxSync.toFixed(3)}ms`);
    console.log(`🚀 Ops/secondo: ${(1000 / avgSync).toFixed(0)}`);
    console.log('═══════════════════════════════════\n');

    return results;
  }

  /**
   * Mostra aiuto
   */
  showHelp() {
    console.log('\n═══════════════════════════════════');
    console.log('🐛 Skill Visual Debug - Help');
    console.log('═══════════════════════════════════');
    console.log('Comandi disponibili:');
    console.log('');
    console.log('📊 Ispetione:');
    console.log('  - inspectCard(skillName)');
    console.log('  - showAllCards()');
    console.log('');
    console.log('🔍 Verifica:');
    console.log('  - checkIntegrity()');
    console.log('');
    console.log('🧪 Testing:');
    console.log('  - testCard(skillName, duration)');
    console.log('  - benchmark(iterations)');
    console.log('');
    console.log('📝 Logging:');
    console.log('  - enable() / disable()');
    console.log('  - showLogs() / clearLogs()');
    console.log('  - exportLogs()');
    console.log('═══════════════════════════════════\n');
  }
}

/**
 * Istanza singleton
 */
export const skillVisualDebug = new SkillVisualDebug();

/**
 * Auto-registrazione in development mode
 */
if (import.meta.env.DEV) {
  window.__portfolioDebug = skillVisualDebug;

  console.log('🐛 Debug utilities available:');
  console.log('  window.__portfolioDebug.enable()');
  console.log('  window.__portfolioDebug.checkIntegrity()');
  console.log('  window.__portfolioDebug.showHelp()');
}

export default skillVisualDebug;
