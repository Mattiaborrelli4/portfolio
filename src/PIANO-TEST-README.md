# 🎹 Piano Interattivo - Test Suite Completa

## 📦 Contenuto del Pacchetto

Questo pacchetto contiene 4 file per testare e fare debug del piano interattivo:

```
src/
├── piano-test-suite.js                    # Test suite completa (18 note, 7 test cases)
├── piano-test-integration-example.js      # Esempi di integrazione
├── piano-quick-test.js                    # Script rapido per console
└── PIANO-TEST-DOCUMENTATION.md            # Documentazione completa
```

---

## 🚀 Quick Start

### Opzione 1: Test Rapido dalla Console (PIÙ VELOCE)

1. **Apri il sito nel browser**
2. **Apri la console** (F12)
3. **Copia e incolla** il contenuto di `piano-quick-test.js`
4. **Esegui i comandi**:

```javascript
// Test veloce
pianoQuickTest()

// Suona una nota
pianoPlayNote("C4")

// Test tutte le note
pianoTestAllNotes()

// Vedi aiuto
pianoHelp()
```

---

### Opzione 2: Test Suite Completa

1. **Importa in main.js**:

```javascript
import './piano-test-suite.js';
```

2. **Usa dalla console**:

```javascript
// Esegui tutti i test
await PianoTestSuite.runAllTests()

// Quick test
await PianoTestSuite.runQuickTest()

// Debug
await PianoTestSuite.debugTestEachNote()
await PianoTestSuite.debugLogSequencerState()
```

---

### Opzione 3: Integrazione Avanzata

Vedi `piano-test-integration-example.js` per esempi completi di:
- Integrazione con AudioController esistente
- Test automatici all'avvio
- Test periodici
- A/B testing
- Monitoring

---

## 📋 Test Cases (7 Totali)

| # | Test | Cosa Verifica | Durata |
|---|------|---------------|--------|
| 1 | Caricamento Audio | 18 note caricate correttamente | ~1s |
| 2 | Play Melody | Melodia suona correttamente | ~8s |
| 3 | Sincronizzazione Visiva | Skill si illuminano in sincro | ~5s |
| 4 | Hover Note | Hover su skill suona note | ~10s |
| 5 | Toggle Play/Stop | Bottone play/stop funziona | ~5s |
| 6 | Performance | Nessun lag o memory leak | ~10s |
| 7 | Mobile | Compatibilità mobile | ~5s |

**Tempo totale**: ~45 secondi per tutti i test

---

## 🔧 Funzioni di Debug

### PianoTestSuite (Completa)

```javascript
// Test individuali
await PianoTestSuite.testAudioLoading()
await PianoTestSuite.testPlayMelody()
await PianoTestSuite.testVisualSync()
await PianoTestSuite.testHoverNote()
await PianoTestSuite.testTogglePlayStop()
await PianoTestSuite.testPerformance()
await PianoTestSuite.testMobile()

// Debug functions
PianoTestSuite.debugLogSequencerState()
PianoTestSuite.debugVisualizeWaveforms()
await PianoTestSuite.debugCheckSyncLatency()
await PianoTestSuite.debugTestEachNote()

// Utility
await PianoTestSuite.runAllTests()
await PianoTestSuite.runQuickTest()
PianoTestSuite.generateTestReport(results)
```

### Quick Test (Console)

```javascript
// Test base
pianoQuickTest()

// Play note
pianoPlayNote("C4")
pianoPlayNote("E5")

// Play sequence
pianoPlayScale()
pianoPlayMelody()

// Test completi
pianoTestAllNotes()
pianoPerfTest()

// Utility
pianoCheckState()
pianoHelp()
```

---

## 🎹 Note del Piano (18 Totali)

### Ottava 4 (Note centrali)
- **C4**: 261.63 Hz → JavaScript
- **D4**: 293.66 Hz → React
- **E4**: 329.63 Hz → Vue.js
- **F4**: 349.23 Hz → TypeScript
- **G4**: 392.00 Hz → Three.js
- **A4**: 440.00 Hz → WebGL
- **B4**: 493.88 Hz → GSAP

### Ottava 5 (Note acute)
- **C5**: 523.25 Hz → Node.js
- **D5**: 587.33 Hz → Web Audio
- **E5**: 659.25 Hz → Canvas
- **F5**: 698.46 Hz → CSS
- **G5**: 783.99 Hz → HTML
- **A5**: 880.00 Hz → Accessibility
- **B5**: 987.77 Hz → Performance

### Ottava 6 (Note molto acute)
- **C6**: 1046.50 Hz → Git
- **D6**: 1174.66 Hz → Figma
- **E6**: 1318.51 Hz → Java
- **F6**: 1396.91 Hz → Cybersecurity

---

## 📊 Metriche di Successo

