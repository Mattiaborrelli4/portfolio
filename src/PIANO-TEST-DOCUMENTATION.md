# 🎹 Piano Interattivo - Documentazione Test Suite

## 📋 Indice

1. [Introduzione](#introduzione)
2. [Struttura del Piano](#struttura-del-piano)
3. [Test Cases Dettagliati](#test-cases-dettagliati)
4. [Funzioni di Debug](#funzioni-di-debug)
5. [Guida all'Uso](#guida-alluso)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## 🎯 Introduzione

Questa Test Suite è stata creata per verificare il funzionamento del **Piano Interattivo** con Web Audio API. Il progetto prevede 18 note musicali associate a 18 skill tecnologiche, con sincronizzazione visiva e melodia di sottofondo.

### Caratteristiche Principali

- ✅ **18 note musicali** (4 ottave, da C4 a F6)
- ✅ **Sincronizzazione visiva** in tempo reale
- ✅ **Hover interattivo** su ogni skill
- ✅ **Melodia sequenziata** loopabile
- ✅ **Performance ottimizzate** (60 FPS)
- ✅ **Compatibilità mobile**

---

## 🎹 Struttura del Piano

### Mapping Note → Skill

| Nota | Frequenza | Skill | Ottava |
|------|-----------|-------|--------|
| C4 | 261.63 Hz | JavaScript | 4 |
| D4 | 293.66 Hz | React | 4 |
| E4 | 329.63 Hz | Vue.js | 4 |
| F4 | 349.23 Hz | TypeScript | 4 |
| G4 | 392.00 Hz | Three.js | 4 |
| A4 | 440.00 Hz | WebGL | 4 |
| B4 | 493.88 Hz | GSAP | 4 |
| C5 | 523.25 Hz | Node.js | 5 |
| D5 | 587.33 Hz | Web Audio | 5 |
| E5 | 659.25 Hz | Canvas | 5 |
| F5 | 698.46 Hz | CSS | 5 |
| G5 | 783.99 Hz | HTML | 5 |
| A5 | 880.00 Hz | Accessibility | 5 |
| B5 | 987.77 Hz | Performance | 5 |
| C6 | 1046.50 Hz | Git | 6 |
| D6 | 1174.66 Hz | Figma | 6 |
| E6 | 1318.51 Hz | Java | 6 |
| F6 | 1396.91 Hz | Cybersecurity | 6 |

### Scala Musicale

Le note seguono la **scala diatonica maggiore**:
- **Ottava 4**: Do-Re-Mi-Fa-Sol-La-Si (7 note)
- **Ottava 5**: Do-Re-Mi-Fa-Sol-La-Si (7 note)
- **Ottava 6**: Do-Re-Mi-Fa (4 note)

---

## 🧪 Test Cases Dettagliati

### TEST 1: Caricamento Audio

**Obiettivo**: Verificare che tutte le 18 note vengano generate correttamente.

**Cosa verifica**:
- ✅ Inizializzazione AudioContext
- ✅ Creazione oscillatori per ogni nota
- ✅ Verifica frequenze corrette
- ✅ Nessun errore in console

**Risultato Atteso**:
```
✅ 18/18 note caricate
⏱️ Durata: < 1000ms
🔊 AudioContext: running
```

**Comandi**:
```javascript
// Test singolo
await PianoTestSuite.testAudioLoading()

// Include in runAllTests()
```

**Possibili Errori**:
| Errore | Causa | Soluzione |
|--------|-------|-----------|
| "Web Audio API non supportata" | Browser obsoleto | Aggiorna browser |
| "Nota X non trovata" | Mappatura errata | Verifica PIANO_NOTES |
| "AudioContext suspended" | Mancata interazione utente | Clicca pagina prima |

---

### TEST 2: Play Melody

**Obiettivo**: Verificare che la melodia suoni correttamente.

**Melodia di Test**: *Twinkle Twinkle Little Star*
```
C4 C4 G4 G4 A4 A4 G4 - 4 sec
F4 F4 E4 E4 D4 D4 C4 - 4 sec
```

**Cosa verifica**:
- ✅ Ordine corretto delle note
- ✅ Timing preciso (±50ms)
- ✅ Loop automatico
- ✅ Intensità audio appropriata

**Risultato Atteso**:
```
🎵 14 note suonate
⏱️ Timing avg: ±25ms
🔄 Loop: OK
```

**Comandi**:
```javascript
// Test completo
await PianoTestSuite.testPlayMelody()

// Ascolta melodia mentre testi
```

**Nota**: La melodia dura circa 8 secondi totali.

---

### TEST 3: Sincronizzazione Visiva

**Obiettivo**: Verificare che le skill si illuminino in sincro con le note.

**Cosa verifica**:
- ✅ Latenza audio → visivo < 50ms
- ✅ Classe `.active` applicata correttamente
- ✅ Durata illuminazione = durata nota
- ✅ Rimozione classe a fine nota

**Risultato Atteso**:
```
⏱️ Latenza media: < 50ms
⏱️ Latenza max: < 100ms
👁️ 5/5 skill sincronizzate
```

**Classi CSS Verificate**:
```css
.skill-note.active {
  transform: scale(1.1);
  border-color: #2C5F7F;
  box-shadow: 0 0 20px rgba(44, 95, 127, 0.5);
}
```

**Comandi**:
```javascript
// Test sincronizzazione
await PianoTestSuite.testVisualSync()

// Debug latenza specifica
await PianoTestSuite.debugCheckSyncLatency()
```

---

### TEST 4: Hover Note

**Obiettivo**: Verificare che hover sulle skill suoni la nota.

**Cosa verifica**:
- ✅ Ogni skill suona la sua nota
- ✅ Funziona anche con melodia spenta
- ✅ Hover rapidi non creano distorsione
- ✅ Nessuna nota sovrapposta

**Risultato Atteso**:
```
🖱️ 18/18 hover testati
🎵 Ogni hover suona nota
✅ Nessuna distorsione
```

**Comandi**:
```javascript
// Test hover completo
await PianoTestSuite.testHoverNote()

// Manual test dalla console
const button = document.querySelector('[data-skill="javascript"]');
button.dispatchEvent(new MouseEvent('mouseenter'));
```

**Nota**: Su mobile, sostituisci `mouseenter` con `touchstart`.

---

### TEST 5: Toggle Play/Stop

**Obiettivo**: Verificare che il toggle play/stop funzioni.

**Cosa verifica**:
- ✅ Click play avvia melodia
- ✅ Click stop ferma melodia
- ✅ Icona bottone cambia
- ✅ 5 cicli consecutivi senza errori

**Risultato Atteso**:
```
▶️ 5/5 play OK
⏹️ 5/5 stop OK
🔄 10/10 transizioni OK
```

**Stati Bottone**:
| Stato | Icona | Classi |
|-------|-------|--------|
| Stop | ♪ | (vuoto) |
| Play | ⏸ | `.playing` |

**Comandi**:
```javascript
// Test toggle
await PianoTestSuite.testTogglePlayStop()

// Manuale
document.getElementById('melodyBtn').click()
```

---

### TEST 6: Performance

**Obiettivo**: Verificare che non ci siano lag o memory leak.

**Cosa verifica**:
- ✅ 100 note in sequenza
- ✅ FPS > 55 durante esecuzione
- ✅ Memory leak < 10MB
- ✅ Nessun oscillatore pendente

**Risultato Atteso**:
```
⚡ 100 note eseguite
📊 FPS avg: > 55
💾 Memory leak: < 5MB
✅ Nessun oscillatore pendente
```

**Metriche**:
```javascript
{
  avgFPS: 59.8,        // Media FPS
  minFPS: 54.2,        // Minimo FPS
  maxFPS: 60.0,        // Massimo FPS
  memoryLeak: 2.3,     // MB leaked
  duration: 5200       // ms totali
}
```

**Comandi**:
```javascript
// Test performance completo
await PianoTestSuite.testPerformance()

// Monitoraggio memoria manuale
console.log(performance.memory)
```

**Ottimizzazioni**:
- Garbage collection automatica
- Oscillatori auto-distruttivi
- Gain node efficiente

---

### TEST 7: Mobile

**Obiettivo**: Verificare compatibilità mobile.

**Cosa verifica**:
- ✅ Touch events funzionano
- ✅ AudioContext si unlocka
- ✅ Responsive layout corretto
- ✅ Performance accettabile

**Risultato Atteso**:
```
📱 Mobile: detected
👆 Touch: supported
🔓 AudioContext: unlocked
📐 Layout: responsive
```

**Breakpoint Layout**:
| Viewport | Colonne |
|----------|---------|
| < 768px | 1-2 colonne |
| 768-1024px | 3-4 colonne |
| > 1024px | 5-6 colonne |

**Comandi**:
```javascript
// Test mobile
await PianoTestSuite.testMobile()

// Simula mobile da desktop
Object.defineProperty(navigator, 'userAgent', {
  get: () => 'iPhone'
});
```

---

## 🔧 Funzioni di Debug

### debugLogSequencerState()

**Descrizione**: Log completo dello stato del sequencer.

**Output**:
```javascript
🎛️ SEQUENCER STATE DEBUG
Melody Button:
  Element: <button>
  Playing class: true
  HTML: <span class="melody-btn-icon">⏸</span>

Skill Buttons:
  Total: 18
  Active: 3

Skills Detail:
  1. javascript: 261.63Hz [active: true, audio-active: true]
  2. react: 293.66Hz [active: false, audio-active: true]
  ...
```

**Uso**:
```javascript
PianoTestSuite.debugLogSequencerState()
```

---

### debugVisualizeWaveforms()

**Descrizione**: Crea visualizzatore waveform in tempo reale.

**Output**: Canvas con waveform verde su sfondo nero.

**Uso**:
```javascript
PianoTestSuite.debugVisualizeWaveforms()
// Suona una nota per vedere la waveform
```

**Personalizzazione**:
```javascript
// Modifica dimensioni canvas
canvas.width = 1200;
canvas.height = 600;

// Modifica colore waveform
ctx.strokeStyle = '#ff0000'; // Rosso
```

---

### debugCheckSyncLatency()

**Descrizione**: Misura latenza tra audio e visualizzazione.

**Output**:
```javascript
⏱️ SYNC LATENCY CHECK
🔍 Misurazione latenza su 10 note...
  1. Audio→Visual: 2.456ms
  2. Audio→Visual: 1.987ms
  ...

📊 Statistiche Latenza:
  Media: 2.234ms
  Min: 1.543ms
  Max: 3.123ms
✅ Eccellente! (< 1 frame @ 60fps)
```

**Uso**:
```javascript
const latencyResults = await PianoTestSuite.debugCheckSyncLatency()
console.log(latencyResults.avgLatency)
```

---

### debugTestEachNote()

**Descrizione**: Suona ogni nota singolarmente e verifica.

**Output**:
```javascript
🎵 INDIVIDUAL NOTE TEST
🔍 Test di 18 note...

🎵 Test C4 (Do (C4))
   Frequenza: 261.63Hz
   Skill: javascript
   ✅ Nota suonata correttamente

📊 RIEPILOGO:
   Totali: 18
   ✅ Passate: 18
   ❌ Fallite: 0
   ✅ Success rate: 100.0%
```

**Uso**:
```javascript
const results = await PianoTestSuite.debugTestEachNote()
console.log(`${results.passedNotes}/${results.totalNotes} note OK`)
```

---

## 📘 Guida all'Uso

### Installazione

1. **Copia il file** nella cartella `src/`:
```bash
src/
  ├── main.js
  ├── piano-test-suite.js  ← Aggiungi questo
  └── ...
```

2. **Importa in main.js**:
```javascript
import './piano-test-suite.js';
```

3. **Oppure usa da console** (senza modificare main.js):
```html
<script type="module" src="/src/piano-test-suite.js"></script>
```

---

### Utilizzo Base

#### Da Console Browser

```javascript
// Esegui tutti i test
await PianoTestSuite.runAllTests()

// Quick test (solo test critici)
await PianoTestSuite.runQuickTest()

// Test singolo
await PianoTestSuite.testAudioLoading()
await PianoTestSuite.testVisualSync()
```

#### Da Codice

```javascript
// Importa funzioni specifiche
import {
  testAudioLoading,
  debugTestEachNote,
  PIANO_NOTES
} from './piano-test-suite.js';

// Usa nel tuo codice
async function myTest() {
  const result = await testAudioLoading();
  console.log(result.passed ? 'OK' : 'FAIL');
}
```

---

### Test Personalizzati

```javascript
// Crea test custom
async function customTest() {
  console.log('🧪 Test Personalizzato');

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();

  // Test 3 note specifiche
  const notes = ['C4', 'E4', 'G4'];

  for (const note of notes) {
    const noteData = PIANO_NOTES[note];
    console.log(`Testing ${note}...`);

    // Suona nota
    const osc = audioContext.createOscillator();
    osc.frequency.value = noteData.frequency;
    osc.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + 0.5);

    await new Promise(r => setTimeout(r, 600));
  }
}

// Esegui
await customTest();
```

---

### Integrazione CI/CD

```javascript
// Per test automatici in CI
async function ciTest() {
  const results = await runAllTests();

  const allPassed = Object.values(results).every(r => r.passed);

  if (!allPassed) {
    console.error('❌ Tests failed');
    process.exit(1);
  }

  console.log('✅ All tests passed');
  process.exit(0);
}

// In package.json
{
  "scripts": {
    "test": "node -e 'import(\"./src/piano-test-suite.js\").then(m => m.ciTest())'"
  }
}
```

---

## 🐛 Troubleshooting

### Problema: AudioContext non parte

**Sintomo**:
```
AudioContext state: suspended
```

**Soluzione**:
```javascript
// Unlocka con interazione utente
document.addEventListener('click', async () => {
  const audioContext = new AudioContext();
  await audioContext.resume();
  console.log('AudioContext unlocked:', audioContext.state);
}, { once: true });
```

---

### Problema: Note non suonano

**Sintomo**:
```
❌ Nota C4: frequency not set
```

**Soluzione**:
```javascript
// Verifica attributi data-*
document.querySelectorAll('.skill-note').forEach(btn => {
  console.log(
    btn.dataset.skill,
    btn.dataset.frequency
  );
});

// Dovrebbe stampare:
// javascript 261.63
// react 293.66
// ...
```

---

### Problema: Visual sync lento

**Sintomo**:
```
⚠️ Latenza elevata: 125ms
```

**Soluzione**:
```javascript
// Ottimizza con requestAnimationFrame
function syncVisual(noteName) {
  requestAnimationFrame(() => {
    const btn = document.querySelector(`[data-skill="${PIANO_NOTES[noteName].skill}"]`);
    btn.classList.add('active');
  });
}
```

---

### Problema: Memory leak

**Sintomo**:
```
❌ Memory leak eccessivo: 15.5MB
```

**Soluzione**:
```javascript
// Forza garbage collection
if (window.gc) {
  window.gc();
}

// Assicurati di disconnettere nodi
oscillator.disconnect();
gainNode.disconnect();

// E pulisci riferimenti
oscillator = null;
gainNode = null;
```

---

### Problema: Mobile non funziona

**Sintomo**:
```
❌ Touch events non funzionano
```

**Soluzione**:
```javascript
// Aggiungi supporto touch
skillButton.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Previene mouse events
  // Tocca nota...
}, { passive: false });
```

---

## 🏆 Best Practices

### 1. Gestione AudioContext

```javascript
// ✅ BUONO: Unico AudioContext
const audioContext = new AudioContext();

// ❌ CATTIVO: Nuovo context ogni nota
function playNote() {
  const ctx = new AudioContext(); // No!
}
```

### 2. Cleanup Oscillatori

```javascript
// ✅ BUONO: Auto cleanup
const osc = audioContext.createOscillator();
osc.start();
osc.stop(audioContext.currentTime + 0.5);
// Oscillatore si auto-distrugge dopo stop()

// ❌ CATTIVO: Oscillatori pendenti
const osc = audioContext.createOscillator();
osc.start();
// Mai fermato! Memory leak!
```

### 3. Timing Precision

```javascript
// ✅ BUONO: Audio time
const now = audioContext.currentTime;
osc.start(now + 0.1); // Scheduling preciso

// ❌ CATTIVO: setTimeout
setTimeout(() => osc.start(), 100); // Impreciso!
```

### 4. Volume Management

```javascript
// ✅ BUONO: Envelope ADSR
gainNode.gain.setValueAtTime(0, now);
gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05); // Attack
gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1); // Decay
gainNode.gain.linearRampToValueAtTime(0, now + 0.5); // Release

// ❌ CATTIVO: Volume istantaneo
gainNode.gain.value = 0.3; // Click/pop audio!
```

### 5. Error Handling

```javascript
// ✅ BUONO: Try-catch con log
try {
  const osc = audioContext.createOscillator();
  osc.start();
} catch (error) {
  console.error('Errore oscillatore:', error);
  // Gestisci errore gracefulmente
}

// ❌ CATTIVO: Nessuna gestione
const osc = audioContext.createOscillator();
osc.start(); // Se fallisce, crasha tutto!
```

---

## 📊 Metriche di Successo

### Performance Targets

| Metrica | Target | Acceptable | Poor |
|---------|--------|------------|------|
| FPS | 60 | >55 | <50 |
| Latenza sync | <16ms | <50ms | >100ms |
| Memory leak | <2MB | <5MB | >10MB |
| Caricamento note | <500ms | <1000ms | >2000ms |
| Mobile FPS | 60 | >50 | <40 |

### Coverage Targets

- ✅ 100% note caricate (18/18)
- ✅ 100% note suonabili (18/18)
- ✅ 100% hover funzionanti (18/18)
- ✅ 100% sync test passati
- ✅ 0 oscillatori pendenti
- ✅ 0 memory leak critici

---

## 📚 Risorse

### Documentazione Web Audio API

- [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Web Audio API Book](https://webaudioapi.com/book/)
- [AudioContext Specification](https://webaudio.github.io/web-audio-api/)

### Tools

- [Web Audio Inspector (Chrome)](chrome://inspect/#other)
- [AudioContext Meter](https://googlechrome.github.io/web-audio-samples/audiocontext-meter/)
- [Tone.js](https://tonejs.github.io/) - Framework per audio

### Community

- [Web Audio API Slack](https://webaudio.slack.com/)
- [Stack Overflow Web Audio](https://stackoverflow.com/questions/tagged/web-audio-api)
- [Reddit r/WebAudio](https://www.reddit.com/r/WebAudio/)

---

## 📝 Changelog

### Versione 1.0.0 (2026-02-05)

- ✅ 18 note musicali implementate
- ✅ 7 test cases creati
- ✅ 4 funzioni di debug
- ✅ Documentazione completa
- ✅ Supporto mobile
- ✅ Performance ottimizzate

---

## 🤝 Contributing

Per aggiungere nuovi test o funzioni:

1. Aggiungi test case in `piano-test-suite.js`
2. Documenta in questa guida
3. Aggiungi esempi di utilizzo
4. Testa su multiple piattaforme

---

## 📄 Licenza

MIT License - Usa liberamente nel tuo progetto!

---

**Autore**: Mattia Borrelli
**Data**: Febbraio 2026
**Versione**: 1.0.0

---

*Per domande o problemi, apri una issue o contatta MattiaBorrelli2005@gmail.com*
