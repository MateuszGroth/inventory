#!/bin/bash
set -e
cmd="$@"

pnpm install --frozen-lockfile --store-dir .pnpm-store
pnpm nx sync

exec $cmd
