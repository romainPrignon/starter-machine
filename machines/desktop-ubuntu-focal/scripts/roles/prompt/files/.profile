# include env vars
if [ -f "$HOME/.exports" ]; then
    . "$HOME/.exports"
fi

# if running bash
if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
    . "$HOME/.bashrc"
    fi
fi

# enable google-drive
# if [ -x "$(command -v google-drive-ocamlfuse)" ]; then
#     google-drive-ocamlfuse -label peaks /home/$USER/drive-peaks
# fi
