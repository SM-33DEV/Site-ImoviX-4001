# IMOVI — estado atual (pós-refinement de visualizações)

## Escopo entregue
Site one-page PT-BR (tecnologia + marketing imobiliário 3D), dark-only.
Seções: hero (vídeo scrub) · soluções · editorial · jornada · públicos · método · projetos · sobre · CTA.

## Motor de scrub do hero — invioláveis
- `video.play()` nunca é chamado; 1 listener `scroll` passivo; 1 único loop rAF no app.
- `currentTime` no máx. 1×/frame, só se `|Δ| > 0.01s`; zero `setState` no scroll.
- Proibido: Lenis, `scroll-behavior: smooth` global, wheel-hijack, 2ª lib de animação, 2º rAF.
- Todas as demais animações: CSS + IntersectionObserver + `setInterval`. Nunca canvas.
- `bun scripts/keep-allintra.ts` ANTES de todo build de produção (recompressão destrói o all-intra).

## Visualizações SVG (rodada atual — concluída)
- `visuals/arch.tsx`
  - `BlueprintPlan`: planta técnica real (poché, pilares, esquadrias, mobiliário, cotas com números,
    norte, escala gráfica, selo "PLANTA TIPO · 84 m² · ESC 1:75"). viewBox `0 0 600 424`.
  - `Massing3D`: implantação isométrica (TORRE 01 13 pav, TORRE 02 10 pav, clube, deck/piscina,
    árvores, chamadas com leader lines). viewBox `-96 -106 186 200`.
- `visuals/interfaces.tsx`
  - `DeviceStack`: browser chrome + site "AURORA" + viewport 3D + HUD 360° + cards de plantas
    (TIPO A / TIPO B / COBERTURA) + telefone com app e CTA "INICIAR TOUR 3D".
  - `SystemGraph` (novo, substitui o grafo genérico de 4 nós): dashboard da plataforma —
    sidebar PAINEL/UNIDADES/PLANTAS/ATENDIMENTOS/MÍDIA 3D, top bar "RESIDENCIAL AURORA",
    espelho de vendas 8×7 (DISPONÍVEL/RESERVADA/VENDIDA + legenda), rail de ATENDIMENTOS com
    pipeline (unidade/tipologia/área por linha), "MÍDIA VINCULADA" + "ENVIAR AO CLIENTE",
    chips de INTEGRAÇÕES, sweep. `defs` próprios: `imovi-board-clip`, `imovi-board-sweep`.
  - `FilmFrame`: intocado.
- `visuals/plan-morph.tsx`: ciclo 2D → 3D → REAL via `useStage(3, 2600)`.

## Verificações (última rodada)
- `bunx tsc --noEmit | grep packages/web` → limpo.
- `python3 scripts/sections.py 1920 1080 | 1440 900 | 390 844` → `video: paused true, plays 0`,
  `errors: []`, sem overflow horizontal (sw == cw).
- `python3 /tmp/vis2.py 1440 900` → camadas 01–04 inspecionadas em `verify/vis/h1440-cam*.png`.
- `bun run build:web` → OK (js 676 kB / gzip 185 kB; aviso de chunk size é esperado).

## Pendências conhecidas
- `WHATSAPP_NUMBER` em `packages/web/src/web/config/site.ts` é placeholder `5511999999999`.
- Erros de tsc em `packages/mobile/**` e falha de lint em `packages/mobile/app/_layout.tsx`
  são pré-existentes do template. `oxlint` não roda no sandbox.
- Dev server em tmux session `dev`, porta 4200.

## Rodada — IMOVI em números (contador)

- `hooks/use-count-up.ts` — novo. IntersectionObserver dispara uma vez (threshold .35),
  `setInterval` a ~60fps escreve direto em `node.textContent`. easeOutExpo.
  ZERO setState por frame, ZERO rAF novo (o scrub segue dono do único loop).
  `prefers-reduced-motion` → pinta o valor final na hora.
- `components/sections/numbers.tsx` — novo. Banda logo abaixo do hero (index 1 em `<main>`).
  R$ 0 → 7.000.000, label "Total captado por nossos clientes...", trilho azul que
  preenche junto (scaleX via onProgress), chips dos 4 setores, halo radial azul.
- `pages/index.tsx` — `<Numbers />` inserido entre `<Hero />` e `<Solutions />`.
  ATENÇÃO: os índices de seção do `scripts/sections.py` deslocaram +1 a partir de solucoes.

Verificado: tsc limpo em packages/web · seção renderiza "R$ 7.000.000" · keep-allintra + build:web OK.

