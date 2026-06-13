/* ═══════════════════════════════════════════════
   ZAINAB SHAIKH — PORTFOLIO JS
   ═══════════════════════════════════════════════ */

// ── THEME ──
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeToggle?.addEventListener('click', () => {
  const t = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
});

// ── CUSTOM CURSOR ──
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  if (dot && ring) {
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  }
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a, button, .project-card, .cert-card, .tech-badge').forEach(el => {
  el.addEventListener('mouseenter', () => ring?.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring?.classList.remove('hover'));
});

// ── PROGRESS BAR ──
const progressBar = document.querySelector('.progress-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  if (progressBar) progressBar.style.width = pct + '%';
});

// ── NAV SCROLL ──
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
});

// ── ACTIVE NAV ──
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateActiveNav);

// ── MOBILE NAV ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger?.addEventListener('click', () => mobileNav?.classList.toggle('open'));
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav?.classList.remove('open')));

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
revealEls.forEach(el => revealObs.observe(el));

// ── SKILL BARS ──
const skillsSection = document.getElementById('skills');
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 200);
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
if (skillsSection) skillObs.observe(skillsSection);

// ── TYPEWRITER ──
const phrases = ['Python Developer', 'AI/LLM Engineer', 'FastAPI Builder', 'NLP Researcher', 'Backend Engineer', 'Agent Architect'];
let pi = 0, ci = 0, deleting = false;
const twEl = document.getElementById('typewriter');
function type() {
  if (!twEl) return;
  const phrase = phrases[pi];
  if (!deleting) {
    twEl.textContent = phrase.slice(0, ci + 1); ci++;
    if (ci === phrase.length) { deleting = true; setTimeout(type, 2000); return; }
  } else {
    twEl.textContent = phrase.slice(0, ci - 1); ci--;
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 55 : 85);
}
type();

// ── PARTICLE CANVAS ──
const canvas = document.getElementById('canvas');
const ctx = canvas?.getContext('2d');
if (canvas && ctx) {
  let W, H, particles = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', () => { resize(); particles = []; init(); });

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 5;
      this.size = Math.random() * 1.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = -(Math.random() * 0.6 + 0.15);
      this.opacity = Math.random() * 0.5 + 0.1;
      const r = Math.random();
      this.color = r > 0.65 ? '#00ffb3' : r > 0.35 ? '#38bdf8' : '#c084fc';
    }
    update() {
      this.x += this.speedX; this.y += this.speedY;
      if (this.y < -5 || this.x < -5 || this.x > W + 5) this.reset();
    }
    draw() {
      ctx.save(); ctx.globalAlpha = this.opacity; ctx.fillStyle = this.color;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  function init() { for (let i = 0; i < 140; i++) particles.push(new Particle()); }
  init();
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    particles.forEach((p, i) => {
      particles.slice(i + 1, i + 5).forEach(q => {
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 80) {
          ctx.save(); ctx.globalAlpha = (1 - dist / 80) * 0.07;
          ctx.strokeStyle = p.color; ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          ctx.restore();
        }
      });
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ── PROJECT CARD SPOTLIGHT ──
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});

// ── COUNTER ANIMATION ──
function animateCount(el, target, duration = 1800, decimals = 0) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = (ease * target).toFixed(decimals);
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const val = parseFloat(el.dataset.val);
        animateCount(el, val, 1600, el.dataset.dec || 0);
      });
      statsObs.disconnect();
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObs.observe(heroStats);

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── TILT EFFECT ON TERMINAL ──
document.querySelectorAll('.terminal').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

// ── EASTER EGG (Konami code) ──
let konamiSeq = [];
const konamiCode = [38,38,40,40,37,39,37,39,66,65];
document.addEventListener('keydown', e => {
  konamiSeq.push(e.keyCode);
  if (konamiSeq.length > 10) konamiSeq.shift();
  if (konamiSeq.join(',') === konamiCode.join(',')) {
    document.body.style.animation = 'rainbow 2s infinite';
    const style = document.createElement('style');
    style.textContent = '@keyframes rainbow{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}';
    document.head.appendChild(style);
    setTimeout(() => { document.body.style.animation = ''; }, 4000);
  }
});
