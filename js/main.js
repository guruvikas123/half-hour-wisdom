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

/* ── GMB REVIEWS (Google Places API) ───────────────────────── */
/*
 * Replace YOUR_GOOGLE_PLACE_ID with the Place ID for your GMB listing.
 * Find it at: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
 * Example: "ChIJN1t_tDeuEmsRUsoyG83frY4"
 */
const GMB_PLACE_ID = 'YOUR_GOOGLE_PLACE_ID';

window.initGMBReviews = function () {
  const service = new google.maps.places.PlacesService(document.createElement('div'));
  service.getDetails(
    { placeId: GMB_PLACE_ID, fields: ['reviews', 'rating', 'user_ratings_total'] },
    (place, status) => {
      document.getElementById('reviews-skeleton').style.display = 'none';
      if (status !== google.maps.places.PlacesServiceStatus.OK || !place.reviews?.length) {
        document.getElementById('reviews-error').style.display = 'block';
        return;
      }
      renderGMBReviews(place.reviews);
    }
  );
};

function renderGMBReviews(reviews) {
  const grid = document.getElementById('gmb-reviews');
  grid.style.display = '';

  reviews.forEach(r => {
    const card = document.createElement('article');
    card.className = 'review-card';

    const stars = document.createElement('div');
    stars.className = 'review-stars';
    stars.setAttribute('aria-label', `${r.rating} out of 5 stars`);
    for (let i = 1; i <= 5; i++) {
      const s = document.createElement('span');
      s.textContent = '★';
      if (i > r.rating) s.className = 'star-empty';
      stars.appendChild(s);
    }

    const text = document.createElement('p');
    text.className = 'review-text';
    text.textContent = r.text;

    const author = document.createElement('div');
    author.className = 'review-author';

    const avatar = document.createElement('img');
    avatar.className = 'review-avatar';
    avatar.src = r.profile_photo_url || '';
    avatar.alt = r.author_name;
    avatar.loading = 'lazy';
    avatar.onerror = function () { this.style.display = 'none'; };

    const info = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'review-name';
    name.textContent = r.author_name;
    const time = document.createElement('div');
    time.className = 'review-time';
    time.textContent = r.relative_time_description;

    info.appendChild(name);
    info.appendChild(time);
    author.appendChild(avatar);
    author.appendChild(info);

    card.appendChild(stars);
    card.appendChild(text);
    card.appendChild(author);
    grid.appendChild(card);
  });

  /* trigger scroll animation */
  setTimeout(() => grid.classList.add('visible'), 50);
}

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
