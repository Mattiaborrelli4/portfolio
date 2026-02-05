# Skill Visual Sync - Quick Start Guide

## 🚀 Setup Immediato

Il sistema è **già configurato** e funziona automaticamente!

### 1. Verifica Funzionamento

Apri la console del browser (F12) e scrivi:

```javascript
// Verifica integrità
window.__portfolioDebug.checkIntegrity()

// Dovresti vedere: ✅ Nessun problema trovato!
```

### 2. Test Visivo

```javascript
// Illumina tutte le cards in sequenza
window.__portfolio.testSkillCards()

// O usa la demo
demoBasicTest()
```

### 3. Test Singola Card

```javascript
// Illumina JavaScript (C4)
window.__portfolio.syncSkillNote('C4')

// Illumina React (D4)
window.__portfolio.syncSkillNote('D4')

// Illumina Vue.js (E4)
window.__portfolio.syncSkillNote('E4')
```

## 📊 Note Disponibili

```javascript
// Note musicali e loro skills
'C4' // JavaScript
'D4' // React
'E4' // Vue.js
'F4' // TypeScript
'G4' // Three.js
'A4' // WebGL
'B4' // GSAP
'C5' // Node.js
'D5' // Web Audio
'E5' // Canvas
'F5' // CSS
'G5' // HTML
'A5' // Accessibility
'B5' // Performance
'C6' // Git
'D6' // Figma
'E6' // Java
'F6' // Cybersecurity
```

## 🎼 Demo Disponibili

```javascript
// 1. Test base
demoBasicTest()

// 2. Singola nota
demoSingleNote()

// 3. Sequenza personalizzata
demoCustomSequence()

// 4. Melodia completa
demoMelody()

// 5. Statistiche
demoStats()

// 6. Performance test
demoPerformanceTest()

// 7. Frequenza diretta
demoFrequencyDirect()

// 8. Reset
demoReset()

// 9. Modifica durata
demoChangeDuration()

// 10. Demo completa (tutte quante)
demoComplete()
```

## 🔧 Debug Tools

```javascript
// Ispetta una card
window.__portfolioDebug.inspectCard('javascript')

// Mostra tutte le cards
window.__portfolioDebug.showAllCards()

// Test una card
window.__portfolioDebug.testCard('react', 500)

// Benchmark performance
window.__portfolioDebug.benchmark(100)

// Mostra log
window.__portfolioDebug.showLogs()

// Esporta log in JSON
window.__portfolioDebug.exportLogs()
```

## ⚙️ Configurazione

### Modifica Durata Illuminazione

```javascript
// Imposta a 500ms
window.__portfolioContexts.skillSync.setDuration(500)

// Ripristina a 300ms (default)
window.__portfolioContexts.skillSync.setDuration(300)
```

### Sincronizzazione Manuale

```javascript
// Per nome nota
window.__portfolioContexts.skillSync.sync('C4')

// Per frequenza
window.__portfolioContexts.skillSync.sync(261.63)
```

## 📁 File Modificati/Creati

### Modificati:
- `src/styles/components.css` - Aggiunto `.skill-note--playing`
- `src/main.js` - Import e inizializzazione sistema

### Creati:
- `src/skill-visual-sync.js` - Sistema principale
- `src/skill-visual-sync-demo.js` - 10 demo
- `skill-visual-debug.js` - Debug utilities
- `SKILL_VISUAL_SYNC.md` - Documentazione completa
- `IMPLEMENTAZIONE_SINCRONIZZAZIONE_VISIVA.md` - Riepilogo

## 🎯 Come Funziona

```
AudioSequencer suona nota
         ↓
   Callback eseguito
         ↓
SkillVisualSync trova card
         ↓
    Illumina card
         ↓
    (300ms dopo)
         ↓
   Spegni card
```

## 🎨 Effetto Visivo

- **Colore:** #2C5F7F (blu scuro)
- **Durata:** 300ms (configurabile)
- **Transizione:** 0.05s (istantanea)
- **Scala:** 1.1x (pop effect)
- **Glow:** Doppio layer

## 🐛 Troubleshooting

### Cards non si illuminano?

```javascript
// 1. Verifica integrità
window.__portfolioDebug.checkIntegrity()

// 2. Controlla se le cards esistono
window.__portfolioDebug.showAllCards()

// 3. Verifica mappatura
window.__portfolio.getSkillStats()
```

### Vuoi vedere i logs?

```javascript
// Abilita debug mode
window.__portfolioDebug.enable()

// Fai qualcosa...

// Mostra logs
window.__portfolioDebug.showLogs()

// Esporta in JSON
window.__portfolioDebug.exportLogs()
```

## ✅ Checklist

- [x] Sistema installato e configurato
- [x] Build completata senza errori
- [x] Demo funzionanti
- [x] Debug tools disponibili
- [x] Documentazione completa

## 🎉 Provalo Ora!

```javascript
// Nella console del browser:

// Quick test
demoBasicTest()

// Oppure demo completa
demoComplete()

// Oppure singola nota
window.__portfolio.syncSkillNote('C4')
```

Tutto sincronizzato perfettamente con l'audio! 🎵✨
