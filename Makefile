.DEFAULT_GOAL = all
.PHONY = optimize pretty.backend pretty.frontend

CMD_YARN := $(shell command -v yarnpkg || command -v yarn )
FACT_OS = $(shell uname)
SOURCES_JS = $(shell find src -name "*.js")
SOURCES_RUST = $(shell find backend/src -name "*.rs")

all: backend frontend

backend: backend/target/debug/personalidol

backend/target/debug/personalidol: $(SOURCES_RUST)
	cd backend && cargo build

build/index.html: $(SOURCES_JS)
	$(CMD_YARN) run build

flow.watch: node_modules
ifeq ($(FACT_OS), Darwin)
	$(CMD_YARN) run flow:watch:fswatch
else
	$(CMD_YARN) run flow:watch:inotify
endif

frontend: frontend.dependencies build/index.html

frontend.dependencies: node_modules public/vendor/modernizr.js

node_modules: yarn.lock
	$(CMD_YARN) install

optimize: optimize.png optimize.jpg

optimize.jpg:
	find public src -name "*.jpg" -exec jpegoptim {} \;
	find public src -name "*.jpeg" -exec jpegoptim {} \;

optimize.png:
	find public src -name "*.png" -exec pngout {} \;

pretty: pretty.backend pretty.frontend

pretty.backend:
	rustup component add rustfmt
	cd backend && cargo fmt --all

pretty.frontend:
	rm -rf ./node_modules/import-sort-style-personalidol
	ln -s ${CURDIR}/prettier/import-sort-style-personalidol ./node_modules
	$(CMD_YARN) run prettier

public/vendor/modernizr.js: node_modules
	$(CMD_YARN) run modernizr

setup: setup.trenchbroom

setup.trenchbroom:
ifeq ($(FACT_OS), Darwin)
	rm -rf ~/Library/Application\ Support/TrenchBroom/games/PersonalIdol
	mkdir -p ~/Library/Application\ Support/TrenchBroom/games/PersonalIdol
	cp -r ./trenchbroom ~/Library/Application\ Support/TrenchBroom/games/PersonalIdol
else
	rm -rf ~/.TrenchBroom/games/PersonalIdol
	mkdir -p ~/.TrenchBroom/games/PersonalIdol
	cp -r ./trenchbroom ~/.TrenchBroom/games/PersonalIdol
endif

start: frontend.dependencies
	REACT_APP_PUBLIC_URL=http://localhost:9023 $(CMD_YARN) run start

test: test.backend test.frontend

test.backend: $(SOURCES_RUST)
	cd backend && cargo test

test.frontend: $(SOURCES_JS) frontend.dependencies
	$(CMD_YARN) run test:once

test.frontend.coverage: $(SOURCES_JS) frontend.dependencies
	$(CMD_YARN) run test:once:coverage

test.frontend.watch: frontend.dependencies
	$(CMD_YARN) run test

typescript.watch: frontend.dependencies
	$(CMD_YARN) run typescript:watch
