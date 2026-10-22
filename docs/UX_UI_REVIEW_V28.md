# DevTycoon V28 — revisão de experiência e direção visual

## Correção V28.1 — continuidade visual

O feedback de teste identificou duas falhas de continuidade: as interações ainda usavam corpos das animações antigas com uma cabeça sobreposta, e as paredes tinham recortes por casa que prejudicavam janelas e encontros.

As interações agora derivam do sprite completo da pessoa, com variações de braços, objetos de mão e postura sentada. A escala dos quatro quadros de cada personagem é calculada em conjunto, mantendo o apoio dos pés. As barras de atividade ficam acima da cabeça e as poses de descanso se alinham ao assento. A sala pessoal usa o mesmo renderer de poses.

O escritório e a sala pessoal usam duas faces de parede contínuas, com iluminação, rodapé, molduras, janelas em perspectiva e poste sólido no canto. As peças isométricas das prévias também foram corrigidas. A geometria é desenhada em Canvas e reutiliza a paleta existente; não depende de novos downloads de imagens.

A regressão específica em `tests/visual-fixes.cjs` compara o rosto em 80 combinações de pessoa/pose/quadro, verifica a opacidade das paredes nos seis temas e executa seis ciclos de caminhada, interação e retorno à mesa. Capturas do escritório, das poses e da sala pessoal complementam a inspeção visual. Saves e regras de economia não mudam.

## Diagnóstico da V27

A auditoria considerou a tela inicial, escritório, construção, contratos, contratação, equipe, loja, finanças, metas, automação, andares, produtos, departamentos, clientes, eventos, limpeza, sala pessoal, exterior, saves e uso em telas estreitas.

| Área | Problema observado | Refinamento implementado |
| --- | --- | --- |
| Composição principal | Vários cabeçalhos, avisos e atalhos competiam com o cenário. | HUD único, navegação lateral, área central de jogo e painel lateral. No celular, navegação inferior e gestão em gaveta. |
| Hierarquia | Capacidade e informações técnicas ocupavam grande parte da lista de contratos. | Qualidade e capacidade continuam disponíveis em detalhes expansíveis, com resumo imediato. Contratos ganham mais espaço. |
| Aparência | Texturas muito contrastadas, paletas diferentes e texto pixelado em controles prejudicavam a leitura. | Paleta de papel, madeira, verde e grafite; tipografia de sistema na interface; pisos e paredes mais limpos. |
| Personagens | Muitas informações sobre personalidade e necessidades ficavam escondidas em janelas. | Retratos na faixa da equipe, ficha contextual, atividade atual, três necessidades e acesso ao perfil completo. |
| Sprites | Personagens e objetos tinham níveis de detalhe diferentes. | Dois atlases originais: oito personagens em quatro poses e oito objetos. Reutilização das cores, aparências e efeitos existentes. |
| Exterior | Era essencialmente um editor separado da simulação. | Vista externa jogável, com a mesma fachada da campanha, seleção dos andares e entrada pelo elevador existente. |
| Vida dos NPCs | Pausas internas não conectavam o escritório à praça. | Passeios reais dos funcionários, com trajeto até a saída, presença externa, retorno, recuperação de necessidades e memória. |
| Feedback | Resultados dependiam de barras e textos pequenos. | Falas contextuais, destaque da pessoa selecionada, transições entre vistas e animação de moedas direcionada ao novo HUD. |
| Construção | A escolha de um objeto tinha pouca antecipação visual. | Prévia translúcida no cenário ao apontar uma casa; indicação de validade e orçamento antes do clique. |
| Telas estreitas | Muitos controles pequenos e sobreposição do painel. | Cenário ampliado com enquadramento que permite arrastar, gaveta de gestão e menu Mais nas telas menores. |

## Organização da experiência

- O HUD mostra caixa, calendário, equipe, reputação e acesso à central.
- Escritório e exterior são duas vistas da mesma campanha; a simulação continua na vista externa.
- Os planejadores e o editor externo continuam pausando a empresa, como nas versões anteriores.
- O editor de exteriores fica acessível pelo lápis no cabeçalho, pela vista externa e pela central.
- A faixa de pessoas acompanha o andar ou as pessoas realmente presentes na praça.
- Selecionar uma pessoa mostra sua atividade, energia, hidratação e convívio. Café, passeio, acompanhamento e perfil são acessíveis nesse contexto.
- Gestão de salários, promoções e desligamentos continua disponível em Gestão completa, na aba Equipe.
- Eventos e decisões também têm acesso na central, além dos avisos de eventos pendentes.
- Em telas muito pequenas, Mais reúne os atalhos que não cabem na navegação inferior. As condições de desbloqueio continuam respeitadas.

