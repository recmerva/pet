# Šapa — vodič kroz projekat

**Sajt:** https://recmerva.github.io/pet/ · **Kod:** https://github.com/recmerva/pet

## Ukratko 

Šapa je statični pet shop od 9 HTML stranica, jednog CSS fajla i čistog JavaScript-a, bez frameworka, build alata i servera. Sve što kupac uradi (korpa, lista želja, porudžbine, prijava na newsletter) čuva se u `localStorage`-u njegovog pregledača.

Kod je podeljen u tri sloja:

- **Podaci** — `js/data.js`: proizvodi, saveti i kategorije. Jedino mesto gde se menja ponuda.
- **Zajednički kod** — `js/main.js` i `css/style.css`: koriste ih sve stranice (header, korpa, kartice proizvoda, bočni paneli, toast poruke, validacija formi, animacije).
- **Stranice** — `index.html` i `404.html` u korenu, ostale u folderu `stranice/`; svaka ima svoj skript u `js/stranice/`. Svaka stranica učitava redom `data.js` → `main.js` → svoj skript.

Header, footer i bočni paneli su isti tekst u svih 9 HTML fajlova. Kada nešto menjaš u njima, menjaš u svim fajlovima (vidi Česte izmene).

## Struktura foldera

Svaki tip fajla ima svoj folder. Samo dve HTML stranice stoje u korenu, jer ih hosting (GitHub Pages) tamo traži: `index.html` se otvara na adresi „/”, a `404.html` se prikazuje za svaku adresu koja ne postoji.

```
/
├── index.html                početna
├── 404.html                  stranica nije pronađena
├── README.md                 kratko uputstvo u repozitorijumu
├── VODIC.md                  ovaj vodič
├── stranice/                 sve ostale HTML stranice
│   ├── prodavnica.html
│   ├── proizvod.html
│   ├── korpa.html
│   ├── placanje.html
│   ├── porudzbina.html
│   ├── saveti.html
│   └── kontakt.html
├── css/
│   └── style.css             svi stilovi, jedan fajl
├── img/
│   └── favicon.svg           ikonica šape u tabu pregledača
└── js/
    ├── data.js               podaci: proizvodi, saveti, kategorije
    ├── main.js               zajednički kod za sve stranice (window.Sapa)
    └── stranice/             po jedan skript za svaku stranicu
        ├── pocetna.js        → index.html
        ├── prodavnica.js
        ├── proizvod.js
        ├── korpa.js
        ├── placanje.js
        ├── porudzbina.js
        ├── saveti.js
        └── kontakt.js
```

Pravilo imenovanja: skript stranice ima isto ime kao njen HTML (`stranice/korpa.html` ↔ `js/stranice/korpa.js`). Izuzetak je početna, čiji je skript `pocetna.js`.

### Kako su stranice povezane

| Odakle | Ka drugoj stranici | Ka početnoj | Ka CSS-u i JS-u |
| --- | --- | --- | --- |
| `index.html`, `404.html` (koren) | `stranice/korpa.html` | `index.html` | `css/style.css`, `js/main.js` |
| `stranice/*.html` | `korpa.html` | `../index.html` | `../css/style.css`, `../js/main.js` |

Linkove koje pravi JavaScript (kartice proizvoda, mini korpa, lista želja) gradi funkcija `Sapa.stranica('proizvod.html?id=3')`. Ona čita atribut `<html data-nivo="koren">` ili `data-nivo="stranice"` i sama dodaje `stranice/` ili `../`. Kada pišeš nov link u JS-u koji se prikazuje i na početnoj, koristi nju.

Svaka stranica učitava skripte ovim redom: `data.js` → `main.js` → svoj skript iz `js/stranice/`.

## Stranice

| Stranica | Skript | Šta prikazuje | Parametri u adresi |
| --- | --- | --- | --- |
| `index.html` | `pocetna.js` | Hero, kategorije, 8 izdvojenih proizvoda, 3 najnovija saveta, karusel utisaka, newsletter | — |
| `stranice/prodavnica.html` | `prodavnica.js` | Katalog sa filterima, pretragom uživo i sortiranjem | `kategorija`, `potkategorija`, `min`, `max`, `stanje=1`, `popust=1`, `q`, `sort` |
| `stranice/proizvod.html` | `proizvod.js` | Detalji, izbor količine, tabovi Opis / Karakteristike / Recenzije, slični proizvodi | `id` (obavezan) |
| `stranice/korpa.html` | `korpa.js` | Stavke, količine, kupon, traka do besplatne dostave, obračun | — |
| `stranice/placanje.html` | `placanje.js` | Forma za dostavu, rezime porudžbine, plaćanje pouzećem | — |
| `stranice/porudzbina.html` | `porudzbina.js` | Potvrda: broj, stavke, adresa, datum isporuke, konfete | `broj` |
| `stranice/saveti.html` | `saveti.js` | Lista saveta sa filterom, ili jedan članak | `kategorija` za listu, `id` za članak |
| `stranice/kontakt.html` | `kontakt.js` | Kontakt forma, info, „otvoreno sada”, mapa, česta pitanja | `#faq` vodi na pitanja |
| `404.html` | nema svoj | Poruka i pretraga prodavnice | — |

