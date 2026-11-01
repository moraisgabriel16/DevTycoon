/* No save migration: phone layout, navigation and panel focus are view state. */
(() => {
 'use strict';
 const phone=matchMedia('(max-width:899px), (max-width:1000px) and (max-height:500px)'),$=id=>document.getElementById(id);
 const backdrop=document.createElement('button');backdrop.id='mobileBackdrop41';backdrop.hidden=true;backdrop.type='button';backdrop.tabIndex=-1;backdrop.setAttribute('aria-label','Fechar painel e voltar ao escritório');backdrop.onclick=()=>shClose();document.body.append(backdrop);
 const close=$('sheet').querySelector('.grab button');close.setAttribute('aria-label','Fechar painel');
 let wasOpen=false,previousFocus=null,lastTab41=null;
 const scrolls=new Map();let expanded=false;
 // Placement is an explicit interaction, independent of whether the catalog is open.
 let placement=null;
 const placementBar=document.createElement('section');placementBar.id='placementBar41';placementBar.hidden=true;placementBar.setAttribute('aria-label','Colocar móvel no escritório');
 placementBar.innerHTML='<div class="placement-head41"><b id="placementName41"></b><button type="button" id="placementChoose41">Trocar móvel</button></div><p id="placementStatus41" role="status" aria-live="polite"></p><div class="placement-actions41"><button type="button" id="placementCancel41">Concluir</button><button type="button" id="placementConfirm41" disabled>Colocar</button></div>';
 document.body.append(placementBar);
 function placementCheck(){
   if(!placement||placement.company!==G||placement.floor!==G.floor||Studio28.view!=='inside')return{ok:false,text:'Volte ao andar onde escolheu o móvel.'};
   if(!placement.cell)return{ok:false,text:placement.tool==='del'?'Toque no móvel que deseja remover.':'Toque numa casa livre para ver a prévia.'};
   const [x,y]=placement.cell,p=k(x,y);
   if(x<0||y<0||x>=nU()||y>=nU()||p==='0,0')return{ok:false,text:'Escolha uma casa dentro do escritório e mantenha a entrada livre.'};
   if(placement.tool==='del'){const t=G.tiles[p];return t?{ok:true,p,type:t,refund:TL[t].c/2,text:'Remover '+TL[t].n+' devolve '+n$(TL[t].c/2)+'.'}:{ok:false,text:'Não há um móvel nesta casa.'}}
   if(G.tiles[p])return{ok:false,text:'Esta casa já tem um móvel. Escolha outra.'};
   const item=TL[placement.tool];if(!item)return{ok:false,text:'Escolha um móvel no catálogo.'};
   if(G.money<item.c)return{ok:false,text:'Falta caixa. Este móvel custa '+n$(item.c)+'.'};
   if(!canPlace(p,placement.tool))return{ok:false,text:'Este lugar bloquearia o acesso às mesas. Deixe um corredor livre.'};
   return{ok:true,p,cost:item.c,text:'Prévia na casa '+(x+1)+', '+(y+1)+'. Confirme para colocar.'};
 }
 function renderPlacement(){
   const active=!!placement;placementBar.hidden=!active;document.body.classList.toggle('placing41',active);if(!active)return;
   const check=placementCheck();$('placementName41').textContent=placement.tool==='del'?'Remover móvel':TL[placement.tool].n+' · '+n$(TL[placement.tool].c);
   $('placementStatus41').textContent=check.text;placementBar.classList.toggle('invalid41',!!placement.cell&&!check.ok);
   const confirm=$('placementConfirm41');confirm.disabled=!check.ok;confirm.textContent=placement.tool==='del'?'Remover'+(check.ok?' · +'+n$(check.refund):''):'Colocar'+(check.ok?' · '+n$(check.cost):'');
 }
 function cancelPlacement(){placement=null;hov=null;mapMode='interact';renderPlacement()}
 function beginPlacement(t){
   if(!(TL[t]||t==='del'))return;
   if(Studio28.view!=='inside')Studio28.setView('inside',false);
   closeObject();G.sel=null;epanel();moveFrom=null;mapMode='build';CAM.mv=0;
   placement={company:G,floor:G.floor,tool:t,cell:null};renderPlacement();
 }
 $('placementCancel41').onclick=()=>{cancelPlacement();renderTools();ui()};
 $('placementChoose41').onclick=()=>{cancelPlacement();tabOpen('bd')};
 $('placementConfirm41').onclick=()=>{
   const check=placementCheck();if(!check.ok){renderPlacement();return}
   if(placement.tool==='del')removeObject(check.p);
   else{const t=placement.tool;G.money-=check.cost;G.tiles[check.p]=t;G.bn=(G.bn||0)+1;for(const e of staffOnFloor()){e.path=null;assign(e)}beep(440,.06);save();ui()}
   if(placement){placement.cell=null;hov=null;renderPlacement();$('placementStatus41').textContent='Pronto! Escolha outra casa ou toque em Concluir.'}
 };
 const beforeBuild=buildActive;buildActive=function(){return !!placement&&phone.matches&&mapMode==='build'&&tab==='bd'||beforeBuild()};
 cv.addEventListener('click',event=>{
   if(!placement)return;event.preventDefault();event.stopImmediatePropagation();
   if(CAM.mv){CAM.mv=0;return}
   if(placement.company!==G||placement.floor!==G.floor){cancelPlacement();return}
   const point=placement.tool==='del'?hitObject(event):null;
   placement.cell=point?point.split(',').map(Number):pos(event);hov=placement.cell;renderPlacement();
 },true);
 const beforeDraw=draw2;draw2=function(...args){if(placement?.cell)hov=placement.cell;return beforeDraw.apply(this,args)};
 document.addEventListener('click',e=>{if(placement&&e.target.closest('#dock,.game-header28,.scene-tabs28,#floorBar,#storyEntry35,#cleaningEntry32'))cancelPlacement()},true);
 function coach(){const c=$('storyCoach35');if(!c||c.dataset.onboarding!=='true')return;c.classList.toggle('expanded41',expanded);const actions=c.querySelector('.story-actions35');if(!actions)return;let button=actions.querySelector('.coach-expand41');if(!button){button=document.createElement('button');button.type='button';button.className='coach-expand41';button.onclick=()=>{expanded=!expanded;coach()};actions.append(button)}button.textContent=expanded?'Menos detalhes':'Como funciona';button.setAttribute('aria-expanded',String(expanded));}
 function utilities(){if(tab!=='ut')return;const grid=$('pn').querySelector('.utilities28');if(!grid||grid.querySelector('[data-shop41]'))return;const b=document.createElement('button');b.type='button';b.dataset.shop41='';b.textContent='Loja de melhorias';b.onclick=()=>tabOpen('sh');grid.prepend(b);const guide=document.createElement('button');guide.type='button';guide.textContent='História e ajuda';guide.onclick=()=>{shClose();Story35.open('guide')};grid.append(guide);}
 function sync(){
   const mobile=phone.matches,open=mobile&&shOpen;
   if(placement&&(!mobile||placement.company!==G||placement.floor!==G.floor||shOpen||Studio28.view!=='inside'||ts.style.display==='flex'||!personalView.hidden||!document.getElementById('exteriorView').hidden))cancelPlacement();
   if(placement)renderPlacement();
   backdrop.hidden=!open;$('mainc').inert=open;
   $('sheet').inert=mobile&&!open;
   $('sheet').setAttribute('aria-label',TT[tab]||'Painel da empresa');
   if(mobile)$('sheet').setAttribute('role','region');else $('sheet').removeAttribute('role');
   if(open&&!wasOpen){previousFocus=document.activeElement;close.focus({preventScroll:true})}
   if(!open&&wasOpen&&previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
   if(open&&lastTab41!==tab){$('sheet').scrollTop=scrolls.get(tab)||0;lastTab41=tab}
   wasOpen=open;coach();utilities();
 }
 $('sheet').addEventListener('scroll',()=>{if(phone.matches&&shOpen)scrolls.set(tab,$('sheet').scrollTop)},{passive:true});
 const before=sheetUp;sheetUp=function(...args){const r=before.apply(this,args);sync();return r};
 const beforeUI=ui;ui=function(...args){const r=beforeUI.apply(this,args);sync();return r};
 const beforePick=pk;pk=function(...args){const choosing=phone.matches&&shOpen&&tab==='bd';const result=beforePick.apply(this,args);if(choosing){shClose();beginPlacement(args[0])}return result};
 document.addEventListener('keydown',e=>{if(phone.matches&&shOpen&&e.key==='Escape'&&!e.defaultPrevented){e.preventDefault();shClose()}},true);
 document.addEventListener('keydown',e=>{if(placement&&e.key==='Escape'){e.preventDefault();cancelPlacement();renderTools()}},true);
 phone.addEventListener('change',sync);
 window.Mobile41={sync,get active(){return phone.matches}};
 sync();
})();
