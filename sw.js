const PREFIX="pm-",C=PREFIX+"v9";
const FILES=["./","index.html","dashboard.html","dispatch.html","orders.html","stock.html","stickers.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).catch(()=>{}));
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
