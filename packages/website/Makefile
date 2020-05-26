CMD_YARN := $(shell command -v yarnpkg || command -v yarn )

node_modules: yarn.lock
	$(CMD_YARN) install

optimize: optimize.png optimize.jpg

optimize.jpg:
	find public src -name "*.jpg" -exec jpegoptim {} \;
	find public src -name "*.jpeg" -exec jpegoptim {} \;

optimize.png:
	find public src -name "*.png" -exec pngout {} \;

prepublish:
	$(CMD_YARN) run esbuild src/index.ts \
		--bundle \
		--minify \
		--outfile=build/index.js \
		--sourcemap


yarn.lock:
	$(CMD_YARN) install
