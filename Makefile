REPORTER ?= dot
TESTS = $(shell find ./test/* -name "*.test.js")

# test commands

clean:
	rm -f test/generate/*.pdf

test:
	@make clean && \
	./node_modules/mocha/bin/mocha \
	--timeout 3000 \
	--colors \
	--reporter $(REPORTER) \
	$(TESTS)

.PHONY: test
