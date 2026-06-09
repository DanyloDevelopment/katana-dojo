// ─── SMOOTH SCROLL (Lenis) ────────────────────────────
const lenis = new Lenis({
  duration: 1.4,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ─── NOISE OVERLAY ────────────────────────────────────
(function createNoise() {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  canvas.style.cssText = `
    position:fixed;inset:0;width:100%;height:100%;
    pointer-events:none;z-index:9997;opacity:0.04;
    mix-blend-mode:overlay;
  `;
  const ctx = canvas.getContext('2d');
  function drawNoise() {
    const img = ctx.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      img.data[i] = img.data[i+1] = img.data[i+2] = v;
      img.data[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }
  drawNoise();
  setInterval(drawNoise, 80);
  document.body.appendChild(canvas);
})();

// ─── CURSOR ───────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ─── MAGNETIC BUTTONS ─────────────────────────────────
document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  });
  btn.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
    follower.style.transform = 'translate(-50%, -50%) scale(0.3)';
  });
  btn.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

document.querySelectorAll('a:not(.btn-primary):not(.btn-outline), .program-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// ─── 3D CARD TILT ─────────────────────────────────────
document.querySelectorAll('.program-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 14,
      rotateX: -y * 14,
      transformPerspective: 800,
      ease: 'power1.out',
      duration: 0.4,
    });
    gsap.to(card.querySelector('.program-kanji'), {
      x: x * 20,
      y: y * 20,
      duration: 0.4,
      ease: 'power1.out',
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    gsap.to(card.querySelector('.program-kanji'), { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
  });
});

// ─── SPLIT TEXT (буквы) ───────────────────────────────
function splitIntoChars(selector) {
  document.querySelectorAll(selector).forEach(el => {
    const text = el.textContent;
    el.innerHTML = text.split('').map((ch, i) =>
      ch === ' '
        ? '<span style="display:inline-block;width:0.3em"> </span>'
        : `<span class="char" style="display:inline-block;opacity:0;transform:translateY(60px) rotate(${(Math.random()-0.5)*8}deg);transition-delay:${i*0.03}s">${ch}</span>`
    ).join('');
  });
}
splitIntoChars('.section-title');

// ─── LOADER SEQUENCE ──────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline();
tl.to('#loader-kanji-text', {
  y: 0, duration: 1, ease: 'power3.out',
  onStart: () => {
    document.querySelector('.loader-kanji span').style.transform = 'translateY(0)';
  }
})
.to('#loader-line', { width: '200px', duration: 0.7, ease: 'power2.inOut' }, '+=0.2')
.to('#loader-sub', { opacity: 1, duration: 0.5 }, '-=0.2')
.to('#loader', { opacity: 0, duration: 0.8, delay: 0.6, ease: 'power2.in' })
.set('#loader', { display: 'none' })
.from('#slash-left', { scaleX: 1, duration: 0 }, 0)
.from('#slash-right', { scaleX: 1, duration: 0 }, 0)
.to('#slash-left', { scaleX: 0, duration: 1, ease: 'power3.inOut' })
.to('#slash-right', { scaleX: 0, duration: 1, ease: 'power3.inOut' }, '<')
.set('#slash-left, #slash-right', { display: 'none' })
.to('#hero-eyebrow', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4')
.to('.hero-title .line span', { y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 }, '-=0.4')
.to(['#hero-desc', '#hero-cta', '#hero-scroll'], {
  opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12
}, '-=0.5');

// ─── SCROLL REVEALS ───────────────────────────────────
document.querySelectorAll('.reveal').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 60 },
    {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    }
  );
});

// Буквы появляются при скролле
document.querySelectorAll('.section-title').forEach(el => {
  const chars = el.querySelectorAll('.char');
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    onEnter: () => {
      chars.forEach((ch, i) => {
        setTimeout(() => {
          ch.style.opacity = '1';
          ch.style.transform = 'translateY(0) rotate(0deg)';
          ch.style.transition = 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)';
        }, i * 35);
      });
    }
  });
});

