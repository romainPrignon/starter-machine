# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# include aliases
if [ -f "$HOME/.aliases" ]; then
    . "$HOME/.aliases"
fi

# include functions
if [ -f "$HOME/.functions" ]; then
    . "$HOME/.functions"
fi

# include partner
for f in $HOME/.rc/*.rc; do source $f; done

#######################################

# Avoid duplicate entries
HISTCONTROL="erasedups:ignoreboth:ignorespace"

# Useful timestamp format
HISTTIMEFORMAT='%F %T '

# Don't record some commands
export HISTIGNORE="&:[ ]*:exit:ls:bg:fg:history:clear"

export PROMPT_COMMAND='history -a'

#######################################

PROMPT_DIRTRIM=2

# include prompt
GIT_PROMPT_THEME=Single_line_Ubuntu_Romain
GIT_PROMPT_FETCH_REMOTE_STATUS=0
GIT_PROMPT_IGNORE_STASH=1
source ~/.bash-git-prompt/gitprompt.sh

echo -e "\e]12;orange\a" # prompt cursor color

#######################################

# append to the history file, don't overwrite it
shopt -s histappend

# Save multi-line commands as one command
shopt -s cmdhist

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# Case-insensitive globbing (used in pathname expansion)
shopt -s nocaseglob

# Autocorrect typos in path names when using `cd`
shopt -s cdspell

# Correct spelling errors during tab-completion
shopt -s dirspell

# Prepend cd to directory names automatically
shopt -s autocd

# This defines where cd looks for targets
# Add the directories you want to have fast access to, separated by colon
# Ex: CDPATH=".:~:~/projects" will look for targets in the current working directory, in home and in the ~/projects folder
CDPATH=".:~/workspace"

# Turn on recursive globbing (enables ** to recurse all directories)
shopt -s globstar 2> /dev/null

# Prevent file overwrite on stdout redirection
set -o noclobber

# ctrl+left
bind '"\e[1;5D": backward-word'
# ctrl+right
bind '"\e[1;5C": forward-word'
# ctrl+k
bind "\C-k:kill-whole-line"

# always on top
bind '"\C-m": "\C-l\C-j"'

# 2 => `
if [[ $DISPLAY ]]; then
  xmodmap -e "keycode 49 = grave"
fi

# caps_lock => <>
if [[ $DISPLAY ]]; then
  xmodmap -e "keycode 66 = less greater"
fi

#######################################

# make less more friendly for non-text input files, see lesspipe(1)
[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"

# enable programmable completion features (you don't need to enable
# this, if it's already enabled in /etc/bash.bashrc and /etc/profile
# sources /etc/bash.bashrc).
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi

#######################################

# starting command
if [ -z "$SSH_AUTH_SOCK" ] ; then
  eval `ssh-agent -s` > /dev/null
  ssh-add
fi

# fzf
[ -f ~/.fzf.bash ] && source ~/.fzf.bash

# pyenv
if [ -x "$(command -v pyenv)" ]; then
  eval "$(pyenv init -)"
  eval "$(pyenv virtualenv-init -)"
fi

# php
if [ -x "$(command -v symfony-autocomplete)" ]; then
  eval "$(symfony-autocomplete)"
fi
