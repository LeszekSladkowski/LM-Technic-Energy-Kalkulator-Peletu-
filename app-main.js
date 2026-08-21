
const imgs = {
  home: './assets/home-master.jpg',
  suppliers: './assets/embedded-02-269b27416276.jpg',
  offer: './assets/embedded-03-d76877ed0cd3.png',
  transport: './assets/embedded-04-4351a0e91554.jpg'
};
const screens={home:'portrait',suppliers:'landscape',offer:'portrait',transport:'portrait',businessplan:'portrait'};
const V23_BIZ_PLAN_IMAGES=["./assets/embedded-05-e9cb463492af.jpg", "./assets/embedded-06-b1077ce2a5e0.jpg", "./assets/embedded-07-2f86967b14db.jpg", "./assets/embedded-08-4cf325aaa2a1.jpg", "./assets/embedded-09-d3b067217c58.jpg", "./assets/embedded-10-8d5163e0f631.jpg", "./assets/embedded-11-4734948ebd51.jpg", "./assets/embedded-12-299c98517af1.jpg", "./assets/embedded-13-61e4db83bbda.jpg", "./assets/embedded-14-6272fe114df3.jpg", "./assets/embedded-15-4d433f7d56e1.jpg", "./assets/embedded-16-94c1b51168b4.jpg", "./assets/embedded-17-e21d1025bd1b.jpg", "./assets/embedded-18-115e7fac6434.jpg", "./assets/embedded-19-c94b32b378aa.jpg", "./assets/embedded-20-9b5b94f55cc6.jpg", "./assets/embedded-21-cdf5bab707d5.jpg", "./assets/embedded-22-df8ba4137bea.jpg", "./assets/embedded-23-3666170b4c35.jpg", "./assets/embedded-24-e8efaf902e28.jpg", "./assets/embedded-25-328789bc0c19.jpg", "./assets/embedded-26-a81fc56b720f.jpg", "./assets/embedded-27-b81a07fe65f8.jpg", "./assets/embedded-28-9d8ba3751443.jpg", "./assets/embedded-29-a263125d9108.jpg"];
const V24_BIZPLAN_PDF_URL='./LM_Technic_Energy_Biznesplan_i_materialy_MASTER_25_kart.pdf';
const V24_BIZPLAN_PDF_NAME='L&M_Technic_Energy_Biznesplan_i_materialy_MASTER_25_kart.pdf';

const state={qty:26};
try{ const q=Number(localStorage.getItem('lm_qty')); if(q) state.qty=q; }catch(e){}
function saveQty(){ try{localStorage.setItem('lm_qty',String(state.qty));}catch(e){} }

/* V31.3 — automatyczne dopasowanie stałych ekranów MASTER do szerokości telefonu.
   Używa natywnego zoom Chromium, więc zachowuje proporcje, hotspoty i pionowe przewijanie. */
function lmAutoFit(root,designWidth=941){
  if(!root)return;
  const apply=()=>{
    const vv=window.visualViewport;
    const vw=Math.max(1,Math.round(vv?.width||document.documentElement.clientWidth||window.innerWidth||designWidth));
    const scale=Math.min(1,vw/designWidth);
    root.style.width=designWidth+'px';root.style.minWidth=designWidth+'px';root.style.maxWidth='none';
    root.style.zoom=String(scale);
    root.dataset.lmFitScale=String(scale);
    document.documentElement.style.overflowX='hidden';document.body.style.overflowX='hidden';
  };
  apply();
  if(!window.__lmFitListener){
    window.__lmFitListener=()=>document.querySelectorAll('[data-lm-fit-scale]').forEach(el=>{
      const dw=Number(el.dataset.lmDesignWidth||941);const vv=window.visualViewport;const vw=Math.max(1,Math.round(vv?.width||document.documentElement.clientWidth||window.innerWidth||dw));el.style.zoom=String(Math.min(1,vw/dw));
    });
    window.addEventListener('resize',window.__lmFitListener,{passive:true});
    window.visualViewport?.addEventListener('resize',window.__lmFitListener,{passive:true});
  }
  root.dataset.lmDesignWidth=String(designWidth);
}
function fmt(n,d=2){return Number(n).toLocaleString('pl-PL',{minimumFractionDigits:d,maximumFractionDigits:d});}
function money(n){return fmt(n,2)+' zł';}
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('show');clearTimeout(window._tt);window._tt=setTimeout(()=>e.classList.remove('show'),2200)}
function hot(parent,x,y,w,h,fn,label=''){const b=document.createElement('button');b.className='hot';b.style.left=(x*100)+'%';b.style.top=(y*100)+'%';b.style.width=(w*100)+'%';b.style.height=(h*100)+'%';b.setAttribute('aria-label',label);b.onclick=fn;parent.appendChild(b);return b;}
function go(name){
  const app=document.getElementById('app'); app.innerHTML='';
  const d=document.createElement('div'); d.className='screen '+screens[name];
  const im=document.createElement('img'); im.src=imgs[name]; im.alt='Europejski Kalkulator Peletu 1.2 PREMIUM — '+name; d.appendChild(im);
  app.appendChild(d); bind(name,d); window.scrollTo({top:0,left:0,behavior:'auto'});
}
function nav4(d){
  const cols=[.012,.257,.502,.747], rows=[.13,.245,.36], cw=.235, rh=.115;
  const acts=[['home'],['offer'],['calculator'],['transport'],['noop','Rynki EU'],['currencies','Waluty'],['suppliers'],['clients','Klienci'],['map','Mapa dostaw'],['noop','Raporty'],['history','Historia'],['settings','Ustawienia']];
  let i=0; for(let r=0;r<3;r++)for(let c=0;c<4;c++){const a=acts[i++]; hot(d,cols[c],rows[r],cw,rh,()=>a[0]==='noop'?toast('Moduł „'+a[1]+'” będzie aktywowany bez zmiany grafiki MASTER.'):go(a[0]),a[1]||a[0]);}
}
function calc(){
  const tons=state.qty, trucks=tons/26;
  const purchasePerT=1250, distance=535, rate=4.25, sellPerT=1580;
  const transportPerTruck=distance*2*rate; // pełny kurs tam + powrót
  const transportTotal=transportPerTruck*trucks;
  const transportPerT=transportTotal/tons;
  const otherPerT=1529.57-purchasePerT-(535*2*rate/26);
  const fullPerT=purchasePerT+transportPerT+otherPerT;
  const marginPerT=sellPerT-fullPerT;
  const marginPct=marginPerT/sellPerT*100;
  return {tons,trucks,purchasePerT,distance,rate,sellPerT,transportPerTruck,transportTotal,transportPerT,otherPerT,fullPerT,marginPerT,marginPct,totalCost:fullPerT*tons,totalRevenue:sellPerT*tons,totalMargin:marginPerT*tons};
}
function makeQty(d){
  const disp=document.createElement('button');disp.className='qty-display';disp.id='qtyDisplay';disp.onclick=()=>toggleQty();d.appendChild(disp);
  const menu=document.createElement('div');menu.className='qty-menu';menu.id='qtyMenu';
  for(let i=1;i<=10;i++){
    const tons=26*i;const row=document.createElement('button');row.className='qty-row';row.dataset.qty=tons;row.innerHTML='<span>'+tons+' t ('+i+' samoch'+(i===1?'ód':i<5?'ody':'odów')+')</span><span class="check">✓</span>';
    row.onclick=(ev)=>{ev.stopPropagation();state.qty=tons;saveQty();updateQtyUI();menu.classList.remove('open');renderSummary();toast('Wybrano '+tons+' t — '+i+' samoch'+(i===1?'ód':i<5?'ody':'odów')+'.');};menu.appendChild(row);
  }
  d.appendChild(menu); updateQtyUI();
}
function qtyText(q){const i=q/26;return q+' t ('+i+' samoch'+(i===1?'ód':i<5?'ody':'odów')+')';}
function updateQtyUI(){const e=document.getElementById('qtyDisplay');if(e)e.innerHTML='<span>'+qtyText(state.qty)+'</span><span class="arrow">⌄</span>';document.querySelectorAll('.qty-row').forEach(r=>r.classList.toggle('selected',Number(r.dataset.qty)===state.qty));}
function toggleQty(){document.getElementById('qtyMenu')?.classList.toggle('open');}
function renderSummary(){
  const holder=document.getElementById('summary'); if(!holder)return; const c=calc();
  holder.innerHTML=`<div class="sum-title">PODSUMOWANIE OFERTY</div>
    <div class="sum-grid">
      <div>Koszt całkowity / t</div><b>${fmt(c.fullPerT)} zł/t</b>
      <div>Cena sprzedaży</div><b>${fmt(c.sellPerT)} zł/t</b>
      <div>Marża netto / t</div><b class="green">${fmt(c.marginPerT)} zł/t</b>
      <div>Marża %</div><b class="green">${fmt(c.marginPct)}%</b>
      <div>Ilość</div><b>${fmt(c.tons,0)} t (${fmt(c.trucks,0)} samoch.)</b>
      <div>Transport łącznie</div><b>${fmt(c.transportTotal)} zł</b>
      <div>Koszt całej partii</div><b>${fmt(c.totalCost)} zł</b>
      <div>Marża całej partii</div><b class="green">${fmt(c.totalMargin)} zł</b>
    </div><div class="decision">✓ OPŁACA SIĘ — WYNIK POWYŻEJ MINIMUM</div>
    <button class="go-transport" onclick="go('transport')">PRZEJDŹ DO KALKULATORA TRANSPORTU</button>`;
}
function addTransportOverlay(d){
  const c=calc();
  const box=document.createElement('div');box.className='transport-fix';box.innerHTML=`<div class="tlabel">PEŁNY KURS TAM + POWRÓT</div><div class="tval">${fmt(c.transportPerTruck)} zł / samochód</div><div class="tsub">${fmt(c.transportPerT)} zł/t • ${fmt(c.trucks,0)} samoch. • ${fmt(c.tons,0)} t</div>`;d.appendChild(box);
}

const DEFAULT_MASTER_SUPPLIERS=[
  {id:'master_1',name:'Tartak Olczyk sp. z o.o.',type:'Producent pelletu',priority:'1',source:'Baza MASTER',status:'DO KONTAKTU',cert:'ENplus A1',certId:'PL 004',certStatus:'ZWERYFIKOWANY — AKTYWNY',city:'Krasocin',postal:'29-105',address:'ul. Spółdzielcza 16',country:'Polska',phone:'+48 41 39 17 019',mobile:'+48 660 591 985',email:'biuro@tartakolczyk.pl',www:'www.tartakolczyk.pl',price:'1210',currency:'PLN',minQty:'26 t — 1 samochód',last:'2026-08-15T17:45',next:'2026-08-18T10:00',goal:'Pozyskanie oferty zakupu i warunków współpracy',notes:'Poproś o cenę dla: 26 t / 52 t / stały odbiór miesięczny. Zapytaj o: ENplus ID, parametry pelletu, dostępność, transport, płatność.',history:[{at:'2026-08-15T17:45',type:'KONTAKT',text:'Ostatni kontakt zapisany w bazie MASTER'}]},
  {id:'master_2',name:'Gekon Pellet Sp. z o.o.',type:'Handlowiec pelletu',priority:'2',source:'Baza MASTER',status:'DO KONTAKTU',cert:'ENplus A1',certId:'PL 304',city:'Kielce',postal:'25-004',address:'ul. Paderewskiego 14/5',country:'Polska',price:'1240',currency:'PLN',minQty:'26 t — 1 samochód',last:'2026-08-16T09:20',next:'2026-08-18T11:00',history:[]},
  {id:'master_3',name:'EcoWarm Kielce',type:'Sprzedaż hurtowa pelletu',priority:'3',source:'Baza MASTER',status:'DO KONTAKTU',cert:'ENplus A1',certId:'PL 022',city:'Kielce',postal:'25-817',address:'ul. Łopuszańska 225',country:'Polska',price:'1235',currency:'PLN',minQty:'26 t — 1 samochód',last:'2026-08-16T09:35',next:'2026-08-18T12:00',history:[]},
  {id:'master_4',name:'Pino Pellet',type:'Sprzedaż pelletu',priority:'4',source:'Baza MASTER',status:'DO SPRAWDZENIA',cert:'ENplus A1',certId:'',city:'Kielce',postal:'25-817',address:'ul. Łopuszańska 225',country:'Polska',price:'',currency:'PLN',minQty:'26 t — 1 samochód',last:'',next:'2026-08-19T09:00',history:[]},
  {id:'master_5',name:'PELLETPOL',type:'Sprzedaż detaliczna i hurtowa',priority:'5',source:'Baza MASTER',status:'W TRAKCIE ROZMÓW',cert:'ENplus A1',certId:'PL 015',city:'Kielce',postal:'25-797',address:'ul. Krakowska 293',country:'Polska',price:'1255',currency:'PLN',minQty:'26 t — 1 samochód',last:'2026-08-16T10:10',next:'2026-08-19T10:00',history:[]},
  {id:'master_6',name:'Sek-Pol sp.j.',type:'Dystrybucja pelletu',priority:'6',source:'Baza MASTER',status:'DO KONTAKTU',cert:'ENplus A1',certId:'',city:'Kielce',postal:'25-852',address:'ul. Za Walcownią 2d',country:'Polska',price:'',currency:'PLN',minQty:'26 t — 1 samochód',last:'2026-08-16T10:30',next:'2026-08-19T11:00',history:[]},
  {id:'master_7',name:'Ekoal Kielce',type:'Technika grzewcza i instalacyjna',priority:'7',source:'Baza MASTER',status:'DO SPRAWDZENIA',cert:'ENplus A1',certId:'',city:'Kielce',postal:'25-563',address:'ul. Zagnańska 232A',country:'Polska',price:'',currency:'PLN',minQty:'26 t — 1 samochód',last:'',next:'2026-08-20T09:00',history:[]},
  {id:'master_8',name:'Wilga Sp. z o.o. oddział Kielce',type:'Technika grzewcza i sanitarna',priority:'8',source:'Baza MASTER',status:'DO SPRAWDZENIA',cert:'ENplus A1',certId:'',city:'Kielce',postal:'25-563',address:'ul. Zagnańska 136A',country:'Polska',price:'',currency:'PLN',minQty:'26 t — 1 samochód',last:'',next:'2026-08-20T10:00',history:[]}
];
function initSupplierBase(){
  try{
    const current=JSON.parse(localStorage.getItem('lm_suppliers_master_v8')||'null');
    if(Array.isArray(current)&&current.length)return current;
    let merged=DEFAULT_MASTER_SUPPLIERS.map(x=>({...x}));
    const old=JSON.parse(localStorage.getItem('lm_custom_suppliers')||'[]');
    if(Array.isArray(old)) old.forEach(x=>{if(!merged.some(y=>String(y.name||'').trim().toLowerCase()===String(x.name||'').trim().toLowerCase()))merged.push(x)});
    localStorage.setItem('lm_suppliers_master_v8',JSON.stringify(merged));
    return merged;
  }catch(e){return DEFAULT_MASTER_SUPPLIERS.map(x=>({...x}))}
}
function getCustomSuppliers(){try{const a=JSON.parse(localStorage.getItem('lm_suppliers_master_v8')||'null');return Array.isArray(a)&&a.length?a:initSupplierBase()}catch(e){return initSupplierBase()}}
function saveCustomSuppliers(a){try{localStorage.setItem('lm_suppliers_master_v8',JSON.stringify(a))}catch(e){}}
function updateSupplierCount(){}
initSupplierBase();

let selectedSupplierId = (()=>{try{return localStorage.getItem('lm_selected_supplier')||null}catch(e){return null}})();
let supplierFilter='ALL';
let supplierPriorityFilter='ALL';
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function supplierStatusClass(s){s=String(s||'');return s.includes('ROZM')?'talk':s.includes('ZATW')?'ok':s.includes('SPRAWD')?'check':s.includes('ARCH')?'archive':'contact'}
function getSelectedSupplier(){const a=getCustomSuppliers();return a.find(x=>String(x.id)===String(selectedSupplierId))||null}
function selectSupplier(id){selectedSupplierId=id;try{localStorage.setItem('lm_selected_supplier',String(id))}catch(e){}renderSupplierWorkspace();setTimeout(()=>autoEnrichSelectedSupplier(false),120)}
function filteredSuppliers(){let a=getCustomSuppliers();const q=(document.getElementById('supplierSearchLive')?.value||'').trim().toLowerCase();if(supplierFilter!=='ALL')a=a.filter(x=>String(x.status||'').toUpperCase()===supplierFilter);if(supplierPriorityFilter!=='ALL')a=a.filter(x=>String(x.priority||'')===String(supplierPriorityFilter));if(q)a=a.filter(x=>[x.name,x.city,x.cert,x.certId,x.email,x.phone,x.mobile,x.contact].some(v=>String(v||'').toLowerCase().includes(q)));return a}
function compactDate(v){if(!v)return'—';try{const d=new Date(v);if(isNaN(d))return esc(v);const dd=String(d.getDate()).padStart(2,'0'),mm=String(d.getMonth()+1).padStart(2,'0'),yyyy=d.getFullYear(),hh=String(d.getHours()).padStart(2,'0'),mi=String(d.getMinutes()).padStart(2,'0');return `${dd}.${mm}.${yyyy}<span class="muted">${hh}:${mi}</span>`}catch(e){return esc(v)}}
function priorityNo(x){const m=String(x.priority||'').match(/[0-9]+/);const n=parseInt(m?m[0]:'8',10);return Math.max(1,Math.min(8,n||8))}
const COMPANY_EMAIL='lmtechnic@wp.pl';
/* Zweryfikowany pakiet kontaktów do istniejących dostawców MASTER.
   Dane pochodzą z publicznych stron firm i są używane przez UZUPEŁNIJ ONLINE
   jako pierwszy, pewny etap; dla nowych firm pozostaje wyszukiwanie Nominatim. */
