/* =========================================================
   ŠAPA — stranica proizvoda (stranice/proizvod.html?id=...)
   Detalji, izbor količine, tabovi (Opis / Karakteristike /
   Recenzije) i slični proizvodi iz iste kategorije.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const S = window.Sapa;
  const koren = document.getElementById('productRoot');
  if (!koren) return;

  const id = S.parametri().get('id');
  const p = id ? S.nadjiProizvod(id) : null;

  /* ---------- Proizvod ne postoji ---------- */
  if (!p) {
    document.title = 'Proizvod nije pronađen — Šapa pet shop';
    koren.innerHTML = `
      <div class="empty-box empty-box--page">
        <span class="empty-emoji" aria-hidden="true">🐾</span>
        <h1>Ovaj proizvod nismo pronašli</h1>
        <p>Možda je link pogrešno prepisan ili proizvod više nije u ponudi. Pogledaj šta sve imamo u prodavnici.</p>
        <a href="prodavnica.html" class="btn btn-primary">Nazad u prodavnicu</a>
      </div>`;
    return;
  }

  /* ---------- Naslov, opis i putanja ---------- */
  const kat = S.kategorije[p.kategorija];
  document.title = `${p.naziv} — Šapa pet shop`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', `${p.naziv}: ${p.kratakOpis} Cena ${S.formatCena(p.cena)}.`);

  const urlKat = `prodavnica.html?kategorija=${p.kategorija}`;
  const urlPotkat = `${urlKat}&potkategorija=${p.potkategorija}`;
  document.getElementById('pdCrumbs').insertAdjacentHTML('beforeend', `
    <li><a href="${urlKat}">${S.escapeHtml(kat.naziv)}</a></li>
    <li aria-current="page">${S.escapeHtml(p.naziv)}</li>`);

  /* ---------- Glavni deo ---------- */
  const popust = S.procenatPopusta(p);
  const stanje = S.stanjeProizvoda(p);
  const nema = p.naStanju <= 0;
  const velicina = p.tezina ? ['Težina / pakovanje', p.tezina] : ['Veličina', p.velicina];
  const sifra = 'SAPA-' + String(p.id).padStart(3, '0');

  koren.innerHTML = `
    <div class="pd-layout">
      <div class="pd-media">
        ${S.oznakeHtml(p)}
        <span class="pd-emoji" role="img" aria-label="${S.escapeHtml(p.naziv)}">${p.emoji}</span>
      </div>

      <div class="pd-info">
        <p class="product-meta"><a href="${urlKat}">${S.escapeHtml(kat.naziv)}</a> · <a href="${urlPotkat}">${S.escapeHtml(S.nazivPotkategorije(p.potkategorija))}</a></p>
        <h1>${S.escapeHtml(p.naziv)}</h1>

        <div class="pd-rating">
          ${S.zvezdice(p.ocena).replace('class="stars"', 'class="stars stars-lg"')}
          <strong>${S.formatDecimal(p.ocena)}</strong>
          <a href="#panel-recenzije" data-otvori-tab="recenzije">${p.brojRecenzija} ${S.mnozina(p.brojRecenzija, 'recenzija', 'recenzije', 'recenzija')}</a>
        </div>

        <div class="pd-price">
          ${S.cenaHtml(p, true)}
          ${popust ? `<span class="pd-save">Uštedi ${S.formatCena(p.staraCena - p.cena)} (−${popust}%)</span>` : ''}
        </div>

        <p class="pd-short">${S.escapeHtml(p.kratakOpis)}</p>

        <p class="pd-stock ${stanje.klasa}"><span class="dot" aria-hidden="true"></span>${stanje.tekst}${p.naStanju > 3 ? ` <span class="optional">(${p.naStanju} kom)</span>` : ''}</p>

        <div class="pd-actions">
          <div class="qty qty-lg" role="group" aria-label="Izbor količine">
            <button type="button" class="qty-btn" id="qtyMinus" aria-label="Smanji količinu" ${nema ? 'disabled' : ''}>${S.IKONE.minus}</button>
            <label class="visually-hidden" for="qtyInput">Količina</label>
            <input class="qty-input" type="number" id="qtyInput" inputmode="numeric" min="1" max="${Math.max(1, p.naStanju)}" value="1" ${nema ? 'disabled' : ''}>
            <button type="button" class="qty-btn" id="qtyPlus" aria-label="Povećaj količinu" ${nema ? 'disabled' : ''}>${S.IKONE.plus}</button>
          </div>
          ${nema
            ? '<button type="button" class="btn btn-primary" disabled>Nema na stanju</button>'
            : `<button type="button" class="btn btn-primary" id="pdAdd" data-dodaj="${p.id}" data-kolicina="1">${S.IKONE.korpa} Dodaj u korpu</button>`}
          <button type="button" class="pd-wish" data-zelja="${p.id}" aria-pressed="${S.jeUZeljama(p.id)}" aria-label="Lista želja: ${S.escapeHtml(p.naziv)}">
            ${S.IKONE.srce}<span data-zelja-tekst aria-hidden="true">${S.jeUZeljama(p.id) ? 'Na listi želja' : 'Dodaj u listu želja'}</span>
          </button>
        </div>
        <p class="hint" id="pdInCart" aria-live="polite"></p>

        <dl class="pd-meta">
          <dt>${velicina[0]}</dt><dd>${S.escapeHtml(velicina[1])}</dd>
          <dt>Šifra</dt><dd><code>${sifra}</code></dd>
          <dt>Kategorija</dt><dd>${S.escapeHtml(kat.naziv)} · ${S.escapeHtml(S.nazivPotkategorije(p.potkategorija))}</dd>
        </dl>

        <ul class="pd-perks">
          <li><span aria-hidden="true">🚚</span> Dostava za 48h — besplatna za porudžbine od ${S.formatCena(S.DOSTAVA.besplatnoOd)}</li>
          <li><span aria-hidden="true">↩️</span> Povraćaj novca u roku od 30 dana</li>
          <li><span aria-hidden="true">💬</span> Imaš pitanje? <a class="text-link" href="kontakt.html">Piši nam</a></li>
        </ul>
      </div>
    </div>

    <div class="tabs" id="pdTabs">
      <div class="tab-list" role="tablist" aria-label="Informacije o proizvodu">
        <button type="button" class="tab" role="tab" id="tab-opis" aria-controls="panel-opis" aria-selected="true">Opis</button>
        <button type="button" class="tab" role="tab" id="tab-karakteristike" aria-controls="panel-karakteristike" aria-selected="false" tabindex="-1">Karakteristike</button>
        <button type="button" class="tab" role="tab" id="tab-recenzije" aria-controls="panel-recenzije" aria-selected="false" tabindex="-1">Recenzije (${p.brojRecenzija})</button>
        <span class="tab-indicator" aria-hidden="true"></span>
      </div>

      <div class="tab-panel" role="tabpanel" id="panel-opis" aria-labelledby="tab-opis" tabindex="0">
        ${p.opis.map(pasus => `<p>${S.escapeHtml(pasus)}</p>`).join('')}
      </div>

      <div class="tab-panel" role="tabpanel" id="panel-karakteristike" aria-labelledby="tab-karakteristike" tabindex="0" hidden>
        <ul class="feature-list">
          ${p.karakteristike.map(k => `<li>${S.escapeHtml(k)}</li>`).join('')}
          <li>${velicina[0]}: ${S.escapeHtml(velicina[1])}</li>
        </ul>
      </div>

      <div class="tab-panel" role="tabpanel" id="panel-recenzije" aria-labelledby="tab-recenzije" tabindex="0" hidden>
        <div class="reviews-summary">
          <span class="reviews-score">${S.formatDecimal(p.ocena)}</span>
          <div>
            ${S.zvezdice(p.ocena).replace('class="stars"', 'class="stars stars-lg"')}
            <p class="hint">Prosek na osnovu ${p.brojRecenzija} ${S.mnozina(p.brojRecenzija, 'recenzije', 'recenzije', 'recenzija')}. Ispod su izdvojene recenzije.</p>
          </div>
        </div>
        <div class="review-list">
          ${p.recenzije.map(r => `
            <article class="review">
              <div class="review-head">
                <span class="review-author"><span class="avatar" aria-hidden="true">${S.escapeHtml(r.ime.charAt(0))}</span>${S.escapeHtml(r.ime)}</span>
                <time datetime="${S.isoDatum(r.datum)}">${S.formatDatum(r.datum)}</time>
              </div>
              ${S.zvezdice(r.ocena)}
              <p>${S.escapeHtml(r.tekst)}</p>
            </article>`).join('')}
        </div>
      </div>
    </div>`;

  /* ---------- Izbor količine ---------- */
  const polje = document.getElementById('qtyInput');
  const minus = document.getElementById('qtyMinus');
  const plus = document.getElementById('qtyPlus');
  const dodaj = document.getElementById('pdAdd');
  const uKorpiHint = document.getElementById('pdInCart');

  /** Koliko još komada sme da se doda (stanje minus ono što je već u korpi). */
  const preostalo = () => {
    const stavka = S.ucitajKorpu().find(s => s.id === p.id);
    return p.naStanju - (stavka ? stavka.kolicina : 0);
  };

  function postaviKolicinu(n) {
    const max = Math.max(1, preostalo());
    const vrednost = Math.min(Math.max(1, Math.floor(Number(n)) || 1), max);
    polje.value = vrednost;
    polje.max = max;
    minus.disabled = vrednost <= 1;
    plus.disabled = vrednost >= max;
    if (dodaj) dodaj.dataset.kolicina = String(vrednost);
  }

  function osveziStanjeKorpe() {
    if (nema) return;
    const stavka = S.ucitajKorpu().find(s => s.id === p.id);
    const ostalo = preostalo();
    uKorpiHint.textContent = stavka
      ? `U korpi već imaš ${stavka.kolicina} kom.${ostalo <= 0 ? ' To je sva količina koju imamo na stanju.' : ''}`
      : '';
    if (dodaj) {
      dodaj.disabled = ostalo <= 0;
      dodaj.innerHTML = ostalo <= 0 ? 'Sva količina je u korpi' : `${S.IKONE.korpa} Dodaj u korpu`;
    }
    postaviKolicinu(polje.value);
  }

  if (!nema) {
    minus.addEventListener('click', () => postaviKolicinu(Number(polje.value) - 1));
    plus.addEventListener('click', () => {
      if (Number(polje.value) >= preostalo()) S.toast(`Na stanju je samo ${p.naStanju} kom.`, 'greska');
      postaviKolicinu(Number(polje.value) + 1);
    });
    polje.addEventListener('change', () => {
      if (Number(polje.value) > preostalo()) S.toast(`Možeš da dodaš najviše ${Math.max(0, preostalo())} kom.`, 'greska');
      postaviKolicinu(polje.value);
    });
    // posle dodavanja vrati količinu na 1
    document.addEventListener('sapa:promena', (e) => {
      if (e.detail.tip === 'korpa' || e.detail.tip === 'spolja') {
        polje.value = 1;
        osveziStanjeKorpe();
      }
    });
    osveziStanjeKorpe();
  }

  /* ---------- Tabovi (strelice levo/desno, Home, End) ---------- */
  const tabovi = Array.from(koren.querySelectorAll('[role="tab"]'));
  const indikator = koren.querySelector('.tab-indicator');

  function pomeriIndikator(tab) {
    if (!indikator || !tab) return;
    indikator.style.width = tab.offsetWidth + 'px';
    indikator.style.transform = `translateX(${tab.offsetLeft}px)`;
  }

  function izaberiTab(tab, fokus = true) {
    tabovi.forEach(t => {
      const aktivan = t === tab;
      t.setAttribute('aria-selected', String(aktivan));
      t.tabIndex = aktivan ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !aktivan;
    });
    pomeriIndikator(tab);
    if (fokus) tab.focus();
  }

  tabovi.forEach((tab, i) => {
    tab.addEventListener('click', () => izaberiTab(tab));
    tab.addEventListener('keydown', (e) => {
      const mapa = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabovi.length - 1 };
      if (!(e.key in mapa)) return;
      e.preventDefault();
      izaberiTab(tabovi[(mapa[e.key] + tabovi.length) % tabovi.length]);
    });
  });
  window.addEventListener('resize', () => pomeriIndikator(tabovi.find(t => t.getAttribute('aria-selected') === 'true')));
  // indikator posle učitavanja fontova (širina teksta se menja)
  pomeriIndikator(tabovi[0]);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => pomeriIndikator(tabovi.find(t => t.getAttribute('aria-selected') === 'true')));

  // Link „126 recenzija” otvara tab sa recenzijama
  koren.addEventListener('click', (e) => {
    const link = e.target.closest('[data-otvori-tab]');
    if (!link) return;
    e.preventDefault();
    const tab = document.getElementById('tab-' + link.dataset.otvoriTab);
    izaberiTab(tab);
    document.getElementById('pdTabs').scrollIntoView({ behavior: S.manjeAnimacija() ? 'auto' : 'smooth', block: 'start' });
  });
  if (window.location.hash === '#recenzije' || window.location.hash === '#panel-recenzije') {
    izaberiTab(document.getElementById('tab-recenzije'), false);
  }

  /* ---------- Slični proizvodi (4 iz iste kategorije) ---------- */
  const slicni = S.proizvodi
    .filter(x => x.kategorija === p.kategorija && x.id !== p.id)
    .sort((a, b) =>
      (b.potkategorija === p.potkategorija) - (a.potkategorija === p.potkategorija) ||
      (b.naStanju > 0) - (a.naStanju > 0) ||
      b.ocena - a.ocena)
    .slice(0, 4);

  if (slicni.length) {
    document.getElementById('similarSection').hidden = false;
    document.getElementById('similarMore').href = urlKat;
    document.getElementById('similarGrid').innerHTML = slicni.map((x, i) => S.karticaProizvoda(x, i)).join('');
    S.otkrivaj();
  }
});
