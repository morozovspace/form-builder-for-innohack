#!/bin/bash
red=`tput setaf 1`
reset=`tput sgr0`
## declare an array of required dependencies
declare -a arr=("docker" "docker-compose")

## now loop through the above array
for i in "${arr[@]}"
do
   # Check if dependency installed
    if [ -x "$(command -v $i)" ]; then
        # command
        echo "$i is installed"
    else
        exit $?
        echo "${red} $i is required${reset}"
    fi
   # or do whatever with individual element of the array
done
