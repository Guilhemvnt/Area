#!/bin/bash

ARCH=$(uname -s)

# Vérifie l'OS
if [[ $ARCH == "Darwin" ]]; then
    OS="mac"
    brew install nvm
    nvm ls-remote
    nvm install 18
    nvm use 18
else
    OS="linux"
    docker pull ghcr.io/cirruslabs/flutter:3.13.9
fi

# Met à jour la variable OS in the .env file using grep and a temporary file
grep -q '^OS=' .env && sed -i 's/^OS=.*/OS="'$OS'"/' .env || echo 'OS="'$OS'"' >> .env

echo "La variable OS a été mise à jour avec la valeur \"$ARCH\" dans le fichier .env"
