/* A neighborhood improves through real, finite client contracts. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const SITES=[
    {id:'bakery',client:'bakery',name:'Padaria do Bairro',short:'Padaria',person:'Dona Lúcia',color:'#bb8862',position:[-6.4,4],unlock:0,rep:0,stages:[
      {title:'Um cardápio que chega a todos',problem:'O cardápio só existe no balcão. Dona Lúcia quer mostrar os produtos e horários pela internet.',need:{back:24},reward:650,days:18,result:'Cardápio online no ar. Uma nova marquise anuncia a padaria.'},
      {title:'Pedidos sem fila',problem:'Com novos clientes chegando, os pedidos se misturam no balcão. É hora de organizar a fila.',need:{back:55,front:35},reward:1800,days:24,result:'Pedidos organizados. A padaria ganhou mesas e um balcão renovado.'},
      {title:'O pão chega até você',problem:'A vizinhança pede entregas. Um aplicativo precisa ligar pedidos, cozinha e entregadores.',need:{back:110,mobile:80,qa:40},reward:6200,days:32,result:'Entregas funcionando. Bicicletas e energia solar completam a nova padaria.'}]},
    {id:'shop',client:'shop',name:'Vitrine Digital',short:'Loja',person:'Marina',color:'#71948d',position:[5.5,-6.3],unlock:2,rep:1.5,stages:[
      {title:'A primeira vitrine online',problem:'Marina tem ótimos produtos, mas só vende para quem passa na rua. Falta uma vitrine digital.',need:{front:28,back:16},reward:1100,days:20,result:'A vitrine online trouxe uma fachada nova e mais visibilidade.'},
      {title:'Estoque sem surpresas',problem:'As vendas cresceram e a planilha já não acompanha o estoque. Marina precisa de dados confiáveis.',need:{back:70,data:40},reward:3200,days:26,result:'Estoque integrado. A loja ganhou novos expositores e um jardim na entrada.'},
      {title:'Uma loja conectada',problem:'Agora é preciso integrar pagamento, estoque e atendimento com segurança.',need:{back:150,front:100,sec:60},reward:11000,days:32,result:'Operação integrada e segura. A loja se tornou uma referência no bairro.'}]},
    {id:'school',client:'horizon',name:'Horizonte Educação',short:'Escola',person:'André',color:'#8098aa',position:[19,6],unlock:4,rep:2,stages:[
      {title:'Matrículas sem papel',problem:'André passa dias organizando fichas. Um sistema simples pode devolver esse tempo à escola.',need:{back:35,front:28},reward:1600,days:22,result:'Matrículas digitais. A escola ganhou uma entrada mais acolhedora.'},
      {title:'A turma sempre por perto',problem:'Famílias e professores precisam de um lugar claro para avisos, atividades e acompanhamento.',need:{back:90,front:55,ux:35},reward:4800,days:28,result:'Portal da turma publicado. A escola abriu um novo espaço de convivência.'},
      {title:'Uma biblioteca para todos',problem:'Livros e materiais precisam chegar a mais pessoas, com busca, acesso e dados protegidos.',need:{data:160,back:140,sec:80},reward:15000,days:36,result:'Biblioteca digital aberta. A escola agora conecta toda a comunidade.'}]}
  ];
  let cachedG,cachedState,active=false,selected='bakery',mapZoom=.65,night=false,previousFocus,inert=[],signature='',lastWorldKey='';
  function ensure(){
    if(cachedG===G&&cachedState===G.district34)return cachedState;
    const old=G.district34&&typeof G.district34==='object'?G.district34:{};
    const sites={};for(const site of SITES){const value=old.sites?.[site.id]||{};sites[site.id]={stage:Math.max(0,Math.min(3,Math.floor(Number(value.stage)||0))),retryDay:Math.max(0,Number(value.retryDay)||0)}}
    G.district34={version:1,sites};cachedG=G;cachedState=G.district34;return cachedState;
  }
  function meta(c){const d=c?.district34,site=SITES.find(s=>s.id===d?.site);return site&&Number.isInteger(d.stage)&&d.stage>=0&&d.stage<3?{site,index:d.stage}:null}
  function state(site){return ensure().sites[site.id]}
  function find(site,list){return list.find(c=>c.district34?.site===site.id&&c.district34.stage===state(site).stage)}
  function locked(site){return(G.done||0)<site.unlock?'Entregue '+site.unlock+' contratos para conhecer '+site.person+'.':G.rep<site.rep?'Alcance reputação '+site.rep+' para conhecer este cliente.':null}
  function missing(offer){return Object.keys(offer.need).filter(role=>!companyStaff().some(e=>e.role===role&&e.desk))}
  function total(){return SITES.reduce((n,site)=>n+state(site).stage,0)}
  function status(site){const s=state(site),act=find(site,G.act),offer=find(site,G.off);return act?'Em produção':s.stage===3?'Parceria completa':locked(site)?'Novo contato':s.retryDay>G.day?'Volta em '+Math.ceil(s.retryDay-G.day)+'d':offer?'Proposta pronta':'Vamos conversar'}
  function request(id){
    const site=SITES.find(s=>s.id===id);if(!site||locked(site))return false;const s=state(site);
    if(s.stage>=3||s.retryDay>G.day||find(site,G.off)||find(site,G.act)||G.off.length>=8)return false;
    const spec=site.stages[s.stage],research=Research27.ensure().learned,bonus=(research.includes('discovery')?.04:0)+(research.includes('negotiation')?.04:0),client=ensureClient25(site.client);
    G.off.push({id:++G.id,name:site.short+' · '+spec.title,need:{...spec.need},tot:{...spec.need},reward:Math.round(spec.reward*(1+bonus)*(client.trust>=60?1.05:1)),dl:spec.days,exp:14,client25:site.client,researchApplied27:bonus,district34:{site:id,stage:s.stage},...(id==='bakery'&&s.stage===0&&!G.done?{easy:1}:{})});
    save();ui();refresh(true);return true;
  }
  function acceptProject(id){
    const site=SITES.find(s=>s.id===id);if(!site)return false;const offer=find(site,G.off);if(!offer||missing(offer).length||G.act.some(c=>meta(c)))return false;
    const ok=accept(offer.id);if(ok){save();refresh(true)}return ok;
  }
  const beforeAccept=accept;accept=function(id){const offer=G.off.find(o=>o.id===id);if(meta(offer)&&G.act.some(c=>meta(c)))return false;return beforeAccept(id)};
  const beforeDelivery=recordDelivery25;recordDelivery25=function(c){
    const d=meta(c);if(d&&state(d.site).stage>d.index)return false;
    beforeDelivery(c);if(!d||state(d.site).stage!==d.index)return;
    state(d.site).stage++;state(d.site).retryDay=0;
    addAlbum25('district34:'+d.site.id+':'+d.index,'clients',d.site.name+' se transformou',d.site.stages[d.index].result);
    DevJourney27.notify(d.site.short+' evoluiu! Volte ao bairro para ver a entrega.');
    if(total()===9)addAlbum25('district34:complete','award','Um bairro conectado','Padaria, loja e escola concluíram suas três etapas com a sua empresa.');
    signature='';lastWorldKey='';refresh(true);
  };
  const beforeFailure=recordClientFailure25;recordClientFailure25=function(c){beforeFailure(c);const d=meta(c);if(d&&state(d.site).stage===d.index)state(d.site).retryDay=G.day+3};
  const beforeDrop=dropC;dropC=function(i){const c=G.act[i],d=meta(c),result=beforeDrop(i);if(d&&!G.act.includes(c)){state(d.site).retryDay=G.day+3;save();refresh(true)}return result};
  const view=document.createElement('section');view.id='districtView34';view.hidden=true;view.setAttribute('role','dialog');view.setAttribute('aria-modal','true');view.setAttribute('aria-labelledby','districtTitle34');document.body.append(view);
  function button(label,action,cls){const b=document.createElement('button');b.type='button';b.textContent=label;if(cls)b.className=cls;b.onclick=action;return b}
  function close(){if(!active)return;active=false;view.hidden=true;for(const[e,was]of inert)e.inert=was;inert=[];previousFocus?.focus();last=performance.now()}
  function open(id='bakery'){
    if(liftBusy)return false;if(!SITES.some(s=>s.id===id))id='bakery';selected=id;
    if(active){refresh(true);return true}tsHide();Neighborhood33.close();DevJourney27.close();ExteriorScene28.close();if(!personalView.hidden)closePersonalRoom();for(const m of [businessView,lifeView25,officeView])m.hidden=true;if(shOpen)shClose();
    previousFocus=document.activeElement;active=true;view.hidden=false;inert=[...document.body.children].filter(e=>e!==view&&!['SCRIPT','STYLE'].includes(e.tagName)).map(e=>[e,e.inert]);for(const[e]of inert)e.inert=true;
    view.innerHTML='<div class="visit-shell33 district-shell34"><header class="visit-header33"><div><small>DEVCORP / COMUNIDADE</small><h2 id="districtTitle34">O bairro cresce com as suas entregas.</h2><p>Conheça pessoas, resolva problemas e veja o resultado na rua.</p></div><button id="districtClose34" aria-label="Voltar ao jogo">✕</button></header><div class="district-layout34"><main><div class="district-map34"><canvas id="districtCanvas34" width="960" height="720" aria-label="Mapa do bairro com sua sede, padaria, loja e escola"></canvas><div class="district-pins34" id="districtPins34"></div><div class="district-camera34" id="districtCamera34"></div><div class="district-progress34" id="districtProgress34"></div></div><nav id="districtSites34" aria-label="Comércios e serviços do bairro"></nav><div class="district-foot34" id="districtFoot34"></div></main><aside id="districtPanel34"></aside></div></div>';
    $('districtClose34').onclick=close;for(const site of SITES)$('districtSites34').append(button(site.short,()=>{selected=site.id;refresh(true)}));
    $('districtCamera34').append(button('−',()=>{mapZoom=Math.max(.5,mapZoom-.05);drawMap()}),button('+',()=>{mapZoom=Math.min(.85,mapZoom+.05);drawMap()}),button('Dia / noite',()=>{night=!night;drawMap()}));
    $('districtFoot34').append(button('Entrar na minha sede',()=>{close();Studio28.enterFloor(0)}),button('Visitar Helena →',()=>{close();Neighborhood33.open();Neighborhood33.visit()}));
    $('districtCanvas34').addEventListener('pointerup',e=>{const c=e.currentTarget,r=c.getBoundingClientRect(),p={x:(e.clientX-r.left)*960/r.width,y:(e.clientY-r.top)*720/r.height},hit=siteAt(p,mapZoom);if(hit){selected=hit.id;refresh(true)}});
    refresh(true);$('districtClose34').focus();return true;
  }
  function node(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e}
  function renderPanel(){
    const site=SITES.find(s=>s.id===selected),s=state(site),panel=$('districtPanel34'),act=find(site,G.act),offer=find(site,G.off),spec=site.stages[s.stage],client=ensureClient25(site.client),reason=locked(site);panel.replaceChildren();
    panel.append(node('small','CLIENTE DO BAIRRO','eyebrow33'),node('h3',site.name),node('p',site.person+' · '+client.trust+'% de confiança','district-contact34'));
    const track=node('div',undefined,'district-track34');site.stages.forEach((d,i)=>{const item=node('div',undefined,i<s.stage?'done':i===s.stage?'current':'');item.append(node('span',i<s.stage?'✓':String(i+1)),node('span',d.title));track.append(item)});panel.append(track);
    if(s.stage){panel.append(node('div',site.stages[s.stage-1].result,'district-result34'))}
    if(s.stage===3){panel.append(node('h4','Uma parceria para continuar'),node('p','As três melhorias deste local estão prontas. Continue atendendo este cliente pelo relacionamento que vocês já construíram.'));
      const wait=Math.max(0,7-(G.day-client.lastRequest)),b=button(wait?'Nova proposta em '+wait+'d':'Pedir novo contrato',()=>{if(requestClient25(site.client))refresh(true)},'primary34');b.disabled=client.completed<2||wait>0||G.off.length>=8;panel.append(b);return;
    }
    panel.append(node('h4',act?'Sua equipe está trabalhando':spec.title),node('p',spec.problem));
    if(reason){panel.append(node('div',reason,'district-lock34'),button('Voltar aos contratos',()=>{close();tabOpen('ct')}));return}
    if(s.retryDay>G.day){panel.append(node('div','O projeto anterior foi encerrado. '+site.person+' pode negociar novamente em '+Math.ceil(s.retryDay-G.day)+' dias.','district-lock34'));return}
    const contract=act||offer||spec,roles=node('div',undefined,'district-roles34');Object.entries(contract.tot||contract.need).forEach(([r,v])=>roles.append(node('span',RO[r].n+' · '+Math.ceil(v),missing(contract).includes(r)?'missing':'')));panel.append(roles);
    const facts=node('div',undefined,'district-facts34');facts.append(node('b',n$(contract.reward)),node('span',(act?Math.ceil(act.dl):contract.dl||spec.days)+' dias úteis'+(act?' restantes':'')));panel.append(facts);
    if(act){const remaining=Object.values(act.need).reduce((n,v)=>n+v,0),all=Object.values(act.tot).reduce((n,v)=>n+v,0),progress=Math.max(0,Math.min(100,Math.round((1-remaining/all)*100))),bar=document.createElement('progress');bar.max=100;bar.value=progress;bar.setAttribute('aria-label','Progresso do projeto');panel.append(node('p',progress+'% concluído. Os cargos necessários trabalham neste projeto junto com os outros contratos.'),bar,node('small','Feche o mapa para o tempo e a produção avançarem.'),button('Acompanhar na empresa →',()=>{close();tabOpen('ct')},'primary34'));return}
    if(!offer){const b=button('Conversar e receber proposta',()=>request(site.id),'primary34');b.disabled=G.off.length>=8;panel.append(b,node('small',G.off.length>=8?'Sua lista de propostas está cheia.':'Conversar prepara uma proposta; o prazo de entrega começa quando você aceitar.'));return}
    const absent=missing(offer),busy=G.act.some(c=>meta(c)),full=G.act.length>=(G.up.pmo?5:3),estimate=etaNew(offer);panel.append(node('p',Number.isFinite(estimate)?'Estimativa nominal: '+estimate+' dias úteis. Pausas e outros contratos podem mudar esse tempo.':'Prepare as especialidades e a infraestrutura para entregar este projeto.',Number.isFinite(estimate)&&estimate>offer.dl?'district-warning34':''));
    if(absent.length)panel.append(node('div','Prepare pessoas com mesa nestes cargos: '+absent.map(r=>RO[r].n).join(', ')+'.','district-lock34'),button('Preparar equipe',()=>{close();tabOpen('hr')}));
    const acceptButton=button(busy?'Outro projeto do bairro em andamento':full?'Libere uma vaga de contrato':'Aceitar projeto →',()=>acceptProject(site.id),'primary34');acceptButton.disabled=absent.length>0||busy||full;panel.append(acceptButton,node('small','Um projeto do bairro por vez. Valem os salários, prazos, qualidade e multas normais da empresa.'));
  }
  function refresh(force=false){
    if(!active)return;const key=JSON.stringify([G.day,G.done,G.rep,G.money,selected,ensure(),G.off.map(c=>[c.id,c.exp]),G.act.map(c=>[c.id,c.dl,c.need]),companyStaff().map(e=>[e.id,e.role,e.desk])]);if(!force&&key===signature)return;signature=key;
    renderPanel();$('districtProgress34').textContent=total()+' / 9 melhorias entregues';[...$('districtSites34').children].forEach((b,i)=>{b.classList.toggle('active',selected===SITES[i].id);b.textContent=SITES[i].short+' · '+state(SITES[i]).stage+'/3'});drawMap();
  }
  function drawMap(){if(!active)return;const c=$('districtCanvas34');ExteriorScene28.render(c,0,{zoom:mapZoom,night});ExteriorScene28.renderActors(c,0,{zoom:mapZoom,night},[]);placePins($('districtPins34'),mapZoom,c,true)}
  function project(x,y,zoom){const p=ExteriorScene28.project(x,y,0);return[(p[0]-480)*zoom+480,(p[1]-360)*zoom+360]}
  function siteAt(p,zoom){return SITES.find(site=>{const a=project(...site.position,zoom);return Math.abs(p.x-a[0])<80*zoom&&p.y<a[1]+12*zoom&&p.y>a[1]-145*zoom})}
  function placePins(parent,zoom,canvas,map=false){
    if(!parent)return;parent.replaceChildren();const r=canvas.getBoundingClientRect(),outer=parent.getBoundingClientRect();if(!r.width||!outer.width)return;
    for(const site of SITES){const p=project(site.position[0],site.position[1],zoom),b=button('',()=>{if(map){selected=site.id;refresh(true)}else open(site.id)},'district-pin34');b.setAttribute('aria-label',site.name+' · '+status(site));b.append(node('b',site.short),node('small',status(site)));b.style.left=Math.max(56,Math.min(outer.width-56,r.left-outer.left+p[0]*r.width/960))+'px';b.style.top=Math.max(map?85:130,Math.min(outer.height-72,r.top-outer.top+(p[1]-145*zoom)*r.height/720))+'px';b.classList.toggle('complete',state(site).stage===3);parent.append(b)}
  }
  // Small, deliberately drawn storefronts share the game's native pixel scale.
  function drawSites(g,Q,subject,isNight){
    if(subject!==G)return false;
    const poly=(points,color)=>{g.beginPath();points.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();g.fillStyle=color;g.fill()};
    for(const site of SITES){const stage=Math.max(0,Math.min(3,G.district34?.sites?.[site.id]?.stage||0)),p=Q(...site.position,0);g.save();g.translate(Math.round(p[0]),Math.round(p[1]));g.globalAlpha=isNight?.76:1;
      poly([[-76,-30],[0,8],[78,-30],[0,-69]],'#596b4940');poly([[-60,-30],[0,0],[0,-65],[-60,-95]],stage?site.color:({bakery:'#ac987e',shop:'#88a092',school:'#99a9ae'}[site.id]));poly([[0,0],[60,-30],[60,-95],[0,-65]],stage?'#627c76':({bakery:'#8a826e',shop:'#68847b',school:'#748d98'}[site.id]));poly([[-64,-96],[0,-128],[64,-96],[0,-64]],stage?'#d6c69e':'#a1a38e');poly([[-54,-97],[0,-123],[54,-97],[0,-70]],site.id==='school'?'#788f9b':site.id==='bakery'?'#a28b71':'#6b8a7e');
      for(let j=0;j<3;j++){poly([[-51+j*16,-38+j*8],[-39+j*16,-32+j*8],[-39+j*16,-57+j*8],[-51+j*16,-63+j*8]],stage?'#c6dfcf':'#8ea8a2');g.fillStyle='#e0d7b7';g.fillRect(-53+j*16,-37+j*8,15,2)}
      poly([[15,-10],[33,-19],[33,-54],[15,-45]],'#2f5159');g.strokeStyle='#d8c798';g.lineWidth=2;g.beginPath();g.moveTo(24,-15);g.lineTo(24,-50);g.stroke();
      g.save();g.translate(-55,-81);g.transform(1,.5,0,1,0,0);g.fillStyle='#344f4a';g.fillRect(0,0,52,13);g.fillStyle='#f1ddb0';g.font='bold 8px Tahoma';g.textAlign='center';g.fillText(site.short.toUpperCase(),26,9,48);g.restore();
      if(stage>=1){poly([[-63,-61],[-1,-30],[12,-39],[-50,-70]],site.id==='bakery'?'#d2a15f':site.id==='shop'?'#7ea6a0':'#a3b9be');for(let j=0;j<5;j++)poly([[-61+j*12,-60+j*6],[-55+j*12,-57+j*6],[-42+j*12,-66+j*6],[-48+j*12,-69+j*6]],'#eee1b1');}
      if(stage>=2){for(const x of [-67,66]){g.fillStyle='#a77d54';g.fillRect(x-7,-11,14,8);g.fillStyle='#66864c';g.fillRect(x-6,-17,12,9);g.fillStyle='#9caf66';g.fillRect(x-2,-21,7,8)}g.fillStyle='#ba945f';g.fillRect(-39,-7,23,5);g.fillStyle='#4c6051';g.fillRect(-35,-2,3,8);g.fillRect(-22,-2,3,8)}
      if(stage>=3){poly([[-35,-102],[-9,-89],[12,-101],[-14,-114]],'#436c88');poly([[2,-84],[28,-97],[49,-107],[23,-94]],'#517b92');g.strokeStyle='#dbca92';g.lineWidth=2;g.beginPath();g.moveTo(39,-104);g.lineTo(39,-142);g.stroke();poly([[40,-141],[62,-137],[60,-120],[40,-123]],site.id==='school'?'#98b2bc':'#d3b875');g.fillStyle='#f7e6b6';g.fillRect(46,-134,7,7)}
      if(site.id==='bakery'){g.fillStyle='#efd2a2';for(let i=0;i<3;i++)g.fillRect(-48+i*16,-54+i*8,8,4)}if(site.id==='shop'){g.strokeStyle='#e7d9bb';g.lineWidth=1;for(let i=0;i<3;i++){g.beginPath();g.moveTo(-44+i*16,-55+i*8);g.lineTo(-48+i*16,-48+i*8);g.lineTo(-39+i*16,-44+i*8);g.stroke()}}
      if(stage>=3&&site.id==='bakery'){g.strokeStyle='#354d49';g.lineWidth=2;for(const x of [-50,-26]){g.beginPath();g.ellipse(x,10,7,8,0,0,Math.PI*2);g.stroke()}g.strokeStyle='#ddbb7b';g.beginPath();g.moveTo(-50,10);g.lineTo(-42,-5);g.lineTo(-26,10);g.lineTo(-50,10);g.stroke()}if(stage>=3&&site.id==='school'){poly([[7,-34],[23,-42],[23,-57],[7,-49]],'#e4d8b1');poly([[24,-42],[40,-49],[40,-64],[24,-57]],'#bdcba5');g.strokeStyle='#8b9470';g.lineWidth=1;g.beginPath();g.moveTo(24,-42);g.lineTo(24,-57);g.stroke()}
      if(site.id==='school'){g.fillStyle='#d4c29b';g.fillRect(-5,-127,10,14);g.fillStyle='#536d79';g.fillRect(-2,-123,4,6)}g.restore();
    }return true;
  }
  const bar=document.createElement('section');bar.id='districtBar34';bar.hidden=true;bar.setAttribute('aria-label','Vida no bairro');$('sceneArena28').after(bar);
  const pins=document.createElement('div');pins.id='districtWorldPins34';pins.className='district-pins34';$('worldStage28').append(pins);
  function updateWorld(force=false){for(const row of $('al').querySelectorAll('.alr'))row.classList.toggle('idle-district34',row.textContent.includes('Nenhum contrato ativo'));const outside=Studio28.view==='outside';bar.hidden=!outside;if(!outside)return;const key=JSON.stringify([G.day,G.done,G.rep,G.lvl,ensure(),G.off.map(c=>c.id),G.act.map(c=>c.id),Studio28.zoom]);if(force||key!==lastWorldKey){lastWorldKey=key;bar.replaceChildren();for(const site of SITES){const b=button(site.short+' · '+state(site).stage+'/3',()=>open(site.id));b.title=site.person+' · '+status(site);bar.append(b)}bar.append(button('Explorar bairro →',()=>open(),'primary34'));placePins(pins,Studio28.zoom,$('worldCanvas28'))}}
  new ResizeObserver(()=>{if(active)drawMap();updateWorld(true)}).observe($('sceneArena28'));
  new MutationObserver(()=>updateWorld(true)).observe($('worldStage28'),{attributes:true,attributeFilter:['hidden']});
  $('worldCanvas28').addEventListener('pointerup',e=>{const r=e.currentTarget.getBoundingClientRect(),p={x:(e.clientX-r.left)*960/r.width,y:(e.clientY-r.top)*720/r.height},hit=siteAt(p,Studio28.zoom);if(hit){e.stopImmediatePropagation();open(hit.id)}},true);
  view.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();e.preventDefault();close()}if(e.key==='Tab'){const all=[...view.querySelectorAll('button')].filter(b=>!b.disabled&&b.getClientRects().length),first=all[0],end=all.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus()}else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus()}}});
  const beforePaused=paused;paused=function(){return active||beforePaused()};const beforeInit=init;init=function(){close();beforeInit();cachedG=null;signature='';lastWorldKey='';ensure();updateWorld(true)};
  const beforeUI=ui;ui=function(){beforeUI();if(!floorSimulation){updateWorld();refresh()}};
  const beforeTick=tick;tick=function(){const campaign=G;beforeTick();if(G===campaign){updateWorld(true);refresh()}};
  window.District34={open,close,request,accept:acceptProject,sites:SITES,ensure,get active(){return active},drawSites,signature(subject){return subject===G?SITES.map(s=>G.district34?.sites?.[s.id]?.stage||0).join(','):''}};
  ensure();updateWorld(true);
})();
