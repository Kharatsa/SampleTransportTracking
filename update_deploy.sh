#!/bin/bash -ex

git pull
docker pull kharatsa/strack

rm docker-compose.yml
ln -s deploy/docker-compose-prod.yml docker-compose.yml

docker-compose build
docker-compose up --no-deps --force-recreate -d

if [ $(docker images -q --filter "dangling=true") ]; then
  docker rmi $(docker images -q --filter "dangling=true")
fi
