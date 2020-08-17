include ../../Makefile_node.mk
include ../../Makefile_packages.mk

SOURCES_CSS := $(shell find styles -type f -name "*.css")

.PHONY: public
public: public/lib/index.js public/index.css

.PHONY: public.watch
public.watch: node_modules
	../../scripts/watch_trigger.sh $(MAKE) "public" true

public/lib:
	mkdir -p public/lib

public/lib/index.js: node_modules/.bin/esbuild public/lib $(SOURCES_TS)
	yarn run esbuild \
		--bundle \
		--define:__LOG_LEVEL=\"debug\" \
		--format=esm \
		--jsx-factory=h \
		--jsx-fragment=Fragment \
		--outdir=public/lib \
		--platform=browser \
		--sourcemap \
		--strict \
		--tsconfig=tsconfig.json \
		src/createScenes.ts \
		src/index.ts \
		src/worker_atlas.ts \
		src/worker_md2.ts \
		src/worker_offscreen.ts \
		src/worker_progress.ts \
		src/worker_quakemaps.ts \
		src/worker_textures.ts \
	;

public/index.css: $(SOURCES_CSS)
	yarn run postcss -c ./postcss.config.js -o ./public/index.css styles/index.css

.PHONY: serve
serve: public/lib/index.js
	yarn run http-server ./public/
