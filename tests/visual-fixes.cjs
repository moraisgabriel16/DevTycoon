const artifact=require('./artifacts.cjs');
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),base='http://127.0.0.1:4294';
const server=spawn(process.execPath,['server.cjs'],{cwd:root,env:{...process.env,PORT:'4294'},stdio:'pipe'});
let browser;const passed=[];const pass=name=>{passed.push(name);console.log('✓ '+name)};
(async()=>{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.stderr.once('data',d=>reject(new Error(String(d))))});
  try{browser=await chromium.launch({headless:true})}catch{browser=await chromium.launch({channel:'msedge',headless:true})}
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>window.Art28?.loaded&&window.DevCorpBoot?.ready&&window.Studio28);await page.evaluate(()=>{loadSlot(2);spd(0)});
  const identity=await page.evaluate(()=>{
    const issues=[];let checks=0;
    for(let look=0;look<8;look++)for(const pose of ['drink','read','work','play','sit'])for(let phase=0;phase<2;phase++){
      const e={...companyStaff()[0],look,skin:look%4,outfit:0},a=employeeAppearance(e),base=personCanvas23(a,0),im=v19Tint('act_'+genderOf(e)+'_'+pose+phase,e),offset=pose==='sit'?4:0;
      const expected=base.getContext('2d').getImageData(0,0,32,18).data,actual=im.getContext('2d').getImageData(0,offset,32,18).data;
      // Canvas premultiplies translucent edge pixels when copying a sprite.
      if(im.width!==32||im.height!==42||expected.some((v,i)=>Math.abs(v-actual[i])>2))issues.push({look,pose,phase});checks++;
    }
    return{issues,checks};
  });assert.deepEqual(identity,{issues:[],checks:80});pass('80 poses de interação preservam o rosto, cabelo, cor e escala do personagem');
  const gallery=await page.evaluate(()=>{
    const c=document.createElement('canvas');c.width=960;c.height=880;const g=c.getContext('2d');g.fillStyle='#e9e8dc';g.fillRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;
    const names=['Parado','Café','Inspecionar','Ler','Jogar','Descansar'];g.fillStyle='#334e45';g.font='16px system-ui';names.forEach((name,i)=>g.fillText(name,20+i*160,25));
    for(let look=0;look<8;look++)for(let i=0;i<6;i++){
      const e={...companyStaff()[0],look,skin:look%4,outfit:0},a=employeeAppearance(e),im=i?Art28.action(a,['','drink','work','read','play','sit'][i],1):personCanvas23(a,0);
      g.drawImage(im,25+i*160,40+look*104,64,84);
    }
    return c.toDataURL().split(',')[1];
  });fs.writeFileSync(artifact('interaction-sprites-v28-1.png'),Buffer.from(gallery,'base64'));
  const walls=await page.evaluate(()=>{
    const issues=[];
    for(let theme=0;theme<6;theme++){
      const c=document.createElement('canvas');c.width=900;c.height=600;const g=c.getContext('2d'),q=(x,y)=>[450+(x-y)*32,100+(x+y)*16];Art28.walls(g,q,12,theme);
      const pixels=g.getImageData(0,0,c.width,c.height).data;
      for(let side=0;side<2;side++)for(let step=1;step<120;step++)for(let h=2;h<39;h+=3){const u=step/10,p=side?q(u,0):q(0,u);if(pixels[(Math.round(p[1]-h)*c.width+Math.round(p[0]))*4+3]<240)issues.push({theme,side,u,h})}
      for(let index=2;index<6;index++){
        const im=V19['theme'+theme+'_'+index],ctx=im.getContext('2d'),left=index%2===1;
        // Outside the isometric face stays transparent; the wall itself is solid.
        if(ctx.getImageData(left?1:30,2,1,1).data[3]!==0||ctx.getImageData(16,24,1,1).data[3]<240)issues.push({theme,index,tile:true});
      }
    }
    return issues;
  });assert.deepEqual(walls,[]);pass('Paredes contínuas sem buracos nos seis temas; peças isométricas preservam sua silhueta');
  await page.evaluate(()=>{
    window.testEmployee=companyStaff().find(e=>e.floor===0).id;
    OPT.pauseUrgent=OPT.pauseRisk=OPT.pauseEvents=OPT.pauseProduct=OPT.characterAI=OPT.officeRoutines=0;
    // Isolate a real corridor and desk; use the original route/action engine.
    G.tiles={'2,2':'desk2','4,3':'server','6,3':'coffee','8,3':'bookshelf','4,6':'sofa','6,6':'plant','8,6':'pong'};floorState(0).tiles=G.tiles;G.down={};
    for(const e of staffOnFloor())cancelAction(e);
    const e=companyStaff().find(e=>e.id===testEmployee);e.desk='2,2';e.x=2;e.y=2;e.seated=true;G.sel=e.id;followId=null;acc=-1e6;Studio28.refresh();
  });
  await page.clock.install();await page.evaluate(()=>{last=performance.now();spd(1)});
  const trips=[];
  for(const p of ['4,3','6,3','8,3','4,6','6,6','8,6']){
    assert.equal(await page.evaluate(p=>useObject(p,testEmployee),p),true);
    let arrived=false;
    for(let i=0;i<50;i++){
      await page.clock.runFor(200);
      const state=await page.evaluate(()=>{const e=companyStaff().find(e=>e.id===testEmployee);return{arrived:!!e.brk?.arrived,brk:e.brk,position:[e.x,e.y],desk:e.desk}});
      if(state.arrived){arrived=true;trips.push({type:state.brk.type,position:state.position});break}
    }
    assert.equal(arrived,true,'Chegada ao objeto '+p);
    const anchor=await page.evaluate(()=>{const e=companyStaff().find(e=>e.id===testEmployee);return[e.x,e.y,e.brk.elapsed]});await page.clock.runFor(600);
    const still=await page.evaluate(()=>{const e=companyStaff().find(e=>e.id===testEmployee);return[e.x,e.y,e.brk.elapsed]});assert.deepEqual(still.slice(0,2),anchor.slice(0,2));assert.ok(still[2]>anchor[2]);
    if(p==='4,3'){await page.evaluate(()=>{spd(0);ZT.z=2.35;const p=P(4,3);ZT.tx=450-p[0]*ZT.z;ZT.ty=300-p[1]*ZT.z});await page.clock.runFor(100);await page.locator('#cv').screenshot({path:artifact('interaction-server-fixed.png')});await page.evaluate(()=>spd(1));}
    await page.clock.runFor(13000);
    assert.deepEqual(await page.evaluate(()=>{const e=companyStaff().find(e=>e.id===testEmployee);return{busy:!!e.brk,seated:e.seated,desk:e.desk,position:[e.x,e.y]}}),{busy:false,seated:true,desk:'2,2',position:[2,2]});
    console.log('  · Percurso e retorno: '+trips.at(-1).type);
  }
  pass('Café, servidor, leitura, sofá, planta e jogo mantêm a posição e devolvem a pessoa à mesa');
  await page.evaluate(()=>{spd(0);G.sk=0;Art28.invalidate();ZT.z=1.6;ZT.tx=-270;ZT.ty=90;draw2(performance.now())});await page.clock.runFor(100);await page.locator('#cv').screenshot({path:artifact('walls-fixed-v28-1.png')});
  await page.evaluate(()=>{openPersonalRoom();G.myRoom.wallTheme=0;Art28.invalidate()});await page.clock.runFor(100);assert.equal(await page.locator('#personalView').isVisible(),true);await page.screenshot({path:artifact('personal-walls-fixed-v28-1.png')});pass('Sala pessoal compartilha a parede contínua e as poses do avatar usam a mesma aparência');
  await page.evaluate(()=>closePersonalRoom());await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>draw2(performance.now()));
  await page.setViewportSize({width:390,height:844});await page.clock.runFor(200);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.deepEqual(errors,[]);pass('Sem erros JavaScript no desktop, celular e com movimento reduzido');
  fs.writeFileSync(artifact('visual-fixes-results.json'),JSON.stringify({date:new Date().toISOString(),passed,identityChecks:identity.checks,trips},null,2));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