## Rodada — Marca nova, vídeo no mobile e peso (2026-08-22)

**1. Logo/ícone novos**
- `logo_U8VjpF.png` (fundo preto) convertido em PNG com alpha via unpremultiply por luminância + crop no bbox + pad quadrado.
- `brand/imovi-mark.png` (512) e `brand/imovi-mark-sm.png` (256). Removidos `imovi-logo.png` e `imovi-wordmark.png`.
- Wordmark deixou de ser imagem: agora é texto Manrope (`IMO` + `V` accent-soft + `I`, tracking .26em) em `nav.tsx` (3 lugares) e `footer.tsx`. Sempre nítido, zero bytes.
- Gerados `favicon.ico` (16/32/48), `apple-touch-icon.png` (180), `brand/icon-192.png`, `brand/icon-512.png` e `og-image.jpg` 1200x630 (38 KB) com o lockup. `index.html` atualizado (+ twitter:card, og:image:width/height).

**2. Vídeo não renderizava no celular — corrigido**
- Removido o `<source media="...">` (avaliado só no primeiro load e ignorado por vários browsers móveis) → causa raiz.
- `shouldStreamVideo()` em `hero.tsx` decide UMA vez, antes do primeiro paint (useState initializer): desktop/ponteiro fino/rede boa recebe `<video src="/video/hero-scrub.mp4">`; <=900px, `hover:none + pointer:coarse`, `prefers-reduced-motion`, `saveData` ou 2g/3g **não requisitam vídeo nenhum** e recebem `hero-poster.jpg` com `.drift`.
- `useVideoScrub({ video: false })`: timeline sintética de 1 unidade quando não há `<video>`, então os capítulos 01-05 continuam animando pelo mesmo rAF/scroll listener. Adicionado listener `loadeddata` para o nudge do decoder.
- Trilho do hero: `h-[420vh]` no mobile, `md:h-[620vh]`.
- INVIOLÁVEIS preservados: nenhum `play()`, 1 scroll listener, 1 rAF, zero setState no scroll.

**3. Peso: public/ de 36 MB -> 11 MB**
- `og-image.png` 6.24 MB -> `og-image.jpg` 38 KB.
- `hero-scrub-mobile.mp4` (7.05 MB) **deletado** — mobile não usa mais vídeo.
- `hero-scrub.mp4` reencodado 1904x1080 -> 1440x816, CRF 25, **all-intra mantido** (`-g 1 -keyint_min 1 -sc_threshold 0 no-scenecut=1`), 20.3 MB -> 9.0 MB, 304 frames.
- `scripts/keep-allintra.ts`: lista reduzida ao único mp4; cache novo `4c76bc3f9e90…`.
- `scripts/sections.py`: NAMES corrigido (inclui `numeros`) e tolerante a hero sem `<video>`.

**Verificado:** `tsc --noEmit | grep packages/web` limpo · `sections.py` 390x844 → `mode: still`, poster pintado, `plays: 0`, `errors: []`, sw==cw · 1440x900 e 1920x1080 → `mode: video`, `paused: true`, `plays: 0`, `errors: []`, sem overflow · `keep-allintra` + `build:web` OK (js 682.62 kB / gzip 186.60 kB).

## 2026-08-22 — Ícones e marca à prova de cache

- Renomeado `brand/imovi-mark.png` → `brand/imovi-symbol.png`; atualizadas as 3 referências
  (`nav.tsx` ×2, `footer.tsx` ×1). Removido `imovi-mark-sm.png` (órfão).
- Ícones regerados com Pillow a partir do símbolo 512 com alpha: `favicon-v3.ico` (16/32/48),
  `brand/icon-v3-32/192/512.png`, `brand/apple-touch-v3.png`, `brand/icon-v3.svg`.
- Verificado programaticamente: alphaMin 0 e canto (0,0,0,0) em todos os frames e PNGs.
- `packages/web/index.html`: bloco de `<link rel="icon">` reescrito (ico → svg → png 32/192/512).
- Verificações: `bunx tsc --noEmit | grep packages/web` limpo; os 6 assets retornam 200 no dev
  server; DOM confirma os 6 links e `imovi-symbol.png` com naturalWidth 512 nos dois lockups;
  `bun scripts/keep-allintra.ts` + `bun run build:web` OK (js 683.03 kB / gzip 186.62 kB).
- Pendente: confirmar com o cliente se "fundo do ícone" incluía o **anel circular branco**.
- Pendente: `WHATSAPP_NUMBER` ainda é o placeholder 5511999999999.

