# Revisão da experiência no celular

Implementação local: mobile-v41.css e mobile-v41.js, com ajuste de enquadramento em studio-v28.js. Versão do aplicativo permanece 40; cache atualizado para devcorp-v40-3.

## Mudanças

- Contratos, contratação, equipe, construção e loja usam um painel quase inteiro, acima da navegação inferior. Cabeçalho e botão de fechar permanecem acessíveis durante a rolagem.
- Barra inferior com cinco destinos: Construir, Contratos, Contratar, Equipe e Mais. Loja incluída em Mais; demais áreas continuam nos atalhos existentes dessa seção.
- Alvos principais de toque com pelo menos 44 pixels, rótulos maiores, textos de contratos e estimativas mais legíveis. Campos de edição com fonte de 16 pixels para evitar ampliação automática de formulário em navegadores que a aplicam.
- Painel aberto bloqueia toques na cena de fundo, preservando acesso à barra inferior. Fechar restaura o foco; Escape fecha o painel; painéis fechados ficam fora da navegação por teclado. Posição da rolagem é lembrada entre seções durante a sessão.
- Selecionar um item na paleta de construção fecha o painel para permitir posicioná-lo no escritório.
- Guia dos primeiros passos compacto com explicação expansível; ação principal mantida, mensagens de log não cobrem a cena.
- Avatar abre diretamente na edição, sem ocupar parte da tela com uma sala em miniatura. Controles usam uma única rolagem; removida limitação antiga de altura no painel interno.
- Na decoração da sala, prévia menor e fixa enquanto se percorrem opções. Navegação superior entre Avatar, Sala e Exterior preservada. Controles de câmera maiores.
- Layout de paisagem até 1000 pixels separa cena e orientação em colunas. A câmera inicial enquadra os canvases inteiros dentro da área disponível em celulares, preservando zoom e gestos existentes.
- HTML, build e cache offline incluem os novos arquivos. O build verifica explicitamente sua inclusão.

## Validação

- `node tests/mobile.cjs`: passou em 320×740, 390×844 e 844×390, com toque real em botões, aceite de contrato, loja, seleção de objeto para construir, edição de avatar e retorno à cena. Verificação de desktop em 1440×1000 e ausência de erros de JavaScript.
- `node tests/customization.cjs`: passou para guarda-roupa, modelos, atividades, persistência, prévia e histórico do exterior, toque e offline.
- `node tests/deployment.cjs`: passou para build completo, opções em vários tamanhos, persistência e publicação offline.
- A rodada posterior de regressão atualizou os testes antigos de navegação e inicialização. Consulte `docs/REGRESSAO_COMPLETA.md` para o resultado consolidado.

Capturas de verificação em test-artifacts/mobile-v41-*.png. Testes em Chromium/Edge com emulação de toque, sem validação em aparelho físico ou Safari/iOS. Nenhum push, deploy ou novo APK foi realizado nesta rodada.
