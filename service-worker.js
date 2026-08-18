const APP_VERSION='V31.0.0';
const CACHE='lm-technic-energy-'+APP_VERSION;
const CORE=['./','./index.html','./manifest.webmanifest','./version.json','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./LM_Technic_Energy_Biznesplan_i_materialy_MASTER_25_kart.pdf','./invoice-master.png','./invoice-v31.css','./invoice-v31.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));});
self.addEventListener('message',event=>{if(event.data && event.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const k of await caches.keys())if(k!==CACHE)await caches.delete(k);await self.clients.claim();})());});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith((async()=>{try{const fresh=await fetch(req,{cache:'no-store'});const c=await caches.open(CACHE);c.put('./index.html',fresh.clone());return fresh;}catch(e){return (await caches.match(req)) || (await caches.match('./index.html'));}})());
    return;
  }
  if(url.pathname.endsWith('/version.json') || url.pathname.endsWith('/service-worker.js')){
    event.respondWith(fetch(req,{cache:'no-store'}).catch(()=>caches.match(req)));
    return;
  }
  event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{const fresh=await fetch(req);const c=await caches.open(CACHE);c.put(req,fresh.clone());return fresh;}catch(e){return cached;}})());
});