Primeri adresa:

- `stranice/prodavnica.html?kategorija=psi&potkategorija=hrana&sort=cena-rastuce`
- `stranice/prodavnica.html?popust=1` (link „Akcije” u footeru)
- `stranice/proizvod.html?id=12`
- `stranice/saveti.html?id=3`

Ako parametar nije ispravan (npr. `proizvod.html?id=999`), stranica prikazuje poruku „nije pronađeno” sa linkom nazad, umesto prazne stranice.

Header, footer, mini korpa, lista želja, toast i dugme „nazad na vrh” isti su na svim stranicama. Postavlja ih `main.js`, pa stranice nemaju poseban kod za njih.

## Podaci: js/data.js

Svi podaci su u jednom običnom JS fajlu, ne u JSON-u. Zato sajt radi i kada se `index.html` otvori duplim klikom (`file://`), gde `fetch()` ne radi.

| Promenljiva | Šta sadrži |
| --- | --- |
| `KATEGORIJE` | 5 vrsta ljubimaca: `psi`, `macke`, `ptice`, `ribice`, `glodari`, svaka sa `naziv` i `emoji` |
| `POTKATEGORIJE` | 4 vrste proizvoda: `hrana`, `oprema`, `igracke`, `nega` |
| `PRODUCTS` | 30 proizvoda, po 6 u svakoj kategoriji (id 1–30) |
| `SAVETI` | 6 članaka za stranicu saveta |

### Polja proizvoda

| Polje | Primer | Napomena |
| --- | --- | --- |
| `id` | `1` | jedinstven broj, koristi se u adresi i korpi |
| `slug` | `'suva-hrana-za-pse-lovac-15kg'` | kratko ime bez razmaka |
| `naziv` | `'Suva hrana za pse „Lovac” 15 kg'` | |
| `kategorija` / `potkategorija` | `'psi'` / `'hrana'` | ključevi iz `KATEGORIJE` i `POTKATEGORIJE` |
| `cena` / `staraCena` | `3290` / `null` | u dinarima; `staraCena` veća od `cena` = popust |
| `emoji` | `'🦴'` | slika proizvoda |
| `kratakOpis` | jedna rečenica | na kartici |
| `opis` | niz pasusa | tab Opis |
| `karakteristike` | niz stavki | tab Karakteristike |
| `tezina` ili `velicina` | `'15 kg'` | |
| `naStanju` | `24` | `0` = nema na stanju; 1–5 = „Još samo X” |
| `ocena` / `brojRecenzija` | `4.8` / `126` | |
| `novo` | `true` | označava „Novo” i ulazi u izdvojene na početnoj |
| `dodato` | `'2026-11-04'` | za sortiranje „Najnovije” |
| `recenzije` | `[{ ime, ocena, datum, tekst }]` | tab Recenzije |

Trenutno nema na stanju: id 6 i 17. Malo na stanju: id 4, 11 i 24.

### Polja saveta

`id`, `slug`, `naslov`, `kategorija` (ključ iz `KATEGORIJE`), `datum`, `emoji`, `autor`, `vremeCitanja`, `uvod` i `sadrzaj` (niz pasusa). Početna prikazuje 3 najnovija po datumu.

### Dodavanje novog proizvoda

1. U `js/data.js` kopiraj jedan postojeći objekat iz `PRODUCTS`.
2. Promeni `id` na sledeći slobodan broj (31, 32…) i popuni ostala polja.
3. Sačuvaj i osveži stranicu. Proizvod se sam pojavljuje u prodavnici, filterima, pretrazi i brojevima kategorija.

Novi savet se dodaje isto tako, u niz `SAVETI`. HTML ne treba menjati.

## Zajednički kod: js/main.js

`main.js` se učitava na svakoj stranici. Pokreće header, panele, toast i animacije, a skriptama stranica daje alate preko objekta `window.Sapa` (u skriptama skraćeno `S`). Fajl je podeljen u 13 numerisanih sekcija, pa se pretragom broja (npr. `5. KORPA`) stiže na pravo mesto.

| # | Sekcija | Šta je unutra |
| --- | --- | --- |
| 1 | Podešavanja | ključevi za localStorage, cena dostave i prag za besplatnu, kupon kodovi |
| 2 | LocalStorage | `skladiste.ucitaj` / `sacuvaj`; radi i kada je localStorage blokiran |
| 3 | Formatiranje | `formatCena` („3.290 din”), datumi na srpskom, `dodajRadneDane`, množina (1 proizvod / 2 proizvoda / 5 proizvoda), `escapeHtml`, pretraga bez kvačica (`normalizuj`), parametri adrese |
| 4 | Proizvodi | `stranica()` za putanje, `nadjiProizvod`, procenat popusta, nazivi kategorija |
| 5 | Korpa i obračun | dodavanje, količine (najviše koliko ima na stanju), kuponi, `obracun()` koji vraća međuzbir, popust, dostavu i ukupno |
| 6 | Lista želja | dodavanje i uklanjanje id-jeva |
| 7 | Šabloni (HTML) | kartica proizvoda, kartica saveta, zvezdice, traka do besplatne dostave, birač količine, redovi obračuna |
| 8 | Toast i animacije | poruke u uglu, „leti u korpu”, prasak srca |
| 9 | Bočni paneli | mini korpa i lista želja: otvaranje, Esc, zadržavanje fokusa unutra |
| 10 | Header i otkrivanje | senka pri skrolu, meni na mobilnom, aktivni link, pojavljivanje sekcija |
| 11 | Newsletter | pamti prijavu i prikazuje kod SAPA10 |
| 12 | Validacija formi | pravila (`PROVERE`) i `validacija(forma, pravila)` |
| 13 | Pokretanje | sve se pali na učitavanje; klikovi preko `data-` atributa |

