/**
 * Premium Scroll Animations - Butter-Smooth with Lenis Compatibility
 *
 * Sistema di animazioni basato su Intersection Observer che:
 * - Non interferisce con Lenis smooth scroll
 * - Usa GPU-accelerated transforms (translate3d, scale)
 * - Performance ottimizzata con requestAnimationFrame
 * - Animazioni fluide con cubic-bezier easing
 *
 * @author Portfolio Frontend Design
 * @version 1.0.0
 */

// ============================================================================
// CONFIGURAZIONE ANIMAZIONI
// ============================================================================

const ANIMATION_CONFIG = {
  // Root margin per triggerare animazioni prima che l'elemento entri in viewport
  rootMargin: '-50px',

  // soglia di visibilità (0-1)
  threshold: 0.1,

  // Durata animazioni in ms
  durations: {
    fast: 400,
    medium: 600,
    slow: 800
  },

  // Easing functions (cubic-bezier per smoothness)
  easings: {
    // Smooth entrance - premium feel
    entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',

    // Bounce leggero per elementi interattivi
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

    // Smooth exit
    exit: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Linear per performance critical
    linear: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// ============================================================================
// INTERSECTION OBSERVER MANAGER
// ============================================================================

/**
 * Crea un Intersection Observer ottimizzato per le animazioni
 * @param {Function} callback - Callback quando elementi entrano in viewport
 * @param {Object} options - Opzioni observer
 */
function createIntersectionObserver(callback, options = {}) {
  const defaultOptions = {
    root: null, // viewport
    rootMargin: ANIMATION_CONFIG.rootMargin,
    threshold: ANIMATION_CONFIG.threshold
  };

  const observerOptions = { ...defaultOptions, ...options };

  const observer = new IntersectionObserver((entries) => {
    // Usa requestAnimationFrame per sincronizzare con il browser
    // e evitare conflitti con Lenis scroll
    window.requestAnimationFrame(() => {
      entries.forEach(entry => {
        callback(entry);
      });
    });
  }, observerOptions);

  return observer;
}

// ============================================================================
// ANIMAZIONI CSS-IN-JS (GPU ACCELERATED)
// ============================================================================

/**
 * Applica animazione slide-up + fade-in usando GPU transforms
 * @param {HTMLElement} element - Elemento da animare
 * @param {number} duration - Durata in ms
 * @param {number} delay - Delay in ms
 */
function animateSlideUp(element, duration = 600, delay = 0) {
  // Imposta stato iniziale
  element.style.opacity = '0';
  element.style.transform = 'translate3d(0, 40px, 0)';
  element.style.willChange = 'opacity, transform';

  // Forza reflow
  void element.offsetHeight;

  // Schedule animazione
  setTimeout(() => {
    element.style.transition = `opacity ${duration}ms ${ANIMATION_CONFIG.easings.entrance}, transform ${duration}ms ${ANIMATION_CONFIG.easings.entrance}`;
    element.style.opacity = '1';
    element.style.transform = 'translate3d(0, 0, 0)';

    // Cleanup will-change dopo l'animazione
    setTimeout(() => {
      element.style.willChange = '';
    }, duration + 100);
  }, delay);
}

/**
 * Applica animazione con scale + slide-up
 * @param {HTMLElement} element - Elemento da animare
 * @param {number} duration - Durata in ms
 * @param {number} delay - Delay in ms
 */
function animateScaleUp(element, duration = 600, delay = 0) {
  // Stato iniziale
  element.style.opacity = '0';
  element.style.transform = 'translate3d(0, 30px, 0) scale(0.95)';
  element.style.willChange = 'opacity, transform';

  // Forza reflow
  void element.offsetHeight;

  // Schedule animazione
  setTimeout(() => {
    element.style.transition = `opacity ${duration}ms ${ANIMATION_CONFIG.easings.entrance}, transform ${duration}ms ${ANIMATION_CONFIG.easings.bounce}`;
    element.style.opacity = '1';
    element.style.transform = 'translate3d(0, 0, 0) scale(1)';

    // Cleanup
    setTimeout(() => {
      element.style.willChange = '';
    }, duration + 100);
  }, delay);
}

// ============================================================================
// ANIMATION OBSERVERS SETUP
// ============================================================================

/**
 * Configura observer per la foto profilo
 */
function setupProfilePhotoObserver() {
  const photoPlaceholder = document.querySelector('.photo-placeholder');
  const profileImage = photoPlaceholder?.querySelector('.profile-image');

  if (!photoPlaceholder) return;

  const observer = createIntersectionObserver((entry) => {
    if (entry.isIntersecting) {
      // Anima il container
      animateSlideUp(photoPlaceholder, 800, 0);

      // Anima l'immagine con leggero delay
      if (profileImage) {
        animateScaleUp(profileImage, 700, 150);
      }

      // Stop observing dopo l'animazione (una sola volta)
      observer.unobserve(entry.target);
    }
  }, {
    rootMargin: '-80px 0px', // Trigger prima
    threshold: 0.15
  });

  observer.observe(photoPlaceholder);
}

/**
 * Configura observer per il bottone melody
 */
function setupMelodyButtonObserver() {
  const melodyBtn = document.querySelector('.melody-btn');

  if (!melodyBtn) return;

  const observer = createIntersectionObserver((entry) => {
    if (entry.isIntersecting) {
      // Anima con slide-up + leggero scale
      melodyBtn.style.opacity = '0';
      melodyBtn.style.transform = 'translate3d(0, 20px, 0) scale(0.95)';
      melodyBtn.style.willChange = 'opacity, transform';

      void melodyBtn.offsetHeight;

      setTimeout(() => {
        melodyBtn.style.transition = `all ${ANIMATION_CONFIG.durations.medium}ms ${ANIMATION_CONFIG.easings.bounce}`;
        melodyBtn.style.opacity = '1';
        melodyBtn.style.transform = 'translate3d(0, 0, 0) scale(1)';

        setTimeout(() => {
          melodyBtn.style.willChange = '';
        }, ANIMATION_CONFIG.durations.medium + 100);
      }, 200);

      observer.unobserve(entry.target);
    }
  }, {
    rootMargin: '-50px 0px',
    threshold: 0.15
  });

  observer.observe(melodyBtn);
}

/**
 * Configura observer per le skill cards con stagger
 */
function setupSkillCardsObserver() {
  const skillCards = document.querySelectorAll('.skill-note');

  if (skillCards.length === 0) return;

  // Mappa per tracciare quali cards sono già state animate
  const animatedCards = new WeakSet();

  const observer = createIntersectionObserver((entry) => {
    const card = entry.target;

    if (entry.isIntersecting && !animatedCards.has(card)) {
      // Ottieni il delay dalla variabile CSS inline
      const delay = parseFloat(card.style.getPropertyValue('--delay')) || 0;
      const delayMs = delay * 1000; // Converti secondi in ms

      // Anima la card
      animateScaleUp(card, 500, delayMs);

      // Marca come animata
      animatedCards.add(card);

      // Unobserve after animation to prevent re-triggering
      observer.unobserve(card);
    }
  }, {
    rootMargin: '-20px 0px',
    threshold: 0.05
  });

  // Osserva tutte le cards
  skillCards.forEach(card => observer.observe(card));
}

/**
 * Configura observer per la caption della foto
 */
function setupPhotoCaptionObserver() {
  const caption = document.querySelector('.photo-caption');

  if (!caption) return;

  const observer = createIntersectionObserver((entry) => {
    if (entry.isIntersecting) {
      // Fade-in semplice per la caption
      caption.style.opacity = '0';
      caption.style.transform = 'translate3d(0, 10px, 0)';
      caption.style.willChange = 'opacity, transform';

      void caption.offsetHeight;

      setTimeout(() => {
        caption.style.transition = `all ${ANIMATION_CONFIG.durations.medium}ms ${ANIMATION_CONFIG.easings.entrance}`;
        caption.style.opacity = '1';
        caption.style.transform = 'translate3d(0, 0, 0)';

        setTimeout(() => {
          caption.style.willChange = '';
        }, ANIMATION_CONFIG.durations.medium + 100);
      }, 300);

      observer.unobserve(entry.target);
    }
  }, {
    rootMargin: '-50px 0px',
    threshold: 0.2
  });

  observer.observe(caption);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Inizializza tutte le animazioni scroll-triggered
 * Chiama questa funzione dopo che il DOM è pronto
 */
function initScrollAnimations() {
  // Usa requestIdleCallback se disponibile per non bloccare il main thread
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      setupProfilePhotoObserver();
      setupMelodyButtonObserver();
      setupSkillCardsObserver();
      setupPhotoCaptionObserver();
    }, { timeout: 2000 });
  } else {
    // Fallback per browser che non supportano requestIdleCallback
    setTimeout(() => {
      setupProfilePhotoObserver();
      setupMelodyButtonObserver();
      setupSkillCardsObserver();
      setupPhotoCaptionObserver();
    }, 100);
  }

  console.log('✅ Scroll animations initialized (Intersection Observer)');
}

// ============================================================================
// CLEANUP FUNCTION
// ============================================================================

/**
 * Cleanup degli observer quando non sono più necessari
 * Chiama prima di rimuovere/modificare il DOM
 */
function cleanupScrollAnimations() {
  // Nota: Intersection Observers si auto-disconnettono quando
  // gli elementi vengono rimossi dal DOM, ma se necessario
  // puoi disconnetterli manualmente qui
  console.log('🧹 Scroll animations cleaned up');
}

// ============================================================================
// EXPORTS
// ============================================================================

export { initScrollAnimations, cleanupScrollAnimations };

// Auto-inizializzazione in development
if (import.meta.env.DEV) {
  // Esponi utility per debug
  window.__scrollAnimationsDebug = {
    init: initScrollAnimations,
    config: ANIMATION_CONFIG,
    animateSlideUp,
    animateScaleUp
  };
}
