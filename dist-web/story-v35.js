/* Human stories follow real simulation events. No extra payouts or forced pauses. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
  const button=(text,fn,cls)=>{const b=node('button',text,cls);b.type='button';b.onclick=fn;return b};
  const ROLES={
    back:['Sistemas (Back)','Faz pedidos, cadastros e regras funcionarem nos bastidores.'],
    front:['Telas (Front)','Constrói as páginas e os botões que as pessoas usam.'],
    infra:['Servidores (Infra)','Mantém os computadores e serviços funcionando.'],
    mobile:['Aplicativos (Mobile)','Leva o projeto para o telefone.'],
    qa:['Testes (QA)','Procura falhas antes que elas cheguem ao cliente.'],
    ux:['Experiência (UX)','Torna as telas claras e fáceis de usar.'],
    data:['Dados','Organiza informações para ajudar nas decisões.'],
    sec:['Segurança','Protege os dados e o acesso aos serviços.'],
    ai:['Inteligência artificial','Cria recursos que aprendem com informações.'],
    arch:['Arquitetura','Planeja como as partes do sistema trabalham juntas.'],
    scrum:['Organização da equipe','Ajuda a equipe a dividir e organizar o trabalho.'],
    am:['Gestão de contratos','Cuida das propostas e da relação com os clientes.'],
    cs:['Atendimento','Ajuda quem usa os produtos da empresa.'],
    cfo:['Direção financeira','Planeja as contas e o crescimento da empresa.'],
    cto:['Direção técnica','Orienta as decisões de tecnologia da equipe.'],
    mkt:['Divulgação','Apresenta os produtos a novos clientes.'],
    po:['Planejamento do produto','Decide quais melhorias são mais úteis.'],
    mgr:['Gestão da equipe','Acompanha as pessoas e a rotina do trabalho.'],
    hr:['Pessoas (RH)','Ajuda a contratar e cuidar da equipe.'],
    pm:['Gestão de projetos','Organiza entregas, prioridades e prazos.']
  };
  for(const[key,[label]]of Object.entries(ROLES))if(RO[key])RO[key].n=label;
  const TERMS=[
    ['Contrato','Um pedido de um cliente. Confira o pagamento, as especialidades e o prazo antes de aceitar.'],
    ['Pontos de trabalho','O número ao lado de cada especialidade é a quantidade de trabalho que falta. Não é o número de pessoas a contratar.'],
    ['Estimativa','Uma previsão de dias para entregar. Outros contratos, pausas e problemas podem aumentar esse tempo.'],
    ['Dia útil','Um dia em que a equipe trabalha e recebe salário. A configuração de folga do fim de semana também afeta os prazos.'],
    ['Servidor','Um computador que dá suporte à equipe. O servidor inicial atende três pessoas; prepare mais capacidade antes de contratar.'],
    ['Reputação','A confiança na sua empresa. Boas entregas abrem portas para clientes e projetos maiores.'],
    ['Dívida técnica','Atalhos acumulados no trabalho. Podem causar problemas depois; melhorias e manutenção ajudam a controlar.'],
    ['Bug','Uma falha no projeto. Pode reduzir o pagamento. Pessoas de testes e pesquisas ajudam a diminuir esse risco.'],
    ['API','Uma ponte para sistemas trocarem informações, como os pedidos de uma loja e seu serviço de pagamento.'],
    ['ERP','Um sistema de gestão que reúne partes da empresa, como vendas, estoque e contas.'],
    ['Pesquisa','Uma melhoria aprendida pela empresa. As entregas geram conhecimento para desbloqueá-la.'],
    ['Produto / SaaS','Uma ferramenta que é sua e pode ter vários usuários. Precisa de equipe para criar e manter, mesmo depois de publicada.'],
    ['Crunch','Trabalho em ritmo intenso. Pode acelerar uma entrega, mas desgasta as pessoas.'],
    ['IPO / abrir capital','Vender ações da empresa. No jogo, abre uma nova jornada com um bônus permanente quando você atinge o requisito de dinheiro.']
  ];
  const STORIES={
    welcome:{person:'Ana',title:'Duas mesas. Muitas possibilidades.',text:'“A garagem já está pronta. Eu cuido dos sistemas; você cuida da empresa. Podemos começar ajudando a Dona Lúcia a mostrar o cardápio da padaria.”',tip:'Abra o bairro, converse com ela e confira a proposta antes de aceitar.',action:'Conhecer Dona Lúcia',dest:'bakery'},
    accepted:{person:'Ana',title:'O primeiro combinado',text:'“Agora temos um cliente contando com a gente. Vou trabalhar no projeto enquanto o tempo passa. Se faltar alguma especialidade, precisamos preparar a equipe.”',tip:'Acompanhe o trabalho restante e o prazo em Contratos. Mais contratos dividem a equipe.',action:'Acompanhar contrato',dest:'contracts'},
    firstDelivery:{person:'Ana',title:'Alguém já pode contar com a gente.',text:'“Nossa primeira entrega saiu! Por trás desse pagamento tem alguém que ganhou tempo, vendeu melhor ou conseguiu organizar o dia. É por isso que estamos aqui.”',tip:'Cada entrega também gera conhecimento para pesquisa. Na jornada, acompanhe os objetivos e as recompensas dos capítulos.',action:'Ver nossa jornada',dest:'journey'},
    team:{person:'Ana',title:'Já não é uma ideia solitária.',text:'“Chegou mais alguém para construir isso com a gente. Um cargo diferente permite aceitar novos tipos de projeto. Vamos dar espaço e tempo para essa pessoa se adaptar.”',tip:'Mesa, caminho livre, capacidade de servidor e salário em dia são tão importantes quanto contratar.',action:'Conhecer a equipe',dest:'people'},
    building:{person:'Ana',title:'As caixas chegaram ao novo endereço.',text:'“Lembra da garagem? Agora temos espaço para mais ideias. Vamos conferir as contas e organizar a sede antes de aceitar tudo o que aparecer.”',tip:'A expansão também aumenta os custos. Personalize sua fachada para que os vizinhos reconheçam a empresa.',action:'Cuidar da sede',dest:'exterior'},
    product:{person:'Ana',title:'Uma ideia nossa encontrou seu público.',text:'“Este produto saiu daqui e agora faz parte do dia de outras pessoas. Publicar foi o começo: ouvir os usuários e manter tudo funcionando também faz parte.”',tip:'Acompanhe usuários, qualidade e manutenção na área de Produtos.',action:'Ver produto',dest:'products'},
    setback:{person:'Ana',title:'Vamos refazer o combinado.',text:'“Este projeto não deu certo no prazo. Não acabou a nossa história. Podemos reduzir a quantidade de contratos, cuidar da estrutura e tentar um trabalho que caiba na equipe.”',tip:'Confira as especialidades e a estimativa antes de aceitar. Projetos do bairro ficam disponíveis novamente após a espera.',action:'Rever contratos',dest:'contracts'}
  };
  const thanks={bakery:[
    '“Agora as pessoas podem ver o cardápio antes de sair de casa. Hoje uma cliente veio buscar exatamente o pão que viu por lá!”',
    '“Os pedidos pararam de se perder. Consigo conversar com os clientes em vez de passar o dia procurando anotações.”',
    '“O pão chegou a quem não consegue vir até aqui. Nunca imaginei que aquela primeira conversa fosse trazer a gente até esse ponto.”'],
    shop:[
      '“Uma pessoa de outro bairro encontrou a loja pela primeira vez. Nossa vitrine agora vai além desta rua.”',
      '“Consigo saber o que está acabando antes de vender. Hoje fechei a loja sem ficar contando tudo de novo.”',
      '“Pedidos, pagamento e estoque finalmente conversam. Posso dedicar mais tempo a escolher produtos e atender bem.”'],
    school:[
      '“As fichas já não ocupam a mesa inteira. O tempo que sobrava entre papéis agora vai para as famílias.”',
      '“Uma mãe encontrou o aviso da turma sem precisar telefonar. Parece pequeno, mas muda o dia de muita gente.”',
      '“Os materiais chegaram a alunos que nem conseguiam vir à biblioteca. Vocês ajudaram a abrir uma porta de verdade.”']};
  for(const site of District34.sites)site.stages.forEach((stage,i)=>{STORIES[site.id+':'+i]={person:site.person,title:stage.title,text:thanks[site.id][i],tip:stage.result,action:'Ver o bairro mudar',dest:site.id}});
  let campaign=null,cached=null,baseline=null,active=false,section='story',inert=[],previousFocus,signature='';
  function ensure(){
    if(campaign===G&&cached===G.story35)return cached;
    const old=G.story35||{},entries=Array.isArray(old.entries)?old.entries:[],seen=new Set();
    G.story35={version:1,entries:entries.filter(e=>e&&STORIES[e.id]&&!seen.has(e.id)&&seen.add(e.id)).map(e=>({id:e.id,day:Math.max(1,Number(e.day)||1)})),read:Array.isArray(old.read)?old.read.filter(id=>STORIES[id]):[],coachHidden:!!old.coachHidden};
    campaign=G;cached=G.story35;baseline=snapshot();return cached;
  }
  function snapshot(){return{staff:companyStaff().length,level:G.lvl,products:(G.business?.products||[]).filter(p=>p.state==='live'||p.updating).length}}
  function add(id){const s=ensure();if(!STORIES[id]||s.entries.some(e=>e.id===id))return false;s.entries.push({id,day:G.day});s.coachHidden=false;signature='';refresh();return true}
  const coach=node('aside',undefined,'story-coach35');coach.id='storyCoach35';coach.setAttribute('aria-label','Uma conversa com a equipe');$('sceneArena28').after(coach);
  const entry=button('História e ajuda',()=>open());entry.id='storyEntry35';$('sceneTop28').append(entry);
  const view=node('section');view.id='storyView35';view.hidden=true;view.setAttribute('role','dialog');view.setAttribute('aria-modal','true');view.setAttribute('aria-labelledby','storyTitle35');document.body.append(view);
  view.innerHTML='<div class="story-shell35"><header><div><small>DEVCORP / PESSOAS E POSSIBILIDADES</small><h2 id="storyTitle35">Nossa história</h2><p>Não precisa saber programar. Precisa cuidar de quem está com você.</p></div><button id="storyClose35" aria-label="Voltar ao jogo">✕</button></header><nav aria-label="História e ajuda"><button id="storyTab35">Nossa história</button><button id="guideTab35">Entenda o jogo</button></nav><div id="storyContent35"></div><footer>Empresa pausada enquanto você lê. As histórias acompanham suas entregas reais.</footer></div>';
  function portrait(name){
    const c=node('canvas',undefined,'story-portrait35');c.width=32;c.height=42;c.setAttribute('aria-hidden','true');
    const index=CLIENTS25.findIndex(c=>c.person===name),def=CLIENTS25[index],female=def&&!['delivery','horizon'].includes(def.id);
    const e=companyStaff().find(e=>e.n===name)||(def?{id:970000+index,n:name,gender:female?'f':'m',role:'pm',look:index%4*2+(female?1:0),skin:index%4}:{id:1,n:name,role:'back',look:1,skin:0});
    const a=employeeAppearance(e);
    const im=v23Ready?personCanvas23(a,0):null;if(im)c.getContext('2d').drawImage(im,0,0);return c;
  }
  function hint(){
    if(G.act.length)return{person:'Ana',title:'Um passo de cada vez.',text:'Sua equipe trabalha enquanto o tempo passa. Em Contratos, veja o prazo e a quantidade de trabalho que ainda falta.',action:'Ver contratos',dest:'contracts'};
    if(!G.done)return STORIES.welcome;
    return{person:'Ana',title:'Qual será a próxima história?',text:'O bairro tem novos problemas para resolver. Confira as propostas e escolha um projeto que caiba na sua equipe.',action:'Encontrar clientes',dest:'bakery'};
  }
  function refresh(){
    const s=ensure(),unread=s.entries.filter(e=>!s.read.includes(e.id)),latest=unread.at(-1),message=latest?STORIES[latest.id]:hint(),key=[message.title,unread.length,s.coachHidden,G.tut,ts.style.display,wl.style.display].join('|');
    coach.hidden=!G.tut||ts.style.display==='flex'||wl.style.display==='flex'||s.coachHidden;
    entry.textContent='História e ajuda'+(unread.length?' · '+unread.length:'');
    if(key===signature)return;signature=key;coach.replaceChildren();coach.append(portrait(message.person));
    const copy=node('div',undefined,'story-copy35');copy.append(node('small',message.person+' / '+(latest?'NOVO MOMENTO':'PRÓXIMO PASSO')),node('strong',message.title),node('p',message.text));
    const actions=node('div',undefined,'story-actions35');actions.append(button(message.action,()=>go(message.dest)),button('Ler história',()=>open()));copy.append(actions);coach.append(copy);
    const dismiss=button('✕',()=>{s.read=s.entries.map(e=>e.id);s.coachHidden=true;save();signature='';refresh()},'story-dismiss35');dismiss.setAttribute('aria-label','Recolher conversa');coach.append(dismiss);
  }
  function render(){
    const root=$('storyContent35');root.replaceChildren();root.scrollTop=0;
    $('storyTab35').setAttribute('aria-pressed',section==='story');$('guideTab35').setAttribute('aria-pressed',section==='guide');
    if(section==='guide'){
      const intro=node('section',undefined,'story-guide-intro35');intro.append(node('h3','Você decide. A equipe realiza.'),node('p','Escolha um pedido → prepare as especialidades → deixe a equipe trabalhar → entregue → cuide das pessoas e reinvista. Você pode pausar para pensar a qualquer momento.'),button('Conhecer os clientes do bairro →',()=>go('bakery')));root.append(intro);
      root.append(node('h3','Quem faz o quê?'),node('p','Você contrata pessoas por especialidade. Um projeto pode precisar de mais de uma. Os nomes entre parênteses são apenas os termos usados na área.'));
      const grid=node('div',undefined,'story-role-grid35');for(const[id,[label,text]]of Object.entries(ROLES)){if(!RO[id])continue;const card=node('article');card.append(node('b',label),node('p',text));grid.append(card)}root.append(grid,node('h3','Sem complicação'));
      for(const[term,definition]of TERMS){const d=node('details');d.append(node('summary',term),node('p',definition));root.append(d)}return;
    }
    const entries=ensure().entries;
    if(!entries.length){root.append(node('h3','A próxima página é sua.'),node('p','Cada entrega pode mudar o dia de alguém. Comece pela padaria ou pelos contratos da sua empresa.'),button('Conhecer Dona Lúcia →',()=>go('bakery')));return}
    root.append(node('p','Cada página guarda uma conversa e uma mudança que sua empresa ajudou a construir.','story-journal-note35'));
    for(const e of [...entries].reverse()){
      const story=STORIES[e.id],card=node('article',undefined,'story-memory35'),body=node('div');card.append(portrait(story.person));body.append(node('small','DIA '+e.day+' · '+story.person),node('h3',story.title),node('p',story.text),node('p',story.tip,'story-tip35'),button(story.action+' →',()=>go(story.dest)));card.append(body);root.append(card);
    }
  }
  function close(){if(!active)return;active=false;view.hidden=true;for(const[e,was]of inert)e.inert=was;inert=[];if(previousFocus?.isConnected)previousFocus.focus();last=performance.now();refresh()}
  function open(next='story'){
    if(liftBusy)return false;
    if(active){section=next;render();return true}
    DevJourney27.close();District34.close();Neighborhood33.close();ExteriorScene28.close();if(!personalView.hidden)closePersonalRoom();for(const e of [businessView,lifeView25,officeView])e.hidden=true;if(shOpen)shClose();
    previousFocus=document.activeElement;section=next;active=true;view.hidden=false;inert=[...document.body.children].filter(e=>e!==view&&!['SCRIPT','STYLE'].includes(e.tagName)).map(e=>[e,e.inert]);for(const[e]of inert)e.inert=true;
    const s=ensure();s.read=s.entries.map(e=>e.id);save();render();$('storyClose35').focus();return true;
  }
  function go(dest){close();if(['bakery','shop','school'].includes(dest))District34.open(dest);else if(dest==='contracts')tabOpen('ct');else if(dest==='journey')DevJourney27.open('journey');else if(dest==='people')openLife25('people');else if(dest==='exterior')openExterior();else if(dest==='products')openBusiness('products')}
  $('storyClose35').onclick=close;$('storyTab35').onclick=()=>{section='story';render()};$('guideTab35').onclick=()=>{section='guide';render()};
  view.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();e.preventDefault();close()}if(e.key==='Tab'){const all=[...view.querySelectorAll('button,summary,a,input')].filter(e=>!e.disabled&&e.getClientRects().length),first=all[0],end=all.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus()}else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus()}}});
  function scan(){ensure();const now=snapshot();if(G.tut&&baseline){if(now.staff>baseline.staff&&now.staff>=2)add('team');if(now.level>baseline.level)add('building');if(now.products>baseline.products)add('product')}baseline=now;refresh()}
  const beforePaused=paused;paused=function(){return active||beforePaused()};
  const beforeInit=init;init=function(){close();beforeInit();campaign=null;ensure();signature='';refresh()};
  const beforeUI=ui;ui=function(){beforeUI();if(!floorSimulation)scan()};
  const beforeTick=tick;tick=function(){beforeTick();scan()};
  const beforeWelcome=wgo;wgo=function(d){const completing=ws===TUT.length-1&&d===1;beforeWelcome(d);if(completing&&G.tut){add('welcome');save();refresh()}};
  const beforeAccept=accept;accept=function(id){const prior=G.act.length,result=beforeAccept(id);if(G.act.length>prior){add('accepted');save()}return result};
  const beforeDelivery=recordDelivery25;recordDelivery25=function(c){const d=c.district34,stage=d?District34.ensure().sites[d.site]?.stage:null;const result=beforeDelivery(c);if(result===false)return false;add('firstDelivery');if(d){if(District34.ensure().sites[d.site]?.stage>stage)add(d.site+':'+d.stage)}return result};
  const beforeFailure=recordClientFailure25;recordClientFailure25=function(c){beforeFailure(c);add('setback')};
  // A short, specific response closes each activity without moving its anchor.
  const beforeFinish=finishAction;finishAction=function(e){const type=e.brk?.type;beforeFinish(e);if(!type)return;const text=ACT[type]?.pose==='drink'?'Agora sim. Café e uma ideia.':ACT[type]?.pose==='read'?'Já sei por onde começar.':ACT[type]?.pose==='sit'?'Essa pausa fez diferença.':ACT[type]?.pose==='play'?'Depois eu bato esse recorde.':'Pronto. Podemos continuar.';NPCLife28.say(e,text,4)};
  // Optional animations use the same preference as the sprites, even without OS support.
  function syncMotion(){document.documentElement.classList.toggle('reduced-motion35',reducedMotion())}
  const beforeOptions=saveOpt;saveOpt=function(){const r=beforeOptions();syncMotion();return r};
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',syncMotion);
  document.addEventListener('visibilitychange',()=>{last=performance.now();personalLast=0});
  window.Story35={open,close,ensure,scan,roles:ROLES,terms:TERMS,get active(){return active}};
  ensure();syncMotion();refresh();
})();