### Najvažnije funkcije u Sapa

- `S.obracun()`: sve što treba za prikaz korpe i plaćanja (`stavke`, `medjuzbir`, `popust`, `dostava`, `ukupno`, `kupon`).
- `S.karticaProizvoda(p, indeks)`: HTML kartice proizvoda, ista u prodavnici, na početnoj i kod sličnih proizvoda.
- `S.stranica('korpa.html')`: ispravna putanja do stranice, bez obzira odakle se zove.
- `S.toast('Poruka', 'greska')`: kratka poruka u uglu ekrana.
- `S.validacija(forma, pravila)`: proverava polja i ispisuje grešku u `#greska-<ime polja>`.

### Dugmad bez posebnog koda

Dugme dobija ponašanje samo preko atributa, bez dodatnog JS-a:

- `data-dodaj="5"`: dodaje proizvod 5 u korpu.
- `data-zelja="5"`: dodaje u listu želja ili uklanja iz nje.
- `data-open-drawer="cartDrawer"`: otvara panel.

Svaka promena korpe ili liste želja šalje događaj `sapa:promena`. Na njega se stranice osvežavaju, i to i u drugim otvorenim tabovima.

## Stilovi: css/style.css

Svi stilovi su u jednom fajlu. Na vrhu je sadržaj sa 18 sekcija, a svaka sekcija ima naslov u komentaru (npr. `11. KORPA, PLAĆANJE, POTVRDA`).

### Tokeni (u `:root`)

Boje i fontovi se ne pišu direktno, već preko promenljivih. Promena jedne vrednosti menja ceo sajt.

| Token | Vrednost | Gde se koristi |
| --- | --- | --- |
| `--forest` | #1F3A34 | tamnozelena: header, naslovi, glavna dugmad |
| `--cream` | #FBF6EC | pozadina stranica |
| `--gold` | #E3A857 | akcenti, dugme „Dodaj u korpu”, podvučeni linkovi |
| `--plum` | #6B4E71 | oznake „Novo”, dekoracije |
| `--coral` | #E2694B | popusti, greške |
| `--ok` | #2F7D5B | uspeh, „Na stanju” |
| `--display` / `--body` / `--mono` | Fredoka / Work Sans / IBM Plex Mono | naslovi / tekst / cene i oznake |

Tu su i zaobljenja (`--radius-lg`, `--radius-md`, `--radius-sm`), senke (`--shadow-soft`, `--shadow-lift`), širina sadržaja (`--wrap: 1180px`) i krive za animacije (`--ease-out`, `--ease-spring`).

### Redosled sekcija

1. Tokeni i osnova
2. Dugmad
3. Header i paneli
4. Hero (početna)
5. Sekcije i otkrivanje pri skrolu
6. Kategorije i kartice proizvoda
7. O nama, utisci, newsletter
8. Footer, toast, nazad na vrh
9. Prodavnica (filteri)
10. Stranica proizvoda
11. Korpa, plaćanje, potvrda
12. Forme
13. Saveti
14. Kontakt i FAQ
15. 404
16. Animacije (svi `@keyframes`)
17. Responsive: prelomi na 1080, 980, 760 i 420 px
18. Manje animacija: sve se gasi kad sistem traži `prefers-reduced-motion`

### Pravila koja važe svuda

- U HTML-u nema `style="…"` za izgled. Svaki razmak ili boja ima svoju klasu u odgovarajućoj sekciji (npr. `.form-submit`, `.summary-edit`). Inline ostaju samo vrednosti koje računa JS: širina zvezdica, popunjenost trake dostave i kašnjenje animacije `--i`.
- Varijante klase pišu se sa dve crtice: `.empty-box--page`, `.text-link--plain`.
- Stanja se pišu sa `is-`: `.is-open`, `.is-visible`, `.is-out` (nema na stanju).

## Korpa, kuponi, dostava i porudžbine

Sve se računa u pregledaču, u funkciji `obracun()` u `main.js` (sekcija 5). Korpa, stranica plaćanja i mini korpa koriste isti obračun, pa iznosi uvek odgovaraju jedan drugom.

### Pravila

| Pravilo | Vrednost | Gde se menja |
| --- | --- | --- |
| Dostava | 350 din | `DOSTAVA.cena` u sekciji 1 |
| Besplatna dostava | međuzbir od 3.000 din (pre popusta) | `DOSTAVA.besplatnoOd` |
| Količina | najviše koliko ima na stanju (`naStanju`) | podaci u `data.js` |
| Plaćanje | samo pouzećem, gotovinom kuriru | `placanje.js` (`nacinPlacanja: 'pouzecem'`) |
| Isporuka | +2 radna dana, vikend se preskoči | `dodajRadneDane` |

