/* ================================================================
   HALF HOUR WISDOM — Main JavaScript
   ================================================================ */

/* ── SCROLL ANIMATIONS ──────────────────────────────────────── */
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target); /* fire once */
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));

/* ── HERO STAGGER ENTRANCE ──────────────────────────────────── */
const heroSelectors = ['.hero-tag', '.hero-title', '.hero-sub', '.hero-actions', '.hero-stats'];
heroSelectors.forEach((sel, i) => {
  const el = document.querySelector(sel);
  if (!el) return;
  el.style.cssText = 'opacity:0;transform:translateY(26px);transition:opacity 0.8s ease,transform 0.8s ease';
  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 150 + i * 160);
});

/* ── NAVBAR SCROLL STATE ────────────────────────────────────── */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── MOBILE NAV: CLOSE ON LINK CLICK ───────────────────────── */
document.querySelectorAll('#navbarMenu .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const collapseEl = document.getElementById('navbarMenu');
    const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
    if (bsCollapse) bsCollapse.hide();
  });
});

/* ── SUBSCRIBE FORM ─────────────────────────────────────────── */
const subscribeForm = document.getElementById('subscribeForm');
const subscribeBtn  = document.getElementById('subscribeBtn');
const emailInput    = document.getElementById('emailInput');

if (subscribeForm) {
  subscribeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    /* Basic client-side validation */
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.classList.add('error');
      emailInput.focus();
      setTimeout(() => emailInput.classList.remove('error'), 2500);
      return;
    }

    subscribeBtn.disabled = true;
    subscribeBtn.textContent = 'Subscribing…';

    try {
      const res = await fetch(subscribeForm.action, {
        method: 'POST',
        body: new FormData(subscribeForm),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        subscribeBtn.classList.add('success');
        subscribeBtn.textContent = 'Subscribed ✓';
        emailInput.value = '';
        setTimeout(() => {
          subscribeBtn.classList.remove('success');
          subscribeBtn.textContent = 'Subscribe';
          subscribeBtn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Server error');
      }
    } catch {
      subscribeBtn.textContent = 'Try again';
      subscribeBtn.disabled = false;
      setTimeout(() => { subscribeBtn.textContent = 'Subscribe'; }, 3000);
    }
  });
}
