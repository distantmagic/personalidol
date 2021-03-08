#!/usr/bin/env sh

# Service worker needs to be placed in the root directory.

yarn run esbuild \
    --bundle \
    --define:__ASSETS_BASE_PATH=\"${ASSETS_BASE_PATH}\" \
    --define:__BUILD_ID=\"${BUILD_ID}\" \
    --define:__CACHE_BUST=\"${CACHE_BUST}\" \
    --define:__LOCALES_LOAD_PATH=\"${LOCALES_LOAD_PATH}\" \
    --define:__LOG_LEVEL=\"debug\" \
    --define:__SERVICE_WORKER_BASE_PATH=\"${SERVICE_WORKER_BASE_PATH}\" \
    --define:__STATIC_BASE_PATH=\"${STATIC_BASE_PATH}\" \
    --define:process.env.NODE_ENV=\"${NODE_ENV}\" \
    --format=esm \
    --minify \
    --outdir=./public/lib \
    --platform=browser \
    --sourcemap \
    --target=safari13 \
    --tsconfig=tsconfig.json \
    src/createScenes.ts \
    src/index.ts \
    src/service_worker.ts \
    src/worker_atlas.ts \
    src/worker_gltf.ts \
    src/worker_md2.ts \
    src/worker_offscreen.ts \
    src/worker_progress.ts \
    src/worker_quakemaps.ts \
    src/worker_textures.ts \
;

mv ./public/lib/service_worker.js ./public/service_worker.js
mv ./public/lib/service_worker.js.map ./public/service_worker.js.map