### Kuponi

| Kod | Popust | Uslov |
| --- | --- | --- |
| `SAPA10` | 10% na međuzbir | nema; dobija se i prijavom na newsletter |
| `DOBRODOSLI` | 500 din | međuzbir od 2.500 din |

Velika i mala slova nisu bitna. Na porudžbinu ide jedan kupon. Ako se korpa smanji ispod uslova, `DOBRODOSLI` ostaje upisan, ali se označi kao neaktivan i popust se ne računa. Kada korpa ponovo pređe 2.500 din, popust se sam vraća.

Nov kupon se dodaje u objekat `KUPONI` u sekciji 1: ime koda, `opis`, `minimum` (najmanji međuzbir) i funkcija `izracunaj`, koja od međuzbira vraća popust u dinarima. Na primer, `izracunaj: (m) => Math.round(m * 0.15)` daje 15%.

### Tok porudžbine

1. Klik na „Potvrdi porudžbinu” proverava sva polja forme.
2. Pravi se broj porudžbine u obliku `SAPA-GGMMDD-XXXX`, npr. `SAPA-261112-4821`.
3. Porudžbina se čuva u localStorage-u (poslednjih 20), a korpa se prazni.
4. Posle kratke animacije „Obrađujemo porudžbinu…” otvara se `porudzbina.html?broj=…`.
5. Potvrda čita porudžbinu po broju. Konfete se prikazuju samo prvi put, ne i posle osvežavanja.

Porudžbina se nigde ne šalje: nema servera ni emaila. To je demo prodavnica.

### Šta se čuva u pregledaču (localStorage)

| Ključ | Sadržaj |
| --- | --- |
| `sapa_korpa` | `[{ id, kolicina }]` |
| `sapa_zelje` | `[id, …]` |
| `sapa_kupon` | primenjeni kod, npr. `"SAPA10"` |
| `sapa_porudzbine` | poslednjih 20 porudžbina |
| `sapa_newsletter` | `{ email, datum }` posle prijave |

Podaci su vezani za pregledač i adresu. Lokalni sajt i sajt na GitHub Pages-u imaju odvojene korpe. Za čist početak u konzoli pregledača (F12) pokreni `localStorage.clear()`.

## Animacije

Sve animacije koriste boje sajta. Ako korisnik u sistemu uključi „manje pokreta” (`prefers-reduced-motion`), sve se gasi: CSS sekcija 18 i funkcija `S.manjeAnimacija()` u JS-u.

| Animacija | Gde | Kako radi |
| --- | --- | --- |
| Pojavljivanje pri skrolu | sve stranice | klasa `.reveal` na elementu, ili `.reveal-stagger` na roditelju da se deca pojave jedno za drugim; pali je `IntersectionObserver` u `otkrivaj()` |
| Ulazak kartica | prodavnica, početna | `.card-in` sa kašnjenjem `--i` po redu kartice |
| Leti u korpu | dugme „Dodaj u korpu” | emoji proizvoda preleti do ikonice korpe (`letiUKorpu`, Web Animations API) |
| Prasak srca | dugme za listu želja | mala srca se razlete oko dugmeta (`prasakSrca`) |
| Poskočni brojač | header | brojevi korpe i liste želja poskoče na promenu |
| Brojači u heroju | početna | 12.000+, 4,9/5 i 48h se odbrojavaju od nule |
| Mrlja i šape | početna | ljubičasta mrlja menja oblik, šapice hodaju preko sekcije |
| Karusel utisaka | početna | sam se pomera, pauzira na hover i fokus, prevlačenje prstom, tačke sa trakom vremena |
| Traka dostave | korpa, plaćanje | popunjava se do 3.000 din, sa odsjajem |
| Tabovi | proizvod | linija ispod aktivnog taba klizi |
| Harmonika | kontakt (FAQ) | odgovor se otvara glatko |
| Kvačica i konfete | potvrda | kvačica se iscrtava, šapice padaju odozgo |
| Traka čitanja | članak saveta | traka na vrhu prati koliko je pročitano |

Svi `@keyframes` su u CSS sekciji 16. Nova animacija ide tamo, a njeno gašenje u sekciju 18.

## Česte izmene: gde i kako

| Želim da… | Otvori | Šta uradiš |
| --- | --- | --- |
| dodam ili izmenim proizvod | `js/data.js` | objekat u nizu `PRODUCTS` (vidi sekciju „Podaci”) |
| promenim cenu dostave ili prag | `js/main.js`, sekcija 1 | `DOSTAVA` |
| dodam kupon | `js/main.js`, sekcija 1 | `KUPONI` |
| promenim boju na celom sajtu | `css/style.css`, `:root` | vrednost tokena, npr. `--gold` |
| promenim tekst na početnoj | `index.html` | tekst direktno u HTML-u |
| promenim tekst na drugoj stranici | `stranice/<ime>.html` | tekst direktno u HTML-u |
| izmenim utiske kupaca | `index.html`, sekcija utisaka | kartice `.testi-slide` |
| dodam pitanje u FAQ | `stranice/kontakt.html` | kopiraj jedan `.faq-item`, promeni `id` brojeve (`faq-q7`, `faq-a7`) |
| promenim adresu, telefon ili radno vreme | footer u svih 9 HTML fajlova + `stranice/kontakt.html` | vidi napomenu ispod |

