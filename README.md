# Mattia's Portfolio - Professional Immersive Experience

## Tech Stack
- Vite 7.3.1 - Ultra-fast build tool
- GSAP - Professional animations
- Lenis - Smooth scrolling (60fps)
- Three.js - 3D hero effects
- Vanilla JavaScript - No framework overhead

## Design Philosophy
Inspired by industry leaders:
- **Apple.com** - Scroll-driven animations, parallax, 3D transforms
- **Linear.app** - Micro-interactions, spring physics, snappy 150-250ms timing
- **Vercel.com** - Fluid transitions, gradient animations
- **Stripe.com** - Choreographed sequences, precise timing

## Animation System
**Timing Scale:**
- Instant: 150ms (button clicks)
- Fast: 250ms (card hover)
- Base: 350ms (UI transitions)
- Slow: 500ms (section reveals)
- Slower: 800ms (complex sequences)

**Easing Curves:**
- Snappy: cubic-bezier(0.25, 0.1, 0.25, 1)
- Smooth: cubic-bezier(0.4, 0, 0.2, 1)
- Premium: cubic-bezier(0.16, 1, 0.3, 1)

**Performance:**
- GPU-accelerated only (transform, opacity)
- Never animate layout properties
- Will-change strategic usage
- 60fps consistent frame rate

## Development
```bash
npm install      # Install dependencies
npm run dev      # Start dev server
npm run build    # Production build
```

## Deployment
Auto-deploys to GitHub Pages on push to main branch.
Live: https://mattiaborrelli4.github.io/portfolio/

## Author
**Mattia Borrelli**
Full-Stack Developer @ Università degli Studi di Napoli Federico II
GitHub: @Mattiaborrelli4
