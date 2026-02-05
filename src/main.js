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

// ============================================================================
// DEPENDENCIES
// ============================================================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// AUDIO CONTROLLER - YouTube Integration
// ============================================================================

/**
 * Audio Controller for YouTube integration
 * Handles background music playback with visual feedback
 */
class AudioController {
  constructor() {
    this.player = null;
    this.isReady = false;
    this.isPlaying = false;
    this.melodyBtn = null;
    this.skillButtons = null;
    this.videoId = 'avsrEtGEZ5g'; // YouTube video ID

    this.init();
  }

  init() {
    // Initialize YouTube API
    window.onYouTubeIframeAPIReady = () => {
      this.createPlayer();
    };

    // If API is already ready
    if (window.YT && window.YT.Player) {
      this.createPlayer();
    }

    // Setup event listeners
    this.setupEventListeners();
  }

  createPlayer() {
    // Create hidden YouTube player
    this.player = new YT.Player('youtube-player', {
      height: '0',
      width: '0',
      videoId: this.videoId,
      playerVars: {
        'autoplay': 0,
        'controls': 0,
        'disablekb': 1,
        'fs': 0,
        'loop': 1,
        'playlist': this.videoId,
        'modestbranding': 1,
        'rel': 0,
        'enablejsapi': 1
      },
      events: {
        'onReady': (event) => this.onPlayerReady(event),
        'onStateChange': (event) => this.onPlayerStateChange(event)
      }
    });
  }

  onPlayerReady(event) {
    this.isReady = true;
    console.log('✅ YouTube Player ready');
    // Set volume to 30% for background music
    this.player.setVolume(30);
  }

  onPlayerStateChange(event) {
    // Update playing state
    this.isPlaying = event.data === YT.PlayerState.PLAYING;
    this.updateVisualFeedback();
  }

  setupEventListeners() {
    // Melody button click
    this.melodyBtn = document.getElementById('melodyBtn');
    if (this.melodyBtn) {
      this.melodyBtn.addEventListener('click', () => this.togglePlayback());
    }

    // Skill buttons click - also play music
    this.skillButtons = document.querySelectorAll('.skill-note');
    this.skillButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Play music if not already playing
        if (!this.isPlaying) {
          this.play();
        }
      });
    });
  }

  togglePlayback() {
    if (!this.isReady) return;

    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (!this.isReady) return;

    this.player.playVideo();
    this.isPlaying = true;
    this.updateVisualFeedback();
    this.fadeIn();
  }

  pause() {
    if (!this.isReady) return;

    this.player.pauseVideo();
    this.isPlaying = false;
    this.updateVisualFeedback();
  }

  fadeIn() {
    // Smooth fade-in effect
    if (!this.isReady) return;

    let volume = 0;
    const targetVolume = 30;
    const fadeInInterval = setInterval(() => {
      if (volume < targetVolume) {
        volume += 2;
        this.player.setVolume(volume);
      } else {
        clearInterval(fadeInInterval);
      }
    }, 100);
  }

  updateVisualFeedback() {
    // Update melody button state
    if (this.melodyBtn) {
      if (this.isPlaying) {
        this.melodyBtn.classList.add('playing');
        this.melodyBtn.innerHTML = `
          <span class="melody-btn-icon">⏸</span>
          Pause melody
        `;
      } else {
        this.melodyBtn.classList.remove('playing');
        this.melodyBtn.innerHTML = `
          <span class="melody-btn-icon">♪</span>
          Play a hidden melody
        `;
      }
    }

    // Update skill buttons playing state
    if (this.skillButtons) {
      this.skillButtons.forEach(btn => {
        if (this.isPlaying) {
          btn.classList.add('audio-active');
        } else {
          btn.classList.remove('audio-active');
        }
      });
    }
  }
}

// Global audio controller instance
let audioController = null;

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
    tl.to('.hero-name', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power4.out'
    });

    // Hero subtitle wrapper: fade-in
    tl.to('.hero-subtitle-wrapper', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, '-=0.6');

    // Hero description: fade-in
    tl.to('.hero-description', {
      opacity: 1,
      y: 0,
      duration: 0.7,
    }, '-=0.5');

    // Hero CTA: fade-in + scale
    tl.to('.hero-cta', {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, '-=0.4');

    // About section - NO animation, just set
    tl.set('.about-section', {
      opacity: 1,
      y: 0
    }, '-=0.1');

    // Skill tags: staggered
    tl.from('.skill', {
      opacity: 0,
      y: 20,
      scale: 0.9,
      duration: 0.4,
      stagger: 0.08,
    }, '-=0.3');

    // Projects section - NO initial animation
    // Let scroll-triggered handle it
    tl.set('.projects-section', {
      opacity: 1
    }, '-=0.2');

    // Footer - simple fade-in
    tl.from('.footer', {
      opacity: 0,
      duration: 0.5,
    }, '-=0.2');
  });

  return ctx;
}

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
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

    // Featured project cards - fade + slide up, staggered
    gsap.utils.toArray('.featured-project-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 60,
        duration: 0.7,
        ease: 'power3.out',
        delay: i * 0.1
      });
    });

    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat) => {
      const targetValue = parseInt(stat.getAttribute('data-count'));

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
          ease: 'power2.out',
          onUpdate: function() {
            const progress = this.progress();
            const currentValue = Math.floor(progress * targetValue);
            stat.textContent = currentValue;
          },
          onComplete: function() {
            stat.textContent = targetValue;
          }
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

    // About bio - fade in
    gsap.from('.about-bio', {
      scrollTrigger: {
        trigger: '.about-bio',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    });
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

    // Featured project card hover - enhanced with GSAP
    document.querySelectorAll('.featured-project-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

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

    // Button hover
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
    document.querySelectorAll('.skill').forEach(tag => {
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

    // Initialize audio controller
    audioController = new AudioController();
    console.log('✅ Audio controller initialized');

    // Initialize smooth scroll
    const lenis = initSmoothScroll();
    console.log('✅ Smooth scroll initialized');

    // Set initial states for elements that will animate on scroll
    gsap.set(['.section-title', '.project-card', '.featured-project-card', '.about-bio', '.stat-number'], {
      opacity: 0
    });

    // Initialize page load animations
    const pageLoadCtx = initPageLoadAnimations();
    console.log('✅ Page load animations initialized');

    // Initialize scroll animations
    const scrollCtx = initScrollAnimations();
    console.log('✅ Scroll animations initialized');

    // Initialize hover interactions
    const hoverCtx = initHoverInteractions();
    console.log('✅ Hover interactions initialized');

    console.groupEnd();
    console.log('🎉 Portfolio loaded successfully!');

    // Store contexts for cleanup
    window.__portfolioContexts = {
      pageLoad: pageLoadCtx,
      scroll: scrollCtx,
      hover: hoverCtx,
      lenis,
      audioController
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
    version: '1.0.0'
  };
}
