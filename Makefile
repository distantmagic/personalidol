define FOREACH
	for DIR in packages/*; do \
		if [ -d $$DIR ]; then \
			echo $$DIR; \
			$(MAKE) -C $$DIR $(1); \
		fi \
	done
endef

node_modules yarn.lock: package.json packages/*/package.json
	yarn install

.PHONY: prettier
prettier: node_modules
	$(call FOREACH,prettier)

.PHONY: clean
clean:
	$(call FOREACH,clean)
	rm -rf node_modules

.PHONY: release
release: node_modules
	$(MAKE) -C packages/website release
