#!/bin/sh

set -e

touch /etc/letsencrypt/live/$TL_HOSTNAME/fullchain.pem
touch /etc/letsencrypt/live/$TL_HOSTNAME/privkey.pem

envsubst < /root/certbot_conf.template > /root/certbot_conf.ini
