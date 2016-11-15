#!/bin/bash -ex

git pull
docker pull kharatsa/strack

rm docker-compose.yml
ln -s deploy/docker-compose-prod.yml docker-compose.yml

if [ $(docker images -q --filter "dangling=true") ]; then
  docker rmi $(docker images -q --filter "dangling=true")
fi

docker-compose build
docker-compose up --no-deps --force-recreate -d
