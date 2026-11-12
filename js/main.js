/* =========================================================
   ŠAPA — zajednički kod za sve stranice
   ---------------------------------------------------------
   Sve javne funkcije su u globalnom objektu `Sapa`, da bi ih
   koristili i skriptovi pojedinačnih stranica (js/<stranica>.js).

   Sadržaj:
   1. Podešavanja (ključevi, dostava, kuponi)
   2. Rad sa localStorage-om
   3. Formatiranje (cena, datum, množina, HTML)
   4. Proizvodi
   5. Korpa i obračun
   6. Lista želja
   7. Šabloni (kartica proizvoda, zvezdice, traka dostave...)
   8. Toast poruke i animacije
   9. Bočni paneli (mini korpa i lista želja)
   10. Header, meni, back-to-top, otkrivanje pri skrolu
   11. Newsletter
   12. Validacija formi
   13. Pokretanje
   ========================================================= */

(function () {
  'use strict';

  /* =======================================================
     1. PODEŠAVANJA
     ======================================================= */

  const KLJUCEVI = {
    korpa: 'sapa_korpa',
    zelje: 'sapa_zelje',
    kupon: 'sapa_kupon',
    porudzbine: 'sapa_porudzbine',
    newsletter: 'sapa_newsletter'
  };

  const DOSTAVA = {
    cena: 350,          // cena dostave u dinarima
    besplatnoOd: 3000   // od ovog međuzbira dostava je besplatna
  };

  /* Kupon kodovi. `izracunaj` vraća iznos popusta za dati međuzbir. */
  const KUPONI = {
    SAPA10: {
      opis: '10% popusta na proizvode',
      minimum: 0,
      izracunaj: (medjuzbir) => Math.round(medjuzbir * 0.10)
    },
    DOBRODOSLI: {
      opis: '500 din popusta za porudžbine od 2.500 din',
      minimum: 2500,
      izracunaj: () => 500
    }
  };

  /* Da li korisnik želi manje animacija (proverava se svaki put, može da se promeni). */
  const manjeAnimacija = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* =======================================================
     2. LOCALSTORAGE
     Ako localStorage nije dostupan (privatni režim, blokiran),
     podaci se čuvaju u memoriji dok je stranica otvorena.
     ======================================================= */

  const memorija = {};

  const skladiste = {
    ucitaj(kljuc, podrazumevano) {
      try {
        const vrednost = localStorage.getItem(kljuc);
        return vrednost === null ? podrazumevano : JSON.parse(vrednost);
      } catch (e) {
        return kljuc in memorija ? memorija[kljuc] : podrazumevano;
      }
    },
    sacuvaj(kljuc, vrednost) {
      memorija[kljuc] = vrednost;
      try {
        localStorage.setItem(kljuc, JSON.stringify(vrednost));
      } catch (e) { /* ostaje samo u memoriji */ }
    },
    obrisi(kljuc) {
      delete memorija[kljuc];
      try { localStorage.removeItem(kljuc); } catch (e) { /* nema šta */ }
    }
  };


  /* =======================================================
     3. FORMATIRANJE
     ======================================================= */

  /** 3290 → "3.290 din" */
  function formatCena(iznos) {
    const broj = Math.round(Number(iznos) || 0);
    const cifre = String(Math.abs(broj)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (broj < 0 ? '−' : '') + cifre + ' din';
  }

  /** 4.7 → "4,7" */
  function formatDecimal(broj, decimale = 1) {
    return Number(broj).toFixed(decimale).replace('.', ',');
  }

  const MESECI = ['januara', 'februara', 'marta', 'aprila', 'maja', 'juna', 'jula',
    'avgusta', 'septembra', 'oktobra', 'novembra', 'decembra'];
  const DANI = ['nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'];

  /** Pretvara "2026-11-12" ili Date u lokalni Date (bez pomeranja zbog vremenske zone). */
  function uDatum(vrednost) {
    if (vrednost instanceof Date) return vrednost;
    const delovi = String(vrednost).split('-').map(Number);
    if (delovi.length === 3 && delovi.every(n => !isNaN(n))) {
      return new Date(delovi[0], delovi[1] - 1, delovi[2]);
    }
    return new Date(vrednost);
  }

  /** "12. novembra 2026." (sa danom u nedelji ako je saDanom = true) */
  function formatDatum(vrednost, saDanom = false) {
    const d = uDatum(vrednost);
    const tekst = `${d.getDate()}. ${MESECI[d.getMonth()]} ${d.getFullYear()}.`;
    return saDanom ? `${DANI[d.getDay()]}, ${tekst}` : tekst;
  }

  /** Datum u formatu za atribut datetime: "2026-11-12" */
  function isoDatum(vrednost) {
    const d = uDatum(vrednost);
    const dd = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${dd(d.getMonth() + 1)}-${dd(d.getDate())}`;
  }

  /** Dodaje n radnih dana (preskače subotu i nedelju). */
  function dodajRadneDane(pocetak, n) {
    const d = new Date(uDatum(pocetak).getTime());
    let dodato = 0;
    while (dodato < n) {
      d.setDate(d.getDate() + 1);
      const dan = d.getDay();
      if (dan !== 0 && dan !== 6) dodato += 1;
    }
    return d;
  }

  /** Srpska množina: mnozina(1,'proizvod','proizvoda','proizvoda') → "proizvod" */
  function mnozina(n, jedan, dvaDoCetiri, pet) {
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return jedan;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return dvaDoCetiri;
    return pet;
  }

  const brojProizvoda = (n) => `${n} ${mnozina(n, 'proizvod', 'proizvoda', 'proizvoda')}`;

  /** Bezbedno ubacivanje teksta u HTML šablone. */
  function escapeHtml(tekst) {
    return String(tekst == null ? '' : tekst)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Za pretragu: mala slova i bez dijakritika ("Mačka" → "macka", "đ" → "dj"). */
  function normalizuj(tekst) {
    return String(tekst || '')
      .toLowerCase()
      .replace(/đ/g, 'dj')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .trim();
  }

  /** Čitanje query parametara iz adrese. */
  const parametri = () => new URLSearchParams(window.location.search);

  /**
   * Upisuje parametre u adresu bez ponovnog učitavanja.
   * Na file:// neki pregledači to ne dozvoljavaju — tada ćutke preskačemo.
   */
  function azurirajUrl(params) {
    const upit = params.toString();
    const nova = window.location.pathname + (upit ? '?' + upit : '') + window.location.hash;
    try {
      window.history.replaceState(null, '', nova);
    } catch (e) { /* npr. file:// u nekim pregledačima */ }
  }


  /* =======================================================
     4. PROIZVODI
     ======================================================= */

  const proizvodi = (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) ? PRODUCTS : [];
  const kategorije = (typeof KATEGORIJE !== 'undefined') ? KATEGORIJE : {};
  const potkategorije = (typeof POTKATEGORIJE !== 'undefined') ? POTKATEGORIJE : {};

  function nadjiProizvod(id) {
    return proizvodi.find(p => String(p.id) === String(id)) || null;
  }

  function procenatPopusta(p) {
    return p && p.staraCena && p.staraCena > p.cena
      ? Math.round((1 - p.cena / p.staraCena) * 100)
      : 0;
  }

  const nazivKategorije = (kljuc) => (kategorije[kljuc] ? kategorije[kljuc].naziv : kljuc);
  const nazivPotkategorije = (kljuc) => potkategorije[kljuc] || kljuc;
  const urlProizvoda = (p) => `proizvod.html?id=${encodeURIComponent(p.id)}`;


  /* =======================================================
     5. KORPA I OBRAČUN
     Korpa u localStorage-u: [{ id, kolicina }]
     ======================================================= */

  /** Javlja svim delovima stranice da su se podaci promenili. */
  function javi(tip) {
    document.dispatchEvent(new CustomEvent('sapa:promena', { detail: { tip } }));
  }

  /** Učitava korpu i čisti nevažeće stavke (nepostojeći proizvod, loša količina). */
  function ucitajKorpu() {
    const sirovo = skladiste.ucitaj(KLJUCEVI.korpa, []);
    if (!Array.isArray(sirovo)) return [];
    const ociscena = [];
    sirovo.forEach(stavka => {
      const p = stavka && nadjiProizvod(stavka.id);
      const kolicina = Math.min(Math.floor(Number(stavka && stavka.kolicina)) || 0, p ? p.naStanju : 0);
      if (p && kolicina > 0 && !ociscena.some(s => s.id === p.id)) {
        ociscena.push({ id: p.id, kolicina });
      }
    });
    return ociscena;
  }

  function sacuvajKorpu(stavke) {
    skladiste.sacuvaj(KLJUCEVI.korpa, stavke);
    javi('korpa');
  }

  /**
   * Dodaje proizvod u korpu, poštujući stanje na lageru.
   * Vraća { ok, dodato, poruka }.
   */
  function dodajUKorpu(id, kolicina = 1) {
    const p = nadjiProizvod(id);
    if (!p) return { ok: false, dodato: 0, poruka: 'Proizvod nije pronađen.' };
    if (p.naStanju <= 0) return { ok: false, dodato: 0, poruka: `${p.naziv} trenutno nije na stanju.` };

    const korpa = ucitajKorpu();
    const postojeca = korpa.find(s => s.id === p.id);
    const vecUKorpi = postojeca ? postojeca.kolicina : 0;
    const zeljeno = Math.max(1, Math.floor(Number(kolicina)) || 1);
    const dodato = Math.min(zeljeno, p.naStanju - vecUKorpi);

    if (dodato <= 0) {
      return { ok: false, dodato: 0, poruka: `U korpi je već sva dostupna količina (${p.naStanju} kom).` };
    }

    if (postojeca) postojeca.kolicina += dodato;
    else korpa.push({ id: p.id, kolicina: dodato });
    sacuvajKorpu(korpa);

    const poruka = dodato < zeljeno
      ? `Dodato ${dodato} kom — to je sve što imamo na stanju.`
      : `Dodato u korpu: ${p.naziv}${dodato > 1 ? ` (${dodato} kom)` : ''}`;
    return { ok: true, dodato, poruka };
  }

  /** Postavlja količinu (ograničeno na 1 … naStanju). Količina 0 briše stavku. */
  function postaviKolicinu(id, kolicina) {
    const p = nadjiProizvod(id);
    if (!p) return;
    const n = Math.floor(Number(kolicina));
    if (isNaN(n)) { javi('korpa'); return; }
    if (n <= 0) { ukloniIzKorpe(id); return; }
    const korpa = ucitajKorpu();
    const stavka = korpa.find(s => s.id === p.id);
    if (!stavka) return;
    stavka.kolicina = Math.min(n, p.naStanju);
    sacuvajKorpu(korpa);
  }

  function ukloniIzKorpe(id) {
    sacuvajKorpu(ucitajKorpu().filter(s => String(s.id) !== String(id)));
  }

  function isprazniKorpu() {
    skladiste.obrisi(KLJUCEVI.kupon);
    sacuvajKorpu([]);
  }

  const brojUKorpi = () => ucitajKorpu().reduce((zbir, s) => zbir + s.kolicina, 0);

  /** Stavke korpe sa celim proizvodom i iznosom stavke. */
  function stavkeKorpe() {
    return ucitajKorpu().map(s => {
      const proizvod = nadjiProizvod(s.id);
      return { proizvod, kolicina: s.kolicina, iznos: proizvod.cena * s.kolicina };
    });
  }

  /** Proverava kupon za dati međuzbir. Vraća { ok, kod, popust, opis, poruka }. */
  function proveriKupon(unos, medjuzbir) {
    const kod = String(unos || '').trim().toUpperCase();
    if (!kod) return { ok: false, kod, popust: 0, poruka: 'Unesi kod kupona.' };

    const kupon = KUPONI[kod];
    if (!kupon) {
      return { ok: false, kod, popust: 0, poruka: `Kupon „${kod}” ne postoji ili je istekao. Proveri da li je kod dobro prepisan.` };
    }
    if (medjuzbir < kupon.minimum) {
      return {
        ok: false, kod, popust: 0, opis: kupon.opis,
        poruka: `Kupon ${kod} važi za porudžbine od ${formatCena(kupon.minimum)}. Dodaj još ${formatCena(kupon.minimum - medjuzbir)}.`
      };
    }
    return { ok: true, kod, opis: kupon.opis, popust: Math.min(kupon.izracunaj(medjuzbir), medjuzbir), poruka: `Kupon ${kod} je primenjen: ${kupon.opis}.` };
  }

  /** Primenjuje kupon na trenutnu korpu i pamti ga ako je ispravan. */
  function primeniKupon(unos) {
    const rezultat = proveriKupon(unos, obracun().medjuzbir);
    if (rezultat.ok) {
      skladiste.sacuvaj(KLJUCEVI.kupon, rezultat.kod);
      javi('korpa');
    }
    return rezultat;
  }

  function ukloniKupon() {
    skladiste.obrisi(KLJUCEVI.kupon);
    javi('korpa');
  }

  /**
   * Kompletan obračun korpe.
   * Besplatna dostava se računa na međuzbir (pre popusta).
   * Ako sačuvani kupon više ne važi (npr. smanjena korpa), vraća se
   * sa vazi: false i porukom, a popust je 0.
   */
  function obracun() {
    const stavke = stavkeKorpe();
    const medjuzbir = stavke.reduce((zbir, s) => zbir + s.iznos, 0);

    let kupon = null;
    const sacuvanKod = skladiste.ucitaj(KLJUCEVI.kupon, null);
    if (sacuvanKod && medjuzbir > 0) {
      const provera = proveriKupon(sacuvanKod, medjuzbir);
      kupon = { kod: provera.kod, opis: provera.opis || '', popust: provera.popust, vazi: provera.ok, poruka: provera.poruka };
    }
    const popust = kupon && kupon.vazi ? kupon.popust : 0;

    const besplatna = medjuzbir >= DOSTAVA.besplatnoOd;
    const dostava = medjuzbir === 0 || besplatna ? 0 : DOSTAVA.cena;
    const doBesplatne = Math.max(0, DOSTAVA.besplatnoOd - medjuzbir);

    return {
      stavke,
      brojKomada: stavke.reduce((z, s) => z + s.kolicina, 0),
      medjuzbir,
      kupon,
      popust,
      dostava,
      besplatnaDostava: besplatna,
      doBesplatne,
      procenatDoBesplatne: Math.min(100, Math.round((medjuzbir / DOSTAVA.besplatnoOd) * 100)),
      ukupno: Math.max(0, medjuzbir - popust) + dostava
    };
  }


  /* =======================================================
     6. LISTA ŽELJA  ([id, id, ...])
     ======================================================= */

  function ucitajZelje() {
    const sirovo = skladiste.ucitaj(KLJUCEVI.zelje, []);
    if (!Array.isArray(sirovo)) return [];
    return sirovo.filter((id, i) => nadjiProizvod(id) && sirovo.indexOf(id) === i);
  }

  const jeUZeljama = (id) => ucitajZelje().some(z => String(z) === String(id));

  /** Dodaje ili uklanja proizvod. Vraća true ako je proizvod sada na listi. */
  function prebaciZelju(id) {
    const p = nadjiProizvod(id);
    if (!p) return false;
    let zelje = ucitajZelje();
    const sada = !zelje.some(z => String(z) === String(p.id));
    zelje = sada ? [p.id, ...zelje] : zelje.filter(z => String(z) !== String(p.id));
    skladiste.sacuvaj(KLJUCEVI.zelje, zelje);
    javi('zelje');
    return sada;
  }


  /* =======================================================
     7. ŠABLONI (HTML)
     ======================================================= */

  const IKONE = {
    srce: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M12 21s-7-4.35-9.5-8.8C.7 8.4 2.4 5 6 5c2 0 3.3 1 4 2.2C10.7 6 12 5 14 5c3.6 0 5.3 3.4 3.5 7.2C15 16.65 12 21 12 21Z"/></svg>',
    korpa: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9.5" cy="20.5" r="1.4"/><circle cx="17" cy="20.5" r="1.4"/></svg>',
    kanta: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13"/></svg>',
    minus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14"/></svg>',
    plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'
  };

  /** Zvezdice sa delimičnim popunjavanjem (npr. 4,6 od 5). */
  function zvezdice(ocena) {
    const procenat = Math.max(0, Math.min(100, (Number(ocena) / 5) * 100));
    return `<span class="stars" role="img" aria-label="Ocena ${formatDecimal(ocena)} od 5"><span class="stars-fill" style="width:${procenat}%"></span></span>`;
  }

  /** Tekst i klasa za stanje na lageru. */
  function stanjeProizvoda(p) {
    if (p.naStanju <= 0) return { tekst: 'Nema na stanju', klasa: 'stock-out' };
    if (p.naStanju <= 3) return { tekst: `Još samo ${p.naStanju}`, klasa: 'stock-low' };
    return { tekst: 'Na stanju', klasa: 'stock-in' };
  }

  /** Cena sa precrtanom starom cenom (ako postoji). */
  function cenaHtml(p, velika = false) {
    const stara = p.staraCena && p.staraCena > p.cena
      ? ` <s class="price-old"><span class="visually-hidden">Stara cena: </span>${formatCena(p.staraCena)}</s>`
      : '';
    return `<span class="price${velika ? ' price-lg' : ''}">${formatCena(p.cena)}</span>${stara}`;
  }

  /** Oznake „Novo” i „-15%”. */
  function oznakeHtml(p) {
    const popust = procenatPopusta(p);
    let html = '';
    if (popust) html += `<span class="tag tag-sale">-${popust}%</span>`;
    if (p.novo) html += '<span class="tag tag-new">Novo</span>';
    return html ? `<div class="tags">${html}</div>` : '';
  }

  /** Dugme srca za listu želja. */
  function dugmeZelje(p, dodatnaKlasa = '') {
    const uListi = jeUZeljama(p.id);
    return `<button class="wish-btn ${dodatnaKlasa}" type="button" data-zelja="${p.id}" aria-pressed="${uListi}" aria-label="Lista želja: ${escapeHtml(p.naziv)}" title="${uListi ? 'Ukloni iz liste želja' : 'Dodaj u listu želja'}">${IKONE.srce}</button>`;
  }

  /**
   * Kartica proizvoda (koristi se na početnoj, u prodavnici i kod sličnih proizvoda).
   * Cela kartica je klikabilna preko „rastegnutog” linka u naslovu.
   */
  function karticaProizvoda(p, indeks = 0) {
    const nema = p.naStanju <= 0;
    const stanje = stanjeProizvoda(p);
    const dugme = nema
      ? '<button class="btn btn-small btn-disabled" type="button" disabled>Nema na stanju</button>'
      : `<button class="btn btn-small add-to-cart" type="button" data-dodaj="${p.id}">${IKONE.korpa}<span>Dodaj<span class="hide-xs"> u korpu</span></span><span class="visually-hidden">: ${escapeHtml(p.naziv)}</span></button>`;

    return `
      <article class="product-card${nema ? ' is-out' : ''}" style="--i:${indeks}" data-id="${p.id}">
        ${oznakeHtml(p)}
        ${dugmeZelje(p)}
        <div class="product-thumb" aria-hidden="true"><span class="product-emoji">${p.emoji}</span></div>
        <p class="product-meta">${escapeHtml(nazivKategorije(p.kategorija))} · ${escapeHtml(nazivPotkategorije(p.potkategorija))}</p>
        <h3><a class="product-link" href="${urlProizvoda(p)}">${escapeHtml(p.naziv)}</a></h3>
        <div class="product-rating">${zvezdice(p.ocena)}<span class="rating-count">(${p.brojRecenzija})</span>${p.naStanju <= 3 ? `<span class="stock-mini ${stanje.klasa}">${stanje.tekst}</span>` : ''}</div>
        <p class="product-desc">${escapeHtml(p.kratakOpis)}</p>
        <div class="product-row">
          <span class="price-block">${cenaHtml(p)}</span>
          ${dugme}
        </div>
      </article>`;
  }

  /** Traka „Još X din do besplatne dostave”. */
  function trakaDostave(obr) {
    const poruka = obr.besplatnaDostava
      ? '<strong>Besplatna dostava je tvoja!</strong> 🎉'
      : `Još <strong>${formatCena(obr.doBesplatne)}</strong> do besplatne dostave`;
    return `
      <div class="ship-bar${obr.besplatnaDostava ? ' is-free' : ''}">
        <p class="ship-text">${poruka}</p>
        <div class="ship-track" role="progressbar" aria-label="Napredak do besplatne dostave" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${obr.procenatDoBesplatne}">
          <span class="ship-fill" style="width:${obr.procenatDoBesplatne}%"></span>
        </div>
      </div>`;
  }

  /** Birač količine za stavku korpe (radi preko delegiranih događaja ispod). */
  function biracKolicine(p, kolicina) {
    const naziv = escapeHtml(p.naziv);
    return `
      <div class="qty" role="group" aria-label="Količina: ${naziv}">
        <button type="button" class="qty-btn" data-korpa-minus="${p.id}" aria-label="Smanji količinu: ${naziv}">${IKONE.minus}</button>
        <input class="qty-input" type="number" inputmode="numeric" min="1" max="${p.naStanju}" value="${kolicina}" data-korpa-input="${p.id}" aria-label="Količina: ${naziv}">
        <button type="button" class="qty-btn" data-korpa-plus="${p.id}" aria-label="Povećaj količinu: ${naziv}" ${kolicina >= p.naStanju ? 'disabled' : ''}>${IKONE.plus}</button>
      </div>`;
  }

  /** Kartica saveta (početna i saveti.html). */
  const sviSaveti = (typeof SAVETI !== 'undefined' && Array.isArray(SAVETI)) ? SAVETI : [];
  const urlSaveta = (s) => `saveti.html?id=${encodeURIComponent(s.id)}`;

  function karticaSaveta(s, indeks = 0) {
    return `
      <article class="tip-card" data-kat="${escapeHtml(s.kategorija)}" style="--i:${indeks}">
        <div class="tip-thumb" aria-hidden="true"><span>${s.emoji}</span></div>
        <div class="tip-body">
          <div class="tip-meta">
            <span class="tip-pill">${escapeHtml(nazivKategorije(s.kategorija))}</span>
            <time datetime="${isoDatum(s.datum)}">${formatDatum(s.datum)}</time>
            <span>· ${s.vremeCitanja} min čitanja</span>
          </div>
          <h3><a class="tip-link" href="${urlSaveta(s)}">${escapeHtml(s.naslov)}</a></h3>
          <p>${escapeHtml(s.uvod)}</p>
          <span class="tip-more" aria-hidden="true">Pročitaj savet <span>→</span></span>
        </div>
      </article>`;
  }

  /** Saveti od najnovijeg ka starijem. */
  const saveti = () => sviSaveti.slice().sort((a, b) => uDatum(b.datum) - uDatum(a.datum));

  /** Zajednička logika za izdvojene proizvode: novo ili na popustu, na stanju, raznovrsno po kategorijama. */
  function izdvojeniProizvodi(broj = 8) {
    const kandidati = proizvodi.filter(p => (p.novo || procenatPopusta(p) > 0) && p.naStanju > 0);
    const poKategoriji = {};
    kandidati.forEach(p => { (poKategoriji[p.kategorija] = poKategoriji[p.kategorija] || []).push(p); });
    const redovi = Object.values(poKategoriji);
    const izbor = [];
    // „Round-robin“: po jedan iz svake kategorije dok ne skupimo dovoljno
    for (let i = 0; izbor.length < broj && redovi.some(r => r[i]); i++) {
      redovi.forEach(r => { if (r[i] && izbor.length < broj) izbor.push(r[i]); });
    }
    return izbor;
  }


  /* =======================================================
     8. TOAST PORUKE I ANIMACIJE
     ======================================================= */

  let toastTimer = null;

  /** Kratka poruka na dnu ekrana. tip: 'uspeh' | 'info' | 'greska' */
  function toast(poruka, tip = 'uspeh') {
    const el = document.getElementById('toast');
    if (!el) return;
    const ikona = { uspeh: '✓', info: '♥', greska: '!' }[tip] || '✓';
    el.className = 'toast toast-' + tip;
    el.innerHTML = `<span class="toast-icon" aria-hidden="true">${ikona}</span><span>${escapeHtml(poruka)}</span>`;
    // ponovno pokretanje animacije
    void el.offsetWidth;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2600);
  }

  /** Kratko „poskočí” element (npr. brojač korpe). */
  function poskoci(el, klasa = 'bump') {
    if (!el) return;
    el.classList.remove(klasa);
    void el.offsetWidth;
    el.classList.add(klasa);
    setTimeout(() => el.classList.remove(klasa), 600);
  }

  /**
   * Animacija „leti u korpu”: emoji proizvoda leti lukom od dugmeta do ikonice korpe.
   * Koristi Web Animations API; bez animacija samo protrese ikonicu.
   */
  function letiUKorpu(izvor, emoji) {
    const cilj = document.getElementById('cartBtn');
    if (!cilj) return;
    const zavrsi = () => { poskoci(cilj, 'is-shaking'); poskoci(document.getElementById('cartCount')); };

    if (manjeAnimacija() || !izvor || typeof izvor.getBoundingClientRect !== 'function' || !document.body.animate) {
      zavrsi();
      return;
    }
    const a = izvor.getBoundingClientRect();
    const b = cilj.getBoundingClientRect();
    const letac = document.createElement('span');
    letac.className = 'fly-emoji';
    letac.textContent = emoji || '🐾';
    letac.setAttribute('aria-hidden', 'true');
    letac.style.left = (a.left + a.width / 2) + 'px';
    letac.style.top = (a.top + a.height / 2) + 'px';
    document.body.appendChild(letac);

    const dx = (b.left + b.width / 2) - (a.left + a.width / 2);
    const dy = (b.top + b.height / 2) - (a.top + a.height / 2);
    const animacija = letac.animate([
      { transform: 'translate(-50%,-50%) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${dx * 0.45}px), calc(-50% + ${dy * 0.45 - 120}px)) scale(1.5) rotate(-18deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.35) rotate(20deg)`, opacity: 0.6 }
    ], { duration: 780, easing: 'cubic-bezier(.45,.05,.4,1)' });
    animacija.onfinish = () => { letac.remove(); zavrsi(); };
  }

  /** Mali prasak srdašca kada se proizvod doda u listu želja. */
  function prasakSrca(dugme) {
    if (!dugme) return;
    poskoci(dugme, 'is-pop');
    if (manjeAnimacija()) return;
    const r = dugme.getBoundingClientRect();
    for (let i = 0; i < 7; i++) {
      const cestica = document.createElement('span');
      cestica.className = 'heart-particle';
      cestica.textContent = '♥';
      cestica.setAttribute('aria-hidden', 'true');
      cestica.style.left = (r.left + r.width / 2) + 'px';
      cestica.style.top = (r.top + r.height / 2) + 'px';
      const ugao = (Math.PI * 2 * i) / 7 - Math.PI / 2;
      cestica.style.setProperty('--dx', Math.cos(ugao) * 34 + 'px');
      cestica.style.setProperty('--dy', Math.sin(ugao) * 34 + 'px');
      document.body.appendChild(cestica);
      setTimeout(() => cestica.remove(), 700);
    }
  }


  /* =======================================================
     9. BOČNI PANELI (mini korpa i lista želja)
     ======================================================= */

  let otvorenPanel = null;
  let okidacPanela = null;

  const FOKUSABILNI = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

  function otvoriPanel(id, okidac) {
    const panel = document.getElementById(id);
    const overlay = document.getElementById('drawerOverlay');
    if (!panel) return;
    if (otvorenPanel && otvorenPanel !== panel) zatvoriPanel(false);

    renderPanela();
    okidacPanela = okidac || document.activeElement;
    otvorenPanel = panel;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    if (overlay) overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
    if (okidac) okidac.setAttribute('aria-expanded', 'true');

    const zatvori = panel.querySelector('[data-close-drawer]');
    // fokus posle početka animacije, da pregledač ne skroluje
    setTimeout(() => (zatvori || panel).focus({ preventScroll: true }), 60);
  }

  function zatvoriPanel(vratiFokus = true) {
    if (!otvorenPanel) return;
    const overlay = document.getElementById('drawerOverlay');
    otvorenPanel.classList.remove('is-open');
    otvorenPanel.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    document.querySelectorAll('[data-open-drawer]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    otvorenPanel = null;
    if (vratiFokus && okidacPanela && document.contains(okidacPanela)) okidacPanela.focus({ preventScroll: true });
    okidacPanela = null;
  }

  /** Fokus ostaje unutar otvorenog panela (Tab / Shift+Tab). */
  function zadrziFokus(e) {
    if (!otvorenPanel || e.key !== 'Tab') return;
    const elementi = Array.from(otvorenPanel.querySelectorAll(FOKUSABILNI)).filter(el => el.offsetParent !== null);
    if (!elementi.length) return;
    const prvi = elementi[0];
    const poslednji = elementi[elementi.length - 1];
    if (e.shiftKey && (document.activeElement === prvi || document.activeElement === otvorenPanel)) {
      e.preventDefault(); poslednji.focus();
    } else if (!e.shiftKey && document.activeElement === poslednji) {
      e.preventDefault(); prvi.focus();
    }
  }

  function renderMiniKorpe() {
    const telo = document.getElementById('cartDrawerBody');
    const dno = document.getElementById('cartDrawerFoot');
    if (!telo || !dno) return;
    const obr = obracun();

    if (!obr.stavke.length) {
      telo.innerHTML = `
        <div class="drawer-empty">
          <span class="drawer-empty-emoji" aria-hidden="true">🧺</span>
          <p>Korpa je prazna.<br>Hajde da je napunimo nečim lepim!</p>
          <a href="prodavnica.html" class="btn btn-primary btn-small">Idi u prodavnicu</a>
        </div>`;
      dno.innerHTML = '';
      return;
    }

    telo.innerHTML = trakaDostave(obr) + '<ul class="drawer-list">' + obr.stavke.map((s, i) => `
      <li class="drawer-item" style="--i:${i}">
        <a href="${urlProizvoda(s.proizvod)}" class="drawer-thumb" aria-hidden="true" tabindex="-1">${s.proizvod.emoji}</a>
        <div class="drawer-info">
          <a href="${urlProizvoda(s.proizvod)}" class="drawer-name">${escapeHtml(s.proizvod.naziv)}</a>
          <span class="drawer-price">${formatCena(s.proizvod.cena)}</span>
          ${biracKolicine(s.proizvod, s.kolicina)}
        </div>
        <div class="drawer-side">
          <span class="drawer-line">${formatCena(s.iznos)}</span>
          <button type="button" class="link-btn" data-korpa-ukloni="${s.proizvod.id}" aria-label="Ukloni iz korpe: ${escapeHtml(s.proizvod.naziv)}">${IKONE.kanta}</button>
        </div>
      </li>`).join('') + '</ul>';

    dno.innerHTML = `
      <div class="drawer-total"><span>Međuzbir (${brojProizvoda(obr.brojKomada)})</span><strong>${formatCena(obr.medjuzbir)}</strong></div>
      <p class="drawer-note">Dostava i kuponi se obračunavaju u korpi.</p>
      <a href="korpa.html" class="btn btn-primary btn-block">Idi u korpu</a>
      <button type="button" class="btn btn-ghost btn-block" data-close-drawer>Nastavi kupovinu</button>`;
  }

  function renderListeZelja() {
    const telo = document.getElementById('wishDrawerBody');
    const dno = document.getElementById('wishDrawerFoot');
    if (!telo || !dno) return;
    const zelje = ucitajZelje().map(nadjiProizvod);

    if (!zelje.length) {
      telo.innerHTML = `
        <div class="drawer-empty">
          <span class="drawer-empty-emoji" aria-hidden="true">💛</span>
          <p>Lista želja je prazna.<br>Klikni na srce na proizvodu da ga sačuvaš za kasnije.</p>
          <a href="prodavnica.html" class="btn btn-primary btn-small">Pogledaj proizvode</a>
        </div>`;
      dno.innerHTML = '';
      return;
    }

    telo.innerHTML = '<ul class="drawer-list">' + zelje.map((p, i) => `
      <li class="drawer-item" style="--i:${i}">
        <a href="${urlProizvoda(p)}" class="drawer-thumb" aria-hidden="true" tabindex="-1">${p.emoji}</a>
        <div class="drawer-info">
          <a href="${urlProizvoda(p)}" class="drawer-name">${escapeHtml(p.naziv)}</a>
          <span class="drawer-price">${cenaHtml(p)}</span>
          ${p.naStanju > 0
            ? `<button type="button" class="btn btn-small btn-soft" data-dodaj="${p.id}">${IKONE.korpa} U korpu<span class="visually-hidden">: ${escapeHtml(p.naziv)}</span></button>`
            : '<span class="stock-mini stock-out">Nema na stanju</span>'}
        </div>
        <div class="drawer-side">
          <button type="button" class="link-btn" data-zelja="${p.id}" data-zelja-ukloni aria-label="Ukloni iz liste želja: ${escapeHtml(p.naziv)}">${IKONE.kanta}</button>
        </div>
      </li>`).join('') + '</ul>';

    dno.innerHTML = `<button type="button" class="btn btn-ghost btn-block" data-close-drawer>Nastavi kupovinu</button>`;
  }

  function renderPanela() {
    renderMiniKorpe();
    renderListeZelja();
  }


  /* =======================================================
     10. HEADER, MENI, BACK-TO-TOP, OTKRIVANJE
     ======================================================= */

  /** Brojevi na ikonicama korpe i liste želja + aria opisi. */
  function osveziBrojace() {
    const nKorpa = brojUKorpi();
    const nZelje = ucitajZelje().length;
    const cartCount = document.getElementById('cartCount');
    const wishCount = document.getElementById('wishCount');
    const cartBtn = document.getElementById('cartBtn');
    const wishBtn = document.getElementById('wishBtn');
    if (cartCount) { cartCount.textContent = String(nKorpa); cartCount.classList.toggle('is-empty', nKorpa === 0); }
    if (wishCount) { wishCount.textContent = String(nZelje); wishCount.classList.toggle('is-empty', nZelje === 0); }
    if (cartBtn) cartBtn.setAttribute('aria-label', `Korpa, ${brojProizvoda(nKorpa)}`);
    if (wishBtn) wishBtn.setAttribute('aria-label', `Lista želja, ${brojProizvoda(nZelje)}`);
  }

  /** Sinhronizuje sva srca na stranici sa listom želja. */
  function osveziSrca() {
    const zelje = ucitajZelje().map(String);
    document.querySelectorAll('[data-zelja]:not([data-zelja-ukloni])').forEach(b => {
      const uListi = zelje.includes(String(b.dataset.zelja));
      b.setAttribute('aria-pressed', String(uListi));
      b.title = uListi ? 'Ukloni iz liste želja' : 'Dodaj u listu želja';
      const tekst = b.querySelector('[data-zelja-tekst]');
      if (tekst) tekst.textContent = uListi ? 'Na listi želja' : 'Dodaj u listu želja';
    });
  }

  /** Označava aktivni link u navigaciji na osnovu imena fajla. */
  function oznaciAktivniLink() {
    let fajl = window.location.pathname.split('/').pop() || 'index.html';
    if (!fajl.includes('.')) fajl = 'index.html';
    // proizvod pripada prodavnici, korpa/plaćanje/potvrda nemaju link u meniju
    const mapa = { 'proizvod.html': 'prodavnica.html' };
    const cilj = mapa[fajl] || fajl;
    document.querySelectorAll('.main-nav a').forEach(a => {
      const href = (a.getAttribute('href') || '').split('#')[0].split('?')[0];
      if (href === cilj && !(a.getAttribute('href') || '').includes('#')) a.setAttribute('aria-current', 'page');
    });
  }

  function pokreniHeader() {
    const header = document.getElementById('siteHeader');
    const backToTop = document.getElementById('backToTop');
    const naSkrol = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle('is-scrolled', y > 12);
      if (backToTop) backToTop.classList.toggle('is-visible', y > 480);
    };
    window.addEventListener('scroll', naSkrol, { passive: true });
    naSkrol();

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: manjeAnimacija() ? 'auto' : 'smooth' });
      });
    }

    // Mobilni meni
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    if (toggle && nav) {
      const zatvoriMeni = () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Otvori meni');
      };
      toggle.addEventListener('click', () => {
        const otvoren = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(otvoren));
        toggle.setAttribute('aria-label', otvoren ? 'Zatvori meni' : 'Otvori meni');
      });
      nav.querySelectorAll('a').forEach(a => a.addEventListener('click', zatvoriMeni));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) { zatvoriMeni(); toggle.focus(); }
      });
      document.addEventListener('click', (e) => {
        if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) zatvoriMeni();
      });
    }

    const godina = document.getElementById('year');
    if (godina) godina.textContent = new Date().getFullYear();

    oznaciAktivniLink();
  }

  /**
   * Otkrivanje pri skrolu.
   * .reveal          — element se pojavljuje odozdo
   * .reveal-stagger  — deca se pojavljuju jedno za drugim
   */
  let posmatrac = null;

  function otkrivaj(koren = document) {
    const elementi = koren.querySelectorAll('.reveal:not(.is-visible), .reveal-stagger:not(.is-visible)');
    elementi.forEach(el => {
      if (el.classList.contains('reveal-stagger')) {
        Array.from(el.children).forEach((dete, i) => dete.style.setProperty('--i', i));
      }
    });
    if (!('IntersectionObserver' in window) || manjeAnimacija()) {
      elementi.forEach(el => el.classList.add('is-visible'));
      return;
    }
    if (!posmatrac) {
      posmatrac = new IntersectionObserver((unosi) => {
        unosi.forEach(unos => {
          if (unos.isIntersecting) {
            unos.target.classList.add('is-visible');
            posmatrac.unobserve(unos.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    elementi.forEach(el => posmatrac.observe(el));
  }


  /* =======================================================
     11. NEWSLETTER (pamti prijavu)
     ======================================================= */

  const emailIspravan = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

  function pokreniNewsletter() {
    const forma = document.getElementById('newsletterForm');
    if (!forma) return;
    const polje = document.getElementById('newsletterEmail');
    const poruka = document.getElementById('newsletterMsg');

    const prikaziPrijavljen = (email) => {
      forma.classList.add('is-subscribed');
      forma.innerHTML = `
        <p class="newsletter-done" role="status">
          <span class="newsletter-check" aria-hidden="true">✓</span>
          <span>Prijavljen/a si kao <strong>${escapeHtml(email)}</strong>.<br>Tvoj kod za popust: <code class="coupon-code">SAPA10</code></span>
        </p>`;
    };

    const sacuvan = skladiste.ucitaj(KLJUCEVI.newsletter, null);
    if (sacuvan && sacuvan.email) { prikaziPrijavljen(sacuvan.email); return; }

    forma.addEventListener('submit', (e) => {
      e.preventDefault();
      const vrednost = polje.value.trim();
      if (!emailIspravan(vrednost)) {
        poruka.textContent = 'Unesi ispravnu email adresu, npr. ime@primer.com.';
        polje.setAttribute('aria-invalid', 'true');
        poskoci(forma, 'is-shaking');
        polje.focus();
        return;
      }
      skladiste.sacuvaj(KLJUCEVI.newsletter, { email: vrednost, datum: isoDatum(new Date()) });
      toast('Hvala na prijavi! Kod SAPA10 je tvoj.');
      prikaziPrijavljen(vrednost);
    });
    polje.addEventListener('input', () => {
      polje.removeAttribute('aria-invalid');
      poruka.textContent = '';
    });
  }


  /* =======================================================
     12. VALIDACIJA FORMI
     Korišćenje:
       const v = Sapa.validacija(forma, {
         ime: (vrednost) => vrednost ? '' : 'Unesi ime.',
         ...
       });
       if (v.proveriSve()) { ... }
     Polje mora imati name, a poruka o grešci element #greska-<name>.
     ======================================================= */

  const PROVERE = {
    obavezno: (v) => String(v).trim().length > 0,
    ime: (v) => /^[A-Za-zČĆŽŠĐčćžšđ][A-Za-zČĆŽŠĐčćžšđ' -]{1,49}$/.test(String(v).trim()),
    email: emailIspravan,
    /* Srpski brojevi: 06x… (mobilni) ili 0xx… (fiksni), uz +381 ili 00381 umesto nule. */
    telefon: (v) => /^(?:\+381|00381|0)(?:6\d|[1-3]\d)\d{6,7}$/.test(String(v).replace(/[\s\-\/().]/g, '')),
    postanskiBroj: (v) => /^\d{5}$/.test(String(v).trim())
  };

  function validacija(forma, pravila) {
    const dotaknuto = new Set();

    const polja = (ime) => Array.from(forma.elements).filter(el => el.name === ime);

    const vrednost = (ime) => {
      const el = polja(ime);
      if (!el.length) return '';
      if (el[0].type === 'radio') { const izabran = el.find(r => r.checked); return izabran ? izabran.value : ''; }
      if (el[0].type === 'checkbox') return el[0].checked;
      return el[0].value;
    };

    function proveriPolje(ime) {
      const greska = pravila[ime](vrednost(ime), forma) || '';
      const el = polja(ime);
      const porukaEl = document.getElementById('greska-' + ime);
      el.forEach(e => {
        if (greska) e.setAttribute('aria-invalid', 'true');
        else e.removeAttribute('aria-invalid');
      });
      const omotac = el[0] && el[0].closest('.field, fieldset');
      if (omotac) {
        omotac.classList.toggle('has-error', !!greska);
        omotac.classList.toggle('is-valid', !greska && String(vrednost(ime)).trim() !== '');
      }
      if (porukaEl) porukaEl.textContent = greska;
      return !greska;
    }

    function proveriSve() {
      let prvoNeispravno = null;
      Object.keys(pravila).forEach(ime => {
        dotaknuto.add(ime);
        if (!proveriPolje(ime) && !prvoNeispravno) prvoNeispravno = polja(ime)[0];
      });
      if (prvoNeispravno) {
        prvoNeispravno.focus();
        const omotac = prvoNeispravno.closest('.field, fieldset');
        poskoci(omotac, 'is-shaking');
      }
      return !prvoNeispravno;
    }

    // Provera pri napuštanju polja; dok kuca, samo ako je polje već prijavilo grešku.
    Object.keys(pravila).forEach(ime => {
      polja(ime).forEach(el => {
        el.addEventListener('blur', () => {
          if (el.type === 'radio') return;
          if (String(el.value).trim() !== '' || dotaknuto.has(ime)) { dotaknuto.add(ime); proveriPolje(ime); }
        });
        el.addEventListener(el.type === 'radio' || el.type === 'checkbox' ? 'change' : 'input', () => {
          if (dotaknuto.has(ime) || el.type === 'radio') proveriPolje(ime);
        });
      });
    });

    return { proveriSve, proveriPolje, vrednost };
  }


  /* =======================================================
     13. POKRETANJE I DELEGIRANI DOGAĐAJI
     ======================================================= */

  function naKlik(e) {
    const t = e.target;

    // Dodaj u korpu (bilo gde na sajtu)
    const dodaj = t.closest('[data-dodaj]');
    if (dodaj && !dodaj.disabled) {
      const p = nadjiProizvod(dodaj.dataset.dodaj);
      const rezultat = dodajUKorpu(dodaj.dataset.dodaj, dodaj.dataset.kolicina || 1);
      toast(rezultat.poruka, rezultat.ok ? 'uspeh' : 'greska');
      if (rezultat.ok) {
        const kartica = dodaj.closest('.product-card, .pd-layout');
        const izvor = (kartica && kartica.querySelector('.product-emoji, .pd-emoji')) || dodaj;
        letiUKorpu(izvor, p && p.emoji);
        poskoci(dodaj, 'is-added');
      }
      return;
    }

    // Srce (lista želja)
    const zelja = t.closest('[data-zelja]');
    if (zelja) {
      const p = nadjiProizvod(zelja.dataset.zelja);
      const sada = prebaciZelju(zelja.dataset.zelja);
      if (sada) prasakSrca(zelja);
      toast(sada ? `Sačuvano u listu želja: ${p.naziv}` : 'Uklonjeno iz liste želja.', 'info');
      return;
    }

    // Količine u korpi
    const minus = t.closest('[data-korpa-minus]');
    if (minus) {
      const stavka = ucitajKorpu().find(s => String(s.id) === minus.dataset.korpaMinus);
      if (stavka) {
        if (stavka.kolicina <= 1) {
          ukloniIzKorpe(stavka.id);
          toast('Proizvod je uklonjen iz korpe.', 'info');
        } else postaviKolicinu(stavka.id, stavka.kolicina - 1);
      }
      return;
    }
    const plus = t.closest('[data-korpa-plus]');
    if (plus) {
      const stavka = ucitajKorpu().find(s => String(s.id) === plus.dataset.korpaPlus);
      const p = nadjiProizvod(plus.dataset.korpaPlus);
      if (stavka && p) {
        if (stavka.kolicina >= p.naStanju) toast(`Na stanju je samo ${p.naStanju} kom.`, 'greska');
        else postaviKolicinu(stavka.id, stavka.kolicina + 1);
      }
      return;
    }
    const ukloni = t.closest('[data-korpa-ukloni]');
    if (ukloni) {
      const p = nadjiProizvod(ukloni.dataset.korpaUkloni);
      ukloniIzKorpe(ukloni.dataset.korpaUkloni);
      toast(p ? `Uklonjeno iz korpe: ${p.naziv}` : 'Uklonjeno iz korpe.', 'info');
      return;
    }

    // Paneli
    const otvori = t.closest('[data-open-drawer]');
    if (otvori) { e.preventDefault(); otvoriPanel(otvori.dataset.openDrawer, otvori); return; }
    if (t.closest('[data-close-drawer]') || t.id === 'drawerOverlay') { zatvoriPanel(); }
  }

  function naPromenuKolicine(e) {
    const polje = e.target.closest('[data-korpa-input]');
    if (!polje) return;
    const p = nadjiProizvod(polje.dataset.korpaInput);
    const n = Math.floor(Number(polje.value));
    if (p && n > p.naStanju) toast(`Na stanju je samo ${p.naStanju} kom.`, 'greska');
    postaviKolicinu(polje.dataset.korpaInput, isNaN(n) || n < 1 ? 1 : n);
  }

  /** Pamti fokus u panelu pre ponovnog iscrtavanja, da tastatura ne „izgubi” mesto. */
  function osveziPanelSaFokusom() {
    if (!otvorenPanel) { renderPanela(); return; }
    const aktivni = document.activeElement;
    const atributi = ['data-korpa-minus', 'data-korpa-plus', 'data-korpa-input', 'data-korpa-ukloni', 'data-dodaj', 'data-zelja'];
    let selektor = null;
    if (aktivni && otvorenPanel.contains(aktivni)) {
      const atr = atributi.find(a => aktivni.hasAttribute(a));
      if (atr) selektor = `[${atr}="${aktivni.getAttribute(atr)}"]`;
    }
    renderPanela();
    if (selektor) {
      const novi = otvorenPanel.querySelector(selektor);
      (novi || otvorenPanel.querySelector('[data-close-drawer]') || otvorenPanel).focus({ preventScroll: true });
    }
  }

  function pokreni() {
    pokreniHeader();
    pokreniNewsletter();
    osveziBrojace();
    renderPanela();
    otkrivaj();

    document.addEventListener('click', naKlik);
    document.addEventListener('change', naPromenuKolicine);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && otvorenPanel) zatvoriPanel();
      zadrziFokus(e);
    });

    document.addEventListener('sapa:promena', () => {
      osveziBrojace();
      osveziSrca();
      osveziPanelSaFokusom();
    });

    // Promene iz drugog taba (npr. korpa otvorena u dva prozora)
    window.addEventListener('storage', (e) => {
      if (Object.values(KLJUCEVI).includes(e.key)) javi('spolja');
    });

    // Kad se stranica vrati iz keša (dugme Nazad), podaci su možda zastareli
    window.addEventListener('pageshow', (e) => { if (e.persisted) javi('spolja'); });

    document.documentElement.classList.add('js-ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pokreni);
  else pokreni();


  /* =======================================================
     JAVNI API
     ======================================================= */
  window.Sapa = {
    KLJUCEVI, DOSTAVA, KUPONI,
    skladiste,
    formatCena, formatDecimal, formatDatum, isoDatum, dodajRadneDane, mnozina, brojProizvoda,
    escapeHtml, normalizuj, parametri, azurirajUrl, manjeAnimacija,
    proizvodi, kategorije, potkategorije,
    nadjiProizvod, procenatPopusta, nazivKategorije, nazivPotkategorije, urlProizvoda, izdvojeniProizvodi,
    ucitajKorpu, dodajUKorpu, postaviKolicinu, ukloniIzKorpe, isprazniKorpu, brojUKorpi, stavkeKorpe,
    proveriKupon, primeniKupon, ukloniKupon, obracun,
    ucitajZelje, jeUZeljama, prebaciZelju,
    saveti, urlSaveta, karticaSaveta,
    IKONE, zvezdice, stanjeProizvoda, cenaHtml, oznakeHtml, dugmeZelje, karticaProizvoda, trakaDostave, biracKolicine,
    toast, poskoci, letiUKorpu, prasakSrca,
    otvoriPanel, zatvoriPanel, otkrivaj,
    PROVERE, validacija
  };
})();
