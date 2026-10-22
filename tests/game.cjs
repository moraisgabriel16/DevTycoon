const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),base='http://127.0.0.1:4289';
const server=spawn(process.execPath,['server.cjs'],{cwd:root,env:{...process.env,PORT:'4289'},stdio:'pipe'});
const results=[];
let browser;
function passed(name){results.push(name);console.log('✓ '+name)}
(async()=>{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject)});
  try{browser=await chromium.launch({headless:true})}catch{browser=await chromium.launch({channel:'msedge',headless:true})}
  // Raster icons are generated from our original vector, without external assets.
  const iconPage=await browser.newPage();
  for(const size of [192,512]){
    await iconPage.setViewportSize({width:size,height:size});
    await iconPage.setContent('<style>html,body{margin:0;width:100%;height:100%;overflow:hidden}svg{display:block;width:100%;height:100%}</style>'+fs.readFileSync(path.join(root,'icons/icon.svg'),'utf8'));
    await iconPage.screenshot({path:path.join(root,`icons/icon-${size}.png`),omitBackground:true});
  }
  await iconPage.close();
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base);await page.waitForFunction(()=>typeof openExterior==='function'&&v23Ready&&v21Ready&&v19Ready);
  await page.locator('#startPlay30').click();await page.evaluate(()=>{wl.style.display='none';spd(0)});await page.locator('#exteriorEntry').click();
  await page.waitForSelector('#exteriorView:not([hidden])');
  const before=await page.evaluate(()=>({money:G.money,day:G.day}));
  await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>paused()),true);
  await page.getByRole('button',{name:'Fachada · cor 4',exact:true}).click();
  await page.getByRole('button',{name:'Identidade',exact:true}).click();await page.locator('#extSign').fill('Minha Aurora');
  await page.locator('#extSave').click();
  assert.equal(await page.evaluate(()=>G.exteriors.buildings[0].sign),'Minha Aurora');
  assert.deepEqual(await page.evaluate(()=>({money:G.money,day:G.day})),before);
  passed('Editor pausa a empresa e aplica alterações sem cobrar dinheiro');
  await page.reload();await page.waitForFunction(()=>typeof openExterior==='function');
  await page.evaluate(()=>{tsHide();openExterior()});
  await page.getByRole('button',{name:'Identidade',exact:true}).click();assert.equal(await page.locator('#extSign').inputValue(),'Minha Aurora');
  await page.locator('#extSign').fill('Não salvar');await page.locator('#extClose').click();await page.locator('#exteriorEntry').click();
  assert.equal(await page.locator('#extSign').inputValue(),'Minha Aurora');
  passed('Personalização persiste após recarregar e descarta prévias não aplicadas');
  await page.locator('#extBuilding').selectOption('5');assert.equal(await page.locator('#extSave').isDisabled(),true);
  assert.equal(await page.evaluate(()=>G.exteriors.buildings[5]),undefined);
  passed('Prédios futuros permitem prévia sem alterar a campanha');
  await page.locator('#extClose').click();
  await page.evaluate(()=>loadSlot(2));await page.locator('#exteriorEntry').click();
  assert.equal(await page.locator('#extBuilding').inputValue(),'4');
  await page.getByRole('button',{name:'Identidade',exact:true}).click();await page.locator('#extSign').fill('Aurora Campus');
  await page.getByRole('button',{name:'Cobertura',exact:true}).click();
  for(const name of ['Energia solar','Jardim','Conectado','Terraço'])await page.locator('#exteriorPanel').getByRole('button',{name:new RegExp(name)}).click();
  await page.locator('#extSave').click();
  assert.equal(await page.evaluate(()=>G.exteriors.buildings[4].roof),'terrace');
  await page.locator('#extDay').click();await page.screenshot({path:path.join(root,'exterior-desktop.png')});
  const download=page.waitForEvent('download');await page.locator('#extExport').click();assert.ok((await download).suggestedFilename().endsWith('.png'));
  await page.locator('#extClose').click();await page.evaluate(()=>loadSlot(0));await page.locator('#exteriorEntry').click();
  await page.getByRole('button',{name:'Identidade',exact:true}).click();assert.equal(await page.locator('#extSign').inputValue(),'Minha Aurora');
  passed('Slots independentes, quatro coberturas e exportação de foto PNG');
  await page.locator('#extClose').click();await page.evaluate(()=>{const c=G.off.find(o=>o.easy)||G.off[0];accept(c.id);for(let i=0;i<5;i++)tick();save()});
  assert.ok(await page.evaluate(()=>G.day>=6&&G.emps.length>0));passed('Simulação original: aceitar contrato e avançar dias');
  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
  const phone=await mobile.newPage();phone.on('pageerror',e=>errors.push(e.message));await phone.goto(base);await phone.waitForFunction(()=>typeof openExterior==='function');
  await phone.evaluate(()=>{tsHide();openExterior()});
  await phone.getByRole('button',{name:'Jardim',exact:true}).click();
  await phone.locator('#exteriorPanel').getByRole('button',{name:/Fonte/}).click();
  // Slot 1: Q(1,4), converted from intrinsic canvas pixels to touch coordinates.
  const rect=await phone.locator('#exteriorCanvas').boundingBox();
  await phone.touchscreen.tap(rect.x+(480-3*29)*rect.width/960,rect.y+(265+5*14.5-1)*rect.height/720);
  await phone.locator('#extSave').click();assert.equal(await phone.evaluate(()=>G.exteriors.buildings[0].props[1]),'fountain');
  assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await phone.locator('#exteriorView').evaluate(e=>e.scrollTo(0,0));await phone.screenshot({path:path.join(root,'exterior-mobile.png')});
  await phone.getByRole('button',{name:'Identidade',exact:true}).click();await phone.locator('#extSign').fill('<img onerror=alert(1)>');await phone.locator('#extSave').click();assert.equal(await phone.locator('#exteriorView img').count(),0);
  await phone.locator('#extClose').click();await phone.evaluate(()=>loadSlot(2));await phone.waitForTimeout(200);await phone.screenshot({path:path.join(root,'game-mobile.png'),fullPage:true});
  passed('Tela de celular sem rolagem horizontal; toque posiciona item e texto é tratado como texto');
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));});
  await page.waitForFunction(async()=>{const c=await caches.open('devtycoon-v30-1');return !!(await c.match('./studio-v29.css'))});
  await context.setOffline(true);await page.reload();await page.waitForFunction(()=>typeof openExterior==='function');await page.evaluate(()=>{tsHide();openExterior()});
  assert.equal(await page.locator('#exteriorView').isVisible(),true);await context.setOffline(false);passed('Reabertura offline pelo Service Worker com campanha preservada');
  assert.deepEqual(errors,[]);passed('Nenhum erro JavaScript nos fluxos testados');
  fs.writeFileSync(path.join(root,'tests/results.json'),JSON.stringify({date:new Date().toISOString(),passed:results},null,2));
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
