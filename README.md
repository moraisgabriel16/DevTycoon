# DevCorp V35

Jogo de gestão de uma empresa de tecnologia para navegador de computador e celular. A V35 refina a animação em pixel art e apresenta a empresa pelas histórias da equipe e dos clientes, com linguagem acessível para quem não conhece TI.

O plano de evolução, validação e lançamento está em [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md).

## Animações e histórias V35

- Caminhada em quatro tempos, guiada pela distância percorrida, no escritório, na praça, na sala e durante as visitas. Sala, clientes e limpeza agora aproveitam a distância restante ao fazer curvas, como os funcionários.
- Café, leitura, manutenção, lazer, descanso, rega, pintura e limpeza usam ciclos de seis quadros em cache. Rosto, roupa e ponto de apoio permanecem consistentes. A limpeza também usa o corpo nativo completo, sem colar uma cabeça reduzida em outro personagem.
- Gestos seguem o tempo da atividade e congelam ao pausar. Efeitos de interface, conversas e painéis têm entradas curtas; as preferências de movimento reduzido do jogo e do sistema desativam animações opcionais. A sala interrompe seu relógio quando a aba fica oculta. A ficha de uma pessoa aparece apenas na vista correspondente, preservando o toque na fachada.
- Uma introdução de três passos apresenta Ana, a equipe e o primeiro cliente sem exigir conhecimento de programação. Os cargos têm nomes explicativos, e contratos mostram especialidade, pontos de trabalho e previsão em dias úteis.
- **História e ajuda**, ao lado das vistas, abre o diário e o guia. O diário registra o primeiro combinado, entregas, chegada de pessoas, expansão, produto publicado e um revés. Cada uma das nove melhorias do bairro tem um agradecimento próprio do cliente.
- As conversas acompanham acontecimentos reais da simulação, não interrompem automaticamente a partida e podem ser recolhidas. O diário pausa a empresa ao ser aberto, preserva o foco do teclado e guarda os acontecimentos por empresa. Reler não repete recompensas.
- O guia explica cada especialidade e termos como servidor, pontos de trabalho, bug, dívida técnica e abertura de capital. As chaves internas dos cargos e os saves anteriores continuam compatíveis.

`tests/story.cjs` verifica a introdução, produção real da primeira entrega e seu agradecimento único, persistência, isolamento entre empresas, releitura, foco/pausa, 384 quadros de aparência, distância nas curvas da sala, movimento reduzido, toque em 320/390px e paisagem e carregamento offline. A validação móvel é em navegador com emulação de toque; aparelhos físicos não foram usados.

## Bairro de clientes V34

Durante a partida, abra **Bairro → Explorar bairro**, toque na padaria, loja ou escola no cenário, ou use **Central → Clientes do bairro**. A sede mantém sua personalização; os estabelecimentos passam a representar contatos reais da empresa.

O ciclo é **conversar → preparar proposta → aceitar → produzir com a equipe → entregar → ver o local melhorar**. Conversar não inicia um contrato nem desconta dinheiro. A proposta fica na lista normal e expira em 14 dias; ao aceitar, o prazo usa os dias úteis do jogo. O mapa pausa a empresa enquanto você planeja.

| Local | Contato | Etapas | Recompensas base | Primeiro contato |
|---|---|---|---|---|
| Padaria do Bairro | Dona Lúcia | Cardápio, pedidos, entregas | $650 / $1.800 / $6.200 | Desde o início |
| Vitrine Digital | Marina | Vitrine, estoque, integração | $1.100 / $3.200 / $11.000 | 2 entregas e reputação 1,5 |
| Horizonte Educação | André | Matrículas, portal, biblioteca | $1.600 / $4.800 / $15.000 | 4 entregas e reputação 2 |

