/* One simulation update, one UI commit; distance-driven employee walking. */
(() => {
  'use strict';
  let depth=0,uiDirty=false,saveDirty=false,urgency=null;
  const oldUI=ui,oldSave=save,oldTick=tick,oldActions=updateActions;
  function batch(fn){
    depth++;
    try{return fn()}
    finally{if(--depth===0){const refresh=uiDirty,persist=saveDirty;uiDirty=false;saveDirty=false;if(refresh)oldUI();if(persist)oldSave()}}
  }
  ui=function(){if(depth){uiDirty=true;return}return oldUI()};
  save=function(){if(depth){saveDirty=true;return true}return oldSave()};
  tick=function(){return batch(()=>oldTick())};
  updateActions=function(dt){
    const prior=urgency;urgency={roles:new Map(),contracts:new Map()};
    try{return batch(()=>oldActions(dt))}finally{urgency=prior}
  };
  const oldUrgent=employeeUrgent25;
  employeeUrgent25=function(e){
    if(!urgency)return oldUrgent(e);
    if(urgency.roles.has(e.role))return urgency.roles.get(e.role);
    const urgent=G.act.some(c=>{
      if(!(c.need[e.role]>0))return false;if(c.dl<=3)return true;
      if(!urgency.contracts.has(c))urgency.contracts.set(c,eta(c)[0]>c.dl);
      return urgency.contracts.get(c);
    });urgency.roles.set(e.role,urgent);return urgent;
  };
  // Desk occupancy is a read, so it must not switch the global floor context.
  v19Seated=function(e){
    if(!e.desk||e.brk||NPCLife28.trip(e))return false;
    const f=e.floor??G.floor??0,tiles=f===(G.floor||0)?G.tiles:G.floors?.[f]?.tiles;
    if(!tiles||!ISD(tiles[e.desk]))return false;const[x,y]=e.desk.split(',').map(Number);return Math.hypot(e.x-x,e.y-y)<.08;
  };
  const mirrorCache=new WeakMap(),oldTint=v19Tint;
  v19Tint=function(source,e,station=false){
    const match=/^char([0-3])_([0-3])$/.exec(source);if(!match||!v23Ready)return oldTint(source,e,station);
    const dir=Number(match[1]),phase=Number(match[2]),row=dir>=2?3:phase===0?0:phase%2?1:2,base=personCanvas23(e.personalAppearance||employeeAppearance(e),row,phase);
    if(dir!==1&&dir!==3)return base;if(mirrorCache.has(base))return mirrorCache.get(base);
    const c=document.createElement('canvas');c.width=base.width;c.height=base.height;const g=c.getContext('2d');g.translate(c.width,0);g.scale(-1,1);g.drawImage(base,0,0);mirrorCache.set(base,c);return c;
  };
  const motion=new WeakMap();
  function state(e){let s=motion.get(e);if(!s){s={distance:0,moving:false};motion.set(e,s)}return s}
  function advance(e,path,budget){
    const s=state(e);s.moving=false;e.vx=e.vy=0;let guard=0;
    while(path.length&&budget>1e-8&&guard++<128){
      const target=path[0],dx=target[0]-e.x,dy=target[1]-e.y,d=Math.hypot(dx,dy);if(d<1e-7){e.x=target[0];e.y=target[1];path.shift();continue}
      const step=Math.min(d,budget);e.x+=dx/d*step;e.y+=dy/d*step;budget-=step;s.distance+=step;s.moving=true;e.vx=dx/d;e.vy=dy/d;
      if(step>=d-1e-8){e.x=target[0];e.y=target[1];path.shift()}
    }
    return s;
  }
  function update(dt){
    const budget=2.2*Math.max(0,dt)*Math.max(1,sp),now=performance.now();
    for(const e of companyStaff()){
      const s=state(e);s.moving=false;
      if(NPCLife28.active(e)){e.vx=e.vy=0;e.seated=false;continue}
      const target=e.brk?[e.brk.x,e.brk.y]:e.desk?e.desk.split(',').map(Number):[0,0];
      if(!target.every(Number.isFinite)){e.stuck=1;e.vx=e.vy=0;continue}
      const d=Math.hypot(target[0]-e.x,target[1]-e.y);e.seated=d<.05&&!!e.desk&&!e.brk;
      if(d<.0001||e.seated){e.x=target[0];e.y=target[1];e.vx=e.vy=0;continue}
      if(!e.path?.length){
        if(e.rt&&now-e.rt<500){e.vx=e.vy=0;continue}e.rt=now;
        e.path=onFloor(e.floor,()=>bfs(Math.round(e.x),Math.round(e.y),target[0],target[1],e.desk));
        if(!e.path?.length){e.stuck=1;e.vx=e.vy=0;continue}e.stuck=0;
      }
      advance(e,e.path,budget);
      if(!e.path.length){e.path=null;e.rt=0;if(!e.brk&&e.desk&&Math.hypot(target[0]-e.x,target[1]-e.y)<.05)e.seated=true}
    }
  }
  v19Person=function(e,tm){
    if(NPCLife28.active(e))return;
    if(e.brk?.arrived&&ACT[e.brk.type]){drawAction(e,tm);return}
    const s=motion.get(e),moving=!!(s?s.moving:e.path?.length&&Math.hypot(e.vx||0,e.vy||0)>.01),c=P(e.x+.5,e.y+.5);
    if(moving){const sx=(e.vx||0)-(e.vy||0),sy=(e.vx||0)+(e.vy||0);e.facing=sy<0?(sx<0?3:2):(sx<0?1:0)}
    const phase=moving&&!reducedMotion()?[1,0,2,0][Math.floor(s?s.distance/.16:tm/80)%4]:0,im=v19Tint('char'+(e.facing??0)+'_'+phase,e);if(!im)return;
    v19Select(e,c);cx.fillStyle='#0003';cx.beginPath();cx.ellipse(c[0],c[1]+8,7,3,0,0,Math.PI*2);cx.fill();cx.drawImage(im,Math.round(c[0]-im.width/2),Math.round(c[1]+8-im.height));v19Status(e,c);
  };
  window.Motion31={update,advance,state};
})();
