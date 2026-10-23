const artifact=require('./artifacts.cjs');
/* Diagnostic benchmark, not a timing assertion. Run before/after on the same host. */
const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),tag=process.argv[2]||'current';
const server=spawn(process.execPath,['server.cjs'],{cwd:root,env:{...process.env,PORT:'4296'},stdio:'pipe'});
let browser;
(async()=>{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.stderr.once('data',d=>reject(Error(String(d))))});
  browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4296');await page.waitForFunction(()=>window.Studio28&&Art28.loaded&&window.DevCorpBoot?.ready);
  await page.evaluate(()=>{loadSlot(2);tsHide();wl.style.display='none';OPT.pauseUrgent=OPT.pauseRisk=OPT.pauseEvents=OPT.pauseProduct=0;G.eventSystem.nextDay=1e8;for(const c of G.act)c.dl=1e5;for(const o of G.off)o.exp=1e5;spd(1)});
  const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await page.evaluate(()=>{
    window.bench31={stats:{},frames:[],long:[],active:false,raf:0};const b=bench31;
    const wrap=(name,fn)=>function(...args){const t=performance.now();try{return fn.apply(this,args)}finally{if(b.active){const row=b.stats[name]||(b.stats[name]={calls:0,ms:0,max:0});const cost=performance.now()-t;row.calls++;row.ms+=cost;row.max=Math.max(row.max,cost)}}};
    draw2=wrap('officeDraw',draw2);ui=wrap('fullUI',ui);save=wrap('save',save);tick=wrap('dayTick',tick);updateActions=wrap('actions',updateActions);bfs=wrap('pathfind',bfs);v19Tint=wrap('sprite',v19Tint);v19Seated=wrap('seated',v19Seated);ExteriorScene28.render=wrap('exteriorRender',ExteriorScene28.render);
    new PerformanceObserver(list=>{if(b.active)for(const entry of list.getEntries())b.long.push(entry.duration)}).observe({type:'longtask',buffered:false});
    let last=0;function frame(t){if(b.active&&last)b.frames.push(t-last);last=t;b.raf=requestAnimationFrame(frame)}b.raf=requestAnimationFrame(frame);
  });
  const rows=[];
  for(const[view,panel]of [['inside','ct'],['inside','tm'],['outside','tm']]){
    await page.evaluate(({view,panel})=>{bench31.active=false;tabOpen(panel);Studio28.setView(view,false)}, {view,panel});await page.waitForTimeout(500);
    await page.evaluate(()=>{const b=bench31;b.stats={};b.frames=[];b.long=[];b.started=performance.now();b.active=true});await page.waitForTimeout(6500);
    const row=await page.evaluate(()=>{const b=bench31;b.active=false;const percentile=(a,q)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor((s.length-1)*q)]||0};return{duration:performance.now()-b.started,frames:b.frames.length,frameMedian:percentile(b.frames,.5),frameP95:percentile(b.frames,.95),frameP99:percentile(b.frames,.99),over50:b.frames.filter(x=>x>50).length,longTasks:b.long.length,maxTask:Math.max(0,...b.long),functions:b.stats,paused:paused(),staff:companyStaff().length}});
    rows.push({view,panel,...row});console.log(view,panel,JSON.stringify({frames:row.frames,p95:row.frameP95,long:row.longTasks,hot:Object.entries(row.functions).sort((a,b)=>b[1].ms-a[1].ms).slice(0,4)}));
  }
  fs.writeFileSync(artifact('profile-'+tag+'.json'),JSON.stringify({date:new Date().toISOString(),cpuThrottle:4,rows,errors},null,2));if(errors.length)throw Error(errors.join('\n'));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
