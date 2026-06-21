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
followerX += (mouseX - followerX) * 0.12;
followerY += (mouseY - followerY) * 0.12;
follower.style.left = followerX + 'px';
follower.style.top = followerY + 'px';
requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .program-card').forEach(el => {
el.addEventListener('mouseenter', () => {
cursor.style.transform = 'translate(-50%, -50%) scale(2)';
follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
});
el.addEventListener('mouseleave', () => {
cursor.style.transform = 'translate(-50%, -50%) scale(1)';
follower.style.transform = 'translate(-50%, -50%) scale(1)';
});
});

// ─── LOADER SEQUENCE ──────────────────────────────────
const tl = gsap.timeline();

tl.to('#loader-kanji-text', {
y: 0, duration: 0.8, ease: 'power3.out',
onStart: () => {
document.querySelector('.loader-kanji span').style.transform = 'translateY(0)';
}
})
.to('#loader-line', { width: '200px', duration: 0.6, ease: 'power2.inOut' }, '+=0.2')
.to('#loader-sub', { opacity: 1, duration: 0.5 }, '-=0.2')
.to('#loader', { opacity: 0, duration: 0.6, delay: 0.5, ease: 'power2.in' })
.set('#loader', { display: 'none' })

// Slash reveal
.from('#slash-left', { scaleX: 1, duration: 0 }, 0)
.from('#slash-right', { scaleX: 1, duration: 0 }, 0)
.to('#slash-left', { scaleX: 0, duration: 0.8, ease: 'power3.inOut' })
.to('#slash-right', { scaleX: 0, duration: 0.8, ease: 'power3.inOut' }, '<')
.set('#slash-left, #slash-right', { display: 'none' })

// Hero entrance
.to('#hero-eyebrow', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
.to('.hero-title .line span', {
y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1
}, '-=0.3')
.to(['#hero-desc', '#hero-cta', '#hero-scroll'], {
opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1
}, '-=0.4');

// ─── SCROLL ANIMATIONS ────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.reveal').forEach(el => {
gsap.fromTo(el,
{ opacity: 0, y: 50 },
{
opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
scrollTrigger: {
trigger: el,
start: 'top 85%',
toggleActions: 'play none none none'
}
}
);
});

// Stat counters
document.querySelectorAll('.stat-num').forEach(el => {
const target = parseInt(el.textContent);
if (isNaN(target)) return;
const suffix = el.textContent.replace(/[0-9]/g, '');
gsap.fromTo({ val: 0 },
{ val: 0 },
{
val: target, duration: 2, ease: 'power2.out',
scrollTrigger: { trigger: el, start: 'top 80%' },
onUpdate: function () {
el.textContent = Math.round(this.targets()[0].val) + suffix;
}
}
);
});

// Program cards stagger
gsap.fromTo('.program-card',
{ opacity: 0, y: 60 },
{
opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.15,
scrollTrigger: { trigger: '.programs-grid', start: 'top 80%' }
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
return;
}

// ─ EmailJS (раскомментируй когда подключишь) ─
// emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', { fname, lname, email, program })
// .then(() => {
// status.textContent = '✓ Anmeldung gesendet! Der Sempai wird sich bald bei dir melden.';
// status.className = 'success';
// })
// .catch(() => {
// status.textContent = 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
// status.className = 'error';
// });

// Demo (убери когда подключишь EmailJS)
status.textContent = '✓ Anmeldung gesendet! Der Sempai wird sich bald bei dir melden.';
status.className = 'success';
}

// ─── HERO PARALLAX ────────────────────────────────────
document.addEventListener('mousemove', e => {
const x = (e.clientX / window.innerWidth - 0.5) * 20;
const y = (e.clientY / window.innerHeight - 0.5) * 20;
gsap.to('.hero-number', { x, y, duration: 1.2, ease: 'power1.out' });
});