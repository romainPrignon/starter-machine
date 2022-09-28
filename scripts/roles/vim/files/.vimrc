syntax on

set showmode                    " show the current mode
set background=dark             " dark theme
set backspace=indent,eol,start  " make that backspace key work the way it should
set laststatus=2                " make the last line where the status is two lines deep so you can see status always
set ruler                       " show the cursor position all the time
set wrap                        " Wrap lines
set showmatch                   " automatically show matching brackets

set encoding=utf8
set ffs=unix
set tw=120
set wildmenu
set autoread
set lazyredraw
set incsearch
set ignorecase
set smartcase

:map <C-a> GVgg
:map <C-N> :enew
:map <C-x> dd
:map <C-z> u
:map <C-T> :tabnew <Enter>
:map <C-i> >>
:map <C-W> :close <Enter>
:map <C-f> /

set smartindent
set tabstop=4
set shiftwidth=4
set expandtab
set number
set noswapfile

set statusline=%<%F%h%m%r\ [%{&ff}]\ (%{strftime(\"%H:%M\ %d/%m/%Y\",getftime(expand(\"%:p\")))})%=%l,%c%V\ %P
