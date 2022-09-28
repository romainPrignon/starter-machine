# starter-machine

> Starter to easily create machines

# Dependencies
- git
- make

# Setup
First, you need to install dependencies
```sh
make install
```


# Usage

There is 3 mode of building: local, container, vm


## build local
- Run ansible playbook locally
$ make build-local machine=desktop-ubuntu-focal


## build container
- first build the template image
$ cd templates/containers
$ make build dist=ubuntu version=focal user=foo password=bar tag=latest

- then, tag it as template
$ docker tag romainprignon/ubuntu/jammy:latest romainprignon/desktop/ubuntu/jammy:template

- then, copy template var files near machine.json file
desktop-ubuntu-jammy.var.template.json => desktop-ubuntu-jammy.var.json

- then, build using ansible and docker builder
$ cd ../..
$ make build machine=desktop-ubuntu-focal builder=docker


## build machine
- first add the template vm image
$ cd templates/vms/vm_name
$ mv my_vm.ovf vm_name.ovf
$ mv my_vm.vmdk vm_name.vmdk

- then, build using ansible and packer builder
$ cd ../..
$ make build machine=desktop-ubuntu-focal builder=packer


## release

### metal
- create a raw image that can be used with `dd`
```
$ make release-metal
```

# FIX
- swap
- multipass


# QA
source `.profile` first in docker

# templates with vm
- manually install ubuntu 20.04
- need to install ssh server either while installing the system or via cmdline on first boot
- you can check in virtualbox using port translation 22 to 2222 on host and do
- upgrade accordingly (22.04, 24.04,...)
- export (change file name to ovf, only nat, no additional), you'll endup with a ovf and a vmdk file
- put it in: 
    - `templates/vms/ubuntu-${version}/ubuntu-${version}.ovf`
    - `templates/vms/ubuntu-${version}/ubuntu-${version}-disk001.vmdk`
```
ssh -vvv -p 2222 romainprignon@127.0.0.1
```
