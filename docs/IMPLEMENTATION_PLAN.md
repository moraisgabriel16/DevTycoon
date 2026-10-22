# Plano de implementação — DevTycoon

Data: 22 de outubro de 2026. Base analisada: V27.

## 1. Objetivo e premissas

Transformar a versão atual em um jogo de gestão que as pessoas entendam, queiram continuar e tenham vontade de recomendar. **Prioridade confirmada pelo usuário: atrair jogadores e fazer eles voltarem.** A decisão comercial vem depois dessa validação.

Na revisão de cada versão, priorizar: compreensão da primeira sessão, vontade de continuar a campanha, retorno em outra sessão e recomendação espontânea. Acessos e duração de sessão devem ser analisados junto desses sinais. O retorno deve vir do interesse pelos objetivos, escolhas e resultados do jogo; não exige sequências obrigatórias de login nem punições por ficar ausente.

**Promessa do jogo:** construa uma empresa de tecnologia com pessoas marcantes, produtos que ganham o mundo e uma sede que tenha a sua cara.

**Público inicial proposto:** jogadores de tycoon e gestão que preferem sessões de 10–25 minutos, em navegador ou telefone. Começar com comunicação e testes em português; preparar textos para tradução e testar inglês quando o ciclo principal estiver validado.

**Modelo inicial de acesso:** beta gratuita em navegador, com HTTPS e PWA. A escolha entre jogo pago, expansão ou cosméticos depende de evidências de interesse e disposição a pagar.

**Horizonte de referência:** seis etapas, aproximadamente 12–14 semanas, para uma equipe pequena com disponibilidade regular e apoio pontual de arte, áudio e testes. É uma estimativa de planejamento, a revisar ao terminar a primeira etapa. Disponibilidade, tamanho da equipe e orçamento ainda não foram definidos; os critérios de avanço têm precedência sobre as datas.

Não há garantia de sucesso por adicionar funcionalidades. A cada etapa, decidir entre avançar, corrigir ou reduzir o escopo com base no comportamento dos jogadores.

## 2. Ponto de partida

Já existem contratos, funcionários, necessidades, vínculos, clientes, produtos, departamentos, limpeza, eventos, filiais, seis prédios, IPO, três campanhas e importação/exportação. A V27 acrescentou oito capítulos, nove pesquisas, seis projetos especiais e uma central. Os exteriores permitem identidade visual e fotografias da sede.

Há 29 verificações automatizadas nos três conjuntos principais. Uma campanha com semente fixa chegou ao dia 80 com sete entregas, quatro pessoas, cinco pesquisas e três capítulos concluídos, sem erros JavaScript observados.

Ainda precisam ser validados: entendimento por jogadores novos, retorno entre sessões, aparelhos físicos, estratégias diferentes, publicação de produtos em partidas completas e economia até Campus/IPO. O HTML principal ainda concentra regras e assets; as extensões dependem de uma cadeia de substituições de funções globais.

## 3. Experiência que queremos entregar

O ciclo central deve ser fácil de reconhecer:

**Escolher uma oportunidade → preparar a equipe → tomar decisões → ver o resultado → melhorar a empresa → encontrar uma nova possibilidade.**

Três escalas de objetivo:

| Escala | Experiência pretendida | Exemplos |
| --- | --- | --- |
| Minutos | Uma escolha e um resultado compreensível | Primeira entrega, pesquisa, móvel, contratação |
| Uma sessão | Um avanço que muda a empresa | Produto publicado, projeto especial, sede renovada |
| Várias sessões | Uma trajetória que vale continuar | Especialização, novos endereços, portfólio e legado |

Os personagens e o escritório devem mostrar o efeito das decisões. Uma melhoria de qualidade pode gerar uma fala da equipe e mudar uma avaliação; uma conquista pode transformar a sede e produzir uma imagem compartilhável.

## 4. Sequência de implementação

