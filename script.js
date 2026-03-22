/* ════════════════════════════════════════════════════════════════
   DREAM CODERS — INTERACTIVE SCRIPT
   Animations, interactivity, and enhanced UX
   ════════════════════════════════════════════════════════════════ */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. MOBILE NAV TOGGLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isOpen);
    navLinks.classList.toggle('is-open');
  });

  // Close menu when a link is clicked
  const navAnchors = navLinks.querySelectorAll('a');
  navAnchors.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. NAVBAR SCROLL STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('is-scrolled');
  } else {
    navbar.classList.remove('is-scrolled');
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all .reveal elements
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. COUNTER ANIMATIONS (Hero stats)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    const duration = 2000; // 2 seconds
    const start = Date.now();
    
    const updateCounter = () => {
      const now = Date.now();
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(target * progress);
      counter.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    // Start animation when counter is visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && parseInt(counter.textContent, 10) === 0) {
        updateCounter();
        observer.unobserve(counter);
      }
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

document.addEventListener('DOMContentLoaded', animateCounters);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. PARTICLE CANVAS ANIMATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  
  // Resize canvas
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.radius = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.3;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    
    draw() {
      ctx.fillStyle = `rgba(124, 58, 237, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Initialize particles
  function initializeParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 8000);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  initializeParticles();
  
  // Connection function
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.1 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    drawConnections();
    animationId = requestAnimationFrame(animate);
  }
  animate();
  
  // Handle visibility change (pause when tab is hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

document.addEventListener('DOMContentLoaded', initParticles);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. LIVE WALLPAPER (Antigravity cursor interaction)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initLiveWallpaper() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'liveBgCanvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
    active: false
  };

  let stars = [];
  let sparks = [];
  let animationId;
  let currentTime = 0;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const STAR_COUNT = isMobile ? 56 : 120;
  const MAX_SPARKS = isMobile ? 18 : 44;
  const WAVE_LAYERS = [
    { base: 0.24, amp: 26, len: 0.0095, speed: 0.72, drift: 0.018, alpha: 0.12 },
    { base: 0.34, amp: 30, len: 0.0078, speed: 0.56, drift: 0.028, alpha: 0.1 },
    { base: 0.46, amp: 22, len: 0.0115, speed: 0.84, drift: 0.024, alpha: 0.085 }
  ];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars = Array.from({ length: STAR_COUNT }, () => {
      const x = random(0, window.innerWidth);
      const y = random(0, window.innerHeight);
      return {
        x,
        y,
        homeX: x,
        homeY: y,
        vx: random(-0.25, 0.25),
        vy: random(-0.25, 0.25),
        radius: random(0.8, 2.2),
        hue: random(190, 315),
        depth: random(0.3, 1.25)
      };
    });
  }

  function addSpark(x, y) {
    if (sparks.length >= MAX_SPARKS) {
      sparks.splice(0, sparks.length - MAX_SPARKS + 1);
    }

    sparks.push({
      x,
      y,
      vx: random(-0.9, 0.9),
      vy: random(-0.9, 0.9),
      life: 1,
      radius: random(1, 2.8),
      hue: random(195, 260)
    });
  }

  function drawBackdrop() {
    const gradient = ctx.createRadialGradient(
      pointer.x,
      pointer.y,
      60,
      pointer.x,
      pointer.y,
      Math.max(window.innerWidth, window.innerHeight) * 0.75
    );
    gradient.addColorStop(0, 'rgba(90, 170, 255, 0.24)');
    gradient.addColorStop(0.4, 'rgba(140, 66, 255, 0.14)');
    gradient.addColorStop(1, 'rgba(9, 9, 14, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

  function drawWaveLayer(cfg, index) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const baseY = h * cfg.base;
    const pointerLift = (pointer.y / h - 0.5) * (16 * cfg.drift);
    const phase = currentTime * cfg.speed + index * 1.7;

    const grad = ctx.createLinearGradient(0, baseY - 80, w, baseY + 120);
    grad.addColorStop(0, `rgba(56, 160, 255, ${cfg.alpha})`);
    grad.addColorStop(0.5, `rgba(160, 70, 255, ${cfg.alpha * 1.15})`);
    grad.addColorStop(1, `rgba(255, 88, 202, ${cfg.alpha})`);

    ctx.beginPath();
    ctx.moveTo(-40, h + 40);

    for (let x = -40; x <= w + 40; x += 14) {
      const parallax = ((pointer.x / w) - 0.5) * (28 * cfg.drift);
      const y = baseY
        + Math.sin(x * cfg.len + phase) * cfg.amp
        + Math.cos(x * cfg.len * 0.45 + phase * 1.15) * (cfg.amp * 0.38)
        + pointerLift
        + parallax;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(w + 40, h + 40);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function drawNeonWaves() {
    for (let i = 0; i < WAVE_LAYERS.length; i++) {
      drawWaveLayer(WAVE_LAYERS[i], i);
    }
  }

  function updateStars() {
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Gentle spring keeps particles orbiting around their initial positions.
      const springX = (s.homeX - s.x) * 0.0038;
      const springY = (s.homeY - s.y) * 0.0038;

      const dx = s.x - pointer.x;
      const dy = s.y - pointer.y;
      const distSq = dx * dx + dy * dy + 0.001;
      const dist = Math.sqrt(distSq);

      // Cursor antigravity repulsion.
      let repelX = 0;
      let repelY = 0;
      if (pointer.active && dist < 220) {
        const force = (1 - dist / 220) * 1.4;
        repelX = (dx / dist) * force;
        repelY = (dy / dist) * force;
      }

      // Adds a mild horizontal flow to keep the scene alive.
      const flowX = Math.sin((s.y + currentTime * 35) * 0.004) * 0.018;
      const flowY = Math.cos((s.x - currentTime * 24) * 0.003) * 0.018;

      const parallaxX = (pointer.x - window.innerWidth * 0.5) * 0.00035 * s.depth;
      const parallaxY = (pointer.y - window.innerHeight * 0.5) * 0.00035 * s.depth;

      s.vx += springX + repelX + flowX + parallaxX;
      s.vy += springY + repelY + flowY + parallaxY;
      s.vx *= 0.95;
      s.vy *= 0.95;
      s.x += s.vx;
      s.y += s.vy;

      if (s.x < -40) s.x = window.innerWidth + 40;
      if (s.x > window.innerWidth + 40) s.x = -40;
      if (s.y < -40) s.y = window.innerHeight + 40;
      if (s.y > window.innerHeight + 40) s.y = -40;

      const glow = pointer.active ? 0.9 : 0.62;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${s.hue}, 92%, 70%, ${glow * Math.min(s.depth, 1)})`;
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawLinks() {
    const maxDist = 108;
    for (let i = 0; i < stars.length; i++) {
      const a = stars[i];
      for (let j = i + 1; j < stars.length; j++) {
        const b = stars[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.11;
          ctx.strokeStyle = `rgba(146, 132, 255, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  function updateSparks() {
    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.life -= 0.024;

      if (p.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 96%, 68%, ${p.life * 0.45})`;
      ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animate(now = 0) {
    currentTime = now * 0.001;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawNeonWaves();
    drawBackdrop();
    updateStars();
    drawLinks();
    updateSparks();
    animationId = requestAnimationFrame(animate);
  }

  function handleMove(event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    addSpark(pointer.x, pointer.y);
  }

  function handleTouch(event) {
    const touch = event.touches[0];
    if (!touch) return;
    pointer.x = touch.clientX;
    pointer.y = touch.clientY;
    pointer.active = true;
    addSpark(pointer.x, pointer.y);
  }

  function handleLeave() {
    pointer.active = false;
  }

  resizeCanvas();
  animate();

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', handleMove, { passive: true });
  window.addEventListener('touchmove', handleTouch, { passive: true });
  window.addEventListener('touchstart', handleTouch, { passive: true });
  window.addEventListener('mouseleave', handleLeave);

  window.addEventListener('click', (event) => {
    for (let i = 0; i < 10; i++) {
      addSpark(event.clientX, event.clientY);
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
      return;
    }
    animate();
  });
}

document.addEventListener('DOMContentLoaded', initLiveWallpaper);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. INTERACTIVE CURSOR (Glowing orb + smooth trail)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initInteractiveCursor() {
  // Fallback to native cursor on touch-like devices and reduced-motion setups.
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Core cursor element with layered fill + outline via CSS pseudo-elements.
  const orb = document.createElement('div');
  orb.className = 'cursor-orb is-hidden';
  orb.setAttribute('aria-hidden', 'true');

  // Trail container holds fading points that follow the cursor with lag.
  const trailWrap = document.createElement('div');
  trailWrap.className = 'cursor-trail-wrap';
  trailWrap.setAttribute('aria-hidden', 'true');

  // Ripple layer draws click pulses and keeps effects isolated from page layout.
  const rippleLayer = document.createElement('div');
  rippleLayer.className = 'cursor-ripple-layer';
  rippleLayer.setAttribute('aria-hidden', 'true');

  const trailPoints = [];
  const trailCount = 14;

  for (let i = 0; i < trailCount; i++) {
    const dot = document.createElement('span');
    dot.className = 'cursor-trail-dot';
    trailWrap.appendChild(dot);
    trailPoints.push({
      el: dot,
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5
    });
  }

  document.body.appendChild(rippleLayer);
  document.body.appendChild(trailWrap);
  document.body.appendChild(orb);
  document.body.classList.add('has-custom-cursor');

  const pointer = {
    targetX: window.innerWidth * 0.5,
    targetY: window.innerHeight * 0.5,
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
    overInteractive: false,
    isPressed: false
  };

  function isInteractiveTarget(target) {
    if (!target || !(target instanceof Element)) return false;
    return Boolean(target.closest('a, button, input, textarea, select, label, .btn, [role="button"]'));
  }

  // Create a short-lived ripple on click for tactile feedback.
  function spawnRipple(x, y) {
    const ripple = document.createElement('span');
    ripple.className = 'cursor-ripple';
    ripple.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    rippleLayer.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }

  function onMove(event) {
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
    pointer.overInteractive = isInteractiveTarget(event.target);
    orb.classList.remove('is-hidden');
  }

  function onLeave() {
    orb.classList.add('is-hidden');
  }

  function onDown() {
    pointer.isPressed = true;
    spawnRipple(pointer.targetX, pointer.targetY);
  }

  function onUp() {
    pointer.isPressed = false;
  }

  // Animation loop is transform/opacity only to keep frame cost low.
  function animate() {
    pointer.x += (pointer.targetX - pointer.x) * 0.26;
    pointer.y += (pointer.targetY - pointer.y) * 0.26;

    orb.classList.toggle('is-hover', pointer.overInteractive);
    const scaleBase = pointer.overInteractive ? 1.45 : 1;
    const scale = pointer.isPressed ? scaleBase * 0.86 : scaleBase;
    orb.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) scale(${scale})`;

    let followX = pointer.x;
    let followY = pointer.y;
    for (let i = 0; i < trailPoints.length; i++) {
      const p = trailPoints[i];
      const smoothing = Math.max(0.08, 0.22 - i * 0.011);
      p.x += (followX - p.x) * smoothing;
      p.y += (followY - p.y) * smoothing;

      const scale = 1 - i / trailPoints.length;
      const opacity = (1 - i / trailPoints.length) * 0.36;
      p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) scale(${scale})`;
      p.el.style.opacity = `${opacity}`;

      followX = p.x;
      followY = p.y;
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mouseleave', onLeave);
  window.addEventListener('mousedown', onDown);
  window.addEventListener('mouseup', onUp);
  window.addEventListener('blur', onUp);

  animate();
}

document.addEventListener('DOMContentLoaded', initInteractiveCursor);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. ACTIVE NAV LINK TRACKING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function updateActiveLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('is-active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('is-active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. FORM SUBMISSION (Google Sheets Integration)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

// ⚠️ IMPORTANT: Set your Google Apps Script URL below
// See FORM_SETUP.md for detailed setup instructions
// Spreadsheet columns: A=timestamp, B=name, C=email, D=type, E=message, F=source
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby45U6Dwzs0-xYu9Ky1ebZh1Cf0GWOOZ4iUrUfszEiTZ1JCJLsB60UimdNEjC4sJNAi/exec';
const GOOGLE_SHEET_NAME = 'Sheet1';

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
      timestamp: new Date().toISOString(),
      name: formData.get('name'),
      email: formData.get('email'),
      type: formData.get('type') || 'other',
      message: formData.get('message'),
      source: 'Dream Coders Website',
      sheetName: GOOGLE_SHEET_NAME
    };
    
    // Validate
    if (!data.name || !data.email || !data.message) {
      showNotification('Please fill out all required fields.', 'error');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
      // Send to Google Sheets via Google Apps Script
      // URL is configured and ready to use
      
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
      });
      
      // Note: no-cors mode doesn't allow checking response status
      // We assume success if no network error occurs
      
      // Success
      showNotification('✅ Message sent! We\'ll get back to you soon. 🚀', 'success');
      console.log('Form data submitted:', data);
      contactForm.reset();
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Check if it's a setup error
      if (error.message.includes('not configured')) {
        showNotification(error.message, 'error');
      } else {
        showNotification('⚠️ Error submitting form. Please check FORM_SETUP.md and try again.', 'error');
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. NOTIFICATION SYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add styles
  const style = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
    color: white;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 0.88rem;
    font-weight: 500;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    z-index: 9999;
    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  
  notification.setAttribute('style', style);
  document.body.appendChild(notification);
  
  // Add animation
  const style_tag = document.createElement('style');
  style_tag.innerHTML = `
    @keyframes slideIn {
      from { 
        opacity: 0; 
        transform: translateX(32px);
      }
      to { 
        opacity: 1; 
        transform: translateX(0);
      }
    }
    @keyframes slideOut {
      from { 
        opacity: 1; 
        transform: translateX(0);
      }
      to { 
        opacity: 0; 
        transform: translateX(32px);
      }
    }
  `;
  if (!document.querySelector('style[data-notification="true"]')) {
    style_tag.setAttribute('data-notification', 'true');
    document.head.appendChild(style_tag);
  }
  
  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9. SMOOTH SCROLL OFFSET FOR FIXED HEADER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Skip if it's just "#" or the hamburger menu toggle
    if (href === '#' || this.classList.contains('hamburger')) return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 90;
      const targetPosition = target.offsetTop - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 10. LAZY LOAD IMAGES (If added later)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

document.addEventListener('DOMContentLoaded', initLazyLoading);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 11. PREFETCH LINKS (Performance optimization)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initPrefetching() {
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('mouseenter', () => {
      const link_tag = document.createElement('link');
      link_tag.rel = 'prefetch';
      link_tag.href = link.href;
      document.head.appendChild(link_tag);
    }, { once: true });
  });
}

document.addEventListener('DOMContentLoaded', initPrefetching);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 12. KEYBOARD NAVIGATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('keydown', (e) => {
  // Close mobile menu with Escape
  if (e.key === 'Escape') {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (navLinks && navLinks.classList.contains('is-open')) {
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
    }
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 13. INITIALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log('🚀 Dream Coders website loaded successfully!');
console.log('👋 Welcome to the community!');
