/* UAP ARCHIV — JS */

// ── Starfield ──
(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [], shooting = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function init() {
    stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random(),
      da: (Math.random() * 0.015 + 0.004) * (Math.random() > .5 ? 1 : -1),
    }));
  }

  function spawnShoot() {
    if (shooting.length < 2) shooting.push({
      x: Math.random() * canvas.width * .7,
      y: Math.random() * canvas.height * .35,
      len: Math.random() * 110 + 50,
      speed: Math.random() * 9 + 5,
      a: 1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.da;
      if (s.a >= 1 || s.a <= .08) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      // slight green tint on some stars
      const tint = Math.random() > .97 ? `rgba(57,255,20,${s.a})` : `rgba(180,210,200,${s.a})`;
      ctx.fillStyle = tint;
      ctx.fill();
    });

    shooting = shooting.filter(s => s.a > 0);
    shooting.forEach(s => {
      const tx = s.x - Math.cos(Math.PI / 4) * s.len;
      const ty = s.y - Math.sin(Math.PI / 4) * s.len;
      const g = ctx.createLinearGradient(tx, ty, s.x, s.y);
      g.addColorStop(0, 'rgba(57,255,20,0)');
      g.addColorStop(1, `rgba(57,255,20,${s.a})`);
      ctx.beginPath();
      ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
      s.x += s.speed; s.y += s.speed; s.a -= 0.018;
    });
    requestAnimationFrame(draw);
  }

  resize(); init(); draw();
  setInterval(spawnShoot, 5000);
  window.addEventListener('resize', () => { resize(); init(); });
})();


// ── Sidebar toggle ──
const sidebar  = document.getElementById('sidebar');
const menuBtn  = document.getElementById('menuToggle');
const closeBtn = document.getElementById('sidebarClose');

menuBtn?.addEventListener('click', () => sidebar.classList.toggle('open'));
closeBtn?.addEventListener('click', () => sidebar.classList.remove('open'));
document.querySelectorAll('.nav-item').forEach(l =>
  l.addEventListener('click', () => sidebar.classList.remove('open'))
);


// ── Active nav on scroll ──
const secs = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${cur}`);
  });
}, { passive: true });


// ── Counter animation ──
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const start = performance.now();
    const dur = 2000;
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const v = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      el.textContent = v.toLocaleString('de-DE');
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('de-DE');
    };
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  });
}, { threshold: .5 });

document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));


// ── Scroll reveal ──
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    e.target.style.transitionDelay = `${i * 0.07}s`;
    e.target.classList.add('visible');
    revealObs.unobserve(e.target);
  });
}, { threshold: .1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


// ── Progress bars animate on scroll ──
const progObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.fill').forEach(f => {
      const w = f.style.width; f.style.width = '0';
      setTimeout(() => { f.style.width = w; }, 100);
    });
    progObs.unobserve(e.target);
  });
}, { threshold: .3 });

const term = document.querySelector('.terminal');
if (term) progObs.observe(term);


// ── Ticker duplicate for seamless loop ──
const ticker = document.querySelector('.ticker-inner');
if (ticker) ticker.innerHTML += ticker.innerHTML;
