from fabric import task

folders = [
    "~/.ssh", 
    "~/.ngrok2"
]
pkgs = ["openssl", "curl"]

@task
def create_folder(c, folders=[]):
    for folder in folders:
        c.run(f"mkdir -p {folder}")

@task
def apt_update(c):
    c.sudo('apt update', pty=True)

@task
def apt_install(c):
    for pkg in pkgs:
        c.sudo(f"apt install -y {pkg}", pty=True)

@task
def do(c):
    create_folder(c, folders)
    apt_update(c)
    apt_install(c)
    print('done')