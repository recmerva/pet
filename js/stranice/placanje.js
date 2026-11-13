/* =========================================================
   ŠAPA — plaćanje (stranice/placanje.html)
   Validacija forme na klijentu, rezime porudžbine,
   plaćanje pouzećem, čuvanje porudžbine u localStorage-u
   i preusmeravanje na potvrdu.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const S = window.Sapa;
  const forma = document.getElementById('checkoutForm');
  if (!forma) return;

  const el = {
    prazno: document.getElementById('checkoutEmpty'),
    puno: document.getElementById('checkoutFull'),
    stavke: document.getElementById('checkoutItems'),
    traka: document.getElementById('checkoutShip'),
    redovi: document.getElementById('checkoutRows'),
    isporuka: document.getElementById('deliveryEstimate'),
    dugme: document.getElementById('submitOrder'),
    obrada: document.getElementById('processing'),
    obradaTekst: document.getElementById('processingText'),
    napomena: document.getElementById('napomena'),
    brojac: document.getElementById('napomenaBrojac')
  };

  let saljeSe = false;

  /* ---------- Rezime sa strane ---------- */
  function iscrtajRezime() {
    if (saljeSe) return; // korpa se prazni pri slanju — ne prikazuj „praznu korpu”
    const obr = S.obracun();
    const prazna = obr.stavke.length === 0;
    el.prazno.hidden = !prazna;
    el.puno.hidden = prazna;
    if (prazna) return;

    el.stavke.innerHTML = obr.stavke.map(s => `
      <li class="summary-item">
        <span class="drawer-thumb" aria-hidden="true">${s.proizvod.emoji}<span class="qty-badge">${s.kolicina}</span></span>
        <span>${S.escapeHtml(s.proizvod.naziv)} <span class="visually-hidden">, količina ${s.kolicina}</span></span>
        <span class="price">${S.formatCena(s.iznos)}</span>
      </li>`).join('');
    el.traka.innerHTML = S.trakaDostave(obr);
    el.redovi.innerHTML = S.redoviObracuna(obr);
    el.isporuka.innerHTML = `<span aria-hidden="true">🚚</span> Okvirna isporuka: <strong>${S.formatDatum(S.dodajRadneDane(new Date(), 2), true)}</strong>`;
  }

  /* ---------- Pravila validacije ---------- */
  const P = S.PROVERE;
  const v = S.validacija(forma, {
    ime: (x) => !P.obavezno(x) ? 'Unesi ime.' : !P.ime(x) ? 'Ime treba da sadrži samo slova (najmanje 2).' : '',
    prezime: (x) => !P.obavezno(x) ? 'Unesi prezime.' : !P.ime(x) ? 'Prezime treba da sadrži samo slova (najmanje 2).' : '',
    email: (x) => !P.obavezno(x) ? 'Unesi email adresu.' : !P.email(x) ? 'Email adresa nije ispravna, npr. ime@primer.com.' : '',
    telefon: (x) => !P.obavezno(x) ? 'Unesi broj telefona.' : !P.telefon(x) ? 'Unesi srpski broj, npr. 060 123 4567 ili +381 60 123 4567.' : '',
    adresa: (x) => !P.obavezno(x) ? 'Unesi ulicu i broj.' : String(x).trim().length < 4 ? 'Adresa je prekratka.' : '',
    grad: (x) => !P.obavezno(x) ? 'Unesi grad.' : String(x).trim().length < 2 ? 'Naziv grada je prekratak.' : '',
    postanskiBroj: (x) => !P.obavezno(x) ? 'Unesi poštanski broj.' : !P.postanskiBroj(x) ? 'Poštanski broj ima tačno 5 cifara, npr. 36300.' : ''
  });

  // Poštanski broj: samo cifre
  const pb = document.getElementById('postanskiBroj');
  pb.addEventListener('input', () => { pb.value = pb.value.replace(/\D/g, '').slice(0, 5); });

  // Brojač karaktera za napomenu
  el.napomena.addEventListener('input', () => {
    el.brojac.textContent = `${el.napomena.value.length} / 300`;
  });

  /* ---------- Broj porudžbine: SAPA-GGMMDD-XXXX ---------- */
  function noviBrojPorudzbine(postojece) {
    const d = new Date();
    const dd = (n) => String(n).padStart(2, '0');
    const osnova = `SAPA-${String(d.getFullYear()).slice(2)}${dd(d.getMonth() + 1)}${dd(d.getDate())}`;
    let broj;
    do {
      broj = `${osnova}-${Math.floor(1000 + Math.random() * 9000)}`;
    } while (postojece.some(p => p.broj === broj));
    return broj;
  }

  /* ---------- Slanje ---------- */
  forma.addEventListener('submit', (e) => {
    e.preventDefault();
    if (saljeSe) return;
    if (!v.proveriSve()) {
      S.toast('Proveri označena polja.', 'greska');
      return;
    }
    const obr = S.obracun();
    if (!obr.stavke.length) { iscrtajRezime(); return; }

    const vrednost = (ime) => String(v.vrednost(ime)).trim();
    const porudzbine = S.skladiste.ucitaj(S.KLJUCEVI.porudzbine, []);
    const lista = Array.isArray(porudzbine) ? porudzbine : [];

    const porudzbina = {
      broj: noviBrojPorudzbine(lista),
      datum: new Date().toISOString(),
      stavke: obr.stavke.map(s => ({
        id: s.proizvod.id, naziv: s.proizvod.naziv, emoji: s.proizvod.emoji,
        cena: s.proizvod.cena, kolicina: s.kolicina, iznos: s.iznos
      })),
      brojKomada: obr.brojKomada,
      medjuzbir: obr.medjuzbir,
      kupon: obr.kupon && obr.kupon.vazi ? obr.kupon.kod : null,
      popust: obr.popust,
      dostava: obr.dostava,
      ukupno: obr.ukupno,
      kupac: {
        ime: vrednost('ime'), prezime: vrednost('prezime'), email: vrednost('email'),
        telefon: vrednost('telefon'), adresa: vrednost('adresa'), grad: vrednost('grad'),
        postanskiBroj: vrednost('postanskiBroj'), napomena: vrednost('napomena')
      },
      nacinPlacanja: 'pouzecem', // jedini način plaćanja

      isporuka: S.isoDatum(S.dodajRadneDane(new Date(), 2))
    };

    // čuvamo poslednjih 20 porudžbina
    S.skladiste.sacuvaj(S.KLJUCEVI.porudzbine, [porudzbina, ...lista].slice(0, 20));

    saljeSe = true;
    el.dugme.disabled = true;
    el.dugme.innerHTML = '<span class="spinner" aria-hidden="true"></span> Šaljemo…';
    el.obrada.hidden = false;
    el.obradaTekst.textContent = 'Obrađujemo porudžbinu…';

    S.isprazniKorpu();
    const cilj = `porudzbina.html?broj=${encodeURIComponent(porudzbina.broj)}`;
    setTimeout(() => { window.location.href = cilj; }, S.manjeAnimacija() ? 150 : 1100);
  });

  document.addEventListener('sapa:promena', iscrtajRezime);
  iscrtajRezime();
});
