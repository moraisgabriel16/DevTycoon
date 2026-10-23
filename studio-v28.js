/* V28 presentation layer: one playable headquarters, from the plaza to every floor. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id),text=(tag,cls,value)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=value;return e};
  const button=(label,action,cls)=>{const b=text('button',cls,label);b.type='button';b.onclick=action;return b};
  document.body.classList.add('game28');
  document.documentElement.classList.add('game-root28');
  const header=text('header','game-header28');header.id='gameHeader28';
  header.innerHTML=`<div class="game-brand28"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M3 5h34v27H3z" fill="#252e32" stroke="#d9b76e" stroke-width="2"/><path d="M3 12h34M10 8h1m3 0h1m3 0h1" stroke="#d9b76e" stroke-width="2"/><path d="m10 18 5 4-5 4m10 0h8" stroke="#e9dfc6" stroke-width="2" fill="none"/><path d="M15 33h10v3H15z" fill="#d9b76e"/></svg><div><b>DEV<span>CORP</span></b><small>ESTÚDIO DE JOGOS & TECNOLOGIA</small></div></div><div class="game-company28"><strong id="companyName28"></strong><small id="companyAddress28"></small></div><div class="game-metrics28"><div><small>Caixa</small><b id="cash28"></b></div><div><small>Calendário</small><b id="day28"></b></div><div><small>Equipe</small><b id="staff28"></b></div><div><small>Reputação</small><b id="rep28"></b></div></div><div class="game-header-actions28"><span class="game-save28" id="saveState28">Salvo</span><button id="journey28" title="Central da empresa">Central</button><button id="menu28" aria-label="Abrir menu">☰</button></div>`;
  document.body.insertBefore(header,document.body.firstChild);$('journey28').onclick=()=>DevJourney27.open();$('menu28').onclick=()=>showTitle();
  const centralButton=$('commandEntry27');centralButton.textContent='Central';$('journey28').replaceWith(centralButton);
  const exteriorButton=$('exteriorEntry');exteriorButton.innerHTML='<svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m4 13 9-9 3 3-9 9-4 1Z"/><path d="m11 6 3 3"/></svg>';exteriorButton.title='Personalizar exterior';exteriorButton.setAttribute('aria-label','Personalizar exterior');$('menu28').before(exteriorButton);
  const layout=text('div','game-layout28');layout.id='gameLayout28';header.after(layout);
  layout.append($('dock'),$('mainc'),$('side'));
  const main=$('mainc'),side=$('side'),stage=$('stage');
  const top=text('div','scene-top28');top.id='sceneTop28';const tabs=text('nav','scene-tabs28');tabs.setAttribute('aria-label','Vista da sede');
  tabs.append(button('Escritório',()=>setView('inside')),button('Bairro',()=>setView('outside')));tabs.children[0].id='inside28';tabs.children[1].id='outside28';top.append(tabs,$('floorBar'));
  main.prepend(top);
  const arena=text('div','scene-arena28');arena.id='sceneArena28';top.after(arena);arena.append(stage);
  const world=text('section','world-stage28');world.id='worldStage28';world.hidden=true;
  world.innerHTML=`<canvas id="worldCanvas28" width="960" height="720" aria-label="Exterior da sua empresa. Toque em um andar do prédio para entrar ou em um funcionário para acompanhar."></canvas><div class="scene-world-tools28"><button id="worldLight28" aria-label="Alternar iluminação da praça">☾</button><button id="worldZoomOut28" aria-label="Afastar vista externa">−</button><button id="worldZoomIn28" aria-label="Aproximar vista externa">+</button><button id="worldEdit28" class="primary">✎ Personalizar sede</button></div><div class="world-enter28"><div><small id="worldFloorNumber28"></small><b id="worldFloorName28"></b></div><button id="worldEnter28">Entrar →</button></div><div class="scene-hint28">Toque nos andares para entrar · os funcionários também usam a praça</div>`;arena.append(world);
  const label=text('div','scene-label28');label.innerHTML='<small id="sceneOverline28"></small><b id="sceneTitle28"></b><div><span class="scene-live28"><i></i><span id="sceneStatus28"></span></span></div>';arena.append(label);
  const transition=text('div','scene-transition28');transition.innerHTML='<span></span>';arena.append(transition);
  const focus=text('section','npc-focus28');focus.id='npcFocus28';focus.hidden=true;focus.setAttribute('aria-label','Pessoa selecionada');arena.append(focus);
  const crew=text('section','crew-strip28');crew.setAttribute('aria-label','Equipe neste andar');crew.innerHTML='<div><b>Equipe</b><small id="crewCount28"></small></div><div class="crew-avatars28" id="crewAvatars28"></div>';main.append(crew);
  main.append($('journeyBar27'));main.prepend($('pauseNotice'));
  const oldAlerts=$('al');arena.append(oldAlerts,$('nextStep'));
  arena.append($('eventBanner'));
  let currentView='inside',selectedFloor=G.floor||0,worldZoom=1.12,worldNight=false,worldHits=[],crewKey='',lastRefresh=0,rafId=0,transitionToken=0,profileFull=false,rosterOriginal='',rendering=false,pendingSelection=null;
  const worldCanvas=$('worldCanvas28');
  TT.ut='◈ Sua empresa';const more=button('',()=>tabOpen('ut'));more.id='more28';more.innerHTML='<span>•••</span><small>Mais</small>';$('tabs').append(more);
  const icons={bd:'M5 19 19 5m-6-1 7 7M4 14l6 6M4 20l3-1-2-2-1 3',ct:'M7 5H4v16h16V5h-3M8 3h8v4H8zM8 12h8m-8 4h6',hr:'M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21v-3a5 5 0 0 1 5-4h4a5 5 0 0 1 5 4v3m3-14v8m-4-4h8',tm:'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm9-1a3 3 0 1 0 0-6M2 21v-4a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4m3-8a4 4 0 0 1 5 4v4',sh:'M3 9h18l-2-5H5L3 9Zm1 1v11h16V10M8 21v-7h5v7m-10-12v2a3 3 0 0 0 5 1 3 3 0 0 0 5 0 3 3 0 0 0 5-1V9',fn:'M4 20V4m0 16h17M8 16v-5m5 5V7m5 9V3',ac:'M8 4h8v7a4 4 0 0 1-8 0V4Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v5m-4 1h8',au:'M8 3v4m8-4v4M4 7h16v13H4zM8 12h1m6 0h1m-8 4h8'};
  for(const[key,path]of Object.entries(icons)){const b=$('tb_'+key);if(!b)continue;const name=b.querySelector('small')?.textContent||key;b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+path+'"/></svg><small>'+name+'</small>';b.setAttribute('aria-label',name);TT[key]=name;}
  const detailState={quality:false,capacity:false};
  const capacityBase=CAPV;CAPV=function(){const content=capacityBase();return content?'<details class="capacity-details28" '+(detailState.capacity?'open':'')+' ontoggle="Studio28.setDetail(\'capacity\',this.open)"><summary>Capacidade da equipe <span>'+new Set(companyStaff().filter(e=>!RO[e.role]?.pm).map(e=>e.role)).size+' especialidades</span></summary>'+content+'</details>':''};
  const qualityBase=TDC;TDC=function(){const risk=Math.round(bugRisk(r=>companyStaff().filter(e=>e.role===r).length)*100);return '<details class="capacity-details28" '+(detailState.quality||G.td>=60?'open':'')+' ontoggle="Studio28.setDetail(\'quality\',this.open)"><summary>Qualidade das entregas <span>'+risk+'% de risco de bugs</span></summary>'+qualityBase()+'</details>'};
  function resize(){
    const r=arena.getBoundingClientRect();for(const [canvas,ratio]of [[cv,1.5],[worldCanvas,4/3]]){const extra=innerWidth<=760?1.45:1,width=Math.max(1,canvas===worldCanvas?Math.max(r.width,r.height*ratio):Math.min(r.width*extra,r.height*ratio));canvas.style.width=width+'px';canvas.style.height=width/ratio+'px';}
  }
  new ResizeObserver(resize).observe(arena);addEventListener('resize',resize);
  function animateTransition(label,action){
    const token=++transitionToken;if(reducedMotion()){action();resize();return}
    transition.firstChild.textContent=label;transition.classList.add('show');setTimeout(()=>{if(token!==transitionToken)return;action();resize();setTimeout(()=>transition.classList.remove('show'),90)},150);
  }
  function setView(view,animate=true){
    if(!['inside','outside'].includes(view)||liftBusy)return false;
    const apply=()=>{currentView=view;stage.hidden=view!=='inside';world.hidden=view!=='outside';$('inside28').classList.toggle('active',view==='inside');$('outside28').classList.toggle('active',view==='outside');$('inside28').setAttribute('aria-pressed',view==='inside');$('outside28').setAttribute('aria-pressed',view==='outside');selectedFloor=G.floor||0;updateLabels();resize();renderCrew(true);renderFocus();};
    if(animate&&view!==currentView)animateTransition(view==='outside'?'Saindo para a praça…':'Voltando ao escritório…',apply);else{transitionToken++;transition.classList.remove('show');apply()}return true;
  }
  function enterFloor(floor=selectedFloor){
    floor=Math.max(0,Math.min(FLOOR_COUNTS[G.lvl]-1,Number(floor)||0));
    if(liftBusy)return false;
    animateTransition('Entrando em '+floorIdentity(floor).name+'…',()=>{setView('inside',false);if(floor!==G.floor)requestFloor(floor);else ui();});return true;
  }
  function updateLabels(){
    const id=floorIdentity(currentView==='outside'?selectedFloor:G.floor||0);
    $('sceneOverline28').textContent=currentView==='outside'?'VISTA DO BAIRRO':floorName(G.floor||0).toUpperCase();
    $('sceneTitle28').textContent=currentView==='outside'?(G.name||'Sua empresa'):id.name;
    $('sceneStatus28').textContent=paused()?'Pausado':currentView==='outside'?NPCLife28.outside().length+' na praça':sp+'× · Em atividade';
    if($('worldPause28')){$('worldPause28').textContent=sp===0?'▶':'⏸';$('worldPause28').setAttribute('aria-pressed',sp===0);}
    const count=staffOnFloor(selectedFloor).length;$('worldFloorNumber28').textContent=floorName(selectedFloor)+' · '+count+(count===1?' pessoa':' pessoas');$('worldFloorName28').textContent=floorIdentity(selectedFloor).name;
  }
  function drawPortrait(e,w=32,h=42,bust=false){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),im=personCanvas23(employeeAppearance(e),bust?4:0);if(im){g.imageSmoothingEnabled=false;g.drawImage(im,0,0,w,h)}return c}
  function selectEmployee(id){
    const e=companyStaff().find(e=>e.id===Number(id));if(!e)return false;G.sel=e.id;profileFull=false;if(innerWidth<=760&&shOpen)shClose();
    if(NPCLife28.active(e)){if(currentView!=='outside')setView('outside');}
    else if(e.floor!==G.floor){pendingSelection={id:e.id,floor:e.floor};setView('inside',false);requestFloor(e.floor);}
    renderFocus();renderCrew(true);return true;
  }
  function runOrder(kind){const e=companyStaff().find(e=>e.id===G.sel);if(!e)return;
    if(kind==='outside'){const ok=NPCLife28.startOutdoor(e.id,true);if(ok){setView('outside');DevJourney27.notify(e.n+' está indo tomar ar.')}else DevJourney27.notify('Aguarde a atividade atual terminar e confira o caminho até a saída.');}
    else if(kind==='profile'){focus.hidden=true;openLife25('people',e.id);}
    else if(kind==='follow'){if(NPCLife28.active(e))setView('outside');else{setView('inside',false);if(e.floor!==G.floor)requestFloor(e.floor);followId=e.id;}}
    else{if(NPCLife28.active(e)){NPCLife28.requestReturn(e.id,kind);renderFocus();return}if(NPCLife28.trip(e))cancelAction(e);setView('inside',false);lifeCommand25(e.id,kind);}
    renderFocus();
  }
  function renderFocus(){
    const e=companyStaff().find(e=>e.id===G.sel),visible=e&&(currentView==='outside'?NPCLife28.trip(e):!NPCLife28.active(e)&&(e.floor??0)===(G.floor??0));if(!visible||profileFull){focus.hidden=true;return}focus.hidden=false;const a=ensureBrain25(e),key=[e.id,e.n,e.role].join('|');
    if(focus.dataset.employee===key&&focus.firstChild){focus.querySelector('.npc-reason28').textContent=NPCLife28.reason(e);const items=focus.querySelectorAll('.npc-needs28>div');[['energy','Energia'],['thirst','Hidratação'],['social','Convívio']].forEach(([need,label],i)=>{items[i].querySelector('small').textContent=label+' '+Math.round(a.needs[need])+'%';items[i].querySelector('i span').style.width=Math.max(0,Math.min(100,a.needs[need]))+'%'});focus.querySelectorAll('.npc-focus-actions28 button')[1].disabled=NPCLife28.trip(e);return}
    focus.dataset.employee=key;focus.replaceChildren();
    const head=text('div','npc-focus-head28'),portrait=text('div','npc-portrait28');portrait.append(drawPortrait(e,32,42));const name=text('div');name.append(text('b',null,e.n),text('small',null,roleLabel(e)+' · '+PERSONALITIES25[a.personality].name));head.append(portrait,name,button('×',()=>{G.sel=null;focus.hidden=true;$('ep').style.display='none';renderCrew(true)},''));head.lastChild.setAttribute('aria-label','Fechar pessoa selecionada');
    focus.append(head,text('p','npc-reason28',NPCLife28.reason(e)));const needs=text('div','npc-needs28');for(const[key,title]of [['energy','Energia'],['thirst','Hidratação'],['social','Convívio']]){const item=text('div');item.append(text('small',null,title+' '+Math.round(a.needs[key])+'%'));const track=text('i'),fill=text('span');fill.style.width=Math.max(0,Math.min(100,a.needs[key]))+'%';track.append(fill);item.append(track);needs.append(item)}focus.append(needs);
    const actions=text('div','npc-focus-actions28');for(const[label,kind]of [['☕ Café','coffee'],['♧ Tomar ar','outside'],['◎ Seguir','follow'],['Conhecer '+e.n+' →','profile']]){const b=button(label,()=>runOrder(kind),kind==='profile'?'wide':'');b.disabled=kind==='outside'&&NPCLife28.trip(e);actions.append(b)}focus.append(actions);
  }
  const epanelBase=epanel;epanel=function(){epanelBase();if(!profileFull)$('ep').style.display='none';renderFocus()};
  function renderCrew(force=false){
    const people=currentView==='outside'?NPCLife28.outside():staffOnFloor(),key=[currentView,G.floor,G.sel,people.map(e=>e.id).join(',')].join('|');if(!force&&crewKey===key)return;crewKey=key;
    $('crewCount28').textContent=people.length+(currentView==='outside'?' na praça':' neste andar');const list=$('crewAvatars28');list.replaceChildren();
    for(const e of people.slice(0,12)){const b=button('',()=>selectEmployee(e.id),G.sel===e.id?'selected':'');b.title=e.n+' · '+roleLabel(e);b.setAttribute('aria-label','Selecionar '+e.n);b.append(drawPortrait(e),text('i',e.brk?'away':''));list.append(b)}
    if(people.length>12)list.append(text('span','crew-extra28','+'+(people.length-12)+' pessoas'));
    if(!people.length)list.append(text('span','crew-extra28',currentView==='outside'?'Ninguém na praça agora.':'Nenhum funcionário neste andar.'));
  }
  function refreshRosterVitals(panel){
    const staff=companyStaff(),counts=[staff.filter(e=>e.seated&&!e.brk).length,staff.filter(e=>e.brk).length,staff.filter(e=>!e.desk).length];panel.querySelectorAll('.roster-summary29 strong').forEach((e,i)=>e.textContent=counts[i]);
    panel.querySelectorAll('.roster-routine29>div').forEach((row,i)=>{const key=['energy','thirst','social'][i],value=Math.round(staff.reduce((sum,e)=>sum+ensureBrain25(e).needs[key],0)/Math.max(1,staff.length));row.querySelector('b').textContent=value+'%';row.querySelector('i').style.setProperty('--value',value+'%')});
    panel.querySelectorAll('.roster-card28').forEach(card=>{const e=staff.find(e=>e.id===Number(card.dataset.employee));if(e)card.querySelector('small:last-child').textContent=NPCLife28.reason(e)});
  }
  function renderRoster(){
    if(tab!=='tm')return;const panel=$('pn');if(panel.dataset.roster28){refreshRosterVitals(panel);return}rosterOriginal=panel.innerHTML;panel.replaceChildren();panel.dataset.roster28='1';
    const staff=companyStaff(),summary=text('div','roster-summary29');for(const[label,count]of [['Trabalhando',staff.filter(e=>e.seated&&!e.brk).length],['Em pausa',staff.filter(e=>e.brk).length],['Sem mesa',staff.filter(e=>!e.desk).length]]){const cell=text('div');cell.append(text('strong',null,count),text('small',null,label));summary.append(cell)}panel.append(summary);
    for(const e of companyStaff()){const card=text('div','roster-card28'),info=text('div');card.dataset.employee=e.id;info.append(text('b',null,e.n),text('small',null,roleLabel(e)+' · '+floorName(e.floor||0)),text('small',null,NPCLife28.reason(e)));card.append(drawPortrait(e),info,button('→',()=>selectEmployee(e.id)));panel.append(card)}
    if(staff.length&&staff.length<=3){const routine=text('section','roster-routine29');routine.append(text('h3',null,'Condições da equipe'));for(const[key,name]of [['energy','Energia'],['thirst','Hidratação'],['social','Convívio']]){const value=Math.round(staff.reduce((sum,e)=>sum+ensureBrain25(e).needs[key],0)/staff.length),row=text('div');row.append(text('span',null,name),text('b',null,value+'%'));const bar=text('i');bar.style.setProperty('--value',value+'%');row.append(bar);routine.append(row)}routine.append(text('p',null,'Folha diária: '+n$(staff.reduce((sum,e)=>sum+e.sal,0))),button('Contratar funcionário',()=>tabOpen('hr')));panel.append(routine)}
    const details=text('details','roster-management28');details.append(text('summary',null,'Salários, promoções e gestão completa'));const management=text('div');management.innerHTML=rosterOriginal;details.append(management);panel.append(details);
  }
  function renderUtilities(){
    if(tab!=='ut'||$('pn').dataset.utility28)return;const panel=$('pn');panel.dataset.utility28='1';panel.replaceChildren();panel.append(text('p',null,'Planeje os próximos passos da sua empresa.'));const grid=text('div','utilities28');
    for(const[label,action,key]of [['◈ Jornada e pesquisa',()=>DevJourney27.open()],['🚀 Produtos',()=>openBusiness('products')],['▥ Departamentos',()=>openBusiness('departments')],['♧ Vida no escritório',()=>openOffice()],['💹 Finanças',()=>tabOpen('fn'),'fn'],['🏅 Metas',()=>tabOpen('ac')],['⚙ Automação',()=>tabOpen('au'),'au'],['💾 Suas empresas',()=>openSlots()]]){const b=button(label,()=>{if(innerWidth<=760)shClose();action()});if(key&&$('tb_'+key).hidden){b.disabled=true;b.title='Disponível conforme a progressão da empresa.';}grid.append(b)}panel.append(grid);
  }
  function refresh(){
    if(rendering||floorSimulation)return;rendering=true;try{
      if(pendingSelection&&!liftBusy&&G.floor===pendingSelection.floor){G.sel=pendingSelection.id;pendingSelection=null;renderFocus();}
      $('companyName28').textContent=G.name||'Sua empresa';const floors=FLOOR_COUNTS[G.lvl],staff=companyStaff().length;$('companyAddress28').textContent=BLD[G.lvl].n+' · '+floors+(floors===1?' andar':' andares');$('cash28').textContent=n$(G.money);$('cash28').classList.toggle('negative',G.money<0);$('day28').textContent='Dia '+G.day+' · '+WD[(G.day-1)%7];$('staff28').textContent=staff+(staff===1?' pessoa':' pessoas');$('rep28').textContent=G.rep.toFixed(1)+' ★';
      const saveText=$('saveIndicator')?.textContent||'Salvo';$('saveState28').textContent=saveText.includes('erro')?'Confira o save':'Salvo';updateLabels();renderCrew();renderRoster();renderUtilities();more.classList.toggle('on',tab==='ut'&&shOpen);
      $('cnm').textContent=(G.name||'Minha Empresa')+' · V35';
    }finally{rendering=false}
  }
  let ghostKey='',ghostValid=false,ghostTime=0;
  function ghost(){
    if(!buildActive()||!hov||tool==='del'||!TL[tool]||!S[tool])return;const[x,y]=hov;if(x<0||y<0||x>=nU()||y>=nU()||x===0&&y===0||G.tiles[k(x,y)])return;
    const key=[x,y,tool,G.money,moveFrom].join('|');if(key!==ghostKey||performance.now()-ghostTime>300){ghostValid=G.money>=TL[tool].c&&canPlace(k(x,y),tool);ghostKey=key;ghostTime=performance.now()}
    cx.save();cx.setTransform(ZT.z,0,0,ZT.z,Math.round(ZT.tx),Math.round(ZT.ty));v19Path(cx,[P(x,y),P(x+1,y),P(x+1,y+1),P(x,y+1)]);cx.fillStyle=ghostValid?'#78ac7055':'#d5766155';cx.strokeStyle=ghostValid?'#4c8054':'#bc644a';cx.lineWidth=1.5;cx.fill();cx.stroke();const p=P(x+.5,y+.5),im=S[tool];cx.globalAlpha=.55;cx.drawImage(im,p[0]-im.width/2,p[1]+10-im.height);cx.restore();
  }
  function sceneCovered(){return document.hidden||['storyView35','districtView34','neighborhoodView33','exteriorView','commandView27','personalView','businessView','officeView','lifeView25','slotsView','eventView','liftMenu'].some(id=>{const e=$(id);return e&&!e.hidden})}
  const drawBase=draw2;draw2=function(t){if(currentView!=='inside'||ts.style.display==='flex'||sceneCovered())return;drawBase(t);ghost()};
  function worldPoint(x,y,z=0){const p=ExteriorScene28.project(x,y,z);return[(p[0]-480)*worldZoom+480,(p[1]-360)*worldZoom+360]}
  function drawWorld(t){
    ExteriorScene28.render(worldCanvas,ensureLife25().clock*1000,{night:worldNight,zoom:worldZoom});const g=worldCanvas.getContext('2d');g.setTransform(1,0,0,1,0,0);worldHits=[];
    // Highlight a real floor of this campaign; tapping it uses the existing elevator.
    for(const shape of ExteriorScene28.floorShapes().filter(s=>s.floor===selectedFloor)){g.beginPath();shape.points.forEach((p,i)=>{const x=(p[0]-480)*worldZoom+480,y=(p[1]-360)*worldZoom+360;i?g.lineTo(x,y):g.moveTo(x,y)});g.closePath();g.fillStyle='#e5d28e08';g.fill();g.strokeStyle='#e5d18da0';g.lineWidth=1.5;g.stroke()}
    const actors=NPCLife28.outside().map(e=>{const p=NPCLife28.worldPosition(e),[x,y]=worldPoint(p.x,p.y,1);worldHits.push({id:e.id,x,y});return{x:p.x,y:p.y,draw:g=>{
      const phase=p.moving&&!reducedMotion()?[1,0,2,0][Math.floor(p.distance/.16)%4]:0,im=personCanvas23(employeeAppearance(e),p.back?3:phase,phase),scale=worldZoom;
      g.fillStyle='#213c3c33';g.beginPath();g.ellipse(x,y+2,6*scale,2.5*scale,0,0,Math.PI*2);g.fill();g.imageSmoothingEnabled=false;g.save();g.translate(x,y+3*scale);if(p.flip)g.scale(-1,1);g.drawImage(im,-11*scale,-29*scale,22*scale,29*scale);g.restore();
      if(e.id===G.sel){g.strokeStyle='#f5d590';g.beginPath();g.ellipse(x,y+3,8*scale,3*scale,0,0,Math.PI*2);g.stroke();g.font='11px system-ui';g.fillStyle='#2f4941';g.textAlign='center';g.fillText(e.n,x,y-32*scale)}
      if(e.life28.until>ensureLife25().clock&&e.id===G.sel){g.font='10px system-ui';g.textAlign='center';g.fillStyle='#fff7e7';g.fillRect(x-64,y-57*scale,128,18);g.fillStyle='#375449';g.fillText(e.life28.say,x,y-44*scale,120)}
    }}});
    // A visiting client is the same visitor managed by the office simulation.
    const visitor=G.life?.visitor;if(visitor?.phase==='arriving'&&visitor.person.x+visitor.person.y<2){const p=worldPoint(5.5,9.5,1),im=personCanvas23(employeeAppearance(visitor.person),1);actors.push({x:5.5,y:9.5,draw:g=>g.drawImage(im,p[0]-11,p[1]-26,22,29)})}
    ExteriorScene28.renderActors(worldCanvas,ensureLife25().clock*1000,{night:worldNight,zoom:worldZoom},actors);
  }
  function screenPoint(event){const r=worldCanvas.getBoundingClientRect();return{x:(event.clientX-r.left)*960/r.width,y:(event.clientY-r.top)*720/r.height}}
  worldCanvas.addEventListener('pointerup',event=>{
    const p=screenPoint(event),hit=worldHits.map(e=>({...e,d:Math.hypot(e.x-p.x,e.y-20*worldZoom-p.y)})).sort((a,b)=>a.d-b.d)[0];if(hit&&hit.d<26*worldZoom){selectEmployee(hit.id);return}
    const g=worldCanvas.getContext('2d');for(const shape of ExteriorScene28.floorShapes()){g.beginPath();shape.points.forEach((q,i)=>{const x=(q[0]-480)*worldZoom+480,y=(q[1]-360)*worldZoom+360;i?g.lineTo(x,y):g.moveTo(x,y)});g.closePath();if(g.isPointInPath(p.x,p.y)){selectedFloor=shape.floor;updateLabels();enterFloor(selectedFloor);return}}
  });
  const worldPause=button('⏸',()=>{spd(sp?0:1);refresh()});worldPause.id='worldPause28';worldPause.setAttribute('aria-label','Pausar ou retomar no exterior');$('worldLight28').before(worldPause);
  $('worldEnter28').onclick=()=>enterFloor();$('worldEdit28').onclick=()=>openExterior();$('worldLight28').onclick=()=>{worldNight=!worldNight;$('worldLight28').textContent=worldNight?'☀':'☾'};$('worldZoomIn28').onclick=()=>worldZoom=Math.min(1.6,worldZoom+.15);$('worldZoomOut28').onclick=()=>worldZoom=Math.max(.7,worldZoom-.15);
  const floorRequest=requestFloor;requestFloor=function(f){if(currentView==='outside'){if(liftBusy||!Number.isInteger(f)||f<0||f>=FLOOR_COUNTS[G.lvl])return false;selectedFloor=f;updateLabels();return true}return floorRequest(f)};
  coinsToCash=function(){
    if(!OPT.juice||reducedMotion()||document.hidden)return;const source=(currentView==='outside'?worldCanvas:cv).getBoundingClientRect(),target=$('cash28').getBoundingClientRect();
    for(let i=0;i<6;i++){const coin=text('span','coin-flight',i%2?'●':'✦'),x=source.left+source.width*.5+(i-2.5)*12,y=source.top+source.height*.48;coin.style.left=x+'px';coin.style.top=y+'px';coin.style.color='#be984c';document.body.append(coin);const animation=coin.animate([{transform:'translate(0,0) scale(.6)',opacity:0},{transform:'translate(0,-24px) scale(1)',opacity:1,offset:.22},{transform:'translate('+(target.left+target.width/2-x)+'px,'+(target.top-y)+'px) scale(.3)',opacity:0}],{duration:750,delay:i*45,easing:'ease-in-out'});animation.onfinish=()=>coin.remove();setTimeout(()=>coin.remove(),1600);}
  };
  function loop(t){
    if(currentView==='outside'&&ts.style.display!=='flex'&&!sceneCovered())drawWorld(t);
    if(t-lastRefresh>500){lastRefresh=t;refresh();if(G.sel!=null||!focus.hidden)renderFocus()}
    rafId=requestAnimationFrame(loop);
  }
  const uiBase=ui;ui=function(){uiBase();if($('pn')){delete $('pn').dataset.roster28;delete $('pn').dataset.utility28;}refresh()};
  const initBase=init;init=function(){G.sel=null;pendingSelection=null;focus.hidden=true;crewKey='';initBase();selectedFloor=G.floor||0;setView('inside',false);refresh()};
  const titleBase=titleRender;titleRender=function(){titleBase();const version=ts.querySelector('.titleFoot23 small');if(version)version.textContent='V29';const eyebrow=ts.querySelector('.titleEyebrow');if(eyebrow)eyebrow.textContent='DEVCORP · JOGO DE GESTÃO';const h=ts.querySelector('.titleCopy23 h2');if(h)h.innerHTML='Da garagem<br>ao próximo<br><em>grande estúdio.</em>';const p=ts.querySelector('.titleCopy23>p');if(p)p.textContent='Contrate, entregue projetos e construa a sede da sua empresa.'};
  const artReady=Art28.ready;artReady.then(()=>{crewKey='';focus.dataset.employee='';renderCrew(true);renderFocus()});
  window.Studio28={setView,enterFloor,selectEmployee,refresh,setDetail(key,value){if(key in detailState)detailState[key]=!!value},get view(){return currentView},get selectedFloor(){return selectedFloor},get zoom(){return worldZoom},worldPoint,get hits(){return worldHits},fit:resize};
  setView('inside',false);ui();resize();rafId=requestAnimationFrame(loop);if(ts.style.display==='flex')titleRender();
})();
