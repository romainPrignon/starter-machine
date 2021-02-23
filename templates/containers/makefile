.SILENT: build
.PHONY: build

tag ?= latest

build: # build image ex: make build dist=ubuntu version=focal user=foo password=bar [tag=latest]
	docker build \
		-t ${user}/${dist}/${version}:${tag} \
		--build-arg user=${user} \
		--build-arg password=${password} \
		./${dist}/${version}
