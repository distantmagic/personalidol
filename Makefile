.DEFAULT_GOAL = all
.PHONY = optimize pretty.backend pretty.frontend

JS_SOURCES = $(shell find src -name "*.js")
RUST_SOURCES = $(shell find backend/src -name "*.rs")
SCSS_SOURCES = $(shell find scss -name "*.scss")

all: backend frontend

backend: backend/target/debug/personalidol

backend/target/debug/personalidol: $(RUST_SOURCES)
	cd backend && cargo build

build/index.html: $(JS_SOURCES)
	REACT_APP_DEBUG=false yarn run build

flow.watch: node_modules
	yarn run flow:watch:inotify

frontend: build/index.html

frontend.dependencies: node_modules public/vendor/modernizr.js

node_modules: yarn.lock
	yarn install --network-timeout 9000000

optimize:
	find src/assets/*.png -exec pngout {} \;

pretty: pretty.backend pretty.frontend

pretty.backend:
	rustup component add rustfmt
	cd backend && cargo fmt --all

pretty.frontend:
	yarn run prettier

public/vendor/modernizr.js: frontend.dependencies
	yarn run modernizr

test: test.backend test.frontend

test.backend: $(RUST_SOURCES)
	cd backend && cargo test

test.frontend: $(JS_SOURCES) frontend.dependencies
	yarn run test:once

test.frontend.watch: frontend.dependencies
	yarn run test

start: frontend.dependencies
	REACT_APP_DEBUG=true yarn run start
