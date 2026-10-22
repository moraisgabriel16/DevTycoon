/* V27: validate actions at execution time and persist changes made while paused. */
(() => {
  'use strict';
  const indexIn=(i,list)=>Number.isInteger(i)&&i>=0&&i<list.length;
  let pendingSave=0;
  function cancelPending(){clearTimeout(pendingSave);pendingSave=0}
  function scheduleSave(){
    if(floorSimulation)return;
    cancelPending();
    const campaign=G,slot=ensureSlots().active;
    pendingSave=setTimeout(()=>{
      pendingSave=0;
      // A callback from the previous company must never save into the new slot.
      if(G!==campaign||ensureSlots().active!==slot||floorSimulation)return;
      save();
    },300);
  }
  const saveBase=save;
  save=function(){cancelPending();return saveBase()};
  const uiBase=ui;
  ui=function(){if(floorSimulation)return;const result=uiBase();scheduleSave();return result};
  const initBase=init;
  init=function(){cancelPending();return initBase()};
  addEventListener('pagehide',()=>{cancelPending();if(!floorSimulation)save()});

  // The old implementation pushed undefined when the offer had already gone.
  accept=function(id){
    const offer=G.off.find(o=>o&&o.id===id);
    if(!offer||!(offer.exp>0)||G.act.some(c=>c&&c.id===id))return false;
    const limit=G.up.pmo?5:3;
    if(G.act.length>=limit){log('Máx. '+limit+' contratos ativos.');ui();return false}
    G.off=G.off.filter(o=>o!==offer);G.act.push(offer);beep(660);ui();return true;
  };
  const hireBase=hire;
  hire=function(i){
    if(!indexIn(i,G.cands))return false;
    const candidate=G.cands[i];
    if(!candidate||!RO[candidate.role]||!Number.isFinite(candidate.cost)||candidate.cost<0||G.money<candidate.cost||companyStaff().some(e=>e.id===candidate.id))return false;
    hireBase(i);
    return companyStaff().some(e=>e.id===candidate.id);
  };
  const fireBase=fire;
  fire=function(i){if(!indexIn(i,G.emps))return false;fireBase(i);return true};
  const buyBase=buy;
  buy=function(key){if(!Object.hasOwn(UP,key)||G.up[key]||G.money<UP[key].c)return false;buyBase(key);return !!G.up[key]};
  const buyBranchBase=buyBr;
  buyBr=function(i){
    if(!indexIn(i,BR)||!BRP[i])return false;
    const owned=G.br||[];
    if(owned.includes(i)||(i>0&&!owned.includes(i-1))||G.rep<BRP[i][2]||G.money<BR[i][1])return false;
    buyBranchBase(i);return (G.br||[]).includes(i);
  };
  const branchUpBase=brUp,branchManagerBase=brMgr;
  brUp=function(i){if(!indexIn(i,BR)||!(G.br||[]).includes(i))return false;const before=brx(i).lv;branchUpBase(i);return brx(i).lv>before};
  brMgr=function(i){if(!indexIn(i,BR)||!(G.br||[]).includes(i))return false;const before=!!brx(i).mgr;branchManagerBase(i);return !before&&!!brx(i).mgr};
  const questBase=claimQ;
  claimQ=function(i){
    if(!G.q||!Array.isArray(G.q.l)||!indexIn(i,G.q.l)||G.day>=G.q.exp)return false;
    const q=G.q.l[i];if(q.done||QP(q)<q.n)return false;
    questBase(i);return !!q.done;
  };
  const negotiateBase=ng;
  ng=function(id,mode){
    const offer=G.off.find(o=>o&&o.id===id);
    if(!offer||offer.ng||!(offer.exp>0)||![0,1].includes(mode))return false;
    negotiateBase(id,mode);scheduleSave();return true;
  };
  const negotiationDialogBase=nego;
  nego=function(id){const offer=G.off.find(o=>o&&o.id===id);if(!offer||offer.ng||!(offer.exp>0))return false;negotiationDialogBase(id);return true};

  // Appearance is a player preference, so retain it through a prestige reset.
  const ipoBase=ipo2;
  ipo2=function(kind){
    if(!['rev','prod','cash'].includes(kind))return false;
    const exterior=G.exteriors?cloneSave(G.exteriors):null;
    const before=G;
    ipoBase(kind);
    if(G!==before&&exterior){G.exteriors=exterior;save()}
    return G!==before;
  };
  end=function(title,message){
    tsHide();spd(0);save();
    modal(title,message,[
      ['Minhas empresas',()=>openSlots()],
      ['Exportar campanha',()=>{exportSlot(ensureSlots().active);end(title,message)}],
      ['Recomeçar este slot',()=>{const slot=ensureSlots().active;openSlots();chooseNewSlot(slot)}]
    ]);
  };

  const importBase=parseImported;
  function object(value){return !!value&&typeof value==='object'&&!Array.isArray(value)}
  function finite(value,min=0,max=1e12){return Number.isFinite(value)&&value>=min&&value<=max}
  function validProduct(p){
    return object(p)&&Object.hasOwn(PRODUCT_TYPES24,p.type)&&typeof p.name==='string'&&p.name.length<=200&&Number.isInteger(p.id)&&p.id>=0&&
      ['building','ready','live'].includes(p.state)&&Number.isInteger(p.level)&&p.level>=1&&p.level<=5&&
      finite(p.work)&&finite(p.target,Number.MIN_VALUE)&&finite(p.users)&&finite(p.quality,0,100)&&
      ['standard','premium'].includes(p.pricing)&&(!('updating' in p)||typeof p.updating==='boolean');
  }
  parseImported=function(text){
    const campaign=importBase(text),business=campaign.business;
    if(business!==undefined){
      if(!object(business)||!Array.isArray(business.products)||business.products.length>6||business.products.some(p=>!validProduct(p))||
        new Set(business.products.map(p=>p.id)).size!==business.products.length||
        business.products.filter(p=>p.state==='building'||p.state==='ready').length>1||
        (business.allocation!==undefined&&(!object(business.allocation)||Object.values(business.allocation).some(v=>![0,.1,.25,.5].includes(v)))))
        throw Error('Arquivo de save inválido: verifique os produtos e a dedicação dos andares.');
    }
    // Contracts with an unknown role used to crash the capacity and proposal UI.
    for(const contract of [...campaign.off,...campaign.act]){
      if(!object(contract)||!Number.isInteger(contract.id)||typeof contract.name!=='string'||!finite(contract.reward)||!finite(contract.dl)||
        !object(contract.need)||!object(contract.tot)||!Object.keys(contract.tot).length||
        Object.entries(contract.need).some(([role,value])=>!Object.hasOwn(RO,role)||!finite(value))||
        Object.entries(contract.tot).some(([role,value])=>!Object.hasOwn(RO,role)||!finite(value,Number.MIN_VALUE)))
        throw Error('Arquivo de save inválido: há um contrato com cargo ou valores incompatíveis.');
    }
    return campaign;
  };

  // Keep text editing and modal shortcuts local. Original global cheats listened
  // on window; stopping at document preserves input/default and dialog handlers.
  document.addEventListener('keydown',event=>{
    const target=event.target;
    if(!(target instanceof Element))return;
    if(target.closest('input,textarea,select,[contenteditable="true"]')){event.stopPropagation();return}
    if(event.key==='Escape'||event.key==='Tab')return;
    const modal=target.closest('#commandView27,#exteriorView,#personalView,#slotsView,#businessView,#officeView,#lifeView25,#eventView,#liftMenu');
    if(modal&&!modal.hidden)event.stopPropagation();
  });
})();