| Etapa | Referência | Entrega principal | Condição para avançar |
| --- | --- | --- | --- |
| 1. Base confiável | Semanas 1–2 | Build reproduzível, saves protegidos, medição e primeira versão privada online | Migração e atualização testadas; eventos verificáveis |
| 2. Primeira sessão | Semanas 2–3 | Primeiros dez minutos claros e satisfatórios | Jogadores novos avançam sem orientação do desenvolvedor |
| 3. Produtos e lançamentos | Semanas 4–6 | Um ciclo completo de criação, lançamento e melhoria | Escolhas geram consequências que os jogadores entendem |
| 4. Identidade e rejogabilidade | Semanas 7–8 | Sede mais presente, personagens visíveis e estratégias distintas | Interesse em personalizar e experimentar outra campanha |
| 5. Campanha e celular | Semanas 9–10 | Economia até o IPO, recuperação de falhas e qualidade em aparelhos físicos | Ausência de bloqueios críticos na matriz de testes |
| 6. Beta e lançamento gradual | Semanas 11–14 | Beta ampliada, página pública, divulgação e decisão comercial | Retorno, estabilidade e feedback sustentam expansão |

Os testes com pessoas começam na etapa 2 e continuam ao longo do desenvolvimento. A divulgação ampla acontece depois das correções identificadas na beta.

### Etapa 1 — Base confiável e medição

**Implementação**

1. Criar uma versão de referência e um comando que gere o pacote de distribuição, com versão, lista de arquivos e verificação de dependências.
2. Extrair gradualmente dados de conteúdo, persistência e regras para módulos. Preservar o comportamento e os testes existentes durante a mudança.
3. Introduzir comandos explícitos para ações importantes e eventos para entrega, contratação, lançamento, capítulo e mudança de sede. Novos sistemas passam a usar esses pontos de integração.
4. Versionar os saves e manter exemplos reais das versões anteriores para testes de migração. Adicionar backup anterior à migração e recuperação visível para arquivos incompatíveis.
5. Validar atualização da PWA com campanha aberta, recarga, conexão interrompida e reabertura offline. Uma atualização não deve misturar regras e dados incompatíveis.
6. Implementar telemetria mínima com um adaptador substituível: saída local para desenvolvimento e envio para o serviço escolhido na beta. O jogo continua funcionando offline se esse envio falhar.
7. Preparar um endereço privado HTTPS para testes externos, com versão identificável e feedback simples. Publicação depende da escolha de hospedagem e acesso à conta.

**Critérios de conclusão**

- Uma campanha de cada versão de save suportada carrega, salva e pode ser exportada novamente.
- Recompensas e compras repetidas não duplicam efeitos; troca de slot não grava na campanha errada.
- A versão distribuída é gerada por comando e pode ser reproduzida a partir do código.
- Cada evento de medição tem definição, versão e teste; não inclui nome de empresa, texto digitado nem conteúdo dos saves.

### Etapa 2 — Os primeiros dez minutos

**Implementação**

1. Substituir explicações longas por ações guiadas no próprio escritório, com ajuda opcional e retomável.
2. Apresentar a primeira entrega, segunda pessoa, uma melhoria visual e a primeira pesquisa em sequência compreensível. Medir a ordem que funciona melhor.
3. Mostrar somente as informações necessárias para a próxima decisão e revelar sistemas conforme o jogador ganha contexto.
4. Explicar antes da confirmação o custo de contratar, a disponibilidade de mesa/servidor e o impacto de assumir mais trabalho.
5. Dar destaque visual à conclusão do primeiro contrato e à transformação da sede, com opção de reduzir animações.
6. Ajustar o ritmo para reduzir espera sem decisão, preservando espaço para planejamento. A velocidade escolhida pelo jogador deve ser considerada na análise.

**Teste com pessoas**

- Duas rodadas de 5–8 jogadores novos, observados sem instruções durante a partida.
- Perguntas ao final: o que você está tentando fazer, por que aceitou esse contrato, o que mudou após a entrega e o que gostaria de fazer agora?
- Registrar quando a pessoa procura ajuda, perde o objetivo, espera sem agir ou não percebe o efeito de uma decisão.

