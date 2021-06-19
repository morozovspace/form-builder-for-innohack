#!/bin/bash
# Проверить существует ли контейнер
docker build  \
  --tag firebase:auth \
  --target firebase \
  -f ./services/firebase/Dockerfile \
  ./services/firebase;

docker run \
  -it \
  --detach-keys="ctrl-d" \
  --sig-proxy=true \
  --name firebase-tools \
  firebase:auth \
  sh -c \
    "firebase login:ci --interactive --no-localhost";
docker ps --last -1 -q
docker container stop firebase-tools
docker container rm firebase-tools
docker image rm firebase:auth