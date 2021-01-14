include ./Makefile_node.mk

.DEFAULT_GOAL = build

define FOREACH
	DIRS=$$( yarn run --silent lerna ls --all --parseable --toposort 2>/dev/null ); \
	for DIR in $$DIRS; do \
		$(MAKE) -C $$DIR $(1); \
	done
endef

.PHONY: bootstrap
bootstrap: node_modules
	yarn run lerna bootstrap

.PHONY: build
build: bootstrap
	$(call FOREACH,build)
	$(MAKE) -C docs build

.PHONY: clean
clean: node_modules
	$(call FOREACH,clean)
	$(MAKE) -C docs clean
	yarn run lerna clean --yes
	rm -rf node_modules

.PHONY: docs
docs:
	$(MAKE) -C docs build

.PHONY: link
link: bootstrap node_modules
	yarn run lerna link

.PHONY: ncu
ncu: bootstrap node_modules
	yarn run lerna exec "ncu -p yarn -u"

.PHONY: prettier
prettier: bootstrap
	$(call FOREACH,prettier)

.PHONY: publish
publish: release
	yarn run lerna publish from-git

.PHONY: release
release: bootstrap
	$(MAKE) -C packages/website release

.PHONY: test
test: bootstrap
	$(call FOREACH,test)