**Critérios de conclusão**

- Pelo menos 8 em cada 10 participantes da rodada conseguem entregar o primeiro contrato sem ajuda verbal. É uma meta interna de usabilidade, com amostra pequena.
- Primeira entrega com mediana de até 3 minutos em condições normais de teste; revisar o alvo após a primeira rodada.
- Pelo menos 7 em cada 10 conseguem explicar o próximo objetivo e uma consequência das próprias escolhas.
- Nenhum jogador perde progresso por seguir o fluxo esperado.

### Etapa 3 — Produtos que contam uma história

**Implementação**

1. Começar pela ferramenta dev já existente e entregar uma experiência completa antes de ampliar as outras categorias.
2. Permitir escolher público, proposta de valor e duas ou três funcionalidades relevantes. Exibir o impacto previsto em esforço, custo, qualidade e manutenção.
3. Criar um briefing compreensível: o público valoriza determinadas características e tolera diferentes preços ou limitações.
4. Integrar decisões de escopo e testes ao desenvolvimento, reaproveitando alocação de equipe, especialistas e dívida técnica.
5. Construir o lançamento: anúncio, avaliação inicial, aquisição e comentários dos usuários ligados às decisões tomadas.
6. Permitir responder ao feedback com uma atualização. O jogador deve conseguir formular uma hipótese, mudar o produto e ver o resultado.
7. Adaptar SaaS e jogo mobile com diferenças próprias depois que esse ciclo funcionar. Evitar três catálogos com o mesmo comportamento e números diferentes.

**Regra de design**

Uma avaliação precisa ser explicável. Exemplo: o produto recebeu boa avaliação de confiabilidade porque houve investimento em testes, mas perdeu adoção pelo preço alto para aquele público. Aleatoriedade pode variar os resultados; as decisões precisam ter peso perceptível.

**Critérios de conclusão**

- Pelo menos três configurações têm vantagens e desvantagens observáveis; nenhuma domina todos os cenários de teste.
- A interface explica os principais fatores do lançamento.
- Jogadores de teste conseguem relacionar uma decisão ao resultado e escolher uma melhoria para a próxima versão.
- O fluxo criar → desenvolver → publicar → receber feedback → atualizar funciona com saves e offline.

### Etapa 4 — Identidade, pessoas e vontade de recomeçar

**Implementação**

1. Dar mais presença ao exterior: transições de capítulo, chegada à sede, celebrações e visita ao escritório a partir da fachada.
2. Acrescentar uma apresentação de cidade com poucos locais selecionáveis. Começar com mapa ilustrado e dois ou três contextos de sede; não implementar um mundo aberto nesta etapa.
3. Integrar bairros ou endereços às escolhas de gestão com vantagens compreensíveis, sem tornar uma opção obrigatória.
4. Tornar personalidades, ambições e vínculos existentes mais visíveis por falas curtas e acontecimentos ligados ao trabalho.
5. Diferenciar as especializações existentes por condições iniciais, oportunidades e objetivos. Testar duas estratégias completas primeiro.
6. Evoluir a fotografia em PNG para um cartão de conquista com sede, marco e nome da empresa. Compartilhamento é opcional e controlado pelo jogador.
7. Criar uma pequena biblioteca visual consistente: fachadas, sinalização, personagens, objetos e efeitos. Documentar autoria/licenças dos assets destinados à distribuição.

**Critérios de conclusão**

- Escolher outra especialização muda decisões importantes na primeira sessão.
- Participantes reconhecem sua sede e percebem ao menos uma mudança conquistada.
- Existe um motivo claro para começar outra empresa além de repetir números maiores.
- Cartões exportados são legíveis em tela de telefone e não exigem uma conta para serem gerados.

### Etapa 5 — Equilíbrio até o IPO e qualidade no telefone

**Implementação e testes**

