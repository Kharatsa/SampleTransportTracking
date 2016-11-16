#!/bin/sh
set -e

envsubst '$TL_HOSTNAME' < /etc/nginx/conf.d/letsencrypt.template > /etc/nginx/conf.d/letsencrypt.conf
envsubst '$TL_HOSTNAME' < /etc/nginx/conf.d/stt.template > /etc/nginx/conf.d/stt.conf
envsubst '$TL_HOSTNAME' < /etc/nginx/conf.d/odk.template > /etc/nginx/conf.d/odk.conf

if ! [ -e /etc/letsencrypt/live/$TL_HOSTNAME/ ]; then
  echo "Creating temporary self-signed certificate"

  mkdir -p /etc/letsencrypt/live/$TL_HOSTNAME/

  openssl req \
    -new \
    -newkey rsa:4096 \
    -days 365 \
    -nodes \
    -x509 \
    -subj "/C=US/ST=./L=./O=./CN=localhost" \
    -keyout /etc/letsencrypt/live/$TL_HOSTNAME/privkey.pem \
    -out /etc/letsencrypt/live/$TL_HOSTNAME/fullchain.pem

fi

exec nginx -g 'daemon off;'
