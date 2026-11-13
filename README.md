Šapa je web aplikacija online prodavnice za kućne ljubimce, namenjena prodaji hrane, opreme i igračaka za pse, mačke, ptice, ribice i glodare. Cilj projekta je da kupcima omogući jednostavno, pregledno i prijatno iskustvo kupovine, od pretrage proizvoda do potvrde porudžbine.

Aplikaciju sam razvila kao front-end projekat, bez backenda, pri čemu se kompletna logika prodavnice izvršava na klijentskoj strani, a podaci o korpi, listi želja i porudžbinama čuvaju se u pregledaču korisnika.

Glavne funkcionalnosti
Katalog proizvoda: Pregled svih proizvoda uz filtriranje po vrsti ljubimca, kategoriji, ceni i dostupnosti, kao i sortiranje po ceni, oceni i novitetima.
Pretraga: Pretraga proizvoda po nazivu u realnom vremenu, uz čuvanje filtera u URL adresi kako bi se rezultati mogli podeliti linkom.
Stranica proizvoda: Detaljan prikaz proizvoda sa opisom, karakteristikama, cenom, stanjem na lageru, recenzijama kupaca i predlogom sličnih proizvoda.
Korpa: Dodavanje, izmena količine i uklanjanje proizvoda, automatsko računanje ukupne cene i troškova dostave, uz besplatnu dostavu za porudžbine preko 3.000 dinara.
Kupon kodovi: Unos promotivnih kodova za popust uz proveru uslova za njihovo korišćenje.
Porudžbina: Forma za unos podataka o kupcu sa validacijom, izbor načina plaćanja i potvrda porudžbine sa brojem i okvirnim datumom isporuke.
Lista želja: Čuvanje omiljenih proizvoda za kasniju kupovinu.
Saveti: Blog sekcija sa savetima za ishranu, negu i opremu ljubimaca, uz filtriranje po vrsti ljubimca.
Kontakt: Kontakt forma, podaci o prodavnici, mapa lokacije i odgovori na najčešća pitanja.

Tehnologije
Na projektu koristim sledeće tehnologije:

Frontend: HTML5, CSS3, JavaScript (ES6+)
Čuvanje podataka: localStorage
Fontovi: Google Fonts (Fredoka, Work Sans, IBM Plex Mono)
Deployment: GitHub Pages
Verzionisanje koda: Git i GitHub

Dizajn i pristupačnost
Posebnu pažnju posvetila sam izgledu i lakoći korišćenja aplikacije. Dizajn je topao i prijateljski, inspirisan malom lokalnom prodavnicom, a aplikacija je potpuno prilagođena radu na računarima, tabletima i mobilnim telefonima. Sajt se može koristiti i isključivo pomoću tastature, elementi su opisani odgovarajućim aria atributima, a animacije se automatski isključuju kod korisnika koji su u podešavanjima sistema izabrali smanjeno kretanje.

Pokretanje projekta
Aplikacija ne zahteva instalaciju. Dovoljno je preuzeti projekat i otvoriti fajl index.html u pregledaču. Za testiranje korpe mogu se koristiti kupon kodovi SAPA10 (popust od 10%) i DOBRODOSLI (popust od 500 dinara za porudžbine preko 2.500 dinara).

Cilj projekta
Kroz ovaj projekat želela sam da napravim funkcionalnu i realističnu online prodavnicu koja pokriva ceo proces kupovine. Pored same implementacije, cilj mi je bio da unapredim svoje znanje iz front-end razvoja, organizacije JavaScript koda bez upotrebe frameworka, rada sa podacima na klijentskoj strani i izrade responzivnog i pristupačnog korisničkog interfejsa.
