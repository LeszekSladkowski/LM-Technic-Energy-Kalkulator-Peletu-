/* L&M Technic Energy — STATUS FIRMY CRM MASTER V31.2.2 — 20.08.2026 */
(function(){
'use strict';
const STATUS_KEY='lm_eu_crm_status_v32';
const SELECT_KEY='lm_eu_crm_selected_v32';
const MSG_URL='./assistant-messages.json';
const STATUS_LIST=['NOWY','AKTYWNY','DO KONTAKTU','KONTAKT NAWIĄZANY','KLIENT ZATWIERDZONY','DOSTAWCA ZATWIERDZONY','ARCHIWUM'];
let EU32_STATUS_FILTER='ALL';
let EU32_MESSAGES=[
  {date:'20.08.2026',time:'12:58',icon:'🎯',label:'DZISIEJSZA PODPOWIEDŹ',text:'Najpierw obsłuż firmy oznaczone DO KONTAKTU, a po rozmowie od razu ustaw właściwy status CRM — baza sama uporządkuje dalszą pracę.'},
  {date:'20.08.2026',time:'12:57',icon:'🔔',label:'PRZYPOMNIENIE',text:'Po zatwierdzeniu klienta lub dostawcy sprawdź telefon i e-mail w jasnym panelu szczegółów, zanim wyślesz dokument handlowy.'},
  {date:'20.08.2026',time:'12:56',icon:'📈',label:'CRM L&M',text:'Status KLIENT ZATWIERDZONY przenosi rekord do tabeli KLIENCI, a DOSTAWCA ZATWIERDZONY do tabeli DOSTAWCY. Przycisk GENERUJ OFERTĘ otwiera generator z wybraną firmą.'}
];
function jget(k,def){try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??def}catch(e){return def}}
function jset(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function overrides(){return jget(STATUS_KEY,{})||{}}
function selectedMap(){return jget(SELECT_KEY,{})||{}}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
function dmy(v){if(!v)return '—';try{const d=new Date(v);if(Number.isNaN(d.getTime()))return String(v).slice(0,10);return d.toLocaleDateString('pl-PL',{day:'2-digit',month:'2-digit',year:'numeric'})}catch(e){return String(v||'—')}}
function nowDmy(){return new Date().toLocaleDateString('pl-PL',{day:'2-digit',month:'2-digit',year:'numeric'})}
function statusOf(x){
  const o=overrides()[String(x.id)];if(o?.status)return o.status;
  const s=String(x.status||'').toUpperCase();
  if(s.includes('ARCH'))return 'ARCHIWUM';
  if(s.includes('KLIENT ZATW'))return 'KLIENT ZATWIERDZONY';
  if(s.includes('DOSTAWCA ZATW'))return 'DOSTAWCA ZATWIERDZONY';
  if(s.includes('ZATW'))return x.type==='supplier'?'DOSTAWCA ZATWIERDZONY':'KLIENT ZATWIERDZONY';
  if(s.includes('ROZM')||s.includes('NAWIĄZ'))return 'KONTAKT NAWIĄZANY';
  if(s.includes('AKTYW'))return 'AKTYWNY';
  if(s.includes('NOWY'))return 'NOWY';
  const a=new Date(x.date_added||0),t=new Date();if(!Number.isNaN(a.getTime())&&a.toDateString()===t.toDateString())return 'NOWY';
  return 'DO KONTAKTU';
}
function typeOf(x){const o=overrides()[String(x.id)];return o?.type||x.type||'client'}
function updatedOf(x){const o=overrides()[String(x.id)];return o?.updatedAt||x.date_updated||x.date_added||''}
function statusMeta(s){
  const map={
    'NOWY':{icon:'●',color:'#1d91ff',bg:'#0d56a0'},
    'AKTYWNY':{icon:'●',color:'#4fe42b',bg:'#208714'},
    'DO KONTAKTU':{icon:'●',color:'#ffb51a',bg:'#9a6500'},
    'KONTAKT NAWIĄZANY':{icon:'●',color:'#168dff',bg:'#0b5ea9'},
    'KLIENT ZATWIERDZONY':{icon:'★',color:'#ffc233',bg:'#557d09'},
    'DOSTAWCA ZATWIERDZONY':{icon:'●',color:'#a865e7',bg:'#66329b'},
    'ARCHIWUM':{icon:'●',color:'#717774',bg:'#363c39'}
  };return map[s]||map['DO KONTAKTU'];
}
function roleOf(x){const t=typeOf(x);return t==='supplier'?'Dostawca':'Klient'}
function flagEmoji(c){return ({PL:'🇵🇱',DE:'🇩🇪',CZ:'🇨🇿',SK:'🇸🇰',AT:'🇦🇹',CH:'🇨🇭',LT:'🇱🇹',IT:'🇮🇹',FR:'🇫🇷',NL:'🇳🇱',BE:'🇧🇪',DK:'🇩🇰'})[c]||'🌍'}
function arrFor(code){
  const q=norm(EU31_STATE.q),db=EU31_STATE.db||{contractors:[]};
  return (db.contractors||[]).filter(x=>x.country===code).filter(x=>EU32_STATUS_FILTER==='ALL'||statusOf(x)===EU32_STATUS_FILTER).filter(x=>!q||norm([x.company,x.city,x.address,x.product,x.phone,x.email,statusOf(x),roleOf(x)].join(' ')).includes(q)).sort((a,b)=>String(a.company||'').localeCompare(String(b.company||''),'pl'));
}
function selectedId(code,arr){const m=selectedMap(),id=m[code];return arr.some(x=>String(x.id)===String(id))?id:(arr[0]?.id||null)}
function setSelected(code,id){const m=selectedMap();m[code]=id;jset(SELECT_KEY,m)}
function statusButtons(selected){const active=selected?statusOf(selected):'';return STATUS_LIST.map(s=>`<button class="eu32-status-btn ${active===s?'active':''}" data-status="${s}" onclick="eu32SetStatus('${eu31Esc(selected?.id||'')}','${s}')"><span></span>${s}</button>`).join('')}
function statusDot(x){const s=statusOf(x),m=statusMeta(s),star=s==='KLIENT ZATWIERDZONY';return `<span class="eu32-status-dot ${star?'star':''}" style="background:${m.color};color:${m.color}" title="${eu31Esc(s)}"></span>`}
function actionButtons(x){const id=eu31Esc(x.id);return `<div class="eu32-actions"><button class="eu32-act phone" title="Zadzwoń" onclick="event.stopPropagation();eu31Call('${id}')">☎</button><button class="eu32-act map" title="Mapa dojazdu" onclick="event.stopPropagation();eu31Map('${id}')">●</button><button class="eu32-act details" title="Szczegóły" onclick="event.stopPropagation();eu32Select('${id}',true)">☷</button><button class="eu32-offer" onclick="event.stopPropagation();eu32GenerateOffer('${id}')">▤ GENERUJ OFERTĘ</button></div>`}
function detailPanel(x){return `<div class="eu32-detail"><div class="eu32-detail-col"><div class="eu32-dline"><b>Adres:</b><span>${eu31Esc(x.address||'—')}</span></div><div class="eu32-dline"><b>Telefon:</b><span>${eu31Esc(x.phone||'—')}</span></div><div class="eu32-dline"><b>E-mail:</b><span>${eu31Esc(x.email||'—')}</span></div><div class="eu32-dline"><b>WWW:</b><span>${eu31Esc(x.website||'—')}</span></div><div class="eu32-detail-actions"><button class="phone" onclick="eu31Call('${eu31Esc(x.id)}')">☎ ZADZWOŃ</button><button class="map" onclick="eu31Map('${eu31Esc(x.id)}')">⌖ MAPA</button><button class="offer" onclick="eu32GenerateOffer('${eu31Esc(x.id)}')">▤ OFERTA</button></div></div><div class="eu32-detail-col"><div class="eu32-dline"><b>Źródło:</b><span>${eu31Esc(x.source||'baza L&M')}</span></div><div class="eu32-dline eu32-dnote"><b>Notatka:</b><span>${eu31Esc(x.note||'—')}</span></div><div class="eu32-dline"><b>Dodano:</b><span>${dmy(x.date_added)}</span></div><div class="eu32-dline"><b>Aktualizacja:</b><span>${dmy(updatedOf(x))}</span></div><div class="eu32-dline"><b>Status:</b><span><strong>${eu31Esc(statusOf(x))}</strong></span></div></div></div>`}
function row(x,selected){return `<div class="eu32-row ${selected?'selected':''}"><div class="eu32-row-main" onclick="eu32Select('${eu31Esc(x.id)}',false)"><div>${statusDot(x)}</div><div class="eu32-firm"><b>${eu31Esc(x.company||'—')}</b><small>${eu31Esc(statusOf(x))}</small></div><div class="eu32-cell"><b>${flagEmoji(x.country)} ${eu31Esc(eu31CountryName(x.country))}</b><br><span class="eu32-city">⌖ ${eu31Esc(x.city||'—')}</span></div><div class="eu32-cell eu32-product">${eu31Esc(x.product||'Pellet / współpraca B2B')}</div><div class="eu32-cell">${dmy(x.date_added)}</div><div class="eu32-cell">${dmy(updatedOf(x))}</div>${actionButtons(x)}</div>${selected?detailPanel(x):''}</div>`}
function assistantHtml(){return `<section class="eu32-assistant"><div class="eu32-assistant-head"><div class="eu32-assistant-icon">💬</div><div><h2>WIADOMOŚCI SPECJALNE — OD ASYSTENTA</h2><p>Twoje codzienne podpowiedzi i informacje</p></div><div class="eu32-assistant-count">NOWE: ${EU32_MESSAGES.length}</div></div><div id="eu32Messages">${EU32_MESSAGES.slice(0,3).map(m=>`<div class="eu32-msg"><div class="eu32-msg-time">${eu31Esc(m.date||'')}<br>${eu31Esc(m.time||'')}</div><div class="eu32-msg-ico">${eu31Esc(m.icon||'★')}</div><div class="eu32-msg-text"><b>${eu31Esc(m.label||'WIADOMOŚĆ')}:</b> ${eu31Esc(m.text||'')}</div></div>`).join('')}</div><div class="eu32-assistant-foot">WIADOMOŚCI L&M • AKTUALIZOWANE W PAKIECIE APLIKACJI</div></section>`}
function nav(){return `<div class="eu32-nav"><button onclick="go('home')"><span>⌂</span>START</button><button onclick="go('suppliers')"><span>🚚</span>DOSTAWCY</button><button class="active" onclick="go('marketsEU')"><span>🌍</span>RYNKI EU</button><button onclick="go('clients')"><span>👥</span>KLIENCI</button><button onclick="go('settings')"><span>⚙</span>USTAWIENIA</button></div>`}
function eu32Country(code,reset=true){
  EU31_STATE.country=code;if(reset){EU31_STATE.q='';EU32_STATUS_FILTER='ALL'};
  const arr=arrFor(code),sid=selectedId(code,arr),selected=arr.find(x=>String(x.id)===String(sid))||arr[0]||null;if(selected)setSelected(code,selected.id);
  const db=EU31_STATE.db||{contractors:[]},sm=selected?statusMeta(statusOf(selected)):statusMeta('DO KONTAKTU');
  const app=document.getElementById('app');app.innerHTML='';const root=document.createElement('div');root.className='eu31 eu32-page';
  root.innerHTML=eu31Shell('Baza kontrahentów — '+eu31CountryName(code))+`<div class="eu32-wrap"><div class="eu32-topline"><div class="eu32-update"><span>Aktualizacja:</span><b>${eu31DateOnly(db.generated_at)}</b><small>Nowe dziś: ${(db.contractors||[]).filter(x=>x.country===code&&new Date(x.date_added||0).toDateString()===new Date().toDateString()).length}</small></div></div><section class="eu32-statusbar"><div class="eu32-status-caption"><span class="eu32-building">🏢</span><span>STATUS<br>FIRMY:</span></div><div class="eu32-status-main"><span class="eu32-status-icon" style="color:${sm.color}">${sm.icon}</span><div class="eu32-status-copy"><div class="eu32-status-name">${eu31Esc(selected?statusOf(selected):'BRAK REKORDU')}</div><div class="eu32-selected-company">${eu31Esc(selected?.company||'Wybierz firmę z tabeli')}</div></div></div></section><div class="eu32-status-selector">${statusButtons(selected)}</div><div class="eu32-toolbar"><label class="eu32-search"><span>⌕</span><input id="eu32Search" value="${eu31Esc(EU31_STATE.q)}" placeholder="Szukaj firmy w ${eu31Esc(eu31CountryName(code))}..."></label><select id="eu32Filter" class="eu32-filter"><option value="ALL">WSZYSTKIE STATUSY</option>${STATUS_LIST.map(s=>`<option value="${s}" ${EU32_STATUS_FILTER===s?'selected':''}>${s}</option>`).join('')}</select></div><section class="eu32-table"><div class="eu32-head"><div>STATUS</div><div>FIRMA</div><div>KRAJ / MIASTO</div><div>PRODUKT / RYNEK</div><div>DODANO</div><div>AKTUALIZACJA</div><div>AKCJE</div></div><div id="eu32Rows">${arr.length?arr.map(x=>row(x,String(x.id)===String(selected?.id))).join(''):`<div class="eu32-empty">Brak rekordów dla wybranego filtra.</div>`}</div></section><div class="eu32-status-help"><div>⭐ <strong>KLIENT ZATWIERDZONY</strong> → tabela KLIENCI</div><div>🟣 <strong>DOSTAWCA ZATWIERDZONY</strong> → tabela DOSTAWCY</div></div>${assistantHtml()}${nav()}</div>`;
  app.appendChild(root);
  const backBtn=root.querySelector('.eu31-back');
  if(backBtn)backBtn.onclick=()=>eu31Country(code,false);
  document.getElementById('eu32Search')?.addEventListener('input',e=>eu32SearchInput(e.target));
  document.getElementById('eu32Filter')?.addEventListener('change',e=>{EU32_STATUS_FILTER=e.target.value;eu32Country(code,false)});
  eu32LoadMessages();window.scrollTo({top:0,left:0,behavior:'auto'});
}

function eu32SearchInput(el){
  EU31_STATE.q=el?.value||'';
  const code=EU31_STATE.country;
  eu32Country(code,false);
  setTimeout(()=>{const n=document.getElementById('eu32Search');if(n){n.focus();const l=n.value.length;try{n.setSelectionRange(l,l)}catch(e){}}},0);
}

function eu32Select(id){const x=eu31ById(id);if(!x)return;setSelected(x.country,x.id);eu32Country(x.country,false)}
function eu32OpenCompany(id){const x=eu31ById(id);if(!x)return;setSelected(x.country,x.id);EU31_STATE.country=x.country;EU31_STATE.q='';EU32_STATUS_FILTER='ALL';eu32Country(x.country,false)}
function removeLinkedClient(id){if(typeof CLIENTS_V13==='undefined')return;const before=CLIENTS_V13.length;CLIENTS_V13=CLIENTS_V13.filter(c=>String(c.euSourceId||'')!==String(id));if(CLIENTS_V13.length!==before&&typeof persistClientsV13==='function')persistClientsV13()}
function removeLinkedSupplier(id){try{const a=getCustomSuppliers();const b=a.filter(s=>String(s.euSourceId||'')!==String(id)&&String(s.id||'')!=='eu_'+String(id));if(b.length!==a.length)saveCustomSuppliers(b)}catch(e){}}
function syncClient(x){
  removeLinkedSupplier(x.id);if(typeof CLIENTS_V13==='undefined')return;
  let c=CLIENTS_V13.find(y=>String(y.euSourceId||'')===String(x.id));if(!c)c=CLIENTS_V13.find(y=>norm(y.name)===norm(x.company));
  const data={euSourceId:x.id,name:x.company||'Kontrahent',city:x.city||'',type:'Kontrahent B2B',date:nowDmy(),status:'ZATWIERDZONY',color:'green',phone:x.phone||'',email:x.email||'',web:x.website||'',invoiceAddress:x.address||'',notes:x.note||'',offers:c?.offers||'0',orders:c?.orders||'0',value:c?.value||'0 zł',last:new Date().toLocaleString('pl-PL')};
  if(c)Object.assign(c,data);else CLIENTS_V13.unshift(data);if(typeof persistClientsV13==='function')persistClientsV13();
}
function syncSupplier(x){
  removeLinkedClient(x.id);try{const a=getCustomSuppliers();let s=a.find(y=>String(y.euSourceId||'')===String(x.id)||String(y.id||'')==='eu_'+String(x.id));if(!s)s=a.find(y=>norm(y.name)===norm(x.company));const data={id:s?.id||('eu_'+x.id),euSourceId:x.id,name:x.company||'Kontrahent',type:x.product||'Pellet / współpraca B2B',priority:s?.priority||'3',source:'Rynki Europy / CRM L&M',status:'ZATWIERDZONY',cert:s?.cert||'DO WERYFIKACJI',certId:s?.certId||'',city:x.city||'',postal:s?.postal||'',address:x.address||'',country:eu31CountryName(x.country),phone:x.phone||'',mobile:s?.mobile||'',email:x.email||'',www:x.website||'',price:s?.price||'',currency:s?.currency||(x.country==='PL'?'PLN':'EUR'),minQty:s?.minQty||'26 t — 1 samochód',last:new Date().toISOString(),next:s?.next||'',notes:x.note||'',created:s?.created||new Date().toISOString(),updated:new Date().toISOString(),history:Array.isArray(s?.history)?s.history:[]};data.history.push({at:new Date().toISOString(),type:'CRM RYNKI EU',text:'Status zmieniony na DOSTAWCA ZATWIERDZONY — rekord zsynchronizowany z Rynki Europy.'});if(s)Object.assign(s,data);else a.unshift(data);saveCustomSuppliers(a)}catch(e){}
}
function setStatus(id,status){
  const x=eu31ById(id);if(!x||!STATUS_LIST.includes(status))return;const o=overrides();let type=typeOf(x);if(status==='KLIENT ZATWIERDZONY')type='client';if(status==='DOSTAWCA ZATWIERDZONY')type='supplier';o[String(id)]={status,type,updatedAt:new Date().toISOString()};jset(STATUS_KEY,o);x.status=status;x.type=type;x.date_updated=new Date().toISOString();
  if(status==='KLIENT ZATWIERDZONY')syncClient(x);else if(status==='DOSTAWCA ZATWIERDZONY')syncSupplier(x);else{removeLinkedClient(x.id);removeLinkedSupplier(x.id)}
  setSelected(x.country,x.id);if(typeof toast==='function')toast('Status zapisany: '+status+(status.includes('ZATWIERDZONY')?' • rekord przeniesiony do właściwej tabeli.':''));eu32Country(x.country,false)
}
function generateOffer(id){
  const x=eu31ById(id);if(!x)return;if(statusOf(x)==='KLIENT ZATWIERDZONY')syncClient(x);else if(statusOf(x)==='DOSTAWCA ZATWIERDZONY')syncSupplier(x);
  try{localStorage.setItem('lm_eu_offer_target_v32',JSON.stringify({id:x.id,name:x.company,country:x.country,at:new Date().toISOString()}))}catch(e){}
  go('offerGenerator');let tries=0;const timer=setInterval(()=>{tries++;const sel=document.getElementById('v29_recipient');if(sel){const opts=[...sel.options];const opt=opts.find(o=>norm(o.textContent).includes(norm(x.company)));if(opt){sel.value=opt.value;if(typeof v29RecipientChanged==='function')v29RecipientChanged()}const lang={DE:'de',AT:'de',CH:'de',CZ:'cz',SK:'sk',PL:'pl'}[x.country]||'en';if(typeof v29SetLang==='function')v29SetLang(lang);clearInterval(timer);if(typeof toast==='function')toast('Generator oferty otwarty dla: '+x.company)}else if(tries>30)clearInterval(timer)},100)
}
async function eu32LoadMessages(){
  try{
    const r=await fetch(MSG_URL+'?ts='+Date.now(),{cache:'no-store'});
    if(!r.ok)return;
    const d=await r.json();
    if(Array.isArray(d.messages)&&d.messages.length){
      EU32_MESSAGES=d.messages;
      const box=document.getElementById('eu32Messages');
      if(box){
        box.innerHTML=EU32_MESSAGES.slice(0,3).map(m=>`<div class="eu32-msg"><div class="eu32-msg-time">${eu31Esc(m.date||'')}<br>${eu31Esc(m.time||'')}</div><div class="eu32-msg-ico">${eu31Esc(m.icon||'★')}</div><div class="eu32-msg-text"><b>${eu31Esc(m.label||'WIADOMOŚĆ')}:</b> ${eu31Esc(m.text||'')}</div></div>`).join('');
      }
      const c=document.querySelector('.eu32-assistant-count');
      if(c)c.textContent='NOWE: '+EU32_MESSAGES.length;
    }
  }catch(e){}
}
// Screen 2 remains the approved RYNKI EU card. Only its counts/filters respect CRM-approved type changes.
try{eu31Counts=function(code){const arr=(EU31_STATE.db?.contractors||[]).filter(x=>x.country===code);return {all:arr.length,sup:arr.filter(x=>typeOf(x)==='supplier').length,cli:arr.filter(x=>typeOf(x)==='client').length,new:arr.filter(eu31IsNew).length}}}catch(e){}
try{eu31Filtered=function(code){let a=(EU31_STATE.db?.contractors||[]).filter(x=>x.country===code);if(EU31_STATE.filter==='supplier')a=a.filter(x=>typeOf(x)==='supplier');if(EU31_STATE.filter==='client')a=a.filter(x=>typeOf(x)==='client');const q=norm(EU31_STATE.q);if(q)a=a.filter(x=>norm([x.company,x.city,x.product,x.contact_person,x.phone,x.email,statusOf(x),roleOf(x)].join(' ')).includes(q));return a.sort((a,b)=>(eu31IsNew(b)-eu31IsNew(a))||String(a.company||'').localeCompare(String(b.company||''),'pl'))}}catch(e){}
window.eu32Select=eu32Select;window.eu32OpenCompany=eu32OpenCompany;window.eu32SetStatus=setStatus;window.eu32GenerateOffer=generateOffer;window.eu32Country=eu32Country;window.eu32SearchInput=eu32SearchInput;
})();
