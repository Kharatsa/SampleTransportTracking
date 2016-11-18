#!/bin/bash -ex

SOURCE_PATH=/home/ubuntu/stt
APP_LOG_PATH=/var/log/stt
ENV_VARS_FILE=/etc/stt_creds
NGINX_CONF_PATH=/etc/nginx/conf.d
NGINX_WEBROOT_PATH=/usr/share/nginx/html
LETS_ENCRYPT_PATH=/var/www/letsencrypt

cat /etc/stt_creds >> $HOME/.bashrc

# Create the required log directories and set permissions
sudo mkdir -p $APP_LOG_PATH
sudo chmod 640 $ENV_VARS_FILE
sudo chown -R ubuntu:docker $ENV_VARS_FILE $APP_LOG_PATH
sudo echo "$APP_LOG_PATH/*.log {
	weekly
	rotate 10
	compress
	delaycompress
	missingok
	notifempty
}" > /etc/logrotate.d/stt

pushd $SOURCE_PATH

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
sudo envsubst < ./deploy/nginx/temp.template > $NGINX_CONF_PATH/temp.conf
sudo chown -R www-data /etc/nginx
sudo nginx -t && sudo nginx -s reload

# Setup LetsEncrypt
sudo mkdir -p $LETS_ENCRPYT_PATH /etc/letsencrypt/configs /var/lib/letsencrypt /var/log/letsencrypt
sudo envsubst < ./deploy/certbot/certbot_conf.template > /etc/letsencrypt/configs/$TL_HOSTNAME.conf
sudo chown -R ubuntu:www-data $LETS_ENCRPYT_PATH /etc/letsencrypt /var/lib/letsencrypt /var/log/letsencrypt


# Retrieve LetsEncrypt certificates
letsencrypt certonly --config /etc/letsencrypt/configs/$TL_HOSTNAME.conf

# Setup LetsEncrypt certificate renewal

# Load final NGINX config
sudo rm $NGINX_CONF_PATH/temp.conf
sudo envsubst '$TL_HOSTNAME' < ./deploy/nginx/letsencrypt.template > $NGINX_CONF_PATH/letsencrypt.conf
sudo envsubst '$TL_HOSTNAME $LETS_ENCRYPT_PATH' < ./deploy/nginx/stt.template > $NGINX_CONF_PATH/stt.conf
sudo envsubst '$TL_HOSTNAME $LETS_ENCRYPT_PATH' < ./deploy/nginx/odk.template > $NGINX_CONF_PATH/odk.conf
sudo nginx -t && sudo nginx -s reload

popd
