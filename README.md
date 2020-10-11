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
$ make build container=desktop-ubuntu-focal

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
$ make release-metal


# FIX
- swap
- multipass