const VERIFIED_SUPPLIER_DATA={
  'master_1':{address:'Świdno 1',postal:'29-105',city:'Krasocin',country:'Polska',phone:'+48 41 39 17 339',mobile:'+48 41 39 17 331',email:'biuro@tartakolczyk.com.pl',www:'www.tartakolczyk.pl',onlineSource:'Oficjalna strona Tartak Olczyk'},
  'master_2':{address:'ul. Paderewskiego 14/5',postal:'25-004',city:'Kielce',country:'Polska',phone:'+48 600 391 661',email:'info@gekonpellet.com',www:'www.gekonpellet.pl',nip:'6572919730',regon:'362649906',onlineSource:'Oficjalna strona Gekon Pellet'},
  'master_3':{address:'ul. Łopuszniańska 225',postal:'25-817',city:'Kielce',country:'Polska',phone:'+48 795 408 920',email:'biuro@ecowarm.pl',www:'www.ecowarm.pl',onlineSource:'Oficjalna strona EcoWarm'},
  'master_4':{address:'ul. Łopuszniańska 225',postal:'25-817',city:'Kielce',country:'Polska',phone:'+48 795 408 920',email:'biuro@pinopellet.pl',www:'www.pinopellet.pl',cert:'DP A1',certId:'DP-12',onlineSource:'Oficjalna strona Pino Pellet / EcoWarm'},
  'master_5':{address:'ul. Krakowska 293',postal:'25-797',city:'Kielce',country:'Polska',phone:'+48 664 701 601',email:'biuro@pelletpol.pl',www:'www.pelletpol.pl',onlineSource:'Oficjalna strona PelletPol'},
  'master_6':{address:'ul. Za Walcownią 2D',postal:'25-817',city:'Kielce',country:'Polska',phone:'+48 605 989 279',email:'biuro@kominkowybrykiet.pl',www:'www.kominkowybrykiet.pl',onlineSource:'Oficjalna strona Sek-Pol'},
  'master_7':{address:'ul. Zagórska 264',postal:'25-362',city:'Kielce',country:'Polska',phone:'+48 504 763 902',email:'biuro@ekoal.pl',www:'www.ekoal.pl',onlineSource:'Oficjalna strona Ekoal'},
  'master_8':{address:'ul. Rolna 6',postal:'25-419',city:'Kielce',country:'Polska',phone:'+48 603 979 251',mobile:'+48 603 979 046',email:'kielce@wilga.pl',www:'www.wilga.ik.pl',nip:'5770002546',regon:'008408634',onlineSource:'Oficjalna strona WILGA'}
};
function mergeVerifiedSupplierData(x){
  const v=VERIFIED_SUPPLIER_DATA[String(x.id)];
  if(!v)return false;
  Object.assign(x,v);
  x.onlineUpdated=new Date().toISOString();
  x.onlineVerified=true;
  return true;
}
const onlineEnriching=new Set();
function normalizeWebUrl(v){v=String(v||'').trim();if(!v)return'';return /^https?:\/\//i.test(v)?v:'https://'+v.replace(/^\/+/, '')}
function supplierFullAddress(x){return [x.address,x.postal,x.city,x.country].filter(Boolean).join(', ')}
function supplierSearchText(x){return [x.name,supplierFullAddress(x)].filter(Boolean).join(', ')}
function pickExtra(e,keys){for(const k of keys){if(e&&e[k])return String(e[k]).trim()}return''}
function cityFromAddress(a){return a?.city||a?.town||a?.village||a?.municipality||a?.county||''}
function roadFromAddress(a){const road=a?.road||a?.pedestrian||a?.commercial||a?.industrial||'';const nr=a?.house_number||'';return [road,nr].filter(Boolean).join(' ')}
async function nominatimSearchOne(q){
  const url='https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&extratags=1&namedetails=1&limit=5&accept-language=pl&q='+encodeURIComponent(q);
  const r=await fetch(url,{headers:{'Accept':'application/json'}});
  if(!r.ok)throw new Error('HTTP '+r.status);
  const rows=await r.json();
  return Array.isArray(rows)?rows:[];
}
function normMatch(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
function scoreGeoCandidate(g,x){
  const disp=normMatch(g?.display_name),name=normMatch(x.name),city=normMatch(x.city),postal=normMatch(x.postal),address=normMatch(x.address);
  let s=0;if(name&&disp.includes(name))s+=8;if(city&&disp.includes(city))s+=4;if(postal&&disp.includes(postal))s+=5;
  const street=(address||'').replace(/^ul\s+/,'').split(' ').slice(0,2).join(' ');if(street&&disp.includes(street))s+=3;
  return s;
}
async function enrichSupplierOnline(id,force=false){
  const a=getCustomSuppliers();const i=a.findIndex(x=>String(x.id)===String(id));if(i<0)return false;const x=a[i];
  if(onlineEnriching.has(String(id)))return false;
  const last=x.onlineUpdated?Date.parse(x.onlineUpdated):0;if(!force&&last&&Date.now()-last<7*24*3600*1000)return true;
  onlineEnriching.add(String(id));
  try{
    /* 1. Istniejący MASTER: najpierw zweryfikowane dane z oficjalnych stron. */
    const verified=mergeVerifiedSupplierData(x);
    /* 2. Internet: próbujemy kilku zapytań zamiast jednego zbyt restrykcyjnego. */
    if(navigator.onLine){
      const queries=[
        [x.name,x.address,x.postal,x.city,x.country].filter(Boolean).join(', '),
        [x.name,x.city,x.country].filter(Boolean).join(', '),
        [x.address,x.postal,x.city,x.country].filter(Boolean).join(', '),
        [x.name,x.country].filter(Boolean).join(', ')
      ].filter((q,idx,arr)=>q&&arr.indexOf(q)===idx);
      let best=null,bestScore=-1;
      for(const q of queries){
        try{const rows=await nominatimSearchOne(q);for(const g of rows){const s=scoreGeoCandidate(g,x);if(s>bestScore){best=g;bestScore=s}}if(bestScore>=8)break}catch(e){}
      }
      if(best){
        const g=best,ad=g.address||{},ex=g.extratags||{};
        x.lat=g.lat||x.lat;x.lon=g.lon||x.lon;x.osmDisplayName=g.display_name||x.osmDisplayName;x.osmType=g.osm_type||x.osmType;x.osmId=g.osm_id||x.osmId;
        if(!verified){x.onlineSource='OpenStreetMap / Nominatim';x.onlineUpdated=new Date().toISOString();}
        if(!x.city)x.city=cityFromAddress(ad);if(!x.postal)x.postal=ad.postcode||'';if(!x.country)x.country=ad.country||'';if(!x.address)x.address=roadFromAddress(ad);
        if(!x.www)x.www=pickExtra(ex,['website','contact:website','url']);if(!x.phone)x.phone=pickExtra(ex,['phone','contact:phone']);if(!x.mobile)x.mobile=pickExtra(ex,['mobile','contact:mobile']);if(!x.email)x.email=pickExtra(ex,['email','contact:email']);
        x.openingHours=x.openingHours||pickExtra(ex,['opening_hours']);x.wikipedia=x.wikipedia||pickExtra(ex,['wikipedia']);
      }else if(!verified){x.onlineUpdated=new Date().toISOString();x.onlineSource='Online — brak pewnego dopasowania lokalizacji';}
    }else if(!verified){toast('Brak internetu — pozostawiono dane lokalne.');}
    /* Dodatkowa bezpieczna heurystyka: domena WWW z firmowego e-maila. */
    if(!x.www&&x.email){const dm=String(x.email).split('@')[1]||'';if(dm&&!/(gmail|wp|o2|onet|interia|outlook|hotmail|yahoo)\./i.test(dm))x.www='www.'+dm;}
    a[i]=x;saveCustomSuppliers(a);if(String(selectedSupplierId)===String(id))renderSupplierWorkspace();return verified||!!x.lat||!!x.www||!!x.phone||!!x.email;
  }catch(err){
    if(!x.onlineUpdated)x.onlineUpdated=new Date().toISOString();x.onlineError=String(err?.message||err);a[i]=x;saveCustomSuppliers(a);if(String(selectedSupplierId)===String(id))renderSupplierWorkspace();return !!x.onlineVerified;
  }finally{onlineEnriching.delete(String(id))}
}
function autoEnrichSelectedSupplier(force=false){const x=getSelectedSupplier();if(!x)return;enrichSupplierOnline(x.id,force).then(ok=>{if(force)toast(ok?'Dane online zaktualizowane.':'Nie znaleziono pewnych danych online — pozostawiono dane lokalne.')})}
function emailSelectedSupplier(){const x=getSelectedSupplier();if(!x?.email)return toast('Brak adresu e-mail.');location.href='mailto:'+x.email}
function websiteSelectedSupplier(){const x=getSelectedSupplier();const u=normalizeWebUrl(x?.www);if(!u)return toast('Brak adresu WWW.');window.open(u,'_blank')}
function googleSearchSelectedSupplier(){const x=getSelectedSupplier();if(!x)return;window.open('https://www.google.com/search?q='+encodeURIComponent([x.name,supplierFullAddress(x)].filter(Boolean).join(' ')),'_blank')}
function renderSupplierWorkspace(){
  const screen=document.querySelector('.screen.landscape'); if(!screen||!screen.querySelector('img'))return;
  let a=getCustomSuppliers(); if(a.length && !a.some(x=>String(x.id)===String(selectedSupplierId))){selectedSupplierId=a[0].id;try{localStorage.setItem('lm_selected_supplier',String(selectedSupplierId))}catch(e){}}
  const table=document.getElementById('liveSuppliers'); if(table){const list=filteredSuppliers();table.innerHTML=`<div class="live-head"><div>Priorytet</div><div>Firma / kontrahent</div><div>Certyfikat</div><div>Miasto / adres</div><div>Ostatni kontakt</div><div>Następny kontakt</div><div>Cena po negocjacji</div><div>Status</div></div>`+(list.length?list.map(x=>{const p=priorityNo(x);return `<div class="live-row ${String(x.id)===String(selectedSupplierId)?'selected':''}" data-id="${esc(x.id)}"><div><span class="prio p${p}">${p}</span></div><div><span class="name">${esc(x.name)}</span><span class="muted">${esc(x.type||'')}</span></div><div>${esc(x.cert||'—')}<span class="muted">${esc(x.certId||'')}</span></div><div>${esc(x.city||'—')}<span class="muted">${esc([x.address,x.postal].filter(Boolean).join(' • '))}</span></div><div>${compactDate(x.last)}</div><div>${compactDate(x.next)}</div><div class="price">${esc(x.price||'—')}<span class="muted">${esc(x.currency||'PLN')}/t netto</span></div><div><span class="status ${supplierStatusClass(x.status)}">${esc(x.status||'—')}</span></div></div>`}).join(''):`<div class="empty">Brak dostawców dla wybranego filtra.</div>`);table.querySelectorAll('.live-row').forEach(r=>r.onclick=()=>selectSupplier(r.dataset.id));}
  const detail=document.getElementById('liveSupplierDetail'); if(detail){const x=getSelectedSupplier(); if(!x){detail.innerHTML='<div class="no-selection">Wybierz dostawcę z tabeli.</div>'}else{
    const addr=supplierFullAddress(x), online=x.onlineSource||'Jeszcze nie sprawdzono online';
    detail.innerHTML=`<h3>${esc(x.name)}</h3><div class="type">${esc(x.type||'')} <span class="tag">${esc([x.cert,x.certId].filter(Boolean).join(' ')||'CERTYFIKAT —')}</span></div>
      <div class="section">DANE KONTRAHENTA</div>
      <div class="line"><span class="ico">📍</span><span>${esc(addr||'—')}</span></div><div class="line"><span class="ico">☎</span><span>${esc(x.phone||'—')}</span></div><div class="line"><span class="ico">📱</span><span>${esc(x.mobile||'—')}</span></div><div class="line"><span class="ico">✉</span><span>${esc(x.email||'—')}</span></div><div class="line"><span class="ico">🌐</span><span>${esc(x.www||'—')}</span></div><div class="line"><span class="ico">👤</span><span>${esc(x.contact||'—')}</span></div>
      <div class="section">CERTYFIKATY / PELLET</div><div class="line"><span class="ico">✓</span><span>${esc(x.cert||'—')} ${esc(x.certId||'')}<br>Status: <b>${esc(x.certStatus||'—')}</b>${x.certValid?'<br>Ważny do: '+esc(x.certValid):''}<br>Dodatkowe: ${esc(x.sustain||'—')}<br>${esc(x.pellet||'Pellet')} • ${esc(x.diameter||'—')} • ${esc(x.form||'—')}</span></div>
      <div class="section">INFORMACJE HANDLOWE</div><div class="line"><span class="ico">▣</span><span>Cena wyjściowa: ${esc(x.priceStart||'—')} ${esc(x.currency||'PLN')}/t<br>Cena po negocjacji: <b>${esc(x.price||'—')} ${esc(x.currency||'PLN')}/t</b><br>Minimum: ${esc(x.minQty||'—')}<br>Incoterms: ${esc(x.incoterm||'—')}<br>Transport: ${esc(x.transportBy||'—')}<br>Płatność: ${esc(x.payment||'—')}<br>Dostępność: ${esc(x.availability||'—')}<br>Stała współpraca: ${esc(x.regular||'—')}</span></div>
      <div class="section">STATUS KONTRAHENTA / CRM</div><div class="line"><span class="ico">●</span><span>Status: <b>${esc(x.status||'—')}</b><br>Priorytet: ${priorityNo(x)}<br>Źródło: ${esc(x.source||'—')}</span></div><div class="line"><span class="ico">🗓</span><span>Ostatni kontakt: ${esc(formatLocalDate(x.last)||'—')}<br>Następny: ${esc(formatLocalDate(x.next)||'—')}<br>Cel: ${esc(x.goal||'—')}<br>Kanał: ${esc(x.channel||'—')}</span></div>${x.notes?`<div class="line"><span class="ico">📝</span><span>${esc(x.notes)}</span></div>`:''}
      <div class="section">DANE ONLINE / LOKALIZACJA</div><div class="line"><span class="ico">🌍</span><span class="${x.lat&&x.lon?'online-ok':'online-warn'}">${esc(online)}</span></div>${x.onlineUpdated?`<div class="note-mini">Aktualizacja: ${esc(formatLocalDate(x.onlineUpdated))}</div>`:''}${x.osmDisplayName?`<div class="note-mini">Lokalizacja online: ${esc(x.osmDisplayName)}</div>`:''}${x.lat&&x.lon?`<div class="note-mini">GPS: ${esc(x.lat)}, ${esc(x.lon)}</div>`:''}${x.openingHours?`<div class="note-mini">Godziny: ${esc(x.openingHours)}</div>`:''}
      <button class="action online" id="liveEnrich">UZUPEŁNIJ ONLINE</button><button class="action" id="liveCall">ZADZWOŃ TERAZ</button><button class="action blue" id="liveMap">MAPA DOJAZDU</button><button class="action dark" id="liveWeb">OTWÓRZ WWW</button><button class="action dark" id="liveMail">NAPISZ E-MAIL</button><button class="action dark" id="liveGoogle">SZUKAJ W GOOGLE</button>`;
    document.getElementById('liveEnrich').onclick=()=>autoEnrichSelectedSupplier(true);document.getElementById('liveCall').onclick=()=>callSelectedSupplier();document.getElementById('liveMap').onclick=()=>mapSelectedSupplier();document.getElementById('liveWeb').onclick=()=>websiteSelectedSupplier();document.getElementById('liveMail').onclick=()=>emailSelectedSupplier();document.getElementById('liveGoogle').onclick=()=>googleSearchSelectedSupplier();
  }}
}
function formatLocalDate(v){if(!v)return'';try{const d=new Date(v);if(isNaN(d))return v;return d.toLocaleString('pl-PL',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}catch(e){return v}}
function ensureSupplierWorkspace(d){
  if(!document.getElementById('supplierSearchLive')){const s=document.createElement('input');s.id='supplierSearchLive';s.className='supplier-search-live';s.placeholder='Szukaj dostawcy...';s.autocomplete='off';s.oninput=()=>renderSupplierWorkspace();d.appendChild(s)}
  if(!document.getElementById('liveSuppliers')){const t=document.createElement('div');t.id='liveSuppliers';t.className='live-suppliers';d.appendChild(t)}
  if(!document.getElementById('supplierStatusLegend')){const l=document.createElement('div');l.id='supplierStatusLegend';l.className='supplier-status-legend';l.innerHTML='<span class="legend-title">STATUS KONTRAHENTA:</span><span class="legend-item"><i class="dot red"></i>DO KONTAKTU</span><span class="legend-item"><i class="dot blue"></i>W TRAKCIE ROZMÓW</span><span class="legend-item"><i class="dot green"></i>ZATWIERDZONY</span><span class="legend-item"><i class="dot orange"></i>DO SPRAWDZENIA</span><span class="legend-item"><i class="dot gray"></i>ARCHIWUM</span>';d.appendChild(l)}
  if(!document.getElementById('liveSupplierDetail')){const p=document.createElement('div');p.id='liveSupplierDetail';p.className='live-detail';d.appendChild(p)}
  renderSupplierWorkspace();setTimeout(()=>autoEnrichSelectedSupplier(false),180);
}
function editSelectedSupplier(){const x=getSelectedSupplier();if(!x)return toast('Najpierw wybierz zapisanego dostawcę.');openSupplierForm(x.id)}
function deleteSelectedSupplier(){const x=getSelectedSupplier();if(!x)return toast('Najpierw wybierz zapisanego dostawcę.');if(!confirm('Usunąć dostawcę „'+x.name+'” z lokalnej bazy?'))return;const a=getCustomSuppliers().filter(y=>String(y.id)!==String(x.id));saveCustomSuppliers(a);selectedSupplierId=a[0]?.id||null;try{localStorage.setItem('lm_selected_supplier',selectedSupplierId?String(selectedSupplierId):'')}catch(e){}renderSupplierWorkspace();toast('Dostawca został usunięty.')}
function notesSelectedSupplier(){const x=getSelectedSupplier();if(!x)return toast('Najpierw wybierz zapisanego dostawcę.');const m=document.createElement('div');m.className='simple-modal';m.innerHTML=`<div class="simple-card"><h3>NOTATKI — ${esc(x.name)}</h3><textarea id="supplierNotesEdit">${esc(x.notes||'')}</textarea><div class="simple-actions"><button class="cancel">ANULUJ</button><button class="green save">ZAPISZ NOTATKI</button></div></div>`;document.body.appendChild(m);m.querySelector('.cancel').onclick=()=>m.remove();m.querySelector('.save').onclick=()=>{const a=getCustomSuppliers();const i=a.findIndex(y=>String(y.id)===String(x.id));if(i>=0){a[i].notes=document.getElementById('supplierNotesEdit').value.trim();a[i].history=Array.isArray(a[i].history)?a[i].history:[];a[i].history.push({at:new Date().toISOString(),type:'NOTATKA',text:'Zaktualizowano notatki handlowe'});saveCustomSuppliers(a)}m.remove();renderSupplierWorkspace();toast('Notatki zapisane.')}}
function historySelectedSupplier(){const x=getSelectedSupplier();if(!x)return toast('Najpierw wybierz zapisanego dostawcę.');const hist=(x.history||[]).slice().reverse();const m=document.createElement('div');m.className='simple-modal';m.innerHTML=`<div class="simple-card"><h3>HISTORIA KONTAKTÓW — ${esc(x.name)}</h3>${hist.length?hist.map(h=>`<div class="history-item"><b>${esc(h.type||'WPIS')}</b> — ${esc(h.text||'')}<small>${esc(formatLocalDate(h.at))}</small></div>`).join(''):'<div class="history-item">Brak wpisów historii.</div>'}<div class="simple-actions"><button class="green close">ZAMKNIJ</button></div></div>`;document.body.appendChild(m);m.querySelector('.close').onclick=()=>m.remove()}
function exportSupplierBase(){const a=getCustomSuppliers();const blob=new Blob([JSON.stringify({app:'L&M Technic Energy Europejski Kalkulator Peletu 1.2 PREMIUM',exportedAt:new Date().toISOString(),suppliers:a},null,2)],{type:'application/json'});const u=URL.createObjectURL(blob);const el=document.createElement('a');el.href=u;el.download='LM_Technic_Energy_Dostawcy_MASTER_V11_'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(el);el.click();el.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);toast('Wyeksportowano bazę dostawców JSON.')}
function importSupplierBase(){const inp=document.createElement('input');inp.type='file';inp.accept='.json,application/json';inp.style.display='none';document.body.appendChild(inp);inp.onchange=()=>{const f=inp.files?.[0];if(!f){inp.remove();return}const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result);const arr=Array.isArray(j)?j:Array.isArray(j.suppliers)?j.suppliers:null;if(!arr)throw new Error('format');const cur=getCustomSuppliers();const map=new Map(cur.map(x=>[String(x.id),x]));arr.forEach(x=>{const id=x.id||Date.now()+Math.random();map.set(String(id),{...x,id})});saveCustomSuppliers([...map.values()]);renderSupplierWorkspace();toast('Zaimportowano bazę dostawców.')}catch(e){toast('Nie udało się zaimportować pliku JSON.')}finally{inp.remove()}};r.readAsText(f)};inp.click()}
function callSelectedSupplier(){const x=getSelectedSupplier();const n=x&&(x.mobile||x.phone);if(!n)return toast('Brak numeru telefonu dla wybranego dostawcy.');location.href='tel:'+String(n).replace(/[^+\d]/g,'')}
function mapSelectedSupplier(){const x=getSelectedSupplier();if(!x)return toast('Najpierw wybierz dostawcę.');const addr=supplierFullAddress(x);const dest=(x.lat&&x.lon)?(x.lat+','+x.lon):addr;if(!dest)return toast('Brak adresu lub współrzędnych dostawcy.');const u='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(dest)+'&travelmode=driving';window.open(u,'_blank')}
function setSupplierFilter(v){supplierFilter=v;renderSupplierWorkspace();toast(v==='ALL'?'Filtr: wszyscy dostawcy':'Filtr: '+v)}
function openSupplierFilters(){const m=document.createElement('div');m.className='simple-modal';m.innerHTML=`<div class="simple-card"><h3>FILTRY DOSTAWCÓW</h3><div class="supplier-field"><label>Status</label><select id="liveFilterStatus"><option value="ALL">Wszystkie statusy</option><option>DO KONTAKTU</option><option>POTENCJALNY</option><option>W TRAKCIE ROZMÓW</option><option>ZATWIERDZONY</option><option>DO SPRAWDZENIA</option><option>ARCHIWUM</option></select></div><div class="supplier-field" style="margin-top:12px"><label>Priorytet</label><select id="liveFilterPriority"><option value="ALL">Wszystkie priorytety</option><option value="1">1 — PILNY</option><option value="2">2 — WYSOKI</option><option value="3">3 — WYSOKI</option><option value="4">4 — NORMALNY</option><option value="5">5 — NORMALNY</option><option value="6">6 — NISKI</option><option value="7">7 — NISKI</option><option value="8">8 — OBSERWACJA</option></select></div><div class="simple-actions"><button class="reset">WYCZYŚĆ</button><button class="green apply">ZASTOSUJ</button></div></div>`;document.body.appendChild(m);m.querySelector('#liveFilterStatus').value=supplierFilter;m.querySelector('#liveFilterPriority').value=supplierPriorityFilter;m.querySelector('.reset').onclick=()=>{supplierFilter='ALL';supplierPriorityFilter='ALL';m.remove();renderSupplierWorkspace();toast('Filtry wyczyszczone.')};m.querySelector('.apply').onclick=()=>{supplierFilter=m.querySelector('#liveFilterStatus').value;supplierPriorityFilter=m.querySelector('#liveFilterPriority').value;m.remove();renderSupplierWorkspace();toast('Zastosowano filtry dostawców.')}}

function openSupplierForm(editId=null){
  document.getElementById('supplierModal')?.remove();
  const wrap=document.createElement('div');wrap.className='modal-backdrop';wrap.id='supplierModal';
  wrap.innerHTML=`<div class="supplier-modal" role="dialog" aria-modal="true" aria-label="Dodaj dostawcę">
    <div class="supplier-head"><h2>+ DODAJ DOSTAWCĘ</h2><button class="supplier-close" type="button" aria-label="Zamknij">×</button></div>
    <div class="supplier-body"><div class="supplier-grid">

      <div class="supplier-section-title">1. KONTRAHENT</div>
      <div class="supplier-field full"><label>Firma / kontrahent <span class="supplier-required">*</span></label><input id="sf_name" autocomplete="organization" placeholder="np. Pellet Polska Sp. z o.o."></div>
      <div class="supplier-field"><label>Typ działalności</label><select id="sf_type"><option>Producent pelletu</option><option>Handlowiec / trader</option><option>Dystrybutor pelletu</option><option>Importer</option><option>Eksporter</option><option>Sprzedaż hurtowa pelletu</option><option>Sprzedaż detaliczna i hurtowa</option><option>Tartak / producent surowca</option><option>Dostawca usług</option><option>Inne</option></select></div>
      <div class="supplier-field"><label>Priorytet</label><select id="sf_priority"><option value="1">1 — PILNY / NAJWAŻNIEJSZY</option><option value="2">2 — WYSOKI</option><option value="3" selected>3 — WYSOKI</option><option value="4">4 — NORMALNY</option><option value="5">5 — NORMALNY</option><option value="6">6 — NISKI</option><option value="7">7 — NISKI</option><option value="8">8 — OBSERWACJA</option></select></div>
      <div class="supplier-field"><label>Źródło kontaktu</label><select id="sf_source"><option>Bezpośredni kontakt</option><option>Giełda Pelletu</option><option>Google / Internet</option><option>Polecenie</option><option>Targi / wydarzenie branżowe</option><option>Ogłoszenie / portal B2B</option><option>Import własnej bazy</option><option>Inne</option></select></div>
      <div class="supplier-field"><label>Status kontrahenta</label><select id="sf_status"><option>DO KONTAKTU</option><option>POTENCJALNY</option><option>W TRAKCIE ROZMÓW</option><option>ZATWIERDZONY</option><option>DO SPRAWDZENIA</option><option>ARCHIWUM</option></select></div>

      <div class="supplier-section-title">2. CERTYFIKATY I JAKOŚĆ PELLETU</div>
      <div class="supplier-hint">Certyfikat jakości pelletu wybierasz z listy. Numer/ID pozostaje osobnym polem, bo jest indywidualny dla firmy.</div>
      <div class="supplier-field"><label>Certyfikat / system jakości</label><select id="sf_cert"><option value="">Wybierz...</option><option>ENplus A1</option><option>ENplus A2</option><option>ENplus B</option><option>DINplus</option><option>ISO 17225-2 A1 — deklarowana zgodność</option><option>ISO 17225-2 A2 — deklarowana zgodność</option><option>ISO 17225-2 B — deklarowana zgodność</option><option>Brak certyfikatu</option><option>DO WERYFIKACJI</option><option>Inny system</option></select></div>
      <div class="supplier-field"><label>Numer / ID certyfikatu</label><input id="sf_cert_id" placeholder="np. PL 004 / numer DINplus"></div>
      <div class="supplier-field"><label>Status certyfikatu</label><select id="sf_cert_status"><option>DO WERYFIKACJI</option><option>ZWERYFIKOWANY — AKTYWNY</option><option>WYGASŁY</option><option>ZAWIESZONY</option><option>NIE DOTYCZY</option></select></div>
      <div class="supplier-field"><label>Ważny do</label><input id="sf_cert_valid" type="date"></div>
      <div class="supplier-field"><label>Certyfikaty dodatkowe / pochodzenie</label><select id="sf_sustain"><option>Brak / nie podano</option><option>FSC</option><option>PEFC</option><option>SBP</option><option>FSC + PEFC</option><option>FSC + SBP</option><option>PEFC + SBP</option><option>FSC + PEFC + SBP</option><option>DO WERYFIKACJI</option></select></div>
      <div class="supplier-field"><label>Średnica pelletu</label><select id="sf_diameter"><option>6 mm</option><option>8 mm</option><option>6 mm / 8 mm</option><option>Inna / do ustalenia</option></select></div>
      <div class="supplier-field"><label>Rodzaj pelletu</label><select id="sf_pellet"><option>Pellet drzewny</option><option>Iglasty</option><option>Liściasty</option><option>Mieszany</option><option>Przemysłowy</option><option>Inny / do ustalenia</option></select></div>
      <div class="supplier-field"><label>Forma sprzedaży</label><select id="sf_form"><option>Luzem</option><option>Worki 15 kg</option><option>Worki 10 kg</option><option>Big-Bag</option><option>Paleta</option><option>Luzem + worki</option><option>Do ustalenia</option></select></div>

      <div class="supplier-section-title">3. ADRES I KONTAKT</div>
      <div class="supplier-field"><label>Kraj</label><select id="sf_country"><option selected>Polska</option><option>Niemcy</option><option>Czechy</option><option>Słowacja</option><option>Austria</option><option>Litwa</option><option>Łotwa</option><option>Estonia</option><option>Ukraina</option><option>Rumunia</option><option>Bułgaria</option><option>Węgry</option><option>Słowenia</option><option>Chorwacja</option><option>Włochy</option><option>Francja</option><option>Belgia</option><option>Holandia</option><option>Dania</option><option>Szwecja</option><option>Finlandia</option><option>Norwegia</option><option>Szwajcaria</option><option>Hiszpania</option><option>Portugalia</option><option>Inny</option></select></div>
      <div class="supplier-field"><label>Miasto</label><input id="sf_city" autocomplete="address-level2" placeholder="Miasto"></div>
      <div class="supplier-field"><label>Kod pocztowy</label><input id="sf_postal" autocomplete="postal-code" placeholder="00-000"></div>
      <div class="supplier-field full"><label>Adres</label><input id="sf_address" autocomplete="street-address" placeholder="Ulica i numer"></div>
      <div class="supplier-field"><label>Osoba kontaktowa / dział</label><input id="sf_contact" autocomplete="name" placeholder="Imię i nazwisko / dział handlowy"></div>
      <div class="supplier-field"><label>Telefon główny</label><input id="sf_phone" inputmode="tel" autocomplete="tel" placeholder="+48 ..."></div>
      <div class="supplier-field"><label>Telefon komórkowy / hurt</label><input id="sf_mobile" inputmode="tel" placeholder="+48 ..."></div>
      <div class="supplier-field"><label>E-mail</label><input id="sf_email" inputmode="email" autocomplete="email" placeholder="biuro@firma.pl"></div>
      <div class="supplier-field full"><label>WWW</label><input id="sf_www" inputmode="url" placeholder="www.firma.pl"></div>

      <div class="supplier-section-title">4. WARUNKI HANDLOWE</div>
      <div class="supplier-field"><label>Cena wyjściowa netto / t</label><input id="sf_price_start" inputmode="decimal" placeholder="np. 1250"></div>
      <div class="supplier-field"><label>Cena po negocjacji netto / t</label><input id="sf_price" inputmode="decimal" placeholder="np. 1210"></div>
      <div class="supplier-field"><label>Waluta</label><select id="sf_currency"><option>PLN</option><option>EUR</option><option>USD</option><option>CZK</option><option>CHF</option></select></div>
      <div class="supplier-field"><label>Minimalne zamówienie</label><select id="sf_minqty"><option>26 t — 1 samochód</option><option>52 t — 2 samochody</option><option>78 t — 3 samochody</option><option>104 t — 4 samochody</option><option>130 t — 5 samochodów</option><option>156 t — 6 samochodów</option><option>182 t — 7 samochodów</option><option>208 t — 8 samochodów</option><option>234 t — 9 samochodów</option><option>260 t — 10 samochodów</option><option>Inna / do ustalenia</option></select></div>
      <div class="supplier-field"><label>Warunki dostawy / Incoterms</label><select id="sf_incoterm"><option>FCA</option><option>EXW</option><option>CPT</option><option>DAP</option><option>DDP</option><option>Do ustalenia</option><option>Inne</option></select></div>
      <div class="supplier-field"><label>Transport organizuje</label><select id="sf_transport"><option>Kupujący / L&M</option><option>Dostawca</option><option>Do ustalenia</option></select></div>
      <div class="supplier-field"><label>Termin płatności</label><select id="sf_payment"><option>Przedpłata</option><option>Płatność przy odbiorze</option><option>7 dni</option><option>14 dni</option><option>21 dni</option><option>30 dni</option><option>45 dni</option><option>60 dni</option><option>Do ustalenia</option></select></div>
      <div class="supplier-field"><label>Dostępność</label><select id="sf_availability"><option>Dostępny od ręki</option><option>Do 7 dni</option><option>Do 14 dni</option><option>Do 30 dni</option><option>Produkcja pod zamówienie</option><option>Brak danych / do ustalenia</option></select></div>
      <div class="supplier-field"><label>Stała współpraca</label><select id="sf_regular"><option>DO USTALENIA</option><option>TAK — możliwy stały odbiór</option><option>NIE — tylko zakup jednorazowy</option></select></div>

      <div class="supplier-section-title">5. CRM / KONTAKT HANDLOWY</div>
      <div class="supplier-field"><label>Ostatni kontakt</label><input id="sf_last" type="datetime-local"></div>
      <div class="supplier-field"><label>Następny kontakt</label><input id="sf_next" type="datetime-local"></div>
      <div class="supplier-field"><label>Cel następnego kontaktu</label><select id="sf_goal"><option>Pozyskanie oferty zakupu</option><option>Negocjacja ceny</option><option>Weryfikacja certyfikatu</option><option>Parametry pelletu</option><option>Dostępność</option><option>Transport</option><option>Warunki płatności</option><option>Stała współpraca</option><option>Reklamacja / wyjaśnienie</option><option>Inny</option></select></div>
      <div class="supplier-field"><label>Preferowany kontakt</label><select id="sf_channel"><option>Telefon</option><option>E-mail</option><option>WhatsApp</option><option>Spotkanie / wizyta</option><option>Dowolny</option></select></div>
      <div class="supplier-field full"><label>Notatki handlowe</label><textarea id="sf_notes" placeholder="Ustalenia, ceny 26/52 t, parametry pelletu, transport, płatność, uwagi do współpracy..."></textarea></div>

    </div><div class="supplier-actions"><button type="button" class="cancel">ANULUJ</button><button type="button" class="save">ZAPISZ DOSTAWCĘ</button></div>
    <div class="supplier-note">Dane są zapisywane lokalnie w telefonie. Formularz zachowuje wygląd MASTER.</div></div></div>`;
  document.body.appendChild(wrap);
  const editing = editId ? getCustomSuppliers().find(x=>String(x.id)===String(editId)) : null;
  if(editing){
    const map={sf_name:'name',sf_type:'type',sf_priority:'priority',sf_source:'source',sf_status:'status',sf_cert:'cert',sf_cert_id:'certId',sf_cert_status:'certStatus',sf_cert_valid:'certValid',sf_sustain:'sustain',sf_diameter:'diameter',sf_pellet:'pellet',sf_form:'form',sf_country:'country',sf_city:'city',sf_postal:'postal',sf_address:'address',sf_nip:'nip',sf_regon:'regon',sf_contact:'contact',sf_phone:'phone',sf_mobile:'mobile',sf_email:'email',sf_www:'www',sf_price_start:'priceStart',sf_price:'price',sf_currency:'currency',sf_minqty:'minQty',sf_incoterm:'incoterm',sf_transport:'transportBy',sf_payment:'payment',sf_availability:'availability',sf_regular:'regular',sf_last:'last',sf_next:'next',sf_goal:'goal',sf_channel:'channel',sf_notes:'notes'};
    Object.entries(map).forEach(([id,key])=>{const el=document.getElementById(id); if(el && editing[key]!=null) el.value=editing[key]});
    const title=wrap.querySelector('.supplier-head h2'); if(title) title.textContent='✎ EDYTUJ DOSTAWCĘ';
    const saveBtn=wrap.querySelector('.save'); if(saveBtn) saveBtn.textContent='ZAPISZ ZMIANY';
  }
  const close=()=>wrap.remove();wrap.querySelector('.supplier-close').onclick=close;wrap.querySelector('.cancel').onclick=close;
  wrap.addEventListener('click',e=>{if(e.target===wrap)close()});
  wrap.querySelector('.save').onclick=()=>{
    const name=document.getElementById('sf_name').value.trim();if(!name){toast('Wpisz nazwę firmy / kontrahenta.');document.getElementById('sf_name').focus();return}
    const val=id=>document.getElementById(id)?.value?.trim?.() ?? document.getElementById(id)?.value ?? '';
    const item={
      id:editing?.id || Date.now(),name,
      type:val('sf_type'),priority:val('sf_priority'),source:val('sf_source'),status:val('sf_status'),
      cert:val('sf_cert'),certId:val('sf_cert_id'),certStatus:val('sf_cert_status'),certValid:val('sf_cert_valid'),sustain:val('sf_sustain'),diameter:val('sf_diameter'),pellet:val('sf_pellet'),form:val('sf_form'),
      country:val('sf_country'),city:val('sf_city'),postal:val('sf_postal'),address:val('sf_address'),nip:val('sf_nip'),regon:val('sf_regon'),contact:val('sf_contact'),phone:val('sf_phone'),mobile:val('sf_mobile'),email:val('sf_email'),www:val('sf_www'),
      priceStart:val('sf_price_start'),price:val('sf_price'),currency:val('sf_currency'),minQty:val('sf_minqty'),incoterm:val('sf_incoterm'),transportBy:val('sf_transport'),payment:val('sf_payment'),availability:val('sf_availability'),regular:val('sf_regular'),
      last:val('sf_last'),next:val('sf_next'),goal:val('sf_goal'),channel:val('sf_channel'),notes:val('sf_notes'),created:editing?.created || new Date().toISOString(),updated:new Date().toISOString(),history:Array.isArray(editing?.history)?editing.history.slice():[]
    };
    const a=getCustomSuppliers(); if(editing){const i=a.findIndex(x=>String(x.id)===String(editing.id)); if(i>=0)a[i]=item; item.history.push({at:new Date().toISOString(),type:'EDYCJA',text:'Zmieniono dane kontrahenta'});} else {item.history.push({at:new Date().toISOString(),type:'UTWORZENIE',text:'Dodano dostawcę do lokalnej bazy'});a.push(item);} saveCustomSuppliers(a); selectedSupplierId=item.id; try{localStorage.setItem('lm_selected_supplier',String(item.id))}catch(e){} close();updateSupplierCount();renderSupplierWorkspace();toast(editing?'Zapisano zmiany dostawcy „'+name+'”.':'Dostawca „'+name+'” został zapisany lokalnie.');
  };
  setTimeout(()=>document.getElementById('sf_name')?.focus(),80);
}

function bind(name,d){
  if(name==='home'){
    const cols=[.008,.258,.508,.758],rows=[.139,.264,.389],cw=.234,rh=.119;
    const acts=[['home'],['offer'],['calculator'],['transport'],['noop','Rynki EU'],['currencies','Waluty'],['suppliers'],['clients','Klienci'],['map','Mapa dostaw'],['noop','Raporty'],['history','Historia'],['settings','Ustawienia']];let i=0;
    for(let r=0;r<3;r++)for(let c=0;c<4;c++){const a=acts[i++];hot(d,cols[c],rows[r],cw,rh,()=>a[0]==='noop'?toast('Moduł „'+a[1]+'” będzie aktywowany bez zmiany grafiki MASTER.'):go(a[0]));}
    hot(d,.008,.925,.16,.045,()=>go('offer')); hot(d,.835,.925,.16,.045,()=>go('suppliers'));
  } else if(name==='suppliers'){
    hot(d,.012,.13,.08,.115,()=>go('home'),'Pulpit');hot(d,.095,.13,.08,.115,()=>go('offer'),'Oferty');hot(d,.18,.13,.08,.115,()=>go('calculator'),'Kalkulator');hot(d,.265,.13,.08,.115,()=>go('transport'),'Transport');hot(d,.435,.13,.08,.115,()=>go('suppliers'),'Dostawcy');
    hot(d,.006,.925,.158,.062,()=>openSupplierForm(),'Dodaj dostawcę');
    hot(d,.17,.925,.16,.062,()=>editSelectedSupplier(),'Edytuj dostawcę');
    hot(d,.335,.925,.13,.062,()=>notesSelectedSupplier(),'Notatki');
    hot(d,.47,.925,.16,.062,()=>historySelectedSupplier(),'Historia kontaktów');
    hot(d,.635,.925,.115,.062,()=>deleteSelectedSupplier(),'Usuń');
    hot(d,.755,.925,.115,.062,()=>exportSupplierBase(),'Eksport bazy');
    hot(d,.875,.925,.12,.062,()=>importSupplierBase(),'Import bazy');
    hot(d,.646,.262,.102,.048,()=>openSupplierFilters(),'Filtry');
    hot(d,.014,.318,.145,.052,()=>setSupplierFilter('ALL'),'Wszyscy dostawcy');
    hot(d,.014,.371,.145,.052,()=>setSupplierFilter('POTENCJALNY'),'Potencjalni');
    hot(d,.014,.424,.145,.052,()=>setSupplierFilter('W TRAKCIE ROZMÓW'),'W trakcie rozmów');
    hot(d,.014,.477,.145,.052,()=>setSupplierFilter('ZATWIERDZONY'),'Zatwierdzeni');
    hot(d,.014,.530,.145,.052,()=>setSupplierFilter('DO SPRAWDZENIA'),'Do sprawdzenia');
    hot(d,.014,.583,.145,.052,()=>setSupplierFilter('ARCHIWUM'),'Archiwum');
    hot(d,.014,.638,.145,.050,()=>openSupplierForm(),'Dodaj dostawcę — menu lewe');
    hot(d,.014,.690,.145,.050,()=>exportSupplierBase(),'Eksport bazy — menu lewe');
    hot(d,.014,.742,.145,.050,()=>importSupplierBase(),'Import bazy — menu lewe');
    ensureSupplierWorkspace(d);
  } else if(name==='offer'){
    nav4(d); makeQty(d);
    hot(d,.04,.835,.92,.065,()=>{renderSummary();document.getElementById('summary')?.scrollIntoView({behavior:'smooth',block:'start'});},'Oblicz opłacalność');
    const summary=document.createElement('section');summary.id='summary';summary.className='summary-panel';d.after(summary);renderSummary();
  } else if(name==='transport'){
    hot(d,.01,0,.98,.12,()=>go('home'),'Pulpit');
    hot(d,.05,.78,.48,.07,()=>{const c=calc();toast('Transport: '+fmt(c.transportTotal)+' zł łącznie dla '+fmt(c.tons,0)+' t.');},'Przelicz transport');
    addTransportOverlay(d);
  }
}
window.addEventListener('click',(e)=>{const m=document.getElementById('qtyMenu'); if(m&&m.classList.contains('open')&&!e.target.closest('.qty-menu')&&!e.target.closest('.qty-display'))m.classList.remove('open');});

/* === V10 MASTER DOSTAWCY — zatwierdzony układ i żywe funkcje === */
const SUPPLIER_MASTER_ART='./assets/embedded-30-42afbc0a1e3f.png';
let supplierSort='priority';
function sortSuppliersV10(a){
  const arr=a.slice();
  if(supplierSort==='name')arr.sort((x,y)=>String(x.name||'').localeCompare(String(y.name||''),'pl'));
  else if(supplierSort==='price')arr.sort((x,y)=>(Number(x.price)||999999)-(Number(y.price)||999999));
  else if(supplierSort==='status')arr.sort((x,y)=>String(x.status||'').localeCompare(String(y.status||''),'pl'));
  else arr.sort((x,y)=>priorityNo(x)-priorityNo(y)||String(x.name||'').localeCompare(String(y.name||''),'pl'));
  return arr;
}
function supplierCallHref(x){const n=x&&(x.mobile||x.phone);return n?'tel:'+String(n).replace(/[^+\d]/g,''):'#'}
function supplierMailHref(x){
  if(!x?.email)return '#';
  const subject='L&M Technic Energy — zapytanie handlowe';
  const body=['Dzień dobry,','','proszę o kontakt w sprawie aktualnej oferty pelletu oraz warunków współpracy.','','Pozdrawiam','L&M Technic Energy','E-mail: '+COMPANY_EMAIL].join('\n');
  return 'mailto:'+encodeURIComponent(x.email)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
}
function supplierMapHref(x){if(!x)return'#';const dest=(x.lat&&x.lon)?(x.lat+','+x.lon):supplierFullAddress(x);return dest?'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(dest)+'&travelmode=driving':'#'}
function supplierWebHref(x){return normalizeWebUrl(x?.www)||'#'}
function supplierGoogleHref(x){return x?'https://www.google.com/search?q='+encodeURIComponent([x.name,supplierFullAddress(x)].filter(Boolean).join(' ')):'#'}
function safeMoneyV10(v,c='PLN'){const n=Number(String(v||'').replace(',','.'));return Number.isFinite(n)&&n>0?fmt(n)+' '+c+'/t':'—'}
function openSortV10(){
 const wrap=document.createElement('div');wrap.className='modal-backdrop';wrap.innerHTML=`<div class="supplier-modal"><div class="supplier-head"><h2>SORTUJ DOSTAWCÓW</h2><button class="supplier-close">×</button></div><div class="supplier-body"><div class="supplier-field full"><label>Sortowanie</label><select id="sortV10"><option value="priority">Priorytet</option><option value="name">Nazwa kontrahenta</option><option value="price">Cena po negocjacji</option><option value="status">Status kontrahenta</option></select></div><div class="supplier-actions"><button class="cancel">ANULUJ</button><button class="save">ZASTOSUJ</button></div></div></div>`;document.body.appendChild(wrap);wrap.querySelector('#sortV10').value=supplierSort;const close=()=>wrap.remove();wrap.querySelector('.supplier-close').onclick=close;wrap.querySelector('.cancel').onclick=close;wrap.querySelector('.save').onclick=()=>{supplierSort=wrap.querySelector('#sortV10').value;close();renderSuppliersV10();};
}

function uiIcon(name){
 const a='viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
 const icons={
  pin:`<svg ${a}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  phone:`<svg ${a}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.8a2 2 0 0 1-.45 2.11L8.07 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.32 1.84.55 2.8.68A2 2 0 0 1 22 16.92Z"/></svg>`,
  mobile:`<svg ${a}><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 19h2"/></svg>`,
  mail:`<svg ${a}><rect x="2.5" y="4.5" width="19" height="15" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/></svg>`,
  web:`<svg ${a}><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c3 3 4.5 6.2 4.5 9.5S15 18.5 12 21.5M12 2.5C9 5.5 7.5 8.7 7.5 12S9 18.5 12 21.5"/></svg>`,
  cloud:`<svg ${a}><path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 8.1 4.5 4.5 0 0 0 7 18Z"/><path d="M12 10v6m0 0-2.5-2.5M12 16l2.5-2.5"/></svg>`
 };
 return icons[name]||'';
}

function renderSuppliersV10(){
 const root=document.getElementById('supV10');if(!root)return;
 let a=filteredSuppliers();a=sortSuppliersV10(a);if(a.length&&!a.some(x=>String(x.id)===String(selectedSupplierId))){selectedSupplierId=a[0].id;try{localStorage.setItem('lm_selected_supplier',String(selectedSupplierId))}catch(e){}}
 const rows=root.querySelector('#supRowsV10');
 rows.innerHTML=a.length?a.map(x=>{const p=priorityNo(x);return `<div class="supplier-row ${String(x.id)===String(selectedSupplierId)?'selected':''}" data-id="${esc(x.id)}"><div><span class="prio p${p}">${p}</span></div><div class="rname">${esc(x.name)}</div><div class="rcert">${esc(x.cert||'—')}</div><div class="rcity">${esc(x.city||'—')}</div><div class="rprice">${esc(safeMoneyV10(x.price,x.currency||'PLN'))}</div><div><span class="status-pill ${supplierStatusClass(x.status)}">${esc(x.status||'—')}</span></div></div>`}).join(''):'<div class="empty-v10">Brak kontrahentów dla wybranego filtra.</div>';
 rows.querySelectorAll('.supplier-row').forEach(r=>r.onclick=()=>{selectSupplier(r.dataset.id);renderSuppliersV10();});
 const x=getSelectedSupplier();const d=root.querySelector('#supDetailV10');if(!x){d.innerHTML='<div class="empty-v10">Wybierz kontrahenta z tabeli.</div>';return}
 const addr=supplierFullAddress(x)||'—',call=supplierCallHref(x),mail=supplierMailHref(x),map=supplierMapHref(x),web=supplierWebHref(x),gg=supplierGoogleHref(x);
 const certText=[x.cert,x.certId].filter(Boolean).join(' ')||'—';
 d.innerHTML=`<div class="detail-col"><div class="dname">${esc(x.name)}</div><div class="dtype">${esc(x.type||'Kontrahent')}</div><div class="sec">DANE KONTAKTOWE</div><div class="dline"><span class="dico pin">${uiIcon('pin')}</span><span>${esc(addr)}</span></div><div class="dline"><span class="dico phone">${uiIcon('phone')}</span><span>${esc(x.phone||'—')}</span></div><div class="dline"><span class="dico mobile">${uiIcon('mobile')}</span><span>${esc(x.mobile||'—')}${x.mobile?' <b style="color:#95d82d">(hurt)</b>':''}</span></div><div class="dline"><span class="dico mail">${uiIcon('mail')}</span><span>${esc(x.email||'—')}</span></div><div class="dline"><span class="dico web">${uiIcon('web')}</span><span>${esc(x.www||'—')}</span></div><div class="sec">DANE FIRMY</div><div class="dline"><span class="dico">N</span><span>NIP: ${esc(x.nip||'—')}</span></div><div class="dline"><span class="dico">R</span><span>REGON: ${esc(x.regon||'—')}</span></div></div>
 <div class="detail-col"><div class="card"><div class="sec" style="margin-top:0">CERTYFIKAT</div><div class="certrow"><span class="cert-badge">EN<br>A1</span><span><b>${esc(certText)}</b><br><span class="muted">${x.certValid?'Ważny do: '+esc(x.certValid):esc(x.certStatus||'')}</span><br><a href="https://www.google.com/search?q=${encodeURIComponent([x.cert,x.certId,x.name].filter(Boolean).join(' '))}" target="_blank" style="display:inline-block;margin-top:.35em;color:#9dde31;text-decoration:none;border:1px solid #4f712e;border-radius:4px;padding:.18em .4em">ZOBACZ CERTYFIKAT</a></span></div></div><div class="card"><div class="sec" style="margin-top:0">CENA PO NEGOCJACJI</div><div class="dprice">${esc(safeMoneyV10(x.price,x.currency||'PLN'))}</div><span class="muted">${x.price?fmt(Number(String(x.price).replace(',','.'))*1.23)+' '+esc(x.currency||'PLN')+'/t brutto (23% VAT)':'—'}</span></div><div class="dates"><div class="card"><div class="sec" style="margin-top:0">OSTATNI KONTAKT</div>${esc(formatLocalDate(x.last)||'—')}</div><div class="card"><div class="sec" style="margin-top:0">NASTĘPNY KONTAKT</div>${esc(formatLocalDate(x.next)||'—')}</div></div><div class="card notes"><div class="sec" style="margin-top:0">NOTATKA HANDLOWA</div>${esc(x.notes||'Brak notatki.')}</div></div>
 <div class="detail-col"><div class="action-stack"><div class="action-title">SZYBKIE AKCJE</div><button class="action-btn online-yellow" id="v10Enrich"><span class="action-ico">${uiIcon('cloud')}</span><span class="action-label">UZUPEŁNIJ ONLINE</span></button><a class="action-btn green" href="${call}" id="v10Call"><span class="action-ico">${uiIcon('phone')}</span><span class="action-label">ZADZWOŃ TERAZ</span></a><a class="action-btn blue" href="${map}" target="_blank"><span class="action-ico">${uiIcon('pin')}</span><span class="action-label">MAPA DOJAZDU</span></a><a class="action-btn web-purple" href="${web}" target="_blank"><span class="action-ico">${uiIcon('web')}</span><span class="action-label">OTWÓRZ WWW</span></a><a class="action-btn mail-orange" href="${mail}"><span class="action-ico">${uiIcon('mail')}</span><span class="action-label">NAPISZ E-MAIL</span></a><a class="action-btn google-white" href="${gg}" target="_blank"><span class="action-ico"><span class="google-g">G</span></span><span class="action-label">SZUKAJ W GOOGLE</span></a></div></div>`;
 const enrich=root.querySelector('#v10Enrich');if(enrich)enrich.onclick=()=>{enrich.disabled=true;enrich.innerHTML='<span class="action-ico">'+uiIcon('cloud')+'</span><span class="action-label">UZUPEŁNIAM…</span>';enrichSupplierOnline(x.id,true).then(ok=>{renderSuppliersV10();toast(ok?'Dane online uzupełnione.':'Brak pewnego dopasowania online — zachowano dane lokalne.')})};
 const callA=root.querySelector('#v10Call');if(callA&&call==='#')callA.onclick=(e)=>{e.preventDefault();toast('Brak numeru telefonu dla wybranego kontrahenta.')};
}
function renderSupplierMasterPage(){
 const app=document.getElementById('app');app.innerHTML='';const d=document.createElement('div');d.className='sup-v10';d.id='supV10';d.innerHTML=`<img class="master-art" src="${SUPPLIER_MASTER_ART}" alt="Dostawcy — MASTER 100%"><input id="supplierSearchLive" class="sup-search" placeholder="Szukaj dostawcy, miasta, certyfikatu…" autocomplete="off"><button class="sup-toolbar filter" id="supFilterV10">▽ FILTRY</button><button class="sup-toolbar sort" id="supSortV10">⇅ SORTUJ</button><div class="table-wrap"><div class="table-head"><div>PRIORYTET</div><div>KONTRAHENT</div><div>CERTYFIKAT</div><div>MIASTO</div><div>CENA PO NEGOCJACJI</div><div>STATUS</div></div><div class="rows" id="supRowsV10"></div></div><div class="legend-v10"><b>STATUS KONTRAHENTA:</b><span><i class="ldot ld-red"></i>DO KONTAKTU</span><span><i class="ldot ld-blue"></i>W TRAKCIE ROZMÓW</span><span><i class="ldot ld-green"></i>ZATWIERDZONY</span><span><i class="ldot ld-orange"></i>DO SPRAWDZENIA</span><span><i class="ldot ld-gray"></i>ARCHIWUM</span></div><div class="detail-v10" id="supDetailV10"></div><div class="bottom-actions"><button class="add" id="v10Add">＋ DODAJ DOSTAWCĘ</button><button class="edit" id="v10Edit">✎ EDYTUJ DOSTAWCĘ</button><button class="note" id="v10Notes">▤ NOTATKI</button><button class="history" id="v10History">◉ HISTORIA KONTAKTÓW</button><button class="delete" id="v10Delete">▣ USUŃ</button></div>`;app.appendChild(d);
 // Nawigacja górna zachowuje dokładnie MASTER; aktywne główne moduły
 const navY=.073, navH=.047, w=.0784;const nav=[['home'],['offer'],['calculator'],['transport'],['noop','Rynki EU'],['currencies','Waluty'],['suppliers'],['clients','Klienci'],['map','Mapa dostaw'],['noop','Raporty'],['history','Historia'],['settings','Ustawienia']];nav.forEach((a,i)=>{const b=document.createElement('button');b.className='sup-hot';b.style.left=(i*8.15+.7)+'%';b.style.top=(navY*100)+'%';b.style.width=(w*100)+'%';b.style.height=(navH*100)+'%';b.onclick=()=>a[0]==='noop'?toast('Moduł „'+a[1]+'” będzie aktywowany w tym samym standardzie MASTER.'):go(a[0]);d.appendChild(b)});
 d.querySelector('#supplierSearchLive').oninput=()=>renderSuppliersV10();d.querySelector('#supFilterV10').onclick=()=>openSupplierFilters();d.querySelector('#supSortV10').onclick=()=>openSortV10();d.querySelector('#v10Add').onclick=()=>openSupplierForm();d.querySelector('#v10Edit').onclick=()=>editSelectedSupplier();d.querySelector('#v10Notes').onclick=()=>notesSelectedSupplier();d.querySelector('#v10History').onclick=()=>historySelectedSupplier();d.querySelector('#v10Delete').onclick=()=>deleteSelectedSupplier();
 renderSuppliersV10();window.scrollTo({top:0,left:0,behavior:'auto'});
}
const goV9=go;
go=function(name){if(name==='suppliers')return renderSupplierMasterPage();return goV9(name)};
const renderSupplierWorkspaceV9=renderSupplierWorkspace;
renderSupplierWorkspace=function(){if(document.getElementById('supV10'))return renderSuppliersV10();return renderSupplierWorkspaceV9()};


const CLIENT_MASTER_ART="./assets/embedded-31-0458cc74b44c.jpg";
const CLIENT_FORM_ART="./assets/embedded-32-68b2f538b687.jpg";
let CLIENTS_V13=[{"name": "Agro-Eco Sp. z o.o.", "city": "Rzeszów", "type": "Producent", "date": "15.08.2026", "status": "DO KONTAKTU", "color": "red"}, {"name": "Zakład Drzewny Nowak", "city": "Tarnów", "type": "Przemysł", "date": "12.08.2026", "status": "W ROZMAWIANIU", "color": "blue"}, {"name": "EcoHeat Sp. z o.o.", "city": "Kielce", "type": "Dystrybutor", "date": "14.08.2026", "status": "ZATWIERDZONY", "color": "green"}, {"name": "PPHU Drewpol", "city": "Lublin", "type": "Przemysł", "date": "10.08.2026", "status": "DO SPRAWDZENIA", "color": "orange"}, {"name": "GreenEnergy SA", "city": "Warszawa", "type": "Hurtownia", "date": "07.08.2026", "status": "W ROZMAWIANIU", "color": "blue"}, {"name": "Dom Ciepła Sp. z o.o.", "city": "Białystok", "type": "Instalator", "date": "13.08.2026", "status": "ZATWIERDZONY", "color": "green"}, {"name": "FHU Kominek Expert", "city": "Katowice", "type": "Instalator", "date": "05.08.2026", "status": "DO SPRAWDZENIA", "color": "orange"}, {"name": "Ciepło Domowe Sp. j.", "city": "Wrocław", "type": "Handlowy", "date": "11.08.2026", "status": "DO KONTAKTU", "color": "red"}, {"name": "Pellethouse Sp. z o.o.", "city": "Poznań", "type": "Detaliczny", "date": "09.08.2026", "status": "W ROZMAWIANIU", "color": "blue"}, {"name": "TermoDom Sp. z o.o.", "city": "Gdańsk", "type": "Instalator", "date": "16.08.2026", "status": "ZATWIERDZONY", "color": "green", "nip": "957 123 45 67", "regon": "520987654", "contact": "Jan Kowalski", "role": "Właściciel", "phone": "+48 600 123 456", "phone2": "+48 12 345 67 89", "email": "biuro@termodom.com.pl", "web": "www.termodom.com.pl", "invoiceAddress": "ul. Ciepła 15, 30-017 Kraków, Polska", "delivery": "ul. Przemysłowa 8, 30-701 Kraków, Polska", "locations": [["Magazyn Główny", "ul. Przemysłowa 8, 30-701 Kraków", "+48 12 300 11 22"], ["Oddział Południe", "ul. Leśna 20, 43-300 Bielsko-Biała", "+48 33 812 45 67"], ["Punkt Serwisowy", "ul. Energetyczna 5, 35-959 Rzeszów", "+48 17 850 33 64"]], "payment": "14 dni / przelew", "credit": "50 000,00 PLN", "used": "18 450,00 PLN", "notes": "Stały klient od 2024 r. Preferuje dostawy całopojazdowe. Wysoka rotacja w sezonie zimowym.", "offers": "7", "orders": "5", "value": "121 tys. zł", "last": "15.08.2026, 18:20"}, {"name": "Mazur Energy Sp. z o.o.", "city": "Olsztyn", "type": "Dystrybutor", "date": "01.08.2026", "status": "ARCHIWUM", "color": "gray"}, {"name": "BioHeat Polska Sp. z o.o.", "city": "Łódź", "type": "Hurtownia", "date": "04.08.2026", "status": "DO SPRAWDZENIA", "color": "orange"}, {"name": "Energo Plus Sp. z o.o.", "city": "Szczecin", "type": "Przemysł", "date": "02.08.2026", "status": "DO KONTAKTU", "color": "red"}, {"name": "Wood Comfort Sp. k.", "city": "Bydgoszcz", "type": "Instalator", "date": "06.08.2026", "status": "W ROZMAWIANIU", "color": "blue"}, {"name": "Ciepły Dom Sp. z o.o.", "city": "Kraków", "type": "Instalator", "date": "15.08.2026", "status": "ZATWIERDZONY", "color": "green"}, {"name": "Szaf Trans Sp. z o.o.", "city": "Opole", "type": "Przemysł", "date": "28.07.2026", "status": "ARCHIWUM", "color": "gray"}, {"name": "Komfort Domu SA", "city": "Zielona Góra", "type": "Handlowy", "date": "03.08.2026", "status": "DO SPRAWDZENIA", "color": "orange"}, {"name": "Eko Energia Sp. z o.o.", "city": "Kryńsk", "type": "Dystrybutor", "date": "31.07.2026", "status": "DO KONTAKTU", "color": "red"}];
try{
  const __savedClients=JSON.parse(localStorage.getItem('lm_clients_v13_data')||'null');
  if(Array.isArray(__savedClients)&&__savedClients.length) CLIENTS_V13=__savedClients;
}catch(e){}
function persistClientsV13(){try{localStorage.setItem('lm_clients_v13_data',JSON.stringify(CLIENTS_V13))}catch(e){}}
let clientSelectedIndex=(()=>{try{const x=Number(localStorage.getItem('lm_client_selected_v13'));return Number.isInteger(x)&&x>=0&&x<CLIENTS_V13.length?x:9}catch(e){return 9}})();
let clientStatusFilter='ALL';

function cliEsc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function clientModal(html){
  document.getElementById('clientSimpleModal')?.remove();
  const m=document.createElement('div');m.className='client-simple-modal';m.id='clientSimpleModal';
  m.innerHTML='<div class="client-simple-card">'+html+'</div>';document.body.appendChild(m);
}
function closeClientModal(){document.getElementById('clientSimpleModal')?.remove()}
function clientStatusClass(s){return s==='ZATWIERDZONY'?'green':s==='W ROZMAWIANIU'?'blue':s==='DO SPRAWDZENIA'?'orange':s==='ARCHIWUM'?'gray':'red'}
function clientNumClass(i){return [0,7,12,17].includes(i)?'':([1,3,6,11,16].includes(i)?'orange':([2,5,9,14].includes(i)?'green':([4,8,13].includes(i)?'blue':'gray')))}

function renderClientsNative(){
  const app=document.getElementById('app');app.innerHTML='';
  const d=document.createElement('div');d.className='cli-v13';d.id='cliV13';
  d.innerHTML=`<img class="master-art" src="${CLIENT_MASTER_ART}" alt="KLIENCI — BAZA ODBIORCÓW MASTER">
    <input id="clientSearchV13" class="cli-search" placeholder="Szukaj klienta, miasta, NIP…" autocomplete="off">
    <button id="clientFilterV13" class="cli-filter">▽ FILTRY</button>
    <div class="cli-table"><div class="cli-table-head"><div>STATUS</div><div>NAZWA KLIENTA</div><div>MIASTO</div><div>TYP KLIENTA</div><div>OSTATNIA OFERTA</div><div>AKCJA</div></div><div class="cli-rows" id="clientRowsV13"></div></div>
    <div class="cli-detail" id="clientDetailV13"></div>
    <div class="cli-legend"><b>STATUS KONTRAHENTA:</b><span><i class="red"></i>DO KONTAKTU</span><span><i class="blue"></i>W TRAKCIE ROZMÓW</span><span><i class="green"></i>ZATWIERDZONY</span><span><i class="orange"></i>DO SPRAWDZENIA</span><span><i class="gray"></i>ARCHIWUM</span></div>`;
  app.appendChild(d);

  // Górny pasek działa tak samo jak w V12 — bez iframe.
  const navY=.073, navH=.047, w=.0784;
  const nav=[['home'],['offer'],['calculator'],['transport'],['noop','Rynki EU'],['currencies','Waluty'],['suppliers'],['clients'],['clients'],['map','Mapa dostaw'],['noop','Raporty'],['history','Historia'],['settings','Ustawienia']];
  // Grafika Klientów ma 13 pól w nagłówku (w tym drugi kafel KLIENCI). Dostosowane położenia:
  const xs=[.006,.081,.157,.232,.307,.382,.457,.532,.607,.682,.757,.832,.907];
  nav.forEach((a,i)=>{
    const b=document.createElement('button');b.className='cli-hot';b.style.left=(xs[i]*100)+'%';b.style.top=(navY*100)+'%';b.style.width='7.0%';b.style.height=(navH*100)+'%';
    b.onclick=()=>a[0]==='noop'?toast('Moduł będzie aktywowany bez zmiany grafiki MASTER.'):go(a[0]);d.appendChild(b);
  });

  // Dolne duże przyciski na zatwierdzonej grafice.
  const acts=[
    [.048,.805,.193,.085,()=>renderClientFormNative(false),'Dodaj'],
    [.242,.805,.225,.085,()=>renderClientFormNative(true),'Edytuj'],
    [.506,.805,.195,.085,()=>clientNotes(),'Notatki'],
    [.734,.805,.20,.085,()=>clientHistory(),'Historia'],
    [.048,.902,.193,.085,()=>clientDocuments(),'Dokumenty'],
    [.242,.902,.225,.085,()=>clientInvoice('PROFORMA'),'Proforma'],
    [.506,.902,.195,.085,()=>clientInvoice('FAKTURA KOŃCOWA'),'Faktura końcowa'],
    [.734,.902,.20,.085,()=>clientInvoicesArchive(),'Faktury']
  ];
  acts.forEach(a=>{const b=document.createElement('button');b.className='cli-hot';b.style.left=(a[0]*100)+'%';b.style.top=(a[1]*100)+'%';b.style.width=(a[2]*100)+'%';b.style.height=(a[3]*100)+'%';b.onclick=a[4];b.setAttribute('aria-label',a[5]);d.appendChild(b)});

  d.querySelector('#clientSearchV13').oninput=renderClientRowsV13;
  d.querySelector('#clientFilterV13').onclick=openClientFiltersV13;
  renderClientRowsV13();
  window.scrollTo({top:0,left:0,behavior:'auto'});
}

function visibleClientsV13(){
  const q=(document.getElementById('clientSearchV13')?.value||'').trim().toLowerCase();
  return CLIENTS_V13.map((x,i)=>({...x,_i:i})).filter(x=>(clientStatusFilter==='ALL'||x.status===clientStatusFilter)&&(!q||[x.name,x.city,x.type,x.nip||''].join(' ').toLowerCase().includes(q)));
}
function renderClientRowsV13(){
  const box=document.getElementById('clientRowsV13');if(!box)return;
  const arr=visibleClientsV13();
  box.innerHTML=arr.map(x=>`<div class="cli-row ${x._i===clientSelectedIndex?'selected':''}" data-i="${x._i}">
    <div><span class="cli-num ${clientNumClass(x._i)}">${x._i+1}</span></div>
    <div class="cli-name">${cliEsc(x.name)}</div><div>${cliEsc(x.city)}</div><div>${cliEsc(x.type)}</div>
    <div class="cli-date">${cliEsc(x.date)}</div><div><span class="cli-status ${clientStatusClass(x.status)}">${cliEsc(x.status)}</span></div>
  </div>`).join('') || '<div style="padding:25px;color:#879389">Brak klientów dla wybranego filtra.</div>';
  box.querySelectorAll('.cli-row').forEach(r=>r.onclick=()=>{clientSelectedIndex=Number(r.dataset.i);try{localStorage.setItem('lm_client_selected_v13',String(clientSelectedIndex))}catch(e){}renderClientRowsV13();renderClientDetailV13()});
  renderClientDetailV13();
}
function renderClientDetailV13(){
  const p=document.getElementById('clientDetailV13');if(!p)return;
  const x=CLIENTS_V13[clientSelectedIndex]||CLIENTS_V13[9];
  const rich=x.nip;
  p.innerHTML=`<div class="dhead"><div class="avatar">⌂</div><div><div class="dname">${cliEsc(x.name)}</div><div class="dtype">${cliEsc(x.type)} • ${cliEsc(x.city)}</div><span class="badge-ok">${cliEsc(x.status)}</span></div></div>
  <div class="sec">DANE PODSTAWOWE</div>
  <div class="line"><span class="ico">N</span><span>NIP: ${cliEsc(x.nip||'—')} &nbsp;&nbsp; REGON: ${cliEsc(x.regon||'—')}</span></div>
  <div class="line"><span class="ico">●</span><span>Kontakt: ${cliEsc(x.contact||'—')}${x.role?'<br><span class="muted">'+cliEsc(x.role)+'</span>':''}</span></div>
  <div class="line"><span class="ico">☎</span><span>${cliEsc(x.phone||'—')}${x.phone2?'<br>'+cliEsc(x.phone2):''}</span></div>
  <div class="line"><span class="ico">✉</span><span>${cliEsc(x.email||'Brak e-mail')}</span></div>
  <div class="line"><span class="ico">◎</span><span>${cliEsc(x.web||'Brak strony WWW')}</span></div>
  <div class="sec">ADRES SIEDZIBY I FAKTURA</div>
  <div class="line"><span class="ico">●</span><span>${cliEsc(x.invoiceAddress||x.city+', Polska')}</span></div>
  <div class="sec">ADRES DOSTAWY (GŁÓWNY)</div>
  <div class="line"><span class="ico">●</span><span>${cliEsc(x.delivery||'Brak uzupełnionego adresu dostawy')}</span></div>
  ${rich?`<div class="sec">LOKALIZACJE DOSTAW (${x.locations.length})</div><div class="locations">${x.locations.map(z=>`<div class="loc"><b>${cliEsc(z[0])}</b><br>${cliEsc(z[1])}<br><span class="muted">${cliEsc(z[2])}</span></div>`).join('')}</div>
  <div class="cards"><div class="card"><b>WARUNKI PŁATNOŚCI</b><br>${cliEsc(x.payment)}</div><div class="card"><b>LIMIT KREDYTOWY</b><div class="big">${cliEsc(x.credit)}</div><span class="muted">Wykorzystane: ${cliEsc(x.used)}</span></div></div>
  <div class="sec">NOTATKI</div><div>${cliEsc(x.notes)}</div>
  <div class="sec">PODSUMOWANIE CRM</div><div class="cards"><div class="card">Oferty: <b>${x.offers}</b><br>Zamówienia: <b>${x.orders}</b><br>Wartość: <b>${x.value}</b></div><div class="card">Ostatni kontakt:<br><b>${x.last}</b><br><span class="muted">Opiekun: L&M Technic Energy</span></div></div>`:
  `<div class="sec">INFORMACJA</div><div class="muted">Dla tego kontrahenta nie uzupełniono jeszcze pełnej karty. Wybrany wiersz i panel szczegółów są teraz zawsze zsynchronizowane.</div>`}
  `;
}

function openClientFiltersV13(){
  clientModal(`<h3>FILTRY KLIENTÓW</h3><select id="cliStatusSel"><option value="ALL">Wszystkie statusy</option><option>DO KONTAKTU</option><option>W ROZMAWIANIU</option><option>ZATWIERDZONY</option><option>DO SPRAWDZENIA</option><option>ARCHIWUM</option></select>
  <button class="green" id="cliApplyFilter">ZASTOSUJ</button><button id="cliClearFilter">WYCZYŚĆ</button>`);
  document.getElementById('cliStatusSel').value=clientStatusFilter;
  document.getElementById('cliApplyFilter').onclick=()=>{clientStatusFilter=document.getElementById('cliStatusSel').value;closeClientModal();renderClientRowsV13()};
  document.getElementById('cliClearFilter').onclick=()=>{clientStatusFilter='ALL';closeClientModal();renderClientRowsV13()};
}
function clientNotes(){const x=CLIENTS_V13[clientSelectedIndex];clientModal(`<h3>NOTATKI — ${cliEsc(x.name)}</h3><textarea id="cliNote" rows="7">${cliEsc(x.notes||'')}</textarea><button class="green" onclick="closeClientModal()">ZAPISZ / ZAMKNIJ</button>`)}
function clientHistory(){const x=CLIENTS_V13[clientSelectedIndex];clientModal(`<h3>HISTORIA — ${cliEsc(x.name)}</h3><p>Ostatnia oferta: <b>${cliEsc(x.date)}</b></p><p>Status: <b>${cliEsc(x.status)}</b></p><button class="green" onclick="closeClientModal()">ZAMKNIJ</button>`)}
function clientDocuments(){const x=CLIENTS_V13[clientSelectedIndex];clientModal(`<h3>DOKUMENTY — ${cliEsc(x.name)}</h3><p>Moduł dokumentów jest podpięty testowo i gotowy do dalszego rozwinięcia.</p><button class="green" onclick="closeClientModal()">OK</button>`)}
function clientInvoicesArchive(){const x=CLIENTS_V13[clientSelectedIndex];clientModal(`<h3>FAKTURY — ${cliEsc(x.name)}</h3><p>Archiwum faktur klienta — moduł testowy.</p><button class="green" onclick="closeClientModal()">OK</button>`)}
function clientInvoice(kind){
  const x=CLIENTS_V13[clientSelectedIndex];
  clientModal(`<h3>${kind}</h3><p><b>L&M Technic Energy</b></p><p>Nabywca: <b>${cliEsc(x.name)}</b><br>NIP: ${cliEsc(x.nip||'—')}<br>Miasto: ${cliEsc(x.city)}</p><button class="green" onclick="window.print()">DRUKUJ / PDF</button><button class="orange" onclick="closeClientModal()">ZAMKNIJ</button>`);
}


let clientFormEditIndex=-1;
let clientFormAddresses=[];
const CLIENT_REGISTRY_V14=[
  {name:'L&M Technic Energy Sp. z o.o.',nip:'657-298-45-12',regon:'367894512',city:'Kielce'},
  {name:'Eco Heat Polska Sp. z o.o.',nip:'526-283-17-45',regon:'385640123',city:'Kielce'},
  {name:'Biomasa Trade Sp. z o.o.',nip:'951-249-63-78',regon:'384756921',city:'Warszawa'},
  {name:'Green Pellet Solutions Sp. z o.o.',nip:'899-278-55-34',regon:'389125678',city:'Wrocław'},
  {name:'Firma Handlowa DREW-MAX Jan Kowalski',nip:'123-456-78-90',regon:'123456789',city:'Warszawa'}
];

function blankClientFormV14(){
  return {
    name:'',clientType:'Firma',nip:'',regon:'',industry:'Instalator',priority:'Wysoki',owner:'L&M Technic Energy',
    contact:'',role:'Kierownik zakupów',phone:'',phone2:'',email:'',web:'',
    country:'Polska',city:'',zip:'',street:'',province:'',invoiceNotes:'',
    credit:'50000',paymentDays:'14',paymentForm:'Przelew bankowy',discount:'0',documentType:'Faktura końcowa',active:true,
    lastContact:'2026-08-18',nextContact:'2026-08-25',channel:'Telefon',preferred:'E-mail',notes:''
  };
}
function formStateFromClientV14(x){
  const f=blankClientFormV14();
  if(!x)return f;
  const addr=(x.invoiceAddress||'').split(',').map(v=>v.trim());
  f.name=x.name||''; f.clientType=x.clientType||'Firma'; f.nip=x.nip||''; f.regon=x.regon||'';
  f.industry=x.type||'Instalator'; f.priority=x.priority||'Wysoki'; f.owner=x.owner||'L&M Technic Energy';
  f.contact=x.contact||''; f.role=x.role||'Kierownik zakupów'; f.phone=x.phone||''; f.phone2=x.phone2||'';
  f.email=x.email||''; f.web=x.web||''; f.city=x.city||''; f.notes=x.notes||'';
  f.credit=(x.credit||'50 000,00 PLN').replace(/[^\d,.-]/g,'').replace(/\s/g,'')||'50000';
  f.paymentDays=(x.payment||'14').match(/\d+/)?.[0]||'14';
  f.discount=x.discount||'0'; f.documentType=x.documentType||'Faktura końcowa';
  if(addr.length){ f.street=addr[0]||''; const z=(addr[1]||'').match(/(\d{2}-\d{3})\s*(.*)/); if(z){f.zip=z[1];f.city=z[2]||f.city} }
  return f;
}
function addressesFromClientV14(x){
  if(Array.isArray(x?.deliveryAddresses)&&x.deliveryAddresses.length) return JSON.parse(JSON.stringify(x.deliveryAddresses));
  if(Array.isArray(x?.locations)&&x.locations.length){
    return x.locations.map((z,i)=>({name:z[0],address:z[1],phone:z[2],contact:'',note:'',main:i===0}));
  }
  if(x?.delivery) return [{name:'Magazyn główny',address:x.delivery,phone:x.phone||'',contact:x.contact||'',note:'',main:true}];
  return [];
}
function optionV14(v,label,cur){return `<option value="${cliEsc(v)}" ${String(cur)===String(v)?'selected':''}>${cliEsc(label||v)}</option>`}

function renderClientFormNative(editMode){
  clientFormEditIndex=editMode?clientSelectedIndex:-1;
  const source=editMode?CLIENTS_V13[clientSelectedIndex]:null;
  const f=formStateFromClientV14(source);
  clientFormAddresses=addressesFromClientV14(source);

  const app=document.getElementById('app'); app.innerHTML='';
  const d=document.createElement('div'); d.className='cli-form-live'; d.id='cliFormV14';
  d.innerHTML=`
    <div class="cli-form-master-head" id="cliFormHeadV14">
      <img src="${CLIENT_FORM_ART}" alt="Nagłówek MASTER Europejskiego Kalkulatora Peletu">
      <button class="cli-form-head-back" id="cliFormBackV14">← BAZA KLIENTÓW</button>
    </div>
    <div class="cli-form-title">${editMode?'EDYTUJ KLIENTA':'NOWY KLIENT — FORMULARZ PEŁNY'}</div>
    <div class="cli-form-sub">Wersja żywa — wszystkie najważniejsze pola są czytelne, edytowalne i zapisywane lokalnie.</div>
    <div class="cli-form-body">
      <div class="cli-form-grid">

        <section class="cli-form-panel">
          <h3>1. Dane podstawowe klienta</h3>
          <div class="cli-form-row">
            <div class="cli-form-field"><label class="req">Typ klienta</label>
              <select id="cf_type" class="cli-form-select">${optionV14('Firma','Firma',f.clientType)}${optionV14('Osoba prywatna','Osoba prywatna',f.clientType)}</select>
            </div>
            <div class="cli-form-field"><label class="req">Priorytet</label>
              <select id="cf_priority" class="cli-form-select">${['Wysoki','Średni','Niski'].map(v=>optionV14(v,v,f.priority)).join('')}</select>
            </div>
          </div>
          <div class="cli-form-field"><label class="req">Nazwa firmy / klienta</label><input id="cf_name" class="cli-form-input" value="${cliEsc(f.name)}" placeholder="Wpisz pełną nazwę"></div>

          <div class="cli-form-tools">
            <input id="cf_registry_query" class="cli-form-input" placeholder="Nazwa / NIP — wyszukaj w bazie przykładowej">
            <button class="cli-form-btn" id="cf_search_registry">SZUKAJ</button>
            <button class="cli-form-btn green" id="cf_gus">GUS</button>
          </div>
          <div class="cli-form-hint">Przycisk GUS działa w trybie lokalnym/testowym. Po instalacji aplikacji można później podpiąć rzeczywiste źródło online bez zmiany wyglądu.</div>

          <div class="cli-form-row">
            <div class="cli-form-field"><label>NIP</label><input id="cf_nip" class="cli-form-input" value="${cliEsc(f.nip)}"></div>
            <div class="cli-form-field"><label>REGON</label><input id="cf_regon" class="cli-form-input" value="${cliEsc(f.regon)}"></div>
          </div>
          <div class="cli-form-row">
            <div class="cli-form-field"><label class="req">Branża / typ odbiorcy</label>
              <select id="cf_industry" class="cli-form-select">${['Instalator','Dystrybutor','Hurtownia','Detaliczny','Przemysł','Producent','Handlowy'].map(v=>optionV14(v,v,f.industry)).join('')}</select>
            </div>
            <div class="cli-form-field"><label>Opiekun handlowy</label><input id="cf_owner" class="cli-form-input" value="${cliEsc(f.owner)}"></div>
          </div>
        </section>

        <section class="cli-form-panel">
          <h3>2. Dane kontaktowe</h3>
          <div class="cli-form-row">
            <div class="cli-form-field"><label class="req">Osoba kontaktowa</label><input id="cf_contact" class="cli-form-input" value="${cliEsc(f.contact)}"></div>
            <div class="cli-form-field"><label class="req">Stanowisko</label>
              <select id="cf_role" class="cli-form-select">${['Właściciel / właścicielka','Prezes / zarząd','Dyrektor handlowy','Kierownik zakupów','Specjalista ds. zakupów','Główny logistyk','Kierownik logistyki','Magazynier / koordynator dostaw','Inna osoba'].map(v=>optionV14(v,v,f.role)).join('')}</select>
            </div>
          </div>
          <div class="cli-form-row">
            <div class="cli-form-field"><label class="req">Telefon główny</label><input id="cf_phone" class="cli-form-input" value="${cliEsc(f.phone)}" placeholder="+48 ..."></div>
            <div class="cli-form-field"><label>Telefon dodatkowy</label><input id="cf_phone2" class="cli-form-input" value="${cliEsc(f.phone2)}"></div>
          </div>
          <div class="cli-form-field"><label class="req">E-mail</label><input id="cf_email" type="email" class="cli-form-input" value="${cliEsc(f.email)}"></div>
          <div class="cli-form-field"><label>WWW</label><input id="cf_web" class="cli-form-input" value="${cliEsc(f.web)}" placeholder="www..."></div>
        </section>

        <section class="cli-form-panel">
          <h3>3. Adres siedziby / faktury</h3>
          <div class="cli-form-row">
            <div class="cli-form-field"><label class="req">Kraj</label><input id="cf_country" class="cli-form-input" value="${cliEsc(f.country)}"></div>
            <div class="cli-form-field"><label class="req">Miasto</label><input id="cf_city" class="cli-form-input" value="${cliEsc(f.city)}"></div>
          </div>
          <div class="cli-form-row">
            <div class="cli-form-field"><label class="req">Kod pocztowy</label><input id="cf_zip" class="cli-form-input" value="${cliEsc(f.zip)}" placeholder="00-000"></div>
            <div class="cli-form-field"><label class="req">Ulica i numer</label><input id="cf_street" class="cli-form-input" value="${cliEsc(f.street)}"></div>
          </div>
          <div class="cli-form-row">
            <div class="cli-form-field"><label>Województwo</label><input id="cf_province" class="cli-form-input" value="${cliEsc(f.province)}"></div>
            <div class="cli-form-field"><label>Uwagi do faktury</label><textarea id="cf_invoice_notes" class="cli-form-textarea">${cliEsc(f.invoiceNotes)}</textarea></div>
          </div>
        </section>

        <section class="cli-form-panel">
          <h3>4. Adresy dostawy</h3>
          <div id="cf_addresses" class="cli-address-list"></div>
          <button class="cli-form-btn green" id="cf_add_address" style="width:100%;margin-top:9px">＋ DODAJ NOWY ADRES DOSTAWY</button>
        </section>

        <section class="cli-form-panel">
          <h3>5. Warunki handlowe</h3>
          <div class="cli-form-row">
            <div class="cli-form-field"><label>Limit kredytowy [PLN]</label><input id="cf_credit" type="number" class="cli-form-input" value="${cliEsc(f.credit)}"></div>
            <div class="cli-form-field"><label class="req">Termin płatności</label>
              <select id="cf_payment_days" class="cli-form-select">${['7','14','21','30','45','60'].map(v=>optionV14(v,v+' dni',f.paymentDays)).join('')}</select>
            </div>
          </div>
          <div class="cli-form-row">
            <div class="cli-form-field"><label class="req">Forma płatności</label>
              <select id="cf_payment_form" class="cli-form-select">${['Przelew bankowy','Gotówka','Karta','Przedpłata'].map(v=>optionV14(v,v,f.paymentForm)).join('')}</select>
            </div>
            <div class="cli-form-field"><label>Rabat [%]</label><input id="cf_discount" type="number" step="0.1" class="cli-form-input" value="${cliEsc(f.discount)}"></div>
          </div>
          <div class="cli-form-row">
            <div class="cli-form-field"><label class="req">Domyślny dokument</label>
              <select id="cf_document" class="cli-form-select">${['Faktura końcowa','Proforma','Paragon'].map(v=>optionV14(v,v,f.documentType)).join('')}</select>
            </div>
            <div class="cli-form-field"><label>Klient aktywny</label><div class="cli-form-switch"><input id="cf_active" type="checkbox" ${f.active!==false?'checked':''}><span>Tak — klient aktywny</span></div></div>
          </div>
        </section>

        <section class="cli-form-panel">
          <h3>6. CRM / Notatki</h3>
          <div class="cli-form-row">
            <div class="cli-form-field"><label>Ostatni kontakt</label><input id="cf_last" type="date" class="cli-form-input" value="${cliEsc(f.lastContact)}"></div>
            <div class="cli-form-field"><label>Następny kontakt</label><input id="cf_next" type="date" class="cli-form-input" value="${cliEsc(f.nextContact)}"></div>
          </div>
          <div class="cli-form-row">
            <div class="cli-form-field"><label>Kanał kontaktu</label>
              <select id="cf_channel" class="cli-form-select">${['Telefon','E-mail','Spotkanie','WhatsApp','SMS'].map(v=>optionV14(v,v,f.channel)).join('')}</select>
            </div>
            <div class="cli-form-field"><label>Preferowany kontakt</label>
              <select id="cf_preferred" class="cli-form-select">${['E-mail','Telefon','WhatsApp','SMS'].map(v=>optionV14(v,v,f.preferred)).join('')}</select>
            </div>
          </div>
          <div class="cli-form-field"><label>Notatka handlowa</label><textarea id="cf_notes" class="cli-form-textarea">${cliEsc(f.notes)}</textarea></div>
        </section>

      </div>

      <div class="cli-form-bottom">
        <button class="cli-form-btn red" id="cf_cancel">✕ ANULUJ</button>
        <button class="cli-form-btn green" id="cf_save">💾 ZAPISZ KLIENTA</button>
        <button class="cli-form-btn orange" id="cf_bottom_address">＋ DODAJ ADRES</button>
        <button class="cli-form-btn blue" id="cf_documents">📁 DOKUMENTY</button>
        <button class="cli-form-btn purple" id="cf_invoice">📄 GENERUJ FAKTURĘ</button>
      </div>
    </div>`;
  app.appendChild(d);

  // Hotspoty górnego nagłówka MASTER — jak w ekranie listy.
  const head=d.querySelector('#cliFormHeadV14');
  const xs=[.006,.081,.157,.232,.307,.382,.457,.532,.607,.682,.757,.832,.907];
  const nav=[['home'],['offer'],['calculator'],['transport'],['noop'],['noop'],['suppliers'],['clients'],['clients'],['noop'],['noop'],['noop'],['noop']];
  nav.forEach((a,i)=>{
    const b=document.createElement('button'); b.className='cli-hot';
    b.style.left=(xs[i]*100)+'%'; b.style.top='58%'; b.style.width='7%'; b.style.height='34%';
    b.onclick=()=>a[0]==='noop'?toast('Moduł jeszcze nieaktywny.'):go(a[0]); head.appendChild(b);
  });

  d.querySelector('#cliFormBackV14').onclick=renderClientsNative;
  d.querySelector('#cf_cancel').onclick=renderClientsNative;
  d.querySelector('#cf_save').onclick=saveClientFormV14;
  d.querySelector('#cf_add_address').onclick=()=>openAddressEditorV14(-1);
  d.querySelector('#cf_bottom_address').onclick=()=>openAddressEditorV14(-1);
  d.querySelector('#cf_documents').onclick=clientDocuments;
  d.querySelector('#cf_invoice').onclick=generateInvoiceFromFormV14;
  d.querySelector('#cf_search_registry').onclick=searchRegistryV14;
  d.querySelector('#cf_gus').onclick=gusLocalV14;
  renderFormAddressesV14();
  window.scrollTo({top:0,left:0,behavior:'auto'});
}
function cfVal(id){return document.getElementById(id)?.value?.trim()||''}
function collectClientFormV14(){
  return {
    name:cfVal('cf_name'), clientType:cfVal('cf_type'), nip:cfVal('cf_nip'), regon:cfVal('cf_regon'),
    industry:cfVal('cf_industry'), priority:cfVal('cf_priority'), owner:cfVal('cf_owner'),
    contact:cfVal('cf_contact'), role:cfVal('cf_role'), phone:cfVal('cf_phone'), phone2:cfVal('cf_phone2'),
    email:cfVal('cf_email'), web:cfVal('cf_web'), country:cfVal('cf_country'), city:cfVal('cf_city'),
    zip:cfVal('cf_zip'), street:cfVal('cf_street'), province:cfVal('cf_province'), invoiceNotes:cfVal('cf_invoice_notes'),
    credit:cfVal('cf_credit'), paymentDays:cfVal('cf_payment_days'), paymentForm:cfVal('cf_payment_form'),
    discount:cfVal('cf_discount'), documentType:cfVal('cf_document'), active:!!document.getElementById('cf_active')?.checked,
    lastContact:cfVal('cf_last'), nextContact:cfVal('cf_next'), channel:cfVal('cf_channel'), preferred:cfVal('cf_preferred'), notes:cfVal('cf_notes')
  };
}
function saveClientFormV14(){
  const f=collectClientFormV14();
  if(!f.name){toast('Wpisz nazwę klienta.');document.getElementById('cf_name')?.focus();return}
  if(!f.city){toast('Wpisz miasto klienta.');document.getElementById('cf_city')?.focus();return}
  const today=new Date().toLocaleDateString('pl-PL',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\./g,'.');
  const main=clientFormAddresses.find(a=>a.main)||clientFormAddresses[0];
  const obj={
    ...(clientFormEditIndex>=0?CLIENTS_V13[clientFormEditIndex]:{}),
    name:f.name,city:f.city,type:f.industry,date:today,status:f.active?'ZATWIERDZONY':'DO SPRAWDZENIA',
    color:f.active?'green':'orange',clientType:f.clientType,nip:f.nip,regon:f.regon,priority:f.priority,owner:f.owner,
    contact:f.contact,role:f.role,phone:f.phone,phone2:f.phone2,email:f.email,web:f.web,
    invoiceAddress:[f.street,[f.zip,f.city].filter(Boolean).join(' '),f.country].filter(Boolean).join(', '),
    invoiceNotes:f.invoiceNotes,delivery:main?.address||'',deliveryAddresses:JSON.parse(JSON.stringify(clientFormAddresses)),
    locations:clientFormAddresses.map(a=>[a.name,a.address,a.phone||'']),payment:`${f.paymentDays} dni / ${f.paymentForm}`,
    credit:(Number(f.credit||0)).toLocaleString('pl-PL',{minimumFractionDigits:2,maximumFractionDigits:2})+' PLN',
    discount:f.discount,documentType:f.documentType,active:f.active,lastContact:f.lastContact,nextContact:f.nextContact,
    channel:f.channel,preferred:f.preferred,notes:f.notes
  };
  if(clientFormEditIndex>=0){
    CLIENTS_V13[clientFormEditIndex]=obj; clientSelectedIndex=clientFormEditIndex;
  }else{
    CLIENTS_V13.push(obj); clientSelectedIndex=CLIENTS_V13.length-1;
  }
  persistClientsV13();
  try{localStorage.setItem('lm_client_selected_v13',String(clientSelectedIndex))}catch(e){}
  toast(clientFormEditIndex>=0?'KLIENT ZAKTUALIZOWANY':'KLIENT DODANY');
  renderClientsNative();
}
function renderFormAddressesV14(){
  const box=document.getElementById('cf_addresses');if(!box)return;
  if(!clientFormAddresses.length){
    box.innerHTML='<div class="cli-form-hint" style="padding:10px;border:1px dashed #40502d;border-radius:7px">Brak adresów dostawy. Naciśnij „Dodaj nowy adres dostawy”.</div>';return;
  }
  box.innerHTML=clientFormAddresses.map((a,i)=>`<div class="cli-address-card ${a.main?'main':''}">
    <div><div class="cli-address-title">${cliEsc(a.name||('Adres dostawy '+(i+1)))} ${a.main?'<span class="cli-form-badge">GŁÓWNY</span>':''}</div>
    <div class="cli-address-meta">${cliEsc(a.address||'')}<br>${a.contact?'Kontakt: '+cliEsc(a.contact)+' • ':''}${cliEsc(a.phone||'')}${a.note?'<br>Notatka: '+cliEsc(a.note):''}</div></div>
    <div class="cli-address-actions">
      <button class="cli-form-btn orange" onclick="openAddressEditorV14(${i})">EDYTUJ</button>
      <button class="cli-form-btn red" onclick="deleteAddressV14(${i})">USUŃ</button>
      ${a.main?'':`<button class="cli-form-btn green" onclick="setMainAddressV14(${i})">USTAW GŁÓWNY</button>`}
    </div></div>`).join('');
}
function openAddressEditorV14(i){
  const a=i>=0?clientFormAddresses[i]:{name:'',address:'',contact:'',phone:'',note:'',main:clientFormAddresses.length===0};
  clientModal(`<h3>${i>=0?'EDYTUJ ADRES DOSTAWY':'NOWY ADRES DOSTAWY'}</h3>
    <input id="ca_name" value="${cliEsc(a.name||'')}" placeholder="Nazwa lokalizacji, np. Magazyn główny">
    <input id="ca_address" value="${cliEsc(a.address||'')}" placeholder="Pełny adres">
    <input id="ca_contact" value="${cliEsc(a.contact||'')}" placeholder="Osoba kontaktowa">
    <input id="ca_phone" value="${cliEsc(a.phone||'')}" placeholder="Telefon">
    <textarea id="ca_note" rows="3" placeholder="Notatka dla kierowcy">${cliEsc(a.note||'')}</textarea>
    <label style="display:flex;gap:8px;align-items:center;margin:8px 0"><input id="ca_main" type="checkbox" style="width:22px;min-height:22px" ${a.main?'checked':''}> Adres główny</label>
    <button class="green" id="ca_save">ZAPISZ ADRES</button><button onclick="closeClientModal()">ANULUJ</button>`);
  document.getElementById('ca_save').onclick=()=>{
    const n={name:cfVal('ca_name'),address:cfVal('ca_address'),contact:cfVal('ca_contact'),phone:cfVal('ca_phone'),note:cfVal('ca_note'),main:!!document.getElementById('ca_main')?.checked};
    if(!n.name||!n.address){toast('Podaj nazwę i adres.');return}
    if(n.main) clientFormAddresses.forEach(x=>x.main=false);
    if(i>=0) clientFormAddresses[i]=n; else clientFormAddresses.push(n);
    if(!clientFormAddresses.some(x=>x.main)&&clientFormAddresses[0])clientFormAddresses[0].main=true;
    closeClientModal();renderFormAddressesV14();
  };
}
function deleteAddressV14(i){
  clientFormAddresses.splice(i,1);
  if(!clientFormAddresses.some(x=>x.main)&&clientFormAddresses[0])clientFormAddresses[0].main=true;
  renderFormAddressesV14();
}
function setMainAddressV14(i){clientFormAddresses.forEach((x,j)=>x.main=j===i);renderFormAddressesV14()}
function searchRegistryV14(){
  const q=cfVal('cf_registry_query').toLowerCase();
  const arr=CLIENT_REGISTRY_V14.filter(x=>!q||[x.name,x.nip,x.regon,x.city].join(' ').toLowerCase().includes(q));
  clientModal(`<h3>WYNIKI WYSZUKIWANIA</h3><div class="cli-registry-list">${arr.length?arr.map((x,i)=>`<button class="cli-registry-item" data-r="${CLIENT_REGISTRY_V14.indexOf(x)}"><b>${cliEsc(x.name)}</b><br>NIP: ${cliEsc(x.nip)} • REGON: ${cliEsc(x.regon)} • ${cliEsc(x.city)}</button>`).join(''):'Brak wyników.'}</div><button onclick="closeClientModal()">ZAMKNIJ</button>`);
  document.querySelectorAll('.cli-registry-item').forEach(b=>b.onclick=()=>{fillRegistryV14(Number(b.dataset.r));closeClientModal()});
}
function fillRegistryV14(i){
  const x=CLIENT_REGISTRY_V14[i];if(!x)return;
  document.getElementById('cf_name').value=x.name;document.getElementById('cf_nip').value=x.nip;
  document.getElementById('cf_regon').value=x.regon;document.getElementById('cf_city').value=x.city;
  toast('DANE FIRMY UZUPEŁNIONE');
}
function gusLocalV14(){
  const nip=cfVal('cf_nip').replace(/\D/g,'');
  const x=CLIENT_REGISTRY_V14.find(r=>r.nip.replace(/\D/g,'')===nip);
  if(x){fillRegistryV14(CLIENT_REGISTRY_V14.indexOf(x));return}
  clientModal(`<h3>GUS — TRYB TESTOWY</h3><p>W tej wersji plik działa lokalnie z telefonu. Rzeczywiste zapytanie do GUS wymaga połączenia aplikacji z usługą online. Wygląd i przycisk są już gotowe do późniejszego podpięcia.</p><button class="green" onclick="closeClientModal()">OK</button>`);
}
function generateInvoiceFromFormV14(){
  const f=collectClientFormV14();
  clientModal(`<h3>PRÓBNA FAKTURA — DANE KLIENTA</h3>
    <p><b>Nabywca:</b> ${cliEsc(f.name||'—')}<br><b>NIP:</b> ${cliEsc(f.nip||'—')}<br><b>Adres:</b> ${cliEsc([f.street,[f.zip,f.city].filter(Boolean).join(' '),f.country].filter(Boolean).join(', ')||'—')}</p>
    <p>To jest podgląd danych do późniejszego modułu faktury. Możesz już sprawdzić, czy dane klienta przechodzą prawidłowo.</p>
    <button class="green" onclick="window.print()">DRUKUJ / PDF</button><button onclick="closeClientModal()">ZAMKNIJ</button>`);
}

// Owijamy istniejące go() V12 po module DOSTAWCÓW.
const goV12WithSuppliers=go;
go=function(name){
  if(name==='clients') return renderClientsNative();
  return goV12WithSuppliers(name);
};


/* ===== V15: moduły funkcjonalne ===== */

const CALC_V15_DEFAULT={
  purchase:1250,sell:1580,distance:535,rate:4.25,work:42,bags:37.67,pallet:25,other:0,minMargin:3
};
function getCalcV15(){
  try{
    const x=JSON.parse(localStorage.getItem('lm_calc_v15')||'null');
    return {...CALC_V15_DEFAULT,...(x||{})};
  }catch(e){return {...CALC_V15_DEFAULT}}
}
function saveCalcV15(x){try{localStorage.setItem('lm_calc_v15',JSON.stringify(x))}catch(e){}}
function numV15(id,fallback=0){
  const v=String(document.getElementById(id)?.value??'').replace(',','.');
  const n=Number(v);return Number.isFinite(n)?n:fallback;
}
function moneyV15(n){return Number(n).toLocaleString('pl-PL',{minimumFractionDigits:2,maximumFractionDigits:2})+' zł'}
function pctV15(n){return Number(n).toLocaleString('pl-PL',{minimumFractionDigits:2,maximumFractionDigits:2})+'%'}

function renderCalculatorV15(){
  const c=getCalcV15();
  const app=document.getElementById('app');app.innerHTML='';
  const d=document.createElement('div');d.className='v15-screen';
  const qtyOpts=Array.from({length:10},(_,i)=>{const t=(i+1)*26;return `<option value="${t}" ${state.qty===t?'selected':''}>${t} t — ${i+1} samoch${i===0?'ód':i<4?'ody':'odów'}</option>`}).join('');
  d.innerHTML=`
    <div class="v15-head"><div class="v15-logo">L&M<span>TECHNIC ENERGY</span></div>
      <div class="v15-title">KALKULATOR OPŁACALNOŚCI<small>EUROPEJSKI KALKULATOR PELETU 1.2 PREMIUM</small></div>
      <button class="v15-back" onclick="go('home')">← PULPIT</button></div>
    <div class="v15-body">
      <div class="v15-grid2">
        <section class="v15-panel">
          <h3>ZAKUP I SPRZEDAŻ</h3>
          <div class="v15-row">
            <div class="v15-field"><label>Cena zakupu netto [PLN/t]</label><input id="vc_purchase" class="v15-input" type="number" step="0.01" value="${c.purchase}"></div>
            <div class="v15-field"><label>Cena sprzedaży netto [PLN/t]</label><input id="vc_sell" class="v15-input" type="number" step="0.01" value="${c.sell}"></div>
          </div>
          <div class="v15-field"><label>Ilość / liczba samochodów</label><select id="vc_qty" class="v15-select">${qtyOpts}</select></div>
          <div class="v15-row">
            <div class="v15-field"><label>Odległość w jedną stronę [km]</label><input id="vc_distance" class="v15-input" type="number" step="1" value="${c.distance}"></div>
            <div class="v15-field"><label>Stawka transportu [PLN/km]</label><input id="vc_rate" class="v15-input" type="number" step="0.01" value="${c.rate}"></div>
          </div>
        </section>
        <section class="v15-panel">
          <h3>KOSZTY DODATKOWE / t</h3>
          <div class="v15-row">
            <div class="v15-field"><label>Workowanie</label><input id="vc_work" class="v15-input" type="number" step="0.01" value="${c.work}"></div>
            <div class="v15-field"><label>Worki / opakowanie</label><input id="vc_bags" class="v15-input" type="number" step="0.01" value="${c.bags}"></div>
          </div>
          <div class="v15-row">
            <div class="v15-field"><label>Paleta</label><input id="vc_pallet" class="v15-input" type="number" step="0.01" value="${c.pallet}"></div>
            <div class="v15-field"><label>Inne koszty</label><input id="vc_other" class="v15-input" type="number" step="0.01" value="${c.other}"></div>
          </div>
          <div class="v15-field"><label>Minimalna marża [%]</label><input id="vc_minmargin" class="v15-input" type="number" step="0.1" value="${c.minMargin}"></div>
        </section>
        <section class="v15-panel full">
          <h3>WYNIK</h3><div id="vc_result"></div>
          <div class="v15-actions">
            <button class="v15-btn green" id="vc_calc">✓ OBLICZ I ZAPISZ</button>
            <button class="v15-btn orange" onclick="go('transport')">TRANSPORT</button>
            <button class="v15-btn blue" onclick="go('offer')">NOWA OFERTA</button>
          </div>
          <div id="vc_saved_status" class="v15-status" style="min-height:24px;margin-top:9px;font-size:15px;font-weight:800;color:#9be52b"></div>
        </section>
      </div>
    </div>`;
  app.appendChild(d);
  {
    const b=document.getElementById('vc_calc');
    const run=(ev)=>{ if(ev){ev.preventDefault();ev.stopPropagation()} calcCalculatorV15(true,true); };
    b.onclick=run;
    b.addEventListener('touchend',run,{passive:false});
  }
  ['vc_purchase','vc_sell','vc_qty','vc_distance','vc_rate','vc_work','vc_bags','vc_pallet','vc_other','vc_minmargin'].forEach(id=>{
    document.getElementById(id)?.addEventListener('change',calcCalculatorV15);
  });
  calcCalculatorV15(false);
  window.scrollTo({top:0,left:0,behavior:'auto'});
}
function calcCalculatorV15(showToast=true,saveRecord=false){
  const qty=numV15('vc_qty',state.qty)||26;
  const x={
    purchase:numV15('vc_purchase',1250),sell:numV15('vc_sell',1580),distance:numV15('vc_distance',535),
    rate:numV15('vc_rate',4.25),work:numV15('vc_work',42),bags:numV15('vc_bags',37.67),
    pallet:numV15('vc_pallet',25),other:numV15('vc_other',0),minMargin:numV15('vc_minmargin',3)
  };
  state.qty=qty;saveQty();saveCalcV15(x);
  const trucks=qty/26;
  const transportTruck=x.distance*2*x.rate;
  const transportTotal=transportTruck*trucks;
  const transportT=transportTotal/qty;
  const extras=x.work+x.bags+x.pallet+x.other;
  const full=x.purchase+transportT+extras;
  const margin=x.sell-full;
  const marginPct=x.sell?margin/x.sell*100:0;
  const totalMargin=margin*qty;
  const ok=marginPct>=x.minMargin;
  const r=document.getElementById('vc_result'); if(!r)return;
  r.innerHTML=`<div class="v15-kpis">
    <div class="v15-kpi"><span>Koszt transportu / samochód</span><b>${moneyV15(transportTruck)}</b></div>
    <div class="v15-kpi"><span>Koszt transportu / t</span><b>${moneyV15(transportT)}</b></div>
    <div class="v15-kpi"><span>Koszt pełny / t</span><b>${moneyV15(full)}</b></div>
    <div class="v15-kpi"><span>Marża netto / t</span><b class="green">${moneyV15(margin)}</b></div>
    <div class="v15-kpi"><span>Marża %</span><b class="green">${pctV15(marginPct)}</b></div>
    <div class="v15-kpi"><span>Marża całej partii</span><b class="green">${moneyV15(totalMargin)}</b></div>
  </div><div class="v15-decision" style="${ok?'':'border-color:#b33529;background:#2b0806;color:#ff6a5e'}">${ok?'✓ OPŁACA SIĘ — POWYŻEJ MINIMUM':'✕ PONIŻEJ MINIMALNEJ MARŻY'}</div>`;
  if(saveRecord){
    try{
      const hist=JSON.parse(localStorage.getItem('lm_calc_history_v16')||'[]');
      hist.unshift({
        savedAt:new Date().toISOString(),qty,purchase:x.purchase,sell:x.sell,distance:x.distance,rate:x.rate,
        full,margin,marginPct,totalMargin,transportT,transportTruck
      });
      localStorage.setItem('lm_calc_history_v16',JSON.stringify(hist.slice(0,100)));
    }catch(e){}
    const st=document.getElementById('vc_saved_status');
    if(st)st.textContent='✓ OBLICZONO I ZAPISANO — '+new Date().toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});
  }
  if(showToast)toast(saveRecord?'OBLICZONO I ZAPISANO':'Kalkulator przeliczony.');
}

