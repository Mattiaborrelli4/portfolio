/**
 * Main Application Entry Point
 * Portfolio with Swiss Precision Design
 */

// ============================================================================
// CSS IMPORTS
// ============================================================================

// Import all CSS modules
import './styles/variables.css';
import './styles/reset.css';
import './styles/typography.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/animations.css';
import './styles/performance.css';

// ============================================================================
// 3D EFFECTS
// ============================================================================

import Card3DEffect from './3d-cards.js';
import { initScrollAnimations } from './scroll-animations.js';

// ============================================================================
// DEPENDENCIES
// ============================================================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { AudioSequencer } from './audio-sequencer.js';
import { setupSkillVisualSync } from './skill-visual-sync.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// AUDIO SEQUENCER - Web Audio API
// ============================================================================

// Global audio sequencer instance
let audioSequencer = null;

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

/**
 * Initialize Lenis smooth scroll
 */
function initSmoothScroll() {
  // Initialize Lenis with new API
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Add Lenis to GSAP ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Disable lag smoothing for instant response
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/**
 * Initialize page load animations
 */
function initPageLoadAnimations() {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Hero name: fade-in + slide-up
    tl.fromTo('.hero-name',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power4.out' },
      0
    );

    // Hero subtitle wrapper: fade-in
    tl.fromTo('.hero-subtitle-wrapper',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.6'
    );

    // Hero description: fade-in
    tl.fromTo('.hero-description',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.5'
    );

    // Hero CTA: fade-in + scale
    tl.fromTo('.hero-cta',
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
      '-=0.4'
    );

    console.log('🎬 Hero animations timeline created and playing');
  });

  return ctx;
}

/**
 * Initialize scroll-triggered GSAP animations
 */
function initScrollTriggerAnimations() {
  const ctx = gsap.context(() => {
    // Section titles - fade + slide from left
    gsap.utils.toArray('.section-title').forEach((title) => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        x: -30,
        duration: 0.6,
        ease: 'power2.out'
      });
    });

    // Project cards - fade + slide up, ONE BY ONE
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 40,
        duration: 0.5,
        ease: 'power2.out'
      });
    });

    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat) => {
      const targetValue = parseInt(stat.getAttribute('data-count'));

      // Create a proxy object to animate the value
      const counterObj = { value: 0 };

      gsap.fromTo(counterObj,
        { value: 0 },
        {
          scrollTrigger: {
            trigger: stat,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          value: targetValue,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            stat.textContent = Math.round(this.targets()[0].value);
          }
        }
      );

      // Separate animation for fade and position
      gsap.fromTo(stat,
        { opacity: 0, y: 20 },
        {
          scrollTrigger: {
            trigger: stat,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }
      );
    });

    // Scroll progress indicator for projects
    const scrollProgress = document.querySelector('.scroll-progress-projects');
    if (scrollProgress) {
      const projectsSection = document.querySelector('.projects-section');

      ScrollTrigger.create({
        trigger: projectsSection,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          const progress = self.progress * 100;
          scrollProgress.style.width = `${progress}%`;
        }
      });
    }

  });

  return ctx;
}

/**
 * Initialize hover interactions
 */
