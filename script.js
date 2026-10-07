/* ── REVEAL ON SCROLL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── HERO reveals on load ── */
document.querySelectorAll('#hero .reveal').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 80 + i * 100);
});


/* ── GLANCE COUNT-UP ── */
(function () {
  var glance = document.getElementById('glance');
  if (!glance) return;
  // The HTML holds the real numbers (for crawlers and link previews);
  // only reset to 0 here when we're actually going to animate.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var counts = glance.querySelectorAll('.count');
  counts.forEach(function (el) { el.textContent = '0'; });
  var animated = false;
  var observer = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting || animated) return;
    animated = true;
    counts.forEach(function (el) {
      var target = parseInt(el.dataset.target, 10);
      var duration = 1100;
      var start = performance.now();
      function step(now) {
        var progress = Math.min((now - start) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  observer.observe(glance);
})();

/* ── MOBILE NAV ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── CREATIVE OVERLAYS ── */
const overlay      = document.getElementById('overlay');
const overlayInner = document.getElementById('overlayInner');
const overlayClose = document.getElementById('overlayClose');

function openOverlay(key) {
  const tpl = document.getElementById(`tpl-${key}`);
  if (!tpl) return;
  overlayInner.innerHTML = '';
  overlayInner.appendChild(tpl.content.cloneNode(true));
  overlay.classList.add('open');
  overlay.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
}

function closeOverlay() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.creative-panel').forEach(panel => {
  panel.addEventListener('click', () => openOverlay(panel.dataset.overlay));
});

overlayClose.addEventListener('click', closeOverlay);
overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlay(); });

/* ── ACTIVE NAV LINK ── */
(function () {
  var links = {};
  navLinks.querySelectorAll('a[href^="#"]').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = links[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        Object.values(links).forEach(function (a) { a.classList.remove('active'); });
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('.frame > section[id]').forEach(function (s) { spy.observe(s); });
})();
