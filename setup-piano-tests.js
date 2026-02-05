/**
 * 🚀 SETUP SCRIPT - Piano Test Suite
 * =================================
 *
 * Script per verificare che tutti i file siano presenti e correttamente configurati
 *
 * Uso: node setup-piano-tests.js
 * Oppure: node setup-piano-tests.js --check
 *        node setup-piano-tests.js --help
 */

const fs = require('fs');
const path = require('path');

// Colori per output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// File richiesti
const requiredFiles = [
  // File principali
  { path: 'piano-test-standalone.html', description: 'Pagina test standalone', essential: true },
  { path: 'src/piano-test-suite.js', description: 'Test suite JavaScript', essential: true },
  { path: 'src/piano-quick-test.js', description: 'Script console rapido', essential: false },
  { path: 'src/piano-test-integration-example.js', description: 'Esempi integrazione', essential: false },

  // Documentazione
  { path: 'PIANO-TEST-CREATION-REPORT.md', description: 'Report creazione', essential: true },
  { path: 'src/PIANO-TEST-DOCUMENTATION.md', description: 'Documentazione completa', essential: true },
  { path: 'src/PIANO-TEST-README.md', description: 'README rapido', essential: false },
  { path: 'QUICK-START-GUIDE.md', description: 'Guida rapida', essential: true },
  { path: 'INDEX-PIANO-TEST-SUITE.md', description: 'Index generale', essential: false }
];

// Verifica file
function checkFiles() {
  log('\n🔍 Verifica File Piano Test Suite\n', 'bold');

  let allPresent = true;
  let essentialMissing = [];
  let optionalMissing = [];

  requiredFiles.forEach(file => {
    const fullPath = path.join(__dirname, file.path);
    const exists = fs.existsSync(fullPath);

    if (exists) {
      const size = fs.statSync(fullPath).size;
      const sizeKB = (size / 1024).toFixed(2);
      log(`  ✅ ${file.path}`, 'green');
      log(`     (${file.description}) - ${sizeKB} KB`, 'reset');
    } else {
      log(`  ❌ ${file.path}`, 'red');
      log(`     (${file.description}) - MANCANTE`, 'reset');

      if (file.essential) {
        essentialMissing.push(file.path);
        allPresent = false;
      } else {
        optionalMissing.push(file.path);
      }
    }
  });

  // Summary
  log('\n📊 Riepilogo\n', 'bold');

  if (allPresent) {
    log('  ✅ Tutti i file essenziali sono presenti!', 'green');
    log(`  ℹ️  ${requiredFiles.length} file totali trovati`, 'cyan');
  } else {
    log(`  ❌ Mancano ${essentialMissing.length} file essenziali:`, 'red');
    essentialMissing.forEach(file => {
      log(`     - ${file}`, 'red');
    });
  }

  if (optionalMissing.length > 0) {
    log(`  ⚠️  File opzionali mancanti (${optionalMissing.length}):`, 'yellow');
    optionalMissing.forEach(file => {
      log(`     - ${file}`, 'yellow');
    });
  }

  return allPresent;
}

// Mostra informazioni
function showInfo() {
  log('\n📚 Informazioni Piano Test Suite\n', 'bold');

  log('🎯 File Principale:', 'cyan');
  log('   src/piano-test-suite.js - Test suite completa', 'reset');

  log('\n🚀 Per Iniziare:', 'cyan');
  log('   1. Apri piano-test-standalone.html nel browser', 'reset');
  log('   2. Clicca "Quick Test Completo"', 'reset');
  log('   3. Oppure importa in main.js:', 'reset');
  log("      import './piano-test-suite.js';", 'yellow');

  log('\n📖 Documentazione:', 'cyan');
  log('   - QUICK-START-GUIDE.md (Guida 30 secondi)', 'reset');
  log('   - PIANO-TEST-CREATION-REPORT.md (Report completo)', 'reset');
  log('   - src/PIANO-TEST-DOCUMENTATION.md (Guida dettagliata)', 'reset');

  log('\n🧪 Funzioni principali:', 'cyan');
  log('   await PianoTestSuite.runAllTests()     - Tutti i test', 'reset');
  log('   await PianoTestSuite.runQuickTest()    - Test rapido', 'reset');
  log('   PianoTestSuite.debugLogSequencerState() - Debug stato', 'reset');

  log('\n🎹 Il Piano:', 'cyan');
  log('   - 18 note musicali (C4-F6, 4 ottave)', 'reset');
  log('   - 7 test cases completi', 'reset');
  log('   - 4 funzioni di debug', 'reset');
  log('   - Performance: 60 FPS, <50ms latenza', 'reset');

  log('\n📞 Supporto:', 'cyan');
  log('   Email: MattiaBorrelli2005@gmail.com', 'reset');
  log('   Docs: Vedi PIANO-TEST-DOCUMENTATION.md', 'reset');
}

// Mostra aiuto
function showHelp() {
  log('\n📖 Setup Script - Aiuto\n', 'bold');

  log('Uso:', 'cyan');
  log('  node setup-piano-tests.js              - Verifica file e mostra info', 'reset');
  log('  node setup-piano-tests.js --check      - Solo verifica file', 'reset');
  log('  node setup-piano-tests.js --info       - Solo informazioni', 'reset');
  log('  node setup-piano-tests.js --help       - Mostra questo aiuto', 'reset');

  log('\nComandi rapidi:', 'cyan');
  log('  Verifica installazione:  node setup-piano-tests.js --check', 'reset');
  log('  Quick start:           Apri piano-test-standalone.html', 'reset');
  log('  Importa:               import "./piano-test-suite.js"', 'reset');

  log('\nFile creati:', 'cyan');
  requiredFiles.forEach(file => {
    const icon = file.essential ? '✅' : '📝';
    log(`  ${icon} ${file.path}`, 'reset');
  });
}

// Main
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || '';

  log('\n🎹 Piano Test Suite - Setup Script', 'bold');
  log('================================\n', 'reset');

  if (command === '--help' || command === '-h') {
    showHelp();
  } else if (command === '--check') {
    const allPresent = checkFiles();
    process.exit(allPresent ? 0 : 1);
  } else if (command === '--info') {
    showInfo();
  } else {
    // Default: check + info
    const allPresent = checkFiles();
    showInfo();

    log('\n✅ Setup completato!\n', 'green');

    if (!allPresent) {
      log('⚠️  Alcuni file mancano. Verifica l\'installazione.\n', 'yellow');
      process.exit(1);
    }
  }
}

// Esegui
if (require.main === module) {
  main();
}

module.exports = { checkFiles, showInfo, showHelp };
