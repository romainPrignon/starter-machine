.SILENT: build
.PHONY: build

build: # build image ex: make build container=desktop-ubuntu-focal user=foo password=bar
	docker build \
		-t romainprignon/desktop/ubuntu/focal:template \
		--build-arg user=${user} \
		--build-arg password=${password} \
		./${container}
