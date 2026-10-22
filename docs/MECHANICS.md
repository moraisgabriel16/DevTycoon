# Mapa de mecânicas — DevTycoon V28

## Ciclo de jogo

O calendário usa dias simulados de cinco segundos nas velocidades normal e tripla. A empresa recebe propostas, aloca as especialidades disponíveis, entrega trabalho e paga salários e aluguel. O jogador investe o excedente em pessoas, infraestrutura, melhorias, prédios, filiais e produtos. Fins de semana podem ser folga ou trabalho extraordinário. Abrir os planejadores pausa a simulação.

Na V28, escritório e exterior são vistas da mesma campanha. A pessoa selecionada mantém ID, nome, aparência, mesa, necessidades e histórias ao passear pela praça. A vista externa continua a simulação; o editor de fachada continua pausando. O novo estado dos passeios fica em `e.life28` e acompanha o save. A revisão de apresentação e interação está em `UX_UI_REVIEW_V28.md`.

## Sistemas preservados do HTML

| Sistema | Regras e decisões principais |
| --- | --- |
| Contratos | Escopos por cargo, prazos, proposta expira, negociação única, prioridades, abandono, multas, bugs, contratos urgentes/premium/recorrentes. |
| Pessoas | Salários, inflação, promoções, skill, XP, humor, crunch, necessidades, gênero/aparência, personalidades, ambições, memória e vínculos. |
| Escritório | Mesas, caminhos livres, capacidade de servidores, quedas, objetos com efeitos, ações manuais, rotinas, layouts e limpeza. |
| Andares | Elevador, transferências de equipe, decoração por andar e departamentos especializados. |
| Crescimento | Seis prédios, filiais, aquisições, serviços de apoio e automação com condições configuráveis. |
| Economia | Receitas de contratos e rendas recorrentes, salários, aluguel, juros, impostos operacionais, empréstimos, margem de falência e IPO. |
| Produtos | Ferramenta dev, SaaS e jogo mobile; alocação de capacidade, desenvolvimento, publicação, versões, qualidade, preços, marketing, usuários e churn. |
| Histórias | Clientes, confiança, visitas, reuniões, eventos com decisões, notícias e álbum. |
| Metas | Nove conquistas, missões periódicas e desafios opcionais de estratégia. |
| Personalização | Sala pessoal, avatar, troféus e exterior por prédio, com fotografia em PNG. |
| Continuidade | Três campanhas, importar/exportar JSON, renda offline conservadora e PWA. |

## Integração da nova campanha

`G.journey27` contém capítulos resgatados, picos de marcos alcançados, histórico e estado dos seis projetos especiais. Os marcos incluem entregas, pessoas com mesa, humor, sede, pesquisas, produtos, usuários, reputação, vitrine e IPO. São registrados a partir dos estados reais do jogo; a interface não concede progresso apenas ao abrir uma janela.

As recompensas dos capítulos são pagas uma vez por trajetória. Não há recompensa por retornar em dias consecutivos nem obrigação de entrar em horários reais. Os prazos dos projetos especiais só começam depois de uma escolha do jogador e usam as regras dos contratos existentes.

`G.research27` contém pontos e pesquisas concluídas. Dois pontos são concedidos pela diferença real no contador de entregas durante `tick`; nenhum ponto é concedido por entregas antigas ou por apenas avançar dias. Os bônus envolvem os caminhos reais de produção, qualidade, geração de propostas e aquisição dos produtos. Pesquisas não afetam propostas já emitidas.

Os selos da vitrine são registrados no momento da entrega real, via `recordDelivery25`. Atrasos e abandono registram falha e uma espera de três dias simulados. Projetos concluídos não podem ser repetidos para gerar dinheiro. As decorações de um e três selos integram o editor externo existente.

## Continuidade e migração

Os novos estados ficam dentro de `G`, portanto acompanham os três slots e o JSON exportado. Campanhas antigas começam sem pesquisa retroativa. A trajetória, coleção, aparência e sala pessoal são preservadas no IPO; a nova operação reinicia as pesquisas. Um projeto ainda ativo no momento do IPO é liberado para uma futura tentativa, evitando um registro órfão.

As importações verificam os campos originais e também os produtos, seus estados, tipos, alocação e cargos dos contratos. A gravação ocorre após ações, com debounce de 300 ms, e em `pagehide`, além dos saves do loop diário. Um callback antigo não pode gravar em outra campanha depois de trocar de slot.

## Verificação

- Regressão dos exteriores, toque e modo offline: `tests/game.cjs`.
- Comandos, negociação, importação, autosave, IPO e recuperação: `tests/fixes.cjs`.
- Campanha, pontos, efeitos de pesquisa, vitrine, selos, capítulos, IPO e layout: `tests/progression.cjs`.
- Simulação de oitenta dias com movimentos e produção reais: `tests/balance.cjs`.
- Sprites, integração entre vistas, andares e passeios dos NPCs: `tests/studio.cjs`.

As estimativas de capacidade são nominais. Pausas, deslocamentos, qualidade, eventos e decisões futuras podem mudar o resultado. A simulação de equilíbrio cobre uma estratégia inicial prudente; não substitui sessões humanas em todas as estratégias e aparelhos.
