const PREFIX="pm-",APP_VER="v9",C=PREFIX+"v18";
const FILES=["./","index.html","dashboard.html","dispatch.html","orders.html","all-orders.html","stock.html","manifest.webmanifest","icon-192.png","icon-192.png?v=17","icon-512.png","icon-512.png?v=17"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(C).then(c=>Promise.all(FILES.map(u=>fetch(new Request(u,{cache:"reload"})).then(r=>r.ok?c.put(u,r):null).catch(()=>c.add(u))))).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith(PREFIX)&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||!e.request.url.startsWith("http"))return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r&&(r.ok||r.type==="opaque")){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp)).catch(()=>{})}
      return r;
    }).catch(()=>caches.match(e.request,{ignoreSearch:true}))
  );
});