## 2026-08-22 — Ícone escuro adaptativo + FAB de WhatsApp

- Gerado `brand/imovi-symbol-dark.png` (recolor acromático → #050914, V azul preservado:
  13.787 px azuis mantidos, 248.357 px recolorados).
- Ícones v4 via Pillow: `favicon-v4.ico` (alphaMin 0 nos 3 frames), `icon-v4-32/192/512.png`,
  `apple-touch-v4.png`, `icon-v4.svg` (83 KB, alterna claro/escuro por prefers-color-scheme).
- Removidos todos os arquivos v3.
- `index.html`: ico → png 32/192/512 → **svg por último** (vence nos browsers modernos).
- Novo `components/ui/whatsapp-fab.tsx` + montagem em `pages/index.tsx`.
- Verificações: `bunx tsc --noEmit | grep packages/web` limpo; 7 assets em 200; FAB confirmado em
  screenshot após 3× viewport de scroll; `keep-allintra` + `build:web` OK
  (js 685.93 kB / gzip 187.73 kB, css 44.62 kB).
- Pendente: número real do WhatsApp.

## 2026-08-22 — Tour 3D religado no celular

- Encodado `video/hero-scrub-phone.mp4`: 720×408, 2,23 MB, 304 frames, 303 I-frames, baseline/3.1,
  CRF 30, +faststart.
- `hero.tsx`: `shouldStreamVideo()` virou `pickHeroMode()` → `"desktop" | "phone" | "still"`;
  `src` escolhido por modo; poster só em reduced-motion / saveData / 2G.
- `scripts/keep-allintra.ts`: `VIDEOS` agora com os dois mp4 (caches 4c76bc3f9e90 e bd10e463b202).
- Verificações: tsc limpo; `sections.py 390 844` → mode video, src **hero-scrub-phone.mp4**,
  paused true, plays 0, errors [], sw==cw==390; `sections.py 1440 900` → src hero-scrub.mp4,
  plays 0, errors []; build OK (js 686.06 kB / gzip 187.78 kB). public = 14 MB.
- Pendente: número real do WhatsApp.

## 2026-08-26 — Rename da empresa para IMOVI X

- 24 ocorrências de `IMOVI` → `IMOVI X` (regex `\bIMOVI\b(?! X)`) em: `index.html` (4),
  `config/site.ts`, `visuals/interfaces.tsx`, `visuals/arch.tsx`, `footer.tsx`, `nav.tsx`,
  `ui/whatsapp-fab.tsx`, `numbers.tsx` (4), `about.tsx` (2), `showcase.tsx`, `method.tsx` (2),
  `solutions.tsx`, `editorial.tsx`, `hero.tsx` (2), `cta.tsx`.
- Lockup atualizado em 3 pontos (nav ×2, footer ×1): V **e** X em `text-accent-soft`.
- Não renomeados (proposital): keyframes CSS `imovi-*`, ids de SVG `imovi-*`, arquivos
  `/brand/imovi-symbol*.png`.
- `og-image.jpg` regenerado com Pillow (Manrope variável, letra a letra, tracking 6px) — conferido
  visualmente: X inteiro, régua na largura certa, sem colisão com o símbolo.
- Verificações: tsc limpo em packages/web; nav conferido em screenshot 1440;
  `sections.py 390 844` → src hero-scrub-phone.mp4, paused true, plays 0, errors [], sw==cw==390;
  `1440 900` e `1920 1080` → src hero-scrub.mp4, plays 0, errors [], sw==cw; `keep-allintra` OK;
  `build:web` OK (js 686.64 kB / gzip 187.84 kB, css 44.62 kB / gzip 8.40 kB).
- Pendentes: número real do WhatsApp; e-mail/domínio ainda `imovi.site` por decisão do cliente.

## 2026-08-26 — Logo oficial IMOVIX (imagem) + grafia junta

- Grafia: 24 ocorrências `IMOVI X`/`IMOVI` → **IMOVIX** (index.html 4, nav, footer, FAB, site.ts,
  hero 2, solutions, cta, editorial, method 2, showcase, about 2, numbers 4, arch, interfaces).
- Recolor da logo do cliente com Pillow (cromático preservado, acromático → `148 + L·0.40`).
- Lockup composto `brand/imovix-lockup-v5.png` (1198×360) substitui símbolo+texto no nav (2 pontos,
  `h-9`) e no footer (`h-9`). Removidos os `<span>` de wordmark e o `</span>` órfão resultante.
