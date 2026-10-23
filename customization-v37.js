/* Cosmetic history is scoped to the current campaign. Never restore the economy. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id),copy=x=>JSON.parse(JSON.stringify(x));
  const avatarKeys=['name','body','look','skin','hair','shirt','pants','outfit','extra'];
  const roomKeys=['tiles','floorTheme','wallTheme','light','accent','sign'];
  const histories=new WeakMap();let restoring=false;
  const api=window.Customization37={ready:null,snapshot,record,undo:part=>travel(part,false),redo:part=>travel(part,true),saveLook,useLook};
  function history(part){if(!histories.has(G))histories.set(G,{avatar:{past:[],future:[]},room:{past:[],future:[]}});return histories.get(G)[part]}
  function snapshot(part){const room=ensurePersonalRoom(),source=part==='avatar'?room.avatar:room;return copy(Object.fromEntries((part==='avatar'?avatarKeys:roomKeys).filter(k=>source[k]!==undefined).map(k=>[k,source[k]])))}
  function record(part,before){if(restoring||!before||JSON.stringify(before)===JSON.stringify(snapshot(part)))return false;const h=history(part);h.past.push(before);if(h.past.length>30)h.past.shift();h.future=[];refreshHistory();return true}
  function invalidate(){peopleCache.clear();avatarCache.clear();personalFloorKey='';room23FloorKey='';Art28.invalidate()}
  function travel(part,forward){const h=history(part),from=forward?h.future:h.past,to=forward?h.past:h.future;if(!from.length)return false;to.push(snapshot(part));const state=from.pop(),room=ensurePersonalRoom();restoring=true;
    try{const source=part==='avatar'?room.avatar:room;for(const key of part==='avatar'?avatarKeys:roomKeys){if(key in state)source[key]=copy(state[key]);else delete source[key]}
      if(part==='room'){stopPersonalActivity();personalSelected=null;personalTool='walk';if(personalActor&&personalBlocked(Math.round(personalActor.x),Math.round(personalActor.y))){outer:for(let y=0;y<personalSize();y++)for(let x=0;x<personalSize();x++)if(!personalBlocked(x,y)){Object.assign(personalActor,{x,y,path:[],activity:null});room.avatar.x=x;room.avatar.y=y;break outer}}}
      invalidate();save();renderPersonalPanel();personalStatus((forward?'Refeito':'Desfeito')+' · '+(part==='avatar'?'visual do avatar':'decoração da sala')+'.');
    }finally{restoring=false}return true;
  }
  function wrap(name,part){const previous=window[name];window[name]=function(...args){const before=snapshot(part),result=previous.apply(this,args);record(part,before);return result}}
  wrap('setPersonalAvatar','avatar');wrap('setPersonalTheme','room');wrap('setRoomMood','room');wrap('personalPlace','room');wrap('personalRemove','room');
  function make(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e}
  function button(text,fn){const b=make('button',text);b.type='button';b.onclick=fn;return b}
  function refreshHistory(){const bar=$('customHistory37');if(!bar)return;const part=personalMode==='avatar'?'avatar':'room',h=history(part);bar.querySelector('[data-history="undo"]').disabled=!h.past.length;bar.querySelector('[data-history="redo"]').disabled=!h.future.length;bar.querySelector('small').textContent='Salvo nesta empresa · '+(part==='avatar'?'avatar':'sala')}
  function toolbar(){const bar=make('div',undefined,'custom-history37');bar.id='customHistory37';bar.setAttribute('aria-label','Histórico de personalização');for(const[id,label]of [['undo','↶ Desfazer'],['redo','↷ Refazer']]){const b=button(label,()=>api[id](personalMode==='avatar'?'avatar':'room'));b.dataset.history=id;bar.append(b)}bar.append(make('small'));$('personalPanel').prepend(bar);refreshHistory()}
  function wardrobe(){const room=ensurePersonalRoom();if(!Array.isArray(room.wardrobe37))room.wardrobe37=[];return room.wardrobe37}
  function saveLook(slot){if(!Number.isInteger(slot)||slot<0||slot>2)return false;wardrobe()[slot]=snapshot('avatar');save();renderPersonalPanel();personalStatus('Visual '+(slot+1)+' guardado no seu guarda-roupa.');return true}
  function useLook(slot){const saved=wardrobe()[slot];if(!saved||typeof saved!=='object')return false;const before=snapshot('avatar');
    const limits={look:7,skin:3,hair:5,shirt:5,pants:4,outfit:2,extra:4},avatar=ensurePersonalRoom().avatar;
    for(const[key,max]of Object.entries(limits))if(Number.isFinite(saved[key]))avatar[key]=Math.max(0,Math.min(max,Math.round(saved[key])));
    invalidate();save();renderPersonalPanel();record('avatar',before);personalStatus('Visual '+(slot+1)+' vestido.');return true;
  }
  function wardrobePanel(){const box=make('section',undefined,'wardrobe37');box.append(make('h4','Seu guarda-roupa'),make('p','Guarde até três combinações. Vestir mantém seu nome e sua posição.'));
    for(let i=0;i<3;i++){const saved=wardrobe()[i],card=make('div',undefined,'wardrobe-slot37');if(saved){const image=make('img');image.alt='Prévia do visual '+(i+1);image.src=personCanvas23({look:saved.look||0,skin:saved.skin||0,hair:AVATAR_HAIR[saved.hair]||AVATAR_HAIR[0],shirt:AVATAR_SHIRT[saved.shirt]||AVATAR_SHIRT[0],pants:PANTS23[saved.pants]||PANTS23[0],outfit:saved.outfit||0,extra:saved.extra||0},0).toDataURL();card.append(image)}else card.append(make('span','＋','wardrobe-empty37'));
      const info=make('div');info.append(make('b','Visual '+(i+1)),make('small',saved?'Combinação guardada':'Espaço livre'));card.append(info);const wear=button('Vestir',()=>useLook(i));wear.disabled=!saved;wear.dataset.wearLook=i;const store=button(saved?'Substituir':'Guardar atual',()=>saveLook(i));store.dataset.saveLook=i;card.append(wear,store);box.append(card)}
    $('outfitPresets33').after(box);
  }
  const priorPanel=renderPersonalPanel;renderPersonalPanel=function(){const scroll=document.querySelector('.personalLayout>aside')?.scrollTop||0;priorPanel();toolbar();document.querySelector('.personalShell>header b').textContent=personalMode==='avatar'?'Seu avatar':'Minha sala';$('personalTabs').classList.toggle('avatar-focused37',personalMode==='avatar');
    if(personalMode==='avatar')wardrobePanel();
    if(personalMode==='decorate'){
      const note=make('p','24 peças das seis coleções também estão disponíveis aqui. Na sala pessoal, são gratuitas e servem para decorar e interagir; os efeitos para a equipe pertencem ao escritório.','personal-note37');$('roomCategories33').after(note);
      const grid=$('personalPanel').querySelector('.personalCatalog:last-child');let count=0;for(const b of grid?.children||[]){const type=b.getAttribute('onclick')?.match(/personalPickTool\('([^']+)'\)/)?.[1];if(type)b.dataset.roomItem=type;if(!b.hidden)count++}
      const countNode=make('small',count+' peças nesta seleção','catalog-count37');countNode.id='roomCount37';grid?.before(countNode);
      const updateCount=()=>{countNode.textContent=[...grid.children].filter(b=>!b.hidden).length+' peças nesta seleção'};$('roomCategories33').addEventListener('click',updateCount);$('roomSearch33').addEventListener('input',updateCount);
    }
    const aside=document.querySelector('.personalLayout>aside');if(aside)aside.scrollTop=scroll;
  };
  const photo=button('↓ Foto da sala',()=>{drawPersonalRoom(performance.now());const a=document.createElement('a');a.download='DevCorp-minha-sala.png';a.href=personalCanvas.toDataURL('image/png');a.click();personalStatus('Foto da sua sala pronta. Personalização e interface ficam separadas na imagem.')});photo.id='roomPhoto37';photo.title='Baixar uma imagem da sala decorada';document.querySelector('.personalShell>header').append(photo);
  personalView.setAttribute('role','dialog');personalView.setAttribute('aria-modal','true');personalView.setAttribute('aria-label','Personalizar avatar e sala');
  personalView.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.target.matches('input,textarea,select')){e.preventDefault();e.stopPropagation();e.shiftKey?api.redo(personalMode==='avatar'?'avatar':'room'):api.undo(personalMode==='avatar'?'avatar':'room')}});
  api.ready=OfficeAtlas36.ready.then(()=>{
    for(const item of OfficeAtlas36.items){if(!PERSONAL_ITEMS.some(i=>i[0]===item.id))PERSONAL_ITEMS.push([item.id,item.name,0,item.action]);ROOM_USE23[item.id]=[item.pose,item.seconds,item.action,!!item.seated]}
    if(!personalView.hidden)renderPersonalPanel();return true;
  });
})();
