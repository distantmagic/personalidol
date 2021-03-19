# Targets

node_modules yarn.lock: package.json
	yarn install

# Phony targets

.PHONY: build
build: node_modules
	yarn run docusaurus build

.PHONY: clean
clean: node_modules
	yarn run docusaurus clear
	rm -rf ./node_modules

.PHONY: deploy
deploy: node_modules
	yarn run docusaurus deploy

.PHONY: docusaurus
docusaurus: node_modules
	yarn run docusaurus

.PHONY: ncu
ncu:
	ncu -u

.PHONY: release
release: build

.PHONY: serve
serve: node_modules
	yarn run docusaurus serve

.PHONY: start
start: node_modules
	yarn run docusaurus start --no-open --host 0.0.0.0

.PHONY: swizzle
swizzle: node_modules
	yarn run docusaurus swizzle

.PHONY: write-heading-ids
write-heading-ids: node_modules
	yarn run docusaurus write-heading-id

.PHONY: write-translations
write-translations: node_modules
	yarn run docusaurus write-translations
