# 🐾 Šapa — online prodavnica za ljubimce

Statični sajt pet shopa iz Novog Pazara: katalog, korpa, lista želja, kupon kodovi,
plaćanje pouzećem i potvrda porudžbine. Sve radi u pregledaču, **bez servera i bez
backenda**. Podaci o korpi, listi želja i porudžbinama čuvaju se u `localStorage`-u.

Napravljeno u čistom HTML-u, CSS-u i JavaScript-u. Nema frameworka, build alata ni npm-a.

---

## Šta sajt radi

| Stranica | Opis |
|---|---|
| `index.html` | Početna: hero sa animacijama, kategorije (vode u prodavnicu), 8 izdvojenih proizvoda (novo ili na popustu), 3 najnovija saveta, karusel utisaka, newsletter |
| `stranice/prodavnica.html` | Katalog: filter po vrsti ljubimca i vrsti proizvoda, opseg cene, „samo na stanju”, „samo popust”, pretraga po nazivu uživo, sortiranje. Filteri se čuvaju u URL-u |
| `stranice/proizvod.html?id=…` | Detalji proizvoda: ocena, cena i popust, stanje, izbor količine, tabovi Opis / Karakteristike / Recenzije, slični proizvodi |
| `stranice/korpa.html` | Stavke, promena količine, brisanje, kupon, traka do besplatne dostave, obračun |
| `stranice/placanje.html` | Forma za dostavu sa validacijom i rezime porudžbine. Plaćanje je samo pouzećem |
| `stranice/porudzbina.html?broj=…` | Potvrda: broj porudžbine, stavke, iznos, adresa, okvirni datum isporuke (+2 radna dana) |
| `stranice/saveti.html` (`?id=…`) | Saveti za ljubimce sa filterom po vrsti; prikaz jednog članka |
| `stranice/kontakt.html` | Kontakt forma (bez slanja), adresa, telefon, radno vreme, mapa, česta pitanja |
| `404.html` | Stranica za nepostojeće adrese, sa pretragom prodavnice |

**Zajedničko za sve stranice:** isti header i footer, mini korpa i lista želja kao bočni
paneli, brojači u headeru, toast poruke, dugme „nazad na vrh”, otkrivanje sekcija pri skrolu.

### Pravila prodavnice

- **Dostava:** 350 din. Besplatna kada je međuzbir (pre popusta) **3.000 din ili više**.
- **Količina** u korpi ne može da pređe broj komada na stanju (`naStanju`).
- **Proizvodi kojih nema na stanju** ne mogu da se dodaju u korpu, ali mogu u listu želja.
- **Plaćanje:** samo pouzećem, gotovinom kuriru pri preuzimanju.
- **Isporuka:** okvirno 2 radna dana od porudžbine (subota i nedelja se preskaču).

### Kupon kodovi za testiranje

| Kod | Popust | Uslov |
|---|---|---|
| `SAPA10` | 10% na međuzbir | nema |
| `DOBRODOSLI` | 500 din | međuzbir od 2.500 din |

Velika i mala slova nisu bitna (`sapa10` radi). Pogrešan kod daje poruku o grešci.
Ako se korpa smanji ispod uslova, `DOBRODOSLI` se označava kao neaktivan i popust se ne
obračunava. Kod `SAPA10` se dobija i prijavom na newsletter.

---

## Struktura foldera

```
/
├── index.html                početna (mora u koren: hosting je otvara na „/”)
├── 404.html                  stranica nije pronađena (mora u koren: hosting je sam traži)
├── README.md
├── stranice/                 sve ostale HTML stranice
│   ├── prodavnica.html       katalog (?kategorija=…&potkategorija=…&q=…)
│   ├── proizvod.html         detalji proizvoda (?id=…)
│   ├── korpa.html            korpa
│   ├── placanje.html         plaćanje pouzećem (checkout)
│   ├── porudzbina.html       potvrda porudžbine (?broj=…)
│   ├── saveti.html           saveti / blog (?id=…, ?kategorija=…)
│   └── kontakt.html          kontakt forma, info, mapa, FAQ
├── css/
│   └── style.css             svi stilovi (tokeni boja i fontova u :root)
├── img/
│   └── favicon.svg           ikonica (logo šape)
└── js/
    ├── data.js               PRODUCTS (30 proizvoda), SAVETI, KATEGORIJE, POTKATEGORIJE
    ├── main.js               zajednički kod: window.Sapa (korpa, kuponi, lista želja,
    │                         šabloni kartica, paneli, toast, validacija formi, animacije)
    └── stranice/             po jedan skript za svaku stranicu, isto ime kao HTML
        ├── pocetna.js        index.html
        ├── prodavnica.js     filteri, pretraga, sortiranje
        ├── proizvod.js       stranica proizvoda
        ├── korpa.js          korpa i kuponi
        ├── placanje.js       forma za plaćanje i čuvanje porudžbine
        ├── porudzbina.js     potvrda porudžbine
        ├── saveti.js         saveti
        └── kontakt.js        kontakt forma i FAQ
```

Svaka stranica učitava `js/data.js`, zatim `js/main.js`, pa svoj skript iz `js/stranice/`.

### Linkovi između stranica

