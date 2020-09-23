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


# TODO
✔ faire une nomenclature: 
    image ou img: image de sortie
    template: vm de base
    builders: outils de build
    artefacts: artefact de sortie
    scripts 
        tasks
✔ choose ubuntu vs alpine ✔ (ubuntu)
✔ find tool for provisioning (unshell,....)
✔ refaire un template avec ubuntu 2004 (user generic) et ssh qui marche !
    ✔ renommer machine en builders
    ✔ renommer release en artefacts
✔ revoir l'arbo pour faire en fonction du template et un dossier commun
✔ faire une commande pour tester le script dans du docker car plus rapide que de passer par packer
✔ mettre un .editorconfig
- scrpt de base (soit cest manuel, soit cest dans docker) ATTENTION CA PEUT AUSSI ETRE DU RUNTIME <--------
    - keyboard /etc/keyboard
    - ntp configure timedatectl
    - locale
    - hostname
- ecrire les scripts et les tester (ansible) 
    ✔ node
    - git <--------
    - change user password ou alors ne pas le mettre dans git
    - swap
    - couper sshd pour desktop, restriction a pas root pour server
    - regle de firewall
    - tout le reste...
        /etc/ssh/ssh_config
        /etc/hostname 
        /etc/hosts
        /etc/apt/sources.list
        /etc/apt/sources.list.d/
        /etc/fstab 
        /etc/timezone 
        /etc/resolv.conf
        /etc/localtime
        /etc/sysctl.conf
        /etc/modprobe.d/blacklist.conf
        /etc/bluetooth/main.conf
        /etc/rc.local
        faire un tour de /usr
        les pkg npm global
✔ choisir comment couper les playbook (on coupe le main playbook par use case, et non pas 1 seul playbook et des roles, les roles c'est une unité logique)
    ✔ install, confure, update ? => partir pluto sur un seul playbook et ce sera immutable
✔ l'image template doit contenir python et faire un dockerfile python ? ubuntu-desktop container
- faire l'image du server et donc des roles commun
- faire en sorte que l'user romainprignon ou celui du server soit créer au moment du provisionning comme cela c'est générique pour de vrai
    - les credential ne doivent pas etre versionner
- install packer as dependencies (make setup) ansibl galaxy,...
- add quality (packer lint, ansible lint,yaml lint, test image, diff iamge,...)
- do  release-metal command properly
- mettre un outil pour remplacer make ici aussi
- reprendre le json en hcl

# Principe
- packer a une seule ligne dans provioning, il n'execute pas plusieur fab task
- faire un script pour installer openssh-server (les prerequis pour un template fonctionnel) c'est pour fabric ?



{
            "type": "shell-local",
            "command": "fab -r scripts/desktop/fabric --hosts {{user `ssh_username`}}@{{build `Host`}}:{{build `Port`}} --prompt-for-login-password --prompt-for-sudo-password do"
        },
        {
            "type": "shell-local",
            "command": "python3 scripts/desktop/fabric/desktop.py {{build `Host`}} {{build `Port`}} {{user `ssh_username`}} {{user `ssh_password`}}"
        },

LOGGING
=======
normal: tail <file>
stream: tail -f <file>

system
======
/var/log/syslog

system docker
=============
journalctl -u docker
/var/log/docker.log

container
=========
docker logs xx

MONITORING
==========

system
======
cpu:        uptime
process:    ps -aux
memory:     free -h
disk:       df -h
network:    netstat

live stream
-----------
top (cpu, mem, uptime, process)
iotop (disk)
netstat -t -u -c (network)

system docker (normal de pas avoir plus)
=============
docker system info (info)

docker network ls(metrics)
docker volume ls
docker system df

live stram
---------
docker events

containers
=========
docker ps

live stream
-----------
docker stats


1 stack = 1 server = 1 machine = 1 node = N services (replicas=1)
1 organization = N stack (1 stack = 1 projet)

- local + remote provisioning (ansible or node)
- tipycode hotel
- VBoxManage controlvm "VM name" natpf1 "tcp-port8000,tcp,127.0.0.1,8000,,8000"
- gcloud compute addresses create ${DOCKER_MACHINE_NAME}--production--mngr-1 --addresses ${shell docker-machine ip ${DOCKER_MACHINE_NAME}--production--mngr-1}
- linux dash + log

- internal stack (git(gitlab), rgstr(hub), ci(gocd), viz)

on veut:
* un outils pour créer l'infra sur lequel repose une stack
* un dashboard des N stacks (stacks.map(stack.displayDashboard))
* un registre partagé (idéalement compose les autres registres)
* un CI partagé (idéalement compose les autres CI)

registre    dockerhub   registry(hub privé)
CI          circleci    stridercd
dashboard   datadog     portainer sysdig
