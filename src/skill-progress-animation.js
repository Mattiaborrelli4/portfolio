/**
 * Skill Progress Animation
 * Animates skill progress bars from 0% to target percentage
 */

export class SkillProgressAnimation {
  constructor() {
    this.skillNotes = document.querySelectorAll('.skills-wrapper .skill-note[data-percent]');
    this.animatedSkills = new Set();
    this.init();
  }

  init() {
    if (!this.skillNotes.length) return;

    // Initialize all skills at 0% immediately
    this.skillNotes.forEach(skill => {
      const percentElement = skill.querySelector('.skill-percent');
      const skillFill = skill.querySelector('.skill-fill');

      if (percentElement) {
        percentElement.textContent = '0%';
      }

      if (skillFill) {
        skillFill.style.width = '0%';
      }
    });

    // Animate visible skills after a short delay
    setTimeout(() => {
      this.animateVisibleSkills();
    }, 500);
  }

  animateVisibleSkills() {
    this.skillNotes.forEach(skill => {
      // Check if skill is visible (not display: none)
      const isVisible = skill.style.display !== 'none' && skill.style.opacity !== '0';

      if (isVisible && !this.animatedSkills.has(skill)) {
        this.animateSkill(skill);
      }
    });
  }

  animateSkill(skill) {
    // Prevent duplicate animations
    if (this.animatedSkills.has(skill)) return;
    this.animatedSkills.add(skill);

    const percentElement = skill.querySelector('.skill-percent');
    const skillFill = skill.querySelector('.skill-fill');

    if (!percentElement || !skillFill) return;

    // Check if element exists in DOM
    if (!document.body.contains(skill)) {
      console.warn('Skill not in DOM, skipping animation:', skill);
      return;
    }

    // Get target percent from data attribute
    const targetPercent = parseInt(skill.getAttribute('data-percent'), 10);
    const currentPercent = 0;

    // Animate number counter
    this.animateCounter(percentElement, currentPercent, targetPercent, 2000);

    // Animate progress bar width
    skillFill.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
    skillFill.style.width = `${targetPercent}%`;

    // Add visible class for any additional styling
    setTimeout(() => {
      if (document.body.contains(skill)) {
        skill.classList.add('visible');
      }
    }, 100);
  }

  animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(duration / range);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      element.textContent = `${current}%`;

      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime);
  }

  reset() {
    // Reset all animations
    this.animatedSkills.clear();
    this.skillNotes.forEach(skill => {
      const percentElement = skill.querySelector('.skill-percent');
      const skillFill = skill.querySelector('.skill-fill');

      if (percentElement) {
        const targetPercent = skill.getAttribute('data-percent');
        percentElement.textContent = '0%';
      }

      if (skillFill) {
        skillFill.style.width = '0%';
      }

      skill.classList.remove('visible');
    });
  }

  refresh() {
    // Reset and re-animate
    this.reset();

    setTimeout(() => {
      this.animateVisibleSkills();
    }, 300);
  }

  // Method to be called after category filter changes
  onCategoryChange() {
    // Re-animate visible skills after category filter
    setTimeout(() => {
      this.animateVisibleSkills();
    }, 200);
  }

  destroy() {
    // Cleanup if needed
    this.animatedSkills.clear();
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.skillProgressAnimation = new SkillProgressAnimation();
  });
} else {
  window.skillProgressAnimation = new SkillProgressAnimation();
}

// Export instance for use in main.js
export const skillProgressAnimation = window.skillProgressAnimation;