/* --- WALUTY --- */
const CURRENCY_CODES_V15=['PLN','EUR','CZK','CHF','USD','GBP','HUF'];
const CURRENCY_FLAGS_V16={PLN:'🇵🇱',EUR:'🇪🇺',CZK:'🇨🇿',CHF:'🇨🇭',USD:'🇺🇸',GBP:'🇬🇧',HUF:'🇭🇺'};
function currencyLabelV16(code){return (CURRENCY_FLAGS_V16[code]||'')+'  '+code}
function getRatesV15(){
  try{
    const s=JSON.parse(localStorage.getItem('lm_rates_v15')||'null');
    if(s&&s.rates)return s;
  }catch(e){}
  return {rates:{PLN:1,EUR:null,CZK:null,CHF:null,USD:null,GBP:null,HUF:null},updated:null,source:'Brak — pobierz NBP'};
}
function saveRatesV15(x){try{localStorage.setItem('lm_rates_v15',JSON.stringify(x))}catch(e){}}
function renderCurrenciesV15(){
  const data=getRatesV15();
  const app=document.getElementById('app');app.innerHTML='';
  const d=document.createElement('div');d.className='v15-screen';
  d.innerHTML=`
    <div class="v15-head"><div class="v15-logo">L&M<span>TECHNIC ENERGY</span></div>
      <div class="v15-title">WALUTY<small>kursy NBP + przelicznik sprzedaży i zakupu</small></div>
      <button class="v15-back" onclick="go('home')">← PULPIT</button></div>
    <div class="v15-body"><div class="v15-grid2">
      <section class="v15-panel">
        <h3>PRZELICZNIK</h3>
        <div class="v15-field"><label>Kwota</label><input id="vw_amount" class="v15-input" type="number" step="0.01" value="1000"></div>
        <div class="v15-row">
          <div class="v15-field"><label>Z waluty</label><select id="vw_from" class="v15-select">${CURRENCY_CODES_V15.map(x=>`<option value="${x}" ${x==='EUR'?'selected':''}>${currencyLabelV16(x)}</option>`).join('')}</select></div>
          <div class="v15-field"><label>Na walutę</label><select id="vw_to" class="v15-select">${CURRENCY_CODES_V15.map(x=>`<option value="${x}" ${x==='PLN'?'selected':''}>${currencyLabelV16(x)}</option>`).join('')}</select></div>
        </div>
        <div id="vw_result" class="v15-result">Wpisz kwotę i pobierz kursy NBP.</div>
        <div class="v15-actions">
          <button class="v15-btn green" id="vw_convert">PRZELICZ</button>
          <button class="v15-btn blue" id="vw_nbp">POBIERZ KURSY NBP</button>
          <button class="v15-btn orange" id="vw_save">ZAPISZ RĘCZNIE</button>
        </div>
        <div id="vw_status" class="v15-status"></div>
      </section>
      <section class="v15-panel">
        <h3>KURSY — PLN ZA 1 JEDNOSTKĘ</h3>
        <table class="v15-table"><thead><tr><th>Waluta</th><th>Kurs</th></tr></thead><tbody>
          ${CURRENCY_CODES_V15.filter(x=>x!=='PLN').map(code=>`<tr><td><b style="display:flex;align-items:center;gap:10px;font-size:17px"><span style="font-size:27px;line-height:1">${CURRENCY_FLAGS_V16[code]||''}</span><span>${code}</span></b></td><td><input class="v15-rate-input" id="rate_${code}" inputmode="decimal" value="${data.rates[code]??''}" placeholder="brak"></td></tr>`).join('')}
        </tbody></table>
        <div class="v15-note">Źródło: <span id="vw_source">${data.source||'—'}</span><br>Aktualizacja: <span id="vw_updated">${data.updated||'—'}</span>.</div>
      </section>
    </div></div>`;
  app.appendChild(d);
  document.getElementById('vw_convert').onclick=convertCurrencyV15;
  document.getElementById('vw_nbp').onclick=fetchNbpRatesV15;
  document.getElementById('vw_save').onclick=saveManualRatesV15;
  ['vw_amount','vw_from','vw_to'].forEach(id=>document.getElementById(id)?.addEventListener('change',convertCurrencyV15));
  convertCurrencyV15();
  window.scrollTo({top:0,left:0,behavior:'auto'});
}
function ratesFromInputsV15(){
  const r={PLN:1};
  CURRENCY_CODES_V15.filter(x=>x!=='PLN').forEach(code=>{
    const el=document.getElementById('rate_'+code);
    const n=Number(String(el?.value||'').replace(',','.'));r[code]=Number.isFinite(n)&&n>0?n:null;
  });return r;
}
function saveManualRatesV15(){
  const rates=ratesFromInputsV15();
  const data={rates,updated:new Date().toLocaleString('pl-PL'),source:'Kursy ręczne / lokalne'};
  saveRatesV15(data);
  document.getElementById('vw_source').textContent=data.source;
  document.getElementById('vw_updated').textContent=data.updated;
  convertCurrencyV15();toast('Kursy walut zapisane.');
}
async function fetchNbpRatesV15(){
  const st=document.getElementById('vw_status');st.textContent='Pobieram bieżące kursy z NBP…';
  try{
    const res=await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json',{cache:'no-store'});
    if(!res.ok)throw new Error('HTTP '+res.status);
    const j=await res.json();const table=j?.[0];if(!table?.rates)throw new Error('Brak danych');
    const current=getRatesV15().rates||{PLN:1};current.PLN=1;
    table.rates.forEach(x=>{if(CURRENCY_CODES_V15.includes(x.code))current[x.code]=Number(x.mid)});
    const data={rates:current,updated:table.effectiveDate||new Date().toLocaleDateString('pl-PL'),source:'Narodowy Bank Polski — tabela A'};
    saveRatesV15(data);
    CURRENCY_CODES_V15.filter(x=>x!=='PLN').forEach(code=>{const el=document.getElementById('rate_'+code);if(el&&data.rates[code])el.value=data.rates[code]});
    document.getElementById('vw_source').textContent=data.source;
    document.getElementById('vw_updated').textContent=data.updated;
    st.textContent='Kursy NBP pobrane poprawnie.';convertCurrencyV15();toast('Kursy NBP zaktualizowane.');
  }catch(e){
    st.textContent='Nie udało się pobrać NBP w tym trybie pliku. Możesz wpisać kursy ręcznie i zapisać je lokalnie.';
    toast('NBP niedostępne — użyj kursów ręcznych.');
  }
}
function convertCurrencyV15(){
  const rates=ratesFromInputsV15();
  const amount=numV15('vw_amount',0);
  const from=document.getElementById('vw_from')?.value||'EUR';
  const to=document.getElementById('vw_to')?.value||'PLN';
  const box=document.getElementById('vw_result');if(!box)return;
  if(!rates[from]||!rates[to]){
    box.innerHTML='Brakuje kursu dla <b>'+from+' / '+to+'</b>.<br><span style="font-size:12px;color:#9ba69f">Pobierz NBP albo wpisz kurs ręcznie.</span>';return;
  }
  const pln=amount*rates[from];const target=pln/rates[to];
  box.innerHTML=`${CURRENCY_FLAGS_V16[from]||''} ${Number(amount).toLocaleString('pl-PL',{maximumFractionDigits:2})} ${from}<b>${CURRENCY_FLAGS_V16[to]||''} ${Number(target).toLocaleString('pl-PL',{minimumFractionDigits:2,maximumFractionDigits:4})} ${to}</b>`;
}

