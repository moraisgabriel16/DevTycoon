# DevCorp V36 — 10 atlas, 40 peças

Seis coleções internas, quatro externas, quatro objetos em cada uma. PNGs RGBA, fundo transparente, perspectiva isométrica consistente e recortes pequenos para o navegador e o telefone.

| Atlas de execução | Função | Peças |
| --- | --- | --- |
| creation-atlas.png | Criação e experiência | Bancada de protótipos, carrinho de materiais, impressora de protótipos, mesa de desenho |
| focus-atlas.png | Foco, leitura e energia | Cabine de foco, poltrona de leitura, biblioteca de apoio, escrivaninha de estudo |
| social-atlas.png | Alimentação, hidratação e convívio | Estação de chá, carrinho de frutas, copa compacta, mesa de jogos |
| wellbeing-atlas.png | Bem-estar e descanso | Jardineira divisória, aquário, poltrona de descanso, estação de alongamento |
| reception-atlas.png | Receber clientes | Balcão de acolhimento, banco de espera, expositor de projetos, cabideiro |
| collaboration-atlas.png | Reuniões e planejamento | Painel de planejamento, mesa de colaboração, cavalete, estação de videochamada |
| garden-atlas.png | Vegetação e recuperação na praça | Árvore em cachepô, canteiro, cerca viva, treliça |
| plaza-atlas.png | Destinos de pausa | Banco, mesa com guarda-sol, bebedouro, banco de leitura coberto |
| circulation-atlas.png | Passagem e atalhos de navegação | Bicicletário, placa, balizadores, abrigo de chegada |
| identity-atlas.png | Identidade e iluminação | Totem da empresa, bandeira, poste duplo, escultura |

Cada folha de execução mede 192×192 pixels: duas colunas, duas linhas, células de 96×96. `manifest.json` define o retângulo exato de cada sprite e seu ponto de apoio inferior. `catalog.json` define nome, preço, ação, função, coleção e dimensões. Há 24 itens de escritório e 16 de exterior. O prédio oferece 12 pontos externos; o catálogo tem 16 opções novas para combinar nesses pontos.

As folhas `*-source.png` preservam as imagens geradas em maior resolução. As dez fontes foram produzidas com a ferramenta integrada `image_gen.imagegen`, usando `style-reference.png` como referência da pixel art do próprio jogo. Os prompts completos e o registro das fontes estão em `prompts.json`. As coleções internas reúnem peças das fontes originais por afinidade funcional; os IDs permanecem estáveis.

`npm run atlas:pack` ou `node scripts/pack-atlases-v36.cjs` recorta os quatro quadrantes das fontes, ajusta os sprites à escala nativa com vizinho mais próximo e preserva os canais RGBA. Esse passo usa Playwright e Edge instalados. Também gera `atlas-preview.png`, uma prancha de conferência das dez coleções.

Recepção e colaboração usam as visitas e reuniões já existentes, com seus requisitos e custos. Os móveis não criam ganhos passivos de produção. O exterior permanece gratuito; a vegetação concede um pequeno bônus uma vez por pausa natural, os pontos de convivência entram nas rotas e os postes têm luz noturna. Os abrigos e bicicletas oferecem acesso às visitas existentes; não implementam transporte público nem multiplayer.
