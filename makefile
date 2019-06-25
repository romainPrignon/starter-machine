.SILENT: install lint build
.PHONY: install lint build

install: # install dependencies
	npm install --engine-strict
	unshell scripts/install.js

lint: # lint build file ex: make lint var=ubuntu.var.json machine=ubuntu.json
	packer validate -var-file=${var} ${machine}

build-packer: # build image ex: make build-packer machine=ubuntu
	packer build -var-file=machines/${machine}/packer/${machine}.var.json machines/${machine}/packer/${machine}.json

import-docker:
	sudo mkdir -p /mnt/distro/${machine}
	tar -C /mnt/distro/${machine}  -c . | docker import - alpine-distro
	sudo umount /mnt/distro

build-docker: # build using docker make build-docker
	sudo mkdir -p /mnt/distro/${machine}
	# sudo mount -o loop /home/romainprignon/infra/alpine-standard-3.9.4-x86_64.iso /mnt/distro/${machine}
	docker build -t ${machine}-distro machines/${machine}/docker
	sudo umount /mnt/distro

test: # test output image
	# test the output image