/* --- MAPA / GOOGLE MAPS --- */
let mapDestV15=null;
function clientMapListV15(){
  return (CLIENTS_V13||[]).map((x,i)=>{
    const main=(x.deliveryAddresses||[]).find(a=>a.main)||(x.deliveryAddresses||[])[0];
    const addr=main?.address||x.delivery||x.invoiceAddress||[x.city,'Polska'].filter(Boolean).join(', ');
    return {id:'c'+i,name:x.name||('Klient '+(i+1)),address:addr,kind:'KLIENT',phone:x.phone||''};
  }).filter(x=>x.address);
}
function supplierMapListV15(){
  let a=[];try{a=getCustomSuppliers()||[]}catch(e){}
  return a.map((x,i)=>({id:'s'+i,name:x.name||('Firma '+(i+1)),address:[x.address,[x.postal,x.city].filter(Boolean).join(' '),x.country||'Polska'].filter(Boolean).join(', '),kind:'FIRMA / DOSTAWCA',phone:x.phone||x.mobile||''})).filter(x=>x.address);
}
function warehouseMapListV15(){
  const out=[];
  (CLIENTS_V13||[]).forEach((x,ci)=>{
    if(Array.isArray(x.deliveryAddresses)&&x.deliveryAddresses.length){
      x.deliveryAddresses.forEach((a,ai)=>{if(a.address)out.push({id:`w${ci}_${ai}`,name:(a.name||'Magazyn')+' — '+x.name,address:a.address,kind:'MAGAZYN / LOKALIZACJA',phone:a.phone||x.phone||''})});
    }else if(Array.isArray(x.locations)&&x.locations.length){
      x.locations.forEach((a,ai)=>{if(a?.[1])out.push({id:`w${ci}_${ai}`,name:(a[0]||'Magazyn')+' — '+x.name,address:a[1],kind:'MAGAZYN / LOKALIZACJA',phone:a[2]||x.phone||''})});
    }else if(x.delivery){
      out.push({id:`w${ci}_0`,name:'Adres dostawy — '+x.name,address:x.delivery,kind:'MAGAZYN / LOKALIZACJA',phone:x.phone||''});
    }
  });
  return out;
}
function optsMapV15(list){return '<option value="">— wybierz —</option>'+list.map((x,i)=>`<option value="${i}">${esc(x.name)}</option>`).join('')}
function v26MapEmbedUrl(origin,dest){
  const o=String(origin||'').trim(),d=String(dest||'').trim();
  if(o&&d)return 'https://maps.google.com/maps?saddr='+encodeURIComponent(o)+'&daddr='+encodeURIComponent(d)+'&output=embed';
  if(d)return 'https://maps.google.com/maps?q='+encodeURIComponent(d)+'&output=embed';
  return 'https://maps.google.com/maps?q=Polska&output=embed';
}
function updateEmbeddedMapV26(){
  const frame=document.getElementById('vm_iframe');if(!frame)return;
  const origin=(document.getElementById('vm_origin')?.value||'').trim();
  const dest=mapDestV15?.address||'';
  frame.src=v26MapEmbedUrl(origin,dest);
  const st=document.getElementById('vm_map_status');if(st)st.textContent=dest?('Trasa na mapie: '+(origin||'start nieokreślony')+' → '+dest):'Wybierz cel z bazy lub wpisz adres. Mapa jest już aktywna.';
  try{localStorage.setItem('lm_map_origin_v26',origin)}catch(e){}
}
function useMyLocationV26(){
  if(!navigator.geolocation){toast('Lokalizacja nie jest dostępna w tym trybie.');return}
  const b=document.getElementById('vm_locbtn');if(b)b.textContent='USTALAM…';
  navigator.geolocation.getCurrentPosition(p=>{
    const v=p.coords.latitude.toFixed(6)+','+p.coords.longitude.toFixed(6);
    document.getElementById('vm_origin').value=v;updateEmbeddedMapV26();if(b)b.textContent='MOJA LOKALIZACJA';toast('Ustawiono bieżącą lokalizację jako start.');
  },()=>{if(b)b.textContent='MOJA LOKALIZACJA';toast('Telefon nie udostępnił lokalizacji dla tego pliku.');},{enableHighAccuracy:true,timeout:7000});
}
function openRouteGoogleV26(){
  if(!mapDestV15?.address){toast('Najpierw wybierz cel dojazdu.');return}
  const origin=(document.getElementById('vm_origin')?.value||'').trim();
  const dest=mapDestV15.address;
  const url='https://www.google.com/maps/dir/?api=1'+(origin?'&origin='+encodeURIComponent(origin):'')+'&destination='+encodeURIComponent(dest)+'&travelmode=driving';
  try{const w=window.open(url,'_blank');if(!w)location.href=url}catch(e){location.href=url}
}
function renderMapV15(){
  const clients=clientMapListV15(),firms=supplierMapListV15(),ware=warehouseMapListV15();
  let savedOrigin='Gdańsk';try{savedOrigin=localStorage.getItem('lm_map_origin_v26')||savedOrigin}catch(e){}
  const app=document.getElementById('app');app.innerHTML='';
  const d=document.createElement('div');d.className='v15-screen v27-map-screen';
  d.innerHTML=`
    <div class="v15-head"><div class="v15-logo">L&M<span>TECHNIC ENERGY</span></div>
      <div class="v15-title">MAPA DOSTAW / NAWIGACJA<small>klienci • dostawcy • magazyny • aktywna mapa Google</small></div>
      <button class="v15-back" onclick="go('home')">← PULPIT</button></div>
    <div class="v15-body">
      <section class="v15-panel">
        <h3>1. WYBIERZ CEL DOSTAWY</h3>
        <div class="v27-map-selectgrid">
          <div class="v15-field"><label>KLIENCI — lista z bazy KLIENCI</label><select id="vm_clients" class="v15-select">${optsMapV15(clients)}</select></div>
          <div class="v15-field"><label>FIRMY / DOSTAWCY — lista z bazy DOSTAWCY</label><select id="vm_firms" class="v15-select">${optsMapV15(firms)}</select></div>
          <div class="v15-field"><label>MAGAZYNY / LOKALIZACJE DOSTAW</label><select id="vm_ware" class="v15-select">${optsMapV15(ware)}</select></div>
          <div class="v15-field"><label>ADRES RĘCZNY</label><input id="vm_manual" class="v15-input" placeholder="np. ul. Przemysłowa 8, Kraków"></div>
        </div>
        <div class="v27-map-refresh">
          <button class="v15-btn blue" onclick="renderMapV15()">↻ ODŚWIEŻ LISTY Z BAZY</button>
          <button class="v15-btn" onclick="go('clients')">👥 OTWÓRZ BAZĘ KLIENTÓW</button>
        </div>
      </section>

      <section class="v15-panel">
        <h3>2. WYBRANY CEL I SZYBKIE AKCJE</h3>
        <div class="v27-dest-layout">
          <div id="vm_dest" class="v15-dest"><div class="name">Nie wybrano celu</div><div class="addr">Wybierz klienta, dostawcę, magazyn albo wpisz adres ręcznie.</div></div>
          <div class="v27-mini-actions">
            <button class="v15-btn orange" id="vm_show">📍 POKAŻ NA MAPIE</button>
            <button class="v15-btn" id="vm_copy">⧉ KOPIUJ ADRES</button>
          </div>
        </div>
        <button class="v15-navbig" id="vm_go">🧭 PROWADŹ DO — GOOGLE MAPS</button>
        <div class="v15-note">Po wybraniu celu mapa poniżej aktualizuje się automatycznie. „PROWADŹ DO” otwiera pełną nawigację Google Maps.</div>
      </section>

      <section class="v26-map-full v26-map-shell">
        <h3>3. DUŻA MAPA TRASY — GOOGLE MAPS</h3>
        <div class="v26-map-frame"><iframe id="vm_iframe" src="${v26MapEmbedUrl(savedOrigin,'')}" loading="eager" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
        <div class="v26-map-routebar">
          <div class="v15-field"><label>SKĄD / START</label><input id="vm_origin" class="v15-input" value="${esc(savedOrigin)}" placeholder="np. Gdańsk albo współrzędne GPS"></div>
          <button id="vm_locbtn" class="v15-btn">◎ MOJA LOKALIZACJA</button>
          <button id="vm_route" class="v15-btn green">✓ WYZNACZ TRASĘ</button>
          <button id="vm_openroute" class="v15-btn orange">↗ OTWÓRZ GOOGLE MAPS</button>
        </div>
        <div id="vm_map_status" class="v26-map-status">Mapa Google jest aktywna. Wybierz cel powyżej, aby zobaczyć trasę.</div>
        <div class="v27-map-hint"><b>SZYBKA PRACA:</b> wybierz klienta lub dostawcę → sprawdź cel na dużej mapie → ustaw punkt startowy lub użyj lokalizacji telefonu → wyznacz trasę albo uruchom pełną nawigację Google Maps.</div>
      </section>
    </div>`;
  app.appendChild(d);
  const selects=[['vm_clients',clients],['vm_firms',firms],['vm_ware',ware]];
  selects.forEach(([id,list])=>document.getElementById(id).onchange=()=>{
    const v=document.getElementById(id).value;if(v==='')return;
    selects.forEach(([oid])=>{if(oid!==id)document.getElementById(oid).value=''});
    document.getElementById('vm_manual').value='';setMapDestV15(list[Number(v)]);updateEmbeddedMapV26();
  });
  document.getElementById('vm_manual').onchange=()=>{
    const a=document.getElementById('vm_manual').value.trim();if(!a)return;
    selects.forEach(([id])=>document.getElementById(id).value='');setMapDestV15({name:'Adres wpisany ręcznie',address:a,kind:'ADRES RĘCZNY'});updateEmbeddedMapV26();
  };
  document.getElementById('vm_show').onclick=updateEmbeddedMapV26;
  document.getElementById('vm_go').onclick=openRouteGoogleV26;
  document.getElementById('vm_copy').onclick=copyMapAddressV15;
  document.getElementById('vm_route').onclick=updateEmbeddedMapV26;
  document.getElementById('vm_openroute').onclick=openRouteGoogleV26;
  document.getElementById('vm_locbtn').onclick=useMyLocationV26;
  document.getElementById('vm_origin').onchange=updateEmbeddedMapV26;
  mapDestV15=null;window.scrollTo({top:0,left:0,behavior:'auto'});
}
function setMapDestV15(x){
  mapDestV15=x;
  const b=document.getElementById('vm_dest');if(!b)return;
  b.innerHTML=`<div class="name">${esc(x.name||'Cel')}</div><div class="kind">${esc(x.kind||'')}</div><div class="addr">${esc(x.address||'')}</div>${x.phone?'<div class="v15-status">☎ '+esc(x.phone)+'</div>':''}`;
}
function openGoogleMapV15(navigate){
  if(!mapDestV15?.address){toast('Najpierw wybierz cel dojazdu.');return}
  const q=encodeURIComponent(mapDestV15.address);
  const url=navigate?`https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`:`https://www.google.com/maps/search/?api=1&query=${q}`;
  try{const w=window.open(url,'_blank');if(!w)location.href=url}catch(e){location.href=url}
}
async function copyMapAddressV15(){
  if(!mapDestV15?.address){toast('Najpierw wybierz adres.');return}
  try{await navigator.clipboard.writeText(mapDestV15.address);toast('Adres skopiowany.')}
  catch(e){toast('Adres: '+mapDestV15.address)}
}


