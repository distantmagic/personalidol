include ../../Makefile_node.mk
include ../../Makefile_go.mk
include ../../Makefile_packages.mk

ASSETS_BASE_PATH ?= /public
SOURCES_GO := $(shell find cmd internal website.go -type f -name "*.go")

.PHONY: public
public: public/lib/index.js

.PHONY: public.watch
public.watch: node_modules
	../../scripts/watch_trigger.sh $(MAKE) "public" true

public/lib:
	mkdir -p public/lib

.PHONY: public/lib/index.js
public/lib/index.js: node_modules/.bin/esbuild public/lib scripts/build_public.sh $(SOURCES_TS)
	ASSETS_BASE_PATH=${ASSETS_BASE_PATH} ./scripts/build_public.sh

.PHONY: release
release: public/lib/index.js

test:
	echo "-"
