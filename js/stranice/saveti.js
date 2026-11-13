/* =========================================================
   ŠAPA — saveti (stranice/saveti.html i saveti.html?id=...)
   Lista članaka sa filterom po vrsti ljubimca i prikaz
   jednog članka sa trakom napretka čitanja.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const S = window.Sapa;
  const listaView = document.getElementById('tipsListView');
  const clanakView = document.getElementById('tipArticleView');
  if (!listaView || !clanakView) return;

  const svi = S.saveti();
  const parametri = S.parametri();
  const id = parametri.get('id');

  if (id !== null) prikaziClanak(id);
  else prikaziListu();

  /* =======================================================
     LISTA
     ======================================================= */
  function prikaziListu() {
    const traka = document.getElementById('tipsFilter');
    const mreza = document.getElementById('tipsGrid');
    const prazno = document.getElementById('tipsEmpty');
    const brojac = document.getElementById('tipsCount');

    let izabrana = S.kategorije[parametri.get('kategorija')] ? parametri.get('kategorija') : 'svi';

    const dugme = (kljuc, tekst, broj) =>
      `<button type="button" class="filter-btn" data-kat="${kljuc}" aria-pressed="${izabrana === kljuc}">${tekst} <span class="optional">(${broj})</span></button>`;

    traka.innerHTML = dugme('svi', 'Svi', svi.length) +
      Object.entries(S.kategorije).map(([k, v]) =>
        dugme(k, `<span aria-hidden="true">${v.emoji}</span> ${S.escapeHtml(v.naziv)}`, svi.filter(s => s.kategorija === k).length)
      ).join('');

    function iscrtaj() {
      const lista = izabrana === 'svi' ? svi : svi.filter(s => s.kategorija === izabrana);
      mreza.innerHTML = lista.map((s, i) => S.karticaSaveta(s, i).replace('class="tip-card"', 'class="tip-card card-in"')).join('');
      mreza.hidden = !lista.length;
      prazno.hidden = lista.length > 0;
      brojac.textContent = `Prikazano saveta: ${lista.length}`;
      traka.querySelectorAll('[data-kat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.kat === izabrana)));

      const p = new URLSearchParams();
      if (izabrana !== 'svi') p.set('kategorija', izabrana);
      S.azurirajUrl(p);
    }

    traka.addEventListener('click', (e) => {
      const b = e.target.closest('[data-kat]');
      if (!b || b.dataset.kat === izabrana) return;
      izabrana = b.dataset.kat;
      iscrtaj();
    });

    iscrtaj();
  }

  /* =======================================================
     JEDAN ČLANAK
     ======================================================= */
  function prikaziClanak(trazeniId) {
    const s = svi.find(x => String(x.id) === String(trazeniId));
    listaView.hidden = true;
    clanakView.hidden = false;
    const koren = document.getElementById('articleRoot');

    if (!s) {
      document.title = 'Savet nije pronađen — Šapa pet shop';
      document.getElementById('relatedSection').hidden = true;
      koren.innerHTML = `
        <div class="empty-box">
          <span class="empty-emoji" aria-hidden="true">📝</span>
          <h1>Ovaj savet nismo pronašli</h1>
          <p>Možda je link pogrešan ili je članak premešten. Pogledaj sve savete.</p>
          <a href="saveti.html" class="btn btn-primary">Svi saveti</a>
        </div>`;
      return;
    }

    const kat = S.kategorije[s.kategorija];
    document.title = `${s.naslov} — Saveti — Šapa pet shop`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', s.uvod);

    document.getElementById('articleCrumbs').insertAdjacentHTML('beforeend',
      `<li aria-current="page">${S.escapeHtml(s.naslov)}</li>`);

    koren.innerHTML = `
      <header class="article-hero">
        <span class="article-emoji" aria-hidden="true">${s.emoji}</span>
        <div class="tip-meta">
          <a class="tip-pill" href="saveti.html?kategorija=${s.kategorija}">${S.escapeHtml(kat ? kat.naziv : s.kategorija)}</a>
          <time datetime="${S.isoDatum(s.datum)}">${S.formatDatum(s.datum)}</time>
          <span>· ${s.vremeCitanja} min čitanja</span>
        </div>
        <h1>${S.escapeHtml(s.naslov)}</h1>
        <p class="article-lead">${S.escapeHtml(s.uvod)}</p>
        <p class="hint">Autor: ${S.escapeHtml(s.autor)}</p>
      </header>
      <div class="article-body">
        ${s.sadrzaj.map(pasus => `<p>${S.escapeHtml(pasus)}</p>`).join('')}
      </div>
      <div class="article-foot">
        <a href="saveti.html" class="btn btn-ghost btn-small"><span aria-hidden="true">←</span> Svi saveti</a>
        <a href="prodavnica.html?kategorija=${s.kategorija}" class="btn btn-primary btn-small">Proizvodi za ${kat ? S.escapeHtml(kat.naziv.toLowerCase()) : 'ljubimce'} <span aria-hidden="true">→</span></a>
      </div>`;

    // Srodni saveti: prvo ista kategorija, zatim najnoviji
    const srodni = svi
      .filter(x => x.id !== s.id)
      .sort((a, b) => (b.kategorija === s.kategorija) - (a.kategorija === s.kategorija))
      .slice(0, 3);
    document.getElementById('relatedGrid').innerHTML = srodni.map((x, i) => S.karticaSaveta(x, i)).join('');
    S.otkrivaj();

    // Traka napretka čitanja
    const traka = document.getElementById('readingProgress');
    const telo = koren.querySelector('.article-body');
    const osvezi = () => {
      const r = telo.getBoundingClientRect();
      const ukupno = r.height - window.innerHeight * 0.6;
      const procitano = Math.min(1, Math.max(0, (-r.top + window.innerHeight * 0.3) / Math.max(1, ukupno)));
      traka.style.transform = `scaleX(${procitano})`;
    };
    window.addEventListener('scroll', osvezi, { passive: true });
    window.addEventListener('resize', osvezi);
    osvezi();
  }
});
