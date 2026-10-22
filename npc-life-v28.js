/* V28: the same employees can take a real break outside and return to their desks. */
(() => {
  'use strict';
  const clock=()=>ensureLife25().clock;
  const active=e=>e?.life28?.phase==='outside';
  const trip=e=>e?.life28&&['toExit','outside'].includes(e.life28.phase);
  function ensure(e){
    if(!e.life28||e.life28.version!==1)e.life28={version:1,phase:'inside',lastOutdoorDay:-20,say:'',until:0};
    return e.life28;
  }
  function say(e,text,seconds=4){const s=ensure(e);s.say=text;s.until=clock()+seconds;return text}
  function reason(e){const s=ensure(e);return s.phase==='toExit'?(e.floor?'Descendo para respirar um pouco.':'Indo para a praça.'):s.phase==='outside'?'Tomando ar na praça da empresa.':s.phase==='returning'?'Voltando para sua mesa.':brainReason25(e)}
  function startOutdoor(id,manual=true){
    const e=companyStaff().find(e=>e.id===Number(id));if(!e||trip(e)||e.brk?.meetingId||e.ai?.help)return false;
    if(!manual&&(e.brk||!e.seated||employeeUrgent25(e)||e.cr||ensureBrain25(e).manualUntil>clock()))return false;
    const limit=Math.min(3,Math.max(1,Math.ceil(companyStaff().length*.06)));if(companyStaff().filter(trip).length>=limit)return false;
    const route=onFloor(e.floor??0,()=>bfs(Math.round(e.x),Math.round(e.y),0,0,e.desk));if(!route)return false;
    const used=new Set(companyStaff().filter(trip).map(o=>o.life28.spot)),preferred=Math.abs(e.id)%4,spot=[0,1,2,3].map(i=>(preferred+i)%4).find(i=>!used.has(i));
    cancelAction(e);const s=ensure(e);Object.assign(s,{phase:'toExit',elapsed:0,walking:0,lastOutdoorDay:G.day,spot:spot??preferred,manual});
    e.brk={type:'outdoor28',x:0,y:0,t:100000,elapsed:0,duration:24,manual:manual?1:0};e.path=route;e.seated=false;
    if(manual)manualPriority25(e,'Uma pausa ao ar livre, por seu comando.');setBrainReason25(e,reason(e));say(e,'Vou tomar um ar.');save();return true;
  }
  function returnInside(e,natural=true){
    const s=ensure(e);s.phase='returning';s.elapsed=0;
    if(e.brk?.type==='outdoor28')e.brk=null;e.path=null;e.x=0;e.y=0;e.seated=false;
    const a=ensureBrain25(e);a.nextDecision=clock()+25;
    if(natural){a.needs.energy=Math.min(100,a.needs.energy+24);a.needs.social=Math.min(100,a.needs.social+16);e.mood=Math.min(100,e.mood+4);brainMemory25(e,'Uma pausa na praça da sede para respirar.');say(e,'Voltei com uma ideia.');}
    setBrainReason25(e,'Voltando à mesa depois de tomar ar.');save();
  }
  let autoTimer=0;
  function update(dt){
    for(const e of companyStaff()){
      const s=ensure(e);
      if(trip(e)&&e.brk?.type!=='outdoor28'){returnInside(e,false);continue}
      if(s.phase==='toExit'){
        s.walking+=dt;
        if(s.walking>30){returnInside(e,false);continue}
        if(Math.hypot(e.x,e.y)<.08){s.phase='outside';s.elapsed=0;s.walking=0;e.path=[];e.brk.arrived=true;setBrainReason25(e,'Tomando ar na praça da empresa.');say(e,'Um pouco de ar fresco.');}
      }else if(s.phase==='outside'){
        e.seated=false;s.elapsed+=dt;e.brk.elapsed=s.elapsed;
        if(s.elapsed>7&&!s.greeted){s.greeted=true;const other=companyStaff().find(o=>o.id!==e.id&&active(o));if(other){growBond25(e,other,1);say(e,'Que bom te encontrar!');say(other,'Uma pausa faz bem.');}}
        if(s.elapsed>=24){delete s.greeted;returnInside(e);}
      }else if(s.phase==='returning'&&e.seated)s.phase='inside';
    }
    autoTimer+=dt;if(autoTimer<7)return;autoTimer=0;
    if(!OPT.characterAI||!OPT.officeRoutines)return;
    const options=companyStaff().filter(e=>!trip(e)&&e.seated&&!e.brk&&G.day-ensure(e).lastOutdoorDay>=7&&ensureBrain25(e).needs.energy<30&&!employeeUrgent25(e));
    if(options.length)startOutdoor(options.sort((a,b)=>a.ai.needs.energy-b.ai.needs.energy)[0].id,false);
  }
  const updateBase=updateActions;updateActions=function(dt){updateBase(dt);update(Math.max(0,Math.min(1,dt||0)))};
  const drawBase=v19Person;v19Person=function(e,t){if(active(e))return;drawBase(e,t)};
  const seatedBase=v19Seated;v19Seated=function(e){return !trip(e)&&seatedBase(e)};
  const outputBase=operatingBoost;operatingBoost=function(e){return trip(e)?0:outputBase(e)};
  const cancelBase=cancelAction;cancelAction=function(e){if(trip(e)){const s=ensure(e);s.phase='returning';s.elapsed=0;e.x=0;e.y=0;e.path=null;}return cancelBase(e)};
  const actionStart=startAction;startAction=function(e,spot,manual=true){const result=actionStart(e,spot,manual);if(result){const type=spot.type;say(e,['water','coffee','breakCounter','bar','barista'].includes(type)?'Hora de recarregar.':['sofa','poltrona','puff'].includes(type)?'Só uma pausa rápida.':ACT[type]?.label||'Uma nova ideia.');}return result};
  const actionFinish=finishAction;finishAction=function(e){const type=e.brk?.type;actionFinish(e);if(type)say(e,'Pronto. Vamos continuar!')};
  const deliverBase=recordDelivery25;recordDelivery25=function(c){deliverBase(c);const contributors=companyStaff().filter(e=>c.tot[e.role]);for(const e of contributors.slice(0,3))say(e,'Entregamos! ✦',5)};
  const drawExtras=drawOfficeExtras;drawOfficeExtras=function(objects,tm){
    drawExtras(objects,tm);const people=staffOnFloor().filter(e=>!active(e)&&ensure(e).say&&e.life28.until>clock()).sort((a,b)=>(b.id===G.sel?1:0)-(a.id===G.sel?1:0)).slice(0,2);
    for(const e of people)objects.push({depth:e.x+e.y+9,draw:()=>{
      const[x,y]=P(e.x+.5,e.y+.5),text=e.life28.say,g=cx;g.save();g.font='9px system-ui';const w=Math.min(140,g.measureText(text).width+16),top=y-66;g.fillStyle='#fff9eaf2';g.strokeStyle='#718d7a';g.lineWidth=.6;g.beginPath();g.roundRect(x-w/2,top,w,19,5);g.fill();g.stroke();g.fillStyle='#334e45';g.textAlign='center';g.fillText(text,x,top+12,w-9);g.restore();
    }});
  };
  const brainBase=brainReason25;brainReason25=function(e){return trip(e)||ensure(e).phase==='returning'?reason(e):brainBase(e)};
  // Reloading cancels an interrupted trip safely at the entry of the person's own floor.
  function recoverTrips(){for(const e of companyStaff()){const s=ensure(e);if(['toExit','outside','returning'].includes(s.phase)){s.phase='inside';e.brk=null;e.path=null;e.x=0;e.y=0;e.seated=false;}}}
  const initBase=init;init=function(){recoverTrips();autoTimer=0;initBase()};
  recoverTrips();
  function worldPosition(e){
    const s=ensure(e),t=Math.min(1,s.elapsed/4),spots=[[2,10],[4,10],[8,10],[10,9]],destination=spots[s.spot||0],width=[5,5.8,6,5,5.8,7][G.lvl],depth=[4,4.5,5,5,5,5.5][G.lvl],entry=[3+width*.48+.4,3+depth+.5];
    if(s.elapsed<4)return{x:entry[0]+(destination[0]-entry[0])*t,y:entry[1]+(destination[1]-entry[1])*t,moving:true,back:false};
    if(s.elapsed>20){const u=(s.elapsed-20)/4;return{x:destination[0]+(entry[0]-destination[0])*u,y:destination[1]+(entry[1]-destination[1])*u,moving:true,back:true}}
    return{x:destination[0],y:destination[1],moving:false,back:false};
  }
  window.NPCLife28={ensure,say,startOutdoor,returnInside,active,trip,reason,worldPosition,outside:()=>companyStaff().filter(active)};
})();
