const CACHE = 'devcorp-v35-1';
const FILES = ['./','./index.html','./exterior.js','./exterior.css','./research.js','./gameplay-fixes.js','./progression.js','./progression.css','./art-v28.js','./npc-life-v28.js','./studio-v28.js','./studio-v28.css','./studio-v29.css','./runtime-v31.js','./title-v30.js','./title-v30.css','./management-v32.js','./management-v32.css','./neighborhood-v33.js','./customization-v33.js','./neighborhood-v33.css','./district-v34.js','./district-v34.css','./story-v35.js','./story-v35.css','./assets/devcorp-logo.svg','./assets/desk-double-empty.png','./assets/v30/devtycoon-logo.png','./pwa.js','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>(key.startsWith('devtycoon-')||key.startsWith('devcorp-'))&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;
  }).catch(()=>caches.match(event.request).then(cached=>cached||(event.request.mode==='navigate'?caches.match('./index.html'):Response.error()))));
});
