const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),base='http://127.0.0.1:4295';
const server=spawn(process.execPath,['server.cjs'],{cwd:root,env:{...process.env,PORT:'4295'},stdio:'pipe'});
let browser;const passed=[];const pass=s=>{passed.push(s);console.log('✓ '+s)};
(async()=>{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.stderr.once('data',d=>reject(new Error(String(d))))});
  try{browser=await chromium.launch({headless:true})}catch{browser=await chromium.launch({channel:'msedge',headless:true})}
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>window.Studio28&&Art28.loaded&&document.querySelector('.start-logo30')?.complete);
  const menu=page.locator('#ts');
  async function checkMenu(){assert.equal(await menu.getByRole('button',{name:/jornada|minha sala|personalizar exterior/i}).count(),0);assert.equal(await page.evaluate(()=>gameHeader28.inert&&gameLayout28.inert),true)}
  await checkMenu();assert.equal(await menu.locator('#startNew30').isVisible(),true);assert.equal(await menu.locator('#startLoad30').isVisible(),true);
  const alpha=await page.evaluate(()=>{const im=document.querySelector('.start-logo30'),c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');g.drawImage(im,0,0);return g.getImageData(0,0,1,1).data[3]});assert.equal(alpha,0);
  await page.screenshot({path:path.join(root,'title-v30-desktop.png')});pass('Menu de entrada contém ações de partida, logo transparente e bloqueia os controles da empresa ao fundo');
  const before=await page.evaluate(()=>({money:G.money,day:G.day,staff:G.emps.map(e=>e.id),active:SLOTDB.active}));
  await page.locator('#startNew30').click();assert.equal(await page.locator('#slotsView').isVisible(),true);assert.match(await page.locator('#slotFeedback').innerText(),/slot 2/i);
  assert.deepEqual(await page.evaluate(()=>({money:G.money,day:G.day,staff:G.emps.map(e=>e.id),active:SLOTDB.active})),before);
  await page.getByRole('button',{name:'Fechar saves',exact:true}).click();await checkMenu();
  await page.locator('#startLoad30').click();assert.equal(await page.locator('.saveSlot').count(),3);await page.getByRole('button',{name:'Fechar saves',exact:true}).click();
  pass('Nova empresa procura um espaço livre; abrir saves não sobrescreve nem muda a campanha atual');
  await page.locator('#startOptions30').click();assert.equal(await page.evaluate(()=>tsStep),2);assert.equal(await page.evaluate(()=>gameHeader28.inert),true);
  await menu.getByRole('button',{name:/Voltar/}).click();await checkMenu();pass('Voltar das opções e dos saves mantém a tela inicial sem atalhos de gestão');
  await page.locator('#startDemo30').click();await page.waitForFunction(()=>ts.style.display==='none'&&!gameLayout28.inert);assert.equal(await page.evaluate(()=>SLOTDB.active),2);
  await page.locator('#commandEntry27').click();assert.equal(await page.locator('#commandView27').isVisible(),true);
  await page.getByRole('button',{name:/Sua sala e avatar/}).click();assert.equal(await page.locator('#personalView').isVisible(),true);await page.evaluate(()=>closePersonalRoom());
  await page.locator('#exteriorEntry').click();assert.equal(await page.locator('#exteriorView').isVisible(),true);await page.locator('#extClose').click();
  pass('Demo abre a partida; Jornada, Minha Sala e exterior continuam acessíveis dentro do jogo');
  await page.evaluate(()=>{spd(0);G.tut=1;save();showTitle()});assert.match(await page.locator('#startPlay30').innerText(),/Continuar partida/);await checkMenu();
  const saved=await page.evaluate(()=>({money:G.money,day:G.day,active:SLOTDB.active}));await page.locator('#startPlay30').click();await page.waitForFunction(()=>ts.style.display==='none'&&!gameHeader28.inert);assert.deepEqual(await page.evaluate(()=>({money:G.money,day:G.day,active:SLOTDB.active})),saved);
  pass('Continuar reabre a empresa salva sem iniciar outra campanha');
  await page.evaluate(()=>showTitle());await page.evaluate(async()=>{await navigator.serviceWorker.ready});await page.waitForFunction(async()=>{const c=await caches.open('devtycoon-v30-1');return !!(await c.match('./assets/v30/devtycoon-logo.png'))});
  await context.setOffline(true);await page.reload();await page.waitForFunction(()=>Art28.loaded&&document.querySelector('.start-logo30')?.naturalWidth>0);await checkMenu();await context.setOffline(false);pass('Abertura e arte do logo carregam offline após o primeiro acesso');
  const mobile=await browser.newContext({viewport:{width:498,height:764},isMobile:true,hasTouch:true,deviceScaleFactor:1}),phone=await mobile.newPage();phone.on('pageerror',e=>errors.push(e.message));await phone.goto(base);await phone.waitForFunction(()=>Art28.loaded&&document.querySelector('.start-logo30')?.naturalWidth>0);
  for(const[width,height,file]of [[498,764,'title-v30-498.png'],[390,844,'title-v30-mobile.png'],[320,740,'title-v30-320.png']]){
    await phone.setViewportSize({width,height});await phone.waitForTimeout(100);assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    const primary=await phone.locator('#startPlay30').boundingBox();assert.ok(primary.height>=44);const point=await phone.locator('#startOptions30').boundingBox();assert.equal(await phone.evaluate(({x,y})=>document.elementFromPoint(x,y)?.closest('button')?.id,{x:point.x+point.width/2,y:point.y+point.height/2}),'startOptions30');
    await phone.screenshot({path:path.join(root,file)});
  }
  await phone.locator('#startDemo30').tap();await phone.waitForFunction(()=>ts.style.display==='none'&&!gameHeader28.inert);pass('Menu em 498, 390 e 320px sem rolagem horizontal; controles do jogo não sobrepõem os botões');
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'tests/title-results.json'),JSON.stringify({date:new Date().toISOString(),passed},null,2));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
