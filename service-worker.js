const APP_VERSION='V31.0.8-FINAL-MASTER';
const CACHE='lm-technic-energy-'+APP_VERSION;
const PREFIX='lm-technic-energy-';
const CORE=['./index.html','./invoice-master.png','./invoice-v31.css','./invoice-v31.js'];
const OPTIONAL=['./manifest.webmanifest','./version.json','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];

async function freshPut(cache,path){
  const sep=path.includes('?')?'&':'?';
  const r=await fetch(path+sep+'v='+encodeURIComponent(APP_VERSION),{cache:'no-store'});
  if(!r||!r.ok)throw new Error('HTTP '+(r&&r.status)+' '+path);
  await cache.put(path,r.clone());
  return r;
}

async function oldCached(path){
  const keys=(await caches.keys()).filter(k=>k.startsWith(PREFIX)&&k!==CACHE).reverse();
  for(const k of keys){
    const c=await caches.open(k);
    const hit=await c.match(path);
    if(hit)return hit;
  }
  return null;
}

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    // Kluczowa poprawka: nowa wersja aktywuje się dopiero po pobraniu całego rdzenia.
    const cache=await caches.open(CACHE);
    for(const path of CORE)await freshPut(cache,path);
    await Promise.allSettled(OPTIONAL.map(path=>freshPut(cache,path)));
    await self.skipWaiting();
  })());
});

self.addEventListener('message',event=>{
  if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

async function serveLocal(path,req){
  const c=await caches.open(CACHE);
  const hit=await c.match(path||req);
  if(hit)return hit;
  const old=await oldCached(path||req);
  if(old)return old;
  try{return await fetch(req||path,{cache:'no-store'});}catch(e){return Response.error();}
}

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;

  if(/\/version\.json$/.test(url.pathname)){
    event.respondWith(fetch(req,{cache:'no-store'}).catch(()=>serveLocal('./version.json',req)));
    return;
  }

  if(req.mode==='navigate'){
    event.respondWith(serveLocal('./index.html',req));
    return;
  }

  let local=null;
  if(/\/index\.html$/.test(url.pathname))local='./index.html';
  else if(/\/invoice-v31\.js$/.test(url.pathname))local='./invoice-v31.js';
  else if(/\/invoice-v31\.css$/.test(url.pathname))local='./invoice-v31.css';
  else if(/\/invoice-master\.png$/.test(url.pathname))local='./invoice-master.png';
  if(local){
    event.respondWith(serveLocal(local,req));
    return;
  }

  event.respondWith((async()=>{
    const c=await caches.open(CACHE);
    const hit=await c.match(req);
    if(hit)return hit;
    const old=await oldCached(req);
    if(old)return old;
    try{
      const r=await fetch(req);
      if(r&&r.ok)c.put(req,r.clone());
      return r;
    }catch(e){return Response.error();}
  })());
});
