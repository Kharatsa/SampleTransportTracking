#!/usr/bin/env bash

if [ $(docker images -q --filter "dangling=true") ]; then
  docker rmi $(docker images -q --filter "dangling=true")
fi

docker pull kharatsa/strack
docker stop strack
docker rm strack
docker run -d \
  --name strack \
  --restart on-failure:10 \
  -v /var/lib/strack:/var/lib/strack \
  -v /var/log/strack:/var/log/strack \
  -p $STT_LISTEN_PORT:$STT_LISTEN_PORT \
  --log-driver=json-file --log-opt max-size=50m \
  -e "STT_LISTEN_PORT=$STT_LISTEN_PORT" \
  -e "STT_LISTEN_HOST=$STT_LISTEN_HOST" \
  -e "STT_PUBLIC_URL=$STT_PUBLIC_URL" \
  -e "ODK_PROTOCOL=$ODK_PROTOCOL" \
  -e "ODK_HOSTNAME=$ODK_HOSTNAME" \
  -e "ODK_USERNAME=$ODK_USERNAME" \
  -e "ODK_PASSWORD=$ODK_PASSWORD" \
  -e "ODK_PUBLISHER_TOKEN=$ODK_PUBLISHER_TOKEN" \
  kharatsa/strack@latest

docker logs -f strack