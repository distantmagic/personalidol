.PHONY: clean
clean:
	rm -rf ./node_modules

.PHONY: ncu
ncu:
	ncu -u

.PHONY: prettier
prettier:
	yarn run prettier --write --print-width 180 "src/**/*.{ts,tsx}"

.PHONY: purge
purge:
	rm -f yarn.lock

.PHONY: test
test:
	yarn run jest

.PHONY: test.watch
test.watch:
	yarn run jest --watch
