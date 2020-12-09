include ../../Makefile_node.mk
include ../../Makefile_go.mk
include ../../Makefile_packages.mk

ASSETS_BASE_PATH ?=
STATIC_BASE_PATH ?=

.PHONY: public.watch
public.watch: node_modules
	../../scripts/watch_trigger.sh $(MAKE) "$${PWD}/src" "public" true

public/index.js: node_modules/.bin/esbuild scripts/build_public.sh tsc $(SOURCES_TS)
	ASSETS_BASE_PATH=${ASSETS_BASE_PATH} \
	STATIC_BASE_PATH=${STATIC_BASE_PATH} \
		./scripts/build_public.sh

.PHONY: release
release: public/index.js

.PHONY: test
test:
	echo "-"