Stranice u korenu (`index.html`, `404.html`) linkuju na `stranice/prodavnica.html`,
`css/style.css`… Stranice u folderu `stranice/` linkuju jedna na drugu samo imenom
(`korpa.html`), a na koren sa `../` (`../index.html`, `../css/style.css`).

Linkove koje pravi JavaScript (kartice proizvoda, mini korpa, lista želja) gradi
`Sapa.stranica('proizvod.html?id=3')`. Funkcija čita `<html data-nivo="koren|stranice">`
i sama dodaje `stranice/` ili `../`. Kada praviš nov link u JS-u, koristi nju.

### Podaci (`js/data.js`)

Proizvodi su u običnom JS fajlu (globalni niz `PRODUCTS`), a ne u JSON-u koji se učitava
preko `fetch()`. Zato sajt radi i kada se `index.html` otvori direktno iz foldera.

Polja proizvoda: `id`, `slug`, `naziv`, `kategorija` (`psi`, `macke`, `ptice`, `ribice`,
`glodari`), `potkategorija` (`hrana`, `oprema`, `igracke`, `nega`), `cena`, `staraCena`
(ili `null`), `emoji`, `kratakOpis`, `opis` (niz pasusa), `karakteristike`, `tezina` ili
`velicina`, `naStanju`, `ocena`, `brojRecenzija`, `novo`, `dodato` (datum, za sortiranje
„najnovije”), `recenzije`.

Novi proizvod se dodaje kao novi objekat u niz `PRODUCTS` sa jedinstvenim `id`-jem.

### localStorage ključevi

| Ključ | Sadržaj |
|---|---|
| `sapa_korpa` | `[{ id, kolicina }]` |
| `sapa_zelje` | `[id, …]` |
| `sapa_kupon` | primenjeni kod, npr. `"SAPA10"` |
| `sapa_porudzbine` | poslednjih 20 porudžbina |
| `sapa_newsletter` | `{ email, datum }` posle prijave |

Za „čist početak” u konzoli pregledača pokreni `localStorage.clear()`.

---

## Pokretanje lokalno

**Najjednostavnije:** dvoklik na `index.html`. Sajt radi i preko `file://`.

**Preko lokalnog servera** (preporučeno, ponaša se isto kao na internetu):

- VS Code: ekstenzija **Live Server** → desni klik na `index.html` → *Open with Live Server*
- ili, ako je instaliran Python: u folderu projekta `python -m http.server 8000`,
  pa otvori <http://localhost:8000>

Napomena za `file://`: neki pregledači ne dozvoljavaju menjanje adrese bez ponovnog
učitavanja, pa se filteri prodavnice tada ne upisuju u URL. Filteri i dalje rade, a na
serveru i na GitHub Pages-u adresa se ažurira normalno.

---

## Objavljivanje na Vercel-u

Sajt je povezan sa GitHub repozitorijumom, pa Vercel sam objavljuje svaku novu verziju
grane `main`. Promene se na sajtu vide **tek posle commit-a i push-a**:

```
git add -A
git commit -m "Opis promene"
git push
```

Posle minut-dva nova verzija je na adresi projekta. Ništa ne treba podešavati: nema build
koraka, Vercel samo servira fajlove. `404.html` iz korena koristi se za nepostojeće adrese,
i na dubljim putanjama (npr. `/stranice/nesto`) ima ispravne stilove.

## Objavljivanje na GitHub Pages

1. Napravi repozitorijum na GitHub-u i pošalji kod:
   ```
   git remote add origin https://github.com/<korisnik>/<repo>.git
   git push -u origin main
   ```
2. Na GitHub-u otvori **Settings → Pages**.
3. Pod **Build and deployment** izaberi **Source: Deploy from a branch**,
   grana **main**, folder **/ (root)**, pa **Save**.
4. Posle minut-dva sajt je na `https://<korisnik>.github.io/<repo>/`.

Svi linkovi su relativni (`prodavnica.html`, `css/style.css`), pa sajt radi i u podfolderu
`/<repo>/`. GitHub Pages sam prikazuje `404.html` za nepostojeće adrese. Na dubljim
adresama 404 stranica vodi putanje od korena domena (`/`). Za sajt u podfolderu
`/<repo>/` promeni `baza.href = '/'` u `404.html` na `'/<repo>/'`.

---

## Pristupačnost i animacije

- Skip link „Preskoči na sadržaj”, vidljiv fokus, `aria-*` na panelima, tabovima,
  karuselu i accordion-u, labele na svim poljima, poruke o greškama povezane sa poljima.
- Paneli (korpa, lista želja, filteri na mobilnom) zatvaraju se na `Esc` i drže fokus unutra.
- Tabovi i FAQ rade i sa strelicama na tastaturi. Karusel utisaka ima dugme za pauzu.
- Animacije: pojavljivanje pri skrolu, proizvod „leti” u korpu, prasak srca, brojači u
  heroju, iscrtavanje kvačice i konfete na potvrdi, traka napretka čitanja na savetima.
  Kada sistem traži manje pokreta (`prefers-reduced-motion`), sve se isključuje.
- Responsive: desktop, tablet (filteri kao bočni panel) i mobilni (meni na hamburger).
