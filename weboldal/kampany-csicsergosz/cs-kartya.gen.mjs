// 9-szeletes Matrica-keret: papír + körvonal + halvány él + kakaó árnyék egy SVG-ben, szűrő nélkül.
const O=10, S=28, W=80; // outset, slice, image size; a kártya doboza: O..W-O
const PAPIR='#FFFCF3', EL='rgba(107,59,22,.32)', KAKAO='#6B3B16';
const poly=(e,v,dx=0,dy=0)=>{const a=O-e+dx,b=W-O+e+dx,c=O-e+dy,d=W-O+e+dy,k=v+e*0.4142;
  return `${a+k},${c} ${b},${c} ${b},${d-k} ${b-k},${d} ${a},${d} ${a},${c+k}`};
export function svg({vag=16,kor=2,korszin='#fff',arnyek=0}){
  const s=[];
  if(arnyek) s.push(`<polygon points='${poly(kor+1,vag,arnyek,arnyek)}' fill='${KAKAO}'/>`);
  s.push(`<polygon points='${poly(kor+1,vag)}' fill='${EL}'/>`);
  s.push(`<polygon points='${poly(kor,vag)}' fill='${korszin}'/>`);
  s.push(`<polygon points='${poly(0,vag)}' fill='${PAPIR}'/>`);
  const x=`<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${W}' viewBox='0 0 ${W} ${W}'>${s.join('')}</svg>`;
  return `url("data:image/svg+xml,${x.replace(/#/g,'%23').replace(/</g,'%3C').replace(/>/g,'%3E')}")`;
}
const v={
  egyenlo:svg({}), link:svg({arnyek:5}), linkHover:svg({arnyek:7}), linkActive:svg({arnyek:1}),
  aktiv:svg({kor:3,korszin:'#FECF39'})
};
const css=`/* Matrica kártya – 9-szeletes keret (2026-10-14): a 10 láncolt drop-shadow szűrő helyett, ugyanaz a látvány,
   görgetéskor nem kell újrafesteni. A Webflow-osztály (card+cs_link / card+cs_egyenlo) szűrőjét és ::before-ját itt kapcsoljuk ki. */
.card.cs_link,.card.cs_egyenlo{position:relative;background:transparent!important;border-width:0!important;border-style:solid!important;border-color:transparent!important;border-radius:0!important;box-shadow:none!important;filter:none!important;
  border-image-source:${v.egyenlo}!important;border-image-slice:${S} fill!important;border-image-width:${S}px!important;border-image-outset:${O}px!important;border-image-repeat:stretch!important}
.card.cs_link::before,.card.cs_egyenlo::before{content:none!important;display:none!important}
.card.cs_link{border-image-source:${v.link}!important;rotate:-1deg;transition:translate 140ms cubic-bezier(.23,1,.32,1),rotate 140ms cubic-bezier(.23,1,.32,1)!important}
@media (hover:hover) and (pointer:fine){.card.cs_link:hover{border-image-source:${v.linkHover}!important;translate:-2px -3px;rotate:0deg;transform:none!important}}
.card.cs_link:active{border-image-source:${v.linkActive}!important;translate:3px 3px;rotate:0deg;transform:none!important}
.card.cs_egyenlo{rotate:0deg}
.cs_harmas>.card.cs-aktiv{border-image-source:${v.aktiv}!important}
.card .cs_illu_panel{border-radius:0!important;clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)}
.cs_harmas h3.cs-csempe-cimke,.cs_harmas>.card.cs-aktiv h3.cs-csempe-cimke{background-color:var(--cs-c-kakao)!important;padding-right:1.15em!important;clip-path:polygon(0 0,100% 0,calc(100% - 9px) 50%,100% 100%,0 100%)!important}
.dia_green_ov.cs .card.cs_link .cs_illu_panel:not(.cs-ciklus){align-items:center}
.card.cs_link .cs_illu_panel img.cs_kartya_album{display:block;width:auto!important;height:82%!important;max-width:90%;aspect-ratio:auto!important;object-fit:contain!important;margin:0;border:0;box-shadow:none}
/* Nyíl-gomb a kép jobb alsó sarkában: a Designerben is a képpanelben ül, így betöltéstől szögletes és a helyén van. */
.cs_illu_panel .cs_utvonal_nyil{position:absolute!important;right:14px;bottom:14px;z-index:3;display:grid!important;place-items:center;width:52px!important;height:52px!important;margin:0!important;padding:0 0 2px!important;background:#FECF39!important;color:var(--cs-c-kakao)!important;border:2px solid var(--cs-c-kakao)!important;border-radius:4px!important;box-shadow:3px 3px 0 var(--cs-c-kakao);font-size:26px!important;line-height:1!important;transition:transform 160ms cubic-bezier(.23,1,.32,1),box-shadow 160ms cubic-bezier(.23,1,.32,1)}
@media (hover:hover) and (pointer:fine){.card.cs_link:hover .cs_illu_panel .cs_utvonal_nyil{transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--cs-c-kakao)}}
.card.cs_link:focus-visible .cs_illu_panel .cs_utvonal_nyil{transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--cs-c-kakao)}
.card.cs_link:active .cs_illu_panel .cs_utvonal_nyil{transform:translate(2px,2px);box-shadow:none}
.cs_folyamat_ui{filter:none!important;box-shadow:0 6px 10px rgba(107,59,22,.14)!important}
.cs-taj_hatter--zaro{filter:none!important}
.cs-taj_hatter--zaro::after{content:"";position:absolute;inset:0;background:rgba(0,0,0,.1);pointer-events:none}
@media (prefers-reduced-motion:reduce){.card.cs_link,.cs_illu_panel .cs_utvonal_nyil{transition:none!important}}
`;
import fs from 'fs'; fs.writeFileSync('cs-kartya.css',css); console.log(css.length);
