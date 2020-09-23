import sys
from fabric import Connection
from invoke import Responder

folders = [
    "~/.ssh", 
    "~/.ngrok2"
]
pkgs = ["openssl", "curl"]

sudo_password = Responder(
    pattern=r"\[sudo\] password:",
    response="romainprignon\n",
)

def create_folder(c):
    for folder in folders:
        print(f"creating folder {folder}")
        c.run(f"mkdir -p {folder}")


def apt_update(c):
    print(f"updating apt...")
    c.sudo('apt update', pty=True, watchers=[sudo_password])
    print(f"apt updated")


def apt_install(c):
    for pkg in pkgs:
        print(f"installing pkg {pkg}")
        c.sudo(f"apt install -y {pkg}", pty=True, watchers=[sudo_password])


def main(c):
    create_folder(c)
    apt_update(c)
    apt_install(c)
    print('done')

[_, host, port, user, password] = sys.argv
c = Connection(host=host, port=port, user=user, connect_kwargs={"password": password})

main(c)