/* --- HISTORIA DOKUMENTÓW PDF --- */
const V26_HISTORY_KEY='lm_document_history_v26';
const V27_BIZPLAN_HISTORY_REF='bizplan_master_25_v27';
function ensureBizplanHistoryV27(){
  const a=getHistoryV26();
  if(a.some(x=>x.ref===V27_BIZPLAN_HISTORY_REF))return;
  a.unshift({
    id:'bizplan_master_v27',type:'offer',
    filename:'L&M Technic Energy — Biznesplan i materiały MASTER — 25 kart.pdf',
    sentTo:'Archiwum L&M Technic Energy',status:'GOTOWY PDF',ref:V27_BIZPLAN_HISTORY_REF,
    createdAt:new Date().toISOString()
  });
  saveHistoryV26(a);
}

let v26HistoryType='offer';
function getHistoryV26(){try{return JSON.parse(localStorage.getItem(V26_HISTORY_KEY)||'[]')}catch(e){return []}}
function saveHistoryV26(a){try{localStorage.setItem(V26_HISTORY_KEY,JSON.stringify(a.slice(0,500)))}catch(e){}}
function registerPdfHistoryV26(type,filename,sentTo='—',status='WYGENEROWANO',ref=''){
  const a=getHistoryV26();a.unshift({id:'d'+Date.now()+'_'+Math.random().toString(36).slice(2,7),type,filename,sentTo,status,ref,createdAt:new Date().toISOString()});saveHistoryV26(a);return a[0];
}
function historyLabelV26(type){return type==='offer'?'OFERTY':type==='proforma'?'FAKTURY PROFORMA':'FAKTURY KOŃCOWE / ORYGINAŁY'}
function historyIconV26(type){return type==='offer'?'📄':type==='proforma'?'🧾':'📑'}
async function previewBizPlanPdfV28(){
  try{
    const url=V24_BIZPLAN_PDF_URL;
    const w=window.open(url,'_blank');
    if(!w){
      const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
    }
  }catch(e){toast('Nie udało się otworzyć podglądu PDF.');}
}
function previewHistoryPdfV28(ref){
  if(ref===V27_BIZPLAN_HISTORY_REF)return previewBizPlanPdfV28();
  toast('Ten dokument nie ma jeszcze podpiętego pliku PDF.');
}
function historyRowsV26(type){
  const rows=getHistoryV26().filter(x=>x.type===type);
  if(!rows.length)return `<tr><td class="empty" colspan="7">Brak dokumentów PDF w tej kategorii. Nowe pliki będą dopisywane tutaj automatycznie.</td></tr>`;
  return rows.map(x=>{
    const d=new Date(x.createdAt),date=d.toLocaleDateString('pl-PL'),time=d.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});
    const isBiz=x.ref===V27_BIZPLAN_HISTORY_REF;
    const preview=isBiz
      ? `<button class="v28-action preview" onclick="previewHistoryPdfV28('${x.ref}')">👁 PODGLĄD PDF</button>`
      : `<button class="v28-action details" onclick="previewHistoryPdfV28('${esc(x.ref||'')}')">PODGLĄD</button>`;
    const download=isBiz
      ? `<button class="v28-action download" onclick="downloadBizPlanPdfV24()">⬇ POBIERZ PDF</button>`
      : `<button class="v28-action details" onclick="toast('Podpięcie pliku PDF nastąpi przy zapisie dokumentu z generatora.')">SZCZEGÓŁY</button>`;
    return `<tr>
      <td>${date}</td>
      <td>${time}</td>
      <td><div class="v28-doc-name${isBiz?' biz':''}">${esc(x.filename||'Dokument PDF')}</div></td>
      <td>${esc(x.sentTo||'—')}</td>
      <td><span class="v28-status">${esc(x.status||'WYGENEROWANO')}</span></td>
      <td>${preview}</td>
      <td>${download}</td>
    </tr>`;
  }).join('');
}
function renderHistoryTableV26(type){
  v26HistoryType=type;
  document.querySelectorAll('.v28-folder').forEach(b=>b.classList.toggle('active',b.dataset.type===type));
  const h=document.getElementById('v28_history_title');if(h)h.textContent=historyLabelV26(type);
  const tb=document.getElementById('v28_history_rows');if(tb)tb.innerHTML=historyRowsV26(type);
}
function renderHistoryV26(){
  ensureBizplanHistoryV27();
  const a=getHistoryV26(),counts=t=>a.filter(x=>x.type===t).length;
  const app=document.getElementById('app');app.innerHTML='';
  const d=document.createElement('div');d.className='v28-history-screen';
  d.innerHTML=`
    <div class="v15-head">
      <div class="v15-logo">L&M<span>TECHNIC ENERGY</span></div>
      <div class="v15-title">HISTORIA DOKUMENTÓW<small>czytelne archiwum wszystkich ofert, proform i faktur PDF</small></div>
      <button class="v15-back" onclick="go('home')">← PULPIT</button>
    </div>
    <div class="v28-history-body">
      <div class="v28-history-folders">
        <button class="v28-folder active" data-type="offer" onclick="renderHistoryTableV26('offer')"><span class="count">${counts('offer')}</span><span class="num">1</span><span class="ico">📄</span><b>OFERTY</b><span class="desc">Oferta, data i godzina, odbiorca, status, podgląd oraz pobranie PDF.</span></button>
        <button class="v28-folder" data-type="proforma" onclick="renderHistoryTableV26('proforma')"><span class="count">${counts('proforma')}</span><span class="num">2</span><span class="ico">🧾</span><b>FAKTURY PROFORMA</b><span class="desc">Wszystkie proformy w jednej czytelnej tabeli z podglądem konkretnego PDF.</span></button>
        <button class="v28-folder" data-type="final" onclick="renderHistoryTableV26('final')"><span class="count">${counts('final')}</span><span class="num">3</span><span class="ico">📑</span><b>FAKTURY KOŃCOWE</b><span class="desc">Oryginały i faktury końcowe wraz z historią wysyłki i plikiem PDF.</span></button>
      </div>
      <section class="v28-history-card">
        <div class="v28-history-tools">
          <div><h2 id="v28_history_title">OFERTY</h2><div class="desc">Każdy dokument ma własny wiersz. Tabelę można przesuwać poziomo bez zmniejszania napisów.</div></div>
          <button class="v15-btn blue" onclick="renderHistoryV26()">↻ ODŚWIEŻ</button>
        </div>
        <div class="v28-table-scroll">
          <table class="v28-history-table">
            <thead><tr>
              <th style="width:110px">DATA</th><th style="width:90px">GODZINA</th><th style="width:300px">DOKUMENT</th><th style="width:235px">WYSŁANO DO / ODBIORCA</th><th style="width:145px">STATUS</th><th style="width:150px">PODGLĄD PDF</th><th style="width:170px">POBIERZ</th>
            </tr></thead>
            <tbody id="v28_history_rows">${historyRowsV26('offer')}</tbody>
          </table>
        </div>
        <div class="v28-history-hint"><b>STANDARD PRACY:</b> GOTOWY PDF → PODGLĄD PDF → POBIERZ PDF. Przy kolejnych ofertach, proformach i fakturach każdy zapisany dokument dostanie własny podgląd i plik w odpowiedniej kategorii.</div>
      </section>
    </div>`;
  app.appendChild(d);window.scrollTo({top:0,left:0,behavior:'auto'});
}


/* Ostatnia warstwa routingu — nie rusza zatwierdzonych ekranów MASTER. */

/* ===== V18 — TRANSPORT PREMIUM NA OSOBNYM DRUGIM EKRANIE ===== */
let v18T=null;