1. Construir cenários de teste para empresa prudente, crescimento acelerado, foco em produtos e crise de caixa. Manter cenários com sementes reproduzíveis.
2. Rodar pelo menos 30 sementes para cada estratégia automatizada de referência. Isso serve para detectar anomalias; completar com partidas humanas até os marcos finais.
3. Testar atrasos, demissões, ausência de candidatos necessários, produtos sem equipe, despesas altas, mudanças de andar e recuperação após decisões ruins.
4. Revisar retornos de contratos, produtos e filiais para manter escolhas viáveis. Ajustar gargalos que tornem uma estratégia obrigatória ou o avanço irreversivelmente bloqueado.
5. Validar os seis projetos especiais com equipes apropriadas e inadequadas, comparando a estimativa apresentada com os resultados.
6. Revisar Campus, IPO e reinício: confirmar quais conquistas permanecem e apresentar uma escolha de legado que mude a próxima campanha.
7. Testar aparelhos físicos: Android de entrada, Android intermediário e iPhone. Cobrir navegador e instalação PWA quando disponível.
8. Incluir teclado, foco, contraste, tamanho de texto e redução de movimento na matriz de qualidade.

**Matriz mínima de aparelho**

- Tela estreita, orientação retrato e paisagem; abertura do teclado e áreas seguras.
- Bloqueio de tela, troca de aplicativo, retorno depois de horas e interrupção de áudio.
- Primeira abertura online, perda de conexão, reabertura offline e atualização posterior.
- Save, exportação, importação, armazenamento indisponível e recuperação do último backup válido.
- Escritório cheio, vários andares, animações e painéis simultâneos.

**Critérios de conclusão**

- Zero problemas conhecidos que percam saves, paguem recompensas em duplicidade ou bloqueiem a campanha sem saída.
- Estratégias de referência alcançam seus marcos; falhas têm causas identificáveis. Não é necessário que todas tenham a mesma facilidade ou retorno.
- Meta de desempenho: pelo menos 30 FPS sustentados no aparelho de entrada de referência e 60 FPS nos aparelhos de maior capacidade, com opções de redução visual.
- Meta inicial de abertura: jogo interativo em até 5 segundos na configuração de rede e aparelho registrada no teste. O alvo será revisado com medição real.

### Etapa 6 — Beta, divulgação e lançamento gradual

**Beta fechada**

1. Reunir 30–50 participantes de perfis próximos ao público proposto.
2. Manter a versão por tempo suficiente para observar retorno no dia seguinte e após sete dias.
3. Corrigir os maiores pontos de abandono por gravidade e frequência. Reavaliar quando uma mudança alterar economia ou onboarding.

**Beta ampliada**

1. Abrir para 100–300 jogadores, registrando origem do acesso, versão e dispositivo em grupos amplos.
2. Preparar página com promessa clara, imagens reais e vídeo curto mostrando uma transformação da empresa e um lançamento de produto.
3. Publicar a versão web em HTTPS; usar itch.io como canal adicional se o teste do jogo incorporado funcionar bem. Não depender de login para a primeira partida.
4. Compartilhar bastidores e resultados em comunidades compatíveis com gestão, tycoon e desenvolvimento de jogos, respeitando as regras de cada comunidade.
5. Preparar um pequeno kit para criadores: descrição, imagens, vídeo, controles, tempo sugerido para a primeira sessão e contato.
6. Observar quais publicações trazem pessoas que efetivamente jogam e voltam. Separar acessos e visualizações de engajamento no jogo.

**Critérios de lançamento**

- Não há problemas críticos abertos e existe caminho para restaurar a versão anterior da distribuição.
- A página, o jogo e a instalação disponíveis foram testados no endereço final.
- Saves sobrevivem a uma atualização publicada de verdade.
- O funil mostra que jogadores entendem o ciclo e uma parcela volta por vontade própria.
- Existe capacidade de receber feedback, corrigir problemas e publicar uma atualização após o lançamento.

## 5. Medição e decisões

As metas abaixo são **hipóteses internas iniciais**, não médias da indústria nem promessa de resultado. Depois da primeira beta, revisar os números conforme público, duração da campanha e origem dos jogadores.

