CMD_YARN := $(shell command -v yarnpkg || command -v yarn )

.PHONY = bootstrap
bootstrap: node_modules
	$(CMD_YARN) run lerna bootstrap

.PHONY = build.website
build.website: website/public/index.html website/public/build/index.js

.PHONY = clean
clean:
	$(CMD_YARN) run lerna clean --yes
	rm -rf node_modules
	rm -rf website

node_modules: yarn.lock
	$(CMD_YARN) install

website:
	mkdir -p website

website/public/index.html: bootstrap website
	rsync -avz --delete packages/website/public website

website/public/build/index.js: bootstrap website
	rsync -avz --delete packages/website/build website/public

yarn.lock:
	$(CMD_YARN) install
