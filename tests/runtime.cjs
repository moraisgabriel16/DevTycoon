const artifact=require('./artifacts.cjs');
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),base='http://127.0.0.1:4297';
const server=spawn(process.execPath,['server.cjs'],{cwd:root,env:{...process.env,PORT:'4297'},stdio:'pipe'});
let browser;const passed=[];const pass=s=>{passed.push(s);console.log('✓ '+s)};
(async()=>{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.stderr.once('data',d=>reject(Error(String(d))))});
  browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>window.Motion31&&Art28.loaded&&window.DevCorpBoot?.ready);await page.evaluate(()=>{loadSlot(2);spd(0)});
  const movement=await page.evaluate(()=>{
    const route=()=>[[.5,0],[.5,.5],[1,.5],[1,1]],one={x:0,y:0},many={x:0,y:0},a=route(),b=route();Motion31.advance(one,a,1.75);for(let i=0;i<7;i++)Motion31.advance(many,b,.25);
    return{one:[one.x,one.y],many:[many.x,many.y],distance:Motion31.state(one).distance,remaining:a};
  });assert.deepEqual(movement,{one:[1,.75],many:[1,.75],distance:1.75,remaining:[[1,1]]});pass('Movimento consome a distância entre curvas sem depender da quantidade de quadros');
  const urgency=await page.evaluate(()=>{
    const original=eta;let calls=0;eta=function(c){calls++;return original(c)};
    try{for(const e of companyStaff()){const a=ensureBrain25(e);a.manualUntil=0;a.nextDecision=0;delete a.help;e.seated=true;e.brk=null}companyStaff().forEach(employeeUrgent25);const uncached=calls;calls=0;updateActions(.001);return{uncached,batched:calls,contracts:G.act.length}}
    finally{eta=original}
  });assert.ok(urgency.uncached>urgency.batched);assert.ok(urgency.batched<=urgency.contracts);pass('Uma atualização compartilha os cálculos de risco dos contratos entre os funcionários');
  const persistence=await page.evaluate(()=>{
    const original=Storage.prototype.setItem;let writes=0;Storage.prototype.setItem=function(k,v){if(k==='dt2slots')writes++;return original.call(this,k,v)};
    try{const before=G.day;tick();const db=JSON.parse(localStorage.getItem(SAVE_DB_KEY)),saved=db.slots[db.active].data;return{writes,day: G.day-before,same:saved.day===G.day&&saved.money===G.money&&saved.emps.length===G.emps.length}}
    finally{Storage.prototype.setItem=original}
  });assert.deepEqual(persistence,{writes:1,day:1,same:true});pass('Avançar um dia grava uma vez o estado final, preservando dinheiro, equipe e calendário');
  const cache=await page.evaluate(()=>{
    const c=document.createElement('canvas');c.width=960;c.height=720;const options={zoom:1.037,night:false},start=ExteriorScene28.stats;
    ExteriorScene28.render(c,0,options);const first=c.toDataURL();ExteriorScene28.render(c,10000,options);const reuse=ExteriorScene28.stats;
    const name=G.name;G.name='Outra fachada';ExteriorScene28.render(c,10000,options);const changed=c.toDataURL();G.name=name;
    return{builds:reuse.builds-start.builds,hits:reuse.hits-start.hits,invalidated:changed!==first};
  });assert.deepEqual(cache,{builds:1,hits:1,invalidated:true});pass('O cenário estático é reutilizado e se atualiza quando a fachada muda');
  const routes=await page.evaluate(()=>{
    const old=G.lvl,issues=[];let samples=0;
    try{for(let level=0;level<6;level++){G.lvl=level;const route=NPCLife28.outdoorRoute([2,11]);if(!route){issues.push({level,missing:true});continue}for(let i=1;i<route.length;i++)for(let u=0;u<=10;u++){const t=u/10,x=route[i-1][0]*(1-t)+route[i][0]*t,y=route[i-1][1]*(1-t)+route[i][1]*t;if(!NPCLife28.walkable(x,y))issues.push({level,x,y});samples++}}
      G.lvl=old;return{issues,samples,benchBlocked:!NPCLife28.walkable(4,10),lampBlocked:!NPCLife28.walkable(10,9)};
    }finally{G.lvl=old}
  });assert.deepEqual(routes.issues,[]);assert.ok(routes.samples>200);assert.equal(routes.benchBlocked,true);assert.equal(routes.lampBlocked,true);pass('Rotas dos seis prédios não atravessam a sede, os bancos ou os postes');
  const overlap=await page.evaluate(()=>{
    G.lvl=4;const n=ExteriorScene28.navigation(),p=ExteriorScene28.project(4,10,1),c=document.createElement('canvas');c.width=960;c.height=720;const g=c.getContext('2d');
    const actor={x:4,y:9.5,draw:g=>{g.fillStyle='#ff00ff';g.fillRect(p[0]-20,p[1]-32,40,36)}};
    ExteriorScene28.renderActors(c,0,{zoom:1},[actor]);const behind=[...g.getImageData(p[0],p[1]-12,1,1).data];g.clearRect(0,0,960,720);actor.y=10.5;ExteriorScene28.renderActors(c,0,{zoom:1},[actor]);const front=[...g.getImageData(p[0],p[1]-12,1,1).data];g.clearRect(0,0,960,720);ExteriorScene28.renderActors(c,0,{zoom:1},[]);const rear=ExteriorScene28.project(1,2,1),rearAlpha=g.getImageData(rear[0],rear[1]-40,1,1).data[3];return{behind,front,rearAlpha};
  });assert.notDeepEqual(overlap.behind,[255,0,255,255]);assert.deepEqual(overlap.front,[255,0,255,255]);assert.equal(overlap.rearAlpha,0);pass('Prédio, árvores, bancos e personagens respeitam as camadas do cenário');
  await page.clock.install();await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));await page.evaluate(()=>{
    last=performance.now();acc=-1e6;OPT.pauseUrgent=OPT.pauseRisk=OPT.pauseEvents=OPT.pauseProduct=OPT.characterAI=OPT.officeRoutines=0;
    const e=companyStaff().find(e=>e.floor===0);cancelAction(e);e.x=e.y=0;e.seated=false;window.outdoorTest=e.id;G.sel=e.id;NPCLife28.startOutdoor(e.id,true);Studio28.setView('outside',false);spd(1);
  });await page.clock.runFor(500);assert.equal(await page.evaluate(()=>NPCLife28.active(companyStaff().find(e=>e.id===outdoorTest))),true);
  const walkTime=await page.evaluate(()=>companyStaff().find(e=>e.id===outdoorTest).life28.routeLength/1.55);await page.clock.runFor((walkTime+1)*1000);
  const resting=await page.evaluate(()=>{const e=companyStaff().find(e=>e.id===outdoorTest),p=NPCLife28.worldPosition(e);return{p,clear:NPCLife28.walkable(p.x,p.y)}});assert.equal(resting.p.moving,false);assert.equal(resting.clear,true);
  await page.locator('.npc-focus-actions28 button').filter({hasText:'Café'}).click();
  const ordered=await page.evaluate(()=>{const e=companyStaff().find(e=>e.id===outdoorTest);return{p:NPCLife28.worldPosition(e),active:NPCLife28.active(e)}});assert.equal(ordered.active,true);assert.equal(ordered.p.x,resting.p.x);assert.equal(ordered.p.y,resting.p.y);
  await page.clock.runFor(600);const returning=await page.evaluate(()=>NPCLife28.worldPosition(companyStaff().find(e=>e.id===outdoorTest)));assert.ok(Math.hypot(returning.x-resting.p.x,returning.y-resting.p.y)>0);assert.ok(Math.hypot(returning.x-resting.p.x,returning.y-resting.p.y)<=1.1);
  await page.screenshot({path:artifact('neighborhood-v31-return.png')});await page.clock.runFor((walkTime+.5)*1000);
  const inside=await page.evaluate(()=>{const e=companyStaff().find(e=>e.id===outdoorTest);return{active:NPCLife28.active(e),order:e.brk?.type,desk:!!e.desk}});assert.deepEqual(inside,{active:false,order:'coffee',desk:true});pass('Pedir café na praça faz o funcionário caminhar de volta antes de iniciar a interação interna');
  await page.evaluate(()=>{spd(0);Studio28.setView('outside',false);DevJourney27.open()});const covered=await page.evaluate(()=>ExteriorScene28.stats);await page.clock.runFor(600);assert.deepEqual(await page.evaluate(()=>ExteriorScene28.stats),covered);
  await page.getByRole('button',{name:'Voltar ao jogo',exact:true}).click();await page.clock.runFor(100);assert.ok((await page.evaluate(()=>ExteriorScene28.stats.hits))>covered.hits);pass('O bairro não é redesenhado atrás dos painéis e volta a renderizar ao fechar a central');
  assert.deepEqual(errors,[]);fs.writeFileSync(artifact('runtime-results.json'),JSON.stringify({date:new Date().toISOString(),passed,movement,urgency,persistence,routes},null,2));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
