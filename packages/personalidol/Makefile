include ../../Makefile_node.mk
include ../../Makefile_packages.mk

~/.TrenchBroom/games/PersonalIdol:
	mkdir -p ~/.TrenchBroom/games/PersonalIdol

~/.TrenchBroom/games/PersonalIdol/GameConfig.cfg: ~/.TrenchBroom/games/PersonalIdol ./trenchbroom/GameConfig.cfg
	install ./trenchbroom/GameConfig.cfg ~/.TrenchBroom/games/PersonalIdol/GameConfig.cfg

~/.TrenchBroom/games/PersonalIdol/PersonalIdol.fgd: ~/.TrenchBroom/games/PersonalIdol ./trenchbroom/PersonalIdol.fgd
	install ./trenchbroom/PersonalIdol.fgd ~/.TrenchBroom/games/PersonalIdol/PersonalIdol.fgd

.PHONY: trenchbroom
trenchbroom: ~/.TrenchBroom/games/PersonalIdol/GameConfig.cfg ~/.TrenchBroom/games/PersonalIdol/PersonalIdol.fgd
