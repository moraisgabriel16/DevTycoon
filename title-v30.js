/* Main menu: play, saves and settings. Company tools belong to the campaign. */
(() => {
  'use strict';
  const $=s=>document.querySelector(s);
  function syncGameUI(){const open=ts.style.display==='flex';for(const id of ['gameHeader28','gameLayout28']){const e=document.getElementById(id);if(e)e.inert=open}}
  new MutationObserver(syncGameUI).observe(ts,{attributes:true,attributeFilter:['style']});
  const sceneCopy=[
    ['Primeiro expediente','Uma mesa, uma equipe e o primeiro contrato.'],
    ['Equipe em movimento','Cada especialidade ajuda a entregar projetos maiores.'],
    ['Pausa na cobertura','Uma sede que cresce junto com a equipe.'],
    ['Bastidores do escritório','Cuide da infraestrutura para manter o trabalho em dia.']
  ];
  TITLE_SCENES.forEach((scene,i)=>Object.assign(scene,{name:sceneCopy[i][0],line:sceneCopy[i][1]}));
  function newCompany(){
    openSlots();
    const empty=ensureSlots().slots.findIndex(s=>!validCampaign(s?.data));
    if(empty>=0)chooseNewSlot(empty);
    else{
      const status=document.getElementById('slotFeedback');status.textContent='Os três espaços estão ocupados. Exporte uma empresa antes de escolher Recomeçar.';status.setAttribute('role','status');
    }
  }
  function menuButton(id,label,icon,action){
    const b=document.createElement('button');b.id=id;b.type='button';b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+icon+'"/></svg><span>'+label+'</span>';b.onclick=action;return b;
  }
  const titleBefore=titleRender;
  titleRender=function(){
    titleBefore();syncGameUI();ts.classList.toggle('start30',tsStep===0);if(tsStep!==0)return;
    const copy=$('#ts .titleCopy23'),menu=$('#ts .titleSecondary23');if(!copy||!menu)return;
    const logo=document.createElement('img');logo.className='start-logo30';logo.src='./assets/devcorp-logo.svg';logo.alt='DevCorp';logo.width=760;logo.height=180;logo.fetchPriority='high';logo.decoding='async';
    copy.querySelectorAll('.titleLogo23,h1').forEach(e=>e.remove());copy.prepend(logo);
    $('.titleEyebrow').textContent='UM JOGO DE GESTÃO DE TECNOLOGIA';
    copy.querySelector('h2').innerHTML='Comece na garagem.<br><em>Cresça com cada entrega.</em>';
    copy.querySelector('p').textContent='Reúna pessoas, ajude o bairro e construa a sede do seu jeito. Não precisa saber programar.';
    const db=ensureSlots(),saved=!!(G.tut||db.slots[db.active]?.data?.tut);
    const save=$('#ts .titleCurrent23');save.querySelector('span').textContent=(saved?'EMPRESA SALVA':'PRONTA PARA COMEÇAR')+' · SLOT '+(db.active+1);
    const primary=$('#ts .titlePrimary23');primary.id='startPlay30';primary.textContent=saved?'Continuar partida':'Começar empresa';primary.classList.toggle('has-save30',saved);
    const arrow=document.createElement('span');arrow.className='start-arrow30';arrow.textContent='▶';arrow.setAttribute('aria-hidden','true');primary.prepend(arrow);
    menu.replaceChildren(
      menuButton('startNew30','Nova empresa','M12 4v16M4 12h16',newCompany),
      menuButton('startLoad30','Carregar empresa','M3 7h7l2 3h9v10H3V7Zm0 0V4h7l2 3',openSlots),
      menuButton('startDemo30','Explorar demo','m9 5 10 7-10 7V5Z',()=>loadSlot(2)),
      menuButton('startOptions30','Opções','M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6m-6 0v6',()=>{tsStep=2;titleRender()})
    );
    const footer=$('#ts .titleFoot23');footer.querySelector('span')?.remove();footer.querySelector('small').textContent='V35';
    $('#ts .titleSceneHeader23 small').textContent='DENTRO DO JOGO';
    ts.setAttribute('aria-label','Menu principal do DevCorp');
  };
  if(ts.style.display==='flex')titleRender();
})();