- São nove melhorias finitas. Fachadas, marquises, jardins, equipamentos e detalhes dos locais evoluem com cada entrega. Cada etapa registra uma memória; as nove juntas registram o bairro concluído.
- Os projetos usam os contratos, salários, trabalho por especialidade, prazos, qualidade, multas e conhecimento existentes. Não há entrega por botão ou recompensa por abrir o mapa. O mapa bloqueia o aceite se faltarem pessoas com mesa nos cargos necessários e mostra uma estimativa nominal.
- Só um projeto do bairro pode ficar ativo de cada vez, dentro das vagas normais de contrato. A regra também se aplica ao aceite pela aba de contratos. Propostas podem ficar preparadas enquanto outro projeto termina.
- Entregas fortalecem os mesmos clientes do painel Pessoas/Clientes. Após três etapas, o contato usa o pedido de contratos já existente: no mínimo duas entregas, intervalo de sete dias e espaço entre propostas. Não é possível repetir a etapa visual para ganhar suas recompensas novamente.
- Atrasos e cancelamentos mantêm o local na etapa atual; a nova tentativa abre depois de três dias do jogo. Propostas expiradas podem ser preparadas novamente sem melhorar o local.
- Progresso e melhorias pertencem à campanha, acompanham seus arquivos de save e ficam separados entre slots. O mapa e a campanha podem ser reabertos offline após o primeiro carregamento.
- As visitas à Helena, a sala pessoal e os editores Avatar/Sala/Exterior continuam acessíveis. O bairro de clientes acrescenta a atividade comercial ao sistema de visitas da V33.

`tests/district.cjs` entrega o primeiro projeto e as nove etapas por produção real, verifica memória e conhecimento, cargos ausentes, repetição, atrasos, importação, troca de empresas, toque em 320/390px e paisagem e modo offline. Os testes usam navegador e emulação móvel; aparelhos físicos não foram validados nesta máquina.

## Vizinhos e personalização V33

Durante a partida, abra **Vizinhos** ao lado de Escritório/Bairro, ou **Central → Visitar vizinhos**. A primeira sede é **Horizonte Corp**, de Helena Horizonte: campus de nível máximo, seis andares, 72 profissionais, todas as melhorias, nove pesquisas e seis selos. Cada andar tem uma identidade e a sala pessoal apresenta a coleção de troféus.

- Explore exterior, seis andares e sala pessoal. Toque em uma face da fachada para entrar no andar correspondente. Seu avatar acompanha a visita, caminha em rotas válidas e chega à anfitriã antes de conversar. No interior, arraste para olhar ao redor e use o zoom para examinar detalhes.
- A empresa do jogador fica pausada. A visita possui dados e atores próprios; não substitui a campanha global nem transfere dinheiro, melhorias ou móveis. A visita completa rende uma memória única no álbum.
- Favoritos e referências ficam salvos por empresa. Guarde a referência de Helena e use **Usar paleta Horizonte** no seu editor de exterior; só a identidade visual é adaptada ao prédio que você já possui, sem copiar o campus ou itens bloqueados.
- **Avatar:** prévias de frente, costas e interação, quatro combinações prontas de roupa, oito visuais e controles de pele, cabelo, camiseta, calça, roupa e acessórios. Sua aparência aparece também nas visitas.
- **Sala:** modelos Estúdio de foco, Lounge acolhedor e Jardim criativo, com prévia. É possível aplicar só as cores, substituir o layout ou desfazer o último modelo nesta sessão. Só entram móveis liberados; troféus conquistados são preservados. Desfazer o layout mantém alterações posteriores do avatar. Catálogo tem busca e filtros.
- **Exterior:** três revestimentos, três marquises, seis coberturas (incluindo estufa e observatório), canteiros, cerca viva, mesas de café e três composições prontas para o jardim. As opções permanecem gratuitas e precisam de Aplicar exterior para serem salvas.
- Os três editores compartilham a navegação Avatar / Sala / Exterior. O botão Visual/Personalizar no cabeçalho abre a personalização.

**Escopo atual:** Helena é uma vizinha de demonstração incluída no jogo, disponível offline. Contas de amigos reais, convites, sincronização de sedes e encontros online ainda não estão implementados. A estrutura de visita já recebe uma empresa separada da campanha, preparando essa evolução sem expor os saves do jogador.

