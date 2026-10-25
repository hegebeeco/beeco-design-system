/* A poszter figurái: a design system saját méhei és madarai (nem másolat – a build ágyazza be őket).
 * Az útvonal az index.html-hez képest relatív; a w/h a kép természetes mérete (az arányos méretezéshez kell,
 * mert a html2canvas nem ismeri az object-fit-et). Új figura: ide egy sor, a fájl maradjon a DS-ben.
 * A DS tiltott képei (tokens/hangnem.json → tiltott_kepek, pl. a mérges méh) nem kerülhetnek ide – a tests/check-infografika.js figyeli. */
const FIGURES = {
  bee: [
    {id:"bee-super", label:"Szuperhős", src:"../../web/assets/brand/bee-super.webp", w:360, h:254},
    {id:"bee-happy", label:"Vidám", src:"../../web/assets/brand/bee-happy.webp", w:320, h:322},
    {id:"bee-cheer", label:"Lelkes", src:"../../web/assets/brand/bee-cheer.webp", w:320, h:298},
    {id:"bee-sad", label:"Szomorú", src:"../../web/assets/brand/bee-sad.webp", w:320, h:322},
    {id:"bee-phone", label:"Telefonál", src:"../../web/assets/brand/bee-phone.webp", w:320, h:333},
    {id:"bee-action", label:"Tettre kész", src:"../../web/assets/brand/moods/action.webp", w:257, h:283},
    {id:"bee-help", label:"Segít", src:"../../web/assets/brand/moods/help.webp", w:296, h:300},
    {id:"bee-love", label:"Szerelmes", src:"../../web/assets/brand/moods/love.webp", w:205, h:216},
    {id:"bee-rank", label:"Győztes", src:"../../web/assets/brand/moods/rank.webp", w:215, h:214},
    {id:"bee-rest", label:"Pihen", src:"../../web/assets/brand/moods/rest.webp", w:235, h:213},
    {id:"bee-think", label:"Gondolkodik", src:"../../web/assets/brand/moods/think.webp", w:175, h:149}
  ],
  bird: [
    {id:"bird-robin", label:"Vörösbegy", src:"../../weboldal/kampany-csicsergosz/illusztracio/statikus/poz_alap.svg", w:240, h:220},
    {id:"bird-robin-sing", label:"Vörösbegy – csicsereg", src:"../../weboldal/kampany-csicsergosz/illusztracio/statikus/poz_csicsereg.svg", w:240, h:220},
    {id:"bird-robin-drink", label:"Vörösbegy – iszik", src:"../../weboldal/kampany-csicsergosz/illusztracio/statikus/poz_iszik.svg", w:240, h:220},
    {id:"bird-robin-fly", label:"Vörösbegy – repdes", src:"../../weboldal/kampany-csicsergosz/illusztracio/statikus/poz_repdes.svg", w:240, h:220},
    {id:"bird-robin-sad", label:"Vörösbegy – szomorú", src:"../../weboldal/kampany-csicsergosz/illusztracio/statikus/poz_szomoru.svg", w:240, h:220},
    {id:"bird-sparrow", label:"Veréb", src:"../../brandbook/illusztraciok/madarkak/vereb.svg", w:193, h:179},
    {id:"bird-blackbird", label:"Rigó", src:"../../brandbook/illusztraciok/madarkak/rigo.svg", w:249, h:223},
    {id:"bird-crow", label:"Varjú", src:"../../brandbook/illusztraciok/madarkak/varju.svg", w:285, h:265},
    {id:"bird-goose", label:"Liba", src:"../../brandbook/illusztraciok/madarkak/liba.svg", w:223, h:329}
  ]
};
const DEFAULT_FIGURE = "bee-super";
const FIGURE_LABELS = {bee:{pick:"Méh hangulata", bubble:"A méh buboréka"}, bird:{pick:"Melyik madár?", bubble:"A madár buboréka"}};
// A figura doboza formátumonként (szélesség × magasság, px); a kép arányosan belesimul, alulra igazítva.
// Magasság = a lábléc magassága − a figura alsó eltolása (.bee bottom) − a diagram árnyéka (16 px),
// így a figura nem ér fel a diagramig (a tests/visual.spec.mjs figura-tesztjei mérik).
const FIGURE_BOX = {f45:[300, 220], f11:[240, 170], f916:[340, 254]};
const findFigure = id => FIGURES.bee.find(f => f.id === id) || FIGURES.bird.find(f => f.id === id) || FIGURES.bee[0];
const figureKind = id => FIGURES.bird.some(f => f.id === id) ? "bird" : "bee";
