# DevTycoon V30

Jogo de gestão de uma empresa de tecnologia para navegador de computador e celular. A V29 unifica a apresentação em pixel art e interface de tycoon, preservando a campanha, a personalização e a conexão entre escritório e praça.

O plano de evolução, validação e lançamento está em [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md).

## Abertura V30

- Logo ilustrado em pixel art, com garagem e computador, em `assets/v30/devtycoon-logo.png`. O arquivo tem transparência e é incluído no cache offline.
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
- **Nove pesquisas:** três trilhas, com pré-requisitos. Cada contrato entregue após a atualização gera dois conhecimentos. A árvore completa custa 39. Não há ganho de conhecimento por calendário, recarga ou tempo offline. Produção de contratos recebe no máximo +9,2% pelas pesquisas; novas propostas recebem até +8%. Pesquisas reiniciam no IPO, como parte da nova empresa.
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

Para jogar pela internet e instalar como aplicativo, publique os arquivos de produção em uma hospedagem estática com HTTPS. O arquivo `DevTycoon-Web.zip` contém o pacote pronto para hospedagem. Ainda não foi publicado em um endereço público.

No Android, use **Instalar jogo** no menu inicial quando o navegador disponibilizar essa opção ou use o menu de instalação do navegador. No iPhone, use **Compartilhar → Adicionar à Tela de Início** no Safari. A instalação depende do suporte do navegador; não é um aplicativo de loja.

O modo offline funciona após o primeiro carregamento completo via HTTPS ou localhost. O acesso por IP local em HTTP permite jogar, mas não ativa o Service Worker nem a instalação PWA. A fonte online é opcional: sem conexão, o jogo usa a fonte local do sistema.

## Exterior dos prédios

Abra **Personalizar exterior** na tela inicial ou **Exterior dos prédios** acima do escritório.

- **Fachada:** oito cores de parede, seis cores de detalhes e quatro opções de vidro.
- **Cobertura:** terraço, jardim, painéis solares ou antena.
- **Jardim:** doze posições para árvores, floreiras, bancos, postes, bicicletas, fontes e peças desbloqueadas pela vitrine. Selecione um item e toque nos círculos da calçada. No celular, selecionar um item traz a prévia de volta à tela.
- **Identidade:** letreiro de até 22 caracteres e três combinações iniciais.
- Alterne dia/noite, ajuste o zoom e baixe uma foto PNG da sede.

Use **Aplicar exterior** para salvar. Fechar descarta a prévia ainda não aplicada. Cada prédio adquirido guarda sua configuração em cada campanha, inclusive no arquivo exportado. Os prédios futuros podem ser visualizados; salvá-los exige comprá-los na Loja. As mudanças externas são gratuitas e cosméticas. O tempo da empresa fica pausado durante a personalização.

## Arquivos e validação

`index.html` contém o jogo original e suas artes incorporadas, com um ajuste de justiça na primeira entrega. `exterior.js` e `exterior.css` fornecem o editor e o renderer externo compartilhado. `research.js`, `gameplay-fixes.js`, `progression.js` e `progression.css` implementam a evolução V27. `art-v28.js`, `npc-life-v28.js`, `studio-v28.js`, `studio-v28.css` e `assets/v28/` implementam a nova apresentação e a sede viva. `manifest.webmanifest`, `pwa.js`, `sw.js` e `icons/` fornecem os recursos PWA. `server.cjs` inicia o servidor local sem dependências.

Para os testes: `npm install`, instale o Chromium com `npx playwright install chromium` se necessário, e execute `npm test`. Os testes também podem usar Microsoft Edge instalado. Verificam os exteriores, persistência, isolamento dos slots, importação, comandos repetidos, primeira entrega, pesquisas e bônus, capítulos, projetos, recompensas, IPO, toque e modo offline. A V28 acrescenta testes de sprites, fachada/andares, seleção de pessoas, passeio real, retorno e recuperação ao recarregar. Os relatórios ficam em `tests/results.json`, `tests/progression-results.json` e `tests/studio-results.json`.

`node tests/balance.cjs` executa uma campanha prudente de oitenta dias com semente fixa, relógio virtual e atores reais. O relatório em `tests/balance-results.json` registrou sete entregas, quatro funcionários, cinco pesquisas, três capítulos concluídos e saldo positivo, sem erros. Essa amostra verifica a abertura e o primeiro projeto especial; não pretende provar o equilíbrio de todas as estratégias ou do fim de jogo.

As verificações foram automatizadas em Chromium/Edge, com viewport móvel de 390 × 844 e eventos reais de toque do navegador. A instalação em um aparelho físico iOS/Android não foi validada nesta máquina. O mapa das mecânicas está em `docs/MECHANICS.md`.
