include ../../Makefile_node.mk
include ../../Makefile_packages.mk

trenchbroom.setup:
ifeq ($(FACT_OS), Darwin)
	rm -rf ~/Library/Application\ Support/TrenchBroom/games/PersonalIdol
	mkdir -p ~/Library/Application\ Support/TrenchBroom/games/PersonalIdol
	cp -r ./trenchbroom ~/Library/Application\ Support/TrenchBroom/games/PersonalIdol
else
	rm -rf ~/.TrenchBroom/games/PersonalIdol
	mkdir -p ~/.TrenchBroom/games/PersonalIdol
	cp -r ./trenchbroom ~/.TrenchBroom/games/PersonalIdol
endif
