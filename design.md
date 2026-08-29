# IMOVI — Design

Site institucional one-page (web) para a **IMOVI**, empresa de tecnologia e marketing imobiliário 3D. A peça central é um hero cinematográfico onde o vídeo 3D do condomínio avança e retrocede conforme o scroll. O resto do site é editorial, dark navy, premium, 100% PT-BR. CTAs levam direto ao WhatsApp.

Posicionamento: *"Transformamos projetos imobiliários em experiências que vendem."*
Sensação alvo: apresentação de produto nível Apple + alto padrão imobiliário + tecnologia 3D cinematográfica. **Não** é agência de renders, **não** é SaaS genérico.

## Brand & Colors

Tokens em `packages/web/src/web/styles.css` (`@theme` do Tailwind 4). Site é dark-only — sem alternância de tema.

| Token | Hex | Uso |
|-------|-----|-----|
| `--ink` | #050914 | Fundo principal (quase preto azulado) |
| `--ink-2` | #07142A | Fundo alternado de seção |
| `--surface` | #0A1B33 | Cards, superfícies elevadas |
| `--accent` | #1762FF | Azul elétrico — CTA, índices, glow |
| `--accent-soft` | #4DA3FF | Hover, detalhes, linhas ativas |
| `--paper` | #F2F4F7 | Tipografia principal |
| `--muted` | #8C8F98 | Texto secundário, labels |
| `--hair` | rgba(242,244,247,.08) | Hairlines / bordas |

Regras: sem gradientes decorativos, sem glassmorphism, sem cores fora da paleta. Glow azul só como acento pontual (`box-shadow` suave em CTA e índices).

## Typography

**Manrope** (Google Fonts, pesos 500/600/700/800) — família única para display e corpo. Sem serifa decorativa, sem segunda família.

Escala fechada no padrão da **inco.vc**: títulos contidos (h1 ~38px, h2 ~30px), corpo 15–16px, hierarquia por **peso e espaçamento**, nunca por tamanho bruto. Nada de títulos gigantes.

Todos os degraus vivem em `styles.css` (`@layer components`). **Proibido `text-[...]` arbitrário em seções** — use as classes abaixo; assim a escala fica auditável em um só arquivo.

| Classe | Tamanho | Uso |
|---|---|---|
| `.display` | — | base: weight 700, `letter-spacing: -.032em`, `line-height: 1.06`, `text-wrap: balance` |
| `.d1` | `clamp(1.95rem, 4vw, 3.5rem)` | h1 do hero, manifesto editorial, CTA final |
| `.d2` | `clamp(1.7rem, 3.2vw, 2.75rem)` | título de seção, capítulos do hero, footer |
| `.d3` | `clamp(1.3rem, 2.1vw, 1.85rem)` | títulos de card, etapa, cena |
| `.d4` | `clamp(1.05rem, 1.5vw, 1.3rem)` | títulos de lista e rails, destaque de UI |
| `.lead` | `clamp(.9375rem, 1.05vw, 1.0625rem)` | parágrafo de abertura, `line-height: 1.6` |
| `.body-txt` | `.9375rem` | corpo corrido, `line-height: 1.65` |
| `.label` | `.625rem` | eyebrow: weight 700, uppercase, `letter-spacing: .2em`, cor `--muted` |
| `.label-xs` | `.5625rem` | micro-rótulo dentro de overlays e HUDs |

Micro-tipografia (UI dentro dos visuais, chips, cotas) usa somente três degraus: `0.5625rem`, `0.625rem`, `0.6875rem`. Tracking uniforme em `0.2em`/`0.22em`.

Índices (01–05): weight 700, cor `--accent`, tabular.

## Assets

`packages/web/public/`