### Header i footer su u svakoj stranici

Pošto nema build alata, header i footer su prepisani u svih 9 HTML fajlova. Kada menjaš meni ili footer, menjaj ih u svim fajlovima. Najlakše je u VS Code-u preko *Find in Files* (Ctrl+Shift+H): nađi stari tekst i zameni ga svuda odjednom.

Pažnja na putanje: u `index.html` i `404.html` link glasi `stranice/korpa.html`, a u fajlovima iz `stranice/` samo `korpa.html` (i `../index.html` za početnu).

### Nova stranica

1. Kopiraj npr. `stranice/kontakt.html` u `stranice/nova.html`.
2. Zameni sadržaj između `<main>` i `</main>`, promeni `<title>` i opis.
3. Na `<html>` promeni `data-stranica="nova.html"`.
4. Ako treba JS, napravi `js/stranice/nova.js` i promeni poslednji `<script>` na `../js/stranice/nova.js`.
5. Dodaj link u meni (u svim fajlovima), ako treba.

## Pokretanje i objavljivanje

### Lokalno

- **Najbrže:** dupli klik na `index.html`. Sajt radi i preko `file://`.
- **Kao na internetu:** u VS Code-u ekstenzija *Live Server* → desni klik na `index.html` → *Open with Live Server*.

Ako je stranica bila otvorena pre veće promene fajlova, pritisni **Ctrl+F5**. Stari tab čuva staru verziju i njene linkove. Na primer, posle premeštanja stranica u `stranice/` stari tab je i dalje tražio `prodavnica.html` u korenu i javljao „not found”.

### Na internetu (GitHub Pages)

Sajt je objavljen na **https://recmerva.github.io/pet/**. GitHub Pages objavljuje ono što je **poslato na GitHub** (grana `main`, koren repozitorijuma). Izmene na računaru se ne vide dok ih ne commit-uješ i push-uješ:

```
git add -A
git commit -m "commit"
git push
```

Posle minut-dva nova verzija je na sajtu. Nema build koraka; GitHub samo servira fajlove. Status objave vidiš na GitHub-u, u repozitorijumu pod **Actions** ili **Settings → Pages**.

Sajt je u podfolderu `/pet/`, zato su svi linkovi relativni. `404.html` se prikazuje za svaku nepostojeću adresu, a i na dubljim adresama (npr. `/pet/stranice/nesto`) sam vodi putanje od `/pet/`, pa ima stilove i ispravne linkove.

### Provera posle objave

1. Otvori sajt i klikni kroz meni: Početna, Prodavnica, Saveti, O nama, Kontakt.
2. Dodaj proizvod u korpu, primeni `SAPA10`, završi porudžbinu.
3. Otvori neku nepostojeću adresu i proveri da 404 ima stilove.

---

# Priprema za odbranu

## Uvodna priča (oko 1 minut)

> Šapa je online prodavnica za kućne ljubimce iz Novog Pazara. Ima 9 stranica: početnu, prodavnicu sa filterima, stranicu proizvoda, korpu, plaćanje, potvrdu porudžbine, savete, kontakt i 404. Napravljena je u čistom HTML-u, CSS-u i JavaScript-u, bez frameworka i bez servera. Ponuda je u jednom fajlu sa 30 proizvoda u 5 kategorija. Sve što kupac uradi, korpa, lista želja i porudžbine, čuva se u `localStorage`-u pregledača. Zato sajt radi i kad se otvori direktno iz foldera, a objavljen je na GitHub Pages-u. Posebno sam pazila na responsive prikaz, pristupačnost (tastatura, čitači ekrana) i animacije, koje se gase ako korisnik u sistemu traži manje pokreta.

## Demonstracija (3–5 minuta)

Pre početka: otvori sajt u čistom pregledaču, ili u konzoli (F12) pokreni `localStorage.clear()` i osveži stranicu.

| # | Uradi | Šta da kažeš / pokažeš |
| --- | --- | --- |
| 1 | Početna, polako skroluj | sekcije se pojavljuju pri skrolu, brojači u heroju, karusel utisaka (strelice, tačke, pauza) |
| 2 | Klik na kategoriju „Psi” | vodi u prodavnicu sa već uključenim filterom; pokaži `?kategorija=psi` u adresi |
| 3 | U pretragu ukucaj `igracka` (bez kvačica) | pretraga uživo nalazi „Igračka za vuču”, radi i bez „č”; brojevi pored filtera se menjaju |
| 4 | Promeni sortiranje, uključi „samo popust”, pa kopiraj adresu u novi tab | filteri su u URL-u, pa se link može poslati nekome |
| 5 | Otvori proizvod | tabovi Opis / Karakteristike / Recenzije (rade i strelicama), stanje, izbor količine |
| 6 | Pokušaj količinu veću od stanja | ne može preko `naStanju`; poruka objašnjava zašto |
| 7 | „Dodaj u korpu” | animacija leti u korpu, brojač u headeru poskoči, toast poruka |
| 8 | Srce na kartici | lista želja, otvori je iz headera kao bočni panel; zatvara se na Esc |
| 9 | Korpa: unesi `DOBRODOSLI` sa malom korpom | odbijen, piše koliko još fali; zatim `SAPA10` radi |
| 10 | Povećaj količinu iznad 3.000 din | traka do besplatne dostave se popuni, dostava postaje 0 |
| 11 | Plaćanje: klikni „Potvrdi” sa praznom formom | greške ispod polja, fokus ide na prvo neispravno polje |
| 12 | Popuni formu i potvrdi | animacija obrade, potvrda sa brojem porudžbine, datumom isporuke i konfetama |
| 13 | F12 → Application → Local Storage | pokaži `sapa_porudzbine`, gde je porudžbina zapamćena |
| 14 | F12 → prikaz za telefon (Ctrl+Shift+M) | hamburger meni, filteri kao bočni panel |