## Vida dos funcionários

O estado adicional fica em `e.life28`, dentro da campanha. Um passeio segue quatro fases:

1. **Dentro:** a pessoa trabalha ou participa das rotinas originais.
2. **Saída:** percorre um caminho real até a entrada/elevador do próprio andar.
3. **Praça:** aparece na vista externa com o mesmo ID, nome e aparência; não produz durante a pausa.
4. **Retorno:** volta pela entrada e mantém a sua mesa reservada para retomar o trabalho.

A pausa externa dura 24 segundos de simulação após a chegada à saída. Pode ser solicitada pelo jogador ou escolhida automaticamente quando a energia está baixa. A escolha automática respeita urgência, crunch, comandos manuais, disponibilidade e intervalo entre passeios. Há limite de participantes simultâneos, de no máximo três pessoas.

Ao concluir, a pessoa recupera parte da energia e do convívio e registra uma memória. Funcionários que se encontram na praça podem ganhar um ponto de vínculo. As necessidades, personalidades, ambições, reuniões, ajuda entre colegas e rotinas internas existentes continuam funcionando.

Ao recarregar uma campanha durante um passeio, a pessoa é recuperada na entrada do seu andar para retomar o caminho de volta. O jogo não cria uma cópia decorativa da pessoa nem continua produzindo com alguém fora da empresa.

## Arte e animação

Os arquivos originais ficam em `assets/v28/office-props.png` e `assets/v28/people-atlas.png`. Foram criados com a ferramenta integrada de geração de imagens. Os prompts e a organização das células estão documentados em `assets/v28/prompts.json`.

O jogo recorta as células em tempo de execução a partir da transparência. As imagens originais permanecem intactas. As cores de roupa, pele, acessórios e avatar continuam usando os dados dos personagens. Na falha de carregamento, a arte anterior continua disponível como alternativa.

Os novos objetos usados no escritório são café, planta, sofá, servidor, água e estante. Banco e floreira também aparecem no exterior. A direção visual dos pisos e paredes foi aplicada às prévias e à sala pessoal que usam os mesmos tiles.

Animações de caminhar, trabalho, interações com objetos e manutenção continuam usando o relógio de simulação. Foram acrescentadas falas curtas ligadas a ações reais e transições de vista. A preferência por redução de movimento é respeitada nos efeitos adicionais.

## Arquivos de implementação

| Arquivo | Responsabilidade |
| --- | --- |
| `art-v28.js` | Carregamento, recorte, paletas, sprites e cenários internos. |
| `npc-life-v28.js` | Passeios, retorno, falas, recuperação de estado e conexão com as necessidades originais. |
| `studio-v28.js` | Composição, navegação, vista externa, seleção contextual, enquadramento e feedback. |
| `studio-v28.css` | Direção visual, hierarquia, layouts responsivos e adaptação à orientação. |
| `exterior.js` | Renderer externo compartilhado pelo editor e pela vista jogável. |
| `sw.js` | Cache da versão V28, incluindo os novos scripts, estilos e sprites. |

## Validação e limites

A regressão mantém os testes de contratos, pesquisas, capítulos, IPO, saves, importação e editor externo. `tests/studio.cjs` verifica os novos atlases, seleção de andares pela fachada, acesso a perfis, deslocamento externo com os atores reais, ausência de produção na pausa, retorno, recuperação ao recarregar, toque e modo offline.

A matriz de interface inclui 1440 × 1000, 390 × 844, 320 × 740 e orientação 844 × 390. As verificações foram realizadas em navegador automatizado, com eventos de toque e relógio virtual. Testes em aparelhos físicos continuam necessários antes de afirmar compatibilidade e desempenho em todos os modelos.

As novas pausas são um complemento à vida dos personagens, não um sistema completo de cidade aberta. O exterior usa a sede e as pessoas da campanha, com circulação na praça e entrada nos andares existentes.