- Ícones v5 (favicon .ico com alphaMin 0 nos 3 frames, png 32/192/512, svg adaptativo 72 KB) e
  `apple-touch-v5.png` agora com **placa sólida #050914** (resolve o iOS que descarta alpha).
- `og-image-v5.jpg` (43 KB) regenerado com o lockup novo; `index.html` aponta para todos os v5.
- Apagados: favicon-v4.ico, brand/*v4*, imovi-symbol.png, imovi-symbol-dark.png, og-image.jpg.
- Verificações: tsc limpo em packages/web; nav e footer conferidos em screenshot (1440 e footer);
  `sections.py 390 844` → src hero-scrub-phone.mp4, paused true, plays 0, errors [], sw==cw;
  `1440 900` → src hero-scrub.mp4, plays 0, errors []; `keep-allintra` OK; `build:web` OK
  (js 684.85 kB / gzip 187.67 kB). public = 14 MB.
- Pendentes: número real do WhatsApp; e-mail/domínio ainda `imovi.site` (agora divergente da marca).

## 2026-08-26 (2) — Qualidade do vídeo de scrub + scrub no celular real

- Master `media-source/hero-original.mp4` (1904×1080, 60 fps, 604 frames) passa a ser a fonte:
  os arquivos anteriores vinham de uma cópia já comprimida (dupla compressão).
- Novos encodes all-intra direto do master: `hero-scrub-v2.mp4` (1600×908, **40 fps**, 403 frames,
  CRF 24, 14 MB, SSIM ~0,962) e `hero-scrub-phone-v2.mp4` (1080×612, 30 fps, 302 frames, CRF 28,
  4,2 MB, SSIM 0,912 vs 0,861 do antigo). Profile high nos dois (baseline abandonado).
- `hero.tsx` aponta para os dois v2; `hero-scrub.mp4` e `hero-scrub-phone.mp4` apagados;
  `keep-allintra.ts` atualizado para os nomes novos (obrigatório).
- Bug do iPhone corrigido em `use-video-scrub.ts`: **prime one-shot** (`play()` mudo uma vez +
  `pause()` imediato + restauração do currentTime) no `loadeddata` e, em fallback, no primeiro
  toque; protegido por flag `priming` dentro do `forcePause`. `fastSeek()` em ponteiro grosso.
  O invariável "play() nunca é chamado" virou "play() no máximo uma vez, como ativação".
- Verificações: tsc limpo em packages/web; `sections.py 390 844` → src hero-scrub-phone-v2.mp4,
  paused true, plays 0, errors [], sw==cw==390; `1440 900` e `1920 1080` → src hero-scrub-v2.mp4,
  plays 0, errors []; `keep-allintra` OK; `build:web` OK (js 685,49 kB / gzip 187,83 kB);
  dist conferido com ffprobe → 403 e 302 frames I, zero P/B.
- Pendentes: número real do WhatsApp; e-mail/domínio ainda `imovi.site`.

## 2026-08-26 (3) — Celular: sequência de frames em vez de vídeo

- Terceira queixa de dificuldade no smartphone. Causa real: no iOS `currentTime` é seek assíncrono
  do pipeline de mídia e o decoder é limitado durante o momentum do toque — nenhum encode resolve.
- Celular agora usa **96 frames WebP** (900×510, 2,7 MB total) em `public/frames/hero/`, gerados do
  master com `fps=96/10.07`. Novo `hooks/use-frame-scrub.ts` (preload concorrência 6, troca de
  `img.src` só quando o índice muda e o frame já decodificou).
- `hero.tsx`: `streamVideo = mode === "desktop"`, `useFrames = mode === "phone"`; celular roda
  `useVideoScrub({ video: false })` (timeline sintética) — zero listener/rAF/setState novo.
- `hero-scrub-phone-v2.mp4` apagado e removido do `keep-allintra.ts`. `sections.py` reporta
  `mode: "frames"`.
- Verificações: tsc limpo em packages/web; `sections.py 390 844` → mode frames, still f096.webp,
  painted true, errors [], sw==cw==390; `1440 900` → mode video, src hero-scrub-v2.mp4, paused true,
  plays 0, errors []; `keep-allintra` OK; `build:web` OK (js 686,57 kB / gzip 188,35 kB).
- Peso do public: vídeo desktop 14 MB + frames 2,7 MB (o mp4 de celular de 4,2 MB saiu).
- Pendentes: número real do WhatsApp; e-mail/domínio ainda `imovi.site`.
