include ../../Makefile_node.mk
include ../../Makefile_packages.mk

.PHONY: public
public: public/lib/index.js public/lib/index_offscreen.worker.js

.PHONY: public.watch
public.watch: node_modules
	../../scripts/watch_trigger.sh $(MAKE) "public" true

public/lib:
	mkdir -p public/lib

public/lib/index.js public/lib/index_offscreen.worker.js: node_modules/.bin/esbuild public/lib $(SOURCES_TS)
	yarn run esbuild \
		--bundle \
		--define:__LOG_LEVEL=\"debug\" \
		--format=esm \
		--jsx-factory=h \
		--jsx-fragment=Fragment \
		--minify \
		--outdir=public/lib \
		--platform=browser \
		--sourcemap \
		--strict \
		--tsconfig=tsconfig.json \
		src/bootstrap.ts \
		src/index.ts \
		src/worker_md2.ts \
		src/worker_offscreen.ts \
		src/worker_quakemaps.ts \
		src/worker_textures.ts \
	;

.PHONY: serve
serve: public/lib/index.js
	yarn run http-server ./public/
