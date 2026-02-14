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
          start: 'top 75%',  // More aggressive trigger
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
          start: 'top 80%',  // More aggressive trigger
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
            start: 'top 80%',  // More aggressive trigger
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
            start: 'top 80%',  // More aggressive trigger
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }
      );
    });

    // About section - UNIFIED TIMELINE
    // Everything appears together when section enters viewport
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        }
      });

      // About heading appears first
      aboutTl.fromTo('.about-heading',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        0
      );

      // Photo appears with header
      aboutTl.fromTo('.photo-placeholder',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
        0  // Same time as header
      );

      // Photo caption appears after photo
      aboutTl.fromTo('.photo-caption',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        0.3  // 0.3s after header
      );

      // Bio paragraphs appear immediately after
      const bioParagraphs = gsap.utils.toArray('.bio-paragraph');
      if (bioParagraphs.length > 0) {
        aboutTl.fromTo(bioParagraphs,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'power2.out' },
          0.2  // Starts 0.2s after header
        );
      }

    }

    // Skills section - UNIFIED TIMELINE
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
      const skillsTl = gsap.timeline({
        scrollTrigger: {
          trigger: skillsSection,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Skills section header appears
      skillsTl.fromTo('.skills-header',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        0
      );

      // Category cards - cascade
      const categoryCards = gsap.utils.toArray('.category');
      if (categoryCards.length > 0) {
        skillsTl.fromTo(categoryCards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out'
          },
          0.4
        );
      }

      // Initially load languages category skills into left column
      loadSkillsForCategory('languages');
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
        if (window.skillProgressAnimation) {
          window.skillProgressAnimation.onCategoryChange();
          }
        }, 100);
      });
    });

    // Featured project cards - ALL TOGETHER
    const featuredProjectCards = gsap.utils.toArray('.featured-project-card');
    if (featuredProjectCards.length > 0) {
      gsap.fromTo(featuredProjectCards,
        { opacity: 0, y: 70 },
        {
          scrollTrigger: {
            trigger: featuredProjectCards[0],
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.03,  // Subtle stagger
          ease: 'power2.out'
        }
      );
    }

    // Experiment cards - ALL TOGETHER
    const experimentCards = gsap.utils.toArray('.experiment-card');
    if (experimentCards.length > 0) {
      gsap.fromTo(experimentCards,
        { opacity: 0, y: 60 },
        {
          scrollTrigger: {
            trigger: experimentCards[0],
            start: 'top 75%',  // Aggressive trigger
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0,  // ALL together
          ease: 'power2.out'
        }
      );
    }

    // Contact heading
    gsap.utils.toArray('.contact__heading').forEach((heading) => {
      gsap.fromTo(heading,
        { opacity: 0, y: 60 },
        {
          scrollTrigger: {
            trigger: heading,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out'
        }
      );
    });

    // Contact description
    gsap.utils.toArray('.contact__description').forEach((desc) => {
      gsap.fromTo(desc,
        { opacity: 0, y: 50 },
        {
          scrollTrigger: {
            trigger: desc,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out'
        }
      );
    });

    // Contact email link
    gsap.utils.toArray('.contact__email-link').forEach((link) => {
      gsap.fromTo(link,
        { opacity: 0, y: 50 },
        {
          scrollTrigger: {
            trigger: link,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        }
      );
    });

    // Stat cards - ALL TOGETHER
    const statCards = gsap.utils.toArray('.stat-card');
    if (statCards.length > 0) {
      gsap.fromTo(statCards,
        { opacity: 0, y: 60 },
        {
          scrollTrigger: {
            trigger: statCards[0],
            start: 'top 75%',  // Aggressive trigger
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0,  // ALL together
          ease: 'power2.out'
        }
      );
    }

    // Social links - ALL TOGETHER
    const socialLinks = gsap.utils.toArray('.social-link');
    if (socialLinks.length > 0) {
      gsap.fromTo(socialLinks,
        { opacity: 0, y: 45 },
        {
          scrollTrigger: {
            trigger: socialLinks[0],
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0,  // ALL together
          ease: 'power2.out'
        }
      );
    }

    // Form inputs - ALL TOGETHER
    const formInputs = gsap.utils.toArray('.form-input, .form-textarea');
    if (formInputs.length > 0) {
      gsap.fromTo(formInputs,
        { opacity: 0, y: 50 },
        {
          scrollTrigger: {
            trigger: formInputs[0],
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0,  // ALL together
          ease: 'power2.out'
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

    // Force ScrollTrigger to recalculate all positions
    ScrollTrigger.refresh(true);

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
    console.group('🚀 Portfolio Initialization');
    console.log('Starting...');

    // Initialize hero Three.js background
    const heroCleanup = initHeroBackground();
    console.log('✅ Hero Three.js background initialized');

    // Initialize audio sequencer
    audioSequencer = new AudioSequencer();
    console.log('✅ Audio sequencer initialized');

    // Initialize skill visual sync system
    const skillSync = setupSkillVisualSync(audioSequencer, 300);
    console.log('✅ Skill visual sync initialized');

    // Initialize skill progress animation
    skillProgressAnimation.init();
    console.log('✅ Skill progress animation initialized');

    // Initialize project slideshows
    projectSlideshow.init();
    console.log('✅ Project slideshows initialized');

    // Initialize smooth scroll
    const lenis = initSmoothScroll();
    console.log('✅ Smooth scroll initialized');

    // Set initial states for elements that will animate on scroll
    // This prevents flash of visible content before animation
    const elementsToHide = [
      '.section-title', '.about-heading', '.bio-paragraph', '.photo-placeholder',
      '.photo-caption', '.skills-header', '.category',
      '.featured-project-card', '.experiment-card', '.contact__heading',
      '.contact__description', '.contact__email-link', '.stat-card',
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
    console.log('✅ 3D card effects initialized');

    // Initialize page load animations
    const pageLoadCtx = initPageLoadAnimations();
    console.log('✅ Page load animations initialized');

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

    console.groupEnd();
    console.log('🎉 Portfolio loaded successfully!');

    // Store contexts for cleanup
    window.__portfolioContexts = {
      pageLoad: pageLoadCtx,
      scrollTrigger: scrollTriggerCtx,
      hover: hoverCtx,
      lenis,
      audioSequencer,
      skillSync,
      card3D,
      heroCleanup
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
