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
  // Initialize Lenis with professional snappy configuration
  const lenis = new Lenis({
    duration: 1.2,           // Snappier feel (reduced from 1.8)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 0.8,    // More responsive (increased from 0.6)
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    lerp: 0.15,             // Balanced snappiness (increased from 0.1)
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
 * Initialize page load animations - Unified Hero Timeline
 */
function initPageLoadAnimations() {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      delay: 0.2  // Slight delay for page load
    });

    // 1. Photo placeholder with glow - appears FIRST
    tl.fromTo('.photo-placeholder',
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' },
      0
    );

    // 2. Hero name - reveal from slide up
    tl.fromTo('.hero-name',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.5'
    );

    // 3. Hero subtitle wrapper - cascade
    tl.fromTo('.hero-subtitle-wrapper',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.4'
    );

    // 4. Hero description - smooth cascade
    tl.fromTo('.hero-description',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.3'
    );

    // 5. Hero CTA - subtle bounce
    tl.fromTo('.hero-cta',
      { opacity: 0, y: 15, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
      '-=0.3'
    );

    // 6. Social links stagger - AFTER CTA
    tl.fromTo('.social-link',
      { opacity: 0, x: -15 },
      {
        opacity: 1,
        x: 0,
        duration: 0.35,
        ease: 'power2.out',
        stagger: 0.06  // Quick cascade
      },
      '-=0.2'
    );

    console.log(' Unified hero timeline created and playing');
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

    // Project cards - DRAMATIC staggered entrance
    const projectCards = gsap.utils.toArray('.project-card');
    if (projectCards.length > 0) {
      gsap.set(projectCards, {
        opacity: 0,
        y: 100,  // Much more dramatic
        scale: 0.9,
        force3D: true
      });

      gsap.to(projectCards, {
        scrollTrigger: {
          trigger: projectCards[0],
          start: 'top 85%',  // Earlier trigger for more visibility
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,  // Longer
        ease: 'power3.out',
        stagger: 0.15,  // More pronounced
        force3D: true
      });
    }

    // About section - EACH ELEMENT with SEPARATE ScrollTrigger
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      console.log('About section found, setting up SEPARATE triggers...');

      // Set initial states
      gsap.set('.photo-placeholder', {
        opacity: 0,
        y: 120,
        scale: 0.85,
        rotationX: 5,
        force3D: true
      });

      gsap.set('.about-heading', {
        opacity: 0,
        y: 100,
        scale: 0.95,
        force3D: true
      });

      const bioParagraphs = document.querySelectorAll('.bio-paragraph');
      if (bioParagraphs.length >= 3) {
        gsap.set(bioParagraphs[0], { opacity: 0, y: 90, scale: 0.96, force3D: true });
        gsap.set(bioParagraphs[1], { opacity: 0, y: 90, scale: 0.96, force3D: true });
        gsap.set(bioParagraphs[2], { opacity: 0, y: 90, scale: 0.96, force3D: true });
      }

      gsap.set('.photo-caption', { opacity: 0, y: 60, force3D: true });

      // Photo - SEPARATE trigger
      gsap.to('.photo-placeholder', {
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.0,
        ease: 'power3.out',
        force3D: true
      });

      // Heading - starts 0.3s AFTER scroll trigger
      gsap.to('.about-heading', {
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        delay: 0.3,  // This delay IS from scroll trigger!
        ease: 'power3.out',
        force3D: true
      });

      // Paragraph 1 - starts 0.6s AFTER scroll trigger
      if (bioParagraphs.length >= 3) {
        gsap.to(bioParagraphs[0], {
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.6,
          ease: 'power2.out',
          force3D: true
        });

        // Paragraph 2 - starts 1.1s AFTER scroll trigger
        gsap.to(bioParagraphs[1], {
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 1.1,
          ease: 'power2.out',
          force3D: true
        });

        // Paragraph 3 - starts 1.6s AFTER scroll trigger
        gsap.to(bioParagraphs[2], {
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 1.6,
          ease: 'power2.out',
          force3D: true
        });
      }

      // Caption - starts 2.1s AFTER scroll trigger
      gsap.to('.photo-caption', {
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 2.1,
        ease: 'power2.out',
        force3D: true
      });
    }

    // Skills section - DRAMATIC cascade
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
      // Set initial hidden states
      gsap.set('.skills-header', {
        opacity: 0,
        y: 80,
        scale: 0.95,
        force3D: true
      });

      gsap.set('.category', {
        opacity: 0,
        y: 60,
        scale: 0.92,
        force3D: true
      });

      gsap.set('.skill-note', {
        opacity: 0,
        y: 70,
        scale: 0.9,
        force3D: true
      });

      // Header appears first with DRAMA
      gsap.to('.skills-header', {
        scrollTrigger: {
          trigger: skillsSection,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        force3D: true
      });

      // Category buttons cascade with DRAMA
      gsap.to('.category', {
        scrollTrigger: {
          trigger: skillsSection,
          start: 'top 78%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power2.out',
        stagger: {
          amount: 0.5,
          from: "start"
        },
        force3D: true
      });

      // Skill cards with progress bars - DRAMATIC entrance
      gsap.to('.skill-note', {
        scrollTrigger: {
          trigger: skillsSection,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.1,  // More pronounced
        force3D: true,
        onStart: () => {
          // Progress bars fill dramatically
          gsap.to('.skill-fill', {
            width: 'var(--percent)',
            duration: 1.0,  // Longer
            ease: 'power3.out',
            stagger: 0.08  // More dramatic
          });
        }
      });
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

    // Initialize with "Programming Languages" category on page load
    const languagesCard = document.querySelector('.category[data-category="languages"]');
    if (languagesCard) {
      // Set active class on languages card
      languagesCard.classList.add('active');

      // Load programming languages skills
      loadSkillsForCategory('languages');

      // Trigger progress animation
      setTimeout(() => {
        if (window.skillProgressAnimation) {
          window.skillProgressAnimation.onCategoryChange();
        }
      }, 100);
    }

    // Featured project cards - DRAMATIC grid stagger
    const featuredProjectCards = gsap.utils.toArray('.featured-project-card');
    if (featuredProjectCards.length > 0) {
      gsap.set(featuredProjectCards, {
        opacity: 0,
        y: 90,  // Much more dramatic
        scale: 0.88,
        force3D: true
      });

      gsap.to(featuredProjectCards, {
        scrollTrigger: {
          trigger: featuredProjectCards[0],
          start: 'top 82%',  // Earlier trigger
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        ease: 'power3.out',
        stagger: {
          amount: 0.6,  // More dramatic stagger
          grid: [3, 2],
          from: "start"
        },
        force3D: true
      });
    }

    // Experience cards - CINEMATIC scale + blur dissolve (NEW!)
    const experienceCards = gsap.utils.toArray('.experience-card');
    if (experienceCards.length > 0) {
      gsap.set(experienceCards, {
        opacity: 0,
        scale: 0.7,  // Start much smaller
        filter: 'blur(10px)',  // Start blurred
        y: 40,  // Slightly below
        force3D: true
      });

      gsap.to(experienceCards, {
        scrollTrigger: {
          trigger: experienceCards[0],
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',  // Blur disappears
        y: 0,
        duration: 0.85,
        ease: 'power2.out',
        stagger: 0.2,
        force3D: true
      });
    }

    // Contact section - DRAMATIC unified entrance
    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
      // Set initial dramatic states
      gsap.set(['.contact-heading', '.contact-description', '.contact-email'], {
        opacity: 0,
        x: -60,  // More dramatic slide from left
        force3D: true
      });

      gsap.set('.social-link', {
        opacity: 0,
        y: 40,
        scale: 0.85,
        force3D: true
      });

      gsap.set('.contact-form-wrapper', {
        opacity: 0,
        x: 60,  // More dramatic slide from right
        scale: 0.95,
        force3D: true
      });

      // Left side - slide from left DRAMATIC
      gsap.to(['.contact-heading', '.contact-description', '.contact-email'], {
        scrollTrigger: {
          trigger: contactSection,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        x: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.12,
        force3D: true
      });

      // Social buttons - bounce from below
      gsap.to('.social-link', {
        scrollTrigger: {
          trigger: contactSection,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.5)',  // Bouncy effect
        stagger: 0.08,
        force3D: true
      });

      // Right side form - slide from right DRAMATIC
      gsap.to('.contact-form-wrapper', {
        scrollTrigger: {
          trigger: contactSection,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.85,
        ease: 'power3.out',
        force3D: true
      });
    }

    // Stats counter animation - DRAMATIC scale and count
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat) => {
      const targetValue = parseInt(stat.getAttribute('data-count'));
      const counterObj = { value: 0 };

      gsap.to(counterObj, {
        scrollTrigger: {
          trigger: stat,
          start: 'top 85%',  // Earlier trigger
          toggleActions: 'play none none reverse',
        },
        value: targetValue,
        duration: 2.2,  // Longer for drama
        ease: 'power3.out',
        onUpdate: function() {
          stat.textContent = Math.round(this.targets()[0].value);
        }
      });
    });

    // Stat items - DRAMATIC scale entrance
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length >= 3) {
      // Set initial dramatic states
      gsap.set(statItems[1], {
        opacity: 0,
        scale: 0.7,  // Much smaller
        y: 50,
        force3D: true
      });

      gsap.set([statItems[0], statItems[2]], {
        opacity: 0,
        scale: 0.65,
        y: 60,
        force3D: true
      });

      // Central stat explodes in
      gsap.to(statItems[1], {
        scrollTrigger: {
          trigger: '.projects-stats',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',  // Bouncy
        force3D: true
      });

      // Side stats follow
      gsap.to([statItems[0], statItems[2]], {
        scrollTrigger: {
          trigger: '.projects-stats',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        delay: 0.2,
        stagger: 0.1,
        ease: 'back.out(1.5)',
        force3D: true
      });
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

    // Social links hover - DYNAMIC EXPANSION/CONTRACTION EFFECT
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
      link.addEventListener('mouseenter', () => {
        // Remove all classes first
        socialLinks.forEach(l => {
          l.classList.remove('expanded', 'contracted', 'move-left', 'move-right');
        });

        // Add expanded class to hovered button
        link.classList.add('expanded');

        // Add contracted classes to other buttons based on position
        socialLinks.forEach((otherLink, otherIndex) => {
          if (otherIndex !== index) {
            otherLink.classList.add('contracted');

            // If hovered is center (index 1)
            if (index === 1) {
              if (otherIndex === 0) otherLink.classList.add('move-left');
              if (otherIndex === 2) otherLink.classList.add('move-right');
            }
            // If hovered is left (index 0)
            else if (index === 0) {
              otherLink.classList.add('move-right');
            }
            // If hovered is right (index 2)
            else if (index === 2) {
              otherLink.classList.add('move-left');
            }
          }
        });
      });

      link.addEventListener('mouseleave', () => {
        // Remove all classes when mouse leaves
        socialLinks.forEach(l => {
          l.classList.remove('expanded', 'contracted', 'move-left', 'move-right');
        });
      });
    });

    // CURSOR-FOLLOWING EFFECT - Profile photo (shadow) and Project cards (spotlight)
    const initCursorEffect = (elements, isSpotlight = true) => {
      elements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
          const rect = element.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;

          element.style.setProperty('--mouse-x', `${x}%`);
          element.style.setProperty('--mouse-y', `${y}%`);
        });
      });
    };

    // Apply DYNAMIC SHADOW to profile photo
    const profilePhoto = document.querySelector('.photo-placeholder');
    if (profilePhoto) {
      initCursorEffect([profilePhoto], false);
    }

    // Apply SPOTLIGHT to featured project cards only
    const featuredProjectCardsCursor = document.querySelectorAll('.featured-project-card');
    if (featuredProjectCardsCursor.length > 0) {
      initCursorEffect(featuredProjectCardsCursor, true);
    }
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
      // About section elements REMOVED - now handled by staggered animation
      // '.about-heading', '.bio-paragraph', '.photo-placeholder', '.photo-caption',
      '.skills-header', '.category',
      '.featured-project-card', '.contact-heading',
      '.contact-description', '.contact-email',
      '.social-link'
      // Note: About section now animated with stagger in initScrollTriggerAnimations
      // Note: Skill cards will be animated separately
    ];

    elementsToHide.forEach(selector => {
      gsap.set(selector, {
        opacity: 0,
        y: selector.includes('card') ? 60 :
           selector.includes('contact') ? 15 : 50,  // Contact elements: only 15px down
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