Os testes em `tests/neighborhood.cjs` cobrem a visita, rotas, conversa, isolamento da campanha, resgate único da memória, referências, persistência, modelos e desfazer, uso em 320/390px e paisagem e funcionamento offline. O teste de publicação em `tests/deployment.cjs` também verifica os arquivos gerados em `dist-web`. São testes em navegador e emulação de toque, sem validação em aparelhos físicos.

Para gerar a pasta completa de publicação: `npm run build`. O arquivo `vercel.json` configura a Vercel para servir `dist-web`; copie os arquivos de fonte atualizados para o repositório conectado. O build valida as dependências para evitar publicar apenas o HTML ou omitir os novos módulos.

## Central e gestão V32

- O jogo agora se chama **DevCorp**, com logo vetorial próprio, nome atualizado na abertura, cabeçalho, aplicativo instalável e exportações. Importações dos formatos DevTycoon e DevCorp continuam aceitas; os identificadores locais dos saves permanecem os mesmos.
- A Central abre na página Início: próximo capítulo, limpeza e atalhos divididos entre Pessoas, Negócios e Sede. Jornada, Pesquisa, Vitrine, Panorama e Guia têm navegação própria.
- Limpeza tem um atalho permanente com a higiene do andar, além de acesso em Contratar e na Central. A tela mostra profissionais, atribuição de andares, taxa de contratação e folha diária.
- Cada empresa recebe uma contratação de limpeza sem taxa, com salário de **$35 por dia útil**. Saves antigos sem profissionais recebem a mesma inclusão uma vez. Empresas que já têm limpeza mantêm sua equipe. Após uma dispensa, a pessoa não reaparece. Contratações seguintes custam $250 mais o salário.
- Configurações foram reconstruídas em Som, Jogo e Conforto. Há volumes independentes, pausas, autonomia, renda durante ausência, dicas, câmera, vibração e uma opção de reduzir movimento. As mudanças persistem neste navegador.
- Mesa dupla: o quadro vazio era totalmente transparente. O sprite foi restaurado no atlas original e incluído também em `assets/desk-double-empty.png`. O mesmo quadro aparece no catálogo e no escritório vazio.
- Capítulos ainda não resgatados agora concedem caixa e conhecimento. Capítulos já resgatados permanecem concluídos, sem crédito retroativo nem novo resgate. Os bônus seguem registrados após o IPO; pesquisa reinicia conforme a regra existente.

| Capítulo | Caixa | Conhecimento |
|---|---:|---:|
| Primeiro commit | $750 | 1 |
| Gente que faz acontecer | $1.800 | 2 |
| O próximo endereço | $4.000 | 2 |
| Uma ideia no mundo | $9.000 | 3 |
| Uma empresa de verdade | $22.000 | 4 |
| Um nome no horizonte | $60.000 | 5 |
| Um ecossistema | $180.000 | 7 |
| O seu legado | $500.000 | 10 |

`tests/management.cjs` verifica inclusão e migração da limpeza, dispensa persistente, recontratação, trabalho real e folha, todas as recompensas, compatibilidade dos saves, sprite no catálogo e escritório, opções persistentes, toque em 320/390px e paisagem e carregamento offline. As dimensões pequenas são emulação de navegador, não testes em aparelhos físicos.

## Estabilidade e movimento V31

- Atualizações de simulação compartilham a avaliação de risco dos contratos. Interface e salvamento são consolidados ao fim de cada atualização, mantendo a gravação do estado final.
- O bairro reutiliza uma imagem do cenário estático; personagens e decorações são compostos em uma camada com ordem de profundidade. Painéis opacos suspendem o desenho da cena atrás deles.
- Funcionários consomem o percurso disponível entre curvas, com passos ligados à distância e reaproveitamento dos sprites espelhados. A caminhada não perde distância ao atravessar uma casa em um quadro mais longo.
- Pausas externas escolhem destinos livres e usam rotas sobre a praça. Bancos, postes e a sede bloqueiam os trajetos. O personagem tem escala externa menor e vira conforme a direção real do caminho.
- Um pedido de café feito na praça aguarda a caminhada de retorno à entrada antes de iniciar a interação no escritório.

