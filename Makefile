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
prettier: node_modules
	$(call FOREACH,prettier)

.PHONY: clean
clean:
	$(call FOREACH,clean)
	$(MAKE) -C docs clean
	rm -rf node_modules

.PHONY: purge
purge: clean
	$(call FOREACH,purge)
	rm -f yarn.lock

.PHONY: release
release: node_modules
	$(MAKE) -C packages/website release