function v18money(n){
  return Number(n||0).toLocaleString('pl-PL',{minimumFractionDigits:2,maximumFractionDigits:2})+' zł';
}
function v18num(n,d=0){
  return Number(n||0).toLocaleString('pl-PL',{minimumFractionDigits:d,maximumFractionDigits:d});
}
function v18SupplierList(){
  let a=[]; try{a=getCustomSuppliers()||[]}catch(e){}
  return a.map((x,i)=>{
    const address=[x.address,[x.postal,x.city].filter(Boolean).join(' '),x.country||'Polska'].filter(Boolean).join(', ');
    return {id:String(x.id||('s'+i)),name:x.name||('Dostawca '+(i+1)),address,kind:'DOSTAWCA',phone:x.phone||x.mobile||''};
  }).filter(x=>x.address);
}
function v18ClientList(){
  return (CLIENTS_V13||[]).map((x,i)=>{
    const main=(x.deliveryAddresses||[]).find(a=>a.main)||(x.deliveryAddresses||[])[0];
    const address=main?.address||x.delivery||x.invoiceAddress||[x.city,'Polska'].filter(Boolean).join(', ');
    return {id:'c'+i,name:x.name||('Klient '+(i+1)),address,kind:'KLIENT',phone:x.phone||''};
  }).filter(x=>x.address);
}
function v18WarehouseList(){
  const out=[];
  (CLIENTS_V13||[]).forEach((x,ci)=>{
    if(Array.isArray(x.deliveryAddresses)&&x.deliveryAddresses.length){
      x.deliveryAddresses.forEach((a,ai)=>{
        if(a?.address)out.push({id:`cw${ci}_${ai}`,name:(a.name||'Magazyn')+' — '+x.name,address:a.address,kind:'MAGAZYN KLIENTA',phone:a.phone||x.phone||''});
      });
    } else if(Array.isArray(x.locations)&&x.locations.length){
      x.locations.forEach((a,ai)=>{
        if(a?.[1])out.push({id:`cl${ci}_${ai}`,name:(a[0]||'Magazyn')+' — '+x.name,address:a[1],kind:'LOKALIZACJA KLIENTA',phone:a[2]||x.phone||''});
      });
    }
  });
  try{
    (getCustomSuppliers()||[]).forEach((x,si)=>{
      const address=[x.address,[x.postal,x.city].filter(Boolean).join(' '),x.country||'Polska'].filter(Boolean).join(', ');
      if(address)out.push({id:`sw${si}`,name:'Firma / magazyn — '+x.name,address,kind:'LOKALIZACJA DOSTAWCY',phone:x.phone||x.mobile||''});
    });
  }catch(e){}
  return out;
}
function v18List(type){
  if(type==='client')return v18ClientList();
  if(type==='supplier')return v18SupplierList();
  if(type==='warehouse')return v18WarehouseList();
  return [];
}
function v18opts(list,selected=''){
  return '<option value="">— wybierz —</option>'+list.map(x=>`<option value="${esc(x.id)}" ${String(x.id)===String(selected)?'selected':''}>${esc(x.name)}</option>`).join('');
}
function v18typeopts(selected){
  const a=[['current','Moja aktualna lokalizacja'],['manual','Adres ręczny'],['supplier','Dostawca / firma'],['client','Klient'],['warehouse','Magazyn / lokalizacja']];
  return a.map(([v,l])=>`<option value="${v}" ${v===selected?'selected':''}>${l}</option>`).join('');
}
function v18load(){
  const c=getCalcV15();
  let x=null;try{x=JSON.parse(localStorage.getItem('lm_transport_v18')||'null')}catch(e){}
  x=x||{};
  return {
    fromType:x.fromType||'manual',fromId:x.fromId||'',fromName:x.fromName||'Gdańsk',fromAddress:x.fromAddress||'Gdańsk',
    toType:x.toType||'manual',toId:x.toId||'',toName:x.toName||'Berlin',toAddress:x.toAddress||'Berlin',
    distance:Number(x.distance??c.distance??535),rate:Number(x.rate??c.rate??4.25),
    qty:Number(x.qty??state.qty??104),tonsPerTruck:Number(x.tonsPerTruck??26),roundTrip:x.roundTrip!==false
  };
}
function v18save(){try{localStorage.setItem('lm_transport_v18',JSON.stringify(v18T))}catch(e){}}
function v18find(type,id){return v18List(type).find(x=>String(x.id)===String(id))||null}

function v18route(side){
  const isFrom=side==='from', type=isFrom?v18T.fromType:v18T.toType, id=isFrom?v18T.fromId:v18T.toId;
  const address=isFrom?v18T.fromAddress:v18T.toAddress, name=isFrom?v18T.fromName:v18T.toName;
  return `
  <div class="v18-route">
    <div class="v18-routehead">
      <div class="v18-icon ${isFrom?'':'dest'}">${isFrom?'📍':'🏁'}</div>
      <div><b>${isFrom?'SKĄD — ZAŁADUNEK':'DOKĄD — ROZŁADUNEK'}</b><small>${isFrom?'Wybierz miejsce rozpoczęcia transportu':'Wybierz odbiorcę lub miejsce dostawy'}</small></div>
    </div>
    <div class="v18-row">
      <div class="v18-field"><label>Źródło adresu</label><select class="v18-select" id="v18_${side}_type">${v18typeopts(type)}</select></div>
      <div class="v18-field"><label>Wybór z bazy</label><select class="v18-select" id="v18_${side}_list" ${(type==='manual'||type==='current')?'disabled':''}>${(type==='manual'||type==='current')?'<option>— nie dotyczy —</option>':v18opts(v18List(type),id)}</select></div>
    </div>
    <div class="v18-field"><label>Adres</label><input class="v18-input" id="v18_${side}_manual" value="${esc(type==='current'?'Moja aktualna lokalizacja':address)}" ${(type==='manual')?'':'readonly'}></div>
    <div class="v18-address" id="v18_${side}_address">${type==='current'?'Google Maps użyje bieżącej pozycji telefonu.':esc((name&&name!==address?name+' — ':'')+(address||'Nie wybrano adresu'))}</div>
    <span class="v18-chip">${type==='current'?'GPS / TELEFON':type==='manual'?'ADRES RĘCZNY':type==='client'?'BAZA KLIENTÓW':type==='supplier'?'BAZA DOSTAWCÓW':'MAGAZYNY / LOKALIZACJE'}</span>
  </div>`;
}

function renderTransportV18(){
  v18T=v18load();
  const app=document.getElementById('app');app.innerHTML='';
  const d=document.createElement('div');d.className='v18-screen';
  d.innerHTML=`
    <div class="v18-top">
      <div class="v18-brand">L&M<small>TECHNIC ENERGY</small></div>
      <div class="v18-heading"><h1>TRANSPORT PREMIUM</h1><p>TRASA • KOSZTY • KLIENCI • DOSTAWCY • MAGAZYNY • GOOGLE MAPS</p></div>
      <button class="v18-back" onclick="go('home')">← PULPIT</button>
    </div>
    <div class="v18-body">
      <div class="v18-grid">
        <section class="v18-card">
          <h2><span>1.</span> TRASA I CEL DOSTAWY</h2>
          <div class="v18-section-note">Wybierz miejsca bezpośrednio z naszych baz albo wpisz adres ręcznie.</div>
          ${v18route('from')}
          ${v18route('to')}
          <div class="v18-actions2">
            <button class="v18-btn blue" id="v18_route">🗺️ OTWÓRZ TRASĘ</button>
            <button class="v18-btn green" id="v18_nav">🧭 PROWADŹ DO CELU</button>
          </div>
        </section>

        <section class="v18-card">
          <h2><span>2.</span> PARAMETRY TRANSPORTU</h2>
          <div class="v18-section-note">Duże pola robocze — łatwa zmiana wszystkich parametrów transportu.</div>
          <div class="v18-paramgrid">
            <div class="v18-field"><label>Odległość w jedną stronę [km]</label><input id="v18_distance" class="v18-input" type="number" step="1" value="${v18T.distance}"></div>
            <div class="v18-field"><label>Stawka transportu [PLN/km]</label><input id="v18_rate" class="v18-input" type="number" step="0.01" value="${v18T.rate}"></div>
            <div class="v18-field"><label>Ilość całkowita</label><select id="v18_qty" class="v18-select">${Array.from({length:10},(_,i)=>{const q=(i+1)*26;return `<option value="${q}" ${q===v18T.qty?'selected':''}>${q} t — ${i+1} samoch${i===0?'ód':i<4?'ody':'odów'}</option>`}).join('')}</select></div>
            <div class="v18-field"><label>Ładowność 1 samochodu [t]</label><input id="v18_tpt" class="v18-input" type="number" step="0.1" value="${v18T.tonsPerTruck}"></div>
          </div>
          <div class="v18-switchrow">
            <div class="v18-switchcopy"><b>Pełny kurs TAM + POWRÓT</b><span>Włączone = koszt liczony w obie strony.</span></div>
            <div class="v18-switch ${v18T.roundTrip?'on':''}" id="v18_round"><i></i></div>
          </div>
          <div class="v18-mini">
            <div><span>Liczba samochodów</span><b id="v18_trucks">—</b></div>
            <div><span>Dystans 1 samochodu</span><b id="v18_tripkm">—</b></div>
          </div>
          <button class="v18-btn orange v18-wide" id="v18_calc">🧮 PRZELICZ TRANSPORT</button>
          <div class="v18-help">Odległość pozostaje edytowalna ręcznie. Przycisk Google Maps służy do nawigacji i kontroli trasy; bez płatnego API nie pobieramy automatycznie kilometrażu z Map Google.</div>
        </section>

        <section class="v18-card full">
          <h2><span>3.</span> WYNIK TRANSPORTU</h2>
          <div class="v18-kpis">
            <div class="v18-kpi"><span>KOSZT / SAMOCHÓD</span><b class="orange" id="v18_ktruck">—</b></div>
            <div class="v18-kpi"><span>KOSZT CAŁEJ PARTII</span><b class="green" id="v18_ktotal">—</b></div>
            <div class="v18-kpi"><span>KOSZT / TONĘ</span><b class="blue" id="v18_kton">—</b></div>
            <div class="v18-kpi"><span>ŁĄCZNY DYSTANS FLOTY</span><b class="purple" id="v18_km">—</b></div>
          </div>
          <div class="v18-summary" id="v18_summary">—</div>
          <div class="v18-bottom">
            <button class="v18-btn green" id="v18_savecalc">✓ ZAPISZ DO KALKULATORA</button>
            <button class="v18-btn blue" id="v18_saveoffer">📄 ZAPISZ DO OFERTY</button>
            <button class="v18-btn gray" onclick="go('home')">← WRÓĆ DO PULPITU</button>
          </div>
          <div class="v18-status" id="v18_status">Gotowy do pracy.</div>
        </section>
      </div>
    </div>`;
  app.appendChild(d);

  v18wire('from');v18wire('to');
  ['v18_distance','v18_rate','v18_tpt'].forEach(id=>document.getElementById(id).oninput=v18calc);
  document.getElementById('v18_qty').onchange=v18calc;
  document.getElementById('v18_round').onclick=()=>{
    v18T.roundTrip=!v18T.roundTrip;
    document.getElementById('v18_round').classList.toggle('on',v18T.roundTrip);
    v18calc();
  };
  document.getElementById('v18_calc').onclick=()=>{
    v18calc();
    v18status('✓ TRANSPORT PRZELICZONY — '+new Date().toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'}));
  };
  document.getElementById('v18_route').onclick=()=>v18maps(false);
  document.getElementById('v18_nav').onclick=()=>v18maps(true);
  document.getElementById('v18_savecalc').onclick=v18saveCalc;
  document.getElementById('v18_saveoffer').onclick=v18saveOffer;
  v18calc();
  window.scrollTo({top:0,left:0,behavior:'auto'});
}

function v18wire(side){
  const type=document.getElementById('v18_'+side+'_type');
  const list=document.getElementById('v18_'+side+'_list');
  const manual=document.getElementById('v18_'+side+'_manual');
  type.onchange=()=>{
    const t=type.value;
    if(side==='from'){v18T.fromType=t;v18T.fromId='';}
    else {v18T.toType=t;v18T.toId='';}
    if(t==='current'){
      list.disabled=true;list.innerHTML='<option>— nie dotyczy —</option>';manual.readOnly=true;manual.value='Moja aktualna lokalizacja';
      if(side==='from'){v18T.fromName='Moja aktualna lokalizacja';v18T.fromAddress='';}
      else {v18T.toName='Moja aktualna lokalizacja';v18T.toAddress='';}
      document.getElementById('v18_'+side+'_address').textContent='Google Maps użyje bieżącej pozycji telefonu.';
    }else if(t==='manual'){
      list.disabled=true;list.innerHTML='<option>— nie dotyczy —</option>';manual.readOnly=false;manual.value='';
      if(side==='from'){v18T.fromName='';v18T.fromAddress='';}
      else {v18T.toName='';v18T.toAddress='';}
      document.getElementById('v18_'+side+'_address').textContent='Wpisz pełny adres.';
    }else{
      list.disabled=false;list.innerHTML=v18opts(v18List(t),'');manual.readOnly=true;manual.value='';
      if(side==='from'){v18T.fromName='';v18T.fromAddress='';}
      else {v18T.toName='';v18T.toAddress='';}
      document.getElementById('v18_'+side+'_address').textContent='Wybierz pozycję z bazy.';
    }
    v18save();
  };
  list.onchange=()=>{
    const x=v18find(type.value,list.value);if(!x)return;
    if(side==='from'){v18T.fromId=x.id;v18T.fromName=x.name;v18T.fromAddress=x.address;}
    else {v18T.toId=x.id;v18T.toName=x.name;v18T.toAddress=x.address;}
    manual.value=x.address;
    document.getElementById('v18_'+side+'_address').textContent=x.name+' — '+x.address;
    v18save();
  };
  manual.oninput=()=>{
    if(type.value!=='manual')return;
    if(side==='from'){v18T.fromName=manual.value;v18T.fromAddress=manual.value;}
    else {v18T.toName=manual.value;v18T.toAddress=manual.value;}
    document.getElementById('v18_'+side+'_address').textContent=manual.value||'Wpisz pełny adres.';
    v18save();
  };
}

function v18calc(){
  const n=(id,fb)=>{const x=Number(String(document.getElementById(id)?.value??'').replace(',','.'));return Number.isFinite(x)?x:fb}
  v18T.distance=n('v18_distance',535);
  v18T.rate=n('v18_rate',4.25);
  v18T.qty=n('v18_qty',104);
  v18T.tonsPerTruck=Math.max(.1,n('v18_tpt',26));
  const trucks=Math.max(1,Math.ceil(v18T.qty/v18T.tonsPerTruck));
  const kmTruck=v18T.distance*(v18T.roundTrip?2:1);
  const costTruck=kmTruck*v18T.rate;
  const total=costTruck*trucks;
  const perTon=v18T.qty?total/v18T.qty:0;
  const fleet=kmTruck*trucks;
  v18T.calc={trucks,kmTruck,costTruck,total,perTon,fleet};

  document.getElementById('v18_trucks').textContent=trucks+' samoch.';
  document.getElementById('v18_tripkm').textContent=v18num(kmTruck,0)+' km';
  document.getElementById('v18_ktruck').textContent=v18money(costTruck);
  document.getElementById('v18_ktotal').textContent=v18money(total);
  document.getElementById('v18_kton').textContent=v18money(perTon)+'/t';
  document.getElementById('v18_km').textContent=v18num(fleet,0)+' km';

  const f=v18T.fromType==='current'?'MOJA LOKALIZACJA':(v18T.fromName||v18T.fromAddress||'—');
  const t=v18T.toType==='current'?'MOJA LOKALIZACJA':(v18T.toName||v18T.toAddress||'—');
  document.getElementById('v18_summary').innerHTML=
    `<strong>${esc(f)} → ${esc(t)}</strong> &nbsp;•&nbsp; ${v18num(v18T.distance,0)} km w jedną stronę &nbsp;•&nbsp; ${v18num(v18T.rate,2)} PLN/km &nbsp;•&nbsp; ${trucks} samoch. &nbsp;•&nbsp; ${v18num(v18T.qty,0)} t &nbsp;•&nbsp; ${v18T.roundTrip?'TAM + POWRÓT':'JEDNA STRONA'}`;
  v18save();
  return v18T.calc;
}
function v18status(x){const e=document.getElementById('v18_status');if(e)e.textContent=x}

function v18maps(navigate){
  const to=(v18T.toAddress||'').trim();
  if(v18T.toType==='current'){toast('Cel nie może być „Moja aktualna lokalizacja”.');return}
  if(!to){toast('Najpierw wybierz lub wpisz adres celu.');return}
  let url='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(to)+'&travelmode=driving';
  if(v18T.fromType!=='current' && (v18T.fromAddress||'').trim()){
    url+='&origin='+encodeURIComponent(v18T.fromAddress.trim());
  }
  try{const w=window.open(url,'_blank');if(!w)location.href=url}catch(e){location.href=url}
}
function v18saveCalc(){
  const r=v18calc();
  const c=getCalcV15();c.distance=v18T.distance;c.rate=v18T.rate;saveCalcV15(c);
  state.qty=v18T.qty;saveQty();
  try{
    localStorage.setItem('lm_transport_cost_per_t_v18',String(r.perTon));
    localStorage.setItem('lm_transport_saved_v18',JSON.stringify({...v18T,savedAt:new Date().toISOString()}));
  }catch(e){}
  v18status('✓ ZAPISANO DO KALKULATORA — '+v18money(r.perTon)+'/t • '+new Date().toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'}));
  toast('Transport zapisany do Kalkulatora.');
}
function v18saveOffer(){
  const r=v18calc();
  try{localStorage.setItem('lm_offer_transport_v18',JSON.stringify({...v18T,calc:r,savedAt:new Date().toISOString()}))}catch(e){}
  v18status('✓ TRANSPORT ZAPISANY DO OFERTY — '+new Date().toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'}));
  toast('Transport zapisany do oferty.');
}


/* ===== V20 — OFERTY NA OSOBNYM EKRANIE + GENERATOR OFERTY + FAKTURY ===== */
const V20_OFFER_MASTER_ART='./assets/embedded-33-3f3d57217baa.jpg';

function v21GreenPress(el){
  if(!el)return;
  el.classList.add('lm-green-press');
  clearTimeout(el.__v21gp);
  el.__v21gp=setTimeout(()=>el.classList.remove('lm-green-press'),260);
}
function v21Hot(parent,left,top,width,height,fn,label){
  const b=document.createElement('button');
  b.className='v21-master-hot';
  b.style.left=left+'px';b.style.top=top+'px';b.style.width=width+'px';b.style.height=height+'px';
  b.setAttribute('aria-label',label||'moduł');
  b.onpointerdown=()=>v21GreenPress(b);
  b.ontouchstart=()=>v21GreenPress(b);
  b.onclick=fn;
  parent.appendChild(b);
}
function v21Tile(kind,label,action){
  const b=document.createElement('button');
  b.className='v21-tile '+kind;
  b.setAttribute('aria-label',label);
  const baseKind=String(kind||'').split(/\s+/)[0];
  let icon='';
  if(baseKind==='offer') icon=`<div class="v21-iconbox"><div class="v21-doc"><i></i><b></b><em></em></div><div class="v21-docmark">+</div></div>`;
  else if(baseKind==='invoice') icon=`<div class="v21-iconbox"><div class="v21-invoice-paper"><span class="gold"></span><i></i><b></b><em></em></div><div class="v21-pln">PLN</div></div>`;
  else if(baseKind==='business') icon=`<div class="v23-biz-cover-wrap"><img src="${V23_BIZ_PLAN_IMAGES[0]}" alt="Biznesplan inwestorski — karta tytułowa"></div>`;
  else if(baseKind==='whatsapp') icon=`<div class="v24-whatsapp-icon"><div class="v24-wa-circle"><svg viewBox="0 0 64 64" aria-hidden="true"><path fill="#fff" d="M32 9c-12.7 0-23 9.7-23 21.7 0 4.2 1.3 8.2 3.7 11.6L9 55l13.1-3.5c3.1 1.7 6.5 2.6 9.9 2.6 12.7 0 23-9.7 23-21.7S44.7 9 32 9zm0 40.3c-3.1 0-6.1-.8-8.7-2.4l-1-.6-7.8 2.1 2.1-7.5-.7-1c-1.7-2.7-2.6-5.9-2.6-9.1 0-9.6 8.4-17.4 18.7-17.4s18.7 7.8 18.7 17.4S42.3 49.3 32 49.3z"/><path fill="#fff" d="M42.1 35.6c-.6-.3-3.4-1.6-3.9-1.8-.5-.2-.9-.3-1.3.3-.4.6-1.5 1.8-1.9 2.2-.4.4-.7.4-1.3.1-3.5-1.7-5.8-3-8.1-6.8-.6-1 .6-.9 1.7-3 .2-.4.1-.8-.1-1.1-.1-.3-1.3-3.1-1.8-4.2-.5-1.1-1-1-1.3-1h-1.1c-.4 0-1 .1-1.5.7-.5.6-2 2-2 4.9s2.1 5.7 2.4 6.1c.3.4 4.2 6.3 10.1 8.8 1.4.6 2.5 1 3.4 1.3 1.4.4 2.7.4 3.7.2 1.1-.2 3.4-1.4 3.9-2.7.5-1.3.5-2.5.3-2.7-.2-.3-.7-.4-1.2-.7z"/></svg></div></div>`;
  b.innerHTML=icon+`<div class="v21-label">${label}</div>`;
  b.onpointerdown=()=>v21GreenPress(b); b.ontouchstart=()=>v21GreenPress(b); b.onclick=action; return b;
}
function v21Home(){
  const app=document.getElementById('app');app.innerHTML='';
  const root=document.createElement('div');root.className='v21-home';

  /* 1) Górna część oryginalnego Pulpitu MASTER: nagłówek + trzy istniejące rzędy. */
  const top=document.createElement('div');top.className='v21-crop top';
  const im1=document.createElement('img');im1.src=imgs.home;im1.alt='Pulpit MASTER — Europejski Kalkulator Peletu 1.2 PREMIUM';
  top.appendChild(im1);

  const fullH=941*1536/1024;
  const cols=[.008,.258,.508,.758], rows=[.139,.264,.389], cw=.234, rh=.119;
  const acts=[
    ['home','PULPIT'],['offer','OFERTY'],['calculator','KALKULATOR'],['transport','TRANSPORT'],
    ['marketsEU','RYNKI EU'],['currencies','WALUTY'],['suppliers','DOSTAWCY'],['clients','KLIENCI'],
    ['map','MAPA DOSTAW'],['noop','RAPORTY'],['history','HISTORIA'],['settings','USTAWIENIA']
  ];
  let i=0;
  for(let r=0;r<3;r++)for(let c=0;c<4;c++){
    const [act,label]=acts[i++];
    v21Hot(
      top,
      cols[c]*941,rows[r]*fullH,cw*941,rh*fullH,
      ()=>act==='noop'?toast('Moduł „'+label+'” będzie aktywowany bez zmiany grafiki MASTER.'):go(act),
      label
    );
  }
  root.appendChild(top);

  /* 2) Czwarty rząd tej samej siatki — żadnej osobnej belki ani innego wzoru. */
  const extra=document.createElement('div');extra.className='v21-extra-row';

  extra.appendChild(v21Tile('business slot1','BIZNES PLAN',()=>go('businessplan')));
  extra.appendChild(v21Tile('offer','OFERTA',()=>go('offerGenerator')));
  extra.appendChild(v21Tile('invoice','FAKTURY',()=>go('invoices')));

  extra.appendChild(v21Tile('whatsapp slot4','WHATSAPP',openWhatsAppV24));
  root.appendChild(extra);

  /* 3) Reszta oryginalnego Pulpitu MASTER przesunięta w dół bez zmiany grafiki. */
  const bottom=document.createElement('div');bottom.className='v21-crop bottom';
  const im2=document.createElement('img');im2.src=imgs.home;im2.alt='Pulpit MASTER — dolna część';
  bottom.appendChild(im2);

  /* Oryginalne dolne skróty MASTER pozostają aktywne po przesunięciu. */
  const splitSrc=780, scale=941/1024;
  const bottomY=(.925*1536-splitSrc)*scale;
  v21Hot(bottom,.008*941,bottomY,.16*941,.045*fullH,()=>go('offer'),'NOWA OFERTA ZAKUPU');
  v21Hot(bottom,.835*941,bottomY,.16*941,.045*fullH,()=>go('suppliers'),'BAZA DOSTAWCÓW');
  root.appendChild(bottom);

  app.appendChild(root);
  lmAutoFit(root,941);
  window.scrollTo({top:0,left:0,behavior:'auto'});
}


function openWhatsAppV24(){
  let left=false;
  const vis=()=>{if(document.visibilityState==='hidden')left=true};
  document.addEventListener('visibilitychange',vis);
  const fire=(u)=>{const a=document.createElement('a');a.href=u;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),800)};
  try{
    /* V29: otwarcie dokładnie ekranu głównego zainstalowanego WhatsApp, bez czatu i bez Google Play. */
    fire('intent://#Intent;component=com.whatsapp/.Main;package=com.whatsapp;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end');
    setTimeout(()=>{if(!left)fire('intent://#Intent;package=com.whatsapp;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end');},650);
    setTimeout(()=>{
      document.removeEventListener('visibilitychange',vis);
      if(!left)toast('Chrome nie pozwolił otworzyć ekranu głównego WhatsApp z lokalnego pliku. Nie przekierowuję do Google Play.');
    },2100);
  }catch(e){document.removeEventListener('visibilitychange',vis);toast('Nie udało się uruchomić zainstalowanego WhatsApp.');}
}
async function v24PdfBlob(){
  const r=await fetch(V24_BIZPLAN_PDF_URL,{cache:'no-store'});
  if(!r.ok)throw new Error('PDF '+r.status);
  return await r.blob();
}
async function downloadBizPlanPdfV24(){
  try{
    const blob=await v24PdfBlob(),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=V24_BIZPLAN_PDF_NAME;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500);toast('PDF został przygotowany do pobrania.');
  }catch(e){toast('Nie udało się pobrać PDF.');}
}
async function shareBizPlanPdfV24(){
  try{
    const blob=await v24PdfBlob(),file=new File([blob],V24_BIZPLAN_PDF_NAME,{type:'application/pdf'});
    if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:'L&M Technic Energy — Biznesplan',text:'Biznesplan i materiały L&M Technic Energy',files:[file]});return;}
    downloadBizPlanPdfV24();toast('Udostępnianie pliku nie jest dostępne w tym trybie — PDF przygotowano do pobrania.');
  }catch(e){if(e&&e.name==='AbortError')return;downloadBizPlanPdfV24();}
}

function renderBusinessPlanV23(){
  const app=document.getElementById('app');app.innerHTML='';
  const d=document.createElement('div');d.className='v23-bp-screen';
  const mainCards=V23_BIZ_PLAN_IMAGES.slice(0,20).map((src,i)=>`<div class="v23-bp-card"><img src="${src}" alt="Biznesplan L&M Technic Energy — karta ${i+1}" loading="lazy"></div>`).join('');
  const extraCards=V23_BIZ_PLAN_IMAGES.slice(20).map((src,i)=>`<div class="v23-bp-card"><img src="${src}" alt="Materiały L&M Technic Energy — karta dodatkowa ${i+1}" loading="lazy"></div>`).join('');
  d.innerHTML=`<div class="v23-bp-wrap">
    <div class="v25-bp-toolbar"><div class="v25-bp-toolbar-grid">
      <button class="v25-bp-navbtn" onclick="go('home')"><span class="ico">⌂</span><span>PULPIT</span></button>
      <button class="v25-bp-navbtn" onclick="window.scrollTo({top:0,behavior:'smooth'})"><span class="ico">↑</span><span>GÓRA</span></button>
      <button class="v25-bp-navbtn green" onclick="downloadBizPlanPdfV24()"><span class="ico">⬇</span><span>POBIERZ PDF</span></button>
      <button class="v25-bp-navbtn blue" onclick="shareBizPlanPdfV24()"><span class="ico">↗</span><span>UDOSTĘPNIJ</span></button>
    </div></div>
    <div class="v23-bp-list">${mainCards}<div class="v24-bp-extra-sep">MATERIAŁY UZUPEŁNIAJĄCE L&M TECHNIC ENERGY</div>${extraCards}</div>
    <div class="v24-pdf-tools"><h2>UDOSTĘPNIJ CAŁY PAKIET JAKO JEDEN PDF</h2><p>PDF zawiera wszystkie 25 kart/zdjęć w tej samej kolejności.</p><div class="v24-pdf-buttons"><button class="v24-pdf-btn green" onclick="downloadBizPlanPdfV24()">⬇ POBIERZ PDF</button><button class="v24-pdf-btn blue" onclick="shareBizPlanPdfV24()">↗ UDOSTĘPNIJ PDF</button></div></div>
    <div class="v23-bp-footer">KONIEC PAKIETU • L&M TECHNIC ENERGY</div></div>`;
  app.appendChild(d);window.scrollTo({top:0,left:0,behavior:'auto'});
}

