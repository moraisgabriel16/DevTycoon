# Direção visual V29

O feedback apontou uma combinação pouco coesa: personagens com acabamento de ilustração, objetos pixelados, árvores de círculos, arquitetura geométrica lisa e uma interface semelhante a um painel administrativo. A revisão adotou o vocabulário visual dos sprites originais do jogo.

## Arte

Os oito personagens e suas poses de caminhada voltam a usar `V23`, com as cores, acessórios e aparências da campanha. Os móveis usam os sprites originais `V19` e `V23`. As animações de interação da V28.1 continuam derivando do personagem completo. Os PNGs gerados anteriormente não são requisitados nem fazem parte da lista de pré-cache da V29; os arquivos permanecem no repositório como histórico.

O exterior usa uma superfície de desenho de 480 × 360, ampliada para 960 × 720 sem suavização. A projeção e os pontos de toque continuam na resolução lógica anterior. O cenário usa um bairro contínuo, sem o horizonte de prédios em silhueta e o sol decorativo. Árvores, bancos, floreiras, calçamento, alvenaria e pequenos equipamentos seguem contornos e planos de luz coerentes. As construções vizinhas usam imagens originais do jogo. O guarda-sol tem oito gomos e tamanho proporcional à mesa.

As cores de fachada, molduras, vidros, coberturas, letreiro e itens da praça continuam vindo da personalização salva. A quantidade de andares continua vindo da campanha. Nenhuma mudança de arte altera produção, salários ou recompensas.

## Interface

- Grafite nos instrumentos e navegação; papel nos painéis; ocre na seleção e ações de destaque.
- Cantos pequenos, bordas simples e contraste definido. O cenário fica em uma moldura contínua.
- Ícones vetoriais com o mesmo traço na navegação principal, substituindo os emojis.
- Texto direto: Escritório, Bairro, Equipe, Pausado e Em atividade. Foram retirados slogans repetidos na tela de jogo.
- Faixa inferior do cenário para escolher e entrar no andar. Indicadores reais de atividade, necessidades e folha diária na lista de equipes pequenas.
- Câmera externa centralizada e com preenchimento da área disponível. As coordenadas de interação usam a mesma transformação do cenário.

## Verificação

As capturas em `direction-v29-desktop.png`, `direction-v29-inside.png`, `direction-v29-mobile.png`, `direction-v29-320.png` e `direction-v29-title.png` foram inspecionadas. A verificação móvel usa emulação de viewport e toque no navegador, não aparelhos físicos.

`tests/studio.cjs` cobre a integração com andares, seleção, passeio externo, retorno, recarregamento, modo offline e toque na fachada com o enquadramento móvel. `tests/visual-fixes.cjs` compara 80 combinações de aparência, pose e quadro, verifica seis temas de parede e executa seis interações completas até o retorno à mesa. `tests/game.cjs` cobre persistência e edição da fachada, quatro coberturas, exportação e reabertura offline.
