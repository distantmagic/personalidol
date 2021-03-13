node_modules: package-lock.json
	npm install
	touch node_modules

package-lock.json: package.json
	npm install
	touch node_modules
