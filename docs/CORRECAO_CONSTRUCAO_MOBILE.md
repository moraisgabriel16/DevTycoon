# Correção da colocação de móveis — 01/11/2026

## Causa

Ao escolher um móvel no celular, a interface fechava o catálogo para liberar o cenário. Entretanto, a função legada buildActive ainda exigia shOpen (catálogo aberto) em telas pequenas. O toque seguinte era consumido como interação, sem colocar o objeto.

O teste móvel anterior verificava a seleção da ferramenta e o fechamento do catálogo, mas não concluía a colocação por toque. Os testes de colocação dos 24 móveis eram feitos em desktop. Essa lacuna foi corrigida com um teste específico de ponta a ponta.

## Mecânica corrigida

1. Abrir Construir e escolher um móvel.
2. O catálogo fecha e um painel mantém a ferramenta selecionada.
3. Tocar em uma casa para ver a prévia. Nenhum dinheiro é cobrado nessa etapa.
4. Confirmar em Colocar; somente então o móvel é comprado, posicionado e salvo.
5. Continuar colocando o mesmo item, trocar de móvel ou concluir para voltar à interação normal.

Casa ocupada, entrada reservada, posição fora do escritório, falta de caixa e bloqueio de acesso recebem mensagem específica. A validação é repetida no momento de confirmar. Remoção por ferramenta também exige confirmação e mantém o reembolso original. Mover um objeto mantém a mecânica existente, sem nova cobrança.

O modo de colocação é estado de interface: não entra no save e é encerrado ao trocar de empresa, andar, vista, painel ou sair para o menu. O toque usado para arrastar/zoom não é convertido em compra. O comportamento de construção em desktop é preservado.

## Verificação

- tests/placement.cjs: seleção pelo catálogo e toque real na cena em 320×740, 390×844, 768×1024 e 844×390.
- Confirma que prévia não cria item nem cobra; confirmar cria o tipo correto, desconta o preço uma vez e persiste ao recarregar.
- Casa ocupada e falta de caixa impedem confirmação e não escrevem no mapa.
- Mover preserva o dinheiro; cancelar remoção preserva o móvel; confirmar remoção devolve metade do preço.
- tests/mobile.cjs, tests/office-atlas.cjs e tests/customization.cjs verificam a navegação e as mecânicas adjacentes.
- tests/deployment.cjs verifica build e pacote offline. Cache incrementado para devcorp-v40-4.

Evidências: test-artifacts/placement-results.json e placement-preview-*.png. O teste novo é incluído na bateria completa executada por npm test. Validação com emulação de toque em Chromium/Edge, sem substituir teste em aparelho físico.
