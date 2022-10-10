# auto generate phony targets
.PHONY: $(shell grep --no-filename -E '^([a-zA-Z_-]|/)+:' $(MAKEFILE_LIST) | sed 's/:.*//')

clean:
	rm -f index.js index.d.ts index.*.node

build:
	docker-compose build napi-rs
	docker-compose run -T --rm napi-rs cat index.js > index.js
	docker-compose run -T --rm napi-rs cat index.d.ts > index.d.ts
	docker-compose run -T --rm napi-rs cat index.linux-x64-gnu.node > index.linux-x64-gnu.node
