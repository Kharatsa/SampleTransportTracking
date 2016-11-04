#!/usr/bin/env bash -ex

docker pull kharatsa/strack:latest
git pull

rm docker-compose.yml
ln -s docker-compose-prod.yml docker-compose.yml

if [ $(docker images -q --filter "dangling=true") ]; then
  docker rmi $(docker images -q --filter "dangling=true")
fi

docker-compose build
docker-compose up --no-deps --force-recreate -d