| Pergunta | Indicador | Meta inicial ou regra de decisão |
| --- | --- | --- |
| O início é compreensível? | Primeira entrega sem ajuda | Pelo menos 80% na rodada observada |
| Existe uma recompensa cedo? | Tempo até a primeira entrega | Mediana de até 3 minutos no teste definido |
| O jogador encontra o próximo passo? | Identificação do próximo objetivo | Pelo menos 70% na rodada observada |
| As pessoas voltam? | Retenção D1 e D7 | Referência inicial de 25% e 10%, respectivamente; avaliar com amostra suficiente e uma mesma definição de dia |
| Onde a campanha perde interesse? | Início/conclusão por capítulo e motivo de saída | Priorizar o maior abandono que ainda não tem explicação |
| Produtos criam decisões? | Ciclo publicado e atualizado + entrevista | Consequências compreendidas e estratégias diferentes usadas |
| A experiência é confiável? | Sessões sem erro fatal e incidentes de save | Zero perda de save conhecida; buscar pelo menos 99,5% de sessões sem erro fatal na beta |
| A divulgação traz público adequado? | Ativação e retorno por origem | Ampliar os canais que trazem jogadores engajados |

Para interpretar D7, a pessoa precisa ter tido a oportunidade de completar os sete dias. Relatar a quantidade de jogadores junto das porcentagens e manter versões e origens separadas; dezenas de pessoas servem para encontrar problemas, não para provar uma taxa estável.

**Eventos mínimos**

`session_start`, `campaign_start`, `tutorial_step`, `contract_accept`, `contract_complete`, `contract_fail`, `research_unlock`, `chapter_complete`, `product_launch`, `product_update`, `building_change`, `exterior_save`, `bankruptcy`, `save_error`, `fatal_error` e `share_export`.

Usar identificadores fixos e campos numéricos para duração ou valores. Não enviar nomes digitados, conteúdo dos saves ou a cada movimento do personagem. Separar claramente telemetria, dados de conta e sincronização de campanhas. Definir a informação apresentada ao jogador e as opções de coleta antes da beta.

## 6. Monetização: decisão posterior à diversão

Três hipóteses para testar com jogadores que já gostaram da experiência:

| Modelo | O que oferece | Pergunta a validar |
| --- | --- | --- |
| Compra única | Campanha completa após demonstração | Há disposição a pagar pela experiência inteira? |
| Expansões | Novos setores, campanhas e cenários | As pessoas terminam ou exploram bastante a base e querem mais? |
| Cosméticos | Fachadas, estilos de sala e peças visuais | A personalização tem valor suficiente para sustentar compras opcionais? |

Escolher uma hipótese por teste. Não implementar simultaneamente loja, anúncios, assinatura e moedas especiais. Investimento em aquisição paga só entra depois de medir retorno e, se houver monetização, receita e custos do teste. A implementação de pagamentos e conta fica para uma decisão específica de produto e infraestrutura.

## 7. Backlog priorizado

| Prioridade | Item | Depende de | Evidência de conclusão |
| --- | --- | --- | --- |
| P0 | Build e versão de referência | Base V27 | Pacote gerado e verificado por comando |
| P0 | Migração e recuperação de save | Fixtures de campanhas | Atualizar/restaurar sem perder progresso |
| P0 | Eventos centrais e medição mínima | Definições de eventos | Funil reproduzível por versão |
| P0 | Primeiros dez minutos | Testes observados | Jogadores avançam sem ajuda verbal |
| P0 | Validação em aparelhos físicos | Acesso a aparelhos | Matriz com resultados e problemas corrigidos |
| P1 | Produto completo e feedback | Regras e eventos centrais | Criar, lançar e melhorar com consequências claras |
| P1 | Presença visual da sede | Exteriores atuais | Evolução perceptível e cartão compartilhável |
| P1 | Equilíbrio até Campus/IPO | Simulação reproduzível | Estratégias e marcos finais testados |
| P1 | Beta privada/publicação HTTPS | Build, saves e hospedagem | Jogadores externos conseguem jogar e retornar |
| P2 | Especializações e cenários distintos | Ciclo de produtos validado | Segunda campanha oferece outra estratégia |
| P2 | Cidade com poucos locais | Testes da identidade visual | Locais úteis sem criar navegação trabalhosa |
| P2 | Duas empresas rivais simuladas | Mercado e produtos estáveis | Rival muda escolhas sem tirar o controle do jogador |
| P3 | Conta e sincronização na nuvem | Demanda por vários dispositivos | Conflitos e recuperação de campanhas resolvidos |
| P3 | Lojas de aplicativos | Validação web e decisão comercial | Requisitos e custos da plataforma analisados |

