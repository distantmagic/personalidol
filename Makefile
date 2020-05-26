CMD_YARN := $(shell command -v yarnpkg || command -v yarn )

.PHONY = clean
clean:
	$(CMD_YARN) run lerna clean --yes
	rm -rf node_modules

node_modules: yarn.lock
	$(CMD_YARN) install

.PHONY = bootstrap
bootstrap: node_modules
	$(CMD_YARN) run lerna bootstrap

yarn.lock:
	$(CMD_YARN) install
