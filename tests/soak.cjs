const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process'),artifact=require('./artifacts.cjs');
const server=spawn(process.execPath,['server.cjs'],{cwd:path.resolve(__dirname,'..'),env:{...process.env,PORT:'4314'},stdio:'pipe'});let browser;const results=[],errors=[];
(async()=>{await new Promise((r,j)=>{server.stdout.once('data',r);server.once('error',j)});browser=await chromium.launch({channel:'msedge',headless:true});
 for(const slot of [0,2]){const p=await browser.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4314');await p.waitForFunction(()=>DevCorpBoot.ready);const result=await p.evaluate(slot=>{
   loadSlot(slot);tsHide();wl.style.display='none';G.tut=1;spd(0);OPT.pauseEvents=OPT.pauseUrgent=OPT.pauseRisk=0;
   const start=G.day,seen=[],fail=message=>{throw Error(message+' no dia '+G.day)};
   for(let day=0;day<90;day++){
     for(const c of [...G.off]){if(G.act.length>=3)break;if(Object.keys(c.need).every(role=>companyStaff().some(e=>e.role===role)))accept(c.id)}
     for(let step=0;step<20;step++){Motion31.update(.25);updateActions(.25)}
     tick();
     if(!Number.isFinite(G.money)||!Number.isFinite(G.rep)||!Number.isFinite(G.day))fail('Finanças inválidas');
     const staff=companyStaff();if(new Set(staff.map(e=>e.id)).size!==staff.length)fail('Pessoa duplicada');
     for(const e of staff){if(!Number.isFinite(e.x)||!Number.isFinite(e.y)||!Number.isFinite(e.mood))fail('Estado inválido de NPC');if(e.floor<0||e.floor>=FLOOR_COUNTS[G.lvl])fail('Andar inválido');}
     if(new Set(G.act.map(c=>c.id)).size!==G.act.length)fail('Contrato ativo duplicado');
     for(const c of G.act)for(const v of Object.values(c.need))if(!Number.isFinite(v))fail('Progresso inválido');
     seen.push({day:G.day,money:Math.round(G.money),done:G.done||0,active:G.act.length});
     if(G.money<0&&ov.style.display==='flex'&&/falência/i.test(ov.textContent))break;
     // Dismiss only non-bankruptcy informational overlays in this isolated simulation.
     if(ov.style.display==='flex')ov.style.display='none';
   }
   spd(0);save();return{slot,start,end:G.day,days:seen.length,money:G.money,done:G.done||0,staff:companyStaff().length,seen};
 },slot);assert.ok(result.days>0);const before=await p.evaluate(()=>({money:G.money,day:G.day,staff:companyStaff().map(e=>e.id),active:G.act.map(c=>c.id),done:G.done||0}));await p.reload();await p.waitForFunction(()=>DevCorpBoot.ready);assert.deepEqual(await p.evaluate(()=>({money:G.money,day:G.day,staff:companyStaff().map(e=>e.id),active:G.act.map(c=>c.id),done:G.done||0})),before);results.push(result);console.log('✓ Simulação slot '+slot+': '+result.days+' dias, '+result.staff+' pessoas, '+result.done+' entregas; dados íntegros após recarregar');await p.close();}
 assert.deepEqual(errors,[]);fs.writeFileSync(artifact('regression/soak-results.json'),JSON.stringify({results,errors,method:'Ticks e ações simulados; não é medição de FPS ou taxa de retenção.'},null,2));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
