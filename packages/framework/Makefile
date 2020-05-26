CMD_YARN := $(shell command -v yarnpkg || command -v yarn )
SOURCES_TS := $(shell find src -name "*.ts" -type f)

build/index.js: $(SOURCES_TS)
	$(CMD_YARN) run esbuild src/index.ts \
		--bundle \
		--minify \
		--outfile=build/index.js \
		--sourcemap

node_modules: yarn.lock
	$(CMD_YARN) install

.PHONY = prepublish
prepublish: build/index.js

.PHONY = prettier
prettier:
	$(CMD_YARN) run prettier --write "./src/**/*.ts"

.PHONY = trenchbroom
trenchbroom:
	rm -rf ~/.TrenchBroom/games/PersonalIdol
	mkdir -p ~/.TrenchBroom/games/PersonalIdol
	cp -r ./trenchbroom ~/.TrenchBroom/games/PersonalIdol

yarn.lock:
	$(CMD_YARN) install
