/* Compact RGBA sheets, real furniture, and the existing placement/action engine. */
(() => {
  'use strict';
  const api=window.OfficeAtlas36={loaded:false,items:[],exterior:[],collections:[],manifest:null,ready:null,isMeeting:id=>api.items.some(i=>i.id===id&&i.meeting),isReception:id=>api.items.some(i=>i.id===id&&i.reception)};
  let collection='all';const previews=new Map(),sprites=new Map();
  const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
  const button=(text,fn)=>{const e=node('button',text);e.type='button';e.onclick=fn;return e};
  const fetchJSON=async name=>{const response=await fetch('./assets/v36/'+name);if(!response.ok)throw Error('Atlas: não foi possível carregar '+name);return response.json()};
  const loadImage=name=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('Atlas inválido: '+name));image.src='./assets/v36/'+name});
  api.ready=(async()=>{
    const [catalog,manifest]=await Promise.all([fetchJSON('catalog.json'),fetchJSON('manifest.json')]);
    const entries=await Promise.all(Object.entries(catalog.sheets).map(async([id,name])=>[id,await loadImage(name)]));
    await Art28.ready;const images=Object.fromEntries(entries);
    for(const item of catalog.items){
      const f=manifest.frames[item.id],image=images[f?.sheet];if(!image||!f.w||!f.h||f.x+f.w>image.width||f.y+f.h>image.height)throw Error('Recorte inválido: '+item.id);
      const c=document.createElement('canvas');c.width=f.w;c.height=f.h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(image,f.x,f.y,f.w,f.h,0,0,f.w,f.h);
      sprites.set(item.id,c);previews.set(item.id,c.toDataURL());
      if(item.scope==='office'){S[item.id]=c;V22[item.id]=c;TL[item.id]={c:item.cost,n:item.name};MT[item.id]=[item.category,item.name,item.description];ACT[item.id]={label:item.action,pose:item.pose,seconds:item.seconds,mood:item.mood,xp:item.xp,seated:!!item.seated}}
    }
    api.items=catalog.items.filter(i=>i.scope==='office');api.exterior=catalog.items.filter(i=>i.scope==='exterior');api.collections=catalog.collections;api.manifest=manifest;
    ExteriorScene28.registerAtlas(api.exterior,sprites,api.collections.filter(c=>c.scope==='exterior'));api.loaded=true;renderTools();ui();return true;
  })();
  const beforeTools=renderTools;renderTools=function(){
    beforeTools();if(!api.loaded)return;
    const row=node('div',undefined,'atlas-collections36');row.setAttribute('aria-label','Coleções de móveis');row.append(node('small','COLEÇÕES DO ESCRITÓRIO'));
    for(const[id,label]of [['all','Todos os móveis'],...api.collections.filter(c=>c.scope==='office').map(c=>[c.id,c.name+' · 4'])]){const b=button(label,()=>{collection=id;renderTools()});b.setAttribute('aria-pressed',collection===id);row.append(b)}
    const grid=tools.querySelector('.pal');grid.before(row);if(collection==='all')return;
    const purpose=node('p',api.collections.find(c=>c.id===collection)?.function,'atlas-purpose36');grid.before(purpose);
    grid.classList.add('atlas-grid36');grid.replaceChildren();for(const item of api.items.filter(i=>i.sheet===collection)){
      const b=button('',()=>pk(item.id));b.className='pc'+(tool===item.id&&mapMode==='build'?' on':'');b.dataset.atlasItem=item.id;b.setAttribute('aria-label',item.name+' · '+n$(item.cost));
      const im=node('img');im.src=previews.get(item.id);im.alt='';b.append(im,node('b',item.name),node('small',n$(item.cost)),node('small',item.description));grid.append(b);
    }
  };
  // Existing autonomous decisions can also choose the new equivalent objects.
  const beforeChoice=chooseBrainObject25;chooseBrainObject25=function(e,types,repair=false){
    const extra=repair?[]:api.items.filter(i=>types.includes(i.routine)).map(i=>i.id);return beforeChoice(e,[...types,...extra],repair);
  };
  const beforeFinish=finishAction;finishAction=function(e){
    const item=api.items.find(i=>i.id===e.brk?.type),prior=item?{...ensureBrain25(e).needs}:null;beforeFinish(e);if(!item)return;
    const a=ensureBrain25(e);if(item.energy)a.needs.energy=Math.min(100,prior.energy+item.energy);if(item.thirst)a.needs.thirst=Math.min(100,prior.thirst+item.thirst);if(item.social)a.needs.social=Math.min(100,prior.social+item.social);
    const says={tea36:'Um chá e um pouco de calma.',reading36:'Só mais uma página.',planter36:'As folhas agradeceram.',aquarium36:'Dá vontade de ficar olhando.',prototype36:'A ideia começou a tomar forma.',planning36:'Agora o próximo passo ficou claro.',focus36:'Consegui organizar as ideias.',supply36:'Cada coisa no seu lugar.'};NPCLife28.say(e,says[item.id]||'Pronto. '+item.action+'.',4);
  };
  // The street's signs are useful entry points, while furniture keeps its
  // physical footprint in the existing navigation and depth renderer.
  document.getElementById('worldCanvas28').addEventListener('pointerup',e=>{
    if(Studio28.view!=='outside'||!api.loaded)return;const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)*960/r.width,y=(e.clientY-r.top)*720/r.height,z=Studio28.zoom;
    const candidates=ExteriorScene28.navigation().props.filter(p=>p.shortcut).map(p=>{const q=Studio28.worldPoint(p.x,p.y,1),im=sprites.get(p.type);return{...p,left:q[0]-im.width*z/2,top:q[1]+3*z-im.height*z,w:im.width*z,h:im.height*z}}).filter(p=>x>=p.left&&x<=p.left+p.w&&y>=p.top&&y<=p.top+p.h).sort((a,b)=>b.x+b.y-a.x-a.y);
    const p=candidates[0];if(!p)return;e.stopImmediatePropagation();if(p.shortcut==='district')District34.open();else if(p.shortcut==='neighbors')Neighborhood33.open();else Studio28.enterFloor(0);
  },true);
})();
