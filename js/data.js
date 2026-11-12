/* =========================================================
   ŠAPA — podaci o proizvodima i savetima
   ---------------------------------------------------------
   Podaci su namerno u običnom JS fajlu (a ne u JSON-u koji
   se učitava preko fetch-a), da bi sajt radio i kada se
   index.html otvori direktno iz foldera (file://).

   Ključevi kategorija i potkategorija su bez dijakritika
   (psi, macke, igracke...) jer se koriste u URL-u; lepi
   nazivi za prikaz su u KATEGORIJE i POTKATEGORIJE.
   ========================================================= */

/* Vrste ljubimaca */
const KATEGORIJE = {
  psi:     { naziv: 'Psi',     emoji: '🐕' },
  macke:   { naziv: 'Mačke',   emoji: '🐈' },
  ptice:   { naziv: 'Ptice',   emoji: '🦜' },
  ribice:  { naziv: 'Ribice',  emoji: '🐠' },
  glodari: { naziv: 'Glodari', emoji: '🐹' }
};

/* Vrste proizvoda */
const POTKATEGORIJE = {
  hrana:   'Hrana',
  oprema:  'Oprema',
  igracke: 'Igračke',
  nega:    'Nega'
};

/*
  Polja proizvoda:
  id, slug, naziv, kategorija, potkategorija, cena, staraCena (ili null),
  emoji, kratakOpis, opis (niz pasusa), karakteristike (niz),
  tezina ili velicina, naStanju, ocena, brojRecenzija, novo,
  dodato (datum, za sortiranje „najnovije”), recenzije (niz).
*/
const PRODUCTS = [

  /* ---------------- PSI ---------------- */
  {
    id: 1,
    slug: 'suva-hrana-za-pse-lovac-15kg',
    naziv: 'Suva hrana za pse „Lovac” 15 kg',
    kategorija: 'psi',
    potkategorija: 'hrana',
    cena: 3290,
    staraCena: null,
    emoji: '🦴',
    kratakOpis: 'Bogata piletinom, za odrasle pse svih rasa.',
    opis: [
      '„Lovac” je kompletna suva hrana za odrasle pse kojoj je sveža piletina prvi i glavni sastojak. Recept je razvijen zajedno sa veterinarima-nutricionistima, tako da pas dobija sve što mu je potrebno za snagu, sjajnu dlaku i dobro varenje.',
      'Granule su srednje veličine i prilagođene psima od 10 do 40 kg. Dodati su omega-3 i omega-6 masne kiseline iz lososovog ulja, kao i glukozamin za zdrave zglobove kod aktivnih pasa.',
      'Pakovanje od 15 kg traje srednjem psu oko šest nedelja. Kesa ima zip zatvarač koji čuva svežinu i miris do poslednje granule.'
    ],
    karakteristike: [
      'Piletina kao prvi sastojak (32%)',
      'Bez veštačkih boja i konzervansa',
      'Za odrasle pse od 1 do 7 godina',
      'Dodat glukozamin i hondroitin',
      'Zip pakovanje koje se ponovo zatvara'
    ],
    tezina: '15 kg',
    naStanju: 24,
    ocena: 4.8,
    brojRecenzija: 126,
    novo: true,
    dodato: '2026-11-04',
    recenzije: [
      { ime: 'Milica R.', ocena: 5, datum: '2026-10-21', tekst: 'Moj bernski planinac je konačno prestao da probira hranu. Dlaka mu je primetno sjajnija posle mesec dana.' },
      { ime: 'Stefan J.', ocena: 5, datum: '2026-10-02', tekst: 'Odličan odnos cene i kvaliteta, a dostava je stigla za jedan dan.' },
      { ime: 'Ivana P.', ocena: 4, datum: '2026-09-14', tekst: 'Pas je obožava. Granule su mu malo krupne za mali stomak, ali se brzo navikao.' }
    ]
  },
  {
    id: 2,
    slug: 'igracka-za-vucu-konopac',
    naziv: 'Igračka za vuču „Konopac”',
    kategorija: 'psi',
    potkategorija: 'igracke',
    cena: 790,
    staraCena: null,
    emoji: '🎾',
    kratakOpis: 'Pamučno uže, otporno na kidanje, 35 cm.',
    opis: [
      'Klasična igračka za natezanje napravljena od debelog, čvrsto upredenog pamučnog užeta. Idealna je za igru vuče, bacanje i donošenje, ali i za samostalno žvakanje kada vas nema kod kuće.',
      'Vlakna užeta prilikom žvakanja blago čiste zube i masiraju desni. Konopac može da se opere u mašini na 30 °C, pa ostaje higijenski i posle mnogo partija igre.'
    ],
    karakteristike: [
      '100% prirodni pamuk, bez boja',
      'Dužina 35 cm, dva čvora za hvat',
      'Pomaže u čišćenju zuba',
      'Pere se u mašini na 30 °C'
    ],
    velicina: '35 cm',
    naStanju: 40,
    ocena: 4.6,
    brojRecenzija: 58,
    novo: false,
    dodato: '2026-03-10',
    recenzije: [
      { ime: 'Luka M.', ocena: 5, datum: '2026-08-30', tekst: 'Preživeo je mesec dana sa našim stafordom, što je ozbiljan rekord.' },
      { ime: 'Jelena T.', ocena: 4, datum: '2026-07-12', tekst: 'Dobra igračka, posle pranja se malo raspliće na krajevima.' }
    ]
  },
  {
    id: 3,
    slug: 'meki-krevet-za-pse-oblak-m',
    naziv: 'Meki krevet za pse „Oblak” M',
    kategorija: 'psi',
    potkategorija: 'oprema',
    cena: 4490,
    staraCena: 5290,
    emoji: '🛏️',
    kratakOpis: 'Pliš sa uzdignutim ivicama za miran san.',
    opis: [
      '„Oblak” je okrugli krevet od mekog pliša sa uzdignutim ivicama na koje pas može da nasloni glavu. Takav oblik daje osećaj sigurnosti i posebno prija nervoznijim psima i psima koji vole da spavaju sklupčani.',
      'Dno je protivklizno i vodootporno, pa krevet ostaje na mestu i na pločicama i na parketu. Ceo krevet može da se pere u mašini, a punjenje se brzo vraća u prvobitni oblik.',
      'Veličina M odgovara psima do 18 kg, poput bigla, korgija ili francuskog buldoga.'
    ],
    karakteristike: [
      'Prečnik 70 cm, visina ivice 18 cm',
      'Protivklizno, vodootporno dno',
      'Pere se u mašini na 40 °C',
      'Za pse do 18 kg'
    ],
    velicina: '70 × 55 cm',
    naStanju: 8,
    ocena: 4.7,
    brojRecenzija: 41,
    novo: false,
    dodato: '2026-05-18',
    recenzije: [
      { ime: 'Ana K.', ocena: 5, datum: '2026-10-11', tekst: 'Naša kuca je prvu noć prespavala u njemu bez ijednog buđenja. Prelep je i uživo.' },
      { ime: 'Marko V.', ocena: 4, datum: '2026-09-03', tekst: 'Kvalitetan, ali uzmite veću veličinu ako pas voli da se ispruži.' }
    ]
  },
  {
    id: 4,
    slug: 'povodac-reflektujuci-2m',
    naziv: 'Povodac sa reflektujućim šavom 2 m',
    kategorija: 'psi',
    potkategorija: 'oprema',
    cena: 1290,
    staraCena: null,
    emoji: '🦮',
    kratakOpis: 'Za bezbedne večernje šetnje, sa mekom ručkom.',
    opis: [
      'Najlonski povodac sa reflektujućim šavom celom dužinom, tako da vas vozači vide i u sumrak i po kiši. Ručka je obložena neoprenom i ne žulja ni kada pas naglo povuče.',
      'Metalni karabin se okreće za 360°, pa se povodac ne uvrće dok pas istražuje okolinu. Na ručki se nalazi i mala alka za kesice ili ključeve.'
    ],
    karakteristike: [
      'Dužina 200 cm, širina 2 cm',
      'Reflektujući šav celom dužinom',
      'Neoprenska ručka',
      'Karabin koji se okreće za 360°'
    ],
    velicina: '200 cm × 2 cm',
    naStanju: 3,
    ocena: 4.5,
    brojRecenzija: 33,
    novo: false,
    dodato: '2026-02-22',
    recenzije: [
      { ime: 'Nikola S.', ocena: 5, datum: '2026-10-25', tekst: 'Reflektujući deo zaista dobro radi, vidi se izdaleka kad farovi obasjaju.' },
      { ime: 'Tamara Đ.', ocena: 4, datum: '2026-08-19', tekst: 'Odličan povodac, samo bih volela da ima više boja.' }
    ]
  },
  {
    id: 5,
    slug: 'sampon-za-pse-sa-ovsom',
    naziv: 'Šampon za pse sa ovsom 250 ml',
    kategorija: 'psi',
    potkategorija: 'nega',
    cena: 890,
    staraCena: null,
    emoji: '🧴',
    kratakOpis: 'Blag šampon za osetljivu kožu, bez parabena.',
    opis: [
      'Nežan šampon sa ekstraktom ovsa i alojom, namenjen psima sa suvom i osetljivom kožom. Umiruje svrab, ne isušuje dlaku i lako se ispira, što je važno za pse koji ne vole dugo kupanje.',
      'Formula je pH prilagođena koži pasa i ne sadrži parabene ni sulfate. Prijatan, blag miris ostaje nekoliko dana posle kupanja.'
    ],
    karakteristike: [
      'Ekstrakt ovsa i aloje',
      'pH prilagođen koži pasa',
      'Bez parabena i sulfata',
      'Za pse starije od 12 nedelja'
    ],
    tezina: '250 ml',
    naStanju: 17,
    ocena: 4.4,
    brojRecenzija: 22,
    novo: true,
    dodato: '2026-10-29',
    recenzije: [
      { ime: 'Sara B.', ocena: 5, datum: '2026-11-06', tekst: 'Naš maltezer se više ne češe posle kupanja. Miris je blag i prijatan.' },
      { ime: 'Đorđe L.', ocena: 4, datum: '2026-11-01', tekst: 'Dobro se peni i lako ispira. Pakovanje je moglo biti veće.' }
    ]
  },
  {
    id: 6,
    slug: 'dental-poslastice-svez-dah',
    naziv: 'Dental poslastice „Svež dah”, 28 kom',
    kategorija: 'psi',
    potkategorija: 'hrana',
    cena: 1190,
    staraCena: 1390,
    emoji: '🦷',
    kratakOpis: 'Štapići koji čiste zube i osvežavaju dah.',
    opis: [
      'Dental štapići u obliku zvezde čije ivice mehanički uklanjaju kamenac dok pas žvaće. Dodati su zeleni čaj i eukaliptus koji prirodno osvežavaju dah.',
      'Preporučuje se jedan štapić dnevno, kao zamena za deo dnevnog obroka. Pakovanje od 28 komada traje četiri nedelje.'
    ],
    karakteristike: [
      '28 štapića u pakovanju',
      'Smanjuju stvaranje kamenca',
      'Sa zelenim čajem i eukaliptusom',
      'Za pse od 10 do 25 kg'
    ],
    tezina: '720 g',
    naStanju: 0,
    ocena: 4.3,
    brojRecenzija: 47,
    novo: false,
    dodato: '2026-04-05',
    recenzije: [
      { ime: 'Petar G.', ocena: 4, datum: '2026-09-28', tekst: 'Pas ih obožava, a dah mu je zaista bolji. Šteta što brzo nestanu sa stanja.' },
      { ime: 'Mina Ć.', ocena: 5, datum: '2026-08-07', tekst: 'Veterinar je primetio manje kamenca na sledećem pregledu.' }
    ]
  },

  /* ---------------- MAČKE ---------------- */
  {
    id: 7,
    slug: 'konzerva-za-macke-losos-6x400g',
    naziv: 'Konzerva za mačke, losos (6 × 400 g)',
    kategorija: 'macke',
    potkategorija: 'hrana',
    cena: 1590,
    staraCena: 1870,
    emoji: '🐟',
    kratakOpis: 'Bez žitarica, 400 g, pakovanje od 6.',
    opis: [
      'Vlažna hrana od komadića lososa u sopstvenom soku, bez žitarica i bez dodatog šećera. Visok udeo vode pomaže mačkama koje malo piju, što je važno za zdravlje bubrega i mokraćnih puteva.',
      'Konzerva od 400 g dovoljna je za dva do tri obroka prosečne mačke. Otvorenu konzervu čuvajte u frižideru, poklopljenu, najduže dva dana.'
    ],
    karakteristike: [
      '6 konzervi po 400 g',
      'Bez žitarica i dodatog šećera',
      'Losos kao glavni izvor proteina',
      'Za odrasle mačke'
    ],
    tezina: '6 × 400 g',
    naStanju: 30,
    ocena: 4.7,
    brojRecenzija: 89,
    novo: false,
    dodato: '2026-06-02',
    recenzije: [
      { ime: 'Nemanja D.', ocena: 5, datum: '2026-10-30', tekst: 'Đumbir pojede sve do poslednjeg komadića, što ranije nije bio slučaj.' },
      { ime: 'Katarina M.', ocena: 4, datum: '2026-09-22', tekst: 'Kvalitetna hrana, jedino miris nije baš prijatan za ljude.' },
      { ime: 'Vesna A.', ocena: 5, datum: '2026-08-15', tekst: 'Super cena na akciji, uzela sam odmah dva pakovanja.' }
    ]
  },
  {
    id: 8,
    slug: 'grebalica-toranj-110cm',
    naziv: 'Grebalica „Toranj” 110 cm',
    kategorija: 'macke',
    potkategorija: 'oprema',
    cena: 6000,
    staraCena: null,
    emoji: '🐾',
    kratakOpis: 'Tri sprata, sa visećom kućicom i loptom.',
    opis: [
      '„Toranj” je grebalica na tri nivoa sa stubovima obmotanim prirodnim sisalom, kućicom za odmor, platformom za osmatranje i visećom lopticom za igru. Mačka dobija mesto za grebanje, penjanje i spavanje na jednom mestu.',
      'Široka i teška osnova sprečava ljuljanje čak i kada mačka skače sa najvišeg nivoa. Pliš na platformama je lako skidiv za čišćenje.',
      'Uz grebalicu dobijate alat i jednostavno uputstvo, a sklapanje traje oko 20 minuta.'
    ],
    karakteristike: [
      'Visina 110 cm, osnova 50 × 50 cm',
      'Stubovi od prirodnog sisala',
      'Kućica, dve platforme i viseća loptica',
      'Montaža za oko 20 minuta'
    ],
    velicina: '110 cm',
    naStanju: 5,
    ocena: 4.9,
    brojRecenzija: 64,
    novo: false,
    dodato: '2026-01-15',
    recenzije: [
      { ime: 'Nemanja D.', ocena: 5, datum: '2026-10-08', tekst: 'Mačka je odmah prihvatila novi toranj umesto sofe. Sofa vam se zahvaljuje.' },
      { ime: 'Lana P.', ocena: 5, datum: '2026-07-29', tekst: 'Stabilna i lepa, uklapa se u dnevnu sobu.' }
    ]
  },
  {
    id: 9,
    slug: 'posip-za-macke-bentonit-10l',
    naziv: 'Posip za mačke, bentonit 10 l',
    kategorija: 'macke',
    potkategorija: 'nega',
    cena: 990,
    staraCena: null,
    emoji: '🪣',
    kratakOpis: 'Grudvajući posip koji zadržava neprijatne mirise.',
    opis: [
      'Prirodni bentonitni posip koji u dodiru sa tečnošću stvara čvrste grudvice, pa se lako uklanja lopaticom bez menjanja celog sadržaja toaleta. Tako jedno pakovanje traje i do mesec dana za jednu mačku.',
      'Sitna zrna su prijatna za šape, a posip skoro da ne pravi prašinu. Dodat je aktivni ugalj koji upija neprijatne mirise.'
    ],
    karakteristike: [
      'Prirodni bentonit sa aktivnim ugljem',
      'Stvara čvrste grudvice',
      'Skoro bez prašine',
      'Bez mirisa i parfema'
    ],
    tezina: '10 l (oko 8 kg)',
    naStanju: 50,
    ocena: 4.5,
    brojRecenzija: 112,
    novo: false,
    dodato: '2025-11-20',
    recenzije: [
      { ime: 'Bojana N.', ocena: 5, datum: '2026-10-17', tekst: 'Najbolji posip koji smo probali, miris se stvarno ne oseća.' },
      { ime: 'Aleksa R.', ocena: 4, datum: '2026-09-05', tekst: 'Dobar je, ali kesa je teška za nošenje uz stepenice. Srećom, dostava je do vrata.' }
    ]
  },
  {
    id: 10,
    slug: 'stap-sa-perjem-lovica',
    naziv: 'Štap sa perjem „Lovica”',
    kategorija: 'macke',
    potkategorija: 'igracke',
    cena: 490,
    staraCena: null,
    emoji: '🪶',
    kratakOpis: 'Interaktivna igračka koja budi lovački instinkt.',
    opis: [
      'Savitljivi štap sa elastičnom niti na čijem kraju je perje i mali zvončić. Kada ga pomerate, perje leprša kao ptica, pa ni najlenja mačka ne može da odoli.',
      'Svakodnevna igra od desetak minuta pomaže mačkama u stanu da potroše energiju i smanjuje noćno „trčanje po zidovima”. Perje se može zameniti rezervnim.'
    ],
    karakteristike: [
      'Dužina štapa 90 cm',
      'Prirodno perje i zvončić',
      'Elastična nit od 60 cm',
      'Rezervni privezak u pakovanju'
    ],
    velicina: '90 cm',
    naStanju: 25,
    ocena: 4.6,
    brojRecenzija: 37,
    novo: true,
    dodato: '2026-11-02',
    recenzije: [
      { ime: 'Jovana S.', ocena: 5, datum: '2026-11-08', tekst: 'Naša mačka od 12 godina se igra kao mače. Najbolja investicija od 490 dinara.' },
      { ime: 'Filip K.', ocena: 4, datum: '2026-11-04', tekst: 'Zabavno, ali sklonite ga posle igre jer će ga mačka sama „uloviti”.' }
    ]
  },
  {
    id: 11,
    slug: 'suva-hrana-za-macke-piletina-pirinac-2kg',
    naziv: 'Suva hrana za mačke, piletina i pirinač 2 kg',
    kategorija: 'macke',
    potkategorija: 'hrana',
    cena: 1890,
    staraCena: null,
    emoji: '🍗',
    kratakOpis: 'Lako svarljiva hrana za odrasle mačke.',
    opis: [
      'Kompletna suva hrana sa piletinom i pirinčem, posebno pogodna za mačke osetljivog stomaka. Pirinač je lako svarljiv izvor energije, a dodata vlakna smanjuju stvaranje loptica od dlake.',
      'Hrana sadrži taurin za zdravo srce i vid, kao i kontrolisan nivo minerala koji podržava zdravlje mokraćnih puteva.'
    ],
    karakteristike: [
      'Piletina kao glavni sastojak',
      'Dodat taurin',
      'Smanjuje stvaranje loptica od dlake',
      'Za odrasle mačke od 1 godine'
    ],
    tezina: '2 kg',
    naStanju: 2,
    ocena: 4.6,
    brojRecenzija: 71,
    novo: false,
    dodato: '2026-04-28',
    recenzije: [
      { ime: 'Marija V.', ocena: 5, datum: '2026-10-19', tekst: 'Prestala su povraćanja kod naše persijske mačke. Hvala na preporuci!' },
      { ime: 'Ognjen T.', ocena: 4, datum: '2026-08-11', tekst: 'Mačke je jedu rado, granule su male i hrskave.' }
    ]
  },
  {
    id: 12,
    slug: 'cetka-za-rascesljavanje-dlake',
    naziv: 'Četka za raščešljavanje dlake',
    kategorija: 'macke',
    potkategorija: 'nega',
    cena: 1090,
    staraCena: 1290,
    emoji: '🪮',
    kratakOpis: 'Uklanja mrtvu dlaku jednim pritiskom dugmeta.',
    opis: [
      'Četka sa tankim, savijenim iglicama koje skupljaju mrtvu dlaku i razmršuju čvorove, a pritom ne grebu kožu. Pritiskom na dugme iglice se uvlače i sva dlaka se skida sa četke u jednom potezu.',
      'Redovno četkanje smanjuje količinu dlake na nameštaju i broj loptica od dlake koje mačka proguta. Pogodna je i za male pse.'
    ],
    karakteristike: [
      'Iglice sa zaobljenim vrhovima',
      'Dugme za brzo čišćenje',
      'Ergonomska, gumirana drška',
      'Za kratku i dugu dlaku'
    ],
    velicina: '18 × 6 cm',
    naStanju: 12,
    ocena: 4.3,
    brojRecenzija: 19,
    novo: false,
    dodato: '2026-03-30',
    recenzije: [
      { ime: 'Danica F.', ocena: 4, datum: '2026-09-25', tekst: 'Za mesec dana mnogo manje dlake na kauču. Mačka čak uživa u četkanju.' },
      { ime: 'Vuk I.', ocena: 5, datum: '2026-07-04', tekst: 'Dugme za čišćenje je genijalno, nema više čupkanja dlake prstima.' }
    ]
  },

  /* ---------------- PTICE ---------------- */
  {
    id: 13,
    slug: 'mesavina-semenki-za-tigrice-1kg',
    naziv: 'Mešavina semenki za tigrice 1 kg',
    kategorija: 'ptice',
    potkategorija: 'hrana',
    cena: 690,
    staraCena: null,
    emoji: '🌾',
    kratakOpis: 'Proso, ovas i suvo voće, 1 kg.',
    opis: [
      'Uravnotežena mešavina žutog i crvenog prosa, kanarskog semena, oljuštenog ovsa i komadića suvog voća. Sastav je prilagođen tigricama i drugim malim papagajima kojima je potrebno raznovrsno seme za dobro zdravlje.',
      'Seme je očišćeno od prašine i pakovano u kesu sa ventilom koja čuva svežinu. Uz mešavinu preporučujemo i svež zeleniš nekoliko puta nedeljno.'
    ],
    karakteristike: [
      'Proso, kanarsko seme i ovas',
      'Sa komadićima suvog voća',
      'Očišćeno od prašine',
      'Za tigrice i male papagaje'
    ],
    tezina: '1 kg',
    naStanju: 60,
    ocena: 4.7,
    brojRecenzija: 48,
    novo: false,
    dodato: '2025-12-12',
    recenzije: [
      { ime: 'Zorana K.', ocena: 5, datum: '2026-10-14', tekst: 'Moje tigrice prvo pojedu voće, pa onda sve ostalo. Nema ostataka.' },
      { ime: 'Branko L.', ocena: 4, datum: '2026-08-26', tekst: 'Kvalitetno seme, bez prašine. Uzimam redovno.' }
    ]
  },
  {
    id: 14,
    slug: 'kavez-za-papagaje-vila',
    naziv: 'Kavez za papagaje „Vila”',
    kategorija: 'ptice',
    potkategorija: 'oprema',
    cena: 7490,
    staraCena: 8490,
    emoji: '🏡',
    kratakOpis: 'Prostran kavez sa izvlačnim dnom i tri prečke.',
    opis: [
      '„Vila” je prostran kavez za tigrice, nimfe i druge manje papagaje. Horizontalne žice olakšavaju pticama penjanje, a velika prednja vrata omogućavaju da ruku slobodno uvučete unutra.',
      'Izvlačno dno i rešetka iznad njega čine čišćenje brzim i čistim. U kompletu su tri drvene prečke, dve hranilice i pojilica.',
      'Kavez stoji na četiri gumirane nožice koje ne grebu nameštaj.'
    ],
    karakteristike: [
      'Dimenzije 60 × 40 × 80 cm',
      'Izvlačno dno i zaštitna rešetka',
      '3 drvene prečke, 2 hranilice, pojilica',
      'Razmak žica 1,2 cm'
    ],
    velicina: '60 × 40 × 80 cm',
    naStanju: 4,
    ocena: 4.6,
    brojRecenzija: 15,
    novo: false,
    dodato: '2026-05-06',
    recenzije: [
      { ime: 'Emina H.', ocena: 5, datum: '2026-10-03', tekst: 'Dve nimfe imaju dovoljno mesta, a čišćenje traje pet minuta.' },
      { ime: 'Saša P.', ocena: 4, datum: '2026-07-21', tekst: 'Lep kavez, sklapanje je moglo da bude jednostavnije.' }
    ]
  },
  {
    id: 15,
    slug: 'ljuljaska-za-ptice-sa-zvoncem',
    naziv: 'Ljuljaška za ptice sa zvoncem',
    kategorija: 'ptice',
    potkategorija: 'igracke',
    cena: 450,
    staraCena: null,
    emoji: '🔔',
    kratakOpis: 'Drvena ljuljaška sa šarenim perlama.',
    opis: [
      'Ljuljaška od prirodnog drveta sa šarenim drvenim perlama i malim zvoncem. Ptice vole da se ljuljaju i da kljunom zvone, što ih zabavlja i kada su same kod kuće.',
      'Lako se kači na vrh kaveza pomoću metalne kukice. Boje na perlama su na bazi vode i bezbedne za ptice.'
    ],
    karakteristike: [
      'Prirodno drvo i drvene perle',
      'Boje bezbedne za ptice',
      'Metalna kukica za kačenje',
      'Za tigrice, kanarince i nimfe'
    ],
    velicina: '15 × 20 cm',
    naStanju: 33,
    ocena: 4.4,
    brojRecenzija: 27,
    novo: true,
    dodato: '2026-10-24',
    recenzije: [
      { ime: 'Ivan C.', ocena: 4, datum: '2026-11-05', tekst: 'Tigrica je bila sumnjičava prva dva dana, sada ne silazi sa nje.' },
      { ime: 'Nina D.', ocena: 5, datum: '2026-10-30', tekst: 'Slatka i dobro napravljena. Zvonce je tiho, ne smeta.' }
    ]
  },
  {
    id: 16,
    slug: 'sipina-kost-sa-mineralima',
    naziv: 'Sipina kost sa mineralima, 2 kom',
    kategorija: 'ptice',
    potkategorija: 'hrana',
    cena: 290,
    staraCena: null,
    emoji: '🐚',
    kratakOpis: 'Prirodan izvor kalcijuma i za brušenje kljuna.',
    opis: [
      'Prirodna sipina kost je odličan izvor kalcijuma i minerala, posebno važan za ženke tokom nošenja jaja. Ptice je kljucaju po potrebi, a pri tome prirodno bruse kljun.',
      'Pakovanje sadrži dve kosti sa držačima koji se lako pričvršćuju za žice kaveza.'
    ],
    karakteristike: [
      '2 kosti sa držačima',
      'Prirodan izvor kalcijuma',
      'Pomaže brušenje kljuna',
      'Za sve vrste ptica u kavezu'
    ],
    tezina: '2 × 12 cm',
    naStanju: 80,
    ocena: 4.8,
    brojRecenzija: 54,
    novo: false,
    dodato: '2025-10-08',
    recenzije: [
      { ime: 'Dragana M.', ocena: 5, datum: '2026-09-18', tekst: 'Neophodna stvar, uvek imam jednu rezervnu.' },
      { ime: 'Miloš Ž.', ocena: 5, datum: '2026-06-02', tekst: 'Jeftino i korisno, kanarinci je obožavaju.' }
    ]
  },
  {
    id: 17,
    slug: 'kupatilo-za-ptice-providno',
    naziv: 'Kupatilo za ptice, providno',
    kategorija: 'ptice',
    potkategorija: 'nega',
    cena: 590,
    staraCena: null,
    emoji: '🛁',
    kratakOpis: 'Kači se na vrata kaveza, voda ne prska.',
    opis: [
      'Zatvoreno kupatilo od providne plastike koje se kači na otvor vrata kaveza. Ptica može da se kupa kad god poželi, a voda i seme ne prskaju po sobi.',
      'Redovno kupanje održava perje čistim i sjajnim i pomaže pticama tokom mitarenja. Kupatilo se lako skida i pere.'
    ],
    karakteristike: [
      'Providna, čvrsta plastika',
      'Kači se na vrata kaveza',
      'Sprečava prskanje vode',
      'Lako se skida i pere'
    ],
    velicina: '15 × 14 × 16 cm',
    naStanju: 0,
    ocena: 4.2,
    brojRecenzija: 11,
    novo: false,
    dodato: '2026-02-14',
    recenzije: [
      { ime: 'Selma B.', ocena: 4, datum: '2026-08-09', tekst: 'Konačno suv pod oko kaveza! Tigrice su ga prihvatile posle nekoliko dana.' },
      { ime: 'Goran R.', ocena: 4, datum: '2026-05-27', tekst: 'Dobro rešenje, mada bi otvor mogao biti malo veći.' }
    ]
  },
  {
    id: 18,
    slug: 'pojilica-sa-dozatorom-200ml',
    naziv: 'Pojilica sa dozatorom 200 ml',
    kategorija: 'ptice',
    potkategorija: 'oprema',
    cena: 390,
    staraCena: null,
    emoji: '💧',
    kratakOpis: 'Voda ostaje čista ceo dan.',
    opis: [
      'Pojilica sa rezervoarom koji automatski dopunjava posudicu kako ptica pije. Voda je zaštićena od semenki i perja, pa ostaje čista znatno duže nego u otvorenoj posudi.',
      'Kači se spolja na kavez, tako da je dopunjavate bez otvaranja vrata.'
    ],
    karakteristike: [
      'Zapremina 200 ml',
      'Automatsko dopunjavanje',
      'Kači se spolja na kavez',
      'Bez BPA'
    ],
    tezina: '200 ml',
    naStanju: 45,
    ocena: 4.5,
    brojRecenzija: 30,
    novo: false,
    dodato: '2025-09-19',
    recenzije: [
      { ime: 'Mirjana S.', ocena: 5, datum: '2026-09-09', tekst: 'Jednostavno i praktično, voda je čista do večeri.' },
      { ime: 'Dejan U.', ocena: 4, datum: '2026-04-16', tekst: 'Radi kako treba, samo je treba prati jednom nedeljno.' }
    ]
  },

  /* ---------------- RIBICE ---------------- */
  {
    id: 19,
    slug: 'akvarijum-set-60l-sa-filterom',
    naziv: 'Akvarijum set 60 l sa filterom',
    kategorija: 'ribice',
    potkategorija: 'oprema',
    cena: 8990,
    staraCena: null,
    emoji: '🪸',
    kratakOpis: 'Kompletan set za početnike, uklj. osvetljenje.',
    opis: [
      'Sve što vam je potrebno za prvi akvarijum u jednoj kutiji: staklena posuda od 60 litara, unutrašnji filter, grejač sa termostatom, LED osvetljenje u poklopcu i termometar.',
      'LED svetlo ima dnevni i noćni režim, troši malo struje i pospešuje rast biljaka. Filter je tih i ima tri stepena filtracije, pa voda ostaje bistra uz minimalno održavanje.',
      'U kutiji je i štampani vodič za postavljanje akvarijuma i uhodavanje vode pre unošenja ribica.'
    ],
    karakteristike: [
      'Zapremina 60 l, dimenzije 61 × 31 × 36 cm',
      'Unutrašnji filter sa tri stepena',
      'Grejač 50 W sa termostatom',
      'LED osvetljenje sa dva režima',
      'Vodič za početnike u pakovanju'
    ],
    velicina: '61 × 31 × 36 cm',
    naStanju: 6,
    ocena: 4.8,
    brojRecenzija: 39,
    novo: false,
    dodato: '2026-01-28',
    recenzije: [
      { ime: 'Amina H.', ocena: 5, datum: '2026-10-27', tekst: 'Osoblje mi je pomoglo oko izbora, a set ima baš sve. Ribice su odlično!' },
      { ime: 'Rade N.', ocena: 5, datum: '2026-09-15', tekst: 'Filter je zaista tih, ne čuje se u spavaćoj sobi.' },
      { ime: 'Teodora V.', ocena: 4, datum: '2026-07-30', tekst: 'Odličan set, jedino sam dokupila jači grejač za zimu.' }
    ]
  },
  {
    id: 20,
    slug: 'biljke-za-akvarijum-set-od-5',
    naziv: 'Biljke za akvarijum, set od 5',
    kategorija: 'ribice',
    potkategorija: 'oprema',
    cena: 1290,
    staraCena: 1430,
    emoji: '🌿',
    kratakOpis: 'Prirodne biljke, lako za održavanje.',
    opis: [
      'Pažljivo odabran set od pet živih biljaka koje ne zahtevaju jako osvetljenje ni dodavanje CO₂: anubijas, javanska paprat, kriptokorina, valisnerija i mahovina.',
      'Žive biljke troše višak hranljivih materija iz vode i tako sprečavaju razvoj algi, a ribicama pružaju zaklon i mesto za odmor.'
    ],
    karakteristike: [
      '5 različitih vrsta biljaka',
      'Ne zahtevaju CO₂',
      'Pogodne za početnike',
      'Uzgajane bez pesticida'
    ],
    velicina: '10–25 cm',
    naStanju: 14,
    ocena: 4.5,
    brojRecenzija: 26,
    novo: false,
    dodato: '2026-06-20',
    recenzije: [
      { ime: 'Tijana O.', ocena: 5, datum: '2026-10-09', tekst: 'Stigle su sveže i dobro upakovane. Posle dve nedelje već puštaju nove listove.' },
      { ime: 'Bogdan Š.', ocena: 4, datum: '2026-08-23', tekst: 'Lep set, valisnerija je malo stradala u transportu ali se oporavila.' }
    ]
  },
  {
    id: 21,
    slug: 'hrana-u-listicima-za-tropske-ribe',
    naziv: 'Hrana u listićima za tropske ribe 250 ml',
    kategorija: 'ribice',
    potkategorija: 'hrana',
    cena: 590,
    staraCena: null,
    emoji: '🥣',
    kratakOpis: 'Osnovna ishrana za sve tropske ribice.',
    opis: [
      'Listići koji polako tonu, pa ih mogu jesti i ribe koje plivaju pri površini i one u srednjem sloju vode. Sadrže spirulinu i krila koji ističu prirodne boje ribica.',
      'Hrana ne muti vodu kada se daje u preporučenim količinama: onoliko koliko ribice pojedu za dva do tri minuta, jednom ili dva puta dnevno.'
    ],
    karakteristike: [
      'Sa spirulinom i krilom',
      'Ističe prirodne boje',
      'Ne muti vodu',
      'Za sve tropske vrste'
    ],
    tezina: '250 ml (50 g)',
    naStanju: 70,
    ocena: 4.7,
    brojRecenzija: 83,
    novo: true,
    dodato: '2026-11-07',
    recenzije: [
      { ime: 'Uroš B.', ocena: 5, datum: '2026-11-09', tekst: 'Gupiji su posle par nedelja mnogo živopisniji. Preporuka.' },
      { ime: 'Maja K.', ocena: 4, datum: '2026-11-06', tekst: 'Dobra hrana, pakovanje traje dugo.' }
    ]
  },
  {
    id: 22,
    slug: 'kondicioner-za-vodu-bistra',
    naziv: 'Kondicioner za vodu „Bistra” 250 ml',
    kategorija: 'ribice',
    potkategorija: 'nega',
    cena: 690,
    staraCena: null,
    emoji: '🧪',
    kratakOpis: 'Čini vodu iz česme bezbednom za ribice.',
    opis: [
      'Kondicioner trenutno neutrališe hlor i teške metale iz vode sa česme, pa svaku promenu vode čini bezbednom za ribice. Dodati koloidi štite sluzokožu riba od stresa i povreda.',
      'Doziranje je jednostavno: 5 ml na 20 litara sveže vode. Bočica od 250 ml dovoljna je za 1.000 litara.'
    ],
    karakteristike: [
      'Neutrališe hlor i teške metale',
      'Štiti sluzokožu riba',
      '5 ml na 20 l vode',
      'Dovoljno za 1.000 l'
    ],
    tezina: '250 ml',
    naStanju: 22,
    ocena: 4.6,
    brojRecenzija: 44,
    novo: false,
    dodato: '2025-11-03',
    recenzije: [
      { ime: 'Aleksandar P.', ocena: 5, datum: '2026-09-29', tekst: 'Koristim godinama, nikada nisam imao problem pri menjanju vode.' },
      { ime: 'Sanja Lj.', ocena: 4, datum: '2026-06-18', tekst: 'Radi posao, mera na čepu je praktična.' }
    ]
  },
  {
    id: 23,
    slug: 'ukrasni-zamak-sa-tunelom',
    naziv: 'Ukrasni zamak sa tunelom',
    kategorija: 'ribice',
    potkategorija: 'igracke',
    cena: 1490,
    staraCena: null,
    emoji: '🏰',
    kratakOpis: 'Dekoracija i skrovište za ribice.',
    opis: [
      'Ručno oslikan zamak od netoksične smole sa tunelima i prozorima kroz koje ribice mogu da plivaju. Pruža im skrovište i smanjuje stres, posebno kod stidljivijih vrsta.',
      'Ivice su glatke, pa se ribe sa dugim perajima ne mogu povrediti. Zamak ne menja hemijski sastav vode.'
    ],
    karakteristike: [
      'Netoksična smola, ručno oslikano',
      'Glatke ivice',
      'Tuneli i prozori za plivanje',
      'Ne utiče na sastav vode'
    ],
    velicina: '18 × 12 × 15 cm',
    naStanju: 9,
    ocena: 4.4,
    brojRecenzija: 17,
    novo: true,
    dodato: '2026-10-31',
    recenzije: [
      { ime: 'Lazar M.', ocena: 5, datum: '2026-11-07', tekst: 'Deca su oduševljena, a ribice se stalno vrzmaju oko kula.' },
      { ime: 'Kristina J.', ocena: 4, datum: '2026-11-03', tekst: 'Lep detalj, boje su manje jarke nego na slici, ali prirodnije.' }
    ]
  },
  {
    id: 24,
    slug: 'granule-za-zlatne-ribice-100g',
    naziv: 'Granule za zlatne ribice 100 g',
    kategorija: 'ribice',
    potkategorija: 'hrana',
    cena: 390,
    staraCena: null,
    emoji: '🐡',
    kratakOpis: 'Plutajuće granule za hladnovodne ribe.',
    opis: [
      'Plutajuće granule posebno pripremljene za zlatne ribice i druge hladnovodne vrste. Lako su svarljive, pa ostavljaju manje otpada i voda duže ostaje čista.',
      'Dodat je vitamin C koji jača otpornost ribica. Hranite ih dva puta dnevno, onoliko koliko pojedu za dva minuta.'
    ],
    karakteristike: [
      'Plutajuće granule',
      'Dodat vitamin C',
      'Manje otpada u vodi',
      'Za zlatne ribice i koi'
    ],
    tezina: '100 g',
    naStanju: 3,
    ocena: 4.3,
    brojRecenzija: 21,
    novo: false,
    dodato: '2026-03-03',
    recenzije: [
      { ime: 'Nevena G.', ocena: 4, datum: '2026-09-12', tekst: 'Zlatne ribice ih rado jedu, voda je bistrija nego sa listićima.' },
      { ime: 'Pavle T.', ocena: 5, datum: '2026-05-08', tekst: 'Dobra cena za kvalitet.' }
    ]
  },

  /* ---------------- GLODARI ---------------- */
  {
    id: 25,
    slug: 'kavez-za-hrcka-tunel-delux',
    naziv: 'Kavez za hrčka „Tunel Delux”',
    kategorija: 'glodari',
    potkategorija: 'oprema',
    cena: 5190,
    staraCena: null,
    emoji: '🌰',
    kratakOpis: 'Sa točkom za trčanje i tunelima na dva sprata.',
    opis: [
      'Kavez na dva nivoa sa providnim tunelima, kućicom za spavanje, točkom za trčanje, pojilicom i posudom za hranu. Hrčak dobija mesto za istraživanje, kopanje i odmor.',
      'Duboko plastično dno sprečava rasipanje stelje, a gornji deo se skida u celosti radi lakšeg čišćenja. Tuneli se mogu rasporediti na više načina.'
    ],
    karakteristike: [
      'Dimenzije 58 × 38 × 45 cm',
      'Dva nivoa i providni tuneli',
      'Točak, kućica, pojilica i posuda',
      'Duboko dno protiv rasipanja'
    ],
    velicina: '58 × 38 × 45 cm',
    naStanju: 7,
    ocena: 4.7,
    brojRecenzija: 29,
    novo: true,
    dodato: '2026-11-09',
    recenzije: [
      { ime: 'Andrej K.', ocena: 5, datum: '2026-11-10', tekst: 'Hrčak je ceo prvi dan proveo istražujući tunele. Sklapanje lako.' },
      { ime: 'Ema S.', ocena: 4, datum: '2026-11-10', tekst: 'Prelep kavez, točak je mogao biti malo veći za sirijskog hrčka.' }
    ]
  },
  {
    id: 26,
    slug: 'seno-sa-livade-1kg',
    naziv: 'Seno sa livade 1 kg',
    kategorija: 'glodari',
    potkategorija: 'hrana',
    cena: 490,
    staraCena: null,
    emoji: '🌱',
    kratakOpis: 'Mirisno seno prvog otkosa sa planinskih livada.',
    opis: [
      'Seno prvog otkosa sa livada Pešterske visoravni, bogato vlaknima i lekovitim travama. Osnova je ishrane zečeva, zamoraca i činčila i pomaže pravilno trošenje zuba.',
      'Seno je prirodno sušeno i očišćeno od prašine, a pakovano je u kartonsku kutiju koja „diše”, pa ne gubi miris i boju.'
    ],
    karakteristike: [
      'Prvi otkos, planinske livade',
      'Bogato vlaknima',
      'Očišćeno od prašine',
      'Za zečeve, zamorce i činčile'
    ],
    tezina: '1 kg',
    naStanju: 90,
    ocena: 4.8,
    brojRecenzija: 102,
    novo: false,
    dodato: '2025-08-25',
    recenzije: [
      { ime: 'Lejla A.', ocena: 5, datum: '2026-10-22', tekst: 'Miriše kao livada kad se otvori kutija. Zamorci ga jedu kao poslasticu.' },
      { ime: 'Vladimir P.', ocena: 5, datum: '2026-09-01', tekst: 'Najbolje seno koje smo kupili, nema prašine ni grančica.' }
    ]
  },
  {
    id: 27,
    slug: 'granule-za-zeceve-i-zamorce',
    naziv: 'Granule za zečeve i zamorce 2,5 kg',
    kategorija: 'glodari',
    potkategorija: 'hrana',
    cena: 1290,
    staraCena: 1490,
    emoji: '🥕',
    kratakOpis: 'Sa šargarepom i vitaminom C.',
    opis: [
      'Kompletne granule sa travom, šargarepom i peršunom, obogaćene vitaminom C koji zamorci ne mogu sami da proizvedu. Svaka granula je istog sastava, pa ljubimac ne može da bira samo ukusnije delove.',
      'Granule dopunjuju seno i svežu hranu. Preporučena dnevna količina je jedna kašika na kilogram telesne mase.'
    ],
    karakteristike: [
      'Obogaćeno vitaminom C',
      'Sa šargarepom i peršunom',
      'Bez dodatog šećera',
      'Ujednačen sastav granula'
    ],
    tezina: '2,5 kg',
    naStanju: 18,
    ocena: 4.6,
    brojRecenzija: 46,
    novo: false,
    dodato: '2026-04-12',
    recenzije: [
      { ime: 'Milena R.', ocena: 5, datum: '2026-10-05', tekst: 'Veterinar nam je preporučio baš ovakve granule, zamorci su zdravi i veseli.' },
      { ime: 'Strahinja D.', ocena: 4, datum: '2026-08-14', tekst: 'Zec ih jede bez problema, pakovanje traje dugo.' }
    ]
  },
  {
    id: 28,
    slug: 'drveni-tunel-za-igru',
    naziv: 'Drveni tunel za igru',
    kategorija: 'glodari',
    potkategorija: 'igracke',
    cena: 690,
    staraCena: null,
    emoji: '🪵',
    kratakOpis: 'Od vrbovog pruća, za skrivanje i glodanje.',
    opis: [
      'Savitljiv tunel od prirodnog vrbovog pruća koji može da se postavi kao most, luk ili skrovište. Glodari ga koriste za skrivanje, a glodanjem pruća prirodno troše zube.',
      'Pruće je netretirano i bezbedno za glodanje. Tunel odgovara hrčcima, zamorcima, degu i patuljastim zečevima.'
    ],
    karakteristike: [
      'Prirodno, netretirano pruće',
      'Savija se u više oblika',
      'Pomaže trošenje zuba',
      'Dužina 30 cm, prečnik 12 cm'
    ],
    velicina: '30 × 12 cm',
    naStanju: 21,
    ocena: 4.5,
    brojRecenzija: 23,
    novo: false,
    dodato: '2026-02-03',
    recenzije: [
      { ime: 'Hana M.', ocena: 5, datum: '2026-09-20', tekst: 'Zamorci spavaju u njemu, a usput ga i grickaju.' },
      { ime: 'Nenad V.', ocena: 4, datum: '2026-06-30', tekst: 'Dobar, prirodan i jeftin. Posle dva meseca ga treba zameniti.' }
    ]
  },
  {
    id: 29,
    slug: 'pesak-za-kupanje-cincila-1kg',
    naziv: 'Pesak za kupanje činčila 1 kg',
    kategorija: 'glodari',
    potkategorija: 'nega',
    cena: 590,
    staraCena: null,
    emoji: '🏜️',
    kratakOpis: 'Fini vulkanski pesak za čisto i meko krzno.',
    opis: [
      'Činčile i degui ne smeju da se kupaju u vodi — krzno čiste valjanjem u finom pesku. Ovaj vulkanski pesak upija masnoću i vlagu iz krzna i ostavlja ga mekim i čistim.',
      'Pesak je prosejan i bez oštrih čestica. Stavite ga u posudu dva do tri puta nedeljno na petnaestak minuta.'
    ],
    karakteristike: [
      'Fini vulkanski pesak',
      'Bez oštrih čestica',
      'Upija masnoću i vlagu',
      'Za činčile i degue'
    ],
    tezina: '1 kg',
    naStanju: 15,
    ocena: 4.4,
    brojRecenzija: 14,
    novo: false,
    dodato: '2025-12-28',
    recenzije: [
      { ime: 'Jana P.', ocena: 5, datum: '2026-08-28', tekst: 'Naša činčila se valja s uživanjem, krzno je kao svila.' },
      { ime: 'Dušan E.', ocena: 4, datum: '2026-05-15', tekst: 'Dobar pesak, malo praši pri sipanju.' }
    ]
  },
  {
    id: 30,
    slug: 'tihi-tocak-za-trcanje-20cm',
    naziv: 'Tihi točak za trčanje 20 cm',
    kategorija: 'glodari',
    potkategorija: 'oprema',
    cena: 1690,
    staraCena: null,
    emoji: '🎡',
    kratakOpis: 'Ne škripi ni noću, sa punom stazom.',
    opis: [
      'Točak sa kugličnim ležajem koji se okreće skoro bez zvuka, pa vas noćna trčanja hrčka neće buditi. Staza je puna i hrapava, bez prečki u koje bi se mogla zaglaviti nožica.',
      'Točak može da stoji samostalno na postolju ili da se pričvrsti za žice kaveza.'
    ],
    karakteristike: [
      'Prečnik 20 cm',
      'Kuglični ležaj, tih rad',
      'Puna, protivklizna staza',
      'Postolje ili kačenje na kavez'
    ],
    velicina: 'Ø 20 cm',
    naStanju: 11,
    ocena: 4.6,
    brojRecenzija: 32,
    novo: true,
    dodato: '2026-10-27',
    recenzije: [
      { ime: 'Teodor N.', ocena: 5, datum: '2026-11-05', tekst: 'Konačno spavamo! Stari točak je škripao celu noć.' },
      { ime: 'Ivona Z.', ocena: 4, datum: '2026-11-01', tekst: 'Zaista je tih. Za sirijskog hrčka bih uzela veći prečnik.' }
    ]
  }
];

