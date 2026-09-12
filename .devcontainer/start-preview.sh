#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
mkdir -p .cache/codespaces

# Reattaching must not start a second development server.
if curl --fail --silent --max-time 2 http://127.0.0.1:4200/api/health >/dev/null; then
  printf 'IMOVIX já está disponível na porta 4200.\n'
  exit 0
fi

nohup bun run dev:remote >.cache/codespaces/preview.log 2>&1 </dev/null &
preview_pid=$!

for attempt in {1..40}; do
  if curl --fail --silent --max-time 2 http://127.0.0.1:4200/api/health >/dev/null; then
    printf 'IMOVIX pronto. Abra a porta 4200 na aba Ports e mantenha a visibilidade Private.\n'
    exit 0
  fi
  if ! kill -0 "$preview_pid" 2>/dev/null; then
    break
  fi
  sleep 1
done

printf 'A prévia não iniciou. Confira .cache/codespaces/preview.log ou execute bun run dev:remote no terminal.\n' >&2
exit 1
