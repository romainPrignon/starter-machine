FROM ubuntu:jammy

ENV DEBIAN_FRONTEND noninteractive

ARG user
ARG password

RUN apt update && apt install -y \
    openssl \
    python3-minimal \
    sudo

RUN useradd --create-home --password $(echo "$password" | openssl passwd -1 -stdin) --shell /bin/bash $user
RUN usermod -aG sudo $user

USER $user
WORKDIR /home/$user
