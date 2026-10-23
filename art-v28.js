/* Pixel art direction: native character sprites and coherent interaction poses. */
(() => {
  'use strict';
  const poses=new Map();
  let installed=false;
  function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
  // Animate the actual character rather than compositing a new head over a
  // legacy action body. The face, hair, clothes and silhouette stay together.
  function actionSprite(a,pose,phase=0){
    const frame=((Math.floor(phase)%6)+6)%6,step=[0,1,2,2,1,0][frame],key=JSON.stringify([a,pose,frame]);if(poses.has(key))return poses.get(key);
    const source=personCanvas23(a,pose==='sweepBack'?3:pose==='run'?1+frame%2:0,step),c=canvas(32,42),g=c.getContext('2d');g.imageSmoothingEnabled=false;
    if(pose==='sit'||pose==='sitRead'){
      g.drawImage(source,0,0,32,29,0,4,32,29);
      g.drawImage(source,0,29,32,12,1,32,30,8);
      g.fillStyle=AVATAR_SKIN[a.skin??1];g.fillRect(23,31-step,3,2);
      if(pose==='sitRead'){poly(g,[[14,29],[20,30],[27,28],[27,34],[20,36],[14,34]],'#eddfbd','#8c7858');g.strokeStyle='#b5a079';g.lineWidth=1;g.beginPath();g.moveTo(20,30);g.lineTo(20,35);g.stroke()}
    }else{
      g.drawImage(source,0,0);
      const skin=AVATAR_SKIN[a.skin??1],shirt=a.shirt||'#389fa8';
      if(['drink','read','work','play','water','paint','sweep','sweepBack'].includes(pose)){
        // Keep the shoulder attached; only the forearm rotates toward the prop.
        g.clearRect(23,26,5,7);g.strokeStyle=shirt;g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(23,24);g.lineTo(24,pose==='drink'?27-step:28-step);g.stroke();
        g.strokeStyle=skin;g.lineWidth=3;g.beginPath();g.moveTo(24,pose==='drink'?27-step:28-step);g.lineTo(pose==='drink'?24:27,pose==='drink'?27-step*3:26-step);g.stroke();
      }
      if(pose==='drink'){
        const y=25-step*3;g.fillStyle='#faf1db';g.fillRect(22,y,5,5);g.strokeStyle='#a79d86';g.lineWidth=1;g.strokeRect(26,y+1,2,2);g.fillStyle='#87644a';g.fillRect(23,y,3,1);
      }else if(pose==='read'){
        poly(g,[[15,25],[21,26],[27,24],[27,31],[21,33],[15,31]],'#eddfbd','#8c7858');g.strokeStyle='#b5a079';g.beginPath();g.moveTo(21,26);g.lineTo(21,32);g.stroke();
        if(frame===2||frame===3)poly(g,[[21,26],[23+step,24],[24+step,30],[21,32]],'#fff3d5','#b5a079');
      }else if(pose==='work'){
        g.strokeStyle='#c9cfd0';g.lineWidth=1;g.beginPath();g.moveTo(27,26-step);g.lineTo(29,22-step);g.stroke();g.fillStyle='#d9e3de';g.fillRect(28,21-step,3,2);
      }else if(pose==='play'){
        g.fillStyle='#af6650';g.beginPath();g.ellipse(28,24-step,3,4,.3,0,Math.PI*2);g.fill();
      }else if(pose==='water'){
        g.fillStyle='#6c9990';g.fillRect(23,26-step,7,5);g.fillStyle='#d6d7b0';g.fillRect(29,25-step,3,2);g.strokeStyle='#476b65';g.lineWidth=1;g.strokeRect(23,23-step,4,4);
      }else if(pose==='paint'){
        g.strokeStyle='#b88b53';g.lineWidth=1;g.beginPath();g.moveTo(26,27-step);g.lineTo(29,21-step);g.stroke();g.fillStyle=a.shirt||'#608d91';g.fillRect(28,Math.max(18,19-step),2,3);
      }else if(pose==='sweep'||pose==='sweepBack'){
        g.strokeStyle='#a17c50';g.lineWidth=2;g.beginPath();g.moveTo(25,23);g.lineTo(27-step*2,38);g.stroke();g.fillStyle='#c5aa71';g.fillRect(24-step*2,37,7,4);g.fillStyle='#857354';g.fillRect(24-step*2,37,7,1);
      }
    }
    poses.set(key,c);return c;
  }
  const legacyTint=v19Tint;v19Tint=function(source,e,station=false){
    const match=/^act_[fm]_(\w+?)([01])$/.exec(source);
    if(v23Ready&&match)return actionSprite(e.personalAppearance||employeeAppearance(e),match[1],Number(match[2]));
    return legacyTint(source,e,station);
  };
  // Cleaners use their whole native body too, rather than a scaled head pasted
  // onto a different body. Feet and broom stay on the same ground anchor.
  const legacyWorker=workerSprite23;workerSprite23=function(e,frame=0){
    if(!v23Ready)return legacyWorker(e,frame);ensureLook(e);
    const a=employeeAppearance({...e,role:'infra'});
    if(e.work>0)return actionSprite(a,e.back?'sweepBack':'sweep',reducedMotion()?0:Math.floor(e.work*5)%6);
    const phase=e.path?.length&&!reducedMotion()?[1,0,2,0][Math.floor(Motion31.state(e).distance/.16)%4]:0;
    return personCanvas23(a,e.back?3:phase,phase);
  };
  const legacyAction=drawAction;drawAction=function(e,tm,atObject=false){
    if(!v23Ready)return legacyAction(e,tm,atObject);
    const a=e.brk,s=ACT[a?.type];if(!s||!a.p)return;
    const obj=P(...a.p.split(',').map(v=>Number(v)+.5)),c=atObject?obj:P(e.x+.5,e.y+.5),phase=reducedMotion()?0:Math.floor((a.elapsed||0)*5)%6;
    const pose=atObject&&s.seated?(s.pose==='read'?'sitRead':'sit'):s.pose;
    const im=actionSprite(e.personalAppearance||employeeAppearance(e),pose,phase),flip=!atObject&&obj[0]<c[0],baseline=c[1]+(atObject&&s.seated?-1:8);
    v19Select(e,c);if(!atObject){cx.fillStyle='#0003';cx.beginPath();cx.ellipse(c[0],c[1]+8,7,3,0,0,Math.PI*2);cx.fill()}
    cx.save();cx.translate(Math.round(c[0]),Math.round(baseline));if(flip)cx.scale(-1,1);cx.drawImage(im,-16,-42);cx.restore();
    // Status and progress sit above the same head, never over the face.
    const status=[c[0],baseline-10];v19Status(e,status);const y=baseline-46;
    cx.fillStyle='#29443d';cx.fillRect(c[0]-10,y,20,3);cx.fillStyle='#8ed7d0';cx.fillRect(c[0]-10,y,20*Math.max(0,Math.min(1,(a.elapsed||0)/a.duration)),3);
  };
  function install(){
    if(!v23Ready||!v19Ready||!v21Ready||!AR)return;
    for(let theme=0;theme<6;theme++)for(let index=0;index<6;index++){
      const c=canvas(index<2?64:32,index<2?32:48),g=c.getContext('2d'),[floor,wall,trim]=palette[theme];
      if(index<2){poly(g,[[32,0],[64,16],[32,32],[0,16]],floor,'#9a9e8b45');if([1,4,5].includes(theme)){g.strokeStyle='#97846740';g.beginPath();g.moveTo(16,8);g.lineTo(48,24);g.stroke()}}
      else{const left=index%2===1;wallFace(g,left?[0,48]:[0,32],left?[32,32]:[32,48],32,theme,left,1,index>3?[.13]:[],.74)}
      V19['theme'+theme+'_'+index]=c;V21['theme'+theme+'_'+index]=c;
    }
    installed=true;S.serverX=S.server;peopleCache.clear();V19Tint.clear();poses.clear();personalFloorKey='';room23FloorKey='';for(const key of Object.keys(QC))delete QC[key];renderTools();ui();
  }
  const ready=new Promise(resolve=>{const attempt=()=>{if(!v23Ready||!v19Ready||!v21Ready||!AR)return setTimeout(attempt,60);install();resolve(true)};setTimeout(attempt,0)});
  const previousInstall=installV19;installV19=function(){previousInstall();install()};
  const palette=[['#d7d4c9','#efe7d7','#a66e55'],['#c5b39a','#f0e9d8','#b5aa95'],['#bcced1','#dce9e7','#638391'],['#d8ded4','#eef0e5','#9da99c'],['#cbb99b','#ebe5d5','#8b856e'],['#b9b9af','#dadbd2','#747b76']];
  let floorCanvas=null,floorKey='';
  function poly(g,points,color,stroke){g.beginPath();points.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();g.fillStyle=color;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=.65;g.stroke()}}
  function wallFace(g,a,b,height,theme,left,length,windows=[],windowWidth=1.35){
    const [,wall,trim]=palette[theme]||palette[0],p=(u,h)=>[a[0]+(b[0]-a[0])*u/length,a[1]+(b[1]-a[1])*u/length-h];
    const strip=(low,high,color)=>poly(g,[p(0,low),p(length,low),p(length,high),p(0,high)],color);
    g.save();const shade=g.createLinearGradient(0,Math.min(a[1],b[1])-height,0,Math.max(a[1],b[1]));shade.addColorStop(0,wall);shade.addColorStop(1,left?'#d7d1bf':'#c4c7bb');strip(0,height,shade);
    strip(0,1,'#667c6866');strip(1,5,trim);strip(5,6,'#fff7df66');strip(height-3,height,trim);strip(height-3,height-2,'#fff2dc99');
    for(let u=4;u<length;u+=4){g.strokeStyle='#89917e30';g.lineWidth=.6;g.beginPath();g.moveTo(...p(u,6));g.lineTo(...p(u,height-3));g.stroke()}
    for(const start of windows){
      const end=Math.min(length-.08,start+windowWidth),lo=10,hi=height-7;if(hi<=lo||end<=start)continue;
      const pane=(s,t,h0,h1,color,stroke)=>poly(g,[p(s,h0),p(t,h0),p(t,h1),p(s,h1)],color,stroke);
      pane(start-.04,end+.04,lo-2,hi+2,'#758b83');pane(start,end,lo,hi,'#a9cdca');
      pane(start+.04,end-.04,lo+1,lo+(hi-lo)*.48,'#c6dfd6');
      poly(g,[p(start+.08,hi-1),p(start+.35,hi-1),p(Math.min(end-.05,start+.75),lo+1),p(start+.4,lo+1)],'#f8f5d661');
      const mid=(start+end)/2;pane(mid-.015,mid+.015,lo,hi,'#f6ebce');pane(start,end,lo-1,lo+1,'#f4e6c8');pane(start-.08,end+.08,lo-3,lo-2,'#ae9b7a');
    }
    g.restore();
  }
  function walls(g,project,n,theme,roof=false,height=40){
    const windows=[];if(!roof)for(let i=1.6;i+1.35<n-.15;i+=4)windows.push(i);
    wallFace(g,project(0,n),project(0,0),roof?13:height,theme,true,n,windows);
    wallFace(g,project(0,0),project(n,0),roof?13:height,theme,false,n,windows);
    // A solid corner post covers the shared edge, including fractional zooms.
    const p=project(0,0),h=roof?13:height;poly(g,[[p[0]-1.2,p[1]],[p[0]+1.2,p[1]],[p[0]+1.2,p[1]-h],[p[0]-1.2,p[1]-h]],palette[theme]?.[2]||palette[0][2]);
  }
  v19Static=function(){
    const theme=v19Theme(),n=nU(),roof=isRoof()&&G.sk<0,key=[theme,n,roof,G.lvl,G.floor,floorIdentity().color].join('|');if(key===floorKey&&floorCanvas)return floorCanvas;
    const c=canvas(900,600),g=c.getContext('2d'),[floor,wall,trim]=palette[theme]||palette[0];
    const center=P(n/2,n/2);g.fillStyle='#243c3b18';g.beginPath();g.ellipse(center[0],center[1]+5,n*31,n*15,0,0,Math.PI*2);g.fill();
    const a=P(n,0),b=P(n,n),d=P(0,n);poly(g,[a,b,[b[0],b[1]+8],[a[0],a[1]+8]],'#8a9e97');poly(g,[d,b,[b[0],b[1]+8],[d[0],d[1]+8]],'#adbaab');
    for(let y=0;y<n;y++)for(let x=0;x<n;x++){
      const p=P(x,y),f=roof?((x+y)%2?'#b6cbb3':'#c5d1bb'):floor;
      poly(g,[p,P(x+1,y),P(x+1,y+1),P(x,y+1)],f,roof?'#99b29d':'#9a9e8b40');
      if(!roof&&[1,4,5].includes(theme)){const q=P(x+.5,y);g.strokeStyle='#8c806530';g.lineWidth=.5;g.beginPath();g.moveTo(...q);g.lineTo(...P(x+.5,y+1));g.stroke()}
      if(!roof&&(x*11+y*7)%9===0){const q=P(x+.3,y+.5);g.fillStyle='#fff2da18';g.fillRect(q[0],q[1],5,1)}
    }
    if(!roof&&G.lvl>0){g.save();g.globalAlpha=.08;const color=floorIdentity().color;poly(g,[P(1,1),P(Math.min(6,n-1),1),P(Math.min(6,n-1),5),P(1,5)],color);g.restore();}
    walls(g,P,n,theme,roof);
    floorKey=key;floorCanvas=c;return c;
  };
  let roomKey='',roomFloor=null;
  personalFloor=function(){
    const r=ensurePersonalRoom(),n=personalSize(),key=[n,r.floorTheme,r.wallTheme,r.accent,r.sign].join('|');if(key===roomKey&&roomFloor)return roomFloor;
    const c=canvas(900,620),g=c.getContext('2d');for(let y=0;y<n;y++)for(let x=0;x<n;x++)poly(g,[personalP(x,y),personalP(x+1,y),personalP(x+1,y+1),personalP(x,y+1)],palette[r.floorTheme]?.[0]||palette[0][0],'#9a9e8b40');
    walls(g,personalP,n,r.wallTheme,false,40);
    const p=personalP(0,2);g.save();g.translate(p[0]+3,p[1]-28);g.transform(1,-.5,0,1,0,0);g.fillStyle='#334e45';g.fillRect(0,0,80,16);g.strokeStyle=r.accent;g.strokeRect(0,0,80,16);g.fillStyle=r.accent;g.font='6px sans-serif';g.textAlign='center';g.fillText(r.sign,40,10,74);g.restore();roomKey=key;roomFloor=c;return c;
  };
  bgd=function(){cx.fillStyle='#c8c5b5';cx.fillRect(0,0,900,600)};
  window.Art28={ready,get loaded(){return installed},sprite:(a,row=0,phase=0)=>personCanvas23(a,row,phase),action:actionSprite,walls,style:'pixel',invalidate(){floorKey='';roomKey='';peopleCache.clear();poses.clear()}};
})();
