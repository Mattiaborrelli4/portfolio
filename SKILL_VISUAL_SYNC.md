# Sistema di Sincronizzazione Visiva per Skill Cards

## Panoramica

Questo sistema gestisce l'illuminazione sincronizzata delle skill cards con l'audio. Quando una nota musicale suona, la skill card corrispondente si illumina in blu scuro (#2C5F7F) per 300ms, poi torna gradualmente al colore originale.

## Componenti

### 1. CSS (components.css)

Classe principale per l'effetto di illuminazione:

```css
.skill-note--playing {
  background-color: #2C5F7F !important;
  border-color: #2C5F7F !important;
  color: white !important;
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(44, 95, 127, 0.8), 0 0 60px rgba(44, 95, 127, 0.4);
  transition: background-color 0.05s ease-out, border-color 0.05s ease-out,
              color 0.05s ease-out, transform 0.15s ease-out, box-shadow 0.15s ease-out;
}
```

Caratteristiche:
- Colore: #2C5F7F (blu scuro del sito)
- Transizione rapida (0.05s) per colore e bordo
- Scala leggermente (1.1x) per effetto "pop"
- Glow effect per enfatizzare l'illuminazione
- Effetto ::before espanso per dinamismo aggiuntivo

### 2. JavaScript (skill-visual-sync.js)

#### Classe: `SkillVisualSync`

Metodi principali:

- `findSkillCardByFrequency(frequency)` - Trova la skill card in base alla frequenza
- `illuminateSkillCard(skillCard, duration)` - Illumina la card per la durata specificata
- `syncWithNote(noteIdentifier)` - Sincronizza l'illuminazione con una nota
- `createAudioCallback()` - Crea callback per AudioSequencer

#### Mappatura Frequenza → Skill

```javascript
{
  261.63: 'javascript',    // C4
  293.66: 'react',         // D4
  329.63: 'vuejs',         // E4
  349.23: 'typescript',    // F4
  392.00: 'threejs',       // G4
  440.00: 'webgl',         // A4
  493.88: 'gsap',          // B4
  523.25: 'nodejs',        // C5
  // ... ecc
}
```

### 3. Integrazione (main.js)

Il sistema viene inizializzato automaticamente:

```javascript
// Initialize skill visual sync system
const skillSync = setupSkillVisualSync(audioSequencer, 300);
```

## Funzionamento

### Flusso di Sincronizzazione

1. **AudioSequencer suona una nota**
   ```javascript
   audioSequencer.playNote('C4');
   ```

2. **Callback viene eseguito**
   - AudioSequencer chiama il callback registrato
   - Passa il nome della nota (es. 'C4')

3. **SkillVisualSync elabora**
   - Converte nome nota → frequenza
   - Trova la skill card corrispondente
   - Aggiunge classe `.skill-note--playing`

4. **CSS Animation**
   - La card si illumina istantaneamente (0.05s)
   - Rimane illuminata per 300ms
   - Rimuove gradualmente la classe
   - Torna allo stato originale

### Timing Preciso

```
0ms    → Nota suona + Card si illumina
300ms  → Card inizia sfumatura
305ms  → Card completamente normale
```

## API

### Uso Base

```javascript
import { setupSkillVisualSync } from './skill-visual-sync.js';

// Configura con AudioSequencer
const { sync, test, reset, getStats } = setupSkillVisualSync(
  audioSequencer,  // Istanza AudioSequencer
  300              // Durata illuminazione (ms, optional)
);
```

### Metodi di Controllo

```javascript
// Sincronizza manualmente una nota
sync('C4');  // Per nome nota
sync(261.63); // Per frequenza

// Test tutte le cards
test();

// Resetta lo stato
reset();

// Ottieni statistiche
const stats = getStats();
console.log(stats);
/*
{
  totalCards: 18,
  illuminationDuration: 300,
  frequenciesMapped: 18,
  cachedSkills: ['javascript', 'react', ...]
}
*/
```

### Dev Mode Helpers

In development mode, sono disponibili globalmente:

```javascript
// Test visivo di tutte le cards
window.__portfolio.testSkillCards();

// Sincronizza una nota specifica
window.__portfolio.syncSkillNote('C4');

// Ottieni statistiche
window.__portfolio.getSkillStats();

// Reset
window.__portfolio.resetSkillSync();
```

## HTML Structure

Le skill cards devono avere questi attributi:

```html
<button class="skill-note"
        data-skill="javascript"
        data-frequency="261.63">
  JavaScript
</button>
```

Attributi richiesti:
- `class="skill-note"` - Classe base
- `data-skill` - Identificatore unico della skill
- `data-frequency` - Frequenza in Hz per la mappatura

## Performance

### Ottimizzazioni

1. **Cache delle skill cards**
   - Tutte le cards sono cachate all'inizializzazione
   - Accesso O(1) invece di query DOM O(n)

2. **Transizioni GPU**
   - `transform` usa GPU acceleration
   - `box-shadow` ottimizzato per performance

3. **Timing preciso**
   - Sincronizzazione basata su AudioContext time
   - Nessun drift temporale

## Debugging

### Console Logs

Il sistema logga varie informazioni:

```
✅ Skill Visual Sync initialized
📦 Cached 18 skill cards
✅ Skill visual sync configured
```

### Test Visivo

```javascript
// Illumina tutte le cards in sequenza
window.__portfolio.testSkillCards();
```

Output:
```
🧪 Testing all skill cards...
  Testing: javascript
  Testing: react
  Testing: vuejs
  ...
```

## Troubleshooting

### Cards non si illuminano

1. Verifica attributi HTML:
   ```javascript
   document.querySelectorAll('.skill-note[data-skill][data-frequency]')
   ```

2. Controlla mappatura frequenze:
   ```javascript
   window.__portfolio.getSkillStats()
   ```

3. Test manuale:
   ```javascript
   window.__portfolio.syncSkillNote('C4')
   ```

### Timing non preciso

- Verifica che `AudioContext` sia in stato 'running'
- Controlla durata impostata (default: 300ms)
- Assicurati che il browser non sia in background

### Performance issues

- Riduci numero di cards illuminate simultaneamente
- Aumenta durata transizione CSS
- Disabilita box-shadow se necessario

## Customizzazione

### Modificare Colore

```css
/* components.css */
.skill-note--playing {
  background-color: #TUO_COLORE !important;
  border-color: #TUO_COLORE !important;
}
```

### Modificare Durata

```javascript
// main.js
const skillSync = setupSkillVisualSync(audioSequencer, 500); // 500ms
```

O runtime:

```javascript
window.__portfolioContexts.skillSync.setDuration(500);
```

### Aggiungere Nuove Skills

1. Aggiungi HTML con `data-frequency`
2. Aggiungi mappatura in `skill-visual-sync.js`:
   ```javascript
   this.frequencyToSkill[NUOVA_FREQ] = 'nuova-skill';
   ```

## Note Tecniche

### Browser Compatibility

- Chrome/Edge: ✅ Compatto
- Firefox: ✅ Compatto
- Safari: ✅ Compatto (iOS 14.5+)

### Audio Context

Il sistema richiede un gesture utente per inizializzare l'AudioContext (policy autoplay dei browser).

### Memory Management

Le skill cards sono cachate in una Map per performance. Il sistema pulisce automaticamente le classi CSS quando non più necessarie.

## Esempi Completi

### Esempio 1: Setup Base

```javascript
import { AudioSequencer } from './audio-sequencer.js';
import { setupSkillVisualSync } from './skill-visual-sync.js';

const audio = new AudioSequencer();
const skillSync = setupSkillVisualSync(audio);

await audio.loadNotes();
audio.start();
```

### Esempio 2: Custom Duration

```javascript
// Illuminazione più lunga (500ms)
const skillSync = setupSkillVisualSync(audioSequencer, 500);
```

### Esempio 3: Test e Debug

```javascript
// Test tutte le cards
skillSync.test();

// Controlla statistiche
console.log(skillSync.getStats());

// Sync manuale
skillSync.sync('C4');
```

## Licenza

Parte del portfolio Mattia Borrelli - 2026
