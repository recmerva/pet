/* =========================================================
   ŠAPA — interakcije
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Godina u footeru ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header senka pri skrolu ---------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    if (window.scrollY > 12) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Mobilni meni ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  const closeMenu = () => {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Korpa: dodavanje proizvoda ---------- */
  const cartCountEl = document.getElementById('cartCount');
  const toastEl = document.getElementById('toast');
  let cartCount = 0;
  let toastTimer = null;

  const showToast = (message) => {
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2200);
  };

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      cartCount += 1;
      cartCountEl.textContent = String(cartCount);
      cartCountEl.classList.add('bump');
      setTimeout(() => cartCountEl.classList.remove('bump'), 260);

      const card = btn.closest('.product-card');
      const name = card ? card.querySelector('h3').textContent : 'Proizvod';
      showToast(`Dodato u korpu: ${name}`);
    });
  });

  /* ---------- Filtriranje proizvoda po kategoriji ---------- */
  const filterBar = document.getElementById('filterBar');
  const productCards = Array.from(document.querySelectorAll('.product-card'));
  const emptyState = document.getElementById('emptyState');
  const catCards = document.querySelectorAll('.cat-card');

  const applyFilter = (filter) => {
    let visibleCount = 0;
    productCards.forEach(card => {
      const matches = filter === 'svi' || card.dataset.cat === filter;
      card.classList.toggle('is-hidden', !matches);
      if (matches) visibleCount += 1;
    });
    emptyState.hidden = visibleCount !== 0;

    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.filter === filter);
    });
  };

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    applyFilter(btn.dataset.filter);
  });

  // Klik na kategoriju gore takođe filtrira i skroluje do proizvoda
  catCards.forEach(card => {
    card.addEventListener('click', () => {
      const filter = card.dataset.filter;
      applyFilter(filter);
      document.getElementById('proizvodi').scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- Karusel utisaka ---------- */
  const testiTrack = document.getElementById('testiTrack');
  const testiDotsWrap = document.getElementById('testiDots');
  const testiCards = testiTrack ? Array.from(testiTrack.children) : [];
  let testiIndex = 0;
  let testiTimer = null;

  const goToTesti = (index) => {
    testiIndex = (index + testiCards.length) % testiCards.length;
    testiTrack.style.transform = `translateX(-${testiIndex * 100}%)`;
    testiDotsWrap.querySelectorAll('button').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === testiIndex);
    });
  };

  const startTestiAutoplay = () => {
    clearInterval(testiTimer);
    testiTimer = setInterval(() => goToTesti(testiIndex + 1), 6000);
  };

  if (testiCards.length) {
    testiCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Prikaži utisak ${i + 1}`);
      dot.addEventListener('click', () => {
        goToTesti(i);
        startTestiAutoplay();
      });
      testiDotsWrap.appendChild(dot);
    });
    goToTesti(0);
    startTestiAutoplay();
  }

  /* ---------- Newsletter validacija ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterMsg = document.getElementById('newsletterMsg');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = newsletterEmail.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!isValid) {
      newsletterMsg.textContent = 'Unesi ispravnu email adresu.';
      newsletterEmail.focus();
      return;
    }

    newsletterMsg.textContent = `Hvala! Poslali smo kod za popust na ${value}.`;
    newsletterForm.reset();
  });

  /* ---------- Dugme "Nazad na vrh" ---------- */
  const backToTop = document.getElementById('backToTop');
  const onScrollTopBtn = () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 480);
  };
  window.addEventListener('scroll', onScrollTopBtn, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Otkrivanje sekcija pri skrolu ---------- */
  const revealTargets = document.querySelectorAll(
    '.cat-grid, .product-grid, .about-inner, .testi-wrap, .trust-inner'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

});