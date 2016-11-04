#!/usr/bin/env bash -ex

docker pull kharatsa/strack:latest
git pull

if [ $(docker images -q --filter "dangling=true") ]; then
  docker rmi $(docker images -q --filter "dangling=true")
fi

docker-compose build
docker-compose up --no-deps --force-recreate -d

