/**
 * Protege os vídeos all-intra da recompressão do asset-optimizer.
 *
 * POR QUÊ ISTO EXISTE
 * O hero do site é um vídeo controlado por scroll: o `currentTime` é escrito a
 * cada frame e o navegador precisa pintar aquele quadro exato, na hora. Isso só
 * funciona porque `hero-scrub-v2.mp4` é encodado **all-intra** (`-g 1`), ou seja,
 * todo frame é um I-frame e o seek é praticamente instantâneo.
 *
 * O `asset-optimizer-plugin` (template 0.3.0, obrigatório em `vite.config.ts`)
 * roda no `closeBundle` e recomprime todo mp4 do `dist/` em CRF 28 com GOP
 * padrão. O arquivo fica menor e o build passa sem erro — mas os I-frames somem
 * e o scrub morre. É uma falha silenciosa: nada no log acusa.
 *
 * COMO A PROTEÇÃO FUNCIONA
 * O plugin cacheia resultados em `node_modules/.cache/asset-optimizer/`, com a
 * chave `sha256("v" + SETTINGS_VERSION + bytes do arquivo)`. Antes de tocar em
 * qualquer coisa ele chama `applyCached()`, que testa primeiro a existência de
 * `<chave>.skip` e, se achar, devolve o arquivo **intocado**.
 *
 * Então este script não precisa desabilitar nada: ele só semeia o cache com um
 * marcador `.skip` para cada vídeo que deve passar ileso.
 *
 * QUANDO RODAR
 * Antes de todo build de produção — e de novo a cada ambiente novo, porque o
 * cache vive dentro de `node_modules/` e some no `bun install`.
 *
 *     bun scripts/keep-allintra.ts && bun run build:web
 *
 * Se um vídeo for reencodado, o hash muda e o marcador antigo deixa de valer.
 * Basta rodar este script de novo — ele recalcula tudo do zero.
 */

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WEB = path.join(ROOT, "packages", "web");
const PUBLIC_DIR = path.join(WEB, "public");
const CACHE_DIR = path.join(WEB, "node_modules", ".cache", "asset-optimizer");
const PLUGIN = path.join(WEB, "vite", "__plugins", "asset-optimizer-plugin.ts");

/** Só estes o plugin transcodifica; webm ele apenas avisa. */
const TRANSCODED_EXT = /\.(mp4|mov)$/i;

/**
 * Lê o `SETTINGS_VERSION` do próprio plugin em vez de fixar `1` aqui.
 *
 * O comentário no plugin diz que ele é incrementado "to invalidate cached
 * results when tuning below". Se um upgrade do template mexer nesse número e
 * nós tivéssemos hardcoded, os marcadores continuariam sendo gerados com a
 * chave velha — o script reportaria sucesso e o vídeo seria recomprimido do
 * mesmo jeito. Ler da fonte elimina essa classe inteira de bug.
 */
async function readSettingsVersion(): Promise<number> {
  const source = await fs.readFile(PLUGIN, "utf8");
  const match = source.match(/const\s+SETTINGS_VERSION\s*=\s*(\d+)/);
  if (!match) {
    throw new Error(
      `Não achei SETTINGS_VERSION em ${path.relative(ROOT, PLUGIN)}. ` +
        `O plugin mudou de forma — confira o cacheKey() antes de confiar neste script.`,
    );
  }
  return Number(match[1]);
}

/** Mesma função do plugin: sha256("v" + versão) seguido dos bytes do arquivo. */
function cacheKey(input: Buffer, settingsVersion: number): string {
  return createHash("sha256").update(`v${settingsVersion}`).update(input).digest("hex");
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

async function main(): Promise<void> {
  const settingsVersion = await readSettingsVersion();

  const files = await walk(PUBLIC_DIR).catch(() => [] as string[]);
  const videos = files.filter((file) => TRANSCODED_EXT.test(file));

  if (videos.length === 0) {
    console.warn(
      `[keep-allintra] nenhum mp4/mov em ${path.relative(ROOT, PUBLIC_DIR)} — nada a proteger.`,
    );
    return;
  }

  await fs.mkdir(CACHE_DIR, { recursive: true }).catch(async (error: NodeJS.ErrnoException) => {
    // Bun on Windows can report EEXIST for an existing OneDrive directory.
    // Accept only that case; a regular file or any other failure must still fail.
    if (error.code !== "EEXIST" || !(await fs.stat(CACHE_DIR)).isDirectory()) throw error;
  });

  console.log(`[keep-allintra] SETTINGS_VERSION=${settingsVersion} (lido do plugin)`);

  for (const file of videos) {
    const bytes = await fs.readFile(file);
    const key = cacheKey(bytes, settingsVersion);
    const marker = path.join(CACHE_DIR, `${key}.skip`);
    const rel = path.relative(PUBLIC_DIR, file).replace(/\\/g, "/");
    const mb = (bytes.length / (1024 * 1024)).toFixed(2);

    // O plugin só testa a existência do arquivo, então o conteúdo é irrelevante
    // — mas deixamos uma nota para quem for investigar o cache um dia.
    await fs.writeFile(marker, `keep-allintra: ${rel}\n`);

    console.log(`[keep-allintra] protegido ${rel} (${mb} MB) → ${key.slice(0, 12)}….skip`);
  }

  console.log(
    `[keep-allintra] ${videos.length} vídeo(s) marcado(s). ` +
      `Rode o build agora — o cache vive em node_modules e some no próximo install.`,
  );
}

main().catch((error) => {
  console.error(`[keep-allintra] falhou: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