function initHoverInteractions() {
  const ctx = gsap.context(() => {
    // Link animations
    document.querySelectorAll('.link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          scale: 1.05,
          color: '#2C5F7F',
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          scale: 1,
          color: '',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Project card hover
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          backgroundColor: '#F5F5F2',
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          backgroundColor: 'transparent',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Featured project card hover - handled by 3D card effect in 3d-cards.js
    // GSAP animation removed to avoid conflicts with 3D tilt effect

    // Tech tag hover
    document.querySelectorAll('.tech-tag').forEach(tag => {
      tag.addEventListener('mouseenter', () => {
        gsap.to(tag, {
          scale: 1.05,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      tag.addEventListener('mouseleave', () => {
        gsap.to(tag, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out'
        });
      });
    });

    // Button hover and click
    const cta = document.querySelector('.hero-cta');
    if (cta) {
      cta.addEventListener('mouseenter', () => {
        gsap.to(cta, {
          y: -2,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      cta.addEventListener('mouseleave', () => {
        gsap.to(cta, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    }

    // Skill tags hover
    document.querySelectorAll('.skill-note').forEach(tag => {
      tag.addEventListener('mouseenter', () => {
        gsap.to(tag, {
          scale: 1.1,
          borderColor: '#2C5F7F',
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      tag.addEventListener('mouseleave', () => {
        gsap.to(tag, {
          scale: 1,
          borderColor: '#E0E0E0',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Social links hover
    document.querySelectorAll('.social-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          x: 5,
          color: '#2C5F7F',
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          x: 0,
          color: '',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  });

  return ctx;
}

/**
 * Main initialization function
 */
function init() {
  try {
    console.group('🚀 Portfolio Initialization');
    console.log('Starting...');

    // Initialize audio sequencer
    audioSequencer = new AudioSequencer();
    console.log('✅ Audio sequencer initialized');

    // Initialize skill visual sync system
    const skillSync = setupSkillVisualSync(audioSequencer, 300);
    console.log('✅ Skill visual sync initialized');

    // Initialize smooth scroll
    const lenis = initSmoothScroll();
    console.log('✅ Smooth scroll initialized');

    // Set initial states for elements that will animate on scroll
    gsap.set('.section-title', {
      opacity: 0
    });

    // Initialize 3D card effects
    const card3D = new Card3DEffect();
    console.log('✅ 3D card effects initialized');

    // Initialize page load animations
    const pageLoadCtx = initPageLoadAnimations();
    console.log('✅ Page load animations initialized');

    // Initialize scroll animations
    const scrollCtx = initScrollAnimations();
    console.log('✅ Scroll animations initialized');

    // Initialize GSAP ScrollTrigger animations
    const scrollTriggerCtx = initScrollTriggerAnimations();
    console.log('✅ GSAP ScrollTrigger animations initialized');

    // Initialize hover interactions
    const hoverCtx = initHoverInteractions();
    console.log('✅ Hover interactions initialized');

    // Setup CTA button scroll functionality
    const ctaBtn = document.querySelector('.hero-cta');
    if (ctaBtn && lenis) {
      ctaBtn.addEventListener('click', () => {
        const projectsSection = document.querySelector('.projects-section') || document.querySelector('.about-section');
        if (projectsSection) {
          lenis.scrollTo(projectsSection, {
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }
      });
      console.log('✅ CTA button scroll enabled');
    }

    // Setup melody button
    const melodyBtn = document.getElementById('melodyBtn');
    if (melodyBtn && audioSequencer) {
      melodyBtn.addEventListener('click', () => {
        if (audioSequencer.isPlaying) {
          audioSequencer.stop();
          melodyBtn.classList.remove('playing');
          melodyBtn.innerHTML = '<span class="melody-btn-icon">♪</span> Play a hidden melody';
        } else {
          // Resume AudioContext if suspended (required by browsers)
          if (audioSequencer.audioContext && audioSequencer.audioContext.state === 'suspended') {
            audioSequencer.audioContext.resume();
          }
          audioSequencer.start();
          melodyBtn.classList.add('playing');
          melodyBtn.innerHTML = '<span class="melody-btn-icon">⏸</span> Pause melody';
        }
      });
      console.log('✅ Melody button connected');
    }

    // Setup skill note hover - play individual notes
    const skillNotes = document.querySelectorAll('.skill-note');
    skillNotes.forEach(noteBtn => {
      const frequency = noteBtn.getAttribute('data-frequency');
      if (frequency && audioSequencer) {
        noteBtn.addEventListener('mouseenter', () => {
          // Resume AudioContext if suspended
          if (audioSequencer.audioContext && audioSequencer.audioContext.state === 'suspended') {
            audioSequencer.audioContext.resume();
          }
          // Play the note for 300ms
          audioSequencer.playNoteByFrequency(parseFloat(frequency), 0.3);
        });
      }
    });
    console.log('✅ Skill hover audio enabled');

    console.groupEnd();
    console.log('🎉 Portfolio loaded successfully!');

    // Store contexts for cleanup
    window.__portfolioContexts = {
      pageLoad: pageLoadCtx,
      scroll: scrollCtx,
      scrollTrigger: scrollTriggerCtx,
      hover: hoverCtx,
      lenis,
      audioSequencer,
      skillSync,
      card3D
    };

  } catch (error) {
    console.error('❌ Initialization error:', error);
  }
}

// ============================================================================
// DOM READY
// ============================================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Dev mode helper
if (import.meta.env.DEV) {
  window.__portfolio = {
    reinit: init,
    version: '1.0.0',
    // Skill visual sync helpers
    testSkillCards: () => skillSync?.test(),
    syncSkillNote: (note) => skillSync?.sync(note),
    getSkillStats: () => skillSync?.getStats(),
    resetSkillSync: () => skillSync?.reset()
  };
}
