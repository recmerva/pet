/* =========================================================
   ŠAPA — korpa (stranice/korpa.html)
   Lista stavki, promena količine, brisanje, kupon kodovi,
   traka do besplatne dostave i obračun.
   Količine i brisanje rade preko zajedničkih data-korpa-*
   atributa iz main.js; ovde se samo iscrtava.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const S = window.Sapa;

  const el = {
    prazna: document.getElementById('cartEmpty'),
    puna: document.getElementById('cartFull'),
    lista: document.getElementById('cartList'),
    uvod: document.getElementById('cartLead'),
    traka: document.getElementById('shipBar'),
    redovi: document.getElementById('summaryRows'),
    kuponForma: document.getElementById('couponForm'),
    kuponPolje: document.getElementById('couponInput'),
    kuponPoruka: document.getElementById('couponMsg'),
    kuponPrimenjen: document.getElementById('couponApplied'),
    isprazni: document.getElementById('clearCart')
  };
  if (!el.lista) return;

  let prvoIscrtavanje = true;
  let poslednjeUkupno = NaN;

  /** Jedna stavka korpe. */
  function stavkaHtml(s, i) {
    const p = s.proizvod;
    const velicina = p.tezina || p.velicina;
    const malo = p.naStanju <= 3;
    return `
      <li class="cart-item" style="--i:${i}" data-stavka="${p.id}">
        <a href="${S.urlProizvoda(p)}" class="cart-thumb" tabindex="-1" aria-hidden="true">${p.emoji}</a>
        <div class="cart-info">
          <a href="${S.urlProizvoda(p)}" class="cart-name">${S.escapeHtml(p.naziv)}</a>
          <p class="cart-sub">${S.escapeHtml(S.nazivKategorije(p.kategorija))} · ${S.escapeHtml(velicina)}</p>
          ${malo ? `<p class="cart-sub"><span class="stock-mini stock-low">Na stanju: ${p.naStanju} kom</span></p>` : ''}
        </div>
        <span class="cart-unit">${S.formatCena(p.cena)}</span>
        ${S.biracKolicine(p, s.kolicina)}
        <span class="cart-line">${S.formatCena(s.iznos)}</span>
        <button type="button" class="link-btn" data-korpa-ukloni="${p.id}" aria-label="Ukloni iz korpe: ${S.escapeHtml(p.naziv)}">${S.IKONE.kanta}</button>
      </li>`;
  }

  /** Okvir sa primenjenim (ili više nevažećim) kuponom. */
  function kuponHtml(obr) {
    if (!obr.kupon) return '';
    const k = obr.kupon;
    return `
      <div class="coupon-applied${k.vazi ? '' : ' is-invalid'}">
        <span>
          <span aria-hidden="true">${k.vazi ? '🎟️' : '⚠️'}</span>
          <code>${S.escapeHtml(k.kod)}</code> —
          ${k.vazi ? `${S.escapeHtml(k.opis)} (−${S.formatCena(k.popust)})` : S.escapeHtml(k.poruka)}
        </span>
        <button type="button" class="link-btn" id="removeCoupon" aria-label="Ukloni kupon ${S.escapeHtml(k.kod)}">${S.IKONE.kanta}</button>
      </div>`;
  }

  function iscrtaj() {
    const obr = S.obracun();
    const prazna = obr.stavke.length === 0;
    el.prazna.hidden = !prazna;
    el.puna.hidden = prazna;
    el.uvod.textContent = prazna
      ? 'Korpa te čeka — napuni je nečim lepim za svog ljubimca.'
      : `U korpi imaš ${S.brojProizvoda(obr.brojKomada)}. Proveri stavke, primeni kupon i nastavi na plaćanje.`;
    if (prazna) { prvoIscrtavanje = false; return; }

    // pamtimo fokus da tastatura ne izgubi mesto posle ponovnog iscrtavanja
    const aktivni = document.activeElement;
    const atributi = ['data-korpa-minus', 'data-korpa-plus', 'data-korpa-input', 'data-korpa-ukloni'];
    const atr = aktivni && el.lista.contains(aktivni) ? atributi.find(a => aktivni.hasAttribute(a)) : null;
    const selektor = atr ? `[${atr}="${aktivni.getAttribute(atr)}"]` : null;

    el.lista.innerHTML = obr.stavke.map(stavkaHtml).join('');
    el.lista.classList.toggle('is-static', !prvoIscrtavanje);
    if (selektor) {
      const novi = el.lista.querySelector(selektor);
      if (novi) novi.focus(); else if (atr === 'data-korpa-ukloni') el.kuponPolje.focus();
    }

    el.traka.innerHTML = S.trakaDostave(obr);
    el.kuponPrimenjen.innerHTML = kuponHtml(obr);
    el.redovi.innerHTML = S.redoviObracuna(obr);

    // ukupan iznos „odbrojava” do nove vrednosti
    const ukupnoEl = el.redovi.querySelector('[data-iznos]');
    if (!prvoIscrtavanje) S.animirajIznos(ukupnoEl, poslednjeUkupno, obr.ukupno);
    poslednjeUkupno = obr.ukupno;
    prvoIscrtavanje = false;
  }

  /* ---------- Brisanje sa animacijom izlaska ---------- */
  // Hvatamo klik pre zajedničkog rukovaoca da bi stavka prvo „odletela” udesno.
  el.lista.addEventListener('click', (e) => {
    const dugme = e.target.closest('[data-korpa-ukloni]');
    if (!dugme) return;
    e.stopPropagation();
    const id = dugme.dataset.korpaUkloni;
    const p = S.nadjiProizvod(id);
    const red = dugme.closest('.cart-item');
    const ukloni = () => {
      S.ukloniIzKorpe(id);
      S.toast(`Uklonjeno iz korpe: ${p ? p.naziv : 'proizvod'}`, 'info');
    };
    if (red && !S.manjeAnimacija()) {
      red.classList.add('is-removing');
      setTimeout(ukloni, 280);
    } else ukloni();
  }, true);

  /* ---------- Kupon ---------- */
  el.kuponForma.addEventListener('submit', (e) => {
    e.preventDefault();
    const rezultat = S.primeniKupon(el.kuponPolje.value);
    el.kuponPoruka.textContent = rezultat.poruka;
    el.kuponPoruka.className = 'coupon-msg ' + (rezultat.ok ? 'is-ok' : 'is-error');
    if (rezultat.ok) {
      el.kuponPolje.value = '';
      el.kuponPolje.removeAttribute('aria-invalid');
      S.toast(`Kupon ${rezultat.kod} je primenjen!`);
    } else {
      el.kuponPolje.setAttribute('aria-invalid', 'true');
      S.poskoci(el.kuponForma, 'is-shaking');
      el.kuponPolje.focus();
    }
  });
  el.kuponPolje.addEventListener('input', () => {
    el.kuponPolje.removeAttribute('aria-invalid');
    if (el.kuponPoruka.classList.contains('is-error')) { el.kuponPoruka.textContent = ''; el.kuponPoruka.className = 'coupon-msg'; }
  });
  el.kuponPrimenjen.addEventListener('click', (e) => {
    if (!e.target.closest('#removeCoupon')) return;
    S.ukloniKupon();
    el.kuponPoruka.textContent = 'Kupon je uklonjen.';
    el.kuponPoruka.className = 'coupon-msg';
    el.kuponPolje.focus();
  });

  /* ---------- Pražnjenje korpe (dvostruki klik kao potvrda, bez iskačućeg prozora) ---------- */
  let potvrdaTajmer = null;
  el.isprazni.addEventListener('click', () => {
    if (el.isprazni.dataset.potvrda === '1') {
      clearTimeout(potvrdaTajmer);
      el.isprazni.dataset.potvrda = '';
      el.isprazni.textContent = 'Isprazni korpu';
      S.isprazniKorpu();
      S.toast('Korpa je ispražnjena.', 'info');
      const link = el.prazna.querySelector('a');
      if (link) link.focus();
      return;
    }
    el.isprazni.dataset.potvrda = '1';
    el.isprazni.textContent = 'Sigurno? Klikni ponovo';
    potvrdaTajmer = setTimeout(() => {
      el.isprazni.dataset.potvrda = '';
      el.isprazni.textContent = 'Isprazni korpu';
    }, 3500);
  });

  document.addEventListener('sapa:promena', iscrtaj);
  iscrtaj();
});
