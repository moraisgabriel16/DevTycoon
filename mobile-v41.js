/* No save migration: phone layout, navigation and panel focus are view state. */
(() => {
 'use strict';
 const phone=matchMedia('(max-width:899px), (max-width:1000px) and (max-height:500px)'),$=id=>document.getElementById(id);
 const backdrop=document.createElement('button');backdrop.id='mobileBackdrop41';backdrop.hidden=true;backdrop.type='button';backdrop.tabIndex=-1;backdrop.setAttribute('aria-label','Fechar painel e voltar ao escritório');backdrop.onclick=()=>shClose();document.body.append(backdrop);
 const close=$('sheet').querySelector('.grab button');close.setAttribute('aria-label','Fechar painel');
 let wasOpen=false,previousFocus=null,lastTab41=null;
 const scrolls=new Map();let expanded=false;
 function coach(){const c=$('storyCoach35');if(!c||c.dataset.onboarding!=='true')return;c.classList.toggle('expanded41',expanded);const actions=c.querySelector('.story-actions35');if(!actions)return;let button=actions.querySelector('.coach-expand41');if(!button){button=document.createElement('button');button.type='button';button.className='coach-expand41';button.onclick=()=>{expanded=!expanded;coach()};actions.append(button)}button.textContent=expanded?'Menos detalhes':'Como funciona';button.setAttribute('aria-expanded',String(expanded));}
 function utilities(){if(tab!=='ut')return;const grid=$('pn').querySelector('.utilities28');if(!grid||grid.querySelector('[data-shop41]'))return;const b=document.createElement('button');b.type='button';b.dataset.shop41='';b.textContent='Loja de melhorias';b.onclick=()=>tabOpen('sh');grid.prepend(b);const guide=document.createElement('button');guide.type='button';guide.textContent='História e ajuda';guide.onclick=()=>{shClose();Story35.open('guide')};grid.append(guide);}
 function sync(){
   const mobile=phone.matches,open=mobile&&shOpen;
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
 const beforePick=pk;pk=function(...args){const result=beforePick.apply(this,args);if(phone.matches&&shOpen&&tab==='bd')shClose();return result};
 document.addEventListener('keydown',e=>{if(phone.matches&&shOpen&&e.key==='Escape'&&!e.defaultPrevented){e.preventDefault();shClose()}},true);
 phone.addEventListener('change',sync);
 window.Mobile41={sync,get active(){return phone.matches}};
 sync();
})();