- `video/hero-scrub-v2.mp4` — 1600×908, **40 fps**, 403 frames, **all-intra (`-g 1`)**, sem áudio, 14 MB. Scrub do **desktop**.
- `frames/hero/f001..f096.webp` — 900×510, **2,7 MB no total**. Scrub do **celular** (sequência de frames, não vídeo).
- `video/hero-poster.jpg` — frame 0. É poster no desktop e **imagem do hero no mobile**.
- `brand/imovi-mark.png` (512px, alpha) + `imovi-mark-sm.png` (256px) — o símbolo "M" no anel. O wordmark NÃO é mais imagem: é texto em Manrope (`IMO`+`V` accent+`I`, tracking `0.26em`) em `nav.tsx` e `footer.tsx`, sempre nítido e com peso zero.
- `favicon.ico` (16/32/48), `apple-touch-icon.png` (180), `brand/icon-192.png`, `brand/icon-512.png` — gerados do símbolo sobre `#050914`.
- `og-image.jpg` — 1200×630, 38 KB (era um PNG de 6.2 MB).
- `projects/projeto-01..04.jpg` — frames do próprio vídeo (portaria, residências, área de lazer, alameda).

Original intocado guardado em `media-source/hero-original.mp4` (fora do bundle).

## Pages & Sections

Rota única `/` (`packages/web/src/web/pages/index.tsx`).

1. **Nav** (`components/nav.tsx`) — fixa, transparente → navy no scroll. Logo + SOLUÇÕES / PROJETOS / SOBRE / CONTATO + CTA WhatsApp. Mobile: overlay hamburger.
2. **Hero cinematográfico** (`components/sections/hero.tsx`) — trilho de 620vh no desktop / **420vh no mobile**, viewport sticky 100svh, vídeo pausado controlado por scroll.

   **Estratégia de vídeo (regra):** o `<source media="...">` foi eliminado — vários navegadores móveis o ignoram e ele só é avaliado no primeiro load. A decisão é feita **uma vez em JS**, antes do primeiro paint, por `shouldStreamVideo()`: desktop com ponteiro fino, sem `prefers-reduced-motion`, sem `saveData` e sem conexão 2g/3g recebe o `<video src>`; **telas <= 900px, ponteiro grosso, data-saver ou rede lenta nunca requisitam o arquivo** e recebem `hero-poster.jpg` com `.drift`. Os capítulos 01–05 continuam vindo do mesmo `onProgress`: sem `<video>`, o `useVideoScrub({ video: false })` usa uma timeline sintética de 1 unidade no mesmo rAF — nenhum listener, rAF ou setState novo. Headline + 2 CTAs, depois capítulos 01–05 (VISUALIZE / ENVOLVA / DESPERTE / CONECTE / CONVERTA).
3. **O que fazemos** (`sections/solutions.tsx`) — 4 soluções com ícone SVG minimal e hover em linha/tilt.
4. **Editorial** (`sections/editorial.tsx`) — "Você não vende apenas metros quadrados."
5. **Da visualização à decisão** (`sections/journey.tsx`) — 3 passos.
6. **Feito para quem constrói o futuro** (`sections/audience.tsx`) — 4 públicos.
7. **Do projeto à experiência** (`sections/method.tsx`) — método em 4 etapas.
8. **Projetos** (`sections/showcase.tsx`) — scroll horizontal editorial, imagens grandes.
9. **Sobre** (`sections/about.tsx`).
10. **CTA final** (`sections/cta.tsx`) + **Footer/lockup** (`components/footer.tsx`).

Seção de números **omitida** (sem métricas reais — nada é inventado).

## Motor de scrub — regras invioláveis

`hooks/use-video-scrub.ts`

- `video.play()` é chamado **no máximo uma vez**, como ativação do decoder (“prime”), e o elemento volta a `pause()` no mesmo tick. Fora dessa janela única o listener de `play` força `pause()`. Motivo: o Safari do iPhone **não pinta** frames vindos de `currentTime` num `<video>` que nunca tocou — sem o prime o hero congela no poster no aparelho real (o headless não reproduz o bug).
- **Um** listener `scroll` passivo → escreve progresso clampado em ref. Medidas cacheadas, recalculadas só em `resize`/`ResizeObserver`.
- **Um** loop `requestAnimationFrame` no app inteiro → damping temporal (`1 - e^(-k·dt)`, k=12) → `video.currentTime` escrito no máximo 1×/frame e só se `|Δ| > 0.01s`. Pula a escrita enquanto `video.seeking` (coalescência).
- Zero `setState` durante scroll — progresso vai para o DOM via refs/CSS var.
- Proibido: Lenis, `scroll-behavior: smooth`, wheel-hijack, segunda lib de animação, segundo rAF.
- Fim do vídeo = `duration - 0.05s` (nunca frame preto).

