/* ================================================
   UAP ARCHIV - Main JavaScript
   ================================================ */

// ─── Starfield Canvas ───
(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let shootingStars = [];
  let animFrameId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initStars(count = 200) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.2,
        alpha: Math.random(),
        speed: Math.random() * 0.3 + 0.05,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
      });
    }
  }

  function spawnShootingStar() {
    if (shootingStars.length < 3) {
      shootingStars.push({
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.4,
        len: Math.random() * 120 + 60,
        speed: Math.random() * 8 + 6,
        alpha: 1,
        angle: Math.PI / 4 + (Math.random() * 0.3 - 0.15),
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars
    stars.forEach(s => {
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha >= 1) { s.alpha = 1; s.twinkleDir = -1; }
      if (s.alpha <= 0.1) { s.alpha = 0.1; s.twinkleDir = 1; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 220, 255, ${s.alpha})`;
      ctx.fill();
    });

    // Shooting stars
    shootingStars = shootingStars.filter(ss => ss.alpha > 0);
    shootingStars.forEach(ss => {
      const tailX = ss.x - Math.cos(ss.angle) * ss.len;
      const tailY = ss.y - Math.sin(ss.angle) * ss.len;

      const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, `rgba(0, 212, 255, 0)`);
      grad.addColorStop(1, `rgba(0, 212, 255, ${ss.alpha})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.stroke();

      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha -= 0.015;
    });

    animFrameId = requestAnimationFrame(draw);
  }

  resize();
  initStars();
  draw();

  setInterval(spawnShootingStar, 4000);
  window.addEventListener('resize', () => { resize(); initStars(); });
})();


// ─── Navbar scroll effect ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50
    ? 'rgba(4, 8, 16, 0.97)'
    : 'rgba(4, 8, 16, 0.85)';
});

// ─── Mobile nav toggle ───
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}


// ─── Animated counters ───
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('de-DE');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString('de-DE');
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));


// ─── Scroll Reveal ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${i * 0.08}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.about-card, .case-card, .timeline-item, .info-box, .counter-box'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});


// ─── Progress bars animate on scroll ───
const progObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.prog-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = w; }, 100);
      });
      progObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const evidencePanel = document.querySelector('.evidence-panel');
if (evidencePanel) progObserver.observe(evidencePanel);


// ─── Report Form ───
const reportForm = document.getElementById('reportForm');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
let toastTimer;

function showToast(msg, color = '#00ff88') {
  clearTimeout(toastTimer);
  toast.style.borderColor = color;
  toast.style.color = color;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

if (reportForm) {
  reportForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();
    const date = document.getElementById('date').value;

    if (!location || !description || !date) {
      showToast('Bitte Ort, Datum und Beschreibung ausfüllen.', '#ff3355');
      return;
    }

    const btn = reportForm.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span>&#9654;</span> Wird übermittelt...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = orig;
      reportForm.reset();
      showToast('Bericht erfolgreich übermittelt! Vielen Dank.');

      const counter = document.querySelector('.counter-num');
      if (counter) {
        const cur = parseInt(counter.textContent, 10);
        counter.textContent = cur + 1;
        counter.style.animation = 'none';
        counter.offsetHeight;
        counter.style.animation = '';
      }
    }, 1800);
  });
}


// ─── Glitch effect on logo ───
const logo = document.querySelector('.nav-logo');
if (logo) {
  setInterval(() => {
    logo.style.textShadow = '2px 0 #ff3355, -2px 0 #00d4ff';
    setTimeout(() => { logo.style.textShadow = ''; }, 80);
  }, 6000);
}


// ─── Active nav link on scroll ───
const sections = document.querySelectorAll('section[id]');
const navAnchorLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navAnchorLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
}, { passive: true });


// ─── Ticker duplication for seamless loop ───
(function () {
  const ticker = document.querySelector('.ticker');
  if (!ticker) return;
  ticker.innerHTML += ticker.innerHTML;
})();
