const APP_VERSION='V31.2.7-START-FIX-1';
const CACHE='lm-technic-energy-'+APP_VERSION;
const PREFIX='lm-technic-energy-';
const CORE=["./index.html","./app-main.js","./assets/home-master.jpg","./invoice-master.png","./invoice-v31.css","./invoice-v31.js","./contractors-eu.json","./logo-lm.png","./crm-status-v32.css","./crm-status-v32.js","./assistant-messages.json"];
const OPTIONAL=["./manifest.webmanifest","./version.json","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./assets/embedded-01-23353ee74d28.png","./assets/embedded-02-269b27416276.jpg","./assets/embedded-03-d76877ed0cd3.png","./assets/embedded-04-4351a0e91554.jpg","./assets/embedded-05-e9cb463492af.jpg","./assets/embedded-06-b1077ce2a5e0.jpg","./assets/embedded-07-2f86967b14db.jpg","./assets/embedded-08-4cf325aaa2a1.jpg","./assets/embedded-09-d3b067217c58.jpg","./assets/embedded-10-8d5163e0f631.jpg","./assets/embedded-11-4734948ebd51.jpg","./assets/embedded-12-299c98517af1.jpg","./assets/embedded-13-61e4db83bbda.jpg","./assets/embedded-14-6272fe114df3.jpg","./assets/embedded-15-4d433f7d56e1.jpg","./assets/embedded-16-94c1b51168b4.jpg","./assets/embedded-17-e21d1025bd1b.jpg","./assets/embedded-18-115e7fac6434.jpg","./assets/embedded-19-c94b32b378aa.jpg","./assets/embedded-20-9b5b94f55cc6.jpg","./assets/embedded-21-cdf5bab707d5.jpg","./assets/embedded-22-df8ba4137bea.jpg","./assets/embedded-23-3666170b4c35.jpg","./assets/embedded-24-e8efaf902e28.jpg","./assets/embedded-25-328789bc0c19.jpg","./assets/embedded-26-a81fc56b720f.jpg","./assets/embedded-27-b81a07fe65f8.jpg","./assets/embedded-28-9d8ba3751443.jpg","./assets/embedded-29-a263125d9108.jpg","./assets/embedded-30-42afbc0a1e3f.png","./assets/embedded-31-0458cc74b44c.jpg","./assets/embedded-32-68b2f538b687.jpg","./assets/embedded-33-3f3d57217baa.jpg","./assets/embedded-34-45708673804e.png","./assets/embedded-35-249ccc4abc4f.png","./assets/embedded-36-6d8017ec071a.png","./assets/embedded-37-dcbd3f72fb8d.svg","./assets/embedded-38-8f71b98937b9.png","./assets/embedded-39-f69f48f54df4.png","./assets/embedded-40-22b667fee466.png"];

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


  if(/\/assistant-messages\.json$/.test(url.pathname)){
    event.respondWith((async()=>{
      try{const r=await fetch(req,{cache:'no-store'});if(r&&r.ok){const c=await caches.open(CACHE);await c.put('./assistant-messages.json',r.clone());}return r;}
      catch(e){return serveLocal('./assistant-messages.json',req);}
    })());
    return;
  }

  if(/\/contractors-eu\.json$/.test(url.pathname)){
    event.respondWith((async()=>{
      try{
        const r=await fetch(req,{cache:'no-store'});
        if(r&&r.ok){const c=await caches.open(CACHE);await c.put('./contractors-eu.json',r.clone());}
        return r;
      }catch(e){return serveLocal('./contractors-eu.json',req);}
    })());
    return;
  }

  if(req.mode==='navigate'){
    event.respondWith(serveLocal('./index.html',req));
    return;
  }

  let local=null;
  if(/\/index\.html$/.test(url.pathname))local='./index.html';
  else if(/\/app-main\.js$/.test(url.pathname))local='./app-main.js';
  else if(/\/assets\/home-master\.jpg$/.test(url.pathname))local='./assets/home-master.jpg';
  else if(/\/invoice-v31\.js$/.test(url.pathname))local='./invoice-v31.js';
  else if(/\/invoice-v31\.css$/.test(url.pathname))local='./invoice-v31.css';
  else if(/\/invoice-master\.png$/.test(url.pathname))local='./invoice-master.png';
  else if(/\/logo-lm\.png$/.test(url.pathname))local='./logo-lm.png';
  else if(/\/contractors-eu\.json$/.test(url.pathname))local='./contractors-eu.json';
  else if(/\/crm-status-v32\.js$/.test(url.pathname))local='./crm-status-v32.js';
  else if(/\/crm-status-v32\.css$/.test(url.pathname))local='./crm-status-v32.css';
  else if(/\/assistant-messages\.json$/.test(url.pathname))local='./assistant-messages.json';
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