Ako internet zakaže: sajt radi i dvoklikom na `index.html`, bez interneta (fale samo fontovi i mapa).

## Kod koji treba da umeš da objasniš

Ovo su delovi koji se najčešće pitaju. Otvori svaki u VS Code-u (Ctrl+P, pa ime fajla; Ctrl+Shift+O za funkciju) i ispričaj ga svojim rečima.

### 1. Čuvanje podataka — `skladiste` u `js/main.js`, sekcija 2

```js
ucitaj(kljuc, podrazumevano) {
  try {
    const vrednost = localStorage.getItem(kljuc);
    return vrednost === null ? podrazumevano : JSON.parse(vrednost);
  } catch (e) {
    return kljuc in memorija ? memorija[kljuc] : podrazumevano;
  }
}
```

- `localStorage` čuva samo tekst, pa se nizovi i objekti pretvaraju sa `JSON.stringify` (pri čuvanju) i `JSON.parse` (pri čitanju).
- `try/catch` postoji zato što neki pregledači u privatnom režimu blokiraju localStorage. Tada se podaci čuvaju u običnom objektu `memorija` dok je stranica otvorena, pa sajt ne puca.

### 2. Dodavanje u korpu — `dodajUKorpu` u sekciji 5

```js
const vecUKorpi = postojeca ? postojeca.kolicina : 0;
const dodato = Math.min(zeljeno, p.naStanju - vecUKorpi);
```

- Korpa je niz `[{ id, kolicina }]`. Čuvaju se samo id i količina, a cena i naziv uvek se čitaju iz `data.js`. Tako se cena u korpi ne može „zaglaviti” na staroj vrednosti.
- Količina nikad ne prelazi stanje: dodaje se najviše onoliko koliko je ostalo kad se oduzme ono što je već u korpi.
- Funkcija vraća objekat `{ ok, dodato, poruka }`, a dugme na osnovu njega prikazuje toast.

### 3. Obračun — `obracun()` u sekciji 5

```js
const medjuzbir = stavke.reduce((zbir, s) => zbir + s.iznos, 0);
const besplatna = medjuzbir >= DOSTAVA.besplatnoOd;
const dostava = medjuzbir === 0 || besplatna ? 0 : DOSTAVA.cena;
ukupno: Math.max(0, medjuzbir - popust) + dostava
```

- `reduce` sabira iznose svih stavki u jedan broj.
- Besplatna dostava gleda međuzbir **pre** popusta.
- `Math.max(0, …)` sprečava negativan iznos ako bi popust bio veći od međuzbira.
- Jedna funkcija daje brojeve korpi, plaćanju i mini korpi, pa se iznosi nikad ne razlikuju.

### 4. Kuponi — `proveriKupon` u sekciji 5

- Kod se pretvara u velika slova (`toUpperCase`), pa `sapa10` radi.
- Redom se proverava: da li je prazan, da li postoji u `KUPONI`, da li je međuzbir dovoljan.
- Svaki kupon ima svoju funkciju `izracunaj`. Za SAPA10 je to `Math.round(medjuzbir * 0.10)`, za DOBRODOSLI uvek `500`.
- U localStorage se čuva samo kod, a popust se računa ponovo pri svakom obračunu. Zato se `DOBRODOSLI` sam isključi kad korpa padne ispod 2.500 din.

### 5. Filteri u adresi — `js/stranice/prodavnica.js`

```js
const p = new URLSearchParams();
if (filteri.kategorija) p.set('kategorija', filteri.kategorija);
...
window.history.replaceState(null, '', nova);
```

- Pri učitavanju `procitajIzUrl()` čita parametre iz adrese i odbacuje nevažeće vrednosti (nepostojeća kategorija, negativna cena).
- Posle svake promene `upisiUUrl()` upisuje filtere u adresu. `replaceState` menja adresu bez ponovnog učitavanja stranice i bez novog unosa u istoriji.
- Korist: link sa filterima se može poslati, a osvežavanje ne briše izbor.
- `filtriraj()` koristi `Array.filter`, a `sortiraj()` koristi `Array.sort` nad **kopijom** niza (`slice()`), da se originalni `PRODUCTS` ne promeni.

### 6. Pretraga bez kvačica — `normalizuj` u sekciji 3