// ─── HORIZONTAL MARQUEE (бегущая строка) ──────────────
(function createMarquee() {
  const div = document.createElement('div');
  div.style.cssText = `
    overflow:hidden;white-space:nowrap;padding:24px 0;
    border-top:1px solid rgba(255,255,255,0.05);
    border-bottom:1px solid rgba(255,255,255,0.05);
    background:var(--dark);
  `;
  const text = '極真空手 · KYOKUSHIN · 鍛錬 · KATANA DOJO · 不屈 · SENSEI NOVYKOV · 極真空手 · KYOKUSHIN · 鍛錬 · KATANA DOJO · 不屈 · SENSEI NOVYKOV · ';
  const inner = document.createElement('div');
  inner.style.cssText = `
    display:inline-block;
    font-family:'Noto Serif JP',serif;
    font-size:13px;letter-spacing:0.3em;
    color:rgba(240,237,232,0.2);
    text-transform:uppercase;
    animation:marquee 30s linear infinite;
  `;
  inner.textContent = text + text;
  div.appendChild(inner);

  const style = document.createElement('style');
  style.textContent = `@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }`;
  document.head.appendChild(style);

  const schedule = document.getElementById('schedule');
  schedule.parentNode.insertBefore(div, schedule);
})();

// ─── STAT COUNTERS ────────────────────────────────────
document.querySelectorAll('.stat-num').forEach(el => {
  const target = parseInt(el.textContent);
  if (isNaN(target)) return;
  const suffix = el.textContent.replace(/[0-9]/g, '');
  gsap.fromTo({ val: 0 }, { val: 0 }, {
    val: target, duration: 2.5, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 80%' },
    onUpdate: function () {
      el.textContent = Math.round(this.targets()[0].val) + suffix;
    }
  });
});

// ─── PROGRAM CARDS STAGGER ────────────────────────────
gsap.fromTo('.program-card',
  { opacity: 0, y: 80, rotateX: 15 },
  {
    opacity: 1, y: 0, rotateX: 0,
    duration: 0.9, ease: 'power3.out', stagger: 0.15,
    scrollTrigger: { trigger: '.programs-grid', start: 'top 80%' }
  }
);

// ─── PARALLAX SECTIONS ────────────────────────────────
gsap.to('.hero-bg', {
  yPercent: 30,
  ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});

gsap.to('.hero-number', {
  yPercent: 60,
  ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});

// ─── HERO MOUSE PARALLAX ──────────────────────────────
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 22;
  const y = (e.clientY / window.innerHeight - 0.5) * 22;
  gsap.to('.hero-number', { x, y, duration: 1.4, ease: 'power1.out' });
  gsap.to('.hero-grid-lines', { x: x * 0.3, y: y * 0.3, duration: 1.8, ease: 'power1.out' });
});

// ─── SCHEDULE ROWS ────────────────────────────────────
gsap.fromTo('.schedule-table tbody tr',
  { opacity: 0, x: -30 },
  {
    opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', stagger: 0.07,
    scrollTrigger: { trigger: '.schedule-table', start: 'top 85%' }
  }
);

// ─── CONTACT SECTION ──────────────────────────────────
gsap.fromTo('.contact-item',
  { opacity: 0, x: -20 },
  {
    opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1,
    scrollTrigger: { trigger: '.contact-info', start: 'top 85%' }
  }
);

// ─── FORM SUBMIT ──────────────────────────────────────
function handleSubmit() {
  const fname = document.getElementById('fname').value.trim();
  const lname = document.getElementById('lname').value.trim();
  const email = document.getElementById('email').value.trim();
  const program = document.getElementById('program').value;
  const status = document.getElementById('form-status');

  if (!fname || !lname || !email || !program) {
    status.textContent = 'Bitte fülle alle Pflichtfelder aus.';
    status.className = 'error';
    gsap.fromTo(status, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' });
    return;
  }

  const btn = document.querySelector('.form-submit .btn-primary');
  gsap.to(btn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
  status.textContent = '✓ Anmeldung gesendet! Der Sensei wird sich bald bei dir melden.';
  status.className = 'success';
}
