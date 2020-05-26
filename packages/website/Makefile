CMD_YARN := $(shell command -v yarnpkg || command -v yarn )

build/index.js:
	$(CMD_YARN) run esbuild src/index.ts \
		--bundle \
		--minify \
		--outfile=build/index.js \
		--sourcemap

node_modules: yarn.lock
	$(CMD_YARN) install

optimize: optimize.png optimize.jpg

optimize.jpg:
	find public src -name "*.jpg" -exec jpegoptim {} \;
	find public src -name "*.jpeg" -exec jpegoptim {} \;

optimize.png:
	find public src -name "*.png" -exec pngout {} \;

.PHONY = prepublish
prepublish: build/index.js

yarn.lock:
	$(CMD_YARN) install