/*
  Saveti (blog): id, slug, naslov, kategorija, datum, emoji,
  autor, vremeCitanja (min), uvod, sadrzaj (niz pasusa).
*/
const SAVETI = [
  {
    id: 1,
    slug: 'zimska-setnja-zastita-sapa',
    naslov: 'Zimska šetnja: kako da zaštitite šape od soli i hladnoće',
    kategorija: 'psi',
    datum: '2026-11-10',
    emoji: '❄️',
    autor: 'dr Selma Hodžić, veterinarka',
    vremeCitanja: 4,
    uvod: 'So na trotoarima i led mogu da isuše i ispucaju jastučiće na šapama. Nekoliko jednostavnih navika čini zimske šetnje bezbednim.',
    sadrzaj: [
      'So koja se zimi posipa po ulicama nagriza kožu jastučića na šapama, a pas je posle šetnje često poliže i proguta. Zato je najvažnija navika jednostavna: posle svake šetnje operite šape mlakom vodom i dobro ih osušite, posebno između prstiju.',
      'Pre izlaska možete naneti tanak sloj zaštitnog balzama ili vazelina na jastučiće. On stvara barijeru protiv soli i sprečava da se sneg lepi i pravi ledene grudvice između prstiju. Psima sa dužom dlakom redovno podšišajte dlaku između jastučića.',
      'Ako pas loše podnosi hladnoću, razmislite o čizmicama. Većini pasa treba nekoliko kratkih šetnji po kući da se naviknu, a nagrada poslasticom ubrzava stvar.',
      'Kratkodlaki i mali psi, kao i štenci i stariji psi, brže gube toplotu. Za njih je kaputić koristan, a šetnje je bolje podeliti na više kraćih. Ako primetite da pas podiže šape, drhti ili usporava, vreme je da se vratite kući.',
      'Na kraju, obratite pažnju na pukotine, crvenilo ili krvarenje na jastučićima. Takve povrede treba pokazati veterinaru, jer zimi sporije zarastaju.'
    ]
  },
  {
    id: 2,
    slug: 'kako-izabrati-hranu-za-psa',
    naslov: 'Kako izabrati pravu hranu za psa',
    kategorija: 'psi',
    datum: '2026-11-05',
    emoji: '🦴',
    autor: 'Tim Šapa',
    vremeCitanja: 5,
    uvod: 'Police su pune kesa sa obećanjima. Evo kako da pročitate deklaraciju i izaberete hranu koja odgovara baš vašem psu.',
    sadrzaj: [
      'Prvo pogledajte listu sastojaka. Sastojci su poređani po količini, pa je dobro da prvo mesto zauzima konkretan izvor proteina, poput piletine, jagnjetine ili ribe, a ne uopšteni „mesni nusproizvodi”.',
      'Zatim uzmite u obzir uzrast i veličinu psa. Štencima je potrebno više energije i kalcijuma, a starijim psima manje kalorija i više podrške za zglobove. Hrana za male rase ima sitnije granule, a za velike rase kontrolisan odnos kalcijuma i fosfora.',
      'Aktivnost je takođe važna. Pas koji svaki dan trči sa vama u parku troši mnogo više od psa koji veći deo dana provodi na kauču. Preporučene količine na pakovanju su okvirne, pa ih prilagodite prema telesnoj masi i kondiciji psa.',
      'Novu hranu uvodite postepeno, tokom sedam do deset dana: prvih dana mešajte četvrtinu nove hrane sa starom, pa postepeno povećavajte udeo. Tako ćete izbeći probleme sa varenjem.',
      'Ako pas ima alergije, osetljiv stomak ili hronične bolesti, posavetujte se sa veterinarom pre promene ishrane. Rado ćemo vam pomoći i u radnji — samo pitajte.'
    ]
  },
  {
    id: 3,
    slug: 'macka-i-grebalica',
    naslov: 'Mačka i grebalica: kako da spasete nameštaj',
    kategorija: 'macke',
    datum: '2026-10-28',
    emoji: '🐈',
    autor: 'Tim Šapa',
    vremeCitanja: 4,
    uvod: 'Grebanje nije nevaspitanje — to je potreba. Trik je da mački ponudite bolje mesto od vašeg kauča.',
    sadrzaj: [
      'Mačke grebu da bi održavale kandže, istegle telo i obeležile teritoriju mirisnim žlezdama na šapama. Zato zabrana nikada ne uspeva; uspeva samo preusmeravanje.',
      'Grebalica mora biti stabilna i dovoljno visoka da se mačka na njoj potpuno ispruži. Ako se ljulja, mačka će je izbegavati. Prirodni sisal je najomiljeniji materijal.',
      'Mesto je ključno. Postavite grebalicu tamo gde mačka već grebe ili pored mesta gde spava, jer mačke najčešće grebu odmah posle buđenja. Kauč koji je bio meta privremeno pokrijte ćebetom ili dvostranom lepljivom trakom.',
      'Kada mačka koristi grebalicu, pohvalite je i nagradite poslasticom. Malo mačje trave ili igra štapom sa perjem oko stuba dodatno će je zainteresovati.'
    ]
  },
  {
    id: 4,
    slug: 'prvi-akvarijum-vodic-za-pocetnike',
    naslov: 'Prvi akvarijum: vodič za početnike',
    kategorija: 'ribice',
    datum: '2026-10-15',
    emoji: '🐠',
    autor: 'Amar Kurtović, akvarista',
    vremeCitanja: 6,
    uvod: 'Najčešća greška početnika je žurba. Akvarijum je mali ekosistem kome treba vremena da „sazri”.',
    sadrzaj: [
      'Za prvi akvarijum izaberite zapreminu od najmanje 50 do 60 litara. Može zvučati kontraintuitivno, ali veća količina vode je stabilnija i oprašta više grešaka od male posude.',
      'Kada postavite akvarijum, pesak, biljke i filter, pustite ga da radi dve do četiri nedelje bez ribica. U tom periodu se u filteru razvijaju korisne bakterije koje razgrađuju otpad. Ovaj proces se zove uhodavanje i ne treba ga preskakati.',
      'Ribice unosite postepeno, nekoliko po nekoliko, sa razmakom od jedne do dve nedelje. Dobri izbori za početak su gupiji, plećke, neonke i koridorasi, uz proveru da li su vrste međusobno kompatibilne.',
      'Jednom nedeljno zamenite oko 20% vode, uz kondicioner koji neutrališe hlor. Filter ispirajte u vodi iz akvarijuma, a ne pod česmom, da ne biste uništili korisne bakterije.',
      'I ne preterujte sa hranom: ribice treba da pojedu sve za dva do tri minuta. Ostatak hrane truli i kvari vodu brže od bilo čega drugog.'
    ]
  },
  {
    id: 5,
    slug: 'sta-tigrice-vole-da-jedu',
    naslov: 'Šta tigrice vole da jedu (i šta nikako ne smeju)',
    kategorija: 'ptice',
    datum: '2026-09-30',
    emoji: '🦜',
    autor: 'dr Selma Hodžić, veterinarka',
    vremeCitanja: 3,
    uvod: 'Seme je osnova, ali nije dovoljno. Raznovrsna ishrana čini tigrice zdravijim i razigranijim.',
    sadrzaj: [
      'Kvalitetna mešavina semenki treba da čini oko 70% ishrane tigrice. Ostatak neka budu svež zeleniš i povrće: zelena salata, spanać, šargarepa, brokoli i paprika, oprani i isečeni na sitne komade.',
      'Voće poput jabuke, kruške i grožđa dajte povremeno i u malim količinama, bez semenki i koštica. Sipina kost u kavezu obezbeđuje kalcijum i pomaže brušenje kljuna.',
      'Nikada ne dajte tigricama avokado, čokoladu, kafu, luk, beli luk, so ni hranu sa ljudskog stola. Avokado je za ptice otrovan čak i u malim količinama.',
      'Vodu menjajte svakog dana, a posudice za hranu redovno perite. Ako tigrica odbija hranu duže od jednog dana ili je naduvenog perja, odmah se javite veterinaru.'
    ]
  },
  {
    id: 6,
    slug: 'hrcak-u-kuci-kavez-ishrana-rutina',
    naslov: 'Hrčak u kući: kavez, ishrana i rutina',
    kategorija: 'glodari',
    datum: '2026-09-12',
    emoji: '🐹',
    autor: 'Tim Šapa',
    vremeCitanja: 5,
    uvod: 'Hrčci su mali, ali imaju velike potrebe. Evo šta im je potrebno da bi bili zdravi i zadovoljni.',
    sadrzaj: [
      'Hrčci su noćne životinje, pa je normalno da danju spavaju, a uveče postanu aktivni. Kavez zato postavite van spavaće sobe i dalje od direktnog sunca i radijatora.',
      'Kavez treba da bude što prostraniji, sa debelim slojem stelje za kopanje, kućicom za spavanje i točkom pune staze odgovarajućeg prečnika. Za sirijske hrčke točak treba da ima najmanje 25 cm, za patuljaste oko 20 cm.',
      'Osnovu ishrane čini kvalitetna mešavina za hrčke, uz male komadiće svežeg povrća nekoliko puta nedeljno. Izbegavajte citruse, luk i slatkiše. Voda mora uvek biti dostupna.',
      'Kavez delimično čistite jednom nedeljno, a potpuno svake dve do tri nedelje. Ne uklanjajte odjednom sve zalihe hrane koje hrčak skuplja — to mu izaziva stres.',
      'Pripitomljavanje ide polako: prvih dana samo razgovarajte sa hrčkom, zatim mu nudite poslastice sa dlana. Za nekoliko nedelja sam će vam se penjati na ruku.'
    ]
  }
];