Tekst se pretvara u mala slova, „đ” u „dj”, a ostala slova sa kvačicama u slova bez njih. Isto se uradi i sa nazivom proizvoda i sa onim što je korisnik ukucao, pa „macka” pronalazi „Mačka”. Pretraga deli upit na reči, a proizvod prolazi samo ako sadrži **sve** reči.

### 7. Validacija forme — `PROVERE` i `validacija` u sekciji 12

```js
telefon: (v) => /^(?:\+381|00381|0)(?:6\d|[1-3]\d)\d{6,7}$/.test(...)
postanskiBroj: (v) => /^\d{5}$/.test(String(v).trim())
```

- Pravila su regularni izrazi (regex). Telefon počinje sa `0`, `+381` ili `00381`, zatim pozivni broj, pa 6–7 cifara; razmaci i crtice se prvo uklone.
- Forma ima `novalidate`, pa se ne prikazuju poruke pregledača nego naše, na srpskom.
- Greška ide u `<p id="greska-ime">`, polje dobija `aria-invalid="true"` (čitač ekrana to izgovori), a fokus ide na prvo neispravno polje.
- Polje se proverava kad korisnik izađe iz njega (`blur`), a posle toga i dok kuca.

### 8. Sinhronizacija stranice i tabova — sekcije 5 i 13

```js
document.dispatchEvent(new CustomEvent('sapa:promena', { detail: { tip } }));
window.addEventListener('storage', ...);
```

- Posle svake promene korpe šalje se sopstveni događaj `sapa:promena`. Header, panel i stranica ga slušaju i ponovo se iscrtavaju. Tako se delovi ne pozivaju direktno jedan drugog.
- Događaj `storage` pregledač sam šalje **drugim** tabovima kad se localStorage promeni, pa se korpa osveži i tamo.
- `pageshow` hvata povratak dugmetom „nazad”, kada pregledač vrati staru kopiju stranice.

### 9. Klikovi preko atributa (event delegation) — sekcija 13

Umesto da se svakom dugmetu dodaje poseban `addEventListener`, postoji **jedan** slušalac na celom dokumentu. On preko `e.target.closest('[data-dodaj]')` pronalazi koje je dugme kliknuto. Prednost: radi i za dugmad koja JS doda kasnije (kartice posle filtriranja), bez ponovnog vezivanja.

### 10. Pojavljivanje pri skrolu — `otkrivaj()` u sekciji 10

`IntersectionObserver` javlja kada element uđe u vidljivi deo ekrana. Tada dobija klasu `is-visible`, a CSS radi samu animaciju (prozirnost i pomeranje). Posle toga se element više ne posmatra (`unobserve`). Ako pregledač ne podržava observer ili korisnik traži manje animacija, sve se odmah prikaže.

### 11. Bezbednost — `escapeHtml` u sekciji 3

Pre nego što se tekst ubaci u HTML preko `innerHTML`, znakovi `< > & " '` se pretvaraju u bezopasne oznake (`&lt;` …). Bez toga bi neko mogao da u polje upiše `<script>` i on bi se izvršio (napad XSS).

## Moguća pitanja i odgovori

**Zašto nema backenda / baze?**
Zadatak je bio statični sajt koji radi i sa GitHub Pages-a i iz foldera. Podaci su u `data.js`, a stanje korisnika u localStorage-u. Za pravu prodavnicu bi trebali server i baza (porudžbine, zalihe, nalozi).

**Zašto `data.js`, a ne `products.json`?**
`fetch()` ne radi kad se stranica otvori preko `file://`. Kao JS fajl, podaci se učitavaju običnim `<script>` tagom i rade svuda.

**Šta je localStorage i koje su mane?**
Skladište u pregledaču, ključ → tekst, oko 5 MB po sajtu, ostaje i posle zatvaranja. Mane: vezano je za jedan pregledač i uređaj, korisnik ga može obrisati, nije bezbedno za osetljive podatke i server ga ne vidi.

**Kako se računa ukupna cena?**
Međuzbir je zbir (cena × količina). Od njega se oduzme popust kupona. Dostava je 350 din, a 0 ako je međuzbir 3.000 din ili više. Ukupno = međuzbir − popust + dostava.

**Šta ako neko ručno promeni cenu u localStorage-u?**
Ne može: u korpi se čuvaju samo id i količina, a cena se uvek čita iz `data.js`. Na pravom sajtu bi i to proveravao server.

**Šta ako u adresu upišem `proizvod.html?id=999`?**
Prikaže se poruka da proizvod nije pronađen, sa linkom nazad u prodavnicu. Isto važi za savete i nepostojeći broj porudžbine.

**Kako radi responsive dizajn?**
CSS Grid i Flexbox sa `@media` upitima na 1080, 980, 760 i 420 px. Na tabletu filteri postaju bočni panel, a na telefonu meni postaje hamburger. Karusel prikazuje 3, 2 ili 1 utisak.

**Šta su CSS promenljive (`--forest`)?**
Vrednosti definisane jednom u `:root` i korišćene svuda kroz `var(--forest)`. Promena boje na jednom mestu menja ceo sajt.

