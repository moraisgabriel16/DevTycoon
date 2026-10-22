const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),base='http://127.0.0.1:4290';
const server=spawn(process.execPath,['server.cjs'],{cwd:root,env:{...process.env,PORT:'4290'},stdio:'pipe'});
const results=[];let browser;
function pass(name){results.push(name);console.log('✓ '+name)}
(async()=>{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.stderr.once('data',d=>reject(new Error(String(d))))});
  try{browser=await chromium.launch({headless:true})}catch{browser=await chromium.launch({channel:'msedge',headless:true})}
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>!!window.DevJourney27&&v23Ready&&v21Ready&&v19Ready);
  await page.evaluate(()=>{tsHide();spd(0);G.tut=1;G.name='Estúdio Horizonte';ui()});
  await page.locator('#commandEntry27').click();assert.equal(await page.evaluate(()=>paused()),true);
  assert.equal(await page.getByRole('button',{name:'Concluir capítulo',exact:true}).isDisabled(),true);
  await page.getByRole('button',{name:'⌘ Pesquisa',exact:true}).click();assert.equal(await page.locator('.research27-node').count(),9);
  assert.equal(await page.locator('.research27-learn:not([disabled])').count(),0);
  await page.getByRole('button',{name:'Voltar ao jogo',exact:true}).click();assert.equal(await page.locator('#mainc').evaluate(e=>e.inert),false);
  pass('Central pausa o jogo, apresenta nove pesquisas e bloqueia recompensas não conquistadas');
  // Deliver the actual starter contract through its normal workload, not by awarding money.
  const first=await page.evaluate(()=>{
    const o=G.off.find(o=>o.easy);const expected=o.reward;accept(o.id);
    const original=Math.random;Math.random=()=>.001;
    try{for(let i=0;i<18&&!(G.done>0);i++){
      // The frame normally sets seated as the actor reaches the already assigned desk.
      for(const e of G.emps){e.x=2;e.y=2;e.seated=true;e.brk=null;}
      tick();
    }}finally{Math.random=original}
    return {done:G.done,knowledge:Research27.points(),log:G.log,expected,day:G.day,cash:G.money};
  });
  assert.equal(first.done,1);assert.equal(first.knowledge,2);assert.ok(first.cash>0);assert.equal(first.log.some(x=>x.includes('Bugs em')),false);
  const knowledge=await page.evaluate(()=>{const p=Research27.points();tick();return {before:p,after:Research27.points()}});assert.equal(knowledge.before,knowledge.after);
  pass('Primeira padaria entrega por produção real, sem multa aleatória, e rende dois conhecimentos');
  await page.locator('#commandEntry27').click();await page.getByRole('button',{name:'⌘ Pesquisa',exact:true}).click();
  const beforeProduction=await page.evaluate(()=>operatingBoost(G.emps[0]));await page.getByRole('button',{name:'Pesquisar Código sustentável',exact:true}).click();
  assert.equal(await page.evaluate(()=>Research27.points()),0);assert.ok(Math.abs((await page.evaluate(()=>operatingBoost(G.emps[0])))/beforeProduction-1.05)<1e-8);
  const repeat=await page.evaluate(()=>{const node=document.querySelector('.research27-owned');node.click();return Research27.ensure().learned.length});assert.equal(repeat,1);
  pass('Pesquisa compra uma vez, consome pontos e aplica +5% à produção');
  await page.getByRole('button',{name:'Voltar ao jogo',exact:true}).click();
  await page.evaluate(()=>{
    const c=G.cands.findIndex(c=>c.role==='front'||c.role==='back');hire(c<0?0:c);
    G.exteriors={version:1,buildings:{0:{wall:'#72959b',sign:'Horizonte'}}};DevJourney27.scan();ui();
  });
  await page.locator('#commandEntry27').click();
  const claim=await page.evaluate(()=>{const cash=G.money,one=DevJourney27.claim(),after=G.money,two=DevJourney27.claim();return{one,two,reward:after-cash,claimed:DevJourney27.ensure().claimed}});
  assert.deepEqual(claim,{one:true,two:false,reward:300,claimed:[0]});
  await page.reload();await page.waitForFunction(()=>!!window.DevJourney27);
  assert.deepEqual(await page.evaluate(()=>DevJourney27.ensure().claimed),[0]);assert.equal(await page.evaluate(()=>Research27.unlockedCount()),1);
  pass('Capítulo paga uma vez; jornada, pesquisa e fachada sobrevivem ao recarregamento');
  // Use the shipped demo for advanced systems; its real team already has all roles.
  await page.evaluate(()=>{tsHide();loadSlot(2);G.journey27.showcases={};for(const r in G.act[0].need)G.act[0].need[r]=0;tick();DevJourney27.open('showcases')});
  assert.equal(await page.evaluate(()=>DevJourney27.startShowcase('bairro')),true);
  assert.equal(await page.evaluate(()=>DevJourney27.startShowcase('bairro')),false);
  assert.equal(await page.evaluate(()=>DevJourney27.startShowcase('festival')),false);
  assert.equal(await page.evaluate(()=>G.act.filter(c=>c.showcase27).length),1);
  await page.screenshot({path:path.join(root,'showcases-desktop.png')});
  const showcase=await page.evaluate(()=>{const c=G.act.find(c=>c.showcase27);for(const role in c.need)c.need[role]=0;const before=Research27.points();tick();return{state:DevJourney27.ensure().showcases.bairro,album:G.life.album.some(m=>m.key==='showcase27:bairro'),knowledge:Research27.points()-before}});
  assert.equal(showcase.state.status,'complete');assert.equal(showcase.album,true);assert.ok(showcase.knowledge>=2);assert.equal(await page.evaluate(()=>DevJourney27.startShowcase('bairro')),false);
  await page.evaluate(()=>{DevJourney27.close();openExterior()});await page.getByRole('button',{name:'Jardim',exact:true}).click();
  assert.equal(await page.locator('#exteriorPanel').getByRole('button',{name:/Estandarte/}).isDisabled(),false);
  assert.equal(await page.locator('#exteriorPanel').getByRole('button',{name:/Escultura/}).isDisabled(),true);
  await page.locator('#extClose').click();await page.evaluate(()=>DevJourney27.open('showcases'));
  assert.equal(await page.evaluate(()=>DevJourney27.startShowcase('festival')),true);
  const fail=await page.evaluate(()=>{const i=G.act.findIndex(c=>c.showcase27==='festival');dropC(i);return{state:DevJourney27.ensure().showcases.festival,retry:DevJourney27.startShowcase('festival')}});assert.equal(fail.state.status,'failed');assert.equal(fail.retry,false);
  await page.evaluate(()=>{for(let i=0;i<3;i++)tick()});assert.equal(await page.evaluate(()=>DevJourney27.startShowcase('festival')),true);
  pass('Vitrine permite um projeto por vez, entrega selo e bloqueia repetição; falha pode ser refeita após três dias');
  await page.evaluate(()=>{DevJourney27.close();openExterior()});await page.locator('#extSave').click();await page.locator('#extClose').click();
  const ipo=await page.evaluate(()=>{const claimed=[0,1,2,3,4,5,6];DevJourney27.ensure().claimed=claimed;const ex=JSON.stringify(G.exteriors),count=G.prestige||0;ipo2('rev');return{claimed:DevJourney27.ensure().claimed,prestige:G.prestige,previous:count,exterior:JSON.stringify(G.exteriors)===ex,showcase:DevJourney27.ensure().showcases.bairro.status,active:DevJourney27.ensure().showcases.festival.status,research:Research27.unlockedCount()}});
  assert.deepEqual(ipo.claimed,[0,1,2,3,4,5,6]);assert.equal(ipo.prestige,ipo.previous+1);assert.equal(ipo.exterior,true);assert.equal(ipo.showcase,'complete');assert.equal(ipo.active,'failed');assert.equal(ipo.research,0);
  pass('IPO preserva capítulos e coleção, mantém preferências da sede e reinicia a pesquisa da nova empresa');
  const validation=await page.evaluate(()=>{const snapshot=cloneSave();const out=parseImported(JSON.stringify(snapshot));return{journey:!!out.journey27,research:!!out.research27,exterior:!!out.exteriors}});assert.deepEqual(validation,{journey:true,research:true,exterior:true});
  pass('Exportação e importação transportam os novos sistemas');
  const allResearch=await page.evaluate(()=>{
    const e=companyStaff()[0];e.mood=85;const before=operatingBoost(e),state=Research27.ensure();state.points=39;
    const panel=Research27.renderPanel();for(let i=0;i<9;i++){const b=[...panel.querySelectorAll('button')].find(b=>!b.disabled);if(b)b.click()}
    const c=genO(),bonus=c.researchApplied27;return{count:Research27.unlockedCount(),points:Research27.points(),ratio:operatingBoost(e)/before,bonus};
  });assert.equal(allResearch.count,9);assert.equal(allResearch.points,0);assert.ok(Math.abs(allResearch.ratio-1.092)<1e-8);assert.equal(allResearch.bonus,.08);
  pass('Árvore completa custa 39 pontos e limita bônus a +9,2% de produção e +8% em novas propostas');
  const phoneContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}),phone=await phoneContext.newPage();phone.on('pageerror',e=>errors.push(e.message));
  await phone.goto(base);await phone.waitForFunction(()=>!!window.DevJourney27);await phone.evaluate(()=>{tsHide();DevJourney27.open()});
  assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await phone.screenshot({path:path.join(root,'journey-mobile.png')});
  for(const label of ['⌘ Pesquisa','✦ Vitrine','▥ Panorama','? Guia','◈ Jornada']){await phone.getByRole('button',{name:label,exact:true}).tap();assert.equal(await phone.evaluate(()=>document.querySelector('.command-shell27').scrollWidth<=innerWidth),true)}
  await phone.getByRole('button',{name:'⌘ Pesquisa',exact:true}).tap();await phone.screenshot({path:path.join(root,'research-mobile.png')});
  await phone.getByRole('button',{name:'Voltar ao jogo',exact:true}).tap();
  assert.equal(await phone.evaluate(()=>document.querySelector('#mainc').inert),false);
  pass('Cinco abas funcionam por toque a 390px sem rolagem horizontal ou foco preso');
  // Every campaign milestone is claimable; finale is recorded after IPO.
  await page.evaluate(()=>{DevJourney27.open('journey');const p=DevJourney27.ensure().peaks;p.level=5;p.showcases=6;p.prestige=1;});assert.equal(await page.evaluate(()=>DevJourney27.claim()),true);assert.equal(await page.evaluate(()=>DevJourney27.chapterIndex()),-1);
  assert.equal(await page.evaluate(()=>DevJourney27.claim()),false);
  pass('Final da jornada conclui após legado e IPO, sem pagamento duplicado');
  await page.evaluate(()=>loadSlot(0));assert.deepEqual(await page.evaluate(()=>DevJourney27.ensure().claimed),[0]);
  pass('Trocar empresas mantém pesquisas e capítulos independentes');
  assert.deepEqual(errors,[]);pass('Nenhum erro JavaScript nos cenários novos');
  fs.writeFileSync(path.join(root,'tests/progression-results.json'),JSON.stringify({date:new Date().toISOString(),firstContract:first,passed:results},null,2));
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
