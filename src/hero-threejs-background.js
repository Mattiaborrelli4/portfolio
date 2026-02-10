/**
 * Hero Section - Three.js Background
 * Network of animated particles with dynamic connections
 * Clean, tech-oriented visual for frontend developer portfolio
 */

import * as THREE from 'three';

// Create circular texture for particles
function createCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();
  
  return canvas;
}

export function initHeroBackground() {
  // Get container
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  // Scene setup
  const scene = new THREE.Scene();
  scene.background = null;

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 4;

  // Renderer setup
  const canvas = document.createElement('canvas');
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: true,
    precision: 'highp'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);

  // Position canvas as background
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';

  // Insert canvas at the beginning of hero section
  heroSection.insertBefore(canvas, heroSection.firstChild);

  // Ensure content is above canvas
  const container = heroSection.querySelector('.container');
  if (container) {
    container.style.position = 'relative';
    container.style.zIndex = '10';
  }

  // ============================================
  // CREATE ANIMATED PARTICLE NETWORK
  // ============================================

  const particleCount = 80;
  const particles = [];
  const connectionDistance = 2.5;

  // Create particles with positions and velocities
  for (let i = 0; i < particleCount; i++) {
    const particle = {
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.001
      ),
      amplitude: Math.random() * 0.5 + 0.2,
      frequency: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
      time: 0
    };
    particles.push(particle);
  }

  // Create particle geometry and material
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  
  particles.forEach((p, i) => {
    positions[i * 3] = p.position.x;
    positions[i * 3 + 1] = p.position.y;
    positions[i * 3 + 2] = p.position.z;
  });

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Create custom shader material for glowing circles
  const particleShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      circleTexture: { value: new THREE.CanvasTexture(createCircleTexture()) }
    },
    vertexShader: `
      void main() {
        gl_PointSize = 15.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D circleTexture;
      
      void main() {
        vec2 uv = gl_PointCoord;
        vec4 texColor = texture2D(circleTexture, uv);
        
        // Create glow effect
        float dist = distance(uv, vec2(0.5));
        float glow = exp(-dist * dist * 5.0) * 0.5;
        
        gl_FragColor = vec4(0.44, 0.64, 0.80, texColor.a + glow);
      }
    `,
    transparent: true
  });

  const points = new THREE.Points(particleGeometry, particleShaderMaterial);
  // Disabilitato: scene.add(points); // Particelle blu disabilitate, mantenendo solo le linee

  // Create line geometry for connections
  const lineGeometry = new THREE.BufferGeometry();
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x4A7C9E,
    opacity: 0.2,
    transparent: true
  });

  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // Add subtle lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0x2C5F7F, 0.4);
  pointLight.position.set(5, 5, 3);
  scene.add(pointLight);

  // ============================================
  // ANIMATION LOOP
  // ============================================

  let animationId;
  const animate = () => {
    animationId = requestAnimationFrame(animate);

    // Update particles
    particles.forEach((p, i) => {
      p.time += 0.01;

      // Organic motion with sine wave
      const waveOffset = Math.sin(p.time * p.frequency) * p.amplitude;
      
      p.position.x += p.velocity.x;
      p.position.y += p.velocity.y + Math.sin(p.time * 0.002) * 0.0005;
      p.position.z += p.velocity.z;

      // Boundaries wrap
      const bound = 6;
      if (p.position.x > bound) p.position.x = -bound;
      if (p.position.x < -bound) p.position.x = bound;
      if (p.position.y > bound) p.position.y = -bound;
      if (p.position.y < -bound) p.position.y = bound;
      if (p.position.z > 4) p.position.z = -4;
      if (p.position.z < -4) p.position.z = 4;

      // Update particle position
      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;
    });

    particleGeometry.attributes.position.needsUpdate = true;

    // Update connections
    const connections = [];
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dist = particles[i].position.distanceTo(particles[j].position);
        if (dist < connectionDistance) {
          connections.push(
            particles[i].position.x, particles[i].position.y, particles[i].position.z,
            particles[j].position.x, particles[j].position.y, particles[j].position.z
          );
        }
      }
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(connections), 3));

    renderer.render(scene, camera);
  };

  animate();

  // Handle window resize
  const onWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  };

  window.addEventListener('resize', onWindowResize);

  // Cleanup function
  return () => {
    window.removeEventListener('resize', onWindowResize);
    cancelAnimationFrame(animationId);
    renderer.dispose();
    particleGeometry.dispose();
    particleMaterial.dispose();
    lineGeometry.dispose();
    lineMaterial.dispose();
    canvas.remove();
  };
}

