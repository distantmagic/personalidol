.PHONY: clean
clean:
	rm -rf ./node_modules

.PHONY: ncu
ncu:
	ncu -u

.PHONY: prettier
prettier:
	yarn run prettier --write --print-width 180 "src/**/*.{js,jsx,ts,tsx}"

.PHONY: purge
purge:
	rm -f yarn.lock
