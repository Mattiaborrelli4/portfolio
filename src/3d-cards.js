/**
 * 3D Card Tilt Effect
 * Adds interactive 3D tilt effect to project cards on mouse hover
 * Professional implementation with enhanced responsiveness
 */

class Card3DEffect {
  constructor() {
    this.cards = document.querySelectorAll('.featured-project-card');
    this.activeCard = null;
    this.isMobile = window.innerWidth < 1024;
    
    console.log(`🎴 3D Card System: Found ${this.cards.length} cards`);
    
    if (this.cards.length === 0) {
      console.warn('⚠️ No cards found with .featured-project-card class');
      return;
    }

    this.init();
    this.setupResizeListener();
  }

  init() {
    console.log('🎴 Initializing 3D card effect...');

    this.cards.forEach((card, index) => {
      // Set initial 3D perspective
      card.style.transformStyle = 'preserve-3d';
      card.style.perspective = '1200px';
      
      // Add event listeners
      card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
      card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
      card.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, card));

      console.log(`  ✅ Card ${index + 1} listeners attached`);
    });

    console.log('✅ 3D Card initialization complete!');
  }

  handleMouseMove(e, card) {
    if (this.isMobile) return; // Disable on mobile
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles - Professional 3D effect
    // Increased sensitivity: /4 instead of /5 for stronger effect
    const rotateX = (y - centerY) / 4;
    const rotateY = (centerX - x) / 4;

    // Apply 3D transform with slight lift effect
    card.style.transform = `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(1.02, 1.02, 1.02)
      translateZ(20px)
    `;
    
    // Add shadow based on rotation for depth
    const shadowIntensity = Math.abs(rotateX) + Math.abs(rotateY);
    card.style.boxShadow = `
      0 ${shadowIntensity * 2}px ${shadowIntensity * 8}px rgba(0, 0, 0, ${0.15 + shadowIntensity * 0.05}),
      0 4px 12px rgba(0, 0, 0, 0.1)
    `;

    this.activeCard = card;
  }

  handleMouseLeave(e, card) {
    // Reset to default position with smooth easing animation
    card.style.transform = `
      perspective(1200px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1, 1, 1)
      translateZ(0px)
    `;
    
    card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    
    // Smooth transition
    card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease-out';
    
    this.activeCard = null;
  }

  handleMouseEnter(e, card) {
    // Remove transition for instant responsive tracking on enter
    card.style.transition = 'none';
  }

  setupResizeListener() {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 1024;
      
      if (this.isMobile && this.activeCard) {
        // Reset any active card when switching to mobile
        this.activeCard.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)';
        this.activeCard.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }
    });
  }
}

export default Card3DEffect;
