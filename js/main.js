// ─── NOISE OVERLAY ────────────────────────────────────
(function () {
  const canvas = document.createElement('canvas');
  canvas.width = 200; canvas.height = 200;
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '9997', opacity: '0.035',
    mixBlendMode: 'overlay'
  });
  const ctx = canvas.getContext('2d');
  let last = 0;
  function draw(ts) {
    requestAnimationFrame(draw);
    if (ts - last < 150) return; // ~6fps — достаточно для шума, не грузит поток
    last = ts;
    const img = ctx.createImageData(200, 200);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      img.data[i] = img.data[i+1] = img.data[i+2] = v;
      img.data[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }
  requestAnimationFrame(draw);
  document.body.appendChild(canvas);
})();

// ─── GSAP SETUP ───────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─── CURSOR ───────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mX = 0, mY = 0, fX = 0, fY = 0;

document.addEventListener('mousemove', e => {
  mX = e.clientX; mY = e.clientY;
  gsap.to(cursor, { left: mX, top: mY, duration: 0 });
});

(function loop() {
  fX += (mX - fX) * 0.1;
  fY += (mY - fY) * 0.1;
  gsap.set(follower, { left: fX, top: fY });
  requestAnimationFrame(loop);
})();

document.querySelectorAll('a, button, .program-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursor, { scale: 2.5, duration: 0.3 });
    gsap.to(follower, { scale: 0.4, opacity: 0.5, duration: 0.3 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursor, { scale: 1, duration: 0.3 });
    gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3 });
  });
});

// ─── MAGNETIC BUTTONS ─────────────────────────────────
document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.3;
    const y = (e.clientY - r.top - r.height / 2) * 0.3;
    gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
  });
});

// ─── 3D CARD TILT ─────────────────────────────────────
document.querySelectorAll('.program-card').forEach(card => {
  const kanji = card.querySelector('.program-kanji');
  card.style.transformStyle = 'preserve-3d';
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, { rotateY: x * 12, rotateX: -y * 12, duration: 0.4, ease: 'power2.out', transformPerspective: 600 });
    gsap.to(kanji, { x: x * 18, y: y * 18, duration: 0.4, ease: 'power2.out' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    gsap.to(kanji, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
  });
});

// ─── SPLIT TEXT ───────────────────────────────────────
document.querySelectorAll('.section-title').forEach(el => {
  const html = el.innerHTML;
  el.innerHTML = html.replace(/(\S)/g, '<span class="ch" style="display:inline-block">$1</span>');
  gsap.set(el.querySelectorAll('.ch'), { opacity: 0, y: 50, rotation: () => (Math.random()-0.5)*10 });
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    onEnter: () => gsap.to(el.querySelectorAll('.ch'), {
      opacity: 1, y: 0, rotation: 0,
      duration: 0.6, ease: 'back.out(1.5)', stagger: 0.03
    })
  });
});

// ─── LOADER ───────────────────────────────────────────
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
tl
  .set('.loader-kanji span', { y: '100%' })
  .to('.loader-kanji span', { y: '0%', duration: 0.9 })
  .to('#loader-line', { width: 200, duration: 0.6, ease: 'power2.inOut' }, '+=0.1')
  .to('#loader-sub', { opacity: 1, duration: 0.5 }, '-=0.2')
  .to('#loader', { opacity: 0, duration: 0.7, delay: 0.5 })
  .set('#loader', { display: 'none' })
  .to(['#slash-left','#slash-right'], { scaleX: 0, duration: 0.9, ease: 'power3.inOut', stagger: 0 })
  .set(['#slash-left','#slash-right'], { display: 'none' })
  .to('#hero-eyebrow', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
  .to('.hero-title .line span', { y: 0, duration: 0.9, stagger: 0.1 }, '-=0.4')
  .to(['#hero-desc', '#hero-cta', '#hero-scroll'], { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.4');

// ─── SCROLL REVEALS ───────────────────────────────────
gsap.utils.toArray('.reveal').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' } }
  );
});

// ─── PARALLAX ─────────────────────────────────────────
gsap.to('.hero-number', {
  yPercent: 50, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});
gsap.to('.hero-bg', {
  yPercent: 25, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});

// Hero mouse parallax
document.addEventListener('mousemove', e => {
  const x = (e.clientX / innerWidth - 0.5) * 20;
  const y = (e.clientY / innerHeight - 0.5) * 20;
  gsap.to('.hero-number', { x, y, duration: 1.5, ease: 'power1.out', overwrite: 'auto' });
  gsap.to('.hero-grid-lines', { x: x * 0.25, y: y * 0.25, duration: 2, ease: 'power1.out' });
});

// ─── PROGRAM CARDS ────────────────────────────────────
gsap.fromTo('.program-card',
  { opacity: 0, y: 70 },
  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
    scrollTrigger: { trigger: '.programs-grid', start: 'top 80%' } }
);

