/* L&M Technic Energy — RYNKI EU LIVE V31.1.0 */
(function(){
'use strict';
const FEED='./markets-eu.json';
const STORE='lm_markets_eu_live_v31';
const PREF='lm_markets_eu_pref_v31';
let state={data:null,country:null,filter:'all',query:'',loading:false};
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const dayISO=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)};
function plDate(v){try{return new Date(v).toLocaleDateString('pl-PL',{day:'2-digit',month:'2-digit',year:'numeric'})}catch(e){return String(v||'—')}}
function saveCache(data){try{localStorage.setItem(STORE,JSON.stringify({savedAt:Date.now(),data}))}catch(e){}}
function loadCache(){try{return JSON.parse(localStorage.getItem(STORE)||'null')?.data||null}catch(e){return null}}
function savePref(){try{localStorage.setItem(PREF,JSON.stringify({country:state.country,filter:state.filter}))}catch(e){}}
function loadPref(){try{return JSON.parse(localStorage.getItem(PREF)||'{}')}catch(e){return {}}}
async function fetchFeed(force=false){
  if(state.loading)return state.data;
  state.loading=true;
  try{
    const r=await fetch(FEED+'?ts='+Date.now(),{cache:'no-store'});
    if(!r.ok)throw new Error('HTTP '+r.status);
    const data=await r.json();
    if(!data||!Array.isArray(data.countries)||!Array.isArray(data.companies))throw new Error('Nieprawidłowy feed');
    state.data=data;saveCache(data);return data;
  }catch(e){state.data=state.data||loadCache();return state.data;}
  finally{state.loading=false}
}
function counts(code){
  const a=(state.data?.companies||[]).filter(x=>x.country===code);
  const today=dayISO();
  return {all:a.length,sup:a.filter(x=>x.type==='supplier').length,cli:a.filter(x=>x.type==='client').length,newToday:a.filter(x=>x.added===today).length};
}
function country(code){return (state.data?.countries||[]).find(x=>x.code===code)}
function nav(){return `<div class="lm-meu-bottom">
  <button onclick="go('home')"><span>⌂</span>START</button>
  <button onclick="go('suppliers')"><span>🤝</span>DOSTAWCY</button>
  <button class="active" onclick="renderMarketsEU()"><span>◎</span>RYNKI EU</button>
  <button onclick="go('settings')"><span>⚙</span>USTAWIENIA</button>
</div>`}
function header(back){return `<div class="lm-meu-top">
  <button class="back" aria-label="Wstecz" onclick="${back||"go('home')"}">←</button>
  <div class="lm-meu-brand"><img src="./icon-512.png" alt="L&M Technic Energy"></div>
  <div class="lm-meu-top-actions"><button class="lm-meu-iconbtn" aria-label="Szukaj" onclick="document.querySelector('.lm-meu-search input')?.focus()">⌕</button><button class="lm-meu-iconbtn" aria-label="Ustawienia" onclick="go('settings')">⚙</button></div>
</div>`}
function hero(sub){return `<div class="lm-meu-hero"><h1 class="lm-meu-title">RYNKI EUROPY</h1><div class="lm-meu-sub">${esc(sub)}</div></div>`}
function flagBox(c,large=false){return `<div class="lm-meu-flagbox${large?' large':''}"><i class="pole"></i><span class="flag" aria-label="Flaga ${esc(c.name)}">${esc(c.flag)}</span></div>`}
function renderOverview(){
  state.country=null;savePref();const d=state.data;
  const total=(d.companies||[]).length;const sup=(d.companies||[]).filter(x=>x.type==='supplier').length;const cli=(d.companies||[]).filter(x=>x.type==='client').length;
  const tiles=d.countries.map(c=>{const k=counts(c.code);return `<button class="lm-meu-country-tile" onclick="lmMarketsCountry('${esc(c.code)}')">${flagBox(c)}<div><div class="lm-meu-country-name">${esc(c.name.toUpperCase())}</div><div class="lm-meu-country-meta"><b>${k.all}</b> kontrahentów<br>${k.sup} dostawców • ${k.cli} klientów</div></div></button>`}).join('');
  const app=document.getElementById('app');
  app.innerHTML=`<main class="lm-meu">${header("go('home')")}<div class="lm-meu-wrap">${hero('Baza kontrahentów')}
    <section class="lm-meu-card lm-meu-overview"><div class="lm-meu-overview-head"><h2>EUROPA — BAZA LIVE</h2><div class="lm-meu-sync"><strong>${total} kontrahentów</strong>${sup} dostawców • ${cli} klientów<br>Aktualizacja: ${plDate(d.updatedAt)}</div></div><div class="lm-meu-country-grid">${tiles}</div></section>
    <div class="lm-meu-auto"><span class="spin">↻</span> AUTOMATYCZNA AKTUALIZACJA Z BAZY KONTRAHENTÓW</div>${nav()}</div></main>`;
  window.scrollTo({top:0,left:0,behavior:'auto'});
}
function matching(){
  let a=(state.data?.companies||[]).filter(x=>x.country===state.country);
  if(state.filter!=='all')a=a.filter(x=>x.type===state.filter);
  const q=state.query.trim().toLocaleLowerCase('pl-PL');
  if(q)a=a.filter(x=>[x.name,x.city,x.role,x.product,x.address,x.note].some(v=>String(v||'').toLocaleLowerCase('pl-PL').includes(q)));
  return a;
}
function cityPalette(c){return `--crest1:${c.crest1||'#8d1124'};--crest2:${c.crest2||'#d1a126'}`}
function row(x){
  const newTag=x.added===dayISO()?'<span class="lm-meu-badge-new">NOWY</span>':'';
  return `<article class="lm-meu-row"><div class="lm-meu-crest" style="${cityPalette(x)}"><span>${esc(x.crest||x.city.slice(0,3).toUpperCase())}</span></div><div class="lm-meu-company"><h3>${esc(x.name)} ${newTag}</h3><div class="lm-meu-line"><span class="ico">⌖</span>${esc(x.city)} &nbsp; | &nbsp; <span class="role">${x.type==='supplier'?'▣ Dostawca':'♙ Klient'}</span></div><div class="lm-meu-line"><span class="ico">◇</span>${esc(x.product||'Do uzupełnienia')}</div></div><div class="lm-meu-actions"><button class="lm-meu-action" aria-label="Zadzwoń" onclick="lmMarketCall('${esc(x.id)}')">☎</button><button class="lm-meu-action" aria-label="Mapa" onclick="lmMarketMap('${esc(x.id)}')">●</button><button class="lm-meu-action" aria-label="Szczegóły" onclick="lmMarketDetails('${esc(x.id)}')">☷</button></div></article>`
}
function renderRows(){const box=document.getElementById('lmMeuRows');if(!box)return;const a=matching();box.innerHTML=a.length?a.map(row).join(''):`<div class="lm-meu-empty">Brak zweryfikowanych kontrahentów dla tego filtra. Baza uzupełni się automatycznie po opublikowaniu nowych danych.</div>`}
function renderCountry(code){
  if(!country(code))return renderOverview();state.country=code;savePref();const c=country(code),k=counts(code),d=state.data;
  const chips=d.countries.map(x=>`<button class="lm-meu-country-chip ${x.code===code?'active':''}" onclick="lmMarketsCountry('${x.code}')">${x.flag} ${esc(x.name)}</button>`).join('');
  const app=document.getElementById('app');
  app.innerHTML=`<main class="lm-meu">${header('renderMarketsEU()')}<div class="lm-meu-wrap">${hero('Baza kontrahentów — '+c.name)}
    <div class="lm-meu-country-scroll">${chips}</div>
    <section class="lm-meu-card lm-meu-country-head">${flagBox(c,true)}<div class="lm-meu-country-stats"><h2>${esc(c.name.toUpperCase())}</h2><div class="lm-meu-statline"><span>♙</span>${k.all} kontrahentów</div><div class="lm-meu-statline"><span>▣</span>${k.sup} dostawców</div><div class="lm-meu-statline"><span>♙</span>${k.cli} klientów</div></div><div class="lm-meu-country-side"><div><span class="gold">✳</span>Nowe dziś: <b>${k.newToday}</b></div><div><span class="gold">↻</span>Aktualizacja:<br><b>${plDate(d.updatedAt)}</b></div></div></section>
    <label class="lm-meu-search"><span class="glass">⌕</span><input id="lmMeuSearch" placeholder="Szukaj firmy w ${esc(c.name)}..." value="${esc(state.query)}"></label>
    <div class="lm-meu-filters"><button class="lm-meu-filter ${state.filter==='all'?'active':''}" data-f="all">WSZYSCY</button><button class="lm-meu-filter ${state.filter==='client'?'active':''}" data-f="client">KLIENCI</button><button class="lm-meu-filter ${state.filter==='supplier'?'active':''}" data-f="supplier">DOSTAWCY</button></div>
    <div id="lmMeuRows" class="lm-meu-list"></div><div class="lm-meu-auto"><span class="spin">↻</span> AUTOMATYCZNA AKTUALIZACJA Z BAZY KONTRAHENTÓW</div>${nav()}</div></main>`;
  document.getElementById('lmMeuSearch')?.addEventListener('input',e=>{state.query=e.target.value;renderRows()});
  document.querySelectorAll('.lm-meu-filter').forEach(b=>b.addEventListener('click',()=>{state.filter=b.dataset.f;savePref();document.querySelectorAll('.lm-meu-filter').forEach(x=>x.classList.toggle('active',x===b));renderRows()}));
  renderRows();window.scrollTo({top:0,left:0,behavior:'auto'});
}
function company(id){return (state.data?.companies||[]).find(x=>x.id===id)}
window.lmMarketCall=function(id){const x=company(id);if(!x)return;if(x.phone){location.href='tel:'+x.phone}else if(typeof toast==='function')toast('Brak numeru telefonu — uzupełni się po weryfikacji danych.')};
window.lmMarketMap=function(id){const x=company(id);if(!x)return;const q=x.address||[x.name,x.city,country(x.country)?.name].filter(Boolean).join(', ');const u='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);try{const w=window.open(u,'_blank');if(!w)location.href=u}catch(e){location.href=u}};
window.lmMarketDetails=function(id){const x=company(id);if(!x)return;document.getElementById('lmMeuModal')?.remove();const m=document.createElement('div');m.id='lmMeuModal';m.className='lm-meu-modal';m.onclick=e=>{if(e.target===m)m.remove()};m.innerHTML=`<div class="lm-meu-modal-card"><button class="lm-meu-modal-close" onclick="document.getElementById('lmMeuModal')?.remove()">×</button><h3>${esc(x.name)}</h3><p><b>Kraj / miasto:</b> ${esc(country(x.country)?.name||x.country)} • ${esc(x.city)}</p><p><b>Typ:</b> ${esc(x.role)}</p><p><b>Produkt / profil:</b> ${esc(x.product||'—')}</p><p><b>Adres:</b> ${esc(x.address||'—')}</p><p><b>Telefon:</b> ${esc(x.phone||'do uzupełnienia')}</p><p><b>Notatka L&M:</b> ${esc(x.note||'—')}</p><div class="lm-meu-source">Źródło: ${esc(x.source||'baza L&M')} • dodano: ${esc(x.added||'—')}</div></div>`;document.body.appendChild(m)};
window.lmMarketsCountry=function(code){state.query='';renderCountry(code)};
window.renderMarketsEU=async function(){
  const app=document.getElementById('app');app.innerHTML='<main class="lm-meu"><div class="lm-meu-wrap"><div class="lm-meu-empty" style="margin-top:30px">Ładuję bazę RYNKI EU…</div></div></main>';
  state.data=loadCache();await fetchFeed(true);
  if(!state.data){app.innerHTML='<main class="lm-meu"><div class="lm-meu-wrap"><div class="lm-meu-empty" style="margin-top:30px">Nie udało się wczytać bazy. Sprawdź połączenie i otwórz moduł ponownie.</div></div></main>';return}
  const pref=loadPref();state.filter=pref.filter||state.filter;
  if(pref.country&&country(pref.country))renderCountry(pref.country);else renderOverview();
};
// Podłączamy nowy ekran bez ingerowania w działające moduły, zwłaszcza FAKTURY MASTER.
const baseGo=window.go;
window.go=function(name){if(name==='marketsEU')return window.renderMarketsEU();return baseGo(name)};
// Dyskretne odświeżenie feedu co 6 h, bez przeładowania aplikacji.
setInterval(()=>fetchFeed(true),6*60*60*1000);
})();
