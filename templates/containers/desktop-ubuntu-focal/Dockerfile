FROM ubuntu:focal

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install -y sudo ubuntu-desktop

RUN useradd --create-home --password $(echo "romainprignon" | openssl passwd -1 -stdin) --shell /bin/bash romainprignon
RUN usermod -aG sudo romainprignon

USER romainprignon
WORKDIR /home/romainprignon
