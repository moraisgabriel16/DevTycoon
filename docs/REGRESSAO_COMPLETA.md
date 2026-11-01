# Regressão do DevCorp — 31/10/2026

**Complemento em 01/11/2026:** um relato posterior revelou que o teste de celular não completava a colocação de móveis após fechar o catálogo. A correção e o novo teste de colocação real estão em `docs/CORRECAO_CONSTRUCAO_MOBILE.md`. O resultado abaixo registra os cenários efetivamente exercitados na rodada original, não cobre essa lacuna descoberta depois.

Resultado consolidado após correções e repetição das suítes afetadas: **19 de 19 suítes aprovadas, 135 verificações registradas**. As verificações agrupam múltiplas asserções; não representam uma contagem de todos os bugs possíveis.

## História validada

O jogador abre ou cria uma empresa, contrata e organiza pessoas, aceita e entrega projetos, personaliza os espaços e visita o bairro; o estado da empresa permanece íntegro ao salvar, recarregar, trocar de slot e abrir offline. O jogo é local no navegador: a persistência testada é localStorage com Service Worker, sem API ou banco remoto.

## Problemas corrigidos nesta rodada

| Problema observado | Correção | Evidência de retorno |
|---|---|---|
| Telas estreitas de tablet recebiam a interface de computador com colunas e controles pequenos | Ponto de corte dos estilos e controladores alinhado em 899 pixels; desktop começa em 900 | Matriz visual em 768 pixels, toque em 768 e 899 pixels |
| Barra de andares e resumo do capítulo diminuíam excessivamente o cenário em empresas avançadas | Organização da barra superior em grade e resumo compacto do capítulo no celular | Teste do cenário amplo em 390 pixels e capturas de empresas com vários andares |
| Prévia fixa e rodapé do editor externo interceptavam toques no catálogo em paisagem | Prévia e controles lado a lado, catálogo com rolagem própria, ações e cartões compactos | Seleção por toque das coleções externas em 844×390; editor mantém Desfazer, Refazer e Aplicar |
| Acesso a novidades não aparecia no cabeçalho em paisagem | Atalho restaurado com rótulo compacto | Abertura/fechamento e enquadramento do painel de novidades |
| Guia oculto na barra da cena em paisagem não tinha acesso direto equivalente no menu Mais | Adicionado História e ajuda ao menu Mais | Teste do guia em retrato, paisagem e offline |
| Regra de janela baixa podia aplicar a organização de paisagem a uma tela vertical reduzida | Layout de paisagem exige também orientação landscape | Edição do nome com viewport reduzido para 390×430 |

Essas correções são de interface e acesso às mecânicas. Não foi necessário alterar regras econômicas, recompensas ou o formato dos saves nesta rodada.

## Mecânicas e dados exercitados

- Contratos compatíveis e incompatíveis, previsão de prazo, entrega, pagamento único e abandono com multa confirmada.
- Contratação, salários, progressão, capítulos, pesquisa, produtos, expansão e IPO nos testes existentes.
- Caminhada e interações de café, servidor, leitura, descanso, plantas e jogos; retorno à mesa preservando aparência e posição.
- Saída para a praça, retorno ao interior, pausa na produção, necessidades, vínculos, obstáculos e recuperação ao recarregar durante o passeio.
- Elevador, troca de andares, toque nas duas faces da fachada e preservação do contexto da empresa.
- Avatar, guarda-roupa, sala, modelos, posicionamento de móveis, exportação de imagem, histórico e persistência.
- Dez atlas: 24 objetos de escritório e 16 objetos externos, com interação e colocação.
- Visita à vizinha completa, seis andares e sala, sem alterar dinheiro, equipe ou decoração do visitante.
- Carregamento lento e falha de módulo, tentativa de recuperação, opções, volumes, foco, atalhos e movimento reduzido.
- Salvamento, recarga, isolamento de slots, importação e abertura offline das dependências do jogo.

## Simulação prolongada

Dois cenários isolados rodaram por 90 dias simulados cada: empresa inicial com uma pessoa e empresa demo com 60. Após a simulação, recarregar preservou dinheiro, dia, IDs da equipe, contratos ativos e entregas. Foram verificadas finanças e posições finitas, funcionários sem IDs duplicados, andares válidos e contratos sem duplicação.

É uma simulação dirigida por ticks e comandos, não um ensaio de retenção, equilíbrio completo ou medição de FPS em celular.

## Revisão visual

50 capturas: tela inicial, opções, escritório, contratos, avatar, sala, exterior, bairro, vizinhos e guia em 1440×1000, 768×1024, 390×844, 320×740 e 844×390. Foram verificadas ausência de transbordamento horizontal, posição dos painéis e erros de JavaScript/rede; as capturas também foram revisadas visualmente.

Os testes adicionais de toque incluem 899×1024 e redução de altura durante edição de texto. Os controles principais são exercitados com eventos de toque do navegador, não apenas chamadas diretas às funções.

## Manutenção da bateria

- `npm test`: executa todas as 19 suítes, guarda resultados e continua após uma falha para apresentar o panorama completo.
- `node tests/regression.cjs --update nome-da-suite`: repete uma suíte corrigida, preservando o resultado das demais e o histórico da repetição.
- Testes antigos passaram a esperar a conclusão da abertura e a usar os menus atuais de personalização e ajuda. A verificação de ícones agora grava em test-artifacts em vez de sobrescrever assets do aplicativo.
- Novas suítes: testes de interface móvel, matriz visual e simulação prolongada.
- Publicação estática e cache offline incluem as alterações. Cache atual: `devcorp-v40-3`.

## Evidências e limites

- Resultados estruturados: `test-artifacts/regression/results.json`.
- Log de cada suíte: `test-artifacts/regression/*.log`.
- Capturas: `test-artifacts/regression/visual/` e contatos `test-artifacts/regression/contact-*.jpg`.
- Simulação: `test-artifacts/regression/soak-results.json`.

Validação realizada em Chromium/Edge no Windows, com emulação de tela e toque. Não houve teste em aparelho físico, Safari/iOS, aparelho Android de baixo desempenho ou APK instalado. Nenhum push ou deploy foi feito. O resultado é aprovação dos cenários exercitados, não garantia de ausência total de bugs.

## Resultado por suíte

| Suíte | Resultado | Verificações registradas |
|---|---|---:|
| game | Aprovada | 8 |
| fixes | Aprovada | 9 |
| progression | Aprovada | 12 |
| studio | Aprovada | 14 |
| visual-fixes | Aprovada | 5 |
| boot | Aprovada | 4 |
| title | Aprovada | 7 |
| runtime | Aprovada | 8 |
| management | Aprovada | 8 |
| neighborhood | Aprovada | 6 |
| district | Aprovada | 7 |
| story | Aprovada | 5 |
| office-atlas | Aprovada | 7 |
| customization | Aprovada | 8 |
| polish | Aprovada | 12 |
| deployment | Aprovada | 1 |
| mobile | Aprovada | 6 |
| visual-regression | Aprovada | 6 |
| soak | Aprovada | 2 |
