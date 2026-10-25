# DevCorp V38 — revisão de jogo e polimento

Data: 25 de outubro de 2026.

## Experiência entregue

O ciclo principal passa a aparecer na própria partida: escolher uma proposta compatível, acompanhar o trabalho, receber o pagamento, preparar pessoas e sede e concluir o capítulo. O capítulo mostra seus três objetivos e a recompensa já existente; a ação principal leva ao próximo passo ou resgata um capítulo concluído.

Os contratos apresentam valor, especialidades, prazo em dias úteis, progresso e previsão que considera os contratos simultâneos. Propostas compatíveis aparecem primeiro. O filtro por equipe e a ação para preparar uma especialidade reduzem a chance de um jogador novo assumir um pedido impossível. As previsões continuam sujeitas a pausas, deslocamentos, manutenção e eventos. Abandonar exige revisar a multa; a confirmação pausa o jogo.

O histórico de novidades guarda até 30 acontecimentos reais por empresa, incluindo o valor efetivamente recebido por uma entrega, mudanças de endereço, pessoas contratadas, capítulos, produtos e fechamento de semana. A leitura não repete pagamentos ou conhecimento. Avisos usam uma fila curta, podem ser fechados e respeitam movimento reduzido. O cenário não é desenhado sob esse histórico.

Na praça, a equipe recalcula trajetos quando o exterior muda. O passeio e a volta começam do ponto atual. Uma pessoa ocupando uma posição que recebeu decoração volta pela entrada; uma passagem totalmente bloqueada fica indicada até ser liberada. Conversas que criam vínculos exigem duas pessoas próximas e paradas. Dentro da sede, o próximo trecho ocupado provoca recálculo do caminho.

No telefone, o cabeçalho organiza informações e quatro ações em duas linhas, a navegação inferior permanece dentro da tela e a prévia exterior acompanha a rolagem das opções. A pinça altera o zoom do bairro; soltar um gesto não seleciona um andar. Dicas repetidas são compactadas para preservar o cenário; novas conversas continuam acessíveis pelo diário.

Os atalhos ficam limitados à partida: Espaço pausa/retoma, 1 e 3 escolhem a velocidade, C abre contratos, B construção, T equipe, M bairro, J jornada e ? abre ajuda. Digitação, botões e editores preservam seu comportamento próprio.

## Desempenho

`ensureFloors()` percorria funcionários e andares repetidamente durante o mesmo quadro. A validação agora é compartilhada dentro de uma operação síncrona. Uma troca de empresa, nível, lista de funcionários ou estrutura dos andares provoca nova validação. Fora dessas operações, a validação normal permanece ativa.

Medição com Microsoft Edge headless, empresa de demonstração com 60 pessoas, viewport 1280 × 900 e CPU limitada a 4× pelo navegador. Cada linha corresponde a uma amostra de aproximadamente 6,5 segundos por versão.

| Vista / painel | Ações: custo médio antes | Ações: custo médio depois | Redução |
| --- | ---: | ---: | ---: |
| Escritório / contratos | 4,91 ms | 2,56 ms | 47,8% |
| Escritório / equipe | 3,89 ms | 1,92 ms | 50,8% |
| Bairro / equipe | 3,85 ms | 1,93 ms | 50,0% |

O percentil 95 do intervalo entre quadros permaneceu próximo de 13,5 ms. Os picos de atualização diária continuam existindo: o maior tempo medido de uma atualização diária caiu de aproximadamente 199 ms para 177 ms nas amostras. São medições locais de trabalho de CPU, sem garantia de resultado idêntico em aparelhos físicos ou outras campanhas. Não demonstram eliminação de travadas.

Os relatórios completos estão em `benchmarks/profile-before-v38.json` e `benchmarks/profile-after-v38.json`. Para repetir a comparação, use `node tests/profile.cjs <nome>` na mesma máquina, sem executar outras suítes ao mesmo tempo.

## Verificação

`npm test` passou nos 16 conjuntos: jogo, correções, progressão, estúdio, sprites, abertura, menu, runtime, gestão, vizinhança, bairro, história, atlas, personalização, polimento e publicação.

Os casos novos percorrem a entrega pelo trabalho real da equipe, validam o pagamento guardado no histórico, contratação e fachada, resgate único, multa e cancelamento, isolamento entre empresas, validação compartilhada, mudanças na praça sem salto de posição, conversa por proximidade, gesto de pinça, atalhos, toque em 320/390px e paisagem e carregamento offline. A publicação contém 52 arquivos de execução e continua usando `npm run build`.

O teste de telefone é emulado no navegador. Avaliação em aparelhos físicos e compreensão por jogadores novos continuam sendo verificações externas úteis para a próxima revisão.


A campanha prudente com semente fixa chegou ao dia 80 com $3.533 em caixa, cinco entregas, quatro pessoas de produção, cinco pesquisas, três capítulos e o primeiro projeto de vitrine concluído. Não houve erros JavaScript. A amostra usa atores e produção reais; não demonstra equilíbrio de todas as estratégias ou do fim de jogo. O registro está em `benchmarks/balance-v38.json` e pode ser repetido com `node tests/balance.cjs`.
