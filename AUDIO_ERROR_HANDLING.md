# Sistema di Gestione Errori Audio - Documentazione

## Overview

Sistema robusto per la gestione del caricamento e riproduzione audio con **graceful degradation**. Il sito MAI crasha per errori audio - continua sempre a funzionare.

## Features Principali

### 1. ✅ Graceful Degradation
- Se audio non è supportato, il bottone melody viene disabilitato con UI feedback
- Se alcune note falliscono, usa sintetizzatore come fallback
- Se tutto fallisce, il sito funziona normalmente senza audio

### 2. 🔄 Retry Logic
- Ogni nota ha **3 tentativi** di caricamento
- **Exponential backoff**: 1s, 2s, 3s tra retry
- Log dettagliato di ogni tentativo

### 3. 📦 Promise.allSettled per Caricamento Parallelo
- Carica tutte le note in parallelo
- Se una fallisce, le altre continuano
- Report completo: quali note hanno successo, quali falliscono

### 4. 💬 User-Friendly Feedback
- Loading indicator durante il caricamento
- Messaggi toast per errori/warnings
- Console logging colorato per debug

### 5. 🛡️ Try/Catch Ovunque
- Nessuna funzione lancia errori non gestiti
- Tutti gli errori sono loggati MAI propagati
- Il sito MAI si ferma per errori audio

## Architettura

```
┌─────────────────────────────────────┐
│     AudioSequencer                  │
│  (Main Audio Controller)            │
├─────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │  Error State Tracking        │  │
│  │  - audioSupported            │  │
│  │  - loadedNotes               │  │
│  │  - failedNotes               │  │
│  │  - errors[]                  │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Retry Logic                 │  │
│  │  - maxRetries: 3             │  │
│  │  - exponential backoff       │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Fallback System             │  │
│  │  1. Buffer Audio (files)     │  │
│  │  2. Oscillator (synthetic)   │  │
│  │  3. Silent (no audio)        │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

## API Reference

### Inizializzazione

```javascript
import { audioSequencer } from './audio-sequencer.js';

// Carica le note con retry automatico
const result = await audioSequencer.loadNotes();
// Returns: { success: ['C4', 'E4', ...], failed: [] }
```

### Riproduzione

```javascript
// Suona una singola nota (con fallback automatico)
audioSequencer.playNote('C4', 0.3); // nota, durata in secondi

// Avvia melodia in loop
audioSequencer.start(500); // intervallo ms tra note

// Ferma melodia
audioSequencer.stop();

// Toggle melodia
const isPlaying = audioSequencer.toggle();
```

### Status e Debug

```javascript
// Ottieni stato completo
const status = audioSequencer.getStatus();
/*
{
  isPlaying: boolean,
  notesLoaded: boolean,
  loadedCount: number,
  failedCount: number,
  audioSupported: boolean,
  audioContextState: string,
  ...
}
*/

// Ottieni report errori
const errors = audioSequencer.getErrorReport();
/*
{
  errors: Array<{context, error, timestamp}>,
  failedNotes: string[],
  loadedNotes: string[]
}
*/

// Mostra messaggio user-friendly
audioSequencer.showUserMessage('Messaggio', 'warning');
// Types: 'info', 'success', 'warning', 'error'
```

### Configurazione

```javascript
// Configura retry
audioSequencer.config.maxRetries = 5;
audioSequencer.config.retryDelay = 2000;
audioSequencer.config.loadingTimeout = 15000;

// Abilita/disabilita logging
audioSequencer.config.enableLogging = true;

// Imposta volume
audioSequencer.setMasterVolume(0.5); // 0.0 - 1.0

// Imposta intervallo note
audioSequencer.setNoteInterval(300); // ms
```

## Flusso di Caricamento

```
1. User click melody button
   ↓
2. checkAudioSupport()
   ├─ Supported → continua
   └─ Not supported → disableAudioFeatures()
   ↓
3. initAudioContext()
   ├─ Success → continua
   └─ Error → disableAudioFeatures()
   ↓
4. showLoading(true)
   ↓
5. loadNotes() con Promise.allSettled
   ├─并行 carica tutte le note
   └─ Ogni nota: loadNoteWithRetry()
       ├─ Try 1: fetch file
       ├─ Try 2: retry after 1s
       └─ Try 3: retry after 2s
   ↓
6. Analizza risultati
   ├─ All success → ✅ everything works
   ├─ Some failed → ⚠️ use synthetic fallback
   └─ All failed → ❌ disable audio gracefully
   ↓
7. showLoading(false)
   ↓
8. User feedback message
   └─ Site continues working! ✅
