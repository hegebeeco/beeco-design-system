/* Minták – csak adat. Minden számhoz forrás kell a src mezőben. */
const PRESETS = {
  drawdown: {
    type:"bar", title:"Az *életmódunk* többet számít, mint hinnéd",
    sub:"Kibocsátás-csökkentés 2020–2050 között, gigatonna CO₂e",
    ca:"Életmód", cb:"Technológia", unit:"Gt", center:"", fmt:"f45", sort:false,
    data:["Kevesebb ételpazarlás | 88,5 | #1 megoldás | a | 🗑️","Növényi alapú étrend | 78,33 | #2 | a | 🥦","Szárazföldi szélturbinák | 46,95 | #6 | b | ⚡","Elektromos autók | 7,66 | #23 | b | 🚗"].join("\n"),
    bubble:"A hűtőnél kezdődik a klímavédelem!",
    src:"Forrás: Project Drawdown, Table of Solutions, Scenario 1 (drawdown.org)"
  },
  esoerdo: {
    type:"treemap", title:"Miért vágjuk ki az *esőerdőt*?",
    sub:"Az erdőirtás mögötti termékek, 2005–2013 átlaga",
    ca:"", cb:"", unit:"%", center:"", fmt:"f45", sort:false,
    data:["Marhahús | 41 | a | 🥩","Szója és pálmaolaj | 18,4 | c | 🫘","Fa és papír | 13 | b | 🪵","Zöldség, gyümölcs, dió | 9 | d | 🥕","Gabonák (rizs nélkül) | 7 | e | 🌾","Rizs | 6 | f | 🍚","Egyéb | 4 | f | ","Cukor | 1 | f | "].join("\n"),
    bubble:"A tányérunkon dől el az esőerdő sorsa.",
    src:"Forrás: Pendrill et al. (2019), Environmental Research Letters 14(5), 055003. A 13% alatti értékek a ForkRanger-grafikáról becsültek."
  },
  etrend: {
    type:"donut", title:"Az étrendünk kibocsátásának *83%-a* hús és tej",
    sub:"Az átlagos uniós étrend üvegházhatású kibocsátásának megoszlása",
    ca:"", cb:"", unit:"%", center:"83% | hús és tejtermék", fmt:"f45", sort:false,
    data:["Hús | 56 | a | 🥩 | x","Tejtermék | 27 | c | 🧀 | x","Gabona és burgonya | 5 | d | 🍞","Olajok | 4 | e | 🫒","Italok | 4 | f | ☕","Zöldség, gyümölcs, dió | 4 | b | 🥕"].join("\n"),
    bubble:"Már heti pár húsmentes nap is sokat számít!",
    src:"Forrás: Sandström et al. (2018), Global Food Security 19, 48–55. A 4–5%-os szeletek a ForkRanger-grafikáról becsültek."
  },
  teszta: {
    type:"compare", title:"Kidobni vagy *pótolni* rosszabb?",
    sub:"100 g tészta kibocsátása, g CO₂e",
    ca:"", cb:"", unit:"", center:"", fmt:"f45", sort:false,
    data:["100 g tészta kidobva | 130 | g CO₂e | 🗑️ | előállítás + kidobás","100 g tészta pluszban főzve | 30 | g CO₂e | 🍝 | csak a főzés energiája"].join("\n"),
    bubble:"Főzz inkább kevesebbet – pótolni mindig lehet!",
    src:"Források: Poore & Nemecek (2018), Science 360(6392); Frankowska et al. (2020), Nature Food 1(12)."
  },
  tej: {
    type:"compare", title:"Egy foci-Eb vagy a *kidobott tej*?",
    sub:"Kibocsátás, tonna CO₂e",
    ca:"", cb:"", unit:"", center:"", fmt:"f45", sort:false,
    data:["EURO 2024 (szurkolói utazással) | 490000 | t CO₂e | ⚽ | előrejelzés, egyszeri esemény","Kidobott tej a brit háztartásokban | 1987000 | t CO₂e / év | 🥛 | minden egyes évben"].join("\n"),
    bubble:"A tej a hűtőben dől el, nem a stadionban.",
    src:"Források: Öko-Institut, Stahl (2022) – UEFA EURO 2024 karbonlábnyom; WRAP & WWF-UK (2011)."
  }
};
Object.assign(PRESETS, {
  farmer: {
    type:"bigstat", title:"Mennyi víz van egy *farmerben*?",
    sub:"Egy farmernadrág előállításának vízigénye",
    ca:"", cb:"", unit:"", center:"", fmt:"f45", sort:false, log:false,
    data:["kell egyetlen farmernadrág elkészítéséhez | 7500 | liter víz | 👖","egy ember ivóvize | 7 | év | 💧","kádnyi fürdővíz (150 l/kád) | 50 | kád | 🛁"].join("\n"),
    bubble:"A legzöldebb farmer az, amit már hordasz.",
    src:"Forrás: ENSZ (2019), UN Alliance for Sustainable Fashion. A kádas átváltás saját számítás (150 l/kád)."
  },
  pazarlas: {
    type:"icongrid", title:"Az élelmiszer *harmada* sosem kerül tányérra",
    sub:"A világon megtermelt élelmiszer sorsa (tömeg szerint)",
    ca:"", cb:"", unit:"%", center:"", fmt:"f45", sort:false, log:false,
    data:["elvész vagy kidobjuk | 33 | a | 🗑️","megesszük | 67 | f | 🍽️"].join("\n"),
    bubble:"Vásárolj listával, és főzz maradékból!",
    src:"Forrás: FAO (2011), Global food losses and food waste. Kerekített érték (kb. egyharmad)."
  },
  letra: {
    type:"dotscale", title:"Mennyi CO₂ van *egy kiló* ételben?",
    sub:"Üvegházhatású kibocsátás, kg CO₂e / kg termék",
    ca:"", cb:"", unit:"kg", center:"", fmt:"f45", sort:true, log:false,
    data:["Marhahús | 99,48 | a | 🥩","Bárány | 39,72 | a | 🐑","Sajt | 23,88 | a | 🧀","Sertéshús | 12,31 | a | 🐖","Baromfi | 9,87 | a | 🍗","Tojás | 4,67 | a | 🥚","Rizs | 4,45 | d | 🍚","Tofu | 3,16 | d | 🫘","Tej | 3,15 | a | 🥛","Borsó | 0,98 | d | 🫛","Burgonya | 0,46 | d | 🥔","Alma | 0,43 | d | 🍎"].join("\n"),
    bubble:"1 kg marha lábnyoma ≈ 216 kg krumplié!",
    src:"Forrás: Poore & Nemecek (2018), Science 360(6392); Our World in Data. Globális átlagok."
  }
});
