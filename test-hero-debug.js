/**
 * HERO ELEMENTS DEBUG TEST
 * ========================
 * Questo test aiuta a diagnosticare perché gli elementi hero non sono visibili.
 *
 * ISTRUZIONI:
 * 1. Apri il portfolio nel browser
 * 2. Apri la Console DevTools (F12)
 * 3. Copia e incolla questo intero file nella console
 * 4. Premi Invio per eseguire il test
 * 5. Analizza i risultati nella console
 */

(function() {
  'use strict';

  console.log('%c='.repeat(60), 'color: #00ff00; font-weight: bold;');
  console.log('%c🔍 HERO ELEMENTS DEBUG TEST', 'color: #00ff00; font-size: 16px; font-weight: bold;');
  console.log('%c='.repeat(60), 'color: #00ff00; font-weight: bold;');
  console.log('');

  // =========================================================================
  // SEZIONE 1: Verifica esistenza elementi DOM
  // =========================================================================
  console.log('%c📋 SEZIONE 1: Verifica Elementi DOM', 'color: #00bfff; font-size: 14px; font-weight: bold;');
  console.log('-'.repeat(60));

  const elements = {
    '.hero-name': document.querySelector('.hero-name'),
    '.hero-subtitle-wrapper': document.querySelector('.hero-subtitle-wrapper'),
    '.hero-description': document.querySelector('.hero-description'),
    '.hero-cta': document.querySelector('.hero-cta')
  };

  let allElementsFound = true;

  for (const [selector, element] of Object.entries(elements)) {
    if (element) {
      console.log(`✅ ${selector.padEnd(25)} → TROVATO`, element);
    } else {
      console.error(`❌ ${selector.padEnd(25)} → NON TROVATO!`);
      allElementsFound = false;
    }
  }

  if (!allElementsFound) {
    console.error('%c⚠️  Alcuni elementi non sono stati trovati! Impossibile continuare.', 'color: #ff4444; font-weight: bold;');
    return;
  }

  console.log('');
  console.log('%c✅ Tutti gli elementi hero sono presenti nel DOM', 'color: #00ff00; font-weight: bold;');
  console.log('');

  // =========================================================================
  // SEZIONE 2: Lettura valori CSS calcolati
  // =========================================================================
  console.log('%c📊 SEZIONE 2: Valori CSS Calcolati', 'color: #00bfff; font-size: 14px; font-weight: bold;');
  console.log('-'.repeat(60));

  const cssProperties = [
    'opacity',
    'display',
    'visibility',
    'transform',
    'position',
    'z-index',
    'color',
    'background-color',
    'font-size',
    'width',
    'height'
  ];

  for (const [selector, element] of Object.entries(elements)) {
    console.log(`%c${selector}:`, 'color: #ffff00; font-weight: bold;');

    const computed = window.getComputedStyle(element);
    const cssData = {};

    for (const prop of cssProperties) {
      cssData[prop] = computed.getPropertyValue(prop);
    }

    console.log(cssData);

    // Check for common visibility issues
    if (cssData.opacity === '0') {
      console.warn(`  ⚠️  Opacity è 0 - elemento invisibile!`);
    }
    if (cssData.display === 'none') {
      console.warn(`  ⚠️  Display è none - elemento nascosto!`);
    }
    if (cssData.visibility === 'hidden') {
      console.warn(`  ⚠️  Visibility è hidden - elemento invisibile!`);
    }
    if (cssData.transform !== 'none') {
      console.warn(`  ℹ️  Transform attivo: ${cssData.transform}`);
    }

    console.log('');
  }

  // =========================================================================
  // SEZIONE 3: Verifica animazioni GSAP
  // =========================================================================
  console.log('%c🎬 SEZIONE 3: Verifica Animazioni GSAP', 'color: #00bfff; font-size: 14px; font-weight: bold;');
  console.log('-'.repeat(60));

  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.error('❌ GSAP non è caricato!');
  } else {
    console.log(`✅ GSAP è caricato (v${gsap.version})`);
    console.log('');

    // Check for active timelines
    const timelines = gsap.globalTimeline.getChildren();
    console.log(`ℹ️  Timeline attive: ${timelines.length}`);

    if (timelines.length > 0) {
      timelines.forEach((tl, index) => {
        console.log(`  Timeline ${index + 1}:`);
        console.log(`    - Durata: ${tl.duration()}s`);
        console.log(`    - Progress: ${(tl.progress() * 100).toFixed(1)}%`);
        console.log(`    - Stato: ${tl.paused() ? 'In pausa' : 'In esecuzione'}`);
      });
    }

    console.log('');

    // Check GSAP animations on each element
    for (const [selector, element] of Object.entries(elements)) {
      console.log(`%c${selector}:`, 'color: #ffff00; font-weight: bold;');

      // Get all tweens on this element
      const tweens = gsap.getTweensOf(element);

      if (tweens.length === 0) {
        console.warn(`  ⚠️  Nessuna animazione GSAP attiva su questo elemento`);
      } else {
        console.log(`  ✅ Trovate ${tweens.length} animazioni:`);

        tweens.forEach((tween, index) => {
          console.log(`  Animazione ${index + 1}:`);
          console.log(`    - Progress: ${(tween.progress() * 100).toFixed(1)}%`);
          console.log(`    - Durata: ${tween.duration()}s`);
          console.log(`    - Delay: ${tween.delay()}s`);
          console.log(`    - Stato: ${tween.paused() ? 'In pausa' : 'In esecuzione'}`);

          // Check animation targets
          const targets = tween.targets();
          console.log(`    - Target:`, targets);

          // Check current values
          console.log(`    - Valori correnti:`);
          console.log(`      Opacity: ${gsap.getProperty(element, 'opacity')}`);
          console.log(`      Y: ${gsap.getProperty(element, 'y')}`);
          console.log(`      X: ${gsap.getProperty(element, 'x')}`);
          console.log(`      Scale: ${gsap.getProperty(element, 'scale')}`);
        });
      }

      console.log('');
    }
  }

  // =========================================================================
  // SEZIONE 4: Verifica posizione e dimensioni
  // =========================================================================
  console.log('%c📐 SEZIONE 4: Posizione e Dimensioni', 'color: #00bfff; font-size: 14px; font-weight: bold;');
  console.log('-'.repeat(60));

  for (const [selector, element] of Object.entries(elements)) {
    const rect = element.getBoundingClientRect();

    console.log(`%c${selector}:`, 'color: #ffff00; font-weight: bold;');
    console.log(`  Posizione:`);
    console.log(`    - Top: ${rect.top.toFixed(2)}px`);
    console.log(`    - Left: ${rect.left.toFixed(2)}px`);
    console.log(`    - Bottom: ${rect.bottom.toFixed(2)}px`);
    console.log(`    - Right: ${rect.right.toFixed(2)}px`);
    console.log(`  Dimensioni:`);
    console.log(`    - Width: ${rect.width.toFixed(2)}px`);
    console.log(`    - Height: ${rect.height.toFixed(2)}px`);

    // Check if element is in viewport
    const isInViewport = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );

    if (isInViewport) {
      console.log(`  ✅ Elemento è visibile nel viewport`);
    } else {
      console.warn(`  ⚠️  Elemento NON è completamente nel viewport`);
    }

    // Check if element has zero dimensions
    if (rect.width === 0 || rect.height === 0) {
      console.warn(`  ⚠️  Elemento ha dimensioni zero!`);
    }

    console.log('');
  }

  // =========================================================================
  // SEZIONE 5: Verifica stili inline e attributi
  // =========================================================================
  console.log('%c🎨 SEZIONE 5: Stili Inline e Attributi', 'color: #00bfff; font-size: 14px; font-weight: bold;');
  console.log('-'.repeat(60));

  for (const [selector, element] of Object.entries(elements)) {
    console.log(`%c${selector}:`, 'color: #ffff00; font-weight: bold;');

    // Check inline styles
    if (element.hasAttribute('style')) {
      console.log(`  Stile inline: ${element.getAttribute('style')}`);
    } else {
      console.log(`  ℹ️  Nessuno stile inline`);
    }

    // Check data attributes
    const dataAttrs = {};
    for (const attr of element.attributes) {
      if (attr.name.startsWith('data-')) {
        dataAttrs[attr.name] = attr.value;
      }
    }

    if (Object.keys(dataAttrs).length > 0) {
      console.log(`  Attributi data:`, dataAttrs);
    } else {
      console.log(`  ℹ️  Nessun attributo data`);
    }

    // Check classes
    console.log(`  Classi: ${Array.from(element.classList).join(', ') || 'nessuna'}`);

    console.log('');
  }

  // =========================================================================
  // SEZIONE 6: Test forzata opacity
  // =========================================================================
  console.log('%c🔧 SEZIONE 6: Test Forzata Opacity', 'color: #00bfff; font-size: 14px; font-weight: bold;');
  console.log('-'.repeat(60));
  console.log('%c⚠️  Provo a forzare opacity: 1 su tutti gli elementi hero...', 'color: #ffaa00;');

  const originalOpacities = {};

  for (const [selector, element] of Object.entries(elements)) {
    originalOpacities[selector] = element.style.opacity;
    element.style.opacity = '1';
    console.log(`✅ Opacity forzata a 1 per ${selector}`);
  }

  console.log('');
  console.log('%c⏳ Attendi 2 secondi per verificare visibilità...', 'color: #ffaa00;');

  setTimeout(() => {
    console.log('');
    console.log('%c🔍 Verifica visibilità dopo 2 secondi:', 'color: #00bfff; font-weight: bold;');

    for (const [selector, element] of Object.entries(elements)) {
      const rect = element.getBoundingClientRect();
      const computed = window.getComputedStyle(element);

      const isVisible = (
        computed.opacity !== '0' &&
        computed.display !== 'none' &&
        computed.visibility !== 'hidden' &&
        rect.width > 0 &&
        rect.height > 0
      );

      if (isVisible) {
        console.log(`✅ ${selector} è ORA VISIBILE! Il problema era l'opacity.`);
      } else {
        console.warn(`❌ ${selector} è ANCORA INVISIBILE. Il problema NON è solo l'opacity.`);
      }
    }

    console.log('');
    console.log('%c🔄 Ripristino valori originali...', 'color: #ffaa00;');

    for (const [selector, element] of Object.entries(elements)) {
      element.style.opacity = originalOpacities[selector];
    }

    console.log('%c✅ Valori originali ripristinati', 'color: #00ff00;');
    console.log('');

    // =========================================================================
    // SEZIONE 7: Diagnosi finale
    // =========================================================================
    console.log('%c='.repeat(60), 'color: #00ff00; font-weight: bold;');
    console.log('%c📋 DIAGNOSI FINALE', 'color: #00ff00; font-size: 16px; font-weight: bold;');
    console.log('%c='.repeat(60), 'color: #00ff00; font-weight: bold;');
    console.log('');
    console.log('%cRisultati del test:', 'color: #ffff00; font-weight: bold;');
    console.log('');
    console.log('1. Se dopo aver forzato opacity: 1 gli elementi sono visibili,');
    console.log('   il problema è che GSAP non ha eseguito le animazioni.');
    console.log('');
    console.log('2. Se gli elementi sono ancora invisibili, il problema potrebbe essere:');
    console.log('   - CSS che sovrascrive GSAP');
    console.log('   - Elementi posizionati fuori dal viewport');
    console.log('   - Z-index negativo');
    console.log('   - Colori di testo/transparenti');
    console.log('   - Transform che sposta gli elementi fuori schermo');
    console.log('');
    console.log('%cAzioni consigliate:', 'color: #ffff00; font-weight: bold;');
    console.log('');
    console.log('1. Verifica che la funzione animateHero() venga chiamata');
    console.log('2. Verifica che non ci siano errori nella console');
    console.log('3. Verifica che il DOM sia completamente caricato');
    console.log('4. Controlla se ci sono CSS che sovrascrivono le animazioni');
    console.log('');
    console.log('%c='.repeat(60), 'color: #00ff00; font-weight: bold;');

  }, 2000);

})();
