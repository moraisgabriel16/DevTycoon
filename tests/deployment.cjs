const artifact=require('./artifacts.cjs');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist-web');
execFileSync(process.execPath,['build.cjs'],{cwd:root,stdio:'inherit'});
const types={'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.html':'text/html','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{const rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(out,'.'+(rel==='/'?'/index.html':rel));if(!file.startsWith(out+path.sep)){res.writeHead(403).end();return}fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'text/plain','Cache-Control':'no-cache'}).end(data)})});
let browser;
(async()=>{
  await new Promise(r=>server.listen(4299,'127.0.0.1',r));browser=await chromium.launch({channel:'msedge',headless:true});
  const context=await browser.newContext({viewport:{width:1920,height:950}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1:4299'))errors.push(r.status()+' '+r.url())});
  await page.goto('http://127.0.0.1:4299');await page.waitForFunction(()=>window.DevCorp32&&Art28.loaded&&window.DevCorpBoot?.ready);await page.locator('#startOptions30').click();
  for(const viewport of [{width:1920,height:950},{width:390,height:844},{width:320,height:740},{width:844,height:390}]){
    await page.setViewportSize(viewport);for(const tab of ['audio','game','comfort']){await page.locator(`[data-settings="${tab}"]`).click();const r=await page.locator('.settings-shell32').boundingBox();assert.ok(r.x>=0&&r.x+r.width<=viewport.width+.5);assert.ok(r.y>=0&&r.y+r.height<=viewport.height+.5);assert.equal(await page.locator('#settingsBack32').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}),true)}
  }
  await page.setViewportSize({width:1920,height:950});await page.locator('[data-settings="audio"]').click();await page.screenshot({path:artifact('options-release-desktop.png')});await page.locator('#opt32-mus').fill('35');await page.locator('#settingsBack32').click();await page.reload();await page.waitForFunction(()=>window.DevCorp32);assert.equal(await page.evaluate(()=>OPT.mus),.35);
  await page.evaluate(async()=>{await navigator.serviceWorker.ready});await page.waitForFunction(async()=>{const c=await caches.open('devcorp-v37-1');return!!await c.match('./management-v32.js')});await context.setOffline(true);await page.reload();await page.waitForFunction(()=>window.DevCorp32&&Art28.loaded&&window.DevCorpBoot?.ready);await page.locator('#startOptions30').click();assert.equal(await page.locator('#opt32-mus').inputValue(),'35');assert.deepEqual(errors,[]);
  fs.writeFileSync(artifact('deployment-results.json'),JSON.stringify({passed:['Pasta publicada contém todas as dependências','Configurações funcionam em desktop, 320px, 390px e paisagem','Volume persiste após recarregar','Publicação completa funciona offline'],errors},null,2));console.log('✓ Publicação completa: opções, telas pequenas, persistência e modo offline');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.close()});