### Performance Targets
- ✅ **60 FPS** durante esecuzione
- ✅ **< 50ms** latenza sync
- ✅ **< 5MB** memory leak
- ✅ **100%** note caricate (18/18)
- ✅ **0** oscillatori pendenti

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile iOS Safari
- ✅ Mobile Chrome

---

## 🐛 Troubleshooting

### AudioContext non parte
```javascript
// Sblocca con interazione utente
document.addEventListener('click', async () => {
  const ctx = new AudioContext();
  await ctx.resume();
});
```

### Note non suonano
```javascript
// Verifica attributi data-*
document.querySelectorAll('.skill-note').forEach(btn => {
  console.log(btn.dataset.skill, btn.dataset.frequency);
});
```

### Visual sync lento
```javascript
// Ottimizza con requestAnimationFrame
function syncVisual(note) {
  requestAnimationFrame(() => {
    const btn = document.querySelector(`[data-skill="${note}"]`);
    btn.classList.add('active');
  });
}
```

---

## 📚 Documentazione

Per documentazione completa, vedi:
- **`PIANO-TEST-DOCUMENTATION.md`** - Guida completa 200+ righe
- **`piano-test-suite.js`** - Commenti inline dettagliati
- **`piano-test-integration-example.js`** - Esempi di integrazione

---

## 💡 Esempi di Utilizzo

### Esempio 1: Test Singolo
```javascript
// Test solo sincronizzazione visiva
import { testVisualSync } from './piano-test-suite.js';

const result = await testVisualSync();
console.log(result.passed ? 'OK' : 'FAIL');
```

### Esempio 2: Test con Report
```javascript
// Esegui tutti e genera report
import { runAllTests, generateTestReport } from './piano-test-suite.js';

const results = await runAllTests();
const report = generateTestReport(results);

console.log('Success rate:', report.successRate + '%');
```

### Esempio 3: Monitoraggio
```javascript
// Test periodici ogni 5 minuti
setInterval(async () => {
  const results = await runQuickTest();
  const allPassed = Object.values(results).every(r => r.passed);

  if (!allPassed) {
    console.warn('Tests failed!');
    // Invia notifica
  }
}, 5 * 60 * 1000);
```

---

## 🎯 Best Practices

### 1. Gestione AudioContext
```javascript
// ✅ BUONO: Unico context
const audioContext = new AudioContext();

// ❌ CATTIVO: Nuovo context ogni volta
function playNote() {
  const ctx = new AudioContext(); // No!
}
```

### 2. Cleanup Oscillatori
```javascript
// ✅ BUONO: Auto cleanup
osc.start(now);
osc.stop(now + 0.5);
// Si auto-distrugge

// ❌ CATTIVO: Mai fermato
osc.start();
// Memory leak!
```

### 3. Timing Precision
```javascript
// ✅ BUONO: Audio time
osc.start(audioContext.currentTime + 0.1);

// ❌ CATTIVO: setTimeout
setTimeout(() => osc.start(), 100); // Impreciso
```

---

## 🔗 Risorse

### Web Audio API
- [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Web Audio API Book](https://webaudioapi.com/book/)
- [AudioContext Spec](https://webaudio.github.io/web-audio-api/)

### Tools
- [Web Audio Inspector (Chrome)](chrome://inspect/#other)
- [AudioContext Meter](https://googlechrome.github.io/web-audio-samples/audiocontext-meter/)
- [Tone.js](https://tonejs.github.io/)

---

## 📝 Changelog

### v1.0.0 (2026-02-05)
- ✅ 18 note musicali implementate
- ✅ 7 test cases completi
- ✅ 4 funzioni di debug
- ✅ Documentazione completa
- ✅ Supporto mobile
- ✅ Performance ottimizzate

---

## 🤝 Contributing

Per aggiungere nuovi test o funzioni:

1. Aggiungi test case in `piano-test-suite.js`
2. Documenta in `PIANO-TEST-DOCUMENTATION.md`
3. Aggiungi esempi in `piano-test-integration-example.js`
4. Testa su multiple piattaforme

---

## 📄 Licenza

MIT License - Usa liberamente nel tuo progetto!

---

## 👨‍💻 Autore

**Mattia Borrelli**
- Email: MattiaBorrelli2005@gmail.com
- Portfolio: [mattiaborrelli.dev](https://mattiaborrelli.dev)
- GitHub: [@mattiaborrelli](https://github.com/mattiaborrelli)

---

## 🎓 Ringraziamenti

- Web Audio API community
- GSAP team per le animazioni
- Lenis per smooth scroll
- Vite per build tool

---

**Creato con ❤️ da Mattia Borrelli - Febbraio 2026**

---

*Per domande o problemi, contatta MattiaBorrelli2005@gmail.com o apri una issue su GitHub*
