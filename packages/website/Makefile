include ../../Makefile_node.mk
include ../../Makefile_go.mk
include ../../Makefile_packages.mk

ASSETS_BASE_PATH ?= /g/personalidol/assets
NODE_ENV ?= production
SERVICE_WORKER_BASE_PATH ?= /g/personalidol
STATIC_BASE_PATH ?= /g/personalidol

BUILD_ID := $(shell sh ./scripts/helper_build_id.sh)
CACHE_BUST := $(shell BUILD_ID=$(BUILD_ID) sh ./scripts/helper_cache_bust.sh)

.PHONY: public.watch
public.watch: node_modules
	NODE_ENV=development ../../scripts/watch_trigger.sh $(MAKE) "$${PWD}/../*/src" "release" true

public/index.html: public/index.mustache $(SOURCES_TS)
	CACHE_BUST=$(CACHE_BUST) node ./scripts/build_mustache.js

public/index.js: node_modules/.bin/esbuild scripts/build_public.sh tsc $(SOURCES_TS)
	ASSETS_BASE_PATH=${ASSETS_BASE_PATH} \
	BUILD_ID=$(BUILD_ID) \
	CACHE_BUST=$(CACHE_BUST) \
	NODE_ENV=${NODE_ENV} \
	SERVICE_WORKER_BASE_PATH=${SERVICE_WORKER_BASE_PATH} \
	STATIC_BASE_PATH=${STATIC_BASE_PATH} \
		./scripts/build_public.sh

.PHONY: release
release: public/index.html public/index.js

.PHONY: test
test:
	echo "-"
