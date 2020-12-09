node_modules: yarn.lock
	yarn install
	touch node_modules

yarn.lock: package.json
	yarn install
	touch node_modules
