#!/usr/bin/env sh

GIT_LAST_COMMIT_ID=$(git log --format="%H" -n 1);

git diff-index --quiet HEAD;

GIT_HAS_CHANGES=$?;

BUILD_ID_APPEND="";

if [ $GIT_HAS_CHANGES ]; then
    # Append current timestamp if GIT has changes. It means that the project is
    # most probably under development now.
    BUILD_ID_APPEND=":$( date "+%s" )";
fi

BUILD_ID="${GIT_LAST_COMMIT_ID}${BUILD_ID_APPEND}";

# Service worker needs to be placed in the root directory.

yarn run esbuild \
    --bundle \
    --define:__ASSETS_BASE_PATH=\"${ASSETS_BASE_PATH}\" \
    --define:__BUILD_ID=\"${BUILD_ID}\" \
    --define:__CACHE_BUST=\"_v=${BUILD_ID}\" \
    --define:__LOG_LEVEL=\"info\" \
    --define:__STATIC_BASE_PATH=\"${STATIC_BASE_PATH}\" \
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
    src/worker_md2.ts \
    src/worker_offscreen.ts \
    src/worker_progress.ts \
    src/worker_quakemaps.ts \
    src/worker_textures.ts \
;

mv ./public/lib/service_worker.js ./public/service_worker.js
mv ./public/lib/service_worker.js.map ./public/service_worker.js.map
