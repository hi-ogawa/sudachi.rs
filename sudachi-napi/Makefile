# auto generate phony targets
.PHONY: $(shell grep --no-filename -E '^([a-zA-Z_-]|/)+:' $(MAKEFILE_LIST) | sed 's/:.*//')

clean:
	rm -f index.js index.d.ts index.*.node

build:
	docker-compose -f ../docker-compose.yml build napi-rs
	docker-compose -f ../docker-compose.yml run -T --rm napi-rs cat index.js > index.js
	docker-compose -f ../docker-compose.yml run -T --rm napi-rs cat index.d.ts > index.d.ts
	docker-compose -f ../docker-compose.yml run -T --rm napi-rs cat index.linux-x64-gnu.node > index.linux-x64-gnu.node
