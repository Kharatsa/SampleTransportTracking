#!/bin/bash -ex

export SOURCE_PATH=/home/ubuntu/stt
export APP_LOG_PATH=/var/log/stt
export ENV_VARS_FILE=/etc/stt_creds
export NGINX_CONF_PATH=/etc/nginx/conf.d
export LETS_ENCRYPT_PATH=/var/www/letsencrypt
export STT_GROUP_ID=8888

# Load environment variables in bashrc
cat /etc/stt_creds | \
  while read line; do
    echo "export $line"
  done >> /home/ubuntu/.bashrc

# Create the required log directories and set permissions
mkdir -p $APP_LOG_PATH
chgrp -R stt $ENV_VARS_FILE $APP_LOG_PATH
chmod g+rw $ENV_VARS_FILE $APP_LOG_PATH
echo "$APP_LOG_PATH/*.log {
	weekly
	rotate 10
	compress
	delaycompress
	missingok
	notifempty
}" > /etc/logrotate.d/stt

# Setup the static files path
mkdir -p /var/www
rm -rf /var/www/*
chgrp -R stt /var/www
chmod -R g+rw /var/www

# Point Docker Compose at the production configuration
rm docker-compose.yml
ln -s deploy/docker-compose-prod.yml docker-compose.yml

# Pull the metadata repository
git submodule update --init

# Export application and database credentials
export $(cat /etc/stt_creds | xargs)

# Start the Docker services
docker-compose up -d

# Bootstrap the application database
mysql -h $STT_DB_HOST -u $STT_DB_USER --password=$MYSQL_PASSWORD < ./deploy/create_db.sql
docker exec -it app_stt ./app/maintenance/data.js sync
docker exec -it app_stt ./app/maintenance/metadata.js reloadcsv
docker exec -it app_stt ./app/maintenance/users.js add -a $STT_USER $STT_PASSWORD

# Setup NGINX
envsubst < ./deploy/nginx/temp.template > $NGINX_CONF_PATH/temp.conf
nginx -t && nginx -s reload

# Setup LetsEncrypt
mkdir -p $LETS_ENCRYPT_PATH /etc/letsencrypt/configs /var/lib/letsencrypt /var/log/letsencrypt
chgrp -R letsencrypt $LETS_ENCRYPT_PATH /etc/letsencrypt/configs /var/lib/letsencrypt /var/log/letsencrypt
chmod -R g+rw $LETS_ENCRYPT_PATH /etc/letsencrypt /var/lib/letsencrypt /var/log/letsencrypt
envsubst < ./deploy/certbot/certbot_conf.template > /etc/letsencrypt/configs/$TL_HOSTNAME.conf

# Retrieve LetsEncrypt certificates
chmod +x renew_certs.sh
./renew_certs.sh
letsencrypt certonly --config /etc/letsencrypt/configs/$TL_HOSTNAME.conf

# Setup LetsEncrypt certificate renewal
# TODO(sean)

# Load final NGINX config
rm $NGINX_CONF_PATH/temp.conf
envsubst '$TL_HOSTNAME' < ./deploy/nginx/letsencrypt.template > $NGINX_CONF_PATH/letsencrypt.conf
envsubst '$TL_HOSTNAME $LETS_ENCRYPT_PATH' < ./deploy/nginx/stt.template > $NGINX_CONF_PATH/stt.conf
envsubst '$TL_HOSTNAME $LETS_ENCRYPT_PATH' < ./deploy/nginx/odk.template > $NGINX_CONF_PATH/odk.conf
nginx -t && nginx -s reload
