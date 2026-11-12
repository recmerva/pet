/* =========================================================
   ŠAPA — prodavnica (katalog)
   Filteri: kategorija, potkategorija, cena od–do, samo na stanju,
   samo popust, pretraga po nazivu (uživo) i sortiranje.
   Stanje filtera se čuva u URL-u da bi link mogao da se podeli:
   prodavnica.html?kategorija=psi&potkategorija=hrana&min=500&max=3000
                  &stanje=1&popust=1&q=kavez&sort=cena-rastuce
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const S = window.Sapa;

  const el = {
    grid: document.getElementById('shopGrid'),
    prazno: document.getElementById('shopEmpty'),
    brojac: document.getElementById('resultsCount'),
    cipovi: document.getElementById('activeChips'),
    katList: document.getElementById('katList'),
    potkatList: document.getElementById('potkatList'),
    cenaOd: document.getElementById('cenaOd'),
    cenaDo: document.getElementById('cenaDo'),
    cenaHint: document.getElementById('cenaHint'),
    stanje: document.getElementById('samoStanje'),
    popust: document.getElementById('samoPopust'),
    pretraga: document.getElementById('pretraga'),
    obrisiPretragu: document.getElementById('searchClear'),
    sort: document.getElementById('sortiranje'),
    reset: document.getElementById('resetFilters'),
    praznoReset: document.getElementById('emptyReset'),
    naslov: document.getElementById('shopTitle'),
    uvod: document.getElementById('shopLead'),
    mrvica: document.getElementById('crumbCurrent'),
    panel: document.getElementById('filters'),
    otvoriPanel: document.getElementById('filtersToggle'),
    zatvoriPanel: document.getElementById('filtersClose'),
    brojAktivnih: document.getElementById('activeCount'),
    overlay: document.getElementById('drawerOverlay')
  };
  if (!el.grid) return;

  const SORTIRANJA = ['preporuceno', 'cena-rastuce', 'cena-opadajuce', 'ocena', 'najnovije'];
  const cene = S.proizvodi.map(p => p.cena);
  const najnizaCena = Math.min(...cene);
  const najvisaCena = Math.max(...cene);
  el.cenaOd.placeholder = `od ${najnizaCena}`;
  el.cenaDo.placeholder = `do ${najvisaCena}`;

  /* ---------- Stanje filtera ---------- */
  const PRAZNO = { kategorija: '', potkategorija: '', q: '', min: null, max: null, stanje: false, popust: false, sort: 'preporuceno' };
  let filteri = procitajIzUrl();

  /** Čita filtere iz adrese i odbacuje nevažeće vrednosti. */
  function procitajIzUrl() {
    const p = S.parametri();
    const broj = (v) => {
      if (v === null || v === '') return null;
      const n = Math.floor(Number(v));
      return isNaN(n) || n < 0 ? null : n;
    };
    return {
      kategorija: S.kategorije[p.get('kategorija')] ? p.get('kategorija') : '',
      potkategorija: S.potkategorije[p.get('potkategorija')] ? p.get('potkategorija') : '',
      q: (p.get('q') || '').slice(0, 60),
      min: broj(p.get('min')),
      max: broj(p.get('max')),
      stanje: p.get('stanje') === '1',
      popust: p.get('popust') === '1',
      sort: SORTIRANJA.includes(p.get('sort')) ? p.get('sort') : 'preporuceno'
    };
  }

  /** Upisuje filtere u adresu (prazne vrednosti se izostavljaju). */
  function upisiUUrl() {
    const p = new URLSearchParams();
    if (filteri.kategorija) p.set('kategorija', filteri.kategorija);
    if (filteri.potkategorija) p.set('potkategorija', filteri.potkategorija);
    if (filteri.q) p.set('q', filteri.q);
    if (filteri.min !== null) p.set('min', filteri.min);
    if (filteri.max !== null) p.set('max', filteri.max);
    if (filteri.stanje) p.set('stanje', '1');
    if (filteri.popust) p.set('popust', '1');
    if (filteri.sort !== 'preporuceno') p.set('sort', filteri.sort);
    S.azurirajUrl(p);
  }

  /* ---------- Filtriranje i sortiranje ---------- */

  /** Vraća proizvode koji prolaze filtere; `osim` preskače jedan filter (za brojeve pored opcija). */
  function filtriraj(f, osim = '') {
    const reci = S.normalizuj(f.q).split(/\s+/).filter(Boolean);
    let od = f.min, doCene = f.max;
    if (od !== null && doCene !== null && od > doCene) [od, doCene] = [doCene, od];

    return S.proizvodi.filter(p => {
      if (osim !== 'kategorija' && f.kategorija && p.kategorija !== f.kategorija) return false;
      if (osim !== 'potkategorija' && f.potkategorija && p.potkategorija !== f.potkategorija) return false;
      if (od !== null && p.cena < od) return false;
      if (doCene !== null && p.cena > doCene) return false;
      if (f.stanje && p.naStanju <= 0) return false;
      if (f.popust && !S.procenatPopusta(p)) return false;
      if (reci.length) {
        const naziv = S.normalizuj(p.naziv);
        if (!reci.every(r => naziv.includes(r))) return false;
      }
      return true;
    });
  }

  /** „Preporučeno”: ocena ponderisana brojem recenzija, plus novo i popust; rasprodato na kraj. */
  const preporuka = (p) =>
    (p.naStanju > 0 ? 100 : 0) + p.ocena * Math.log10(p.brojRecenzija + 1) + (p.novo ? 0.6 : 0) + (S.procenatPopusta(p) ? 0.5 : 0);

  function sortiraj(lista, nacin) {
    const kopija = lista.slice();
    const poredjenja = {
      'preporuceno': (a, b) => preporuka(b) - preporuka(a),
      'cena-rastuce': (a, b) => a.cena - b.cena,
      'cena-opadajuce': (a, b) => b.cena - a.cena,
      'ocena': (a, b) => b.ocena - a.ocena || b.brojRecenzija - a.brojRecenzija,
      'najnovije': (a, b) => new Date(b.dodato) - new Date(a.dodato)
    };
    return kopija.sort(poredjenja[nacin] || poredjenja.preporuceno);
  }

  /* ---------- Iscrtavanje ---------- */

  function opcija(ime, vrednost, tekst, broj, izabrano, emoji = '') {
    const id = `${ime}-${vrednost || 'sve'}`;
    return `
      <label class="choice" for="${id}">
        <input type="radio" name="${ime}" id="${id}" value="${vrednost}" ${izabrano ? 'checked' : ''}>
        <span>${emoji ? `<span aria-hidden="true">${emoji}</span> ` : ''}${S.escapeHtml(tekst)}</span>
        <span class="count" aria-label="${S.brojProizvoda(broj)}">${broj}</span>
      </label>`;
  }

  /** Liste kategorija i potkategorija sa brojem proizvoda uz ostale aktivne filtere. */
  function iscrtajOpcije() {
    const zaKat = filtriraj(filteri, 'kategorija');
    el.katList.innerHTML = opcija('kategorija', '', 'Sve vrste', zaKat.length, !filteri.kategorija, '🐾') +
      Object.entries(S.kategorije).map(([k, v]) =>
        opcija('kategorija', k, v.naziv, zaKat.filter(p => p.kategorija === k).length, filteri.kategorija === k, v.emoji)
      ).join('');

    const zaPotkat = filtriraj(filteri, 'potkategorija');
    el.potkatList.innerHTML = opcija('potkategorija', '', 'Sve', zaPotkat.length, !filteri.potkategorija) +
      Object.entries(S.potkategorije).map(([k, naziv]) =>
        opcija('potkategorija', k, naziv, zaPotkat.filter(p => p.potkategorija === k).length, filteri.potkategorija === k)
      ).join('');
  }

  /** Popunjava polja forme iz stanja (pri učitavanju i resetovanju). */
  function popuniPolja() {
    el.cenaOd.value = filteri.min !== null ? filteri.min : '';
    el.cenaDo.value = filteri.max !== null ? filteri.max : '';
    el.stanje.checked = filteri.stanje;
    el.popust.checked = filteri.popust;
    el.pretraga.value = filteri.q;
    el.obrisiPretragu.hidden = !filteri.q;
    el.sort.value = filteri.sort;
  }

  /** „Čipovi” aktivnih filtera — klik uklanja filter. */
  function iscrtajCipove() {
    const lista = [];
    if (filteri.kategorija) lista.push(['kategorija', S.nazivKategorije(filteri.kategorija)]);
    if (filteri.potkategorija) lista.push(['potkategorija', S.nazivPotkategorije(filteri.potkategorija)]);
    if (filteri.min !== null || filteri.max !== null) {
      const od = filteri.min !== null ? S.formatCena(filteri.min) : S.formatCena(najnizaCena);
      const doC = filteri.max !== null ? S.formatCena(filteri.max) : S.formatCena(najvisaCena);
      lista.push(['cena', `${od} – ${doC}`]);
    }
    if (filteri.stanje) lista.push(['stanje', 'Na stanju']);
    if (filteri.popust) lista.push(['popust', 'Na popustu']);
    if (filteri.q) lista.push(['q', `„${filteri.q}”`]);

    el.cipovi.innerHTML = lista.map(([kljuc, tekst]) =>
      `<button type="button" class="chip" data-ukloni-filter="${kljuc}" aria-label="Ukloni filter: ${S.escapeHtml(tekst)}">${S.escapeHtml(tekst)} <span aria-hidden="true">×</span></button>`
    ).join('');

    const aktivnih = lista.length;
    el.brojAktivnih.textContent = aktivnih ? `(${aktivnih})` : '';
    el.reset.disabled = aktivnih === 0;
  }

  /** Naslov stranice prati izabranu kategoriju. */
  function osveziNaslov() {
    const k = filteri.kategorija ? S.kategorije[filteri.kategorija] : null;
    const pk = filteri.potkategorija ? S.nazivPotkategorije(filteri.potkategorija) : '';
    if (k) {
      el.naslov.textContent = `${k.emoji} ${k.naziv}${pk ? ' · ' + pk : ''}`;
      el.uvod.textContent = `Sve što je potrebno ${{ psi: 'psima', macke: 'mačkama', ptice: 'pticama', ribice: 'ribicama', glodari: 'glodarima' }[filteri.kategorija]} — pažljivo izabrano i provereno.`;
      el.mrvica.textContent = k.naziv;
      document.title = `${k.naziv}${pk ? ' — ' + pk : ''} — Prodavnica — Šapa pet shop`;
    } else {
      el.naslov.textContent = pk ? `Prodavnica · ${pk}` : 'Prodavnica';
      el.uvod.textContent = 'Hrana, oprema, igračke i nega za pse, mačke, ptice, ribice i glodare — sve na jednom mestu.';
      el.mrvica.textContent = pk || 'Svi proizvodi';
      document.title = `Prodavnica${pk ? ' — ' + pk : ''} — Šapa pet shop`;
    }
  }

  let poslednjiPotpis = '';

  function iscrtaj() {
    const rezultati = sortiraj(filtriraj(filteri), filteri.sort);

    // ne iscrtavaj ponovo ako se prikaz nije promenio (izbegava treperenje animacija)
    const potpis = rezultati.map(p => p.id).join(',');
    if (potpis !== poslednjiPotpis) {
      el.grid.innerHTML = rezultati.map((p, i) => S.karticaProizvoda(p, Math.min(i, 12), 'card-in')).join('');
      poslednjiPotpis = potpis;
    }

    el.prazno.hidden = rezultati.length > 0;
    el.grid.hidden = rezultati.length === 0;

    const n = rezultati.length;
    el.brojac.innerHTML = n
      ? `Prikazano <strong>${n}</strong> ${S.mnozina(n, 'proizvod', 'proizvoda', 'proizvoda')}${filteri.q ? ` za „${S.escapeHtml(filteri.q)}”` : ''}`
      : 'Nema proizvoda za izabrane filtere';

    // upozorenje za obrnut opseg cene
    el.cenaHint.textContent = (filteri.min !== null && filteri.max !== null && filteri.min > filteri.max)
      ? 'Najniža cena je veća od najviše — zamenili smo ih.'
      : `Cene su od ${S.formatCena(najnizaCena)} do ${S.formatCena(najvisaCena)}.`;

    iscrtajOpcije();
    iscrtajCipove();
    osveziNaslov();
    upisiUUrl();
  }

  /* ---------- Događaji ---------- */

  const promeni = (izmene) => { filteri = Object.assign({}, filteri, izmene); iscrtaj(); };

  // Radio dugmad za kategoriju/potkategoriju (lista se ponovo iscrtava, pa vraćamo fokus)
  document.getElementById('filterForm').addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'kategorija' || t.name === 'potkategorija') {
      promeni({ [t.name]: t.value });
      const novi = document.getElementById(t.id);
      if (novi) novi.focus();
    }
    if (t === el.stanje) promeni({ stanje: t.checked });
    if (t === el.popust) promeni({ popust: t.checked });
  });
  document.getElementById('filterForm').addEventListener('submit', (e) => e.preventDefault());

  // Cena: čekamo da korisnik završi kucanje
  let tajmerCene = null;
  const naCenu = () => {
    clearTimeout(tajmerCene);
    tajmerCene = setTimeout(() => {
      const uBroj = (v) => (v === '' || isNaN(Number(v)) || Number(v) < 0 ? null : Math.floor(Number(v)));
      promeni({ min: uBroj(el.cenaOd.value), max: uBroj(el.cenaDo.value) });
    }, 350);
  };
  el.cenaOd.addEventListener('input', naCenu);
  el.cenaDo.addEventListener('input', naCenu);

  // Pretraga uživo
  let tajmerPretrage = null;
  el.pretraga.addEventListener('input', () => {
    el.obrisiPretragu.hidden = !el.pretraga.value;
    clearTimeout(tajmerPretrage);
    tajmerPretrage = setTimeout(() => promeni({ q: el.pretraga.value.trim().slice(0, 60) }), 160);
  });
  el.pretraga.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && el.pretraga.value) { e.stopPropagation(); ocistiPretragu(); }
  });
  const ocistiPretragu = () => {
    el.pretraga.value = '';
    el.obrisiPretragu.hidden = true;
    promeni({ q: '' });
    el.pretraga.focus();
  };
  el.obrisiPretragu.addEventListener('click', ocistiPretragu);

  el.sort.addEventListener('change', () => promeni({ sort: el.sort.value }));

  // Resetovanje svih filtera
  const resetuj = () => {
    filteri = Object.assign({}, PRAZNO, { sort: filteri.sort });
    popuniPolja();
    iscrtaj();
    S.toast('Filteri su poništeni.', 'info');
  };
  el.reset.addEventListener('click', resetuj);
  el.praznoReset.addEventListener('click', resetuj);

  // Uklanjanje jednog filtera preko čipa
  el.cipovi.addEventListener('click', (e) => {
    const cip = e.target.closest('[data-ukloni-filter]');
    if (!cip) return;
    const k = cip.dataset.ukloniFilter;
    const izmene = { kategorija: { kategorija: '' }, potkategorija: { potkategorija: '' }, cena: { min: null, max: null },
      stanje: { stanje: false }, popust: { popust: false }, q: { q: '' } }[k];
    filteri = Object.assign({}, filteri, izmene);
    popuniPolja();
    iscrtaj();
    // fokus na sledeći čip ili na pretragu, da tastatura ne ostane „nigde”
    const sledeci = el.cipovi.querySelector('.chip');
    (sledeci || el.pretraga).focus();
  });

  /* ---------- Filteri kao bočni panel na manjim ekranima ---------- */
  const otvoriFiltere = () => {
    el.panel.classList.add('is-open');
    el.otvoriPanel.setAttribute('aria-expanded', 'true');
    if (el.overlay) el.overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
    setTimeout(() => el.zatvoriPanel.focus({ preventScroll: true }), 60);
  };
  const zatvoriFiltere = (vratiFokus = true) => {
    if (!el.panel.classList.contains('is-open')) return;
    el.panel.classList.remove('is-open');
    el.otvoriPanel.setAttribute('aria-expanded', 'false');
    if (el.overlay) el.overlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    if (vratiFokus) el.otvoriPanel.focus({ preventScroll: true });
  };
  el.otvoriPanel.addEventListener('click', otvoriFiltere);
  el.zatvoriPanel.addEventListener('click', () => zatvoriFiltere());
  if (el.overlay) el.overlay.addEventListener('click', () => zatvoriFiltere(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') zatvoriFiltere(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 980) zatvoriFiltere(false); });

  // Dugme Nazad/Napred u pregledaču menja filtere
  window.addEventListener('popstate', () => { filteri = procitajIzUrl(); popuniPolja(); iscrtaj(); });

  /* ---------- Start ---------- */
  popuniPolja();
  iscrtaj();
});
