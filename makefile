.SILENT: install lint test build check manual-check metal
.PHONY: install lint test build check manual-check metal

builder?=packer

install: # boostrap dev environment ex: make install
	apt install ansible
	ansible-galaxy collection install community.general
	ansible-galaxy install geerlingguy.swap geerlingguy.php-versions geerlingguy.php geerlingguy.composer geerlingguy.php-xdebug

lint: # lint machine build file ex: make lint machine=desktop-ubuntu-focal [builder=docker]
	packer validate -var-file=./machines/${machine}/builders/${builder}/${machine}.var.json ./machines/${machine}/builders/${builder}/${machine}.machine.json
	ansible-playbook ./machines/${machine}/scripts/main.yml --syntax-check

test: # test script
	echo test the script

build: # build image ex: make build machine=desktop-ubuntu-focal [builder=docker]
	packer build -force -var-file=machines/${machine}/builders/${builder}/${machine}.var.json machines/${machine}/builders/${builder}/${machine}.machine.json

check:
	echo check the artefactg with tools

manual-check:
	docker run -it --rm romainprignon/desktop/ubuntu/focal:latest

metal: # release on metal ex: make metal machine=desktop-ubuntu-focal
	VBoxManage clonehd ./artefacts/vms/${machine}-disk001.vmdk ./artefacts/metal/${machine}.img --format RAW
	cp -p ./doc/metal/README.md ./artefacts/metal/README.md
	cp -p ./doc/metal/install.sh ./artefacts/metal/install.sh
