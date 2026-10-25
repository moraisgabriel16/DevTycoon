/* Validate floors once per synchronous frame; commands outside a frame still validate. */
(() => {
  'use strict';
  let depth=0,stamp=null;
  const originalEnsure=ensureFloors,stats={validated:0,reused:0,replanned:0};
  function signature(){return[G,G.lvl,G.floors,companyStaff(),companyStaff().length,G.floors?.length]}
  function same(a,b){return a&&a.length===b.length&&a.every((v,i)=>v===b[i])}
  ensureFloors=function(){
    const key=depth?signature():null,count=FLOOR_COUNTS[G.lvl]||1;
    if(depth&&same(stamp,key)&&Number.isInteger(G.floor)&&G.floor>=0&&G.floor<count&&G.tiles&&G.down){stats.reused++;return}
    originalEnsure();stats.validated++;if(depth)stamp=signature();
  };
  function scope(fn){depth++;try{ensureFloors();return fn()}finally{if(--depth===0)stamp=null}}
  for(const name of ['frame','tick','updateActions','draw2','ui','save']){const previous=window[name];window[name]=function(...args){return scope(()=>previous.apply(this,args))}}
  const priorMotion=Motion31.update;
  Motion31.update=function(dt){
    for(const e of companyStaff()){
      const next=e.path?.[0];if(!next||NPCLife28.active(e))continue;
      const tiles=(e.floor??0)===(G.floor||0)?G.tiles:G.floors?.[e.floor??0]?.tiles,p=k(...next);
      if(tiles?.[p]&&p!==e.desk){e.path=null;e.rt=0;stats.replanned++}
    }
    return priorMotion(dt);
  };
  // Background time follows the same rule as offline income: calendar and deadlines freeze.
  const priorPaused=paused;paused=function(){return document.hidden||ov.style.display==='flex'||priorPaused()};
  document.addEventListener('visibilitychange',()=>{last=performance.now()});
  // Generic confirmations share the same pause and keyboard behavior as the editors.
  const priorModal=modal;let modalFocus;
  modal=function(...args){modalFocus=document.activeElement;const result=priorModal(...args);ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-labelledby',ovT.id);ov.setAttribute('aria-describedby',ovP.id);
    for(const b of ovB.querySelectorAll('button')){const click=b.onclick;b.onclick=function(...values){const result=click.apply(this,values);if(ov.style.display!=='flex'&&modalFocus?.isConnected)modalFocus.focus();return result}}ovB.querySelector('button')?.focus();return result;
  };
  ov.addEventListener('keydown',e=>{const all=[...ovB.querySelectorAll('button')].filter(b=>!b.disabled);if(e.key==='Tab'&&all.length){if(e.shiftKey&&document.activeElement===all[0]){e.preventDefault();all.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===all.at(-1)){e.preventDefault();all[0].focus()}}if(e.key==='Escape'){const cancel=all.find(b=>/cancelar|manter contrato|continuar jogando/i.test(b.textContent));if(cancel){e.preventDefault();e.stopPropagation();cancel.click()}}});
  window.Engine38={scope,stats};
})();