Diagnóstico, medições e proposta para definir a mecânica do bairro estão em [docs/BAIRRO_E_POLIMENTO.md](docs/BAIRRO_E_POLIMENTO.md). A proposta de novos clientes no mapa ainda não foi implementada.

## Abertura V30

- A abertura atual usa o logo transparente de DevCorp em `assets/devcorp-logo.svg`; a ilustração da V30 permanece nos assets como referência histórica.
- Frase principal: **Comece na garagem. Cresça com cada entrega.** Texto de apoio: **Contrate sua equipe, entregue projetos e construa a sede do seu jeito.**
- Menu com começar/continuar, nova empresa, carregar empresa, demo, opções e ajuda. A instalação aparece quando oferecida pelo navegador.
- Jornada, sala pessoal e personalização externa ficam nos controles da partida. Os controles da empresa ao fundo ficam inativos enquanto o menu está aberto.
- Nova empresa procura um slot livre e pede a dificuldade; abrir o menu de saves não substitui a empresa atual.
- `tests/title.cjs` verifica os fluxos de entrada, retorno das opções, preservação dos saves, acesso às ferramentas na partida e logo offline, além de telas de 498, 390 e 320px.

A arte foi criada com o ImageGen integrado; o prompt completo está em `assets/v30/logo-prompt.json`.

## Direção visual V29

- Personagens e móveis voltam aos sprites pixelados originais do jogo. As interações continuam usando a mesma pessoa e suas cores; os dois atlases gerados da V28 permanecem como arquivos históricos e não são carregados pelo jogo.
- O bairro é um cenário contínuo, com ruas, calçadas, faixa de pedestres, arquitetura vizinha, árvores e detalhes de fachada. O exterior é desenhado em uma superfície de 480 × 360 e ampliado sem suavização.
- A cobertura de terraço recebe um guarda-sol octogonal proporcional, com suporte e gomos. A garagem ganha porta de enrolar, e as fachadas recebem alvenaria, peitoris, toldo e equipamento de climatização.
- A interface usa grafite, papel e ocre, botões compactos, navegação com ícones vetoriais uniformes e textos operacionais. A lista de equipe mostra atividade e condições reais, com atualização durante a simulação.
- A câmera externa preenche a área do jogo e permanece centralizada no celular. Os pontos de toque acompanham a projeção e o zoom.

Detalhes e critérios de verificação em [docs/ART_DIRECTION_V29.md](docs/ART_DIRECTION_V29.md).

## Correções V28.1

- Interações de café, inspeção, leitura, jogos e descanso usam o corpo inteiro do personagem atual. A aparência não é mais sobreposta a um corpo antigo; as poses compartilham escala e ponto de apoio dos pés.
- Barras de ação ficam acima da cabeça; o descanso se alinha ao assento.
- Paredes contínuas, cantos sólidos, rodapés e janelas em perspectiva substituem os recortes por casa no escritório e na sala pessoal. As peças usadas nas prévias também têm projeção isométrica correta.
- A atualização do cache offline pode ativar sem fechar todas as abas. Recarregue a página para carregar o código novo; os saves são preservados.
- `tests/visual-fixes.cjs` verifica a aparência em 80 poses, as paredes dos seis temas e o percurso completo de seis interações até a volta à mesa.

## Novidades V28

