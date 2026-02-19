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

import Card3DEffect, { Photo3DEffect } from './3d-cards.js';
import { initHeroBackground } from './hero-threejs-background.js';

// ============================================================================
// DEPENDENCIES
// ============================================================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { AudioSequencer } from './audio-sequencer.js';
import { setupSkillVisualSync } from './skill-visual-sync.js';
import { skillProgressAnimation } from './skill-progress-animation.js';
import { projectSlideshow } from './project-slideshow.js';

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

    console.log(' Hero animations timeline created and playing');
  });

  return ctx;
}

/**
 * Initialize scroll-triggered GSAP animations
 * Optimized for smooth, professional transitions with NO delays
 */
function initScrollTriggerAnimations() {
  const ctx = gsap.context(() => {
    // Custom easing for premium feel - inspired by Apple/Linear
    const smoothEase = 'cubic-bezier(0.16, 1, 0.3, 1)'; // iOS-like smooth
    const premiumEase = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Ease-out-quint

    // Project cards - TOGETHER, smooth fade-up, EARLY trigger
    gsap.utils.toArray('.project-card').forEach((card) => {
      gsap.fromTo(card,
        { opacity: 0, y: 25 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',  // VERY EARLY trigger - NO delay
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: smoothEase
        }
      );
    });

    // About section - OPTIMIZED, NO delay, all together
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      // All elements animate TOGETHER for instant feel
      gsap.fromTo(['.photo-placeholder', '.about-heading', '.photo-caption', '.bio-paragraph'],
        { opacity: 0, y: 20 },
        {
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top 88%',  // EARLY trigger
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: smoothEase
          // NO stagger - all together
        }
      );
    }

    // Skills section - NO delay, together
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
      // Skills header + category cards ALL TOGETHER
      gsap.fromTo(['.skills-header', '.category'],
        { opacity: 0, y: 15 },
        {
          scrollTrigger: {
            trigger: skillsSection,
            start: 'top 90%',  // EARLY trigger
            toggleActions: 'play none none reverse'
          },
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: smoothEase
          // NO stagger
        }
      );
    }

    // Function to load skills for a category into the left column
    function loadSkillsForCategory(category) {
      const skillsGrid = document.getElementById('skillsGrid');
      const skillsList = document.getElementById('skillsList');
      const allSkills = skillsGrid.querySelectorAll('.skill-note');

      // Clear current skills list
      skillsList.innerHTML = '';

      // Filter and clone skills for the selected category
      allSkills.forEach(skill => {
        const skillCategory = skill.getAttribute('data-category');
        if (skillCategory === category) {
          const clonedSkill = skill.cloneNode(true);
          clonedSkill.style.opacity = '0';
          clonedSkill.style.transform = 'translateY(20px)';
          skillsList.appendChild(clonedSkill);

          // Animate in
          setTimeout(() => {
            clonedSkill.style.opacity = '1';
            clonedSkill.style.transform = 'translateY(0)';
            clonedSkill.classList.add('visible');
          }, 100);
        }
      });
    }

    // Skills Category Filter
    const categoryCards = document.querySelectorAll('.category');

    categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        // Remove active class from all cards
        categoryCards.forEach(c => c.classList.remove('active'));
        // Add active class to clicked card
        card.classList.add('active');

        const category = card.getAttribute('data-category');

        // Load skills for selected category
        loadSkillsForCategory(category);

        // Trigger progress animation
        setTimeout(() => {
          if (window.skillProgressAnimation) {
            window.skillProgressAnimation.onCategoryChange();
          }
        }, 100);
      });
    });

    // Featured project cards - ALL TOGETHER, NO stagger
    const featuredProjectCards = gsap.utils.toArray('.featured-project-card');
    if (featuredProjectCards.length > 0) {
      gsap.fromTo(featuredProjectCards,
        { opacity: 0, y: 20 },
        {
          scrollTrigger: {
            trigger: featuredProjectCards[0],
            start: 'top 90%',  // EARLY trigger
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: smoothEase
          // NO stagger - all cards appear together
        }
      );
    }

    // Experience cards - ALL TOGETHER
    const experienceCards = gsap.utils.toArray('.experience-card');
    if (experienceCards.length > 0) {
      gsap.fromTo(experienceCards,
        { opacity: 0, y: 18 },
        {
          scrollTrigger: {
            trigger: experienceCards[0],
            start: 'top 90%',  // EARLY trigger
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: smoothEase
          // NO stagger
        }
      );
    }

    // Contact section - ENTIRE FORM as ONE unified block
    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
      // Left side (heading, description, email, social)
      gsap.fromTo(['.contact-heading', '.contact-description', '.contact-email', '.social-link'],
        { opacity: 0, x: -15 },
        {
          scrollTrigger: {
            trigger: contactSection,
            start: 'top 88%',  // EARLY trigger
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          x: 0,
          duration: 0.75,
          ease: smoothEase
        }
      );

      // Right side (ENTIRE form wrapper as ONE block)
      gsap.fromTo('.contact-form-wrapper',
        { opacity: 0, x: 15 },
        {
          scrollTrigger: {
            trigger: contactSection,
            start: 'top 88%',  // EARLY trigger
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          x: 0,
          duration: 0.75,
          ease: smoothEase
        }
      );
    }

    // Stats counter animation - Two phases: central first, then sides - NO delay
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
            start: 'top 92%',  // EARLY trigger
            toggleActions: 'play none none reverse',
          },
          value: targetValue,
          duration: 1.8,
          ease: smoothEase,
          onUpdate: function() {
            stat.textContent = Math.round(this.targets()[0].value);
          }
        }
      );
    });

    // Phase 1: Central stat (Featured Projects) appears first - QUICK
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length >= 3) {
      // Central stat (index 1)
      gsap.fromTo(statItems[1],
        { opacity: 0, scale: 0.9 },
        {
          scrollTrigger: {
            trigger: '.projects-stats',
            start: 'top 90%',  // EARLY trigger
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: smoothEase
        }
      );

      // Phase 2: Side stats (index 0 and 2) appear after - QUICK
      gsap.fromTo([statItems[0], statItems[2]],
        { opacity: 0, scale: 0.9 },
        {
          scrollTrigger: {
            trigger: '.projects-stats',
            start: 'top 90%',  // EARLY trigger
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: 0.15,  // Reduced from 0.3s
          stagger: 0.05,  // Reduced stagger
          ease: smoothEase
        }
      );
    }

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

    // Hover interactions
    document.querySelectorAll('.link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          scale: 1,
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

    // Skill notes hover - using CSS transitions now, no GSAP needed

    // Social links hover
    document.querySelectorAll('.social-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          x: 5,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          x: 0,
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
    console.group(' Portfolio Initialization');
    console.log('Starting...');

    // Initialize hero Three.js background
    const heroCleanup = initHeroBackground();
    console.log(' Hero Three.js background initialized');

    // Initialize audio sequencer
    audioSequencer = new AudioSequencer();
    console.log(' Audio sequencer initialized');

    // Initialize skill visual sync system
    const skillSync = setupSkillVisualSync(audioSequencer, 300);
    console.log(' Skill visual sync initialized');

    // Initialize skill progress animation
    skillProgressAnimation.init();
    console.log(' Skill progress animation initialized');

    // Initialize project slideshows
    projectSlideshow.init();
    console.log(' Project slideshows initialized');

    // Initialize smooth scroll
    const lenis = initSmoothScroll();
    console.log(' Smooth scroll initialized');

    // Set initial states for elements that will animate on scroll
    // This prevents flash of visible content before animation
    const elementsToHide = [
      '.about-heading', '.bio-paragraph', '.photo-placeholder',
      '.photo-caption', '.skills-header', '.category',
      '.featured-project-card', '.contact-heading',
      '.contact-description', '.contact-email',
      '.social-link', '.form-input', '.form-textarea'
    ];

    elementsToHide.forEach(selector => {
      gsap.set(selector, {
        opacity: 0,
        y: selector.includes('card') ? 60 : 50,
        overwrite: 'auto'
      });
    });

    // Initialize 3D card effects
    const card3D = new Card3DEffect();
    console.log(' 3D card effects initialized');

    // Initialize 3D photo effect
    const photo3D = new Photo3DEffect();
    console.log(' 3D photo effect initialized');

    // Initialize page load animations
    const pageLoadCtx = initPageLoadAnimations();
    console.log(' Page load animations initialized');

    // Initialize GSAP ScrollTrigger animations
    const scrollTriggerCtx = initScrollTriggerAnimations();
    console.log(' GSAP ScrollTrigger animations initialized');

    // Initialize hover interactions - commented out, function not defined
    // const hoverCtx = initHoverInteractions();
    // console.log(' Hover interactions initialized');

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
      console.log(' CTA button scroll enabled');
    }

    console.groupEnd();
    console.log(' Portfolio loaded successfully!');

    // Store contexts for cleanup
    window.__portfolioContexts = {
      pageLoad: pageLoadCtx,
      scrollTrigger: scrollTriggerCtx,
      // hover: hoverCtx, // Commentato - funzione non definita
      lenis,
      audioSequencer,
      skillSync,
      card3D,
      heroCleanup
    };

  } catch (error) {
    console.error(' Initialization error:', error);
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
