/* =========================================================
   ŠAPA — kontakt (stranice/kontakt.html)
   Kontakt forma sa validacijom (bez slanja), oznaka
   „otvoreno / zatvoreno” i FAQ accordion.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const S = window.Sapa;

  /* ---------- Kontakt forma ---------- */
  const forma = document.getElementById('contactForm');
  const uspeh = document.getElementById('contactSuccess');
  const poruka = document.getElementById('kPoruka');
  const brojac = document.getElementById('porukaBrojac');

  if (forma) {
    const P = S.PROVERE;
    const v = S.validacija(forma, {
      ime: (x) => !P.obavezno(x) ? 'Unesi ime i prezime.' : !P.ime(x) ? 'Ime treba da sadrži samo slova (najmanje 2).' : '',
      email: (x) => !P.obavezno(x) ? 'Unesi email adresu.' : !P.email(x) ? 'Email adresa nije ispravna, npr. ime@primer.com.' : '',
      tema: (x) => x ? '' : 'Izaberi temu poruke.',
      poruka: (x) => {
        const duzina = String(x).trim().length;
        if (!duzina) return 'Napiši poruku.';
        if (duzina < 10) return `Poruka je prekratka — napiši još bar ${10 - duzina} ${S.mnozina(10 - duzina, 'znak', 'znaka', 'znakova')}.`;
        return '';
      }
    });

    poruka.addEventListener('input', () => { brojac.textContent = `${poruka.value.length} / 1000`; });

    forma.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!v.proveriSve()) return;
      // Nema servera: samo prikazujemo poruku o uspehu.
      const ime = String(v.vrednost('ime')).trim().split(/\s+/)[0];
      document.getElementById('successTitle').textContent = `Hvala, ${ime}!`;
      document.getElementById('successText').textContent =
        `Primili smo tvoju poruku i odgovorićemo na ${String(v.vrednost('email')).trim()} najkasnije za jedan radni dan.`;
      forma.hidden = true;
      uspeh.hidden = false;
      uspeh.focus();
      S.toast('Poruka je poslata.');
    });

    document.getElementById('contactAgain').addEventListener('click', () => {
      forma.reset();
      forma.querySelectorAll('.field').forEach(f => f.classList.remove('has-error', 'is-valid'));
      forma.querySelectorAll('[aria-invalid]').forEach(f => f.removeAttribute('aria-invalid'));
      forma.querySelectorAll('.field-error').forEach(f => { f.textContent = ''; });
      brojac.textContent = '0 / 1000';
      uspeh.hidden = true;
      forma.hidden = false;
      document.getElementById('kIme').focus();
    });
  }

  /* ---------- Otvoreno sada? (pon–sub 09–20h) ---------- */
  const oznaka = document.getElementById('openNow');
  if (oznaka) {
    const sada = new Date();
    const dan = sada.getDay();
    const sat = sada.getHours() + sada.getMinutes() / 60;
    const otvoreno = dan !== 0 && sat >= 9 && sat < 20;
    oznaka.hidden = false;
    oznaka.classList.add(otvoreno ? 'is-open' : 'is-closed');
    oznaka.innerHTML = `<span class="dot" aria-hidden="true"></span>${otvoreno ? 'Sada je otvoreno' : 'Sada je zatvoreno'}`;
  }

  /* ---------- FAQ accordion ---------- */
  const faq = document.getElementById('faqList');
  if (faq) {
    const dugmad = Array.from(faq.querySelectorAll('.faq-q'));

    const postavi = (dugme, otvoreno) => {
      dugme.setAttribute('aria-expanded', String(otvoreno));
      dugme.closest('.faq-item').classList.toggle('is-open', otvoreno);
    };

    dugmad.forEach((dugme, i) => {
      dugme.addEventListener('click', () => postavi(dugme, dugme.getAttribute('aria-expanded') !== 'true'));
      // strelice gore/dole, Home i End između pitanja
      dugme.addEventListener('keydown', (e) => {
        const mapa = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: dugmad.length - 1 };
        if (!(e.key in mapa)) return;
        e.preventDefault();
        dugmad[(mapa[e.key] + dugmad.length) % dugmad.length].focus();
      });
    });

    // prvo pitanje otvoreno, ili ono na koje vodi #faq-q3 u adresi
    const izAdrese = window.location.hash && document.getElementById(window.location.hash.slice(1).replace('faq-a', 'faq-q'));
    postavi(izAdrese && izAdrese.classList.contains('faq-q') ? izAdrese : dugmad[0], true);
  }
});
