include ../../Makefile_node.mk
include ../../Makefile_go.mk
include ../../Makefile_packages.mk

SOURCES_GO := $(shell find cmd internal website.go -type f -name "*.go")

.PHONY: air
air: public/lib/index.js
	air

tmp/main: $(SOURCES_GO)
	go build -o ./tmp/main .

.PHONY: public
public: public/lib/index.js

.PHONY: public.watch
public.watch: node_modules
	../../scripts/watch_trigger.sh $(MAKE) "public" true

public/lib:
	mkdir -p public/lib

public/lib/index.js: node_modules/.bin/esbuild public/lib $(SOURCES_TS)
	./scripts/build_public.sh

.PHONY: release
release: public/lib/index.js tmp/main

.PHONY: serve
serve: public/lib/index.js tmp/main
	./tmp/main serve \
		--http-listen=127.0.0.1:8080 \
		--https-listen=:2083 \
		--ssl-cert=./ssl.pem \
		--ssl-key=./ssl.key

test:
	echo "-"
