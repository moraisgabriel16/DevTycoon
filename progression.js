/* V27: a finite campaign that connects existing management systems. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id),h=htmlText;
  const number=value=>Math.max(0,Number(value)||0);
  const SHOWCASES=[
    {id:'bairro',name:'O bairro conectado',icon:'⌂',color:'#78694b',client:'Um mapa para os pequenos comércios se encontrarem.',need:{back:48,front:32},reward:1800,days:24,done:2,rep:1,level:0,stamp:'Parceiro do bairro'},
    {id:'festival',name:'Festival de ideias',icon:'✦',color:'#715472',client:'O primeiro festival de tecnologia da cidade precisa da sua equipe.',need:{front:140,back:110,ux:80},reward:7200,days:26,done:8,rep:2,level:1,stamp:'Criador de experiências'},
    {id:'observatorio',name:'Observatório urbano',icon:'◈',color:'#3d717a',client:'Dados abertos para cuidar melhor de cada canto da cidade.',need:{back:320,data:240,infra:180},reward:23000,days:30,done:18,rep:4,level:2,stamp:'Cidade inteligente'},
    {id:'orbita',name:'Missão Órbita',icon:'◎',color:'#4d5883',client:'Uma plataforma segura para a próxima geração de satélites.',need:{back:800,infra:500,qa:420,sec:400},reward:85000,days:35,done:35,rep:7,level:3,stamp:'Além do horizonte'},
    {id:'conexao',name:'Conexão continental',icon:'⌘',color:'#3c7565',client:'Uma rede de educação que atravessa fronteiras.',need:{back:1800,front:1400,mobile:1000,data:900,sec:700},reward:340000,days:40,done:60,rep:10,level:4,stamp:'Sem fronteiras'},
    {id:'legado',name:'Projeto Legado',icon:'♜',color:'#947448',client:'O campus abre suas portas: construa a infraestrutura de um ecossistema inteiro.',need:{back:3600,front:2400,infra:2200,data:1800,qa:1400,sec:1200},reward:1400000,days:45,done:100,rep:14,level:5,stamp:'Um legado para a cidade'}
  ];
  function ensure(){
    if(!G.journey27||G.journey27.version!==1)G.journey27={version:1,claimed:[],peaks:{},showcases:{},history:[],started:G.day};
    const s=G.journey27;s.claimed=Array.isArray(s.claimed)?[...new Set(s.claimed.filter(i=>Number.isInteger(i)&&i>=0&&i<8))]:[];
    if(!s.peaks||typeof s.peaks!=='object'||Array.isArray(s.peaks))s.peaks={};
    if(!s.showcases||typeof s.showcases!=='object'||Array.isArray(s.showcases))s.showcases={};
    if(!Array.isArray(s.history))s.history=[];return s;
  }
  function scan(){
    const s=ensure(),people=companyStaff(),products=G.business?.products||[],live=products.filter(p=>p.state==='live'||p.updating),seated=people.filter(e=>e.desk&&ISD(floorState(e.floor??0).tiles[e.desk])).length;
    for(const[id,state]of Object.entries(s.showcases))if(state?.status==='active'&&!G.act.some(c=>c.showcase27===id))s.showcases[id]={...state,status:'failed',retryAfter:G.day};
    const values={done:G.done||0,staff:people.length,seated,level:G.lvl,rep:G.rep,upgrades:Object.keys(G.up||{}).filter(k=>G.up[k]).length,research:window.Research27?.unlockedCount()||0,products:live.length,users:live.reduce((n,p)=>n+number(p.users),0),showcases:Object.values(s.showcases).filter(x=>x?.status==='complete').length,exterior:Object.keys(G.exteriors?.buildings||{}).length,money:G.money,prestige:G.prestige||0};
    for(const[key,value]of Object.entries(values))s.peaks[key]=Math.max(number(s.peaks[key]),number(value));
    if(people.length>=3)s.peaks.morale=Math.max(number(s.peaks.morale),people.reduce((n,e)=>n+e.mood,0)/people.length);
    return s.peaks;
  }
  const goal=(key,target,label,where,explain)=>({key,target,label,where,explain});
  const CHAPTERS=[
    {title:'Primeiro commit',line:'Uma entrega. Uma parceria. Um lugar para começar.',reward:300,goals:[goal('done',1,'Entregue seu primeiro contrato','ct','O Site da Padaria usa Back. A Ana já pode cuidar dele.'),goal('seated',2,'Tenha duas pessoas com mesa','hr','Contrate alguém para a mesa livre. Cada servidor atende três pessoas.'),goal('exterior',1,'Dê uma identidade à sua sede','exterior','Salve uma fachada ou um letreiro no editor de exteriores.')]},
    {title:'Gente que faz acontecer',line:'Crescer é cuidar de quem constrói com você.',reward:900,goals:[goal('done',5,'Entregue cinco contratos','ct','Não assuma mais trabalho do que os cargos da equipe conseguem entregar.'),goal('staff',3,'Reúna uma equipe de três pessoas','hr','Deixe mesas e servidores preparados antes de contratar.'),goal('morale',75,'Alcance 75% de humor com três pessoas','bd','Café, plantas, descanso e salários em dia fazem diferença.')]},
    {title:'O próximo endereço',line:'Seu trabalho começa a chamar atenção na cidade.',reward:1800,goals:[goal('level',1,'Mude para a Sala comercial','shop','A Loja vende a expansão por $4.000. Os móveis acompanham a mudança.'),goal('research',2,'Desbloqueie duas pesquisas','research','Cada entrega gera conhecimento para melhorar sua empresa.'),goal('showcases',1,'Conclua O bairro conectado','showcases','Um projeto especial exige Front e Back e deixa um selo no portfólio.')]},
    {title:'Uma ideia no mundo',line:'Chegou a hora de lançar algo que é seu.',reward:4500,goals:[goal('done',18,'Entregue dezoito contratos','ct','Use prioridades e cuide da dívida técnica.'),goal('products',1,'Publique seu primeiro produto','products','Crie uma ferramenta dev e reserve parte da equipe em Departamentos.'),goal('users',50,'Conquiste cinquenta usuários','products','Uma versão publicada atrai usuários a cada dia.')]},
    {title:'Uma empresa de verdade',line:'Pessoas, processos e uma marca reconhecida.',reward:12000,goals:[goal('level',2,'Mude para o Escritório','shop','Novos andares permitem separar funções e organizar departamentos.'),goal('research',5,'Desbloqueie cinco pesquisas','research','Equilibre engenharia, pessoas e negócios.'),goal('showcases',3,'Complete três projetos de vitrine','showcases','Cada projeto apresenta uma combinação diferente de especialidades.')]},
    {title:'Um nome no horizonte',line:'A próxima grande oportunidade já conhece seu nome.',reward:35000,goals:[goal('level',3,'Chegue à Torre corporativa','shop','Amplie a estrutura conforme o caixa e o volume de trabalho.'),goal('users',300,'Alcance trezentos usuários','products','Versões e divulgação ajudam a formar uma comunidade.'),goal('rep',12,'Alcance reputação 12','ct','Entregas confiáveis e clientes bem atendidos constroem reputação.')]},
    {title:'Um ecossistema',line:'O que era uma empresa agora abre espaço para outras ideias.',reward:100000,goals:[goal('level',4,'Chegue à Torre empresarial','shop','Planeje o custo de manutenção junto com a mudança.'),goal('products',2,'Mantenha dois produtos publicados','products','Experimente categorias diferentes e acompanhe a manutenção.'),goal('showcases',5,'Conquiste cinco selos de vitrine','showcases','Projetos maiores precisam de uma equipe de especialistas.')]},
    {title:'O seu legado',line:'Da primeira mesa a uma cidade de possibilidades.',reward:250000,goals:[goal('level',5,'Abra o Campus tech','shop','O último endereço é o começo de uma nova fase.'),goal('showcases',6,'Entregue o Projeto Legado','showcases','Seu portfólio completo conta a história do que sua equipe construiu.'),goal('prestige',1,'Faça seu primeiro IPO','shop','Com $1 bilhão, abra capital e escolha um bônus permanente.')]} 
  ];
  function chapterIndex(){const s=ensure();return CHAPTERS.findIndex((_,i)=>!s.claimed.includes(i))}
  function goalValue(g){return Math.min(g.target,number(ensure().peaks[g.key]))}
  function finished(c){return c.goals.every(g=>goalValue(g)>=g.target)}
  function button(label,action,css){const b=document.createElement('button');b.textContent=label;if(css)b.className=css;b.onclick=action;return b}
  function elem(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
  let section='journey',open=false,previousFocus,toastTimer,inertSiblings=[],uiSignature='',viewDirty=true;
  const overlay=document.createElement('section');overlay.id='commandView27';overlay.hidden=true;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','commandTitle27');
  overlay.innerHTML=`<div class="command-shell27"><header class="command-head27"><div><div class="command-kicker27">DEV TYCOON / CENTRAL DA EMPRESA</div><h2 id="commandTitle27"></h2><p>O próximo capítulo é uma escolha sua.</p></div><button id="commandClose27" aria-label="Voltar ao jogo">✕</button></header><nav class="command-tabs27" id="commandTabs27" aria-label="Central da empresa"></nav><div class="command-content27" id="commandContent27"><p id="commandMessage27" role="status"></p><div id="commandPanel27"></div></div><footer class="command-footer27"><span id="commandFoot27">Tempo pausado · sem perder prazos enquanto planeja</span><button id="commandSaves27">💾 Suas empresas</button></footer></div>`;
  document.body.append(overlay);
  const toast=elem('div','notice27');toast.hidden=true;toast.setAttribute('role','status');document.body.append(toast);
  function notify(text){toast.textContent=text;toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,4800)}
  function message(text){$('commandMessage27').textContent=text}
  const bar=elem('section');bar.id='journeyBar27';bar.setAttribute('aria-label','Próximo objetivo da campanha');$('stage').before(bar);
  const entry=button('◈ Central da empresa',()=>openHub());entry.id='commandEntry27';personalEntryBar.prepend(entry);
  function renderBar(){
    scan();const i=chapterIndex(),c=CHAPTERS[i],s=ensure(),g=c?.goals.find(g=>goalValue(g)<g.target),ready=c&&finished(c);
    const signature=[i,c?.goals.map(goalValue),s.claimed.length].join('|');if(signature===uiSignature)return;uiSignature=signature;
    bar.replaceChildren();const text=elem('div');text.append(elem('small',null,i<0?'JORNADA CONCLUÍDA / UM NOVO LEGADO':'CAPÍTULO '+String(i+1).padStart(2,'0')+' / '+CHAPTERS.length),elem('strong',null,c?.title||'Sua história continua.'),elem('p',null,i<0?'Aperfeiçoe produtos, complete a coleção e explore outra estratégia.':ready?'Objetivos concluídos. Sua recompensa está pronta.':g.label+' · '+Math.floor(goalValue(g))+'/'+g.target));
    const track=elem('div','journey-track27');CHAPTERS.forEach((_,j)=>track.append(elem('i',s.claimed.includes(j)?'done':j===i?'current':'')));text.append(track);bar.append(text,button(ready?'Resgatar':'Ver jornada',()=>openHub('journey')));
  }
  function closeHub(){open=false;overlay.hidden=true;document.documentElement.classList.remove('command-open27');for(const[e,prior]of inertSiblings)e.inert=prior;inertSiblings=[];previousFocus?.focus();last=performance.now()}
  function openHub(next='journey'){
    if(liftBusy)return;scan();section=next;if(!open)previousFocus=document.activeElement;
    for(const m of [personalView,businessView,lifeView25,officeView])if(!m.hidden){if(m===personalView)closePersonalRoom();else m.hidden=true}
    if(!open){inertSiblings=[...document.body.children].filter(e=>e!==overlay&&e!==toast&&!['SCRIPT','STYLE'].includes(e.tagName)).map(e=>[e,e.inert]);for(const[e]of inertSiblings)e.inert=true}
    open=true;overlay.hidden=false;document.documentElement.classList.add('command-open27');renderHub();$('commandClose27').focus();
  }
  function go(where){
    if(['research','showcases','overview','guide','journey'].includes(where)){section=where;renderHub();$('commandContent27').scrollTop=0;return}
    closeHub();tsHide();wl.style.display='none';
    if(where==='exterior')openExterior();else if(where==='products')openBusiness('products');else if(where==='departments')openBusiness('departments');else if(where==='people')openLife25('people');else if(where==='clients')openLife25('clients');else if(where==='album')openLife25('album');else if(where==='events')openEvents();else if(where==='room')openPersonalRoom();else if(where==='office')openOffice();else if(where==='shop'){shopT='bld';tabOpen('sh')}else tabOpen(where);
  }
  function claim(){
    const i=chapterIndex(),c=CHAPTERS[i];if(!c||!finished(c))return false;const s=ensure();s.claimed.push(i);G.money+=c.reward;G.rev=(G.rev||0)+c.reward;
    addAlbum25('journey27:'+i,'award',c.title,'Capítulo '+(i+1)+' concluído. '+n$(c.reward)+' de incentivo para o próximo passo.');
    log('✦ Capítulo concluído: '+c.title);save();ui();renderHub();message('✓ '+c.title+' concluído. '+n$(c.reward)+' adicionados ao caixa.');notify('✦ '+c.title+' · +'+n$(c.reward));sfx('deliver');return true;
  }
  function journeyPanel(){
    const i=chapterIndex(),s=ensure(),c=CHAPTERS[i],grid=elem('div','command-grid27'),main=elem('section','command-card27 accent');
    if(!c){main.append(elem('span','command-overline27','O LEGADO ESTÁ VIVO'),elem('h3',null,'Você construiu a sua história.'),elem('p',null,'Oito capítulos, da garagem ao IPO. Sua empresa continua: complete pesquisas, explore produtos e experimente uma nova campanha com outra especialização.'),button('Explorar seus produtos',()=>go('products'),'action27'));}
    else{
      main.append(elem('span','command-overline27','CAPÍTULO '+String(i+1).padStart(2,'0')),elem('h3',null,c.title),elem('p',null,c.line));
      const goals=elem('ul','chapter-goals27');for(const g of c.goals){const done=goalValue(g)>=g.target,li=elem('li',done?'complete':''),body=elem('div');body.append(elem('span',null,g.label),elem('small',null,done?'Marco alcançado':g.explain));li.append(elem('span','check27',done?'✓':'○'),body,done?elem('b',null,'✓'):button(Math.floor(goalValue(g))+'/'+g.target+' →',()=>go(g.where)));goals.append(li)}main.append(goals);
      const reward=elem('div','chapter-reward27'),copy=elem('div');copy.append(elem('small',null,'INCENTIVO DO CAPÍTULO'),elem('b',null,n$(c.reward)));const b=button('Concluir capítulo',claim,'action27');b.disabled=!finished(c);reward.append(copy,b);main.append(reward,elem('p',null,'Os marcos alcançados ficam registrados. Cada recompensa só pode ser resgatada uma vez.'));
    }
    const side=elem('section','command-card27');side.append(elem('span','command-overline27','DA GARAGEM AO LEGADO'),elem('h3',null,'Uma jornada, oito capítulos.'));const list=elem('div','chapter-list27');CHAPTERS.forEach((chapter,j)=>{const item=elem('div','chapter-item27 '+(s.claimed.includes(j)?'':j===i?'current':'locked')),body=elem('div');body.append(elem('b',null,chapter.title),elem('small',null,' '+n$(chapter.reward)));item.append(elem('span',null,s.claimed.includes(j)?'✓':String(j+1).padStart(2,'0')),body,elem('span',null,s.claimed.includes(j)?'✦':j===i?'→':'·'));list.append(item)});side.append(list);grid.append(main,side);
    const frag=document.createDocumentFragment();frag.append(grid,linksPanel());return frag;
  }
  function linksPanel(){const box=elem('div','command-links27');for(const[icon,label,dest]of [['🚀','Produtos e versões','products'],['▥','Departamentos','departments'],['☕','Pessoas e ambições','people'],['🤝','Clientes e visitas','clients'],['♧','Rotinas e limpeza','office'],['⌂','Exterior da sede','exterior'],['🛋','Sua sala e avatar','room'],['📖','Álbum de memórias','album'],['⚙','Automação','au'],['📨','Eventos e decisões','events']]){const b=button('',()=>go(dest));b.append(elem('span',null,icon),document.createTextNode(label));box.append(b)}return box}
  function statusFor(def){return ensure().showcases[def.id]||{status:'new',attempts:0}}
  function unlockReason(def){return (G.done||0)<def.done?'Entregue '+def.done+' contratos':G.lvl<def.level?'Requer '+BLD[def.level].n:G.rep<def.rep?'Requer reputação '+def.rep:null}
  function missingRoles(def){return Object.keys(def.need).filter(r=>!companyStaff().some(e=>e.role===r&&e.desk))}
  function startShowcase(id){
    const def=SHOWCASES.find(d=>d.id===id);if(!def)return false;const state=statusFor(def);
    if(unlockReason(def)||['active','complete'].includes(state.status)||G.act.some(c=>c.showcase27)||G.act.length>=(G.up.pmo?5:3)||number(state.retryAfter)>G.day)return false;
    const missing=missingRoles(def);if(missing.length){message('Prepare estes cargos com mesa: '+missing.map(r=>RO[r].n).join(', ')+'.');return false}
    const c={id:++G.id,name:def.name,need:{...def.need},tot:{...def.need},reward:def.reward,dl:def.days,exp:def.days,kind:'prem',showcase27:def.id,ng:1};
    tagClient25(c);c.reward=def.reward;G.act.push(c);ensure().showcases[id]={status:'active',attempts:number(state.attempts)+1,started:G.day};save();ui();renderHub();message('Projeto iniciado. A equipe trabalha nele junto com os outros contratos.');notify('Novo projeto de vitrine: '+def.name);return true;
  }
  function showcasePanel(){
    const frag=document.createDocumentFragment(),intro=elem('section','command-card27 accent');intro.append(elem('span','command-overline27','SEIS PROJETOS / UMA CIDADE'),elem('h3',null,'Trabalho que deixa uma marca.'),elem('p',null,'Projetos feitos à mão, com escopo e prazo fixos. Prepare os especialistas, entregue com sua equipe e colecione os selos do portfólio. Um projeto de vitrine por vez; ele ocupa uma vaga normal de contrato.'),elem('small',null,'Um selo libera o estandarte para o exterior. Três selos liberam uma escultura exclusiva.'));frag.append(intro,elem('p',null,'Os prazos usam os dias do jogo. Nenhum projeto começa sozinho. Falhas seguem as multas normais; depois de três dias, você pode tentar outra vez.'));
    const grid=elem('div','showcase-grid27');for(const d of SHOWCASES){const s=statusFor(d),locked=unlockReason(d),active=G.act.find(c=>c.showcase27===d.id),missing=missingRoles(d),card=elem('section','command-card27 showcase-card27'+(locked?' locked':''));card.style.setProperty('--project-color',d.color);
      const art=elem('div','showcase-art27');art.append(elem('span',null,d.icon),elem('small',null,s.status==='complete'?'SELO CONQUISTADO':locked?'EM BREVE':active?'EM PRODUÇÃO':'PROJETO ESPECIAL'));card.append(art,elem('h3',null,d.name),elem('p',null,d.client));
      const roles=elem('div','showcase-role27');Object.entries(d.need).forEach(([r,v])=>roles.append(elem('span',missing.includes(r)?'missing':'',RO[r].n+' · '+v)));card.append(roles);
      const metrics=elem('div','showcase-metrics27');metrics.append(elem('b',null,n$(d.reward)),elem('span',null,d.days+' dias úteis'));card.append(metrics);
      if(!locked&&!active&&s.status!=='complete'&&!missing.length){const estimate=etaNew({need:d.need});card.append(elem('p',estimate>d.days?'negative27':'','Capacidade nominal atual: cerca de '+(Number.isFinite(estimate)?estimate:'∞')+' dias úteis'+(estimate>d.days?' · reforçe a equipe antes de assumir.':'.')))}
      if(s.status==='complete')card.append(elem('p','showcase-tip27','✦ '+d.stamp+' · entregue no dia '+s.completed));
      else if(active){const left=Object.values(active.need).reduce((a,b)=>a+b,0),total=Object.values(active.tot).reduce((a,b)=>a+b,0);card.append(elem('p','showcase-tip27',Math.round((1-left/total)*100)+'% concluído · '+Math.ceil(active.dl)+' dias restantes'),button('Acompanhar contrato',()=>go('ct')))}
      else{const retry=Math.max(0,number(s.retryAfter)-G.day),busy=G.act.some(c=>c.showcase27),full=G.act.length>=(G.up.pmo?5:3),b=button(locked||retry?'Disponível em '+retry+' dias':busy?'Outro projeto em andamento':full?'Libere uma vaga de contrato':'Assumir projeto',()=>startShowcase(d.id),'action27');if(locked)b.textContent=locked;b.disabled=!!locked||retry>0||busy||full||missing.length>0;card.append(b);if(!locked&&missing.length)card.append(elem('small',null,'Faltam pessoas com mesa em: '+missing.map(r=>RO[r].n).join(', ')));if(s.status==='failed')card.append(elem('p',null,'A última tentativa não foi concluída. Reorganize a equipe antes de tentar de novo.'))}grid.append(card);
    }frag.append(grid);return frag;
  }
  function recordHistory(){const s=ensure(),row={day:G.day,money:Math.round(G.money),done:G.done||0,staff:companyStaff().length};const last=s.history.at(-1);if(last?.day===G.day)s.history[s.history.length-1]=row;else s.history.push(row);s.history=s.history.slice(-30)}
  function chart(){const rows=ensure().history;const container=elem('div');if(rows.length<2){container.append(elem('p',null,'O gráfico será preenchido conforme os dias da sua empresa passam.'));return container}
    const vals=rows.map(r=>r.money),min=Math.min(...vals),max=Math.max(...vals),range=Math.max(1,max-min),points=rows.map((r,i)=>[12+i/(rows.length-1)*576,125-(r.money-min)/range*108]);
    container.innerHTML='<svg class="command-chart27" viewBox="0 0 600 160" role="img" aria-label="Histórico real do caixa nos últimos trinta dias"><defs><linearGradient id="moneyFill27" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#a4dfbf" stop-opacity=".28"/><stop offset="1" stop-color="#a4dfbf" stop-opacity="0"/></linearGradient></defs><path d="M '+points.map(p=>p.join(',')).join(' L ')+' L 588,130 L 12,130 Z" fill="url(#moneyFill27)"/><path d="M '+points.map(p=>p.join(',')).join(' L ')+'" fill="none" stroke="#a9dfc1" stroke-width="2.5"/><text x="12" y="152">Dia '+rows[0].day+'</text><text x="530" y="152">Dia '+rows.at(-1).day+'</text></svg>';return container;
  }
  function overviewPanel(){const frag=document.createDocumentFragment(),health=companyHealth24(),stats=elem('div','command-stat27');for(const[label,value,negative]of [['Caixa disponível',n$(G.money),G.money<0],['Saldo recorrente / dia',n$(health.net),health.net<0],['Contratos entregues',String(G.done||0)],['Conhecimento',String(window.Research27?.points()||0)]]){const item=elem('div');item.append(elem('small',null,label),elem('strong',negative?'negative27':'',value));stats.append(item)}frag.append(stats);
    const grid=elem('div','command-grid27'),graph=elem('section','command-card27'),plan=elem('section','command-card27');graph.append(elem('span','command-overline27','HISTÓRICO DA CAMPANHA'),elem('h3',null,'Cada decisão mexe no caixa.'),chart(),elem('small',null,'Saldo real no fim de cada dia. Não é uma previsão de lucro.'));plan.append(elem('span','command-overline27','SEU PRÓXIMO MOVIMENTO'),elem('h3',null,'Antes de crescer, confira a base.'));
    const issues=[];if(companyStaff().some(e=>!e.desk))issues.push(['Alguém ainda está sem mesa.','Construir','bd']);if(health.deficits.length)issues.push(['Capacidade dos servidores insuficiente.','Infraestrutura','bd']);if(health.mood<50)issues.push(['O humor da equipe pede cuidado.','Cuidar da equipe','tm']);if(!G.act.length)issues.push(['A equipe pode assumir uma nova entrega.','Ver propostas','ct']);if(health.risk)issues.push([health.risk+' contrato(s) podem atrasar.','Revisar contratos','ct']);if(activeProduct()&&!Object.values(G.business?.allocation||{}).some(v=>v>0))issues.push(['Seu produto precisa de dedicação da equipe.','Departamentos','departments']);if(!issues.length)issues.push(['A base está estável. Seu próximo capítulo espera.','Continuar jornada','journey']);for(const[text,label,dest]of issues.slice(0,4)){plan.append(elem('p',null,text),button(label+' →',()=>go(dest)))}grid.append(graph,plan);frag.append(grid,elem('p',null,'O saldo recorrente usa receitas de produtos, filiais e manutenção, salários e aluguel em média. Entregas, eventos, compras e impostos variam e ficam fora dessa projeção.'),linksPanel());return frag;
  }
  function guidePanel(){const frag=document.createDocumentFragment();frag.append(elem('h3',null,'Um estúdio inteiro nas suas mãos.'),elem('p',null,'Construa uma empresa sustentável. Você pode pausar, planejar e mudar de direção; não há obrigação de voltar em um horário específico.'));
    const grid=elem('div','guide-grid27');for(const[title,text,label,dest]of [
      ['01 / Comece pequeno','Aceite o Site da Padaria. A Ana faz Back e já tem mesa. Nos primeiros contratos, use apenas as especialidades da sua equipe. A primeira entrega da padaria não sofre penalidade aleatória de bugs.','Ver contratos','ct'],
      ['02 / Pessoas precisam de estrutura','Cada pessoa precisa de mesa e caminho livre. Um servidor atende três pessoas; Cloud e Data center ampliam a capacidade. Café, descanso, água e salários em dia mantêm o humor.','Preparar escritório','bd'],
      ['03 / Prazo é uma decisão','Mais contratos dividem a equipe. Confira cargos e estimativas antes de aceitar. A estimativa usa capacidade nominal e pode variar com pausas, deslocamentos e eventos. Fins de semana de folga congelam os prazos.','Contratar equipe','hr'],
      ['04 / Conhecimento vira vantagem','Cada contrato realmente entregue rende conhecimento. Pesquisas têm pré-requisitos e efeitos permanentes nesta empresa; pontos e pesquisas ficam separados por campanha.','Abrir pesquisa','research'],
      ['05 / Tire uma ideia do papel','Depois de três entregas ou reputação 2, crie uma ferramenta dev. Reserve 10–50% de um andar em Departamentos. O restante continua nos contratos. Quando o produto ficar pronto, publique.','Criar produto','products'],
      ['06 / Cuide da rotina','Humor e necessidades orientam as pausas. Pessoas próximas constroem vínculos. Reuniões, limpeza e especialistas dão resultados; crunch contínuo cobra um preço.','Pessoas e histórias','people'],
      ['07 / Cresça com propósito','Prédios, filiais, automação e departamentos liberam estratégias. Os capítulos apresentam esses sistemas; os projetos de vitrine testam combinações de equipe.','Projetos especiais','showcases'],
      ['08 / Seu jogo, seu ritmo','Use ⏸ para planejar e ⏩ para acelerar. O jogo salva automaticamente, inclusive ações com o tempo pausado. Exporte uma campanha em Suas empresas para transferir entre navegadores ou telefones.','Personalizar sede','exterior']]){const card=elem('section','command-card27');card.append(elem('h3',null,title),elem('p',null,text),button(label+' →',()=>go(dest)));grid.append(card)}frag.append(grid);return frag;
  }
  function renderHub(){
    if(!open)return;scan();$('commandTitle27').textContent=G.name||'Sua próxima grande empresa';$('commandTabs27').replaceChildren();
    for(const[id,label]of [['journey','◈ Jornada'],['research','⌘ Pesquisa'],['showcases','✦ Vitrine'],['overview','▥ Panorama'],['guide','? Guia']]){$('commandTabs27').append(button(label,()=>{section=id;renderHub();$('commandContent27').scrollTop=0},id===section?'active':''))}
    $('commandMessage27').textContent='';const panel=$('commandPanel27');panel.replaceChildren();
    panel.append(section==='research'?window.Research27.renderPanel():section==='showcases'?showcasePanel():section==='overview'?overviewPanel():section==='guide'?guidePanel():journeyPanel());
    $('commandFoot27').textContent='Tempo pausado · dia '+G.day+' · '+BLD[G.lvl].n;viewDirty=false;
  }
  $('commandClose27').onclick=closeHub;$('commandSaves27').onclick=()=>{closeHub();openSlots()};
  overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeHub()}if(e.key==='Tab'){const all=[...overlay.querySelectorAll('button,input,select')].filter(e=>!e.disabled&&e.getClientRects().length),first=all[0],last=all.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  const priorPaused=paused;paused=function(){return open||priorPaused()};
  const priorUI=ui;ui=function(){priorUI();if(floorSimulation)return;renderBar();if($('nextStep').textContent.includes('Equipe trabalhando!'))$('nextStep').hidden=true;$('cnm').textContent=(G.name||'Minha Empresa')+' · V27';viewDirty=true};
  const priorTick=tick;tick=function(){const campaign=G,day=G.day,idx=chapterIndex(),ready=idx>=0&&finished(CHAPTERS[idx]);priorTick();if(G===campaign&&G.day>day){scan();recordHistory();if(idx>=0&&!ready&&finished(CHAPTERS[idx]))notify('✦ '+CHAPTERS[idx].title+' pronto para concluir na Central.');save();renderBar()}};
  const priorDelivery=recordDelivery25;recordDelivery25=function(c){priorDelivery(c);const def=SHOWCASES.find(d=>d.id===c.showcase27);if(def){ensure().showcases[def.id]={...statusFor(def),status:'complete',completed:G.day};addAlbum25('showcase27:'+def.id,'award',def.name,'✦ '+def.stamp+' · um projeto para a cidade.');notify('✦ Novo selo: '+def.stamp)}};
  function failShowcase(c){if(c?.showcase27&&statusFor({id:c.showcase27}).status!=='complete')ensure().showcases[c.showcase27]={...statusFor({id:c.showcase27}),status:'failed',failed:G.day,retryAfter:G.day+3}}
  const priorFailure=recordClientFailure25;recordClientFailure25=function(c){priorFailure(c);failShowcase(c)};
  const priorDrop=dropC;dropC=function(i){const c=G.act[i];if(!c)return false;const r=priorDrop(i);if(!G.act.includes(c))failShowcase(c);save();return r};
  const priorInit=init;init=function(){if(open)closeHub();priorInit();scan();recordHistory();uiSignature='';renderBar()};
  const priorIPO=ipo2;ipo2=function(key){const journey=JSON.parse(JSON.stringify(ensure()));const oldPrestige=G.prestige||0;priorIPO(key);if((G.prestige||0)>oldPrestige){journey.history=[];G.journey27=journey;scan();recordHistory();save();ui()}};
  window.DevJourney27={ensure,scan,open:openHub,close:closeHub,claim,startShowcase,chapters:CHAPTERS,showcases:SHOWCASES,chapterIndex,notify};
  ensure();scan();recordHistory();renderBar();if(ts.style.display==='flex')titleRender();
})();