## Motion

Só `opacity`, `translateY` e `blur`. Nunca `font-size` ou `scale` em texto. Entradas de seção via `IntersectionObserver` (`hooks/use-reveal.ts`) com stagger. Botões magnéticos só em ponteiro fino. Tudo respeita `prefers-reduced-motion`: scrub continua funcionando, transições viram opacity simples.

## Contato

`config/site.ts` — número de WhatsApp, email e mensagem padrão em um único lugar. Todos os CTAs usam `wa.me`. Sem formulário, sem banco, sem auth.

## Architecture

Site estático-de-fato sobre o template gerenciado (Bun + Vite + React + Hono). Nenhuma rota de API nova, nenhuma tabela. Assets otimizados no build pelo `asset-optimizer-plugin`.

## Rodada — Ícones e marca à prova de cache (2026-08-22)

Sintoma do cliente: "a logomarca não atualizou" e "o ícone da aba tem fundo preto".
Diagnóstico: os arquivos no disco já estavam corretos e com alpha real (favicon.ico com alphaMin 0
e cantos 0,0,0,0). O problema era **cache do navegador**: os assets novos foram gravados por cima
dos mesmos nomes de arquivo, então o browser continuava servindo os PNGs antigos (com placa #050914).

Correção: URL nova para cada asset (renomear vence cache, `?v=` não é confiável).

| Antes | Agora |
|---|---|
| `brand/imovi-mark.png` | `brand/imovi-symbol.png` |
| `brand/imovi-mark-sm.png` | removido (não referenciado) |
| `brand/icon-192.png` / `icon-512.png` | `brand/icon-v3-192.png` / `icon-v3-512.png` |
| `apple-touch-icon.png` | `brand/apple-touch-v3.png` |
| `favicon.ico` | `favicon-v3.ico` |
| — | `brand/icon-v3-32.png`, `brand/icon-v3.svg` (PNG 512 embutido em base64) |

Ordem dos `<link rel="icon">` em `packages/web/index.html`: `.ico` primeiro, depois SVG e PNGs
(32/192/512) — o browser prefere o último compatível, então o PNG/SVG transparente ganha e o `.ico`
fica só como fallback antigo. `apple-touch-icon` aponta para o 180px.

Regras fixadas:
- `.ico` **sempre** gerado com Pillow (`img.save(..., sizes=[(16,16),(32,32),(48,48)])`), nunca com
  ImageMagick — o `convert` achata alpha sobre preto.
- Todo asset de marca regerado ganha **nome novo**, nunca sobrescreve o antigo.
- Ressalva: iOS Safari ignora transparência em `apple-touch-icon` e compõe sobre preto. Se o ícone
  na tela inicial do iPhone incomodar, a única saída é placa sólida #050914 **só nesse arquivo**.

## Rodada — Ícone escuro adaptativo + FAB de WhatsApp (2026-08-22)

O cliente apontou que o símbolo branco desaparecia na aba, porque a barra do Chrome é clara.
Correção: **duas versões do símbolo**, mesma geometria.

- `brand/imovi-symbol.png` — versão clara (anel e hastes do M em branco). Usada **no site**
  (nav + footer), que é dark-only.
- `brand/imovi-symbol-dark.png` — anel e hastes recolorados para `#050914`, o **V azul preservado**
  (recolor por saturação: pixels acromáticos → ink, pixels azuis intactos). Base de todos os ícones.

Ícones (todos com nome novo, geração via Pillow):
`favicon-v4.ico` (16/32/48) · `brand/icon-v4-32/192/512.png` · `brand/apple-touch-v4.png` ·
`brand/icon-v4.svg`.

O `icon-v4.svg` embute **as duas versões** em base64 e alterna por
`@media (prefers-color-scheme: dark)` dentro do próprio SVG — aba clara mostra o M escuro, aba
escura mostra o M branco. Ele é o **último** `<link rel="icon">` do `index.html` justamente para
ganhar nos browsers modernos; os PNGs escuros e o `.ico` ficam antes, como fallback.

### Botão flutuante de WhatsApp

`components/ui/whatsapp-fab.tsx`, montado em `pages/index.tsx` depois do `<Footer />`.
- `fixed bottom-6 left-6` (canto **esquerdo**, para não colidir com o RunableBadge), `z-40` —
  abaixo do nav (z-50) e do overlay mobile (z-60).
- Círculo 56px `bg-ink-2/95` com hairline; hover vira `bg-accent`. Glyph do WhatsApp em SVG inline
  (lucide não tem). Tooltip "WhatsApp" só em `lg+`.
- Entra em cena depois de ~90vh de scroll (`data-state`, opacity + translateY) para não competir
  com a abertura do hero. Usa o **mesmo** listener de scroll passivo padrão do componente, sem rAF
  e sem tocar no motor do hero.
- **Número ainda não existe:** enquanto `WHATSAPP_NUMBER` for o placeholder `5511999999999`, o botão
  rola para `#contato` em vez de abrir um `wa.me` inválido. Assim que o número real entrar em
  `config/site.ts`, o botão passa a abrir a conversa sozinho — ponto único de troca, também serve
  para plugar uma API futura.

## Rodada — Tour 3D de volta no celular (2026-08-22)

O cliente reportou que o tour imersivo não rodava no smartphone. Estava desligado de propósito
(rodada anterior): 9 MB de all-intra travam o seek em telefone, então mobile caía no poster.
Solução: **arquivo dedicado**, não desligar o recurso.

| Modo | Arquivo | Quando |
|---|---|---|
| `desktop` | `video/hero-scrub.mp4` — 1440×816, 9,0 MB | telas largas com ponteiro fino |
| `phone` | `video/hero-scrub-phone.mp4` — 720×408, **2,2 MB** | `(max-width:900px)` ou `(hover:none) and (pointer:coarse)` |
| `still` | `video/hero-poster.jpg` | `prefers-reduced-motion`, `saveData` ou 2G |

O encode do telefone é **all-intra** (303 frames I de 304) em **H.264 baseline / level 3.1**, CRF 30,
`+faststart` — baseline porque é o perfil que iOS e Android antigos decodificam sem stutter no seek.
A escolha é feita **uma vez** por `pickHeroMode()` antes do primeiro paint (`useState(pickHeroMode)`),
então só um arquivo é baixado; continua **sem** `<source media>`, que era a causa do bug original.

O poster agora é reservado só a reduced-motion, economia de dados e 2G — 3G recebe o arquivo leve.
`scripts/keep-allintra.ts` cobre **os dois** mp4 (obrigatório: o asset-optimizer recomprime em CRF28
e destrói o all-intra). Nenhum invariável do motor de scrub foi tocado.

## Rodada — Novo nome: IMOVI X (2026-08-26)

A empresa passou a se chamar **IMOVI X**. Grafia oficial no site: **tudo maiúsculo**, `IMOVI X`.
No lockup da marca (nav topo, overlay mobile e footer) o **V** e o **X** ficam em `text-accent-soft`
(`#4DA3FF`), o resto em paper:

```jsx
IMO<span className="text-accent-soft">V</span>I{" "}<span className="text-accent-soft">X</span>
```

Tamanhos do lockup **não mudaram** (nav `h-6 w-6` + `text-[0.8125rem]` + tracking `0.22em`,
footer `h-8 w-8` + `text-[1rem]`); conferido em screenshot que o nome duas letras mais longo
continua caber no header 1440 e no overlay 390.

24 ocorrências textuais trocadas em `index.html`, `config/site.ts`, seções, nav, footer, FAB e
visuals. **Identificadores internos não foram renomeados** de propósito — keyframes
`imovi-drift/dash/sweep`, ids de SVG (`imovi-poche`, `imovi-sky-grad`, …) e o caminho
`/brand/imovi-symbol.png`: renomear quebraria referências sem ganho visual.

`og-image.jpg` regenerado (1200×630, 45 KB) com o wordmark novo desenhado letra a letra em Manrope
variável, tracking 6px, V e X em accent, régua acompanhando a largura maior.

**E-mail e domínio seguem `contato@imovi.site` / `imovi.site`** por decisão do cliente.

## Rodada — Logo oficial IMOVIX (2026-08-26)

O cliente enviou a logo definitiva (2172×724, PNG com alpha): wordmark **IMOVIX** (junto, sem espaço)
+ símbolo de torres com duas órbitas. A grafia do nome no site passa a ser **IMOVIX** em todo lugar.

A logo vem em navy quase preto (#000018–#000030) com o X e as órbitas em azul — ilegível no fundo
ink do site. Recolor por cromaticidade, feito com Pillow:

- pixel **cromático** (`(max-min)/max > 0.55` e `max > 90`) → **mantido intacto** (todo o azul preservado)
- pixel **acromático/navy** → cinza neutro claro com tint paper: `L' = 148 + L·0.40`
  (navy ~10 → 152, branco 240 → 244), o que **preserva a ordem de luminância** e portanto o volume 3D

A escala direta (`rgb × k`) foi descartada: em pixels quase pretos com tinta azul (0,0,48) ela
amplifica o canal B e a letra vira azul puro. Só o mapeamento neutro funciona.

Assets em `packages/web/public/`:

| Arquivo | Uso |
|---|---|
| `brand/imovix-lockup-v5.png` (1198×360) | lockup claro composto (wordmark à esquerda + símbolo), nav `h-9` e footer `h-9` |
| `brand/imovix-lockup-dark-v5.png` | mesma composição em navy, para fundo claro |
| `brand/imovix-symbol-v5.png` / `-dark-v5.png` (512²) | símbolo isolado, claro e escuro |
| `favicon-v5.ico` (16/32/48) · `brand/icon-v5-32/192/512.png` | versão escura, Pillow, alphaMin 0 verificado |
| `brand/apple-touch-v5.png` (180²) | símbolo claro sobre **placa sólida `#050914`** — iOS descarta alpha |
| `brand/icon-v5.svg` (72 KB) | as duas versões em base64, alterna por `prefers-color-scheme` |
| `og-image-v5.jpg` (1200×630, 43 KB) | lockup claro + régua accent + tagline |

O lockup é composto por script, não recortado da imagem: wordmark com altura = 35,5% da altura do
símbolo e gap de 13%, que é a proporção que mantém "IMOVIX" legível a 36 px de altura no header.

O texto do lockup **deixou de ser tipografia** — antes era Manrope em JSX com V/X em accent, agora é
`<img>`. As exceções de `text-[...]` no nav e no footer foram removidas junto.

Todo asset de marca segue a regra de **nome novo a cada regeneração** (sufixo `-v5`); nada foi
sobrescrito, e os arquivos v4 + `imovi-symbol*.png` + `og-image.jpg` foram apagados.

## Rodada — Qualidade do scrub + scrub funcionando no iPhone (2026-08-26)

Dois problemas: o vídeo tinha **dupla compressão** e o efeito **não rodava em celular real**.

**1. Reencode a partir do master.** Os arquivos em produção vinham de uma versão já comprimida
(1440×816 / 30 fps). O master intocado (`media-source/hero-original.mp4`, 1904×1080, 60 fps,
604 frames) virou a fonte única. SSIM medido contra ele:

| Arquivo | SSIM | Peso |
|---|---|---|
| `hero-scrub-phone.mp4` antigo (720×408, CRF 30) | 0,861 | 2,2 MB |
| **`hero-scrub-phone-v2.mp4`** (1080×612, 30 fps, CRF 28) | **0,912** | 4,2 MB |
| **`hero-scrub-v2.mp4`** (1600×908, **40 fps**, CRF 24) | **~0,962** | 14,0 MB |

```
ffmpeg -i media-source/hero-original.mp4 -an \
  -vf "fps=<FPS>,scale=<W>:-2:flags=lanczos" \
  -c:v libx264 -preset slow -crf <CRF> -g 1 -keyint_min 1 -sc_threshold 0 \
  -x264-params "no-scenecut=1" -pix_fmt yuv420p -profile:v high -movflags +faststart out.mp4
```

- **Desktop foi a 40 fps** (403 frames vs 304): a granularidade percebida do scrub é o número de
  frames, então +33% de frames = motion mais suave. 60 fps all-intra daria ~23 MB — caro demais.
- **`baseline` abandonado** no arquivo de celular. Baseline não tem CABAC (~10-15% pior compressão)
  e qualquer iOS/Android atual decodifica High em hardware. Para o seek o que importa é ser
  **all-intra**, não o profile.
- Regra da casa mantida: asset regenerado **ganha nome novo** (`-v2`), nunca sobrescreve — cache.
  `scripts/keep-allintra.ts` foi atualizado para os dois nomes novos (sem isso o asset-optimizer
  recomprime em CRF 28 e destrói o all-intra). Verificado no dist: 403 e 302 frames I, zero P/B.

**2. O bug do iPhone.** Mobile Safari não pinta frame de `seek` num `<video>` que nunca foi tocado.
Correção em `hooks/use-video-scrub.ts`: um **prime one-shot** — `play()` mudo uma única vez, `pause()`
imediato e restauração do `currentTime` scrubbado. Disparado no `loadeddata` e, se o autoplay for
recusado (modo de baixo consumo), no primeiro `touchstart`/`pointerdown` (`{ once }` por flag).
O prime é protegido por uma flag `priming` dentro do `forcePause`, senão os listeners de
`play`/`playing` matariam a ativação antes de qualquer frame decodificar. Em ponteiro grosso o loop
usa `video.fastSeek()` quando existe: com all-intra ele é praticamente exato e corta o stutter.
Todos os outros invariáveis do motor seguem intactos (1 scroll listener, 1 rAF, 0 setState).

## Rodada — Celular deixa de usar vídeo (2026-08-26)

O cliente reportou, pela terceira vez, dificuldade de navegar o motion no smartphone. As duas
tentativas anteriores (arquivo leve dedicado; prime one-shot do decoder) atacaram sintomas.

**Diagnóstico real:** no iOS toda escrita em `currentTime` é um **seek assíncrono do pipeline de
mídia**, e durante o momentum do toque o navegador limita o decoder. O frame chega centenas de ms
depois do dedo — ou não chega. Isso é o pipeline, não o arquivo: nenhum encode, bitrate ou profile
resolve. Por isso o headless sempre passava e o aparelho real não.

**Solução:** no celular o hero deixa de ter `<video>` e passa a ser **sequência de frames**.

| Modo | Técnica | Peso |
|---|---|---|
| `desktop` | `<video>` all-intra `hero-scrub-v2.mp4` | 14 MB |
| `phone` | 96 frames WebP `frames/hero/f001..f096.webp`, troca de `img.src` | 2,7 MB |
| `still` | `hero-poster.jpg` | — |

`hooks/use-frame-scrub.ts`: preload dos 96 frames em ordem de aparição com concorrência 6 (não
afoga o 4G), cada um marcado como pronto no `onload`; o `onProgress` do `useVideoScrub` calcula
`round(p × 95)` e troca o `src` só quando o índice muda e o frame já está decodificado — trocar
`src` de imagem em cache é **síncrono**, roda no compositor e acompanha o dedo. Frame ainda não
baixado mantém o atual em tela em vez de piscar. É a mesma abordagem das páginas de produto da Apple.

**Invariáveis preservados:** o celular usa `useVideoScrub({ video: false })`, ou seja a timeline
sintética já existente — nenhum listener de scroll novo, nenhum segundo rAF, nenhum `setState` no
scroll, nenhum canvas. Os capítulos 01–05 seguem no mesmo `onProgress`.

`hero-scrub-phone-v2.mp4` foi apagado e saiu do `keep-allintra.ts` (só o mp4 de desktop resta).
`scripts/sections.py` agora reporta `mode: "frames"` quando a sequência está ativa.
