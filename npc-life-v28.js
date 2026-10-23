/* V28: the same employees can take a real break outside and return to their desks. */
(() => {
  'use strict';
  const clock=()=>ensureLife25().clock;
  const active=e=>e?.life28?.phase==='outside';
  const trip=e=>e?.life28&&['toExit','outside'].includes(e.life28.phase);
  const walkSpeed=1.55,restSpots=[[2,10],[4,10.5],[8,10],[10,10.5],[2,11],[6,11],[8,11],[10,11]];
  let terrainKey='',terrain=null;
  function navigation(){const n=ExteriorScene28.navigation();if(n.key!==terrainKey){terrainKey=n.key;terrain=n}return terrain}
  function walkable(x,y,n=navigation()){
    const b=n.building;if(x<.5||y<.5||x>11.5||y>11.5)return false;
    if(x>b.x-.3&&x<b.x+b.w+.3&&y>b.y-.3&&y<b.y+b.d+.3)return false;
    for(const p of n.props){const size=p.footprint||(p.type==='bench'?[.68,.43]:p.type==='planter'?[.62,.48]:p.type==='fountain'?[.95,.95]:p.type==='bike'?[.7,.45]:p.type==='table'?[1,.65]:p.type==='hedge'?[.75,.48]:p.type==='flowers'?[.7,.5]:[.4,.4]);if(Math.abs(x-p.x)<size[0]&&Math.abs(y-p.y)<size[1])return false}return true;
  }
  function outdoorRoute(destination){
    const n=navigation(),start=n.entry,key=(x,y)=>x+','+y,queue=[[start.x,start.y]],parents=new Map([[key(start.x,start.y),null]]);let at=0;
    if(!walkable(destination[0],destination[1],n)||!walkable(start.x,start.y,n))return null;
    while(at<queue.length){const[x,y]=queue[at++];if(x===destination[0]&&y===destination[1]){const route=[];let p=[x,y];while(p){route.push(p);p=parents.get(key(...p))}return route.reverse()}
      for(const[dx,dy]of [[0,.5],[.5,0],[0,-.5],[-.5,0]]){const a=x+dx,b=y+dy,k=key(a,b);if(!parents.has(k)&&walkable(a,b,n)){parents.set(k,[a-dx,b-dy]);queue.push([a,b])}}
    }return null;
  }
  function planTrip(e){
    const used=companyStaff().filter(o=>o.id!==e.id&&trip(o)).map(o=>o.life28.route?.at(-1)).filter(Boolean),custom=[];
    for(const p of navigation().props.filter(p=>p.rest))for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const spot=[p.x+dx,p.y+dy];if(walkable(...spot)&&outdoorRoute(spot)){custom.push(spot);break}}
    const spots=custom.length?custom.concat(restSpots):restSpots,first=Math.abs(e.id)%spots.length;
    for(let i=0;i<spots.length;i++){const spot=spots[(first+i)%spots.length];if(used.some(p=>Math.hypot(p[0]-spot[0],p[1]-spot[1])<.8))continue;const route=outdoorRoute(spot);if(route)return route}return null;
  }
  function routeLength(route){let length=0;for(let i=1;i<route.length;i++)length+=Math.hypot(route[i][0]-route[i-1][0],route[i][1]-route[i-1][1]);return length}
  function ensure(e){
    if(!e.life28||e.life28.version!==1)e.life28={version:1,phase:'inside',lastOutdoorDay:-20,say:'',until:0};
    return e.life28;
  }
  function say(e,text,seconds=4){const s=ensure(e);s.say=text;s.until=clock()+seconds;return text}
  function reason(e){const s=ensure(e);return s.phase==='toExit'?(e.floor?'Descendo para respirar um pouco.':'Indo para a praça.'):s.phase==='outside'?(s.returnStarted!=null?'Voltando para atender seu pedido.':'Tomando ar na praça da empresa.'):s.phase==='returning'?'Voltando para sua mesa.':brainReason25(e)}
  function startOutdoor(id,manual=true){
    const e=companyStaff().find(e=>e.id===Number(id));if(!e||trip(e)||e.brk?.meetingId||e.ai?.help)return false;
    if(!manual&&(e.brk||!e.seated||employeeUrgent25(e)||e.cr||ensureBrain25(e).manualUntil>clock()))return false;
    const limit=Math.min(3,Math.max(1,Math.ceil(companyStaff().length*.06)));if(companyStaff().filter(trip).length>=limit)return false;
    const route=onFloor(e.floor??0,()=>bfs(Math.round(e.x),Math.round(e.y),0,0,e.desk));if(!route)return false;
    const outsideRoute=planTrip(e);if(!outsideRoute)return false;const length=routeLength(outsideRoute);
    cancelAction(e);const s=ensure(e);delete s.returnStarted;delete s.returnFrom;delete s.pendingOrder;Object.assign(s,{phase:'toExit',elapsed:0,walking:0,lastOutdoorDay:G.day,route:outsideRoute,routeLength:length,tripDuration:Math.max(24,2*length/walkSpeed+12),manual});
    e.brk={type:'outdoor28',x:0,y:0,t:100000,elapsed:0,duration:24,manual:manual?1:0};e.path=route;e.seated=false;
    if(manual)manualPriority25(e,'Uma pausa ao ar livre, por seu comando.');setBrainReason25(e,reason(e));say(e,'Vou tomar um ar.');save();return true;
  }
  function returnInside(e,natural=true){
    const s=ensure(e),order=s.pendingOrder;s.phase='returning';s.elapsed=0;delete s.pendingOrder;delete s.returnStarted;delete s.returnFrom;
    if(e.brk?.type==='outdoor28')e.brk=null;e.path=null;e.x=0;e.y=0;e.seated=false;
    const a=ensureBrain25(e);a.nextDecision=clock()+25;
    if(natural){const benefits=ExteriorScene28.outdoorBenefits?.(s.route?.at(-1))||{};a.needs.energy=Math.min(100,a.needs.energy+24+(benefits.energy||0));a.needs.thirst=Math.min(100,a.needs.thirst+(benefits.thirst||0));a.needs.social=Math.min(100,a.needs.social+16);e.mood=Math.min(100,e.mood+4);brainMemory25(e,'Uma pausa na praça da sede para respirar.');say(e,'Voltei com uma ideia.');}
    setBrainReason25(e,'Voltando à mesa depois de tomar ar.');
    if(order){s.phase='inside';onFloor(e.floor??0,()=>lifeCommand25(e.id,order));if(G.sel===e.id&&window.Studio28){Studio28.selectEmployee(e.id);Studio28.setView('inside')}}save();
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
        if(s.elapsed>=(s.tripDuration||24)){delete s.greeted;returnInside(e,s.returnStarted==null);}
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
  const cancelBase=cancelAction;cancelAction=function(e){if(trip(e)){const s=ensure(e);if(active(e)){delete s.pendingOrder;returnInside(e,false)}else{s.phase='inside';s.elapsed=0;}e.path=null;}return cancelBase(e)};
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
    const s=ensure(e),route=s.route;if(!route?.length)return{...navigation().entry,moving:false,back:false,flip:false,distance:0,progress:0};
    const length=s.routeLength||routeLength(route),walkTime=length/walkSpeed,returnAt=(s.tripDuration||24)-walkTime;
    const returning=s.returnStarted!=null||s.elapsed>returnAt,progress=s.returnStarted!=null?Math.max(0,s.returnFrom-(s.elapsed-s.returnStarted)*walkSpeed):returning?Math.max(0,length-(s.elapsed-returnAt)*walkSpeed):Math.min(length,s.elapsed*walkSpeed);
    const moving=s.returnStarted!=null||s.elapsed<walkTime||s.elapsed>returnAt;let left=progress;
    for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],d=Math.hypot(b[0]-a[0],b[1]-a[1]);if(left<=d||i===route.length-1){const t=d?Math.min(1,left/d):0,dx=(b[0]-a[0])*(returning?-1:1),dy=(b[1]-a[1])*(returning?-1:1);return{x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t,moving,back:moving&&dx+dy<0,flip:moving&&dx-dy<0,distance:returning?length+(s.returnFrom??length)-progress:progress,progress}}left-=d}
    return{x:route.at(-1)[0],y:route.at(-1)[1],moving:false,back:false,flip:false,distance:length,progress:length};
  }
  function requestReturn(id,order){const e=companyStaff().find(e=>e.id===Number(id));if(!active(e))return false;const s=ensure(e),p=worldPosition(e);s.returnStarted=s.elapsed;s.returnFrom=p.progress;s.tripDuration=s.elapsed+p.progress/walkSpeed;s.pendingOrder=order;say(e,'Já estou voltando.');return true}
  const commandBase=lifeCommand25;lifeCommand25=function(id,kind){if(requestReturn(id,kind))return true;return commandBase(id,kind)};
  const orderBase=devOrder;devOrder=function(kind){if(requestReturn(G.sel,kind))return true;return orderBase(kind)};
  window.NPCLife28={ensure,say,startOutdoor,returnInside,requestReturn,active,trip,reason,worldPosition,walkable,outdoorRoute,outside:()=>companyStaff().filter(active)};
})();
