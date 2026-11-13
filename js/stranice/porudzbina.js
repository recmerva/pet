/* =========================================================
   ŠAPA — potvrda porudžbine (stranice/porudzbina.html?broj=...)
   Prikazuje sačuvanu porudžbinu iz localStorage-a:
   broj, stavke, iznose, adresu i okvirni datum isporuke.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const S = window.Sapa;
  const koren = document.getElementById('orderRoot');
  if (!koren) return;

  const sve = S.skladiste.ucitaj(S.KLJUCEVI.porudzbine, []);
  const porudzbine = Array.isArray(sve) ? sve : [];
  const trazeni = S.parametri().get('broj');
  // bez broja u adresi prikazujemo poslednju porudžbinu
  const p = trazeni ? porudzbine.find(x => x.broj === trazeni) : porudzbine[0];

  if (!p) {
    document.title = 'Porudžbina nije pronađena — Šapa pet shop';
    koren.innerHTML = `
      <div class="empty-box">
        <span class="empty-emoji" aria-hidden="true">📦</span>
        <h1>Porudžbina nije pronađena</h1>
        <p>Porudžbine se čuvaju samo u pregledaču u kome su napravljene. Ako su podaci pregledača obrisani, potvrda više nije dostupna.</p>
        <a href="prodavnica.html" class="btn btn-primary">Idi u prodavnicu</a>
      </div>`;
    return;
  }

  document.title = `Porudžbina ${p.broj} — Šapa pet shop`;
  const k = p.kupac;

  koren.innerHTML = `
    <div class="confirm">
      <div class="confirm-head">
        <svg class="confirm-check" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--ok)" stroke-width="6" stroke-linecap="round" transform="rotate(-90 50 50)"/>
          <path d="M30 52 l14 14 l27 -30" fill="none" stroke="var(--ok)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h1>Hvala, ${S.escapeHtml(k.ime)}! Porudžbina je primljena.</h1>
        <p>Potvrdu smo poslali na <strong>${S.escapeHtml(k.email)}</strong>. Javićemo se i kada paket krene ka tebi.</p>
        <p class="order-number" aria-label="Broj porudžbine ${S.escapeHtml(p.broj)}">${S.escapeHtml(p.broj)}</p>
      </div>

      <div class="confirm-grid">
        <section class="card" aria-labelledby="isporukaNaslov">
          <h2 id="isporukaNaslov">Isporuka</h2>
          <dl class="info-list">
            <dt>Okvirni datum isporuke</dt>
            <dd class="delivery-date"><time datetime="${S.isoDatum(p.isporuka)}">${S.formatDatum(p.isporuka, true)}</time></dd>
            <dt>Adresa</dt>
            <dd>${S.escapeHtml(k.ime)} ${S.escapeHtml(k.prezime)}<br>${S.escapeHtml(k.adresa)}<br>${S.escapeHtml(k.postanskiBroj)} ${S.escapeHtml(k.grad)}</dd>
            <dt>Telefon</dt>
            <dd>${S.escapeHtml(k.telefon)}</dd>
            ${k.napomena ? `<dt>Napomena</dt><dd>${S.escapeHtml(k.napomena)}</dd>` : ''}
            <dt>Plaćanje</dt>
            <dd>💵 Pouzećem — ${S.formatCena(p.ukupno)} plaćaš kuriru pri preuzimanju</dd>
          </dl>
          <ol class="timeline" aria-label="Status porudžbine">
            <li class="is-done">Primljena</li>
            <li>Pakujemo</li>
            <li>Na putu</li>
          </ol>
        </section>

        <section class="card" aria-labelledby="stavkeNaslov">
          <h2 id="stavkeNaslov">Stavke</h2>
          <ul class="summary-items summary-items--full">
            ${p.stavke.map(s => `
              <li class="summary-item">
                <span class="drawer-thumb" aria-hidden="true">${s.emoji}<span class="qty-badge">${s.kolicina}</span></span>
                <span><a class="text-link text-link--plain" href="proizvod.html?id=${encodeURIComponent(s.id)}">${S.escapeHtml(s.naziv)}</a><br><small class="optional">${s.kolicina} × ${S.formatCena(s.cena)}</small></span>
                <span class="price">${S.formatCena(s.iznos)}</span>
              </li>`).join('')}
          </ul>
          <dl class="summary-rows summary-rows--spaced">${S.redoviObracuna(p)}</dl>
        </section>
      </div>

      <div class="nf-links">
        <a href="prodavnica.html" class="btn btn-primary">Nastavi kupovinu</a>
        <a href="saveti.html" class="btn btn-ghost">Pročitaj savete za ljubimce</a>
      </div>
    </div>`;

  /* ---------- Konfete od šapa i emotikona (samo jednom po porudžbini) ---------- */
  const kljucProslave = 'sapa_proslava_' + p.broj;
  let vecProslavljeno = false;
  try { vecProslavljeno = sessionStorage.getItem(kljucProslave) === '1'; sessionStorage.setItem(kljucProslave, '1'); } catch (e) { /* nije bitno */ }

  if (!S.manjeAnimacija() && !vecProslavljeno) {
    const okvir = document.createElement('div');
    okvir.className = 'confetti';
    okvir.setAttribute('aria-hidden', 'true');
    const znaci = ['🐾', '🦴', '🐟', '💛', '⭐', '🎉', '🐾', '🌿'];
    for (let i = 0; i < 46; i++) {
      const c = document.createElement('span');
      c.textContent = znaci[i % znaci.length];
      c.style.left = Math.random() * 100 + '%';
      c.style.fontSize = (0.9 + Math.random() * 1.1).toFixed(2) + 'rem';
      c.style.animationDuration = (2.6 + Math.random() * 2.2).toFixed(2) + 's';
      c.style.animationDelay = (0.5 + Math.random() * 1.2).toFixed(2) + 's';
      c.style.setProperty('--drift', (Math.random() * 160 - 80).toFixed(0) + 'px');
      c.style.setProperty('--rot', (Math.random() * 720 - 360).toFixed(0) + 'deg');
      okvir.appendChild(c);
    }
    document.body.appendChild(okvir);
    setTimeout(() => okvir.remove(), 6500);
  }
});
