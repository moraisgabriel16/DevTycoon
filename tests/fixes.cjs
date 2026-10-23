const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),base='http://127.0.0.1:4291';
const server=spawn(process.execPath,['server.cjs'],{cwd:root,env:{...process.env,PORT:'4291'},stdio:'pipe'});
let browser;
(async()=>{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.stderr.once('data',d=>reject(new Error(String(d))))});
  try{browser=await chromium.launch({headless:true})}catch{browser=await chromium.launch({channel:'msedge',headless:true})}
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>typeof openExterior==='function'&&v23Ready&&v21Ready&&v19Ready);
  // Loading independently lets this regression suite run before HTML integration.
  if(!await page.evaluate(()=>String(accept).includes('offer.exp>0')))await page.addScriptTag({path:path.join(root,'gameplay-fixes.js')});
  await page.evaluate(()=>{tsHide();spd(0)});
  assert.deepEqual(await page.evaluate(()=>{
    const before={money:G.money,staff:G.emps.length,off:G.off.length,active:G.act.length,branches:(G.br||[]).length};
    const returned=[accept(-987),hire(-1),hire(9999),fire(-1),fire(9999),buyBr(-1),buyBr(9999),brUp(-1),brMgr(9999),claimQ(-1),ng(-5,0)];
    const after={money:G.money,staff:G.emps.length,off:G.off.length,active:G.act.length,branches:(G.br||[]).length};
    return {unchanged:JSON.stringify(before)===JSON.stringify(after),allFalse:returned.every(x=>x===false)};
  }),{unchanged:true,allFalse:true});
  console.log('✓ Índices e IDs inválidos não alteram contratos, equipe, filiais nem dinheiro');
  assert.deepEqual(await page.evaluate(()=>{
    const original=Math.random;Math.random=()=>.9;
    try{const o=G.off[0],id=o.id;const first=ng(id,1),reward=o.reward,deadline=o.dl;const second=ng(id,1);return {first,second,same:reward===o.reward&&deadline===o.dl}}finally{Math.random=original}
  }),{first:true,second:false,same:true});
  console.log('✓ Contrato só pode ser negociado uma vez');
  assert.deepEqual(await page.evaluate(()=>{
    const id=G.off[0].id,first=accept(id),second=accept(id);return {first,second,valid:G.act.every(Boolean),count:G.act.filter(c=>c.id===id).length};
  }),{first:true,second:false,valid:true,count:1});
  console.log('✓ Aceite repetido é ignorado sem inserir undefined na campanha');
  const pausedMoney=await page.evaluate(()=>{G.money-=123;ui();return G.money});
  await page.waitForTimeout(450);await page.reload();await page.waitForFunction(()=>typeof openExterior==='function');
  assert.equal(await page.evaluate(()=>G.money),pausedMoney);
  if(!await page.evaluate(()=>String(accept).includes('offer.exp>0')))await page.addScriptTag({path:path.join(root,'gameplay-fixes.js')});
  console.log('✓ Alteração feita com jogo pausado sobrevive ao recarregamento');
  assert.deepEqual(await page.evaluate(()=>{
    const valid=parseImported(JSON.stringify(G));
    const demo=seedDemo(),full=!!parseImported(JSON.stringify(demo));
    demo.business.products[0].type='impossible';
    let bad=false;try{parseImported(JSON.stringify(demo))}catch(e){bad=true}
    const badContract=cloneSave(G);badContract.off[0].tot={impossible:20};let badRole=false;try{parseImported(JSON.stringify(badContract))}catch(e){badRole=true}
    return {old:!!valid,full,bad,badRole};
  }),{old:true,full:true,bad:true,badRole:true});
  console.log('✓ Importação aceita campanhas válidas e rejeita produto/cargo desconhecido');
  await page.evaluate(()=>{const a=document.createElement('textarea');a.id='fixTyping';document.body.append(a)});
  const cash=await page.evaluate(()=>G.money);await page.locator('#fixTyping').fill('');await page.locator('#fixTyping').pressSequentially('givememoney');assert.equal(await page.evaluate(()=>G.money),cash);
  await page.locator('#fixTyping').evaluate(e=>e.remove());
  console.log('✓ Digitar texto não aciona o cheat global');
  assert.deepEqual(await page.evaluate(()=>{G.exteriors={version:1,buildings:{0:{wall:'#72959b',sign:'Minha marca'}}};const exterior=JSON.stringify(G.exteriors),prestige=G.prestige||0;ipo2('cash');return {kept:JSON.stringify(G.exteriors)===exterior,prestige:G.prestige===prestige+1}}),{kept:true,prestige:true});
  console.log('✓ Aparência externa é preservada após IPO');
  await page.evaluate(()=>end('Falência','Teste de recuperação'));
  assert.equal(await page.getByRole('button',{name:'Minhas empresas',exact:true}).isVisible(),true);
  await page.getByRole('button',{name:'Minhas empresas',exact:true}).click();
  assert.equal(await page.locator('#slotsView').isVisible(),true);
  assert.equal(await page.evaluate(()=>sp),0);
  console.log('✓ Falência permite gerenciar/exportar slots e mantém a empresa pausada');
  assert.deepEqual(errors,[]);console.log('✓ Nenhum erro JavaScript');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
