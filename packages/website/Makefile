include ../../Makefile_node.mk
include ../../Makefile_packages.mk

SOURCES_CSS := $(shell find styles -type f -name "*.css")

.PHONY: public
public: public/lib/index.js public/styles/index.css

.PHONY: public.watch
public.watch: node_modules
	../../scripts/watch_trigger.sh $(MAKE) "public" true

public/lib:
	mkdir -p public/lib

public/lib/index.js: node_modules/.bin/esbuild public/lib $(SOURCES_TS)
	./build_public.sh

public/styles/index.css: $(SOURCES_CSS)
	yarn run postcss -c ./postcss.config.js -o ./public/styles/index.css styles/index.css

.PHONY: serve
serve: public/lib/index.js
	go run website.go