```

## Esempi di Utilizzo

### Esempio 1: Inizializzazione sicura

```javascript
async function initAudio() {
  try {
    const result = await audioSequencer.loadNotes();

    if (result.failed.length > 0) {
      console.warn(`${result.failed.length} note fallite`);
    }

    return audioSequencer.errorState.audioSupported;
  } catch (error) {
    console.error('Init audio failed:', error);
    return false; // Site continues
  }
}
```

### Esempio 2: Play con error handling

```javascript
function playNoteSafe(noteName) {
  try {
    audioSequencer.playNote(noteName, 0.3);
  } catch (error) {
    // Silent fail - non interrompere UX
    console.warn('Note play failed:', error);
  }
}
```

### Esempio 3: Toggle melody con feedback

```javascript
async function toggleMelodyWithFeedback() {
  const btn = document.getElementById('melodyBtn');

  try {
    if (!audioSequencer.notesLoaded) {
      btn.disabled = true;
      btn.textContent = '⏳ Loading...';

      await audioSequencer.loadNotes();

      btn.disabled = false;
    }

    const isPlaying = audioSequencer.toggle();

    btn.textContent = isPlaying ? '⏸ Pause' : '♪ Play';
  } catch (error) {
    audioSequencer.showUserMessage(
      'Audio unavailable. Please try again.',
      'error'
    );
  }
}
```

## Cosa succede quando...

### Scenario 1: Web Audio API non supportata
```
checkAudioSupport() → false
  ↓
disableAudioFeatures()
  - melodyBtn: disabled, opacity 0.5
  - skillButtons: .audio-disabled class
  - message: "Audio non disponibile"
  ↓
Site continues normally ✅
```

### Scenario 2: File audio non trovati
```
loadNotes() → Promise.allSettled
  - All .wav files → 404
  ↓
All rejected
  ↓
Use synthetic fallback (oscillators)
  ↓
showUserMessage("Using synthetic audio", "warning")
  ↓
Melody plays with generated tones ✅
```

### Scenario 3: Network error durante caricamento
```
loadNoteWithRetry('C4')
  Try 1: fetch → NetworkError
    ↓ delay 1000ms
  Try 2: fetch → NetworkError
    ↓ delay 2000ms
  Try 3: fetch → NetworkError
    ↓
  Throw error (after max retries)
  ↓
Catch in Promise.allSettled
  ↓
Add to failedNotes
  ↓
Use synthetic fallback ✅
```

### Scenario 4: AudioContext crash
```
playNote('C4')
  ↓
audioContext.play() → Crash!
  ↓
try/catch catches error
  ↓
handleError() logs to console
  ↓
Function returns safely
  ↓
Site continues working ✅
```

## Best Practices

### ✅ DO
- Sempre wrap audio calls in try/catch
- Mostrare feedback user per errori
- Usare fallback sintetico
- Loggare errori per debugging
- Testare senza audio

### ❌ DON'T
- Mai throw errori da funzioni audio
- Mai bloccare il sito per errori audio
- Mai assumere che audio funzioni
- Mai silent-fail senza log

## Testing

### Test senza audio
```javascript
// Simula browser senza Web Audio API
window.AudioContext = null;
audioSequencer.checkAudioSupport(); // false
```

### Test con network error
```javascript
// Simula fetch error
global.fetch = () => Promise.reject(new Error('Network error'));
await audioSequencer.loadNotes(); // Uses fallback
```

### Test error recovery
```javascript
// Forza errore poi riprova
audioSequencer.playNote('INVALID'); // Silent fail
audioSequencer.playNote('C4'); // Should work
```

## Performance

- **Memory**: O(n) dove n = numero di note
- **Startup**: < 100ms per check audio support
- **Loading**: Parallel loading, ~1-3s per 8 note
- **Retry**: Max 9s totale (3 retry × exponential backoff)
- **Fallback**: Oscillatori istantanei (< 1ms)

## Browser Support

| Browser | Web Audio API | Fallback |
|---------|---------------|----------|
| Chrome 90+ | ✅ Full | Buffer files |
| Firefox 88+ | ✅ Full | Buffer files |
| Safari 14+ | ✅ Full | Buffer files |
| Edge 90+ | ✅ Full | Buffer files |
| IE 11 | ❌ No | Disabled gracefully |
| Mobile | ✅ Full | Synthetic (no files) |

## Troubleshooting

### Problema: Audio non funziona
```javascript
// Check status
const status = audioSequencer.getStatus();
console.log(status);

// Expected:
{
  audioSupported: true,
  notesLoaded: true,
  loadedCount: 8,
  audioContextState: 'running'
}
```

### Problema: Molte errori in console
```javascript
// Check error report
const errors = audioSequencer.getErrorReport();
console.table(errors.errors);

// Common causes:
// - User interaction required (click first)
// - Browser autoplay policy
// - Network issues loading .wav files
```

### Problema: Melody non parte
```javascript
// Check if playing
console.log(audioSequencer.isPlaying);

// Try manual trigger
audioSequencer.start(500);

// Check if notes loaded
console.log(audioSequencer.noteBuffers.size);
```

## File Structure

```
src/
├── audio-sequencer.js         # Main audio controller with error handling
├── audio-error-handler.js     # Standalone error handler utility
├── audio-usage-example.js     # Usage examples and integration
└── styles/
    └── animations.css         # Audio UI animations
```

## Crediti

Sistema creato per Portfolio con design principles:
- **Reliability**: MAI crash
- **User Experience**: Sempre feedback
- **Performance**: Caricamento parallelo
- **Maintainability**: Codice pulito e documentato
- **Accessibility**: Graceful degradation

Version: 2.0.0
Author: Mattia Borrelli
Year: 2026
