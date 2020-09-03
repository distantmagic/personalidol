SOURCES_TS := $(shell find src -type f -name "*.ts")

.PHONY: build
build: bootstrap node_modules/.bin/esbuild $(SOURCES_TS)
	yarn run esbuild \
		--outdir=lib \
		--platform=browser \
		--target=es2016 \
		--tsconfig=tsconfig.json \
		$(SOURCES_TS);

.PHONY: build.watch
build.watch: node_modules
	../../scripts/watch_trigger.sh $(MAKE) "build"

.PHONY: clean
clean:
	rm -rf lib
	rm -rf node_modules
	rm -rf public/lib

lib:
	mkdir -p lib

node_modules/.bin/jest node_modules/.bin/prettier node_modules/.bin/esbuild: node_modules

.PHONY: prettier
prettier: bootstrap node_modules/.bin/prettier $(SOURCES_TS)
	yarn run prettier --write --print-width 180 "{components,elements,src}/**/*.{ts,tsx}"

.PHONY: test
test: bootstrap node_modules/.bin/jest
	yarn run jest

.PHONY: test.watch
test.watch: node_modules
	yarn run jest --watch

.PHONY: typecheck
typecheck: bootstrap node_modules
	yarn run tsc --noEmit

.PHONY: typecheck.watch
typecheck.watch: bootstrap node_modules
	yarn run tsc --noEmit --watch
