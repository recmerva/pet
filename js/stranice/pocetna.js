/* =========================================================
   ŠAPA — početna stranica
   Izdvojeni proizvodi, broj proizvoda po kategoriji,
   najnoviji saveti, brojači u heroju, karusel utisaka.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const S = window.Sapa;

  /* ---------- Izdvojeni proizvodi (novo ili na popustu) ---------- */
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) {
    featuredGrid.innerHTML = S.izdvojeniProizvodi(8).map((p, i) => S.karticaProizvoda(p, i)).join('');
    S.otkrivaj();
  }

  /* ---------- Broj proizvoda po kategoriji ---------- */
  document.querySelectorAll('[data-cat-count]').forEach(el => {
    const n = S.proizvodi.filter(p => p.kategorija === el.dataset.catCount).length;
    el.textContent = S.brojProizvoda(n);
  });

  /* ---------- Tri najnovija saveta ---------- */
  const latestTips = document.getElementById('latestTips');
  if (latestTips) {
    latestTips.innerHTML = S.saveti().slice(0, 3).map((s, i) => S.karticaSaveta(s, i)).join('');
    S.otkrivaj();
  }

  /* ---------- Brojači u heroju (12.000+, 4,9/5, 48h) ---------- */
  const brojaci = document.querySelectorAll('[data-count-to]');
  const formatirajBrojac = (el, vrednost) => {
    const decimale = Number(el.dataset.decimals || 0);
    const tekst = decimale
      ? S.formatDecimal(vrednost, decimale)
      : String(Math.round(vrednost)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    el.textContent = tekst + (el.dataset.suffix || '');
  };
  if (!S.manjeAnimacija()) {
    brojaci.forEach(el => {
      const cilj = Number(el.dataset.countTo);
      const trajanje = 1600;
      const start = performance.now() + 400;
      formatirajBrojac(el, 0);
      const korak = (sada) => {
        const t = Math.min(1, Math.max(0, (sada - start) / trajanje));
        const ublazeno = 1 - Math.pow(1 - t, 3); // ease-out
        formatirajBrojac(el, cilj * ublazeno);
        if (t < 1) requestAnimationFrame(korak);
      };
      requestAnimationFrame(korak);
    });
  }

  /* ---------- Šape koje hodaju preko dna heroja ---------- */
  const pawWalk = document.getElementById('pawWalk');
  if (pawWalk && !S.manjeAnimacija()) {
    const SAPA_SVG = '<svg viewBox="0 0 34 34" fill="currentColor"><circle cx="17" cy="21" r="7.5"/><circle cx="7" cy="12" r="3.4"/><circle cx="16" cy="7" r="3.4"/><circle cx="25" cy="10" r="3.4"/><circle cx="29" cy="17" r="3"/></svg>';
    const broj = 14;
    let html = '';
    for (let i = 0; i < broj; i++) {
      const levo = 4 + i * (92 / broj);
      html += `<span style="left:${levo}%; animation-delay:${(i * 6 / broj).toFixed(2)}s; transform: rotate(90deg)">${SAPA_SVG}</span>`;
    }
    pawWalk.innerHTML = html;
  }

  /* ---------- Karusel utisaka ---------- */
  pokreniKarusel();

  function pokreniKarusel() {
    const koren = document.getElementById('testi');
    const track = document.getElementById('testiTrack');
    const dotsWrap = document.getElementById('testiDots');
    const prev = document.getElementById('testiPrev');
    const next = document.getElementById('testiNext');
    const pauza = document.getElementById('testiPause');
    if (!koren || !track) return;

    const slajdovi = Array.from(track.children);
    const INTERVAL = 6000;
    let indeks = 0;
    let tajmer = null;
    let pauziraoKorisnik = S.manjeAnimacija(); // bez automatskog listanja ako korisnik želi manje animacija
    let privremenaPauza = false;

    /* Koliko kartica se vidi odjednom — čita se iz CSS promenljive --per-view */
    const poPrikazu = () => Math.max(1, parseInt(getComputedStyle(track).getPropertyValue('--per-view'), 10) || 1);
    const brojPozicija = () => Math.max(1, slajdovi.length - poPrikazu() + 1);

    slajdovi.forEach((s, i) => s.setAttribute('aria-label', `${i + 1} od ${slajdovi.length}`));

    function napraviTacke() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < brojPozicija(); i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Prikaži utisak ${i + 1}`);
        dot.addEventListener('click', () => { idiNa(i); restartuj(); });
        dotsWrap.appendChild(dot);
      }
    }

    function idiNa(i) {
      const ukupno = brojPozicija();
      indeks = (i + ukupno) % ukupno;
      track.style.transform = `translateX(-${indeks * (100 / poPrikazu())}%)`;
      const vidljiviOd = indeks;
      const vidljiviDo = indeks + poPrikazu() - 1;
      slajdovi.forEach((s, n) => {
        const vidljiv = n >= vidljiviOd && n <= vidljiviDo;
        s.classList.toggle('is-current', vidljiv);
        // nevidljivi slajdovi ne smeju da prime fokus
        s.setAttribute('aria-hidden', String(!vidljiv));
        s.querySelectorAll('a, button').forEach(el => { el.tabIndex = vidljiv ? 0 : -1; });
      });
      Array.from(dotsWrap.children).forEach((d, n) => {
        const aktivna = n === indeks;
        d.classList.toggle('is-active', aktivna);
        if (aktivna) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      // ponovo pokreni animaciju trake napretka u aktivnoj tački
      koren.classList.remove('is-ticking');
      void koren.offsetWidth;
      if (!pauziraoKorisnik && !privremenaPauza) koren.classList.add('is-ticking');
    }

    function pokreni() {
      clearInterval(tajmer);
      if (pauziraoKorisnik || privremenaPauza) return;
      tajmer = setInterval(() => idiNa(indeks + 1), INTERVAL);
    }
    function zaustavi() { clearInterval(tajmer); koren.classList.remove('is-ticking'); }
    function restartuj() { zaustavi(); pokreni(); if (!pauziraoKorisnik && !privremenaPauza) koren.classList.add('is-ticking'); }

    prev.addEventListener('click', () => { idiNa(indeks - 1); restartuj(); });
    next.addEventListener('click', () => { idiNa(indeks + 1); restartuj(); });

    function osveziPauzu() {
      pauza.setAttribute('aria-pressed', String(pauziraoKorisnik));
      pauza.setAttribute('aria-label', pauziraoKorisnik ? 'Pokreni automatsko listanje' : 'Zaustavi automatsko listanje');
      koren.classList.toggle('is-paused', pauziraoKorisnik);
    }
    pauza.addEventListener('click', () => {
      pauziraoKorisnik = !pauziraoKorisnik;
      osveziPauzu();
      if (pauziraoKorisnik) zaustavi(); else restartuj();
    });

    // Pauza dok je miš iznad ili je fokus unutra
    const privremeno = (da) => {
      privremenaPauza = da;
      if (da) zaustavi(); else restartuj();
    };
    koren.addEventListener('mouseenter', () => privremeno(true));
    koren.addEventListener('mouseleave', () => privremeno(false));
    koren.addEventListener('focusin', () => privremeno(true));
    koren.addEventListener('focusout', (e) => { if (!koren.contains(e.relatedTarget)) privremeno(false); });

    // Strelice na tastaturi
    koren.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { idiNa(indeks - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { idiNa(indeks + 1); e.preventDefault(); }
    });

    // Prevlačenje prstom / mišem
    let startX = null;
    let pomeraj = 0;
    track.addEventListener('pointerdown', (e) => {
      startX = e.clientX; pomeraj = 0;
      track.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', (e) => {
      if (startX === null) return;
      pomeraj = e.clientX - startX;
      const osnova = -indeks * (100 / poPrikazu());
      track.style.transform = `translateX(calc(${osnova}% + ${pomeraj}px))`;
    });
    const krajPrevlacenja = () => {
      if (startX === null) return;
      track.classList.remove('is-dragging');
      if (Math.abs(pomeraj) > 50) idiNa(indeks + (pomeraj < 0 ? 1 : -1));
      else idiNa(indeks);
      startX = null;
      restartuj();
    };
    window.addEventListener('pointerup', krajPrevlacenja);
    window.addEventListener('pointercancel', krajPrevlacenja);

    // Promena širine ekrana menja broj vidljivih kartica
    let poslednjiPrikaz = poPrikazu();
    window.addEventListener('resize', () => {
      if (poPrikazu() !== poslednjiPrikaz) {
        poslednjiPrikaz = poPrikazu();
        napraviTacke();
        idiNa(Math.min(indeks, brojPozicija() - 1));
      }
    });

    // Zaustavi kada karusel nije na ekranu (štedi bateriju)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((unosi) => {
        unosi.forEach(u => { if (u.isIntersecting) restartuj(); else zaustavi(); });
      }).observe(koren);
    }

    napraviTacke();
    osveziPauzu();
    idiNa(0);
    pokreni();
  }
});