Multiplayer, cidade aberta extensa, rankings globais e conteúdo infinito não entram no escopo inicial. Uma primeira versão de concorrentes pode ser inteiramente local, com duas empresas de estratégias legíveis, sem servidores ou mercado online.

## 8. Primeiros dez dias de trabalho

| Dias | Trabalho | Resultado revisável |
| --- | --- | --- |
| 1–2 | Congelar referência, inventariar saves e definir os eventos | Lista de critérios e fixtures de campanha |
| 3–4 | Criar build automatizado, validação e backup antes de migração | Pacote reproduzível e recuperação testada |
| 5–6 | Criar adaptador de medição e funil local | Sessão de teste com eventos verificáveis |
| 7–8 | Ajustar a sequência inicial e explicar custos/capacidade | Primeira sessão revisada jogável |
| 9–10 | Primeira rodada observada e correções prioritárias | Relatório de problemas e nova versão comparável |

Em paralelo, definir quem pode participar dos testes, quais aparelhos estão disponíveis e qual hospedagem será usada. Estes acessos são dependências externas; não bloquear as melhorias locais enquanto são resolvidos.

## 9. Rotina de execução

- Uma versão jogável ao final de cada semana ou conjunto pequeno de mudanças.
- Revisão do objetivo de cada funcionalidade antes de implementá-la.
- Testes apropriados para a alteração e uma verificação de migração em releases que mudam estado persistido.
- Revisão semanal de três informações: maior abandono, maior problema técnico e decisão que mais gerou interesse.
- Conteúdo novo só avança quando a experiência que o apresenta estiver compreensível.
- Reservar aproximadamente 25% da capacidade para correções, equilíbrio e integração, ajustando à realidade da equipe.

Responsabilidades mínimas: desenvolvimento/regras, direção de produto e conteúdo, revisão de arte/áudio e coordenação de testes/divulgação. Uma pessoa pode acumular funções; o escopo precisa refletir essa disponibilidade.

## 10. Fontes de apoio

As prioridades e metas de design acima são propostas para o DevTycoon, baseadas na versão local e na auditoria. As fontes abaixo apoiam os aspectos de medição e distribuição, sem determinar metas comerciais para este jogo.

- [GameAnalytics — Retention](https://docs.gameanalytics.com/products-and-features/analytics-iq/engagement-tools/retention/): medir retorno a partir da primeira sessão ou de marcos específicos.
- [GameAnalytics — Metrics](https://docs.gameanalytics.com/events-metrics-and-filtering/metrics/): definição de retenção por dia e cuidado com a convenção de calendário utilizada pela ferramenta.
- [GameAnalytics — Design Events](https://docs.gameanalytics.com/events-metrics-and-filtering/event-types/design-events/): eventos específicos do jogo e identificadores consistentes.
- [MDN — Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable): instalação e exigência de HTTPS ou ambiente local compatível.
- [MDN — Best practices for PWAs](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Best_practices): adaptação a dispositivos, navegadores, offline e desempenho.
- [itch.io — Uploading HTML5 games](https://itch.io/docs/creators/html5): distribuição de jogos de navegador em ZIP com `index.html` e configuração para diferentes tamanhos de tela.
