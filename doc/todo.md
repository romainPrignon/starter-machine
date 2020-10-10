# FIX
- xdebug ansible

# TODO
✔ faire une nomenclature: 
    image ou img: image de sortie
    template: vm de base
    builders: outils de build
    artefacts: artefact de sortie
    scripts 
        tasks
✔ choose ubuntu vs alpine  => ubuntu
✔ find tool for provisioning (unshell,ansible, fabric,...) => ansible
✔ refaire un template avec ubuntu 2004
    ✔ renommer machine en builders
    ✔ renommer release en artefacts
✔ revoir l'arbo pour faire en fonction du template et un dossier commun
✔ faire une commande pour tester le script dans du docker car plus rapide que de passer par packer
✔ mettre un .editorconfig
- script dépendant de l'utilisateur (runtime ?, provision ?)
    - keyboard /etc/keyboard
    - ntp configure timedatectl
    - locale
    - hostname
- ecrire les scripts et les tester (ansible) 
    ✔ node
    ✔ remove executable 
    ✔ exports correct path apps app 
    ✔ use bin
    ✔ configure gui... 
    - verifier que tout ansible fonctionne 
        ✔ fzf 
        ✔ python alternative
        ✔ pip alternative
    ✔ installer une vm avec les scripts courant (doit marcher nickel !) apres on transpose a ansible
    ✔ clean functions.sh (rename things...)
    ✔ faire un tour de /usr
    - tout le reste... 
        - devdoc (dotfiles OK, ansible OK) 
        - setup tlp (dotfiles OK, ansible OK) 
        - ansible (dotfiles OK, ansible OK) 
        - jetbrain toolbox (dotfiles OK, ansible OK) 
        - packer (dotfiles OK, ansible OK) 
        - multipass (dotfiles OK, ansible OK) 
        - les pkg npm global (dotfiles OK, ansible OK) 
        - dns 1.1.1.1 pour certain connection (resolvconf) (dotfiles OK, ansible NOK) <--------
        - setup swap (/etc/fstab and /etc/sysctl.conf) (dotfiles OK, ansible NOK)
        - keyboard: remove caps (/usr/share/X11/xkb/symbols/pc) (dans le README)
        ✘ /etc/ssh/ssh_config (serveur)
        ✘ /etc/hostname (runtime ?)
        ✘ /etc/timezone (runtime ?)
        ✘ /etc/modprobe.d/blacklist.conf ??
        ✘ /etc/bluetooth/main.conf (ca na jamais marcher)
    - change user password ou alors ne pas le mettre dans git
    - couper sshd pour desktop, restriction a pas root pour server
    - regle de firewall
    - gestion des local, keyboard,.. au runtime
    - faire un readme ici aussi
✔ choisir comment couper les playbook (on coupe le main playbook par use case, et non pas 1 seul playbook et des roles, les roles c'est une unité logique)
    ✔ install, confure, update ? => partir pluto sur un seul playbook et ce sera immutable
✔ l'image template doit contenir python et faire un dockerfile python ? ubuntu-desktop container
- faire l'image du server et donc des roles commun
- faire en sorte que l'user romainprignon ou celui du server soit créer au moment du provisionning comme cela c'est générique pour de vrai
    - les credential ne doivent pas etre versionner
- pouvoir provisionner localement
- install packer as dependencies (make setup) ansibl galaxy,...
- add quality (packer lint, ansible lint,yaml lint, test image, diff iamge,...)
- do  release-metal command properly
- mettre un outil pour remplacer make ici aussi
- reprendre le json en hcl


