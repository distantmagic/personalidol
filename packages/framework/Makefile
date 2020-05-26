.DEFAULT_GOAL = all
.PHONY = optimize pretty.backend pretty.frontend

CMD_YARN := $(shell command -v yarnpkg || command -v yarn )
FACT_OS = $(shell uname)
SOURCES_JS = $(shell find src -name "*.js")

all: backend frontend

node_modules: yarn.lock
	$(CMD_YARN) install

optimize: optimize.png optimize.jpg

optimize.jpg:
	find public src -name "*.jpg" -exec jpegoptim {} \;
	find public src -name "*.jpeg" -exec jpegoptim {} \;

optimize.png:
	find public src -name "*.png" -exec pngout {} \;

pretty.frontend:
	rm -rf ./node_modules/import-sort-style-personalidol
	ln -s ${CURDIR}/prettier/import-sort-style-personalidol ./node_modules
	$(CMD_YARN) run prettier

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
