#!/usr/bin/env bash

docker pull kharatsa/strack:latest
git pull

if [ $(docker images -q --filter "dangling=true") ]; then
  docker rmi $(docker images -q --filter "dangling=true")
fi

docker-compose build stt1
docker-compose up --no-deps -d stt1

sleep 10

docker-compose build stt2
docker-compose up --no-deps -d stt2

