/**
 * Project Slideshow
 * Handles slideshow functionality for project cards with multiple images
 */

export class ProjectSlideshow {
  constructor() {
    this.slideshows = [];
    this.init();
  }

  init() {
    // Find all slideshow containers
    const slideshowContainers = document.querySelectorAll('.project-slideshow');

    slideshowContainers.forEach((container, index) => {
      this.setupSlideshow(container, index);
    });
  }

  setupSlideshow(container, index) {
    const slides = container.querySelectorAll('.slideshow-slide');
    const dots = container.querySelectorAll('.slideshow-dot');
    const prevBtn = container.querySelector('.slideshow-prev');
    const nextBtn = container.querySelector('.slideshow-next');

    if (!slides.length) return;

    const slideshow = {
      container,
      slides,
      dots,
      prevBtn,
      nextBtn,
      currentIndex: 0,
      totalSlides: slides.length,
      index
    };

    this.slideshows.push(slideshow);

    // Initialize first slide as active
    this.showSlide(slideshow, 0);

    // Setup dot click handlers
    dots.forEach((dot, dotIndex) => {
      dot.addEventListener('click', () => {
        this.showSlide(slideshow, dotIndex);
      });
    });

    // Setup prev button
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.prevSlide(slideshow);
      });
    }

    // Setup next button
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextSlide(slideshow);
      });
    }

    // Auto-advance (optional, every 5 seconds)
    slideshow.autoAdvance = setInterval(() => {
      this.nextSlide(slideshow);
    }, 5000);

    // Pause on hover
    container.addEventListener('mouseenter', () => {
      clearInterval(slideshow.autoAdvance);
    });

    // Resume on mouse leave
    container.addEventListener('mouseleave', () => {
      slideshow.autoAdvance = setInterval(() => {
        this.nextSlide(slideshow);
      }, 5000);
    });
  }

  showSlide(slideshow, index) {
    // Wrap around
    if (index >= slideshow.totalSlides) {
      index = 0;
    } else if (index < 0) {
      index = slideshow.totalSlides - 1;
    }

    slideshow.currentIndex = index;

    // Hide all slides
    slideshow.slides.forEach(slide => {
      slide.classList.remove('active');
    });

    // Show current slide
    slideshow.slides[index].classList.add('active');

    // Update dots
    slideshow.dots.forEach((dot, dotIndex) => {
      if (dotIndex === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  nextSlide(slideshow) {
    this.showSlide(slideshow, slideshow.currentIndex + 1);
  }

  prevSlide(slideshow) {
    this.showSlide(slideshow, slideshow.currentIndex - 1);
  }

  destroy() {
    // Cleanup all slideshows
    this.slideshows.forEach(slideshow => {
      if (slideshow.autoAdvance) {
        clearInterval(slideshow.autoAdvance);
      }
    });
    this.slideshows = [];
  }
}

// Export instance for use in main.js
export const projectSlideshow = new ProjectSlideshow();
