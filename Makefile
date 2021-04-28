define FOREACH
	for DIR in packages/*; do \
		if [ -d $$DIR ]; then \
			echo $$DIR; \
			$(MAKE) -C $$DIR $(1); \
		fi \
	done
endef

# Real targets

node_modules yarn.lock: package.json packages/*/package.json
	yarn install

# Phony targets

.PHONY: bootstrap
bootstrap: node_modules

.PHONY: docs
docs:
	$(MAKE) -C docs release

.PHONY: prettier
prettier: bootstrap
	$(call FOREACH,prettier)

.PHONY: clean
clean:
	$(call FOREACH,clean)
	$(MAKE) -C docs clean
	rm -rf node_modules

.PHONY: ncu
ncu:
	$(call FOREACH,ncu)
	$(MAKE) -C docs ncu

.PHONY: purge
purge: clean
	$(call FOREACH,purge)
	rm -f yarn.lock

.PHONY: release
release: bootstrap
	$(MAKE) -C packages/website release

.PHONY: test
test: bootstrap
	$(call FOREACH,test)
