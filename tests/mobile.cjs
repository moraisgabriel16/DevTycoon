const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path');
const {spawn}=require('node:child_process');const artifact=require('./artifacts.cjs');
const server=spawn(process.execPath,['server.cjs'],{cwd:path.resolve(__dirname,'..'),env:{...process.env,PORT:'4312'},stdio:'pipe'});let browser;
(async()=>{await new Promise((r,j)=>{server.stdout.once('data',r);server.once('error',j)});browser=await chromium.launch({channel:'msedge',headless:true});const errors=[];
 for(const [width,height]of [[320,740],[390,844],[768,1024],[899,1024],[844,390]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true}),p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4312');await p.waitForFunction(()=>DevCorpBoot.ready&&window.Mobile41);
  await p.evaluate(()=>{tsHide();spd(0);wl.style.display='none';G.tut=1;ui()});
  assert.equal(await p.evaluate(()=>Mobile41.active),true);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  const nav=await p.locator('#dock button').evaluateAll(list=>list.filter(e=>e.getBoundingClientRect().width>0).map(e=>({id:e.id,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})));
  assert.equal(nav.length,5);assert.ok(nav.every(e=>e.w>=44&&e.h>=44));
  await p.locator('#tb_ct').tap();await p.waitForTimeout(200);
  const sheet=await p.locator('#sheet').boundingBox();assert.ok(sheet.y>=0&&sheet.y+sheet.height<=height-69);assert.ok(sheet.height>=height*.7);
  assert.equal(await p.evaluate(()=>document.getElementById('mainc').inert),true);
  const easy=p.locator('.contract-card38').filter({has:p.locator('.accept38')}).first();await easy.locator('.accept38').scrollIntoViewIfNeeded();await easy.locator('.accept38').tap();assert.equal(await p.evaluate(()=>G.act.length),1);
  await p.screenshot({path:artifact(`mobile-v41-contracts-${width}.png`)});
  await p.locator('#sheet .grab button').tap();assert.equal(await p.evaluate(()=>shOpen),false);assert.equal(await p.evaluate(()=>document.getElementById('mainc').inert),false);
  await p.locator('#more28').tap();await p.getByRole('button',{name:'Loja de melhorias',exact:true}).tap();assert.equal(await p.evaluate(()=>tab),'sh');await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>shOpen),false);
  await p.locator('#tb_bd').tap();await p.evaluate(()=>pk('plant'));assert.equal(await p.evaluate(()=>shOpen),false);assert.equal(await p.evaluate(()=>tool),'plant');await p.locator('#placementCancel41').tap();
  if(width<900&&height>500){await p.locator('.coach-expand41').tap();assert.equal(await p.locator('.coach-expand41').getAttribute('aria-expanded'),'true');await p.locator('.coach-expand41').tap();
   await p.evaluate(()=>Customization33.open('avatar'));assert.equal(await p.locator('.personalStage').isVisible(),false);assert.equal(await p.locator('#personalPanel').evaluate(e=>getComputedStyle(e).maxHeight),'none');await p.locator('#avatarName').fill('Minha pessoa');await p.locator('#avatarName').press('Tab');await p.locator('.outfit-presets33 button').first().tap();assert.equal(await p.locator('#avatarName').inputValue(),'Minha pessoa');if(width===390){await p.setViewportSize({width,height:430});await p.locator('#avatarName').scrollIntoViewIfNeeded();await p.locator('#avatarName').fill('Nome com teclado');const field=await p.locator('#avatarName').boundingBox();assert.ok(field.y>=0&&field.y+field.height<=430);await p.setViewportSize({width,height})}await p.screenshot({path:artifact(`mobile-v41-avatar-${width}.png`)});await p.evaluate(()=>closePersonalRoom());
  }
  await p.evaluate(()=>{tool='sel';shClose();Studio28.setView('outside',false)});const camera=await p.locator('#worldCanvas28').boundingBox(),arena=await p.locator('#sceneArena28').boundingBox();assert.ok(camera.width<=arena.width+4&&camera.height<=arena.height+4,'Câmera inicial deve caber na cena');await p.screenshot({path:artifact(`mobile-v41-world-${width}.png`)});await context.close();console.log('✓ '+width+'×'+height+': toque, contrato real, loja, construção e retorno à cena');
 }
 const desktop=await browser.newPage({viewport:{width:1440,height:1000}});await desktop.goto('http://127.0.0.1:4312');await desktop.waitForFunction(()=>window.Mobile41);await desktop.evaluate(()=>{tsHide();wl.style.display='none';tabOpen('ct')});assert.equal(await desktop.evaluate(()=>Mobile41.active),false);assert.equal(await desktop.evaluate(()=>document.getElementById('mainc').inert),false);assert.equal(await desktop.locator('#mobileBackdrop41').isVisible(),false);assert.deepEqual(errors,[]);console.log('✓ Desktop preservado; sem erros de JavaScript');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
