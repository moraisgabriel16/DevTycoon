/* V27: knowledge is earned through completed work, never through time away. */
(() => {
  'use strict';

  const KNOWLEDGE_PER_DELIVERY = 2;
  const BRANCHES = [
    {id:'engineering',icon:'⌘',name:'Engenharia',description:'Melhore a produção e entregue com mais qualidade.'},
    {id:'people',icon:'♧',name:'Pessoas',description:'Transforme o aprendizado da equipe em uma vantagem.'},
    {id:'business',icon:'↗',name:'Negócios',description:'Negocie propostas melhores e amplie seus produtos.'}
  ];
  const NODES = [
    {id:'cleanCode',branch:'engineering',tier:1,cost:2,name:'Código sustentável',effect:'+5% na produção dos contratos.',requires:[]},
    {id:'quality',branch:'engineering',tier:2,cost:4,name:'Qualidade contínua',effect:'Risco de bugs −3 pontos percentuais; mínimo de 1%.',requires:['cleanCode']},
    {id:'automation',branch:'engineering',tier:3,cost:7,name:'Ferramentas internas',effect:'+6% no trabalho dedicado ao desenvolvimento de produtos.',requires:['quality']},
    {id:'culture',branch:'people',tier:1,cost:2,name:'Cultura de cuidado',effect:'+1 de humor por pessoa ao fim de cada dia trabalhado.',requires:[]},
    {id:'mentoring',branch:'people',tier:2,cost:4,name:'Aprendizado compartilhado',effect:'+4 XP por pessoa para cada contrato entregue.',requires:['culture']},
    {id:'focus',branch:'people',tier:3,cost:7,name:'Autonomia com foco',effect:'+4% na produção dos contratos para pessoas com humor de 70% ou mais.',requires:['mentoring']},
    {id:'discovery',branch:'business',tier:1,cost:2,name:'Descoberta de valor',effect:'Novas propostas de contratos oferecem +4%.',requires:[]},
    {id:'negotiation',branch:'business',tier:2,cost:4,name:'Negociação consultiva',effect:'Mais +4% nas novas propostas; total de +8%.',requires:['discovery']},
    {id:'partnerships',branch:'business',tier:3,cost:7,name:'Ecossistema de parceiros',effect:'+5% na aquisição diária de usuários dos produtos.',requires:['negotiation']}
  ];
  let cachedCampaign, cachedState;

  const integer = (value,max=999999) => Math.max(0,Math.min(max,Number.isFinite(Number(value))?Math.floor(Number(value)):0));

  function ensure(){
    if(cachedCampaign===G&&cachedState===G.research27)return cachedState;
    const old=G.research27&&typeof G.research27==='object'?G.research27:{};
    const learned=[];
    for(const n of NODES)if(Array.isArray(old.learned)&&old.learned.includes(n.id)&&n.requires.every(id=>learned.includes(id)))learned.push(n.id);
    const state={
      version:1,
      points:integer(old.points),
      earned:integer(old.earned),
      learned,
      // A legacy campaign starts here; historic deliveries are not credited again.
      baselineDone:integer(G.done),
      joinedDay:integer(old.joinedDay||G.day)
    };
    G.research27=state;cachedCampaign=G;cachedState=state;
    return state;
  }

  const has=id=>ensure().learned.includes(id);
  const points=()=>ensure().points;
  const unlockedCount=()=>ensure().learned.length;

  function buy(id){
    const node=NODES.find(n=>n.id===id),state=ensure();
    if(!node||state.learned.includes(id)||state.points<node.cost||!node.requires.every(required=>state.learned.includes(required)))return false;
    state.points-=node.cost;state.learned.push(node.id);
    if(save()===false){
      state.points+=node.cost;state.learned=state.learned.filter(key=>key!==node.id);
      return false;
    }
    log('🔬 Pesquisa concluída: '+node.name+'.');
    if(typeof officeSay==='function')officeSay(node.name+' agora faz parte da empresa.');
    ui();
    return true;
  }

  function make(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node}

  function renderPanel(){
    const root=make('section','research27-panel');
    let feedback='';
    function refresh(){
      const state=ensure();root.replaceChildren();
      const summary=make('div','research27-summary');
      summary.append(make('b','research27-points',state.points+' conhecimentos disponíveis'),make('span','research27-count',state.learned.length+'/'+NODES.length+' pesquisas concluídas'));
      root.append(summary);
      root.append(make('p','research27-intro','Cada contrato entregue a partir desta atualização rende 2 conhecimentos. Escolha onde investir; as pesquisas permanecem nesta empresa e não exigem dinheiro.'));
      const tracks=make('div','research27-tracks');
      for(const branch of BRANCHES){
        const track=make('section','research27-track');
        track.append(make('h3','',branch.icon+' '+branch.name),make('p','research27-description',branch.description));
        for(const node of NODES.filter(n=>n.branch===branch.id)){
          const owned=state.learned.includes(node.id),missing=node.requires.filter(id=>!state.learned.includes(id)),locked=missing.length>0;
          const card=make('article','research27-node'+(owned?' is-complete':locked?' is-locked':''));
          const head=make('div','research27-node-head');head.append(make('small','research27-tier','NÍVEL '+node.tier),make('span','research27-cost',owned?'✓ Aprendido':node.cost+' conhecimentos'));
          card.append(head,make('h4','',node.name),make('p','',node.effect));
          if(locked)card.append(make('small','research27-prerequisite','Requer '+missing.map(id=>NODES.find(n=>n.id===id).name).join(' e ')+'.'));
          const button=make('button',owned?'research27-owned':'research27-learn',owned?'Pesquisa concluída':locked?'Conclua a pesquisa anterior':state.points<node.cost?'Faltam '+(node.cost-state.points)+' conhecimentos':'Pesquisar '+node.name);
          button.type='button';button.disabled=owned||locked||state.points<node.cost;
          button.onclick=()=>{
            const ok=buy(node.id);
            feedback=ok?'✓ '+node.name+' aplicada à sua empresa.':'Não foi possível concluir. Confira o saldo ou o armazenamento do navegador.';
            refresh();
            root.dispatchEvent(new CustomEvent('research27change',{bubbles:true,detail:{id:node.id,success:ok}}));
          };
          card.append(button);track.append(card);
        }
        tracks.append(track);
      }
      root.append(tracks);
      const status=make('p','research27-feedback',feedback);status.setAttribute('role','status');root.append(status);
      const details=document.createElement('details');details.className='research27-details';
      details.append(make('summary','','Como os bônus funcionam'),make('p','','Produção dos contratos: até +9,2% com os dois bônus combinados e humor suficiente. As melhorias de propostas valem somente para contratos gerados depois da pesquisa; propostas e contratos já existentes mantêm seus valores. Nenhum conhecimento é gerado só por passar dias, recarregar ou ficar offline.'));
      root.append(details);
    }
    refresh();return root;
  }

  const operatingBefore=operatingBoost;
  operatingBoost=function(e){return operatingBefore(e)*(has('cleanCode')?1.05:1)*(has('focus')&&e.mood>=70?1.04:1)};

  const businessOutputBefore=businessOutput;
  businessOutput=function(e){return businessOutputBefore(e)*(has('automation')?1.06:1)};

  const bugRiskBefore=bugRisk;
  bugRisk=function(rc){return Math.max(.01,bugRiskBefore(rc)-(has('quality')?.03:0))};

  const genOfferBefore=genO;
  genO=function(){
    const offer=genOfferBefore();
    if(!offer||offer.researchApplied27)return offer;
    const bonus=(has('discovery')?.04:0)+(has('negotiation')?.04:0);
    if(bonus){offer.reward=Math.round(offer.reward*(1+bonus));offer.researchApplied27=bonus;}
    return offer;
  };

  const growthBefore=marketGrowthFactor25;
  marketGrowthFactor25=function(product){return growthBefore(product)*(has('partnerships')?1.05:1)};

  const tickBefore=tick;
  tick=function(){
    const campaign=G,beforeDone=integer(G.done),beforeDay=G.day,state=ensure();
    tickBefore();
    if(G!==campaign)return;
    const delta=Math.max(0,integer(G.done)-beforeDone),advanced=G.day>beforeDay;
    state.baselineDone=integer(G.done);
    let changed=false;
    if(delta){
      const gain=delta*KNOWLEDGE_PER_DELIVERY;state.points=integer(state.points+gain);state.earned=integer(state.earned+gain);changed=true;
      if(has('mentoring'))for(const e of companyStaff())e.xp=(Number(e.xp)||0)+4*delta;
      log('🔬 +'+gain+' conhecimentos por '+delta+' contrato(s) entregue(s).');
    }
    if(advanced&&has('culture')&&((G.day-1)%7<5||G.wk)){
      for(const e of companyStaff())e.mood=Math.max(0,Math.min(100,(Number(e.mood)||0)+1));
      changed=true;
    }
    if(changed){save();ui();}
  };

  const initBefore=init;
  init=function(){initBefore();ensure()};

  window.Research27={ensure,renderPanel,points,unlockedCount};
  ensure();
})();
