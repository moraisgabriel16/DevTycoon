const artifact=require('./artifacts.cjs');
/* Headless campaign QA: actual frame/actor movement and production, seeded randomness. */
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const server=spawn(process.execPath,['server.cjs'],{cwd:root,env:{...process.env,PORT:'4292'},stdio:'pipe'});
let browser;
(async()=>{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject)});
  browser=await chromium.launch({channel:'msedge',headless:true});
  const context=await browser.newContext({viewport:{width:1280,height:900}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await context.addInitScript(()=>{let state=20027;Math.random=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296}});
  await page.goto('http://127.0.0.1:4292');
  await page.waitForFunction(()=>window.DevJourney27&&window.Research27&&v23Ready&&v19Ready&&v21Ready);
  await page.clock.install();
  await page.evaluate(()=>{
    G=fresh();G.tut=1;G.dif=1;G.name='QA prudente';activateCampaign();tsHide();wl.style.display='none';
    OPT.snd=0;OPT.pauseUrgent=0;OPT.pauseRisk=0;OPT.pauseEvents=0;OPT.pauseProduct=0;
    accept(G.off.find(o=>o.easy).id);spd(3);
  });
  for(let i=0;i<25&&!(await page.evaluate(()=>G.done>0));i++)await page.clock.runFor(1675);
  const first=await page.evaluate(()=>({day:G.day,done:G.done,money:G.money,anaSeated:G.emps[0]?.seated,knowledge:Research27.points(),log:G.log}));
  console.log('FIRST',JSON.stringify(first));
  if(!first.done)throw Error('Primeiro contrato não foi concluído');
  await page.evaluate(()=>{openExterior()});await page.locator('#extSave').click();await page.locator('#extClose').click();
  const rows=[];
  for(let turn=0;turn<80;turn++){
    const row=await page.evaluate(()=>{
      // Equivalent to placement: pay the catalog cost and preserve path validation.
      function place(type){
        if(G.money<TL[type].c)return false;
        for(let y=1;y<nU()-1;y++)for(let x=1;x<nU()-1;x++){
          const p=k(x,y);if(G.tiles[p]||!canPlace(p,type))continue;
          G.money-=TL[type].c;G.tiles[p]=type;G.bn=(G.bn||0)+1;G.emps.forEach(e=>{e.path=null;assign(e)});flushFloor();return true;
        }return false;
      }
      if(G.eventSystem?.pending){const e=G.eventSystem.pending;const index=e.choices.findIndex(c=>(c.cost||0)===0);resolveEvent(index>=0?index:e.fallback)}
      if(ov.style.display==='flex')return {stopped:true,title:ovT.textContent,day:G.day,money:G.money};
      let reserve=Math.max(1500,G.emps.reduce((s,e)=>s+e.sal,0)*10);
      for(const e of G.emps){
        const market=(18+e.sk*5)*(1+G.day/500)*.85;
        if(e.sal<market&&G.money>reserve+100){G.sel=e.id;empAct('raise')}
        if(e.mood<48&&G.money>reserve+200){G.sel=e.id;empAct('bonus')}
      }
      if(G.emps.length<4&&G.money>reserve+1000){
        const roles=new Set(G.emps.map(e=>e.role)),wanted=['front','back','ux','infra'].find(r=>!roles.has(r));
        const index=G.cands.findIndex(c=>c.role===wanted&&G.money-c.cost>reserve);
        if(index>=0){if(Object.values(G.tiles).filter(ISD).length<=G.emps.length)place('desk');if(load()<1)place('server');hire(index)}
      }
      if(G.emps.length>3&&load()<1&&G.money>reserve+600)place('server');
      if(!Object.values(G.tiles).includes('plant')&&G.money>reserve+60)place('plant');
      if(!Object.values(G.tiles).includes('sofa')&&G.money>reserve+300)place('sofa');
      for(let j=0;j<9;j++){const panel=Research27.renderPanel(),button=[...panel.querySelectorAll('button')].find(b=>!b.disabled);if(!button)break;button.click()}
      DevJourney27.scan();DevJourney27.claim();
      if((G.done||0)>=2&&!G.act.some(c=>c.showcase27))DevJourney27.startShowcase('bairro');
      if(G.lvl===0&&G.money>4000+reserve&&G.done>=5)expand();
      for(const key of ['chair','monitor','fiber','tests'])if(!G.up[key]&&G.money>UP[key].c+reserve+2000)buy(key);
      if(G.q)for(let i=0;i<G.q.l.length;i++)claimQ(i);
      // One ordinary project at a time, with the existing estimate and margin.
      if(G.act.filter(c=>!c.showcase27).length<1){
        const offer=G.off.filter(o=>Object.keys(o.need).every(r=>G.emps.some(e=>e.role===r))&&etaNew(o)*1.5<=o.dl).sort((a,b)=>b.reward/Math.max(1,etaNew(b))-a.reward/Math.max(1,etaNew(a)))[0];
        if(offer)accept(offer.id);
      }
      spd(3);save();ui();
      return {day:G.day,money:Math.round(G.money),done:G.done||0,staff:G.emps.length,level:G.lvl,rep:+G.rep.toFixed(2),mood:Math.round(G.emps.reduce((s,e)=>s+e.mood,0)/G.emps.length),research:Research27.unlockedCount(),chapter:DevJourney27.chapterIndex(),showcase:G.journey27.showcases,active:G.act.map(c=>({name:c.name,dl:c.dl,eta:eta(c)[0],remaining:c.need})),recent:G.log};
    });
    rows.push(row);if(row.stopped||row.day>=80)break;
    if(turn%10===0)console.log('DAY',JSON.stringify(row));
    await page.clock.runFor(1675);
  }
  const report={seed:20027,first,final:rows.at(-1),errors,rows};
  fs.writeFileSync(artifact('balance-results.json'),JSON.stringify(report,null,2));
  console.log('FINAL',JSON.stringify(report.final));console.log('ERRORS',JSON.stringify(errors));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