function v20Header(title,sub){
  return `<div class="v20-top">
    <div class="v20-brand">L&M<small>TECHNIC ENERGY</small></div>
    <div class="v20-heading"><h1>${title}</h1><p>${sub}</p></div>
    <button class="v20-back" onclick="go('home')">← PULPIT</button>
  </div>`;
}
function v20SupplierOptions(){
  let arr=[];try{arr=getCustomSuppliers()||[]}catch(e){}
  const names=arr.map(x=>x.name).filter(Boolean);
  if(!names.includes('Max Mazurkiewicz / Giełda Pelletu'))names.unshift('Max Mazurkiewicz / Giełda Pelletu');
  return names.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('');
}
function v20OfferQtyOptions(selected){
  return Array.from({length:10},(_,i)=>{
    const q=(i+1)*26;
    return `<option value="${q}" ${q===selected?'selected':''}>${q} t (${i+1} samoch${i===0?'ód':i<4?'ody':'odów'})</option>`;
  }).join('');
}
function v20OfferLoad(){
  let x={};try{x=JSON.parse(localStorage.getItem('lm_purchase_offer_v20')||'{}')}catch(e){}
  const c=getCalcV15();
  return {
    date:x.date||'2026-08-17T09:30',
    supplier:x.supplier||'Max Mazurkiewicz / Giełda Pelletu',
    pellet:x.pellet||'A1 (ENplus)',
    diameter:x.diameter||'6 mm',
    form:x.form||'Luzem',
    purchase:Number(x.purchase??1250),
    sell:Number(x.sell??1580),
    qty:Number(x.qty??state.qty??52),
    distance:Number(x.distance??c.distance??535),
    rate:Number(x.rate??c.rate??4.25)
  };
}
function v20OfferSaveState(x){try{localStorage.setItem('lm_purchase_offer_v20',JSON.stringify(x))}catch(e){}}
function v20OfferRead(){
  const num=id=>Number(String(document.getElementById(id)?.value||'0').replace(',','.'))||0;
  return {
    date:document.getElementById('v20_o_date').value,
    supplier:document.getElementById('v20_o_supplier').value,
    pellet:document.getElementById('v20_o_pellet').value,
    diameter:document.getElementById('v20_o_diam').value,
    form:document.getElementById('v20_o_form').value,
    purchase:num('v20_o_purchase'),sell:num('v20_o_sell'),
    qty:num('v20_o_qty'),distance:num('v20_o_distance'),rate:num('v20_o_rate')
  };
}
function v20OfferCalc(showStatus=false){
  const x=v20OfferRead();
  const trucks=Math.max(1,x.qty/26);
  const transportTruck=x.distance*2*x.rate;
  const transportTotal=transportTruck*trucks;
  const transportT=x.qty?transportTotal/x.qty:0;
  const c=getCalcV15();
  const extras=Number(c.work||42)+Number(c.bags||37.67)+Number(c.pallet||25)+Number(c.other||0);
  const full=x.purchase+transportT+extras;
  const margin=x.sell-full;
  const marginPct=x.sell?margin/x.sell*100:0;
  const totalCost=full*x.qty,totalMargin=margin*x.qty;
  document.getElementById('v20_k_cost').textContent=fmt(full)+' zł/t';
  document.getElementById('v20_k_sell').textContent=fmt(x.sell)+' zł/t';
  document.getElementById('v20_k_margin').textContent=fmt(margin)+' zł/t';
  document.getElementById('v20_k_pct').textContent=fmt(marginPct)+'%';
  document.getElementById('v20_offer_summary').innerHTML=
    `<strong>${esc(x.supplier)}</strong> • ${esc(x.pellet)} • ${esc(x.diameter)} • ${esc(x.form)} • ${fmt(x.qty,0)} t (${fmt(trucks,0)} samoch.)<br>
     Transport: ${fmt(transportTotal)} zł łącznie • Koszt całej partii: ${fmt(totalCost)} zł • Marża całej partii: <strong>${fmt(totalMargin)} zł</strong>`;
  v20OfferSaveState(x);
  if(showStatus)document.getElementById('v20_offer_status').textContent='✓ OFERTA PRZELICZONA — '+new Date().toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});
  return {...x,trucks,transportTruck,transportTotal,transportT,extras,full,margin,marginPct,totalCost,totalMargin};
}
function v20SavePurchaseOffer(){
  const r=v20OfferCalc();
  let hist=[];try{hist=JSON.parse(localStorage.getItem('lm_purchase_offer_history_v20')||'[]')}catch(e){}
  hist.unshift({...r,savedAt:new Date().toISOString()});
  try{localStorage.setItem('lm_purchase_offer_history_v20',JSON.stringify(hist.slice(0,100)))}catch(e){}
  document.getElementById('v20_offer_status').textContent='✓ OFERTA ZAKUPU ZAPISANA — '+new Date().toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});
  toast('Oferta zakupu zapisana.');
}
function renderOfferV20(){
  const x=v20OfferLoad();
  const app=document.getElementById('app');app.innerHTML='';
  const d=document.createElement('div');d.className='v20-second';
  d.innerHTML=v20Header('OFERTY ZAKUPU PREMIUM','NOWA OFERTA • OPŁACALNOŚĆ • TRANSPORT • ZAPIS')+`
  <div class="v20-body">
    <div class="v20-grid">
      <section class="v20-card">
        <h2><span>1.</span> NOWA OFERTA ZAKUPU</h2>
        <div class="v20-note">Osobny ekran roboczy — bez powtarzania całego Pulpitu. Wszystkie pola są duże i edytowalne.</div>
        <div class="v20-row">
          <div class="v20-field"><label>Data / godzina</label><input id="v20_o_date" class="v20-input" type="datetime-local" value="${x.date}"></div>
          <div class="v20-field"><label>Dostawca</label><select id="v20_o_supplier" class="v20-select">${v20SupplierOptions()}</select></div>
        </div>
        <div class="v20-row">
          <div class="v20-field"><label>Rodzaj pelletu</label><select id="v20_o_pellet" class="v20-select"><option>A1 (ENplus)</option><option>A2 (ENplus)</option><option>Przemysłowy</option></select></div>
          <div class="v20-field"><label>Średnica</label><select id="v20_o_diam" class="v20-select"><option>6 mm</option><option>8 mm</option></select></div>
        </div>
        <div class="v20-row">
          <div class="v20-field"><label>Forma zakupu</label><select id="v20_o_form" class="v20-select"><option>Luzem</option><option>Worki 15 kg</option><option>Big Bag</option><option>Paleta</option></select></div>
          <div class="v20-field"><label>Ilość</label><select id="v20_o_qty" class="v20-select">${v20OfferQtyOptions(x.qty)}</select></div>
        </div>
        <div class="v20-row">
          <div class="v20-field"><label>Cena zakupu netto [PLN/t]</label><input id="v20_o_purchase" class="v20-input" inputmode="decimal" value="${x.purchase}"></div>
          <div class="v20-field"><label>Cena sprzedaży netto [PLN/t]</label><input id="v20_o_sell" class="v20-input" inputmode="decimal" value="${x.sell}"></div>
        </div>
      </section>

      <section class="v20-card">
        <h2><span>2.</span> TRANSPORT DO OFERTY</h2>
        <div class="v20-note">Parametry są zgodne z Kalkulatorem/Transportem i można je szybko zmienić.</div>
        <div class="v20-field"><label>Odległość w jedną stronę [km]</label><input id="v20_o_distance" class="v20-input" inputmode="decimal" value="${x.distance}"></div>
        <div class="v20-field"><label>Stawka transportu [PLN/km]</label><input id="v20_o_rate" class="v20-input" inputmode="decimal" value="${x.rate}"></div>
        <button class="v20-btn orange v20-wide" id="v20_offer_calc">🧮 OBLICZ OPŁACALNOŚĆ</button>
        <button class="v20-btn blue v20-wide" style="margin-top:10px" onclick="go('transport')">🚚 PRZEJDŹ DO TRANSPORTU PREMIUM</button>
      </section>

      <section class="v20-card full">
        <h2><span>3.</span> PODSUMOWANIE OFERTY</h2>
        <div class="v20-kpis">
          <div class="v20-kpi"><span>KOSZT CAŁKOWITY / t</span><b class="orange" id="v20_k_cost">—</b></div>
          <div class="v20-kpi"><span>CENA SPRZEDAŻY</span><b id="v20_k_sell">—</b></div>
          <div class="v20-kpi"><span>MARŻA NETTO / t</span><b class="green" id="v20_k_margin">—</b></div>
          <div class="v20-kpi"><span>MARŻA %</span><b class="green" id="v20_k_pct">—</b></div>
        </div>
        <div class="v20-summary" id="v20_offer_summary">—</div>
        <div class="v20-actions">
          <button class="v20-btn green" id="v20_offer_save">✓ ZAPISZ OFERTĘ ZAKUPU</button>
          <button class="v20-btn blue" onclick="go('offerGenerator')">📄 GENERATOR OFERTY HANDLOWEJ</button>
          <button class="v20-btn gray" onclick="go('home')">← WRÓĆ DO PULPITU</button>
        </div>
        <div class="v20-status" id="v20_offer_status">Gotowy do pracy.</div>
      </section>
    </div>
  </div>`;
  app.appendChild(d);

  document.getElementById('v20_o_supplier').value=x.supplier;
  document.getElementById('v20_o_pellet').value=x.pellet;
  document.getElementById('v20_o_diam').value=x.diameter;
  document.getElementById('v20_o_form').value=x.form;
  document.getElementById('v20_offer_calc').onclick=()=>v20OfferCalc(true);
  document.getElementById('v20_offer_save').onclick=v20SavePurchaseOffer;
  ['v20_o_date','v20_o_supplier','v20_o_pellet','v20_o_diam','v20_o_form','v20_o_qty','v20_o_purchase','v20_o_sell','v20_o_distance','v20_o_rate'].forEach(id=>{
    document.getElementById(id).addEventListener('change',()=>v20OfferCalc(false));
  });
  v20OfferCalc(false);
  window.scrollTo({top:0,left:0,behavior:'auto'});
}


const V29_LANGS={
  pl:{code:'PL',flag:'🇵🇱',title1:'SUPER OFERTA',title2:'NA PELET DRZEWNY PREMIUM A1',strap:'NAJLEPSZA JAKOŚĆ  •  SPRAWDZONE ŹRÓDŁO  •  REALNE KORZYŚCI',sale:'SPRZEDAŻ I DYSTRYBUCJA PELETU DRZEWNEGO',clean:'CZYSTA ENERGIA  •  LEPSZA PRZYSZŁOŚĆ',palette:'PALETA',bags:'WORKI',big:'BIG BAG',perPalette:'/ PALETA',perBag:'/ WOREK 15 KG',perBig:'/ 1 000 KG',quality:'GWARANCJA JAKOŚCI',qualityLines:['100% NATURALNY PRODUKT','BEZ KORY I DODATKÓW CHEMICZNYCH','STABILNA JAKOŚĆ I POWTARZALNE PARAMETRY','CZYSTE SPALANIE • NISKA ZAWARTOŚĆ POPIOŁU','CERTYFIKAT ENplus A1'],delivery:'DOSTAWA — WARUNKI',deliveryLines:['TRANSPORT W CENIE DO 50 KM','POWYŻEJ 50 KM — KOSZT USTALANY INDYWIDUALNIE','TERMIN REALIZACJI: DO 14 DNI'],valid:'OFERTA WAŻNA:',cta:'ZAMÓW JUŻ DZIŚ!',net:'netto'},
  de:{code:'DE',flag:'🇩🇪',title1:'SUPER ANGEBOT',title2:'HOLZPELLETS PREMIUM A1',strap:'BESTE QUALITÄT  •  GEPRÜFTE QUELLE  •  ECHTE VORTEILE',sale:'VERKAUF UND VERTRIEB VON HOLZPELLETS',clean:'SAUBERE ENERGIE  •  BESSERE ZUKUNFT',palette:'PALETTE',bags:'SÄCKE',big:'BIG BAG',perPalette:'/ PALETTE',perBag:'/ SACK 15 KG',perBig:'/ 1 000 KG',quality:'QUALITÄTSGARANTIE',qualityLines:['100% NATÜRLICHES PRODUKT','OHNE RINDE UND CHEMISCHE ZUSÄTZE','STABILE UND WIEDERHOLBARE QUALITÄT','SAUBERE VERBRENNUNG • WENIG ASCHE','ENplus A1 ZERTIFIZIERT'],delivery:'LIEFERUNG — BEDINGUNGEN',deliveryLines:['TRANSPORT BIS 50 KM INKLUSIVE','ÜBER 50 KM — PREIS INDIVIDUELL','LIEFERZEIT: BIS 14 TAGE'],valid:'ANGEBOT GÜLTIG:',cta:'JETZT BESTELLEN!',net:'netto'},
  en:{code:'EN',flag:'🇬🇧',title1:'SUPER OFFER',title2:'PREMIUM A1 WOOD PELLETS',strap:'TOP QUALITY  •  VERIFIED SOURCE  •  REAL BENEFITS',sale:'WOOD PELLET SALES & DISTRIBUTION',clean:'CLEAN ENERGY  •  BETTER FUTURE',palette:'PALLET',bags:'BAGS',big:'BIG BAG',perPalette:'/ PALLET',perBag:'/ 15 KG BAG',perBig:'/ 1,000 KG',quality:'QUALITY GUARANTEE',qualityLines:['100% NATURAL PRODUCT','NO BARK OR CHEMICAL ADDITIVES','STABLE, REPEATABLE PARAMETERS','CLEAN BURNING • LOW ASH','ENplus A1 CERTIFIED'],delivery:'DELIVERY — TERMS',deliveryLines:['TRANSPORT INCLUDED UP TO 50 KM','OVER 50 KM — INDIVIDUAL QUOTE','LEAD TIME: UP TO 14 DAYS'],valid:'OFFER VALID:',cta:'ORDER TODAY!',net:'net'},
  cz:{code:'CZ',flag:'🇨🇿',title1:'SUPER NABÍDKA',title2:'DŘEVĚNÉ PELETY PREMIUM A1',strap:'NEJVYŠŠÍ KVALITA  •  OVĚŘENÝ ZDROJ  •  REÁLNÉ VÝHODY',sale:'PRODEJ A DISTRIBUCE DŘEVĚNÝCH PELET',clean:'ČISTÁ ENERGIE  •  LEPŠÍ BUDOUCNOST',palette:'PALETA',bags:'PYTLE',big:'BIG BAG',perPalette:'/ PALETA',perBag:'/ PYTEL 15 KG',perBig:'/ 1 000 KG',quality:'ZÁRUKA KVALITY',qualityLines:['100% PŘÍRODNÍ PRODUKT','BEZ KŮRY A CHEMICKÝCH PŘÍSAD','STABILNÍ A OPAKOVATELNÁ KVALITA','ČISTÉ SPALOVÁNÍ • NÍZKÝ POPEL','CERTIFIKACE ENplus A1'],delivery:'DOPRAVA — PODMÍNKY',deliveryLines:['DOPRAVA V CENĚ DO 50 KM','NAD 50 KM — INDIVIDUÁLNÍ CENA','DODÁNÍ: DO 14 DNŮ'],valid:'NABÍDKA PLATÍ:',cta:'OBJEDNEJTE DNES!',net:'netto'},
  sk:{code:'SK',flag:'🇸🇰',title1:'SUPER PONUKA',title2:'DREVENÉ PELETY PREMIUM A1',strap:'NAJVYŠŠIA KVALITA  •  OVERENÝ ZDROJ  •  REÁLNE VÝHODY',sale:'PREDAJ A DISTRIBÚCIA DREVENÝCH PELIET',clean:'ČISTÁ ENERGIA  •  LEPŠIA BUDÚCNOSŤ',palette:'PALETA',bags:'VRECIA',big:'BIG BAG',perPalette:'/ PALETA',perBag:'/ VRECE 15 KG',perBig:'/ 1 000 KG',quality:'ZÁRUKA KVALITY',qualityLines:['100% PRÍRODNÝ PRODUKT','BEZ KÔRY A CHEMICKÝCH PRÍSAD','STABILNÁ A OPAKOVATEĽNÁ KVALITA','ČISTÉ SPAĽOVANIE • NÍZKY POPOL','CERTIFIKÁCIA ENplus A1'],delivery:'DOPRAVA — PODMIENKY',deliveryLines:['DOPRAVA V CENE DO 50 KM','NAD 50 KM — INDIVIDUÁLNA CENA','DODANIE: DO 14 DNÍ'],valid:'PONUKA PLATÍ:',cta:'OBJEDNAJTE DNES!',net:'netto'}
};
let V29_ACTIVE_LANG='pl';
function v29Recipients(){
  const out=[];
  (CLIENTS_V13||[]).forEach((x,i)=>out.push({id:'c'+i,kind:'KLIENT',name:x.name||('Klient '+(i+1)),email:x.email||'',phone:x.phone||x.phone2||'',city:x.city||''}));
  try{(getCustomSuppliers()||[]).forEach((x,i)=>out.push({id:'s'+i,kind:'KONTRAHENT',name:x.name||('Dostawca '+(i+1)),email:x.email||'',phone:x.phone||x.mobile||'',city:x.city||''}))}catch(e){}
  return out;
}
function v29RecipientOptions(){return '<option value="">— wybierz odbiorcę —</option>'+v29Recipients().map(x=>`<option value="${esc(x.id)}">${esc(x.kind+' • '+x.name+(x.city?' • '+x.city:''))}</option>`).join('')}
function v29SelectedRecipient(){const id=document.getElementById('v29_recipient')?.value||'';return v29Recipients().find(x=>x.id===id)||null}
function v29FmtDate(v){if(!v)return '';const [y,m,d]=v.split('-');return d+'.'+m+'.'+y}
function v29RoundRect(ctx,x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function v29Text(ctx,txt,x,y,maxW,size,color='#fff',weight='700',align='left'){
  ctx.font=`${weight} ${size}px Arial`;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='middle';
  if(ctx.measureText(txt).width<=maxW){ctx.fillText(txt,x,y);return}
  let s=size;while(s>12&&ctx.measureText(txt).width>maxW){s-=1;ctx.font=`${weight} ${s}px Arial`;}ctx.fillText(txt,x,y);
}
function v29Wrap(ctx,txt,x,y,maxW,lineH,size,color='#fff',weight='700'){
  ctx.font=`${weight} ${size}px Arial`;ctx.fillStyle=color;ctx.textAlign='left';ctx.textBaseline='top';
  const words=txt.split(' ');let line='',yy=y;
  for(const w of words){const t=line?line+' '+w:w;if(ctx.measureText(t).width>maxW&&line){ctx.fillText(line,x,yy);line=w;yy+=lineH}else line=t}if(line)ctx.fillText(line,x,yy);
}
function renderOfferCanvasV29(){
  const c=document.getElementById('v29_offer_canvas');if(!c)return;
  const ctx=c.getContext('2d'),img=document.getElementById('v29_offer_base');if(!img||!img.complete)return;
  ctx.clearRect(0,0,1024,1536);ctx.drawImage(img,0,0,1024,1536);
  const L=V29_LANGS[V29_ACTIVE_LANG]||V29_LANGS.pl;
  const pal=(document.getElementById('v20_g_paleta')?.value||'2100').replace('.',',');
  const bag=(document.getElementById('v20_g_worek')?.value||'25').replace('.',',');
  const big=(document.getElementById('v20_g_bigbag')?.value||'1900').replace('.',',');
  const f=v29FmtDate(document.getElementById('v20_g_from')?.value||'2026-08-14');
  const t=v29FmtDate(document.getElementById('v20_g_to')?.value||'2026-08-21');
  const dark='rgba(2,8,5,.96)',green='#73c41b',gold='#f1aa22',white='#f7f7f5';
  if(V29_ACTIVE_LANG!=='pl'){
    v29RoundRect(ctx,300,18,500,122,10,dark,'#5a683e');
    v29Text(ctx,L.sale,550,48,455,30,white,'800','center');
    v29Text(ctx,L.clean,550,92,455,22,green,'800','center');
    v29RoundRect(ctx,28,145,810,182,12,dark,'#667443');
    v29Text(ctx,L.title1,48,192,750,62,gold,'900','left');
    v29Text(ctx,L.title2,48,252,750,47,white,'900','left');
    v29Text(ctx,L.strap,430,303,730,22,gold,'800','center');
    v29RoundRect(ctx,854,314,154,560,10,'rgba(2,8,5,.98)','#647642');
    v29Text(ctx,L.quality,931,350,135,22,white,'900','center');
    let yy=395;L.qualityLines.forEach(q=>{v29Text(ctx,'✓',870,yy,22,25,green,'900','left');v29Wrap(ctx,q,898,yy-13,100,22,15,white,'800');yy+=87});
    v29RoundRect(ctx,615,930,390,318,10,'rgba(2,8,5,.97)','#647642');
    v29Text(ctx,L.delivery,635,965,340,27,gold,'900','left');yy=1018;L.deliveryLines.forEach(q=>{v29Text(ctx,'✓',635,yy,24,25,green,'900','left');v29Wrap(ctx,q,670,yy-14,305,24,18,white,'800');yy+=78});
    v29RoundRect(ctx,10,1362,1004,164,0,'rgba(2,8,5,.97)',null);
    v29Text(ctx,L.cta,28,1408,460,42,green,'900','left');
    v29Text(ctx,'+48 723 588 333',28,1460,360,31,white,'900','left');
    v29Text(ctx,'lmtechnic@wp.pl',28,1502,360,26,white,'800','left');
  }
  const cells=[{x:14,w:284,label:L.palette,val:pal,sub:L.perPalette},{x:307,w:274,label:L.bags,val:bag,sub:L.perBag},{x:588,w:260,label:L.big,val:big,sub:L.perBig}];
  cells.forEach(o=>{
    v29RoundRect(ctx,o.x,317,o.w,160,8,'rgba(1,9,4,.95)','#5d7935');
    v29Text(ctx,o.label,o.x+o.w/2,347,o.w-25,27,white,'900','center');
    v29Text(ctx,o.val+' zł',o.x+18,405,o.w-95,49,gold,'900','left');
    v29Text(ctx,L.net,o.x+o.w-18,406,78,23,gold,'800','right');
    v29Text(ctx,o.sub,o.x+o.w/2,452,o.w-25,22,white,'800','center');
  });
  v29RoundRect(ctx,15,1268,995,88,7,'rgba(241,170,34,.97)','#ffd15b');
  v29Text(ctx,L.valid,75,1300,210,26,'#111','900','left');
  v29Text(ctx,f+' – '+t,210,1327,380,34,'#111','900','left');
  v29Text(ctx,'NETTO',920,1313,120,25,'#111','900','center');
  document.getElementById('v29_live_lang').textContent=L.flag+' '+L.code;
}
function v29SetLang(k){V29_ACTIVE_LANG=k;document.querySelectorAll('.v29-flag').forEach(b=>b.classList.toggle('active',b.dataset.lang===k));renderOfferCanvasV29()}
function v29CanvasFile(){return new Promise((res,rej)=>{const c=document.getElementById('v29_offer_canvas');c.toBlob(b=>b?res(new File([b],`LM_Oferta_${V29_ACTIVE_LANG}_${Date.now()}.png`,{type:'image/png'})):rej(new Error('blob')),'image/png',.95)})}
async function v29DownloadOffer(){try{const f=await v29CanvasFile(),u=URL.createObjectURL(f),a=document.createElement('a');a.href=u;a.download=f.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);toast('Oferta PNG została przygotowana do pobrania.')}catch(e){toast('Nie udało się przygotować grafiki oferty.')}}
async function v29ShareOffer(){try{const f=await v29CanvasFile();if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[f]}))){await navigator.share({title:'L&M Technic Energy — oferta Premium A1',text:'Oferta handlowa L&M Technic Energy',files:[f]});}else{await v29DownloadOffer();toast('Grafika pobrana — możesz udostępnić ją z galerii/pliku.')}}catch(e){if(e?.name!=='AbortError')toast('Udostępnianie nie zostało uruchomione.')}}
function v29RecipientChanged(){const x=v29SelectedRecipient();document.getElementById('v29_rec_phone').textContent=x?.phone||'brak telefonu w bazie';document.getElementById('v29_rec_email').textContent=x?.email||'brak e-mail w bazie'}
function v29WhatsAppRecipient(){const x=v29SelectedRecipient();if(!x?.phone){toast('Wybrany odbiorca nie ma numeru telefonu w bazie.');return}const n=String(x.phone).replace(/\D/g,'');const msg=encodeURIComponent('Dzień dobry, przesyłam ofertę L&M Technic Energy — Pellet Premium A1.');location.href='https://wa.me/'+n+'?text='+msg}
async function v29EmailRecipient(){const x=v29SelectedRecipient();if(!x?.email){toast('Wybrany odbiorca nie ma adresu e-mail w bazie.');return}await v29DownloadOffer();const L=V29_LANGS[V29_ACTIVE_LANG]||V29_LANGS.pl;const sub=encodeURIComponent('L&M Technic Energy — Pellet Premium A1');const body=encodeURIComponent('Dzień dobry,\n\nprzesyłam aktualną ofertę L&M Technic Energy. Grafika oferty została pobrana na telefon — proszę dołączyć ją do wiadomości.\n\nPozdrawiam,\nL&M Technic Energy');location.href=`mailto:${x.email}?subject=${sub}&body=${body}`}
function renderOfferGeneratorV20(){
  const app=document.getElementById('app');app.innerHTML='';
  const saved=(()=>{try{return JSON.parse(localStorage.getItem('lm_offer_generator_v20')||'{}')}catch(e){return {}}})();
  const d=document.createElement('div');d.className='v20-second';
  d.innerHTML=v20Header('GENERATOR OFERTY','LIVE • CENY • JĘZYKI • ODBIORCY • UDOSTĘPNIANIE')+`
    <div class="v20-body">
      <div class="v22-generator-stack">
        <section class="v20-card v22-generator-top">
          <h2><span>1.</span> GENERATOR OFERTY — PODGLĄD NA ŻYWO</h2>
          <div class="v20-note">Zmiana ceny, daty lub języka natychmiast aktualizuje grafikę MASTER poniżej.</div>
          <div class="v29-langbar">
            <button class="v29-flag active" data-lang="pl" onclick="v29SetLang('pl')"><span class="f">🇵🇱</span>PL</button>
            <button class="v29-flag" data-lang="de" onclick="v29SetLang('de')"><span class="f">🇩🇪</span>DE</button>
            <button class="v29-flag" data-lang="de" onclick="v29SetLang('de')"><span class="f">🇦🇹</span>AT</button>
            <button class="v29-flag" data-lang="de" onclick="v29SetLang('de')"><span class="f">🇨🇭</span>CH</button>
            <button class="v29-flag" data-lang="en" onclick="v29SetLang('en')"><span class="f">🇬🇧</span>EN</button>
            <button class="v29-flag" data-lang="cz" onclick="v29SetLang('cz')"><span class="f">🇨🇿</span>CZ</button>
            <button class="v29-flag" data-lang="sk" onclick="v29SetLang('sk')"><span class="f">🇸🇰</span>SK</button>
          </div>
          <div class="v29-gen-grid">
            <div>
              <div class="v22-generator-fields">
                <div class="v20-field"><label>Cena palety netto</label><input class="v20-input" id="v20_g_paleta" value="${esc(saved.paleta||'2100')}"></div>
                <div class="v20-field"><label>Cena worka 15 kg netto</label><input class="v20-input" id="v20_g_worek" value="${esc(saved.worek||'25')}"></div>
                <div class="v20-field"><label>Cena Big Bag 1000 kg netto</label><input class="v20-input" id="v20_g_bigbag" value="${esc(saved.bigbag||'1900')}"></div>
              </div>
              <div class="v22-generator-dates">
                <div class="v20-field"><label>Oferta ważna od</label><input class="v20-input" type="date" id="v20_g_from" value="${esc(saved.from||'2026-08-14')}"></div>
                <div class="v20-field"><label>Oferta ważna do</label><input class="v20-input" type="date" id="v20_g_to" value="${esc(saved.to||'2026-08-21')}"></div>
              </div>
            </div>
            <div>
              <div class="v20-field"><label>Odbiorca / kontrahent</label><select class="v20-select" id="v29_recipient" onchange="v29RecipientChanged()">${v29RecipientOptions()}</select></div>
              <div class="v29-recipient">
                <div class="v29-contactbox"><span>TELEFON</span><b id="v29_rec_phone">wybierz odbiorcę</b></div>
                <div class="v29-contactbox"><span>E-MAIL</span><b id="v29_rec_email">wybierz odbiorcę</b></div>
              </div>
              <div class="v29-help">Dla odbiorcy z numerem telefonu można otworzyć konkretny czat WhatsApp. E-mail otwiera wiadomość do wybranego adresu. Grafika oferty jest generowana jako PNG gotowy do Facebooka i komunikatorów.</div>
            </div>
          </div>
          <button class="v20-btn green v20-wide" id="v20_g_save">✓ ZAPISZ DANE GENERATORA</button>
          <div class="v20-status" id="v20_g_status">Generator LIVE gotowy.</div>
        </section>

        <section class="v20-card v22-master-below">
          <div class="v29-live-label"><span>2. OFERTA MASTER — PODGLĄD NA ŻYWO</span><span id="v29_live_lang">🇵🇱 PL</span></div>
          <img id="v29_offer_base" src="${V20_OFFER_MASTER_ART}" alt="MASTER" style="display:none">
          <div class="v29-live-wrap"><canvas id="v29_offer_canvas" width="1024" height="1536"></canvas></div>
          <div class="v29-actions">
            <button class="v29-btn green" onclick="v29DownloadOffer()">⬇ POBIERZ PNG</button>
            <button class="v29-btn blue" onclick="v29ShareOffer()">↗ UDOSTĘPNIJ / FACEBOOK</button>
            <button class="v29-btn green" onclick="v29WhatsAppRecipient()">💬 WHATSAPP DO ODBIORCY</button>
            <button class="v29-btn orange" onclick="v29EmailRecipient()">✉ E-MAIL DO ODBIORCY</button>
            <button class="v29-btn purple" onclick="v29ShareOffer()">📲 UDOSTĘPNIJ SYSTEMOWO</button>
            <button class="v29-btn gray" onclick="go('history')">🗂 HISTORIA DOKUMENTÓW</button>
          </div>
        </section>
      </div>
    </div>`;
  app.appendChild(d);
  const base=document.getElementById('v29_offer_base');base.onload=renderOfferCanvasV29;
  ['v20_g_paleta','v20_g_worek','v20_g_bigbag','v20_g_from','v20_g_to'].forEach(id=>{document.getElementById(id).addEventListener('input',renderOfferCanvasV29);document.getElementById(id).addEventListener('change',renderOfferCanvasV29)});
  document.getElementById('v20_g_save').onclick=()=>{
    const x={paleta:document.getElementById('v20_g_paleta').value,worek:document.getElementById('v20_g_worek').value,bigbag:document.getElementById('v20_g_bigbag').value,from:document.getElementById('v20_g_from').value,to:document.getElementById('v20_g_to').value,lang:V29_ACTIVE_LANG};
    try{localStorage.setItem('lm_offer_generator_v20',JSON.stringify(x))}catch(e){}
    document.getElementById('v20_g_status').textContent='✓ DANE GENERATORA ZAPISANE — '+new Date().toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});
  };
  window.scrollTo({top:0,left:0,behavior:'auto'});
}

function renderInvoicesV20(){
  const app=document.getElementById('app');app.innerHTML='';
  const d=document.createElement('div');d.className='v20-second';
  d.innerHTML=v20Header('FAKTURY','FAKTURA • PROFORMA • DOKUMENTY SPRZEDAŻY')+`
    <div class="v20-body">
      <div class="v20-card full">
        <h2><span>1.</span> MODUŁ FAKTURY</h2>
        <div class="v20-placeholder">
          <div><b>🧾 FAKTURY</b><p>Osobny drugi ekran jest już przygotowany.<br>
          Wzoru faktury nie wymyślam samodzielnie — zbudujemy go dokładnie według ustalonego przez nas standardu L&M, gdy zatwierdzimy jego wygląd i pola.</p></div>
        </div>
        <div class="v20-actions">
          <button class="v20-btn green" onclick="toast('Moduł faktury gotowy do kolejnego etapu projektu.')">NOWA FAKTURA</button>
          <button class="v20-btn blue" onclick="toast('Moduł proforma gotowy do kolejnego etapu projektu.')">PROFORMA</button>
          <button class="v20-btn gray" onclick="go('home')">← WRÓĆ DO PULPITU</button>
        </div>
      </div>
    </div>`;
  app.appendChild(d);
  window.scrollTo({top:0,left:0,behavior:'auto'});
}

const goV15Base=go;

