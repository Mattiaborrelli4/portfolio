# 🚀 Guida Rapida - Piano Test Suite

## ⏱️ Inizia in 30 Secondi

### Opzione 1: Più Veloce (Standalone)

1. **Apri questo file nel browser:**
   ```
   C:\Users\matti\Desktop\portfolio\piano-test-standalone.html
   ```

2. **Clicca "🧪 Quick Test Completo"**

3. **Fatto!** ✅

---

### Opzione 2: Da Console (5 Secondi)

1. **Apri il tuo portfolio nel browser** (F12 per console)

2. **Copia e incolla questo codice:**
   ```javascript
   (function(){
     const notes={C4:{f:261.63},D4:{f:293.66},E4:{f:329.63}};
     async function test(){
       const ctx=new(window.AudioContext||window.webkitAudioContext)();
       if(ctx.state==='suspended')await ctx.resume();
       const osc=ctx.createOscillator(),g=ctx.createGain();
       osc.type='sine';osc.frequency.value=261.63;
       osc.connect(g);g.connect(ctx.destination);
       g.gain.setValueAtTime(0,ctx.currentTime);
       g.gain.linearRampToValueAtTime(.3,ctx.currentTime+.05);
       g.gain.linearRampToValueAtTime(0,ctx.currentTime+.5);
       osc.start();osc.stop(ctx.currentTime+.5);
       console.log('✅ Piano OK! C4 suonata');
     }
     test();
   })();
   ```

3. **Dovresti sentire una nota e vedere "✅ Piano OK!"**

---

### Opzione 3: Test Suite Completa

1. **Apri `src/main.js`**

2. **Aggiungi all'inizio:**
   ```javascript
   import './piano-test-suite.js';
   ```

3. **Nella console:**
   ```javascript
   await PianoTestSuite.runAllTests()
   ```

4. **Guarda i risultati!** 📊

---

## 📋 Cosa È Stato Creato

### File Principale
```
src/piano-test-suite.js          ← TEST SUITE COMPLETA (USA QUESTO)
```

### File Supporto
```
PIANO-TEST-CREATION-REPORT.md    ← Report completo (LEGGI PRIMA)
src/PIANO-TEST-DOCUMENTATION.md  ← Documentazione dettagliata
src/PIANO-TEST-README.md         ← Quick reference
src/piano-test-integration-example.js  ← Esempi
src/piano-quick-test.js          ← Script console
piano-test-standalone.html       ← Test UI
```

---

## 🎯 I 3 Comandi Essenziali

### 1. Test Rapido (10 secondi)
```javascript
await PianoTestSuite.runQuickTest()
```

### 2. Test Completi (45 secondi)
```javascript
await PianoTestSuite.runAllTests()
```

### 3. Debug Stato (istantaneo)
```javascript
PianoTestSuite.debugLogSequencerState()
```

---

## 🎹 Le 18 Note del Piano

```
Ottava 4 (Centrali):
C4 (261.63Hz) → JavaScript
D4 (293.66Hz) → React
E4 (329.63Hz) → Vue.js
F4 (349.23Hz) → TypeScript
G4 (392.00Hz) → Three.js
A4 (440.00Hz) → WebGL
B4 (493.88Hz) → GSAP

Ottava 5 (Acute):
C5 (523.25Hz) → Node.js
D5 (587.33Hz) → Web Audio
E5 (659.25Hz) → Canvas
F5 (698.46Hz) → CSS
G5 (783.99Hz) → HTML
A5 (880.00Hz) → Accessibility
B5 (987.77Hz) → Performance

Ottava 6 (Molto Acute):
C6 (1046.50Hz) → Git
D6 (1174.66Hz) → Figma
E6 (1318.51Hz) → Java
F6 (1396.91Hz) → Cybersecurity
```

---

## 🧪 I 7 Test Cases

| # | Nome | Durata | Cosa Fa |
|---|------|--------|---------|
| 1 | Caricamento Audio | ~1s | Testa 18 note |
| 2 | Play Melody | ~8s | Suona Twinkle Twinkle |
| 3 | Sync Visivo | ~5s | Testa latenza |
| 4 | Hover Note | ~10s | Testa hover |
| 5 | Toggle | ~5s | Testa play/stop |
| 6 | Performance | ~10s | Testa 100 note |
| 7 | Mobile | ~5s | Testa mobile |

**Totale**: ~45 secondi

---

## 🔧 Le 4 Funzioni di Debug

```javascript
// 1. Stato completo
PianoTestSuite.debugLogSequencerState()

// 2. Visualizza waveform
PianoTestSuite.debugVisualizeWaveforms()

// 3. Test latenza
await PianoTestSuite.debugCheckSyncLatency()

// 4. Test ogni nota
await PianoTestSuite.debugTestEachNote()
```

---

## 📊 Cosa Cerca I Test