**Šta si uradila za pristupačnost?**
- link „Preskoči na sadržaj”;
- vidljiv fokus za tastaturu;
- labele na svim poljima i greške povezane sa poljem (`aria-describedby`);
- `aria-expanded` na meniju i FAQ-u;
- paneli zadržavaju fokus unutra i zatvaraju se na Esc;
- tabovi rade strelicama;
- karusel ima dugme za pauzu;
- poštuje se `prefers-reduced-motion`.

**Zašto su `index.html` i `404.html` van foldera `stranice/`?**
Hosting otvara `index.html` na adresi „/”, a za nepostojeće adrese sam traži `404.html` u korenu.

**Kako JS zna da li treba `stranice/` ili `../` u linku?**
Svaka stranica ima `<html data-nivo="koren">` ili `data-nivo="stranice"`. Funkcija `stranica()` to pročita i doda pravi prefiks.

**Zašto je header kopiran u svih 9 fajlova?**
Bez servera i build alata HTML ne može da „uključi” drugi fajl. Mogao bi se ubacivati JavaScript-om, ali bi se onda prikazivao sa zakašnjenjem i ne bi radio bez JS-a. Izabrala sam ponavljanje, a menja se preko Find in Files.

**Kako se pravi broj porudžbine?**
`SAPA-` + datum (GGMMDD) + slučajan četvorocifreni broj. Pre upisa se proveri da takav broj već ne postoji.

**Kako se računa datum isporuke?**
`dodajRadneDane` ide dan po dan unapred i broji samo dane od ponedeljka do petka, dok ne izbroji 2.

**Šta radi `'use strict'` / IIFE na početku `main.js`?**
Ceo kod je u funkciji koja se odmah izvrši, da promenljive ne bi bile globalne i sudarale se sa drugim skriptama. Napolje se izvozi samo objekat `window.Sapa`. `'use strict'` uključuje strožija pravila i ranije prijavljuje greške.

**Šta je `innerHTML` vs `textContent`?**
`innerHTML` tumači tekst kao HTML (zato ide sa `escapeHtml`), a `textContent` ubacuje običan tekst i bezbedan je sam po sebi.

**Šta bi unapredila?**
- pravi server i bazu, sa slanjem potvrde emailom;
- korisničke naloge;
- prave slike umesto emodžija;
- straničenje kataloga kad bude više proizvoda;
- header iz jednog fajla uz build alat.

**Da li si koristila alate / AI?**
Odgovori iskreno. Važno je da pokažeš da razumeš kod: otvori bilo koji deo i objasni ga.

## Ograničenja (bolje da ih kažeš ti)

- Porudžbina se nigde ne šalje; to je demo bez servera.
- Korpa i porudžbine postoje samo u tom pregledaču. Drugi uređaj ih ne vidi.
- Nema naloga, prijave ni pravog plaćanja; samo pouzeće.
- Header i footer su ponovljeni u svakom HTML fajlu.
- Kontakt forma i newsletter samo prikazuju potvrdu, ništa ne šalju.

## Pojmovi koje treba znati

| Pojam | Ukratko |
| --- | --- |
| DOM | stablo elemenata stranice kojim JS upravlja (`document.querySelector`, `classList`) |
| događaj (event) | klik, unos, skrol…; JS ga sluša preko `addEventListener` |
| delegiranje događaja | jedan slušalac na roditelju umesto po jedan na svakom dugmetu |
| localStorage | trajno skladište u pregledaču, ključ → tekst |
| JSON | tekstualni zapis objekata i nizova (`JSON.stringify` / `JSON.parse`) |
| query string | deo adrese posle `?`, npr. `?kategorija=psi` (`URLSearchParams`) |
| `history.replaceState` | menja adresu bez ponovnog učitavanja |
| regex | šablon za proveru teksta (telefon, email, poštanski broj) |
| `map` / `filter` / `reduce` / `sort` | metode niza: pretvori, izdvoji, saberi, poređaj |
| template literal | string sa `` ` `` i `${…}`, koristi se za pravljenje HTML-a |
| CSS Grid / Flexbox | raspored u mreži / u redu ili koloni |
| media query | `@media (max-width: 760px)`: stilovi za manje ekrane |
| CSS promenljiva | `--gold` u `:root`, koristi se sa `var(--gold)` |
| ARIA | atributi koji čitačima ekrana opisuju stanje (`aria-expanded`, `aria-invalid`) |
| IntersectionObserver | javlja kad element postane vidljiv na ekranu |
| XSS | ubacivanje tuđeg koda kroz tekst; sprečava se sa `escapeHtml` |
| IIFE | funkcija koja se odmah izvrši, da promenljive ne budu globalne |

## Ček-lista pre odbrane

- [ ] Na https://recmerva.github.io/pet/ proveri: meni, ceo tok kupovine, 404, prikaz na telefonu.
- [ ] Na računaru za odbranu otvori sajt i pokreni `localStorage.clear()`, da korpa bude prazna.
- [ ] Imaj projekat i lokalno (USB ili folder), u slučaju da nema interneta.
- [ ] U VS Code-u unapred otvori `main.js`, `data.js`, `prodavnica.js` i `style.css`.
- [ ] Jednom izgovori uvodnu priču i prođi demonstraciju naglas, sa merenjem vremena.
- [ ] Za svaki od 11 delova koda iznad, objasni ga bez gledanja u ovaj vodič.
