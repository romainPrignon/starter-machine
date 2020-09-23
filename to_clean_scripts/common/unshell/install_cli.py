def install_cli():
    yield f"snap install micro --classic"
    yield f"apt update"
    yield f"""
        apt install -y \
            curl \
            git \
            shellcheck \
            ssh \
            tree \
            vim \
            wget
    """
