/* V26: independent cosmetic exteriors; the campaign economy remains authoritative. */
(() => {
  'use strict';
  const WALLS=['#72959b','#d7bf9b','#a5b99b','#aa8490','#6f829f','#d3d2c8','#405e70','#bb8066'];
  const TRIMS=['#e6c285','#a2ded4','#d9a9b6','#9fbbea','#e5e4d7','#f49268'];
  const GLASS=['#9bd8df','#ffd58c','#b9d9ab','#b6b2ed'];
  const ROOFS=[['terrace','☕','Terraço','Mesas e guarda-sol'],['garden','🌿','Jardim','Um refúgio no topo'],['solar','☀','Energia solar','Painéis fotovoltaicos'],['antenna','📡','Conectado','Antena e climatização'],['greenhouse','♧','Estufa','Vidro, plantas e luz'],['observatory','◎','Observatório','Um espaço para olhar longe']];
  const PROPS=[['tree','🌳','Árvore'],['planter','🌷','Floreira'],['bench','🪑','Banco'],['lamp','💡','Poste'],['bike','🚲','Bicicletário'],['fountain','⛲','Fonte'],['table','☕','Mesa de café'],['hedge','♧','Cerca viva'],['flowers','❀','Canteiro'],['flag','⚑','Estandarte','1 projeto de vitrine'],['sculpture','✦','Escultura','3 projetos de vitrine'],['none','⌫','Remover']];
  const atlasSprites=new Map(),atlasItems=new Map();let atlasCollections=[],atlasCollection='native';
  function propUnlocked(id){const seals=Object.values(G.journey27?.showcases||{}).filter(s=>s?.status==='complete').length;return id==='flag'?seals>=1:id==='sculpture'?seals>=3:true}
  const SLOTS=[[1,2],[1,4],[1,6],[1,8],[2,10],[4,10],[6,10],[8,10],[10,9],[10,7],[10,5],[10,3]];
  const view=document.createElement('section');
  view.id='exteriorView';view.hidden=true;view.setAttribute('role','dialog');view.setAttribute('aria-modal','true');view.setAttribute('aria-labelledby','exteriorTitle');
  view.innerHTML=`<div class="ext-shell"><header class="ext-header"><div><div class="ext-eyebrow">DEVCORP / ARQUITETURA</div><h2 id="exteriorTitle">Uma sede com a sua cara.</h2><small>Crie a identidade da sua empresa, da calçada à cobertura.</small></div><button id="extClose" aria-label="Fechar exterior">✕</button></header><div class="ext-layout"><div class="ext-scene"><span class="ext-badge" id="extBadge"></span><div class="ext-camera"><button id="extDay" aria-label="Alternar dia e noite">☾</button><button id="extOut" aria-label="Diminuir zoom">−</button><button id="extIn" aria-label="Aumentar zoom">+</button></div><canvas id="exteriorCanvas" width="960" height="720" aria-label="Prévia do prédio. Na aba Jardim, toque nos círculos para decorar a calçada."></canvas><div class="ext-scene-caption" id="extCaption"></div></div><aside class="ext-controls"><div class="ext-building"><label for="extBuilding">PRÉDIO DA CAMPANHA</label><select id="extBuilding"></select></div><nav class="ext-tabs" aria-label="Personalização externa" id="extTabs"></nav><div id="exteriorPanel"></div><footer class="ext-footer"><button id="extExport" title="Baixar uma imagem da sua sede">↓ Foto</button><button class="ext-primary" id="extSave">Aplicar exterior</button><small>Personalização gratuita · salva por prédio e por slot</small><div class="ext-status" id="extStatus" role="status"></div></footer></aside></div></div>`;
  document.body.append(view);
  const el=id=>document.getElementById(id),canvas=el('exteriorCanvas');let ctx=canvas.getContext('2d');
  const pixelCanvas=document.createElement('canvas');pixelCanvas.width=480;pixelCanvas.height=360;const pixelContext=pixelCanvas.getContext('2d');
  const worldCache=document.createElement('canvas');worldCache.width=960;worldCache.height=720;let worldCacheKey='',worldBuilds=0,worldHits=0;
  let level=0,draft,section='facade',prop='tree',zoom=1,night=false,raf=0,priorFocus,hitSlots=[],worldRendering=false;
  const copy=x=>JSON.parse(JSON.stringify(x));
  const defaults=i=>({wall:WALLS[i%WALLS.length],trim:TRIMS[0],glass:GLASS[0],roof:i>2?'solar':'terrace',sign:'',material:'brick',awning:'striped',paving:'stone',props:{0:'tree',3:'tree',5:'bench',8:'lamp',11:'planter'}});
  function sanitize(raw,i){
    const d=defaults(i),r=raw&&typeof raw==='object'?raw:{};
    for(const[key,allowed]of [['wall',WALLS],['trim',TRIMS],['glass',GLASS],['roof',ROOFS.map(x=>x[0])],['material',['brick','plaster','timber']],['awning',['striped','solid','none']],['paving',['stone','brick','garden']]])if(allowed.includes(r[key]))d[key]=r[key];
    d.sign=typeof r.sign==='string'?r.sign.replace(/[\x00-\x1f]/g,'').slice(0,22):'';
    if(r.props&&typeof r.props==='object'){d.props={};for(let j=0;j<SLOTS.length;j++)if(PROPS.some(p=>p[0]===r.props[j]&&p[0]!=='none'))d.props[j]=r.props[j];}
    return d;
  }
  function stored(i,source=G){return sanitize(source.exteriors?.buildings?.[i],i)}
  let sceneName=null,sceneSubject=null;
  function say(text){el('extStatus').textContent=text}
  const sessions37=new WeakMap();let past37=[],future37=[],lastDraft37=null,editorCampaign37=null;
  function stash37(){if(editorCampaign37!==G||!draft)return;if(!sessions37.has(G))sessions37.set(G,new Map());sessions37.get(G).set(level,{draft:copy(draft),past:copy(past37),future:copy(future37)})}
  function history37(){const bar=el('extHistory37');if(!bar||!draft)return;bar.children[0].disabled=!past37.length;bar.children[1].disabled=!future37.length;const changed=JSON.stringify(draft)!==JSON.stringify(stored(level));bar.children[2].disabled=!changed;bar.querySelector('small').textContent=changed?'Prévia não salva · use Aplicar exterior.':'Exterior aplicado · mudanças ficam na prévia.'}
  function restore37(forward){const from=forward?future37:past37,to=forward?past37:future37;if(!from.length)return false;to.push(copy(draft));draft=from.pop();lastDraft37=copy(draft);stash37();renderPanel();history37();say(forward?'Alteração refeita na prévia.':'Alteração desfeita na prévia.');draw(performance.now());return true}
  function discard37(){if(JSON.stringify(draft)===JSON.stringify(stored(level)))return;draft=stored(level);renderPanel();dirty();say('Prévia descartada. O exterior aplicado foi mantido.')}
  function dirty(){if(lastDraft37&&JSON.stringify(lastDraft37)!==JSON.stringify(draft)){past37.push(copy(lastDraft37));if(past37.length>30)past37.shift();future37=[]}lastDraft37=copy(draft);stash37();history37();say('Prévia alterada · aplique para salvar.');draw(performance.now())}

  function pickBuilding(i){stash37();editorCampaign37=G;level=Math.max(0,Math.min(BLD.length-1,Number(i)||0));const session=sessions37.get(G)?.get(level);draft=session?copy(session.draft):stored(level);past37=session?copy(session.past):[];future37=session?copy(session.future):[];lastDraft37=copy(draft);el('extBuilding').value=String(level);say('');renderPanel();draw(performance.now())}
  function openExterior(){
    if(liftBusy)return;
    priorFocus=document.activeElement;view.hidden=false;document.documentElement.classList.add('ext-open');
    el('extBuilding').innerHTML=BLD.map((b,i)=>`<option value="${i}">${htmlText(b.n)}${i>G.lvl?' · prévia':i===G.lvl?' · atual':' · adquirido'}</option>`).join('');
    pickBuilding(G.lvl);el('extClose').focus();cancelAnimationFrame(raf);animate(performance.now());
  }
  function closeExterior(){stash37();view.hidden=true;document.documentElement.classList.remove('ext-open');cancelAnimationFrame(raf);priorFocus?.focus();last=performance.now()}
  function apply(){
    if(level>G.lvl){say('Adquira este prédio na Loja para salvar o exterior.');return false}
    const prior=G.exteriors;
    G.exteriors={version:1,buildings:{...(prior?.buildings||{}),[level]:copy(draft)}};
    if(!save()){G.exteriors=prior;say('Não foi possível salvar. Exporte seu save para liberar espaço.');return false}
    stash37();history37();say('✓ Exterior salvo para '+BLD[level].n+'.');return true;
  }
  function swatches(key,colors){const box=document.createElement('div');box.className='ext-swatches';colors.forEach((color,i)=>{const b=document.createElement('button');b.style.background=color;b.className=draft[key]===color?'on':'';b.setAttribute('aria-label',({wall:'Fachada',trim:'Detalhes',glass:'Janelas'}[key])+' · cor '+(i+1));b.setAttribute('aria-pressed',draft[key]===color);b.onclick=()=>{draft[key]=color;renderPanel();dirty()};box.append(b)});return box}
  function heading(text){const h=document.createElement('h3');h.textContent=text;return h}
  function options(items,current,action){const box=document.createElement('div');box.className='ext-options';items.forEach(([id,icon,title,subtitle])=>{const b=document.createElement('button');b.className=id===current?'on':'';b.setAttribute('aria-label',title+(section==='roof'?' na cobertura':''));b.setAttribute('aria-pressed',id===current);const s=document.createElement('span');if(atlasSprites.has(id)){const im=document.createElement('img');im.src=atlasSprites.get(id).preview;im.alt='';im.className='ext-atlas-preview36';s.append(im)}else s.textContent=icon;const name=document.createElement('span');name.textContent=title;b.append(s,name);if(subtitle){const small=document.createElement('small');small.textContent=subtitle;b.append(small)}if(!propUnlocked(id))b.disabled=true;b.onclick=()=>{if(propUnlocked(id))action(id)};box.append(b)});return box}
  function renderPanel(){
    el('extTabs').replaceChildren();for(const[id,name]of [['facade','Fachada'],['roof','Cobertura'],['garden','Jardim'],['identity','Identidade']]){const b=document.createElement('button');b.textContent=name;b.className=section===id?'on':'';b.onclick=()=>{section=id;renderPanel();draw(performance.now())};el('extTabs').append(b)}
    el('extBadge').textContent=(level>G.lvl?'PRÉVIA / ':'SEDE / ')+BLD[level].n.toUpperCase();
    el('extSave').disabled=level>G.lvl;el('extSave').textContent=level>G.lvl?'Adquira na Loja':'Aplicar exterior';
    el('extCaption').textContent=section==='garden'?'Escolha um item e toque num círculo da calçada para posicionar.':'Sua empresa está pausada enquanto você personaliza. Explore também os próximos prédios.';
    const pane=el('exteriorPanel');pane.replaceChildren();
    if(section==='facade'){
      for(const[key,label,colors]of [['wall','01 / Cor da fachada',WALLS],['trim','02 / Molduras e detalhes',TRIMS],['glass','03 / Vidros e iluminação',GLASS]])pane.append(heading(label),swatches(key,colors));
      pane.append(heading('04 / Revestimento'),options([['brick','▤','Tijolos'],['plaster','▢','Reboco liso'],['timber','▥','Madeira']],draft.material,id=>{draft.material=id;renderPanel();dirty()}),heading('05 / Marquise'),options([['striped','▥','Listrada'],['solid','▬','Lisa'],['none','⌫','Sem marquise']],draft.awning,id=>{draft.awning=id;renderPanel();dirty()}));
    }
    if(section==='roof'){pane.append(heading('O céu é só o começo.'),options(ROOFS,draft.roof,id=>{draft.roof=id;renderPanel();dirty()}));const p=document.createElement('p');p.className='ext-hint';p.textContent='As coberturas são visuais. O terraço interno e os andares da empresa continuam acessíveis pelo elevador.';pane.append(p)}
    if(section==='garden'){
      if(atlasCollections.length){
        const nav=document.createElement('nav');nav.className='ext-atlas-tabs36';nav.setAttribute('aria-label','Coleções externas');
        for(const c of [{id:'native',name:'Clássicos'},...atlasCollections]){const b=document.createElement('button');b.textContent=c.name;b.setAttribute('aria-pressed',atlasCollection===c.id);b.onclick=()=>{atlasCollection=c.id;renderPanel()};nav.append(b)}pane.append(heading('Quatro coleções para o exterior'),nav);
        const c=atlasCollections.find(c=>c.id===atlasCollection);if(c){const p=document.createElement('p');p.className='ext-atlas-purpose36';p.textContent=c.function;pane.append(p)}
      }
      if(atlasCollection==='native')pane.append(heading('Composições prontas'),options([['zen','♧','Jardim tranquilo'],['social','☕','Praça de encontros'],['atelier','❀','Ateliê verde'],['garden36','♧','Pátio botânico'],['plaza36','☕','Pausa na praça'],['circulation36','↗','Chegadas e caminhos'],['identity36','✦','Praça da empresa']],null,id=>ExteriorScene28.gardenPreset(id)));
      if(atlasCollection!=='native'){const b=document.createElement('button');b.textContent='Experimentar composição desta coleção';b.onclick=()=>ExteriorScene28.gardenPreset(atlasCollection+'36');pane.append(b)}
      const hint=document.createElement('p');hint.textContent='Uma composição substitui os itens da calçada. Revise a prévia antes de aplicar; você pode desfazer.';pane.append(hint);
      const available=PROPS.filter(p=>p[0]==='none'||(atlasCollection==='native'?!atlasItems.has(p[0]):atlasItems.get(p[0])?.sheet===atlasCollection));
      pane.append(heading('Decorar ponto a ponto'),options(available,prop,id=>{prop=id;renderPanel();say(id==='none'?'Toque num círculo para remover.':'Toque num círculo da calçada para posicionar.')}));
    }
    if(section==='identity'){
      pane.append(heading('Sua marca, em destaque.'));const label=document.createElement('label');label.textContent='Texto do letreiro';label.htmlFor='extSign';const input=document.createElement('input');input.id='extSign';input.maxLength=22;input.value=draft.sign;input.placeholder=(G.name||'DevCorp').slice(0,22);input.oninput=()=>{draft.sign=input.value.slice(0,22);dirty()};pane.append(label,input,heading('Um ponto de partida'));
      pane.append(options([['cozy','☕','Acolhedor'],['tech','⌘','Tecnológico'],['green','🌿','Biofílico'],['atelier','▤','Ateliê urbano'],['night','☾','Noite criativa'],['civic','◇','Casa de encontros']],null,id=>{Object.assign(draft,styles37[id]);renderPanel();dirty()}));
    }
    slotPicker37(pane);history37();
    if(level>G.lvl){const p=document.createElement('p');p.className='ext-hint';p.textContent='Você está visitando um prédio futuro. As alterações são apenas uma prévia até a compra na Loja.';pane.prepend(p)}
  }
  const styles37={cozy:{wall:WALLS[1],trim:TRIMS[0],glass:GLASS[1],roof:'terrace',material:'brick',awning:'striped',paving:'stone'},tech:{wall:WALLS[6],trim:TRIMS[1],glass:GLASS[0],roof:'solar',material:'plaster',awning:'solid',paving:'stone'},green:{wall:WALLS[2],trim:TRIMS[4],glass:GLASS[2],roof:'garden',material:'timber',awning:'solid',paving:'garden'},atelier:{wall:WALLS[7],trim:TRIMS[0],glass:GLASS[0],roof:'greenhouse',material:'brick',awning:'none',paving:'brick'},night:{wall:WALLS[4],trim:TRIMS[2],glass:GLASS[3],roof:'observatory',material:'plaster',awning:'solid',paving:'stone'},civic:{wall:WALLS[5],trim:TRIMS[3],glass:GLASS[0],roof:'terrace',material:'plaster',awning:'striped',paving:'brick'}};
  function place37(slot){if(!Number.isInteger(slot)||slot<0||slot>=SLOTS.length||!propUnlocked(prop))return false;if(prop==='none')delete draft.props[slot];else draft.props[slot]=prop;renderPanel();dirty();return true}
  function slotPicker37(pane){if(section==='identity'){const cards=pane.querySelectorAll('.ext-options button');[...cards].forEach((b,i)=>{const style=Object.values(styles37)[i];if(!style)return;const strip=document.createElement('span');strip.className='ext-style-preview37';for(const color of [style.wall,style.trim,style.glass]){const swatch=document.createElement('i');swatch.style.background=color;strip.append(swatch)}b.prepend(strip)})}
    if(section!=='garden')return;const d=document.createElement('details');d.className='ext-slot-picker37';d.innerHTML='<summary>Escolher posição por lista · 12 pontos</summary>';const grid=document.createElement('div');grid.className='ext-slot-grid37';SLOTS.forEach((_,i)=>{const b=document.createElement('button');b.dataset.exteriorSlot=i;const item=PROPS.find(p=>p[0]===draft.props[i]);b.textContent=(i+1)+' · '+(item?.[2]||'Livre');b.setAttribute('aria-label','Ponto '+(i+1)+': '+(item?.[2]||'livre'));b.onclick=()=>{place37(i);const next=el('exteriorPanel').querySelector('.ext-slot-picker37');next.open=true;next.querySelector('[data-exterior-slot="'+i+'"]').focus()};grid.append(b)});d.append(grid);pane.append(d)}
  function shade(color,f){return '#'+color.slice(1).match(/../g).map(x=>Math.max(0,Math.min(255,Math.round(parseInt(x,16)*f))).toString(16).padStart(2,'0')).join('')}
  const Q=(x,y,z=0)=>[480+(x-y)*29,265+(x+y)*14.5-z];
  function poly(points,color,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke()}}
  function tile(x,y,w,d,z,color){poly([Q(x,y,z),Q(x+w,y,z),Q(x+w,y+d,z),Q(x,y+d,z)],color)}
  function box(x,y,w,d,z,h,color){poly([Q(x,y+d,z),Q(x+w,y+d,z),Q(x+w,y+d,z+h),Q(x,y+d,z+h)],shade(color,.9));poly([Q(x+w,y,z),Q(x+w,y+d,z),Q(x+w,y+d,z+h),Q(x+w,y,z+h)],shade(color,.65));tile(x,y,w,d,z+h,shade(color,1.17))}
  function line(points,color,width=1){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
  function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
  function tree(x,y,z=0,small=false){
    const p=Q(x,y,z),s=small?.65:1;ellipse(p[0]+3,p[1]+3,17*s,6*s,'#25342b35');
    box(x-.11,y-.11,.22,.22,z,31*s,'#755039');
    ctx.save();ctx.translate(Math.round(p[0]),Math.round(p[1]));ctx.scale(s,s);
    for(const[dx,dy,w,h,c]of [[-12,-47,24,30,'#3d6543'],[-21,-39,13,18,'#3d6543'],[10,-43,13,24,'#33553e'],[-14,-49,24,27,'#69834b'],[-19,-39,18,15,'#577648'],[-8,-55,19,15,'#7d9657'],[8,-42,12,16,'#486b43'],[-10,-50,8,5,'#9cad66'],[-17,-36,6,4,'#8da35c'],[3,-43,6,4,'#899e59'],[12,-30,6,4,'#5f7e4b']]){ctx.fillStyle=night?shade(c,.65):c;ctx.fillRect(dx,dy,w,h)}
    ctx.restore();
  }
  function decoration(type,x,y,z=0,t=0){
    const p=Q(x,y,z);
    if(atlasSprites.has(type)){
      const sprite=atlasSprites.get(type),item=atlasItems.get(type),im=night?sprite.night:sprite.day;
      ctx.drawImage(im,Math.round(p[0]-im.width/2),Math.round(p[1]+3-im.height));
      if(item.companySign){ctx.save();ctx.translate(p[0]-20,p[1]-30);ctx.transform(1,.5,0,1,0,0);ctx.fillStyle='#f3e1b2';ctx.font='bold 5px Tahoma';ctx.textAlign='center';ctx.fillText((sceneName||G.name||'DevCorp').slice(0,18),17,0,32);ctx.restore()}
      if(item.light&&night){const glow=ctx.createRadialGradient(p[0],p[1]-im.height+12,0,p[0],p[1]-im.height+12,35);glow.addColorStop(0,'#ffdf9280');glow.addColorStop(1,'#ffdf9200');ctx.fillStyle=glow;ctx.fillRect(p[0]-35,p[1]-im.height-23,70,70)}
      return;
    }
    if(type==='tree')tree(x,y,z);
    if(type==='hedge'){box(x-.5,y-.2,1,.4,z,8,'#6b6948');box(x-.55,y-.23,1.1,.46,z+8,17,'#476548');for(let i=0;i<4;i++){const a=Q(x-.4+i*.23,y,z+26);ctx.fillStyle='#789454';ctx.fillRect(a[0]-3,a[1]-2,6,4)}}
    if(type==='flowers'){box(x-.5,y-.3,1,.6,z,3,'#9c8260');tile(x-.45,y-.25,.9,.5,z+4,'#5d7547');for(let i=0;i<6;i++){const a=Q(x-.35+i*.13,y+(i%2)*.15,z+9);ctx.fillStyle=i%2?'#e2bc79':'#b96e76';ctx.fillRect(a[0]-2,a[1]-2,4,4)}}
    if(type==='table'){box(x-.06,y-.06,.12,.12,z,13,'#49564b');tile(x-.4,y-.4,.8,.8,z+14,'#bb9162');for(const dx of [-.65,.65]){box(x+dx-.15,y-.14,.3,.28,z+5,3,'#6c8872');box(x+dx-.04,y-.04,.08,.08,z,5,'#455449')}const a=Q(x,y,z+18);ctx.fillStyle='#f3e2bc';ctx.fillRect(a[0]-2,a[1]-3,4,4)}
    if(type==='planter'){box(x-.4,y-.25,.8,.5,z,8,'#9b6549');box(x-.44,y-.28,.88,.56,z+8,2,'#c28a60');for(let i=0;i<4;i++){const q=Q(x-.25+i*.18,y,z+14);ctx.fillStyle='#45633e';ctx.fillRect(q[0]-4,q[1]-3,8,7);ctx.fillStyle='#819452';ctx.fillRect(q[0]-2,q[1]-7,5,6);ctx.fillStyle=i%2?'#dbb775':'#bc6953';ctx.fillRect(q[0]+1,q[1]-7,3,3)}}
    if(type==='bench'){box(x-.5,y-.18,1,.35,z+8,3,'#a47a51');box(x-.5,y-.2,1,.08,z+12,10,'#97704e');for(let j=0;j<3;j++)line([Q(x-.5,y-.21,z+13+j*3),Q(x+.5,y-.21,z+13+j*3)],'#cfaa74',1);box(x-.38,y-.1,.1,.23,z,9,'#34413e');box(x+.28,y-.1,.1,.23,z,9,'#34413e')}
    if(type==='lamp'){box(x-.1,y-.1,.2,.2,z,3,'#4c6068');line([Q(x,y,z+2),Q(x,y,z+53)],'#789199',3);const l=Q(x,y,z+54);if(night){const glow=ctx.createRadialGradient(l[0],l[1],0,l[0],l[1],32);glow.addColorStop(0,'#ffdf9270');glow.addColorStop(1,'#ffdf9200');ctx.fillStyle=glow;ctx.fillRect(l[0]-32,l[1]-32,64,64)}ellipse(l[0],l[1],6,4,'#f5d8a0');ellipse(l[0],l[1]-4,8,3,'#476270')}
    if(type==='bike'){for(let i=0;i<2;i++){const a=Q(x-.35+i*.35,y,z+6);ctx.strokeStyle='#b6d0cd';ctx.lineWidth=2;for(const dx of [-8,8]){ctx.beginPath();ctx.ellipse(a[0]+dx,a[1],5,6,0,0,Math.PI*2);ctx.stroke()}line([[a[0]-8,a[1]],[a[0],a[1]-10],[a[0]+8,a[1]],[a[0]-8,a[1]]],'#dcad7b',2)}}
    if(type==='fountain'){ellipse(p[0],p[1]+3,23,12,'#718b92');ellipse(p[0],p[1],20,9,'#75bac5');box(x-.1,y-.1,.2,.2,z,16,'#bac7c4');for(let i=-2;i<=2;i++){const a=Q(x,y,z+18);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.quadraticCurveTo(a[0]+i*7,a[1]-21,a[0]+i*8,a[1]+12);ctx.strokeStyle='#b3e1dfaa';ctx.lineWidth=1.5;ctx.stroke()}ellipse(p[0]+Math.sin(t/600)*7,p[1]+2,11,4,'#b2e7e34d')}
    if(type==='flag'){box(x-.15,y-.15,.3,.3,z,4,'#c5b48d');line([Q(x,y,z+4),Q(x,y,z+51)],'#d2c39d',2);const a=Q(x,y,z+51),wave=reducedMotion()?0:Math.sin(t/500)*2;poly([[a[0]+2,a[1]],[a[0]+20,a[1]+3+wave],[a[0]+18,a[1]+22+wave],[a[0]+2,a[1]+19]],draft.trim);ctx.fillStyle='#335758';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText('✦',a[0]+10,a[1]+15)}
    if(type==='sculpture'){box(x-.4,y-.4,.8,.8,z,10,'#8e9d9c');const a=Q(x,y,z+13);poly([[a[0],a[1]-31],[a[0]+13,a[1]-15],[a[0],a[1]],[a[0]-13,a[1]-15]],draft.trim);poly([[a[0],a[1]-31],[a[0]+13,a[1]-15],[a[0],a[1]]],shade(draft.trim,.72));ellipse(a[0],a[1]+1,10,3,'#ece4bc44')}
  }
  function draw(t=0){
    if(!draft||view.hidden&&!worldRendering)return;
    const output=ctx;ctx=pixelContext;const g=ctx;g.setTransform(.5,0,0,.5,0,0);g.clearRect(0,0,960,720);g.imageSmoothingEnabled=false;
    g.fillStyle=night?'#29353e':'#c2c4ae';g.fillRect(0,0,960,720);
    g.save();g.translate(480,360);g.scale(zoom,zoom);g.translate(-480,-360);
    // A continuous neighborhood replaces the unrelated sky / floating platform.
    tile(-20,-20,52,52,-10,night?'#34413c':'#a6ae8d');
    for(const[rx,ry,rw,rd]of [[-20,-4,52,3.2],[-20,12.5,52,3.2],[-4,-20,3.2,52],[12.5,-20,3.2,52]])tile(rx,ry,rw,rd,-4,night?'#2a343b':'#626c6c');
    for(let i=-18;i<30;i+=2.6){tile(i,14,.9,.08,-3,'#c1ba93');tile(14,i,.08,.9,-3,'#c1ba93');tile(i,-2.5,.9,.08,-3,'#b4b49a');}
    // Sidewalks, raised curb and a small crossing at the corner.
    box(-.4,-.4,12.8,12.8,-6,6,night?'#68716d':'#bab7a1');
    const paving={stone:'#c4beaa',brick:'#bd9c7b',garden:'#9eaa7e'}[draft.paving];tile(0,0,12,12,0,night?shade(paving,.64):paving);
    for(let i=0;i<=12;i++){line([Q(i,0,0),Q(i,12,0)],'#6f776329',1);line([Q(0,i,0),Q(12,i,0)],'#6f776329',1)}
    for(let i=0;i<6;i++)tile(10.6,12.8+i*.36,1.1,.19,-3,night?'#a39f81':'#e8dec0');
    tile(2.65,2.65,7.3,6.45,1,'#9a9c88');
    for(const[tx,ty,tw,td]of [[-10,2,5,7],[2,-10,8,5],[17,2,7,8]]){box(tx,ty,tw,td,-5,3,'#858c75');tile(tx+.25,ty+.25,tw-.5,td-.5,-1,'#98a77c');}
    // Neighboring architecture uses the game's native pixel art vocabulary.
    if(!window.District34?.drawSites(g,Q,sceneSubject||G,night))for(const[tx,ty,index]of [[-7.4,5,0],[5.5,-6.3,1]]){
      const im=V19['building'+index],p=Q(tx,ty,0);if(im){g.save();g.globalAlpha=night?.5:.83;g.drawImage(im,Math.round(p[0]-im.width),Math.round(p[1]-im.height*2+6),im.width*2,im.height*2);g.restore()}
    }
    tree(-1.9,3,0);tree(-1.9,8,0);tree(5,-1.9,0);tree(10,-1.9,0);
    const w=[5,5.8,6,5,5.8,7][level],d=[4,4.5,5,5,5,5.5][level],floors=FLOOR_COUNTS[level],h=floors*32+18,x=3,y=3;
    // Street objects on the rear sides must be behind the building silhouette.
    for(const p of SLOTS.map(([px,py],i)=>({x:px,y:py,type:draft.props[i]})).filter(p=>p.type&&p.x<x+w&&p.y<y+d).sort((a,b)=>a.x+a.y-b.x-b.y))decoration(p.type,p.x,p.y,1,t);
    const wall=night?shade(draft.wall,.65):draft.wall;
    poly([Q(x,y+d,1),Q(x+w,y+d,1),Q(x+w+2,y+d+1,1),Q(x+1,y+d+2,1)],'#20303a40');
    box(x,y,w,d,2,h,wall);
    // Masonry courses, corner piers and sills give the facade human scale.
    if(draft.material!=='plaster')for(let z=9;z<h;z+=draft.material==='timber'?4:6){line([Q(x,y+d+.02,z),Q(x+w,y+d+.02,z)],shade(wall,.78),1);line([Q(x+w+.02,y,z),Q(x+w+.02,y+d,z)],shade(wall,.57),1);}
    if(draft.material==='brick')for(let row=0;row<Math.floor(h/6);row++)for(let col=0;col<w;col+=.72){const a=x+col+(row%2)*.36;if(a<x+w)line([Q(a,y+d+.025,3+row*6),Q(a,y+d+.025,9+row*6)],shade(wall,.83),1)}
    box(x-.04,y+d-.09,.18,.18,2,h,'#bcb6a0');box(x+w-.14,y+d-.09,.18,.18,2,h,'#aaa58f');
    for(let f=0;f<floors;f++){
      const z=15+f*32;
      for(let col=0;col<Math.floor(w);col++){
        const a=x+.35+col*(w-.6)/Math.floor(w),b=a+.55;
        const color=night?((col+f)%3?draft.glass:shade(draft.glass,.42)):shade(draft.glass,.9);
        poly([Q(a,y+d+.015,z),Q(b,y+d+.015,z),Q(b,y+d+.015,z+20),Q(a,y+d+.015,z+20)],color,'#28414b');
        line([Q(a,y+d+.025,z+9),Q(b,y+d+.025,z+9)],shade(wall,.7));
        line([Q(a-.05,y+d+.045,z-1),Q(b+.06,y+d+.045,z-1)],'#d8cfaf',2);
        line([Q(a+.08,y+d+.03,z+18),Q(a+.28,y+d+.03,z+11)],'#d9e3ca',1);
      }
      for(let col=0;col<Math.floor(d);col++){
        const a=y+.3+col*(d-.5)/Math.floor(d),b=a+.54;
        poly([Q(x+w+.015,a,z),Q(x+w+.015,b,z),Q(x+w+.015,b,z+20),Q(x+w+.015,a,z+20)],shade(draft.glass,night?((col+f)%2?.9:.35):.65),'#28414b');
      }
      line([Q(x,y+d+.03,z-5),Q(x+w,y+d+.03,z-5),Q(x+w+.03,y,z-5)],shade(draft.trim,night?.6:.9),2);
    }
    // Entry canopy and glass entrance.
    if(level===0){
      const a=x+.36,b=x+1.58;poly([Q(a,y+d+.04,2),Q(b,y+d+.04,2),Q(b,y+d+.04,30),Q(a,y+d+.04,30)],'#6f817b','#465a56');
      for(let z=5;z<29;z+=3)line([Q(a+.04,y+d+.05,z),Q(b-.04,y+d+.05,z)],'#a6b3a0',1);
      line([Q(a+.07,y+d+.06,3),Q(a+.07,y+d+.06,29)],'#d1d0b1',2);
    }
    const door=x+w*.48;
    poly([Q(door,y+d+.04,2),Q(door+.8,y+d+.04,2),Q(door+.8,y+d+.04,28),Q(door,y+d+.04,28)],'#29495b');
    line([Q(door+.4,y+d+.05,2),Q(door+.4,y+d+.05,28)],draft.trim,2);
    if(draft.awning!=='none'){box(door-.2,y+d-.05,1.3,.65,30,3,draft.trim);if(draft.awning==='striped')for(let j=0;j<6;j++)tile(door-.2+j*.22,y+d-.05,.11,.65,34,j%2?shade(draft.trim,.72):draft.trim)}
    box(door-.14,y+d+.1,1.1,.38,1,3,'#c8bca1');
    box(x+w+.02,y+1,.18,.7,6,12,'#a6ada0');for(let v=0;v<4;v++)line([Q(x+w+.21,y+1.06,8+v*2),Q(x+w+.21,y+1.62,8+v*2)],'#54665e',1);
    box(x-.12,y-.12,w+.24,d+.24,h+2,5,draft.trim);
    tile(x+.12,y+.12,w-.24,d-.24,h+7,'#626d67');
    for(let u=.4;u<w-.2;u+=.7)line([Q(x+u,y+.16,h+7),Q(x+u,y+d-.16,h+7)],'#7e867744',1);
    if(draft.roof==='solar')for(let a=0;a<3;a++)for(let b=0;b<2;b++){box(x+.7+a*1.1,y+.6+b*1.3,.9,1,h+7,3,'#263d60');tile(x+.72+a*1.1,y+.62+b*1.3,.86,.96,h+11,'#446d91');line([Q(x+1.15+a*1.1,y+.62+b*1.3,h+11),Q(x+1.15+a*1.1,y+1.58+b*1.3,h+11)],'#8fc0cf',1)}
    if(draft.roof==='garden'){tile(x+.25,y+.25,w-.5,d-.5,h+8,'#74936d');for(let j=0;j<3;j++)decoration('planter',x+.7+j*1.3,y+.8,h+9,t);tree(x+w-1,y+d-1,h+8,true);decoration('bench',x+1.6,y+d-1,h+9,t)}
    if(draft.roof==='terrace'){
      const ux=x+1.35,uy=y+1.25;box(ux-.24,uy-.24,.48,.48,h+7,10,'#b0946e');line([Q(ux,uy,h+8),Q(ux,uy,h+41)],'#b9ae8f',2);
      const center=Q(ux,uy,h+43),rim=Array.from({length:8},(_,i)=>Q(ux+Math.cos(i*Math.PI/4)*.86,uy+Math.sin(i*Math.PI/4)*.86,h+36));
      for(let i=0;i<8;i++)poly([center,rim[i],rim[(i+1)%8]],shade(draft.trim,[.85,1,.76,.91,.67,.86,.72,.94][i]),'#8e815a');
      decoration('bench',x+2.5,y+d-1,h+7);decoration('planter',x+w-1,y+d-1,h+7);
    }
    if(draft.roof==='antenna'){box(x+.7,y+.7,1.3,1.2,h+7,15,'#9aa9a8');for(let j=0;j<4;j++)line([Q(x+.85,y+.85+j*.22,h+23),Q(x+1.8,y+.85+j*.22,h+23)],'#5c7075',2);line([Q(x+w-1,y+1,h+7),Q(x+w-1,y+1,h+62)],'#b9c5c3',3);const a=Q(x+w-1,y+1,h+46);ellipse(a[0]+7,a[1]-3,13,6,'#d6d7c5');ellipse(a[0],a[1]-18,3,3,night?'#ff9e80':'#dc9d79')}
    if(draft.roof==='greenhouse'){box(x+.65,y+.7,w-1.3,d-1.4,h+7,27,'#80a9a1');tile(x+.65,y+.7,w-1.3,d-1.4,h+35,'#b8d2c2');for(let i=0;i<5;i++)line([Q(x+.7+i*(w-1.4)/4,y+.7,h+7),Q(x+.7+i*(w-1.4)/4,y+.7,h+35),Q(x+.7+i*(w-1.4)/4,y+d-.7,h+35)],'#ebdfbd',2);for(let i=0;i<3;i++)decoration('planter',x+1+i,y+d-.5,h+8,t)}
    if(draft.roof==='observatory'){tile(x+.3,y+.3,w-.6,d-.6,h+8,'#536d77');box(x+2,y+2,.25,.25,h+8,18,'#c9b88d');const a=Q(x+2.1,y+2.1,h+27);line([[a[0]-4,a[1]+3],[a[0]+21,a[1]-18]],'#d8d2ba',8);ellipse(a[0]+22,a[1]-19,6,5,'#3a5a6b');decoration('bench',x+1,y+d-1,h+9,t);decoration('planter',x+w-1,y+d-1,h+9,t)}
    // The sign is painted on the facade plane, including escaped user text.
    g.save();const a=Q(x+.25,y+d+.07,h-8);g.transform(1,.5,0,1,a[0],a[1]);g.fillStyle=shade(wall,.6);g.fillRect(0,-12,(w-.5)*29,18);g.fillStyle=draft.trim;g.textAlign='center';g.font='bold 10px system-ui';g.fillText((draft.sign||sceneName||G.name||'DevCorp').slice(0,22).toUpperCase(),(w-.5)*14.5,0,(w-.7)*29);g.restore();
    const sorted=SLOTS.map(([x,y],i)=>({x,y,i})).sort((a,b)=>a.x+a.y-b.x-b.y);
    hitSlots=[];
    for(const {x,y,i}of sorted){
      const p=Q(x,y,1);hitSlots.push({i,x:(p[0]-480)*zoom+480,y:(p[1]-360)*zoom+360});
      if(section==='garden'){ellipse(p[0],p[1],20,10,'#e8e7be55');g.save();g.setLineDash([3,3]);g.strokeStyle='#fcf0c0';g.beginPath();g.ellipse(p[0],p[1],20,10,0,0,Math.PI*2);g.stroke();g.restore();if(!draft.props[i]){g.fillStyle='#f4eac4';g.font='14px system-ui';g.textAlign='center';g.fillText('+',p[0],p[1]+4)}}
      if(!worldRendering&&(x>=3+w||y>=3+d))decoration(draft.props[i],x,y,1,t);
    }
    // Tiny animated neighbors; no external sprites or downloads needed.
    g.restore();
    output.setTransform(1,0,0,1,0,0);output.clearRect(0,0,960,720);output.imageSmoothingEnabled=false;output.drawImage(pixelCanvas,0,0,960,720);ctx=output;
  }
  function animate(t){if(view.hidden)return;draw(t);raf=requestAnimationFrame(animate)}
  canvas.addEventListener('pointerup',event=>{
    if(section!=='garden'||!propUnlocked(prop))return;const r=canvas.getBoundingClientRect();const px=(event.clientX-r.left)*960/r.width,py=(event.clientY-r.top)*720/r.height;
    const hit=hitSlots.map(s=>({...s,d:Math.hypot(s.x-px,(s.y-py)*1.6)})).sort((a,b)=>a.d-b.d)[0];
    if(!hit||hit.d>32){say('Toque num dos círculos da calçada.');return}
    place37(hit.i);
  });
  const historyBar37=document.createElement('div');historyBar37.id='extHistory37';historyBar37.className='ext-history37';historyBar37.innerHTML='<button type="button">↶ Desfazer</button><button type="button">↷ Refazer</button><button type="button">Descartar prévia</button><small role="status"></small>';el('extExport').before(historyBar37);historyBar37.children[0].onclick=()=>restore37(false);historyBar37.children[1].onclick=()=>restore37(true);historyBar37.children[2].onclick=discard37;
  el('extClose').onclick=closeExterior;el('extSave').onclick=apply;el('extBuilding').onchange=e=>pickBuilding(e.target.value);
  el('extDay').onclick=()=>{night=!night;el('extDay').textContent=night?'☀':'☾';draw(performance.now())};
  el('extOut').onclick=()=>{zoom=Math.max(.7,zoom-.1);draw(performance.now())};el('extIn').onclick=()=>{zoom=Math.min(1.5,zoom+.1);draw(performance.now())};
  el('extExport').onclick=()=>{draw(performance.now());const a=document.createElement('a');a.download='DevCorp-'+BLD[level].n.replaceAll(' ','-')+'.png';a.href=canvas.toDataURL('image/png');a.click();say('Foto da sede pronta.')};
  view.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.target.matches('input,textarea,select')){e.preventDefault();e.stopPropagation();restore37(!!e.shiftKey)}
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeExterior()}
    if(e.key==='Tab'){const all=[...view.querySelectorAll('button,input,select,summary')].filter(x=>!x.disabled&&x.getClientRects().length),first=all[0],end=all[all.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus()}else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus()}}
  });
  const button=document.createElement('button');button.id='exteriorEntry';button.textContent='🏡 Exterior dos prédios';button.onclick=openExterior;personalEntryBar.prepend(button);
  const pausedBeforeExterior=paused;paused=function(){return !view.hidden||pausedBeforeExterior()};
  const initBeforeExterior=init;init=function(){view.hidden=true;document.documentElement.classList.remove('ext-open');cancelAnimationFrame(raf);initBeforeExterior()};
  window.openExterior=openExterior;
  window.ExteriorScene28={
    open:openExterior,close:closeExterior,design:stored,
    editor37:{get draft(){return copy(draft)},get level(){return level},undo:()=>restore37(false),redo:()=>restore37(true),discard:discard37,place:place37},
    registerAtlas(items,sprites,collections){
      atlasCollections=collections;
      for(const item of items){atlasItems.set(item.id,item);const day=sprites.get(item.id),nightCanvas=document.createElement('canvas');nightCanvas.width=day.width;nightCanvas.height=day.height;const g=nightCanvas.getContext('2d');g.drawImage(day,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='#132e4d66';g.fillRect(0,0,day.width,day.height);atlasSprites.set(item.id,{day,night:nightCanvas,preview:day.toDataURL()});if(!PROPS.some(p=>p[0]===item.id))PROPS.splice(PROPS.length-1,0,[item.id,'',item.name,item.description])}worldCacheKey='';
    },
    outdoorBenefits(destination){const props=this.navigation().props;return{energy:props.some(p=>p.nature)?4:0,thirst:destination&&props.some(p=>p.water&&Math.hypot(p.x-destination[0],p.y-destination[1])<=1.6)?15:0}},
    inspire(design){openExterior();for(const key of ['wall','trim','glass','material','awning'])if(design[key])draft[key]=sanitize(design,level)[key];renderPanel();dirty()},
    gardenPreset(id){const choices={zen:{0:'tree',2:'hedge',3:'flowers',4:'planter',5:'bench',7:'flowers',8:'lamp',11:'planter'},social:{0:'tree',3:'tree',4:'table',5:'bench',7:'table',8:'lamp',10:'bike',11:'flowers'},atelier:{0:'hedge',2:'planter',3:'tree',4:'flowers',5:'bench',7:'planter',8:'lamp',11:'tree'},garden36:{0:'treeBox36',2:'trellis36',3:'hedgeBox36',4:'flowerBed36',5:'parkBench36',8:'plazaLamp36',11:'flowerBed36'},plaza36:{0:'treeBox36',3:'readingShade36',4:'cafeTable36',5:'parkBench36',7:'waterFountain36',8:'plazaLamp36',11:'flowerBed36'},circulation36:{0:'cycleRack36',3:'wayfinding36',5:'parkBench36',7:'bollards36',8:'plazaLamp36',10:'shuttleStop36',11:'flowerBed36'},identity36:{0:'monumentSign36',3:'banner36',5:'parkBench36',7:'sculpture36',8:'plazaLamp36',11:'flowerBed36'}};if(choices[id]){draft.props=copy(choices[id]);renderPanel();dirty()}},
    get stats(){return{builds:worldBuilds,hits:worldHits}},
    navigation(){const w=[5,5.8,6,5,5.8,7][G.lvl],d=[4,4.5,5,5,5,5.5][G.lvl],design=stored(G.lvl);return{building:{x:3,y:3,w,d},entry:{x:Math.round((3+w*.48+.4)*2)/2,y:3+d+.5},props:SLOTS.map(([x,y],i)=>({x,y,type:design.props[i],footprint:atlasItems.get(design.props[i])?.footprint,rest:!!atlasItems.get(design.props[i])?.rest,water:!!atlasItems.get(design.props[i])?.water,nature:!!atlasItems.get(design.props[i])?.nature,shortcut:atlasItems.get(design.props[i])?.shortcut})).filter(p=>p.type),key:JSON.stringify([G.lvl,design.props])}},
    renderActors(target,t,options,actors){
      const previous={ctx,draft,night};const subject=options.campaign||G;const output=target.getContext('2d'),g=pixelContext,scale=options.zoom||1;
      try{ctx=g;draft=stored(subject.lvl,subject);night=!!options.night;g.setTransform(.5,0,0,.5,0,0);g.clearRect(0,0,960,720);g.imageSmoothingEnabled=false;g.save();g.setTransform(.5*scale,0,0,.5*scale,240*(1-scale),180*(1-scale));
        const right=3+[5,5.8,6,5,5.8,7][subject.lvl],front=3+[4,4.5,5,5,5,5.5][subject.lvl];
        const objects=SLOTS.map(([x,y],i)=>({x,y,type:draft.props[i]})).filter(o=>o.type&&(o.x>=right||o.y>=front)).concat(actors);
        objects.sort((a,b)=>a.x+a.y-b.x-b.y);for(const o of objects){if(o.draw){g.save();g.setTransform(.5,0,0,.5,0,0);o.draw(g);g.restore()}else decoration(o.type,o.x,o.y,1,t)}
        g.restore();output.save();output.setTransform(1,0,0,1,0,0);output.imageSmoothingEnabled=false;output.drawImage(pixelCanvas,0,0,960,720);output.restore();
      }finally{({ctx,draft,night}=previous)}
    },
    render(target,t=0,options={}){
      const subject=options.campaign||G,design=stored(subject.lvl,subject),right=3+[5,5.8,6,5,5.8,7][subject.lvl],front=3+[4,4.5,5,5,5,5.5][subject.lvl],animatedRear=!reducedMotion()&&SLOTS.some(([x,y],i)=>x<right&&y<front&&['fountain','flag'].includes(design.props[i])),key=JSON.stringify([subject.lvl,subject.name,FLOOR_COUNTS[subject.lvl],design,options.zoom||1,!!options.night,v19Ready,v23Ready,window.District34?.signature(subject)||'',animatedRear?Math.floor(t/100):0]);
      if(key===worldCacheKey){const g=target.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,960,720);g.imageSmoothingEnabled=false;g.drawImage(worldCache,0,0);worldHits++;return}
      const previous={ctx,level,draft,section,zoom,night,worldRendering,hitSlots,sceneName,sceneSubject};
      try{ctx=target.getContext('2d');level=subject.lvl;sceneName=subject.name;sceneSubject=subject;draft=design;section='world';zoom=options.zoom||1;night=!!options.night;worldRendering=true;draw(t);const g=worldCache.getContext('2d');g.clearRect(0,0,960,720);g.drawImage(target,0,0);worldCacheKey=key;worldBuilds++;}
      finally{({ctx,level,draft,section,zoom,night,worldRendering,hitSlots,sceneName,sceneSubject}=previous)}
    },
    project:Q,
    floorShapes(subject=G){const w=[5,5.8,6,5,5.8,7][subject.lvl],d=[4,4.5,5,5,5,5.5][subject.lvl],x=3,y=3,floors=Array.from({length:FLOOR_COUNTS[subject.lvl]},(_,floor)=>floor);return [...floors.map(floor=>({floor,side:'front',points:[Q(x,y+d,7+floor*32),Q(x+w,y+d,7+floor*32),Q(x+w,y+d,39+floor*32),Q(x,y+d,39+floor*32)]})),...floors.map(floor=>({floor,side:'right',points:[Q(x+w,y,7+floor*32),Q(x+w,y+d,7+floor*32),Q(x+w,y+d,39+floor*32),Q(x+w,y,39+floor*32)]}))]}
  };
  // Refresh an already visible title after the extension loads.
  if(ts.style.display==='flex')titleRender();
})();