### ✅ Passa Se:
- Tutte le 18 note suonano
- Melodia corretta
- Sync < 50ms
- FPS > 55
- Memory leak < 5MB
- No oscillatori pendenti

### ❌ Fallisce Se:
- Note non suonano
- Melodia errata
- Sync > 100ms
- FPS < 50
- Memory leak > 10MB

---

## 🐛 Problemi Comuni

### "AudioContext suspended"
**Soluzione:**
```javascript
document.addEventListener('click', async () => {
  const ctx = new AudioContext();
  await ctx.resume();
});
```

### "Note non suonano"
**Soluzione:**
```javascript
// Verifica attributi
document.querySelectorAll('.skill-note').forEach(btn => {
  console.log(btn.dataset.skill, btn.dataset.frequency);
});
```

### "Test lenti"
**Soluzione:**
```javascript
// Usa quick test invece
await PianoTestSuite.runQuickTest()
```

---

## 💡 Esempi Pronti

### Test Una Nota
```javascript
import { PIANO_NOTES } from './piano-test-suite.js';

const ctx = new AudioContext();
const osc = ctx.createOscillator();
osc.frequency.value = PIANO_NOTES['C4'].frequency;
osc.connect(ctx.destination);
osc.start();
osc.stop(ctx.currentTime + 0.5);
```

### Test Scala
```javascript
const scale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

for (const note of scale) {
  // Suona nota...
  await new Promise(r => setTimeout(r, 500));
}
```

### Test Performance
```javascript
const start = performance.now();

for (let i = 0; i < 100; i++) {
  // Suona nota...
}

const duration = performance.now() - start;
console.log(`100 note in ${duration}ms`);
```

---

## 📁 Dove Trovare Tutto

```
C:\Users\matti\Desktop\portfolio\
│
├── 📘 LEGGI PRIMA:
│   └── PIANO-TEST-CREATION-REPORT.md
│
├── 🚀 INIZIA SUBITO:
│   └── piano-test-standalone.html
│
├── 📦 CODICE PRINCIPALE:
│   └── src\
│       ├── piano-test-suite.js           ← USA QUESTO
│       ├── piano-test-integration-example.js
│       └── piano-quick-test.js
│
└── 📚 DOCUMENTAZIONE:
    ├── src\PIANO-TEST-DOCUMENTATION.md
    └── src\PIANO-TEST-README.md
```

---

## ⌨️ Shortcuts (se integrati)

```
Ctrl+Shift+T    → Run all tests
Ctrl+Shift+Q    → Quick test
Ctrl+Shift+D    → Debug state
Ctrl+Shift+N    → Test each note
```

---

## 🎓 Learn by Doing

### Livello 1: Principiante (5 min)
```javascript
// 1. Apri standalone HTML
// 2. Clicca "Test Rapido"
// 3. Guarda risultati
```

### Livello 2: Intermedio (15 min)
```javascript
// 1. Importa test suite
import './piano-test-suite.js';

// 2. Esegui test
await PianoTestSuite.runAllTests()

// 3. Analizza risultati
```

### Livello 3: Avanzato (30 min)
```javascript
// 1. Crea test custom
async function myTest() {
  const results = await PianoTestSuite.testVisualSync();
  console.log(results);
}

// 2. Integra con CI/CD
// 3. Monitoring periodico
```

---

## 📊 Target Performance

| Metrica | Minimum | Target | Excellent |
|---------|---------|--------|-----------|
| FPS | 50 | 60 | 60 |
| Latency | 100ms | 50ms | <16ms |
| Memory | 10MB | 5MB | <2MB |
| Load time | 2s | 1s | <500ms |

---

## ✨ Checklist

### Per Iniziare
- [ ] Apri `piano-test-standalone.html`
- [ ] Clicca "Quick Test"
- [ ] Verifica risultati

### Per Integrare
- [ ] Importa in `main.js`
- [ ] Esegui `runAllTests()`
- [ ] Fix eventuali problemi

### Per Production
- [ ] Tutti i test passano ✅
- [ ] Performance OK
- [ ] Mobile OK
- [ ] Documentation letta

---

## 🎉 Fatto!

Ora hai:
- ✅ 7 test cases completi
- ✅ 4 funzioni di debug
- ✅ 18 note testabili
- ✅ Documentation completa
- ✅ Esempi pronti

**Prossimo passo:**
```javascript
await PianoTestSuite.runAllTests()
```

---

## 📞 Aiuto

- **Quick**: Apri standalone HTML
- **Docs**: `PIANO-TEST-DOCUMENTATION.md`
- **Examples**: `piano-test-integration-example.js`
- **Email**: MattiaBorrelli2005@gmail.com

---

**Creato da Mattia Borrelli - Febbraio 2026**

🎹 **Buon testing e buon divertimento!**