- **Cenário em destaque:** HUD compacto, navegação lateral no computador e gestão em gaveta no celular, com paleta e tipografia renovadas.
- **Escritório e exterior:** troque entre as duas vistas. A fachada usa a personalização salva na campanha; toque em um andar do prédio para entrar pelo elevador.
- **Novos sprites:** oito personagens com quatro poses e oito objetos de escritório/praça, em atlases originais. Pisos, paredes e prévias seguem uma direção visual mais limpa.
- **Pessoas em contexto:** toque em um funcionário ou no retrato da faixa da equipe para conhecer a atividade, ver necessidades, pedir café, acompanhar ou abrir o perfil.
- **Pausas ao ar livre:** a pessoa caminha até a saída, aparece na praça e volta para sua mesa. Durante a pausa, não produz. O passeio pode recuperar necessidades, criar memórias e aproximar colegas.
- **Feedback e construção:** falas contextuais, transições entre vistas, moedas voltadas para o HUD e prévia de objeto ao apontar para uma casa na construção.
- **Mais espaço para decidir:** capacidade e qualidade ficam em resumos expansíveis; salários e gestão completa permanecem na aba Equipe. Eventos e decisões têm acesso na central.

A análise e as decisões de UX/UI estão em [docs/UX_UI_REVIEW_V28.md](docs/UX_UI_REVIEW_V28.md). O menu Mais nas telas menores reúne os atalhos adicionais. A instalação PWA, quando oferecida pelo navegador, fica disponível na tela inicial pelo menu do jogo.

## Novidades V27

- **Central da empresa:** Jornada, Pesquisa, Vitrine, Panorama e Guia. Também dá acesso a produtos, departamentos, pessoas, clientes, limpeza, sala pessoal, álbum, exterior e automação. O tempo fica pausado enquanto você planeja.
- **Oito capítulos:** objetivos concretos da primeira entrega ao Campus e IPO, com indicadores, atalhos e recompensas únicas. Os marcos alcançados ficam registrados; a trajetória continua depois do IPO.
- **Nove pesquisas:** três trilhas, com pré-requisitos. Cada contrato entregue após a atualização gera dois conhecimentos. A árvore completa custa 39. Capítulos também concedem conhecimento a partir da V32; não há ganho por calendário, recarga ou tempo offline. Produção de contratos recebe no máximo +9,2% pelas pesquisas; novas propostas recebem até +8%. Pesquisas reiniciam no IPO, como parte da nova empresa.
- **Seis projetos de vitrine:** escopos preparados para testar combinações de especialidades. Um projeto por vez, em uma vaga normal de contrato. Há estimativa nominal antes de assumir. Os selos ficam no portfólio e no álbum; um selo desbloqueia um estandarte e três desbloqueiam uma escultura para o exterior. Depois de uma falha, o projeto pode ser tentado novamente após três dias do jogo.
- **Panorama:** gráfico do caixa real dos últimos trinta dias, receitas recorrentes, problemas de infraestrutura e atalhos para resolver o próximo gargalo.
- **Abertura mais justa:** a primeira entrega do Site da Padaria não recebe multa aleatória por bugs. Depois disso, qualidade, QA, pesquisas e dívida técnica continuam importando.
- **Robustez:** comandos inválidos/repetidos são ignorados, negociação limitada a uma por proposta, autosave com o tempo pausado, validação adicional de importações, exterior preservado no IPO e opções de recuperação na falência.

Os capítulos e o portfólio são preservados no IPO; pesquisas e operações recomeçam. Os três slots mantêm seus estados independentes. Esta atualização aceita campanhas existentes sem creditar conhecimento retroativo.

## Jogar no computador

Com Node.js instalado, abra `Jogar.cmd` ou execute `npm start` nesta pasta. Acesse http://localhost:4280. Não é necessário instalar dependências para jogar. Mantenha a janela do servidor aberta.

Também é possível abrir `index.html` diretamente, mas instalação e modo offline precisam do servidor ou de hospedagem HTTPS. Os saves pertencem ao navegador e ao endereço utilizado. Use **Minhas empresas → Exportar / Importar** para transferir campanhas entre dispositivos ou endereços.

## Jogar no celular

Conecte o celular ao mesmo Wi-Fi do computador e abra o endereço **Celular na mesma rede** exibido pelo servidor, por exemplo `http://192.168.1.2:4280`. O servidor precisa continuar aberto. Se o Windows solicitar acesso à rede, permita na rede privada para tornar o jogo acessível pelo telefone.

