src-files = $(wildcard src/*)
lib-files = $(patsubst src/%, lib/%, $(src-files))

all: $(lib-files)

lib/%: src/% lib
	node_modules/.bin/babel $< -o $@

lib:
	mkdir -p lib
