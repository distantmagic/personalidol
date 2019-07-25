.DEFAULT_GOAL = all
.PHONY = pretty_backend pretty_frontend

JS_SOURCES = $(shell find src -name "*.js")
RUST_SOURCES = $(shell find backend/src -name "*.rs")
SCSS_SOURCES = $(wildcard scss/*.scss)

all: backend frontend

backend: backend/target/debug/personalidol

backend/target/debug/personalidol: $(RUST_SOURCES)
	cd backend && cargo build

build/index.css: $(SCSS_SOURCES)
	yarn run sass:build

build/index.html: $(JS_SOURCES)
	yarn run build

frontend: build/index.html build/index.css

node_modules: yarn.lock
	yarn install

pretty: pretty_backend pretty_frontend

pretty_backend:
	rustup component add rustfmt
	cd backend && cargo fmt --all

pretty_frontend:
	yarn run prettier

test: test_backend test_frontend

test_backend: $(RUST_SOURCES)
	cd backend && cargo test

test_frontend: $(JS_SOURCES)
	yarn run test:once
