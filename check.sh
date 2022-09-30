#! /bin/sh

# test sorted by ansible role order

source ~/.profile

test -f ~/img/screensaver.jpg && echo "~/img/screensaver.jpg exists"
test -f ~/img/wallpaper.jpg && echo "~/img/wallpaper.jpg exists"
test -d ~/bin && echo "~/bin exists"
test -d ~/app && echo "~/app exists"

echo "ansible"
ansible --version

echo "deno"
deno --version

echo "docker"
docker --version

echo "docker-compose"
docker-compose --version

echo "docker compose"
docker compose version

echo "gh"
gh --version

echo "git"
git --version

echo "locales"
locale -a

echo "micro"
micro --version

echo "node"
node --version

echo "ts-node"
ts-node --version

echo "packer"
packer --version

echo "php"
php --version # check x-debug present

echo "python"
python --version

echo "poetry"
poetry --version

echo "with QA"
echo "check alias standup, tf"
echo "check function supertouch"
echo "check prompt"
echo "check fzf"
echo "check node and npm completion"
echo "check terraform completion"
echo "check poetry completion"
echo "check zsh"