// ─── STAT COUNTERS ────────────────────────────────────
gsap.utils.toArray('.stat-num').forEach(el => {
  const end = parseInt(el.textContent);
  if (isNaN(end)) return;
  const suffix = el.textContent.replace(/\d/g, '');
  gsap.fromTo({ n: 0 }, { n: 0 }, {
    n: end, duration: 2, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 82%' },
    onUpdate() { el.textContent = Math.round(this.targets()[0].n) + suffix; }
  });
});

// ─── MARQUEE ──────────────────────────────────────────
(function () {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'overflow:hidden;padding:20px 0;border-top:1px solid rgba(255,255,255,0.05);border-bottom:1px solid rgba(255,255,255,0.05);background:var(--dark)';
  const txt = '極真空手 · KYOKUSHIN · 鍛錬 · KATANA DOJO · 不屈 · SENSEI NOVYKOV · ';
  const inner = document.createElement('div');
  inner.style.cssText = 'display:inline-block;white-space:nowrap;will-change:transform';
  inner.style.fontFamily = "'Noto Serif JP', serif";
  inner.style.fontSize = '12px';
  inner.style.letterSpacing = '0.35em';
  inner.style.color = 'rgba(240,237,232,0.18)';
  inner.textContent = txt.repeat(6);
  wrap.appendChild(inner);
  document.getElementById('schedule').before(wrap);
  gsap.to(inner, { x: () => -(inner.offsetWidth / 2), duration: 25, ease: 'none', repeat: -1 });
})();

// ─── TABLE ROWS ───────────────────────────────────────
gsap.fromTo('.schedule-table tbody tr',
  { opacity: 0, x: -24 },
  { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', stagger: 0.06,
    scrollTrigger: { trigger: '.schedule-table', start: 'top 85%' } }
);

// ─── CONTACT ITEMS ────────────────────────────────────
gsap.fromTo('.contact-item',
  { opacity: 0, x: -20 },
  { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', stagger: 0.08,
    scrollTrigger: { trigger: '.contact-info', start: 'top 85%' } }
);

// ─── FORM ─────────────────────────────────────────────
function handleSubmit() {
  const v = id => document.getElementById(id).value.trim();
  const status = document.getElementById('form-status');
  if (!v('fname') || !v('lname') || !v('email') || !v('program')) {
    status.textContent = 'Bitte fülle alle Pflichtfelder aus.';
    status.className = 'error';
    gsap.fromTo(status, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' });
    return;
  }
  gsap.to('.form-submit .btn-primary', { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
  status.textContent = '✓ Anmeldung gesendet! Der Sensei wird sich bald bei dir melden.';
  status.className = 'success';
}
/* ──────────────────────────────────────────────────────
   ВАЖНО: вставь сюда свой Formspree form ID.
   1. Зарегистрируйся на https://formspree.io (бесплатно)
   2. Создай новую форму (New Form), укажи свою почту
   3. Скопируй ID из адреса вида https://formspree.io/f/XXXXXXX
   4. Подставь его вместо "YOUR_FORM_ID" ниже
   5. После первой реальной отправки с сайта Formspree пришлёт
      тебе письмо с подтверждением — нужно будет его подтвердить,
      иначе заявки не будут приходить.
────────────────────────────────────────────────────── */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

document.addEventListener("DOMContentLoaded", () => {

  /* ─── HAMBURGER MENU ─────────────────────────────── */
  const burger = document.getElementById("nav-burger");
  const navLinks = document.getElementById("nav-links");

  if (burger && navLinks) {
    const closeMenu = () => {
      burger.classList.remove("is-open");
      navLinks.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    };

    const toggleMenu = () => {
      const isOpen = navLinks.classList.toggle("is-open");
      burger.classList.toggle("is-open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    };

    burger.addEventListener("click", toggleMenu);

    // Close menu when a link is tapped
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ─── CONTACT FORM ───────────────────────────────── */
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("form-submit-btn");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID")) {
        statusEl.textContent = "Formular ist noch nicht eingerichtet (Formspree-ID fehlt).";
        statusEl.className = "error";
        return;
      }

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Wird gesendet...";
      statusEl.className = "";
      statusEl.textContent = "";

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });

        if (response.ok) {
          statusEl.textContent = "Danke! Deine Anmeldung wurde gesendet.";
          statusEl.className = "success";
          form.reset();
        } else {
          const data = await response.json().catch(() => null);
          const msg =
            data && data.errors
              ? data.errors.map((err) => err.message).join(", ")
              : "Es gab ein Problem beim Senden. Bitte versuche es erneut.";
          statusEl.textContent = msg;
          statusEl.className = "error";
        }
      } catch (err) {
        statusEl.textContent = "Verbindungsfehler. Bitte versuche es später erneut.";
        statusEl.className = "error";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
});