Para jogar pela internet e instalar como aplicativo, publique os arquivos de produção em uma hospedagem estática com HTTPS. O arquivo `DevCorp-Web.zip` contém o pacote pronto para hospedagem. Ainda não foi publicado em um endereço público.

No Android, use **Instalar jogo** no menu inicial quando o navegador disponibilizar essa opção ou use o menu de instalação do navegador. No iPhone, use **Compartilhar → Adicionar à Tela de Início** no Safari. A instalação depende do suporte do navegador; não é um aplicativo de loja.

O modo offline funciona após o primeiro carregamento completo via HTTPS ou localhost. O acesso por IP local em HTTP permite jogar, mas não ativa o Service Worker nem a instalação PWA. A fonte online é opcional: sem conexão, o jogo usa a fonte local do sistema.

## Exterior dos prédios

Durante a partida, use o botão de personalização no cabeçalho, **Personalizar sede** no bairro ou **Exterior da sede** na Central.

- **Fachada:** oito cores de parede, seis cores de detalhes e quatro opções de vidro.
- **Cobertura:** terraço, jardim, painéis solares ou antena.
- **Jardim:** doze posições para árvores, floreiras, bancos, postes, bicicletas, fontes e peças desbloqueadas pela vitrine. Selecione um item e toque nos círculos da calçada. No celular, selecionar um item traz a prévia de volta à tela.
- **Identidade:** letreiro de até 22 caracteres e três combinações iniciais.
- Alterne dia/noite, ajuste o zoom e baixe uma foto PNG da sede.

Use **Aplicar exterior** para salvar. Fechar descarta a prévia ainda não aplicada. Cada prédio adquirido guarda sua configuração em cada campanha, inclusive no arquivo exportado. Os prédios futuros podem ser visualizados; salvá-los exige comprá-los na Loja. As mudanças externas são gratuitas e cosméticas. O tempo da empresa fica pausado durante a personalização.

## Arquivos e validação

`index.html` contém o jogo original e suas artes incorporadas, com um ajuste de justiça na primeira entrega. `exterior.js` e `exterior.css` fornecem o editor e o renderer externo compartilhado. `research.js`, `gameplay-fixes.js`, `progression.js` e `progression.css` implementam a evolução V27. `art-v28.js`, `npc-life-v28.js`, `studio-v28.js`, `studio-v28.css` e `assets/v28/` implementam a nova apresentação e a sede viva. `management-v32.js` e `management-v32.css` fornecem a gestão da limpeza e as configurações reconstruídas. `manifest.webmanifest`, `pwa.js`, `sw.js` e `icons/` fornecem os recursos PWA. `server.cjs` inicia o servidor local sem dependências.

Para os testes: `npm install`, instale o Chromium com `npx playwright install chromium` se necessário, e execute `npm test`. Os testes também podem usar Microsoft Edge instalado. Verificam os exteriores, persistência, isolamento dos slots, importação, comandos repetidos, primeira entrega, pesquisas e bônus, capítulos, projetos, recompensas, IPO, toque e modo offline. A V28 acrescenta testes de sprites, fachada/andares, seleção de pessoas, passeio real, retorno e recuperação ao recarregar. Os relatórios ficam em `tests/results.json`, `tests/progression-results.json` e `tests/studio-results.json`.

`node tests/balance.cjs` executa uma campanha prudente de oitenta dias com semente fixa, relógio virtual e atores reais. O relatório em `tests/balance-results.json` registrou cinco entregas, quatro funcionários de produção, cinco pesquisas, três capítulos concluídos e $3.513 em caixa, com a limpeza incluída na folha e sem erros. Essa amostra verifica a abertura e o primeiro projeto especial; não pretende provar o equilíbrio de todas as estratégias ou do fim de jogo.

As verificações foram automatizadas em Chromium/Edge, com viewport móvel de 390 × 844 e eventos reais de toque do navegador. A instalação em um aparelho físico iOS/Android não foi validada nesta máquina. O mapa das mecânicas está em `docs/MECHANICS.md`.
