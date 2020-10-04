#! /bin/sh

# color
RESTORE='\033[0m'
GREEN='\033[00;32m'

currentDir=$(pwd)
workspace=$1
author=$2
atLeastOneCommit=false

# exit if there's no workspace to check
if [ -z "$workspace" ]; then
    echo "Exit ! You need to specify a working directory"
    exit 1
fi

# exit if there's no author
if [ -z "$author" ]; then
    echo "Exit ! You need to specify an author"
    exit 1
fi

# go into workspace
cd ${workspace}

# iterate over directory in workspace
for dir in */
do
    dir=${dir%*/}

    #go into current dir of iteration
    cd ${dir}

    # if is git repo
    if [ -d .git ]; then
        #save yeasterday commits
        commits=$(git log --since '1 day ago' --oneline --author ${author})

        # if there is some commits
        if [ -n "$commits" ]; then
            # display them
            echo "Yesterday's commits for project : ${GREEN}${dir##*/}${RESTORE} \n"
            echo "${commits}"

            echo "\n\n"

            # there was at least one commit
            atLeastOneCommit=true
        fi;
    fi;
    # go back
    cd ..
done

if [ $atLeastOneCommit = false ] ; then
    echo "No commits yesterday ? :p"
fi

# go back where we where
cd ${currentDir}
