#!/bin/bash -ex

export SOURCE_PATH=/home/ubuntu/stt
export APP_LOG_PATH=/var/log/stt
export ENV_VARS_FILE=/etc/stt_creds
export NGINX_CONF_PATH=/etc/nginx/conf.d
export LETS_ENCRYPT_PATH=/var/www/letsencrypt

umask 002

# Load environment variables in bashrc
cat /etc/stt_creds | \
  while read line; do
    echo "export $line"
  done >> /home/ubuntu/.bashrc

# Create the required log directories and set permissions
mkdir -p $APP_LOG_PATH
chgrp -R stt $ENV_VARS_FILE $APP_LOG_PATH
chmod -R 2660 $ENV_VARS_FILE $APP_LOG_PATH
echo "$APP_LOG_PATH/*.log {
	weekly
	rotate 10
	compress
	delaycompress
	missingok
	notifempty
}" > /etc/logrotate.d/stt

# Setup the static files path
rm -rf /var/www/*
mkdir -p /var/www/stt
chgrp -R stt /var/www
chmod -R 2660 /var/www

# Export application and database credentials
export $(cat /etc/stt_creds | xargs)

# Setup NGINX
envsubst < ./deploy/nginx/temp.template > $NGINX_CONF_PATH/temp.conf
nginx -t && nginx -s reload

# Setup LetsEncrypt
mkdir -p $LETS_ENCRYPT_PATH /etc/letsencrypt/configs /var/lib/letsencrypt /var/log/letsencrypt
chgrp -R letsencrypt $LETS_ENCRYPT_PATH /etc/letsencrypt /var/lib/letsencrypt /var/log/letsencrypt
chmod -R 2770 $LETS_ENCRYPT_PATH /etc/letsencrypt /var/lib/letsencrypt /var/log/letsencrypt
envsubst < ./deploy/certbot/certbot_conf.template > /etc/letsencrypt/configs/$TL_HOSTNAME.conf

# Retrieve LetsEncrypt certificates
chmod +x renew_certs.sh
./renew_certs.sh
echo "/var/log/letsencrypt/renew.log {
	weekly
	rotate 10
	compress
	delaycompress
	missingok
	notifempty
}" > /etc/logrotate.d/lerenew

# Load final NGINX config
rm $NGINX_CONF_PATH/temp.conf
envsubst '$TL_HOSTNAME' < ./deploy/nginx/letsencrypt.template > $NGINX_CONF_PATH/letsencrypt.conf
envsubst '$TL_HOSTNAME $LETS_ENCRYPT_PATH' < ./deploy/nginx/stt.template > $NGINX_CONF_PATH/stt.conf
envsubst '$TL_HOSTNAME $LETS_ENCRYPT_PATH' < ./deploy/nginx/odk.template > $NGINX_CONF_PATH/odk.conf
cp ./deploy/nginx/proxy.conf $NGINX_CONF_PATH
nginx -t && nginx -s reload


# Create the STT database
mysql -h $STT_DB_HOST -u $STT_DB_USER --password=$MYSQL_PASSWORD < ./deploy/create_db.sql

# Pull the metadata repository
git submodule update --init

# Start the Docker services
rm docker-compose.yml
ln -s deploy/docker-compose-prod.yml docker-compose.yml
chown -R ubuntu:ubuntu ./
docker-compose up -d

# Bootstrap the application data
docker exec -it app_stt ./app/maintenance/data.js sync
docker exec -it app_stt ./app/maintenance/metadata.js reloadcsv
docker exec -it app_stt ./app/maintenance/users.js add -a $STT_USER $STT_PASSWORD
