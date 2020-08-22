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
	./build_public.sh

public/index.css: $(SOURCES_CSS)
	yarn run postcss -c ./postcss.config.js -o ./public/index.css styles/index.css

.PHONY: serve
serve: public/lib/index.js
	yarn run http-server ./public/

.PHONY: serve.ssl
serve.ssl: public/lib/index.js
	yarn run http-server --ssl --cert ./ssl.pem --key ./ssl.key --port 2083 ./public/
