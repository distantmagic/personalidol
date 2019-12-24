.DEFAULT_GOAL = all
.PHONY = optimize pretty.backend pretty.frontend

FACT_OS = $(shell uname)

JS_SOURCES = $(shell find src -name "*.js")
RUST_SOURCES = $(shell find backend/src -name "*.rs")
SCSS_SOURCES = $(shell find scss -name "*.scss")

all: backend frontend

backend: backend/target/debug/personalidol

backend/target/debug/personalidol: $(RUST_SOURCES)
	cd backend && cargo build

build/index.html: $(JS_SOURCES)
	yarn run build

flow.watch: node_modules
ifeq ($(FACT_OS), Darwin)
	yarn run flow:watch:fswatch
else
	yarn run flow:watch:inotify
endif

frontend: build/index.html

frontend.dependencies: node_modules public/vendor/modernizr.js

node_modules: yarn.lock
	yarn install --network-timeout 9000000

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
	yarn run prettier

public/vendor/modernizr.js: node_modules
	yarn run modernizr

setup: setup.trenchbroom

setup.trenchbroom:
ifeq ($(FACT_OS), Darwin)
	rm -rf ~/Library/Application\ Support/TrenchBroom/games/PersonalIdol
	cp -r ./trenchbroom ~/Library/Application\ Support/TrenchBroom/games/PersonalIdol
else
	rm -rf ~/.TrenchBroom/games/PersonalIdol
	cp -r ./trenchbroom ~/.TrenchBroom/games/PersonalIdol
endif

start: frontend.dependencies
	yarn run start

test: test.backend test.frontend

test.backend: $(RUST_SOURCES)
	cd backend && cargo test

test.frontend: $(JS_SOURCES) frontend.dependencies
	yarn run test:once

test.frontend.watch: frontend.dependencies
	yarn run test
