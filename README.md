# starter-machine

> Starter to easily create server machines

# Setup
First, you need to install dependencies
```sh
make install
```

# Usage
Here is a detailled list of available commands

## release: metal
```sh
make release-metal
```
will do: VBoxManage clonehd your-virtualbox-disk.vdi disk.img --format RAW
will put it into releases folder with a readme containing instruction

# FIX
- swap
- multipass
