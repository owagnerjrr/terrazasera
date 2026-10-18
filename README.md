# Terraza Séra

Prévia responsiva do site da cobertura em Meia Praia, Itapema/SC. HTML, CSS e JavaScript, sem instalação ou build.

## Visualizar

Execute `python -m http.server 8080` na pasta do projeto e abra http://localhost:8080. Não é necessário instalar pacotes.

## Recursos

Galeria com filtros, ampliação e teclado; menu móvel; consulta de datas com validação e encaminhamento ao Airbnb; links para vídeos e relatos originais; localização do bairro; perguntas frequentes; fotos reais locais em WebP.

## Vercel, posteriormente

Importe este repositório, selecione Other, deixe build command vazio e use a raiz como output. Não houve publicação nesta etapa.

Consulte FONTES.md para fontes, divergências e pontos a confirmar. O site usa Google Fonts com fontes de sistema como alternativa. Não possui analytics nem armazena dados do formulário.

## Painel de conteúdo

`/admin#chave=CHAVE_EXCLUSIVA` abre o painel sem tela de login. A chave fica somente na variável `CMS_ADMIN_KEY` do servidor, nunca no repositório. A chave no fragmento do link não é enviada nas requisições de página nem em referências para sites externos. Ela também fica guardada na sessão da aba. Para abrir de novo ou em outro dispositivo, use o link completo original. Uma nova chave na Vercel, seguida de deploy, revoga links anteriores.

Textos, imagens principais, galeria, vídeos por URL e relatos são editáveis. Fotos são convertidas para WebP de até 2200 px e 1,5 MB. Vídeos são links externos, sem upload de arquivos de vídeo. Rascunhos ficam no servidor; a prévia abre em outra aba e só Publicar muda o conteúdo público. O painel impede sobrescrever alterações de outra janela pela revisão do conteúdo.

O conteúdo e as imagens enviadas ficam no projeto Neon `terrazasera-cms` (`patient-hall-22345417`), separados do Git e preservados em deploys. O histórico técnico fica em `cms_history`. A primeira versão das tabelas está em `migrations/001-cms.sql`. Defina `DATABASE_URL` e `CMS_ADMIN_KEY` nas variáveis da Vercel. Não exponha a chave nem inclua o link administrativo na navegação pública.

`npm ci` e `npm test` verificam validação e proteção do painel. APIs em `api/` usam o driver HTTP Neon. A página pública continua com conteúdo de fallback caso o banco esteja indisponível.
