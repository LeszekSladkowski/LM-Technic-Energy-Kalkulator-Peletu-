/* ===== V31 — FAKTURY PREMIUM =====
   MASTER GRAFICZNY: invoice-master.png — 100% zatwierdzony, niezmienny.
   Generator nakłada wyłącznie dane dynamiczne na zatwierdzony wzór. */
(function(){
'use strict';
const V31_INV_KEY='lm_invoice_records_v31';
const V31_DRAFT_KEY='lm_invoice_draft_v31';
const V31_MASTER_URL='./invoice-master.png';
const V31_BANK_DEFAULT='46 1240 1037 1111 0011 2978 9216';
const V31_DUE_DAYS=14;
const V31_SELLER_DEFAULT={
  name:'L&M TECHNIC SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
  short:'L&M Technic Sp. z o.o.',
  address:'ul. Fabryczna 3, 25-818 Kielce',
  nip:'9592065184', regon:'526276350', krs:'0001055885',
  phone:'+48 723 588 333', email:'lmtechnic@wp.pl', web:''
};
let V31_MASTER_IMG=null;
let V31_ROWS=[];
let V31_CURRENT_BLOB_URL='';
const V31_OLD_PREVIEW=window.previewHistoryPdfV28;
const V31_OLD_HISTORY_ROWS=window.historyRowsV26;
let V31_PREVIEW_TIMER=0;

function queuePreviewV31(delay=60){clearTimeout(V31_PREVIEW_TIMER);V31_PREVIEW_TIMER=setTimeout(()=>window.renderInvoicePreviewV31?.(),delay)}
function v31num(v){const s=String(v??'').replace(/\s+/g,'').replace(',', '.').replace(/[^0-9.\-]/g,'');const n=parseFloat(s);return Number.isFinite(n)?n:0}

function v31esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function v31money(n){return Number(n||0).toLocaleString('pl-PL',{minimumFractionDigits:2,maximumFractionDigits:2})+' PLN'}
function v31iso(d){const x=new Date(d||Date.now());if(Number.isNaN(x.getTime()))return v31iso(Date.now());const y=x.getFullYear(),m=String(x.getMonth()+1).padStart(2,'0'),day=String(x.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function v31pl(d){if(!d)return'';const [y,m,day]=String(d).split('-');return [day,m,y].filter(Boolean).join('.')}
function v31addDays(iso,days){const [y,m,d]=String(iso||v31iso()).split('-').map(Number);const x=new Date(y,m-1,d||1,12,0,0);x.setDate(x.getDate()+Number(days||0));return v31iso(x)}
function v31records(){try{const a=JSON.parse(localStorage.getItem(V31_INV_KEY)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function v31saveRecords(a){try{localStorage.setItem(V31_INV_KEY,JSON.stringify(a.slice(0,300)))}catch(e){}}
function v31nextNo(type,date){const d=new Date((date||v31iso())+'T12:00:00');const mm=String(d.getMonth()+1).padStart(2,'0'),yy=d.getFullYear();const n=v31records().filter(x=>x.type===type&&String(x.issueDate||'').slice(0,7)===`${yy}-${mm}`).length+1;const serial=String(n).padStart(6,'0');return type==='proforma'?`PF/${serial}/${mm}/${yy}`:`${serial}/${mm}/${yy}`}
function v31defaultRows(){return [
 {name:'Pellet drzewny A1 ENplus®',qty:1,unit:'t',price:1500,vat:23},
 {name:'',qty:1,unit:'szt.',price:0,vat:23},
 {name:'',qty:1,unit:'szt.',price:0,vat:23}
]}
function v31loadDraft(){try{return JSON.parse(localStorage.getItem(V31_DRAFT_KEY)||'null')}catch(e){return null}}
function v31clients(){
  try{
    const saved=JSON.parse(localStorage.getItem('lm_clients_v13_data')||'null');
    if(Array.isArray(saved)&&saved.length)return saved;
  }catch(e){}
  try{if(typeof CLIENTS_V13!=='undefined'&&Array.isArray(CLIENTS_V13))return CLIENTS_V13}catch(e){}
  try{if(Array.isArray(window.CLIENTS_V13))return window.CLIENTS_V13}catch(e){}
  return [];
}
function v31clientOptions(){const clients=v31clients();return '<option value="">— wpisz ręcznie / wybierz klienta —</option>'+clients.map((x,i)=>`<option value="${i}">${v31esc(x.name||('Klient '+(i+1)))} — ${v31esc(x.city||'')}</option>`).join('')}
function v31field(id,label,value='',type='text'){return `<div class="v31-field"><label>${label}</label><input id="${id}" type="${type}" value="${v31esc(value)}"></div>`}

window.renderInvoicesV20=function(){
  const draft=v31loadDraft()||{};const today=v31iso();
  V31_ROWS=Array.isArray(draft.rows)&&draft.rows.length?draft.rows:v31defaultRows();
  const type=draft.type||'final', issue=(draft.issueDate===today?draft.issueDate:today), sale=(draft.saleDate===today?draft.saleDate:today), due=(draft.issueDate===today&&draft.dueDate?draft.dueDate:v31addDays(today,V31_DUE_DAYS));
  const app=document.getElementById('app');app.innerHTML='';
  const d=document.createElement('div');d.className='v31-inv';d.innerHTML=`
   <div class="v31-head"><div class="v31-brand">L&M<small>TECHNIC</small></div><div class="v31-title"><h1>FAKTURY PREMIUM</h1><p>GENERATOR • KLIENCI • PDF • HISTORIA</p></div><button class="v31-back" onclick="go('home')">← PULPIT</button></div>
   <div class="v31-body">
    <section class="v31-card"><h2><span>1.</span> DOKUMENT I NUMERACJA</h2><div class="v31-grid4">
      <div class="v31-field"><label>Typ dokumentu</label><select id="v31_type"><option value="final" ${type==='final'?'selected':''}>FAKTURA VAT</option><option value="proforma" ${type==='proforma'?'selected':''}>FAKTURA PROFORMA</option></select></div>
      ${v31field('v31_number','Numer dokumentu',draft.number||v31nextNo(type,issue))}
      ${v31field('v31_issue','Data wystawienia',issue,'date')}
      ${v31field('v31_sale','Data sprzedaży',sale,'date')}
    </div><div class="v31-grid4" style="margin-top:10px">
      ${v31field('v31_due','Termin płatności',due,'date')}
      <div class="v31-field"><label>Forma płatności</label><select id="v31_payment"><option ${(!draft.payment||draft.payment==='Przelew bankowy')?'selected':''}>Przelew bankowy</option><option ${draft.payment==='Gotówka'?'selected':''}>Gotówka</option><option ${draft.payment==='Karta'?'selected':''}>Karta</option><option ${draft.payment==='Przedpłata'?'selected':''}>Przedpłata</option></select></div>
      ${v31field('v31_order','Numer zamówienia',draft.order||'')}
      ${v31field('v31_ksef','Numer KSeF',draft.ksef||'')}
    </div></section>

    <section class="v31-card"><h2><span>2.</span> SPRZEDAWCA — L&M TECHNIC SP. Z O.O.</h2><div class="v31-grid3">
      ${v31field('v31_s_name','Nazwa',draft.seller?.name||V31_SELLER_DEFAULT.name)}
      ${v31field('v31_s_nip','NIP',draft.seller?.nip||V31_SELLER_DEFAULT.nip)}
      ${v31field('v31_s_regon','REGON',draft.seller?.regon||V31_SELLER_DEFAULT.regon)}
      ${v31field('v31_s_address','Adres',draft.seller?.address||V31_SELLER_DEFAULT.address)}
      ${v31field('v31_s_krs','KRS',draft.seller?.krs||V31_SELLER_DEFAULT.krs)}
      ${v31field('v31_s_phone','Telefon',draft.seller?.phone||V31_SELLER_DEFAULT.phone)}
      ${v31field('v31_s_email','E-mail',draft.seller?.email||V31_SELLER_DEFAULT.email,'email')}
      ${v31field('v31_s_web','WWW',draft.seller?.web||V31_SELLER_DEFAULT.web)}
      <div class="v31-field v31-bank-field"><label>Rachunek bankowy — stały</label><input id="v31_bank" type="text" readonly value="${V31_BANK_DEFAULT}"></div>
    </div><div class="v31-registry"><strong>Dane rejestrowe:</strong> generator ma lokalny komplet danych spółki i przycisk weryfikacji na żywo w oficjalnym Wykazie Podatników VAT Ministerstwa Finansów.</div>
    <div class="v31-btnrow"><button class="v31-btn blue" onclick="lookupSellerMFV31()">🔎 SPRAWDŹ DANE FIRMY MF</button><button class="v31-btn" onclick="restoreSellerV31()">↺ PRZYWRÓĆ DANE L&M</button></div></section>

    <section class="v31-card"><h2><span>3.</span> NABYWCA / ODBIORCA</h2><div class="v31-field"><label>Wybierz klienta z bazy KLIENCI</label><select id="v31_client">${v31clientOptions()}</select></div>
    <div class="v31-grid3" style="margin-top:10px">
      ${v31field('v31_b_name','Nazwa / Imię i nazwisko',draft.buyer?.name||'')}
      ${v31field('v31_b_nip','NIP',draft.buyer?.nip||'')}
      ${v31field('v31_b_regon','REGON',draft.buyer?.regon||'')}
      ${v31field('v31_b_address','Adres',draft.buyer?.address||'')}
      ${v31field('v31_b_phone','Telefon',draft.buyer?.phone||'')}
      ${v31field('v31_b_email','E-mail',draft.buyer?.email||'','email')}
    </div></section>

    <section class="v31-card"><h2><span>4.</span> POZYCJE FAKTURY</h2><div class="v31-items-wrap"><table class="v31-items"><thead><tr><th>LP</th><th style="width:32%">Nazwa produktu</th><th>Ilość</th><th>Jedn.</th><th>Cena netto</th><th>VAT %</th><th>Netto</th><th>VAT</th><th>Brutto</th><th>×</th></tr></thead><tbody id="v31_rows"></tbody></table></div>
    <div class="v31-btnrow"><button class="v31-btn gold" onclick="addInvoiceRowV31()">＋ DODAJ POZYCJĘ</button></div>
    <div class="v31-totals"><div class="v31-total"><small>RAZEM NETTO</small><b id="v31_total_net">0,00 PLN</b></div><div class="v31-total"><small>RAZEM VAT</small><b id="v31_total_vat">0,00 PLN</b></div><div class="v31-total brutto"><small>RAZEM BRUTTO</small><b id="v31_total_gross">0,00 PLN</b></div></div></section>

    <section class="v31-card"><h2><span>5.</span> PŁATNOŚĆ I UWAGI</h2><div class="v31-grid2">${v31field('v31_notes','Uwagi',draft.notes||'Dziękujemy za zaufanie i zapraszamy do ponownej współpracy.')}<div class="v31-field"><label>Status</label><div id="v31_status" class="v31-status">Generator gotowy. Wybierz klienta lub wpisz dane ręcznie.</div></div></div>
    <div class="v31-btnrow"><button class="v31-btn" onclick="saveInvoiceDraftV31()">💾 ZAPISZ ROBOCZĄ</button><button class="v31-btn blue" onclick="previewInvoiceV31()">👁 PODGLĄD PDF</button><button class="v31-btn green" onclick="downloadInvoiceV31(true)">⬇ GENERUJ + ZAPISZ PDF</button><button class="v31-btn gold" onclick="shareInvoiceV31()">↗ UDOSTĘPNIJ PDF</button></div></section>

    <section class="v31-card v31-master"><div class="v31-master-bar"><b>6. FAKTURA MASTER — PODGLĄD NA ŻYWO</b><span>🔒 WZÓR 100% ZATWIERDZONY / NIEZMIENNY</span></div><div class="v31-preview-shell"><canvas id="v31_canvas" class="v31-canvas" width="1122" height="1402"></canvas></div><div class="v31-master-lock">Warstwa graficzna MASTER pozostaje bez zmian. Generator podmienia wyłącznie dane dokumentu, kontrahenta, pozycje i podsumowania.</div></section>
   </div>`;
  app.appendChild(d);
  document.getElementById('v31_client').addEventListener('change',fillBuyerFromClientV31);
  document.getElementById('v31_type').addEventListener('change',()=>{const t=document.getElementById('v31_type').value;document.getElementById('v31_number').value=v31nextNo(t,document.getElementById('v31_issue').value);renderInvoicePreviewV31()});
  document.getElementById('v31_issue').addEventListener('change',()=>{const issueDate=document.getElementById('v31_issue').value||v31iso();document.getElementById('v31_number').value=v31nextNo(document.getElementById('v31_type').value,issueDate);document.getElementById('v31_due').value=v31addDays(issueDate,V31_DUE_DAYS);renderInvoicePreviewV31()});
  d.querySelectorAll('input,select,textarea').forEach(el=>{el.addEventListener('input',()=>queuePreviewV31(80));el.addEventListener('change',()=>queuePreviewV31(10));});
  renderRowsV31();loadMasterV31().then(renderInvoicePreviewV31);window.scrollTo({top:0,left:0,behavior:'auto'});
};

function loadMasterV31(){if(V31_MASTER_IMG&&V31_MASTER_IMG.complete)return Promise.resolve(V31_MASTER_IMG);return new Promise((res,rej)=>{const im=new Image();im.onload=()=>{V31_MASTER_IMG=im;res(im)};im.onerror=rej;im.src=V31_MASTER_URL})}
function fieldVal(id){return document.getElementById(id)?.value?.trim?.()||''}
function collectInvoiceV31(){
  return {id:'inv'+Date.now(),type:fieldVal('v31_type')||'final',number:fieldVal('v31_number'),issueDate:fieldVal('v31_issue'),saleDate:fieldVal('v31_sale'),dueDate:fieldVal('v31_due'),payment:fieldVal('v31_payment'),order:fieldVal('v31_order'),ksef:fieldVal('v31_ksef'),bank:fieldVal('v31_bank')||V31_BANK_DEFAULT,notes:fieldVal('v31_notes'),seller:{name:fieldVal('v31_s_name'),nip:fieldVal('v31_s_nip'),regon:fieldVal('v31_s_regon'),address:fieldVal('v31_s_address'),krs:fieldVal('v31_s_krs'),phone:fieldVal('v31_s_phone'),email:fieldVal('v31_s_email'),web:fieldVal('v31_s_web')},buyer:{name:fieldVal('v31_b_name'),nip:fieldVal('v31_b_nip'),regon:fieldVal('v31_b_regon'),address:fieldVal('v31_b_address'),phone:fieldVal('v31_b_phone'),email:fieldVal('v31_b_email')},rows:V31_ROWS.map(x=>({...x})),createdAt:new Date().toISOString()};
}
function totalsV31(data){let net=0,vat=0,gross=0;for(const r of data.rows||[]){const q=v31num(r.qty),p=v31num(r.price),v=v31num(r.vat),n=q*p,tx=n*v/100;net+=n;vat+=tx;gross+=n+tx}return{net,vat,gross}}
function updateTotalsV31(){const t=totalsV31({rows:V31_ROWS});const n=document.getElementById('v31_total_net'),v=document.getElementById('v31_total_vat'),g=document.getElementById('v31_total_gross');if(n)n.textContent=v31money(t.net);if(v)v.textContent=v31money(t.vat);if(g)g.textContent=v31money(t.gross)}
function updateRowAmountsV31(row,i){const r=V31_ROWS[i]||{},n=v31num(r.qty)*v31num(r.price),tx=n*v31num(r.vat)/100;const net=row.querySelector('[data-out="net"]'),vat=row.querySelector('[data-out="vat"]'),gross=row.querySelector('[data-out="gross"]');if(net)net.textContent=v31money(n);if(vat)vat.textContent=v31money(tx);if(gross)gross.textContent=v31money(n+tx);updateTotalsV31()}
function renderRowsV31(){
  const b=document.getElementById('v31_rows');
  if(!b)return;
  b.innerHTML=V31_ROWS.map((r,i)=>{
    const n=v31num(r.qty)*v31num(r.price),tx=n*v31num(r.vat)/100;
    return `<tr data-row="${i}"><td>${i+1}</td><td><input data-i="${i}" data-k="name" value="${v31esc(r.name||'')}"></td><td><input data-i="${i}" data-k="qty" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="${v31esc(String(r.qty??1))}"></td><td><input data-i="${i}" data-k="unit" value="${v31esc(r.unit||'szt.')}"></td><td><input data-i="${i}" data-k="price" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="${v31esc(String(r.price??0))}"></td><td><input data-i="${i}" data-k="vat" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="${v31esc(String(r.vat??23))}"></td><td data-out="net">${v31money(n)}</td><td data-out="vat">${v31money(tx)}</td><td data-out="gross">${v31money(n+tx)}</td><td><button type="button" class="mini" onclick="removeInvoiceRowV31(${i})">×</button></td></tr>`
  }).join('');
  b.querySelectorAll('input').forEach(x=>{
    const sync=()=>{
      const i=Number(x.dataset.i),k=x.dataset.k;
      if(!V31_ROWS[i])return;
      V31_ROWS[i][k]=['qty','price','vat'].includes(k)?v31num(x.value):x.value;
      updateRowAmountsV31(x.closest('tr'),i);
      queuePreviewV31(30);
    };
    x.addEventListener('input',sync);
    x.addEventListener('change',sync);
    x.addEventListener('blur',sync);
    x.addEventListener('focus',()=>{
      if(['qty','price','vat'].includes(x.dataset.k))requestAnimationFrame(()=>x.select?.());
    });
  });
  updateTotalsV31();
}
window.addInvoiceRowV31=()=>{if(V31_ROWS.length>=6)return toast('W tym wzorze MASTER przewidziano maksymalnie 6 pozycji na jednej stronie.');V31_ROWS.push({name:'',qty:1,unit:'szt.',price:0,vat:23});renderRowsV31();renderInvoicePreviewV31()};
window.removeInvoiceRowV31=i=>{if(V31_ROWS.length<=1)return;V31_ROWS.splice(i,1);renderRowsV31();renderInvoicePreviewV31()};

window.fillBuyerFromClientV31=function(){const idx=Number(document.getElementById('v31_client').value);if(!Number.isInteger(idx))return;const x=v31clients()[idx];if(!x)return;document.getElementById('v31_b_name').value=x.name||'';document.getElementById('v31_b_nip').value=x.nip||'';document.getElementById('v31_b_regon').value=x.regon||'';document.getElementById('v31_b_address').value=x.invoiceAddress||x.delivery||[x.city,'Polska'].filter(Boolean).join(', ');document.getElementById('v31_b_phone').value=x.phone||'';document.getElementById('v31_b_email').value=x.email||'';document.getElementById('v31_status').textContent='✓ Dane klienta uzupełnione automatycznie z bazy KLIENCI.';renderInvoicePreviewV31()};
window.restoreSellerV31=function(){for(const [k,v] of Object.entries({name:V31_SELLER_DEFAULT.name,nip:V31_SELLER_DEFAULT.nip,regon:V31_SELLER_DEFAULT.regon,address:V31_SELLER_DEFAULT.address,krs:V31_SELLER_DEFAULT.krs,phone:V31_SELLER_DEFAULT.phone,email:V31_SELLER_DEFAULT.email,web:V31_SELLER_DEFAULT.web})){const el=document.getElementById('v31_s_'+k);if(el)el.value=v}const bank=document.getElementById('v31_bank');if(bank)bank.value=V31_BANK_DEFAULT;renderInvoicePreviewV31();toast('Przywrócono dane L&M Technic Sp. z o.o. i stały rachunek bankowy.')};
window.lookupSellerMFV31=async function(){const nip=fieldVal('v31_s_nip').replace(/\D/g,''),date=fieldVal('v31_issue')||v31iso();const st=document.getElementById('v31_status');st.textContent='Sprawdzam dane w oficjalnym Wykazie Podatników VAT MF…';try{const r=await fetch(`https://wl-api.mf.gov.pl/api/search/nip/${nip}?date=${date}`,{cache:'no-store'});const j=await r.json();const x=j?.result?.subject;if(!x)throw new Error('Brak danych');document.getElementById('v31_s_name').value=x.name||fieldVal('v31_s_name');document.getElementById('v31_s_regon').value=x.regon||fieldVal('v31_s_regon');document.getElementById('v31_s_krs').value=x.krs||fieldVal('v31_s_krs');document.getElementById('v31_s_address').value=x.workingAddress||x.residenceAddress||fieldVal('v31_s_address');st.textContent=`✓ MF: ${x.statusVat||'status niepodany'} • dane firmy odświeżone.`;renderInvoicePreviewV31()}catch(e){st.textContent='Nie udało się pobrać danych z MF — pozostawiono lokalne dane rejestrowe L&M Technic.';st.classList.add('warn')}};

function setFont(ctx,size,bold=false,color='#111',align='left'){ctx.font=`${bold?'700':'400'} ${size}px Arial`;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='alphabetic'}
function fitText(ctx,text,x,y,maxW,size=19,bold=false,color='#111',align='left'){let s=size;setFont(ctx,s,bold,color,align);while(s>10&&ctx.measureText(String(text)).width>maxW){s--;setFont(ctx,s,bold,color,align)}ctx.fillText(String(text||''),x,y)}
function clearBox(ctx,x,y,w,h,color='#fff'){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
function roundRectV31(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath()}
async function buildCanvasV31(data,canvas){await loadMasterV31();canvas=canvas||document.createElement('canvas');canvas.width=1122;canvas.height=1402;const c=canvas.getContext('2d');c.drawImage(V31_MASTER_IMG,0,0,1122,1402);
  // PROFORMA: zatwierdzony MASTER pozostaje bazą; zmieniamy wyłącznie tytuł dokumentu.
  if(data.type==='proforma'){c.save();roundRectV31(c,355,74,425,92,15);c.fillStyle='rgba(3,42,20,.96)';c.fill();c.lineWidth=2;c.strokeStyle='#d4a129';c.stroke();fitText(c,'FAKTURA PROFORMA',568,132,398,36,true,'#f2b72f','center');c.restore();}
  // numer i daty w nagłówku
  clearBox(c,462,172,199,44,'#052315');c.strokeStyle='#c79525';c.lineWidth=2;c.strokeRect(462,172,199,44);fitText(c,data.number,561,202,185,21,true,'#fff','center');
  [[974,104,v31pl(data.issueDate)],[974,150,v31pl(data.saleDate)],[974,196,v31pl(data.dueDate)]].forEach(([x,y,t])=>{clearBox(c,962,y-22,115,28,'#082316');fitText(c,t,1070,y,108,16,true,'#fff','right')});
  // sprzedawca
  clearBox(c,43,342,500,239,'#fffdf9');fitText(c,data.seller.short||'L&M Technic Sp. z o.o.',57,391,455,22,true);fitText(c,data.seller.address,57,434,455,18);fitText(c,'NIP: '+data.seller.nip,57,478,215,18);fitText(c,'REGON: '+data.seller.regon,284,478,240,18);fitText(c,'KRS: '+data.seller.krs,57,518,220,17);fitText(c,'Tel.: '+data.seller.phone,284,518,240,17);fitText(c,'E-mail: '+data.seller.email,57,557,455,17);
  // nabywca
  clearBox(c,593,342,482,239,'#fffdf9');fitText(c,data.buyer.name||'—',603,391,450,22,true);fitText(c,data.buyer.address||'—',603,434,450,18);fitText(c,'NIP: '+(data.buyer.nip||'—'),603,478,215,18);fitText(c,'REGON: '+(data.buyer.regon||'—'),825,478,225,18);fitText(c,'Tel.: '+(data.buyer.phone||'—'),603,518,215,17);fitText(c,'E-mail: '+(data.buyer.email||'—'),825,518,225,17);
  // tabela - zachowujemy oryginalny nagłówek, czyścimy tylko wiersze
  clearBox(c,23,690,1074,236,'#fffdf9');c.strokeStyle='#ead8ae';c.lineWidth=1;const xs=[23,82,302,397,497,620,694,839,969,1097];for(const x of xs)c.beginPath(),c.moveTo(x,690),c.lineTo(x,926),c.stroke();for(let y=690;y<=926;y+=59)c.beginPath(),c.moveTo(23,y),c.lineTo(1097,y),c.stroke();
  const rows=(data.rows||[]).filter(r=>String(r.name||'').trim()).slice(0,4);rows.forEach((r,i)=>{const y=727+i*59,n=v31num(r.qty)*v31num(r.price),tx=n*v31num(r.vat)/100;setFont(c,16,false,'#111','center');c.fillText(String(i+1),52,y);fitText(c,r.name,101,y,190,16,true);setFont(c,16,false,'#111','center');c.fillText(v31num(r.qty).toLocaleString('pl-PL',{maximumFractionDigits:2}),350,y);c.fillText(r.unit||'',447,y);setFont(c,16,false,'#111','right');c.fillText(v31num(r.price).toLocaleString('pl-PL',{minimumFractionDigits:2,maximumFractionDigits:2}),606,y);c.fillText(String(v31num(r.vat)),667,y);c.fillText(n.toLocaleString('pl-PL',{minimumFractionDigits:2,maximumFractionDigits:2}),825,y);c.fillText(tx.toLocaleString('pl-PL',{minimumFractionDigits:2,maximumFractionDigits:2}),957,y);c.fillText((n+tx).toLocaleString('pl-PL',{minimumFractionDigits:2,maximumFractionDigits:2}),1083,y)});
  // podsumowanie
  const t=totalsV31(data);clearBox(c,321,935,761,85,'#03371a');c.strokeStyle='#c89c24';c.lineWidth=2;c.strokeRect(321,935,761,85);setFont(c,16,true,'#fff');c.fillText('RAZEM NETTO',408,966);c.fillText('RAZEM VAT',630,966);c.fillText('RAZEM BRUTTO',873,966);setFont(c,22,true,'#f2b72f');c.fillText(v31money(t.net),408,995);c.fillText(v31money(t.vat),630,995);c.fillText(v31money(t.gross),873,995);
  // płatności/uwagi — V31.0.6: dół faktury ma być czytelny także na ekranie telefonu
  // Czyścimy WYŁĄCZNIE pola danych wewnątrz zatwierdzonego MASTER-a i nanosimy większą typografię.
  clearBox(c,86,1044,265,88,'#fffdf9');
  setFont(c,17,true,'#1b1b1b');c.fillText('FORMA PŁATNOŚCI',96,1068);
  fitText(c,data.payment||'Przelew bankowy',96,1106,245,25,true,'#111');

  // Rachunek bankowy: szerokie pole, duża pogrubiona niebieska czcionka, bez niebieskiego paska.
  clearBox(c,365,1044,430,88,'#fffdf9');
  setFont(c,17,true,'#1b1b1b');c.fillText('RACHUNEK BANKOWY',382,1068);
  fitText(c,data.bank||V31_BANK_DEFAULT,580,1108,405,23,true,'#147fc8','center');

  clearBox(c,805,1044,258,88,'#fffdf9');
  setFont(c,17,true,'#1b1b1b');c.fillText('TERMIN PŁATNOŚCI',818,1068);
  fitText(c,v31pl(data.dueDate),818,1108,225,25,true,'#111');

  clearBox(c,86,1138,978,78,'#fffdf9');
  setFont(c,17,true,'#1b1b1b');c.fillText('UWAGI',96,1162);
  fitText(c,data.notes||'',96,1198,945,22,true,'#111');

  clearBox(c,86,1212,485,58,'#fffdf9');
  setFont(c,16,true,'#1b1b1b');c.fillText('NUMER ZAMÓWIENIA',96,1234);
  fitText(c,data.order||'—',96,1261,450,22,true,'#111');

  // Footer: dane spółki w 3 większych, czytelnych wierszach. QR i podpis pozostają nietknięte.
  clearBox(c,228,1274,355,123,'#063018');
  setFont(c,16,true,'#fff');c.fillText('L&M Technic Sp. z o.o.',240,1302);
  fitText(c,data.seller.address,240,1328,330,14,false,'#fff');
  fitText(c,'NIP: '+data.seller.nip+'  •  REGON: '+data.seller.regon,240,1352,330,13,true,'#fff');
  fitText(c,data.seller.phone+'  •  '+data.seller.email,240,1377,330,14,true,'#fff');

  // KSeF — większy numer w przeznaczonym polu; etykieta i podpis z MASTER-a zostają.
  clearBox(c,596,1304,222,50,'#063018');
  fitText(c,data.ksef||'—',707,1342,205,19,true,'#f4bd32','center');
  return canvas;
}
window.renderInvoicePreviewV31=async function(){const c=document.getElementById('v31_canvas');if(!c)return;try{await buildCanvasV31(collectInvoiceV31(),c)}catch(e){const st=document.getElementById('v31_status');if(st)st.textContent='Nie udało się wczytać grafiki MASTER.'}};

function bytes(s){return new TextEncoder().encode(s)}
function concat(chunks){let n=chunks.reduce((a,b)=>a+b.length,0),out=new Uint8Array(n),o=0;for(const b of chunks){out.set(b,o);o+=b.length}return out}
function dataUrlBytes(dataUrl){const b=atob(dataUrl.split(',')[1]);const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
function jpegPdfBlob(jpg,iw,ih){const W=595.28,H=841.89,ratio=Math.min(W/iw,H/ih),dw=iw*ratio,dh=ih*ratio,x=(W-dw)/2,y=(H-dh)/2;const content=`q ${dw.toFixed(2)} 0 0 ${dh.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm /Im0 Do Q`;
 const objs=[];objs[1]=bytes('<< /Type /Catalog /Pages 2 0 R >>');objs[2]=bytes('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');objs[3]=bytes(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);objs[4]=concat([bytes(`<< /Type /XObject /Subtype /Image /Width ${iw} /Height ${ih} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`),jpg,bytes('\nendstream')]);objs[5]=bytes(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
 const header=bytes('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n'),chunks=[header],offset=[0],enc=bytes;let pos=header.length;for(let i=1;i<=5;i++){offset[i]=pos;const pre=enc(`${i} 0 obj\n`),post=enc('\nendobj\n');chunks.push(pre,objs[i],post);pos+=pre.length+objs[i].length+post.length}const xrefPos=pos;let xref=`xref\n0 6\n0000000000 65535 f \n`;for(let i=1;i<=5;i++)xref+=String(offset[i]).padStart(10,'0')+' 00000 n \n';const trailer=`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;chunks.push(enc(xref),enc(trailer));return new Blob([concat(chunks)],{type:'application/pdf'})}
async function pdfForDataV31(data){const c=await buildCanvasV31(data);const jpg=dataUrlBytes(c.toDataURL('image/jpeg',0.94));return jpegPdfBlob(jpg,c.width,c.height)}
function fileNameV31(d){const prefix=d.type==='proforma'?'PROFORMA':'FAKTURA_VAT';return `LM_Technic_${prefix}_${String(d.number||'').replace(/[^0-9A-Za-z_-]+/g,'_')}.pdf`}
function validateV31(d){if(!d.number)return'Brak numeru dokumentu.';if(!d.buyer.name)return'Wybierz lub wpisz nabywcę.';if(!(d.rows||[]).some(r=>String(r.name||'').trim()&&Number(r.qty)>0))return'Dodaj co najmniej jedną pozycję.';return''}
window.saveInvoiceDraftV31=function(){const d=collectInvoiceV31();try{localStorage.setItem(V31_DRAFT_KEY,JSON.stringify(d));toast('Wersja robocza faktury zapisana.')}catch(e){toast('Nie udało się zapisać wersji roboczej.')}};
async function saveRecordAndHistoryV31(d){const a=v31records();d.id='inv'+Date.now()+'_'+Math.random().toString(36).slice(2,6);a.unshift(d);v31saveRecords(a);const ref='inv31:'+d.id;const type=d.type==='proforma'?'proforma':'final';if(typeof registerPdfHistoryV26==='function')registerPdfHistoryV26(type,fileNameV31(d),d.buyer.name||'—','GOTOWY PDF',ref);return ref}
window.previewInvoiceV31=async function(){const d=collectInvoiceV31(),err=validateV31(d);if(err)return toast(err);const blob=await pdfForDataV31(d);if(V31_CURRENT_BLOB_URL)URL.revokeObjectURL(V31_CURRENT_BLOB_URL);V31_CURRENT_BLOB_URL=URL.createObjectURL(blob);const w=window.open(V31_CURRENT_BLOB_URL,'_blank');if(!w)location.href=V31_CURRENT_BLOB_URL};
window.downloadInvoiceV31=async function(register=true){const d=collectInvoiceV31(),err=validateV31(d);if(err)return toast(err);const blob=await pdfForDataV31(d);const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=fileNameV31(d);document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);if(register){await saveRecordAndHistoryV31(d);const st=document.getElementById('v31_status');if(st)st.textContent='✓ PDF wygenerowany i zapisany w HISTORII DOKUMENTÓW.';toast('Faktura PDF gotowa i dopisana do Historii.')}};
window.shareInvoiceV31=async function(){const d=collectInvoiceV31(),err=validateV31(d);if(err)return toast(err);const blob=await pdfForDataV31(d),file=new File([blob],fileNameV31(d),{type:'application/pdf'});try{if(navigator.canShare?.({files:[file]})){await navigator.share({title:d.type==='proforma'?'Faktura proforma':'Faktura VAT',text:`L&M Technic — ${d.number}`,files:[file]});}else{await window.downloadInvoiceV31(false);toast('Telefon nie udostępnia plików bezpośrednio — PDF został pobrany.')}}catch(e){if(e?.name!=='AbortError')toast('Udostępnianie przerwane.')}};

async function recordBlobV31(ref){const id=String(ref||'').replace('inv31:','');const d=v31records().find(x=>x.id===id);if(!d)throw new Error('Brak dokumentu');return{d,blob:await pdfForDataV31(d)}}
window.previewInvoiceRecordV31=async function(ref){try{const {blob}=await recordBlobV31(ref),u=URL.createObjectURL(blob),w=window.open(u,'_blank');if(!w)location.href=u;setTimeout(()=>URL.revokeObjectURL(u),120000)}catch(e){toast('Nie znaleziono danych tej faktury.')}};
window.downloadInvoiceRecordV31=async function(ref){try{const {d,blob}=await recordBlobV31(ref),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=fileNameV31(d);document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},1500)}catch(e){toast('Nie znaleziono danych tej faktury.')}};
window.previewHistoryPdfV28=function(ref){if(String(ref||'').startsWith('inv31:'))return window.previewInvoiceRecordV31(ref);return typeof V31_OLD_PREVIEW==='function'?V31_OLD_PREVIEW(ref):toast('Brak podglądu.');};
window.historyRowsV26=function(type){const rows=(typeof getHistoryV26==='function'?getHistoryV26():[]).filter(x=>x.type===type);if(!rows.length)return `<tr><td class="empty" colspan="7">Brak dokumentów PDF w tej kategorii.</td></tr>`;return rows.map(x=>{const d=new Date(x.createdAt),date=d.toLocaleDateString('pl-PL'),time=d.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'}),inv=String(x.ref||'').startsWith('inv31:'),biz=x.ref==='bizplan_master_25_v27';let preview,download;if(inv){preview=`<button class="v28-action preview" onclick="previewInvoiceRecordV31('${v31esc(x.ref)}')">👁 PODGLĄD PDF</button>`;download=`<button class="v28-action download" onclick="downloadInvoiceRecordV31('${v31esc(x.ref)}')">⬇ POBIERZ PDF</button>`}else if(biz){preview=`<button class="v28-action preview" onclick="previewHistoryPdfV28('${v31esc(x.ref)}')">👁 PODGLĄD PDF</button>`;download=`<button class="v28-action download" onclick="downloadBizPlanPdfV24()">⬇ POBIERZ PDF</button>`}else{preview=`<button class="v28-action details" onclick="previewHistoryPdfV28('${v31esc(x.ref||'')}')">PODGLĄD</button>`;download='<button class="v28-action details">SZCZEGÓŁY</button>'}return `<tr><td>${date}</td><td>${time}</td><td><div class="v28-doc-name">${v31esc(x.filename||'Dokument PDF')}</div></td><td>${v31esc(x.sentTo||'—')}</td><td><span class="v28-status">${v31esc(x.status||'WYGENEROWANO')}</span></td><td>${preview}</td><td>${download}</td></tr>`}).join('')};

})();


/* ===== V31.0.6 — CZYTELNY DÓŁ PDF + V31.0.5 CZYTELNE POLA LICZBOWE ===== */
(function v3105InvoiceNumberFieldsFix(){
  const STYLE_ID='v31_0_5_number_fields_fix';
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');
  st.id=STYLE_ID;
  st.textContent=`
    .v31-items{width:100%!important;min-width:940px!important;table-layout:fixed!important}
    .v31-items th,.v31-items td{box-sizing:border-box!important}
    .v31-items th:nth-child(1),.v31-items td:nth-child(1){width:35px!important}
    .v31-items th:nth-child(2),.v31-items td:nth-child(2){width:220px!important}
    .v31-items th:nth-child(3),.v31-items td:nth-child(3){width:75px!important;min-width:75px!important}
    .v31-items th:nth-child(4),.v31-items td:nth-child(4){width:65px!important;min-width:65px!important}
    .v31-items th:nth-child(5),.v31-items td:nth-child(5){width:100px!important;min-width:100px!important}
    .v31-items th:nth-child(6),.v31-items td:nth-child(6){width:70px!important;min-width:70px!important}
    .v31-items th:nth-child(7),.v31-items td:nth-child(7){width:110px!important;min-width:110px!important}
    .v31-items th:nth-child(8),.v31-items td:nth-child(8){width:100px!important;min-width:100px!important}
    .v31-items th:nth-child(9),.v31-items td:nth-child(9){width:115px!important;min-width:115px!important}
    .v31-items th:nth-child(10),.v31-items td:nth-child(10){width:50px!important;min-width:50px!important}
    .v31-items input,.v31-items select{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;padding:5px 6px!important}
    .v31-items input[data-k="qty"],.v31-items input[data-k="price"],.v31-items input[data-k="vat"]{
      font-size:18px!important;font-weight:900!important;line-height:1.15!important;text-align:center!important;
      font-variant-numeric:tabular-nums!important;letter-spacing:0!important;overflow:visible!important
    }
    .v31-items input[data-k="qty"]{padding-left:4px!important;padding-right:4px!important}
    .v31-items input[data-k="price"]{padding-left:4px!important;padding-right:4px!important}
    .v31-items td[data-out]{font-size:14px!important;font-weight:900!important;white-space:nowrap!important;padding-left:6px!important;padding-right:6px!important}
    .v31-items-wrap{overflow-x:auto!important;-webkit-overflow-scrolling:touch!important}
  `;
  document.head.appendChild(st);
})();

/* ===== V31.0.7 FINAL — updater + MASTER invoice ===== */
(function(){
  const HOTFIX_VERSION='V31.0.7';

  v30GetRegistration=async function(){
    if(!('serviceWorker' in navigator))return null;
    try{
      let reg=await navigator.serviceWorker.getRegistration('./');
      if(!reg)reg=await navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'});
      return reg;
    }catch(e){return null;}
  };

  async function hfServerVersion(){
    const r=await fetch('./version.json?ts='+Date.now(),{cache:'no-store'});
    if(!r.ok)throw new Error('version http '+r.status);
    return await r.json();
  }

  function hfWaitWorker(reg,timeout=22000){
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

  v30CheckUpdate=async function(showToast=true){
    if(location.protocol==='file:' || location.protocol==='content:'){
      if(showToast)v30ActionStatus('Aktualizacje działają po otwarciu aplikacji z adresu HTTPS.');
      return false;
    }
    try{
      if(showToast)v30ActionStatus('Sprawdzam wersję na serwerze…');
      const [reg,info]=await Promise.all([v30GetRegistration(),hfServerVersion()]);
      if(!reg){if(showToast)v30ActionStatus('Service Worker nie jest aktywny — odśwież aplikację i spróbuj ponownie.');return false;}
      const newer=!!(info.version && info.version!==HOTFIX_VERSION);
      if(newer){
        try{await reg.update();}catch(e){}
        V30_updateReady=true;
        if(showToast)v30ActionStatus('Dostępna wersja '+info.version+'. Naciśnij UAKTUALNIJ APLIKACJĘ.');
        return true;
      }
      if(reg.waiting){
        V30_updateReady=true;
        if(showToast)v30ActionStatus('Nowa wersja jest już pobrana. Naciśnij UAKTUALNIJ APLIKACJĘ.');
        return true;
      }
      if(showToast)v30ActionStatus('Masz najnowszą wersję '+HOTFIX_VERSION+'.');
      return false;
    }catch(e){
      if(showToast)v30ActionStatus('Nie udało się sprawdzić wersji — sprawdź połączenie z internetem.');
      return false;
    }
  };

  v30UpdateNow=async function(){
    if(location.protocol==='file:' || location.protocol==='content:'){
      v30ActionStatus('Aktualizacja wymaga wersji uruchomionej z HTTPS.');return;
    }
    v30ActionStatus('Pobieram nową wersję… nie zamykaj aplikacji.');
    const reg=await v30GetRegistration();
    if(!reg){v30ActionStatus('Brak aktywnego mechanizmu aktualizacji.');return;}
    try{
      const info=await hfServerVersion();
      if(info.version===HOTFIX_VERSION && !reg.waiting){
        // Nawet gdy numer wersji się zgadza, wymuszamy sprawdzenie SW — hotfix może mieć ten sam numer publiczny.
        try{await reg.update();}catch(e){}
      }else{
        await reg.update();
      }
      let worker=reg.waiting || await hfWaitWorker(reg,22000);
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
      v30ActionStatus('Masz najnowszą wersję '+HOTFIX_VERSION+'.');
    }catch(e){
      v30ActionStatus('Aktualizacja nie została dokończona. Dane aplikacji są bezpieczne — spróbuj ponownie.');
    }
  };

  renderSettingsV30=function(){
    const app=document.getElementById('app');app.innerHTML='';
    const d=document.createElement('div');d.className='v30-settings';
    const installed=v30IsStandalone();
    d.innerHTML=`<div class="v30-set-head"><div class="v30-set-brand">L&M<small>TECHNIC ENERGY</small></div><div class="v30-set-title"><h1>USTAWIENIA APLIKACJI</h1><p>INSTALACJA • WERSJA • AKTUALIZACJE</p></div><button class="v30-set-back" onclick="go('home')">← PULPIT</button></div><div class="v30-set-body">
      <section class="v30-set-card"><img class="v30-app-icon" src="./icon-512.png" alt="Ikona L&M Technic Energy"><h2>EUROPEJSKI KALKULATOR PELETU 1.2 PREMIUM</h2><p>Wersja instalowana V31.0.7 — FAKTURY PREMIUM + ostateczny MASTER faktury, czytelny dół dokumentu, poprawione pola liczbowe oraz pewny mechanizm aktualizacji offline/online.</p><div style="clear:both"></div><div class="v30-set-status"><div class="v30-set-stat"><span>WERSJA</span><b>${HOTFIX_VERSION}</b></div><div class="v30-set-stat"><span>TRYB</span><b class="green">${installed?'ZAINSTALOWANA':'PRZEGLĄDARKA'}</b></div><div class="v30-set-stat"><span>AKTUALIZACJE</span><b class="green">AUTOMATYCZNE + RĘCZNE</b></div></div><div class="v30-set-actions"><button type="button" id="v30_install_btn" class="v30-set-btn blue">⬇ ZAINSTALUJ APLIKACJĘ</button><button type="button" id="v30_update_btn" class="v30-set-btn green">↻ UAKTUALNIJ APLIKACJĘ</button></div><div class="v30-update-note">Aplikacja uruchamia się z lokalnej kopii. Internet służy do sprawdzania i pobierania aktualizacji w tle.</div><div id="v30_action_status" class="v30-action-status">Przyciski gotowe. Możesz sprawdzić wersję lub uruchomić aktualizację.</div></section>
      <section class="v30-set-card"><h2>SPRAWDZANIE WERSJI</h2><p>Aplikacja sprawdza aktualizacje przy uruchomieniu oraz na żądanie.</p><div class="v30-set-actions"><button type="button" id="v30_check_btn" class="v30-set-btn gray">🔎 SPRAWDŹ AKTUALIZACJĘ</button><button type="button" id="v30_refresh_btn" class="v30-set-btn gray">⟳ ODŚWIEŻ APLIKACJĘ</button></div></section>
    </div>`;
    app.appendChild(d);
    const bind=(id,fn)=>{const el=document.getElementById(id);if(el){el.onclick=null;el.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();fn();},{passive:false});}};
    bind('v30_install_btn',v30Install);
    bind('v30_update_btn',v30UpdateNow);
    bind('v30_check_btn',()=>v30CheckUpdate(true));
    bind('v30_refresh_btn',v30RefreshApp);
    window.scrollTo({top:0,left:0,behavior:'auto'});
  };
})();
