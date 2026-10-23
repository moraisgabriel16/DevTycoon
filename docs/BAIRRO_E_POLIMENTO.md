# Bairro e polimento — diagnóstico V31

## Atualização V34

O bairro de clientes foi implementado: padaria, loja e escola têm três projetos cada, com contratos reais e mudanças visíveis depois da entrega. A confiança usa os clientes existentes. Após as etapas, novas propostas seguem o intervalo e os requisitos do sistema de relacionamento. O mapa tem pontos interativos e acesso a visitas e à sede. Consulte o README e `test-artifacts/district-results.json` para os fluxos e a validação.

## Atualização V33

Agora existe a visita à vizinha de demonstração Horizonte Corp, com exterior, seis andares, sala pessoal e avatar do jogador. Ela funciona offline, usa uma cena separada e registra favoritos, referências e uma memória da visita completa. Amigos reais e sincronização online continuam como evolução futura. Consulte o README para o escopo implementado.

O diagnóstico abaixo documenta a V31 e a proposta comercial abaixo foi realizada na V34.

## Estado do sistema na V31

O bairro permite visualizar a sede, personalizar o exterior, entrar nos andares e acompanhar pausas reais. As pausas recuperam necessidades e podem gerar memórias e vínculos. Ainda não existe um ciclo próprio de exploração, clientes ou negócios associado às construções vizinhas; elas são cenografia. O projeto de vitrine O bairro conectado pertence ao sistema de contratos e não transforma o cenário em uma simulação urbana.

## Problemas confirmados e corrigidos

- O cálculo de urgência chamava a previsão de entregas repetidamente para funcionários que compartilhavam funções e contratos. Uma atualização agora compartilha essa leitura. A produção e os custos continuam usando os valores atuais.
- Várias camadas de atualização diária chamavam interface e salvamento em sequência. Agora há um único commit da interface e uma gravação do estado final por atualização. Comandos fora da atualização continuam salvando normalmente.
- A fachada inteira era reconstruída por quadro. O fundo agora fica em cache, invalidado por mudanças de prédio, identidade, personalização, zoom e iluminação. Objetos atrás da sede são desenhados antes da fachada; personagens e objetos da frente são compostos por profundidade. Isso também evita árvores aparecendo sobre a cobertura. Decorações animadas atrás do prédio atualizam o fundo em intervalos de 100 ms. O cenário deixa de ser desenhado atrás de painéis opacos.
- O movimento interno descartava a distância que sobrava ao atingir uma casa do percurso. O deslocamento agora atravessa as curvas com o orçamento de distância correto; as pernas acompanham a distância percorrida, sem o salto vertical artificial. Sprites espelhados são reutilizados.
- O exterior interpolava a posição em linha reta e usava dois destinos que coincidiam com um banco e um poste da configuração inicial. Novas pausas procuram locais livres e caminhos em uma malha de meio bloco, considerando o prédio e os objetos salvos. O destino é reservado durante a pausa.
- A orientação externa era fixada em frente na ida e costas na volta. Agora acompanha o segmento real do trajeto. A escala passou de 32 × 42 para 22 × 29 pixels lógicos, mais próxima da porta e dos pavimentos.
- Comandos de café e descanso feitos na praça agora aguardam a caminhada de retorno antes da atividade interna. Cancelar uma saída antes de chegar à porta preserva a posição interna atual.

As rotas são planejadas no início da pausa. Replanejar uma caminhada em andamento após editar a praça é um refinamento posterior; a V31 não introduz um sistema completo de colisão entre pessoas ou trânsito.

## Medição

Microsoft Edge headless, viewport 1280 × 900, demo com 60 funcionários, CPU limitada em 4× pelo navegador. Três amostras de cerca de 6,5 segundos, nas mesmas condições de execução. São medições locais, não garantia de desempenho em aparelhos físicos.

| Vista e painel | Intervalo entre quadros no percentil 95 antes | Depois |
| --- | ---: | ---: |
| Escritório / contratos | 40,0 ms | 13,4 ms |
| Escritório / equipe | 53,4 ms | 26,7 ms |
| Bairro / equipe | 53,4 ms | 13,5 ms |

Os registros de tarefas acima de 50 ms somaram 29 nas três amostras anteriores e 5 nas posteriores. Ainda há picos de atualização diária: o trabalho foi reduzido, não eliminado. Os relatórios completos estão em `docs/benchmarks/profile-before-v31.json` e `docs/benchmarks/profile-after-v31.json`. `node tests/profile.cjs <nome>` gera uma nova amostra diagnóstica; tempos não são usados como asserções automáticas.

`tests/runtime.cjs` verifica conservação da distância, compartilhamento de previsões, gravação final, cache, trajetos nos seis prédios, oclusão, retorno para café e suspensão de desenho sob painéis. Os testes de integração, sprites, saves e abertura foram mantidos. A campanha simulada de 80 dias terminou com saldo positivo, seis entregas, quatro funcionários e quatro pesquisas, sem erros JavaScript.

## Proposta registrada na V31 — implementada na V34

O papel recomendado é **bairro de clientes**: uma representação espacial dos contatos e projetos da empresa. O jogador visita o mapa para descobrir oportunidades, acompanhar clientes e enxergar o resultado de seus projetos.

1. Começar com três locais: padaria, loja e escola. Reutilizar os contatos, confiança, intervalos e propostas do sistema de clientes já existente.
2. Cada local mostra um problema claro, o responsável e uma oportunidade de contrato. Contratar o projeto continua usando a capacidade, os prazos e as vagas do sistema atual.
3. A entrega muda um detalhe do estabelecimento e registra o resultado no portfólio. Esse retorno visual dá significado ao mapa.
4. Reputação e entregas liberam novos contatos. A mudança de sede continua sendo uma compra da empresa; não exige construir uma cidade.
5. Funcionários usam áreas acessíveis da praça para pausas e encontros. Rotinas e animações comunicam trabalho, deslocamento, espera e descanso.

Antes de adicionar lojas e tráfego, o protótipo deve provar que um contato leva a um contrato, a entrega altera o local e o jogador entende por que vale retornar ao bairro. Definir esse ciclo fornece os tamanhos, entradas e interações necessários para fechar um kit de arte coerente.

## Ordem de evolução

1. Validar estabilidade e movimento na máquina e no telefone usados pelo jogador; observar também picos na troca do dia.
2. Fechar escala, câmera, iluminação e transições de uso dos objetos. Replanejamento durante obras e pequenos desvios entre pessoas entram neste polimento.
3. Prototipar um único cliente do bairro com o sistema de contratos existente.
4. Melhorar a orientação da primeira entrega e a explicação dos gargalos: falta de especialidade, infraestrutura, prazo e necessidades.
5. Conectar os sistemas atuais de ambições, especialização, produtos e relacionamento à progressão, com consequências visíveis e menos navegação entre painéis.
