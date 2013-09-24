
REPORTER ?= dot
BIN = ./node_modules/.bin
TESTS = $(wildcard test/.test.js)
LIB = $(wildcard lib/.js)
GENERATE = $(wildcard test/generate/*.pdf)

# test commands 

clean:
	@rm -f $(GENERATE)

lint:
	./node_modules/.bin/jshint ./lib/*.js ./test/*.js

test:
	make clean && \
	make lint && \
	./node_modules/mocha/bin/mocha \
	--timeout 4000 \
	--colors \
	--reporter $(REPORTER) \
	$(TESTS)

install link:
	@npm $@

define release
	VERSION=`node -pe "require('./package.json').version"` && \
	NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
	node -e "\
	var j = require('./package.json');\
	j.version = \"$$NEXT_VERSION\";\
	var s = JSON.stringify(j, null, 2);\
	require('fs').writeFileSync('./package.json', s);" && \
	git commit -m "release $$NEXT_VERSION" -- package.json && \
	git tag "$$NEXT_VERSION" -m "release $$NEXT_VERSION"
endef

release-patch: test
	@$(call release,patch)

release-minor: test
	@$(call release,minor)

release-major: test
	@$(call release,major)

publish:
	git push --tags origin HEAD:master
	npm publish


.PHONY: clean lint test