const V30_APP_VERSION='V31.2.7';
let V30_installPrompt=null;
let V30_updateReady=false;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();V30_installPrompt=e;});
window.addEventListener('appinstalled',()=>{V30_installPrompt=null;try{localStorage.setItem('lm_v30_installed','1')}catch(e){}});
function v30IsStandalone(){return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true;}
async function v30GetRegistration(){
  if(!('serviceWorker' in navigator))return null;
  try{
    let reg=await navigator.serviceWorker.getRegistration('./');
    if(!reg)reg=await navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'});
    return reg;
  }catch(e){return null;}
}
function v30ActionStatus(msg){const el=document.getElementById('v30_action_status');if(el)el.textContent=msg;toast(msg)}
async function v30ServerVersion(){
  const r=await fetch('./version.json?ts='+Date.now(),{cache:'no-store'});
  if(!r.ok)throw new Error('version http '+r.status);
  return await r.json();
}
function v30WaitWorker(reg,timeout=20000){
  return new Promise(resolve=>{
    let done=false;
    const finish=(w)=>{if(done)return;done=true;clearTimeout(timer);resolve(w||null)};
    const inspect=()=>{
      if(reg.waiting)return finish(reg.waiting);
      const sw=reg.installing;
      if(sw){
        if(sw.state==='installed')return finish(reg.waiting||sw);
        if(sw.state==='redundant')return finish(null);
        sw.addEventListener('statechange',()=>{
          if(sw.state==='installed')finish(reg.waiting||sw);
          else if(sw.state==='redundant')finish(null);
        });
      }
    };
    const timer=setTimeout(()=>finish(reg.waiting||null),timeout);
    reg.addEventListener('updatefound',inspect,{once:true});
    inspect();
  });
}
async function v30CheckUpdate(showToast=true){
  if(location.protocol==='file:' || location.protocol==='content:'){if(showToast)v30ActionStatus('Aktualizacje działają po otwarciu aplikacji z adresu HTTPS.');return false;}
  try{
    if(showToast)v30ActionStatus('Sprawdzam wersję na serwerze…');
    const [reg,info]=await Promise.all([v30GetRegistration(),v30ServerVersion()]);
    if(!reg){if(showToast)v30ActionStatus('Service Worker nie jest aktywny — odśwież aplikację i spróbuj ponownie.');return false;}
    const newer=!!(info.version && info.version!==V30_APP_VERSION);
    if(newer){
      try{await reg.update();}catch(e){}
      V30_updateReady=true;
      if(showToast)v30ActionStatus('Dostępna wersja '+info.version+'. Naciśnij UAKTUALNIJ APLIKACJĘ.');
      return true;
    }
    if(reg.waiting){V30_updateReady=true;if(showToast)v30ActionStatus('Nowa wersja jest już pobrana. Naciśnij UAKTUALNIJ APLIKACJĘ.');return true;}
    if(showToast)v30ActionStatus('Masz najnowszą wersję '+V30_APP_VERSION+'.');
    return false;
  }catch(e){if(showToast)v30ActionStatus('Nie udało się sprawdzić aktualizacji. Sprawdź internet i spróbuj ponownie.');return false;}
}
async function v30UpdateNow(){
  if(location.protocol==='file:' || location.protocol==='content:'){v30ActionStatus('Aktualizacja wymaga wersji uruchomionej z HTTPS.');return;}
  v30ActionStatus('Pobieram nową wersję… nie zamykaj aplikacji.');
  const reg=await v30GetRegistration();
  if(!reg){v30ActionStatus('Brak aktywnego mechanizmu aktualizacji.');return;}
  try{
    const info=await v30ServerVersion();
    if(info.version===V30_APP_VERSION && !reg.waiting){v30ActionStatus('Aplikacja jest już aktualna: '+V30_APP_VERSION+'.');return;}
    await reg.update();
    let worker=reg.waiting || await v30WaitWorker(reg,22000);
    worker=reg.waiting || worker;
    if(worker){
      v30ActionStatus('Nowa wersja pobrana. Aktywuję ją teraz…');
      let reloaded=false;
      const reload=()=>{if(reloaded)return;reloaded=true;location.reload();};
      navigator.serviceWorker.addEventListener('controllerchange',reload,{once:true});
      try{worker.postMessage({type:'SKIP_WAITING'});}catch(e){}
      setTimeout(reload,1800);
      return;
    }
    // Bezpieczny fallback: usuwa tylko rejestrację SW, NIE usuwa danych lokalnych/klientów/faktur.
    v30ActionStatus('Odświeżam mechanizm aktualizacji — Twoje dane lokalne pozostają bez zmian…');
    await reg.unregister();
    setTimeout(()=>location.replace('./?refresh='+Date.now()),500);
  }catch(e){
    v30ActionStatus('Aktualizacja nie została dokończona. Dane aplikacji są bezpieczne — spróbuj ponownie za chwilę.');
  }
}
async function v30Install(){
  if(v30IsStandalone()){v30ActionStatus('Aplikacja jest już zainstalowana na telefonie.');return;}
  if(location.protocol==='file:' || location.protocol==='content:'){v30ActionStatus('Instalacja wymaga otwarcia aplikacji z adresu HTTPS.');return;}
  if(V30_installPrompt){V30_installPrompt.prompt();const choice=await V30_installPrompt.userChoice;if(choice.outcome==='accepted')v30ActionStatus('Instalacja rozpoczęta.');else v30ActionStatus('Instalacja została anulowana.');V30_installPrompt=null;return;}
  v30ActionStatus('Jeżeli okno instalacji się nie pojawia: Chrome ⋮ → Zainstaluj aplikację / Dodaj do ekranu głównego.');
}
async function v30RefreshApp(){
  v30ActionStatus('Odświeżam aplikację i sprawdzam pliki…');
  try{const reg=await v30GetRegistration();if(reg)await reg.update();await fetch('./version.json?ts='+Date.now(),{cache:'no-store'});}catch(e){}
  setTimeout(()=>location.reload(),500);
}
function renderSettingsV30(){
  const app=document.getElementById('app');app.innerHTML='';
  const d=document.createElement('div');d.className='v30-settings';
  const installed=v30IsStandalone();
  d.innerHTML=`<div class="v30-set-head"><div class="v30-set-brand">L&M<small>TECHNIC ENERGY</small></div><div class="v30-set-title"><h1>USTAWIENIA APLIKACJI</h1><p>INSTALACJA • WERSJA • AKTUALIZACJE</p></div><button class="v30-set-back" onclick="go('home')">← PULPIT</button></div><div class="v30-set-body">
    <section class="v30-set-card"><img class="v30-app-icon" src="./icon-512.png" alt="Ikona L&M Technic Energy"><h2>EUROPEJSKI KALKULATOR PELETU 1.2 PREMIUM</h2><p>Wersja instalowana V31.2.7 — STATUS FIRMY CRM MASTER + RYNKI EU + FAKTURY PREMIUM. Moduł RYNKI EU działa jako żywa baza kontrahentów, pobiera świeży plik danych bez przebudowy aplikacji, zachowuje działanie offline oraz wszystkie zatwierdzone poprawki faktur. Po instalacji ikona L&M będzie wyświetlana jako samodzielna aplikacja — bez znaczka Chrome.</p><div style="clear:both"></div><div class="v30-set-status"><div class="v30-set-stat"><span>WERSJA</span><b>${V30_APP_VERSION}</b></div><div class="v30-set-stat"><span>TRYB</span><b class="green">${installed?'ZAINSTALOWANA':'PRZEGLĄDARKA'}</b></div><div class="v30-set-stat"><span>AKTUALIZACJE</span><b class="green">AUTOMATYCZNE + RĘCZNE</b></div></div><div class="v30-set-actions"><button type="button" id="v30_install_btn" class="v30-set-btn blue">⬇ ZAINSTALUJ APLIKACJĘ</button><button type="button" id="v30_update_btn" class="v30-set-btn green">↻ UAKTUALNIJ APLIKACJĘ</button></div><div class="v30-update-note">Po każdej kolejnej modernizacji opublikujemy nową wersję na tym samym adresie. Przycisk UAKTUALNIJ sprawdzi i pobierze nową wersję bez ponownego tworzenia skrótu.</div><div id="v30_action_status" class="v30-action-status">Przyciski gotowe. Możesz sprawdzić wersję lub uruchomić aktualizację.</div></section>
    <section class="v30-set-card"><h2>SPRAWDZANIE WERSJI</h2><p>Aplikacja sprawdza aktualizacje przy uruchomieniu oraz na żądanie.</p><div class="v30-set-actions"><button type="button" id="v30_check_btn" class="v30-set-btn gray">🔎 SPRAWDŹ AKTUALIZACJĘ</button><button type="button" id="v30_refresh_btn" class="v30-set-btn gray">⟳ ODŚWIEŻ APLIKACJĘ</button></div></section>
  </div>`;
  app.appendChild(d);
  const bind=(id,fn)=>{const el=document.getElementById(id);if(el){el.onclick=null;el.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();fn();},{passive:false});}};
  bind('v30_install_btn',v30Install);bind('v30_update_btn',v30UpdateNow);bind('v30_check_btn',()=>v30CheckUpdate(true));bind('v30_refresh_btn',v30RefreshApp);
  window.scrollTo({top:0,left:0,behavior:'auto'});
}
if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  navigator.serviceWorker.register('./service-worker.js').then(reg=>{
    reg.addEventListener('updatefound',()=>{const nw=reg.installing;if(nw)nw.addEventListener('statechange',()=>{if(nw.state==='installed' && navigator.serviceWorker.controller){V30_updateReady=true;toast('Nowa wersja gotowa — wejdź w USTAWIENIA i naciśnij UAKTUALNIJ.');}})});
    setTimeout(()=>v30CheckUpdate(false),2500);
  }).catch(()=>{});
  navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload());
}


/* ===== V31.1 — RYNKI EU LIVE ===== */
const EU31_DATA_URL='./contractors-eu.json';
const EU31_CACHE_KEY='lm_eu_contractors_cache_v1';
const EU31_COUNTRY_ORDER=['PL','DE','CZ','SK','AT','CH','LT','IT','FR','NL','BE','DK'];
const EU31_COUNTRY_NAMES={PL:'Polska',DE:'Niemcy',CZ:'Czechy',SK:'Słowacja',AT:'Austria',CH:'Szwajcaria',LT:'Litwa',IT:'Włochy',FR:'Francja',NL:'Holandia',BE:'Belgia',DK:'Dania'};
const EU31_STATE={db:null,country:null,filter:'all',q:'',syncing:false};

function eu31Esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function eu31Norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function eu31DateOnly(s){if(!s)return '—';const d=new Date(s);return Number.isNaN(d.getTime())?String(s).slice(0,10):d.toLocaleDateString('pl-PL');}
function eu31IsNew(x){const d=new Date(x.date_added||x.date_updated||0);return !Number.isNaN(d)&&((Date.now()-d.getTime())<=7*86400000);}
function eu31CountryName(c){return EU31_COUNTRY_NAMES[c]||c;}
function eu31Flag(code,cls=''){
  let inner='';
  if(code==='PL')inner='<rect width="120" height="42" fill="#fff"/><rect y="42" width="120" height="42" fill="#dc143c"/>';
  else if(code==='DE')inner='<rect width="120" height="28" fill="#050505"/><rect y="28" width="120" height="28" fill="#dd0000"/><rect y="56" width="120" height="28" fill="#ffce00"/>';
  else if(code==='AT')inner='<rect width="120" height="28" fill="#ed2939"/><rect y="28" width="120" height="28" fill="#fff"/><rect y="56" width="120" height="28" fill="#ed2939"/>';
  else if(code==='CH')inner='<rect width="120" height="84" fill="#d52b1e"/><rect x="51" y="17" width="18" height="50" fill="#fff"/><rect x="35" y="33" width="50" height="18" fill="#fff"/>';
  else if(code==='LT')inner='<rect width="120" height="28" fill="#fdb913"/><rect y="28" width="120" height="28" fill="#006a44"/><rect y="56" width="120" height="28" fill="#c1272d"/>';
  else if(code==='IT')inner='<rect width="40" height="84" fill="#009246"/><rect x="40" width="40" height="84" fill="#fff"/><rect x="80" width="40" height="84" fill="#ce2b37"/>';
  else if(code==='FR')inner='<rect width="40" height="84" fill="#0055a4"/><rect x="40" width="40" height="84" fill="#fff"/><rect x="80" width="40" height="84" fill="#ef4135"/>';
  else if(code==='NL')inner='<rect width="120" height="28" fill="#ae1c28"/><rect y="28" width="120" height="28" fill="#fff"/><rect y="56" width="120" height="28" fill="#21468b"/>';
  else if(code==='BE')inner='<rect width="40" height="84" fill="#111"/><rect x="40" width="40" height="84" fill="#ffd90c"/><rect x="80" width="40" height="84" fill="#ef3340"/>';
  else if(code==='DK')inner='<rect width="120" height="84" fill="#c60c30"/><rect x="37" width="9" height="84" fill="#fff"/><rect y="37" width="120" height="9" fill="#fff"/>';
  else if(code==='CZ')inner='<rect width="120" height="42" fill="#fff"/><rect y="42" width="120" height="42" fill="#d7141a"/><polygon points="0,0 58,42 0,84" fill="#11457e"/>';
  else if(code==='SK')inner='<rect width="120" height="28" fill="#fff"/><rect y="28" width="120" height="28" fill="#0b4ea2"/><rect y="56" width="120" height="28" fill="#ee1c25"/><path d="M25 22 h28 v34 q-14 16-28 0z" fill="#ee1c25" stroke="#fff" stroke-width="3"/><path d="M39 29 v21 M30 36 h18 M33 43 h12" stroke="#fff" stroke-width="3"/>';
  else inner='<rect width="120" height="84" fill="#163e2c"/><text x="60" y="52" text-anchor="middle" fill="#eab532" font-size="28">'+eu31Esc(code)+'</text>';
  const big=String(cls||'').includes('big');
  return `<div class="eu31-flagbox ${cls}"><svg viewBox="0 0 120 84" role="img" aria-label="Flaga ${eu31Esc(eu31CountryName(code))}">
  <defs>
    <linearGradient id="shine${code}${big?'B':'S'}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".48"/><stop offset=".42" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient>
    <filter id="wave${code}${big?'B':'S'}" x="-10%" y="-15%" width="120%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.035" numOctaves="1" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="${big?7:4}" xChannelSelector="R" yChannelSelector="G"/></filter>
  </defs>
  <g filter="url(#wave${code}${big?'B':'S'})">${inner}<rect width="120" height="84" fill="url(#shine${code}${big?'B':'S'})"/></g>
  </svg></div>`;
}
function eu31Fallback(){return {version:'offline',generated_at:null,contractors:[],countries:EU31_COUNTRY_ORDER};}
async function eu31Load(force=false){
  if(EU31_STATE.syncing)return EU31_STATE.db||eu31Fallback();EU31_STATE.syncing=true;
  let local=null;try{local=JSON.parse(localStorage.getItem(EU31_CACHE_KEY)||'null')}catch(e){}
  try{
    const r=await fetch(EU31_DATA_URL+'?ts='+(force?Date.now():Math.floor(Date.now()/900000)),{cache:'no-store'});
    if(!r.ok)throw new Error('HTTP '+r.status);const db=await r.json();
    if(!Array.isArray(db.contractors))throw new Error('Nieprawidłowy format bazy');
    EU31_STATE.db=db;try{localStorage.setItem(EU31_CACHE_KEY,JSON.stringify(db))}catch(e){}
  }catch(e){EU31_STATE.db=local||eu31Fallback();}
  EU31_STATE.syncing=false;return EU31_STATE.db;
}
function eu31Counts(code){const arr=(EU31_STATE.db?.contractors||[]).filter(x=>x.country===code);return {all:arr.length,sup:arr.filter(x=>x.type==='supplier').length,cli:arr.filter(x=>x.type==='client').length,new:arr.filter(eu31IsNew).length};}
function eu31Filtered(code){let a=(EU31_STATE.db?.contractors||[]).filter(x=>x.country===code);if(EU31_STATE.filter==='supplier')a=a.filter(x=>x.type==='supplier');if(EU31_STATE.filter==='client')a=a.filter(x=>x.type==='client');const q=eu31Norm(EU31_STATE.q);if(q)a=a.filter(x=>eu31Norm([x.company,x.city,x.product,x.contact_person,x.phone,x.email,x.status].join(' ')).includes(q));return a.sort((a,b)=>(eu31IsNew(b)-eu31IsNew(a))||String(a.company).localeCompare(String(b.company),'pl'));}
function eu31Nav(){const cls=EU31_STATE.country?'country-master':'home-master';return `<div class="eu31-bottom ${cls}"><button class="eu31-nav" onclick="go('home')"><span class="i">⌂</span>START</button><button class="eu31-nav" onclick="go('suppliers')"><span class="i">🤝</span>DOSTAWCY</button><button class="eu31-nav active" onclick="go('marketsEU')"><span class="i">◎</span>RYNKI EU</button><button class="eu31-nav" onclick="go('settings')"><span class="i">⚙</span>USTAWIENIA</button></div>`;}
function eu31Shell(sub){return `<div class="eu31-top"><button class="eu31-topbtn eu31-back" onclick="${EU31_STATE.country?"eu31Home()":"go('home')"}">←</button><img class="eu31-logo" src="./assets/embedded-34-45708673804e.png" alt="L&M Technic Energy"><button class="eu31-topbtn eu31-searchbtn" onclick="document.querySelector('.eu31-search input')?.focus()">⌕</button><button class="eu31-topbtn eu31-gear" onclick="go('settings')">⚙</button></div><div class="eu31-hero"><h1 class="eu31-title">RYNKI EUROPY</h1><div class="eu31-subtitle">${sub}</div></div>`;}
function eu31OverviewShell(){return `<div class="eu31-overview-hero"><h1 class="eu31-overview-title">RYNKI EUROPY</h1><div class="eu31-overview-sub">Baza kontrahentów L&amp;M Technic Energy</div></div>`;}
function eu31InputHandler(el){EU31_STATE.q=el.value;if(EU31_STATE.country)eu31Country(EU31_STATE.country,false);else eu31Home(false);}
function eu31SetFilter(f){EU31_STATE.filter=f;if(EU31_STATE.country)eu31Country(EU31_STATE.country,false);else eu31Home(false);}
function eu31Filters(){return `<div class="eu31-filters"><button class="eu31-filter ${EU31_STATE.filter==='all'?'active':''}" onclick="eu31SetFilter('all')">WSZYSCY</button><button class="eu31-filter ${EU31_STATE.filter==='client'?'active':''}" onclick="eu31SetFilter('client')">KLIENCI</button><button class="eu31-filter ${EU31_STATE.filter==='supplier'?'active':''}" onclick="eu31SetFilter('supplier')">DOSTAWCY</button></div>`;}
function eu31Countries(){const set=new Set(EU31_COUNTRY_ORDER);for(const x of EU31_STATE.db?.contractors||[])if(x.country)set.add(x.country);return [...set].sort((a,b)=>{const ia=EU31_COUNTRY_ORDER.indexOf(a),ib=EU31_COUNTRY_ORDER.indexOf(b);return (ia<0?999:ia)-(ib<0?999:ib)});}
function eu31Home(render=true){
  EU31_STATE.country=null;if(render===true)EU31_STATE.q='';const db=EU31_STATE.db||eu31Fallback();const codes=eu31Countries();
  const filteredCodes=codes.filter(code=>{if(!EU31_STATE.q)return true;const q=eu31Norm(EU31_STATE.q);return eu31Norm(eu31CountryName(code)).includes(q)||eu31Filtered(code).length>0});
  const all=db.contractors||[], new7=all.filter(eu31IsNew).length, activeCountries=new Set(all.map(x=>x.country)).size;
  const app=document.getElementById('app');app.innerHTML='';const root=document.createElement('div');root.className='eu31 eu31-overview-page';
  root.innerHTML=eu31OverviewShell()+`<div class="eu31-wrap"><div class="eu31-summary"><div class="eu31-stat"><span class="eu31-stat-ico">◎</span><div>Państwa:<b> ${activeCountries}</b><small>z danymi w bazie</small></div></div><div class="eu31-stat"><span class="eu31-stat-ico">▦</span><div>Firmy:<b> ${all.length}</b><small>rekordów LIVE</small></div></div><div class="eu31-stat"><span class="eu31-stat-ico">✣</span><div>Nowe dziś:<b> ${all.filter(x=>{const d=new Date(x.date_added||0);return !Number.isNaN(d)&&new Date().toDateString()===d.toDateString()}).length}</b><small>ostatnie 7 dni: ${new7}</small></div></div><div class="eu31-stat"><span class="eu31-stat-ico">↻</span><div>Aktualizacja:<b> ${eu31DateOnly(db.generated_at)}</b><small>${eu31Esc(db.version||'offline')}</small></div></div></div><div class="eu31-search"><span class="mag">⌕</span><input value="${eu31Esc(EU31_STATE.q)}" oninput="eu31InputHandler(this)" placeholder="Szukaj kraju lub firmy..."></div>${eu31Filters()}<div class="eu31-country-grid">${filteredCodes.map(code=>{const c=eu31Counts(code);return `<button class="eu31-country" onclick="eu31Country('${code}',true)">${eu31Flag(code)}<div><h3>${eu31Esc(eu31CountryName(code))}</h3><p>${c.all} kontrahentów</p>${c.new?`<span class="eu31-newtag">NOWE ${c.new}</span>`:''}</div></button>`}).join('')}</div><button class="eu31-recent" onclick="EU31_STATE.q='';EU31_STATE.filter='all';eu31ShowRecent()"><div><strong>NOWI KONTRAHENCI — OSTATNIE 7 DNI</strong><span>${new7} nowych firm w ${new Set(all.filter(eu31IsNew).map(x=>x.country)).size} krajach</span></div><span class="arrow">›</span></button><div class="eu31-syncbar">↻ AUTOMATYCZNA AKTUALIZACJA Z BAZY KONTRAHENTÓW • ${eu31Esc(db.version||'OFFLINE')}</div></div>${eu31Nav()}`;
  app.appendChild(root);lmAutoFit(root,941);window.scrollTo({top:0,left:0,behavior:'auto'});
}
function eu31Role(x){return x.type==='supplier'?'Dostawca':x.type==='client'?'Klient':'Kontakt';}

const EU31_CITY_CRESTS={
  'Gdańsk':'./assets/embedded-35-249ccc4abc4f.png',
  'Kielce':'./assets/embedded-36-6d8017ec071a.png',
  'Krasocin':'./assets/embedded-37-dcbd3f72fb8d.svg',
  'Berlin':'./assets/embedded-38-8f71b98937b9.png',
  'Hamburg':'./assets/embedded-39-f69f48f54df4.png',
  'Monachium':'./assets/embedded-40-22b667fee466.png',
  'München':'./assets/embedded-40-22b667fee466.png'
};

function eu31Crest(x){const src=x.crest||EU31_CITY_CRESTS[x.city]||'';const code=(x.crest_text||String(x.city||'?').split(/\s+/).map(z=>z[0]).join('').slice(0,3).toUpperCase());return `<div class="eu31-crest">${src?`<img src="${eu31Esc(src)}" alt="Herb ${eu31Esc(x.city||'miasta')}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">`:''}<span>${eu31Esc(code)}</span></div>`;}
function eu31Company(x){const tag=eu31IsNew(x)?'<span class="eu31-newtag">NOWY</span>':'';return `<div class="eu31-company">${eu31Crest(x)}<div><h3>${eu31Esc(x.company)} ${tag}</h3><div class="eu31-info">⌖ ${eu31Esc(x.city||'—')} &nbsp; | &nbsp; <span class="eu31-role">${x.type==='supplier'?'▣':'♙'} ${eu31Esc(eu31Role(x))}</span></div><div class="eu31-info">◇ ${eu31Esc(x.product||'Pellet / współpraca B2B')}</div></div><div class="eu31-actions"><button class="eu31-action phone" aria-label="Zadzwoń" onclick="eu31Call('${eu31Esc(x.id)}')"><svg viewBox="0 0 64 64" aria-hidden="true"><path class="svg-fill" d="M15 8l10 15-7 8c6 11 14 19 25 25l8-7 15 10c2 2 2 5 0 7l-6 7c-4 5-11 6-17 3C24 66 7 49-3 30c-3-6-2-13 3-17l7-6c2-2 6-1 8 1z" transform="translate(5 -5) scale(.82)"/></svg></button><button class="eu31-action map" aria-label="Mapa" onclick="eu31Map('${eu31Esc(x.id)}')"><svg viewBox="0 0 64 64" aria-hidden="true"><path class="svg-fill" d="M32 5c-12 0-22 9-22 21 0 17 22 34 22 34s22-17 22-34C54 14 44 5 32 5zm0 30a9 9 0 1 1 0-18 9 9 0 0 1 0 18z"/></svg></button><button class="eu31-action details" aria-label="CRM / szczegóły" onclick="eu31Details('${eu31Esc(x.id)}')"><svg viewBox="0 0 64 64" aria-hidden="true"><circle class="svg-fill" cx="12" cy="16" r="4"/><circle class="svg-fill" cx="12" cy="32" r="4"/><circle class="svg-fill" cx="12" cy="48" r="4"/><path class="svg-stroke" d="M24 16h30M24 32h30M24 48h30"/></svg></button></div></div>`;}
function eu31Country(code,reset=true){
  EU31_STATE.country=code;if(reset){EU31_STATE.q='';EU31_STATE.filter='all'}const c=eu31Counts(code),db=EU31_STATE.db||eu31Fallback(),arr=eu31Filtered(code);const app=document.getElementById('app');app.innerHTML='';const root=document.createElement('div');root.className='eu31 eu31-country-page';
  root.innerHTML=eu31Shell('Baza kontrahentów — '+eu31CountryName(code))+`<div class="eu31-wrap"><div class="eu31-country-head"><div>${eu31Flag(code,'big')}</div><div class="counts"><h2>${eu31Esc(eu31CountryName(code).toUpperCase())}</h2><p><i>♙</i>${c.all} kontrahentów</p><p><i>▣</i>${c.sup} dostawców</p><p><i>♙</i>${c.cli} klientów</p></div><div class="eu31-country-meta"><div><span class="ico">✣</span>Nowe dziś: <b>${(db.contractors||[]).filter(x=>x.country===code&&new Date(x.date_added||0).toDateString()===new Date().toDateString()).length}</b></div><div><span class="ico">↻</span>Aktualizacja:<br><b>${eu31DateOnly(db.generated_at)}</b></div></div></div><div class="eu31-search"><span class="mag">⌕</span><input value="${eu31Esc(EU31_STATE.q)}" oninput="eu31InputHandler(this)" placeholder="Szukaj firmy w ${eu31Esc(eu31CountryName(code))}..."></div>${eu31Filters()}<div class="eu31-list">${arr.length?arr.map(eu31Company).join(''):`<div class="eu31-empty"><b>Brak rekordów w tej kategorii</b>Baza jest gotowa do automatycznego uzupełnienia po publikacji kolejnych danych kontrahentów.</div>`}</div><div class="eu31-syncbar">↻ AUTOMATYCZNA AKTUALIZACJA Z BAZY KONTRAHENTÓW</div></div>${eu31Nav()}`;
  app.appendChild(root);lmAutoFit(root,941);window.scrollTo({top:0,left:0,behavior:'auto'});
}
function eu31ById(id){return (EU31_STATE.db?.contractors||[]).find(x=>String(x.id)===String(id));}
function eu31Call(id){const x=eu31ById(id);if(!x?.phone)return toast('Brak numeru telefonu — otwórz szczegóły firmy.');location.href='tel:'+String(x.phone).replace(/[^+0-9]/g,'');}
function eu31Map(id){const x=eu31ById(id);if(!x)return;const q=[x.company,x.address,x.city,eu31CountryName(x.country)].filter(Boolean).join(', ');window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q),'_blank','noopener');}
function eu31Details(id){
  if(typeof window.eu32OpenCRM==='function')return window.eu32OpenCRM(id);
  const x=eu31ById(id);if(!x)return;const m=document.createElement('div');m.className='eu31-modal';m.onclick=e=>{if(e.target===m)m.remove()};m.innerHTML=`<div class="eu31-modal-card"><h2>${eu31Esc(x.company)}</h2><div class="eu31-modal-row"><b>Kraj / miasto:</b> ${eu31Esc(eu31CountryName(x.country))} • ${eu31Esc(x.city||'—')}</div><div class="eu31-modal-row"><b>Typ:</b> ${eu31Esc(eu31Role(x))} • <b>Status:</b> ${eu31Esc(x.status||'—')}</div><div class="eu31-modal-actions"><button class="gold" onclick="eu31Call('${eu31Esc(x.id)}')">☎ ZADZWOŃ</button><button class="gold" onclick="eu31Map('${eu31Esc(x.id)}')">⌖ MAPA DOJAZDU</button><button onclick="this.closest('.eu31-modal').remove()">ZAMKNIJ</button></div></div>`;document.body.appendChild(m);
}
function eu31ShowRecent(){const all=(EU31_STATE.db?.contractors||[]).filter(eu31IsNew);const code=all[0]?.country||'PL';EU31_STATE.country=code;EU31_STATE.q='';EU31_STATE.filter='all';eu31Country(code,false);toast('Pokazuję najnowsze rekordy — użyj wyszukiwarki lub wybierz kraj.');}
async function renderMarketsEU(){const app=document.getElementById('app');app.innerHTML='<div class="eu31" style="display:flex;align-items:center;justify-content:center;height:100vh;color:#f1b228;font-size:30px">ŁADOWANIE BAZY RYNKI EU…</div>';await eu31Load(true);eu31Home(true);}
setInterval(()=>{if(EU31_STATE.db)eu31Load(true).then(()=>{if(EU31_STATE.country)eu31Country(EU31_STATE.country,false);});},15*60*1000);


go=function(name){
  if(name==='home')return v21Home();
  if(name==='marketsEU')return renderMarketsEU();
  if(name==='settings')return renderSettingsV30();
  if(name==='businessplan')return renderBusinessPlanV23();
  if(name==='history')return renderHistoryV26();
  if(name==='offer')return renderOfferV20();
  if(name==='offerGenerator')return renderOfferGeneratorV20();
  if(name==='invoices')return renderInvoicesV20();
  if(name==='calculator')return renderCalculatorV15();
  if(name==='currencies')return renderCurrenciesV15();
  if(name==='map')return renderMapV15();
  if(name==='transport')return renderTransportV18();
  return goV15Base(name);
};


/* ===== V19 — ZIELONE PODŚWIETLENIE DOTYKU BEZ BRZYDKIEJ RAMKI ===== */
(function(){
  function greenPress(el){
    if(!el)return;
    el.classList.add('lm-green-press');
    clearTimeout(el.__lmGreenTimer);
    el.__lmGreenTimer=setTimeout(()=>el.classList.remove('lm-green-press'),260);
  }
  document.addEventListener('pointerdown',function(e){
    const b=e.target.closest('.hot,.cli-hot,.sup-v10 .sup-hot,.v20-home-module');
    if(b)greenPress(b);
  },true);
  document.addEventListener('touchstart',function(e){
    const b=e.target.closest('.hot,.cli-hot,.sup-v10 .sup-hot,.v20-home-module');
    if(b)greenPress(b);
  },{capture:true,passive:true});
})();

function lmStartApp(){
  if(window.__lmAppStarted)return;
  window.__lmAppStarted=true;
  try{go('home');}
  catch(e){
    console.error('STARTUP',e);
    setTimeout(()=>{try{go('home')}catch(_){}},60);
  }
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',lmStartApp,{once:true});
}else{
  lmStartApp();
}
