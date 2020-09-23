import common.unshell.install_cli

def install_cli():
    yield from common.unshell.install_cli()
    yield f"apt update"
    yield f"""
        apt install -y \
            wmctrl
    """
