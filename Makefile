REPORTER ?= dot
TESTS = $(shell find ./test/* -name "*.test.js")
SRC = $(shell find ./lib/ -name "*.js")

# test commands

clean:
	rm -f test/generate/*.pdf

lint:
	./node_modules/.bin/jshint ./lib/*.js

test:
	make clean && \
	make lint && \
	./node_modules/mocha/bin/mocha \
	--timeout 4000 \
	--colors \
	--reporter $(REPORTER) \
	$(TESTS)

.PHONY: clean lint test
