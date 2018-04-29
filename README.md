TODO
====

- remove framework.js, Dockerfile, provision.js, test.js 
- clean makefile
- use pontem for machine provisioning

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
