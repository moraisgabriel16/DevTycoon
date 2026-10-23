const artifact=require('./artifacts.cjs');
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),base='http://127.0.0.1:4303',passed=[],errors=[];let browser;
const server=spawn(process.execPath,['server.cjs'],{cwd:root,env:{...process.env,PORT:'4303'},stdio:'pipe'}),pass=s=>{passed.push(s);console.log('✓ '+s)};
(async()=>{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.stderr.once('data',d=>reject(Error(String(d))))});
  browser=await chromium.launch({channel:'msedge',headless:true});
  const slowContext=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block'}),slow=await slowContext.newPage();slow.on('pageerror',e=>errors.push(e.message));
  let release;const gate=new Promise(resolve=>release=resolve);await slow.route('**/title-v30.js',async route=>{await gate;await route.continue()});const navigation=slow.goto(base);
  await slow.waitForFunction(()=>window.Studio28);assert.equal(await slow.locator('#bootScreen36').isVisible(),true);
  assert.equal(await slow.evaluate(()=>ts.childElementCount),0);assert.equal(await slow.locator('#gameLayout28').isVisible(),false);
  const day=await slow.evaluate(()=>{acc=DAYT*3;return G.day});await slow.waitForTimeout(200);assert.equal(await slow.evaluate(()=>G.day),day);await slow.evaluate(()=>acc=0);
  await slow.screenshot({animations:'disabled',path:artifact('boot-loading-fixed.png')});release();await navigation;await slow.waitForFunction(()=>DevCorpBoot.ready);
  assert.equal(await slow.locator('#bootScreen36').isVisible(),false);assert.equal(await slow.locator('#startPlay30').isVisible(),true);assert.equal(await slow.locator('#gameLayout28').isVisible(),false);assert.equal(await slow.evaluate(()=>gameLayout28.inert&&gameHeader28.inert),true);
  pass('Módulo atrasado mostra apenas a abertura atual, sem menu antigo, escritório ou avanço da simulação');
  await slow.locator('#startDemo30').click();await slow.waitForFunction(()=>!gameLayout28.inert);assert.equal(await slow.locator('#gameLayout28').isVisible(),true);
  const state=await slow.evaluate(()=>{spd(0);save();return{money:G.money,day:G.day,staff:G.emps.length}});await slow.evaluate(()=>showTitle());assert.equal(await slow.locator('#gameLayout28').isVisible(),false);await slow.locator('#startPlay30').click();assert.deepEqual(await slow.evaluate(()=>({money:G.money,day:G.day,staff:G.emps.length})),state);
  pass('Continuar e reabrir menu preservam a empresa e escondem o cenário atrás da abertura');
  const brokenContext=await browser.newContext({serviceWorkers:'block'}),broken=await brokenContext.newPage();let block=true;await broken.route('**/title-v30.js',route=>block?route.abort():route.continue());await broken.goto(base);await broken.waitForFunction(()=>DevCorpBoot.error);
  assert.equal(await broken.locator('#bootRetry36').isVisible(),true);assert.equal(await broken.locator('#gameLayout28').isVisible(),false);assert.equal(await broken.evaluate(()=>DevCorpBoot.ready),false);block=false;await broken.locator('#bootRetry36').click();await broken.waitForFunction(()=>DevCorpBoot.ready);assert.equal(await broken.locator('#startPlay30').isVisible(),true);
  pass('Falha ao baixar um módulo mantém a abertura protegida e permite carregar novamente');
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.waitForFunction(()=>DevCorpBoot.ready);
  for(const[width,height]of [[320,740],[390,844],[844,390]]){await page.setViewportSize({width,height});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.locator('#startOptions30').tap();await page.locator('#settingsBack32').tap();assert.equal(await page.locator('#gameLayout28').isVisible(),false)}
  await page.evaluate(async()=>{await navigator.serviceWorker.ready});
  await page.waitForFunction(async()=>{const c=await caches.open('devcorp-v37-1');return!!await c.match('./index.html')});await page.locator('#startDemo30').tap();await page.evaluate(()=>{spd(0);save();showTitle()});const saved=await page.evaluate(()=>[G.money,G.day,G.emps.length]);await context.setOffline(true);await page.reload();await page.waitForFunction(()=>DevCorpBoot.ready);assert.equal(await page.locator('#gameLayout28').isVisible(),false);assert.deepEqual(await page.evaluate(()=>[G.money,G.day,G.emps.length]),saved);await page.locator('#startPlay30').tap();assert.equal(await page.locator('#gameLayout28').isVisible(),true);
  assert.deepEqual(errors,[]);pass('Abertura, opções e partida funcionam por toque em telas pequenas e offline, preservando o save');
  fs.writeFileSync(artifact('boot-results.json'),JSON.stringify({passed,errors},null,2));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
