# include env vars
if [ -f "$HOME/.exports" ]; then
    source "$HOME/.exports"
fi

if [ -f "$HOME/.zshrc" ]; then
    source "$HOME/.zshrc"
fi
